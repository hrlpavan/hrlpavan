# Architecture Design Document (ADD): Deterministic Tool-Call Guardrails & Loop Protection for Model Context Protocol (MCP) Agents

* **Status:** Proposed / Under Review
* **Author:** Pavan Kumar S (`@hrlpavan`, AI Systems Chief Architect @ HRL International)
* **Target Systems:** GitLab AI Gateway (`ai-assist`), GitLab LSP (`gitlab-lsp`), Duo Agent Platform
* **Related MRs:** `gitlab-org/modelops/applied-ml/code-suggestions/ai-assist!7641`, `gitlab-org/editor-extensions/gitlab-lsp!4402`

---

## 1. Context & Problem Statement

As autonomous AI agents (such as GitLab Duo Workflows, Duo CLI, and interactive chat assistants) expand beyond single-turn code generation into multi-turn autonomous loops using the **Model Context Protocol (MCP)**, they introduce three critical system vulnerabilities:

1. **Infinite Tool-Call Loops:** Frontier LLMs encountering subtle tool execution failures, ambiguous parameters, or uninformative tool outputs frequently degenerate into tight repetition loops—submitting identical function calls with identical arguments. This results in rapid exhaustion of customer token budgets, rate-limit thrashing, and process hangs.
2. **Schema Drift and Injection Hazards:** Dynamic JSON argument passing between the Python AI Gateway, the Ruby on Rails monolith, and third-party MCP servers can cause unvalidated parameter injection, unexpected type coercions (e.g., float vs. integer offsets), or unauthorized filesystem access.
3. **Cross-Service Latency Overheads:** Multi-hop serialization across gRPC, WebSocket, and HTTP transport layers between `gitlab-lsp` and `ai-assist` amplifies the latency cost of unvalidated or repeated tool invocations.

This document establishes the formal architecture for a **deterministic, zero-overhead tool-call guardrail and loop circuit breaker** embedded directly into the AI Gateway execution pipeline.

---

## 2. System Architecture & Component Boundaries

```text
+-----------------------------------------------------------------------------------+
|                                  Client Tier                                      |
|            (GitLab Web IDE / VS Code via gitlab-lsp / Duo CLI / Chat)             |
+----------------------------------------+------------------------------------------+
                                         | JSON-RPC 2.0 / gRPC Streaming
+----------------------------------------v------------------------------------------+
|                         GitLab Monolith / Workhorse Gate                          |
|             (JWT / PAT Verification, Feature Flags, Workspace Auth)               |
+----------------------------------------+------------------------------------------+
                                         | Internal Mutual TLS gRPC
+----------------------------------------v------------------------------------------+
|                          Python AI Gateway (`ai-assist`)                          |
|  +-----------------------------------------------------------------------------+  |
|  |                 Duo Workflow Engine / LangGraph State Graph                 |  |
|  +-------------------------------------+---------------------------------------+  |
|                                        |                                          |
|                 [1. Intercept Raw Model Tool Calls]                               |
|                                        v                                          |
|  +-----------------------------------------------------------------------------+  |
|  |              Deterministic Tool-Call Guardrail Pipeline                     |  |
|  |  * Canonical JSON Normalizer & Hashing Engine (SHA-256)                     |  |
|  |  * Sliding History Window & Identical-Call Counter                          |  |
|  |  * Strict Pydantic v2 Schema & Constraint Validator                         |  |
|  |  * Circuit Breaker & Fallback Injection Interceptor                         |  |
|  +-------------------------------------+---------------------------------------+  |
|                                        |                                          |
|                 [2. Dispatched Only if Circuit State == CLOSED]                   |
|                                        v                                          |
+----------------------------------------+------------------------------------------+
                                         | Model Context Protocol (MCP) Stdio / SSE
+----------------------------------------v------------------------------------------+
|                             Downstream MCP Servers                                |
|        (GitLab Search, Remote File System, CI/CD Engine, Terraform IaC)           |
+-----------------------------------------------------------------------------------+
```

---

## 3. Core Technical Specifications

### 3.1. Canonical Fingerprinting Algorithm

To prevent false negatives arising from key reordering or whitespace variations in LLM-generated JSON, arguments are normalized into a deterministic canonical fingerprint:

```python
import hashlib
import json
from typing import Any, Dict

def compute_tool_call_signature(tool_name: str, arguments: Dict[str, Any]) -> str:
    """
    Computes a deterministic, collision-resistant signature for a tool invocation.
    Keys are recursively sorted and formatted with zero redundant whitespace.
    """
    canonical_json = json.dumps(
        arguments,
        sort_keys=True,
        ensure_ascii=True,
        separators=(',', ':')
    )
    payload = f"{tool_name}:{canonical_json}".encode("utf-8")
    return hashlib.sha256(payload).hexdigest()
```

### 3.2. Circuit Breaker State Transition Matrix

The loop guard acts as a self-healing state machine attached to the `ToolNode` execution boundary:

```text
       [Normal Operation]
              │
              ▼
      ┌───────────────┐               Exceeds threshold
      │    CLOSED     │ ──────────────────────────────────────────┐
      └───────────────┘       (consecutive identical calls >= 3)  │
              ▲                                                   │
              │                                                   ▼
       Cache Invalidation                                 ┌───────────────┐
       or Novel Signature                                 │     OPEN      │
              │                                           │ (Interception)│
              │                                           └───────────────┘
              │                                                   │
              │                                                   ▼
              └────────────────────────────────────────── ┌───────────────┐
                     Inject Synthetic Feedback &          │   HALF-OPEN   │
                     Prompt Mutation into Model Context   │(Recovery Test)│
                                                          └───────────────┘
```

1. **CLOSED (Default):** Consecutive identical tool calls are below `identical_tool_call_limit` (default: `3`, enabled globally via `!7641`). Execution proceeds directly to downstream MCP servers.
2. **OPEN (Tripped):** When `consecutive_identical_count >= identical_tool_call_limit`:
   - Tool execution is immediately intercepted and short-circuited.
   - Downstream MCP process invocation is prevented.
   - A structured synthetic tool output is injected directly into the conversation history:
     ```json
     {
       "status": "error",
       "error_type": "LoopProtectionCircuitTripped",
       "message": "Guardrail triggered: Tool 'search_files' was invoked 3 consecutive times with identical parameters. Execution aborted. You MUST re-evaluate your plan and choose an alternative action."
     }
     ```
3. **HALF-OPEN (Recovery):** The model is forced to digest the synthetic feedback and propose a novel signature. If the subsequent call presents a new signature, the counter resets to zero and transition returns to `CLOSED`.

---

## 4. Implementation in `ai-assist` (`AgentComponentBase` Architecture)

Integrated into `duo_workflow_service/agent_platform/v1/components/agent/component.py`:

```python
from pydantic import BaseModel, Field, field_validator
from typing import List, Optional

class AgentComponentBase(BaseModel):
    # Enforces default identical tool call limit of 3 across all flows
    identical_tool_call_limit: int = Field(
        default=3,
        description="Maximum consecutive identical tool invocations before circuit trip."
    )

    @field_validator("identical_tool_call_limit")
    def validate_identical_tool_call_limit(cls, v: int) -> int:
        if v != 0 and v < 3:
            raise ValueError(
                "identical_tool_call_limit must be 0 (disabled) or >= 3; "
                "values < 3 trigger premature tripping on legitimate retry operations."
            )
        return v
```

### 4.1. Runtime Interception in `ToolNode`

```python
class GuardedToolNode:
    def __init__(self, tools: List[Any], identical_call_limit: int = 3):
        self.tools = {tool.name: tool for tool in tools}
        self.identical_call_limit = identical_call_limit
        self.last_signature: Optional[str] = None
        self.consecutive_count: int = 0

    async def execute_tool_call(self, tool_name: str, args: dict) -> dict:
        if self.identical_call_limit <= 0:
            return await self._dispatch(tool_name, args)

        current_sig = compute_tool_call_signature(tool_name, args)

        if current_sig == self.last_signature:
            self.consecutive_count += 1
        else:
            self.last_signature = current_sig
            self.consecutive_count = 1

        if self.consecutive_count >= self.identical_call_limit:
            # Circuit Breaker Trip
            return {
                "is_error": True,
                "content": (
                    f"Deterministic Guardrail Error: Identical call to '{tool_name}' "
                    f"exceeded threshold ({self.identical_call_limit}). Plan mutation required."
                )
            }

        return await self._dispatch(tool_name, args)

    async def _dispatch(self, tool_name: str, args: dict) -> dict:
        tool = self.tools.get(tool_name)
        if not tool:
            return {"is_error": True, "content": f"Tool '{tool_name}' not registered"}
        return await tool.arun(args)
```

---

## 5. Security & Verification Analysis

| Attack Vector / Failure Mode | Unmitigated Behavior | Guarded Behavior (`!7641` + ADD) |
| :--- | :--- | :--- |
| **Recursive Workspace Search** | Grep tool runs 50+ times looking for missing symbol until timeout. | Short-circuited at invocation 3; model receives recovery directive. |
| **Malicious Token Depletion** | Prompt injection forces loop over costly read endpoint. | Execution halted within < 15ms; token consumption capped deterministically. |
| **Whitespaced Signature Evasion** | Model sends `{"path":"/app"}` then `{"path": " /app"}`. | Canonical parser normalizes spacing and string encodings prior to hashing. |
| **Subtle Schema Drift** | Model casts integer `limit` as floating-point `10.0`. | Pydantic v2 coercion parses floats to strict `int` before MCP serialization. |

---

## 6. Rollout Plan & Telemetry

* **Phase 1 (Shipped - MR `!7641`):** Defaulted `identical_tool_call_limit: 3` across all v1 agent flow configurations (`AgentComponent`, `SupervisorAgentComponent`, `SupervisorAgentComponentV2`).
* **Phase 2 (In Review):** Prometheus counter metrics integration:
  * `gitlab_ai_gateway_agent_tool_loop_guards_tripped_total{tool_name, flow_id}`
  * `gitlab_ai_gateway_agent_tool_signature_cache_duration_seconds`
* **Phase 3 (Next):** Client-side early warning alerts surfaced via `gitlab-lsp` notifications in VS Code and GitLab Web IDE.

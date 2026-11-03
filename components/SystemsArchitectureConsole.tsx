import React from "react";

interface SubsystemItem {
  id: string;
  category: string;
  title: string;
  releaseTag: string;
  ciStatus: "passed" | "operational" | "verified";
  description: string;
  tags: string[];
}

const subsystems: SubsystemItem[] = [
  {
    id: "cloud-orchestration",
    category: "Cloud & Orchestration",
    title: "GitLab Core & AI Gateway",
    releaseTag: "MR !7641",
    ciStatus: "passed",
    description:
      "Engineered deterministic tool-call loop guards in ai-assist preventing runaway agent cycles; authored canonical Architecture Design Document (ADD).",
    tags: ["Ruby on Rails", "Python", "FastAPI", "MCP", "GDK"],
  },
  {
    id: "accelerated-compute",
    category: "Accelerated Compute",
    title: "GPU & Bare-Metal Systems",
    releaseTag: "OFX v2.4",
    ciStatus: "operational",
    description:
      "Low-overhead C++20, CUDA 12.6, and Apple Metal execution graphs; 12-bit ACEScc sensor dynamic range preservation for DaVinci Resolve GPU runtimes.",
    tags: ["C++20", "CUDA 12.6", "Apple Metal", "OpenFX", "ACEScc"],
  },
  {
    id: "embedded-hardware",
    category: "Embedded / Hardware",
    title: "Production Hardware & ASIC",
    releaseTag: "Rev C1",
    ciStatus: "verified",
    description:
      "Production STM32F405 quadcopter flight controller PCB package (TinyFC20 Rev C1, 0 DRC, complete BOM) and verified 8-bit CMOS 130nm ALU layout.",
    tags: ["KiCad", "Allegro", "CMOS 130nm", "STM32F405", "KLayout"],
  },
];

export const SystemsArchitectureConsole: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto rounded-xl border border-slate-800/80 bg-[#090A0F] shadow-2xl shadow-black/80 overflow-hidden font-sans text-slate-200">
      {/* Header Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-b border-slate-800/80 bg-[#0F121A]/70 backdrop-blur-md">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#D1002D]" />
            <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              HRL SYSTEMS ARCHITECTURE
            </span>
          </div>
          <h2 className="text-base font-semibold tracking-tight text-white">
            Production Architecture &amp; Delivery Console
          </h2>
        </div>

        {/* Global Delivery Indicator */}
        <div className="flex items-center gap-2.5 rounded-full border border-emerald-500/20 bg-emerald-950/20 px-3 py-1 text-xs">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="font-mono text-[11px] font-medium text-emerald-400">
            Live CD / Merge Train Operational
          </span>
        </div>
      </div>

      {/* Core Deliverables List */}
      <div className="divide-y divide-slate-800/60 bg-[#0C0E15]">
        {subsystems.map((item) => (
          <div
            key={item.id}
            className="group px-6 py-4.5 transition-colors duration-150 hover:bg-slate-900/30"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-mono font-medium text-slate-400 uppercase tracking-wide">
                  {item.category}:
                </span>
                <span className="text-sm font-semibold text-white tracking-tight">
                  {item.title}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded border border-slate-700/80 bg-slate-900/80 px-2 py-0.5 font-mono text-[11px] font-medium text-amber-300">
                  {item.releaseTag}
                </span>
                <span className="inline-flex items-center rounded border border-emerald-500/30 bg-emerald-950/30 px-1.5 py-0.5 font-mono text-[10px] font-medium text-emerald-400">
                  {item.ciStatus === "passed"
                    ? "CI Passed"
                    : item.ciStatus === "operational"
                    ? "Green"
                    : "0 DRC Verified"}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              {item.description}
            </p>

            {/* Tech Stack Badges */}
            <div className="flex flex-wrap items-center gap-1.5">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded border border-slate-800 bg-slate-900/90 px-2 py-0.5 text-[10.5px] font-mono text-slate-400"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Synchronized Telemetry & Delivery Tray (Lower Deck) */}
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-800/80 border-t border-slate-800/80 bg-[#08090E]">
        {/* Panel A: Continuous Delivery */}
        <div className="px-6 py-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span className="font-mono text-[11px] uppercase tracking-wider text-slate-400">
              Pipeline Health
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="text-slate-300">
              Status: <span className="text-emerald-400 font-semibold">Passing</span>
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">
              Target: <span className="text-slate-200">Production</span>
            </span>
          </div>
        </div>

        {/* Panel B: Contribution Telemetry */}
        <div className="px-6 py-3.5 flex items-center justify-between gap-3 bg-slate-950/30">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
            <span className="font-mono text-[11px] uppercase tracking-wider text-slate-400">
              Telemetry
            </span>
          </div>
          <div className="flex items-center gap-2.5 text-xs font-mono">
            <span className="text-amber-300 font-bold">1,853 Contributions</span>
            <span className="text-slate-600">·</span>
            <span className="text-amber-300 font-semibold">90d Streak</span>
            <span className="text-slate-600">·</span>
            <span className="text-blue-400 font-medium">GitLab Tier 3</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemsArchitectureConsole;

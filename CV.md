# Pavan Kumar Sadashiv
**AI Systems Chief Architect | GPU Kernel & High-Performance Runtime Engineer | Founder & MD**  
**Location**: Mangaluru, Karnataka, India  
**Email**: `hrlinternationalprivatelimited@gmail.com`  
**GitHub**: [github.com/hrlpavan](https://github.com/hrlpavan)  
**Corporate Platform**: [hrlpavan.github.io/hrl-international-website-/](https://hrlpavan.github.io/hrl-international-website-/)  
**Compensation Charter**: [github.com/hrlpavan/engineering-compensation-blueprint](https://github.com/hrlpavan/engineering-compensation-blueprint)

---

## Executive Summary

Full-stack systems engineer, GPU compute specialist, and applied AI architect with deep domain mastery across low-level C++20/CUDA 12.6 high-performance inference runtimes, Paged KV-Cache virtualization, CUDA Graph replay optimization, combinatorial discrete optimization (NP-hard CSP Backtracking), and enterprise multi-agent AI orchestration. Proven track record architecting the **NVIDIA RTX-LocalAI Enterprise Execution Suite** for Ada Lovelace and Blackwell GPUs, hardware-accelerated OpenFX visual compute plugins for Hollywood-grade post-production suites (DaVinci Resolve), and zero-bloat native backend architectures. Founder and Managing Director of HRL International Private Limited with verified competencies in corporate grant financing (Startup India / Karnataka ELEVATE), distributed stream processing (JPMorgan Chase certified), and enterprise cybersecurity governance (Deloitte certified). Author of the master technical treatise *Rule Breaking (Volume 4.0): The 100x AI Chief Architect Manifesto*.

---

## Technical Skills Matrix

- **Low-Level & GPU Computing**: C++20/17, NVIDIA CUDA 12.6 Kernel Programming, Apple Metal Shading Language (MSL), CUDA Graph Capture & Replay, Paged Attention & KV-Cache Virtualization, OpenFX API, GPU Memory Hierarchy Optimization, Tensor Core GEMM/GEMV Optimization.
- **AI/ML & Inference Optimization**: PyTorch, ONNX Runtime, Hardware-Aware FP8 (E4M3/E5M2) & INT4-AWQ/GPTQ Quantization, Speculative Decoding Policy Engines, Monocular Neural Depth Estimation (Depth Anything), ACEScc Color Science, 12-Bit DPX Sensor Processing.
- **Algorithms & Discrete Optimization**: Combinatorial Discrete Optimization, Constraint Satisfaction Problem (CSP) Backtracking Solvers, Dynamic K-Means Clustering ($k=3$), Bayesian Classifiers, Graph Traversals, Sliding Window Token Bucket Rate Limiting.
- **Backend & Systems Architecture**: Native Node.js (`node:http`, `node:fs`), SQLite 3 (`better-sqlite3`, ACID Transactions), Zero-Framework Server Architecture, RESTful API Design, Microservices, Multi-Agent AI Orchestration (Google Antigravity SDK).
- **Frontend & Visual Systems**: JavaScript (ES6+), HTML5 2D Canvas API, Tailwind CSS, Apple Liquid Glass UI Design, Real-Time Chart.js Pareto Visualizers, jsPDF, SheetJS.
- **DevOps, Tooling & Build Environments**: CMake, Git, GitHub Actions (CI/CD Pipelines), macOS Application Bundling & DMG Packaging, Linux System Administration.

---

## Flagship Engineering Projects

### 1. NVIDIA RTX-LocalAI Enterprise Execution Suite
*Specialization: Low-Level C++20, CUDA 12.6, High-Performance On-Device AI Inference, Memory Management*  
*Repository & Live Studio: [github.com/hrlpavan/nvedia-project-by-hrl](https://github.com/hrlpavan/nvedia-project-by-hrl) | [hrlpavan.github.io/nvedia-project-by-hrl/](https://hrlpavan.github.io/nvedia-project-by-hrl/)*
- Architected an on-device AI inference engine, memory management subsystem, and performance/accuracy benchmarking suite built for **NVIDIA GeForce RTX (Ada Lovelace / Blackwell) and DGX-class systems**.
- **Paged KV-Cache Virtualization (`src/memory/`)**: Implemented a virtual-to-physical block manager (16 tokens/block) achieving **0.17 µs/request allocation latency** with **0.00% memory fragmentation** across 8GB–24GB consumer VRAM.
- **CUDA Graph Replay & Continuous Batching (`src/runtime/`)**: Pre-captured static compute graphs dropping CPU launch latency to **< 5 µs**, paired with iteration-level continuous batching and chunked prefill (512 tokens/chunk).
- **Speculative Policy Engine (`src/runtime/speculative.cpp`)**: Pairs fast draft models (1B) with target evaluators (8B) for **up to 2.2x speedup** with an 88.4% speculative acceptance rate.
- **Hardware-Aware FP8 & INT4-AWQ Quantization (`src/quantization/`, `src/kernels/`)**: Engineered Tensor Core optimized dequantization GEMM/GEMV CUDA kernels tailored for Ada Lovelace and Blackwell GPUs (0.65 ms TPOT, 5,014 MB peak VRAM).
- **Multimodal Lab Interfaces (`src/pipelines/`)**: Unified pipeline architectures for LLM text, Vision-Language (LLaVA-RTX), Speech Processing (Whisper ASR / TTS), and Latent Diffusion.
- **Executive Web Studio (`web/index.html`)**: Interactive real-time 256-block memory grid, live Chart.js Pareto sweeps, and zero-emoji Apple SF Pro typography.

### 2. AI Cinematic Haze — OpenFX & Fusion Plugin for DaVinci Resolve
*Specialization: Low-Level C++, Apple Metal & CUDA Compute, Computer Vision AI*  
*Repository: [github.com/hrlpavan/hrl-international-website-](https://github.com/hrlpavan/hrl-international-website-)*
- Architected a high-performance OpenFX visual computing plugin integrated directly into DaVinci Resolve and Blackmagic Fusion.
- Engineered dual hardware-accelerated GPU backends using Apple Metal Shading Language (MSL) for Apple Silicon and CUDA kernels for NVIDIA GPUs.
- Integrated monocular neural depth estimation (Depth Anything via ONNX Runtime) to calculate physically accurate volumetric optical atmospheric scattering in real-time.
- Enforced strict Hollywood ACEScc color science preserving 12-bit uncompressed DPX sensor dynamic range without luminance clipping.
- Packaged complete cross-platform installer suites including native macOS `.dmg` and automated build configurations.

### 3. InvigiMatrix — College Examination & Invigilation Management Portal
*Specialization: Combinatorial Optimization (CSP), Zero-Dependency Full-Stack, Machine Learning*  
*Repository: [github.com/hrlpavan/exam-invigilation-dsa-app](https://github.com/hrlpavan/exam-invigilation-dsa-app)*
- Designed and deployed an automated examination invigilation and seating management portal for Sahyadri College of Engineering & Management.
- Implemented an NP-hard **Constraint Satisfaction Problem (CSP) Backtracking solver** allocating faculty duties, classroom venues, and multi-department exam timetables with zero collisions.
- Built an **AI/ML Smart Batch Planner** incorporating dynamic K-Means clustering ($k=3$) and a Bayesian lateral-entry classifier to interleave students across physical benches for anti-cheating dispersion.
- Developed a high-throughput, zero-framework native Node.js REST API server with zero external web dependencies, backed by SQLite with strict ACID transactions.
- Created custom sliding window token bucket rate limiters to protect AI conversational endpoints against DoS attacks.
- Engineered an Apple Liquid Glass UI with dynamic pill navigation and client-side HTML5 2D Canvas A4 seating matrix export engines.

### 4. OmniTransform AI — Intelligent Process Automation Platform
*Specialization: Multimodal AI Pipelines, Acoustic Signal Processing, Enterprise IPA*  
*Repository: [github.com/hrlpavan/omnitransform-ai-resources](https://github.com/hrlpavan/omnitransform-ai-resources)*
- Architected an enterprise Intelligent Process Automation (IPA) platform integrating multimodal document parsing and phonetic entity extraction.
- Developed a neural speech pipeline leveraging ElevenLabs Multilingual v2 Voice AI paired with Chladni resonance acoustic physics visualizers.
- Engineered multi-agent coordination architectures utilizing Google Antigravity SDK, Cloud Composer (Airflow), and BigQuery analytics.

---

## Leadership & Entrepreneurial Experience

### Founder & Managing Director — HRL International Private Limited (2026 – Present)
- Founded and incorporated HRL International Private Limited, driving deep-tech software systems, AI pipelines, and digital distribution.
- Author of *Rule Breaking (Volume 4.0): The 100x AI Chief Architect Manifesto* ([Master Treatise](https://hrlpavan.github.io/hrl-international-website-/RULE_BREAKING_BY_HRL_V4.pdf)).
- Authored comprehensive grant applications and financial allocation models for the **Startup India Seed Fund Scheme (SISFS)** and **Karnataka ELEVATE Grant 2026**.
- Directed media distribution infrastructures achieving **2.5M+ organic impressions** across creator channels (`@hrlpremiumstudio`, `@hrlflix`, `@hrlefx`).
- Implemented corporate governance, trademark registration frameworks, and DMCA intellectual property protection standards.

---

## Education

**Bachelor of Engineering (B.E.) in Computer Science & Engineering (AI & ML)**  
*Sahyadri College of Engineering & Management (SCEM), Mangaluru, Karnataka, India*  
- Focus: Artificial Intelligence, Machine Learning, Data Structures & Algorithms, Systems Programming, Database Systems, Computer Architecture.

---

## Verified Professional Certifications

- **JPMorgan Chase & Co.** — Distributed Streaming & Software Engineering Simulation (Kafka, REST Controller Architecture, Low-Latency Processing).
- **Deloitte Australia** — Cybersecurity Defense & Enterprise Threat Modeling Simulation (Perimeter Defense, Access Control Governance, Incident Response).
- **Blackmagic Design** — DaVinci Resolve Color Science & Visual Computing Integration.

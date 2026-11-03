import React from "react";

interface DeliverableItem {
  id: string;
  title: string;
  releaseTag: string;
  statusTag: string;
  summary: string;
  stack: string[];
}

interface TelemetryMetric {
  value: string;
  label: string;
  subtext: string;
}

const deliverables: DeliverableItem[] = [
  {
    id: "gitlab-ai",
    title: "GitLab Core & AI Gateway",
    releaseTag: "MR !7641",
    statusTag: "CI Passed",
    summary:
      "Deterministic tool-call validation in ai-assist eliminating runaway loops; authored canonical Architecture Design Document (ADD).",
    stack: ["Agent Loop Guard", "ADD", "Ruby/Go"],
  },
  {
    id: "gpu-systems",
    title: "GPU & Bare-Metal Runtime",
    releaseTag: "CUDA 12.6",
    statusTag: "Verified",
    summary:
      "12-bit ACEScc color science, custom compute graphs, and DaVinci Resolve GPU plugin runtime with native Apple Metal and CUDA compute pipelines.",
    stack: ["C++20", "Apple Metal", "OpenFX"],
  },
  {
    id: "hardware-asic",
    title: "Production Hardware & ASIC",
    releaseTag: "TinyFC20 Rev C1",
    statusTag: "0 DRC",
    summary:
      "Betaflight quadcopter flight controller PCB package, complete manufacturing BOM & verified 8-bit CMOS 130nm ALU cell layout.",
    stack: ["CMOS 130nm", "DRC Clean", "KiCad"],
  },
];

const telemetryMetrics: TelemetryMetric[] = [
  {
    value: "1,853",
    label: "Upstream Contributions",
    subtext: "GitLab Core, AI Gateway & Terraform Provider",
  },
  {
    value: "90 Days",
    label: "Continuous Velocity",
    subtext: "Daily production commit cadence",
  },
  {
    value: "Top 7 Global",
    label: "GitLab Global Hackathon",
    subtext: "Top 7 worldwide placement · Contributor Level 3 (3,868 pts)",
  },
];

const toolchain: string[] = [
  "C++20",
  "CUDA 12.6",
  "Apple Metal",
  "Python",
  "Go",
  "TypeScript",
  "KiCad",
  "OpenFX",
];

export const UnifiedSystemsConsole: React.FC = () => {
  return (
    <div className="w-full max-w-5xl mx-auto rounded-2xl border border-white/[0.08] bg-[#090A0F] shadow-2xl shadow-black/90 overflow-hidden font-sans text-slate-200">
      {/* Top Control Bar (Full Width) */}
      <header className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-b border-white/[0.06] bg-[#0E1117]/80 backdrop-blur-md">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#D1002D]" />
            <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-slate-400">
              HRL SYSTEMS ARCHITECTURE
            </span>
          </div>
          <h1 className="text-base font-semibold tracking-tight text-slate-100">
            Production Deliverables &amp; Contribution Telemetry
          </h1>
        </div>

        {/* Global Status Chip - Never Clips */}
        <div className="flex-shrink-0 whitespace-nowrap inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/20 px-3 py-1 text-xs">
          <span className="relative flex h-2 w-2 flex-shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="font-mono text-[11px] font-medium text-emerald-400">
            Live CD / Merge Train Operational
          </span>
        </div>
      </header>

      {/* Bento Main Grid: 60/40 Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-white/[0.06] bg-[#090A0F]">
        {/* Left Column (60% Width): Verified Continuous Delivery Deliverables */}
        <section className="lg:col-span-7 flex flex-col divide-y divide-white/[0.06]">
          <div className="px-6 py-2.5 bg-[#0C0F15] border-b border-white/[0.04]">
            <span className="font-mono text-[10px] font-semibold tracking-wider uppercase text-slate-400">
              VERIFIED CONTINUOUS DELIVERY DELIVERABLES
            </span>
          </div>

          {deliverables.map((item) => (
            <div
              key={item.id}
              className="px-6 py-4 transition-colors duration-150 hover:bg-slate-900/25 flex flex-col gap-2"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm font-semibold text-slate-100 tracking-tight">
                  {item.title}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="inline-flex items-center rounded border border-slate-700/80 bg-slate-900/90 px-2 py-0.5 font-mono text-[10.5px] font-medium text-slate-300">
                    {item.releaseTag}
                  </span>
                  <span className="inline-flex items-center rounded border border-emerald-500/30 bg-emerald-950/40 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-emerald-400">
                    {item.statusTag}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {item.summary}
              </p>

              <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                {item.stack.map((tag) => (
                  <span
                    key={tag}
                    className="rounded border border-slate-800 bg-[#0E121B] px-2 py-0.5 text-[10px] font-mono text-slate-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* Right Column (40% Width): Upstream Telemetry Deck */}
        <aside className="lg:col-span-5 flex flex-col divide-y divide-white/[0.06] bg-[#0B0D13]">
          <div className="px-6 py-2.5 bg-[#0C0F15] border-b border-white/[0.04]">
            <span className="font-mono text-[10px] font-semibold tracking-wider uppercase text-slate-400">
              UPSTREAM TELEMETRY DECK
            </span>
          </div>

          {telemetryMetrics.map((metric, idx) => (
            <div
              key={idx}
              className="px-6 py-5 flex flex-col justify-center flex-1 transition-colors duration-150 hover:bg-slate-900/20"
            >
              <div className="font-mono text-2xl font-bold tracking-tight text-white mb-0.5">
                {metric.value}
              </div>
              <div className="text-xs font-semibold text-emerald-400 tracking-tight mb-1">
                {metric.label}
              </div>
              <div className="text-[11px] text-slate-400 leading-snug">
                {metric.subtext}
              </div>
            </div>
          ))}
        </aside>
      </div>

      {/* Bottom Control Strip: Core Systems Toolchain (Full Width) */}
      <footer className="flex flex-wrap items-center justify-between gap-3 px-6 py-3 border-t border-white/[0.06] bg-[#07080D]">
        <div className="flex items-center gap-2">
          <span className="h-1 w-1 rounded-full bg-slate-500" />
          <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
            CORE SYSTEMS TOOLCHAIN
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {toolchain.map((tech) => (
            <span
              key={tech}
              className="rounded border border-slate-800/80 bg-slate-900/60 px-2.5 py-0.5 font-mono text-[10.5px] text-slate-300 transition-colors hover:border-slate-700 hover:text-white"
            >
              {tech}
            </span>
          ))}
        </div>
      </footer>
    </div>
  );
};

export default UnifiedSystemsConsole;

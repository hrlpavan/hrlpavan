'use client';

import React from 'react';

// Lightweight, zero-dependency Lucide-compatible icons
const Icons = {
  GitPullRequest: () => (
    <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="18" r="3" /><circle cx="6" cy="6" r="3" />
      <path d="M13 6h3a2 2 0 0 1 2 2v7" /><line x1="6" y1="9" x2="6" y2="21" />
    </svg>
  ),
  ShieldCheck: () => (
    <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" />
    </svg>
  ),
  Anchor: () => (
    <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="5" r="3" /><line x1="12" y1="22" x2="12" y2="8" /><path d="M5 12H2a10 10 0 0 0 20 0h-3" />
    </svg>
  ),
  Cpu: () => (
    <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="16" height="16" rx="2" /><rect x="9" y="9" width="6" height="6" />
      <path d="M15 2v2" /><path d="M15 20v2" /><path d="M2 15h2" /><path d="M2 9h2" />
      <path d="M20 15h2" /><path d="M20 9h2" /><path d="M9 2v2" /><path d="M9 20v2" />
    </svg>
  ),
  Terminal: () => (
    <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="4 17 10 11 4 5" /><line x1="12" y1="19" x2="20" y2="19" />
    </svg>
  ),
  Award: () => (
    <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="6" /><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
    </svg>
  ),
  Activity: () => (
    <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
  CheckCircle2: () => (
    <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" /><path d="m9 12 2 2 4-4" />
    </svg>
  ),
};

interface Milestone {
  category: string;
  value: string;
  tag?: string;
  icon: keyof typeof Icons;
  accent: 'emerald' | 'amber' | 'blue' | 'purple' | 'slate';
}

const milestones: Milestone[] = [
  {
    category: 'GITLAB ECOSYSTEM',
    value: 'TOP 7 GLOBAL HACKATHON',
    tag: 'LVL 3 · 6,149 PTS',
    icon: 'GitPullRequest',
    accent: 'amber',
  },
  {
    category: 'VERIFIED ARCHITECT',
    value: 'PAVAN KUMAR S.',
    tag: '@HRLPAVAN',
    icon: 'ShieldCheck',
    accent: 'emerald',
  },
  {
    category: 'AUTONOMOUS AI',
    value: 'MATSYA OCEAN SENSOR POD',
    tag: 'EDGE VISION + GPS',
    icon: 'Anchor',
    accent: 'blue',
  },
  {
    category: 'HARDWARE & ASIC',
    value: 'TINYFC20 REV C1',
    tag: '0 DRC · CMOS 130nm',
    icon: 'Cpu',
    accent: 'purple',
  },
  {
    category: 'ACCELERATED GPU',
    value: 'CUDA 12.6 · APPLE METAL',
    tag: '12-BIT ACEScc',
    icon: 'Terminal',
    accent: 'blue',
  },
  {
    category: 'ROBOTICS INNOVATION',
    value: 'PLASTIPOD™ AUTONOMOUS BOT',
    tag: 'HACKATHON BUILD',
    icon: 'Award',
    accent: 'emerald',
  },
  {
    category: 'RELEASE VELOCITY',
    value: '90-DAY CONTINUOUS STREAK',
    tag: 'ACTIVE CADENCE',
    icon: 'Activity',
    accent: 'amber',
  },
  {
    category: 'SECURITY DEFENSE',
    value: 'INTIGRITI BUG RESEARCHER',
    tag: 'VERIFIED AUDITOR',
    icon: 'CheckCircle2',
    accent: 'slate',
  },
];

const accentStyles = {
  emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  blue: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
  purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  slate: 'bg-slate-800/40 text-slate-300 border-slate-700/50',
};

export function MilestoneMatrix() {
  return (
    <div className="w-full max-w-5xl mx-auto rounded-xl bg-[#090A0F] border border-white/[0.08] p-5 shadow-2xl font-sans text-slate-200">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-white/[0.06]">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">
            HRL International · Systems Engineering
          </span>
          <h2 className="text-base font-semibold text-slate-100 mt-0.5">
            Verified Production Milestones &amp; Engineering Track Record
          </h2>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/40 border border-emerald-800/40 text-[11px] font-mono text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Production Verified
        </div>
      </div>

      {/* Symmetrical 2-Column Grid (Zero Dead Space) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
        {milestones.map((item, idx) => {
          const IconComponent = Icons[item.icon];
          return (
            <div
              key={idx}
              className="flex items-stretch rounded-lg border border-white/[0.07] bg-[#0E1117] overflow-hidden hover:border-white/[0.15] transition-all"
            >
              {/* Left Label */}
              <div className="flex items-center gap-2 px-3 py-2.5 bg-white/[0.02] border-r border-white/[0.06] shrink-0 min-w-[140px]">
                <IconComponent />
                <span className="text-[10px] font-mono font-medium tracking-wider text-slate-400 uppercase">
                  {item.category}
                </span>
              </div>

              {/* Right Value & Tag */}
              <div className="flex items-center justify-between px-3 py-2.5 flex-1 min-w-0">
                <span className="text-xs font-semibold text-slate-100 truncate mr-2 font-mono">
                  {item.value}
                </span>
                {item.tag && (
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded border whitespace-nowrap ${accentStyles[item.accent]}`}
                  >
                    {item.tag}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Professional Footer Statement (Replaces Aggressive Slogan) */}
      <div className="mt-4 pt-3 border-t border-white/[0.05] flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
        <span>Autonomous Edge Systems · GPU Runtimes · Custom ASIC Hardware</span>
        <span className="font-mono text-slate-500">Mangaluru, IN · Worldwide CD</span>
      </div>
    </div>
  );
}

export default MilestoneMatrix;

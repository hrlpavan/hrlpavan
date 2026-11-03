import React from 'react';
import { useGitLabTelemetry } from '../hooks/useGitLabTelemetry';

export const LiveGitLabScoreCard: React.FC = () => {
  const { displayScoreFormatted, level, standing, isLive } = useGitLabTelemetry();

  return (
    <div className="px-6 py-5 flex flex-col justify-center flex-1 transition-colors duration-150 hover:bg-slate-900/20">
      {/* Top Telemetry Header with Live Indicator */}
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className={`absolute inline-flex h-full w-full rounded-full bg-emerald-400 ${isLive ? 'animate-ping opacity-75' : 'opacity-40'}`} />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
            {isLive ? 'Live Standing' : 'Upstream Standing'}
          </span>
        </div>

        {/* Level 3 Pill */}
        <span className="inline-flex items-center rounded border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-amber-400">
          Lvl {level} Contributor
        </span>
      </div>

      {/* Main Score (Monospace & Tabular Nums) */}
      <div className="flex items-baseline gap-1.5 font-mono text-2xl font-bold tracking-tight text-white mb-0.5 tabular-nums">
        <span>{displayScoreFormatted}</span>
        <span className="text-xs font-medium text-slate-400">pts</span>
      </div>

      {/* Primary Category Standing */}
      <div className="text-xs font-semibold text-emerald-400 tracking-tight mb-1">
        {standing}
      </div>

      {/* Context Subtext */}
      <div className="text-[11px] text-slate-400 leading-snug">
        Worldwide leaderboard standing · Contributor Tier 3
      </div>
    </div>
  );
};

export default LiveGitLabScoreCard;

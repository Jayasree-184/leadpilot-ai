import React from 'react';
import { Flame, Sun, Snowflake } from 'lucide-react';

export default function PriorityChart({ hotCount = 0, warmCount = 0, coldCount = 0, total = 0 }) {
  const safeTotal = total > 0 ? total : hotCount + warmCount + coldCount;
  const hotPct = safeTotal > 0 ? Math.round((hotCount / safeTotal) * 100) : 0;
  const warmPct = safeTotal > 0 ? Math.round((warmCount / safeTotal) * 100) : 0;
  const coldPct = safeTotal > 0 ? Math.max(0, 100 - hotPct - warmPct) : 0;

  // Donut SVG parameters
  const size = 160;
  const strokeWidth = 18;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Segment offsets
  const hotOffset = 0;
  const hotLength = (hotPct / 100) * circumference;

  const warmOffset = -hotLength;
  const warmLength = (warmPct / 100) * circumference;

  const coldOffset = -(hotLength + warmLength);
  const coldLength = (coldPct / 100) * circumference;

  return (
    <div className="glass-panel rounded-3xl p-6 shadow-glass-md flex flex-col justify-between relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-0 w-36 h-36 bg-purple-500/12 rounded-full blur-3xl pointer-events-none" />

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-heading font-semibold text-white tracking-tight flex items-center gap-2">
            <span>Lead Priority</span>
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-purple-500/20 text-cyan-300 border border-purple-400/30">
              Distribution
            </span>
          </h3>
          <span className="text-xs font-mono font-medium text-slate-300 glass-pill px-2.5 py-1 rounded-full">
            {safeTotal} Qualified Leads
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6 my-2">
          {/* SVG Donut Chart with Glass Glow */}
          <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg] overflow-visible">
              <defs>
                <filter id="neonGlowHot" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#f43f5e" floodOpacity="0.65" />
                </filter>
                <filter id="neonGlowWarm" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#f59e0b" floodOpacity="0.65" />
                </filter>
                <filter id="neonGlowCold" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#06b6d4" floodOpacity="0.5" />
                </filter>
              </defs>

              {/* Background Track */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth={strokeWidth}
              />

              {/* Cold Segment */}
              {coldPct > 0 && (
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke="#06b6d4"
                  filter="url(#neonGlowCold)"
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${coldLength} ${circumference - coldLength}`}
                  strokeDashoffset={coldOffset}
                  strokeLinecap="round"
                  className="transition-all duration-700"
                />
              )}

              {/* Warm Segment */}
              {warmPct > 0 && (
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke="#f59e0b"
                  filter="url(#neonGlowWarm)"
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${warmLength} ${circumference - warmLength}`}
                  strokeDashoffset={warmOffset}
                  strokeLinecap="round"
                  className="transition-all duration-700"
                />
              )}

              {/* Hot Segment */}
              {hotPct > 0 && (
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke="#f43f5e"
                  filter="url(#neonGlowHot)"
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${hotLength} ${circumference - hotLength}`}
                  strokeDashoffset={hotOffset}
                  strokeLinecap="round"
                  className="transition-all duration-700"
                />
              )}
            </svg>

            {/* Centered Percentage */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="text-2xl font-bold font-mono text-white leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                {hotPct}%
              </span>
              <span className="text-[10px] font-heading font-bold text-rose-400 uppercase tracking-wider drop-shadow-[0_0_6px_rgba(244,63,94,0.6)]">
                HOT
              </span>
            </div>
          </div>

          {/* Breakdown Legend */}
          <div className="flex-1 space-y-2.5 w-full">
            <div className="flex items-center justify-between p-2.5 rounded-xl glass-card border-rose-500/20 bg-rose-500/[0.04]">
              <div className="flex items-center gap-2 text-xs font-medium text-rose-200">
                <Flame className="w-4 h-4 text-rose-400 drop-shadow-[0_0_6px_rgba(244,63,94,0.6)]" />
                <span>Hot Leads (85+)</span>
              </div>
              <div className="font-mono text-xs font-bold text-rose-400">
                {hotCount} <span className="text-slate-400 font-normal">({hotPct}%)</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl glass-card border-amber-500/20 bg-amber-500/[0.04]">
              <div className="flex items-center gap-2 text-xs font-medium text-amber-200">
                <Sun className="w-4 h-4 text-amber-400 drop-shadow-[0_0_6px_rgba(245,158,11,0.6)]" />
                <span>Warm Leads (70-84)</span>
              </div>
              <div className="font-mono text-xs font-bold text-amber-400">
                {warmCount} <span className="text-slate-400 font-normal">({warmPct}%)</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl glass-card border-cyan-500/20 bg-cyan-500/[0.04]">
              <div className="flex items-center gap-2 text-xs font-medium text-cyan-200">
                <Snowflake className="w-4 h-4 text-cyan-400" />
                <span>Cold Leads (&lt;70)</span>
              </div>
              <div className="font-mono text-xs font-bold text-cyan-400">
                {coldCount} <span className="text-slate-400 font-normal">({coldPct}%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3.5 border-t border-white/10 text-xs text-slate-300 flex items-center justify-between">
        <span className="text-slate-400">AI Priority Insight:</span>
        <strong className="text-cyan-300 font-medium drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]">
          {hotPct}% of pipeline accounts require immediate outreach.
        </strong>
      </div>
    </div>
  );
}

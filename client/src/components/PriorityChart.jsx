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
    <div className="bg-[#0f1523] rounded-2xl border border-white/10 p-6 shadow-xl flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-white tracking-tight">Lead Priority</h3>
          <span className="text-xs font-mono font-medium text-slate-400">
            {safeTotal} Qualified Leads
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6 my-2">
          {/* SVG Donut Chart */}
          <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg]">
              {/* Background Track */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="#1e293b"
                strokeWidth={strokeWidth}
              />

              {/* Hot Segment */}
              {hotPct > 0 && (
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke="#f43f5e"
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${hotLength} ${circumference - hotLength}`}
                  strokeDashoffset={hotOffset}
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
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${warmLength} ${circumference - warmLength}`}
                  strokeDashoffset={warmOffset}
                  strokeLinecap="round"
                  className="transition-all duration-700"
                />
              )}

              {/* Cold Segment */}
              {coldPct > 0 && (
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke="#64748b"
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${coldLength} ${circumference - coldLength}`}
                  strokeDashoffset={coldOffset}
                  strokeLinecap="round"
                  className="transition-all duration-700"
                />
              )}
            </svg>

            {/* Centered Percentage */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-bold font-mono text-white leading-tight">
                {hotPct}%
              </span>
              <span className="text-[10px] font-semibold text-rose-400 uppercase tracking-wide">
                HOT
              </span>
            </div>
          </div>

          {/* Breakdown Legend */}
          <div className="flex-1 space-y-2.5 w-full">
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800/80">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
                <Flame className="w-4 h-4 text-rose-400" />
                <span>Hot Leads (85+)</span>
              </div>
              <div className="font-mono text-xs font-bold text-rose-400">
                {hotCount} <span className="text-slate-500 font-normal">({hotPct}%)</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800/80">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
                <Sun className="w-4 h-4 text-amber-400" />
                <span>Warm Leads (70-84)</span>
              </div>
              <div className="font-mono text-xs font-bold text-amber-400">
                {warmCount} <span className="text-slate-500 font-normal">({warmPct}%)</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800/80">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
                <Snowflake className="w-4 h-4 text-slate-400" />
                <span>Cold Leads (&lt;70)</span>
              </div>
              <div className="font-mono text-xs font-bold text-slate-400">
                {coldCount} <span className="text-slate-500 font-normal">({coldPct}%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3.5 border-t border-slate-800/80 text-xs text-slate-400 flex items-center justify-between">
        <span>AI Distribution Insight:</span>
        <strong className="text-rose-400 font-medium">
          {hotPct}% of your leads are currently high priority.
        </strong>
      </div>
    </div>
  );
}

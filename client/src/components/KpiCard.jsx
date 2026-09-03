import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function KpiCard({
  title,
  value,
  description,
  trend,
  trendPositive = true,
  icon: Icon,
  accentColor = 'purple',
  onClick
}) {
  const colorMap = {
    purple: {
      border: 'hover:border-purple-400/50 hover:shadow-glow-purple',
      iconBg: 'bg-purple-500/15 text-purple-300 border-purple-400/30 shadow-[0_0_12px_rgba(168,85,247,0.35)]',
      glow: 'bg-purple-500/12'
    },
    cyan: {
      border: 'hover:border-cyan-400/50 hover:shadow-glow-cyan',
      iconBg: 'bg-cyan-500/15 text-cyan-300 border-cyan-400/30 shadow-[0_0_12px_rgba(6,182,212,0.35)]',
      glow: 'bg-cyan-500/12'
    },
    rose: {
      border: 'hover:border-rose-400/50 hover:shadow-glow-hot',
      iconBg: 'bg-rose-500/15 text-rose-300 border-rose-400/30 shadow-[0_0_12px_rgba(244,63,94,0.35)]',
      glow: 'bg-rose-500/12'
    },
    amber: {
      border: 'hover:border-amber-400/50 hover:shadow-glow-warm',
      iconBg: 'bg-amber-500/15 text-amber-300 border-amber-400/30 shadow-[0_0_12px_rgba(245,158,11,0.35)]',
      glow: 'bg-amber-500/12'
    },
    emerald: {
      border: 'hover:border-emerald-400/50 hover:shadow-glow-emerald',
      iconBg: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30 shadow-[0_0_12px_rgba(16,185,129,0.35)]',
      glow: 'bg-emerald-500/12'
    }
  };

  const scheme = colorMap[accentColor] || colorMap.purple;

  return (
    <div
      onClick={onClick}
      className={`group relative glass-card rounded-2xl p-5 ${scheme.border} ${
        onClick ? 'cursor-pointer' : ''
      } overflow-hidden`}
    >
      {/* Ambient frosted glow bloom */}
      <div className={`absolute -top-12 -right-12 w-28 h-28 rounded-full blur-2xl pointer-events-none transition-opacity duration-300 opacity-40 group-hover:opacity-85 ${scheme.glow}`} />

      <div className="relative z-10 flex items-start justify-between">
        <div>
          <span className="text-[11px] font-heading font-semibold uppercase tracking-wider text-slate-400/90">
            {title}
          </span>
          <div className="text-3xl font-extrabold text-white font-mono mt-1.5 tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]">
            {value}
          </div>
        </div>

        {Icon && (
          <div className={`p-2.5 rounded-xl border backdrop-blur-md transition group-hover:scale-105 ${scheme.iconBg}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="relative z-10 mt-3.5 pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs">
        <span className="text-slate-400 truncate max-w-[140px] font-medium">{description}</span>
        {trend && (
          <span
            className={`flex items-center font-medium font-mono text-[11px] px-2 py-0.5 rounded-full border ${
              trendPositive
                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                : 'bg-slate-800/80 text-slate-300 border-slate-700/60'
            }`}
          >
            {trendPositive ? (
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5 text-emerald-400" />
            ) : (
              <ArrowDownRight className="w-3.5 h-3.5 mr-0.5 text-slate-400" />
            )}
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}

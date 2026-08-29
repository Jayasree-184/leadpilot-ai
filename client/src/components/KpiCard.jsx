import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function KpiCard({
  title,
  value,
  description,
  trend,
  trendPositive = true,
  icon: Icon,
  accentColor = 'blue',
  onClick
}) {
  const colorMap = {
    blue: {
      border: 'hover:border-blue-500/30',
      iconBg: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      glow: 'group-hover:bg-blue-500/5'
    },
    rose: {
      border: 'hover:border-rose-500/30',
      iconBg: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      glow: 'group-hover:bg-rose-500/5'
    },
    amber: {
      border: 'hover:border-amber-500/30',
      iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      glow: 'group-hover:bg-amber-500/5'
    },
    slate: {
      border: 'hover:border-slate-500/30',
      iconBg: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
      glow: 'group-hover:bg-slate-500/5'
    },
    emerald: {
      border: 'hover:border-emerald-500/30',
      iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      glow: 'group-hover:bg-emerald-500/5'
    }
  };

  const scheme = colorMap[accentColor] || colorMap.blue;

  return (
    <div
      onClick={onClick}
      className={`group relative bg-[#0f1523] rounded-xl border border-white/10 p-5 shadow-card transition-all duration-200 ${scheme.border} ${
        onClick ? 'cursor-pointer hover:-translate-y-0.5' : ''
      } overflow-hidden`}
    >
      {/* Subtle hover background highlight */}
      <div className={`absolute inset-0 transition-colors duration-300 pointer-events-none ${scheme.glow}`} />

      <div className="relative z-10 flex items-start justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {title}
          </span>
          <div className="text-3xl font-extrabold text-white font-mono mt-1.5 tracking-tight">
            {value}
          </div>
        </div>

        {Icon && (
          <div className={`p-2.5 rounded-xl border ${scheme.iconBg}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="relative z-10 mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
        <span className="text-slate-400 truncate max-w-[140px]">{description}</span>
        {trend && (
          <span
            className={`flex items-center font-medium font-mono text-[11px] ${
              trendPositive ? 'text-emerald-400' : 'text-slate-400'
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

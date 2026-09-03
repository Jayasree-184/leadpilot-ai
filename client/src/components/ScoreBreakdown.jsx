import React from 'react';
import { Layers, Building2, DollarSign, Cpu, MapPin, Activity } from 'lucide-react';

export default function ScoreBreakdown({ breakdown = {}, totalScore = 0 }) {
  const dimensions = [
    {
      id: 'industryFit',
      label: 'Industry Fit',
      value: breakdown.industryFit ?? 0,
      max: 25,
      icon: <Layers className="w-3.5 h-3.5 text-purple-400" />,
      gradient: 'from-purple-500 to-indigo-500',
      shadow: 'shadow-[0_0_8px_rgba(168,85,247,0.5)]'
    },
    {
      id: 'companySize',
      label: 'Company Size',
      value: breakdown.companySize ?? 0,
      max: 20,
      icon: <Building2 className="w-3.5 h-3.5 text-indigo-400" />,
      gradient: 'from-indigo-500 to-cyan-500',
      shadow: 'shadow-[0_0_8px_rgba(99,102,241,0.5)]'
    },
    {
      id: 'revenuePotential',
      label: 'Revenue Potential',
      value: breakdown.revenuePotential ?? 0,
      max: 20,
      icon: <DollarSign className="w-3.5 h-3.5 text-emerald-400" />,
      gradient: 'from-emerald-500 to-teal-400',
      shadow: 'shadow-[0_0_8px_rgba(16,185,129,0.5)]'
    },
    {
      id: 'techFit',
      label: 'Technology Fit',
      value: breakdown.techFit ?? 0,
      max: 15,
      icon: <Cpu className="w-3.5 h-3.5 text-cyan-400" />,
      gradient: 'from-cyan-500 to-blue-400',
      shadow: 'shadow-[0_0_8px_rgba(6,182,212,0.5)]'
    },
    {
      id: 'locationFit',
      label: 'Location Fit',
      value: breakdown.locationFit ?? 0,
      max: 10,
      icon: <MapPin className="w-3.5 h-3.5 text-purple-400" />,
      gradient: 'from-purple-500 to-pink-500',
      shadow: 'shadow-[0_0_8px_rgba(168,85,247,0.5)]'
    },
    {
      id: 'otherSignals',
      label: 'Other Signals',
      value: breakdown.otherSignals ?? 0,
      max: 10,
      icon: <Activity className="w-3.5 h-3.5 text-amber-400" />,
      gradient: 'from-amber-500 to-rose-400',
      shadow: 'shadow-[0_0_8px_rgba(245,158,11,0.5)]'
    }
  ];

  return (
    <div className="glass-panel rounded-3xl p-6 flex flex-col justify-between shadow-glass-lg relative overflow-hidden">
      <div>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-heading font-semibold text-white tracking-tight flex items-center gap-2">
            <span>Why this lead?</span>
            <span className="text-[10px] font-mono font-medium text-slate-300 glass-pill px-2.5 py-0.5 rounded-full">
              Explainable AI Rubric
            </span>
          </h3>
          <span className="text-xs font-mono font-medium text-slate-300 glass-pill px-2.5 py-1 rounded-full">
            Total: <strong className="text-white text-sm">{totalScore}</strong> / 100
          </span>
        </div>

        <div className="space-y-3.5">
          {dimensions.map(dim => {
            const percentage = Math.min(100, Math.round((dim.value / dim.max) * 100));
            return (
              <div key={dim.id} className="group">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2 text-slate-300 font-medium">
                    {dim.icon}
                    <span>{dim.label}</span>
                  </div>
                  <div className="font-mono text-slate-400 text-[11px]">
                    <span className="text-slate-100 font-semibold">{dim.value}</span>
                    <span className="text-slate-500"> / {dim.max}</span>
                  </div>
                </div>

                {/* Frosted Progress Bar Trough */}
                <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${dim.gradient} ${dim.shadow} transition-all duration-700 ease-out`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
        <span>6-factor algorithmic score breakdown</span>
        <span className="font-mono text-cyan-300 font-semibold drop-shadow-[0_0_6px_rgba(6,182,212,0.5)]">
          100% Auditable & Deterministic
        </span>
      </div>
    </div>
  );
}

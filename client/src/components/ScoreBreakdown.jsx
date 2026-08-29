import React from 'react';
import { Layers, Building2, DollarSign, Cpu, MapPin, Activity } from 'lucide-react';

export default function ScoreBreakdown({ breakdown = {}, totalScore = 0 }) {
  const dimensions = [
    {
      id: 'industryFit',
      label: 'Industry Fit',
      value: breakdown.industryFit ?? 0,
      max: 25,
      icon: <Layers className="w-3.5 h-3.5 text-blue-400" />,
      color: 'bg-blue-500'
    },
    {
      id: 'companySize',
      label: 'Company Size',
      value: breakdown.companySize ?? 0,
      max: 20,
      icon: <Building2 className="w-3.5 h-3.5 text-indigo-400" />,
      color: 'bg-indigo-500'
    },
    {
      id: 'revenuePotential',
      label: 'Revenue Potential',
      value: breakdown.revenuePotential ?? 0,
      max: 20,
      icon: <DollarSign className="w-3.5 h-3.5 text-emerald-400" />,
      color: 'bg-emerald-500'
    },
    {
      id: 'techFit',
      label: 'Technology Fit',
      value: breakdown.techFit ?? 0,
      max: 15,
      icon: <Cpu className="w-3.5 h-3.5 text-cyan-400" />,
      color: 'bg-cyan-500'
    },
    {
      id: 'locationFit',
      label: 'Location Fit',
      value: breakdown.locationFit ?? 0,
      max: 10,
      icon: <MapPin className="w-3.5 h-3.5 text-violet-400" />,
      color: 'bg-violet-500'
    },
    {
      id: 'otherSignals',
      label: 'Other Signals',
      value: breakdown.otherSignals ?? 0,
      max: 10,
      icon: <Activity className="w-3.5 h-3.5 text-amber-400" />,
      color: 'bg-amber-500'
    }
  ];

  return (
    <div className="bg-[#0f1523] rounded-2xl border border-white/10 p-6 flex flex-col justify-between shadow-xl">
      <div>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-semibold text-white tracking-tight flex items-center gap-2">
            <span>Why this lead?</span>
            <span className="text-[11px] font-normal text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-full border border-slate-700">
              Explainable AI Rubric
            </span>
          </h3>
          <span className="text-xs font-mono font-medium text-slate-400">
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
                    <span className="text-slate-200 font-semibold">{dim.value}</span>
                    <span className="text-slate-500"> / {dim.max}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="h-1.5 w-full bg-slate-800/90 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ease-out ${dim.color}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <span>6-factor algorithmic score breakdown</span>
        <span className="font-mono text-emerald-400 font-medium">100% Deterministic & Auditable</span>
      </div>
    </div>
  );
}

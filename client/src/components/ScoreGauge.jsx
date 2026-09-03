import React, { useEffect, useState } from 'react';
import { Sparkles, ShieldCheck } from 'lucide-react';

export default function ScoreGauge({ score = 0, category = 'COLD', confidence = 'HIGH' }) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = Math.min(100, Math.max(0, score || 0));
    if (end === 0) {
      setAnimatedScore(0);
      return;
    }
    const duration = 650;
    const stepTime = 16;
    const steps = duration / stepTime;
    const increment = end / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setAnimatedScore(end);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.round(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [score]);

  // Semi-circle SVG parameters
  const radius = 80;
  const circumference = Math.PI * radius; // Half-circle perimeter
  const percent = Math.min(100, Math.max(0, animatedScore)) / 100;
  const strokeDashoffset = circumference * (1 - percent);

  let colorGradientId = 'coldGradient';
  let badgeClasses = 'badge-cold';
  let glowColor = 'rgba(6, 182, 212, 0.3)';
  let categoryLabel = 'COLD LEAD';
  let priorityLabel = 'LOW PRIORITY';

  if (category === 'HOT' || animatedScore >= 85) {
    colorGradientId = 'hotGradient';
    badgeClasses = 'badge-hot';
    glowColor = 'rgba(244, 63, 94, 0.38)';
    categoryLabel = 'HOT LEAD';
    priorityLabel = 'HIGH PRIORITY';
  } else if (category === 'WARM' || animatedScore >= 70) {
    colorGradientId = 'warmGradient';
    badgeClasses = 'badge-warm';
    glowColor = 'rgba(245, 158, 11, 0.38)';
    categoryLabel = 'WARM LEAD';
    priorityLabel = 'MEDIUM PRIORITY';
  }

  return (
    <div className="relative flex flex-col items-center justify-center p-6 glass-panel rounded-3xl shadow-glass-lg overflow-hidden group">
      {/* Background ambient neon bloom */}
      <div
        className="absolute -top-10 w-56 h-56 rounded-full blur-3xl pointer-events-none transition-all duration-700 opacity-60"
        style={{ backgroundColor: glowColor }}
      />

      <div className="w-full flex items-center justify-between mb-4 z-10">
        <div className="flex items-center gap-2 text-xs font-heading font-semibold text-slate-300 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>AI LEAD SCORE</span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-300 glass-pill px-2.5 py-1 rounded-full">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Confidence: <strong className="text-white uppercase">{confidence}</strong></span>
        </div>
      </div>

      {/* Semi-Circular SVG Gauge */}
      <div className="relative w-48 h-28 flex items-end justify-center my-2 z-10">
        <svg viewBox="0 0 200 115" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="hotGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f43f5e" />
              <stop offset="100%" stopColor="#fb7185" />
            </linearGradient>
            <linearGradient id="warmGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#fbbf24" />
            </linearGradient>
            <linearGradient id="coldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
            <filter id="gaugeShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="currentColor" floodOpacity="0.5" />
            </filter>
          </defs>

          {/* Background Track Arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="14"
            strokeLinecap="round"
          />

          {/* Animated Value Arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke={`url(#${colorGradientId})`}
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Center Score Display */}
        <div className="absolute bottom-0 text-center flex flex-col items-center">
          <span className="text-4xl font-extrabold tracking-tight text-white font-mono leading-none drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]">
            {animatedScore}
          </span>
          <span className="text-[11px] font-semibold text-slate-400 mt-0.5">
            / 100
          </span>
        </div>
      </div>

      {/* Category and Priority Badges */}
      <div className="flex items-center gap-2 mt-4 z-10">
        <span className={`px-3 py-1 text-xs font-heading font-bold rounded-xl tracking-wide uppercase ${badgeClasses}`}>
          {categoryLabel}
        </span>
        <span className="px-2.5 py-1 text-[11px] font-medium glass-pill text-slate-300 rounded-xl uppercase tracking-wide">
          {priorityLabel}
        </span>
      </div>
    </div>
  );
}

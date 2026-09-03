import React, { useState, useEffect } from 'react';
import {
  Users,
  Flame,
  Sun,
  Snowflake,
  Activity,
  Plus,
  UploadCloud,
  ArrowRight,
  Sparkles,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import KpiCard from '../components/KpiCard';
import PriorityChart from '../components/PriorityChart';
import { api } from '../services/api';
import { getCategoryBadge } from '../utils/formatters';

export default function Dashboard({ onNavigate, onOpenAddLead }) {
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState({
    totalLeads: 0,
    hotLeads: 0,
    warmLeads: 0,
    coldLeads: 0,
    averageScore: 0
  });
  const [topOpportunities, setTopOpportunities] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await api.getLeads({ sort: 'score:desc', limit: 5 });
      if (res.success) {
        setTopOpportunities(res.data || []);
        if (res.kpis) {
          setKpis(res.kpis);
        }
      }
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in relative z-10">
      {/* Hero Header on Frosted Glass */}
      <div className="glass-panel rounded-3xl p-6 md:p-8 shadow-glass-lg flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative overflow-hidden border border-purple-500/20">
        {/* Internal ambient flare */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-500/15 via-cyan-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2">
            <span className="glass-pill px-3 py-1 rounded-full flex items-center gap-1.5 border border-purple-400/30 text-cyan-300 shadow-glow-accent">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span className="font-heading">Good morning</span>
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white font-heading tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
            Prioritize the leads that matter.
          </h1>
          <p className="text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed font-sans">
            AI-powered lead qualification that turns raw data into your next best outreach action.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 relative z-10 shrink-0">
          <button
            onClick={() => onNavigate('import')}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-medium glass-btn-secondary text-slate-200 rounded-xl transition active:scale-95"
          >
            <UploadCloud className="w-4 h-4 text-slate-300" />
            <span>Import CSV</span>
          </button>

          <button
            onClick={onOpenAddLead}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold glass-btn-primary text-white rounded-xl transition active:scale-95 shadow-glow-accent"
          >
            <Plus className="w-4 h-4" />
            <span>Add Lead</span>
          </button>
        </div>
      </div>

      {/* KPI Cards (5 Cards Grid) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <KpiCard
          title="Total Leads"
          value={loading ? '...' : kpis.totalLeads}
          description="Active pipeline accounts"
          trend="+12.5%"
          trendPositive={true}
          icon={Users}
          accentColor="purple"
          onClick={() => onNavigate('leads')}
        />

        <KpiCard
          title="Hot Leads"
          value={loading ? '...' : kpis.hotLeads}
          description="Score 85+ (Immediate action)"
          trend="+8.2%"
          trendPositive={true}
          icon={Flame}
          accentColor="rose"
          onClick={() => onNavigate('leads', { initialCategory: 'HOT' })}
        />

        <KpiCard
          title="Warm Leads"
          value={loading ? '...' : kpis.warmLeads}
          description="Score 70-84 (Nurture / pitch)"
          trend="+4.1%"
          trendPositive={true}
          icon={Sun}
          accentColor="amber"
          onClick={() => onNavigate('leads', { initialCategory: 'WARM' })}
        />

        <KpiCard
          title="Cold Leads"
          value={loading ? '...' : kpis.coldLeads}
          description="Score <70 (Low touch)"
          trend="-2.4%"
          trendPositive={false}
          icon={Snowflake}
          accentColor="cyan"
          onClick={() => onNavigate('leads', { initialCategory: 'COLD' })}
        />

        <KpiCard
          title="Average Score"
          value={loading ? '...' : kpis.averageScore}
          description="ICP fit quality index"
          trend="+5 pts"
          trendPositive={true}
          icon={Activity}
          accentColor="emerald"
        />
      </div>

      {/* Dual Section: Lead Priority Visualization & Top Opportunities */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Lead Priority Distribution Chart (5 cols) */}
        <div className="lg:col-span-5">
          <PriorityChart
            hotCount={kpis.hotLeads}
            warmCount={kpis.warmLeads}
            coldCount={kpis.coldLeads}
            total={kpis.totalLeads}
          />
        </div>

        {/* Right: Top Opportunities (7 cols) */}
        <div className="lg:col-span-7 glass-panel rounded-3xl p-6 shadow-glass-lg flex flex-col justify-between relative overflow-hidden">
          {/* Ambient background glow */}
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-heading font-semibold text-white tracking-tight flex items-center gap-2">
                  <Flame className="w-4 h-4 text-rose-400 drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]" />
                  <span>Top Opportunities</span>
                </h3>
                <p className="text-xs text-slate-400">Highest-scoring leads ready for immediate executive outreach</p>
              </div>

              <button
                onClick={() => onNavigate('leads', { initialSort: 'score:desc' })}
                className="flex items-center gap-1.5 text-xs text-cyan-300 hover:text-cyan-200 glass-pill px-3 py-1 rounded-full font-medium transition"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Opportunities List on Frosted Glass */}
            <div className="space-y-2.5">
              {loading ? (
                <div className="py-12 text-center text-xs text-slate-500">Loading top opportunities...</div>
              ) : topOpportunities.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500">No leads available.</div>
              ) : (
                topOpportunities.map((lead) => {
                  const badge = getCategoryBadge(lead.category);
                  const reasonSnippet = (lead.reasons && lead.reasons[0]) || 'Strong ICP fit & expansion signals';

                  return (
                    <div
                      key={lead._id}
                      onClick={() => onNavigate('lead-detail', { leadId: lead._id })}
                      className="group flex items-center justify-between p-3.5 rounded-2xl glass-card transition cursor-pointer"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        {/* Score Badge Indicator */}
                        <div className="w-10 h-10 rounded-xl bg-black/40 flex flex-col items-center justify-center font-mono shrink-0 border border-white/10 group-hover:border-purple-400/40 transition shadow-inner">
                          <span className="text-sm font-bold text-white leading-none">{lead.score ?? '—'}</span>
                          <span className="text-[9px] text-slate-400">PTS</span>
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-heading font-semibold text-white truncate group-hover:text-cyan-300 transition">
                              {lead.companyName}
                            </span>
                            <span className="text-[11px] text-slate-400 shrink-0">
                              {lead.industry} • {lead.location?.split(',')[0]}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 truncate mt-0.5 max-w-md font-sans">
                            "{reasonSnippet}"
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 ml-3">
                        <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-lg ${badge.classes}`}>
                          {badge.label}
                        </span>
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-200 transition" />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="mt-4 pt-3.5 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
            <span>Ranked by multi-dimensional ICP algorithm</span>
            <span className="text-cyan-300 hover:text-cyan-200 hover:underline cursor-pointer font-medium font-heading" onClick={() => onNavigate('leads')}>
              Explore full pipeline →
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

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
      // Fetch sorted by score to get top opportunities & KPI aggregations
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
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Good morning</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Prioritize the leads that matter.
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            AI-powered qualification that turns lead data into your next best sales action.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('import')}
            className="flex items-center gap-2 px-4 py-2 text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-xl border border-slate-700/80 hover:border-slate-600 transition active:scale-95"
          >
            <UploadCloud className="w-4 h-4 text-slate-400" />
            <span>Import CSV</span>
          </button>

          <button
            onClick={onOpenAddLead}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-glow-blue transition active:scale-95"
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
          accentColor="blue"
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
          accentColor="slate"
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
        <div className="lg:col-span-7 bg-[#0f1523] rounded-2xl border border-white/10 p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-white tracking-tight flex items-center gap-2">
                  <Flame className="w-4 h-4 text-rose-400" />
                  <span>Top Opportunities</span>
                </h3>
                <p className="text-xs text-slate-400">Highest-scoring leads ready for immediate executive outreach</p>
              </div>

              <button
                onClick={() => onNavigate('leads', { initialSort: 'score:desc' })}
                className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-medium transition"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Opportunities List */}
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
                      className="group flex items-center justify-between p-3.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/80 hover:border-slate-700 transition cursor-pointer"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        {/* Score Circle Indicator */}
                        <div className="w-10 h-10 rounded-xl bg-slate-800 flex flex-col items-center justify-center font-mono shrink-0 border border-slate-700/60 group-hover:border-blue-500/40 transition">
                          <span className="text-sm font-bold text-white leading-none">{lead.score ?? '—'}</span>
                          <span className="text-[9px] text-slate-400">PTS</span>
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-white truncate group-hover:text-blue-400 transition">
                              {lead.companyName}
                            </span>
                            <span className="text-[11px] text-slate-400 shrink-0">
                              {lead.industry} • {lead.location?.split(',')[0]}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 truncate mt-0.5 max-w-md">
                            "{reasonSnippet}"
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 ml-3">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${badge.classes}`}>
                          {badge.label}
                        </span>
                        <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-300 transition" />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
            <span>Ranked by multi-dimensional ICP algorithm</span>
            <span className="text-blue-400 hover:underline cursor-pointer" onClick={() => onNavigate('leads')}>
              Explore full lead list →
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

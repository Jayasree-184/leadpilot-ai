import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Filter,
  Download,
  Plus,
  ArrowUpDown,
  ExternalLink,
  Flame,
  Sun,
  Snowflake,
  RefreshCw,
  Trash2,
  ChevronRight,
  Sparkles,
  X
} from 'lucide-react';
import { api } from '../services/api';
import { getCategoryBadge } from '../utils/formatters';
import { downloadLeadsAsCsv } from '../utils/exportCsv';
import { useToast } from '../components/Toast';

export default function LeadsList({ onNavigate, onOpenAddLead, initialFilter = {} }) {
  const { addToast } = useToast();
  const searchInputRef = useRef(null);

  const [leads, setLeads] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [reanalyzingId, setReanalyzingId] = useState(null);

  // Filters & State
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [industry, setIndustry] = useState(initialFilter.industry || 'ALL');
  const [location, setLocation] = useState(initialFilter.location || 'ALL');
  const [category, setCategory] = useState(initialFilter.category || 'ALL');
  const [scoreRange, setScoreRange] = useState(initialFilter.scoreRange || 'ALL');
  const [sort, setSort] = useState(initialFilter.sort || 'score:desc');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 250);
    return () => clearTimeout(timer);
  }, [search]);

  // Focus search when triggered from AppShell
  useEffect(() => {
    if (initialFilter.autoFocusSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [initialFilter]);

  // Fetch leads on filter change
  useEffect(() => {
    fetchLeads();
  }, [debouncedSearch, industry, location, category, scoreRange, sort]);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const params = {
        search: debouncedSearch,
        sort,
        limit: 100
      };

      if (industry !== 'ALL') params.industry = industry;
      if (location !== 'ALL') params.location = location;
      if (category !== 'ALL') params.category = category;

      if (scoreRange === '80+') params.scoreMin = 80;
      else if (scoreRange === '60+') { params.scoreMin = 60; params.scoreMax = 79; }
      else if (scoreRange === '40+') { params.scoreMin = 40; params.scoreMax = 59; }
      else if (scoreRange === 'below40') params.scoreMax = 39;

      const res = await api.getLeads(params);
      if (res.success) {
        setLeads(res.data || []);
        setTotalCount(res.pagination?.total ?? res.data?.length ?? 0);
      }
    } catch (err) {
      console.error('Error fetching leads:', err);
      addToast('Failed to load leads', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setSearch('');
    setDebouncedSearch('');
    setIndustry('ALL');
    setLocation('ALL');
    setCategory('ALL');
    setScoreRange('ALL');
    setSort('score:desc');
  };

  const handleExport = () => {
    if (leads.length === 0) {
      addToast('No leads to export matching current criteria', 'error');
      return;
    }
    downloadLeadsAsCsv(leads, `leadpilot_export_${new Date().toISOString().slice(0, 10)}.csv`);
    addToast(`Exported ${leads.length} leads to CSV`, 'success');
  };

  const handleReanalyze = async (e, leadId) => {
    e.stopPropagation();
    setReanalyzingId(leadId);
    try {
      const res = await api.reanalyzeLead(leadId);
      if (res.success) {
        addToast(`Lead re-analyzed: New Score ${res.data.score}`, 'success');
        setLeads(prev => prev.map(l => (l._id === leadId ? res.data : l)));
      }
    } catch (err) {
      addToast('Re-analysis failed', 'error');
    } finally {
      setReanalyzingId(null);
    }
  };

  const handleDelete = async (e, leadId, companyName) => {
    e.stopPropagation();
    if (!window.confirm(`Delete lead "${companyName}"?`)) return;
    try {
      await api.deleteLead(leadId);
      addToast(`Deleted lead "${companyName}"`, 'success');
      setLeads(prev => prev.filter(l => l._id !== leadId));
      setTotalCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      addToast('Failed to delete lead', 'error');
    }
  };

  const hasActiveFilters = search || industry !== 'ALL' || location !== 'ALL' || category !== 'ALL' || scoreRange !== 'ALL';

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in relative z-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold font-heading text-white tracking-tight">Leads Intelligence</h1>
          <span className="glass-pill px-3 py-1 text-xs font-mono font-medium rounded-full text-cyan-300 border border-purple-400/30">
            {totalCount} {totalCount === 1 ? 'account' : 'accounts'}
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 text-xs font-medium glass-btn-secondary text-slate-200 rounded-xl transition active:scale-95"
          >
            <Download className="w-3.5 h-3.5 text-slate-300" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={onOpenAddLead}
            className="flex items-center gap-2 px-4.5 py-2 text-xs font-semibold glass-btn-primary text-white rounded-xl transition active:scale-95 shadow-glow-accent"
          >
            <Plus className="w-4 h-4" />
            <span>Add Lead</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Glass Bar */}
      <div className="glass-panel rounded-3xl p-5 space-y-4 shadow-glass-md border border-white/10">
        {/* Row 1: Search input + Select Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search Box */}
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              ref={searchInputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search companies, contacts, technologies..."
              className="w-full pl-10 pr-12 py-2.5 text-sm glass-input rounded-xl text-white placeholder:text-slate-500 focus:outline-none"
            />
            {search ? (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded bg-black/40 text-[10px] font-mono text-slate-400 border border-white/10 pointer-events-none">
                /
              </kbd>
            )}
          </div>

          {/* Industry Filter */}
          <div className="sm:col-span-3">
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs font-medium glass-input rounded-xl text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Industries</option>
              <option value="SaaS">SaaS</option>
              <option value="AI & Analytics">AI & Analytics</option>
              <option value="Cybersecurity">Cybersecurity</option>
              <option value="Fintech">Fintech</option>
              <option value="HealthTech">HealthTech</option>
              <option value="Logistics & Supply Chain">Logistics</option>
              <option value="EdTech">EdTech</option>
              <option value="Manufacturing">Manufacturing</option>
              <option value="Retail & E-commerce">Retail</option>
            </select>
          </div>

          {/* Location Filter */}
          <div className="sm:col-span-3">
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs font-medium glass-input rounded-xl text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Locations</option>
              <option value="Bangalore">Bangalore</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Chennai">Chennai</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Pune">Pune</option>
              <option value="Delhi">Delhi NCR</option>
              <option value="Kolkata">Kolkata</option>
            </select>
          </div>
        </div>

        {/* Row 2: Status & Score Range Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/[0.08]">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-heading font-semibold text-slate-400 mr-1">Status:</span>
            {['ALL', 'HOT', 'WARM', 'COLD'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition duration-150 ${
                  category === cat
                    ? 'glass-btn-primary text-white shadow-glow-accent font-semibold'
                    : 'glass-pill text-slate-400 hover:text-slate-200 hover:bg-white/[0.06]'
                }`}
              >
                {cat}
              </button>
            ))}

            <div className="h-4 w-[1px] bg-white/10 mx-2 hidden sm:block" />

            <span className="text-xs font-heading font-semibold text-slate-400 mr-1">Score:</span>
            {[
              { id: 'ALL', label: 'All' },
              { id: '80+', label: '80+' },
              { id: '60+', label: '60-79' },
              { id: '40+', label: '40-59' },
              { id: 'below40', label: '<40' }
            ].map((sr) => (
              <button
                key={sr.id}
                onClick={() => setScoreRange(sr.id)}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition duration-150 ${
                  scoreRange === sr.id
                    ? 'bg-gradient-to-r from-purple-600/60 to-cyan-500/60 text-white border border-purple-400/40 shadow-glow-accent font-semibold'
                    : 'glass-pill text-slate-400 hover:text-slate-200 hover:bg-white/[0.06]'
                }`}
              >
                {sr.label}
              </button>
            ))}
          </div>

          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="text-xs text-rose-400 hover:text-rose-300 font-medium glass-pill px-3 py-1 rounded-lg transition"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Main Leads Data Table on Frosted Glass */}
      <div className="glass-panel rounded-3xl shadow-glass-lg overflow-hidden border border-white/10">
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center space-y-3">
            <div className="w-8 h-8 rounded-full border-2 border-purple-400/30 border-t-cyan-400 animate-spin shadow-glow-accent" />
            <p className="text-xs font-medium text-slate-400 font-heading">Loading qualification pipeline...</p>
          </div>
        ) : leads.length === 0 ? (
          /* Empty State */
          <div className="py-20 px-4 text-center max-w-md mx-auto space-y-4">
            <div className="w-14 h-14 rounded-2xl glass-pill text-slate-400 flex items-center justify-center mx-auto border border-white/10 shadow-glass-sm">
              <Filter className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-base font-heading font-semibold text-white">
                {hasActiveFilters ? 'No leads match your filters' : 'No leads yet'}
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {hasActiveFilters
                  ? 'Try adjusting your search query, score thresholds, or industry filters.'
                  : 'Import your existing lead list or add your first lead to start prioritizing opportunities.'}
              </p>
            </div>
            {hasActiveFilters ? (
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 text-xs font-medium text-slate-300 glass-btn-secondary rounded-xl transition"
              >
                Clear all filters
              </button>
            ) : (
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => onNavigate('import')}
                  className="px-4 py-2 text-xs font-medium glass-btn-secondary text-slate-200 rounded-xl"
                >
                  Import Leads
                </button>
                <button
                  onClick={onOpenAddLead}
                  className="px-4 py-2 text-xs font-semibold glass-btn-primary text-white rounded-xl shadow-glow-accent"
                >
                  Add Lead
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02] text-[11px] font-heading font-semibold text-slate-400 uppercase tracking-wider select-none">
                  <th className="py-3.5 px-4">Company</th>
                  <th className="py-3.5 px-4">Industry</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Employees</th>
                  <th className="py-3.5 px-4">Revenue</th>
                  <th className="py-3.5 px-4">
                    <button
                      onClick={() => setSort(sort === 'score:desc' ? 'score:asc' : 'score:desc')}
                      className="flex items-center gap-1 hover:text-white transition uppercase"
                    >
                      <span>AI Score</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-500" />
                    </button>
                  </th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {leads.map((lead) => {
                  const badge = getCategoryBadge(lead.category);
                  const isReanalyzing = reanalyzingId === lead._id;

                  return (
                    <tr
                      key={lead._id}
                      onClick={() => onNavigate('lead-detail', { leadId: lead._id })}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') onNavigate('lead-detail', { leadId: lead._id });
                      }}
                      className="group hover:bg-white/[0.05] cursor-pointer transition focus:bg-white/[0.07] focus:outline-none"
                    >
                      {/* Company Name & Website */}
                      <td className="py-3.5 px-4">
                        <div className="font-heading font-semibold text-white group-hover:text-cyan-300 transition flex items-center gap-1.5">
                          <span>{lead.companyName}</span>
                          {lead.website && (
                            <a
                              href={lead.website}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-slate-500 hover:text-cyan-300 transition"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                        {lead.contactName && (
                          <div className="text-[11px] text-slate-400 truncate max-w-xs mt-0.5">
                            {lead.contactName} • {lead.contactRole || 'Decision Maker'}
                          </div>
                        )}
                      </td>

                      {/* Industry */}
                      <td className="py-3.5 px-4 text-xs text-slate-300 font-medium">
                        {lead.industry}
                      </td>

                      {/* Location */}
                      <td className="py-3.5 px-4 text-xs text-slate-400">
                        {lead.location}
                      </td>

                      {/* Employees */}
                      <td className="py-3.5 px-4 text-xs font-mono text-slate-300">
                        {lead.employees ? lead.employees.toLocaleString() : '—'}
                      </td>

                      {/* Revenue */}
                      <td className="py-3.5 px-4 text-xs font-mono text-slate-300">
                        {lead.revenue || '—'}
                      </td>

                      {/* AI Score */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-mono font-bold text-sm px-2.5 py-0.5 rounded-lg border ${
                              (lead.score || 0) >= 85
                                ? 'bg-rose-500/15 text-rose-300 border-rose-500/30 shadow-[0_0_8px_rgba(244,63,94,0.3)]'
                                : (lead.score || 0) >= 70
                                ? 'bg-amber-500/15 text-amber-300 border-amber-500/30 shadow-[0_0_8px_rgba(245,158,11,0.3)]'
                                : 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20'
                            }`}
                          >
                            {lead.score ?? '—'}
                          </span>
                        </div>
                      </td>

                      {/* Category Status */}
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 text-[11px] font-bold rounded-lg ${badge.classes}`}>
                          {badge.label}
                        </span>
                      </td>

                      {/* Quick Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={(e) => handleReanalyze(e, lead._id)}
                            disabled={isReanalyzing}
                            title="Re-analyze AI qualification"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-white/[0.08] transition"
                          >
                            <RefreshCw className={`w-3.5 h-3.5 ${isReanalyzing ? 'animate-spin text-cyan-400' : ''}`} />
                          </button>

                          <button
                            onClick={(e) => handleDelete(e, lead._id, lead.companyName)}
                            title="Delete lead"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-white/[0.08] transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  RefreshCw,
  ExternalLink,
  Mail,
  Phone,
  User,
  Zap,
  Target,
  CheckCircle2,
  Building2,
  Cpu,
  DollarSign,
  Users,
  MapPin,
  Sparkles,
  Share2,
  Globe,
  Copy,
  Check
} from 'lucide-react';
import ScoreGauge from '../components/ScoreGauge';
import ScoreBreakdown from '../components/ScoreBreakdown';
import OutreachGenerator from '../components/OutreachGenerator';
import { api } from '../services/api';
import { formatRelativeTime } from '../utils/formatters';
import { useToast } from '../components/Toast';

export default function LeadDetails({ leadId, onNavigate }) {
  const { addToast } = useToast();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reanalyzing, setReanalyzing] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  useEffect(() => {
    if (leadId) {
      fetchLead(leadId);
    }
  }, [leadId]);

  const fetchLead = async (id) => {
    setLoading(true);
    try {
      // Analyze / load cached lead
      const res = await api.analyzeLead(id);
      if (res.success) {
        setLead(res.data);
      }
    } catch (err) {
      console.error('Error loading lead detail:', err);
      addToast('Failed to load lead details', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleReanalyze = async () => {
    setReanalyzing(true);
    try {
      const res = await api.reanalyzeLead(leadId);
      if (res.success) {
        setLead(res.data);
        addToast(`Lead re-analyzed: New Score ${res.data.score}/100`, 'success');
        return res.data;
      }
    } catch (err) {
      addToast('Re-analysis failed', 'error');
    } finally {
      setReanalyzing(false);
    }
  };

  const handleCopyEmail = (email) => {
    if (!email) return;
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    addToast('Email copied to clipboard', 'success');
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  if (loading) {
    return (
      <div className="p-8 max-w-6xl mx-auto flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-10 h-10 rounded-full border-2 border-blue-500/30 border-t-blue-500 animate-spin" />
        <p className="text-sm font-medium text-slate-400">Loading AI intelligence workspace...</p>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="p-8 max-w-6xl mx-auto text-center space-y-4">
        <h2 className="text-lg font-bold text-white">Lead not found</h2>
        <button
          onClick={() => onNavigate('leads')}
          className="px-4 py-2 text-xs font-semibold bg-blue-600 text-white rounded-xl"
        >
          Return to Leads
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Top Bar Navigation & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('leads')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-medium text-slate-300 border border-slate-700/80 transition active:scale-95"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Leads</span>
          </button>

          <span className="text-slate-600">|</span>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Last analyzed:</span>
            <strong className="text-slate-300 font-mono font-normal">
              {formatRelativeTime(lead.analyzedAt)}
            </strong>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleReanalyze}
            disabled={reanalyzing}
            className="flex items-center gap-2 px-4 py-2 text-xs font-medium bg-slate-850 hover:bg-slate-800 text-slate-200 rounded-xl border border-slate-700/80 transition disabled:opacity-50 active:scale-95"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${reanalyzing ? 'animate-spin text-blue-400' : ''}`} />
            <span>{reanalyzing ? 'Re-analyzing...' : 'Re-analyze Lead'}</span>
          </button>
        </div>
      </div>

      {/* Header Profile */}
      <div className="bg-[#0f1523] rounded-2xl border border-white/10 p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              {lead.companyName}
            </h1>
            <span className="px-3 py-1 text-xs font-bold rounded-lg bg-blue-500/15 text-blue-400 border border-blue-500/30">
              {lead.industry}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              <span>{lead.location}</span>
            </span>

            {lead.website && (
              <a
                href={lead.website}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 font-medium transition"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>{lead.website.replace(/^https?:\/\//, '')}</span>
              </a>
            )}
          </div>
        </div>

        {/* Quick Company Metric Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6">
          <div className="bg-slate-900/80 px-3.5 py-2.5 rounded-xl border border-slate-800">
            <div className="text-[10px] uppercase font-semibold text-slate-400">Employees</div>
            <div className="text-sm font-bold font-mono text-white mt-0.5">
              {lead.employees ? lead.employees.toLocaleString() : '—'}
            </div>
          </div>

          <div className="bg-slate-900/80 px-3.5 py-2.5 rounded-xl border border-slate-800">
            <div className="text-[10px] uppercase font-semibold text-slate-400">Est. Revenue</div>
            <div className="text-sm font-bold font-mono text-emerald-400 mt-0.5">
              {lead.revenue || '—'}
            </div>
          </div>

          <div className="bg-slate-900/80 px-3.5 py-2.5 rounded-xl border border-slate-800 col-span-2 sm:col-span-1">
            <div className="text-[10px] uppercase font-semibold text-slate-400">Tech Stack</div>
            <div className="text-sm font-bold font-mono text-cyan-400 mt-0.5">
              {Array.isArray(lead.technologies) ? `${lead.technologies.length} Tools` : 'Standard'}
            </div>
          </div>
        </div>
      </div>

      {/* Row 1: Hero Score Gauge (5 cols) & Score Breakdown (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 flex flex-col">
          <ScoreGauge
            score={lead.score}
            category={lead.category}
            confidence={lead.confidence}
          />
        </div>

        <div className="lg:col-span-7 flex flex-col">
          <ScoreBreakdown
            breakdown={lead.scoreBreakdown || {}}
            totalScore={lead.score || 0}
          />
        </div>
      </div>

      {/* Row 2: AI Qualification Insights & Recommended Decision Maker */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* AI Qualification ("Why it matters" checklist) */}
        <div className="md:col-span-7 bg-[#0f1523] rounded-2xl border border-white/10 p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <h3 className="text-base font-semibold text-white">AI Qualification Insights</h3>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                Priority: <strong className="text-white">{lead.category === 'HOT' ? 'HIGH' : lead.category === 'WARM' ? 'MEDIUM' : 'LOW'}</strong>
              </span>
            </div>
          </div>

          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-3">
              Why it matters
            </span>
            <div className="space-y-2.5">
              {Array.isArray(lead.reasons) && lead.reasons.length > 0 ? (
                lead.reasons.map((reason, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-200 leading-snug"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{reason}</span>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-400 italic">No specific signals recorded.</div>
              )}
            </div>
          </div>

          {/* Tech Stack Pills */}
          {Array.isArray(lead.technologies) && lead.technologies.length > 0 && (
            <div className="pt-3 border-t border-slate-800/80">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Identified Technologies
              </span>
              <div className="flex flex-wrap gap-1.5">
                {lead.technologies.map((tech, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 text-[11px] font-mono rounded-lg bg-slate-900 text-slate-300 border border-slate-800"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Recommended Decision Maker */}
        <div className="md:col-span-5 bg-[#0f1523] rounded-2xl border border-white/10 p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-800">
              <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <User className="w-4 h-4" />
              </div>
              <h3 className="text-base font-semibold text-white">Recommended Decision Maker</h3>
            </div>

            {lead.contactName ? (
              <div className="space-y-4">
                {/* Person Header */}
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center font-bold text-white text-base shadow-sm shrink-0">
                    {lead.contactName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">{lead.contactName}</h4>
                    <p className="text-xs text-indigo-300 font-medium">{lead.contactRole || 'Key Stakeholder'}</p>
                  </div>
                </div>

                {/* Contact Coordinates */}
                <div className="space-y-2 text-xs">
                  {/* Email */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                    <div className="flex items-center gap-2 text-slate-300 truncate">
                      <Mail className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span className="truncate">{lead.email || 'Email unavailable'}</span>
                    </div>
                    {lead.email && (
                      <button
                        onClick={() => handleCopyEmail(lead.email)}
                        className="text-slate-400 hover:text-white p-1 rounded transition shrink-0"
                        title="Copy Email"
                      >
                        {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-300">
                    <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{lead.phone || 'Phone unavailable'}</span>
                  </div>

                  {/* LinkedIn */}
                  {lead.linkedin ? (
                    <a
                      href={lead.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition"
                    >
                      <div className="flex items-center gap-2">
                        <Share2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <span>View LinkedIn Profile</span>
                      </div>
                      <ExternalLink className="w-3 h-3 text-slate-500" />
                    </a>
                  ) : null}
                </div>
              </div>
            ) : (
              <div className="py-8 text-center space-y-2">
                <p className="text-xs text-slate-400">Direct contact information unavailable.</p>
                <div className="text-xs font-medium text-indigo-400 bg-indigo-500/10 p-2.5 rounded-xl border border-indigo-500/20">
                  Target: {lead.decisionMaker || 'Chief Technology Officer (CTO)'}
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-500">
            Fictional demo data for technical assessment simulation.
          </div>
        </div>
      </div>

      {/* Row 3: Next Best Action & Best Outreach Angle (Visually Prominent!) */}
      <div className="bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-purple-950/40 rounded-2xl border border-blue-500/30 p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-5">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider">
            <Target className="w-4 h-4" />
            <span>Recommended Next Best Action</span>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              {lead.recommendedAction || `Contact ${lead.contactRole || 'the decision maker'} first.`}
            </h2>
            <p className="text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">
              Engineering growth and modern technology adoption indicate an immediate software expansion and infrastructure orchestration opportunity.
            </p>
          </div>

          {/* Best Outreach Angle */}
          <div className="pt-4 border-t border-white/10">
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider block mb-1.5">
              Best Outreach Angle
            </span>
            <p className="text-sm font-medium text-slate-200 bg-[#090d16]/80 p-4 rounded-xl border border-white/10 leading-relaxed">
              "{lead.outreachAngle || `Focus on engineering scalability, developer velocity, and reducing operational overhead as ${lead.companyName} expands.`}"
            </p>
          </div>
        </div>
      </div>

      {/* Row 4: AI Outreach Generator */}
      <OutreachGenerator
        initialSubject={lead.generatedSubject}
        initialMessage={lead.generatedMessage}
        decisionMaker={lead.decisionMaker || lead.contactName}
        companyName={lead.companyName}
        onRegenerate={handleReanalyze}
      />
    </div>
  );
}

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
        <div className="w-10 h-10 rounded-full border-2 border-purple-400/30 border-t-cyan-400 animate-spin shadow-glow-accent" />
        <p className="text-sm font-medium font-heading text-slate-300">Loading AI intelligence workspace...</p>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="p-8 max-w-6xl mx-auto text-center space-y-4">
        <h2 className="text-lg font-bold font-heading text-white">Lead not found</h2>
        <button
          onClick={() => onNavigate('leads')}
          className="px-4 py-2 text-xs font-semibold glass-btn-primary text-white rounded-xl shadow-glow-accent"
        >
          Return to Leads
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-8 animate-fade-in relative z-10">
      {/* Top Bar Navigation & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('leads')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl glass-btn-secondary text-xs font-medium text-slate-200 transition active:scale-95"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Leads</span>
          </button>

          <span className="text-white/20">|</span>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Last analyzed:</span>
            <strong className="text-slate-200 font-mono font-medium glass-pill px-2 py-0.5 rounded-md">
              {formatRelativeTime(lead.analyzedAt)}
            </strong>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleReanalyze}
            disabled={reanalyzing}
            className="flex items-center gap-2 px-4 py-2 text-xs font-medium glass-btn-secondary text-slate-200 rounded-xl transition disabled:opacity-50 active:scale-95"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${reanalyzing ? 'animate-spin text-cyan-400' : ''}`} />
            <span>{reanalyzing ? 'Re-analyzing...' : 'Re-analyze Lead'}</span>
          </button>
        </div>
      </div>

      {/* Header Profile on Frosted Glass */}
      <div className="glass-panel rounded-3xl p-6 md:p-8 shadow-glass-lg flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden border border-purple-500/20">
        {/* Ambient reflection */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-purple-500/15 via-cyan-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2.5 relative z-10">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold font-heading text-white tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)]">
              {lead.companyName}
            </h1>
            <span className="px-3 py-1 text-xs font-heading font-bold rounded-xl bg-purple-500/15 text-cyan-300 border border-purple-400/30 shadow-[0_0_12px_rgba(168,85,247,0.3)]">
              {lead.industry}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>{lead.location}</span>
            </span>

            {lead.website && (
              <a
                href={lead.website}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-cyan-300 hover:text-cyan-200 font-medium glass-pill px-2.5 py-0.5 rounded-full transition"
              >
                <Globe className="w-3 h-3" />
                <span>{lead.website.replace(/^https?:\/\//, '')}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>

        {/* Quick Company Metric Badges on Frosted Glass */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6 relative z-10">
          <div className="glass-card px-4 py-3 rounded-2xl">
            <div className="text-[10px] uppercase font-heading font-semibold text-slate-400">Employees</div>
            <div className="text-base font-bold font-mono text-white mt-0.5">
              {lead.employees ? lead.employees.toLocaleString() : '—'}
            </div>
          </div>

          <div className="glass-card px-4 py-3 rounded-2xl">
            <div className="text-[10px] uppercase font-heading font-semibold text-slate-400">Est. Revenue</div>
            <div className="text-base font-bold font-mono text-emerald-300 mt-0.5">
              {lead.revenue || '—'}
            </div>
          </div>

          <div className="glass-card px-4 py-3 rounded-2xl col-span-2 sm:col-span-1">
            <div className="text-[10px] uppercase font-heading font-semibold text-slate-400">Tech Stack</div>
            <div className="text-base font-bold font-mono text-cyan-300 mt-0.5">
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
        <div className="md:col-span-7 glass-panel rounded-3xl p-6 shadow-glass-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-300 border border-emerald-400/30 shadow-[0_0_12px_rgba(16,185,129,0.3)]">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <h3 className="text-base font-heading font-semibold text-white">AI Qualification Insights</h3>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-medium px-2.5 py-1 rounded-full glass-pill text-slate-200">
                Priority: <strong className="text-white">{lead.category === 'HOT' ? 'HIGH' : lead.category === 'WARM' ? 'MEDIUM' : 'LOW'}</strong>
              </span>
            </div>
          </div>

          <div>
            <span className="text-xs font-heading font-semibold text-slate-400 uppercase tracking-wider block mb-3">
              Why it matters
            </span>
            <div className="space-y-2.5">
              {Array.isArray(lead.reasons) && lead.reasons.length > 0 ? (
                lead.reasons.map((reason, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 p-3 rounded-xl glass-card text-xs text-slate-200 leading-snug"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5 drop-shadow-[0_0_6px_rgba(52,211,153,0.5)]" />
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
            <div className="pt-3.5 border-t border-white/10">
              <span className="text-[11px] font-heading font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Identified Technologies
              </span>
              <div className="flex flex-wrap gap-1.5">
                {lead.technologies.map((tech, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 text-[11px] font-mono rounded-lg glass-pill text-slate-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Recommended Decision Maker */}
        <div className="md:col-span-5 glass-panel rounded-3xl p-6 shadow-glass-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 pb-3 mb-4 border-b border-white/10">
              <div className="p-2 rounded-xl bg-purple-500/15 text-purple-300 border border-purple-400/30 shadow-[0_0_12px_rgba(168,85,247,0.3)]">
                <User className="w-4 h-4" />
              </div>
              <h3 className="text-base font-heading font-semibold text-white">Recommended Decision Maker</h3>
            </div>

            {lead.contactName ? (
              <div className="space-y-4">
                {/* Person Header */}
                <div className="p-4 rounded-2xl glass-card flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 via-indigo-600 to-cyan-400 flex items-center justify-center font-bold text-white text-base shadow-glow-accent shrink-0 border border-white/20">
                    {lead.contactName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="text-base font-heading font-bold text-white">{lead.contactName}</h4>
                    <p className="text-xs text-purple-300 font-medium">{lead.contactRole || 'Key Stakeholder'}</p>
                  </div>
                </div>

                {/* Contact Coordinates */}
                <div className="space-y-2 text-xs">
                  {/* Email */}
                  <div className="flex items-center justify-between p-3 rounded-xl glass-card">
                    <div className="flex items-center gap-2.5 text-slate-200 truncate">
                      <Mail className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span className="truncate">{lead.email || 'Email unavailable'}</span>
                    </div>
                    {lead.email && (
                      <button
                        onClick={() => handleCopyEmail(lead.email)}
                        className="text-slate-400 hover:text-white glass-pill p-1.5 rounded-lg transition shrink-0"
                        title="Copy Email"
                      >
                        {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="flex items-center gap-2.5 p-3 rounded-xl glass-card text-slate-200">
                    <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{lead.phone || 'Phone unavailable'}</span>
                  </div>

                  {/* LinkedIn */}
                  {lead.linkedin ? (
                    <a
                      href={lead.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between p-3 rounded-xl glass-card text-slate-200 hover:text-cyan-300 transition"
                    >
                      <div className="flex items-center gap-2.5">
                        <Share2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                        <span>View LinkedIn Profile</span>
                      </div>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                  ) : null}
                </div>
              </div>
            ) : (
              <div className="py-8 text-center space-y-2">
                <p className="text-xs text-slate-400">Direct contact information unavailable.</p>
                <div className="text-xs font-medium text-purple-300 glass-pill p-3 rounded-xl border border-purple-500/20">
                  Target: {lead.decisionMaker || 'Chief Technology Officer (CTO)'}
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 text-[11px] text-slate-400">
            Fictional demo data for technical assessment simulation.
          </div>
        </div>
      </div>

      {/* Row 3: Next Best Action & Best Outreach Angle (Visually Prominent!) */}
      <div className="glass-panel rounded-3xl p-7 shadow-glass-lg relative overflow-hidden border border-purple-400/30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-purple-600/15 via-cyan-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-5">
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-300 uppercase tracking-wider">
            <span className="glass-pill px-3 py-1 rounded-full flex items-center gap-1.5 border border-purple-400/30 shadow-glow-accent">
              <Target className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-heading">Recommended Next Best Action</span>
            </span>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold font-heading text-white tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]">
              {lead.recommendedAction || `Contact ${lead.contactRole || 'the decision maker'} first.`}
            </h2>
            <p className="text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed font-sans">
              Engineering growth and modern technology adoption indicate an immediate software expansion and infrastructure orchestration opportunity.
            </p>
          </div>

          {/* Best Outreach Angle */}
          <div className="pt-4 border-t border-white/10">
            <span className="text-xs font-heading font-semibold text-cyan-300 uppercase tracking-wider block mb-2">
              Best Outreach Angle
            </span>
            <p className="text-sm font-medium text-slate-100 glass-card p-4 rounded-2xl border border-white/15 leading-relaxed shadow-glass-sm">
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

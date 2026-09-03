import React, { useState, useEffect } from 'react';
import { X, RefreshCw, Cpu, Database, Activity, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import { useToast } from './Toast';

export default function SettingsModal({ isOpen, onClose, onDataReset }) {
  const { addToast } = useToast();
  const [health, setHealth] = useState(null);
  const [loadingHealth, setLoadingHealth] = useState(false);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadHealth();
    }
  }, [isOpen]);

  const loadHealth = async () => {
    setLoadingHealth(true);
    try {
      const data = await api.getHealth();
      setHealth(data);
    } catch (err) {
      console.error('Health check failed:', err);
    } finally {
      setLoadingHealth(false);
    }
  };

  const handleResetSeed = async () => {
    if (!window.confirm('Reset all leads to the initial 32 pre-seeded B2B dataset? Any imported leads will be replaced.')) {
      return;
    }

    setResetting(true);
    try {
      const res = await api.resetSeedData();
      addToast(res.message || 'Dataset reset successfully to 32 pre-seeded leads', 'success');
      if (onDataReset) onDataReset();
      onClose();
    } catch (err) {
      addToast('Failed to reset dataset', 'error');
    } finally {
      setResetting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-2xl animate-fade-in">
      <div className="relative w-full max-w-lg glass-panel rounded-3xl shadow-2xl overflow-hidden animate-slide-up border border-purple-500/30">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/15 text-purple-300 border border-purple-400/30">
              <Activity className="w-4 h-4" />
            </div>
            <h2 className="text-base font-heading font-semibold text-white">Settings & Diagnostics</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl glass-pill text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* AI Intelligence Engine Status */}
          <div className="space-y-3">
            <h3 className="text-xs font-heading font-semibold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5" />
              <span>AI Intelligence Engine Status</span>
            </h3>

            <div className="p-4 rounded-2xl glass-card space-y-2.5 border border-white/10">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Status:</span>
                <span className="flex items-center gap-1.5 font-medium text-cyan-300 font-mono">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span>{health?.status === 'healthy' ? 'Operational' : 'Online'}</span>
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">AI Scoring Mode:</span>
                <span className="font-mono text-slate-200 font-medium">
                  {health?.aiEngine?.mode || 'LIVE (Gemini 3.7 Flash)'}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Active Model:</span>
                <span className="font-mono text-purple-300">
                  {health?.aiEngine?.model || 'gemini-3.7-flash'}
                </span>
              </div>
            </div>
          </div>

          {/* Database & Seed Reset */}
          <div className="space-y-3">
            <h3 className="text-xs font-heading font-semibold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
              <Database className="w-3.5 h-3.5" />
              <span>Database & Demo Dataset</span>
            </h3>

            <div className="p-4 rounded-2xl glass-card space-y-3 border border-white/10">
              <p className="text-xs text-slate-300 leading-relaxed">
                Restore the baseline assessment dataset consisting of <strong>32 pre-qualified B2B companies</strong> across 10 industries with full explainable score breakdowns.
              </p>

              <button
                onClick={handleResetSeed}
                disabled={resetting}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl glass-btn-secondary text-rose-300 hover:text-rose-200 border-rose-500/20 hover:border-rose-500/40 hover:bg-rose-500/10 transition disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${resetting ? 'animate-spin' : ''}`} />
                <span>{resetting ? 'Resetting Pipeline...' : 'Reset to 32 Seed Leads'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-black/40 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <span className="font-mono text-[11px]">LeadPilot AI v1.0.0</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl glass-btn-secondary text-slate-200 hover:text-white transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { X, Server, Database, Cpu, RefreshCw, CheckCircle, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';
import { useToast } from './Toast';

export default function SettingsModal({ isOpen, onClose, onDataReset }) {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resetting, setResetting] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    if (isOpen) {
      fetchHealth();
    }
  }, [isOpen]);

  const fetchHealth = async () => {
    setLoading(true);
    try {
      const data = await api.getHealth();
      setHealth(data);
    } catch (err) {
      console.error('Error fetching health:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetData = async () => {
    if (!window.confirm('Reset database with original 32 pre-seeded B2B companies?')) return;
    setResetting(true);
    try {
      await api.resetSeedData();
      addToast('Database reset with 32 demo leads!', 'success');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#0d121f] rounded-2xl border border-white/10 shadow-2xl overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0f1523]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-slate-800 text-slate-300 border border-slate-700">
              <Server className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">System & Engine Settings</h2>
              <p className="text-xs text-slate-400">Environment status and data diagnostics</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Status Items */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="flex items-center gap-2.5">
                <Cpu className="w-4 h-4 text-blue-400" />
                <div>
                  <div className="text-xs font-semibold text-slate-200">AI Intelligence Engine</div>
                  <div className="text-[11px] text-slate-400">
                    {health?.aiEngine?.mode || 'Deterministic Heuristic (Demo)'}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Operational</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="flex items-center gap-2.5">
                <Database className="w-4 h-4 text-indigo-400" />
                <div>
                  <div className="text-xs font-semibold text-slate-200">Database Engine</div>
                  <div className="text-[11px] text-slate-400">MongoDB with Memory Server Fallback</div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-medium">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Connected</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-violet-400" />
                <div>
                  <div className="text-xs font-semibold text-slate-200">Assessment Ready</div>
                  <div className="text-[11px] text-slate-400">Deterministic scoring & caching enabled</div>
                </div>
              </div>
              <span className="text-xs font-mono text-slate-300">v1.0.0</span>
            </div>
          </div>

          {/* Reset Action */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-200">Reset Demo Data</div>
              <div className="text-[11px] text-slate-400">Re-seed 32 fictional multi-industry B2B leads</div>
            </div>
            <button
              onClick={handleResetData}
              disabled={resetting}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-xl transition disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${resetting ? 'animate-spin' : ''}`} />
              <span>{resetting ? 'Resetting...' : 'Reset Dataset'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

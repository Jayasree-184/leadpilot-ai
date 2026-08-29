import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Users,
  UploadCloud,
  Settings,
  Zap,
  Menu,
  X,
  Sparkles,
  Command,
  ChevronRight,
  Plus
} from 'lucide-react';
import AddLeadModal from '../components/AddLeadModal';
import SettingsModal from '../components/SettingsModal';

export default function AppShell({
  currentView,
  onNavigate,
  onOpenAddModal,
  selectedLeadId,
  children,
  onRefreshData
}) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Press '/' to jump to leads search
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        e.preventDefault();
        onNavigate('leads', { autoFocusSearch: true });
      }
      // Press 'n' or 'N' to open Add Lead
      if ((e.key === 'n' || e.key === 'N') && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        if (!e.metaKey && !e.ctrlKey) {
          e.preventDefault();
          setIsAddModalOpen(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNavigate]);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'leads', label: 'Leads', icon: Users },
    { id: 'import', label: 'Import CSV', icon: UploadCloud }
  ];

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-[#0d121f] border-b border-white/10 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-glow-blue">
            <Zap className="w-4 h-4 text-white fill-white" />
          </div>
          <span className="font-bold text-base tracking-tight text-white">LeadPilot AI</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="p-1.5 rounded-lg bg-blue-600 text-white shadow-sm"
            title="Add Lead"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
          >
            {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-out Drawer */}
      {mobileNavOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm">
          <div className="w-64 h-full bg-[#0d121f] border-r border-white/10 p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-white fill-white" />
                  </div>
                  <span className="font-bold text-base tracking-tight text-white">LeadPilot AI</span>
                </div>
                <button
                  onClick={() => setMobileNavOpen(false)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-1.5">
                {navItems.map(item => {
                  const Icon = item.icon;
                  const isActive = currentView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onNavigate(item.id);
                        setMobileNavOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                        isActive
                          ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => {
                  setIsSettingsOpen(true);
                  setMobileNavOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </button>

              <div className="p-3 rounded-xl bg-[#090d16] border border-white/5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-slate-300 font-medium">AI Engine</span>
                </div>
                <span className="text-[10px] text-emerald-400 uppercase font-mono">Operational</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Left Sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 bg-[#0d121f] border-r border-white/10 flex-col justify-between p-4 sticky top-0 h-screen z-30 select-none">
        <div>
          {/* Brand Logo & Tagline */}
          <div className="flex items-center gap-2.5 px-2 py-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-glow-blue">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <div>
              <div className="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
                <span>LeadPilot</span>
                <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  AI
                </span>
              </div>
              <div className="text-[11px] text-slate-400 tracking-tight">Sales Intelligence</div>
            </div>
          </div>

          {/* Quick Action: Add Lead Button */}
          <div className="px-2 mb-5">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl shadow-glow-blue transition active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Lead</span>
              <kbd className="ml-auto text-[10px] font-mono px-1 py-0.5 bg-black/30 rounded text-blue-200">
                N
              </kbd>
            </button>
          </div>

          {/* Primary Navigation */}
          <nav className="space-y-1 px-1">
            <div className="px-2 pb-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
              Navigation
            </div>

            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                    isActive
                      ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-blue-400" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sidebar Footer */}
        <div className="space-y-3 px-1 pt-4 border-t border-slate-800/80">
          {/* Quick Search shortcut hint */}
          <div
            onClick={() => onNavigate('leads', { autoFocusSearch: true })}
            className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 cursor-pointer hover:border-slate-700 transition"
          >
            <span className="flex items-center gap-1.5">
              <Command className="w-3.5 h-3.5" />
              <span>Search leads</span>
            </span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-slate-300 border border-slate-700">
              /
            </kbd>
          </div>

          {/* Settings Button */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition"
          >
            <Settings className="w-4 h-4" />
            <span>Settings & Diagnostics</span>
          </button>

          {/* Live AI Engine Status Badge */}
          <div className="p-2.5 rounded-xl bg-[#090d16] border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-xs font-medium text-slate-300">AI Engine</span>
            </div>
            <span className="text-[10px] font-mono font-semibold text-emerald-400 uppercase tracking-wider">
              Operational
            </span>
          </div>
        </div>
      </aside>

      {/* Main App Content Area */}
      <main className="flex-1 min-w-0 flex flex-col bg-[#090d16] bg-grid-pattern">
        {children}
      </main>

      {/* Add Lead Modal */}
      <AddLeadModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={(newLead) => {
          if (onRefreshData) onRefreshData();
          onNavigate('lead-detail', { leadId: newLead._id });
        }}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onDataReset={() => {
          if (onRefreshData) onRefreshData();
          onNavigate('dashboard');
        }}
      />
    </div>
  );
}

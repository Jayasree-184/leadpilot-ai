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
    { id: 'leads', label: 'Leads Pipeline', icon: Users },
    { id: 'import', label: 'Import CSV', icon: UploadCloud }
  ];

  return (
    <div className="min-h-screen glass-canvas-mesh text-slate-100 flex flex-col md:flex-row relative selection:bg-purple-500/30 selection:text-cyan-200">
      {/* Ambient Multi-Layer Atmospheric Light Glows */}
      <div className="fixed top-[-12%] left-[-6%] w-[520px] h-[520px] rounded-full bg-purple-600/15 blur-[130px] pointer-events-none animate-float-slow" />
      <div className="fixed top-[22%] right-[-6%] w-[480px] h-[480px] rounded-full bg-cyan-500/14 blur-[140px] pointer-events-none animate-float-reverse" />
      <div className="fixed bottom-[-10%] left-[28%] w-[560px] h-[560px] rounded-full bg-indigo-600/12 blur-[150px] pointer-events-none" />

      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 glass-dock sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-glow-accent border border-white/20">
            <Zap className="w-4 h-4 text-white fill-white" />
          </div>
          <span className="font-heading font-bold text-base tracking-tight text-white flex items-center gap-1.5">
            <span>LeadPilot</span>
            <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded bg-purple-500/20 text-cyan-300 border border-purple-400/30">
              AI
            </span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="p-2 rounded-xl glass-btn-primary text-white shadow-sm"
            title="Add Lead"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="p-2 rounded-xl glass-pill text-slate-300 hover:text-white"
          >
            {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-out Drawer */}
      {mobileNavOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-64 h-full glass-dock p-5 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-glow-accent border border-white/20">
                    <Zap className="w-4 h-4 text-white fill-white" />
                  </div>
                  <span className="font-heading font-bold text-base tracking-tight text-white">LeadPilot AI</span>
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
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                        isActive
                          ? 'bg-gradient-to-r from-purple-600/25 to-cyan-500/20 text-cyan-200 border border-purple-400/40 shadow-glow-accent font-semibold'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="space-y-3 pt-4 border-t border-white/10">
              <button
                onClick={() => {
                  setIsSettingsOpen(true);
                  setMobileNavOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </button>

              <div className="p-3 rounded-xl glass-pill flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-slate-300 font-medium">AI Engine</span>
                </div>
                <span className="text-[10px] text-cyan-300 uppercase font-mono">Operational</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Left Sidebar (Frosted Glass Dock) */}
      <aside className="hidden md:flex w-64 shrink-0 glass-dock flex-col justify-between p-4 sticky top-0 h-screen z-30 select-none">
        <div>
          {/* Brand Logo & Tagline */}
          <div className="flex items-center gap-3 px-2 py-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-glow-accent border border-white/25">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <div>
              <div className="font-heading font-bold text-base tracking-tight text-white flex items-center gap-1.5">
                <span>LeadPilot</span>
                <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded bg-purple-500/25 text-cyan-300 border border-purple-400/30 shadow-[0_0_12px_rgba(168,85,247,0.3)]">
                  AI
                </span>
              </div>
              <div className="text-[11px] text-slate-400 font-medium tracking-tight">Sales Intelligence</div>
            </div>
          </div>

          {/* Quick Action: Add Lead Button */}
          <div className="px-1 mb-6">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 text-xs font-semibold glass-btn-primary text-white rounded-xl transition active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Lead</span>
              <kbd className="ml-auto text-[10px] font-mono px-1.5 py-0.5 bg-black/40 rounded border border-white/15 text-cyan-200">
                N
              </kbd>
            </button>
          </div>

          {/* Primary Navigation */}
          <nav className="space-y-1.5 px-1">
            <div className="px-2 pb-2 text-[10px] font-semibold text-slate-400/80 uppercase tracking-wider font-heading">
              Platform
            </div>

            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-600/25 via-indigo-600/20 to-cyan-500/20 text-cyan-200 border border-purple-400/40 shadow-glow-accent font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.05]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-300 drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sidebar Footer */}
        <div className="space-y-3 px-1 pt-4 border-t border-white/10">
          {/* Quick Search shortcut hint */}
          <div
            onClick={() => onNavigate('leads', { autoFocusSearch: true })}
            className="flex items-center justify-between px-3.5 py-2 rounded-xl glass-pill text-xs text-slate-300 cursor-pointer hover:border-white/20 hover:bg-white/[0.08] transition"
          >
            <span className="flex items-center gap-1.5">
              <Command className="w-3.5 h-3.5 text-slate-400" />
              <span>Search leads</span>
            </span>
            <kbd className="px-1.5 py-0.5 rounded bg-black/40 text-[10px] font-mono text-slate-300 border border-white/10">
              /
            </kbd>
          </div>

          {/* Settings Button */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-white/[0.05] transition"
          >
            <Settings className="w-4 h-4" />
            <span>Settings & Diagnostics</span>
          </button>

          {/* Live AI Engine Status Badge */}
          <div className="p-3 rounded-xl glass-pill flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
              </span>
              <span className="text-xs font-medium text-slate-200 font-heading">AI Engine</span>
            </div>
            <span className="text-[10px] font-mono font-semibold text-cyan-300 uppercase tracking-wider">
              Operational
            </span>
          </div>
        </div>
      </aside>

      {/* Main App Content Area */}
      <main className="flex-1 min-w-0 flex flex-col relative z-10">
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

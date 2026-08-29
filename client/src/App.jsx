import React, { useState } from 'react';
import AppShell from './layouts/AppShell';
import Dashboard from './pages/Dashboard';
import LeadsList from './pages/LeadsList';
import LeadDetails from './pages/LeadDetails';
import ImportLeads from './pages/ImportLeads';
import { ToastProvider } from './components/Toast';

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const [leadsFilter, setLeadsFilter] = useState({});
  const [refreshKey, setRefreshKey] = useState(0);

  const handleNavigate = (view, payload = {}) => {
    if (view === 'lead-detail') {
      setSelectedLeadId(payload.leadId || null);
      setCurrentView('lead-detail');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (view === 'leads') {
      setLeadsFilter({
        category: payload.initialCategory || 'ALL',
        sort: payload.initialSort || 'score:desc',
        autoFocusSearch: payload.autoFocusSearch || false
      });
      setCurrentView('leads');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setCurrentView(view);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleDataRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <ToastProvider>
      <AppShell
        currentView={currentView}
        onNavigate={handleNavigate}
        selectedLeadId={selectedLeadId}
        onRefreshData={handleDataRefresh}
      >
        {currentView === 'dashboard' && (
          <Dashboard
            key={`dash-${refreshKey}`}
            onNavigate={handleNavigate}
            onOpenAddLead={() => {
              // Trigger Add Lead modal from AppShell
              const addBtn = document.querySelector('button[title="Add Lead"]') || document.querySelector('kbd');
              if (addBtn) addBtn.click();
            }}
          />
        )}

        {currentView === 'leads' && (
          <LeadsList
            key={`leads-${refreshKey}`}
            initialFilter={leadsFilter}
            onNavigate={handleNavigate}
            onOpenAddLead={() => {
              const addBtn = document.querySelector('button[title="Add Lead"]') || document.querySelector('kbd');
              if (addBtn) addBtn.click();
            }}
          />
        )}

        {currentView === 'lead-detail' && (
          <LeadDetails
            key={`lead-${selectedLeadId}-${refreshKey}`}
            leadId={selectedLeadId}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'import' && (
          <ImportLeads
            onNavigate={handleNavigate}
            onImportSuccess={handleDataRefresh}
          />
        )}
      </AppShell>
    </ToastProvider>
  );
}

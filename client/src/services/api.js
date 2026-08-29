const BASE_URL = '/api';

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  try {
    const res = await fetch(url, {
      ...options,
      headers
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || `Request failed with status ${res.status}`);
    }
    return data;
  } catch (error) {
    console.error(`API Error on [${options.method || 'GET'} ${url}]:`, error);
    throw error;
  }
}

export const api = {
  // System Health
  getHealth: () => request('/health'),
  resetSeedData: () => request('/seed/reset', { method: 'POST' }),

  // Leads Collection
  getLeads: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, val);
      }
    });
    const qs = query.toString();
    return request(`/leads${qs ? `?${qs}` : ''}`);
  },

  // Single Lead
  getLeadById: (id) => request(`/leads/${id}`),

  // Create Lead
  createLead: (leadData, autoAnalyze = true) =>
    request('/leads', {
      method: 'POST',
      body: JSON.stringify({ ...leadData, autoAnalyze })
    }),

  // Update Lead
  updateLead: (id, updateData) =>
    request(`/leads/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData)
    }),

  // Delete Lead
  deleteLead: (id) =>
    request(`/leads/${id}`, {
      method: 'DELETE'
    }),

  // AI Qualification
  analyzeLead: (id) =>
    request(`/leads/${id}/analyze`, {
      method: 'POST'
    }),

  // Force AI Re-Analysis
  reanalyzeLead: (id) =>
    request(`/leads/${id}/reanalyze`, {
      method: 'POST'
    }),

  // Bulk Import
  importLeads: (leads, autoQualify = true) =>
    request('/leads/import', {
      method: 'POST',
      body: JSON.stringify({ leads, autoQualify })
    }),

  // Export CSV URL
  getExportUrl: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, val);
      }
    });
    const qs = query.toString();
    return `${BASE_URL}/leads/export${qs ? `?${qs}` : ''}`;
  }
};

export default api;

import React, { useState } from 'react';
import { X, Sparkles, Building2, User, Globe, Mail, Phone, Cpu, DollarSign, MapPin, Briefcase } from 'lucide-react';
import { api } from '../services/api';
import { useToast } from './Toast';

export default function AddLeadModal({ isOpen, onClose, onSuccess }) {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    industry: 'SaaS',
    employees: 150,
    revenue: '$5M',
    location: 'Bangalore, India',
    website: '',
    contactName: '',
    contactRole: '',
    email: '',
    phone: '',
    linkedin: '',
    technologies: '',
    autoAnalyze: true
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.companyName || !formData.industry) {
      addToast('Company Name and Industry are required', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await api.createLead(formData, formData.autoAnalyze);
      addToast(`Lead "${formData.companyName}" added & qualified!`, 'success');
      if (onSuccess) onSuccess(res.data);
      onClose();
    } catch (err) {
      addToast(err.message || 'Failed to create lead', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-2xl animate-fade-in">
      <div className="relative w-full max-w-2xl glass-panel rounded-3xl shadow-2xl overflow-hidden animate-slide-up max-h-[90vh] flex flex-col border border-purple-500/30">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-purple-500/15 text-purple-300 border border-purple-400/30 shadow-[0_0_12px_rgba(168,85,247,0.3)]">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-heading font-semibold text-white">Add New Lead</h2>
              <p className="text-xs text-slate-400">Enter company profile and key decision maker info</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl glass-pill text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* Company Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-heading font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Company Name *
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="e.g. Apex Cloud Solutions"
                required
                className="w-full px-3.5 py-2.5 text-sm glass-input rounded-xl text-white placeholder:text-slate-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-heading font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Industry *
              </label>
              <select
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 text-sm glass-input rounded-xl text-white focus:outline-none cursor-pointer"
              >
                <option value="SaaS">SaaS</option>
                <option value="AI & Analytics">AI & Analytics</option>
                <option value="Cybersecurity">Cybersecurity</option>
                <option value="Fintech">Fintech</option>
                <option value="HealthTech">HealthTech</option>
                <option value="Logistics & Supply Chain">Logistics & Supply Chain</option>
                <option value="EdTech">EdTech</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Retail & E-commerce">Retail & E-commerce</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-heading font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Employees
              </label>
              <input
                type="number"
                name="employees"
                value={formData.employees}
                onChange={handleChange}
                placeholder="e.g. 150"
                className="w-full px-3.5 py-2.5 text-sm glass-input rounded-xl text-white placeholder:text-slate-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-heading font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Annual Revenue
              </label>
              <input
                type="text"
                name="revenue"
                value={formData.revenue}
                onChange={handleChange}
                placeholder="e.g. $8M"
                className="w-full px-3.5 py-2.5 text-sm glass-input rounded-xl text-white placeholder:text-slate-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-heading font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Bangalore, India"
                className="w-full px-3.5 py-2.5 text-sm glass-input rounded-xl text-white placeholder:text-slate-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-heading font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Website
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://company.io"
                className="w-full px-3.5 py-2.5 text-sm glass-input rounded-xl text-white placeholder:text-slate-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Contact Details */}
          <div className="pt-3 border-t border-white/10">
            <h3 className="text-xs font-heading font-semibold text-cyan-300 uppercase tracking-wider mb-3">
              Target Decision Maker (Fictional Demo Contact)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Contact Name</label>
                <input
                  type="text"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleChange}
                  placeholder="e.g. Maya Krishnan"
                  className="w-full px-3.5 py-2 text-sm glass-input rounded-xl text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Role / Designation</label>
                <input
                  type="text"
                  name="contactRole"
                  value={formData.contactRole}
                  onChange={handleChange}
                  placeholder="e.g. Chief Technology Officer"
                  className="w-full px-3.5 py-2 text-sm glass-input rounded-xl text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. maya@company.io"
                  className="w-full px-3.5 py-2 text-sm glass-input rounded-xl text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. +91 98765 12345"
                  className="w-full px-3.5 py-2 text-sm glass-input rounded-xl text-white focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Tech Stack */}
          <div>
            <label className="block text-xs font-heading font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Technologies / Tech Stack (comma separated)
            </label>
            <input
              type="text"
              name="technologies"
              value={formData.technologies}
              onChange={handleChange}
              placeholder="e.g. React, Node.js, AWS, Kubernetes, PostgreSQL"
              className="w-full px-3.5 py-2.5 text-sm glass-input rounded-xl text-white placeholder:text-slate-500 focus:outline-none"
            />
          </div>

          {/* Auto-analyze Toggle */}
          <div className="flex items-center gap-3 p-3.5 rounded-2xl glass-pill border border-purple-500/30 bg-purple-500/[0.06]">
            <input
              type="checkbox"
              id="autoAnalyze"
              name="autoAnalyze"
              checked={formData.autoAnalyze}
              onChange={handleChange}
              className="w-4 h-4 rounded text-purple-600 bg-black/40 border-slate-700 focus:ring-purple-500 cursor-pointer"
            />
            <label htmlFor="autoAnalyze" className="text-xs font-medium text-cyan-200 cursor-pointer font-heading">
              Automatically trigger AI lead qualification and outreach generation on save
            </label>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-300 glass-btn-secondary rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold glass-btn-primary text-white rounded-xl transition disabled:opacity-50 shadow-glow-accent"
            >
              {loading ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  <span>Processing & Scoring...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Save & Qualify Lead</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

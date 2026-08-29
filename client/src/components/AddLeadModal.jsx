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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#0d121f] rounded-2xl border border-white/10 shadow-2xl overflow-hidden animate-slide-up max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0f1523]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Add New Lead</h2>
              <p className="text-xs text-slate-400">Enter company profile and key decision maker info</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* Company Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Company Name *
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="e.g. Apex Cloud Solutions"
                required
                className="w-full px-3.5 py-2 text-sm bg-slate-900/90 border border-slate-700/80 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Industry *
              </label>
              <select
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2 text-sm bg-slate-900/90 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-blue-500 transition"
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
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Employees
              </label>
              <input
                type="number"
                name="employees"
                value={formData.employees}
                onChange={handleChange}
                placeholder="e.g. 150"
                className="w-full px-3.5 py-2 text-sm bg-slate-900/90 border border-slate-700/80 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Annual Revenue
              </label>
              <input
                type="text"
                name="revenue"
                value={formData.revenue}
                onChange={handleChange}
                placeholder="e.g. $8M"
                className="w-full px-3.5 py-2 text-sm bg-slate-900/90 border border-slate-700/80 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Bangalore, India"
                className="w-full px-3.5 py-2 text-sm bg-slate-900/90 border border-slate-700/80 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Website
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://company.io"
                className="w-full px-3.5 py-2 text-sm bg-slate-900/90 border border-slate-700/80 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition"
              />
            </div>
          </div>

          {/* Contact Details */}
          <div className="pt-3 border-t border-slate-800/80">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
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
                  className="w-full px-3 py-1.5 text-sm bg-slate-900/90 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-blue-500 transition"
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
                  className="w-full px-3 py-1.5 text-sm bg-slate-900/90 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-blue-500 transition"
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
                  className="w-full px-3 py-1.5 text-sm bg-slate-900/90 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-blue-500 transition"
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
                  className="w-full px-3 py-1.5 text-sm bg-slate-900/90 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-blue-500 transition"
                />
              </div>
            </div>
          </div>

          {/* Tech Stack */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Technologies / Tech Stack (comma separated)
            </label>
            <input
              type="text"
              name="technologies"
              value={formData.technologies}
              onChange={handleChange}
              placeholder="e.g. React, Node.js, AWS, Kubernetes, PostgreSQL"
              className="w-full px-3.5 py-2 text-sm bg-slate-900/90 border border-slate-700/80 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          {/* Auto-analyze Toggle */}
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <input
              type="checkbox"
              id="autoAnalyze"
              name="autoAnalyze"
              checked={formData.autoAnalyze}
              onChange={handleChange}
              className="w-4 h-4 rounded text-blue-600 bg-slate-900 border-slate-700 focus:ring-blue-500"
            />
            <label htmlFor="autoAnalyze" className="text-xs font-medium text-blue-200 cursor-pointer">
              Automatically trigger AI lead qualification and outreach generation on save
            </label>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-[0_0_15px_rgba(59,130,246,0.3)] transition disabled:opacity-50"
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

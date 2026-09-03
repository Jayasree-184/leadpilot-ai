import React, { useState } from 'react';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Sparkles,
  Download,
  Check,
  X
} from 'lucide-react';
import { api } from '../services/api';
import { useToast } from '../components/Toast';

export default function ImportLeads({ onNavigate, onImportSuccess }) {
  const { addToast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [csvFile, setCsvFile] = useState(null);
  const [parsedRows, setParsedRows] = useState([]);
  const [validRows, setValidRows] = useState([]);
  const [invalidRows, setInvalidRows] = useState([]);
  const [autoQualify, setAutoQualify] = useState(true);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState(null);

  const parseCSV = (text) => {
    const lines = text.split(/\r\n|\n/).filter(line => line.trim() !== '');
    if (lines.length < 2) return [];

    const parseLine = (line) => {
      const result = [];
      let startValueIndex = 0;
      let inQuotes = false;

      for (let i = 0; i < line.length; i++) {
        const c = line[i];
        if (c === '"') {
          inQuotes = !inQuotes;
        } else if (c === ',' && !inQuotes) {
          let field = line.substring(startValueIndex, i).trim();
          if (field.startsWith('"') && field.endsWith('"')) {
            field = field.slice(1, -1).replace(/""/g, '"');
          }
          result.push(field);
          startValueIndex = i + 1;
        }
      }
      let field = line.substring(startValueIndex).trim();
      if (field.startsWith('"') && field.endsWith('"')) {
        field = field.slice(1, -1).replace(/""/g, '"');
      }
      result.push(field);
      return result;
    };

    const headers = parseLine(lines[0]).map(h => h.trim().replace(/^"|"$/g, ''));
    const records = [];

    for (let i = 1; i < lines.length; i++) {
      const values = parseLine(lines[i]);
      if (values.length === 0 || (values.length === 1 && values[0] === '')) continue;

      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = values[index] !== undefined ? values[index] : '';
      });
      records.push(obj);
    }

    return records;
  };

  const handleFileUpload = (file) => {
    if (!file) return;
    setCsvFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const records = parseCSV(text);

        if (records.length === 0) {
          addToast('CSV file is empty or invalid format', 'error');
          return;
        }

        const valid = [];
        const invalid = [];

        records.forEach((row, idx) => {
          const companyName = row.companyName || row['Company Name'] || row.Company || row.company;
          const industry = row.industry || row['Industry'] || row.Industry;

          if (!companyName || !industry) {
            invalid.push({
              row: idx + 2,
              data: row,
              reason: !companyName ? 'Missing Company Name' : 'Missing Industry'
            });
          } else {
            valid.push({
              companyName,
              industry,
              employees: Number(row.employees || row['Employees'] || 0),
              revenue: row.revenue || row['Revenue'] || '$0',
              location: row.location || row['Location'] || 'Unspecified',
              website: row.website || row['Website'] || '',
              contactName: row.contactName || row['Contact Name'] || '',
              contactRole: row.contactRole || row['Contact Role'] || '',
              email: row.email || row['Email'] || '',
              phone: row.phone || row['Phone'] || '',
              linkedin: row.linkedin || row['LinkedIn'] || '',
              technologies: row.technologies || row['Technologies'] || ''
            });
          }
        });

        setParsedRows(records);
        setValidRows(valid);
        setInvalidRows(invalid);
        setCurrentStep(3);
        addToast(`Validated ${records.length} records (${valid.length} valid)`, 'success');
      } catch (err) {
        addToast('Failed to parse CSV file', 'error');
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.csv')) {
      handleFileUpload(file);
    } else {
      addToast('Please drop a valid .csv file', 'error');
    }
  };

  const handleExecuteImport = async () => {
    if (validRows.length === 0) {
      addToast('No valid records to import', 'error');
      return;
    }

    setImporting(true);
    try {
      const res = await api.importLeads(validRows, autoQualify);
      if (res.success) {
        setImportResult(res.data);
        setCurrentStep(4);
        addToast(`Successfully imported ${res.data.importedCount} leads!`, 'success');
        if (onImportSuccess) onImportSuccess();
      }
    } catch (err) {
      addToast(err.message || 'Import failed', 'error');
    } finally {
      setImporting(false);
    }
  };

  const handleDownloadSample = () => {
    const sampleCsv = `companyName,industry,employees,revenue,location,website,contactName,contactRole,email,phone,linkedin,technologies
"DataFlow Systems","SaaS",340,"$17M","Bangalore, India","https://dataflow.systems","Vikramaditya Bose","VP of Engineering","vikram@dataflow.systems","+91 98450 77112","https://linkedin.com/in/vikram-dataflow","React, Node.js, AWS, Kubernetes, Kafka"
"FinEdge Capital","Fintech",220,"$11M","Mumbai, India","https://finedge.capital","Rohit Singhania","Chief Risk Officer","rohit@finedge.capital","+91 98200 66441","https://linkedin.com/in/rohitsinghania-finedge","Python, FastAPI, Redis, Postgres"
"SecureNet AI","Cybersecurity",190,"$14M","Hyderabad, India","https://securenet.ai","Divya Shankar","Chief Information Security Officer","divya@securenet.ai","+91 97000 88221","https://linkedin.com/in/divyashankar-sec","Go, Rust, AWS, Docker, ZeroTrust"`;

    const blob = new Blob([sampleCsv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'leadpilot_sample_template.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const stepLabels = ['1. Upload CSV', '2. Validate Schema', '3. Preview & Confirm', '4. Complete'];

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8 animate-fade-in relative z-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white tracking-tight">Import Lead Pipeline</h1>
          <p className="text-xs text-slate-400 mt-1">
            Batch ingest B2B leads from CSV with automatic AI ICP scoring & duplicate prevention
          </p>
        </div>

        <button
          onClick={handleDownloadSample}
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium glass-btn-secondary text-slate-200 rounded-xl transition"
        >
          <Download className="w-3.5 h-3.5 text-cyan-400" />
          <span>Download Sample CSV Template</span>
        </button>
      </div>

      {/* 4-Step Progress Indicator */}
      <div className="grid grid-cols-4 gap-2 text-center text-xs font-semibold font-heading">
        {stepLabels.map((label, idx) => {
          const stepNum = idx + 1;
          const isDone = currentStep > stepNum;
          const isCurrent = currentStep === stepNum;

          return (
            <div
              key={label}
              className={`p-3 rounded-2xl border transition-all duration-200 ${
                isCurrent
                  ? 'glass-btn-primary text-white font-bold shadow-glow-accent'
                  : isDone
                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                  : 'glass-pill text-slate-400'
              }`}
            >
              <div className="flex items-center justify-center gap-1.5">
                {isDone ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : null}
                <span>{label}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Step 1 & 2: Dropzone & Upload Area */}
      {currentStep <= 2 && (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="border-2 border-dashed border-white/15 hover:border-cyan-400/60 rounded-3xl p-12 text-center glass-panel transition group cursor-pointer shadow-glass-lg relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-purple-500/[0.04] to-transparent pointer-events-none" />

          <input
            type="file"
            id="csvFileInput"
            accept=".csv"
            onChange={(e) => handleFileUpload(e.target.files[0])}
            className="hidden"
          />
          <label htmlFor="csvFileInput" className="cursor-pointer space-y-4 flex flex-col items-center relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-purple-500/15 text-cyan-300 flex items-center justify-center border border-purple-400/30 group-hover:scale-105 group-hover:bg-purple-500/25 transition duration-200 shadow-glow-accent">
              <UploadCloud className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-heading font-semibold text-white">
                Drag and drop your CSV file here
              </h3>
              <p className="text-xs text-slate-400">
                or click to browse from your computer (.csv)
              </p>
            </div>

            <span className="inline-block px-5 py-2.5 text-xs font-semibold glass-btn-primary text-white rounded-xl transition shadow-glow-accent">
              Select CSV File
            </span>
          </label>
        </div>
      )}

      {/* Step 3: Preview & Confirm Table */}
      {currentStep === 3 && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl glass-card">
              <span className="text-xs font-heading font-semibold text-slate-400 uppercase">Rows Detected</span>
              <div className="text-2xl font-bold font-mono text-white mt-1">
                {parsedRows.length}
              </div>
            </div>

            <div className="p-4 rounded-2xl glass-card border-emerald-500/20 bg-emerald-500/[0.05]">
              <span className="text-xs font-heading font-semibold text-emerald-400 uppercase">Valid Records</span>
              <div className="text-2xl font-bold font-mono text-emerald-300 mt-1">
                {validRows.length}
              </div>
            </div>

            <div className="p-4 rounded-2xl glass-card border-rose-500/20 bg-rose-500/[0.05]">
              <span className="text-xs font-heading font-semibold text-rose-400 uppercase">Invalid Records</span>
              <div className="text-2xl font-bold font-mono text-rose-300 mt-1">
                {invalidRows.length}
              </div>
            </div>
          </div>

          {/* Invalid Records Alert (if any) */}
          {invalidRows.length > 0 && (
            <div className="p-4 rounded-2xl glass-card border-rose-500/30 bg-rose-950/30 text-rose-200 text-xs space-y-2">
              <div className="flex items-center gap-2 font-semibold font-heading">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>{invalidRows.length} invalid rows will be skipped during import:</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-slate-300 font-mono text-[11px]">
                {invalidRows.slice(0, 3).map((r, i) => (
                  <li key={i}>Row #{r.row}: {r.reason}</li>
                ))}
                {invalidRows.length > 3 && <li>...and {invalidRows.length - 3} more</li>}
              </ul>
            </div>
          )}

          {/* Preview Table on Frosted Glass */}
          <div className="glass-panel rounded-3xl shadow-glass-lg overflow-hidden border border-white/10">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-sm font-heading font-semibold text-white">Parsed Records Preview</h3>
              <span className="text-xs text-slate-400 glass-pill px-2.5 py-0.5 rounded-full">Showing first 5 rows</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.02] text-slate-400 font-heading font-semibold uppercase">
                    <th className="py-3 px-4">Company</th>
                    <th className="py-3 px-4">Industry</th>
                    <th className="py-3 px-4">Employees</th>
                    <th className="py-3 px-4">Revenue</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Contact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06]">
                  {validRows.slice(0, 5).map((row, idx) => (
                    <tr key={idx} className="hover:bg-white/[0.04] transition">
                      <td className="py-3 px-4 font-heading font-semibold text-white">{row.companyName}</td>
                      <td className="py-3 px-4 text-slate-300">{row.industry}</td>
                      <td className="py-3 px-4 font-mono text-slate-400">{row.employees}</td>
                      <td className="py-3 px-4 font-mono text-slate-400">{row.revenue}</td>
                      <td className="py-3 px-4 text-slate-400">{row.location}</td>
                      <td className="py-3 px-4 text-slate-300">{row.contactName || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Auto Qualify Option & Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-3xl glass-panel border border-white/10">
            <div className="flex items-center gap-2.5">
              <input
                type="checkbox"
                id="autoQualify"
                checked={autoQualify}
                onChange={(e) => setAutoQualify(e.target.checked)}
                className="w-4 h-4 rounded text-purple-600 bg-slate-900 border-slate-700"
              />
              <label htmlFor="autoQualify" className="text-xs font-medium text-slate-200 cursor-pointer">
                Automatically run AI qualification on all imported leads
              </label>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-4 py-2 text-xs font-medium text-slate-300 glass-btn-secondary rounded-xl transition"
              >
                Cancel & Re-upload
              </button>

              <button
                onClick={handleExecuteImport}
                disabled={importing || validRows.length === 0}
                className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold glass-btn-primary text-white rounded-xl transition disabled:opacity-50 shadow-glow-accent"
              >
                {importing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Importing & Qualifying...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Import {validRows.length} Leads</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Import Complete Success Screen */}
      {currentStep === 4 && (
        <div className="glass-panel rounded-3xl border border-emerald-500/30 p-8 text-center max-w-xl mx-auto space-y-5 shadow-glass-lg animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 text-emerald-300 flex items-center justify-center mx-auto border border-emerald-400/30 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xl font-bold font-heading text-white">Import Successfully Completed!</h2>
            <p className="text-xs text-slate-300">
              Ingested <strong className="text-emerald-300">{importResult?.importedCount || validRows.length} leads</strong> into your sales pipeline.
              {importResult?.skippedCount > 0 && (
                <span className="block text-slate-400 mt-1 font-mono text-[11px]">
                  ({importResult.skippedCount} duplicate companies were safely skipped)
                </span>
              )}
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-3">
            <button
              onClick={() => {
                setCurrentStep(1);
                setCsvFile(null);
                setValidRows([]);
              }}
              className="px-4 py-2 text-xs font-medium text-slate-300 glass-btn-secondary rounded-xl transition"
            >
              Import Another CSV
            </button>

            <button
              onClick={() => onNavigate('leads')}
              className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold glass-btn-primary text-white rounded-xl transition shadow-glow-accent"
            >
              <span>View Leads in Pipeline</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { Sparkles, Copy, Check, RefreshCw, Send, Mail } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useToast } from './Toast';

export default function OutreachGenerator({
  initialSubject = '',
  initialMessage = '',
  decisionMaker = '',
  companyName = '',
  onRegenerate
}) {
  const [subject, setSubject] = useState(initialSubject);
  const [message, setMessage] = useState(initialMessage);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [copied, setCopied] = useState(false);
  const { addToast } = useToast();

  const steps = [
    'Analyzing lead ICP signals & tech stack...',
    'Identifying priority decision maker & role...',
    'Synthesizing personalized outreach angle...'
  ];

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGenerationStep(0);

    const stepInterval = setInterval(() => {
      setGenerationStep(prev => {
        if (prev < steps.length - 1) return prev + 1;
        clearInterval(stepInterval);
        return prev;
      });
    }, 450);

    try {
      if (onRegenerate) {
        const result = await onRegenerate();
        if (result) {
          setSubject(result.generatedSubject || initialSubject);
          setMessage(result.generatedMessage || initialMessage);
        }
      } else {
        await new Promise(r => setTimeout(r, 1400));
      }
      addToast('Generated hyper-personalized outreach draft', 'success');
    } catch (err) {
      addToast('Failed to generate outreach', 'error');
    } finally {
      clearInterval(stepInterval);
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    const fullText = `Subject: ${subject}\n\n${message}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    addToast('Outreach copied to clipboard!', 'success');

    try {
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.8 },
        colors: ['#a855f7', '#6366f1', '#06b6d4']
      });
    } catch (e) {}

    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="glass-panel rounded-3xl p-6 shadow-glass-lg relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-purple-500/15 text-purple-300 border border-purple-400/30 shadow-[0_0_12px_rgba(168,85,247,0.3)]">
            <Mail className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-heading font-semibold text-white">Suggested Outreach</h3>
            <p className="text-xs text-slate-400">
              Personalized 1-on-1 executive email angle for <span className="text-slate-200 font-medium">{companyName}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium glass-btn-secondary text-slate-200 rounded-xl transition disabled:opacity-50 active:scale-95"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin text-cyan-400' : ''}`} />
            <span>{isGenerating ? 'Synthesizing...' : 'Regenerate'}</span>
          </button>

          <button
            onClick={handleCopy}
            disabled={isGenerating || !message}
            className="flex items-center gap-1.5 px-4.5 py-1.5 text-xs font-semibold glass-btn-primary text-white rounded-xl transition disabled:opacity-50 active:scale-95"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-200" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Message</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Dynamic Content or AI Progressive Loading State */}
      {isGenerating ? (
        <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-full border-2 border-purple-400/30 border-t-cyan-400 animate-spin shadow-glow-accent" />
            <Sparkles className="w-5 h-5 text-cyan-300 absolute inset-0 m-auto animate-pulse" />
          </div>

          <div className="space-y-1.5">
            <p className="text-sm font-medium text-slate-200 animate-fade-in font-heading">
              {steps[generationStep]}
            </p>
            <div className="flex items-center justify-center gap-1.5">
              {steps.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx <= generationStep ? 'w-6 bg-gradient-to-r from-purple-400 to-cyan-400 shadow-[0_0_8px_#22d3ee]' : 'w-2 bg-white/10'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Subject Field */}
          <div className="glass-pill rounded-xl p-3.5 flex items-center gap-3">
            <span className="text-xs font-heading font-semibold text-purple-300 shrink-0 font-mono uppercase tracking-wider">
              Subject:
            </span>
            <span className="text-sm font-medium text-slate-100 tracking-tight">
              {subject || `Scaling infrastructure & operations at ${companyName}`}
            </span>
          </div>

          {/* Email Body */}
          <div className="glass-card rounded-2xl p-4 text-sm text-slate-200 leading-relaxed font-sans whitespace-pre-line select-text border border-white/[0.08]">
            {message || (
              <span className="text-slate-400 italic">
                Click "Regenerate" to create a personalized outreach message based on latest company signals.
              </span>
            )}
          </div>

          {/* Footer note */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
            <span>Tailored for: <strong className="text-slate-200 font-medium">{decisionMaker || 'Target Decision Maker'}</strong></span>
            <span className="glass-pill px-2.5 py-0.5 rounded-md font-mono text-[10px]">Zero-spam executive format • 3 short paragraphs</span>
          </div>
        </div>
      )}
    </div>
  );
}

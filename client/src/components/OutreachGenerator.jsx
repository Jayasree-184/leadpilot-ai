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

    // Progressive step-by-step animation
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
        // Simulated re-generation
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

    // Trigger subtle confetti celebration
    try {
      confetti({
        particleCount: 28,
        spread: 45,
        origin: { y: 0.8 },
        colors: ['#3b82f6', '#6366f1', '#10b981']
      });
    } catch (e) {
      // safe fallback if confetti fails
    }

    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="bg-[#0f1523] rounded-2xl border border-white/10 p-6 shadow-xl relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Mail className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Suggested Outreach</h3>
            <p className="text-xs text-slate-400">
              Personalized 1-on-1 executive email angle for <span className="text-slate-200">{companyName}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 rounded-lg border border-slate-700 transition disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin text-blue-400' : ''}`} />
            <span>{isGenerating ? 'Synthesizing...' : 'Regenerate'}</span>
          </button>

          <button
            onClick={handleCopy}
            disabled={isGenerating || !message}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-500 active:scale-95 text-white rounded-lg shadow-[0_0_15px_rgba(59,130,246,0.3)] transition disabled:opacity-50"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-300" />
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
            <div className="w-12 h-12 rounded-full border-2 border-blue-500/30 border-t-blue-500 animate-spin" />
            <Sparkles className="w-5 h-5 text-blue-400 absolute inset-0 m-auto animate-pulse" />
          </div>

          <div className="space-y-1.5">
            <p className="text-sm font-medium text-slate-200 animate-fade-in">
              {steps[generationStep]}
            </p>
            <div className="flex items-center justify-center gap-1.5">
              {steps.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx <= generationStep ? 'w-6 bg-blue-500' : 'w-2 bg-slate-800'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Subject Field */}
          <div className="bg-[#090d16] rounded-xl border border-white/5 p-3 flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-400 shrink-0 font-mono uppercase tracking-wider">
              Subject:
            </span>
            <span className="text-sm font-medium text-slate-200 tracking-tight">
              {subject || `Scaling infrastructure & operations at ${companyName}`}
            </span>
          </div>

          {/* Email Body */}
          <div className="bg-[#090d16] rounded-xl border border-white/5 p-4 text-sm text-slate-300 leading-relaxed font-sans whitespace-pre-line select-text">
            {message || (
              <span className="text-slate-500 italic">
                Click "Regenerate" to create a personalized outreach message based on latest company signals.
              </span>
            )}
          </div>

          {/* Footer note */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
            <span>Tailored for: <strong className="text-slate-300 font-medium">{decisionMaker || 'Target Decision Maker'}</strong></span>
            <span>Zero-spam executive format • 3 short paragraphs</span>
          </div>
        </div>
      )}
    </div>
  );
}

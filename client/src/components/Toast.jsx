import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success', duration = 3500) => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {/* Fixed Toast Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-md w-full px-4 sm:px-0">
        {toasts.map(toast => {
          let bg = 'bg-[#111827] border-slate-700 text-slate-200';
          let icon = <Info className="w-4 h-4 text-blue-400 shrink-0" />;

          if (toast.type === 'success') {
            bg = 'bg-[#0f1d1c] border-emerald-500/30 text-emerald-100';
            icon = <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />;
          } else if (toast.type === 'error') {
            bg = 'bg-[#201015] border-rose-500/30 text-rose-100';
            icon = <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />;
          }

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-xl border shadow-xl backdrop-blur-md transition-all duration-200 animate-slide-up ${bg}`}
            >
              <div className="flex items-center gap-2.5 text-sm font-medium">
                {icon}
                <span>{toast.message}</span>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-slate-200 p-0.5 rounded transition"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

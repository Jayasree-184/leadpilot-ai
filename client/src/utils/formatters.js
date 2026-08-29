/**
 * Formatting and Helper Utilities for LeadPilot AI
 */

export function formatScore(score) {
  if (score === null || score === undefined) return '—';
  return String(Math.round(score));
}

export function getCategoryBadge(category) {
  switch (category) {
    case 'HOT':
      return {
        label: 'HOT',
        sublabel: 'HIGH PRIORITY',
        classes: 'bg-rose-500/10 text-rose-400 border border-rose-500/30',
        dotClass: 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]'
      };
    case 'WARM':
      return {
        label: 'WARM',
        sublabel: 'MEDIUM PRIORITY',
        classes: 'bg-amber-500/10 text-amber-400 border border-amber-500/30',
        dotClass: 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]'
      };
    case 'COLD':
      return {
        label: 'COLD',
        sublabel: 'LOW PRIORITY',
        classes: 'bg-slate-500/10 text-slate-400 border border-slate-500/25',
        dotClass: 'bg-slate-400'
      };
    default:
      return {
        label: 'PENDING',
        sublabel: 'UNSCORED',
        classes: 'bg-slate-700/20 text-slate-500 border border-slate-700/40',
        dotClass: 'bg-slate-600'
      };
  }
}

export function formatRelativeTime(dateString) {
  if (!dateString) return 'Never analyzed';
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
}

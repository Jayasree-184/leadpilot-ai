/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#090d16',
          darker: '#06080e',
          card: '#0f1523',
          elevated: '#151c2e',
          subtle: '#1b243b'
        },
        border: {
          subtle: 'rgba(255, 255, 255, 0.08)',
          hover: 'rgba(255, 255, 255, 0.15)',
          focus: '#3b82f6'
        },
        accent: {
          blue: '#3b82f6',
          indigo: '#6366f1',
          cyan: '#06b6d4',
          hot: '#f43f5e',
          warm: '#f59e0b',
          cold: '#64748b',
          emerald: '#10b981'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['Geist Mono', 'JetBrains Mono', 'Fira Code', 'monospace']
      },
      boxShadow: {
        'glow-blue': '0 0 25px -5px rgba(59, 130, 246, 0.3)',
        'glow-hot': '0 0 25px -5px rgba(244, 63, 94, 0.35)',
        'glow-warm': '0 0 25px -5px rgba(245, 158, 11, 0.3)',
        'glow-emerald': '0 0 25px -5px rgba(16, 185, 129, 0.3)',
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.5)'
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 200ms ease-out forwards',
        'slide-up': 'slideUp 250ms cubic-bezier(0.16, 1, 0.3, 1) forwards'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      }
    },
  },
  plugins: [],
}

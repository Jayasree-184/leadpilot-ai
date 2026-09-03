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
          DEFAULT: '#050714',
          canvas: 'var(--bg-canvas)',
          surface: 'rgba(13, 18, 38, 0.65)',
          card: 'rgba(255, 255, 255, 0.05)',
          cardHover: 'rgba(255, 255, 255, 0.09)',
          elevated: 'rgba(255, 255, 255, 0.11)',
          dock: 'rgba(8, 12, 26, 0.75)',
        },
        border: {
          glass: 'var(--glass-border-card)',
          glassHover: 'var(--glass-border-hover)',
          glassSubtle: 'var(--glass-border-subtle)',
        },
        accent: {
          purple: '#a855f7',
          cyan: '#06b6d4',
          indigo: '#6366f1',
          hot: '#f43f5e',
          warm: '#f59e0b',
          cold: '#06b6d4',
          emerald: '#10b981'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        heading: ['Outfit', 'Syne', 'Inter', 'sans-serif'],
        display: ['Syne', 'Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'Geist Mono', 'Fira Code', 'monospace']
      },
      boxShadow: {
        'glass-sm': 'var(--shadow-glass-sm)',
        'glass-md': 'var(--shadow-glass-md)',
        'glass-lg': 'var(--shadow-glass-lg)',
        'glow-accent': 'var(--shadow-glow-accent)',
        'glow-purple': 'var(--shadow-glow-purple)',
        'glow-cyan': 'var(--shadow-glow-cyan)',
        'glow-hot': 'var(--shadow-glow-hot)',
        'glow-warm': 'var(--shadow-glow-warm)',
        'glow-emerald': 'var(--shadow-glow-emerald)',
      },
      backgroundImage: {
        'gradient-accent': 'var(--gradient-purple-cyan)',
        'gradient-accent-hover': 'var(--gradient-purple-cyan-hover)',
        'gradient-accent-subtle': 'var(--gradient-purple-cyan-subtle)',
      },
      backdropBlur: {
        'xs': '4px',
        'sm': '12px',
        'md': '18px',
        'lg': '24px',
        'xl': '32px',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 200ms ease-out forwards',
        'slide-up': 'slideUp 250ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'float-slow': 'float 8s ease-in-out infinite',
        'float-reverse': 'floatReverse 10s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
          '50%': { transform: 'translateY(-15px) translateX(10px)' }
        },
        floatReverse: {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
          '50%': { transform: 'translateY(15px) translateX(-10px)' }
        }
      }
    },
  },
  plugins: [],
}

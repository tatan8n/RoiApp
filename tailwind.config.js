/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        amaq: {
          brand: '#2e3192', // Azul profundo
          light: '#a4e5ff', // Celeste
          900: '#171849',
          800: '#23256e',
          700: '#2e3192', // Brand Deep Blue
          600: '#4144b1',
          500: '#6063c6',
          400: '#878ada',
          300: '#a4e5ff', // Brand Light Blue
          200: '#c8f0ff',
          100: '#e5f8ff',
          50:  '#f2fcff',
        },
        navy: {
          brand: '#2e3192',
          light: '#a4e5ff',
          950: '#0b0c24',
          900: '#171849',
          800: '#23256e',
          700: '#2e3192',
          600: '#4144b1',
          500: '#6063c6',
          400: '#878ada',
          300: '#a4e5ff',
          200: '#c8f0ff',
          100: '#e5f8ff',
          50:  '#f2fcff',
        },
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        dark: {
          bg: '#f8fafc', /* Replaced with slate-50 */
          panel: '#ffffff', /* Replaced with white */
          border: '#e2e8f0', /* slate-200 */
          text: '#0f172a', /* slate-900 */
          muted: '#64748b' /* slate-500 */
        },
        accent: {
          primary: '#3B4DA0',
          hover: '#526DBA',
          glow: 'rgba(59, 77, 160, 0.2)'
        }
      },
      backgroundImage: {
        'premium-gradient': 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        'amaq-gradient': 'linear-gradient(135deg, #2B2D7B 0%, #6B8FD4 100%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        'glow': '0 0 15px rgba(59, 77, 160, 0.1)',
        'glow-lg': '0 0 25px rgba(59, 77, 160, 0.2)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-glow': 'pulseGlow 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: 1, transform: 'scale(1)' },
          '50%': { opacity: .8, transform: 'scale(1.02)' },
        }
      }
    },
  },
  plugins: [],
}
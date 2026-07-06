/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ivory: {
          DEFAULT: '#FAF7F2',
          100: '#FFFFFF',
          200: '#F3EEE6',
        },
        plum: {
          50: '#F3F0F7',
          100: '#E4DCEE',
          300: '#B6A2CF',
          500: '#7C6A9C',
          600: '#655381',
          700: '#4E3F66',
          900: '#1A1523',
          950: '#120E1A',
        },
        ink: '#2B2438',
        muted: '#8A8296',
        contract: {
          DEFAULT: '#4FA87C',
          soft: '#DCEFE2',
        },
        relax: {
          DEFAULT: '#4E8FD1',
          soft: '#DDEAF8',
        },
        gold: {
          DEFAULT: '#D9A94E',
          soft: '#F6E9CC',
        },
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      boxShadow: {
        glass: '0 8px 32px rgba(28, 20, 45, 0.10)',
        'glass-dark': '0 8px 32px rgba(0, 0, 0, 0.45)',
      },
      keyframes: {
        pulseSoft: {
          '0%, 100%': { opacity: 1, transform: 'scale(1)' },
          '50%': { opacity: 0.85, transform: 'scale(1.015)' },
        },
        floatIn: {
          '0%': { opacity: 0, transform: 'translateY(8px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        breathe: 'pulseSoft 3.4s ease-in-out infinite',
        floatIn: 'floatIn 0.5s ease-out',
      },
    },
  },
  plugins: [],
}

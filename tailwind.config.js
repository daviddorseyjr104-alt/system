/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#FDF8EE',
          100: '#F5E6C8',
          200: '#EACC90',
          300: '#DFB358',
          400: '#C9A84C',
          500: '#B8943D',
          600: '#A07830',
          700: '#7A5A22',
          800: '#523C16',
          900: '#2A1E0A',
        },
        obsidian: {
          50: '#F2F2F2',
          100: '#E0E0E0',
          200: '#C0C0C0',
          300: '#8A8A8A',
          400: '#4A4A4A',
          500: '#2A2A2A',
          600: '#1E1E1E',
          700: '#141414',
          800: '#0D0D0D',
          900: '#080808',
        },
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'slide-right': 'slideRight 0.4s ease-out forwards',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        'counter': 'counter 2s ease-out forwards',
        'typewriter': 'typewriter 0.05s steps(1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideRight: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(201, 168, 76, 0.15)' },
          '50%': { boxShadow: '0 0 30px rgba(201, 168, 76, 0.35)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #C9A84C 0%, #E8C870 50%, #C9A84C 100%)',
        'dark-gradient': 'linear-gradient(135deg, #0D0D0D 0%, #141414 50%, #0D0D0D 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
        'shimmer-gradient': 'linear-gradient(90deg, transparent 0%, rgba(201,168,76,0.1) 50%, transparent 100%)',
      },
    },
  },
  plugins: [],
};

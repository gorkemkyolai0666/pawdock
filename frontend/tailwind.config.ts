import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        amber: {
          50: '#FFFBF0',
          100: '#FFF3D6',
          200: '#FFE4A8',
          300: '#FFD06A',
          400: '#F59E0B',
          500: '#D97706',
          600: '#B45309',
          700: '#92400E',
          800: '#78350F',
          900: '#451A03',
        },
        violet: {
          50: '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#4C1D95',
        },
        emerald: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
        },
        warm: {
          50: '#FFFBF0',
          100: '#FFF8E7',
          200: '#FFEFC2',
          300: '#FFE099',
          400: '#FFD06A',
          500: '#FFBF3D',
          600: '#F5A623',
          700: '#D48806',
          800: '#A66404',
          900: '#7A4A03',
          950: '#1A1520',
        },
      },
      fontFamily: {
        display: ['Nunito', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        sm: '6px',
        DEFAULT: '10px',
        md: '14px',
        lg: '18px',
        xl: '24px',
      },
    },
  },
  plugins: [],
};

export default config;

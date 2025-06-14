/** @type {import('tailwindcss').Config} */
import tailwindcssRtl from 'tailwindcss-rtl';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        yekan: ["IRANYekanX", "Tahoma", "Arial", "sans-serif"],
      },
      colors: {
        primary: {
          DEFAULT: '#1976D2', // main blue
          light: '#2196F3',
          dark: '#1565C0',
        },
        secondary: {
          DEFAULT: '#00B8D9', // accent blue/green
        },
        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
        yellow: {
          DEFAULT: '#FFEB3B', // warning
        },
        border: '#E0E0E0',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        card: '0 2px 16px 0 rgba(0,0,0,0.06)',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      },
    },
    fontFamily: {
      sans: ["IRANYekanX", "Tahoma", "Arial", "sans-serif"],
    },
  },
  plugins: [tailwindcssRtl],
} 
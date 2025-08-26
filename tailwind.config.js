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
        'yekan-bakh': [`IRANYekanX`, 'Yekan Bakh', 'sans-serif'],
        yekan: ["IRANYekanX", "Tahoma", "Arial", "sans-serif"],
      },
      colors: {
        ceruleanBlue: {
          50: '#ECF8FF',
          100: '#D5EEFF',
          200: '#B5E3FF',
          300: '#82D3FF',
          400: '#47B9FF',
          500: '#1D97FF',
          600: '#0576FF',
          700: '#005EF6',
          800: '#0751D6',
          900: '#0C449C',
          950: '#0D2A5E',
        },
        tropicalBlue: {
          50: '#F0F7FE',
          100: '#DEECFB',
          200: '#C9E2FA',
          300: '#9BCBF5',
          400: '#6BAFEF',
          500: '#4890E9',
          600: '#3373DD',
          700: '#2A5FCB',
          800: '#284EA5',
          900: '#264482',
          950: '#1B2A50',
        },
        doveGray: {
          50: '#F6F6F6',
          100: '#E7E7E7',
          200: '#D1D1D1',
          300: '#B0B0B0',
          400: '#888888',
          500: '#6D6D6D',
          600: '#5D5D5D',
          700: '#4F4F4F',
          800: '#454545',
          900: '#3D3D3D',
          950: '#262626',
        },
        stormGray: {
          50: '#F4F6F9',
          100: '#ECEFF3',
          200: '#DCE1E9',
          300: '#C6CFDB',
          400: '#AEB8CB',
          500: '#99A1BB',
          600: '#828AA9',
          700: '#6A708D',
          800: '#5B6078',
          900: '#4D5162',
          950: '#2D2F39',
        },
        // Custom semantic colors
        info: '#1842CC',
        error: '#F3084E',
        success: '#05CD8E',
        warning: '#F8C017',
        white: '#FFFFFF',
        black: '#161616',
        customBlack: '#161616', // Renamed to avoid conflict with default black
        warningLight: '#FFEDC7',
        successLight: '#CEFFF0',
        errorLight: '#FFD5E2',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        'card': '0px 4px 7.8px rgba(38, 68, 130, 0.05)',
        '5': '0px 4.51px 14.56px rgba(15, 25, 68, 0.15)',
      },
      letterSpacing: {
        'normal': '0em',
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
/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        honey: {
          50: '#FDF8E8',
          100: '#FBF0D0',
          200: '#F7E09A',
          300: '#F0CC65',
          400: '#E8B830',
          500: '#D4A017',
          600: '#A87D0E',
          700: '#7C5A0A',
          800: '#503B07',
          900: '#281D03',
        },
        forest: {
          50: '#E8F0E6',
          100: '#D1E1CE',
          200: '#A3C39C',
          300: '#75A56B',
          400: '#478739',
          500: '#2D5A27',
          600: '#22431D',
          700: '#162D14',
          800: '#0B160A',
          900: '#050B05',
        },
        jujube: {
          500: '#8B4513',
          600: '#6B3410',
        },
        sophora: {
          50: '#F8F5E6',
          100: '#F0EAD0',
        },
      },
      fontFamily: {
        serif: ['"Noto Serif SC"', 'serif'],
        sans: ['"Noto Sans SC"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

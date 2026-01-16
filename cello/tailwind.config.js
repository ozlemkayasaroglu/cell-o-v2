/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#0D9488',
        secondary: '#14B8A6',
        accent: '#F59E0B',
        biology: '#10B981',
        chemistry: '#8B5CF6',
        physics: '#3B82F6',
      },
    },
  },
  plugins: [],
};

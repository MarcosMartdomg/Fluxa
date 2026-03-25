/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#3d6cff',
          500: '#0038ff',
          600: '#002db3',
          700: '#002280',
          800: '#00164d',
          900: '#000b1a',
        },
      },
    },
  },
  plugins: [],
}

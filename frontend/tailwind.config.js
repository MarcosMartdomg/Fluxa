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
          50: '#f0f4ff',
          100: '#e1e9ff',
          200: '#bccfff',
          300: '#7fa1ff',
          400: '#3d6cff',
          500: '#0037ff',
          600: '#0029cc',
          700: '#001e99',
          800: '#001466',
          900: '#000a33',
        },
      },
    },
  },
  plugins: [],
}

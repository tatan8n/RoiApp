/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#002B5C',
          800: '#003366',
          700: '#004080',
          600: '#00579B',
          500: '#0066B3',
          400: '#3380BF',
          300: '#6699CC',
          200: '#99B3D9',
          100: '#D6E9F8',
          50: '#EBF4FA'
        }
      }
    },
  },
  plugins: [],
}
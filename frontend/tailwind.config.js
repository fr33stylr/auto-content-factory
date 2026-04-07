/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // This creates the 'font-outward' utility class!
        outward: ['Outward', 'sans-serif'], 
        nippo: ['Nippo', 'sans-serif'],
        melodrama: ['Melodrama', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
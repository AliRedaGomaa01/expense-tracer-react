/** @type {import('tailwindcss').Config} */
const { fontFamily } = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        Playfair: ['"Playfair"', ...fontFamily.sans], // Fallback to default sans-serif fonts
      },
    },
  },
  plugins: [],
}


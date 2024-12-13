/** @type {import('tailwindcss').Config} */
const { fontFamily } = require("tailwindcss/defaultTheme");

module.exports = {
  darkMode: false,
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        Playfair: ['"Playfair"', ...fontFamily.sans], // Fallback to default sans-serif fonts
      },
      keyframes: {
        colored: {
          "0%": { "background-color": "#feb6b6" },
          "25%": { "background-color": "#fefdb6" },
          "50%": { "background-color": "#d2fb9d" },
          "75%": { "background-color": "#b4ffeb" },
          "100%": { "background-color": "#feb6b6" },
        },
        rotating: {
          "0%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(-5deg)" },
          "50%": { transform: "rotate(0deg)" },
          "75%": { transform: "rotate(5deg)" },
          "100%": { transform: "rotate(0deg)" },
        },
        scaling: {
          "0%": { transform: "scale(1)" },
          "25%": { transform: "scale(0.9)" },
          "50%": { transform: "scale(1)" },
          "75%": { transform: "scale(1.1)" },
          "100%": { transform: "scale(1)" },
        },
        bg: {
          "0%": {
            "background-image": "url('assets/images/forest.jpg')",
            opacity: "1"
          },
          "16%": {
            opacity: "0.5"
          },
          "32%": {
            "background-image": "url('assets/images/nature.jpg')",
            opacity: "1"
          },
          "48%": {
            opacity: "0.5"
          },
          "64%": {
            "background-image": "url('assets/images/mountain.jpg')",
            opacity: "1"
          },
          "80%": {
            opacity: "0.5"
          },
          "100%": {
            "background-image": "url('assets/images/forest.jpg')",
            opacity: "1"
          },
        },
      },
      animation: {
        colored: "colored 3s linear forwards infinite",
        rotating: "rotating 3s linear forwards infinite",
        scaling: "scaling 3s linear forwards infinite",
        bg: "bg 15s linear forwards infinite",
      },
    },
  },
  plugins: [],
};

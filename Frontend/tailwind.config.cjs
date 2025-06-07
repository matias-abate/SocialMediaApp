// tailwind.config.cjs
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4F46E5",
        secondary: "#DB2777",
        surface: "rgba(255,255,255,0.05)",
        base: "#0F172A",
      },
      backdropBlur: {
        xs: "4px",
      },
    },
  },
  plugins: [],
};

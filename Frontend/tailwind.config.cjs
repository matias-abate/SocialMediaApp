// tailwind.config.cjs
/** @type {import('tailwindcss').Config} */
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
        primary: "#1DA1F2",       // azul estilo X
        twitterGray: "#14171A",    // fondo sidebar
        twitterLightGray: "#AAB8C2", // iconos inactivos
      },
      backdropBlur: {
        xs: "4px",
      },
    },
  },
  plugins: [],
};

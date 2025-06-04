// postcss.config.cjs
module.exports = {
    plugins: {
      // Ya no se usa "tailwindcss" directamente, sino este paquete:
      "@tailwindcss/postcss": {},
      autoprefixer: {},
    },
  };
  
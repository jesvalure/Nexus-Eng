/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    '@tailwindcss/postcss': {}, // Cambio clave aquí
    autoprefixer: {},
  },
};

export default config;
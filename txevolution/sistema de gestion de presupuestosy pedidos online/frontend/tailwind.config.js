/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // <-- Ojo aquí, rastrea tus componentes
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

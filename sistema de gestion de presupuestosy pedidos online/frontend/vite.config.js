import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev
export default defineConfig({
  plugins: [react(), tailwindcss()],

  server: {
    host: true, // 👈 Añade esta línea para que Vite acepte conexiones externas en Docker
    port: 5173, // Opcional, asegura que corra en ese puerto
    // 🔓 Esto le dice a Vite que permita conexiones desde CodeSandbox
    allowedHosts: [
      "qzt382-5173.csb.app",
      ".csb.app",
    ],
  },
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev
export default defineConfig({
  plugins: [react(), tailwindcss()],

  server: {
    // 🔓 Esto le dice a Vite que permita conexiones desde CodeSandbox
    allowedHosts: [
      "qzt382-5173.csb.app",
      ".csb.app",
       // Permite cualquier subdominio de CodeSandbox por comodidad
    ],
  },
});

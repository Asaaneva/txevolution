import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    // 🟢 Agrega este bloque para resolver el error de wss://
    hmr: {
      clientPort: 443,
      protocol: "wss",
    },
    port: 5173,
  },
});

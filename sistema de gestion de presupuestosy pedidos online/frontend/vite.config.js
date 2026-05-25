import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev
export default defineConfig({
  plugins: [react()],
  server: {
    // 🔓 Esto le dice a Vite que permita conexiones desde CodeSandbox
    allowedHosts: [
      'qzt382-5173.csb.app',
      '.csb.app' // Permite cualquier subdominio de CodeSandbox por comodidad
    ]
  }
})

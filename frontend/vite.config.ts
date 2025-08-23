import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: true,
    port: 5173,     
    proxy: {
      '/api':   { target: 'http://backend:8000', changeOrigin: true },
      '/health':{ target: 'http://backend:8000', changeOrigin: true },
    },
  },
})
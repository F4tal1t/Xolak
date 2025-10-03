import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 🔧 Vite configuration for our React app
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
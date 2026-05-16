import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
    vue(),
  ],
  server: {
    host: '0.0.0.0',
    watch: {
      usePolling: true,
    },
    proxy: {
      // Proxy COA open data to avoid CORS in development
      '/api/coa': {
        target: 'https://data.coa.gov.tw',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/coa/, ''),
      },
      '/api/moa': {
        target: 'https://data.moa.gov.tw',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/moa/, ''),
      },
    },
  },
})

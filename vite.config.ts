import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    rollupOptions: {
      input: {
        index: fileURLToPath(new URL('./index.html', import.meta.url)),
        adopt: fileURLToPath(new URL('./adopt.html', import.meta.url)),
        story: fileURLToPath(new URL('./story.html', import.meta.url)),
        test: fileURLToPath(new URL('./test.html', import.meta.url))
      }
    }
  },
  server: {
    proxy: {
      '/api/adoption': {
        target: 'https://data.moa.gov.tw',
        changeOrigin: true,
        rewrite: () => '/Service/OpenData/TransService.aspx?UnitId=QcbUEzN6E6DL&IsTransData=1'
      }
    }
  }
});

import { defineConfig } from 'vite';
import legacy from '@vitejs/plugin-legacy';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    minify: 'terser',
    rollupOptions: {
      input: {
        main: 'index.html',
        generator: 'generator.html',
        templates: 'templates.html',
        authCallback: 'auth-callback.html',
      },
      output: {
        manualChunks: {
          'chart': ['chart.js'],
          'vendor': ['html2canvas', 'jspdf'],
        },
      },
    },
  },
  plugins: [
    legacy({
      targets: ['defaults', 'not IE 11'],
    }),
  ],
  server: {
    port: 5173,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  optimizeDeps: {
    include: ['chart.js', '@supabase/supabase-js'],
  },
});

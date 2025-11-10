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
          // Core vendor libraries
          'vendor-core': ['chart.js'],
          // Heavy features split separately
          'export-tools': ['html2canvas', 'jspdf'],
          // Supabase and auth
          'auth': ['@supabase/supabase-js'],
          // Chart-specific modules
          'chart-engine': ['./src/chart-engine.js'],
          // Analytics and tracking
          'analytics': ['./src/analytics.js'],
        },
        // Optimize chunk naming for better caching
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/').pop() : 'chunk';
          return `js/[name]-[hash].js`;
        },
      },
      // Enable treeshaking for unused dependencies
      treeshake: 'smallest',
    },
    // Enable source maps for debugging in development
    sourcemap: process.env.NODE_ENV === 'development',
    // Compress assets
    cssCodeSplit: true,
  },
  plugins: [
    legacy({
      targets: ['defaults', 'not IE 11'],
      // Modern browsers only for better performance
      modernPolyfills: true,
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
    // Pre-bundle heavy dependencies
    exclude: ['html2canvas', 'jspdf'],
  },
  // Enable build analysis
  build: {
    ...defineConfig().build,
    reportCompressedSize: true,
    chunkSizeWarningLimit: 1000,
  },
});

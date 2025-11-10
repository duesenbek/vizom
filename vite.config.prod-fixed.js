/**
 * Production Build Configuration
 * Optimized for bundle size, performance, and debugging
 */

import { defineConfig } from 'vite';
import { resolve } from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import { VitePWA } from 'vite-plugin-pwa';
import viteCompression from 'vite-plugin-compression';

export default defineConfig(({ command, mode }) => {
  const isProduction = mode === 'production';
  const isDevelopment = mode === 'development';

  return {
    // Base configuration
    base: isProduction ? '/' : '/',
    
    // Build optimization
    build: {
      // Output directory
      outDir: 'dist',
      
      // Source maps for debugging
      sourcemap: isProduction ? 'hidden' : true,
      
      // Minification
      minify: isProduction ? 'terser' : false,
      terserOptions: isProduction ? {
        compress: {
          drop_console: true, // Remove console.log in production
          drop_debugger: true, // Remove debugger statements
          pure_funcs: ['console.log', 'console.info', 'console.debug'], // Remove specific functions
        },
        mangle: {
          safari10: true, // Fix Safari 10 mangling issues
        },
        format: {
          comments: false, // Remove comments
        },
      } : {},

      // Bundle optimization
      rollupOptions: {
        input: {
          main: resolve(process.cwd(), 'index.html'),
          // Add additional entry points if needed
        },
        output: {
          // Manual chunk splitting for better caching
          manualChunks: {
            // Vendor libraries
            vendor: ['chart.js', 'chartjs-adapter-date-fns'],
            
            // UI libraries
            ui: ['lucide'],
            
            // API and utilities
            api: ['./src/core/api.js', './src/core/deepseek-complete.js'],
            
            // Components
            components: [
              './src/components/LoadingSpinner.js',
              './src/components/ChartClipboard.js',
              './src/components/workflow/ChartCreationWorkflow.js'
            ]
          },
          
          // File naming for cache busting
          chunkFileNames: isProduction 
            ? 'assets/js/[name]-[hash].js'
            : 'assets/js/[name].js',
          entryFileNames: isProduction 
            ? 'assets/js/[name]-[hash].js'
            : 'assets/js/[name].js',
          assetFileNames: isProduction 
            ? 'assets/[name]-[hash].[ext]'
            : 'assets/[name].[ext]',
        },
        
        // External dependencies (if using CDN)
        external: isProduction ? [
          // Add CDN dependencies here
          // 'chart.js',
          // 'chartjs-adapter-date-fns'
        ] : [],
      },

      // Asset optimization
      assetsInlineLimit: 4096, // Inline assets smaller than 4KB
      
      // CSS optimization
      cssCodeSplit: true,
      
      // Target browsers
      target: ['es2020', 'chrome80', 'firefox78', 'safari13'],
      
      // Chunk size warning limit
      chunkSizeWarningLimit: 1000,
    },

    // Dependencies optimization
    optimizeDeps: {
      include: [
        'chart.js',
        'chartjs-adapter-date-fns',
        'lucide'
      ],
      exclude: [
        // Exclude dependencies that cause issues
      ],
    },

    // Plugins
    plugins: [
      // Compression plugin for gzip/brotli
      isProduction && viteCompression({
        algorithm: 'gzip',
        ext: '.gz',
      }),
      
      isProduction && viteCompression({
        algorithm: 'brotliCompress',
        ext: '.br',
      }),

      // Bundle analyzer
      isProduction && visualizer({
        filename: 'dist/stats.html',
        open: false,
        gzipSize: true,
        brotliSize: true,
      }),

      // PWA configuration
      isProduction && VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
        manifest: {
          name: 'Vizom - AI-Powered Data Visualization',
          short_name: 'Vizom',
          description: 'Create beautiful, interactive charts and visualizations with AI',
          theme_color: '#6366f1',
          background_color: '#ffffff',
          display: 'standalone',
          orientation: 'portrait',
          scope: '/',
          start_url: '/',
          icons: [
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png'
            }
          ]
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/api\.deepseek\.com\/.*/i,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'deepseek-api-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 // 24 hours
                },
                cacheKeyWillBeUsed: async ({ request }) => {
                  return `${request.url}?${Date.now()}`;
                }
              }
            },
            {
              urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
              handler: 'CacheFirst',
              options: {
                cacheName: 'images-cache',
                expiration: {
                  maxEntries: 60,
                  maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
                }
              }
            }
          ]
        }
      }),
    ].filter(Boolean),

    // Server configuration
    server: {
      port: 5173,
      host: true,
      cors: true,
    },

    // Preview server configuration
    preview: {
      port: 4173,
      host: true,
    },

    // Environment variables
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
      __ENV__: JSON.stringify(mode),
    },

    // CSS configuration
    css: {
      devSourcemap: isDevelopment,
      preprocessorOptions: {
        scss: {
          additionalData: `@import "./src/styles/variables.scss";`
        }
      }
    },

    // Experimental features
    experimental: {
      renderBuiltUrl(filename, { hostType }) {
        if (hostType === 'js') {
          return { js: `/${filename}` };
        } else {
          return { relative: true };
        }
      }
    }
  };
});

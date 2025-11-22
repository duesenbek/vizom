import { defineConfig } from 'vite';
import { resolve } from 'path';
import legacy from '@vitejs/plugin-legacy';
import { visualizer } from 'rollup-plugin-visualizer';
import { VitePWA } from 'vite-plugin-pwa';
import viteCompression from 'vite-plugin-compression';

export default defineConfig(({ command, mode }) => {
  const isProduction = mode === 'production';
  const isDevelopment = mode === 'development';
  const isReactBuild = process.env.REACT_BUILD === 'true';
  const enablePwa = isProduction && process.env.ENABLE_PWA === 'true';

  return {
    root: '.',
    publicDir: 'public',

    plugins: [
      // Legacy plugin for better browser support in development
      legacy({
        targets: ['defaults', 'not IE 11'],
        modernPolyfills: true,
      }),

      // Compression plugins for production
      isProduction && viteCompression({
        algorithm: 'gzip',
        ext: '.gz',
      }),

      isProduction && viteCompression({
        algorithm: 'brotliCompress',
        ext: '.br',
      }),

      // Bundle analyzer for production
      isProduction && visualizer({
        filename: 'dist/stats.html',
        open: false,
        gzipSize: true,
        brotliSize: true,
      }),

      // PWA configuration (opt-in via ENABLE_PWA=true)
      enablePwa && VitePWA({
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

    server: {
      port: 5173,
      open: true,
      host: isProduction ? true : undefined,
      cors: isProduction ? true : undefined,
      proxy: isDevelopment ? {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
        },
      } : undefined,
    },

    preview: {
      port: 4173,
      host: true,
    },

    optimizeDeps: {
      include: [
        'chart.js',
        '@supabase/supabase-js',
        'svg2pdf.js',
        'jspdf',
        ...(isReactBuild ? ['react', 'react-dom'] : []),
      ],
      exclude: isDevelopment ? ['html2canvas'] : [],
    },

    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      minify: isProduction ? 'terser' : false,
      terserOptions: isProduction ? {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.info', 'console.debug'],
        },
        mangle: {
          safari10: true,
        },
        format: {
          comments: false,
        },
      } : {},

      rollupOptions: {
        input: {
          main: resolve(process.cwd(), 'index.html'),
          generator: resolve(process.cwd(), 'generator.html'),
          templates: resolve(process.cwd(), 'templates.html'),
          authCallback: resolve(process.cwd(), 'auth-callback.html'),
          ...(isReactBuild ? { landing: resolve(process.cwd(), 'index-react.html') } : {}),
        },
        output: {
          manualChunks: isProduction ? {
            'vendor-core': ['chart.js'],
            'chart-libs': ['chart.js', 'echarts', 'apexcharts', 'plotly.js-dist'],
            'export-tools': ['html2canvas'],
            'auth': ['@supabase/supabase-js'],
            'chart-engine': ['./src/chart-engine.js'],
            'analytics': ['./src/analytics.js'],
          } : {
            'vendor-core': ['chart.js'],
            'chart-libs': ['chart.js', 'echarts', 'apexcharts', 'plotly.js-dist'],
            'export-tools': ['html2canvas'],
            'auth': ['@supabase/supabase-js'],
            'chart-engine': ['./src/chart-engine.js'],
            'analytics': ['./src/analytics.js'],
          },
          chunkFileNames: (chunkInfo) => {
            const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/').pop() : 'chunk';
            return isProduction ? `js/[name]-[hash].js` : `js/[name].js`;
          },
        },
        external: isProduction ? ['svg2pdf.js', 'jspdf'] : [],
        treeshake: 'smallest',
      },

      sourcemap: isProduction ? 'hidden' : true,
      cssCodeSplit: true,
      assetsInlineLimit: isProduction ? 4096 : undefined,
      target: isProduction ? ['es2020', 'chrome80', 'firefox78', 'safari13'] : undefined,
      chunkSizeWarningLimit: isProduction ? 1000 : undefined,
    },

    define: isProduction ? {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
      __ENV__: JSON.stringify(mode),
    } : {},

    css: isProduction ? {
      devSourcemap: isDevelopment,
      preprocessorOptions: {
        scss: {
          additionalData: `@import "./src/styles/variables.scss";`
        }
      }
    } : {},

    experimental: isProduction ? {
      renderBuiltUrl(filename, { hostType }) {
        if (hostType === 'js') {
          return { js: `/${filename}` };
        } else {
          return { relative: true };
        }
      }
    } : {},
  };
});

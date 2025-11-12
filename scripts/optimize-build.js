/**
 * Build Optimization Scripts
 * Utilities for optimizing production builds
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Optimize HTML files for production
 */
export function optimizeHTML(distPath) {
  const htmlFiles = findFiles(distPath, '.html');
  
  htmlFiles.forEach(filePath => {
    let content = readFileSync(filePath, 'utf8');
    
    // Remove development comments
    content = content.replace(/<!-- DEV:.*?-->/gs, '');
    
    // Minify whitespace
    content = content.replace(/>\s+</g, '><');
    content = content.replace(/\s+/g, ' ');

    // Optional: inject meta CSP only if explicitly enabled
    const useMetaCsp = process.env.USE_META_CSP === 'true';
    if (useMetaCsp) {
      content = content.replace(
        '<head>',
        `<head>\n    <!-- WARNING: Using meta CSP. Prefer platform headers (e.g., Netlify) for CSP in production. -->\n    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://api.deepseek.com;">\n    <meta http-equiv="X-Content-Type-Options" content="nosniff">\n    <meta http-equiv="X-Frame-Options" content="DENY">\n    <meta http-equiv="X-XSS-Protection" content="1; mode=block">`
      );
    } else {
      console.log('[optimize-build] Skipping meta CSP injection. Use platform headers (e.g., Netlify netlify.toml).');
    }
    
    writeFileSync(filePath, content);
    console.log(`✅ Optimized HTML: ${filePath}`);
  });
}

/**
 * Generate service worker for caching
 */
export function generateServiceWorker(distPath) {
  const serviceWorkerContent = `
// Service Worker for Vizom PWA
const CACHE_NAME = 'vizom-v1.0.0';
const STATIC_CACHE = 'vizom-static-v1';
const API_CACHE = 'vizom-api-v1';

// Files to cache on install
const STATIC_FILES = [
  '/',
  '/index.html',
  '/manifest.json',
  // Add your static files here
];

// Install event - cache static files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(STATIC_FILES))
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== STATIC_CACHE && cacheName !== API_CACHE) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event - serve from cache when possible
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // API requests - network first, cache fallback
  if (url.origin === 'https://api.deepseek.com') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Cache successful API responses
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(API_CACHE).then(cache => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Fallback to cache if network fails
          return caches.match(event.request);
        })
    );
    return;
  }
  
  // Static files - cache first, network fallback
  if (event.request.destination === 'script' || 
      event.request.destination === 'style' || 
      event.request.destination === 'image') {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          if (response) {
            return response;
          }
          return fetch(event.request);
        })
    );
    return;
  }
  
  // Other requests - network only
  event.respondWith(fetch(event.request));
});

// Background sync for offline functionality
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // Handle background sync operations
  console.log('Background sync completed');
}
`;

  writeFileSync(join(distPath, 'sw.js'), serviceWorkerContent);
  console.log('✅ Generated service worker');
}

/**
 * Generate build statistics
 */
export function generateBuildStats(distPath) {
  const files = getAllFiles(distPath);
  const stats = {
    totalFiles: files.length,
    totalSize: 0,
    fileTypes: {},
    largestFiles: []
  };

  files.forEach(filePath => {
    const fileStat = statSync(filePath);
    const ext = filePath.split('.').pop();
    const relativePath = filePath.replace(distPath, '');
    
    stats.totalSize += fileStat.size;
    stats.fileTypes[ext] = (stats.fileTypes[ext] || 0) + 1;
    stats.largestFiles.push({
      path: relativePath,
      size: fileStat.size,
      sizeKB: Math.round(fileStat.size / 1024)
    });
  });

  // Sort largest files
  stats.largestFiles.sort((a, b) => b.size - a.size);
  stats.largestFiles = stats.largestFiles.slice(0, 10);

  // Generate report
  const report = `
# Build Statistics Report

## Summary
- **Total Files**: ${stats.totalFiles}
- **Total Size**: ${Math.round(stats.totalSize / 1024)} KB (${Math.round(stats.totalSize / (1024 * 1024))} MB)
- **Build Date**: ${new Date().toISOString()}

## File Types
${Object.entries(stats.fileTypes)
  .map(([ext, count]) => `- .${ext}: ${count} files`)
  .join('\n')}

## Largest Files
${stats.largestFiles
  .map(file => `- ${file.path}: ${file.sizeKB} KB`)
  .join('\n')}

## Performance Targets
- ✅ Total size under 5MB: ${stats.totalSize < 5 * 1024 * 1024 ? 'PASS' : 'FAIL'}
- ✅ Largest file under 1MB: ${stats.largestFiles[0]?.size < 1024 * 1024 ? 'PASS' : 'FAIL'}
- ✅ Total files under 100: ${stats.totalFiles < 100 ? 'PASS' : 'FAIL'}

Generated on: ${new Date().toLocaleString()}
`;

  writeFileSync(join(distPath, 'build-stats.md'), report);
  console.log('✅ Generated build statistics');
  
  return stats;
}

/**
 * Helper functions
 */
function findFiles(dir, extension) {
  const files = [];
  
  function traverse(currentDir) {
    const items = readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = join(currentDir, item);
      const stat = statSync(fullPath);
      
      if (stat.isDirectory()) {
        traverse(fullPath);
      } else if (fullPath.endsWith(extension)) {
        files.push(fullPath);
      }
    }
  }
  
  traverse(dir);
  return files;
}

function getAllFiles(dir) {
  const files = [];
  
  function traverse(currentDir) {
    const items = readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = join(currentDir, item);
      const stat = statSync(fullPath);
      
      if (stat.isDirectory()) {
        traverse(fullPath);
      } else {
        files.push(fullPath);
      }
    }
  }
  
  traverse(dir);
  return files;
}

/**
 * Main optimization function
 */
export async function optimizeBuild(distPath = './dist') {
  console.log('🚀 Starting build optimization...');
  
  try {
    // Optimize HTML files
    optimizeHTML(distPath);
    
    // Generate service worker
    generateServiceWorker(distPath);
    
    // Generate build statistics
    const stats = generateBuildStats(distPath);
    
    console.log('✅ Build optimization completed!');
    console.log(`📊 Total build size: ${Math.round(stats.totalSize / 1024)} KB`);
    
    return stats;
  } catch (error) {
    console.error('❌ Build optimization failed:', error);
    throw error;
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  optimizeBuild();
}

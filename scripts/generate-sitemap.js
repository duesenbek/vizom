/**
 * Generate sitemap.xml for Vizom
 * - Reads APP_URL from env (falls back to http://localhost:5173)
 * - Detects existing HTML entry points and creates URL set
 * - Writes to public/sitemap.xml so Vite copies it to dist root
 */

import { writeFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import 'dotenv/config';

const ROOT = process.cwd();
const PUBLIC_DIR = resolve(ROOT, 'public');
const APP_URL = (process.env.APP_URL || process.env.VITE_APP_URL || 'http://localhost:5173').replace(/\/$/, '');

// Known public pages (add more as needed)
const candidates = [
  { file: 'index.html', path: '/', priority: 1.0, changefreq: 'daily' },
  { file: 'generator.html', path: '/generator.html', priority: 0.9, changefreq: 'daily' },
  { file: 'templates.html', path: '/templates.html', priority: 0.7, changefreq: 'weekly' },
  { file: 'pricing.html', path: '/pricing.html', priority: 0.6, changefreq: 'weekly' },
  { file: 'index-react.html', path: '/index-react.html', priority: 0.8, changefreq: 'daily' },
];

function detectPages() {
  const pages = [];
  for (const c of candidates) {
    const full = resolve(ROOT, c.file);
    if (existsSync(full)) pages.push(c);
  }
  return pages;
}

function buildSitemapXml(urls) {
  const lastmod = new Date().toISOString();
  const urlset = urls.map(u => `  <url>\n    <loc>${APP_URL}${u.path}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority.toFixed(1)}</priority>\n  </url>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlset}\n</urlset>\n`;
}

function main() {
  const pages = detectPages();
  if (pages.length === 0) {
    console.warn('[sitemap] No pages detected. Ensure HTML files exist in project root.');
  }
  const xml = buildSitemapXml(pages);
  const out = resolve(PUBLIC_DIR, 'sitemap.xml');
  writeFileSync(out, xml, 'utf8');
  console.log(`[sitemap] Wrote ${out}`);
  console.log(`[sitemap] Base URL: ${APP_URL}`);
  console.log(`[sitemap] URLs: `, pages.map(p => p.path).join(', '));
}

main();

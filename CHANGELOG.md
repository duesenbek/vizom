# CHANGELOG

All notable changes to this project will be documented in this file.

## [2025-11-20] - Production Ready Cleanup

### Changed
- Removed technical UI elements (chart library selector)
- Replaced all Russian text with English
- Secured API keys (moved to backend)
- Cleaned duplicate and test files
- Refactored generator.html into modules
- Merged styles directories

### Why
Prepare for production launch - clean, secure, professional codebase

### Impact
- Better UX (simpler interface)
- Secure (no exposed keys)
- Maintainable (modular code)
- Faster (smaller bundles)
- Professional (consistent language)

## [0.3.0] - 2025-11-17
Reason for change: Unify icon system, remove all emoji placeholders, and finalize dual chart library setup.

### Added
- ✅ FontAwesome integration complete
- ✅ Dual Chart.js + ECharts setup via CDN

### Changed
- ✅ All emoji placeholders removed from the codebase

## [0.2.0] - 2025-11-10
Reason for change: Prepare the app for production deployment and improve the first impression.

### Added
- Expanded `.env.example` with complete production-ready variables and guidance.
- Environment validator `src/config/env-fixed.js` (type checks, required, masking secrets, client/server projections).
- Production build config `vite.config.prod-fixed.js` with terser minification, hidden source maps, gzip/brotli, chunk splitting, PWA.
- Post-build optimization script `scripts/optimize-build.js` (HTML minify, meta CSP, `sw.js` generation, build stats).
- Error tracking module `src/tracking/error-tracking.js` (Sentry init, ErrorBoundary, PerformanceMonitor, tracking helpers).
- React landing (separate, non-breaking): `src/react/*` components (Hero, LiveDemo, Features, Gallery, QuickStart, TrustSignals), `App.tsx`, `main.tsx`, and `index-react.html` entry.
- Unified DeepSeek client `src/core/deepseek-complete.ts` with caching, parsing, error handling.
- `package.prod.json` with build/deploy/audit commands.

### Changed
- Updated environment documentation and examples to centralize configuration.
- Production build process generalized to include compression, PWA, and bundle analysis.

### Fixed
- Removed TypeScript syntax from environment JS by providing `env-fixed.js` to avoid TS-in-JS lints.
- Addressed several TypeScript lint categories in new modules (explicit types, safe unknown errors, initialization).

### Security
- Introduced basic CSP meta in post-build; recommend promoting to platform headers for Netlify/Vercel.
- Added rate-limit and CORS variables to `.env.example`.

### Performance
- Code splitting and vendor/manual chunks in Vite config.
- Service worker generation and long-lived asset caching.

### Notes
- React landing is optional and isolated (does not affect existing HTML pages). To enable it you need React deps and a `tsconfig.json` with `jsx: "react-jsx"`.

## [0.1.0] - 2025-11-05
Reason for change: Initial project structure and static pages.

### Added
- Static marketing pages (`index.html`, `generator.html`, etc.).
- Basic Chart.js/D3 demos in generator.

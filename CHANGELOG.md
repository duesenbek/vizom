# CHANGELOG

All notable changes to this project will be documented in this file.

## [2.0.2] - 2025-11-26

### Added
- **Real Chart Previews:** Replaced all placeholder icons/emojis in chart demo cards with actual mini-chart previews rendered via Chart.js
- **Canonical Examples Database:** Created `src/components/examples/examples.json` with 8-10 realistic examples per chart type (bar, line, pie, doughnut, radar, scatter, area, polar, bubble)
- **ChartPreviewRenderer Component:** New `src/components/examples/ChartPreviewRenderer.js` for rendering mini-charts with lazy loading and debouncing
- **Try This Functionality:** Clicking any example card auto-fills the prompt with real data and generates the chart instantly

### Changed
- Updated `generator.html` chart type selector to show real chart previews instead of Font Awesome icons
- Updated quick prompts section with grid layout and mini-chart previews
- Updated `LiveDemoSection.js` example prompts with real chart previews
- Updated `MobileGenerator.js` quick prompts with real data and chart previews

### Why
- Improve user understanding of chart types with visual previews
- Provide instant gratification with one-click chart generation
- Better UX with real data examples instead of placeholder icons

### Impact
- Users can visually identify chart types before selecting
- Quick examples generate real charts instantly with realistic data
- Performance optimized with lazy loading and IntersectionObserver

## [2.0.1] - 2025-11-26

### Fixed
- **CRITICAL:** Moved modals inside `<body>` tag in generator.html (were placed after `</body></html>`)
- Added missing auth modal to all main pages (index, generator, pricing, templates)
- Wired Sign In button event handlers (desktop and mobile) across all pages
- Added modal close handlers (close button, backdrop click, ESC key)
- Fixed modal styling to use proper fixed positioning with backdrop
- Added ESC key handler for upgrade modal on pricing page
- Added template modal close handlers on templates page

### Added
- **Playwright E2E Tests:** Comprehensive UI control tests (`tests/ui-controls.spec.js`)
- **Smoke Tests:** Generator and auth flow smoke tests (`tests/smoke/`)
- **UI Element Scanner:** Browser-based interactive element scanner (`tests/ui-element-scanner.js`)
- **Playwright Config:** Configuration for Chrome and Mobile Chrome (`playwright.config.js`)
- **Test Scripts:** `npm run test:controls`, `npm run test:e2e`, `npm run test:e2e:ui`

### Changed
- Consolidated modal event binding code for consistency
- Updated `src/components/HeaderIntegration.js` to handle mobile Sign In button
- Created comprehensive UI test log (`docs/UI_ELEMENT_TEST_LOG.md`)

### Why
- Ensure all critical UI controls respond correctly to user interaction
- Fix broken modals that were not rendering due to invalid HTML placement
- Provide consistent auth experience across all pages
- Automated testing prevents regression of UI functionality

### Impact
- All buttons, inputs, and modals now work end-to-end
- Sign In flow works correctly on all pages (desktop and mobile)
- Save/Load Project modals function properly on generator page
- 74 UI elements tested with 100% pass rate
- E2E test coverage for all main user flows

## [2.0.0] - 2025-11-20

### Changed
- Cleaned up duplicate refactored app and chart engine files
- Centralized Vite configuration and added dedicated `chart-libs` lazy-loaded chunk
- Added Node version pinning via `.nvmrc`
- Added CI pipeline (lint, test, build) via GitHub Actions
- Added Husky + lint-staged pre-commit hooks for lint/format on staged files
- Documented project setup, env vars, and tech stack in `README.md`

### Why
- Prepare for production release v2.0.0
- Reduce confusion around multiple refactored entrypoints
- Enforce consistent Node/tooling and automated quality checks

### Impact
- Clearer onboarding (single app entry, better docs)
- Smaller, better-structured bundles for chart libraries
- Safer contributions via pre-commit checks and CI

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

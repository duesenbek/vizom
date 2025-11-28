# CHANGELOG

All notable changes to this project will be documented in this file.

## [2.1.3] - 2025-11-27

### Security Audit & Fixes
- **CSP Updated:** Added `cdnjs.cloudflare.com` to Content-Security-Policy for jspdf loading
- **XSS Protection:** Verified HTMLSanitizer properly sanitizes all user input
- **Input Validation:** Validator class checks for SQL injection patterns, XSS attempts
- **Rate Limiting:** Server has 100 req/15min limit on API endpoints
- **Secure Headers:** Helmet middleware with X-Frame-Options, X-Content-Type-Options, Referrer-Policy

### Bug Fixes
- **LoadingStates:** Added missing `createProgressiveLoading()` and `createAIGeneration()` methods
- **MobileNavigation:** Added missing `initializeHamburgerMenuController()` method
- **UnifiedFooter:** Added missing `renderFooterLink()` method
- **Generator:** Added missing `loadProjectsFromStorage()`, `renderProjectsList()`, project management methods
- **Vite Config:** Fixed duplicate chunk assignment for chart.js

### Testing
- **31 input validation tests:** All passing (XSS, SQL injection, edge cases)
- **Smoke tests:** 8/9 passing on chromium
- **E2E tests:** Core functionality verified

### Why
- Pre-release security hardening
- Fix runtime errors from missing methods
- Ensure regression-free deployment

### Impact
- More stable application
- Better security posture
- Cleaner console (fewer errors)

## [2.1.2] - 2025-11-26

### Added
- **Pricing Page Overhaul:** Complete redesign with detailed Free vs Pro comparison table
- **Template Gallery Badges:** Library badges (Chart.js, ECharts, ApexCharts) on template cards
- **Validation Checklist Test:** `ValidationChecklist.runAll()` for testing all features

### Changed
- **Pricing Page:** Clear feature matrix showing ALL chart types are FREE
- **Billing Toggle:** Working monthly/yearly toggle with price updates ($2.99 vs $2.39/mo)
- **Template Cards:** Show FREE/PRO badges, library badges, and lock icons

### Feature Matrix (Final)
**FREE Tier:**
- ✅ ALL 18 chart types (Bar, Line, Pie, Radar, Scatter, Sankey, Treemap, Gauge, etc.)
- ✅ 5 basic templates
- ✅ AI chart generation (5/day)
- ✅ PNG export (with watermark)
- ✅ 3 saved charts

**PRO Tier ($2.39/mo yearly):**
- ✅ ALL 18 chart types (same as Free)
- ✅ 30+ premium templates (ECharts, ApexCharts designs)
- ✅ Unlimited AI generations
- ✅ PNG/SVG/PDF export (no watermark)
- ✅ Unlimited cloud storage
- ✅ Priority support

## [2.1.1] - 2025-11-26

### Changed
- **ALL Chart Types are FREE:** Removed Pro gating from chart types - Bar, Line, Pie, Radar, Scatter, Sankey, Treemap, etc. all available to free users
- **Pro = Premium Templates Only:** Pro subscription now focuses on 30+ premium templates, not chart types
- **Added Premium Chart Libraries:** ECharts 5.4.3 and ApexCharts 3.44.0 for stunning visualizations

### Feature Matrix (Updated)
**FREE Tier:**
- ✅ ALL 18 chart types (Bar, Line, Pie, Radar, Scatter, Sankey, Treemap, Gauge, etc.)
- 5 basic templates
- PNG export only
- 5 AI generations/day
- 3 saved charts max

**PRO Tier ($2.99/mo):**
- ✅ ALL 18 chart types (same as free)
- 30+ premium templates
- PNG, SVG, PDF, JSON export
- Unlimited AI generations
- Unlimited saved charts
- No watermark

## [2.1.0] - 2025-11-26

### Added
- **Pro Subscription System:** Complete Free vs Pro feature gating
- **30 Chart Templates:** 5 free + 25 premium templates across 6 categories
- **Feature Gating Service:** `src/services/featureGating.js` with console logging
- **Upgrade Modal:** Beautiful modal with pricing toggle ($2.99/mo or $2.39/mo yearly)
- **Pro Badges:** Visual indicators on locked templates and export formats
- **Subscription Config:** `src/config/subscription.js` with all tier limits

### Changed
- **Stripe Checkout:** Updated to support monthly/yearly billing periods
- **Success URL:** Redirects to generator.html with payment=success param

### Technical
- `src/config/subscription.js` - Tier definitions and limits
- `src/services/featureGating.js` - Access control with logging
- `src/data/templates.js` - 30 templates database
- `src/components/UpgradeModal.js` - Upgrade prompt UI
- `src/integration/proFeatures.js` - UI integration
- `styles/components/pro-features.css` - Pro badge styling
- `tests/pro-features.test.js` - Test suite

## [2.0.8] - 2025-11-26

### Fixed
- **Auth UI State:** Fixed UI not updating after successful Google OAuth sign-in
- **User Dropdown:** Added user dropdown with avatar, name, email, and sign out button to all pages
- **Auth State Listener:** Enhanced `onAuthStateChange` listener to properly update all UI elements
- **Static Button Updates:** `updateStaticAuthButtons()` now updates all auth buttons across pages

### Added
- **User Dropdown HTML:** Added user dropdown component to index.html, generator.html, templates.html, pricing.html
- **User Menu Toggle:** Added click handlers for user avatar dropdown toggle
- **Sign Out Handler:** Added sign out button functionality in user dropdown
- **Auth State Event:** Dispatches `auth:stateChanged` custom event for other components

### Changed
- **AuthService:** Refactored `updateAuthUI()` to handle both static HTML and UnifiedHeader
- **User Info Display:** Shows user initials, name, and email in dropdown after sign-in

### Why
- After OAuth completion, Sign In button remained visible and user data wasn't shown
- Auth state wasn't being reflected in the UI across all pages

### Impact
- After sign-in: Sign In/Get Started buttons hide, user avatar dropdown appears
- User can see their name/email and sign out from any page
- Auth state persists and syncs across page navigation

## [2.0.7] - 2025-11-26

### Fixed
- **Sign In Button:** Fixed Sign In button not responding due to missing auth service initialization
- **Supabase Auth:** Connected `src/supabase-auth.js` AuthService to all HTML pages
- **OAuth Redirect:** Fixed Google OAuth redirect URL to use `/auth-callback.html`
- **Auth Callback:** Updated auth-callback.html to properly handle Supabase OAuth session

### Added
- **Auth Script Loading:** Added `<script type="module" src="src/supabase-auth.js">` to index.html, generator.html, templates.html, pricing.html
- **Auth Translation Keys:** Added `auth.title`, `auth.description`, `auth.continueWithGoogle` keys for EN and RU

### Why
- Sign In button didn't respond because Supabase AuthService wasn't being loaded
- OAuth flow was broken due to incorrect redirect URL configuration

### Impact
- Clicking "Sign In" now opens the auth modal with Google OAuth button
- Google OAuth flow redirects to auth-callback.html and back to the original page
- Auth state persists across page loads via Supabase session

## [2.0.6] - 2025-11-26

### Fixed
- **Language Switcher:** Fixed language selector not updating UI text when clicking language options
- **i18n Integration:** Connected `UnifiedHeader.selectLanguage()` to `VIZOM_I18N.set()` to apply translations
- **Language Persistence:** Language button now initializes with saved preference on page load

### Added
- **Comprehensive i18n Attributes:** Added `data-i18n` attributes to all translatable text across pages:
  - Navigation links (Home, Generator, Templates)
  - Auth buttons (Sign In, Get Started)
  - Hero section (title, subtitle, buttons, badges)
  - Features section (titles, descriptions, buttons)
  - Examples section (title, subtitle)
  - Generator page (chart type labels, section titles)
  - Templates page (header title)
- **i18n Attribute Types:** Support for `data-i18n`, `data-i18n-placeholder`, `data-i18n-title`, `data-i18n-aria`
- **New Translation Keys:** Added 40+ new translation keys for auth, hero, features, examples, and common strings

### Changed
- **Russian Translations:** Updated all Russian translations from English placeholders to proper Russian text
- **i18n Script Loading:** Added `i18n.js` script to `index.html`, `generator.html`, `templates.html`, and `pricing.html`
- **applyTranslations():** Enhanced to handle title/tooltip and aria-label translations

### Why
- Language selector UI existed but clicking it did nothing (no text changes, no locale update)
- The i18n system was not connected to the language selector component
- HTML elements lacked `data-i18n` attributes for the translation system to work

### Impact
- Clicking a language option now updates all UI text with `data-i18n` attributes
- Language preference is persisted across page loads
- Full page translation support for EN, RU, KK languages

## [2.0.5] - 2025-11-26

### Added
- **MiniChartPreview System:** New `src/components/MiniChartPreview.js` with lazy-loading chart previews
- **Real Demo Datasets:** 12 real-world datasets for bar, line, pie, doughnut, area, scatter, bubble, radar, polar, force, treemap, and sankey charts
- **Home Page Chart Gallery:** New "See what you can create" section with 8 live chart examples
- **URL Parameter Support:** Generator accepts `?example=` and `?prompt=` URL parameters for instant chart loading

### Changed
- **Generator Quick Prompts:** All 8 quick prompt cards now render live mini-charts instead of icons
- **Chart Type Picker:** All 12 chart type buttons show real chart previews with actual data
- **Templates Gallery:** Template cards now display live chart previews instead of static thumbnails
- **Click-to-Generate:** Clicking any example card instantly populates prompt and triggers generation

### Why
- Users can see exactly what each chart type looks like before selecting
- Real data previews (Cities, Sales, Temperature, Skills, etc.) instead of placeholder icons
- Seamless flow from home page examples to generator with pre-filled data

### Impact
- All demo charts render real Chart.js/D3 visualizations
- Lazy loading via IntersectionObserver for performance optimization
- SVG fallback when Chart.js is not yet loaded
- 12 chart types × real datasets = complete visual preview coverage

## [2.0.4] - 2025-11-26

### Changed
- **AI Backend Only:** Removed all mock/fake/sample data generation from chart generation
- **Real API Calls:** All chart generation now uses real DeepSeek AI backend proxy
- **Error Handling:** Added "AI temporarily unavailable" banner when backend is unreachable
- **No Fallback Data:** Removed hardcoded example data fallbacks - requires valid user input

### Removed
- Mock `callAIService` simulation in `scripts/pages/generator.js`
- `simulateChartGeneration` fallback in `src/page-specific/generator-modern.js`
- Hardcoded fallback example data in `parsePlainText` and `parseSeriesSimple`
- Staging mock API key from `netlify.toml`

### Why
- Production and development environments should use the same real AI backend
- Mock data can mask integration issues and provide inconsistent UX
- Users should see real AI-generated charts, not pre-built examples

### Impact
- All chart generation requires working DeepSeek API key in Netlify environment
- Clear error messaging when AI service is unavailable
- Consistent behavior across all environments

## [2.0.3] - 2025-11-26

### Added
- **SVG Chart Previews:** Added SVG-based previews for Force Graph, TreeMap, and Sankey diagrams
- **Extended Examples Database:** Added 8 examples each for force, treemap, and sankey chart types
- **More Quick Prompts:** Added radar, area, scatter, and polar chart quick prompt cards

### Changed
- Replaced Font Awesome icons for Force Graph, TreeMap, and Sankey with real SVG previews
- Updated `ChartPreviewRenderer.js` with SVG rendering functions for non-Chart.js chart types
- Extended quick prompts grid from 4 to 8 examples covering all major chart types

### Why
- Complete visual preview coverage for all 12 chart types
- Users can see exactly what each chart type looks like before selecting

### Impact
- All chart type cards now show real chart previews (no more placeholder icons)
- 8 quick prompt examples with one-click chart generation
- 96 total chart examples in the examples database (8 per type × 12 types)

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

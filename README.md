# Vizom - AI-Powered Data Visualization

Vizom is an AI-powered chart generation tool that helps you turn raw data and natural language instructions into production-ready visualizations.

It supports multiple charting libraries, secure backend-powered AI calls, and export-focused workflows.

## Features

- 🤖 AI-generated charts (DeepSeek integration via secure backend)
- 📈 Multiple chart libraries (Chart.js, ECharts, ApexCharts, Plotly)
- 🎨 Customizable themes and templates
- 💾 Export to PNG, SVG, PDF
- 🔐 Secure API key handling (no keys in the frontend)

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## Environment Variables

Configure your environment (e.g. `.env.local`, Netlify environment, or server `.env`) with:

```text
DEEPSEEK_API_KEY=your_api_key_here
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_key
```

`DEEPSEEK_API_KEY` is used only on the server / serverless functions. Do **not** expose it in client bundles.

## Tech Stack

- Vite + ES Modules
- Chart.js / ECharts / ApexCharts / Plotly.js
- Supabase (auth & database)
- Netlify Functions (serverless backend)
- Vitest (testing)

## Development Workflow

- `npm run dev` — Vite dev server + Node backend
- `npm run test` — unit tests (Vitest)
- `npm run build` — optimized production build

## E2E Testing (Playwright)

Full end-to-end tests for `/generator.html` and `/index.html`.

### Run E2E Tests

```bash
# Run all E2E tests (headless)
npx playwright test tests/e2e/

# Run in headed mode (see browser)
npx playwright test tests/e2e/ --headed

# Run specific test file
npx playwright test tests/e2e/generator.e2e.spec.js

# Run with UI mode
npx playwright test --ui

# Generate HTML report
npx playwright test tests/e2e/ --reporter=html
npx playwright show-report
```

### Test Coverage

**Generator Page (`/generator.html`)**
- Prompt input and Generate button visibility
- Chart generation flow with preview
- Chart type switching (bar, line, pie, etc.)
- Export menu (PNG, SVG, PDF)
- Save/Load project modals
- Guest user: Sign In UI, Pro features disabled
- Mobile responsiveness
- Console error detection

**Homepage (`/index.html`)**
- Hero section with CTA form
- Navigation links
- Auth modal (open/close via ESC, button, backdrop)
- Hero form redirect to generator
- Mobile menu toggle
- Footer links

### Configuration

Tests use `playwright.config.js` with:
- Base URL: `http://localhost:3000`
- Browsers: Chromium, Mobile Chrome
- Auto-start dev server before tests
- Screenshots on failure
- HTML report generation

## License

ISC

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

## License

ISC

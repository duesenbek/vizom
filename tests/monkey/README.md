# Vizom Monkey Testing with Gremlins.js

Automated chaos testing for UI bug hunting and regression checks.

## Overview

This module uses [gremlins.js](https://github.com/marmelab/gremlins.js) to simulate random user interactions and find edge cases, race conditions, and UI bugs that manual testing might miss.

## Quick Start

```bash
# Run standard monkey test (30 seconds)
npm run test:monkey

# Quick test (10 seconds)
npm run test:monkey:quick

# Long test (2 minutes)
npm run test:monkey:long

# Reproducible test with fixed seed
npm run test:monkey:seed
```

## Test Types

### 1. Standard Monkey Test
Random clicking, typing, scrolling, and form filling across all pages.

### 2. Modal Stress Test
Rapidly opens and closes modals to find race conditions.

### 3. Form Fuzzing Test
Tests input fields with edge cases:
- Empty strings
- Very long strings (10,000+ chars)
- XSS payloads
- SQL injection attempts
- Unicode characters
- Control characters

### 4. Rapid Click Stress Test
Simulates users rapidly clicking UI elements.

### 5. Reproducible Regression Test
Uses a fixed seed for deterministic testing.

## Configuration

Edit `gremlins-config.js` to customize:

```javascript
export const gremlinsConfig = {
  duration: 30000,        // Test duration in ms
  delay: 50,              // Delay between actions
  seed: null,             // Random seed (null = random)
  
  // Elements to protect from gremlins
  protectedSelectors: [
    'a[href^="http"]',    // External links
    '.btn-danger',        // Dangerous actions
    '#logout-btn'         // Auth actions
  ],
  
  // Gremlin species weights
  species: {
    clicker: { enabled: true, weight: 3 },
    formFiller: { enabled: true, weight: 2 },
    scroller: { enabled: true, weight: 1 },
    typer: { enabled: true, weight: 1 }
  }
};
```

## Browser UI

For manual testing, open the browser UI:

```
http://localhost:5173/tests/monkey/monkey-test-ui.html
```

Features:
- Visual test configuration
- Real-time stats (actions, errors, FPS)
- Live iframe preview
- Event logging
- Report download

## Console Testing

You can also run tests from the browser console:

```javascript
// Quick 10-second test
await window.startMonkeyTest(10000);

// Custom test
const horde = new GremlinsHorde({
  duration: 60000,
  seed: 12345
});
const report = await horde.unleash();
console.log(report);
```

## Reports

Test reports are saved to `tests/monkey/reports/` and include:
- Summary statistics
- Error details with stack traces
- Screenshots (on error and at intervals)
- Action counts and timing

## CI Integration

Add to your CI pipeline:

```yaml
- name: Run Monkey Tests
  run: npm run test:monkey
  env:
    MONKEY_DURATION: 60000
    MONKEY_SEED: ${{ github.run_id }}
```

## Troubleshooting

### Test fails immediately
- Ensure dev server is running: `npm run dev`
- Check that pages load correctly

### Too many false positives
- Add patterns to `errorDetection.ignorePatterns`
- Protect sensitive elements with `protectedSelectors`

### Tests are flaky
- Use a fixed seed: `MONKEY_SEED=12345 npm run test:monkey`
- Increase delay between actions

## Files

```
tests/monkey/
├── gremlins-config.js    # Configuration
├── gremlins-horde.js     # Main testing engine
├── monkey.spec.js        # Playwright test specs
├── monkey-test-ui.html   # Browser testing UI
├── screenshots/          # Test screenshots
└── reports/              # Test reports
```

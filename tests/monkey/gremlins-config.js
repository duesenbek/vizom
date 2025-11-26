/**
 * Gremlins.js Configuration for Vizom
 * Automated monkey testing for UI bug hunting and regression checks
 * 
 * @see https://github.com/marmelab/gremlins.js
 */

export const gremlinsConfig = {
  // Test duration in milliseconds
  duration: 30000, // 30 seconds default
  
  // Delay between gremlin actions (ms)
  delay: 50,
  
  // Random seed for reproducible tests
  seed: null, // Set to a number for reproducible runs
  
  // Pages to test
  pages: [
    { name: 'Home', path: '/' },
    { name: 'Generator', path: '/generator.html' }
  ],
  
  // Elements to protect from gremlins (won't be clicked/interacted with)
  protectedSelectors: [
    // Navigation that leaves the page
    'a[href^="http"]',
    'a[target="_blank"]',
    // Dangerous actions
    '[data-action="delete"]',
    '[data-action="reset"]',
    '.btn-danger',
    // Payment/auth flows
    '[data-stripe]',
    '.stripe-button',
    '#logout-btn',
    // External links
    '.external-link'
  ],
  
  // Elements to focus testing on
  targetSelectors: [
    // Interactive elements
    'button',
    'input',
    'textarea',
    'select',
    '.btn',
    '.chart-option',
    '.export-menu-option',
    '.quick-prompt-card',
    '.template-card',
    // Modals
    '.modal-close',
    '[role="dialog"] button',
    // Navigation
    'nav a',
    '.nav-link'
  ],
  
  // Gremlin species configuration
  species: {
    clicker: {
      enabled: true,
      weight: 3, // Higher weight = more frequent
      clickTypes: ['click', 'dblclick']
    },
    toucher: {
      enabled: true,
      weight: 2,
      touchTypes: ['tap', 'doubletap', 'gesture']
    },
    formFiller: {
      enabled: true,
      weight: 2,
      // Sample inputs for form fields
      sampleTexts: [
        'Create a bar chart showing sales data',
        'Pie chart of market share',
        'Line graph with monthly revenue',
        'Test input with special chars: <script>alert("xss")</script>',
        '12345',
        '',
        'A'.repeat(1000), // Long input test
        '日本語テスト', // Unicode test
        'SELECT * FROM users; DROP TABLE users;--' // SQL injection test
      ]
    },
    scroller: {
      enabled: true,
      weight: 1
    },
    typer: {
      enabled: true,
      weight: 1,
      keyTypes: ['character', 'special'] // special = Enter, Tab, Escape, etc.
    }
  },
  
  // Error detection configuration
  errorDetection: {
    // Console errors to capture
    consoleErrors: true,
    consoleWarnings: false,
    
    // Network errors
    networkErrors: true,
    
    // Unhandled promise rejections
    unhandledRejections: true,
    
    // DOM exceptions
    domExceptions: true,
    
    // Custom error patterns to watch for
    errorPatterns: [
      /TypeError/i,
      /ReferenceError/i,
      /SyntaxError/i,
      /Cannot read propert/i,
      /undefined is not/i,
      /null is not/i,
      /Maximum call stack/i,
      /Failed to fetch/i
    ],
    
    // Ignore these error patterns (known issues, third-party, etc.)
    ignorePatterns: [
      /ResizeObserver loop/i, // Common benign error
      /Loading chunk/i, // Vite HMR
      /Failed to load resource.*favicon/i
    ]
  },
  
  // Screenshot configuration
  screenshots: {
    enabled: true,
    onError: true, // Capture on error
    interval: 5000, // Capture every 5 seconds
    directory: 'tests/monkey/screenshots'
  },
  
  // Report configuration
  reports: {
    directory: 'tests/monkey/reports',
    formats: ['json', 'html']
  }
};

export default gremlinsConfig;

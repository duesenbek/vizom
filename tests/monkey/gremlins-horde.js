/**
 * Gremlins.js Horde - Main Monkey Testing Engine
 * 
 * This module provides automated chaos testing for the Vizom UI.
 * It simulates random user interactions to find edge cases and bugs.
 */

import gremlinsConfig from './gremlins-config.js';

class GremlinsHorde {
  constructor(config = gremlinsConfig) {
    this.config = config;
    this.errors = [];
    this.warnings = [];
    this.actions = [];
    this.screenshots = [];
    this.startTime = null;
    this.isRunning = false;
    this.gremlins = null;
    this.actionCount = 0;
    this.seed = config.seed || Date.now();
  }

  /**
   * Initialize the gremlins library
   */
  async init() {
    // Load gremlins.js from CDN if not already loaded
    if (!window.gremlins) {
      await this.loadGremlinsScript();
    }
    
    this.gremlins = window.gremlins;
    this.setupErrorListeners();
    this.setupProtectedElements();
    
    console.log('[Gremlins] Horde initialized with seed:', this.seed);
    return this;
  }

  /**
   * Load gremlins.js script dynamically
   */
  loadGremlinsScript() {
    return new Promise((resolve, reject) => {
      if (window.gremlins) {
        resolve();
        return;
      }
      
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/gremlins.js@2.2.0/dist/gremlins.min.js';
      script.onload = resolve;
      script.onerror = () => reject(new Error('Failed to load gremlins.js'));
      document.head.appendChild(script);
    });
  }

  /**
   * Setup error listeners to capture issues during testing
   */
  setupErrorListeners() {
    const { errorDetection } = this.config;
    
    // Console error capture
    if (errorDetection.consoleErrors) {
      const originalError = console.error;
      console.error = (...args) => {
        const message = args.map(a => String(a)).join(' ');
        if (!this.shouldIgnoreError(message)) {
          this.captureError('console.error', message);
        }
        originalError.apply(console, args);
      };
    }
    
    // Console warning capture
    if (errorDetection.consoleWarnings) {
      const originalWarn = console.warn;
      console.warn = (...args) => {
        const message = args.map(a => String(a)).join(' ');
        if (!this.shouldIgnoreError(message)) {
          this.warnings.push({
            type: 'console.warn',
            message,
            timestamp: Date.now(),
            actionCount: this.actionCount
          });
        }
        originalWarn.apply(console, args);
      };
    }
    
    // Global error handler
    window.addEventListener('error', (event) => {
      if (!this.shouldIgnoreError(event.message)) {
        this.captureError('window.error', event.message, {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno
        });
      }
    });
    
    // Unhandled promise rejections
    if (errorDetection.unhandledRejections) {
      window.addEventListener('unhandledrejection', (event) => {
        const message = event.reason?.message || String(event.reason);
        if (!this.shouldIgnoreError(message)) {
          this.captureError('unhandledrejection', message);
        }
      });
    }
  }

  /**
   * Check if an error should be ignored based on config patterns
   */
  shouldIgnoreError(message) {
    const { ignorePatterns } = this.config.errorDetection;
    return ignorePatterns.some(pattern => pattern.test(message));
  }

  /**
   * Capture an error with context
   */
  captureError(type, message, extra = {}) {
    const error = {
      type,
      message,
      timestamp: Date.now(),
      actionCount: this.actionCount,
      url: window.location.href,
      ...extra
    };
    
    this.errors.push(error);
    console.log('[Gremlins] Error captured:', error);
    
    // Take screenshot on error if enabled
    if (this.config.screenshots.onError) {
      this.captureScreenshot('error');
    }
  }

  /**
   * Setup protection for elements that shouldn't be interacted with
   */
  setupProtectedElements() {
    const { protectedSelectors } = this.config;
    
    protectedSelectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => {
        el.dataset.gremlinsProtected = 'true';
      });
    });
  }

  /**
   * Create custom gremlin species based on config
   */
  createSpecies() {
    const species = [];
    const { species: speciesConfig, targetSelectors, protectedSelectors } = this.config;
    
    // Clicker gremlin
    if (speciesConfig.clicker.enabled) {
      const clicker = this.gremlins.species.clicker({
        clickTypes: speciesConfig.clicker.clickTypes,
        canClick: (element) => {
          // Check if element is protected
          if (element.dataset?.gremlinsProtected === 'true') return false;
          if (element.closest('[data-gremlins-protected="true"]')) return false;
          
          // Check protected selectors
          for (const selector of protectedSelectors) {
            if (element.matches(selector) || element.closest(selector)) return false;
          }
          
          return true;
        },
        log: true
      });
      
      for (let i = 0; i < speciesConfig.clicker.weight; i++) {
        species.push(clicker);
      }
    }
    
    // Form filler gremlin
    if (speciesConfig.formFiller.enabled) {
      const formFiller = this.gremlins.species.formFiller({
        randomizer: () => {
          const texts = speciesConfig.formFiller.sampleTexts;
          return texts[Math.floor(Math.random() * texts.length)];
        },
        log: true
      });
      
      for (let i = 0; i < speciesConfig.formFiller.weight; i++) {
        species.push(formFiller);
      }
    }
    
    // Scroller gremlin
    if (speciesConfig.scroller.enabled) {
      const scroller = this.gremlins.species.scroller({
        log: true
      });
      
      for (let i = 0; i < speciesConfig.scroller.weight; i++) {
        species.push(scroller);
      }
    }
    
    // Typer gremlin
    if (speciesConfig.typer.enabled) {
      const typer = this.gremlins.species.typer({
        log: true
      });
      
      for (let i = 0; i < speciesConfig.typer.weight; i++) {
        species.push(typer);
      }
    }
    
    return species;
  }

  /**
   * Create mogwai (monitoring) species
   */
  createMogwais() {
    return [
      // FPS monitor
      this.gremlins.mogwais.fps({
        delay: 500,
        levelSelector: (fps) => {
          if (fps < 10) return 'error';
          if (fps < 30) return 'warn';
          return 'log';
        }
      }),
      
      // Alert monitor (captures and dismisses alerts)
      this.gremlins.mogwais.alert(),
      
      // GremlinsBefore/After hooks for action tracking
      {
        cleanUp: () => {
          this.actionCount++;
        }
      }
    ];
  }

  /**
   * Capture a screenshot (placeholder - actual implementation depends on environment)
   */
  captureScreenshot(reason = 'interval') {
    // In browser context, we can use html2canvas or similar
    // For Playwright, screenshots are handled differently
    const screenshot = {
      reason,
      timestamp: Date.now(),
      actionCount: this.actionCount,
      url: window.location.href
    };
    
    this.screenshots.push(screenshot);
    
    // If html2canvas is available, capture actual screenshot
    if (window.html2canvas) {
      window.html2canvas(document.body).then(canvas => {
        screenshot.dataUrl = canvas.toDataURL('image/png');
      });
    }
    
    return screenshot;
  }

  /**
   * Start the monkey testing
   */
  async unleash(options = {}) {
    const duration = options.duration || this.config.duration;
    
    if (this.isRunning) {
      console.warn('[Gremlins] Horde is already running');
      return;
    }
    
    await this.init();
    
    this.isRunning = true;
    this.startTime = Date.now();
    this.errors = [];
    this.warnings = [];
    this.actions = [];
    this.actionCount = 0;
    
    console.log(`[Gremlins] Unleashing horde for ${duration}ms...`);
    
    // Create the horde
    const horde = this.gremlins.createHorde({
      species: this.createSpecies(),
      mogwais: this.createMogwais(),
      strategies: [
        this.gremlins.strategies.distribution({
          delay: this.config.delay
        })
      ],
      randomizer: new this.gremlins.Chance(this.seed)
    });
    
    // Setup periodic screenshots
    let screenshotInterval;
    if (this.config.screenshots.enabled && this.config.screenshots.interval) {
      screenshotInterval = setInterval(() => {
        this.captureScreenshot('interval');
      }, this.config.screenshots.interval);
    }
    
    // Run the horde
    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        horde.stop();
        this.stop();
        if (screenshotInterval) clearInterval(screenshotInterval);
        resolve(this.generateReport());
      }, duration);
      
      horde.unleash().then(() => {
        clearTimeout(timeout);
        if (screenshotInterval) clearInterval(screenshotInterval);
        this.stop();
        resolve(this.generateReport());
      });
    });
  }

  /**
   * Stop the monkey testing
   */
  stop() {
    this.isRunning = false;
    console.log('[Gremlins] Horde stopped');
  }

  /**
   * Generate a test report
   */
  generateReport() {
    const endTime = Date.now();
    const duration = endTime - this.startTime;
    
    const report = {
      summary: {
        seed: this.seed,
        duration,
        startTime: new Date(this.startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
        totalActions: this.actionCount,
        actionsPerSecond: (this.actionCount / (duration / 1000)).toFixed(2),
        totalErrors: this.errors.length,
        totalWarnings: this.warnings.length,
        passed: this.errors.length === 0
      },
      errors: this.errors,
      warnings: this.warnings,
      screenshots: this.screenshots,
      config: {
        pages: this.config.pages,
        protectedSelectors: this.config.protectedSelectors,
        targetSelectors: this.config.targetSelectors
      }
    };
    
    console.log('[Gremlins] Report generated:', report.summary);
    
    return report;
  }
}

// Export for ES modules
export { GremlinsHorde };
export default GremlinsHorde;

// Make available globally for browser console testing
if (typeof window !== 'undefined') {
  window.GremlinsHorde = GremlinsHorde;
  window.startMonkeyTest = async (duration = 30000) => {
    const horde = new GremlinsHorde();
    return await horde.unleash({ duration });
  };
}

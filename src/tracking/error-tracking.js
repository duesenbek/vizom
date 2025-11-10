/**
 * Sentry Error Tracking Integration
 * Production-ready error tracking with context and user feedback
 */

import * as Sentry from '@sentry/browser';
import { BrowserTracing } from '@sentry/tracing';
import { getEnv } from '../config/env-fixed.js';

// Initialize Sentry with configuration
export function initializeSentry() {
  const sentryDsn = getEnv('SENTRY_DSN');
  const environment = getEnv('SENTRY_ENVIRONMENT') || 'production';
  const release = getEnv('SENTRY_RELEASE') || '1.0.0';
  const enableErrorTracking = getEnv('ENABLE_ERROR_TRACKING');

  if (!enableErrorTracking || !sentryDsn) {
    console.log('📊 Sentry error tracking is disabled');
    return;
  }

  Sentry.init({
    dsn: sentryDsn,
    environment,
    release,
    
    // Performance monitoring
    integrations: [
      new BrowserTracing({
        tracingOrigins: [
          'localhost',
          /^https:\/\/api\.deepseek\.com/,
          /^https:\/\/your-domain\.com/,
        ],
      }),
    ],

    // Set sample rate for performance monitoring
    tracesSampleRate: 0.1, // 10% of transactions for performance

    // Set sample rate for error reporting
    sampleRate: 1.0, // 100% of errors

    // Before sending error, add custom context
    beforeSend(event, hint) {
      // Add custom context to errors
      event.contexts = {
        ...event.contexts,
        app: {
          name: 'Vizom',
          version: release,
          environment,
        },
        browser: {
          userAgent: navigator.userAgent,
          language: navigator.language,
          cookieEnabled: navigator.cookieEnabled,
        },
        device: {
          screenWidth: window.screen.width,
          screenHeight: window.screen.height,
          pixelRatio: window.devicePixelRatio,
        },
      };

      // Filter out certain errors
      if (event.exception) {
        const error = hint.originalException;
        
        // Ignore network errors that are expected
        if (error?.message?.includes('Network request failed')) {
          return null;
        }
        
        // Ignore Chrome extension errors
        if (error?.message?.includes('Non-Error promise rejection captured')) {
          return null;
        }
      }

      return event;
    },

    // Custom tags for better filtering
    initialScope: {
      tags: {
        component: 'frontend',
        framework: 'javascript',
      },
    },

    // Debug mode for development
    debug: environment === 'development',
  });

  console.log('📊 Sentry error tracking initialized');
}

// Custom error tracking functions
export class ErrorTracker {
  /**
   * Track custom error with context
   */
  static trackError(error, context = {}) {
    if (!getEnv('ENABLE_ERROR_TRACKING')) return;

    Sentry.withScope((scope) => {
      // Add tags
      scope.setTag('customError', 'true');
      
      // Add extra context
      Object.keys(context).forEach(key => {
        scope.setExtra(key, context[key]);
      });

      // Capture the exception
      Sentry.captureException(error);
    });
  }

  /**
   * Track user action for context
   */
  static trackUserAction(action, properties = {}) {
    if (!getEnv('ENABLE_ERROR_TRACKING')) return;

    Sentry.addBreadcrumb({
      category: 'user',
      message: action,
      level: 'info',
      data: properties,
    });
  }

  /**
   * Track API request errors
   */
  static trackAPIError(error, endpoint, method, requestData = {}) {
    if (!getEnv('ENABLE_ERROR_TRACKING')) return;

    Sentry.withScope((scope) => {
      scope.setTag('apiError', 'true');
      scope.setTag('endpoint', endpoint);
      scope.setTag('method', method);
      scope.setExtra('requestData', requestData);
      
      Sentry.captureException(error);
    });
  }

  /**
   * Track performance metrics
   */
  static trackPerformance(metricName, value, unit = 'milliseconds') {
    if (!getEnv('ENABLE_ERROR_TRACKING')) return;

    Sentry.addBreadcrumb({
      category: 'performance',
      message: metricName,
      level: 'info',
      data: {
        value,
        unit,
        timestamp: Date.now(),
      },
    });
  }

  /**
   * Set user context for better error tracking
   */
  static setUser(user) {
    if (!getEnv('ENABLE_ERROR_TRACKING')) return;

    Sentry.setUser({
      id: user.id,
      email: user.email,
      username: user.username,
    });
  }

  /**
   * Clear user context
   */
  static clearUser() {
    if (!getEnv('ENABLE_ERROR_TRACKING')) return;

    Sentry.setUser(null);
  }

  /**
   * Track feature usage
   */
  static trackFeatureUsage(featureName, properties = {}) {
    if (!getEnv('ENABLE_ERROR_TRACKING')) return;

    Sentry.addBreadcrumb({
      category: 'feature',
      message: featureName,
      level: 'info',
      data: properties,
    });
  }

  /**
   * Track chart generation errors specifically
   */
  static trackChartError(error, chartType, prompt, responseTime) {
    if (!getEnv('ENABLE_ERROR_TRACKING')) return;

    Sentry.withScope((scope) => {
      scope.setTag('chartError', 'true');
      scope.setTag('chartType', chartType);
      scope.setExtra('prompt', prompt.substring(0, 100)); // Limit size
      scope.setExtra('responseTime', responseTime);
      
      Sentry.captureException(error);
    });
  }
}

// Error Boundary Component
export class ErrorBoundary {
  constructor(elementId = 'app') {
    this.elementId = elementId;
    this.setupErrorHandlers();
  }

  setupErrorHandlers() {
    // Global error handler
    window.addEventListener('error', (event) => {
      ErrorTracker.trackError(event.error, {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        message: event.message,
      });
    });

    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      ErrorTracker.trackError(event.reason, {
        type: 'unhandledrejection',
        promise: event.promise,
      });
    });

    // Resource loading errors
    window.addEventListener('error', (event) => {
      if (event.target !== window) {
        ErrorTracker.trackError(new Error(`Resource loading failed: ${event.target.src || event.target.href}`), {
          resourceType: event.target.tagName,
          resourceUrl: event.target.src || event.target.href,
        });
      }
    }, true);
  }

  /**
   * Show error fallback UI
   */
  showErrorFallback(error) {
    const element = document.getElementById(this.elementId);
    if (!element) return;

    element.innerHTML = `
      <div class="error-fallback">
        <div class="error-content">
          <h2>Oops! Something went wrong</h2>
          <p>We're sorry, but something unexpected happened. Our team has been notified.</p>
          <div class="error-actions">
            <button onclick="window.location.reload()" class="btn btn-primary">
              Reload Page
            </button>
            <button onclick="window.history.back()" class="btn btn-secondary">
              Go Back
            </button>
          </div>
          <details class="error-details">
            <summary>Error Details</summary>
            <pre>${error.message}</pre>
          </details>
        </div>
      </div>
    `;

    // Add error styles if not already present
    if (!document.getElementById('error-fallback-styles')) {
      const styles = document.createElement('style');
      styles.id = 'error-fallback-styles';
      styles.textContent = `
        .error-fallback {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: #f8fafc;
          padding: 20px;
        }
        
        .error-content {
          text-align: center;
          max-width: 500px;
          background: white;
          padding: 40px;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }
        
        .error-content h2 {
          color: #ef4444;
          margin-bottom: 16px;
        }
        
        .error-content p {
          color: #64748b;
          margin-bottom: 24px;
        }
        
        .error-actions {
          display: flex;
          gap: 12px;
          justify-content: center;
          margin-bottom: 24px;
        }
        
        .btn {
          padding: 12px 24px;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .btn-primary {
          background: #3b82f6;
          color: white;
        }
        
        .btn-primary:hover {
          background: #2563eb;
        }
        
        .btn-secondary {
          background: #e2e8f0;
          color: #475569;
        }
        
        .btn-secondary:hover {
          background: #cbd5e1;
        }
        
        .error-details {
          text-align: left;
          margin-top: 24px;
        }
        
        .error-details summary {
          cursor: pointer;
          color: #64748b;
          margin-bottom: 8px;
        }
        
        .error-details pre {
          background: #f1f5f9;
          padding: 12px;
          border-radius: 4px;
          font-size: 12px;
          overflow-x: auto;
        }
      `;
      document.head.appendChild(styles);
    }
  }
}

// Performance monitoring
export class PerformanceMonitor {
  constructor() {
    this.metrics = {};
    this.observers = [];
  }

  /**
   * Start monitoring performance
   */
  startMonitoring() {
    // Monitor Core Web Vitals
    this.observeWebVitals();
    
    // Monitor API performance
    this.monitorAPIPerformance();
    
    // Monitor user interactions
    this.monitorUserInteractions();
  }

  observeWebVitals() {
    // Largest Contentful Paint (LCP)
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      
      ErrorTracker.trackPerformance('LCP', Math.round(lastEntry.startTime), 'milliseconds');
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // First Input Delay (FID)
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry) => {
        ErrorTracker.trackPerformance('FID', Math.round(entry.processingStart - entry.startTime), 'milliseconds');
      });
    }).observe({ entryTypes: ['first-input'] });

    // Cumulative Layout Shift (CLS)
    let clsValue = 0;
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      }
      ErrorTracker.trackPerformance('CLS', Math.round(clsValue * 1000) / 1000, 'score');
    }).observe({ entryTypes: ['layout-shift'] });
  }

  monitorAPIPerformance() {
    // Override fetch to monitor API calls
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const startTime = performance.now();
      const url = args[0];
      
      try {
        const response = await originalFetch(...args);
        const endTime = performance.now();
        const duration = Math.round(endTime - startTime);
        
        ErrorTracker.trackPerformance('API_REQUEST', duration, 'milliseconds');
        
        return response;
      } catch (error) {
        const endTime = performance.now();
        const duration = Math.round(endTime - startTime);
        
        ErrorTracker.trackAPIError(error, url, args[1]?.method || 'GET', {
          duration,
          timestamp: Date.now(),
        });
        
        throw error;
      }
    };
  }

  monitorUserInteractions() {
    // Track click performance
    document.addEventListener('click', (event) => {
      const startTime = performance.now();
      
      // Use setTimeout to measure response time
      setTimeout(() => {
        const responseTime = Math.round(performance.now() - startTime);
        ErrorTracker.trackPerformance('CLICK_RESPONSE', responseTime, 'milliseconds');
      }, 0);
    });
  }
}

// Initialize error tracking
export function initializeErrorTracking() {
  // Initialize Sentry
  initializeSentry();
  
  // Set up error boundary
  const errorBoundary = new ErrorBoundary();
  
  // Start performance monitoring
  const performanceMonitor = new PerformanceMonitor();
  performanceMonitor.startMonitoring();
  
  // Track page load
  window.addEventListener('load', () => {
    const loadTime = Math.round(performance.now());
    ErrorTracker.trackPerformance('PAGE_LOAD', loadTime, 'milliseconds');
  });
  
  console.log('📊 Error tracking system initialized');
}

// Export for use in other modules
export { Sentry };

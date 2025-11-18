/**
 * @file src/tracking/error-tracking.stub.js
 * @description Browser-safe stub for error tracking. Exposes the same public
 *              API as the production module but avoids external dependencies
 *              like Sentry so it can run directly from static HTML.
 */

/**
 * Lightweight error tracking helper used when Sentry or the full
 * error-tracking stack is not available.
 */
export class ErrorTracker {
  /**
   * Track a custom error with optional context.
   *
   * @param {unknown} error Error instance or message.
   * @param {Record<string, any>} [context] Arbitrary contextual fields.
   */
  static trackError(error, context = {}) {
    console.error('[ErrorTrackerStub] Error captured', { error, context });
  }

  /**
   * Track a high-level user action for diagnostics.
   *
   * @param {string} action Action name (e.g. "chart_export").
   * @param {Record<string, any>} [properties] Extra attributes.
   */
  static trackUserAction(action, properties = {}) {
    console.info('[ErrorTrackerStub] User action', { action, properties });
  }

  /**
   * Track an API request error.
   *
   * @param {unknown} error Error instance or message.
   * @param {string} endpoint Request URL or identifier.
   * @param {string} method HTTP method (GET, POST, etc.).
   * @param {Record<string, any>} [requestData] Optional request metadata.
   */
  static trackAPIError(error, endpoint, method, requestData = {}) {
    console.error('[ErrorTrackerStub] API error', { error, endpoint, method, requestData });
  }

  /**
   * Track a generic performance metric.
   *
   * @param {string} metricName Metric identifier (e.g. "PAGE_LOAD").
   * @param {number} value Numeric value of the metric.
   * @param {string} [unit="milliseconds"] Unit of measurement.
   */
  static trackPerformance(metricName, value, unit = 'milliseconds') {
    console.info('[ErrorTrackerStub] Performance metric', { metricName, value, unit });
  }

  /**
   * Attach user information to later error events.
   *
   * @param {{id?: string; email?: string; username?: string}} user User descriptor.
   */
  static setUser(user) {
    console.info('[ErrorTrackerStub] Set user', { user });
  }

  /**
   * Clear any stored user context.
   */
  static clearUser() {
    console.info('[ErrorTrackerStub] Clear user');
  }

  /**
   * Track feature usage for analytics or debugging.
   *
   * @param {string} featureName Feature identifier.
   * @param {Record<string, any>} [properties] Arbitrary attributes.
   */
  static trackFeatureUsage(featureName, properties = {}) {
    console.info('[ErrorTrackerStub] Feature usage', { featureName, properties });
  }

  /**
   * Track an error related specifically to chart generation.
   *
   * @param {unknown} error Error instance or message.
   * @param {string} chartType Chart type involved (e.g. "bar").
   * @param {string} prompt User prompt used for generation.
   * @param {number} responseTime Response time in milliseconds.
   */
  static trackChartError(error, chartType, prompt, responseTime) {
    console.error('[ErrorTrackerStub] Chart error', {
      error,
      chartType,
      promptLength: prompt ? prompt.length : 0,
      responseTime,
    });
  }
}

/**
 * Minimal error boundary stub that wires global error handlers and delegates
 * to {@link ErrorTracker}.
 */
export class ErrorBoundary {
  /**
   * @param {string} [elementId="app"] Root element id for fallback UI.
   */
  constructor(elementId = 'app') {
    /** @type {string} */
    this.elementId = elementId;
    this.setupErrorHandlers();
  }

  /**
   * Attach window-level error listeners that forward to {@link ErrorTracker}.
   */
  setupErrorHandlers() {
    window.addEventListener('error', (event) => {
      ErrorTracker.trackError(event.error || event.message, {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      ErrorTracker.trackError(event.reason, { type: 'unhandledrejection' });
    });
  }

  /**
   * Render a very small fallback UI into the configured root element.
   *
   * @param {Error | { message?: string } | unknown} error Error to display.
   */
  showErrorFallback(error) {
    const el = document.getElementById(this.elementId);
    if (!el) return;

    const message =
      (typeof error === 'object' && error && 'message' in error && error.message) ||
      'Something went wrong.';

    el.innerHTML = `<div class="p-4 rounded-lg bg-red-50 text-red-700 text-sm">${message}</div>`;
  }
}

/**
 * Lightweight performance monitor stub.
 * The full module observes Web Vitals; here we just log a single message.
 */
export class PerformanceMonitor {
  /**
   * Start performance monitoring.
   */
  startMonitoring() {
    console.info('[ErrorTrackerStub] PerformanceMonitor.startMonitoring called.');
  }
}

/**
 * Initialize error tracking utilities.
 *
 * In the stub this simply wires the {@link ErrorBoundary} and
 * {@link PerformanceMonitor} and logs a message.
 */
export function initializeErrorTracking() {
  // Set up basic boundary and monitoring.
  const boundary = new ErrorBoundary();
  const monitor = new PerformanceMonitor();
  monitor.startMonitoring();

  console.info('[ErrorTrackerStub] initializeErrorTracking called.', { boundaryInitialized: true });
}

/**
 * Minimal Sentry-like object so existing code can import { Sentry } safely.
 * All methods are no-ops that log to the console.
 *
 * @type {{
 *   init?: (options?: any) => void,
 *   captureException?: (error: any) => void,
 *   addBreadcrumb?: (breadcrumb: any) => void,
 *   setUser?: (user: any) => void,
 * }}
 */
export const Sentry = {
  init(options) {
    console.info('[ErrorTrackerStub] Sentry.init (stub)', options);
  },
  captureException(error) {
    console.error('[ErrorTrackerStub] Sentry.captureException (stub)', error);
  },
  addBreadcrumb(breadcrumb) {
    console.info('[ErrorTrackerStub] Sentry.addBreadcrumb (stub)', breadcrumb);
  },
  setUser(user) {
    console.info('[ErrorTrackerStub] Sentry.setUser (stub)', user);
  },
};

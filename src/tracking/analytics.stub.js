/**
 * @file src/tracking/analytics.stub.js
 * @description Minimal analytics stub. Mirrors the public API of
 *              `src/tracking/analytics.js` but avoids loading any
 *              external provider scripts so it is safe for static HTML usage.
 */

/**
 * Initialize analytics providers.
 *
 * @param {Array<'plausible' | 'umami' | 'ga'>} [preferred]
 *   Optional preference order for providers. The stub ignores this value
 *   but keeps the signature for compatibility.
 * @returns {Promise<null>} Resolves when initialization has completed.
 */
export async function initializeAnalytics(preferred = ['plausible', 'umami', 'ga']) {
  console.info('[AnalyticsStub] initializeAnalytics called.', { preferred });
  return null;
}

/**
 * Track a single page view.
 *
 * @param {string} [url] Page URL. Defaults to the current location.
 * @param {string} [title] Page title. Defaults to `document.title`.
 * @returns {boolean} Always returns true in the stub.
 */
export function trackPageview(url = window.location.href, title = document.title) {
  console.info('[AnalyticsStub] trackPageview', { url, title });
  return true;
}

/**
 * Track a named analytics event.
 *
 * @param {string} name Event name (e.g. `chart_exported`).
 * @param {Record<string, any>} [params] Optional event parameters.
 * @returns {boolean} Always returns true in the stub.
 */
export function trackEvent(name, params = {}) {
  console.info('[AnalyticsStub] trackEvent', { name, params });
  return true;
}

/**
 * Associate a user identifier with subsequent analytics events.
 *
 * @param {string} userId Stable user identifier.
 * @returns {boolean} Always returns true in the stub.
 */
export function setUser(userId) {
  console.info('[AnalyticsStub] setUser', { userId });
  return true;
}

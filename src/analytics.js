/**
 * @file src/analytics.js
 * @description Handles basic user event tracking for analytics.
 * @version 1.0.0
 * @date 2025-11-14
 */

/**
 * Tracks a key user event and logs it to the console.
 * In the future, this can be expanded to send data to an analytics service like Google Analytics.
 *
 * @param {string} eventName - The name of the event (e.g., 'page_view', 'chart_generated').
 * @param {object} properties - Additional data associated with the event.
 */
export function trackEvent(eventName, properties = {}) {
    console.log(`[Analytics] Event: ${eventName}`, properties);

    // Future improvement: Integrate with a third-party analytics service.
    /*
    if (window.ga) {
        window.ga('send', 'event', 'VizomApp', eventName, properties.label, properties.value);
    }
    */
}

// Example of tracking a page view automatically.
// This ensures that every page load is recorded.
document.addEventListener('DOMContentLoaded', () => {
    trackEvent('page_view', {
        path: window.location.pathname,
        title: document.title
    });
});

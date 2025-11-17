/**
 * @file src/error-tracking.js
 * @description Catches and logs JavaScript errors.
 * @version 1.0.0
 * @date 2025-11-14
 */

/**
 * Initializes global error tracking.
 * It uses window.onerror to catch all unhandled JavaScript errors.
 */
export function initErrorTracking() {
    window.onerror = function(message, source, lineno, colno, error) {
        console.error("Caught an error:", {
            message: message,
            source: source, // The URL of the script where the error was raised
            lineno: lineno, // The line number where the error was raised
            colno: colno,   // The column number for the line where the error was raised
            error: error    // The Error object, if available
        });

        // Future improvement: Send the error details to a service like Sentry.
        /*
        if (window.Sentry) {
            window.Sentry.captureException(error);
        }
        */

        // Return true to prevent the firing of the default event handler.
        return true;
    };

    console.log('Error tracking initialized.');
}

// Initialize immediately when the script is loaded.
initErrorTracking();

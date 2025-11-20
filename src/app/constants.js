/**
 * API Configuration and Constants
 * Centralized API endpoints and configuration
 */
export const API_CONFIG = {
    // Backend API endpoints (proxied for security)
    GENERATE_URL: '/api/generate',
    PARSE_URL: '/api/parse',
    HEALTH_URL: '/api/health',
    // Request timeouts
    TIMEOUT: 30000, // 30 seconds
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000, // 1 second
    // Rate limiting
    RATE_LIMIT_REQUESTS: 10,
    RATE_LIMIT_WINDOW: 60000, // 1 minute
};
export const CHART_TYPES = {
    BAR: 'bar',
    LINE: 'line',
    PIE: 'pie',
    SCATTER: 'scatter',
    MIXED: 'mixed',
    TABLE: 'table',
    DASHBOARD: 'dashboard',
    CUSTOM: 'custom'
};
export const ANIMATION_CONFIG = {
    DURATION: 750,
    EASING: 'easeInOutQuart',
    DELAY: 0
};
export const THEME_CONFIG = {
    DEFAULT: 'default',
    DARK: 'dark',
    VIBRANT: 'vibrant',
    PASTEL: 'pastel'
};

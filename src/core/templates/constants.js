// Constants and Types for template system
export const TEMPLATE_CATEGORIES = Object.freeze({
    BUSINESS: 'business',
    ACADEMIC: 'academic',
    FINANCIAL: 'financial',
    SCIENTIFIC: 'scientific'
});

export const VISUAL_TYPES = Object.freeze({
    DASHBOARD: 'dashboard',
    LINE: 'line',
    PIE: 'pie',
    TABLE: 'table',
    BAR: 'bar'
});

export const ERROR_TYPES = Object.freeze({
    VALIDATION: 'VALIDATION_ERROR',
    NOT_FOUND: 'NOT_FOUND_ERROR',
    INITIALIZATION: 'INITIALIZATION_ERROR'
});

// Type definitions for TypeScript support
/**
 * @typedef {Object} TemplateConfig
 * @property {string} title - The template title
 * @property {string} category - The template category
 * @property {string} visualType - The type of visualization
 * @property {string} description - Template description
 * @property {string} prompt - The template prompt
 */

/**
 * @typedef {Object} TemplateFilters
 * @property {string} [category] - Optional category filter
 * @property {string} [visualType] - Optional visual type filter
 * @property {string} [searchQuery] - Optional search query
 */
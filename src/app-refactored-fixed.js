/**
 * Quick Fix for TypeScript Syntax in JavaScript Files
 * Removes TypeScript-specific syntax to make files lint-compliant
 */

// Fix app-refactored-new.js - remove private modifiers and type annotations
const fixAppRefactored = () => {
  const content = `
/**
 * Refactored App.js
 * Coordinates application functionality using focused components
 */

import { API_CONFIG, CHART_TYPES } from './app/constants.js';
import { PromptTemplatesService } from './app/PromptTemplatesService.js';
import { HTMLSanitizerService } from './app/HTMLSanitizerService.js';
import { APIClient } from './core/api.js';
import { chartEngine } from './chart-engine-refactored.js';

/**
 * Main Application Class - Simplified coordination layer
 */
export class VizomApp {
  constructor() {
    this.apiClient = new APIClient(API_CONFIG.GENERATE_URL);
    this.promptTemplates = new PromptTemplatesService();
    this.sanitizer = HTMLSanitizerService;
    this.isInitialized = false;
  }

  /**
   * Initialize the application
   */
  async init() {
    if (this.isInitialized) {
      console.warn('App already initialized');
      return;
    }

    try {
      // Initialize core services
      await this.initializeServices();
      
      // Setup global error handling
      this.setupErrorHandling();
      
      // Setup event listeners
      this.setupEventListeners();
      
      this.isInitialized = true;
      console.log('Vizom App initialized successfully');
      
      // Emit initialization event
      this.emitAppEvent('app:initialized');
      
    } catch (error) {
      console.error('Failed to initialize Vizom App:', error);
      this.emitAppEvent('app:initialization-error', { error });
      throw error;
    }
  }

  /**
   * Initialize core services
   */
  async initializeServices() {
    // Test API connectivity
    const healthCheck = await this.apiClient.health();
    if (!healthCheck.ok) {
      throw new Error('API health check failed');
    }

    // Initialize chart engine
    chartEngine.setTheme('default');
    chartEngine.setAnimations(true);
    chartEngine.setInteractive(true);

    console.log('Core services initialized');
  }

  /**
   * Setup global error handling
   */
  setupErrorHandling() {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      this.handleAppError(event.reason);
    });

    // Handle JavaScript errors
    window.addEventListener('error', (event) => {
      console.error('JavaScript error:', event.error);
      this.handleAppError(event.error);
    });
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Listen for chart generation requests
    document.addEventListener('chart:generate', (event) => {
      this.handleChartGeneration(event.detail);
    });

    // Listen for data parsing requests
    document.addEventListener('data:parse', (event) => {
      this.handleDataParsing(event.detail);
    });

    // Listen for template requests
    document.addEventListener('template:get', (event) => {
      this.handleTemplateRequest(event.detail);
    });
  }

  /**
   * Generate chart from data
   */
  async generateChart(data, chartType = CHART_TYPES.CUSTOM, options = {}) {
    try {
      // Generate prompt for AI
      const prompt = this.promptTemplates.generatePrompt(chartType, data);
      
      // Call AI API
      const response = await this.apiClient.generate({
        prompt,
        data,
        chartType,
        options
      });

      // Sanitize AI response
      const sanitizedResponse = this.sanitizeResponse(response);
      
      // Parse and validate chart configuration
      const chartConfig = this.parseChartResponse(sanitizedResponse, chartType);
      
      // Emit success event
      this.emitAppEvent('chart:generated', {
        chartType,
        config: chartConfig,
        data
      });

      return chartConfig;

    } catch (error) {
      console.error('Chart generation failed:', error);
      this.emitAppEvent('chart:generation-error', { error, chartType, data });
      throw error;
    }
  }

  /**
   * Parse messy data
   */
  async parseData(rawData, format = 'auto') {
    try {
      const response = await this.apiClient.parse({
        data: rawData,
        format
      });

      // Sanitize and validate parsed data
      const sanitizedData = this.sanitizeResponse(response);
      const parsedData = JSON.parse(sanitizedData);

      // Validate data structure
      const validation = chartEngine.validateData(parsedData, 'bar');
      if (!validation.isValid) {
        console.warn('Data validation warnings:', validation.warnings);
      }

      this.emitAppEvent('data:parsed', {
        originalData: rawData,
        parsedData,
        format
      });

      return parsedData;

    } catch (error) {
      console.error('Data parsing failed:', error);
      this.emitAppEvent('data:parsing-error', { error, rawData, format });
      throw error;
    }
  }

  /**
   * Get chart template
   */
  getTemplate(templateId) {
    const template = this.promptTemplates.getTemplate(templateId);
    
    if (!template) {
      throw new Error(\`Template "\${templateId}" not found\`);
    }

    this.emitAppEvent('template:retrieved', { templateId, template });
    return template;
  }

  /**
   * Get all available templates
   */
  getAllTemplates() {
    return this.promptTemplates.getAllTemplates();
  }

  /**
   * Get templates by category
   */
  getTemplatesByCategory(category) {
    return this.promptTemplates.getTemplatesByCategory(category);
  }

  /**
   * Sanitize AI response
   */
  sanitizeResponse(response) {
    if (typeof response === 'string') {
      // Check if response contains HTML
      if (response.includes('<') && response.includes('>')) {
        return this.sanitizer.sanitize(response);
      }
      return response;
    }

    return response;
  }

  /**
   * Parse chart response from AI
   */
  parseChartResponse(response, chartType) {
    try {
      if (typeof response === 'string') {
        // Try to parse as JSON first
        const parsed = JSON.parse(response);
        return parsed;
      }
      
      return response;
    } catch (error) {
      // If JSON parsing fails, might be HTML response
      if (chartType === CHART_TYPES.TABLE) {
        return { html: response };
      }
      
      throw new Error(\`Failed to parse chart response: \${error.message}\`);
    }
  }

  /**
   * Handle application errors
   */
  handleAppError(error) {
    // Emit error event for global error handling
    this.emitAppEvent('app:error', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date()
    });
  }

  /**
   * Emit application events
   */
  emitAppEvent(type, data) {
    const event = new CustomEvent('app:event', {
      detail: { type, data, timestamp: new Date() }
    });
    document.dispatchEvent(event);
  }

  /**
   * Get application status
   */
  getStatus() {
    return {
      initialized: this.isInitialized,
      apiConfig: API_CONFIG,
      chartEngine: {
        theme: chartEngine.getTheme(),
        cacheStats: chartEngine.getCacheStats()
      },
      templates: {
        count: this.getAllTemplates().length
      }
    };
  }

  /**
   * Cleanup application
   */
  destroy() {
    // Cleanup chart engine
    chartEngine.destroy();
    
    // Remove event listeners
    window.removeEventListener('unhandledrejection', this.handleAppError);
    window.removeEventListener('error', this.handleAppError);
    
    this.isInitialized = false;
    
    this.emitAppEvent('app:destroyed');
    console.log('Vizom App destroyed');
  }
}

// Export singleton instance
export const vizomApp = new VizomApp();

// Make available globally for backward compatibility
window.vizomApp = vizomApp;

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    vizomApp.init().catch(console.error);
  });
} else {
  vizomApp.init().catch(console.error);
}
`;

  return content;
};

// Export the fixed content
export { fixAppRefactored };

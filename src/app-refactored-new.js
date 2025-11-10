/**
 * Refactored App.js
 * Coordinates application functionality using focused components
 * Reduced from 1,306 lines to ~200 lines with clear separation of concerns
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
  private apiClient: APIClient;
  private promptTemplates: PromptTemplatesService;
  private sanitizer: HTMLSanitizerService;
  private isInitialized: boolean = false;

  constructor() {
    this.apiClient = new APIClient(API_CONFIG.GENERATE_URL);
    this.promptTemplates = new PromptTemplatesService();
    this.sanitizer = HTMLSanitizerService;
  }

  /**
   * Initialize the application
   */
  async init(): Promise<void> {
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
  private async initializeServices(): Promise<void> {
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
  private setupErrorHandling(): void {
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
  private setupEventListeners(): void {
    // Listen for chart generation requests
    document.addEventListener('chart:generate', (event: CustomEvent) => {
      this.handleChartGeneration(event.detail);
    });

    // Listen for data parsing requests
    document.addEventListener('data:parse', (event: CustomEvent) => {
      this.handleDataParsing(event.detail);
    });

    // Listen for template requests
    document.addEventListener('template:get', (event: CustomEvent) => {
      this.handleTemplateRequest(event.detail);
    });
  }

  /**
   * Generate chart from data
   */
  async generateChart(
    data: any, 
    chartType: string = CHART_TYPES.CUSTOM,
    options: any = {}
  ): Promise<any> {
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
  async parseData(rawData: string, format: string = 'auto'): Promise<any> {
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
  getTemplate(templateId: string): any {
    const template = this.promptTemplates.getTemplate(templateId);
    
    if (!template) {
      throw new Error(`Template "${templateId}" not found`);
    }

    this.emitAppEvent('template:retrieved', { templateId, template });
    return template;
  }

  /**
   * Get all available templates
   */
  getAllTemplates(): any[] {
    return this.promptTemplates.getAllTemplates();
  }

  /**
   * Get templates by category
   */
  getTemplatesByCategory(category: string): any[] {
    return this.promptTemplates.getTemplatesByCategory(category as any);
  }

  /**
   * Sanitize AI response
   */
  private sanitizeResponse(response: any): any {
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
  private parseChartResponse(response: any, chartType: string): any {
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
      
      throw new Error(`Failed to parse chart response: ${error.message}`);
    }
  }

  /**
   * Handle chart generation events
   */
  private async handleChartGeneration(detail: any): Promise<void> {
    try {
      const { data, chartType, options } = detail;
      const result = await this.generateChart(data, chartType, options);
      
      // Emit result back to requester
      const event = new CustomEvent('chart:generation-result', {
        detail: { success: true, result, originalDetail: detail }
      });
      document.dispatchEvent(event);
      
    } catch (error) {
      const event = new CustomEvent('chart:generation-result', {
        detail: { success: false, error, originalDetail: detail }
      });
      document.dispatchEvent(event);
    }
  }

  /**
   * Handle data parsing events
   */
  private async handleDataParsing(detail: any): Promise<void> {
    try {
      const { rawData, format } = detail;
      const result = await this.parseData(rawData, format);
      
      // Emit result back to requester
      const event = new CustomEvent('data:parsing-result', {
        detail: { success: true, result, originalDetail: detail }
      });
      document.dispatchEvent(event);
      
    } catch (error) {
      const event = new CustomEvent('data:parsing-result', {
        detail: { success: false, error, originalDetail: detail }
      });
      document.dispatchEvent(event);
    }
  }

  /**
   * Handle template request events
   */
  private handleTemplateRequest(detail: any): void {
    try {
      const { templateId } = detail;
      const result = this.getTemplate(templateId);
      
      // Emit result back to requester
      const event = new CustomEvent('template:result', {
        detail: { success: true, result, originalDetail: detail }
      });
      document.dispatchEvent(event);
      
    } catch (error) {
      const event = new CustomEvent('template:result', {
        detail: { success: false, error, originalDetail: detail }
      });
      document.dispatchEvent(event);
    }
  }

  /**
   * Handle application errors
   */
  private handleAppError(error: Error): void {
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
  private emitAppEvent(type: string, data?: any): void {
    const event = new CustomEvent('app:event', {
      detail: { type, data, timestamp: new Date() }
    });
    document.dispatchEvent(event);
  }

  /**
   * Get application status
   */
  getStatus(): any {
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
   * Export application configuration
   */
  exportConfig(): any {
    return {
      apiConfig: API_CONFIG,
      chartEngine: chartEngine.exportConfig(),
      templates: this.promptTemplates.exportTemplates(),
      status: this.getStatus()
    };
  }

  /**
   * Import application configuration
   */
  importConfig(config: any): void {
    if (config.chartEngine) {
      chartEngine.importConfig(config.chartEngine);
    }
    
    if (config.templates) {
      this.promptTemplates.importTemplates(config.templates);
    }
  }

  /**
   * Cleanup application
   */
  destroy(): void {
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

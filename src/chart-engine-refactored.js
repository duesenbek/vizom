/**
 * Refactored Chart Engine
 * Coordinates chart functionality using focused components
 * Reduced from 695 lines to ~200 lines with clear separation of concerns
 */

import { ChartConfigBuilder } from './chart/ChartConfigBuilder.js';
import { ChartDataProcessor } from './chart/ChartDataProcessor.js';
import { ChartConfig, ChartRenderOptions } from './chart/types.js';
import { chartMemoizer, performanceMonitor } from '../utils/performance.js';

/**
 * Main Chart Engine - Simplified API for chart operations
 */
export class ChartEngine {
  private configBuilder: ChartConfigBuilder;
  private dataProcessor: typeof ChartDataProcessor;
  private currentTheme: string = 'default';
  private animations: boolean = true;
  private interactive: boolean = true;

  constructor() {
    this.configBuilder = new ChartConfigBuilder();
    this.dataProcessor = ChartDataProcessor;
    this.init();
  }

  /**
   * Initialize chart engine
   */
  private init(): void {
    this.setupPerformanceMonitoring();
    this.setupErrorHandling();
  }

  /**
   * Setup performance monitoring
   */
  private setupPerformanceMonitoring(): void {
    // Monitor chart operations
    performanceMonitor.startTiming('chart-engine-init');
    
    // Setup memoization for common operations
    this.setupMemoization();
    
    performanceMonitor.endTiming('chart-engine-init');
  }

  /**
   * Setup memoization
   */
  private setupMemoization(): void {
    // Cache chart configurations
    chartMemoizer.cacheFunction('buildConfig', this.configBuilder.build.bind(this.configBuilder));
    
    // Cache data processing
    chartMemoizer.cacheFunction('processData', this.dataProcessor.processData.bind(this.dataProcessor));
  }

  /**
   * Setup error handling
   */
  private setupErrorHandling(): void {
    // Global error handler for chart operations
    window.addEventListener('error', (e) => {
      if (e.message.includes('chart')) {
        console.error('Chart Engine Error:', e.error);
        this.handleChartError(e.error);
      }
    });
  }

  /**
   * Create chart configuration
   */
  async createChartConfig(
    type: string, 
    data: any, 
    options: ChartRenderOptions = {}
  ): Promise<ChartConfig> {
    performanceMonitor.startTiming('chart-config-create');
    
    try {
      // Validate data
      const validation = this.dataProcessor.validateData(data, type);
      if (!validation.isValid) {
        throw new Error(`Data validation failed: ${validation.errors.join(', ')}`);
      }

      // Show warnings if any
      if (validation.warnings.length > 0) {
        console.warn('Chart data warnings:', validation.warnings);
      }

      // Process data
      const processedData = await this.dataProcessor.processData(data, type);

      // Build configuration
      const config = this.configBuilder
        .reset()
        .setType(type)
        .setData(processedData)
        .setTheme(this.currentTheme)
        .setAnimationEnabled(this.animations)
        .setResponsive(options.responsive !== false, options.maintainAspectRatio)
        .setDimensions(options.width, options.height, options.aspectRatio)
        .setOptions(options)
        .build();

      performanceMonitor.endTiming('chart-config-create');
      
      return config;

    } catch (error) {
      performanceMonitor.endTiming('chart-config-create');
      throw error;
    }
  }

  /**
   * Create chart with memoization
   */
  async createChart(
    type: string, 
    data: any, 
    options: ChartRenderOptions = {}
  ): Promise<ChartConfig> {
    const cacheKey = this.generateCacheKey(type, data, options);
    
    return chartMemoizer.memoize(
      'createChart',
      cacheKey,
      () => this.createChartConfig(type, data, options)
    );
  }

  /**
   * Quick chart creation for common use cases
   */
  async createQuickChart(
    type: string, 
    labels: string[], 
    values: number[], 
    label: string = 'Data'
  ): Promise<ChartConfig> {
    const data = {
      labels,
      datasets: [{
        data: values,
        label
      }]
    };

    return this.createChart(type, data);
  }

  /**
   * Create chart from array data
   */
  async createChartFromArray(
    type: string, 
    data: any[], 
    options: ChartRenderOptions = {}
  ): Promise<ChartConfig> {
    return this.createChart(type, data, options);
  }

  /**
   * Create chart from table data
   */
  async createChartFromTable(
    type: string, 
    table: { rows: any[]; columns: string[] },
    options: ChartRenderOptions = {}
  ): Promise<ChartConfig> {
    return this.createChart(type, table, options);
  }

  /**
   * Update chart configuration
   */
  updateChartConfig(
    config: ChartConfig, 
    updates: Partial<ChartConfig>
  ): ChartConfig {
    const builder = ChartConfigBuilder.fromConfig(config);
    
    if (updates.type) builder.setType(updates.type);
    if (updates.data) builder.setData(updates.data);
    if (updates.theme) builder.setCustomTheme(updates.theme);
    if (updates.animation) builder.setAnimation(updates.animation);
    if (updates.options) builder.setOptions(updates.options);
    
    return builder.build();
  }

  /**
   * Set global theme
   */
  setTheme(themeName: string): void {
    this.currentTheme = themeName;
  }

  /**
   * Get current theme
   */
  getTheme(): string {
    return this.currentTheme;
  }

  /**
   * Enable/disable animations globally
   */
  setAnimations(enabled: boolean): void {
    this.animations = enabled;
  }

  /**
   * Enable/disable interactivity globally
   */
  setInteractive(enabled: boolean): void {
    this.interactive = enabled;
  }

  /**
   * Get available chart types
   */
  getChartTypes(): Record<string, any> {
    return ChartConfigBuilder.getAllChartTypes();
  }

  /**
   * Get chart types by category
   */
  getChartTypesByCategory(category: string): any[] {
    return ChartConfigBuilder.getChartTypesByCategory(category);
  }

  /**
   * Get available themes
   */
  getThemes(): Record<string, any> {
    return ChartConfigBuilder.getAllThemes();
  }

  /**
   * Validate chart data
   */
  validateData(data: any, chartType: string): any {
    return this.dataProcessor.validateData(data, chartType);
  }

  /**
   * Clean chart data
   */
  cleanData(data: any): any {
    return this.dataProcessor.cleanData(data);
  }

  /**
   * Aggregate large datasets
   */
  aggregateData(data: any, maxPoints: number = 100): any {
    return this.dataProcessor.aggregateData(data, maxPoints);
  }

  /**
   * Get recommended chart type for data
   */
  getRecommendedChartType(data: any): string {
    // Simple recommendation logic
    if (!data || !data.datasets || data.datasets.length === 0) {
      return 'bar'; // Default fallback
    }

    const datasetCount = data.datasets.length;
    const labelCount = data.labels?.length || 0;
    const hasTimeData = this.hasTimeData(data);

    if (hasTimeData && datasetCount <= 3) {
      return 'line';
    } else if (datasetCount === 1 && labelCount <= 6) {
      return 'pie';
    } else if (datasetCount > 1 && labelCount <= 10) {
      return 'bar';
    } else if (this.isScatterData(data)) {
      return 'scatter';
    } else {
      return 'bar'; // Safe default
    }
  }

  /**
   * Check if data contains time information
   */
  private hasTimeData(data: any): boolean {
    if (!data.labels) return false;
    
    return data.labels.some((label: any) => {
      // Check if label looks like a date or time
      return !isNaN(Date.parse(label)) || 
             /^\d{4}-\d{2}-\d{2}/.test(label) ||
             /^\d{1,2}\/\d{1,2}\/\d{4}/.test(label);
    });
  }

  /**
   * Check if data is suitable for scatter plot
   */
  private isScatterData(data: any): boolean {
    if (!data.datasets || data.datasets.length === 0) return false;
    
    return data.datasets.some((dataset: any) => {
      if (!dataset.data) return false;
      
      return dataset.data.some((point: any) => {
        return Array.isArray(point) && point.length >= 2 ||
               (typeof point === 'object' && point !== null && 'x' in point && 'y' in point);
      });
    });
  }

  /**
   * Generate cache key for memoization
   */
  private generateCacheKey(type: string, data: any, options: ChartRenderOptions): string {
    const dataHash = this.hashData(data);
    const optionsHash = this.hashOptions(options);
    
    return `${type}-${dataHash}-${optionsHash}-${this.currentTheme}-${this.animations}`;
  }

  /**
   * Simple hash function for data
   */
  private hashData(data: any): string {
    const str = JSON.stringify(data);
    let hash = 0;
    
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return Math.abs(hash).toString(36);
  }

  /**
   * Simple hash function for options
   */
  private hashOptions(options: ChartRenderOptions): string {
    const relevantOptions = {
      responsive: options.responsive,
      maintainAspectRatio: options.maintainAspectRatio,
      width: options.width,
      height: options.height,
      aspectRatio: options.aspectRatio
    };
    
    return this.hashData(relevantOptions);
  }

  /**
   * Handle chart errors
   */
  private handleChartError(error: Error): void {
    // Emit error event for global error handling
    const event = new CustomEvent('chartError', {
      detail: { error, timestamp: new Date() }
    });
    document.dispatchEvent(event);
  }

  /**
   * Get performance metrics
   */
  getPerformanceMetrics(): any {
    return performanceMonitor.getMetrics();
  }

  /**
   * Clear memoization cache
   */
  clearCache(): void {
    chartMemoizer.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): any {
    return chartMemoizer.getStats();
  }

  /**
   * Export chart engine configuration
   */
  exportConfig(): any {
    return {
      theme: this.currentTheme,
      animations: this.animations,
      interactive: this.interactive,
      cacheStats: this.getCacheStats(),
      performanceMetrics: this.getPerformanceMetrics()
    };
  }

  /**
   * Import chart engine configuration
   */
  importConfig(config: any): void {
    if (config.theme) this.setTheme(config.theme);
    if (config.animations !== undefined) this.setAnimations(config.animations);
    if (config.interactive !== undefined) this.setInteractive(config.interactive);
  }

  /**
   * Cleanup chart engine
   */
  destroy(): void {
    this.clearCache();
    // Remove event listeners
    window.removeEventListener('error', this.handleChartError);
  }
}

// Export singleton instance
export const chartEngine = new ChartEngine();

// Make available globally for backward compatibility
window.chartEngine = chartEngine;

/**
 * Enhanced DeepSeek API Integration Example - Fixed Version
 * Production-ready implementation with all improvements
 */

import { deepSeekClient, GenerationRequest } from './deepseek-client-fixed.js';
import { userFeedback } from './user-feedback-fixed.js';
import { caching } from './caching-fixed.js';

/**
 * Chart Generation Service - Production Example
 */
export class ChartGenerationService {
  /**
   * Generate optimized bar chart
   */
  async generateBarChart(data: {
    labels: string[];
    values: number[];
    title?: string;
    description?: string;
  }): Promise<any> {
    const request: GenerationRequest = {
      prompt: `Generate a bar chart for the following data: ${JSON.stringify(data)}`,
      templateId: 'bar-chart',
      templateParams: {
        data: {
          labels: data.labels,
          values: data.values
        },
        description: data.description || 'Data visualization',
        title: data.title || 'Bar Chart',
        theme: 'professional',
        focus: 'data clarity',
        colors: 'blue gradient',
        interactive: true
      },
      options: {
        enableCache: true,
        enableFeedback: true,
        estimatedDuration: 8000
      }
    };

    const response = await deepSeekClient.generateChart(request);
    
    if (!response.success) {
      throw new Error(`Chart generation failed: ${response.error?.message}`);
    }

    return response.data;
  }

  /**
   * Generate line chart with streaming
   */
  async generateLineChartWithStreaming(data: {
    labels: string[];
    values: number[];
    metric: string;
  }): Promise<any> {
    const request: GenerationRequest = {
      prompt: `Generate a line chart for the following time series data: ${JSON.stringify(data)}`,
      templateId: 'line-chart',
      templateParams: {
        data: {
          labels: data.labels,
          values: data.values
        },
        timePeriod: `${data.labels.length} periods`,
        metric: data.metric,
        focus: 'trend analysis'
      },
      options: {
        stream: true,
        enableCache: true,
        enableFeedback: true,
        estimatedDuration: 6000
      }
    };

    // Use streaming for real-time feedback
    let finalResult: any = null;
    
    for await (const partialResult of deepSeekClient.streamResponse(request)) {
      console.log('Partial result received:', partialResult);
      finalResult = partialResult;
    }

    return finalResult;
  }

  /**
   * Analyze data and suggest visualizations
   */
  async analyzeAndSuggest(data: any): Promise<{
    summary: any;
    recommendations: string[];
    suggestedCharts: string[];
  }> {
    const request: GenerationRequest = {
      prompt: `Analyze this dataset and provide comprehensive insights: ${JSON.stringify(data)}`,
      templateId: 'data-summary',
      templateParams: {
        data,
        context: 'Chart generation preparation',
        focus: ['visualization recommendations', 'data quality', 'insights']
      },
      options: {
        enableCache: true,
        enableFeedback: true,
        estimatedDuration: 5000
      }
    };

    const response = await deepSeekClient.analyzeData(request);
    
    if (!response.success) {
      throw new Error(`Data analysis failed: ${response.error?.message}`);
    }

    return response.data;
  }
}

/**
 * Error Handling and Recovery Example
 */
export class RobustAPIService {
  public chartService: ChartGenerationService;
  private retryCount = 0;
  private maxRetries = 3;

  constructor() {
    this.chartService = new ChartGenerationService();
  }

  /**
   * Generate chart with comprehensive error handling
   */
  async generateChartWithErrorHandling(data: any): Promise<any> {
    try {
      const result = await this.chartService.generateBarChart(data);
      this.retryCount = 0; // Reset on success
      return result;
      
    } catch (error: unknown) {
      console.error('Chart generation attempt failed:', (error as Error).message);
      
      // Check if we should retry
      if (this.shouldRetry(error as Error)) {
        this.retryCount++;
        console.log(`Retrying chart generation (attempt ${this.retryCount}/${this.maxRetries})`);
        
        // Exponential backoff
        const delay = Math.pow(2, this.retryCount) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        
        return this.generateChartWithErrorHandling(data);
      }
      
      // All retries failed, use fallback
      return this.generateFallbackChart(data);
    }
  }

  private shouldRetry(error: Error): boolean {
    if (this.retryCount >= this.maxRetries) {
      return false;
    }

    // Retry on network errors and rate limiting
    const retryableErrors = [
      'RATE_LIMITED',
      'TIMEOUT',
      'NETWORK_ERROR',
      'INTERNAL_SERVER_ERROR'
    ];

    return retryableErrors.some(code => error.message.includes(code)) || 
           error.message.includes('timeout') ||
           error.message.includes('network');
  }

  private generateFallbackChart(data: any): any {
    console.warn('Using fallback chart generation');
    
    return {
      config: {
        type: 'bar',
        data: {
          labels: data.labels || ['Error'],
          datasets: [{
            label: 'Data',
            data: data.values || [0],
            backgroundColor: '#ef4444'
          }]
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Chart generation failed - showing fallback'
            }
          }
        }
      },
      metadata: {
        chartType: 'fallback',
        dataPoints: data.values?.length || 1,
        recommendations: ['Check API connection', 'Verify data format'],
        generatedAt: new Date().toISOString()
      }
    };
  }
}

/**
 * Performance Monitoring Service
 */
export class PerformanceMonitor {
  private metrics = {
    requestCount: 0,
    successCount: 0,
    errorCount: 0,
    cacheHitCount: 0,
    averageResponseTime: 0,
    responseTimes: [] as number[]
  };

  /**
   * Monitor API performance
   */
  async monitorRequest<T>(
    requestFn: () => Promise<T>,
    context: string
  ): Promise<T> {
    const startTime = Date.now();
    this.metrics.requestCount++;

    try {
      const result = await requestFn();
      const responseTime = Date.now() - startTime;
      
      this.metrics.successCount++;
      this.recordResponseTime(responseTime);
      
      console.log(`✅ ${context} completed in ${responseTime}ms`);
      return result;
      
    } catch (error: unknown) {
      const responseTime = Date.now() - startTime;
      
      this.metrics.errorCount++;
      this.recordResponseTime(responseTime);
      
      console.error(`❌ ${context} failed after ${responseTime}ms:`, (error as Error).message);
      throw error;
    }
  }

  private recordResponseTime(time: number): void {
    this.metrics.responseTimes.push(time);
    
    // Keep only last 100 response times
    if (this.metrics.responseTimes.length > 100) {
      this.metrics.responseTimes.shift();
    }

    // Calculate average
    const sum = this.metrics.responseTimes.reduce((a, b) => a + b, 0);
    this.metrics.averageResponseTime = sum / this.metrics.responseTimes.length;
  }

  /**
   * Get performance metrics
   */
  getMetrics() {
    const successRate = this.metrics.requestCount > 0 
      ? this.metrics.successCount / this.metrics.requestCount 
      : 0;

    return {
      ...this.metrics,
      successRate: Math.round(successRate * 100),
      cacheHitRate: this.metrics.cacheHitCount / this.metrics.requestCount
    };
  }

  /**
   * Reset metrics
   */
  reset(): void {
    this.metrics = {
      requestCount: 0,
      successCount: 0,
      errorCount: 0,
      cacheHitCount: 0,
      averageResponseTime: 0,
      responseTimes: []
    };
  }
}

/**
 * Complete Integration Example
 */
export class VizomDeepSeekIntegration {
  private apiService: RobustAPIService;
  private performanceMonitor: PerformanceMonitor;

  constructor() {
    this.apiService = new RobustAPIService();
    this.performanceMonitor = new PerformanceMonitor();
    
    this.setupEventListeners();
  }

  /**
   * Generate complete visualization workflow
   */
  async generateVisualization(data: any): Promise<{
    chart: any;
    analysis: any;
    metrics: any;
  }> {
    return this.performanceMonitor.monitorRequest(async () => {
      // Step 1: Analyze data
      const analysis = await this.apiService.chartService.analyzeAndSuggest(data);
      
      // Step 2: Generate chart based on analysis
      const suggestedChart = analysis.suggestedCharts[0] || 'bar-chart';
      
      let chart;
      if (suggestedChart === 'line-chart') {
        chart = await this.apiService.chartService.generateLineChartWithStreaming(data);
      } else {
        chart = await this.apiService.chartService.generateBarChart(data);
      }

      // Step 3: Return complete result
      return {
        chart,
        analysis,
        metrics: this.performanceMonitor.getMetrics()
      };
      
    }, 'Complete visualization generation');
  }

  /**
   * Setup event listeners for real-time feedback
   */
  private setupEventListeners(): void {
    // Listen for cache events
    setInterval(() => {
      const metrics = deepSeekClient.getMetrics();
      
      if (metrics.caching.hitRate > 0.8) {
        console.log('Cache performance is excellent:', metrics.caching);
      }
      
      if (metrics.errorHandling.errorHandling.failedRequests > 10) {
        console.warn('High error rate detected:', metrics.errorHandling);
      }
    }, 30000); // Check every 30 seconds

    // Listen for user feedback events
    document.addEventListener('userFeedback:cancel', (event: any) => {
      console.log('Request cancelled by user:', event.detail.requestId);
    });

    document.addEventListener('userFeedback:complete', (event: any) => {
      console.log('Request completed:', event.detail.requestId);
    });
  }

  /**
   * Get comprehensive system status
   */
  getSystemStatus() {
    return {
      deepSeek: deepSeekClient.getMetrics(),
      performance: this.performanceMonitor.getMetrics(),
      uptime: Date.now()
    };
  }

  /**
   * Optimize system based on metrics
   */
  optimizeSystem(): void {
    const metrics = this.getSystemStatus();
    
    // Optimize cache settings based on hit rate
    if (metrics.deepSeek.caching.hitRate < 0.5) {
      console.log('Optimizing cache settings...');
      deepSeekClient.updateConfig({
        cacheTTL: 10 * 60 * 1000 // Increase cache TTL
      });
    }

    // Optimize retry settings based on error rate
    if (metrics.performance.successRate < 0.8) {
      console.log('Optimizing error handling...');
      // Could adjust retry logic here
    }
  }
}

/**
 * Usage Examples
 */

// Example 1: Basic chart generation
export async function basicChartExample() {
  const integration = new VizomDeepSeekIntegration();
  
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    values: [65, 78, 90, 81, 95],
    title: 'Monthly Sales',
    description: 'Sales performance over 5 months'
  };

  try {
    const result = await integration.generateVisualization(data);
    console.log('Generated visualization:', result);
    return result;
  } catch (error: unknown) {
    console.error('Failed to generate visualization:', (error as Error).message);
    throw error;
  }
}

// Example 2: Streaming chart generation
export async function streamingChartExample() {
  const chartService = new ChartGenerationService();
  
  const data = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    values: [120, 135, 128, 142],
    metric: 'User engagement'
  };

  try {
    const chart = await chartService.generateLineChartWithStreaming(data);
    console.log('Streaming chart generated:', chart);
    return chart;
  } catch (error: unknown) {
    console.error('Streaming failed:', (error as Error).message);
    throw error;
  }
}

// Example 3: Error handling demonstration
export async function errorHandlingExample() {
  const apiService = new RobustAPIService();
  
  // Simulate problematic data
  const problematicData = {
    labels: [], // Empty labels
    values: [], // Empty values
    title: 'Empty Data Test'
  };

  try {
    const result = await apiService.generateChartWithErrorHandling(problematicData);
    console.log('Chart generated with fallback:', result);
    return result;
  } catch (error: unknown) {
    console.error('All attempts failed:', (error as Error).message);
    throw error;
  }
}

// Export main integration class
export { VizomDeepSeekIntegration as default };

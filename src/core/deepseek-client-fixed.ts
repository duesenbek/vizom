/**
 * Enhanced DeepSeek API Client - Fixed Version
 * Integrates all improvements: prompt engineering, error handling, response parsing, caching, and user feedback
 */

import { promptEngineering, PromptTemplate } from './prompt-engineering.js';
import { errorHandling, DeepSeekAPIError } from './error-handling-fixed.js';
import { responseParsing, ParseResult } from './response-parsing.js';
import { caching } from './caching.js';
import { userFeedback, AbortToken } from './user-feedback.js';

// TypeScript types for the enhanced API client
export interface DeepSeekConfig {
  apiKey: string;
  baseURL: string;
  model: string;
  maxTokens: number;
  temperature: number;
  timeout: number;
  enableCaching: boolean;
  enableUserFeedback: boolean;
  cacheTTL: number;
}

export interface GenerationRequest {
  prompt: string;
  templateId?: string;
  templateParams?: Record<string, any>;
  options?: {
    temperature?: number;
    maxTokens?: number;
    stream?: boolean;
    enableCache?: boolean;
    enableFeedback?: boolean;
    estimatedDuration?: number;
  };
}

export interface GenerationResponse {
  success: boolean;
  data?: any;
  error?: DeepSeekAPIError;
  metadata: {
    requestId: string;
    cached: boolean;
    processingTime: number;
    tokensUsed?: number;
    confidence: number;
  };
}

/**
 * Enhanced DeepSeek API Client
 */
export class EnhancedDeepSeekClient {
  private config: DeepSeekConfig;
  private requestCounter = 0;

  constructor(config: Partial<DeepSeekConfig> = {}) {
    this.config = {
      apiKey: config.apiKey || '',
      baseURL: config.baseURL || 'https://api.deepseek.com/v1',
      model: config.model || 'deepseek-chat',
      maxTokens: config.maxTokens || 4000,
      temperature: config.temperature || 0.7,
      timeout: config.timeout || 30000,
      enableCaching: config.enableCaching ?? true,
      enableUserFeedback: config.enableUserFeedback ?? true,
      cacheTTL: config.cacheTTL ?? 5 * 60 * 1000, // 5 minutes
      ...config
    };
  }

  /**
   * Generate chart configuration
   */
  async generateChart(request: GenerationRequest): Promise<GenerationResponse> {
    const requestId = this.generateRequestId();
    const startTime = Date.now();

    try {
      // Start user feedback
      let cancelToken: AbortToken | undefined;
      if (this.config.enableUserFeedback) {
        cancelToken = userFeedback.startRequest(requestId, {
          type: 'chart',
          message: 'Generating chart visualization...',
          steps: ['Analyzing data', 'Creating configuration', 'Applying styles'],
          estimatedDuration: request.options?.estimatedDuration || 10000
        });
      }

      // Check cache first
      if (request.options?.enableCache !== false && this.config.enableCaching) {
        const cached = caching.getCachedResponse('chart', {
          prompt: request.prompt,
          templateId: request.templateId,
          templateParams: request.templateParams
        });

        if (cached) {
          if (this.config.enableUserFeedback) {
            userFeedback.completeRequest(requestId, cached);
          }

          return {
            success: true,
            data: cached,
            metadata: {
              requestId,
              cached: true,
              processingTime: Date.now() - startTime,
              confidence: 0.9
            }
          };
        }
      }

      // Generate prompt using template if provided
      let finalPrompt = request.prompt;
      let systemPrompt = '';

      if (request.templateId) {
        const promptData = promptEngineering.generatePrompt(
          request.templateId,
          request.templateParams || {}
        );

        if (promptData) {
          systemPrompt = promptData.systemPrompt;
          finalPrompt = promptData.userPrompt;
        }
      }

      // Make API request with comprehensive error handling
      const response = await errorHandling.executeRequest(
        () => this.makeAPIRequest(finalPrompt, systemPrompt, request.options, cancelToken),
        `Chart generation (${requestId})`
      );

      // Parse response with validation
      const parseResult = await responseParsing.parseChartResponse(response);
      
      if (!parseResult.success) {
        throw new DeepSeekAPIError(
          `Response parsing failed: ${parseResult.error?.message}`,
          'PARSE_ERROR',
          { details: parseResult.error }
        );
      }

      // Cache successful response
      if (request.options?.enableCache !== false && this.config.enableCaching) {
        caching.cacheResponse('chart', {
          prompt: request.prompt,
          templateId: request.templateId,
          templateParams: request.templateParams
        }, parseResult.data, {
          ttl: this.config.cacheTTL,
          tags: ['chart', request.templateId || 'custom']
        });
      }

      // Complete user feedback
      if (this.config.enableUserFeedback) {
        userFeedback.completeRequest(requestId, parseResult.data);
      }

      return {
        success: true,
        data: parseResult.data,
        metadata: {
          requestId,
          cached: false,
          processingTime: Date.now() - startTime,
          tokensUsed: response.usage?.total_tokens,
          confidence: parseResult.metadata.confidence
        }
      };

    } catch (error) {
      // Handle errors
      const apiError = error instanceof DeepSeekAPIError ? error : 
        new DeepSeekAPIError(`Unexpected error: ${(error as Error).message}`, 'UNEXPECTED_ERROR');

      if (this.config.enableUserFeedback) {
        userFeedback.failRequest(requestId, apiError.message);
      }

      return {
        success: false,
        error: apiError,
        metadata: {
          requestId,
          cached: false,
          processingTime: Date.now() - startTime,
          confidence: 0
        }
      };
    }
  }

  /**
   * Analyze data
   */
  async analyzeData(request: GenerationRequest): Promise<GenerationResponse> {
    const requestId = this.generateRequestId();
    const startTime = Date.now();

    try {
      // Start user feedback
      let cancelToken: AbortToken | undefined;
      if (this.config.enableUserFeedback) {
        cancelToken = userFeedback.startRequest(requestId, {
          type: 'analysis',
          message: 'Analyzing your data...',
          steps: ['Processing data', 'Running analysis', 'Generating insights'],
          estimatedDuration: request.options?.estimatedDuration || 8000
        });
      }

      // Check semantic cache for similar queries
      if (request.options?.enableCache !== false && this.config.enableCaching) {
        const cached = caching.getSemanticCachedResponse('analysis', request.prompt);
        
        if (cached) {
          if (this.config.enableUserFeedback) {
            userFeedback.completeRequest(requestId, cached);
          }

          return {
            success: true,
            data: cached,
            metadata: {
              requestId,
              cached: true,
              processingTime: Date.now() - startTime,
              confidence: 0.8
            }
          };
        }
      }

      // Generate prompt
      let finalPrompt = request.prompt;
      let systemPrompt = 'You are a data analysis expert. Provide comprehensive insights and recommendations.';

      if (request.templateId) {
        const promptData = promptEngineering.generatePrompt(
          request.templateId,
          request.templateParams || {}
        );

        if (promptData) {
          systemPrompt = promptData.systemPrompt;
          finalPrompt = promptData.userPrompt;
        }
      }

      // Make API request
      const response = await errorHandling.executeRequest(
        () => this.makeAPIRequest(finalPrompt, systemPrompt, request.options, cancelToken),
        `Data analysis (${requestId})`
      );

      // Parse response
      const parseResult = await responseParsing.parseAnalysisResponse(response);
      
      if (!parseResult.success) {
        throw new DeepSeekAPIError(
          `Response parsing failed: ${parseResult.error?.message}`,
          'PARSE_ERROR',
          { details: parseResult.error }
        );
      }

      // Cache semantic response
      if (request.options?.enableCache !== false && this.config.enableCaching) {
        caching.cacheSemanticResponse('analysis', request.prompt, parseResult.data, {
          ttl: this.config.cacheTTL * 2, // Longer TTL for semantic cache
          tags: ['analysis']
        });
      }

      // Complete user feedback
      if (this.config.enableUserFeedback) {
        userFeedback.completeRequest(requestId, parseResult.data);
      }

      return {
        success: true,
        data: parseResult.data,
        metadata: {
          requestId,
          cached: false,
          processingTime: Date.now() - startTime,
          tokensUsed: response.usage?.total_tokens,
          confidence: parseResult.metadata.confidence
        }
      };

    } catch (error) {
      const apiError = error instanceof DeepSeekAPIError ? error : 
        new DeepSeekAPIError(`Unexpected error: ${(error as Error).message}`, 'UNEXPECTED_ERROR');

      if (this.config.enableUserFeedback) {
        userFeedback.failRequest(requestId, apiError.message);
      }

      return {
        success: false,
        error: apiError,
        metadata: {
          requestId,
          cached: false,
          processingTime: Date.now() - startTime,
          confidence: 0
        }
      };
    }
  }

  /**
   * Stream response for real-time feedback
   */
  async *streamResponse(request: GenerationRequest): AsyncGenerator<Partial<any>, void, unknown> {
    const requestId = this.generateRequestId();

    // Start user feedback
    let cancelToken: AbortToken | undefined;
    if (this.config.enableUserFeedback) {
      cancelToken = userFeedback.startRequest(requestId, {
        type: 'chart',
        message: 'Starting streaming response...',
        steps: ['Processing', 'Generating', 'Streaming results']
      });
    }

    try {
      const response = await fetch(`${this.config.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.config.model,
          messages: [
            { role: 'system', content: 'Provide responses in valid JSON format.' },
            { role: 'user', content: request.prompt }
          ],
          stream: true,
          temperature: request.options?.temperature ?? this.config.temperature,
          max_tokens: request.options?.maxTokens ?? this.config.maxTokens,
        }),
        signal: cancelToken ? (cancelToken as any).signal : undefined
      });

      if (!response.ok) {
        throw new DeepSeekAPIError(
          `HTTP ${response.status}: ${response.statusText}`,
          'HTTP_ERROR',
          { status: response.status }
        );
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new DeepSeekAPIError('Response body is not readable', 'STREAM_ERROR');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            
            if (data === '[DONE]') {
              return;
            }

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;
              
              if (content) {
                // Try to parse partial JSON
                try {
                  const partialData = JSON.parse(content);
                  
                  // Add partial result
                  if (this.config.enableUserFeedback) {
                    userFeedback.addPartialResult(requestId, partialData, 0.3);
                  }
                  
                  yield partialData;
                } catch {
                  // Not valid JSON yet, continue accumulating
                }
              }
            } catch (parseError) {
              console.warn('Failed to parse stream data:', parseError);
            }
          }
        }
      }

    } catch (error) {
      if (this.config.enableUserFeedback) {
        userFeedback.failRequest(requestId, (error as Error).message);
      }
      throw error;
    }
  }

  /**
   * Make actual API request to DeepSeek
   */
  private async makeAPIRequest(
    prompt: string,
    systemPrompt: string,
    options: GenerationRequest['options'] = {},
    cancelToken?: AbortToken
  ): Promise<any> {
    const controller = new AbortController();
    
    // Setup abort handling
    if (cancelToken) {
      cancelToken.onAbort(() => controller.abort());
    }

    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(`${this.config.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.config.model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt }
          ],
          temperature: options?.temperature ?? this.config.temperature,
          max_tokens: options?.maxTokens ?? this.config.maxTokens,
          stream: options?.stream ?? false,
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new DeepSeekAPIError(
          errorData.error?.message || `HTTP ${response.status}`,
          errorData.error?.code || 'HTTP_ERROR',
          { status: response.status, retryable: response.status >= 500 }
        );
      }

      return await response.json();

    } catch (error) {
      clearTimeout(timeoutId);
      
      if ((error as Error).name === 'AbortError') {
        throw new DeepSeekAPIError('Request was cancelled', 'REQUEST_CANCELLED', {
          retryable: false
        });
      }

      throw error;
    }
  }

  /**
   * Generate unique request ID
   */
  private generateRequestId(): string {
    return `ds-${++this.requestCounter}-${Date.now()}`;
  }

  /**
   * Get available prompt templates
   */
  getPromptTemplates(): PromptTemplate[] {
    return promptEngineering.getAllTemplates();
  }

  /**
   * Get prompt templates by category
   */
  getPromptTemplatesByCategory(category: 'chart' | 'data' | 'analysis' | 'export'): PromptTemplate[] {
    return promptEngineering.getTemplatesByCategory(category);
  }

  /**
   * Validate prompt parameters
   */
  validatePromptParameters(templateId: string, params: Record<string, any>) {
    return promptEngineering.validateParameters(templateId, params);
  }

  /**
   * Get comprehensive metrics
   */
  getMetrics() {
    return {
      errorHandling: errorHandling.getMetrics(),
      caching: caching.getStats(),
      userFeedback: {
        activeRequests: userFeedback.getActiveRequests().length,
        config: userFeedback.getConfig()
      },
      config: this.config
    };
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<DeepSeekConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Clear all caches
   */
  clearCaches(): void {
    caching.clear();
  }

  /**
   * Reset all metrics
   */
  resetMetrics(): void {
    errorHandling.reset();
    this.clearCaches();
  }
}

// Export singleton instance
export const deepSeekClient = new EnhancedDeepSeekClient();

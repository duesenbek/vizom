/**
 * Enhanced Error Handling for DeepSeek API - Fixed Version
 * Comprehensive error handling with retry logic, exponential backoff, and circuit breaker
 */

// TypeScript types for error handling
export interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  backoffFactor: number;
  retryableErrors: string[];
}

export interface CircuitBreakerConfig {
  failureThreshold: number;
  resetTimeout: number;
  monitoringPeriod: number;
}

export interface APIError {
  code: string;
  message: string;
  status?: number;
  retryable: boolean;
  timestamp: Date;
  requestId?: string;
  details?: any;
}

export interface RequestMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  lastError?: APIError;
  circuitBreakerTripped: boolean;
}

/**
 * Custom API Error Classes
 */
export class DeepSeekAPIError extends Error {
  public readonly code: string;
  public readonly status?: number;
  public readonly retryable: boolean;
  public readonly timestamp: Date;
  public readonly requestId?: string;
  public readonly details?: any;

  constructor(message: string, code: string, options: {
    status?: number;
    retryable?: boolean;
    requestId?: string;
    details?: any;
  } = {}) {
    super(message);
    this.name = 'DeepSeekAPIError';
    this.code = code;
    this.status = options.status;
    this.retryable = options.retryable ?? false;
    this.timestamp = new Date();
    this.requestId = options.requestId;
    this.details = options.details;
  }

  toJSON(): APIError {
    return {
      code: this.code,
      message: this.message,
      status: this.status,
      retryable: this.retryable,
      timestamp: this.timestamp,
      requestId: this.requestId,
      details: this.details
    };
  }
}

/**
 * Circuit Breaker Pattern Implementation
 */
export class CircuitBreaker {
  private failureCount = 0;
  private lastFailureTime = 0;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';

  constructor(private config: CircuitBreakerConfig) {}

  /**
   * Execute operation with circuit breaker protection
   */
  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.config.resetTimeout) {
        this.state = 'HALF_OPEN';
        console.log('Circuit breaker entering HALF_OPEN state');
      } else {
        throw new DeepSeekAPIError(
          'Circuit breaker is OPEN',
          'CIRCUIT_BREAKER_OPEN',
          { retryable: false }
        );
      }
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess() {
    this.failureCount = 0;
    if (this.state === 'HALF_OPEN') {
      this.state = 'CLOSED';
      console.log('Circuit breaker reset to CLOSED state');
    }
  }

  private onFailure() {
    this.failureCount++;
    this.lastFailureTime = Date.now();

    if (this.failureCount >= this.config.failureThreshold) {
      this.state = 'OPEN';
      console.warn(`Circuit breaker opened after ${this.failureCount} failures`);
    }
  }

  getState() {
    return {
      state: this.state,
      failureCount: this.failureCount,
      lastFailureTime: this.lastFailureTime
    };
  }

  reset() {
    this.failureCount = 0;
    this.lastFailureTime = 0;
    this.state = 'CLOSED';
  }
}

/**
 * Retry Handler with Exponential Backoff
 */
export class RetryHandler {
  constructor(private config: RetryConfig) {}

  /**
   * Execute operation with retry logic
   */
  async executeWithRetry<T>(
    operation: () => Promise<T>,
    context: string = 'API request'
  ): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= this.config.maxRetries; attempt++) {
      try {
        if (attempt > 0) {
          const delay = this.calculateDelay(attempt);
          console.log(`Retrying ${context} (attempt ${attempt}/${this.config.maxRetries}) after ${delay}ms`);
          await this.sleep(delay);
        }

        return await operation();
      } catch (error) {
        lastError = error as Error;

        if (!this.shouldRetry(error as DeepSeekAPIError, attempt)) {
          throw error;
        }

        console.warn(`Attempt ${attempt + 1} failed for ${context}:`, (error as Error).message);
      }
    }

    throw new DeepSeekAPIError(
      `All ${this.config.maxRetries + 1} attempts failed. Last error: ${lastError?.message}`,
      'MAX_RETRIES_EXCEEDED',
      {
        retryable: false,
        details: { attempts: this.config.maxRetries + 1, lastError: lastError?.message }
      }
    );
  }

  private shouldRetry(error: DeepSeekAPIError, attempt: number): boolean {
    if (attempt >= this.config.maxRetries) {
      return false;
    }

    if (!error.retryable) {
      return false;
    }

    return this.config.retryableErrors.includes(error.code);
  }

  private calculateDelay(attempt: number): number {
    const delay = Math.min(
      this.config.baseDelay * Math.pow(this.config.backoffFactor, attempt - 1),
      this.config.maxDelay
    );
    
    // Add jitter to prevent thundering herd
    return delay + Math.random() * 0.1 * delay;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Enhanced API Error Handler
 */
export class APIErrorHandler {
  private metrics: RequestMetrics = {
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    averageResponseTime: 0,
    circuitBreakerTripped: false
  };

  private responseTimeHistory: number[] = [];

  /**
   * Handle API response and convert to standardized error format
   */
  async handleResponse(response: Response, requestId: string): Promise<any> {
    const startTime = Date.now();
    
    try {
      this.metrics.totalRequests++;

      if (!response.ok) {
        const errorData = await this.parseErrorResponse(response);
        const error = this.createAPIError(response, errorData, requestId);
        this.metrics.failedRequests++;
        this.metrics.lastError = error.toJSON();
        throw error;
      }

      const data = await response.json();
      this.metrics.successfulRequests++;
      
      // Update response time metrics
      const responseTime = Date.now() - startTime;
      this.updateResponseTimeMetrics(responseTime);

      return data;
    } catch (error) {
      if (error instanceof DeepSeekAPIError) {
        throw error;
      }
      
      // Handle unexpected errors
      const apiError = new DeepSeekAPIError(
        `Unexpected error: ${(error as Error).message}`,
        'UNEXPECTED_ERROR',
        {
          status: response.status,
          retryable: false,
          requestId,
          details: { originalError: (error as Error).message }
        }
      );
      
      this.metrics.failedRequests++;
      this.metrics.lastError = apiError.toJSON();
      throw apiError;
    }
  }

  private async parseErrorResponse(response: Response): Promise<any> {
    try {
      return await response.json();
    } catch {
      return {
        error: `HTTP ${response.status}: ${response.statusText}`,
        code: 'HTTP_ERROR'
      };
    }
  }

  private createAPIError(response: Response, errorData: any, requestId: string): DeepSeekAPIError {
    const status = response.status;
    const message = errorData.error || errorData.message || `HTTP ${status}`;
    const code = errorData.code || this.getErrorCodeFromStatus(status);

    const retryable = this.isRetryableError(code, status);

    return new DeepSeekAPIError(message, code, {
      status,
      retryable,
      requestId,
      details: errorData
    });
  }

  private getErrorCodeFromStatus(status: number): string {
    switch (status) {
      case 400: return 'BAD_REQUEST';
      case 401: return 'UNAUTHORIZED';
      case 403: return 'FORBIDDEN';
      case 404: return 'NOT_FOUND';
      case 429: return 'RATE_LIMITED';
      case 500: return 'INTERNAL_SERVER_ERROR';
      case 502: return 'BAD_GATEWAY';
      case 503: return 'SERVICE_UNAVAILABLE';
      case 504: return 'GATEWAY_TIMEOUT';
      default: return 'HTTP_ERROR';
    }
  }

  private isRetryableError(code: string, status: number): boolean {
    const retryableCodes = [
      'RATE_LIMITED',
      'TIMEOUT',
      'INTERNAL_SERVER_ERROR',
      'BAD_GATEWAY',
      'SERVICE_UNAVAILABLE',
      'GATEWAY_TIMEOUT',
      'NETWORK_ERROR',
      'CONNECTION_ERROR'
    ];

    return retryableCodes.includes(code) || (status >= 500 && status < 600);
  }

  private updateResponseTimeMetrics(responseTime: number) {
    this.responseTimeHistory.push(responseTime);
    
    // Keep only last 100 response times
    if (this.responseTimeHistory.length > 100) {
      this.responseTimeHistory.shift();
    }

    // Calculate average
    const sum = this.responseTimeHistory.reduce((a, b) => a + b, 0);
    this.metrics.averageResponseTime = sum / this.responseTimeHistory.length;
  }

  /**
   * Get current metrics
   */
  getMetrics(): RequestMetrics {
    return { ...this.metrics };
  }

  /**
   * Reset metrics
   */
  resetMetrics() {
    this.metrics = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      averageResponseTime: 0,
      circuitBreakerTripped: false
    };
    this.responseTimeHistory = [];
  }
}

/**
 * Comprehensive Error Handling Service
 */
export class ErrorHandlingService {
  private circuitBreaker: CircuitBreaker;
  private retryHandler: RetryHandler;
  private errorHandler: APIErrorHandler;

  constructor() {
    this.circuitBreaker = new CircuitBreaker({
      failureThreshold: 5,
      resetTimeout: 60000, // 1 minute
      monitoringPeriod: 300000 // 5 minutes
    });

    this.retryHandler = new RetryHandler({
      maxRetries: 3,
      baseDelay: 1000,
      maxDelay: 10000,
      backoffFactor: 2,
      retryableErrors: [
        'RATE_LIMITED',
        'TIMEOUT',
        'INTERNAL_SERVER_ERROR',
        'BAD_GATEWAY',
        'SERVICE_UNAVAILABLE',
        'GATEWAY_TIMEOUT',
        'NETWORK_ERROR',
        'CONNECTION_ERROR'
      ]
    });

    this.errorHandler = new APIErrorHandler();
  }

  /**
   * Execute API request with comprehensive error handling
   */
  async executeRequest<T>(
    requestFn: () => Promise<T>,
    context: string = 'API request'
  ): Promise<T> {
    return this.circuitBreaker.execute(async () => {
      return this.retryHandler.executeWithRetry(requestFn, context);
    });
  }

  /**
   * Handle API response
   */
  async handleResponse(response: Response, requestId: string): Promise<any> {
    return this.errorHandler.handleResponse(response, requestId);
  }

  /**
   * Get comprehensive metrics
   */
  getMetrics() {
    return {
      errorHandling: this.errorHandler.getMetrics(),
      circuitBreaker: this.circuitBreaker.getState(),
      retryConfig: {
        maxRetries: 3,
        baseDelay: 1000,
        maxDelay: 10000
      }
    };
  }

  /**
   * Reset all error handling state
   */
  reset() {
    this.errorHandler.resetMetrics();
    this.circuitBreaker.reset();
  }
}

// Export singleton instance
export const errorHandling = new ErrorHandlingService();

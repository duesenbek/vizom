/**
 * API Client Module with Performance Optimizations
 * Handles all backend communication with proper error handling, caching, and deduplication
 */

const API_BASE = '/api';
const TIMEOUT = 30000; // 30 seconds
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes cache

class APIClient {
  constructor() {
    this.baseURL = API_BASE;
    this.cache = new Map();
    this.pendingRequests = new Map(); // Request deduplication
  }

  /**
   * Generate cache key for requests
   */
  getCacheKey(endpoint, options) {
    const method = options.method || 'GET';
    const body = options.body || '';
    return `${method}:${endpoint}:${btoa(body).slice(0, 16)}`;
  }

  /**
   * Check if cached response is still valid
   */
  isCacheValid(cachedEntry) {
    return Date.now() - cachedEntry.timestamp < CACHE_TTL;
  }

  /**
   * Generic fetch wrapper with timeout, caching, and deduplication
   */
  async request(endpoint, options = {}) {
    const cacheKey = this.getCacheKey(endpoint, options);
    
    // Return cached response if valid
    if (options.method !== 'POST' || endpoint === '/health') {
      const cached = this.cache.get(cacheKey);
      if (cached && this.isCacheValid(cached)) {
        return cached.data;
      }
    }

    // Check if identical request is already pending
    if (this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey);
    }

    // Create and store the request promise
    const requestPromise = this.executeRequest(endpoint, options, cacheKey);
    this.pendingRequests.set(cacheKey, requestPromise);

    try {
      const result = await requestPromise;
      return result;
    } finally {
      this.pendingRequests.delete(cacheKey);
    }
  }

  /**
   * Execute the actual HTTP request
   */
  async executeRequest(endpoint, options, cacheKey) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || `Request failed: ${response.status}`);
      }

      const data = await response.json();
      
      // Cache successful responses (except for sensitive operations)
      if (options.method !== 'POST' || endpoint === '/health') {
        this.cache.set(cacheKey, {
          data,
          timestamp: Date.now(),
        });
      }

      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new Error('Request timeout - please try again');
      }
      
      throw error;
    }
  }

  /**
   * Generate visualization with smart caching
   */
  async generate(prompt, chartType) {
    // Don't cache generation requests as they're dynamic
    return this.request('/generate', {
      method: 'POST',
      body: JSON.stringify({ prompt, chartType }),
    });
  }

  /**
   * Parse messy data with caching for identical inputs
   */
  async parse(text) {
    return this.request('/parse', {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  }

  /**
   * Health check with aggressive caching
   */
  async health() {
    return this.request('/health');
  }

  /**
   * Clear cache manually if needed
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * Get cache statistics for monitoring
   */
  getCacheStats() {
    return {
      size: this.cache.size,
      pendingRequests: this.pendingRequests.size,
    };
  }
}

// Export singleton instance
export const api = new APIClient();

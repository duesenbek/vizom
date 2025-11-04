/**
 * API Client Module
 * Handles all backend communication with proper error handling
 */

const API_BASE = '/api';
const TIMEOUT = 30000; // 30 seconds

class APIClient {
  constructor() {
    this.baseURL = API_BASE;
  }

  /**
   * Generic fetch wrapper with timeout and error handling
   */
  async request(endpoint, options = {}) {
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

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new Error('Request timeout - please try again');
      }
      
      throw error;
    }
  }

  /**
   * Generate visualization
   */
  async generate(prompt, chartType) {
    return this.request('/generate', {
      method: 'POST',
      body: JSON.stringify({ prompt, chartType }),
    });
  }

  /**
   * Parse messy data
   */
  async parse(text) {
    return this.request('/parse', {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  }

  /**
   * Health check
   */
  async health() {
    return this.request('/health');
  }
}

// Export singleton instance
export const api = new APIClient();

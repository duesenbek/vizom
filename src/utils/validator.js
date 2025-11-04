/**
 * Validator Module
 * Input validation and sanitization
 */

export class Validator {
  /**
   * Validate prompt input
   */
  static validatePrompt(prompt) {
    const errors = [];

    if (!prompt || typeof prompt !== 'string') {
      errors.push('Prompt is required');
      return { valid: false, errors };
    }

    const trimmed = prompt.trim();

    if (trimmed.length === 0) {
      errors.push('Prompt cannot be empty');
    }

    if (trimmed.length < 10) {
      errors.push('Prompt is too short (minimum 10 characters)');
    }

    if (trimmed.length > 5000) {
      errors.push('Prompt is too long (maximum 5000 characters)');
    }

    // Check for suspicious patterns
    if (this.containsSuspiciousPatterns(trimmed)) {
      errors.push('Prompt contains invalid characters or patterns');
    }

    return {
      valid: errors.length === 0,
      errors,
      sanitized: trimmed,
    };
  }

  /**
   * Validate chart type
   */
  static validateChartType(type) {
    const validTypes = ['bar', 'line', 'pie', 'scatter', 'mixed', 'table', 'dashboard'];
    
    if (!type || typeof type !== 'string') {
      return { valid: false, error: 'Chart type is required' };
    }

    if (!validTypes.includes(type.toLowerCase())) {
      return { 
        valid: false, 
        error: `Invalid chart type. Must be one of: ${validTypes.join(', ')}` 
      };
    }

    return { valid: true, sanitized: type.toLowerCase() };
  }

  /**
   * Validate file upload
   */
  static validateFile(file, options = {}) {
    const {
      maxSize = 5 * 1024 * 1024, // 5MB default
      allowedTypes = ['text/csv', 'text/plain'],
    } = options;

    const errors = [];

    if (!file) {
      errors.push('No file provided');
      return { valid: false, errors };
    }

    if (file.size > maxSize) {
      errors.push(`File is too large (maximum ${maxSize / 1024 / 1024}MB)`);
    }

    if (!allowedTypes.includes(file.type)) {
      errors.push(`Invalid file type. Allowed: ${allowedTypes.join(', ')}`);
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate export format
   */
  static validateExportFormat(format) {
    const validFormats = ['png', 'pdf', 'csv', 'svg', 'html'];
    
    if (!format || typeof format !== 'string') {
      return { valid: false, error: 'Export format is required' };
    }

    const lower = format.toLowerCase();
    if (!validFormats.includes(lower)) {
      return { 
        valid: false, 
        error: `Invalid format. Must be one of: ${validFormats.join(', ')}` 
      };
    }

    return { valid: true, sanitized: lower };
  }

  /**
   * Validate JSON config
   */
  static validateChartConfig(config) {
    const errors = [];

    if (!config || typeof config !== 'object') {
      errors.push('Config must be an object');
      return { valid: false, errors };
    }

    // Check required fields for Chart.js
    if (!config.type) {
      errors.push('Config must have a "type" field');
    }

    if (!config.data) {
      errors.push('Config must have a "data" field');
    }

    // Validate data structure
    if (config.data) {
      if (!config.data.labels && !config.data.datasets) {
        errors.push('Config data must have "labels" or "datasets"');
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate dashboard config
   */
  static validateDashboardConfig(config) {
    const errors = [];

    if (!config || typeof config !== 'object') {
      errors.push('Dashboard config must be an object');
      return { valid: false, errors };
    }

    if (!config.layout || typeof config.layout !== 'string') {
      errors.push('Dashboard must have a "layout" string');
    }

    if (!config.charts || !Array.isArray(config.charts)) {
      errors.push('Dashboard must have a "charts" array');
    }

    // Validate each chart
    if (config.charts) {
      config.charts.forEach((chart, index) => {
        if (!chart.canvasId) {
          errors.push(`Chart ${index} missing "canvasId"`);
        }
        if (!chart.config) {
          errors.push(`Chart ${index} missing "config"`);
        }
      });
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Check for suspicious patterns
   */
  static containsSuspiciousPatterns(text) {
    const suspiciousPatterns = [
      /<script/i,
      /javascript:/i,
      /onerror=/i,
      /onclick=/i,
      /onload=/i,
      /<iframe/i,
      /eval\(/i,
      /document\.cookie/i,
    ];

    return suspiciousPatterns.some(pattern => pattern.test(text));
  }

  /**
   * Sanitize string input
   */
  static sanitizeString(input, maxLength = 1000) {
    if (typeof input !== 'string') {
      return '';
    }

    return input
      .trim()
      .slice(0, maxLength)
      .replace(/[<>]/g, ''); // Remove angle brackets
  }

  /**
   * Validate email (for future features)
   */
  static validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email || typeof email !== 'string') {
      return { valid: false, error: 'Email is required' };
    }

    if (!emailRegex.test(email)) {
      return { valid: false, error: 'Invalid email format' };
    }

    return { valid: true, sanitized: email.toLowerCase().trim() };
  }

  /**
   * Validate URL (for future features)
   */
  static validateURL(url) {
    try {
      const parsed = new URL(url);
      return { 
        valid: true, 
        sanitized: parsed.toString(),
        protocol: parsed.protocol,
        hostname: parsed.hostname,
      };
    } catch (error) {
      return { valid: false, error: 'Invalid URL format' };
    }
  }
}

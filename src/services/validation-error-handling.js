/**
 * Enhanced Validation and Error Handling Service
 * Comprehensive input validation, API error handling, and user-friendly error messages
 */

class ValidationAndErrorHandlingService {
  constructor() {
    this.validators = new Map();
    this.errorMessages = new Map();
    this.validationRules = new Map();
    this.apiErrorHandlers = new Map();
    this.init();
  }

  init() {
    this.setupValidators();
    this.setupErrorMessages();
    this.setupAPIErrorHandlers();
    this.setupGlobalErrorHandlers();
  }

  /**
   * Setup input validators
   */
  setupValidators() {
    // Chart data validator
    this.validators.set('chartData', (data) => {
      const errors = [];
      
      if (!data) {
        errors.push('Chart data is required');
        return { isValid: false, errors };
      }

      // Validate data structure
      if (typeof data !== 'object') {
        errors.push('Chart data must be an object');
        return { isValid: false, errors };
      }

      // Validate labels
      if (!data.labels || !Array.isArray(data.labels)) {
        errors.push('Chart must have labels array');
      } else if (data.labels.length === 0) {
        errors.push('Chart must have at least one label');
      } else if (data.labels.length > 50) {
        errors.push('Chart cannot have more than 50 labels for optimal performance');
      }

      // Validate datasets
      if (!data.datasets || !Array.isArray(data.datasets)) {
        errors.push('Chart must have datasets array');
      } else if (data.datasets.length === 0) {
        errors.push('Chart must have at least one dataset');
      } else if (data.datasets.length > 10) {
        errors.push('Chart cannot have more than 10 datasets for optimal performance');
      }

      // Validate each dataset
      if (data.datasets) {
        data.datasets.forEach((dataset, index) => {
          const datasetErrors = this.validateDataset(dataset, index);
          errors.push(...datasetErrors);
        });
      }

      // Check for data consistency
      if (data.labels && data.datasets) {
        data.datasets.forEach((dataset, index) => {
          if (dataset.data && dataset.data.length !== data.labels.length) {
            errors.push(`Dataset ${index + 1} data length must match labels length`);
          }
        });
      }

      return {
        isValid: errors.length === 0,
        errors
      };
    });

    // CSV data validator
    this.validators.set('csvData', (csvString) => {
      const errors = [];
      
      if (!csvString || typeof csvString !== 'string') {
        errors.push('CSV data is required and must be a string');
        return { isValid: false, errors };
      }

      if (csvString.trim().length === 0) {
        errors.push('CSV data cannot be empty');
        return { isValid: false, errors };
      }

      const lines = csvString.trim().split('\n');
      if (lines.length < 2) {
        errors.push('CSV must have at least a header and one data row');
        return { isValid: false, errors };
      }

      // Validate CSV structure
      const headerColumns = lines[0].split(',').map(col => col.trim());
      if (headerColumns.length < 2) {
        errors.push('CSV must have at least 2 columns');
      }

      // Validate data rows
      for (let i = 1; i < lines.length; i++) {
        const rowColumns = lines[i].split(',').map(col => col.trim());
        if (rowColumns.length !== headerColumns.length) {
          errors.push(`Row ${i + 1} has ${rowColumns.length} columns but header has ${headerColumns.length}`);
        }
      }

      return {
        isValid: errors.length === 0,
        errors
      };
    });

    // Chart configuration validator
    this.validators.set('chartConfig', (config) => {
      const errors = [];
      
      if (!config || typeof config !== 'object') {
        errors.push('Chart configuration is required and must be an object');
        return { isValid: false, errors };
      }

      // Validate chart type
      const validTypes = ['bar', 'line', 'pie', 'area', 'scatter', 'bubble', 'radar', 'doughnut'];
      if (!config.type || !validTypes.includes(config.type)) {
        errors.push(`Chart type must be one of: ${validTypes.join(', ')}`);
      }

      // Validate options
      if (config.options && typeof config.options !== 'object') {
        errors.push('Chart options must be an object');
      }

      return {
        isValid: errors.length === 0,
        errors
      };
    });

    // Color validator
    this.validators.set('colors', (colors) => {
      const errors = [];
      
      if (!Array.isArray(colors)) {
        errors.push('Colors must be an array');
        return { isValid: false, errors };
      }

      if (colors.length === 0) {
        errors.push('At least one color is required');
      }

      if (colors.length > 20) {
        errors.push('Cannot have more than 20 colors');
      }

      colors.forEach((color, index) => {
        if (!this.isValidColor(color)) {
          errors.push(`Color ${index + 1} "${color}" is not a valid color format`);
        }
      });

      return {
        isValid: errors.length === 0,
        errors
      };
    });

    // File validator
    this.validators.set('file', (file, options = {}) => {
      const errors = [];
      const {
        maxSize = 10 * 1024 * 1024, // 10MB
        allowedTypes = ['text/csv', 'application/json', 'text/plain'],
        allowedExtensions = ['.csv', '.json', '.txt']
      } = options;

      if (!file) {
        errors.push('File is required');
        return { isValid: false, errors };
      }

      if (file.size > maxSize) {
        errors.push(`File size cannot exceed ${this.formatFileSize(maxSize)}`);
      }

      if (!allowedTypes.includes(file.type) && !allowedExtensions.some(ext => file.name.toLowerCase().endsWith(ext))) {
        errors.push(`File type not supported. Allowed types: ${allowedTypes.join(', ')}`);
      }

      return {
        isValid: errors.length === 0,
        errors
      };
    });
  }

  /**
   * Setup error messages
   */
  setupErrorMessages() {
    // Validation errors
    this.errorMessages.set('validation.required', 'This field is required');
    this.errorMessages.set('validation.invalid_format', 'Invalid format');
    this.errorMessages.set('validation.too_long', 'Value is too long');
    this.errorMessages.set('validation.too_short', 'Value is too short');
    this.errorMessages.set('validation.invalid_email', 'Please enter a valid email address');
    this.errorMessages.set('validation.invalid_number', 'Please enter a valid number');
    this.errorMessages.set('validation.invalid_color', 'Please enter a valid color (hex, rgb, or color name)');

    // API errors
    this.errorMessages.set('api.network_error', 'Network connection failed. Please check your internet connection.');
    this.errorMessages.set('api.timeout', 'Request timed out. Please try again.');
    this.errorMessages.set('api.server_error', 'Server error occurred. Please try again later.');
    this.errorMessages.set('api.not_found', 'The requested resource was not found.');
    this.errorMessages.set('api.unauthorized', 'You are not authorized to perform this action.');
    this.errorMessages.set('api.rate_limit', 'Too many requests. Please wait a moment and try again.');
    this.errorMessages.set('api.invalid_request', 'Invalid request. Please check your input and try again.');

    // Chart errors
    this.errorMessages.set('chart.no_data', 'No data available to create chart');
    this.errorMessages.set('chart.invalid_data', 'Invalid chart data format');
    this.errorMessages.set('chart.render_error', 'Failed to render chart');
    this.errorMessages.set('chart.export_error', 'Failed to export chart');
    this.errorMessages.set('chart.too_much_data', 'Too much data for optimal performance');

    // File errors
    this.errorMessages.set('file.too_large', 'File is too large');
    this.errorMessages.set('file.invalid_type', 'Invalid file type');
    this.errorMessages.set('file.upload_failed', 'File upload failed');
    this.errorMessages.set('file.parsing_failed', 'Failed to parse file content');
  }

  /**
   * Setup API error handlers
   */
  setupAPIErrorHandlers() {
    this.apiErrorHandlers.set('network', (error) => {
      return {
        type: 'network',
        message: this.errorMessages.get('api.network_error'),
        userMessage: 'Please check your internet connection and try again.',
        canRetry: true,
        retryFunction: () => this.retryLastRequest()
      };
    });

    this.apiErrorHandlers.set('timeout', (error) => {
      return {
        type: 'timeout',
        message: this.errorMessages.get('api.timeout'),
        userMessage: 'The request took too long. Please try again.',
        canRetry: true,
        retryFunction: () => this.retryLastRequest()
      };
    });

    this.apiErrorHandlers.set('server', (error) => {
      return {
        type: 'server',
        message: this.errorMessages.get('api.server_error'),
        userMessage: 'Our servers are experiencing issues. Please try again later.',
        canRetry: true,
        retryFunction: () => this.retryLastRequest()
      };
    });

    this.apiErrorHandlers.set('validation', (error) => {
      return {
        type: 'validation',
        message: this.errorMessages.get('api.invalid_request'),
        userMessage: error.details || 'Please check your input and try again.',
        canRetry: false,
        fieldErrors: error.fieldErrors || []
      };
    });

    this.apiErrorHandlers.set('rate_limit', (error) => {
      return {
        type: 'rate_limit',
        message: this.errorMessages.get('api.rate_limit'),
        userMessage: 'Please wait a moment before making another request.',
        canRetry: true,
        retryDelay: error.retryAfter || 5000,
        retryFunction: () => this.retryLastRequest()
      };
    });
  }

  /**
   * Setup global error handlers
   */
  setupGlobalErrorHandlers() {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.handleGlobalError(event.reason, 'promise');
    });

    // Handle JavaScript errors
    window.addEventListener('error', (event) => {
      this.handleGlobalError({
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error
      }, 'javascript');
    });
  }

  /**
   * Validate input using specified validator
   */
  validate(type, data, options = {}) {
    const validator = this.validators.get(type);
    if (!validator) {
      console.error(`No validator found for type: ${type}`);
      return { isValid: false, errors: [`Unknown validation type: ${type}`] };
    }

    return validator(data, options);
  }

  /**
   * Validate dataset
   */
  validateDataset(dataset, index) {
    const errors = [];
    
    if (!dataset || typeof dataset !== 'object') {
      errors.push(`Dataset ${index + 1} must be an object`);
      return errors;
    }

    if (!dataset.label || typeof dataset.label !== 'string') {
      errors.push(`Dataset ${index + 1} must have a label`);
    }

    if (!dataset.data || !Array.isArray(dataset.data)) {
      errors.push(`Dataset ${index + 1} must have data array`);
    } else if (dataset.data.length === 0) {
      errors.push(`Dataset ${index + 1} cannot be empty`);
    } else {
      // Validate data values
      dataset.data.forEach((value, valueIndex) => {
        if (typeof value !== 'number' || isNaN(value)) {
          errors.push(`Dataset ${index + 1}, value ${valueIndex + 1} must be a valid number`);
        }
      });
    }

    return errors;
  }

  /**
   * Check if color is valid
   */
  isValidColor(color) {
    if (typeof color !== 'string') return false;
    
    // Hex color
    if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)) return true;
    
    // RGB color
    if (/^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/.test(color)) return true;
    
    // RGBA color
    if (/^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)$/.test(color)) return true;
    
    // Named colors (basic check)
    const namedColors = ['red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink', 'brown', 'black', 'white', 'gray'];
    if (namedColors.includes(color.toLowerCase())) return true;
    
    return false;
  }

  /**
   * Handle API errors gracefully
   */
  handleAPIError(error, context = {}) {
    console.error('API Error:', error);

    // Determine error type
    let errorType = 'unknown';
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      errorType = 'network';
    } else if (error.name === 'AbortError') {
      errorType = 'timeout';
    } else if (error.status >= 500) {
      errorType = 'server';
    } else if (error.status === 400 || error.status === 422) {
      errorType = 'validation';
    } else if (error.status === 429) {
      errorType = 'rate_limit';
    }

    // Get error handler
    const handler = this.apiErrorHandlers.get(errorType);
    const errorInfo = handler ? handler(error) : {
      type: errorType,
      message: error.message || 'An unknown error occurred',
      userMessage: 'Something went wrong. Please try again.',
      canRetry: true
    };

    // Add context
    errorInfo.context = context;
    errorInfo.timestamp = new Date().toISOString();

    // Show user-friendly error
    this.showUserError(errorInfo);

    // Log error for debugging
    this.logError(errorInfo);

    return errorInfo;
  }

  /**
   * Handle global errors
   */
  handleGlobalError(error, source) {
    const errorInfo = {
      type: 'global',
      source,
      message: error.message || 'Unknown error',
      stack: error.stack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    this.logError(errorInfo);

    // Show user-friendly message for critical errors
    if (source === 'javascript') {
      this.showUserError({
        type: 'javascript',
        message: 'An unexpected error occurred',
        userMessage: 'Something went wrong. Please refresh the page and try again.',
        canRetry: true,
        retryFunction: () => window.location.reload()
      });
    }
  }

  /**
   * Show user-friendly error message
   */
  showUserError(errorInfo) {
    // Use existing feedback system if available
    if (window.feedbackSystem) {
      if (errorInfo.canRetry) {
        window.feedbackSystem.showError(
          errorInfo.message,
          errorInfo.userMessage,
          {
            persistent: true,
            actions: [
              {
                label: 'Retry',
                type: 'primary',
                onClick: errorInfo.retryFunction || (() => this.retryLastRequest())
              },
              {
                label: 'Get Help',
                type: 'secondary',
                onClick: () => this.showHelpDialog(errorInfo)
              }
            ]
          }
        );
      } else {
        window.feedbackSystem.showError(
          errorInfo.message,
          errorInfo.userMessage,
          {
            actions: errorInfo.fieldErrors ? [
              {
                label: 'Fix Errors',
                type: 'primary',
                onClick: () => this.highlightFieldErrors(errorInfo.fieldErrors)
              }
            ] : []
          }
        );
      }
    } else {
      // Fallback to alert
      alert(`${errorInfo.message}: ${errorInfo.userMessage}`);
    }
  }

  /**
   * Log error for debugging
   */
  logError(errorInfo) {
    console.group('🚨 Error Logged');
    console.error('Error Details:', errorInfo);
    console.groupEnd();

    // In production, send to error tracking service
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry.captureException(error);
    }
  }

  /**
   * Retry last request
   */
  async retryLastRequest() {
    if (this.lastRequest) {
      try {
        return await this.lastRequest();
      } catch (error) {
        this.handleAPIError(error, { isRetry: true });
      }
    }
  }

  /**
   * Show help dialog
   */
  showHelpDialog(errorInfo) {
    const helpHTML = `
      <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" id="help-dialog">
        <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <h3 class="text-lg font-semibold mb-4">Help & Support</h3>
          <p class="text-gray-600 mb-4">
            We're sorry you're experiencing issues. Here are some things you can try:
          </p>
          
          <div class="space-y-3 mb-6">
            <div class="flex items-start space-x-3">
              <i class="fas fa-check-circle text-green-500 mt-1"></i>
              <div>
                <div class="font-medium">Check your internet connection</div>
                <div class="text-sm text-gray-600">Ensure you have a stable internet connection</div>
              </div>
            </div>
            
            <div class="flex items-start space-x-3">
              <i class="fas fa-check-circle text-green-500 mt-1"></i>
              <div>
                <div class="font-medium">Refresh the page</div>
                <div class="text-sm text-gray-600">Sometimes a simple refresh can fix the issue</div>
              </div>
            </div>
            
            <div class="flex items-start space-x-3">
              <i class="fas fa-check-circle text-green-500 mt-1"></i>
              <div>
                <div class="font-medium">Check your data format</div>
                <div class="text-sm text-gray-600">Ensure your data is in the correct format</div>
              </div>
            </div>
          </div>
          
          <div class="bg-gray-50 rounded-lg p-3 mb-4">
            <p class="text-sm text-gray-600 mb-2">Error ID:</p>
            <code class="text-xs bg-gray-200 px-2 py-1 rounded">${errorInfo.timestamp}</code>
          </div>
          
          <div class="flex space-x-3">
            <button class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700" onclick="window.open('/docs', '_blank')">
              <i class="fas fa-book mr-2"></i>Documentation
            </button>
            <button class="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700" onclick="window.open('/support', '_blank')">
              <i class="fas fa-headset mr-2"></i>Contact Support
            </button>
          </div>
          
          <button onclick="document.getElementById('help-dialog').remove()" class="w-full mt-3 border border-gray-300 py-2 px-4 rounded-lg hover:bg-gray-50">
            Close
          </button>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', helpHTML);
  }

  /**
   * Highlight field errors
   */
  highlightFieldErrors(fieldErrors) {
    fieldErrors.forEach(error => {
      const field = document.getElementById(error.field);
      if (field) {
        field.classList.add('border-red-500', 'ring-2', 'ring-red-200');
        field.focus();
        
        // Show field-specific error message
        let errorElement = field.parentNode.querySelector('.field-error');
        if (!errorElement) {
          errorElement = document.createElement('div');
          errorElement.className = 'field-error text-sm text-red-600 mt-1';
          field.parentNode.appendChild(errorElement);
        }
        errorElement.textContent = error.message;
      }
    });
  }

  /**
   * Format file size
   */
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Sanitize and validate user input
   */
  sanitizeInput(input, type = 'text') {
    if (!input || typeof input !== 'string') return '';

    let sanitized = input.trim();

    switch (type) {
      case 'text':
        // Remove potentially harmful characters
        sanitized = sanitized.replace(/[<>]/g, '');
        break;
      case 'number':
        // Ensure it's a valid number
        const num = parseFloat(sanitized);
        return isNaN(num) ? null : num;
      case 'email':
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(sanitized) ? sanitized : '';
      case 'color':
        // Validate color format
        return this.isValidColor(sanitized) ? sanitized : '#000000';
    }

    return sanitized;
  }

  /**
   * Validate form with multiple fields
   */
  validateForm(formElement, validationRules = {}) {
    const errors = {};
    let isValid = true;

    Object.entries(validationRules).forEach(([fieldName, rules]) => {
      const field = formElement.querySelector(`[name="${fieldName}"]`);
      if (!field) return;

      const value = field.value || field.textContent;
      let fieldErrors = [];

      rules.forEach(rule => {
        if (rule.required && (!value || value.trim() === '')) {
          fieldErrors.push('This field is required');
        }

        if (rule.type && !this.validate(rule.type, value).isValid) {
          fieldErrors.push(...this.validate(rule.type, value).errors);
        }

        if (rule.minLength && value.length < rule.minLength) {
          fieldErrors.push(`Must be at least ${rule.minLength} characters`);
        }

        if (rule.maxLength && value.length > rule.maxLength) {
          fieldErrors.push(`Must be no more than ${rule.maxLength} characters`);
        }

        if (rule.pattern && !rule.pattern.test(value)) {
          fieldErrors.push(rule.message || 'Invalid format');
        }
      });

      if (fieldErrors.length > 0) {
        errors[fieldName] = fieldErrors;
        isValid = false;
        this.showFieldError(field, fieldErrors[0]);
      } else {
        this.clearFieldError(field);
      }
    });

    return { isValid, errors };
  }

  /**
   * Show field error
   */
  showFieldError(field, message) {
    field.classList.add('border-red-500', 'ring-2', 'ring-red-200');
    
    let errorElement = field.parentNode.querySelector('.field-error');
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.className = 'field-error text-sm text-red-600 mt-1';
      field.parentNode.appendChild(errorElement);
    }
    errorElement.textContent = message;
  }

  /**
   * Clear field error
   */
  clearFieldError(field) {
    field.classList.remove('border-red-500', 'ring-2', 'ring-red-200');
    
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
      errorElement.remove();
    }
  }

  /**
   * Store last request for retry functionality
   */
  setLastRequest(requestFunction) {
    this.lastRequest = requestFunction;
  }

  /**
   * Get error statistics
   */
  getErrorStats() {
    return {
      totalErrors: this.errorMessages.size,
      validatorsCount: this.validators.size,
      apiHandlersCount: this.apiErrorHandlers.size
    };
  }
}

// Export singleton instance
export const validationAndErrorHandling = new ValidationAndErrorHandlingService();

// Make available globally
window.validationAndErrorHandling = validationAndErrorHandling;

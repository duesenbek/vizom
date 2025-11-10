/**
 * Enhanced Error Handling Component
 * User-friendly error messages with recovery actions and error boundaries
 */

class EnhancedErrorHandling {
  constructor() {
    this.errorBoundaries = new Map();
    this.errorHistory = [];
    this.retryAttempts = new Map();
    this.maxRetries = 3;
    this.init();
  }

  init() {
    this.setupGlobalErrorHandlers();
    this.setupErrorStyles();
  }

  /**
   * Setup global error handlers
   */
  setupGlobalErrorHandlers() {
    // Catch unhandled JavaScript errors
    window.addEventListener('error', (event) => {
      this.handleError({
        type: 'javascript',
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error
      });
    });

    // Catch unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError({
        type: 'promise',
        message: event.reason?.message || 'Unhandled promise rejection',
        error: event.reason
      });
    });
  }

  /**
   * Setup error styling
   */
  setupErrorStyles() {
    if (document.getElementById('error-handling-styles')) return;

    const styles = document.createElement('style');
    styles.id = 'error-handling-styles';
    styles.textContent = `
      /* Error Boundary Styles */
      .error-boundary {
        background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
        border: 1px solid #fecaca;
        border-radius: 12px;
        padding: 1.5rem;
        margin: 1rem 0;
      }

      .error-boundary.critical {
        background: linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%);
        border-color: #dc2626;
        color: white;
      }

      .error-boundary.warning {
        background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
        border-color: #fbbf24;
      }

      /* Error Animation */
      @keyframes error-shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
      }

      .error-shake {
        animation: error-shake 0.5s ease-in-out;
      }

      /* Retry Button Styles */
      .retry-button {
        background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 6px;
        font-size: 0.875rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
      }

      .retry-button:hover {
        background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
      }

      .retry-button:disabled {
        background: #9ca3af;
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
      }

      /* Error Icon */
      .error-icon {
        width: 48px;
        height: 48px;
        background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 24px;
        margin-bottom: 1rem;
      }

      .error-boundary.warning .error-icon {
        background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      }

      /* Error Details */
      .error-details {
        background: rgba(0, 0, 0, 0.05);
        border-radius: 6px;
        padding: 0.75rem;
        margin-top: 1rem;
        font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
        font-size: 0.75rem;
        color: #374151;
        border: 1px solid rgba(0, 0, 0, 0.1);
      }

      .error-boundary.critical .error-details {
        background: rgba(0, 0, 0, 0.2);
        color: #e5e7eb;
        border-color: rgba(255, 255, 255, 0.1);
      }

      /* Mobile Optimizations */
      @media (max-width: 768px) {
        .error-boundary {
          padding: 1rem;
          margin: 0.5rem 0;
        }
        
        .error-icon {
          width: 40px;
          height: 40px;
          font-size: 20px;
        }
        
        .retry-button {
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
        }
      }
    `;
    document.head.appendChild(styles);
  }

  /**
   * Handle different types of errors
   */
  handleError(error, context = {}) {
    const errorInfo = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...error,
      context,
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    this.errorHistory.push(errorInfo);
    this.logError(errorInfo);

    // Show user-friendly error message
    this.showUserError(errorInfo);

    return errorInfo.id;
  }

  /**
   * Show user-friendly error message
   */
  showUserError(errorInfo) {
    const errorConfig = this.getErrorConfig(errorInfo);
    const containerId = errorInfo.context?.containerId || 'error-container';

    // Create or find error container
    let container = document.getElementById(containerId);
    if (!container) {
      container = document.createElement('div');
      container.id = containerId;
      document.body.appendChild(container);
    }

    const errorHTML = this.generateErrorHTML(errorInfo, errorConfig);
    container.innerHTML = errorHTML;
    container.classList.add('error-shake');
    
    // Remove animation class after animation completes
    setTimeout(() => {
      container.classList.remove('error-shake');
    }, 500);

    // Setup retry functionality
    this.setupRetryActions(errorInfo.id);
  }

  /**
   * Get error configuration based on error type
   */
  getErrorConfig(errorInfo) {
    const configs = {
      network: {
        title: 'Connection Error',
        message: 'Unable to connect to our servers. Please check your internet connection.',
        severity: 'warning',
        canRetry: true,
        actions: ['Retry', 'Check Connection', 'Use Offline Mode']
      },
      api: {
        title: 'Service Unavailable',
        message: 'Our chart generation service is temporarily unavailable. Please try again in a moment.',
        severity: 'warning',
        canRetry: true,
        actions: ['Retry', 'Try Different Chart', 'Contact Support']
      },
      validation: {
        title: 'Invalid Data',
        message: 'The data you provided couldn\'t be processed. Please check the format and try again.',
        severity: 'warning',
        canRetry: false,
        actions: ['Fix Data', 'View Examples', 'Get Help']
      },
      javascript: {
        title: 'Application Error',
        message: 'Something went wrong in the application. We\'ve been notified and are working on a fix.',
        severity: 'critical',
        canRetry: true,
        actions: ['Reload Page', 'Report Issue', 'Go to Home']
      },
      promise: {
        title: 'Operation Failed',
        message: 'An operation couldn\'t be completed. This might be a temporary issue.',
        severity: 'warning',
        canRetry: true,
        actions: ['Retry', 'Cancel Operation', 'Continue Anyway']
      }
    };

    return configs[errorInfo.type] || configs.javascript;
  }

  /**
   * Generate error HTML
   */
  generateErrorHTML(errorInfo, config) {
    const retryCount = this.retryAttempts.get(errorInfo.id) || 0;
    const canRetry = config.canRetry && retryCount < this.maxRetries;

    return `
      <div class="error-boundary ${config.severity}">
        <div class="flex items-start space-x-4">
          <div class="error-icon">
            <i class="fas ${config.severity === 'critical' ? 'fa-exclamation-triangle' : 'fa-exclamation-circle'}"></i>
          </div>
          
          <div class="flex-1">
            <h3 class="text-lg font-semibold mb-2 ${config.severity === 'critical' ? 'text-white' : 'text-gray-900'}">
              ${config.title}
            </h3>
            
            <p class="${config.severity === 'critical' ? 'text-red-100' : 'text-gray-700'} mb-4">
              ${config.message}
            </p>

            ${retryCount > 0 ? `
              <p class="text-sm ${config.severity === 'critical' ? 'text-red-200' : 'text-gray-500'} mb-3">
                Retry attempt ${retryCount} of ${this.maxRetries}
              </p>
            ` : ''}

            <div class="flex flex-wrap gap-2 mb-4">
              ${config.actions.map((action, index) => {
                const isRetry = action === 'Retry' && canRetry;
                return `
                  <button 
                    class="retry-button ${!isRetry ? 'bg-gray-500 hover:bg-gray-600' : ''}"
                    data-error-id="${errorInfo.id}"
                    data-action="${action.toLowerCase().replace(' ', '-')}"
                    ${!isRetry && action === 'Retry' ? 'disabled' : ''}
                  >
                    ${isRetry ? '<i class="fas fa-redo"></i>' : ''}
                    ${action}
                  </button>
                `;
              }).join('')}
            </div>

            ${errorInfo.context?.showDetails !== false ? `
              <details class="error-details">
                <summary class="cursor-pointer font-medium mb-2">Technical Details</summary>
                <div class="mt-2">
                  <div><strong>Error ID:</strong> ${errorInfo.id}</div>
                  <div><strong>Time:</strong> ${new Date(errorInfo.timestamp).toLocaleString()}</div>
                  <div><strong>Type:</strong> ${errorInfo.type}</div>
                  ${errorInfo.message ? `<div><strong>Message:</strong> ${errorInfo.message}</div>` : ''}
                  ${errorInfo.filename ? `<div><strong>File:</strong> ${errorInfo.filename}:${errorInfo.lineno}:${errorInfo.colno}</div>` : ''}
                </div>
              </details>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Setup retry actions
   */
  setupRetryActions(errorId) {
    const buttons = document.querySelectorAll(`[data-error-id="${errorId}"]`);
    
    buttons.forEach(button => {
      button.addEventListener('click', () => {
        const action = button.dataset.action;
        this.handleRetryAction(errorId, action);
      });
    });
  }

  /**
   * Handle retry actions
   */
  async handleRetryAction(errorId, action) {
    const retryCount = this.retryAttempts.get(errorId) || 0;
    
    switch (action) {
      case 'retry':
        if (retryCount < this.maxRetries) {
          this.retryAttempts.set(errorId, retryCount + 1);
          await this.performRetry(errorId);
        }
        break;
        
      case 'reload-page':
        window.location.reload();
        break;
        
      case 'go-to-home':
        window.location.href = '/';
        break;
        
      case 'contact-support':
        this.showSupportDialog(errorId);
        break;
        
      case 'check-connection':
        this.checkConnection();
        break;
        
      default:
        console.log(`Action ${action} not implemented yet`);
    }
  }

  /**
   * Perform retry operation
   */
  async performRetry(errorId) {
    const error = this.errorHistory.find(e => e.id === errorId);
    if (!error || !error.context?.retryFunction) return;

    const retryButton = document.querySelector(`[data-error-id="${errorId}"][data-action="retry"]`);
    if (retryButton) {
      retryButton.disabled = true;
      retryButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Retrying...';
    }

    try {
      await error.context.retryFunction();
      this.clearError(errorId);
    } catch (retryError) {
      // Update error with retry failure
      error.retryError = retryError;
      this.showUserError(error);
    } finally {
      if (retryButton) {
        retryButton.disabled = false;
        retryButton.innerHTML = '<i class="fas fa-redo"></i> Retry';
      }
    }
  }

  /**
   * Check internet connection
   */
  checkConnection() {
    if (!navigator.onLine) {
      this.handleError({
        type: 'network',
        message: 'No internet connection detected'
      }, { containerId: 'connection-status' });
    } else {
      // Show connection success
      const container = document.getElementById('connection-status');
      if (container) {
        container.innerHTML = `
          <div class="bg-green-50 border border-green-200 rounded-lg p-4">
            <div class="flex items-center">
              <i class="fas fa-check-circle text-green-600 mr-2"></i>
              <span class="text-green-800">Connection is working properly</span>
            </div>
          </div>
        `;
      }
    }
  }

  /**
   * Show support dialog
   */
  showSupportDialog(errorId) {
    const error = this.errorHistory.find(e => e.id === errorId);
    const supportHTML = `
      <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" id="support-dialog">
        <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <h3 class="text-lg font-semibold mb-4">Contact Support</h3>
          <p class="text-gray-600 mb-4">
            We're sorry you're experiencing issues. Our support team is here to help.
          </p>
          
          <div class="space-y-3 mb-6">
            <button class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
              <i class="fas fa-envelope mr-2"></i>Email Support
            </button>
            <button class="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700">
              <i class="fas fa-comments mr-2"></i>Live Chat
            </button>
            <button class="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700">
              <i class="fas fa-book mr-2"></i>View Documentation
            </button>
          </div>
          
          <div class="bg-gray-50 rounded-lg p-3">
            <p class="text-sm text-gray-600 mb-2">Reference ID:</p>
            <code class="text-xs bg-gray-200 px-2 py-1 rounded">${errorId}</code>
          </div>
          
          <button 
            onclick="document.getElementById('support-dialog').remove()"
            class="w-full mt-4 border border-gray-300 py-2 px-4 rounded-lg hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', supportHTML);
  }

  /**
   * Clear error from display
   */
  clearError(errorId) {
    const container = document.getElementById('error-container');
    if (container) {
      container.innerHTML = '';
    }
    
    this.retryAttempts.delete(errorId);
  }

  /**
   * Log error for debugging
   */
  logError(errorInfo) {
    console.group(`🚨 Error ${errorInfo.id}`);
    console.error('Error Details:', errorInfo);
    console.groupEnd();

    // In production, you might send this to an error tracking service
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry.captureException(errorInfo.error);
    }
  }

  /**
   * Get error statistics
   */
  getErrorStats() {
    const errorsByType = {};
    this.errorHistory.forEach(error => {
      errorsByType[error.type] = (errorsByType[error.type] || 0) + 1;
    });

    return {
      totalErrors: this.errorHistory.length,
      errorsByType,
      recentErrors: this.errorHistory.slice(-5),
      retryAttempts: Array.from(this.retryAttempts.values()).reduce((a, b) => a + b, 0)
    };
  }

  /**
   * Clear error history
   */
  clearHistory() {
    this.errorHistory = [];
    this.retryAttempts.clear();
  }
}

// Export singleton instance
export const errorHandler = new EnhancedErrorHandling();

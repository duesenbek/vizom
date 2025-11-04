// Comprehensive Error Handling System for VIZOM
class ErrorHandler {
  constructor() {
    this.errorTypes = {
      NETWORK: 'network',
      VALIDATION: 'validation',
      AI_SERVICE: 'ai_service',
      FILE_UPLOAD: 'file_upload',
      EXPORT: 'export',
      AUTH: 'auth',
      UNKNOWN: 'unknown'
    };
    
    this.errorMessages = {
      [this.errorTypes.NETWORK]: {
        title: 'Connection Error',
        message: 'Unable to connect to our servers. Please check your internet connection.',
        suggestions: [
          'Check your internet connection',
          'Try refreshing the page',
          'Contact support if the problem persists'
        ],
        actions: [
          { text: 'Retry', action: 'retry' },
          { text: 'Refresh', action: 'refresh' }
        ]
      },
      [this.errorTypes.VALIDATION]: {
        title: 'Invalid Input',
        message: 'Please check your data format and try again.',
        suggestions: [
          'Ensure data follows the shown examples',
          'Check for missing values or incorrect formatting',
          'Use the template feature for guidance'
        ],
        actions: [
          { text: 'View Examples', action: 'showExamples' },
          { text: 'Use Template', action: 'showTemplates' }
        ]
      },
      [this.errorTypes.AI_SERVICE]: {
        title: 'AI Service Error',
        message: 'Our AI service encountered an issue processing your request.',
        suggestions: [
          'Try simplifying your data description',
          'Check if your data format is correct',
          'Try a different chart type'
        ],
        actions: [
          { text: 'Try Again', action: 'retry' },
          { text: 'Change Chart Type', action: 'changeChartType' }
        ]
      },
      [this.errorTypes.FILE_UPLOAD]: {
        title: 'File Upload Error',
        message: 'There was an issue processing your file.',
        suggestions: [
          'Ensure the file is a valid CSV format',
          'Check that the file size is under 10MB',
          'Verify the file has the correct headers'
        ],
        actions: [
          { text: 'Choose Different File', action: 'reupload' },
          { text: 'View Format Guide', action: 'showFormatGuide' }
        ]
      },
      [this.errorTypes.EXPORT]: {
        title: 'Export Failed',
        message: 'Unable to export your chart at this time.',
        suggestions: [
          'Try a different export format',
          'Check if your chart is fully generated',
          'Ensure you have permission to download files'
        ],
        actions: [
          { text: 'Try Again', action: 'retry' },
          { text: 'Change Format', action: 'changeFormat' }
        ]
      },
      [this.errorTypes.AUTH]: {
        title: 'Authentication Error',
        message: 'Please sign in to use this feature.',
        suggestions: [
          'Sign in to your account',
          'Create a free account if you don\'t have one',
          'Check if your session has expired'
        ],
        actions: [
          { text: 'Sign In', action: 'signin' },
          { text: 'Create Account', action: 'signup' }
        ]
      },
      [this.errorTypes.UNKNOWN]: {
        title: 'Unexpected Error',
        message: 'Something went wrong. Our team has been notified.',
        suggestions: [
          'Try refreshing the page',
          'Check your internet connection',
          'Contact support if the problem continues'
        ],
        actions: [
          { text: 'Refresh Page', action: 'refresh' },
          { text: 'Contact Support', action: 'contactSupport' }
        ]
      }
    };

    this.init();
  }

  init() {
    this.setupGlobalErrorHandlers();
    this.setupErrorReporting();
  }

  // Global error handlers
  setupGlobalErrorHandlers() {
    // Handle JavaScript errors
    window.addEventListener('error', (event) => {
      this.handleError({
        type: this.errorTypes.UNKNOWN,
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error
      });
    });

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError({
        type: this.errorTypes.UNKNOWN,
        message: event.reason?.message || 'Unhandled promise rejection',
        reason: event.reason
      });
    });
  }

  // Main error handling method
  handleError(error, context = {}) {
    const errorInfo = this.processError(error, context);
    
    // Show user-friendly error message
    this.showErrorMessage(errorInfo);
    
    // Log error for debugging
    this.logError(errorInfo);
    
    // Report to analytics
    this.reportError(errorInfo);
    
    // Track error occurrence
    this.trackError(errorInfo);
  }

  // Process and categorize error
  processError(error, context) {
    let errorType = this.errorTypes.UNKNOWN;
    let originalMessage = error.message || 'Unknown error occurred';
    
    // Categorize error based on message and context
    if (error.message?.includes('network') || error.message?.includes('fetch')) {
      errorType = this.errorTypes.NETWORK;
    } else if (error.message?.includes('validation') || context.validation === true) {
      errorType = this.errorTypes.VALIDATION;
    } else if (error.message?.includes('AI') || context.aiService === true) {
      errorType = this.errorTypes.AI_SERVICE;
    } else if (error.message?.includes('upload') || context.fileUpload === true) {
      errorType = this.errorTypes.FILE_UPLOAD;
    } else if (error.message?.includes('export') || context.export === true) {
      errorType = this.errorTypes.EXPORT;
    } else if (error.message?.includes('auth') || context.auth === true) {
      errorType = this.errorTypes.AUTH;
    }

    const errorTemplate = this.errorMessages[errorType];
    
    return {
      id: this.generateErrorId(),
      type: errorType,
      title: errorTemplate.title,
      message: errorTemplate.message,
      originalMessage: originalMessage,
      suggestions: errorTemplate.suggestions,
      actions: errorTemplate.actions,
      context: context,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };
  }

  // Show user-friendly error message
  showErrorMessage(errorInfo) {
    // Remove existing error messages
    this.removeExistingErrorMessages();

    const errorModal = this.createErrorModal(errorInfo);
    document.body.appendChild(errorModal);

    // Animate in
    setTimeout(() => {
      errorModal.classList.add('show');
    }, 10);

    // Auto-hide after 10 seconds if no interaction
    const autoHide = setTimeout(() => {
      this.hideErrorMessage(errorInfo.id);
    }, 10000);

    // Clear auto-hide on user interaction
    errorModal.addEventListener('mouseenter', () => clearTimeout(autoHide));
    errorModal.addEventListener('click', () => clearTimeout(autoHide));
  }

  // Create error modal element
  createErrorModal(errorInfo) {
    const modal = document.createElement('div');
    modal.className = 'error-modal';
    modal.id = `error-${errorInfo.id}`;
    
    modal.innerHTML = `
      <div class="error-backdrop"></div>
      <div class="error-container" role="alertdialog" aria-labelledby="error-title-${errorInfo.id}" aria-describedby="error-message-${errorInfo.id}">
        <div class="error-header">
          <div class="error-icon">
            <i class="fas fa-exclamation-triangle"></i>
          </div>
          <h3 class="error-title" id="error-title-${errorInfo.id}">${errorInfo.title}</h3>
          <button class="error-close" aria-label="Close error message" onclick="window.errorHandler.hideErrorMessage('${errorInfo.id}')">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="error-content">
          <p class="error-message" id="error-message-${errorInfo.id}">${errorInfo.message}</p>
          
          <div class="error-suggestions">
            <h4>What you can try:</h4>
            <ul>
              ${errorInfo.suggestions.map(suggestion => `<li>${suggestion}</li>`).join('')}
            </ul>
          </div>
          
          <div class="error-actions">
            ${errorInfo.actions.map(action => `
              <button class="btn btn-${action.action === 'retry' ? 'primary' : 'secondary'}" 
                      onclick="window.errorHandler.handleAction('${action.action}', '${errorInfo.id}')">
                ${action.text}
              </button>
            `).join('')}
          </div>
          
          <div class="error-details">
            <button class="error-details-toggle" onclick="window.errorHandler.toggleErrorDetails('${errorInfo.id}')">
              <i class="fas fa-chevron-down"></i> Technical Details
            </button>
            <div class="error-details-content" id="error-details-${errorInfo.id}">
              <code>${errorInfo.originalMessage}</code>
              <small>Error ID: ${errorInfo.id}</small>
            </div>
          </div>
        </div>
      </div>
    `;

    return modal;
  }

  // Handle error actions
  handleAction(action, errorId) {
    this.hideErrorMessage(errorId);
    
    switch (action) {
      case 'retry':
        this.retryLastAction();
        break;
      case 'refresh':
        window.location.reload();
        break;
      case 'showExamples':
        this.showExamples();
        break;
      case 'showTemplates':
        this.showTemplates();
        break;
      case 'changeChartType':
        this.focusChartTypeSelector();
        break;
      case 'reupload':
        this.triggerFileUpload();
        break;
      case 'showFormatGuide':
        this.showFormatGuide();
        break;
      case 'changeFormat':
        this.showExportOptions();
        break;
      case 'signin':
        this.showSignInModal();
        break;
      case 'signup':
        this.showSignUpModal();
        break;
      case 'contactSupport':
        this.contactSupport();
        break;
    }
  }

  // Action implementations
  retryLastAction() {
    // Trigger the last action that failed
    if (this.lastFailedAction) {
      this.lastFailedAction();
    }
  }

  showExamples() {
    // Scroll to examples section
    const examples = document.querySelector('.quick-prompts');
    if (examples) {
      examples.scrollIntoView({ behavior: 'smooth' });
      examples.classList.add('highlight');
      setTimeout(() => examples.classList.remove('highlight'), 2000);
    }
  }

  showTemplates() {
    // Switch to templates tab
    const templateTab = document.querySelector('[data-tab="template"]');
    if (templateTab) {
      templateTab.click();
    }
  }

  focusChartTypeSelector() {
    const chartPicker = document.querySelector('.chart-picker');
    if (chartPicker) {
      chartPicker.scrollIntoView({ behavior: 'smooth' });
      chartPicker.classList.add('highlight');
      setTimeout(() => chartPicker.classList.remove('highlight'), 2000);
    }
  }

  triggerFileUpload() {
    const fileInput = document.getElementById('csv-upload-modern');
    if (fileInput) {
      fileInput.click();
    }
  }

  showFormatGuide() {
    // Show format guide modal
    this.showFormatGuideModal();
  }

  showExportOptions() {
    // Focus export buttons
    const exportButtons = document.querySelector('.preview-actions');
    if (exportButtons) {
      exportButtons.scrollIntoView({ behavior: 'smooth' });
      exportButtons.classList.add('highlight');
      setTimeout(() => exportButtons.classList.remove('highlight'), 2000);
    }
  }

  showSignInModal() {
    // Trigger sign in
    const signinBtn = document.getElementById('auth-signin');
    if (signinBtn) {
      signinBtn.click();
    }
  }

  showSignUpModal() {
    // Trigger sign up
    const signupBtn = document.getElementById('auth-getstarted');
    if (signupBtn) {
      signupBtn.click();
    }
  }

  contactSupport() {
    // Open support chat or email
    window.open('mailto:support@vizom.com?subject=Error Report&body=Error ID: ' + this.lastErrorId);
  }

  // Hide error message
  hideErrorMessage(errorId) {
    const modal = document.getElementById(`error-${errorId}`);
    if (modal) {
      modal.classList.remove('show');
      setTimeout(() => modal.remove(), 300);
    }
  }

  // Remove existing error messages
  removeExistingErrorMessages() {
    document.querySelectorAll('.error-modal').forEach(modal => modal.remove());
  }

  // Toggle error details
  toggleErrorDetails(errorId) {
    const details = document.getElementById(`error-details-${errorId}`);
    const toggle = details.previousElementSibling;
    const icon = toggle.querySelector('i');
    
    if (details.style.display === 'block') {
      details.style.display = 'none';
      icon.classList.remove('fa-chevron-up');
      icon.classList.add('fa-chevron-down');
    } else {
      details.style.display = 'block';
      icon.classList.remove('fa-chevron-down');
      icon.classList.add('fa-chevron-up');
    }
  }

  // Error logging
  logError(errorInfo) {
    console.group(`🚨 VIZOM Error: ${errorInfo.title}`);
    console.error('Error Info:', errorInfo);
    console.error('Original Error:', errorInfo.originalMessage);
    console.groupEnd();
  }

  // Error reporting
  setupErrorReporting() {
    // Setup error reporting to analytics service
    this.errorQueue = [];
    
    // Report errors in batches
    setInterval(() => {
      if (this.errorQueue.length > 0) {
        this.reportErrorsBatch();
      }
    }, 30000); // Report every 30 seconds
  }

  reportError(errorInfo) {
    this.errorQueue.push(errorInfo);
    this.lastErrorId = errorInfo.id;
  }

  async reportErrorsBatch() {
    if (this.errorQueue.length === 0) return;
    
    const errors = [...this.errorQueue];
    this.errorQueue = [];
    
    try {
      // Send to analytics service
      if (window.analytics) {
        errors.forEach(error => {
          window.analytics.trackCustomEvent('error_occurred', {
            type: error.type,
            message: error.title,
            context: error.context
          });
        });
      }
      
      // Send to error monitoring service (like Sentry)
      // await this.sendToErrorService(errors);
      
    } catch (reportingError) {
      console.error('Failed to report errors:', reportingError);
    }
  }

  // Track errors for analytics
  trackError(errorInfo) {
    if (window.analytics) {
      window.analytics.trackCustomEvent('error_occurred', {
        error_type: errorInfo.type,
        error_title: errorInfo.title,
        error_context: error.context,
        error_id: errorInfo.id
      });
    }
  }

  // Utility methods
  generateErrorId() {
    return 'error_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Show format guide modal
  showFormatGuideModal() {
    const modal = document.createElement('div');
    modal.className = 'format-guide-modal';
    modal.innerHTML = `
      <div class="modal-backdrop"></div>
      <div class="modal-container">
        <div class="modal-header">
          <h3>Data Format Guide</h3>
          <button class="modal-close" onclick="this.closest('.format-guide-modal').remove()">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-content">
          <div class="format-section">
            <h4>📊 Text Input Format</h4>
            <pre>Monthly sales: January $12K, February $15K, March $18K</pre>
          </div>
          <div class="format-section">
            <h4>📋 CSV Format</h4>
            <pre>Month,Sales
January,12000
February,15000
March,18000</pre>
          </div>
          <div class="format-section">
            <h4>💡 Tips</h4>
            <ul>
              <li>Use clear labels for your data</li>
              <li>Include units (K, M, %) when applicable</li>
              <li>Keep data points under 50 for best results</li>
            </ul>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 10);
  }

  // Set last failed action for retry
  setLastFailedAction(action) {
    this.lastFailedAction = action;
  }
}

// Initialize error handler
document.addEventListener('DOMContentLoaded', () => {
  window.errorHandler = new ErrorHandler();
});

export { ErrorHandler };

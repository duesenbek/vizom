// System Feedback System - Immediate, Helpful, and Contextual Feedback
class SystemFeedbackManager {
  constructor() {
    this.feedbackQueue = [];
    this.activeFeedback = new Map();
    this.loadingStates = new Map();
    this.progressBars = new Map();
    this.errorMessages = new Map();
    this.successMessages = new Map();
    this.feedbackHistory = [];
    this.maxHistorySize = 100;
    
    this.init();
  }

  init() {
    this.setupImmediateFeedback();
    this.setupLoadingAnimations();
    this.setupProgressIndicators();
    this.setupErrorHandling();
    this.setupSuccessConfirmations();
    this.setupFeedbackTiming();
    this.setupContextualMessages();
    this.setupFeedbackHistory();
    this.setupAccessibility();
  }

  // Setup immediate feedback for user actions
  setupImmediateFeedback() {
    // Button click feedback
    document.addEventListener('click', (e) => {
      if (e.target.matches('button, .btn, [role="button"]')) {
        this.provideImmediateFeedback(e.target);
      }
    });

    // Link click feedback
    document.addEventListener('click', (e) => {
      if (e.target.matches('a, [role="link"]')) {
        this.provideLinkFeedback(e.target);
      }
    });

    // Form input feedback
    document.addEventListener('input', (e) => {
      if (e.target.matches('.form-input, input, textarea, select')) {
        this.provideInputFeedback(e.target);
      }
    });

    // Keyboard action feedback
    document.addEventListener('keydown', (e) => {
      this.provideKeyboardFeedback(e);
    });
  }

  // Provide immediate feedback for buttons
  provideImmediateFeedback(button) {
    // Visual feedback
    this.addClickAnimation(button);
    
    // Haptic feedback (if available)
    this.provideHapticFeedback('light');
    
    // Audio feedback (if enabled)
    this.provideAudioFeedback('click');
    
    // Status feedback
    this.showActionStatus(button);
    
    // Track interaction
    this.trackUserAction('button_click', {
      button_text: button.textContent,
      button_type: this.getButtonType(button)
    });
  }

  // Add click animation
  addClickAnimation(element) {
    // Remove existing animation
    element.classList.remove('clicked');
    
    // Trigger reflow
    void element.offsetWidth;
    
    // Add animation class
    element.classList.add('clicked');
    
    // Remove after animation
    setTimeout(() => {
      element.classList.remove('clicked');
    }, 200);
  }

  // Provide haptic feedback
  provideHapticFeedback(type) {
    if ('vibrate' in navigator) {
      const patterns = {
        'light': [10],
        'medium': [20],
        'heavy': [50],
        'success': [10, 50, 10],
        'error': [50, 30, 50],
        'warning': [30, 20, 30]
      };
      
      const pattern = patterns[type] || patterns['light'];
      navigator.vibrate(pattern);
    }
  }

  // Provide audio feedback
  provideAudioFeedback(type) {
    const audioEnabled = localStorage.getItem('audio_feedback_enabled') === 'true';
    
    if (audioEnabled && this.audioContext) {
      const sounds = {
        'click': 800,
        'success': 1000,
        'error': 400,
        'warning': 600
      };
      
      const frequency = sounds[type] || sounds['click'];
      this.playTone(frequency, 50);
    }
  }

  // Play tone
  playTone(frequency, duration) {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration / 1000);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration / 1000);
  }

  // Show action status
  showActionStatus(button) {
    const action = this.getActionType(button);
    const status = this.getActionStatus(action);
    
    if (status) {
      this.showMicroFeedback(button, status.message, status.type);
    }
  }

  // Get action type
  getActionType(button) {
    const text = button.textContent.toLowerCase();
    const classes = button.className.toLowerCase();
    
    if (text.includes('save') || classes.includes('save')) return 'save';
    if (text.includes('delete') || classes.includes('delete')) return 'delete';
    if (text.includes('create') || classes.includes('create')) return 'create';
    if (text.includes('update') || classes.includes('update')) return 'update';
    if (text.includes('export') || classes.includes('export')) return 'export';
    if (text.includes('import') || classes.includes('import')) return 'import';
    if (text.includes('generate') || classes.includes('generate')) return 'generate';
    
    return 'action';
  }

  // Get action status
  getActionStatus(action) {
    const statuses = {
      'save': { message: 'Saving...', type: 'info' },
      'delete': { message: 'Deleting...', type: 'warning' },
      'create': { message: 'Creating...', type: 'info' },
      'update': { message: 'Updating...', type: 'info' },
      'export': { message: 'Preparing export...', type: 'info' },
      'import': { message: 'Importing...', type: 'info' },
      'generate': { message: 'Generating...', type: 'info' },
      'action': { message: 'Processing...', type: 'info' }
    };
    
    return statuses[action];
  }

  // Show micro feedback
  showMicroFeedback(element, message, type) {
    const feedback = document.createElement('div');
    feedback.className = `micro-feedback ${type}`;
    feedback.textContent = message;
    
    // Position near element
    const rect = element.getBoundingClientRect();
    feedback.style.position = 'fixed';
    feedback.style.top = `${rect.bottom + 5}px`;
    feedback.style.left = `${rect.left + rect.width / 2}px`;
    feedback.style.transform = 'translateX(-50%)';
    feedback.style.zIndex = '9999';
    
    document.body.appendChild(feedback);
    
    // Auto-remove
    setTimeout(() => {
      feedback.remove();
    }, 2000);
  }

  // Provide link feedback
  provideLinkFeedback(link) {
    // Show loading state for external links
    if (link.hostname !== window.location.hostname) {
      this.showLinkLoading(link);
    }
    
    // Track link click
    this.trackUserAction('link_click', {
      link_text: link.textContent,
      link_url: link.href
    });
  }

  // Show link loading
  showLinkLoading(link) {
    const originalText = link.innerHTML;
    link.innerHTML = `${originalText} <i class="fas fa-spinner fa-spin"></i>`;
    
    // Restore after delay
    setTimeout(() => {
      link.innerHTML = originalText;
    }, 2000);
  }

  // Provide input feedback
  provideInputFeedback(input) {
    const value = input.value;
    const maxLength = input.maxLength;
    
    // Character count feedback
    if (maxLength && value.length > maxLength * 0.8) {
      this.showCharacterCount(input, value.length, maxLength);
    }
    
    // Validation feedback
    if (input.dataset.validate) {
      this.debounceValidation(input);
    }
  }

  // Show character count
  showCharacterCount(input, current, max) {
    let counter = input.parentNode.querySelector('.character-count');
    
    if (!counter) {
      counter = document.createElement('div');
      counter.className = 'character-count';
      input.parentNode.appendChild(counter);
    }
    
    const percentage = (current / max) * 100;
    const status = percentage >= 100 ? 'error' : percentage >= 90 ? 'warning' : 'info';
    
    counter.className = `character-count ${status}`;
    counter.textContent = `${current}/${max} characters`;
    
    // Auto-hide when not near limit
    if (percentage < 80) {
      setTimeout(() => {
        counter.style.opacity = '0';
      }, 2000);
    } else {
      counter.style.opacity = '1';
    }
  }

  // Debounce validation
  debounceValidation(input) {
    clearTimeout(input.validationTimeout);
    
    input.validationTimeout = setTimeout(() => {
      this.validateInput(input);
    }, 300);
  }

  // Validate input
  validateInput(input) {
    // Implementation would depend on validation rules
    const isValid = input.value.length > 0; // Simple example
    
    this.showValidationFeedback(input, isValid);
  }

  // Show validation feedback
  showValidationFeedback(input, isValid) {
    input.classList.toggle('valid', isValid);
    input.classList.toggle('invalid', !isValid);
    
    // Show validation message
    const message = isValid ? 'Valid input' : 'Please enter a value';
    this.showMicroFeedback(input, message, isValid ? 'success' : 'error');
  }

  // Provide keyboard feedback
  provideKeyboardFeedback(e) {
    // Shortcut feedback
    if (e.ctrlKey || e.metaKey) {
      this.showShortcutFeedback(e);
    }
    
    // Navigation feedback
    if (e.key === 'Tab') {
      this.showTabFeedback(e);
    }
  }

  // Show shortcut feedback
  showShortcutFeedback(e) {
    const shortcuts = {
      's': 'Save',
      'z': 'Undo',
      'y': 'Redo',
      'f': 'Find',
      'k': 'Search'
    };
    
    const key = e.key.toLowerCase();
    const action = shortcuts[key];
    
    if (action) {
      this.showMicroFeedback(document.body, `${action} activated`, 'info');
    }
  }

  // Show tab feedback
  showTabFeedback(e) {
    const element = document.activeElement;
    if (element) {
      this.highlightFocusedElement(element);
    }
  }

  // Highlight focused element
  highlightFocusedElement(element) {
    element.classList.add('focus-highlighted');
    
    setTimeout(() => {
      element.classList.remove('focus-highlighted');
    }, 500);
  }

  // Setup loading animations
  setupLoadingAnimations() {
    // Button loading states
    this.setupButtonLoading();
    
    // Form loading states
    this.setupFormLoading();
    
    // Page loading states
    this.setupPageLoading();
  }

  // Setup button loading
  setupButtonLoading() {
    document.addEventListener('click', (e) => {
      const button = e.target.closest('button, .btn');
      if (button && button.dataset.loading) {
        this.setButtonLoading(button, true);
      }
    });
  }

  // Set button loading state
  setButtonLoading(button, loading) {
    const loadingId = `button_${Date.now()}`;
    
    if (loading) {
      // Store original state
      this.loadingStates.set(loadingId, {
        element: button,
        originalText: button.innerHTML,
        originalDisabled: button.disabled
      });
      
      // Set loading state
      button.disabled = true;
      button.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${button.dataset.loading || 'Loading...'}`;
      button.classList.add('loading');
      
      // Auto-timeout after 30 seconds
      setTimeout(() => {
        this.setButtonLoading(button, false);
        this.loadingStates.delete(loadingId);
      }, 30000);
      
    } else {
      // Restore original state
      const state = Array.from(this.loadingStates.values()).find(s => s.element === button);
      if (state) {
        button.innerHTML = state.originalText;
        button.disabled = state.originalDisabled;
        button.classList.remove('loading');
        this.loadingStates.delete(loadingId);
      }
    }
  }

  // Setup form loading
  setupFormLoading() {
    document.addEventListener('submit', (e) => {
      const form = e.target;
      this.setFormLoading(form, true);
    });
  }

  // Set form loading state
  setFormLoading(form, loading) {
    const loadingId = `form_${Date.now()}`;
    
    if (loading) {
      // Disable all inputs
      const inputs = form.querySelectorAll('input, button, select, textarea');
      inputs.forEach(input => {
        input.disabled = true;
      });
      
      // Show loading overlay
      const overlay = document.createElement('div');
      overlay.className = 'form-loading-overlay';
      overlay.innerHTML = `
        <div class="loading-spinner">
          <i class="fas fa-spinner fa-spin"></i>
          <span>Processing...</span>
        </div>
      `;
      
      form.appendChild(overlay);
      this.loadingStates.set(loadingId, { element: form, overlay });
      
    } else {
      // Restore form state
      const state = Array.from(this.loadingStates.values()).find(s => s.element === form);
      if (state) {
        const inputs = form.querySelectorAll('input, button, select, textarea');
        inputs.forEach(input => {
          input.disabled = false;
        });
        
        if (state.overlay) {
          state.overlay.remove();
        }
        
        this.loadingStates.delete(loadingId);
      }
    }
  }

  // Setup page loading
  setupPageLoading() {
    // Show loading on navigation
    window.addEventListener('beforeunload', () => {
      this.showPageLoading();
    });
    
    // Hide loading on load
    window.addEventListener('load', () => {
      this.hidePageLoading();
    });
  }

  // Show page loading
  showPageLoading() {
    let loader = document.querySelector('.page-loader');
    
    if (!loader) {
      loader = document.createElement('div');
      loader.className = 'page-loader';
      loader.innerHTML = `
        <div class="page-loader-content">
          <div class="loading-spinner">
            <i class="fas fa-spinner fa-spin"></i>
          </div>
          <div class="loading-text">Loading...</div>
        </div>
      `;
      document.body.appendChild(loader);
    }
    
    loader.style.display = 'flex';
  }

  // Hide page loading
  hidePageLoading() {
    const loader = document.querySelector('.page-loader');
    if (loader) {
      loader.style.display = 'none';
    }
  }

  // Setup progress indicators
  setupProgressIndicators() {
    // Export progress
    this.setupExportProgress();
    
    // Upload progress
    this.setupUploadProgress();
    
    // Generation progress
    this.setupGenerationProgress();
  }

  // Setup export progress
  setupExportProgress() {
    // Listen for export events
    document.addEventListener('exportStarted', (e) => {
      this.showExportProgress(e.detail);
    });
    
    document.addEventListener('exportProgress', (e) => {
      this.updateExportProgress(e.detail.id, e.detail.progress);
    });
    
    document.addEventListener('exportCompleted', (e) => {
      this.hideExportProgress(e.detail.id);
    });
  }

  // Show export progress
  showExportProgress(detail) {
    const progressId = `export_${detail.id || Date.now()}`;
    
    const progressContainer = document.createElement('div');
    progressContainer.className = 'progress-container';
    progressContainer.id = progressId;
    progressContainer.innerHTML = `
      <div class="progress-header">
        <i class="fas fa-download"></i>
        <span>Exporting ${detail.format || 'file'}...</span>
        <button class="progress-cancel" data-id="${progressId}">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" style="width: 0%"></div>
      </div>
      <div class="progress-details">
        <span class="progress-percentage">0%</span>
        <span class="progress-size">0 MB</span>
      </div>
    `;
    
    // Add to container
    let container = document.querySelector('.progress-panel');
    if (!container) {
      container = document.createElement('div');
      container.className = 'progress-panel';
      document.body.appendChild(container);
    }
    
    container.appendChild(progressContainer);
    
    // Store progress state
    this.progressBars.set(progressId, {
      element: progressContainer,
      startTime: Date.now(),
      detail: detail
    });
    
    // Setup cancel button
    const cancelBtn = progressContainer.querySelector('.progress-cancel');
    cancelBtn.addEventListener('click', () => {
      this.cancelProgress(progressId);
    });
    
    // Show panel
    container.style.display = 'block';
  }

  // Update export progress
  updateExportProgress(progressId, progress) {
    const progressBar = this.progressBars.get(progressId);
    if (progressBar) {
      const fill = progressBar.element.querySelector('.progress-fill');
      const percentage = progressBar.element.querySelector('.progress-percentage');
      const size = progressBar.element.querySelector('.progress-size');
      
      fill.style.width = `${progress}%`;
      percentage.textContent = `${Math.round(progress)}%`;
      
      // Calculate estimated size
      const elapsed = Date.now() - progressBar.startTime;
      const estimatedSize = (progress / 100) * 10; // Example: 10MB total
      size.textContent = `${estimatedSize.toFixed(1)} MB`;
      
      // Complete if 100%
      if (progress >= 100) {
        setTimeout(() => {
          this.hideExportProgress(progressId);
        }, 1000);
      }
    }
  }

  // Hide export progress
  hideExportProgress(progressId) {
    const progressBar = this.progressBars.get(progressId);
    if (progressBar) {
      progressBar.element.remove();
      this.progressBars.delete(progressId);
      
      // Hide panel if no more progress bars
      const container = document.querySelector('.progress-panel');
      if (container && container.children.length === 0) {
        container.style.display = 'none';
      }
    }
  }

  // Cancel progress
  cancelProgress(progressId) {
    const progressBar = this.progressBars.get(progressId);
    if (progressBar) {
      // Dispatch cancel event
      document.dispatchEvent(new CustomEvent('progressCancelled', {
        detail: { id: progressId }
      }));
      
      this.hideExportProgress(progressId);
    }
  }

  // Setup upload progress
  setupUploadProgress() {
    // Similar to export progress but for uploads
    document.addEventListener('uploadStarted', (e) => {
      this.showUploadProgress(e.detail);
    });
  }

  // Show upload progress
  showUploadProgress(detail) {
    // Implementation similar to export progress
    console.log('Upload progress:', detail);
  }

  // Setup generation progress
  setupGenerationProgress() {
    // Listen for generation events
    document.addEventListener('generationStarted', (e) => {
      this.showGenerationProgress(e.detail);
    });
    
    document.addEventListener('generationProgress', (e) => {
      this.updateGenerationProgress(e.detail.id, e.detail.progress, e.detail.status);
    });
    
    document.addEventListener('generationCompleted', (e) => {
      this.hideGenerationProgress(e.detail.id);
    });
  }

  // Show generation progress
  showGenerationProgress(detail) {
    const progressId = `generation_${detail.id || Date.now()}`;
    
    const progressContainer = document.createElement('div');
    progressContainer.className = 'progress-container generation-progress';
    progressContainer.id = progressId;
    progressContainer.innerHTML = `
      <div class="progress-header">
        <i class="fas fa-chart-line"></i>
        <span>Generating chart...</span>
        <button class="progress-cancel" data-id="${progressId}">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" style="width: 0%"></div>
      </div>
      <div class="progress-details">
        <span class="progress-percentage">0%</span>
        <span class="progress-status">Initializing...</span>
      </div>
    `;
    
    // Add to container
    let container = document.querySelector('.progress-panel');
    if (!container) {
      container = document.createElement('div');
      container.className = 'progress-panel';
      document.body.appendChild(container);
    }
    
    container.appendChild(progressContainer);
    
    // Store progress state
    this.progressBars.set(progressId, {
      element: progressContainer,
      startTime: Date.now(),
      detail: detail
    });
    
    // Show panel
    container.style.display = 'block';
  }

  // Update generation progress
  updateGenerationProgress(progressId, progress, status) {
    const progressBar = this.progressBars.get(progressId);
    if (progressBar) {
      const fill = progressBar.element.querySelector('.progress-fill');
      const percentage = progressBar.element.querySelector('.progress-percentage');
      const statusText = progressBar.element.querySelector('.progress-status');
      
      fill.style.width = `${progress}%`;
      percentage.textContent = `${Math.round(progress)}%`;
      statusText.textContent = status || 'Processing...';
      
      // Complete if 100%
      if (progress >= 100) {
        setTimeout(() => {
          this.hideGenerationProgress(progressId);
        }, 1000);
      }
    }
  }

  // Hide generation progress
  hideGenerationProgress(progressId) {
    const progressBar = this.progressBars.get(progressId);
    if (progressBar) {
      progressBar.element.remove();
      this.progressBars.delete(progressId);
      
      // Hide panel if no more progress bars
      const container = document.querySelector('.progress-panel');
      if (container && container.children.length === 0) {
        container.style.display = 'none';
      }
    }
  }

  // Setup error handling
  setupErrorHandling() {
    // Global error handler
    window.addEventListener('error', (e) => {
      this.handleGlobalError(e);
    });
    
    // Promise rejection handler
    window.addEventListener('unhandledrejection', (e) => {
      this.handlePromiseRejection(e);
    });
    
    // Form error handler
    document.addEventListener('submitError', (e) => {
      this.handleFormError(e.detail);
    });
  }

  // Handle global error
  handleGlobalError(e) {
    const errorId = `error_${Date.now()}`;
    
    const errorMessage = {
      id: errorId,
      message: this.getErrorMessage(e.error),
      type: 'error',
      timestamp: Date.now(),
      context: 'global'
    };
    
    this.showError(errorMessage);
    this.logError(e);
  }

  // Handle promise rejection
  handlePromiseRejection(e) {
    const errorId = `promise_${Date.now()}`;
    
    const errorMessage = {
      id: errorId,
      message: this.getErrorMessage(e.reason),
      type: 'error',
      timestamp: Date.now(),
      context: 'promise'
    };
    
    this.showError(errorMessage);
    this.logError(e);
  }

  // Handle form error
  handleFormError(detail) {
    const errorId = `form_${Date.now()}`;
    
    const errorMessage = {
      id: errorId,
      message: this.getFormErrorMessage(detail),
      type: 'error',
      timestamp: Date.now(),
      context: 'form',
      formId: detail.formId,
      field: detail.field
    };
    
    this.showError(errorMessage);
    
    // Focus error field
    if (detail.field) {
      const field = document.querySelector(`[name="${detail.field}"], #${detail.field}`);
      if (field) {
        field.focus();
        field.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }

  // Get error message
  getErrorMessage(error) {
    if (!error) return 'An unknown error occurred';
    
    // Network errors
    if (error.name === 'NetworkError' || error.message.includes('network')) {
      return 'Network connection error. Please check your internet connection and try again.';
    }
    
    // Validation errors
    if (error.name === 'ValidationError') {
      return error.message || 'Invalid data provided. Please check your input and try again.';
    }
    
    // Permission errors
    if (error.name === 'PermissionError') {
      return 'Permission denied. You do not have access to perform this action.';
    }
    
    // Timeout errors
    if (error.name === 'TimeoutError') {
      return 'Request timed out. Please try again.';
    }
    
    // Server errors
    if (error.status >= 500) {
      return 'Server error occurred. Please try again later.';
    }
    
    // Client errors
    if (error.status >= 400) {
      return this.getClientErrorMessage(error.status);
    }
    
    // Default error
    return error.message || 'An error occurred. Please try again.';
  }

  // Get client error message
  getClientErrorMessage(status) {
    const messages = {
      400: 'Bad request. Please check your input and try again.',
      401: 'Authentication required. Please log in and try again.',
      403: 'Access denied. You do not have permission to perform this action.',
      404: 'Resource not found. The requested item does not exist.',
      409: 'Conflict. The item already exists or has been modified.',
      422: 'Validation error. Please check your input and try again.',
      429: 'Too many requests. Please wait and try again.'
    };
    
    return messages[status] || 'Request failed. Please try again.';
  }

  // Get form error message
  getFormErrorMessage(detail) {
    const fieldErrors = {
      'required': 'This field is required.',
      'email': 'Please enter a valid email address.',
      'password': 'Password must be at least 8 characters long.',
      'confirm': 'Passwords do not match.',
      'file_size': 'File size exceeds the maximum allowed size.',
      'file_type': 'Invalid file type. Please upload a valid file.'
    };
    
    if (detail.field && detail.type) {
      return fieldErrors[detail.type] || 'Invalid input.';
    }
    
    return detail.message || 'Form submission failed. Please check your input and try again.';
  }

  // Show error
  showError(error) {
    const errorContainer = document.createElement('div');
    errorContainer.className = 'error-notification';
    errorContainer.id = error.id;
    errorContainer.innerHTML = `
      <div class="error-header">
        <i class="fas fa-exclamation-triangle"></i>
        <span class="error-title">Error</span>
        <button class="error-close" data-id="${error.id}">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="error-message">${error.message}</div>
      <div class="error-actions">
        <button class="error-retry" data-id="${error.id}">Retry</button>
        <button class="error-report" data-id="${error.id}">Report Issue</button>
      </div>
    `;
    
    // Add to container
    let container = document.querySelector('.notification-panel');
    if (!container) {
      container = document.createElement('div');
      container.className = 'notification-panel';
      document.body.appendChild(container);
    }
    
    container.appendChild(errorContainer);
    
    // Store error
    this.errorMessages.set(error.id, error);
    
    // Setup event handlers
    this.setupErrorHandlers(errorContainer, error);
    
    // Show container
    container.style.display = 'block';
    
    // Auto-hide after 10 seconds
    setTimeout(() => {
      this.hideError(error.id);
    }, 10000);
  }

  // Setup error handlers
  setupErrorHandlers(container, error) {
    const closeBtn = container.querySelector('.error-close');
    const retryBtn = container.querySelector('.error-retry');
    const reportBtn = container.querySelector('.error-report');
    
    closeBtn.addEventListener('click', () => {
      this.hideError(error.id);
    });
    
    retryBtn.addEventListener('click', () => {
      this.retryAction(error);
    });
    
    reportBtn.addEventListener('click', () => {
      this.reportError(error);
    });
  }

  // Hide error
  hideError(errorId) {
    const errorContainer = document.getElementById(errorId);
    if (errorContainer) {
      errorContainer.remove();
      this.errorMessages.delete(errorId);
      
      // Hide panel if no more notifications
      const container = document.querySelector('.notification-panel');
      if (container && container.children.length === 0) {
        container.style.display = 'none';
      }
    }
  }

  // Retry action
  retryAction(error) {
    // Dispatch retry event
    document.dispatchEvent(new CustomEvent('retryAction', {
      detail: error
    }));
    
    this.hideError(error.id);
  }

  // Report error
  reportError(error) {
    // Send error report
    this.sendErrorReport(error);
    
    // Show confirmation
    this.showNotification('Error report sent. Thank you for your feedback.', 'success');
  }

  // Send error report
  sendErrorReport(error) {
    // Implementation would send error to server
    console.log('Error report:', error);
  }

  // Setup success confirmations
  setupSuccessConfirmations() {
    // Form success
    document.addEventListener('submitSuccess', (e) => {
      this.showSuccessConfirmation(e.detail);
    });
    
    // Action success
    document.addEventListener('actionSuccess', (e) => {
      this.showSuccessConfirmation(e.detail);
    });
  }

  // Show success confirmation
  showSuccessConfirmation(detail) {
    const successId = `success_${Date.now()}`;
    
    const successContainer = document.createElement('div');
    successContainer.className = 'success-notification';
    successContainer.id = successId;
    successContainer.innerHTML = `
      <div class="success-header">
        <i class="fas fa-check-circle"></i>
        <span class="success-title">Success</span>
        <button class="success-close" data-id="${successId}">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="success-message">${detail.message || 'Action completed successfully.'}</div>
      ${detail.action ? `<div class="success-action">
        <button class="success-action-btn" data-action="${detail.action}">${detail.actionText || 'Continue'}</button>
      </div>` : ''}
    `;
    
    // Add to container
    let container = document.querySelector('.notification-panel');
    if (!container) {
      container = document.createElement('div');
      container.className = 'notification-panel';
      document.body.appendChild(container);
    }
    
    container.appendChild(successContainer);
    
    // Store success
    this.successMessages.set(successId, detail);
    
    // Setup event handlers
    this.setupSuccessHandlers(successContainer, detail);
    
    // Show container
    container.style.display = 'block';
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      this.hideSuccess(successId);
    }, 5000);
  }

  // Setup success handlers
  setupSuccessHandlers(container, detail) {
    const closeBtn = container.querySelector('.success-close');
    const actionBtn = container.querySelector('.success-action-btn');
    
    closeBtn.addEventListener('click', () => {
      this.hideSuccess(container.id);
    });
    
    if (actionBtn) {
      actionBtn.addEventListener('click', () => {
        this.executeSuccessAction(detail);
        this.hideSuccess(container.id);
      });
    }
  }

  // Hide success
  hideSuccess(successId) {
    const successContainer = document.getElementById(successId);
    if (successContainer) {
      successContainer.remove();
      this.successMessages.delete(successId);
      
      // Hide panel if no more notifications
      const container = document.querySelector('.notification-panel');
      if (container && container.children.length === 0) {
        container.style.display = 'none';
      }
    }
  }

  // Execute success action
  executeSuccessAction(detail) {
    if (detail.action) {
      // Dispatch action event
      document.dispatchEvent(new CustomEvent('successAction', {
        detail: detail
      }));
    }
  }

  // Setup feedback timing
  setupFeedbackTiming() {
    // Immediate feedback (0-100ms)
    // Short feedback (100-500ms)
    // Medium feedback (500ms-2s)
    // Long feedback (2s+)
  }

  // Setup contextual messages
  setupContextualMessages() {
    // Help tooltips
    this.setupHelpTooltips();
    
    // Contextual hints
    this.setupContextualHints();
    
    // Progressive disclosure
    this.setupProgressiveDisclosure();
  }

  // Setup help tooltips
  setupHelpTooltips() {
    document.querySelectorAll('[data-help]').forEach(element => {
      this.addHelpTooltip(element);
    });
  }

  // Add help tooltip
  addHelpTooltip(element) {
    const helpText = element.dataset.help;
    
    const tooltip = document.createElement('div');
    tooltip.className = 'help-tooltip';
    tooltip.textContent = helpText;
    
    element.appendChild(tooltip);
    
    // Show on hover/focus
    element.addEventListener('mouseenter', () => {
      tooltip.classList.add('visible');
    });
    
    element.addEventListener('mouseleave', () => {
      tooltip.classList.remove('visible');
    });
    
    element.addEventListener('focus', () => {
      tooltip.classList.add('visible');
    });
    
    element.addEventListener('blur', () => {
      tooltip.classList.remove('visible');
    });
  }

  // Setup contextual hints
  setupContextualHints() {
    // Show hints based on user context
    this.showContextualHints();
  }

  // Show contextual hints
  showContextualHints() {
    const currentPath = window.location.pathname;
    
    // Path-specific hints
    const hints = {
      '/create': 'Tip: Start with clean, well-structured data for best results.',
      '/import': 'Tip: CSV files work best with clear headers in the first row.',
      '/export': 'Tip: PNG is best for presentations, SVG for websites.',
      '/settings': 'Tip: Changes are saved automatically.'
    };
    
    const hint = hints[currentPath];
    if (hint) {
      this.showContextualHint(hint);
    }
  }

  // Show contextual hint
  showContextualHint(message) {
    const hint = document.createElement('div');
    hint.className = 'contextual-hint';
    hint.innerHTML = `
      <i class="fas fa-lightbulb"></i>
      <span>${message}</span>
      <button class="hint-dismiss">
        <i class="fas fa-times"></i>
      </button>
    `;
    
    // Add to page
    const container = document.querySelector('.main-content') || document.body;
    container.appendChild(hint);
    
    // Setup dismiss
    const dismissBtn = hint.querySelector('.hint-dismiss');
    dismissBtn.addEventListener('click', () => {
      hint.remove();
    });
    
    // Auto-dismiss after 10 seconds
    setTimeout(() => {
      hint.remove();
    }, 10000);
  }

  // Setup progressive disclosure
  setupProgressiveDisclosure() {
    // Show advanced options progressively
    document.querySelectorAll('[data-advanced]').forEach(element => {
      this.setupAdvancedOptions(element);
    });
  }

  // Setup advanced options
  setupAdvancedOptions(element) {
    const toggle = document.createElement('button');
    toggle.className = 'advanced-toggle';
    toggle.innerHTML = `
      <i class="fas fa-cog"></i>
      Advanced Options
    `;
    
    element.parentNode.insertBefore(toggle, element);
    
    let isExpanded = false;
    
    toggle.addEventListener('click', () => {
      isExpanded = !isExpanded;
      element.style.display = isExpanded ? 'block' : 'none';
      toggle.innerHTML = `
        <i class="fas fa-cog"></i>
        ${isExpanded ? 'Hide' : 'Show'} Advanced Options
      `;
    });
  }

  // Setup feedback history
  setupFeedbackHistory() {
    // Track all feedback for analytics
    this.trackFeedbackHistory();
  }

  // Track feedback history
  trackFeedbackHistory() {
    // Listen to all feedback events
    document.addEventListener('click', (e) => {
      this.addToHistory('click', e.target);
    });
    
    document.addEventListener('submit', (e) => {
      this.addToHistory('submit', e.target);
    });
  }

  // Add to history
  addToHistory(type, element) {
    const entry = {
      type: type,
      element: element.tagName,
      timestamp: Date.now(),
      url: window.location.href
    };
    
    this.feedbackHistory.push(entry);
    
    // Limit history size
    if (this.feedbackHistory.length > this.maxHistorySize) {
      this.feedbackHistory.shift();
    }
  }

  // Setup accessibility
  setupAccessibility() {
    // Screen reader announcements
    this.setupScreenReaderAnnouncements();
    
    // High contrast mode
    this.setupHighContrastMode();
    
    // Reduced motion
    this.setupReducedMotion();
  }

  // Setup screen reader announcements
  setupScreenReaderAnnouncements() {
    // Create live region
    const liveRegion = document.createElement('div');
    liveRegion.className = 'sr-only';
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.id = 'feedback-announcements';
    
    document.body.appendChild(liveRegion);
    
    this.announcementsElement = liveRegion;
  }

  // Announce to screen readers
  announce(message, priority = 'polite') {
    if (this.announcementsElement) {
      this.announcementsElement.setAttribute('aria-live', priority);
      this.announcementsElement.textContent = message;
      
      // Clear after announcement
      setTimeout(() => {
        this.announcementsElement.textContent = '';
      }, 1000);
    }
  }

  // Setup high contrast mode
  setupHighContrastMode() {
    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    
    mediaQuery.addEventListener('change', (e) => {
      if (e.matches) {
        document.body.classList.add('high-contrast');
      } else {
        document.body.classList.remove('high-contrast');
      }
    });
    
    // Initial check
    if (mediaQuery.matches) {
      document.body.classList.add('high-contrast');
    }
  }

  // Setup reduced motion
  setupReducedMotion() {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    mediaQuery.addEventListener('change', (e) => {
      if (e.matches) {
        document.body.classList.add('reduced-motion');
      } else {
        document.body.classList.remove('reduced-motion');
      }
    });
    
    // Initial check
    if (mediaQuery.matches) {
      document.body.classList.add('reduced-motion');
    }
  }

  // Utility methods
  getButtonType(button) {
    if (button.classList.contains('btn-primary')) return 'primary';
    if (button.classList.contains('btn-secondary')) return 'secondary';
    if (button.classList.contains('btn-danger')) return 'danger';
    if (button.classList.contains('btn-success')) return 'success';
    return 'default';
  }

  trackUserAction(action, details) {
    // Analytics tracking
    if (window.analytics) {
      window.analytics.trackCustomEvent(action, details);
    }
    
    // Add to history
    this.addToHistory(action, details);
  }

  logError(error) {
    // Error logging
    console.error('System Error:', error);
    
    // Send to error tracking service
    if (window.errorTracking) {
      window.errorTracking.captureException(error);
    }
  }

  showNotification(message, type) {
    // Use existing notification system or create fallback
    if (window.uiEnhancements && window.uiEnhancements.showNotification) {
      window.uiEnhancements.showNotification(message, type);
    } else {
      console.log(`${type.toUpperCase()}: ${message}`);
    }
  }

  // Public methods
  getFeedbackHistory() {
    return [...this.feedbackHistory];
  }

  clearFeedbackHistory() {
    this.feedbackHistory = [];
  }

  getActiveLoadingStates() {
    return Array.from(this.loadingStates.values());
  }

  getActiveProgressBars() {
    return Array.from(this.progressBars.values());
  }
}

// Initialize system feedback manager
document.addEventListener('DOMContentLoaded', () => {
  window.systemFeedbackManager = new SystemFeedbackManager();
});

export { SystemFeedbackManager };

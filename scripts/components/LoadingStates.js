// Loading States Component
// Comprehensive loading and error state management system

class LoadingStates {
  constructor() {
    this.loadingStates = new Map();
    this.errorStates = new Map();
    this.successStates = new Map();
    this.init();
  }

  init() {
    this.setupGlobalLoadingHandlers();
    this.createLoadingTemplates();
    this.createErrorTemplates();
    this.createSuccessTemplates();
    this.setupAccessibilityFeatures();
  }

  // ===================================
  // PAGE LOADING STATES
  // ===================================
  
  showPageLoading(containerId, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const loadingId = `page-loading-${Date.now()}`;
    const loadingState = {
      id: loadingId,
      type: 'page',
      container: containerId,
      options: { ...options }
    };

    this.loadingStates.set(loadingId, loadingState);

    // Create skeleton screen
    const skeleton = this.createSkeletonScreen(options);
    
    // Store original content
    const originalContent = container.innerHTML;
    container.dataset.originalContent = originalContent;
    
    // Show loading state
    container.innerHTML = skeleton;
    container.classList.add('loading-state');

    return loadingId;
  }

  createSkeletonScreen(options = {}) {
    const { sections = 1, type = 'default' } = options;
    
    let skeletonHTML = '<div class="skeleton-container">';
    
    switch (type) {
      case 'templates':
        skeletonHTML += this.createTemplatesSkeleton(sections);
        break;
      case 'generator':
        skeletonHTML += this.createGeneratorSkeleton();
        break;
      case 'dashboard':
        skeletonHTML += this.createDashboardSkeleton();
        break;
      default:
        skeletonHTML += this.createDefaultSkeleton(sections);
    }
    
    skeletonHTML += '</div>';
    return skeletonHTML;
  }

  createDefaultSkeleton(sections) {
    return `
      <div class="skeleton-header">
        <div class="skeleton-title"></div>
        <div class="skeleton-subtitle"></div>
      </div>
      ${Array.from({ length: sections }, (_, i) => `
        <div class="skeleton-section" key="${i}">
          <div class="skeleton-line long"></div>
          <div class="skeleton-line medium"></div>
          <div class="skeleton-line short"></div>
        </div>
      `).join('')}
    `;
  }

  createTemplatesSkeleton(count) {
    return `
      <div class="skeleton-filters">
        <div class="skeleton-filter"></div>
        <div class="skeleton-filter"></div>
        <div class="skeleton-filter"></div>
      </div>
      <div class="skeleton-grid">
        ${Array.from({ length: count }, (_, i) => `
          <div class="skeleton-card" key="${i}">
            <div class="skeleton-image"></div>
            <div class="skeleton-card-content">
              <div class="skeleton-line medium"></div>
              <div class="skeleton-line short"></div>
              <div class="skeleton-line short"></div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  createGeneratorSkeleton() {
    return `
      <div class="skeleton-sidebar">
        <div class="skeleton-section">
          <div class="skeleton-line medium"></div>
          <div class="skeleton-line short"></div>
        </div>
        <div class="skeleton-section">
          <div class="skeleton-line medium"></div>
          <div class="skeleton-line short"></div>
        </div>
      </div>
      <div class="skeleton-main">
        <div class="skeleton-chart"></div>
        <div class="skeleton-prompt">
          <div class="skeleton-textarea"></div>
          <div class="skeleton-button"></div>
        </div>
      </div>
    `;
  }

  createDashboardSkeleton() {
    return `
      <div class="skeleton-stats-grid">
        ${Array.from({ length: 4 }, (_, i) => `
          <div class="skeleton-stat-card" key="${i}">
            <div class="skeleton-icon"></div>
            <div class="skeleton-value"></div>
            <div class="skeleton-label"></div>
          </div>
        `).join('')}
      </div>
      <div class="skeleton-chart-container">
        <div class="skeleton-chart-large"></div>
      </div>
    `;
  }

  showSectionLoading(containerId, message = 'Loading...') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const loadingId = `section-loading-${Date.now()}`;
    
    const loadingHTML = `
      <div class="section-loading" role="status" aria-live="polite">
        <div class="loading-spinner">
          <div class="spinner"></div>
        </div>
        <div class="loading-message">${message}</div>
      </div>
    `;

    container.innerHTML = loadingHTML;
    container.classList.add('section-loading-state');

    return loadingId;
  }

  showProgressiveLoading(containerId, steps) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const loadingId = `progressive-loading-${Date.now()}`;
    
    let progressHTML = `
      <div class="progressive-loading" role="status" aria-live="polite">
        <div class="progress-header">
          <h3>Loading Content</h3>
          <div class="progress-percentage">0%</div>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: 0%"></div>
        </div>
        <div class="progress-steps">
    `;

    steps.forEach((step, index) => {
      progressHTML += `
        <div class="progress-step" data-step="${index}">
          <div class="step-indicator">
            <div class="step-circle">
              <i class="fas fa-${step.icon}"></i>
            </div>
            <div class="step-line"></div>
          </div>
          <div class="step-content">
            <div class="step-title">${step.title}</div>
            <div class="step-description">${step.description}</div>
          </div>
        </div>
      `;
    });

    progressHTML += `
        </div>
      </div>
    `;

    container.innerHTML = progressHTML;
    container.classList.add('progressive-loading-state');

    return loadingId;
  }

  // ===================================
  // AI GENERATION STATES
  // ===================================

  showAIGeneration(containerId, options = {}) {
    const {
      steps = [
        { title: 'Analyzing Request', icon: 'brain', duration: 2000 },
        { title: 'Processing Data', icon: 'database', duration: 3000 },
        { title: 'Generating Chart', icon: 'chart-line', duration: 4000 },
        { title: 'Applying Styles', icon: 'palette', duration: 2000 }
      ],
      onCancel = null,
      estimatedTime = 11000
    } = options;

    const container = document.getElementById(containerId);
    if (!container) return;

    const generationId = `ai-generation-${Date.now()}`;
    
    const generationHTML = `
      <div class="ai-generation-container" role="status" aria-live="polite">
        <div class="generation-header">
          <div class="generation-title">
            <i class="fas fa-magic"></i>
            <span>AI is Creating Your Chart</span>
          </div>
          <div class="generation-time">
            <i class="fas fa-clock"></i>
            <span class="time-remaining">~${Math.ceil(estimatedTime / 1000)}s remaining</span>
          </div>
        </div>

        <div class="generation-progress">
          <div class="progress-circle">
            <svg class="progress-svg" viewBox="0 0 100 100">
              <circle class="progress-background" cx="50" cy="50" r="45"></circle>
              <circle class="progress-fill" cx="50" cy="50" r="45"></circle>
            </svg>
            <div class="progress-text">
              <span class="progress-percentage">0%</span>
            </div>
          </div>
        </div>

        <div class="generation-steps">
          ${steps.map((step, index) => `
            <div class="generation-step" data-step="${index}">
              <div class="step-indicator">
                <div class="step-circle">
                  <i class="fas fa-${step.icon}"></i>
                </div>
                <div class="step-line"></div>
              </div>
              <div class="step-content">
                <div class="step-title">${step.title}</div>
                <div class="step-status">Waiting...</div>
              </div>
            </div>
          `).join('')}
        </div>

        <div class="generation-actions">
          <button class="cancel-generation-btn" aria-label="Cancel generation">
            <i class="fas fa-times"></i>
            Cancel
          </button>
        </div>

        <div class="generation-tips">
          <div class="tip-title">
            <i class="fas fa-lightbulb"></i>
            Pro Tip
          </div>
          <div class="tip-content">
            Be specific with your data descriptions for better results. Try including column names and data types.
          </div>
        </div>
      </div>
    `;

    container.innerHTML = generationHTML;
    container.classList.add('ai-generation-state');

    // Setup generation animation
    this.animateAIGeneration(generationId, steps, estimatedTime, onCancel);

    return generationId;
  }

  animateAIGeneration(generationId, steps, estimatedTime, onCancel) {
    let currentStep = 0;
    let progress = 0;
    let startTime = Date.now();

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      progress = Math.min((elapsed / estimatedTime) * 100, 100);

      // Update progress circle
      const progressCircle = document.querySelector('.progress-fill');
      const progressText = document.querySelector('.progress-percentage');
      const timeRemaining = document.querySelector('.time-remaining');

      if (progressCircle) {
        const circumference = 2 * Math.PI * 45;
        const offset = circumference - (progress / 100) * circumference;
        progressCircle.style.strokeDashoffset = offset;
      }

      if (progressText) {
        progressText.textContent = `${Math.round(progress)}%`;
      }

      if (timeRemaining) {
        const remaining = Math.max(0, Math.ceil((estimatedTime - elapsed) / 1000));
        timeRemaining.textContent = `~${remaining}s remaining`;
      }

      // Update steps
      const stepProgress = (progress / 100) * steps.length;
      const activeStepIndex = Math.floor(stepProgress);
      
      document.querySelectorAll('.generation-step').forEach((step, index) => {
        const stepStatus = step.querySelector('.step-status');
        const stepCircle = step.querySelector('.step-circle');
        
        if (index < activeStepIndex) {
          stepStatus.textContent = 'Completed';
          stepCircle.classList.add('completed');
        } else if (index === activeStepIndex) {
          stepStatus.textContent = 'Processing...';
          stepCircle.classList.add('active');
        } else {
          stepStatus.textContent = 'Waiting...';
          stepCircle.classList.remove('active', 'completed');
        }
      });

      if (progress < 100) {
        requestAnimationFrame(updateProgress);
      } else {
        this.completeAIGeneration(generationId);
      }
    };

    // Setup cancel button
    const cancelBtn = document.querySelector('.cancel-generation-btn');
    if (cancelBtn && onCancel) {
      cancelBtn.addEventListener('click', () => {
        this.cancelAIGeneration(generationId);
        onCancel();
      });
    }

    // Start animation
    requestAnimationFrame(updateProgress);
  }

  completeAIGeneration(generationId) {
    const container = document.querySelector('.ai-generation-container');
    if (!container) return;

    container.innerHTML = `
      <div class="generation-complete">
        <div class="success-animation">
          <div class="success-circle">
            <i class="fas fa-check"></i>
          </div>
        </div>
        <h3>Chart Generated Successfully!</h3>
        <p>Your AI-powered chart is ready to customize and export.</p>
        <div class="generation-complete-actions">
          <button class="view-chart-btn primary">
            <i class="fas fa-eye"></i>
            View Chart
          </button>
          <button class="customize-btn secondary">
            <i class="fas fa-sliders-h"></i>
            Customize
          </button>
        </div>
      </div>
    `;

    // Announce to screen readers
    this.announceToScreenReader('Chart generation completed successfully');
  }

  cancelAIGeneration(generationId) {
    const container = document.querySelector('.ai-generation-container');
    if (!container) return;

    container.innerHTML = `
      <div class="generation-cancelled">
        <div class="cancelled-animation">
          <div class="cancelled-circle">
            <i class="fas fa-times"></i>
          </div>
        </div>
        <h3>Generation Cancelled</h3>
        <p>The chart generation was cancelled. You can try again anytime.</p>
        <div class="generation-cancelled-actions">
          <button class="try-again-btn primary">
            <i class="fas fa-redo"></i>
            Try Again
          </button>
          <button class="close-btn secondary">
            <i class="fas fa-times"></i>
            Close
          </button>
        </div>
      </div>
    `;

    // Announce to screen readers
    this.announceToScreenReader('Chart generation was cancelled');
  }

  // ===================================
  // ERROR STATES
  // ===================================

  showError(containerId, error, options = {}) {
    const {
      type = 'default',
      retryAction = null,
      customMessage = null
    } = options;

    const container = document.getElementById(containerId);
    if (!container) return;

    const errorId = `error-${Date.now()}`;
    this.errorStates.set(errorId, { container: containerId, error, options });

    let errorHTML = '';

    switch (type) {
      case 'network':
        errorHTML = this.createNetworkError(error, retryAction);
        break;
      case 'ai-generation':
        errorHTML = this.createAIGenerationError(error, retryAction);
        break;
      case 'validation':
        errorHTML = this.createValidationError(error);
        break;
      case 'empty':
        errorHTML = this.createEmptyState(options);
        break;
      default:
        errorHTML = this.createDefaultError(error, retryAction, customMessage);
    }

    container.innerHTML = errorHTML;
    container.classList.add('error-state');
    container.setAttribute('role', 'alert');
    container.setAttribute('aria-live', 'assertive');

    return errorId;
  }

  createNetworkError(error, retryAction) {
    return `
      <div class="error-container network-error">
        <div class="error-illustration">
          <i class="fas fa-wifi"></i>
        </div>
        <h3>Connection Error</h3>
        <p>${error.message || 'Unable to connect to our servers. Please check your internet connection and try again.'}</p>
        <div class="error-actions">
          ${retryAction ? `
            <button class="retry-btn primary" onclick="${retryAction}">
              <i class="fas fa-redo"></i>
              Try Again
            </button>
          ` : ''}
          <button class="offline-btn secondary">
            <i class="fas fa-download"></i>
            Work Offline
          </button>
        </div>
        <div class="error-details">
          <details>
            <summary>Technical Details</summary>
            <pre>${error.stack || error.message || 'Unknown error'}</pre>
          </details>
        </div>
      </div>
    `;
  }

  createAIGenerationError(error, retryAction) {
    return `
      <div class="error-container ai-error">
        <div class="error-illustration">
          <i class="fas fa-robot"></i>
        </div>
        <h3>AI Generation Failed</h3>
        <p>${error.message || 'Our AI encountered an issue while generating your chart. Please try rephrasing your request or check your data format.'}</p>
        <div class="error-suggestions">
          <h4>Suggestions:</h4>
          <ul>
            <li>Be more specific about chart type and data</li>
            <li>Ensure your data is properly formatted</li>
            <li>Try simplifying your request</li>
            <li>Check for special characters in your data</li>
          </ul>
        </div>
        <div class="error-actions">
          ${retryAction ? `
            <button class="retry-btn primary" onclick="${retryAction}">
              <i class="fas fa-redo"></i>
              Try Again
            </button>
          ` : ''}
          <button class="modify-btn secondary">
            <i class="fas fa-edit"></i>
            Modify Request
          </button>
          <button class="template-btn secondary">
            <i class="fas fa-layer-group"></i>
            Use Template
          </button>
        </div>
      </div>
    `;
  }

  createValidationError(error) {
    return `
      <div class="error-container validation-error">
        <div class="error-illustration">
          <i class="fas fa-exclamation-triangle"></i>
        </div>
        <h3>Validation Error</h3>
        <p>${error.message || 'Please check your input and try again.'}</p>
        ${error.fields ? `
          <div class="validation-fields">
            <h4>Issues found:</h4>
            <ul>
              ${error.fields.map(field => `
                <li>
                  <strong>${field.name}:</strong> ${field.message}
                </li>
              `).join('')}
            </ul>
          </div>
        ` : ''}
        <div class="error-actions">
          <button class="fix-btn primary">
            <i class="fas fa-edit"></i>
            Fix Issues
          </button>
          <button class="clear-btn secondary">
            <i class="fas fa-eraser"></i>
            Clear Form
          </button>
        </div>
      </div>
    `;
  }

  createEmptyState(options = {}) {
    const {
      title = 'No Data Found',
      message = 'There\'s nothing to show here yet.',
      illustration = 'empty',
      actions = []
    } = options;

    return `
      <div class="empty-state">
        <div class="empty-illustration">
          <i class="fas fa-${this.getEmptyStateIcon(illustration)}"></i>
        </div>
        <h3>${title}</h3>
        <p>${message}</p>
        ${actions.length > 0 ? `
          <div class="empty-actions">
            ${actions.map(action => `
              <button class="${action.class || 'secondary'}" onclick="${action.onclick}">
                <i class="fas fa-${action.icon}"></i>
                ${action.label}
              </button>
            `).join('')}
          </div>
        ` : ''}
      </div>
    `;
  }

  createDefaultError(error, retryAction, customMessage) {
    return `
      <div class="error-container default-error">
        <div class="error-illustration">
          <i class="fas fa-exclamation-circle"></i>
        </div>
        <h3>Something Went Wrong</h3>
        <p>${customMessage || error.message || 'An unexpected error occurred. Please try again.'}</p>
        <div class="error-actions">
          ${retryAction ? `
            <button class="retry-btn primary" onclick="${retryAction}">
              <i class="fas fa-redo"></i>
              Try Again
            </button>
          ` : ''}
          <button class="support-btn secondary">
            <i class="fas fa-life-ring"></i>
            Contact Support
          </button>
        </div>
      </div>
    `;
  }

  getEmptyStateIcon(type) {
    const icons = {
      empty: 'inbox',
      search: 'search',
      charts: 'chart-bar',
      data: 'database',
      templates: 'layer-group',
      projects: 'folder-open'
    };
    return icons[type] || 'inbox';
  }

  // ===================================
  // SUCCESS STATES
  // ===================================

  showSuccess(containerId, options = {}) {
    const {
      type = 'default',
      title = 'Success!',
      message = 'Operation completed successfully.',
      actions = [],
      autoHide = 3000
    } = options;

    const container = document.getElementById(containerId);
    if (!container) return;

    const successId = `success-${Date.now()}`;
    this.successStates.set(successId, { container: containerId, options });

    let successHTML = '';

    switch (type) {
      case 'generation':
        successHTML = this.createGenerationSuccess(options);
        break;
      case 'export':
        successHTML = this.createExportSuccess(options);
        break;
      case 'save':
        successHTML = this.createSaveSuccess(options);
        break;
      case 'celebration':
        successHTML = this.createCelebrationSuccess(options);
        break;
      default:
        successHTML = this.createDefaultSuccess(options);
    }

    container.innerHTML = successHTML;
    container.classList.add('success-state');
    container.setAttribute('role', 'status');
    container.setAttribute('aria-live', 'polite');

    // Auto-hide if specified
    if (autoHide) {
      setTimeout(() => {
        this.hideSuccess(successId);
      }, autoHide);
    }

    return successId;
  }

  createGenerationSuccess(options) {
    return `
      <div class="success-container generation-success">
        <div class="success-animation">
          <div class="success-circle">
            <i class="fas fa-chart-line"></i>
          </div>
          <div class="success-particles"></div>
        </div>
        <h3>Chart Generated Successfully!</h3>
        <p>Your AI-powered chart is ready. You can now customize it further or export it in your preferred format.</p>
        <div class="success-stats">
          <div class="stat">
            <i class="fas fa-clock"></i>
            <span>${options.generationTime || '2.3s'}</span>
          </div>
          <div class="stat">
            <i class="fas fa-database"></i>
            <span>${options.dataPoints || '150'} data points</span>
          </div>
          <div class="stat">
            <i class="fas fa-palette"></i>
            <span>${options.colors || '5'} colors</span>
          </div>
        </div>
        <div class="success-actions">
          <button class="customize-btn primary">
            <i class="fas fa-sliders-h"></i>
            Customize
          </button>
          <button class="export-btn secondary">
            <i class="fas fa-download"></i>
            Export
          </button>
          <button class="share-btn secondary">
            <i class="fas fa-share-alt"></i>
            Share
          </button>
        </div>
      </div>
    `;
  }

  createExportSuccess(options) {
    return `
      <div class="success-container export-success">
        <div class="success-animation">
          <div class="success-circle">
            <i class="fas fa-download"></i>
          </div>
        </div>
        <h3>Export Completed!</h3>
        <p>Your chart has been exported as ${options.format || 'PNG'} and is ready to download.</p>
        <div class="export-details">
          <div class="detail">
            <span class="label">Format:</span>
            <span class="value">${options.format || 'PNG'}</span>
          </div>
          <div class="detail">
            <span class="label">Size:</span>
            <span class="value">${options.fileSize || '2.4 MB'}</span>
          </div>
          <div class="detail">
            <span class="label">Quality:</span>
            <span class="value">${options.quality || 'High'}</span>
          </div>
        </div>
        <div class="success-actions">
          <button class="download-btn primary">
            <i class="fas fa-download"></i>
            Download File
          </button>
          <button class="new-export-btn secondary">
            <i class="fas fa-plus"></i>
            New Export
          </button>
        </div>
      </div>
    `;
  }

  createSaveSuccess(options) {
    return `
      <div class="success-container save-success">
        <div class="success-animation">
          <div class="success-circle">
            <i class="fas fa-save"></i>
          </div>
        </div>
        <h3>Project Saved!</h3>
        <p>Your project "${options.projectName || 'Untitled Project'}" has been saved successfully.</p>
        <div class="save-details">
          <div class="detail">
            <span class="label">Location:</span>
            <span class="value">${options.location || 'Your Projects'}</span>
          </div>
          <div class="detail">
            <span class="label">Privacy:</span>
            <span class="value">${options.privacy || 'Private'}</span>
          </div>
        </div>
        <div class="success-actions">
          <button class="view-projects-btn primary">
            <i class="fas fa-folder"></i>
            View Projects
          </button>
          <button class="continue-btn secondary">
            <i class="fas fa-arrow-right"></i>
            Continue Working
          </button>
        </div>
      </div>
    `;
  }

  createCelebrationSuccess(options) {
    return `
      <div class="success-container celebration-success">
        <div class="celebration-animation">
          <div class="success-circle">
            <i class="fas fa-trophy"></i>
          </div>
          <div class="confetti"></div>
        </div>
        <h3>Congratulations!</h3>
        <p>${options.message || 'You\'ve completed your first chart! Keep up the great work.'}</p>
        <div class="achievement-badges">
          <div class="badge">
            <i class="fas fa-star"></i>
            <span>First Chart</span>
          </div>
          <div class="badge">
            <i class="fas fa-rocket"></i>
            <span>Quick Learner</span>
          </div>
        </div>
        <div class="success-actions">
          <button class="create-another-btn primary">
            <i class="fas fa-plus"></i>
            Create Another
          </button>
          <button class="share-achievement-btn secondary">
            <i class="fas fa-share"></i>
            Share Achievement
          </button>
        </div>
      </div>
    `;
  }

  createDefaultSuccess(options) {
    return `
      <div class="success-container default-success">
        <div class="success-animation">
          <div class="success-circle">
            <i class="fas fa-check"></i>
          </div>
        </div>
        <h3>${options.title || 'Success!'}</h3>
        <p>${options.message || 'Operation completed successfully.'}</p>
        ${options.actions ? `
          <div class="success-actions">
            ${options.actions.map(action => `
              <button class="${action.class || 'secondary'}" onclick="${action.onclick}">
                <i class="fas fa-${action.icon}"></i>
                ${action.label}
              </button>
            `).join('')}
          </div>
        ` : ''}
      </div>
    `;
  }

  // ===================================
  // UTILITY METHODS
  // ===================================

  hideLoading(loadingId) {
    const loadingState = this.loadingStates.get(loadingId);
    if (!loadingState) return;

    const container = document.getElementById(loadingState.container);
    if (container) {
      // Restore original content
      if (container.dataset.originalContent) {
        container.innerHTML = container.dataset.originalContent;
        delete container.dataset.originalContent;
      }
      container.classList.remove('loading-state');
    }

    this.loadingStates.delete(loadingId);
  }

  hideError(errorId) {
    const errorState = this.errorStates.get(errorId);
    if (!errorState) return;

    const container = document.getElementById(errorState.container);
    if (container) {
      container.classList.remove('error-state');
      container.removeAttribute('role');
      container.removeAttribute('aria-live');
    }

    this.errorStates.delete(errorId);
  }

  hideSuccess(successId) {
    const successState = this.successStates.get(successId);
    if (!successState) return;

    const container = document.getElementById(successState.container);
    if (container) {
      container.classList.remove('success-state');
      container.removeAttribute('role');
      container.removeAttribute('aria-live');
    }

    this.successStates.delete(successId);
  }

  clearAllStates(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Remove all state classes
    container.classList.remove('loading-state', 'error-state', 'success-state');
    
    // Remove ARIA attributes
    container.removeAttribute('role');
    container.removeAttribute('aria-live');
    container.removeAttribute('aria-atomic');
    
    // Clear stored states
    this.loadingStates.forEach((state, id) => {
      if (state.container === containerId) {
        this.loadingStates.delete(id);
      }
    });
    
    this.errorStates.forEach((state, id) => {
      if (state.container === containerId) {
        this.errorStates.delete(id);
      }
    });
    
    this.successStates.forEach((state, id) => {
      if (state.container === containerId) {
        this.successStates.delete(id);
      }
    });
  }

  // ===================================
  // ACCESSIBILITY FEATURES
  // ===================================

  setupAccessibilityFeatures() {
    this.setupScreenReaderAnnouncements();
    this.setupKeyboardNavigation();
    this.setupFocusManagement();
  }

  setupScreenReaderAnnouncements() {
    // Create live region for announcements
    const liveRegion = document.createElement('div');
    liveRegion.id = 'loading-states-announcer';
    liveRegion.className = 'sr-only';
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    document.body.appendChild(liveRegion);
  }

  announceToScreenReader(message) {
    const announcer = document.getElementById('loading-states-announcer');
    if (announcer) {
      announcer.textContent = message;
      
      // Clear after announcement
      setTimeout(() => {
        announcer.textContent = '';
      }, 1000);
    }
  }

  setupKeyboardNavigation() {
    // Handle keyboard navigation for loading states
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        // Cancel any active loading states
        this.cancelAllLoadingStates();
      }
    });
  }

  setupFocusManagement() {
    // Manage focus during loading states
    const originalActiveElement = document.activeElement;
    
    // Store focus when loading starts
    this.observeLoadingStates();
  }

  observeLoadingStates() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          const target = mutation.target;
          
          if (target.classList.contains('loading-state')) {
            // Trap focus within loading state
            this.trapFocus(target);
          } else if (target.classList.contains('success-state') || target.classList.contains('error-state')) {
            // Allow focus to escape
            this.releaseFocus();
          }
        }
      });
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class'],
      subtree: true
    });
  }

  trapFocus(container) {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }
  }

  releaseFocus() {
    // Return focus to original element
    // Implementation depends on specific needs
  }

  cancelAllLoadingStates() {
    // Cancel all active loading states
    this.loadingStates.forEach((state, id) => {
      this.hideLoading(id);
    });
  }

  setupGlobalLoadingHandlers() {
    // Handle page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        // Pause animations when page is hidden
        this.pauseAnimations();
      } else {
        // Resume animations when page is visible
        this.resumeAnimations();
      }
    });

    // Handle connection changes
    if ('connection' in navigator) {
      navigator.connection.addEventListener('change', () => {
        this.adjustForConnectionSpeed();
      });
    }
  }

  pauseAnimations() {
    document.querySelectorAll('.loading-spinner, .progress-circle').forEach(element => {
      element.style.animationPlayState = 'paused';
    });
  }

  resumeAnimations() {
    document.querySelectorAll('.loading-spinner, .progress-circle').forEach(element => {
      element.style.animationPlayState = 'running';
    });
  }

  adjustForConnectionSpeed() {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (connection) {
      const isSlowConnection = connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g';
      
      if (isSlowConnection) {
        // Reduce animations for slow connections
        document.body.classList.add('reduce-loading-animations');
      } else {
        document.body.classList.remove('reduce-loading-animations');
      }
    }
  }

  createProgressiveLoading() {
    // Return a simple progressive loading template
    return `
      <div class="progressive-loading" role="status" aria-live="polite">
        <div class="progress-header">
          <h3>Loading Content</h3>
          <div class="progress-percentage">0%</div>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: 0%"></div>
        </div>
      </div>
    `;
  }

  createAIGeneration() {
    // Return a simple AI generation template
    return `
      <div class="ai-generation-container" role="status" aria-live="polite">
        <div class="generation-header">
          <div class="generation-title">
            <i class="fas fa-magic"></i>
            <span>AI is Creating Your Chart</span>
          </div>
        </div>
        <div class="generation-progress">
          <div class="loading-spinner"><div class="spinner"></div></div>
        </div>
      </div>
    `;
  }

  createLoadingTemplates() {
    // Pre-create loading templates for better performance
    this.loadingTemplates = {
      skeleton: this.createSkeletonScreen(),
      progressive: this.createProgressiveLoading(),
      ai: this.createAIGeneration()
    };
  }

  createErrorTemplates() {
    // Pre-create error templates
    this.errorTemplates = {
      network: this.createNetworkError(new Error('Network error')),
      ai: this.createAIGenerationError(new Error('AI generation failed')),
      validation: this.createValidationError(new Error('Validation error')),
      empty: this.createEmptyState()
    };
  }

  createSuccessTemplates() {
    // Pre-create success templates
    this.successTemplates = {
      generation: this.createGenerationSuccess(),
      export: this.createExportSuccess(),
      save: this.createSaveSuccess(),
      celebration: this.createCelebrationSuccess()
    };
  }

  // Public API
  showLoading(containerId, options = {}) {
    return this.showPageLoading(containerId, options);
  }

  showErrorState(containerId, error, options = {}) {
    return this.showError(containerId, error, options);
  }

  showSuccessState(containerId, options = {}) {
    return this.showSuccess(containerId, options);
  }

  updateProgress(loadingId, progress) {
    // Update progress for progressive loading
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-percentage');
    
    if (progressFill) {
      progressFill.style.width = `${progress}%`;
    }
    
    if (progressText) {
      progressText.textContent = `${Math.round(progress)}%`;
    }
  }
}

// Initialize loading states
document.addEventListener('DOMContentLoaded', () => {
  window.loadingStates = new LoadingStates();
});

// Export for use in other modules
export { LoadingStates };

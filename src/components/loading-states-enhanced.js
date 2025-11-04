// Enhanced Loading States & Progress Feedback System
class LoadingStatesManager {
  constructor() {
    this.activeLoaders = new Map();
    this.defaultConfig = {
      spinner: true,
      progressBar: true,
      steps: true,
      backdrop: true,
      blur: true,
      timeout: 30000,
      steps: [
        { text: 'Processing your input', threshold: 30 },
        { text: 'Generating visualization', threshold: 70 },
        { text: 'Finalizing chart', threshold: 100 }
      ]
    };
    
    this.init();
  }

  init() {
    this.createGlobalLoadingStyles();
    this.setupGlobalLoadingOverlay();
    this.setupProgressTracking();
    this.setupErrorHandling();
  }

  // Create global loading styles
  createGlobalLoadingStyles() {
    const styleId = 'loading-states-styles';
    
    if (document.getElementById(styleId)) {
      return;
    }

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      /* Loading States System */
      .loading-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .loading-overlay.show {
        opacity: 1;
        visibility: visible;
      }

      .loading-overlay.minimal {
        background: rgba(248, 250, 252, 0.9);
        backdrop-filter: blur(5px);
      }

      .loading-overlay.dark {
        background: rgba(15, 23, 42, 0.95);
        color: white;
      }

      .loading-content {
        text-align: center;
        max-width: 400px;
        padding: 40px;
        background: white;
        border-radius: 16px;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        transform: scale(0.9) translateY(20px);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .loading-overlay.show .loading-content {
        transform: scale(1) translateY(0);
      }

      .loading-overlay.dark .loading-content {
        background: #1e293b;
        color: white;
      }

      .loading-spinner {
        margin-bottom: 24px;
      }

      .spinner {
        width: 48px;
        height: 48px;
        border: 4px solid #f3f4f6;
        border-top: 4px solid #3b82f6;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto;
      }

      .spinner.large {
        width: 64px;
        height: 64px;
        border-width: 6px;
      }

      .spinner.small {
        width: 32px;
        height: 32px;
        border-width: 3px;
      }

      .spinner.success {
        border-top-color: #10b981;
      }

      .spinner.warning {
        border-top-color: #f59e0b;
      }

      .spinner.error {
        border-top-color: #ef4444;
      }

      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      .loading-title {
        font-size: 20px;
        font-weight: 600;
        color: #1f2937;
        margin-bottom: 8px;
      }

      .loading-overlay.dark .loading-title {
        color: #f9fafb;
      }

      .loading-description {
        font-size: 14px;
        color: #6b7280;
        margin-bottom: 24px;
        line-height: 1.5;
      }

      .loading-overlay.dark .loading-description {
        color: #d1d5db;
      }

      .progress-container {
        margin: 24px 0;
      }

      .progress-bar {
        width: 100%;
        height: 8px;
        background: #f3f4f6;
        border-radius: 4px;
        overflow: hidden;
        margin-bottom: 12px;
      }

      .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #3b82f6, #2563eb);
        border-radius: 4px;
        transition: width 0.3s ease;
        position: relative;
        overflow: hidden;
      }

      .progress-fill::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
        animation: shimmer 2s ease-in-out infinite;
      }

      @keyframes shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }

      .progress-text {
        font-size: 13px;
        color: #3b82f6;
        font-weight: 500;
      }

      .loading-steps {
        text-align: left;
        margin-top: 24px;
      }

      .loading-step {
        display: flex;
        align-items: center;
        padding: 8px 0;
        color: #9ca3af;
        font-size: 14px;
        transition: all 0.3s ease;
      }

      .loading-step.active {
        color: #3b82f6;
        font-weight: 500;
      }

      .loading-step.completed {
        color: #10b981;
      }

      .loading-step-icon {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 2px solid #d1d5db;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 12px;
        font-size: 12px;
        transition: all 0.3s ease;
      }

      .loading-step.active .loading-step-icon {
        border-color: #3b82f6;
        background: #3b82f6;
        color: white;
      }

      .loading-step.completed .loading-step-icon {
        border-color: #10b981;
        background: #10b981;
        color: white;
      }

      .loading-step-icon::before {
        content: '';
      }

      .loading-step.completed .loading-step-icon::before {
        content: '✓';
      }

      .loading-actions {
        margin-top: 24px;
        display: flex;
        gap: 12px;
        justify-content: center;
      }

      .loading-btn {
        padding: 8px 16px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        border: none;
      }

      .loading-btn.cancel {
        background: #f3f4f6;
        color: #6b7280;
      }

      .loading-btn.cancel:hover {
        background: #e5e7eb;
        color: #374151;
      }

      .loading-overlay.dark .loading-btn.cancel {
        background: #374151;
        color: #d1d5db;
      }

      .loading-overlay.dark .loading-btn.cancel:hover {
        background: #4b5563;
      }

      /* Inline Loading States */
      .inline-loading {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        background: #f3f4f6;
        border-radius: 6px;
        font-size: 14px;
        color: #6b7280;
      }

      .inline-loading .spinner {
        width: 16px;
        height: 16px;
        border-width: 2px;
        margin: 0;
      }

      /* Button Loading States */
      .btn-loading {
        position: relative;
        pointer-events: none;
        opacity: 0.7;
      }

      .btn-loading::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 16px;
        height: 16px;
        border: 2px solid transparent;
        border-top: 2px solid currentColor;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }

      .btn-loading .btn-text {
        opacity: 0;
      }

      /* Skeleton Loading */
      .skeleton {
        background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
        background-size: 200% 100%;
        animation: skeleton-loading 1.5s ease-in-out infinite;
        border-radius: 4px;
      }

      @keyframes skeleton-loading {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }

      .skeleton-text {
        height: 16px;
        margin-bottom: 8px;
      }

      .skeleton-text.large {
        height: 24px;
      }

      .skeleton-text.small {
        height: 12px;
      }

      .skeleton-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
      }

      .skeleton-card {
        height: 120px;
        border-radius: 8px;
      }

      /* Responsive Design */
      @media (max-width: 640px) {
        .loading-content {
          margin: 20px;
          padding: 24px;
          max-width: none;
        }

        .loading-title {
          font-size: 18px;
        }

        .loading-description {
          font-size: 13px;
        }
      }

      /* Reduced Motion */
      @media (prefers-reduced-motion: reduce) {
        .spinner,
        .progress-fill::after,
        .skeleton {
          animation: none !important;
        }

        .loading-overlay,
        .loading-content,
        .loading-step {
          transition: none !important;
        }
      }

      /* High Contrast */
      @media (prefers-contrast: high) {
        .loading-overlay {
          background: rgba(255, 255, 255, 0.98);
        }

        .loading-content {
          border: 2px solid #000;
        }

        .progress-bar {
          border: 1px solid #000;
        }
      }
    `;

    document.head.appendChild(style);
  }

  // Setup global loading overlay
  setupGlobalLoadingOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'global-loading-overlay';
    overlay.className = 'loading-overlay';
    overlay.innerHTML = `
      <div class="loading-content">
        <div class="loading-spinner">
          <div class="spinner"></div>
        </div>
        <h3 class="loading-title">Processing...</h3>
        <p class="loading-description">Please wait while we complete your request</p>
        <div class="progress-container" style="display: none;">
          <div class="progress-bar">
            <div class="progress-fill" style="width: 0%"></div>
          </div>
          <span class="progress-text">0%</span>
        </div>
        <div class="loading-steps" style="display: none;">
          <!-- Steps will be added dynamically -->
        </div>
        <div class="loading-actions" style="display: none;">
          <button class="loading-btn cancel">Cancel</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    this.globalOverlay = overlay;

    // Setup cancel button
    const cancelBtn = overlay.querySelector('.loading-btn.cancel');
    cancelBtn.addEventListener('click', () => {
      this.hideLoading('global');
    });
  }

  // Show loading with configuration
  showLoading(id = 'global', config = {}) {
    const finalConfig = { ...this.defaultConfig, ...config };
    let overlay;

    if (id === 'global') {
      overlay = this.globalOverlay;
    } else {
      overlay = this.createSpecificOverlay(id, finalConfig);
    }

    if (!overlay) {
      console.error(`Loading overlay with id "${id}" not found`);
      return;
    }

    // Configure overlay
    this.configureOverlay(overlay, finalConfig);

    // Show overlay
    overlay.classList.add('show');

    // Start progress simulation if enabled
    if (finalConfig.progressBar) {
      this.startProgressSimulation(overlay, finalConfig);
    }

    // Setup timeout
    if (finalConfig.timeout) {
      setTimeout(() => {
        this.hideLoading(id);
        this.showTimeoutError(id);
      }, finalConfig.timeout);
    }

    // Track active loader
    this.activeLoaders.set(id, {
      overlay,
      config: finalConfig,
      startTime: Date.now()
    });

    return overlay;
  }

  // Hide loading
  hideLoading(id = 'global') {
    const loader = this.activeLoaders.get(id);
    if (!loader) {
      return false;
    }

    const { overlay, config } = loader;

    // Hide overlay
    overlay.classList.remove('show');

    // Remove from active loaders
    this.activeLoaders.delete(id);

    // Remove specific overlay if not global
    if (id !== 'global') {
      setTimeout(() => {
        overlay.remove();
      }, 300);
    }

    return true;
  }

  // Update loading progress
  updateProgress(id, progress, text) {
    const loader = this.activeLoaders.get(id);
    if (!loader) {
      return false;
    }

    const overlay = loader.overlay;
    const progressFill = overlay.querySelector('.progress-fill');
    const progressText = overlay.querySelector('.progress-text');
    const description = overlay.querySelector('.loading-description');

    if (progressFill) {
      progressFill.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    }

    if (progressText) {
      progressText.textContent = `${Math.round(progress)}%`;
    }

    if (text && description) {
      description.textContent = text;
    }

    // Update steps if enabled
    if (loader.config.steps) {
      this.updateSteps(overlay, progress);
    }

    return true;
  }

  // Update loading steps
  updateSteps(overlay, progress) {
    const steps = overlay.querySelectorAll('.loading-step');
    const stepThresholds = [0, 30, 70, 100];

    steps.forEach((step, index) => {
      const threshold = stepThresholds[index] || 100;
      
      if (progress >= threshold) {
        step.classList.add('completed');
        step.classList.remove('active');
      } else if (progress >= (stepThresholds[index - 1] || 0)) {
        step.classList.add('active');
        step.classList.remove('completed');
      } else {
        step.classList.remove('active', 'completed');
      }
    });
  }

  // Configure overlay based on config
  configureOverlay(overlay, config) {
    // Set theme
    if (config.theme) {
      overlay.className = `loading-overlay ${config.theme}`;
    }

    // Configure spinner
    const spinner = overlay.querySelector('.spinner');
    if (spinner) {
      if (config.spinnerSize) {
        spinner.className = `spinner ${config.spinnerSize}`;
      }
      if (config.spinnerType) {
        spinner.className = `spinner ${config.spinnerType}`;
      }
    }

    // Set title and description
    const title = overlay.querySelector('.loading-title');
    const description = overlay.querySelector('.loading-description');
    
    if (title && config.title) {
      title.textContent = config.title;
    }
    
    if (description && config.description) {
      description.textContent = config.description;
    }

    // Show/hide components
    const progressContainer = overlay.querySelector('.progress-container');
    const stepsContainer = overlay.querySelector('.loading-steps');
    const actionsContainer = overlay.querySelector('.loading-actions');
    const spinnerContainer = overlay.querySelector('.loading-spinner');

    if (progressContainer) {
      progressContainer.style.display = config.progressBar ? 'block' : 'none';
    }
    
    if (stepsContainer) {
      stepsContainer.style.display = config.steps ? 'block' : 'none';
      if (config.steps && config.stepTexts) {
        this.populateSteps(stepsContainer, config.stepTexts);
      }
    }
    
    if (actionsContainer) {
      actionsContainer.style.display = config.showCancel ? 'flex' : 'none';
    }
    
    if (spinnerContainer) {
      spinnerContainer.style.display = config.spinner ? 'block' : 'none';
    }
  }

  // Populate steps
  populateSteps(container, steps) {
    container.innerHTML = steps.map(step => `
      <div class="loading-step">
        <div class="loading-step-icon"></div>
        <span>${step.text || step}</span>
      </div>
    `).join('');
  }

  // Start progress simulation
  startProgressSimulation(overlay, config) {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
      }

      // Find the loader id for this overlay
      const loaderId = Array.from(this.activeLoaders.entries())
        .find(([_, loader]) => loader.overlay === overlay)?.[0];
      
      if (loaderId) {
        this.updateProgress(loaderId, progress);
      }
    }, 300);

    // Store interval for cleanup
    overlay.dataset.progressInterval = interval;
  }

  // Create specific overlay
  createSpecificOverlay(id, config) {
    const overlay = document.createElement('div');
    overlay.id = `loading-overlay-${id}`;
    overlay.className = 'loading-overlay';
    overlay.innerHTML = `
      <div class="loading-content">
        <div class="loading-spinner">
          <div class="spinner"></div>
        </div>
        <h3 class="loading-title">Processing...</h3>
        <p class="loading-description">Please wait while we complete your request</p>
        <div class="progress-container">
          <div class="progress-bar">
            <div class="progress-fill" style="width: 0%"></div>
          </div>
          <span class="progress-text">0%</span>
        </div>
        <div class="loading-steps">
          <!-- Steps will be added dynamically -->
        </div>
        <div class="loading-actions">
          <button class="loading-btn cancel">Cancel</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    // Setup cancel button
    const cancelBtn = overlay.querySelector('.loading-btn.cancel');
    cancelBtn.addEventListener('click', () => {
      this.hideLoading(id);
    });

    return overlay;
  }

  // Show inline loading
  showInlineLoading(element, text = 'Loading...') {
    const originalContent = element.innerHTML;
    element.innerHTML = `
      <div class="inline-loading">
        <div class="spinner"></div>
        <span>${text}</span>
      </div>
    `;
    
    return {
      hide: () => {
        element.innerHTML = originalContent;
      }
    };
  }

  // Show button loading
  showButtonLoading(button, text = 'Loading...') {
    const originalContent = button.innerHTML;
    button.classList.add('btn-loading');
    button.innerHTML = `<span class="btn-text">${text}</span>`;
    
    return {
      hide: () => {
        button.classList.remove('btn-loading');
        button.innerHTML = originalContent;
      }
    };
  }

  // Show skeleton loading
  showSkeletonLoading(container, type = 'card') {
    const skeletonHTML = this.getSkeletonHTML(type);
    container.innerHTML = skeletonHTML;
    
    return {
      hide: (content) => {
        container.innerHTML = content || '';
      }
    };
  }

  // Get skeleton HTML
  getSkeletonHTML(type) {
    const skeletons = {
      card: `
        <div class="skeleton skeleton-card"></div>
      `,
      text: `
        <div class="skeleton skeleton-text large"></div>
        <div class="skeleton skeleton-text"></div>
        <div class="skeleton skeleton-text small"></div>
      `,
      list: `
        ${Array(5).fill('').map(() => `
          <div class="skeleton skeleton-text" style="width: ${Math.random() * 40 + 60}%"></div>
        `).join('')}
      `,
      avatar: `
        <div class="skeleton skeleton-avatar"></div>
        <div class="skeleton skeleton-text"></div>
        <div class="skeleton skeleton-text small"></div>
      `
    };

    return skeletons[type] || skeletons.card;
  }

  // Show timeout error
  showTimeoutError(id) {
    console.warn(`Loading operation "${id}" timed out`);
    
    // You can integrate with your error handling system here
    if (window.errorHandler) {
      window.errorHandler.showError({
        type: 'timeout',
        message: 'Operation timed out. Please try again.',
        id: id
      });
    }
  }

  // Setup progress tracking
  setupProgressTracking() {
    // Listen for custom progress events
    document.addEventListener('loading:progress', (e) => {
      const { id, progress, text } = e.detail;
      this.updateProgress(id, progress, text);
    });

    // Listen for custom show/hide events
    document.addEventListener('loading:show', (e) => {
      const { id, config } = e.detail;
      this.showLoading(id, config);
    });

    document.addEventListener('loading:hide', (e) => {
      const { id } = e.detail;
      this.hideLoading(id);
    });
  }

  // Setup error handling
  setupErrorHandling() {
    // Handle page unload
    window.addEventListener('beforeunload', () => {
      // Clean up all active loaders
      this.activeLoaders.forEach((loader, id) => {
        this.hideLoading(id);
      });
    });

    // Handle visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        // Pause animations when page is hidden
        document.querySelectorAll('.spinner').forEach(spinner => {
          spinner.style.animationPlayState = 'paused';
        });
      } else {
        // Resume animations when page is visible
        document.querySelectorAll('.spinner').forEach(spinner => {
          spinner.style.animationPlayState = 'running';
        });
      }
    });
  }

  // Get active loaders
  getActiveLoaders() {
    return Array.from(this.activeLoaders.keys());
  }

  // Check if loading is active
  isLoading(id = 'global') {
    return this.activeLoaders.has(id);
  }

  // Get loading duration
  getLoadingDuration(id) {
    const loader = this.activeLoaders.get(id);
    if (!loader) {
      return null;
    }
    
    return Date.now() - loader.startTime;
  }
}

// Initialize loading states manager
document.addEventListener('DOMContentLoaded', () => {
  window.loadingStates = new LoadingStatesManager();
});

// Export for use in other modules
export { LoadingStatesManager };

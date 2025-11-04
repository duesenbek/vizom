// Advanced Loading States and Progress Indicators
class LoadingStates {
  constructor() {
    this.loadingStates = {
      CHART_GENERATION: 'chart_generation',
      FILE_UPLOAD: 'file_upload',
      EXPORT_PROCESS: 'export_process',
      AI_PROCESSING: 'ai_processing',
      DATA_VALIDATION: 'data_validation'
    };
    
    this.activeLoaders = new Map();
    this.progressCallbacks = new Map();
    
    this.init();
  }

  init() {
    this.setupGlobalLoadingHandlers();
    this.createLoadingOverlay();
  }

  // Setup global loading handlers
  setupGlobalLoadingHandlers() {
    // Intercept fetch requests for loading states
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const url = args[0];
      if (this.shouldShowLoading(url)) {
        const loaderId = this.showLoading(this.loadingStates.AI_PROCESSING, 'Processing your request...');
        try {
          const response = await originalFetch(...args);
          this.hideLoading(loaderId);
          return response;
        } catch (error) {
          this.hideLoading(loaderId);
          throw error;
        }
      }
      return originalFetch(...args);
    };
  }

  // Determine if loading should be shown for URL
  shouldShowLoading(url) {
    const loadingUrls = [
      '/api/generate',
      '/api/upload',
      '/api/export',
      '/api/validate'
    ];
    
    return loadingUrls.some(loadingUrl => 
      typeof url === 'string' && url.includes(loadingUrl)
    );
  }

  // Create global loading overlay
  createLoadingOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'global-loading-overlay';
    overlay.className = 'loading-overlay';
    overlay.innerHTML = `
      <div class="loading-content">
        <div class="loading-spinner">
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
        </div>
        <div class="loading-text">
          <div class="loading-title">Processing...</div>
          <div class="loading-message">Please wait a moment</div>
        </div>
        <div class="loading-progress">
          <div class="progress-bar">
            <div class="progress-fill"></div>
          </div>
          <div class="progress-text">0%</div>
        </div>
        <button class="loading-cancel" onclick="window.loadingStates.cancelCurrentLoading()">
          <i class="fas fa-times"></i> Cancel
        </button>
      </div>
    `;
    document.body.appendChild(overlay);
  }

  // Show loading state
  showLoading(type, message = '', options = {}) {
    const loaderId = this.generateLoaderId();
    const loader = {
      id: loaderId,
      type: type,
      message: message,
      startTime: Date.now(),
      cancellable: options.cancellable !== false,
      showProgress: options.showProgress === true,
      estimatedDuration: options.estimatedDuration || 5000
    };

    this.activeLoaders.set(loaderId, loader);
    this.updateLoadingOverlay(loader);
    
    // Show overlay
    const overlay = document.getElementById('global-loading-overlay');
    if (overlay) {
      overlay.classList.add('show');
    }

    // Auto-update progress for estimated duration
    if (loader.showProgress) {
      this.simulateProgress(loaderId);
    }

    // Timeout for safety
    setTimeout(() => {
      if (this.activeLoaders.has(loaderId)) {
        this.hideLoading(loaderId);
        if (window.errorHandler) {
          window.errorHandler.handleError({
            message: 'Request timed out',
            type: 'network'
          }, { timeout: true });
        }
      }
    }, 30000); // 30 second timeout

    return loaderId;
  }

  // Update loading overlay
  updateLoadingOverlay(loader) {
    const overlay = document.getElementById('global-loading-overlay');
    if (!overlay) return;

    const titleEl = overlay.querySelector('.loading-title');
    const messageEl = overlay.querySelector('.loading-message');
    const progressContainer = overlay.querySelector('.loading-progress');
    const cancelBtn = overlay.querySelector('.loading-cancel');

    // Update text based on loader type
    const titles = {
      [this.loadingStates.CHART_GENERATION]: 'Generating Chart',
      [this.loadingStates.FILE_UPLOAD]: 'Uploading File',
      [this.loadingStates.EXPORT_PROCESS]: 'Exporting Chart',
      [this.loadingStates.AI_PROCESSING]: 'AI Processing',
      [this.loadingStates.DATA_VALIDATION]: 'Validating Data'
    };

    const messages = {
      [this.loadingStates.CHART_GENERATION]: 'Our AI is creating your visualization...',
      [this.loadingStates.FILE_UPLOAD]: 'Uploading and processing your file...',
      [this.loadingStates.EXPORT_PROCESS]: 'Preparing your chart for download...',
      [this.loadingStates.AI_PROCESSING]: 'Processing your request with AI...',
      [this.loadingStates.DATA_VALIDATION]: 'Checking your data format...'
    };

    titleEl.textContent = titles[loader.type] || 'Processing...';
    messageEl.textContent = loader.message || messages[loader.type] || 'Please wait...';

    // Show/hide progress bar
    progressContainer.style.display = loader.showProgress ? 'block' : 'none';

    // Show/hide cancel button
    cancelBtn.style.display = loader.cancellable ? 'flex' : 'none';
  }

  // Simulate progress
  simulateProgress(loaderId) {
    const loader = this.activeLoaders.get(loaderId);
    if (!loader) return;

    let progress = 0;
    const interval = setInterval(() => {
      if (!this.activeLoaders.has(loaderId)) {
        clearInterval(interval);
        return;
      }

      // Simulate realistic progress
      const increment = Math.random() * 15 + 5; // 5-20% increments
      progress = Math.min(progress + increment, 95); // Cap at 95%
      
      this.updateProgress(loaderId, progress);

      if (progress >= 95) {
        clearInterval(interval);
      }
    }, loader.estimatedDuration / 10); // Update 10 times

    // Store interval for cleanup
    loader.progressInterval = interval;
  }

  // Update progress
  updateProgress(loaderId, progress) {
    const overlay = document.getElementById('global-loading-overlay');
    if (!overlay) return;

    const progressFill = overlay.querySelector('.progress-fill');
    const progressText = overlay.querySelector('.progress-text');

    if (progressFill) {
      progressFill.style.width = `${progress}%`;
    }
    if (progressText) {
      progressText.textContent = `${Math.round(progress)}%`;
    }

    // Call progress callback if registered
    const callback = this.progressCallbacks.get(loaderId);
    if (callback) {
      callback(progress);
    }
  }

  // Hide loading state
  hideLoading(loaderId) {
    const loader = this.activeLoaders.get(loaderId);
    if (!loader) return;

    // Clear progress interval
    if (loader.progressInterval) {
      clearInterval(loader.progressInterval);
    }

    this.activeLoaders.delete(loaderId);

    // Hide overlay if no more loaders
    if (this.activeLoaders.size === 0) {
      const overlay = document.getElementById('global-loading-overlay');
      if (overlay) {
        overlay.classList.remove('show');
      }
    }

    // Update overlay for remaining loaders
    if (this.activeLoaders.size > 0) {
      const nextLoader = Array.from(this.activeLoaders.values())[0];
      this.updateLoadingOverlay(nextLoader);
    }
  }

  // Cancel current loading
  cancelCurrentLoading() {
    if (this.activeLoaders.size === 0) return;

    const loaderIds = Array.from(this.activeLoaders.keys());
    loaderIds.forEach(id => {
      const loader = this.activeLoaders.get(id);
      if (loader && loader.cancellable) {
        this.hideLoading(id);
        
        // Trigger cancellation callback
        if (loader.onCancel) {
          loader.onCancel();
        }
      }
    });

    // Show cancellation message
    this.showToast('Operation cancelled', 'info');
  }

  // Register progress callback
  onProgress(loaderId, callback) {
    this.progressCallbacks.set(loaderId, callback);
  }

  // Show mini loading for buttons
  showButtonLoading(buttonElement, message = 'Loading...') {
    if (!buttonElement) return;

    const originalContent = buttonElement.innerHTML;
    const originalDisabled = buttonElement.disabled;
    
    buttonElement.innerHTML = `
      <div class="btn-spinner">
        <div class="spinner-dots">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
      ${message}
    `;
    buttonElement.disabled = true;
    buttonElement.classList.add('loading');

    // Store original state
    buttonElement.dataset.originalContent = originalContent;
    buttonElement.dataset.originalDisabled = originalDisabled;

    return () => this.hideButtonLoading(buttonElement);
  }

  // Hide button loading
  hideButtonLoading(buttonElement) {
    if (!buttonElement) return;

    buttonElement.innerHTML = buttonElement.dataset.originalContent || buttonElement.innerHTML;
    buttonElement.disabled = buttonElement.dataset.originalDisabled === 'true';
    buttonElement.classList.remove('loading');

    delete buttonElement.dataset.originalContent;
    delete buttonElement.dataset.originalDisabled;
  }

  // Show skeleton loading
  showSkeletonLoading(container, options = {}) {
    if (!container) return;

    const defaults = {
      lines: 3,
      height: '16px',
      avatar: false,
      title: true,
      paragraph: true
    };

    const config = { ...defaults, ...options };
    
    let skeletonHTML = '<div class="skeleton-loader">';
    
    if (config.avatar) {
      skeletonHTML += '<div class="skeleton-avatar"></div>';
    }
    
    if (config.title) {
      skeletonHTML += '<div class="skeleton-title"></div>';
    }
    
    if (config.paragraph) {
      for (let i = 0; i < config.lines; i++) {
        skeletonHTML += '<div class="skeleton-line"></div>';
      }
    }

    skeletonHTML += '</div>';

    // Store original content
    container.dataset.originalContent = container.innerHTML;
    container.innerHTML = skeletonHTML;
    container.classList.add('skeleton-loading');

    return () => this.hideSkeletonLoading(container);
  }

  // Hide skeleton loading
  hideSkeletonLoading(container) {
    if (!container) return;

    container.innerHTML = container.dataset.originalContent || '';
    container.classList.remove('skeleton-loading');
    delete container.dataset.originalContent;
  }

  // Show chart generation loading
  showChartGenerationLoading(chartType, estimatedDuration = 5000) {
    const loaderId = this.showLoading(
      this.loadingStates.CHART_GENERATION,
      `Creating ${chartType} chart...`,
      {
        showProgress: true,
        estimatedDuration: estimatedDuration,
        cancellable: true
      }
    );

    // Register progress callback for detailed updates
    this.onProgress(loaderId, (progress) => {
      const overlay = document.getElementById('global-loading-overlay');
      const messageEl = overlay.querySelector('.loading-message');
      
      if (progress < 30) {
        messageEl.textContent = 'Analyzing your data...';
      } else if (progress < 60) {
        messageEl.textContent = 'Generating visualization...';
      } else if (progress < 90) {
        messageEl.textContent = 'Applying styles and formatting...';
      } else {
        messageEl.textContent = 'Finalizing your chart...';
      }
    });

    return loaderId;
  }

  // Show file upload loading
  showFileUploadLoading(fileName, fileSize) {
    const loaderId = this.showLoading(
      this.loadingStates.FILE_UPLOAD,
      `Uploading ${fileName}...`,
      {
        showProgress: true,
        estimatedDuration: 3000,
        cancellable: true
      }
    );

    // Register progress callback
    this.onProgress(loaderId, (progress) => {
      const overlay = document.getElementById('global-loading-overlay');
      const messageEl = overlay.querySelector('.loading-message');
      
      if (progress < 50) {
        messageEl.textContent = `Uploading ${fileName} (${(fileSize * progress / 100 / 1024).toFixed(1)} KB)...`;
      } else {
        messageEl.textContent = 'Processing file data...';
      }
    });

    return loaderId;
  }

  // Show export loading
  showExportLoading(format, fileName) {
    const loaderId = this.showLoading(
      this.loadingStates.EXPORT_PROCESS,
      `Exporting as ${format.toUpperCase()}...`,
      {
        showProgress: true,
        estimatedDuration: 2000,
        cancellable: false
      }
    );

    // Register progress callback
    this.onProgress(loaderId, (progress) => {
      const overlay = document.getElementById('global-loading-overlay');
      const messageEl = overlay.querySelector('.loading-message');
      
      if (progress < 50) {
        messageEl.textContent = 'Preparing chart data...';
      } else {
        messageEl.textContent = `Generating ${fileName}.${format}...`;
      }
    });

    return loaderId;
  }

  // Utility methods
  generateLoaderId() {
    return 'loader_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  showToast(message, type = 'info') {
    if (window.uiEnhancements) {
      window.uiEnhancements.showNotification(message, type);
    }
  }

  // Get active loaders count
  getActiveLoadersCount() {
    return this.activeLoaders.size;
  }

  // Check if specific type is loading
  isLoading(type) {
    return Array.from(this.activeLoaders.values()).some(loader => loader.type === type);
  }

  // Clear all loaders
  clearAllLoaders() {
    const loaderIds = Array.from(this.activeLoaders.keys());
    loaderIds.forEach(id => this.hideLoading(id));
  }
}

// Initialize loading states
document.addEventListener('DOMContentLoaded', () => {
  window.loadingStates = new LoadingStates();
});

export { LoadingStates };

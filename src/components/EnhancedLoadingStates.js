/**
 * Enhanced Loading States Component
 * Comprehensive skeleton loaders, progress indicators, and layout shift prevention
 */

class EnhancedLoadingStates {
  constructor() {
    this.activeLoaders = new Map();
    this.progressIndicators = new Map();
    this.init();
  }

  init() {
    this.setupGlobalStyles();
    this.createLoadingTemplates();
  }

  /**
   * Setup global CSS for loading states
   */
  setupGlobalStyles() {
    if (document.getElementById('enhanced-loading-styles')) return;

    const styles = document.createElement('style');
    styles.id = 'enhanced-loading-styles';
    styles.textContent = `
      /* Skeleton Loading Animations */
      @keyframes skeleton-loading {
        0% { background-position: -200px 0; }
        100% { background-position: calc(200px + 100%) 0; }
      }

      .skeleton {
        background: linear-gradient(90deg, #f0f0f0 0px, #f8f8f8 40px, #f0f0f0 80px);
        background-size: 200px 100%;
        animation: skeleton-loading 1.5s ease-in-out infinite;
        border-radius: 4px;
      }

      /* Pulse Animation */
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }

      .pulse {
        animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      }

      /* Progress Bar Styles */
      .progress-bar {
        height: 4px;
        background: #e5e7eb;
        border-radius: 2px;
        overflow: hidden;
      }

      .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #3b82f6, #8b5cf6);
        border-radius: 2px;
        transition: width 0.3s ease;
      }

      /* Loading Overlay */
      .loading-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(2px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 50;
      }

      /* Chart Skeleton */
      .chart-skeleton {
        position: relative;
        background: #f9fafb;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        overflow: hidden;
      }

      .chart-skeleton::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent);
        animation: shimmer 2s infinite;
      }

      @keyframes shimmer {
        0% { left: -100%; }
        100% { left: 100%; }
      }

      /* Prevent Layout Shift */
      .preserve-aspect {
        min-height: inherit;
        min-width: inherit;
      }

      /* Loading States for Buttons */
      .btn-loading {
        position: relative;
        color: transparent !important;
        pointer-events: none;
      }

      .btn-loading::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 16px;
        height: 16px;
        margin: -8px 0 0 -8px;
        border: 2px solid currentColor;
        border-radius: 50%;
        border-top-color: transparent;
        animation: spin 0.8s linear infinite;
      }

      @keyframes spin {
        to { transform: rotate(360deg); }
      }

      /* Mobile Optimizations */
      @media (max-width: 768px) {
        .loading-overlay {
          background: rgba(255, 255, 255, 0.95);
        }
        
        .skeleton {
          background-size: 150px 100%;
          animation-duration: 2s;
        }
      }
    `;
    document.head.appendChild(styles);
  }

  /**
   * Show skeleton loader for chart area
   */
  showChartSkeleton(containerId, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) return null;

    const loaderId = `chart-skeleton-${Date.now()}`;
    const { height = 400, type = 'bar' } = options;

    // Store original dimensions to prevent layout shift
    const originalHeight = container.style.height || `${height}px`;
    container.style.height = originalHeight;
    container.style.minHeight = originalHeight;

    const skeletonHTML = this.generateChartSkeleton(type, height);
    
    this.activeLoaders.set(loaderId, {
      container: containerId,
      originalContent: container.innerHTML,
      type: 'chart'
    });

    container.innerHTML = skeletonHTML;
    container.classList.add('loading-state');

    return loaderId;
  }

  /**
   * Generate chart-specific skeleton HTML
   */
  generateChartSkeleton(type, height) {
    const skeletons = {
      bar: `
        <div class="chart-skeleton preserve-aspect" style="height: ${height}px;">
          <div class="p-4">
            <div class="skeleton h-6 w-32 mb-4"></div>
            <div class="flex items-end justify-between h-48 mb-4">
              ${[40, 65, 30, 80, 55, 70, 45].map(h => 
                `<div class="skeleton w-8" style="height: ${h}%;"></div>`
              ).join('')}
            </div>
            <div class="flex justify-between">
              ${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'].map(() => 
                '<div class="skeleton h-3 w-8"></div>'
              ).join('')}
            </div>
          </div>
        </div>
      `,
      line: `
        <div class="chart-skeleton preserve-aspect" style="height: ${height}px;">
          <div class="p-4">
            <div class="skeleton h-6 w-32 mb-4"></div>
            <div class="relative h-48 mb-4">
              <svg class="w-full h-full">
                <path d="M 20 120 Q 60 40, 100 80 T 180 60 T 260 90" 
                      stroke="#e5e7eb" stroke-width="3" fill="none" class="pulse"/>
                ${[20, 60, 100, 140, 180, 220, 260].map((x, i) => 
                  `<circle cx="${x}" cy="${[120, 40, 80, 120, 60, 100, 90][i]}" r="4" 
                          fill="#e5e7eb" class="pulse"/>`
                ).join('')}
              </svg>
            </div>
            <div class="flex justify-between">
              ${['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(() => 
                '<div class="skeleton h-3 w-8"></div>'
              ).join('')}
            </div>
          </div>
        </div>
      `,
      pie: `
        <div class="chart-skeleton preserve-aspect" style="height: ${height}px;">
          <div class="p-4">
            <div class="skeleton h-6 w-32 mb-4"></div>
            <div class="flex items-center justify-center">
              <div class="relative w-32 h-32">
                <div class="skeleton w-full h-full rounded-full"></div>
                <div class="absolute inset-2 skeleton rounded-full"></div>
              </div>
            </div>
            <div class="mt-4 space-y-2">
              ${['Product A', 'Product B', 'Product C'].map(() => 
                `<div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <div class="skeleton w-3 h-3 rounded mr-2"></div>
                    <div class="skeleton h-3 w-20"></div>
                  </div>
                  <div class="skeleton h-3 w-8"></div>
                </div>`
              ).join('')}
            </div>
          </div>
        </div>
      `,
      dashboard: `
        <div class="chart-skeleton preserve-aspect" style="height: ${height}px;">
          <div class="p-6">
            <div class="skeleton h-8 w-48 mb-6"></div>
            
            <!-- KPI Cards -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              ${[1, 2, 3].map(() => `
                <div class="bg-white p-4 rounded-lg border">
                  <div class="skeleton h-4 w-16 mb-2"></div>
                  <div class="skeleton h-8 w-24 mb-2"></div>
                  <div class="skeleton h-3 w-20"></div>
                </div>
              `).join('')}
            </div>
            
            <!-- Chart Areas -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div class="bg-white p-4 rounded-lg border">
                <div class="skeleton h-4 w-24 mb-4"></div>
                <div class="skeleton h-32 w-full"></div>
              </div>
              <div class="bg-white p-4 rounded-lg border">
                <div class="skeleton h-4 w-24 mb-4"></div>
                <div class="skeleton h-32 w-full"></div>
              </div>
            </div>
          </div>
        </div>
      `
    };

    return skeletons[type] || skeletons.bar;
  }

  /**
   * Show progress indicator with percentage
   */
  showProgress(containerId, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) return null;

    const progressId = `progress-${Date.now()}`;
    const { 
      message = 'Processing...', 
      showPercentage = true,
      steps = ['Analyzing data', 'Generating chart', 'Applying styles']
    } = options;

    const progressHTML = `
      <div class="loading-overlay">
        <div class="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full mx-4">
          <div class="flex items-center mb-4">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
            <div>
              <h3 class="text-sm font-medium text-gray-900">${message}</h3>
              <p class="text-xs text-gray-500" id="progress-step-${progressId}">${steps[0]}</p>
            </div>
          </div>
          
          <div class="progress-bar mb-2">
            <div class="progress-fill" id="progress-fill-${progressId}" style="width: 0%"></div>
          </div>
          
          ${showPercentage ? `
            <div class="text-center">
              <span class="text-xs text-gray-600" id="progress-percent-${progressId}">0%</span>
            </div>
          ` : ''}
        </div>
      </div>
    `;

    this.progressIndicators.set(progressId, {
      container: containerId,
      steps,
      currentStep: 0,
      showPercentage
    });

    container.style.position = 'relative';
    container.insertAdjacentHTML('beforeend', progressHTML);

    return progressId;
  }

  /**
   * Update progress indicator
   */
  updateProgress(progressId, percentage, stepIndex = null) {
    const progress = this.progressIndicators.get(progressId);
    if (!progress) return;

    const fillElement = document.getElementById(`progress-fill-${progressId}`);
    const percentElement = document.getElementById(`progress-percent-${progressId}`);
    const stepElement = document.getElementById(`progress-step-${progressId}`);

    if (fillElement) {
      fillElement.style.width = `${Math.min(percentage, 100)}%`;
    }

    if (percentElement && progress.showPercentage) {
      percentElement.textContent = `${Math.round(percentage)}%`;
    }

    if (stepElement && stepIndex !== null && progress.steps[stepIndex]) {
      stepElement.textContent = progress.steps[stepIndex];
    }
  }

  /**
   * Show button loading state
   */
  setButtonLoading(buttonId, loading = true, loadingText = 'Loading...') {
    const button = document.getElementById(buttonId) || document.querySelector(`[data-button-id="${buttonId}"]`);
    if (!button) return;

    if (loading) {
      button.dataset.originalText = button.textContent;
      button.textContent = loadingText;
      button.classList.add('btn-loading');
      button.disabled = true;
    } else {
      button.textContent = button.dataset.originalText || 'Submit';
      button.classList.remove('btn-loading');
      button.disabled = false;
      delete button.dataset.originalText;
    }
  }

  /**
   * Hide loading state and restore content
   */
  hideLoading(loaderId) {
    const loader = this.activeLoaders.get(loaderId);
    if (!loader) return;

    const container = document.getElementById(loader.container);
    if (container) {
      container.innerHTML = loader.originalContent;
      container.classList.remove('loading-state');
    }

    this.activeLoaders.delete(loaderId);
  }

  /**
   * Hide progress indicator
   */
  hideProgress(progressId) {
    const progress = this.progressIndicators.get(progressId);
    if (!progress) return;

    const container = document.getElementById(progress.container);
    if (container) {
      const overlay = container.querySelector('.loading-overlay');
      if (overlay) overlay.remove();
    }

    this.progressIndicators.delete(progressId);
  }

  /**
   * Show inline loading for specific elements
   */
  showInlineLoading(elementId, options = {}) {
    const element = document.getElementById(elementId);
    if (!element) return null;

    const { size = 'small', text = 'Loading...' } = options;
    
    const sizes = {
      small: 'h-4 w-4',
      medium: 'h-6 w-6',
      large: 'h-8 w-8'
    };

    const loadingHTML = `
      <div class="flex items-center justify-center p-4">
        <div class="animate-spin rounded-full ${sizes[size]} border-b-2 border-blue-600 mr-2"></div>
        <span class="text-sm text-gray-600">${text}</span>
      </div>
    `;

    const loaderId = `inline-${Date.now()}`;
    this.activeLoaders.set(loaderId, {
      container: elementId,
      originalContent: element.innerHTML,
      type: 'inline'
    });

    element.innerHTML = loadingHTML;
    return loaderId;
  }

  /**
   * Create loading templates for different contexts
   */
  createLoadingTemplates() {
    // Templates are generated dynamically based on context
  }

  /**
   * Get active loading statistics
   */
  getStats() {
    return {
      activeLoaders: this.activeLoaders.size,
      activeProgress: this.progressIndicators.size,
      types: Array.from(this.activeLoaders.values()).map(l => l.type)
    };
  }

  /**
   * Clear all loading states
   */
  clearAll() {
    // Clear all active loaders
    this.activeLoaders.forEach((_, loaderId) => {
      this.hideLoading(loaderId);
    });

    // Clear all progress indicators
    this.progressIndicators.forEach((_, progressId) => {
      this.hideProgress(progressId);
    });
  }
}

// Export singleton instance
export const enhancedLoading = new EnhancedLoadingStates();

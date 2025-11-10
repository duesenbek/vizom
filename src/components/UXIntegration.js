/**
 * UX Integration Component
 * Integrates all enhanced UX components and provides unified interface
 */

import { enhancedLoading } from './EnhancedLoadingStates.js';
import { errorHandler } from './EnhancedErrorHandling.js';
import { emptyStates } from './EnhancedEmptyStates.js';
import { feedbackSystem } from './EnhancedFeedbackSystem.js';
import { mobileExperience } from './EnhancedMobileExperience.js';
import { responsiveCharts } from './EnhancedResponsiveCharts.js';

class UXIntegration {
  constructor() {
    this.components = {
      loading: enhancedLoading,
      errors: errorHandler,
      empty: emptyStates,
      feedback: feedbackSystem,
      mobile: mobileExperience,
      charts: responsiveCharts
    };
    
    this.isInitialized = false;
    this.init();
  }

  /**
   * Initialize all UX components
   */
  async init() {
    if (this.isInitialized) return;

    try {
      // Setup global event listeners
      this.setupGlobalEventListeners();
      
      // Setup component integrations
      this.setupComponentIntegrations();
      
      // Setup performance monitoring
      this.setupPerformanceMonitoring();
      
      this.isInitialized = true;
      
      console.log('✅ Enhanced UX System initialized successfully');
      
    } catch (error) {
      console.error('❌ Failed to initialize UX system:', error);
      this.components.errors.handleError({
        type: 'javascript',
        message: 'UX System initialization failed',
        error
      });
    }
  }

  /**
   * Setup global event listeners
   */
  setupGlobalEventListeners() {
    // Handle navigation events
    window.addEventListener('beforeunload', () => {
      this.cleanup();
    });

    // Handle online/offline status
    window.addEventListener('online', () => {
      this.components.feedback.showInfo('Connection Restored', 'You are back online');
    });

    window.addEventListener('offline', () => {
      this.components.feedback.showWarning('Connection Lost', 'You are currently offline');
    });

    // Handle custom events from components
    window.addEventListener('loadExampleData', (e) => {
      this.handleLoadExampleData(e.detail);
    });

    window.addEventListener('showDataImportDialog', () => {
      this.showDataImportDialog();
    });

    window.addEventListener('createTemplate', () => {
      this.handleCreateTemplate();
    });
  }

  /**
   * Setup component integrations
   */
  setupComponentIntegrations() {
    // Connect loading states with error handling
    this.setupLoadingErrorIntegration();
    
    // Connect feedback with mobile experience
    this.setupFeedbackMobileIntegration();
    
    // Connect empty states with charts
    this.setupEmptyChartIntegration();
  }

  /**
   * Setup loading and error integration
   */
  setupLoadingErrorIntegration() {
    // Monitor loading states and show errors if they take too long
    const loadingCheckInterval = setInterval(() => {
      const stats = this.components.loading.getStats();
      
      if (stats.activeLoaders > 0) {
        // Check if any loader has been active for more than 30 seconds
        const now = Date.now();
        this.components.loading.activeLoaders.forEach((loader, id) => {
          if (now - loader.startTime > 30000) {
            this.components.errors.handleError({
              type: 'timeout',
              message: 'Loading operation timed out',
              context: { loaderId: id }
            });
            
            this.components.loading.hideLoading(id);
          }
        });
      }
    }, 5000);

    // Store interval for cleanup
    this.loadingCheckInterval = loadingCheckInterval;
  }

  /**
   * Setup feedback and mobile integration
   */
  setupFeedbackMobileIntegration() {
    // Adjust notification positions for mobile
    if (this.components.mobile.isMobile) {
      // Move notifications to bottom on mobile
      const notificationContainer = document.getElementById('notification-container');
      if (notificationContainer) {
        notificationContainer.style.top = 'auto';
        notificationContainer.style.bottom = '80px'; // Above mobile nav
        notificationContainer.style.right = '10px';
        notificationContainer.style.left = '10px';
      }
    }
  }

  /**
   * Setup empty states and charts integration
   */
  setupEmptyChartIntegration() {
    // Show empty states when charts have no data
    window.addEventListener('chartEmpty', (e) => {
      const { containerId, chartType } = e.detail;
      this.components.empty.showChartEmptyState(containerId, { chartType });
    });

    // Hide empty states when charts have data
    window.addEventListener('chartDataLoaded', (e) => {
      const { containerId } = e.detail;
      // Empty state will be automatically hidden when chart is rendered
    });
  }

  /**
   * Setup performance monitoring
   */
  setupPerformanceMonitoring() {
    // Monitor UX performance metrics
    setInterval(() => {
      const metrics = this.getPerformanceMetrics();
      
      // Log performance warnings
      if (metrics.loading.activeLoaders > 5) {
        console.warn('⚠️ High number of active loaders:', metrics.loading.activeLoaders);
      }
      
      if (metrics.errors.totalErrors > 10) {
        console.warn('⚠️ High error rate detected:', metrics.errors.totalErrors);
      }
    }, 30000);
  }

  /**
   * Unified chart creation with all UX enhancements
   */
  async createEnhancedChart(containerId, data, options = {}) {
    const {
      chartType = 'bar',
      showLoading = true,
      showErrorStates = true,
      showEmptyStates = true,
      responsive = true,
      mobileOptimized = true
    } = options;

    try {
      // Show loading state
      let loadingId = null;
      if (showLoading) {
        loadingId = this.components.loading.showChartSkeleton(containerId, { 
          type: chartType,
          height: options.height || 400 
        });
      }

      // Check for empty data
      if (showEmptyStates && (!data || this.isEmptyData(data))) {
        if (loadingId) this.components.loading.hideLoading(loadingId);
        this.components.empty.showChartEmptyState(containerId, { chartType });
        return null;
      }

      // Create responsive chart
      const chartConfig = this.generateChartConfig(data, chartType, options);
      let chartId = null;

      if (responsive) {
        chartId = this.components.charts.createResponsiveChart(containerId, chartConfig, {
          showControls: options.showControls !== false,
          showLegend: options.showLegend !== false,
          showExport: options.showExport !== false
        });
      }

      // Hide loading state
      if (loadingId) {
        this.components.loading.hideLoading(loadingId);
      }

      // Show success feedback
      this.components.feedback.showSuccess(
        'Chart Created',
        `${chartType.charAt(0).toUpperCase() + chartType.slice(1)} chart generated successfully`
      );

      return chartId;

    } catch (error) {
      // Hide loading state
      if (loadingId) {
        this.components.loading.hideLoading(loadingId);
      }

      // Show error state
      if (showErrorStates) {
        this.components.errors.handleError({
          type: 'api',
          message: 'Failed to create chart',
          error,
          context: { 
            containerId,
            chartType,
            retryFunction: () => this.createEnhancedChart(containerId, data, options)
          }
        });
      }

      throw error;
    }
  }

  /**
   * Check if data is empty
   */
  isEmptyData(data) {
    if (!data) return true;
    if (Array.isArray(data)) return data.length === 0;
    if (typeof data === 'object') return Object.keys(data).length === 0;
    return false;
  }

  /**
   * Generate chart configuration
   */
  generateChartConfig(data, chartType, options) {
    const baseConfig = {
      type: chartType,
      data: this.processChartData(data, chartType),
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top'
          },
          title: {
            display: true,
            text: options.title || `${chartType} Chart`
          }
        }
      }
    };

    return baseConfig;
  }

  /**
   * Process chart data
   */
  processChartData(data, chartType) {
    // This would contain specific data processing logic
    // For now, return the data as-is
    return data;
  }

  /**
   * Handle load example data event
   */
  handleLoadExampleData(detail) {
    const { chartType, data, exampleType } = detail;
    
    // Show progress
    this.components.feedback.showInfo('Loading Example', `Loading ${exampleType} example data`);
    
    // Simulate loading delay
    setTimeout(() => {
      // Find data input and populate
      const dataInput = document.getElementById('data-input') || document.querySelector('textarea');
      if (dataInput) {
        dataInput.value = data;
        dataInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
      
      this.components.feedback.showSuccess('Example Loaded', 'Example data has been loaded');
    }, 1000);
  }

  /**
   * Show data import dialog
   */
  showDataImportDialog() {
    this.components.feedback.showConfirmation({
      title: 'Import Data',
      message: 'Choose how you want to import your data',
      type: 'info',
      confirmText: 'Upload File',
      cancelText: 'Paste Data',
      onConfirm: () => {
        // Trigger file upload
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.csv,.json,.xlsx';
        fileInput.onchange = (e) => this.handleFileUpload(e.target.files[0]);
        fileInput.click();
      },
      onCancel: () => {
        // Show paste area
        this.showPasteArea();
      }
    });
  }

  /**
   * Handle file upload
   */
  async handleFileUpload(file) {
    if (!file) return;

    this.components.feedback.showInfo('Uploading', `Processing ${file.name}...`);
    
    try {
      // Simulate file processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      this.components.feedback.showSuccess('Upload Complete', `${file.name} has been processed`);
    } catch (error) {
      this.components.errors.handleError({
        type: 'validation',
        message: 'Failed to process file',
        error
      });
    }
  }

  /**
   * Show paste area
   */
  showPasteArea() {
    this.components.feedback.showInfo('Paste Data', 'Paste your data in the text area below');
    
    const dataInput = document.getElementById('data-input') || document.querySelector('textarea');
    if (dataInput) {
      dataInput.focus();
      dataInput.select();
    }
  }

  /**
   * Handle create template
   */
  handleCreateTemplate() {
    this.components.feedback.showConfirmation({
      title: 'Create Template',
      message: 'Save current chart configuration as a template?',
      type: 'info',
      confirmText: 'Save Template',
      cancelText: 'Cancel',
      onConfirm: () => {
        this.components.feedback.showSuccess('Template Created', 'Your template has been saved');
      }
    });
  }

  /**
   * Get comprehensive performance metrics
   */
  getPerformanceMetrics() {
    return {
      loading: this.components.loading.getStats(),
      errors: this.components.errors.getErrorStats(),
      feedback: this.components.feedback.getStats(),
      mobile: this.components.mobile.getStats(),
      charts: this.components.charts.getStats(),
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Show UX dashboard for debugging
   */
  showUXDashboard() {
    const metrics = this.getPerformanceMetrics();
    
    const dashboardHTML = `
      <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" id="ux-dashboard">
        <div class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
          <h2 class="text-xl font-bold mb-4">UX Performance Dashboard</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div class="bg-blue-50 p-4 rounded-lg">
              <h3 class="font-semibold text-blue-900 mb-2">Loading States</h3>
              <p class="text-sm text-blue-700">Active: ${metrics.loading.activeLoaders}</p>
              <p class="text-sm text-blue-700">Types: ${metrics.loading.types.join(', ')}</p>
            </div>
            
            <div class="bg-red-50 p-4 rounded-lg">
              <h3 class="font-semibold text-red-900 mb-2">Errors</h3>
              <p class="text-sm text-red-700">Total: ${metrics.errors.totalErrors}</p>
              <p class="text-sm text-red-700">Retries: ${metrics.errors.retryAttempts}</p>
            </div>
            
            <div class="bg-green-50 p-4 rounded-lg">
              <h3 class="font-semibold text-green-900 mb-2">Feedback</h3>
              <p class="text-sm text-green-700">Active: ${metrics.feedback.activeNotifications}</p>
              <p class="text-sm text-green-700">Confirmations: ${metrics.feedback.pendingConfirmations}</p>
            </div>
            
            <div class="bg-purple-50 p-4 rounded-lg">
              <h3 class="font-semibold text-purple-900 mb-2">Mobile</h3>
              <p class="text-sm text-purple-700">Mobile: ${metrics.mobile.isMobile ? 'Yes' : 'No'}</p>
              <p class="text-sm text-purple-700">Width: ${metrics.mobile.viewportWidth}px</p>
            </div>
          </div>
          
          <div class="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 class="font-semibold text-gray-900 mb-2">Charts</h3>
            <p class="text-sm text-gray-700">Total: ${metrics.charts.totalCharts}</p>
            <p class="text-sm text-gray-700">Breakpoint: ${metrics.charts.currentBreakpoint}</p>
          </div>
          
          <div class="flex justify-end gap-2">
            <button onclick="uxIntegration.refreshMetrics()" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Refresh
            </button>
            <button onclick="document.getElementById('ux-dashboard').remove()" class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
              Close
            </button>
          </div>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', dashboardHTML);
  }

  /**
   * Refresh metrics dashboard
   */
  refreshMetrics() {
    // This would update the dashboard with new metrics
    console.log('Refreshing UX metrics...');
    this.showUXDashboard(); // Simple refresh by recreating
  }

  /**
   * Cleanup all components
   */
  cleanup() {
    // Clear intervals
    if (this.loadingCheckInterval) {
      clearInterval(this.loadingCheckInterval);
    }

    // Cleanup all components
    this.components.charts.destroyAllCharts();
    this.components.loading.clearAll();
    this.components.feedback.clearAllNotifications();
    this.components.feedback.clearAllConfirmations();
    this.components.errors.clearHistory();

    console.log('🧹 UX System cleaned up');
  }

  /**
   * Get component by name
   */
  getComponent(name) {
    return this.components[name];
  }

  /**
   * Check if system is initialized
   */
  isReady() {
    return this.isInitialized;
  }
}

// Export singleton instance
export const uxIntegration = new UXIntegration();

// Make available globally for easy access
window.uxIntegration = uxIntegration;

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    uxIntegration.init();
  });
} else {
  uxIntegration.init();
}

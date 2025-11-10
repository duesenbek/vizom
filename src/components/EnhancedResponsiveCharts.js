/**
 * Enhanced Responsive Charts Component
 * Fully responsive chart rendering with mobile optimization and adaptive layouts
 */

class EnhancedResponsiveCharts {
  constructor() {
    this.charts = new Map();
    this.breakpoints = {
      mobile: 480,
      tablet: 768,
      desktop: 1024,
      large: 1440
    };
    this.currentBreakpoint = this.getCurrentBreakpoint();
    this.init();
  }

  init() {
    this.setupResponsiveStyles();
    this.setupResizeHandlers();
    this.setupOrientationHandlers();
  }

  /**
   * Setup responsive chart styles
   */
  setupResponsiveStyles() {
    if (document.getElementById('responsive-charts-styles')) return;

    const styles = document.createElement('style');
    styles.id = 'responsive-charts-styles';
    styles.textContent = `
      /* Responsive Chart Container */
      .responsive-chart-container {
        position: relative;
        width: 100%;
        background: white;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
      }

      .chart-canvas-wrapper {
        position: relative;
        width: 100%;
        height: 400px;
      }

      /* Mobile Chart Optimizations */
      @media (max-width: 768px) {
        .chart-canvas-wrapper {
          height: 300px;
        }
        
        .responsive-chart-container {
          border-radius: 8px;
          margin: 8px;
        }
      }

      @media (max-width: 480px) {
        .chart-canvas-wrapper {
          height: 250px;
        }
      }

      /* Chart Controls */
      .chart-controls {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 16px;
        background: #f9fafb;
        border-bottom: 1px solid #e5e7eb;
        flex-wrap: wrap;
        gap: 8px;
      }

      .chart-control-group {
        display: flex;
        gap: 8px;
        align-items: center;
      }

      .chart-control-button {
        background: white;
        border: 1px solid #d1d5db;
        border-radius: 6px;
        padding: 6px 12px;
        font-size: 12px;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        gap: 4px;
        min-height: 32px;
      }

      .chart-control-button:hover {
        background: #f3f4f6;
        border-color: #9ca3af;
      }

      .chart-control-button.active {
        background: #3b82f6;
        color: white;
        border-color: #3b82f6;
      }

      /* Mobile Chart Controls */
      @media (max-width: 768px) {
        .chart-controls {
          padding: 8px 12px;
          flex-direction: column;
          align-items: stretch;
        }
        
        .chart-control-group {
          justify-content: center;
        }
        
        .chart-control-button {
          flex: 1;
          justify-content: center;
          min-height: 40px;
          font-size: 14px;
        }
      }

      /* Chart Legend */
      .chart-legend {
        padding: 12px 16px;
        background: white;
        border-top: 1px solid #e5e7eb;
      }

      .chart-legend-items {
        display: flex;
        flex-wrap: wrap;
        gap: 16px;
        justify-content: center;
      }

      .chart-legend-item {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 12px;
        color: #374151;
        cursor: pointer;
        transition: opacity 0.2s ease;
      }

      .chart-legend-item:hover {
        opacity: 0.7;
      }

      .chart-legend-item.disabled {
        opacity: 0.3;
      }

      .chart-legend-color {
        width: 12px;
        height: 12px;
        border-radius: 2px;
      }

      /* Mobile Legend */
      @media (max-width: 768px) {
        .chart-legend {
          padding: 8px 12px;
        }
        
        .chart-legend-items {
          gap: 12px;
        }
        
        .chart-legend-item {
          font-size: 11px;
        }
      }

      /* Chart Tooltip */
      .chart-tooltip {
        position: absolute;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 12px;
        pointer-events: none;
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.2s ease;
      }

      .chart-tooltip.show {
        opacity: 1;
      }

      /* Chart Loading State */
      .chart-loading {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(255, 255, 255, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 100;
      }

      .chart-loading-spinner {
        width: 32px;
        height: 32px;
        border: 3px solid #e5e7eb;
        border-top: 3px solid #3b82f6;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }

      /* Chart Error State */
      .chart-error {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: #fef2f2;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 100;
        padding: 20px;
        text-align: center;
      }

      .chart-error-icon {
        width: 48px;
        height: 48px;
        background: #ef4444;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        margin-bottom: 12px;
      }

      .chart-error-message {
        color: #991b1b;
        font-size: 14px;
        margin-bottom: 16px;
      }

      .chart-error-retry {
        background: #ef4444;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 6px;
        font-size: 12px;
        cursor: pointer;
      }

      /* Responsive Chart Types */
      .chart-type-selector {
        display: flex;
        gap: 4px;
        background: #f3f4f6;
        padding: 4px;
        border-radius: 8px;
      }

      .chart-type-button {
        background: transparent;
        border: none;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 12px;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .chart-type-button.active {
        background: white;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }

      /* Mobile Chart Type Selector */
      @media (max-width: 768px) {
        .chart-type-selector {
          flex-wrap: wrap;
          justify-content: center;
        }
        
        .chart-type-button {
          flex: 1;
          min-width: 80px;
          justify-content: center;
          font-size: 11px;
          padding: 10px 8px;
        }
      }

      /* Chart Export Menu */
      .chart-export-menu {
        position: absolute;
        top: 12px;
        right: 12px;
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        z-index: 200;
        display: none;
      }

      .chart-export-menu.show {
        display: block;
      }

      .chart-export-option {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        font-size: 12px;
        cursor: pointer;
        transition: background 0.2s ease;
        border-bottom: 1px solid #f3f4f6;
      }

      .chart-export-option:last-child {
        border-bottom: none;
      }

      .chart-export-option:hover {
        background: #f9fafb;
      }

      /* Animations */
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .chart-animate-in {
        animation: fadeIn 0.3s ease-out;
      }

      /* Print Styles */
      @media print {
        .chart-controls,
        .chart-export-menu {
          display: none !important;
        }
        
        .responsive-chart-container {
          box-shadow: none;
          border: 1px solid #000;
        }
        
        .chart-canvas-wrapper {
          height: 300px !important;
        }
      }
    `;
    document.head.appendChild(styles);
  }

  /**
   * Setup resize handlers
   */
  setupResizeHandlers() {
    let resizeTimeout;
    
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.handleResize();
      }, 250);
    });
  }

  /**
   * Setup orientation handlers
   */
  setupOrientationHandlers() {
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        this.handleResize();
      }, 500);
    });
  }

  /**
   * Handle window resize
   */
  handleResize() {
    const newBreakpoint = this.getCurrentBreakpoint();
    
    if (newBreakpoint !== this.currentBreakpoint) {
      this.currentBreakpoint = newBreakpoint;
      this.updateChartsForBreakpoint();
    }
    
    // Update all chart sizes
    this.charts.forEach((chartData, chartId) => {
      this.updateChartSize(chartId);
    });
  }

  /**
   * Get current breakpoint
   */
  getCurrentBreakpoint() {
    const width = window.innerWidth;
    
    if (width <= this.breakpoints.mobile) return 'mobile';
    if (width <= this.breakpoints.tablet) return 'tablet';
    if (width <= this.breakpoints.desktop) return 'desktop';
    return 'large';
  }

  /**
   * Create responsive chart
   */
  createResponsiveChart(containerId, config, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) return null;

    const chartId = `chart-${Date.now()}`;
    
    // Create responsive chart structure
    const chartHTML = this.generateChartHTML(chartId, options);
    container.innerHTML = chartHTML;

    // Get canvas element
    const canvas = container.querySelector('canvas');
    if (!canvas) return null;

    // Apply responsive configuration
    const responsiveConfig = this.getResponsiveConfig(config, this.currentBreakpoint);
    
    // Create chart
    const chart = new Chart(canvas, responsiveConfig);
    
    // Store chart data
    this.charts.set(chartId, {
      chart,
      container,
      config,
      options,
      breakpoint: this.currentBreakpoint
    });

    // Setup chart interactions
    this.setupChartInteractions(chartId);

    return chartId;
  }

  /**
   * Generate chart HTML structure
   */
  generateChartHTML(chartId, options = {}) {
    const {
      showControls = true,
      showLegend = true,
      showExport = true,
      chartTypes = ['bar', 'line', 'pie']
    } = options;

    return `
      <div class="responsive-chart-container chart-animate-in" data-chart-id="${chartId}">
        ${showControls ? `
          <div class="chart-controls">
            <div class="chart-control-group">
              <div class="chart-type-selector">
                ${chartTypes.map(type => `
                  <button class="chart-type-button ${type === 'bar' ? 'active' : ''}" 
                          data-type="${type}" onclick="responsiveCharts.changeChartType('${chartId}', '${type}')">
                    <i class="fas fa-chart-${this.getChartIcon(type)}"></i>
                    <span class="hidden sm:inline">${type.charAt(0).toUpperCase() + type.slice(1)}</span>
                  </button>
                `).join('')}
              </div>
            </div>
            
            <div class="chart-control-group">
              <button class="chart-control-button" onclick="responsiveCharts.toggleFullscreen('${chartId}')">
                <i class="fas fa-expand"></i>
                <span class="hidden sm:inline">Fullscreen</span>
              </button>
              
              ${showExport ? `
                <button class="chart-control-button" onclick="responsiveCharts.toggleExportMenu('${chartId}')">
                  <i class="fas fa-download"></i>
                  <span class="hidden sm:inline">Export</span>
                </button>
              ` : ''}
              
              <button class="chart-control-button" onclick="responsiveCharts.refreshChart('${chartId}')">
                <i class="fas fa-sync"></i>
                <span class="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>
        ` : ''}
        
        <div class="chart-canvas-wrapper">
          <canvas id="${chartId}-canvas"></canvas>
          <div class="chart-loading" style="display: none;">
            <div class="chart-loading-spinner"></div>
          </div>
          <div class="chart-error" style="display: none;">
            <div class="chart-error-icon">
              <i class="fas fa-exclamation-triangle"></i>
            </div>
            <div class="chart-error-message">Failed to load chart</div>
            <button class="chart-error-retry" onclick="responsiveCharts.retryChart('${chartId}')">
              Retry
            </button>
          </div>
        </div>
        
        ${showLegend ? `
          <div class="chart-legend" id="${chartId}-legend">
            <div class="chart-legend-items">
              <!-- Legend items will be populated dynamically -->
            </div>
          </div>
        ` : ''}
        
        ${showExport ? `
          <div class="chart-export-menu" id="${chartId}-export-menu">
            <div class="chart-export-option" onclick="responsiveCharts.exportChart('${chartId}', 'png')">
              <i class="fas fa-image"></i> Export as PNG
            </div>
            <div class="chart-export-option" onclick="responsiveCharts.exportChart('${chartId}', 'jpg')">
              <i class="fas fa-file-image"></i> Export as JPG
            </div>
            <div class="chart-export-option" onclick="responsiveCharts.exportChart('${chartId}', 'svg')">
              <i class="fas fa-vector-square"></i> Export as SVG
            </div>
            <div class="chart-export-option" onclick="responsiveCharts.exportChart('${chartId}', 'pdf')">
              <i class="fas fa-file-pdf"></i> Export as PDF
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }

  /**
   * Get responsive chart configuration
   */
  getResponsiveConfig(baseConfig, breakpoint) {
    const responsiveConfig = JSON.parse(JSON.stringify(baseConfig));
    
    // Apply breakpoint-specific optimizations
    switch (breakpoint) {
      case 'mobile':
        responsiveConfig.options.responsive = true;
        responsiveConfig.options.maintainAspectRatio = false;
        responsiveConfig.options.plugins.legend.display = false; // Hide legend, use custom
        responsiveConfig.options.plugins.title.display = false;
        
        // Adjust font sizes
        if (responsiveConfig.options.plugins.tooltip) {
          responsiveConfig.options.plugins.tooltip.bodyFont = { size: 11 };
          responsiveConfig.options.plugins.tooltip.titleFont = { size: 12 };
        }
        
        // Simplify grid
        if (responsiveConfig.options.scales) {
          Object.values(responsiveConfig.options.scales).forEach(scale => {
            if (scale.ticks) scale.ticks.font = { size: 10 };
            if (scale.grid) scale.grid.display = false;
          });
        }
        break;
        
      case 'tablet':
        responsiveConfig.options.responsive = true;
        responsiveConfig.options.maintainAspectRatio = false;
        responsiveConfig.options.plugins.legend.position = 'bottom';
        
        // Adjust font sizes
        if (responsiveConfig.options.plugins.tooltip) {
          responsiveConfig.options.plugins.tooltip.bodyFont = { size: 12 };
          responsiveConfig.options.plugins.tooltip.titleFont = { size: 13 };
        }
        break;
        
      case 'desktop':
      case 'large':
        responsiveConfig.options.responsive = true;
        responsiveConfig.options.maintainAspectRatio = false;
        responsiveConfig.options.plugins.legend.position = 'top';
        break;
    }
    
    return responsiveConfig;
  }

  /**
   * Update charts for breakpoint change
   */
  updateChartsForBreakpoint() {
    this.charts.forEach((chartData, chartId) => {
      const { chart, config } = chartData;
      const newConfig = this.getResponsiveConfig(config, this.currentBreakpoint);
      
      // Update chart configuration
      chart.options = newConfig.options;
      chart.update();
      
      // Update breakpoint in data
      chartData.breakpoint = this.currentBreakpoint;
      
      // Update legend
      this.updateLegend(chartId);
    });
  }

  /**
   * Update chart size
   */
  updateChartSize(chartId) {
    const chartData = this.charts.get(chartId);
    if (!chartData) return;
    
    const { chart } = chartData;
    chart.resize();
  }

  /**
   * Setup chart interactions
   */
  setupChartInteractions(chartId) {
    const chartData = this.charts.get(chartId);
    if (!chartData) return;
    
    const { chart, container } = chartData;
    
    // Update legend
    this.updateLegend(chartId);
    
    // Setup touch interactions for mobile
    if (this.currentBreakpoint === 'mobile') {
      this.setupMobileTouchInteractions(chartId);
    }
  }

  /**
   * Update custom legend
   */
  updateLegend(chartId) {
    const chartData = this.charts.get(chartId);
    if (!chartData) return;
    
    const { chart } = chartData;
    const legendContainer = document.getElementById(`${chartId}-legend`);
    if (!legendContainer) return;
    
    const legendItems = legendContainer.querySelector('.chart-legend-items');
    if (!legendItems) return;
    
    legendItems.innerHTML = '';
    
    if (chart.data.datasets) {
      chart.data.datasets.forEach((dataset, index) => {
        const legendItem = document.createElement('div');
        legendItem.className = 'chart-legend-item';
        legendItem.innerHTML = `
          <div class="chart-legend-color" style="background: ${dataset.backgroundColor || dataset.borderColor}"></div>
          <span>${dataset.label || `Dataset ${index + 1}`}</span>
        `;
        
        legendItem.addEventListener('click', () => {
          const meta = chart.getDatasetMeta(index);
          meta.hidden = !meta.hidden;
          chart.update();
          legendItem.classList.toggle('disabled', meta.hidden);
        });
        
        legendItems.appendChild(legendItem);
      });
    }
  }

  /**
   * Setup mobile touch interactions
   */
  setupMobileTouchInteractions(chartId) {
    const chartData = this.charts.get(chartId);
    if (!chartData) return;
    
    const { chart } = chartData;
    
    // Enable touch interactions
    chart.options.plugins.tooltip.intersect = false;
    chart.options.plugins.tooltip.mode = 'nearest';
    
    // Optimize for touch
    chart.options.events = ['touchstart', 'touchmove'];
  }

  /**
   * Change chart type
   */
  changeChartType(chartId, newType) {
    const chartData = this.charts.get(chartId);
    if (!chartData) return;
    
    const { chart, config } = chartData;
    
    // Update button states
    const container = chartData.container;
    container.querySelectorAll('.chart-type-button').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.type === newType);
    });
    
    // Show loading
    this.showChartLoading(chartId);
    
    // Simulate chart type change (in real app, this would regenerate the chart)
    setTimeout(() => {
      config.type = newType;
      const newConfig = this.getResponsiveConfig(config, this.currentBreakpoint);
      
      chart.destroy();
      const canvas = container.querySelector('canvas');
      const newChart = new Chart(canvas, newConfig);
      
      chartData.chart = newChart;
      chartData.config = config;
      
      this.hideChartLoading(chartId);
      this.setupChartInteractions(chartId);
    }, 500);
  }

  /**
   * Toggle fullscreen
   */
  toggleFullscreen(chartId) {
    const chartData = this.charts.get(chartId);
    if (!chartData) return;
    
    const container = chartData.container;
    
    if (!document.fullscreenElement) {
      container.requestFullscreen().catch(err => {
        console.error('Error attempting to enable fullscreen:', err);
      });
    } else {
      document.exitFullscreen();
    }
  }

  /**
   * Toggle export menu
   */
  toggleExportMenu(chartId) {
    const menu = document.getElementById(`${chartId}-export-menu`);
    if (menu) {
      menu.classList.toggle('show');
    }
  }

  /**
   * Refresh chart
   */
  refreshChart(chartId) {
    const chartData = this.charts.get(chartId);
    if (!chartData) return;
    
    this.showChartLoading(chartId);
    
    setTimeout(() => {
      const { chart } = chartData;
      chart.update();
      this.hideChartLoading(chartId);
    }, 500);
  }

  /**
   * Export chart
   */
  async exportChart(chartId, format) {
    const chartData = this.charts.get(chartId);
    if (!chartData) return;
    
    const { chart } = chartData;
    
    try {
      if (format === 'png' || format === 'jpg') {
        const url = chart.toBase64Image();
        const link = document.createElement('a');
        link.download = `chart.${format}`;
        link.href = url;
        link.click();
      } else {
        // For other formats, you'd need additional libraries
        console.log(`Exporting as ${format} not implemented yet`);
      }
      
      // Close export menu
      this.toggleExportMenu(chartId);
    } catch (error) {
      console.error('Export failed:', error);
    }
  }

  /**
   * Show chart loading
   */
  showChartLoading(chartId) {
    const container = document.querySelector(`[data-chart-id="${chartId}"]`);
    if (container) {
      const loading = container.querySelector('.chart-loading');
      if (loading) loading.style.display = 'flex';
    }
  }

  /**
   * Hide chart loading
   */
  hideChartLoading(chartId) {
    const container = document.querySelector(`[data-chart-id="${chartId}"]`);
    if (container) {
      const loading = container.querySelector('.chart-loading');
      if (loading) loading.style.display = 'none';
    }
  }

  /**
   * Show chart error
   */
  showChartError(chartId, message = 'Failed to load chart') {
    const container = document.querySelector(`[data-chart-id="${chartId}"]`);
    if (container) {
      const error = container.querySelector('.chart-error');
      const errorMessage = container.querySelector('.chart-error-message');
      if (error) error.style.display = 'flex';
      if (errorMessage) errorMessage.textContent = message;
    }
  }

  /**
   * Hide chart error
   */
  hideChartError(chartId) {
    const container = document.querySelector(`[data-chart-id="${chartId}"]`);
    if (container) {
      const error = container.querySelector('.chart-error');
      if (error) error.style.display = 'none';
    }
  }

  /**
   * Retry chart loading
   */
  retryChart(chartId) {
    this.hideChartError(chartId);
    this.refreshChart(chartId);
  }

  /**
   * Get chart icon for type
   */
  getChartIcon(type) {
    const icons = {
      bar: 'column',
      line: 'line',
      pie: 'pie',
      doughnut: 'chart-pie',
      area: 'area-chart',
      scatter: 'braille'
    };
    return icons[type] || 'chart-simple';
  }

  /**
   * Get responsive charts statistics
   */
  getStats() {
    return {
      totalCharts: this.charts.size,
      currentBreakpoint: this.currentBreakpoint,
      chartsByBreakpoint: Array.from(this.charts.values()).map(c => c.breakpoint)
    };
  }

  /**
   * Destroy chart
   */
  destroyChart(chartId) {
    const chartData = this.charts.get(chartId);
    if (!chartData) return;
    
    const { chart } = chartData;
    chart.destroy();
    this.charts.delete(chartId);
  }

  /**
   * Destroy all charts
   */
  destroyAllCharts() {
    this.charts.forEach((_, chartId) => {
      this.destroyChart(chartId);
    });
  }
}

// Export singleton instance
export const responsiveCharts = new EnhancedResponsiveCharts();

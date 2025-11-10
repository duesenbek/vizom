/**
 * Chart Renderer Module with Memory Management
 * Handles Chart.js rendering and configuration with proper cleanup
 */

export class ChartRenderer {
  constructor(container) {
    this.container = container;
    this.charts = new Map(); // Track chart instances for cleanup
    this.eventListeners = new Set(); // Track event listeners
    this.resizeObserver = null;
    this.intersectionObserver = null;
    
    // Setup performance monitoring
    this.renderCount = 0;
    this.lastRenderTime = 0;
    
    // Setup cleanup on page unload
    this.setupCleanupHandlers();
  }

  /**
   * Setup cleanup handlers for memory management
   */
  setupCleanupHandlers() {
    // Cleanup on page unload
    const cleanup = () => this.destroy();
    
    window.addEventListener('beforeunload', cleanup);
    this.eventListeners.add({
      target: window,
      event: 'beforeunload',
      handler: cleanup
    });

    // Cleanup when container is removed from DOM
    if (this.container) {
      this.intersectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) {
            // Chart is not visible, consider pausing animations
            this.pauseAnimations();
          } else {
            this.resumeAnimations();
          }
        });
      });
      
      this.intersectionObserver.observe(this.container);
    }
  }

  /**
   * Render a single chart with performance tracking
   */
  render(config, canvasId = null) {
    const startTime = performance.now();
    
    try {
      // Clear previous content
      this.clear();

      // Create canvas element
      const canvas = document.createElement('canvas');
      if (canvasId) canvas.id = canvasId;
      
      this.container.appendChild(canvas);

      // Create Chart.js instance with optimizations
      const chartConfig = {
        ...config,
        options: {
          ...config.options,
          // Performance optimizations
          animation: {
            duration: this.shouldAnimate() ? 750 : 0,
            easing: 'easeInOutQuart'
          },
          responsive: true,
          maintainAspectRatio: false,
          // Disable resize events during rapid updates
          onResize: debounce((chart, size) => {
            // Handle resize with debouncing
          }, 100)
        }
      };

      const chart = new Chart(canvas.getContext('2d'), chartConfig);
      this.charts.set(canvasId || 'default', chart);

      // Track performance metrics
      this.renderCount++;
      this.lastRenderTime = performance.now() - startTime;
      
      if (this.lastRenderTime > 100) {
        console.warn(`Slow chart render detected: ${this.lastRenderTime.toFixed(2)}ms`);
      }

      return chart;
    } catch (error) {
      console.error('Chart render error:', error);
      this.showError('Failed to render chart');
      throw error;
    }
  }

  /**
   * Render dashboard with multiple charts efficiently
   */
  renderDashboard(layout, charts) {
    const startTime = performance.now();
    
    try {
      // Clear previous content
      this.clear();

      // Inject layout HTML
      this.container.innerHTML = sanitize(layout);

      // Use requestAnimationFrame for smooth rendering
      requestAnimationFrame(() => {
        // Render each chart with staggered timing
        charts.forEach(({ canvasId, config }, index) => {
          setTimeout(() => {
            const canvas = document.getElementById(canvasId);
            if (canvas) {
              const chart = new Chart(canvas.getContext('2d'), {
                ...config,
                options: {
                  ...config.options,
                  animation: {
                    duration: 600,
                    delay: index * 100 // Stagger animations
                  }
                }
              });
              this.charts.set(canvasId, chart);
            }
          }, index * 50); // Stagger creation
        });
      });

      this.lastRenderTime = performance.now() - startTime;
      return this.lastRenderTime;
    } catch (error) {
      console.error('Dashboard render error:', error);
      this.showError('Failed to render dashboard');
      throw error;
    }
  }

  /**
   * Check if animations should be enabled based on performance
   */
  shouldAnimate() {
    // Disable animations if renders are taking too long
    return this.lastRenderTime < 50 && this.renderCount < 10;
  }

  /**
   * Pause animations for performance
   */
  pauseAnimations() {
    this.charts.forEach(chart => {
      if (chart && chart.stop) {
        chart.stop();
      }
    });
  }

  /**
   * Resume animations
   */
  resumeAnimations() {
    this.charts.forEach(chart => {
      if (chart && chart.render) {
        chart.render();
      }
    });
  }

  /**
   * Clear all charts and cleanup
   */
  clear() {
    // Destroy all chart instances
    this.charts.forEach((chart, id) => {
      if (chart && typeof chart.destroy === 'function') {
        chart.destroy();
      }
    });
    this.charts.clear();

    // Clear container content
    if (this.container) {
      this.container.innerHTML = '';
    }
  }

  /**
   * Show error message
   */
  showError(message) {
    if (this.container) {
      this.container.innerHTML = `
        <div class="flex items-center justify-center h-64 bg-red-50 rounded-lg border border-red-200">
          <div class="text-center">
            <i class="fas fa-exclamation-triangle text-red-500 text-2xl mb-2"></i>
            <p class="text-red-700">${message}</p>
          </div>
        </div>
      `;
    }
  }

  /**
   * Get performance metrics
   */
  getMetrics() {
    return {
      renderCount: this.renderCount,
      lastRenderTime: this.lastRenderTime,
      activeCharts: this.charts.size,
      averageRenderTime: this.renderCount > 0 ? this.lastRenderTime / this.renderCount : 0
    };
  }

  /**
   * Complete cleanup to prevent memory leaks
   */
  destroy() {
    // Clear all charts
    this.clear();

    // Remove all event listeners
    this.eventListeners.forEach(({ target, event, handler }) => {
      target.removeEventListener(event, handler);
    });
    this.eventListeners.clear();

    // Disconnect observers
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }

    // Clear references
    this.container = null;
    this.charts.clear();
  }
}

/**
 * Debounce utility for performance optimization
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Export singleton for global usage
export const globalChartRenderer = new ChartRenderer(null);
        const canvas = this.container.querySelector(`#${canvasId}`);
        if (canvas) {
          const chart = new Chart(canvas.getContext('2d'), config);
          this.charts.set(canvasId, chart);
        } else {
          console.warn(`Canvas #${canvasId} not found in layout`);
        }
      });
    } catch (error) {
      console.error('Dashboard render error:', error);
      this.showError('Failed to render dashboard');
      throw error;
    }
  }

  /**
   * Render HTML table
   */
  renderTable(html) {
    try {
      this.clear();
      this.container.innerHTML = sanitize(html);
    } catch (error) {
      console.error('Table render error:', error);
      this.showError('Failed to render table');
      throw error;
    }
  }

  /**
   * Clear all charts and content
   */
  clear() {
    // Destroy all Chart.js instances
    this.charts.forEach(chart => chart.destroy());
    this.charts.clear();

    // Clear container
    this.container.innerHTML = '';
  }

  /**
   * Show error message
   */
  showError(message) {
    this.container.innerHTML = sanitize(`
      <div style="
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 300px;
        padding: 2rem;
        text-align: center;
      ">
        <div style="
          max-width: 400px;
          padding: 1.5rem;
          border-radius: 1rem;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #991b1b;
        ">
          <svg style="width: 48px; height: 48px; margin: 0 auto 1rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <p style="font-weight: 600; margin-bottom: 0.5rem;">Rendering Error</p>
          <p style="font-size: 0.875rem;">${message}</p>
        </div>
      </div>
    `);
  }

  /**
   * Show loading state
   */
  showLoading() {
    this.container.innerHTML = sanitize(`
      <div style="
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 300px;
        padding: 2rem;
      ">
        <div style="text-align: center;">
          <div style="
            width: 48px;
            height: 48px;
            margin: 0 auto 1rem;
            border: 3px solid rgba(37, 99, 235, 0.2);
            border-top-color: #2563eb;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
          "></div>
          <p style="color: #64748b; font-size: 0.875rem;">Generating visualization...</p>
        </div>
      </div>
    `);
  }

  /**
   * Export chart as image
   */
  async exportAsImage(format = 'png') {
    try {
      const canvas = this.container.querySelector('canvas');
      if (!canvas) throw new Error('No canvas found');

      return canvas.toDataURL(`image/${format}`);
    } catch (error) {
      console.error('Export error:', error);
      throw error;
    }
  }

  /**
   * Get chart data for CSV export
   */
  getChartData() {
    const data = [];
    this.charts.forEach((chart, id) => {
      if (chart.data) {
        data.push({
          id,
          labels: chart.data.labels,
          datasets: chart.data.datasets,
        });
      }
    });
    return data;
  }
}

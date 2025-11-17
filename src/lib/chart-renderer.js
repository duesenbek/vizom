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
    // Respect user motion preferences
    this.reduceMotion = typeof window !== 'undefined' && typeof window.matchMedia === 'function'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;
    if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
      const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
      const onChange = (e) => { this.reduceMotion = !!e.matches; };
      if (typeof mql.addEventListener === 'function') mql.addEventListener('change', onChange);
      else if (typeof mql.addListener === 'function') mql.addListener(onChange);
    }
    
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
            duration: this.reduceMotion ? 0 : (this.shouldAnimate() ? 750 : 0),
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
          const delay = this.reduceMotion ? 0 : index * 50; // Stagger creation conditionally
          setTimeout(() => {
            const canvas = document.getElementById(canvasId);
            if (canvas) {
              const chart = new Chart(canvas.getContext('2d'), {
                ...config,
                options: {
                  ...config.options,
                  animation: {
                    duration: this.reduceMotion ? 0 : 600,
                    delay: this.reduceMotion ? 0 : index * 100 // Stagger animations conditionally
                  }
                }
              });
              this.charts.set(canvasId, chart);
            }
          }, delay); // Stagger creation conditionally
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

  showLoading() {
    if (!this.container) return;
    this.container.innerHTML = sanitize(`
      <div class="flex items-center justify-center min-h-[300px] p-8">
        <div class="text-center">
          <div class="mx-auto mb-4 h-12 w-12 rounded-full border-4 border-blue-600/80 border-t-transparent animate-spin"></div>
          <p class="text-slate-500 text-sm">Generating visualization...</p>
        </div>
      </div>
    `);
    return {
      hide: () => { if (this.container) this.container.innerHTML = ''; }
    };
  }

  async exportAsImage(format = 'png') {
    try {
      const canvas = this.container?.querySelector('canvas');
      if (!canvas) throw new Error('No canvas found');
      return canvas.toDataURL(`image/${format}`);
    } catch (error) {
      console.error('Export error:', error);
      throw error;
    }
  }

  getChartData() {
    const data = [];
    this.charts.forEach((chart, id) => {
      if (chart?.data) {
        data.push({ id, labels: chart.data.labels, datasets: chart.data.datasets });
      }
    });
    return data;
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

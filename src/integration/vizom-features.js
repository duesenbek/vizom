/**
 * Vizom Features Integration
 * Integrates all new features (export, templates, validation, customization, save/load) with existing codebase
 */

import { chartExport } from './services/chart-export.js';
import { chartTemplates } from './services/chart-templates.js';
import { validationAndErrorHandling } from './services/validation-error-handling.js';
import { chartCustomization } from './services/chart-customization.js';
import { chartSaveLoad } from './services/chart-save-load.js';

class VizomFeaturesIntegration {
  constructor() {
    this.services = {
      export: chartExport,
      templates: chartTemplates,
      validation: validationAndErrorHandling,
      customization: chartCustomization,
      saveLoad: chartSaveLoad
    };
    
    this.isInitialized = false;
    this.currentChart = null;
    this.init();
  }

  init() {
    this.setupGlobalEventListeners();
    this.setupChartIntegration();
    this.setupUIIntegration();
    this.setupAPIIntegration();
    
    this.isInitialized = true;
    console.log('✅ Vizom Features Integration initialized successfully');
  }

  /**
   * Setup global event listeners
   */
  setupGlobalEventListeners() {
    // Template selection event
    window.addEventListener('templateSelected', (e) => {
      this.handleTemplateSelection(e.detail);
    });

    // Customization change event
    window.addEventListener('customizationChanged', (e) => {
      this.handleCustomizationChange(e.detail);
    });

    // Chart save/load events
    window.addEventListener('chartLoaded', (e) => {
      this.handleChartLoad(e.detail);
    });

    window.addEventListener('chartSaved', (e) => {
      this.handleChartSave(e.detail);
    });

    // Export events
    window.addEventListener('chartExport', (e) => {
      this.handleChartExport(e.detail);
    });
  }

  /**
   * Setup chart integration
   */
  setupChartIntegration() {
    // Hook into existing chart creation
    this.interceptChartCreation();
    
    // Setup chart monitoring
    this.monitorChartChanges();
    
    // Setup chart cleanup
    this.setupChartCleanup();
  }

  /**
   * Intercept chart creation to add features
   */
  interceptChartCreation() {
    // Store original chart creation methods
    const originalMethods = {};

    // Intercept Chart.js constructor
    if (window.Chart) {
      originalMethods.Chart = window.Chart;
      window.Chart = function(context, config) {
        // Apply validation
        const validation = this.services.validation.validate('chartConfig', config);
        if (!validation.isValid) {
          console.error('Chart configuration validation failed:', validation.errors);
          this.services.validation.showUserError({
            type: 'validation',
            message: 'Invalid chart configuration',
            userMessage: validation.errors.join(', ')
          });
          return null;
        }

        // Create chart
        const chart = new originalMethods.Chart(context, config);
        
        // Store reference for features
        this.currentChart = chart;
        window.chart = chart; // Maintain backward compatibility
        
        // Add export button
        this.addExportButton(chart);
        
        // Setup customization
        this.setupChartCustomization(chart);
        
        // Setup save/load
        this.setupChartSaveLoad(chart);
        
        return chart;
      }.bind(this);
    }

    // Intercept chart renderer
    if (window.ChartRenderer) {
      const originalRender = window.ChartRenderer.prototype.render;
      window.ChartRenderer.prototype.render = function(config, canvasId) {
        // Apply validation
        const validation = this.services.validation.validate('chartConfig', config);
        if (!validation.isValid) {
          console.error('Chart configuration validation failed:', validation.errors);
          return null;
        }

        const chart = originalRender.call(this, config, canvasId);
        
        if (chart) {
          this.currentChart = chart;
          this.addExportButton(chart);
        }
        
        return chart;
      }.bind(this);
    }
  }

  /**
   * Monitor chart changes for auto-save and validation
   */
  monitorChartChanges() {
    let changeTimeout;
    
    const monitorChanges = () => {
      clearTimeout(changeTimeout);
      changeTimeout = setTimeout(() => {
        if (this.currentChart) {
          this.validateCurrentChart();
          this.checkForAutoSave();
        }
      }, 1000);
    };

    // Monitor chart updates
    if (window.Chart) {
      const originalUpdate = window.Chart.prototype.update;
      window.Chart.prototype.update = function(mode) {
        const result = originalUpdate.call(this, mode);
        monitorChanges();
        return result;
      };
    }
  }

  /**
   * Setup chart cleanup
   */
  setupChartCleanup() {
    window.addEventListener('beforeunload', () => {
      this.cleanup();
    });
  }

  /**
   * Setup UI integration
   */
  setupUIIntegration() {
    this.addFeatureButtons();
    this.setupKeyboardShortcuts();
    this.setupContextMenu();
  }

  /**
   * Add feature buttons to existing UI
   */
  addFeatureButtons() {
    // Add to generator page
    this.addGeneratorButtons();
    
    // Add to chart containers
    this.addChartControlButtons();
  }

  /**
   * Add buttons to generator interface
   */
  addGeneratorButtons() {
    const generatorContainer = document.querySelector('.generator-layout');
    if (!generatorContainer) return;

    // Find sidebar or appropriate location
    const sidebar = generatorContainer.querySelector('.left-sidebar');
    if (!sidebar) return;

    // Add feature buttons section
    const buttonsHTML = `
      <div class="feature-buttons-section" style="padding: 16px; border-top: 1px solid #e5e7eb;">
        <h3 style="font-size: 14px; font-weight: 600; color: #1f2937; margin-bottom: 12px;">
          <i class="fas fa-magic"></i> Chart Tools
        </h3>
        
        <div style="display: grid; gap: 8px;">
          <button class="feature-btn" onclick="vizomFeatures.showTemplates()" style="width: 100%; padding: 8px 12px; background: #3b82f6; color: white; border: none; border-radius: 6px; font-size: 12px; cursor: pointer; display: flex; align-items: center; gap: 6px;">
            <i class="fas fa-layer-group"></i>
            Use Template
          </button>
          
          <button class="feature-btn" onclick="vizomFeatures.showCustomization()" style="width: 100%; padding: 8px 12px; background: #8b5cf6; color: white; border: none; border-radius: 6px; font-size: 12px; cursor: pointer; display: flex; align-items: center; gap: 6px;">
            <i class="fas fa-palette"></i>
            Customize
          </button>
          
          <button class="feature-btn" onclick="vizomFeatures.showSaveLoad()" style="width: 100%; padding: 8px 12px; background: #10b981; color: white; border: none; border-radius: 6px; font-size: 12px; cursor: pointer; display: flex; align-items: center; gap: 6px;">
            <i class="fas fa-save"></i>
            Save/Load
          </button>
          
          <button class="feature-btn" onclick="vizomFeatures.exportChart()" style="width: 100%; padding: 8px 12px; background: #f59e0b; color: white; border: none; border-radius: 6px; font-size: 12px; cursor: pointer; display: flex; align-items: center; gap: 6px;">
            <i class="fas fa-download"></i>
            Export
          </button>
        </div>
      </div>
    `;

    sidebar.insertAdjacentHTML('beforeend', buttonsHTML);
  }

  /**
   * Add control buttons to chart containers
   */
  addChartControlButtons() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Check for chart containers
            const chartContainers = node.querySelectorAll ? 
              node.querySelectorAll('canvas') : [];
            
            chartContainers.forEach(canvas => {
              if (canvas.chart && !canvas.hasAttribute('data-features-added')) {
                this.addExportButton(canvas.chart);
                canvas.setAttribute('data-features-added', 'true');
              }
            });
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  /**
   * Setup keyboard shortcuts
   */
  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Ctrl/Cmd + S: Save chart
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        this.quickSave();
      }
      
      // Ctrl/Cmd + E: Export chart
      if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        this.quickExport();
      }
      
      // Ctrl/Cmd + Shift + C: Customize chart
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        this.showCustomization();
      }
    });
  }

  /**
   * Setup context menu for charts
   */
  setupContextMenu() {
    document.addEventListener('contextmenu', (e) => {
      const canvas = e.target.closest('canvas');
      if (canvas && canvas.chart) {
        e.preventDefault();
        this.showChartContextMenu(e, canvas.chart);
      }
    });
  }

  /**
   * Setup API integration
   */
  setupAPIIntegration() {
    this.interceptAPICalls();
    this.setupAPIErrorHandling();
  }

  /**
   * Intercept API calls for validation and error handling
   */
  interceptAPICalls() {
    // Store original fetch
    const originalFetch = window.fetch;
    
    window.fetch = async function(url, options) {
      try {
        // Validate request data if applicable
        if (options && options.body) {
          try {
            const data = JSON.parse(options.body);
            // Add validation logic here
          } catch (e) {
            // Not JSON, skip validation
          }
        }

        const response = await originalFetch(url, options);
        
        // Handle API errors
        if (!response.ok) {
          const errorData = await response.clone().json().catch(() => ({}));
          throw new Error(errorData.message || `HTTP ${response.status}`);
        }

        return response;
        
      } catch (error) {
        // Handle with enhanced error service
        vizomFeatures.services.validation.handleAPIError(error, { url, options });
        throw error;
      }
    };
  }

  /**
   * Setup enhanced API error handling
   */
  setupAPIErrorHandling() {
    // Handle DeepSeek API errors
    window.addEventListener('deepseek-error', (e) => {
      this.services.validation.handleAPIError(e.detail, {
        source: 'deepseek-api'
      });
    });

    // Handle Supabase errors
    window.addEventListener('supabase-error', (e) => {
      this.services.validation.handleAPIError(e.detail, {
        source: 'supabase'
      });
    });
  }

  /**
   * Feature Methods
   */

  /**
   * Show templates panel
   */
  showTemplates() {
    // Create modal for templates
    const modalId = 'templates-modal-' + Date.now();
    const modalHTML = `
      <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" id="${modalId}">
        <div class="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden">
          <div id="templates-container"></div>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Initialize templates
    this.services.templates.createTemplateSelector('templates-container', {
      onTemplateSelect: (detail) => {
        this.applyTemplate(detail.chartConfig);
        document.getElementById(modalId).remove();
      },
      onTemplateUse: () => {
        // Template usage handled by onTemplateSelect
      }
    });
  }

  /**
   * Show customization panel
   */
  showCustomization() {
    if (!this.currentChart) {
      if (window.feedbackSystem) {
        window.feedbackSystem.showWarning('No Chart', 'Please create a chart first');
      }
      return;
    }

    // Create modal for customization
    const modalId = 'customization-modal-' + Date.now();
    const modalHTML = `
      <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" id="${modalId}">
        <div class="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
          <div id="customization-container"></div>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Initialize customization
    this.services.customization.createCustomizationPanel('customization-container', {
      chartInstance: this.currentChart,
      onCustomizationChange: (customization) => {
        this.applyCustomization(customization);
      }
    });
  }

  /**
   * Show save/load panel
   */
  showSaveLoad() {
    // Create modal for save/load
    const modalId = 'saveload-modal-' + Date.now();
    const modalHTML = `
      <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" id="${modalId}">
        <div class="bg-white rounded-lg max-w-3xl w-full mx-4 max-h-[80vh] overflow-hidden">
          <div id="saveload-container"></div>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Initialize save/load
    this.services.saveLoad.createSaveLoadPanel('saveload-container', {
      onChartLoad: (chart) => {
        this.loadChart(chart);
        document.getElementById(modalId).remove();
      },
      onChartSave: (chart) => {
        // Chart saved successfully
      }
    });
  }

  /**
   * Export current chart
   */
  async exportChart() {
    if (!this.currentChart) {
      if (window.feedbackSystem) {
        window.feedbackSystem.showWarning('No Chart', 'Please create a chart first');
      }
      return;
    }

    try {
      await this.services.export.exportChart('png');
    } catch (error) {
      console.error('Export failed:', error);
    }
  }

  /**
   * Quick save (keyboard shortcut)
   */
  quickSave() {
    if (!this.currentChart) return;
    
    // Get chart name or prompt for one
    const chartName = prompt('Enter chart name:', 'My Chart ' + new Date().toLocaleDateString());
    if (!chartName) return;

    this.saveChart(chartName);
  }

  /**
   * Quick export (keyboard shortcut)
   */
  quickExport() {
    this.exportChart();
  }

  /**
   * Apply template to current chart
   */
  applyTemplate(chartConfig) {
    if (!this.currentChart) {
      // Create new chart with template
      this.createChartFromConfig(chartConfig);
    } else {
      // Update existing chart
      this.updateChartWithConfig(chartConfig);
    }

    if (window.feedbackSystem) {
      window.feedbackSystem.showSuccess('Template Applied', 'Chart template has been applied');
    }
  }

  /**
   * Apply customization to current chart
   */
  applyCustomization(customization) {
    if (!this.currentChart) return;

    const newConfig = this.services.customization.applyToChartConfig(
      this.currentChart.config,
      customization
    );

    this.updateChartWithConfig(newConfig);
  }

  /**
   * Load saved chart
   */
  async loadChart(chart) {
    try {
      if (chart.config && chart.config.data) {
        this.createChartFromConfig({
          type: chart.chartType,
          data: chart.config.data,
          options: chart.config.options || {}
        });
      }

      if (window.feedbackSystem) {
        window.feedbackSystem.showSuccess('Chart Loaded', `"${chart.name}" has been loaded`);
      }

    } catch (error) {
      console.error('Failed to load chart:', error);
      if (window.feedbackSystem) {
        window.feedbackSystem.showError('Load Failed', error.message);
      }
    }
  }

  /**
   * Save chart with name
   */
  saveChart(name) {
    if (!this.currentChart) return;

    const chart = {
      id: 'chart-' + Date.now(),
      name: name,
      chartType: this.currentChart.config.type,
      config: this.currentChart.config,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.services.saveLoad.savedCharts.set(chart.id, chart);
    this.services.saveLoad.saveToLocalStorage();

    if (window.feedbackSystem) {
      window.feedbackSystem.showSuccess('Chart Saved', `"${name}" has been saved`);
    }
  }

  /**
   * Add export button to chart
   */
  addExportButton(chart) {
    const canvas = chart.canvas;
    if (!canvas || canvas.hasAttribute('data-export-added')) return;

    // Find or create container
    let container = canvas.closest('.chart-container');
    if (!container) {
      container = canvas.parentNode;
      container.classList.add('chart-container');
      container.style.position = 'relative';
    }

    // Add export button
    this.services.export.createExportButton(container);
    canvas.setAttribute('data-export-added', 'true');
  }

  /**
   * Setup chart customization
   */
  setupChartCustomization(chart) {
    // Store current chart for customization service
    this.services.customization.currentCustomization = {
      chartInstance: chart,
      onCustomizationChange: (customization) => {
        this.applyCustomization(customization);
      }
    };
  }

  /**
   * Setup chart save/load
   */
  setupChartSaveLoad(chart) {
    // Store current chart for save/load service
    this.services.saveLoad.currentChart = chart;
  }

  /**
   * Create chart from configuration
   */
  createChartFromConfig(config) {
    const canvas = document.querySelector('#chart-canvas') || document.querySelector('canvas');
    if (!canvas) {
      console.error('No canvas found for chart creation');
      return;
    }

    // Validate configuration
    const validation = this.services.validation.validate('chartConfig', config);
    if (!validation.isValid) {
      throw new Error('Invalid chart configuration: ' + validation.errors.join(', '));
    }

    // Create chart
    this.currentChart = new Chart(canvas.getContext('2d'), config);
    window.chart = this.currentChart;
  }

  /**
   * Update chart with new configuration
   */
  updateChartWithConfig(config) {
    if (!this.currentChart) return;

    // Update data
    if (config.data) {
      this.currentChart.data = config.data;
    }

    // Update options
    if (config.options) {
      this.currentChart.options = config.options;
    }

    // Update chart type if different
    if (config.type && config.type !== this.currentChart.config.type) {
      this.currentChart.config.type = config.type;
    }

    this.currentChart.update();
  }

  /**
   * Validate current chart
   */
  validateCurrentChart() {
    if (!this.currentChart) return;

    const validation = this.services.validation.validate('chartData', this.currentChart.data);
    if (!validation.isValid) {
      console.warn('Chart data validation issues:', validation.errors);
    }
  }

  /**
   * Check for auto-save
   */
  checkForAutoSave() {
    // Auto-save logic would go here
    // For now, just check if there are unsaved changes
    if (this.services.saveLoad.hasUnsavedChanges()) {
      console.log('Chart has unsaved changes');
    }
  }

  /**
   * Show chart context menu
   */
  showChartContextMenu(event, chart) {
    // Remove existing context menu
    const existingMenu = document.querySelector('.chart-context-menu');
    if (existingMenu) {
      existingMenu.remove();
    }

    const menuHTML = `
      <div class="chart-context-menu" style="position: fixed; top: ${event.clientY}px; left: ${event.clientX}px; background: white; border: 1px solid #e5e7eb; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); z-index: 1000; min-width: 150px;">
        <div class="context-menu-item" onclick="vizomFeatures.exportChart()" style="padding: 8px 12px; cursor: pointer; font-size: 12px; color: #374151; display: flex; align-items: center; gap: 8px;">
          <i class="fas fa-download"></i> Export Chart
        </div>
        <div class="context-menu-item" onclick="vizomFeatures.showCustomization()" style="padding: 8px 12px; cursor: pointer; font-size: 12px; color: #374151; display: flex; align-items: center; gap: 8px;">
          <i class="fas fa-palette"></i> Customize
        </div>
        <div class="context-menu-item" onclick="vizomFeatures.quickSave()" style="padding: 8px 12px; cursor: pointer; font-size: 12px; color: #374151; display: flex; align-items: center; gap: 8px;">
          <i class="fas fa-save"></i> Quick Save
        </div>
        <div class="context-menu-item" onclick="vizomFeatures.showSaveLoad()" style="padding: 8px 12px; cursor: pointer; font-size: 12px; color: #374151; display: flex; align-items: center; gap: 8px;">
          <i class="fas fa-folder-open"></i> Save/Load
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', menuHTML);

    // Remove menu on click outside
    setTimeout(() => {
      document.addEventListener('click', () => {
        const menu = document.querySelector('.chart-context-menu');
        if (menu) menu.remove();
      }, { once: true });
    }, 100);
  }

  /**
   * Handle template selection
   */
  handleTemplateSelection(detail) {
    this.applyTemplate(detail.chartConfig);
  }

  /**
   * Handle customization change
   */
  handleCustomizationChange(detail) {
    this.applyCustomization(detail);
  }

  /**
   * Handle chart load
   */
  handleChartLoad(detail) {
    this.loadChart(detail);
  }

  /**
   * Handle chart save
   */
  handleChartSave(detail) {
    // Chart saved successfully
  }

  /**
   * Handle chart export
   */
  handleChartExport(detail) {
    // Chart exported successfully
  }

  /**
   * Cleanup resources
   */
  cleanup() {
    // Clean up services
    Object.values(this.services).forEach(service => {
      if (service.cleanup) {
        service.cleanup();
      }
    });

    // Remove event listeners
    document.removeEventListener('templateSelected', this.handleTemplateSelection);
    document.removeEventListener('customizationChanged', this.handleCustomizationChange);
    document.removeEventListener('chartLoaded', this.handleChartLoad);
    document.removeEventListener('chartSaved', this.handleChartSave);
    document.removeEventListener('chartExport', this.handleChartExport);
  }

  /**
   * Get integration statistics
   */
  getStats() {
    return {
      initialized: this.isInitialized,
      currentChart: !!this.currentChart,
      services: Object.keys(this.services).map(key => ({
        name: key,
        stats: this.services[key].getStats ? this.services[key].getStats() : {}
      }))
    };
  }
}

// Export singleton instance
export const vizomFeatures = new VizomFeaturesIntegration();

// Make available globally
window.vizomFeatures = vizomFeatures;

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    vizomFeatures.init();
  });
} else {
  vizomFeatures.init();
}

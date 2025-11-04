/**
 * VIZOM - Refactored Application Entry Point
 * Modern modular architecture with ES6 modules
 */

// Core modules
import { api } from './core/api.js';
import { storage } from './core/storage.js';
import { debounce, parseSeries, showToast } from './core/utils.js';

// Feature modules
import { ChartRenderer } from './lib/chart-renderer.js';
import { PromptBuilder } from './services/prompt-builder.js';
import { ExportManager } from './services/export-manager.js';
import { Validator } from './utils/validator.js';
import { HTMLSanitizer } from './utils/sanitizer.js';

// Components
import { Button } from './components/Button.js';

/**
 * Main Application Class
 */
class VizomApp {
  constructor() {
    this.renderer = null;
    this.exportManager = null;
    this.currentChartType = 'bar';
    this.init();
  }

  /**
   * Initialize application
   */
  init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  /**
   * Setup application
   */
  setup() {
    // Initialize DOM elements
    this.elements = {
      promptInput: document.getElementById('prompt-input'),
      previewContainer: document.getElementById('preview'),
      generateBtn: document.getElementById('generate-btn'),
      downloadBtn: document.getElementById('download-btn'),
      chartTypeCards: document.querySelectorAll('.chart-type-card'),
      formatButtons: document.querySelectorAll('.format-btn'),
    };

    // Initialize modules
    if (this.elements.previewContainer) {
      this.renderer = new ChartRenderer(this.elements.previewContainer);
      this.exportManager = new ExportManager(this.elements.previewContainer);
    }

    // Setup event listeners
    this.setupEventListeners();

    // Load saved data
    this.loadSavedData();

  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Generate button
    if (this.elements.generateBtn) {
      this.elements.generateBtn.addEventListener('click', () => this.handleGenerate());
    }

    // Download button
    if (this.elements.downloadBtn) {
      this.elements.downloadBtn.addEventListener('click', () => this.handleDownload());
    }

    // Chart type selection
    this.elements.chartTypeCards?.forEach(card => {
      card.addEventListener('click', () => this.handleChartTypeSelect(card));
    });

    // Format selection
    this.elements.formatButtons?.forEach(btn => {
      btn.addEventListener('click', () => this.handleFormatSelect(btn));
    });

    // Input validation (debounced)
    if (this.elements.promptInput) {
      this.elements.promptInput.addEventListener(
        'input',
        debounce(() => this.validateInput(), 500)
      );
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key === 'Enter') {
        this.handleGenerate();
      }
    });
  }

  /**
   * Handle chart type selection
   */
  handleChartTypeSelect(card) {
    // Remove selected class from all cards
    this.elements.chartTypeCards?.forEach(c => c.classList.remove('selected'));
    
    // Add selected class to clicked card
    card.classList.add('selected');
    
    // Update current chart type
    this.currentChartType = card.dataset.type;
    
  }

  /**
   * Handle format selection
   */
  handleFormatSelect(btn) {
    // Update button styles
    this.elements.formatButtons?.forEach(b => {
      b.classList.remove('bg-slate-900', 'text-white', 'border-slate-900');
      b.classList.add('border-slate-200');
    });
    
    btn.classList.add('bg-slate-900', 'text-white', 'border-slate-900');
    btn.classList.remove('border-slate-200');
    
    this.selectedFormat = btn.textContent.trim().toLowerCase();
  }

  /**
   * Validate input
   */
  validateInput() {
    const prompt = this.elements.promptInput?.value || '';
    const validation = Validator.validatePrompt(prompt);

    if (!validation.valid) {
      this.showValidationError(validation.errors[0]);
    } else {
      this.hideValidationError();
    }

    return validation.valid;
  }

  /**
   * Handle generate button click
   */
  async handleGenerate() {
    const prompt = this.elements.promptInput?.value?.trim();

    // Validate input
    const validation = Validator.validatePrompt(prompt);
    if (!validation.valid) {
      showToast(validation.errors[0], 'error');
      return;
    }

    // Validate chart type
    const typeValidation = Validator.validateChartType(this.currentChartType);
    if (!typeValidation.valid) {
      showToast(typeValidation.error, 'error');
      return;
    }

    try {
      // Show loading
      this.renderer?.showLoading();
      this.setGenerateButtonLoading(true);

      // Build prompt
      const fullPrompt = PromptBuilder.build(this.currentChartType, validation.sanitized);

      // Call API
      const response = await api.generate(fullPrompt, this.currentChartType);
      const content = response.html || response.content;

      if (!content) {
        throw new Error('No content received from API');
      }

      // Render visualization
      await this.renderVisualization(content, this.currentChartType);

      // Save to storage
      storage.set('lastGenerated', {
        prompt: validation.sanitized,
        type: this.currentChartType,
        timestamp: Date.now(),
      });

      showToast('Visualization generated successfully!', 'success');
    } catch (error) {
      console.error('Generation error:', error);
      this.renderer?.showError(error.message);
      showToast(error.message, 'error');
    } finally {
      this.setGenerateButtonLoading(false);
    }
  }

  /**
   * Render visualization
   */
  async renderVisualization(content, type) {
    try {
      // Try to parse as JSON (Chart.js config)
      const config = JSON.parse(content);

      // Validate config
      if (type === 'dashboard') {
        const validation = Validator.validateDashboardConfig(config);
        if (!validation.valid) {
          throw new Error(validation.errors.join(', '));
        }
        this.renderer.renderDashboard(config.layout, config.charts);
      } else {
        const validation = Validator.validateChartConfig(config);
        if (!validation.valid) {
          throw new Error(validation.errors.join(', '));
        }
        this.renderer.render(config);
      }
    } catch (jsonError) {
      // Not JSON, treat as HTML (table)
      if (type === 'table') {
        const sanitized = HTMLSanitizer.sanitizeHTML(content);
        this.renderer.renderTable(sanitized);
      } else {
        throw new Error('Invalid response format');
      }
    }
  }

  /**
   * Handle download button click
   */
  async handleDownload() {
    const format = this.selectedFormat || 'png';

    try {
      showToast(`Exporting as ${format.toUpperCase()}...`, 'info');

      switch (format) {
        case 'png':
          await this.exportManager.exportPNG();
          break;
        case 'pdf':
          await this.exportManager.exportPDF();
          break;
        case 'csv':
          const data = this.exportManager.extractChartData();
          this.exportManager.exportCSV(data);
          break;
        case 'svg':
          this.exportManager.exportSVG();
          break;
        case 'html':
          this.exportManager.exportHTML();
          break;
        default:
          throw new Error('Invalid export format');
      }

      showToast('Export successful!', 'success');
    } catch (error) {
      console.error('Export error:', error);
      showToast(error.message, 'error');
    }
  }

  /**
   * Load saved data from storage
   */
  loadSavedData() {
    const lastGenerated = storage.get('lastGenerated');
    
    if (lastGenerated && this.elements.promptInput) {
      // Check if data is recent (within 24 hours)
      const age = Date.now() - lastGenerated.timestamp;
      if (age < 24 * 60 * 60 * 1000) {
        this.elements.promptInput.value = lastGenerated.prompt;
        this.currentChartType = lastGenerated.type;
        
        // Select the chart type card
        const card = document.querySelector(`[data-type="${lastGenerated.type}"]`);
        if (card) {
          card.classList.add('selected');
        }
      }
    }

    // Load from sessionStorage (template)
    const templatePrompt = sessionStorage.getItem('templatePrompt');
    if (templatePrompt && this.elements.promptInput) {
      this.elements.promptInput.value = templatePrompt;
      sessionStorage.removeItem('templatePrompt');
    }
  }

  /**
   * Set generate button loading state
   */
  setGenerateButtonLoading(loading) {
    if (!this.elements.generateBtn) return;

    if (loading) {
      this.elements.generateBtn.disabled = true;
      this.elements.generateBtn.innerHTML = `
        <svg class="animate-spin h-5 w-5 inline-block" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
        </svg>
        <span class="ml-2">Generating...</span>
      `;
    } else {
      this.elements.generateBtn.disabled = false;
      this.elements.generateBtn.innerHTML = `
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
        </svg>
        <span>Generate</span>
      `;
    }
  }

  /**
   * Show validation error
   */
  showValidationError(message) {
    const validationEl = document.getElementById('validation-message');
    if (validationEl) {
      validationEl.textContent = message;
      validationEl.className = 'error-message mt-2';
      validationEl.classList.remove('hidden');
    }
  }

  /**
   * Hide validation error
   */
  hideValidationError() {
    const validationEl = document.getElementById('validation-message');
    if (validationEl) {
      validationEl.classList.add('hidden');
    }
  }
}

// Initialize application
const app = new VizomApp();

// Export for debugging
window.VizomApp = app;

export default VizomApp;

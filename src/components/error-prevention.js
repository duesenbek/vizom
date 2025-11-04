// Error Prevention System
class ErrorPreventionManager {
  constructor() {
    this.validators = new Map();
    this.confirmations = new Map();
    this.warnings = new Map();
    this.smartDefaults = new Map();
    this.unsavedChanges = new Set();
    this.validationRules = new Map();
    
    this.init();
  }

  init() {
    this.setupValidators();
    this.setupConfirmations();
    this.setupWarnings();
    this.setupSmartDefaults();
    this.setupUnsavedChangesTracking();
    this.setupInputValidation();
    this.setupDestructiveActionProtection();
  }

  // Setup input validators
  setupValidators() {
    // Data input validator
    this.validators.set('data-input', {
      validate: (value) => this.validateDataInput(value),
      message: 'Please enter valid data in CSV, JSON, or text format',
      preventSubmit: true
    });

    // Chart type validator
    this.validators.set('chart-type', {
      validate: (value) => this.validateChartType(value),
      message: 'Please select a chart type',
      preventSubmit: true
    });

    // Export format validator
    this.validators.set('export-format', {
      validate: (value) => this.validateExportFormat(value),
      message: 'Please select a valid export format',
      preventSubmit: false
    });

    // File size validator
    this.validators.set('file-size', {
      validate: (file) => this.validateFileSize(file),
      message: 'File size exceeds 10MB limit',
      preventSubmit: true
    });

    // Email validator
    this.validators.set('email', {
      validate: (email) => this.validateEmail(email),
      message: 'Please enter a valid email address',
      preventSubmit: true
    });
  }

  // Validate data input
  validateDataInput(value) {
    if (!value || value.trim().length === 0) {
      return {
        valid: false,
        type: 'error',
        message: 'Data input cannot be empty'
      };
    }

    // Check minimum data requirements
    const lines = value.trim().split('\n').filter(line => line.trim());
    if (lines.length < 2) {
      return {
        valid: false,
        type: 'warning',
        message: 'Data should have at least 2 rows for meaningful visualization'
      };
    }

    // Try to parse as CSV
    try {
      const parsed = this.parseCSV(value);
      if (parsed.data.length < 2) {
        return {
          valid: false,
          type: 'error',
          message: 'CSV data must contain at least 2 rows'
        };
      }
      if (parsed.headers.length < 2) {
        return {
          valid: false,
          type: 'warning',
          message: 'Charts work best with at least 2 columns of data'
        };
      }
      return {
        valid: true,
        type: 'success',
        message: `Valid CSV data: ${parsed.data.length} rows, ${parsed.headers.length} columns`,
        suggestions: this.generateDataSuggestions(parsed)
      };
    } catch (csvError) {
      // Try to parse as JSON
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) {
          if (parsed.length < 2) {
            return {
              valid: false,
              type: 'error',
              message: 'JSON data must contain at least 2 items'
            };
          }
          return {
            valid: true,
            type: 'success',
            message: `Valid JSON data: ${parsed.length} items`,
            suggestions: this.generateDataSuggestions({ data: parsed })
          };
        } else {
          return {
            valid: false,
            type: 'error',
            message: 'JSON data must be an array'
          };
        }
      } catch (jsonError) {
        // Treat as plain text
        return {
          valid: true,
          type: 'info',
          message: 'Text data detected - best for simple charts',
          suggestions: ['Consider formatting as CSV for better results']
        };
      }
    }
  }

  // Parse CSV data
  parseCSV(csv) {
    const lines = csv.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const data = lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
      return headers.reduce((obj, header, index) => {
        obj[header] = values[index] || '';
        return obj;
      }, {});
    });
    return { headers, data };
  }

  // Generate data suggestions
  generateDataSuggestions(parsed) {
    const suggestions = [];
    
    if (parsed.data.length > 1000) {
      suggestions.push('Large dataset detected - consider filtering for better performance');
    }
    
    if (parsed.data.length < 10) {
      suggestions.push('Small dataset - consider adding more data for meaningful insights');
    }
    
    // Suggest chart types based on data
    const numericColumns = this.findNumericColumns(parsed);
    if (numericColumns.length >= 2) {
      suggestions.push('Multiple numeric columns detected - scatter plot may work well');
    }
    
    return suggestions;
  }

  // Find numeric columns
  findNumericColumns(parsed) {
    if (!parsed.headers) return [];
    
    return parsed.headers.filter(header => {
      return parsed.data.every(row => {
        const value = row[header];
        return !isNaN(parseFloat(value)) && isFinite(value);
      });
    });
  }

  // Validate chart type
  validateChartType(value) {
    const validTypes = ['bar', 'line', 'pie', 'scatter', 'bubble', 'area', 'donut', 'histogram'];
    
    if (!value) {
      return {
        valid: false,
        type: 'error',
        message: 'Please select a chart type'
      };
    }
    
    if (!validTypes.includes(value)) {
      return {
        valid: false,
        type: 'error',
        message: 'Invalid chart type selected'
      };
    }
    
    return {
      valid: true,
      type: 'success',
      message: 'Chart type selected'
    };
  }

  // Validate export format
  validateExportFormat(value) {
    const validFormats = ['png', 'jpg', 'svg', 'pdf', 'json', 'csv', 'excel'];
    
    if (!value) {
      return {
        valid: false,
        type: 'error',
        message: 'Please select an export format'
      };
    }
    
    if (!validFormats.includes(value)) {
      return {
        valid: false,
        type: 'error',
        message: 'Invalid export format'
      };
    }
    
    return {
      valid: true,
      type: 'success',
      message: 'Export format selected'
    };
  }

  // Validate file size
  validateFileSize(file) {
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    if (file.size > maxSize) {
      return {
        valid: false,
        type: 'error',
        message: `File size (${this.formatFileSize(file.size)}) exceeds 10MB limit`
      };
    }
    
    return {
      valid: true,
      type: 'success',
      message: `File size acceptable: ${this.formatFileSize(file.size)}`
    };
  }

  // Validate email
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email) {
      return {
        valid: false,
        type: 'error',
        message: 'Email address is required'
      };
    }
    
    if (!emailRegex.test(email)) {
      return {
        valid: false,
        type: 'error',
        message: 'Please enter a valid email address'
      };
    }
    
    return {
      valid: true,
      type: 'success',
      message: 'Email address is valid'
    };
  }

  // Format file size
  formatFileSize(bytes) {
    if (bytes < 1024) return bytes + 'B';
    if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + 'KB';
    return Math.round(bytes / (1024 * 1024)) + 'MB';
  }

  // Setup confirmation dialogs
  setupConfirmations() {
    // Delete chart confirmation
    this.confirmations.set('delete-chart', {
      title: 'Delete Chart',
      message: 'Are you sure you want to delete this chart? This action cannot be undone.',
      type: 'danger',
      confirmText: 'Delete',
      cancelText: 'Cancel'
    });

    // Clear data confirmation
    this.confirmations.set('clear-data', {
      title: 'Clear Data',
      message: 'Are you sure you want to clear all data? This will remove your current input.',
      type: 'warning',
      confirmText: 'Clear',
      cancelText: 'Cancel'
    });

    // Reset settings confirmation
    this.confirmations.set('reset-settings', {
      title: 'Reset Settings',
      message: 'Are you sure you want to reset all settings to default values?',
      type: 'warning',
      confirmText: 'Reset',
      cancelText: 'Cancel'
    });

    // Export overwrite confirmation
    this.confirmations.set('export-overwrite', {
      title: 'Overwrite Existing File',
      message: 'A file with this name already exists. Do you want to overwrite it?',
      type: 'warning',
      confirmText: 'Overwrite',
      cancelText: 'Cancel'
    });

    // Leave page with unsaved changes
    this.confirmations.set('leave-unsaved', {
      title: 'Unsaved Changes',
      message: 'You have unsaved changes. Are you sure you want to leave?',
      type: 'warning',
      confirmText: 'Leave',
      cancelText: 'Stay'
    });
  }

  // Setup warning systems
  setupWarnings() {
    // Large dataset warning
    this.warnings.set('large-dataset', {
      title: 'Large Dataset Detected',
      message: 'Your dataset contains over 1000 rows. This may take longer to process.',
      type: 'info',
      actions: ['Continue', 'Filter Data']
    });

    // No internet warning
    this.warnings.set('no-internet', {
      title: 'No Internet Connection',
      message: 'Some features may not work without an internet connection.',
      type: 'warning',
      actions: ['Continue Offline', 'Retry Connection']
    });

    // Browser compatibility warning
    this.warnings.set('browser-compatibility', {
      title: 'Browser Compatibility',
      message: 'Your browser may not support all features. Consider using Chrome or Firefox.',
      type: 'warning',
      actions: ['Continue Anyway', 'Learn More']
    });
  }

  // Setup smart defaults
  setupSmartDefaults() {
    // Chart type defaults based on data
    this.smartDefaults.set('chart-type', (data) => {
      if (!data) return 'bar';
      
      const numericColumns = this.findNumericColumns({ data: [data] });
      if (numericColumns.length >= 2) {
        return 'scatter';
      } else if (numericColumns.length === 1) {
        return 'bar';
      } else {
        return 'pie';
      }
    });

    // Export format defaults based on content
    this.smartDefaults.set('export-format', (context) => {
      if (context.type === 'presentation') return 'png';
      if (context.type === 'data-analysis') return 'csv';
      if (context.type === 'web') return 'jpg';
      return 'png';
    });

    // Color scheme defaults
    this.smartDefaults.set('color-scheme', (chartType) => {
      const schemes = {
        'bar': 'blue',
        'line': 'green',
        'pie': 'rainbow',
        'scatter': 'purple',
        'bubble': 'orange'
      };
      return schemes[chartType] || 'blue';
    });
  }

  // Setup unsaved changes tracking
  setupUnsavedChangesTracking() {
    // Track data input changes
    const dataInput = document.getElementById('data-input');
    if (dataInput) {
      dataInput.addEventListener('input', (e) => {
        this.markAsUnsaved('data-input');
        this.validateInput('data-input', e.target.value);
      });
    }

    // Track chart type changes
    document.addEventListener('chartTypeChanged', () => {
      this.markAsUnsaved('chart-type');
    });

    // Track settings changes
    document.addEventListener('settingsChanged', () => {
      this.markAsUnsaved('settings');
    });

    // Track before unload
    window.addEventListener('beforeunload', (e) => {
      if (this.hasUnsavedChanges()) {
        e.preventDefault();
        e.returnValue = '';
      }
    });
  }

  // Setup input validation
  setupInputValidation() {
    // Real-time validation for data input
    const dataInput = document.getElementById('data-input');
    if (dataInput) {
      let validationTimeout;
      
      dataInput.addEventListener('input', (e) => {
        clearTimeout(validationTimeout);
        validationTimeout = setTimeout(() => {
          this.validateInput('data-input', e.target.value);
        }, 500);
      });
    }

    // Validate before form submission
    const generateBtn = document.getElementById('generate-btn');
    if (generateBtn) {
      generateBtn.addEventListener('click', (e) => {
        if (!this.validateBeforeSubmission()) {
          e.preventDefault();
          this.showValidationErrors();
        }
      });
    }

    // Validate export form
    const exportBtn = document.getElementById('export-btn');
    if (exportBtn) {
      exportBtn.addEventListener('click', (e) => {
        if (!this.validateExportForm()) {
          e.preventDefault();
          this.showValidationErrors();
        }
      });
    }
  }

  // Setup destructive action protection
  setupDestructiveActionProtection() {
    // Protect delete buttons
    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-destructive="true"]')) {
        e.preventDefault();
        this.showConfirmation(e.target.dataset.confirmation || 'delete-chart');
      }
    });

    // Protect clear buttons
    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-clear="true"]')) {
        e.preventDefault();
        this.showConfirmation('clear-data');
      }
    });

    // Protect reset buttons
    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-reset="true"]')) {
        e.preventDefault();
        this.showConfirmation('reset-settings');
      }
    });
  }

  // Validate input
  validateInput(inputId, value) {
    const validator = this.validators.get(inputId);
    if (!validator) return true;

    const result = validator.validate(value);
    this.showValidationFeedback(inputId, result);
    
    return result.valid;
  }

  // Validate before submission
  validateBeforeSubmission() {
    const dataInput = document.getElementById('data-input');
    const selectedChart = document.querySelector('.chart-option.selected');
    
    let isValid = true;
    
    // Validate data input
    if (dataInput) {
      const dataResult = this.validateInput('data-input', dataInput.value);
      if (!dataResult.valid) {
        isValid = false;
      }
    }
    
    // Validate chart type
    if (!selectedChart) {
      this.showValidationFeedback('chart-type', {
        valid: false,
        type: 'error',
        message: 'Please select a chart type'
      });
      isValid = false;
    }
    
    return isValid;
  }

  // Validate export form
  validateExportForm() {
    const selectedFormat = document.querySelector('.export-option.selected');
    
    if (!selectedFormat) {
      this.showValidationFeedback('export-format', {
        valid: false,
        type: 'error',
        message: 'Please select an export format'
      });
      return false;
    }
    
    return true;
  }

  // Show validation feedback
  showValidationFeedback(inputId, result) {
    let feedbackElement = document.querySelector(`[data-validation-feedback="${inputId}"]`);
    
    if (!feedbackElement) {
      feedbackElement = document.createElement('div');
      feedbackElement.setAttribute('data-validation-feedback', inputId);
      feedbackElement.className = 'validation-feedback';
      
      // Insert after input
      const input = document.getElementById(inputId);
      if (input) {
        input.parentNode.insertBefore(feedbackElement, input.nextSibling);
      }
    }
    
    feedbackElement.className = `validation-feedback validation-${result.type}`;
    feedbackElement.innerHTML = `
      <div class="validation-icon">${this.getValidationIcon(result.type)}</div>
      <div class="validation-message">${result.message}</div>
    `;
    
    // Show suggestions if available
    if (result.suggestions && result.suggestions.length > 0) {
      const suggestionsHtml = result.suggestions.map(suggestion => 
        `<div class="validation-suggestion">💡 ${suggestion}</div>`
      ).join('');
      feedbackElement.innerHTML += `<div class="validation-suggestions">${suggestionsHtml}</div>`;
    }
    
    // Update input state
    const input = document.getElementById(inputId);
    if (input) {
      input.classList.toggle('valid', result.valid);
      input.classList.toggle('invalid', !result.valid);
      input.classList.toggle('warning', result.type === 'warning');
    }
  }

  // Get validation icon
  getValidationIcon(type) {
    const icons = {
      'success': '✅',
      'error': '❌',
      'warning': '⚠️',
      'info': 'ℹ️'
    };
    return icons[type] || '';
  }

  // Show validation errors
  showValidationErrors() {
    const errors = document.querySelectorAll('.validation-feedback.error');
    
    if (errors.length > 0) {
      // Scroll to first error
      errors[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // Focus the input with error
      const inputId = errors[0].getAttribute('data-validation-feedback');
      const input = document.getElementById(inputId);
      if (input) {
        input.focus();
      }
      
      // Show error summary
      this.showErrorSummary(errors);
    }
  }

  // Show error summary
  showErrorSummary(errors) {
    const errorMessages = Array.from(errors).map(error => 
      error.querySelector('.validation-message').textContent
    );
    
    this.showNotification({
      type: 'error',
      title: 'Please fix the following errors:',
      message: errorMessages.join('\n• '),
      duration: 5000
    });
  }

  // Show confirmation dialog
  showConfirmation(confirmationId) {
    const confirmation = this.confirmations.get(confirmationId);
    if (!confirmation) return;

    const modal = this.createConfirmationModal(confirmation);
    document.body.appendChild(modal);
    
    // Show modal
    setTimeout(() => modal.classList.add('show'), 10);
  }

  // Create confirmation modal
  createConfirmationModal(confirmation) {
    const modal = document.createElement('div');
    modal.className = 'modal modal-confirmation';
    modal.innerHTML = `
      <div class="modal-backdrop"></div>
      <div class="modal-container modal-md">
        <div class="modal-header">
          <h3 class="modal-title">${confirmation.title}</h3>
          <button class="modal-close" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <p>${confirmation.message}</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" data-action="cancel">${confirmation.cancelText}</button>
          <button class="btn btn-${confirmation.type}" data-action="confirm">${confirmation.confirmText}</button>
        </div>
      </div>
    `;

    // Setup event handlers
    const backdrop = modal.querySelector('.modal-backdrop');
    const closeBtn = modal.querySelector('.modal-close');
    const cancelBtn = modal.querySelector('[data-action="cancel"]');
    const confirmBtn = modal.querySelector('[data-action="confirm"]');

    const closeModal = () => {
      modal.classList.remove('show');
      setTimeout(() => modal.remove(), 300);
    };

    backdrop.addEventListener('click', closeModal);
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    
    confirmBtn.addEventListener('click', () => {
      this.executeConfirmation(confirmationId);
      closeModal();
    });

    return modal;
  }

  // Execute confirmation action
  executeConfirmation(confirmationId) {
    // Dispatch confirmation event
    document.dispatchEvent(new CustomEvent('confirmationExecuted', {
      detail: { confirmationId: confirmationId }
    }));

    // Track analytics
    if (window.analytics) {
      window.analytics.trackCustomEvent('confirmation_accepted', {
        confirmationId: confirmationId
      });
    }
  }

  // Show warning
  showWarning(warningId) {
    const warning = this.warnings.get(warningId);
    if (!warning) return;

    const notification = this.createWarningNotification(warning);
    this.showNotification(notification);
  }

  // Create warning notification
  createWarningNotification(warning) {
    return {
      type: warning.type,
      title: warning.title,
      message: warning.message,
      actions: warning.actions,
      duration: 0 // Persistent until user action
    };
  }

  // Mark as unsaved
  markAsUnsaved(component) {
    this.unsavedChanges.add(component);
    this.updateUnsavedIndicator();
  }

  // Mark as saved
  markAsSaved(component) {
    this.unsavedChanges.delete(component);
    this.updateUnsavedIndicator();
  }

  // Check if has unsaved changes
  hasUnsavedChanges() {
    return this.unsavedChanges.size > 0;
  }

  // Update unsaved indicator
  updateUnsavedIndicator() {
    let indicator = document.querySelector('.unsaved-changes-indicator');
    
    if (this.hasUnsavedChanges()) {
      if (!indicator) {
        indicator = document.createElement('div');
        indicator.className = 'unsaved-changes-indicator';
        indicator.innerHTML = `
          <span class="indicator-icon">💾</span>
          <span class="indicator-text">Unsaved changes</span>
        `;
        document.body.appendChild(indicator);
      }
    } else {
      if (indicator) {
        indicator.remove();
      }
    }
  }

  // Show notification
  showNotification(options) {
    // Use existing notification system or create fallback
    if (window.uiEnhancements && window.uiEnhancements.showNotification) {
      window.uiEnhancements.showNotification(options.message, options.type);
    } else {
      console.log(`${options.type.toUpperCase()}: ${options.title} - ${options.message}`);
    }
  }

  // Get smart default
  getSmartDefault(type, context) {
    const defaultFunction = this.smartDefaults.get(type);
    if (defaultFunction) {
      return defaultFunction(context);
    }
    return null;
  }

  // Apply smart defaults
  applySmartDefaults() {
    // Apply default chart type based on data
    const dataInput = document.getElementById('data-input');
    if (dataInput && dataInput.value) {
      const defaultChartType = this.getSmartDefault('chart-type', dataInput.value);
      if (defaultChartType) {
        this.selectChartType(defaultChartType);
      }
    }

    // Apply default export format
    const defaultExportFormat = this.getSmartDefault('export-format', { type: 'general' });
    if (defaultExportFormat) {
      this.selectExportFormat(defaultExportFormat);
    }
  }

  // Select chart type
  selectChartType(chartType) {
    const chartOption = document.querySelector(`[data-chart-type="${chartType}"]`);
    if (chartOption) {
      document.querySelectorAll('.chart-option').forEach(option => {
        option.classList.remove('selected');
      });
      chartOption.classList.add('selected');
    }
  }

  // Select export format
  selectExportFormat(format) {
    const exportOption = document.querySelector(`[data-format="${format}"]`);
    if (exportOption) {
      document.querySelectorAll('.export-option').forEach(option => {
        option.classList.remove('selected');
      });
      exportOption.classList.add('selected');
    }
  }

  // Public methods
  validateAll() {
    const results = [];
    
    this.validators.forEach((validator, inputId) => {
      const input = document.getElementById(inputId);
      if (input) {
        const result = this.validateInput(inputId, input.value);
        results.push({ inputId, result });
      }
    });
    
    return results;
  }

  clearValidation() {
    document.querySelectorAll('.validation-feedback').forEach(feedback => {
      feedback.remove();
    });
    
    document.querySelectorAll('.valid, .invalid, .warning').forEach(input => {
      input.classList.remove('valid', 'invalid', 'warning');
    });
  }

  saveCurrentState() {
    this.markAsSaved('data-input');
    this.markAsSaved('chart-type');
    this.markAsSaved('settings');
  }
}

// Initialize error prevention manager
document.addEventListener('DOMContentLoaded', () => {
  window.errorPreventionManager = new ErrorPreventionManager();
});

export { ErrorPreventionManager };

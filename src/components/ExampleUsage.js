/**
 * Example Usage of Enhanced UX System
 * Demonstrates how to use all the UX improvements in the Vizom interface
 */

import { uxIntegration } from './UXIntegration.js';

class ExampleUsage {
  constructor() {
    this.init();
  }

  init() {
    // Wait for UX system to be ready
    if (uxIntegration.isReady()) {
      this.setupExamples();
    } else {
      setTimeout(() => this.init(), 100);
    }
  }

  /**
   * Setup example implementations
   */
  setupExamples() {
    // Example 1: Enhanced chart creation
    this.setupChartExample();
    
    // Example 2: Data import with UX feedback
    this.setupDataImportExample();
    
    // Example 3: Form validation with enhanced feedback
    this.setupFormValidationExample();
    
    // Example 4: Mobile-optimized interactions
    this.setupMobileExample();
  }

  /**
   * Example 1: Enhanced Chart Creation
   */
  setupChartExample() {
    const createChartButton = document.getElementById('create-chart-btn');
    if (createChartButton) {
      createChartButton.addEventListener('click', async () => {
        try {
          // Get data from input
          const dataInput = document.getElementById('chart-data');
          const chartType = document.getElementById('chart-type')?.value || 'bar';
          
          if (!dataInput?.value) {
            uxIntegration.getComponent('feedback').showWarning(
              'No Data',
              'Please enter some data or use an example'
            );
            return;
          }

          // Parse data (simplified)
          const data = this.parseCSVData(dataInput.value);

          // Create enhanced chart with all UX features
          const chartId = await uxIntegration.createEnhancedChart('chart-container', data, {
            chartType,
            title: 'Sample Chart',
            showControls: true,
            showLegend: true,
            showExport: true,
            responsive: true,
            mobileOptimized: true
          });

          if (chartId) {
            console.log('Chart created with ID:', chartId);
          }

        } catch (error) {
          console.error('Chart creation failed:', error);
        }
      });
    }
  }

  /**
   * Example 2: Data Import with UX Feedback
   */
  setupDataImportExample() {
    const importButtons = document.querySelectorAll('[data-import-action]');
    
    importButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const action = e.target.dataset.importAction;
        
        switch (action) {
          case 'file':
            this.handleFileImport();
            break;
          case 'url':
            this.handleURLImport();
            break;
          case 'example':
            this.loadExampleData();
            break;
        }
      });
    });
  }

  /**
   * Handle file import with progress tracking
   */
  async handleFileImport() {
    const feedback = uxIntegration.getComponent('feedback');
    const loading = uxIntegration.getComponent('loading');
    
    // Show confirmation dialog
    feedback.showConfirmation({
      title: 'Import File',
      message: 'Select a CSV, JSON, or Excel file to import',
      type: 'info',
      confirmText: 'Choose File',
      cancelText: 'Cancel',
      onConfirm: () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.csv,.json,.xlsx';
        fileInput.onchange = (e) => this.processFileUpload(e.target.files[0]);
        fileInput.click();
      }
    });
  }

  /**
   * Process file upload with progress tracking
   */
  async processFileUpload(file) {
    if (!file) return;

    const feedback = uxIntegration.getComponent('feedback');
    const loading = uxIntegration.getComponent('loading');
    
    // Show operation status
    const operation = feedback.showOperationStatus('Processing File', [
      'Validating file format',
      'Parsing data',
      'Validating data structure',
      'Importing to chart'
    ]);

    try {
      // Step 1: Validate file
      operation.updateProgress(25, 'Validating file format...');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (!this.isValidFileFormat(file)) {
        throw new Error('Invalid file format');
      }

      // Step 2: Parse data
      operation.updateProgress(50, 'Parsing data...');
      const data = await this.parseFile(file);
      await new Promise(resolve => setTimeout(resolve, 500));

      // Step 3: Validate data
      operation.updateProgress(75, 'Validating data structure...');
      if (!this.isValidData(data)) {
        throw new Error('Invalid data structure');
      }
      await new Promise(resolve => setTimeout(resolve, 300));

      // Step 4: Complete import
      operation.updateProgress(100, 'Import complete!');
      await new Promise(resolve => setTimeout(resolve, 200));

      operation.complete('File imported successfully');
      
      // Show success notification with actions
      feedback.showSuccess(
        'Import Successful',
        `${file.name} has been imported with ${data.rows} rows`,
        {
          actions: [
            {
              label: 'View Chart',
              type: 'primary',
              onClick: 'createChartFromImportedData()'
            },
            {
              label: 'Edit Data',
              type: 'secondary',
              onClick: 'showDataEditor()'
            }
          ]
        }
      );

      // Store imported data
      this.importedData = data;

    } catch (error) {
      operation.fail('Import failed: ' + error.message);
      
      feedback.showError(
        'Import Failed',
        error.message,
        {
          actions: [
            {
              label: 'Try Again',
              type: 'primary',
              onClick: 'exampleUsage.handleFileImport()'
            },
            {
              label: 'Get Help',
              type: 'secondary',
              onClick: 'showImportHelp()'
            }
          ]
        }
      );
    }
  }

  /**
   * Example 3: Form Validation with Enhanced Feedback
   */
  setupFormValidationExample() {
    const forms = document.querySelectorAll('[data-enhanced-form]');
    
    forms.forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleEnhancedFormSubmit(form);
      });

      // Add real-time validation feedback
      const inputs = form.querySelectorAll('input, textarea, select');
      inputs.forEach(input => {
        input.addEventListener('blur', () => {
          this.validateField(input);
        });

        input.addEventListener('input', () => {
          // Clear error state on input
          this.clearFieldError(input);
        });
      });
    });
  }

  /**
   * Handle enhanced form submission
   */
  async handleEnhancedFormSubmit(form) {
    const feedback = uxIntegration.getComponent('feedback');
    const loading = uxIntegration.getComponent('loading');
    
    // Validate all fields
    const validationResult = this.validateForm(form);
    
    if (!validationResult.isValid) {
      // Show field-specific errors
      validationResult.errors.forEach(error => {
        this.showFieldError(error.field, error.message);
      });

      // Show general error notification
      feedback.showError(
        'Form Validation Failed',
        `Please fix ${validationResult.errors.length} error(s) before submitting`
      );
      
      return;
    }

    // Show loading state on submit button
    const submitButton = form.querySelector('button[type="submit"]');
    const buttonId = `submit-${Date.now()}`;
    if (submitButton) {
      submitButton.id = buttonId;
      loading.setButtonLoading(buttonId, true, 'Submitting...');
    }

    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Show success feedback
      feedback.showSuccess(
        'Form Submitted',
        'Your data has been saved successfully',
        {
          actions: [
            {
              label: 'View Result',
              type: 'primary',
              onClick: 'showFormResult()'
            },
            {
              label: 'Submit Another',
              type: 'secondary',
              onClick: 'resetForm()'
            }
          ]
        }
      );

      // Reset form
      form.reset();

    } catch (error) {
      feedback.showError(
        'Submission Failed',
        error.message,
        {
          persistent: true,
          actions: [
            {
              label: 'Retry',
              type: 'primary',
              onClick: 'exampleUsage.handleEnhancedFormSubmit(document.querySelector("[data-enhanced-form]"))'
            }
          ]
        }
      );
    } finally {
      // Hide loading state
      if (submitButton) {
        loading.setButtonLoading(buttonId, false);
      }
    }
  }

  /**
   * Validate individual field
   */
  validateField(field) {
    const feedback = uxIntegration.getComponent('feedback');
    
    // Clear previous error
    this.clearFieldError(field);

    // Required field validation
    if (field.hasAttribute('required') && !field.value.trim()) {
      this.showFieldError(field, 'This field is required');
      return false;
    }

    // Email validation
    if (field.type === 'email' && field.value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(field.value)) {
        this.showFieldError(field, 'Please enter a valid email address');
        return false;
      }
    }

    // Custom validation
    const customValidation = field.dataset.validate;
    if (customValidation) {
      const result = this.performCustomValidation(field.value, customValidation);
      if (!result.isValid) {
        this.showFieldError(field, result.message);
        return false;
      }
    }

    // Show success feedback for valid field
    this.showFieldSuccess(field);
    return true;
  }

  /**
   * Show field error
   */
  showFieldError(field, message) {
    field.classList.add('border-red-500', 'ring-2', 'ring-red-200');
    
    // Create or update error message
    let errorElement = field.parentNode.querySelector('.field-error');
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.className = 'field-error text-sm text-red-600 mt-1';
      field.parentNode.appendChild(errorElement);
    }
    errorElement.textContent = message;

    // Shake animation
    field.classList.add('error-shake');
    setTimeout(() => field.classList.remove('error-shake'), 500);
  }

  /**
   * Clear field error
   */
  clearFieldError(field) {
    field.classList.remove('border-red-500', 'ring-2', 'ring-red-200', 'border-green-500', 'ring-2', 'ring-green-200');
    
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
      errorElement.remove();
    }

    const successElement = field.parentNode.querySelector('.field-success');
    if (successElement) {
      successElement.remove();
    }
  }

  /**
   * Show field success
   */
  showFieldSuccess(field) {
    field.classList.add('border-green-500', 'ring-2', 'ring-green-200');
    
    // Create success indicator
    let successElement = field.parentNode.querySelector('.field-success');
    if (!successElement) {
      successElement = document.createElement('div');
      successElement.className = 'field-success text-sm text-green-600 mt-1';
      successElement.innerHTML = '<i class="fas fa-check-circle"></i> Valid';
      field.parentNode.appendChild(successElement);
    }
  }

  /**
   * Example 4: Mobile-Optimized Interactions
   */
  setupMobileExample() {
    const mobile = uxIntegration.getComponent('mobile');
    
    if (mobile.isMobile) {
      // Add touch feedback to interactive elements
      const touchElements = document.querySelectorAll('.button, .card, .interactive');
      touchElements.forEach(element => {
        element.classList.add('touch-target');
      });

      // Setup swipe gestures for navigation
      this.setupSwipeNavigation();
    }
  }

  /**
   * Setup swipe navigation for mobile
   */
  setupSwipeNavigation() {
    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });

    document.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      this.handleSwipeNavigation(touchStartX, touchEndX);
    });
  }

  /**
   * Handle swipe navigation
   */
  handleSwipeNavigation(startX, endX) {
    const swipeThreshold = 100;
    const diff = startX - endX;

    if (Math.abs(diff) < swipeThreshold) return;

    if (diff > 0) {
      // Swipe left - next page/section
      this.navigateNext();
    } else {
      // Swipe right - previous page/section
      this.navigatePrevious();
    }
  }

  /**
   * Utility functions
   */
  parseCSVData(csvString) {
    // Simplified CSV parsing
    const lines = csvString.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const data = {
      labels: [],
      datasets: [{
        label: 'Data',
        data: [],
        backgroundColor: ['#3b82f6', '#8b5cf6', '#06d6a0', '#60a5fa', '#a78bfa']
      }]
    };

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      data.labels.push(values[0]);
      data.datasets[0].data.push(parseFloat(values[1]) || 0);
    }

    return data;
  }

  isValidFileFormat(file) {
    const validTypes = ['text/csv', 'application/json', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    return validTypes.includes(file.type) || file.name.match(/\.(csv|json|xlsx)$/i);
  }

  async parseFile(file) {
    // Simplified file parsing
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        resolve({
          rows: content.split('\n').length,
          content: content
        });
      };
      reader.readAsText(file);
    });
  }

  isValidData(data) {
    return data && data.rows > 0;
  }

  loadExampleData() {
    const exampleData = `Month,Sales,Revenue
January,120,15000
February,150,18000
March,180,22000
April,140,17000
May,200,25000`;

    const dataInput = document.getElementById('chart-data');
    if (dataInput) {
      dataInput.value = exampleData;
      dataInput.dispatchEvent(new Event('input'));
    }

    uxIntegration.getComponent('feedback').showSuccess(
      'Example Loaded',
      'Sample data has been loaded into the form'
    );
  }

  navigateNext() {
    console.log('Navigating to next section');
  }

  navigatePrevious() {
    console.log('Navigating to previous section');
  }
}

// Export and initialize
export const exampleUsage = new ExampleUsage();

// Make available globally for HTML onclick handlers
window.exampleUsage = exampleUsage;
window.uxIntegration = uxIntegration;

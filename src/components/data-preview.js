// Data Preview and Validation System
class DataPreviewManager {
  constructor() {
    this.currentData = null;
    this.parsedData = null;
    this.validationErrors = [];
    this.previewVisible = false;
    this.validationRules = {
      maxDataPoints: 100,
      maxFileSize: 10 * 1024 * 1024, // 10MB
      requiredColumns: ['label', 'value'],
      supportedFormats: ['csv', 'json', 'txt']
    };
    
    this.init();
  }

  init() {
    this.createPreviewPanel();
    this.setupEventListeners();
    this.setupValidationRules();
  }

  // Create data preview panel
  createPreviewPanel() {
    const previewPanel = document.createElement('div');
    previewPanel.id = 'data-preview-panel';
    previewPanel.className = 'data-preview-panel';
    previewPanel.innerHTML = `
      <div class="preview-header">
        <h3 class="preview-title">
          <i class="fas fa-table"></i>
          Data Preview
        </h3>
        <div class="preview-actions">
          <button class="btn btn-sm btn-secondary" id="preview-close" aria-label="Close preview">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
      
      <div class="preview-content">
        <div class="validation-status" id="validation-status">
          <div class="status-icon">
            <i class="fas fa-check-circle"></i>
          </div>
          <div class="status-text">
            <div class="status-title">Data Valid</div>
            <div class="status-message">Your data is ready for chart generation</div>
          </div>
        </div>
        
        <div class="data-stats" id="data-stats">
          <div class="stat-item">
            <div class="stat-label">Rows</div>
            <div class="stat-value" id="stat-rows">0</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">Columns</div>
            <div class="stat-value" id="stat-columns">0</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">Data Points</div>
            <div class="stat-value" id="stat-points">0</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">Format</div>
            <div class="stat-value" id="stat-format">-</div>
          </div>
        </div>
        
        <div class="preview-table-container">
          <div class="table-controls">
            <button class="btn btn-sm btn-secondary" id="toggle-all-rows">
              <i class="fas fa-expand"></i> Show All
            </button>
            <button class="btn btn-sm btn-secondary" id="export-preview">
              <i class="fas fa-download"></i> Export
            </button>
          </div>
          <div class="preview-table-wrapper">
            <table class="preview-table" id="preview-table">
              <thead id="table-header"></thead>
              <tbody id="table-body"></tbody>
            </table>
          </div>
        </div>
        
        <div class="validation-errors" id="validation-errors" style="display: none;">
          <h4>
            <i class="fas fa-exclamation-triangle"></i>
            Validation Issues
          </h4>
          <ul id="error-list"></ul>
        </div>
        
        <div class="data-suggestions" id="data-suggestions" style="display: none;">
          <h4>
            <i class="fas fa-lightbulb"></i>
            Suggestions
          </h4>
          <ul id="suggestion-list"></ul>
        </div>
      </div>
      
      <div class="preview-footer">
        <button class="btn btn-secondary" id="preview-cancel">Cancel</button>
        <button class="btn btn-primary" id="preview-confirm">
          <i class="fas fa-check"></i> Use This Data
        </button>
      </div>
    `;
    
    // Insert after upload area
    const uploadTab = document.getElementById('upload-tab');
    if (uploadTab) {
      uploadTab.appendChild(previewPanel);
    }
    
    this.setupPreviewEvents();
  }

  // Setup preview panel events
  setupPreviewEvents() {
    const closeBtn = document.getElementById('preview-close');
    const cancelBtn = document.getElementById('preview-cancel');
    const confirmBtn = document.getElementById('preview-confirm');
    const toggleRowsBtn = document.getElementById('toggle-all-rows');
    const exportBtn = document.getElementById('export-preview');

    closeBtn.addEventListener('click', () => this.hidePreview());
    cancelBtn.addEventListener('click', () => this.hidePreview());
    confirmBtn.addEventListener('click', () => this.confirmData());
    toggleRowsBtn.addEventListener('click', () => this.toggleAllRows());
    exportBtn.addEventListener('click', () => this.exportPreviewData());
  }

  // Setup event listeners
  setupEventListeners() {
    // Listen for file uploads
    document.addEventListener('fileUploaded', (e) => {
      this.processFileData(e.detail.data, e.detail.file);
    });

    // Listen for text input changes
    const textInput = document.getElementById('data-input');
    if (textInput) {
      let debounceTimer;
      textInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          this.processTextInput(e.target.value);
        }, 500);
      });
    }
  }

  // Setup validation rules
  setupValidationRules() {
    this.validators = {
      csv: this.validateCSV.bind(this),
      json: this.validateJSON.bind(this),
      text: this.validateText.bind(this)
    };

    this.parsers = {
      csv: this.parseCSV.bind(this),
      json: this.parseJSON.bind(this),
      text: this.parseText.bind(this)
    };
  }

  // Process uploaded file data
  async processFileData(data, file) {
    try {
      const format = this.detectFileFormat(file);
      const parsedData = this.parsers[format](data);
      
      this.currentData = data;
      this.parsedData = parsedData;
      this.validationErrors = this.validateData(parsedData, format);
      
      this.showPreview(parsedData, format, file.name);
      
    } catch (error) {
      this.handleValidationError(error.message);
    }
  }

  // Process text input
  processTextInput(text) {
    if (!text.trim()) {
      this.hidePreview();
      return;
    }

    try {
      const parsedData = this.parseText(text);
      this.currentData = text;
      this.parsedData = parsedData;
      this.validationErrors = this.validateText(text);
      
      if (this.validationErrors.length === 0) {
        this.showPreview(parsedData, 'text', 'Manual Input');
      }
      
    } catch (error) {
      // Don't show preview for invalid text input
      console.warn('Text parsing failed:', error.message);
    }
  }

  // Detect file format
  detectFileFormat(file) {
    const extension = file.name.split('.').pop().toLowerCase();
    
    if (extension === 'csv') return 'csv';
    if (extension === 'json') return 'json';
    if (['txt', 'text'] .includes(extension)) return 'text';
    
    // Default to CSV for unknown extensions
    return 'csv';
  }

  // Parse CSV data
  parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) {
      throw new Error('CSV must have at least a header and one data row');
    }

    const headers = this.parseCSVLine(lines[0]);
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      const values = this.parseCSVLine(lines[i]);
      if (values.length === headers.length) {
        const row = {};
        headers.forEach((header, index) => {
          row[header] = values[index];
        });
        data.push(row);
      }
    }

    return {
      headers: headers,
      rows: data,
      format: 'csv',
      totalRows: data.length,
      totalColumns: headers.length
    };
  }

  // Parse CSV line (handles commas in quotes)
  parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result;
  }

  // Parse JSON data
  parseJSON(jsonText) {
    try {
      const data = JSON.parse(jsonText);
      
      if (Array.isArray(data)) {
        return {
          headers: Object.keys(data[0] || {}),
          rows: data,
          format: 'json',
          totalRows: data.length,
          totalColumns: Object.keys(data[0] || {}).length
        };
      } else if (typeof data === 'object') {
        // Convert object to array format
        const rows = Object.entries(data).map(([key, value]) => ({ label: key, value: value }));
        return {
          headers: ['label', 'value'],
          rows: rows,
          format: 'json',
          totalRows: rows.length,
          totalColumns: 2
        };
      }
    } catch (error) {
      throw new Error('Invalid JSON format: ' + error.message);
    }
  }

  // Parse text data
  parseText(text) {
    const lines = text.trim().split('\n');
    const data = [];

    lines.forEach(line => {
      // Try different patterns
      const patterns = [
        /([^:]+):\s*([\d,.]+)\s*(K|M|%|k|m)?/, // Label: Value Unit
        /([^,]+),\s*([\d,.]+)/, // Label, Value
        /([^-]+)\s*-\s*([\d,.]+)/, // Label - Value
        /(.+?)\s+(\d+(?:\.\d+)?)/ // Label Value (space separated)
      ];

      for (const pattern of patterns) {
        const match = line.match(pattern);
        if (match) {
          let value = parseFloat(match[2].replace(/,/g, ''));
          const unit = match[3]?.toUpperCase();
          
          if (unit === 'K' || unit === 'k') value *= 1000;
          if (unit === 'M' || unit === 'm') value *= 1000000;
          
          data.push({
            label: match[1].trim(),
            value: value,
            original: line.trim()
          });
          break;
        }
      }
    });

    if (data.length === 0) {
      throw new Error('Could not parse data. Please check the format.');
    }

    return {
      headers: ['label', 'value', 'original'],
      rows: data,
      format: 'text',
      totalRows: data.length,
      totalColumns: 3
    };
  }

  // Validate data
  validateData(data, format) {
    const errors = [];

    // Check if data exists
    if (!data || !data.rows || data.rows.length === 0) {
      errors.push({
        type: 'no_data',
        message: 'No data found in file',
        severity: 'error'
      });
      return errors;
    }

    // Check row limit
    if (data.totalRows > this.validationRules.maxDataPoints) {
      errors.push({
        type: 'too_many_rows',
        message: `Too many data points (${data.totalRows}). Maximum allowed is ${this.validationRules.maxDataPoints}`,
        severity: 'warning'
      });
    }

    // Check for required columns
    const hasLabel = data.headers.some(h => h.toLowerCase().includes('label') || h.toLowerCase().includes('name'));
    const hasValue = data.headers.some(h => h.toLowerCase().includes('value') || h.toLowerCase().includes('amount') || h.toLowerCase().includes('count'));

    if (!hasLabel) {
      errors.push({
        type: 'missing_label_column',
        message: 'No label/name column found. Consider adding a column with labels.',
        severity: 'warning'
      });
    }

    if (!hasValue) {
      errors.push({
        type: 'missing_value_column',
        message: 'No value/amount column found. Consider adding a column with numeric values.',
        severity: 'warning'
      });
    }

    // Validate numeric values
    const numericColumns = this.findNumericColumns(data);
    if (numericColumns.length === 0) {
      errors.push({
        type: 'no_numeric_data',
        message: 'No numeric columns found. Charts require numeric data.',
        severity: 'error'
      });
    }

    // Check for empty values
    const emptyCells = this.countEmptyCells(data);
    if (emptyCells > 0) {
      errors.push({
        type: 'empty_cells',
        message: `${emptyCells} empty cells found. Consider filling in missing data.`,
        severity: 'info'
      });
    }

    // Format-specific validation
    if (this.validators[format]) {
      const formatErrors = this.validators[format](data);
      errors.push(...formatErrors);
    }

    return errors;
  }

  // Validate CSV format
  validateCSV(data) {
    const errors = [];

    // Check for consistent column count
    const inconsistentRows = data.rows.filter(row => 
      Object.keys(row).length !== data.totalColumns
    );

    if (inconsistentRows.length > 0) {
      errors.push({
        type: 'inconsistent_columns',
        message: `${inconsistentRows.length} rows have inconsistent column counts.`,
        severity: 'warning'
      });
    }

    return errors;
  }

  // Validate JSON format
  validateJSON(data) {
    const errors = [];

    // Check for empty objects
    const emptyObjects = data.rows.filter(row => 
      Object.keys(row).length === 0
    );

    if (emptyObjects.length > 0) {
      errors.push({
        type: 'empty_objects',
        message: `${emptyObjects.length} empty objects found.`,
        severity: 'warning'
      });
    }

    return errors;
  }

  // Validate text format
  validateText(text) {
    const errors = [];

    // Check if text has recognizable patterns
    const hasPattern = /[:\-,\s]\s*[\d,.]+/.test(text);
    if (!hasPattern) {
      errors.push({
        type: 'unrecognized_format',
        message: 'Text format not recognized. Try using "Label: Value" format.',
        severity: 'warning'
      });
    }

    return errors;
  }

  // Find numeric columns
  findNumericColumns(data) {
    if (!data.rows || data.rows.length === 0) return [];

    const numericColumns = [];
    
    data.headers.forEach(header => {
      const isNumeric = data.rows.every(row => {
        const value = row[header];
        return value === '' || value === null || !isNaN(parseFloat(value));
      });
      
      if (isNumeric) {
        numericColumns.push(header);
      }
    });

    return numericColumns;
  }

  // Count empty cells
  countEmptyCells(data) {
    let emptyCount = 0;
    
    data.rows.forEach(row => {
      Object.values(row).forEach(value => {
        if (value === '' || value === null || value === undefined) {
          emptyCount++;
        }
      });
    });

    return emptyCount;
  }

  // Show preview panel
  showPreview(data, format, source) {
    this.previewVisible = true;
    const panel = document.getElementById('data-preview-panel');
    
    if (!panel) return;

    // Update statistics
    this.updateStatistics(data, format);
    
    // Update validation status
    this.updateValidationStatus();
    
    // Create preview table
    this.createPreviewTable(data);
    
    // Show suggestions
    this.showSuggestions(data);
    
    // Show panel
    panel.classList.add('show');
    
    // Announce to screen readers
    if (window.accessibility) {
      window.accessibility.announce(`Data preview loaded: ${data.totalRows} rows, ${data.totalColumns} columns`);
    }
  }

  // Hide preview panel
  hidePreview() {
    this.previewVisible = false;
    const panel = document.getElementById('data-preview-panel');
    if (panel) {
      panel.classList.remove('show');
    }
  }

  // Update statistics
  updateStatistics(data, format) {
    document.getElementById('stat-rows').textContent = data.totalRows;
    document.getElementById('stat-columns').textContent = data.totalColumns;
    document.getElementById('stat-points').textContent = data.totalRows * data.totalColumns;
    document.getElementById('stat-format').textContent = format.toUpperCase();
  }

  // Update validation status
  updateValidationStatus() {
    const statusDiv = document.getElementById('validation-status');
    const errorsDiv = document.getElementById('validation-errors');
    const errorList = document.getElementById('error-list');

    if (this.validationErrors.length === 0) {
      // Show success status
      statusDiv.className = 'validation-status success';
      statusDiv.querySelector('.status-icon i').className = 'fas fa-check-circle';
      statusDiv.querySelector('.status-title').textContent = 'Data Valid';
      statusDiv.querySelector('.status-message').textContent = 'Your data is ready for chart generation';
      errorsDiv.style.display = 'none';
    } else {
      // Show error status
      const hasErrors = this.validationErrors.some(e => e.severity === 'error');
      const hasWarnings = this.validationErrors.some(e => e.severity === 'warning');
      
      statusDiv.className = `validation-status ${hasErrors ? 'error' : hasWarnings ? 'warning' : 'info'}`;
      
      if (hasErrors) {
        statusDiv.querySelector('.status-icon i').className = 'fas fa-exclamation-circle';
        statusDiv.querySelector('.status-title').textContent = 'Validation Errors';
        statusDiv.querySelector('.status-message').textContent = 'Please fix the issues before proceeding';
      } else if (hasWarnings) {
        statusDiv.querySelector('.status-icon i').className = 'fas fa-exclamation-triangle';
        statusDiv.querySelector('.status-title').textContent = 'Warnings';
        statusDiv.querySelector('.status-message').textContent = 'Data is usable but has warnings';
      } else {
        statusDiv.querySelector('.status-icon i').className = 'fas fa-info-circle';
        statusDiv.querySelector('.status-title').textContent = 'Information';
        statusDiv.querySelector('.status-message').textContent = 'Data loaded with notes';
      }
      
      // Show error list
      errorsDiv.style.display = 'block';
      errorList.innerHTML = this.validationErrors.map(error => `
        <li class="validation-error ${error.severity}">
          <i class="fas fa-${this.getErrorIcon(error.severity)}"></i>
          <span>${error.message}</span>
        </li>
      `).join('');
    }
  }

  // Get error icon
  getErrorIcon(severity) {
    switch (severity) {
      case 'error': return 'exclamation-circle';
      case 'warning': return 'exclamation-triangle';
      case 'info': return 'info-circle';
      default: return 'question-circle';
    }
  }

  // Create preview table
  createPreviewTable(data) {
    const header = document.getElementById('table-header');
    const body = document.getElementById('table-body');
    
    // Create header
    header.innerHTML = `
      <tr>
        ${data.headers.map(h => `<th>${h}</th>`).join('')}
      </tr>
    `;
    
    // Create body (show first 10 rows)
    const maxRows = Math.min(data.rows.length, 10);
    body.innerHTML = data.rows.slice(0, maxRows).map(row => `
      <tr>
        ${data.headers.map(h => `<td>${row[h] || ''}</td>`).join('')}
      </tr>
    `).join('');
    
    // Store remaining rows for toggle
    this.remainingRows = data.rows.slice(maxRows);
    this.allRowsShown = false;
  }

  // Toggle all rows
  toggleAllRows() {
    const body = document.getElementById('table-body');
    const toggleBtn = document.getElementById('toggle-all-rows');
    
    if (this.allRowsShown) {
      // Show only first 10 rows
      this.createPreviewTable(this.parsedData);
      toggleBtn.innerHTML = '<i class="fas fa-expand"></i> Show All';
      this.allRowsShown = false;
    } else {
      // Show all rows
      body.innerHTML = this.parsedData.rows.map(row => `
        <tr>
          ${this.parsedData.headers.map(h => `<td>${row[h] || ''}</td>`).join('')}
        </tr>
      `).join('');
      toggleBtn.innerHTML = '<i class="fas fa-compress"></i> Show Less';
      this.allRowsShown = true;
    }
  }

  // Show suggestions
  showSuggestions(data) {
    const suggestionsDiv = document.getElementById('data-suggestions');
    const suggestionList = document.getElementById('suggestion-list');
    const suggestions = [];

    // Generate suggestions based on data
    if (data.totalRows < 3) {
      suggestions.push('Consider adding more data points for better visualization');
    }

    if (data.totalColumns > 5) {
      suggestions.push('Many columns detected. Consider focusing on key data for clearer charts');
    }

    const numericColumns = this.findNumericColumns(data);
    if (numericColumns.length === 1) {
      suggestions.push('Single numeric column detected. Perfect for bar or line charts');
    } else if (numericColumns.length > 1) {
      suggestions.push('Multiple numeric columns detected. Consider using a dashboard or multiple charts');
    }

    if (suggestions.length > 0) {
      suggestionsDiv.style.display = 'block';
      suggestionList.innerHTML = suggestions.map(suggestion => `
        <li class="suggestion-item">
          <i class="fas fa-lightbulb"></i>
          <span>${suggestion}</span>
        </li>
      `).join('');
    } else {
      suggestionsDiv.style.display = 'none';
    }
  }

  // Confirm data use
  confirmData() {
    if (this.validationErrors.some(e => e.severity === 'error')) {
      alert('Please fix validation errors before proceeding.');
      return;
    }

    // Convert data to text format for input
    const textData = this.convertToTextFormat(this.parsedData);
    const textInput = document.getElementById('data-input');
    
    if (textInput) {
      textInput.value = textData;
      
      // Switch to describe tab
      const describeTab = document.querySelector('[data-tab="describe"]');
      if (describeTab) {
        describeTab.click();
      }
      
      // Focus input
      textInput.focus();
    }

    this.hidePreview();
    
    // Show success message
    if (window.uiEnhancements) {
      window.uiEnhancements.showNotification('Data loaded successfully', 'success');
    }
  }

  // Convert parsed data to text format
  convertToTextFormat(data) {
    const labelColumn = data.headers.find(h => 
      h.toLowerCase().includes('label') || h.toLowerCase().includes('name')
    ) || data.headers[0];
    
    const valueColumn = data.headers.find(h => 
      h.toLowerCase().includes('value') || h.toLowerCase().includes('amount')
    ) || data.headers[1];

    return data.rows.map(row => 
      `${row[labelColumn]}: ${row[valueColumn]}`
    ).join('\n');
  }

  // Export preview data
  exportPreviewData() {
    if (!this.parsedData) return;

    // Convert to CSV
    const csvContent = this.convertToCSV(this.parsedData);
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'vizom-data-preview.csv';
    link.click();
    
    URL.revokeObjectURL(url);
  }

  // Convert to CSV
  convertToCSV(data) {
    const headers = data.headers.join(',');
    const rows = data.rows.map(row => 
      data.headers.map(h => `"${row[h] || ''}"`).join(',')
    );
    
    return [headers, ...rows].join('\n');
  }

  // Handle validation error
  handleValidationError(message) {
    if (window.errorHandler) {
      window.errorHandler.handleError({
        message: message,
        type: 'validation'
      }, { validation: true });
    }
  }
}

// Initialize data preview manager
document.addEventListener('DOMContentLoaded', () => {
  window.dataPreview = new DataPreviewManager();
});

export { DataPreviewManager };

// Data Import/Export System for VIZOM
class DataImportExport {
  constructor() {
    this.supportedFormats = ['csv', 'json', 'xlsx', 'xml', 'txt'];
    this.maxFileSize = 10 * 1024 * 1024; // 10MB
    this.init();
  }

  init() {
    this.setupImportHandlers();
    this.setupExportHandlers();
    this.setupDragAndDrop();
  }

  // Import System
  setupImportHandlers() {
    const fileInput = document.getElementById('csv-upload');
    if (fileInput) {
      fileInput.addEventListener('change', (e) => this.handleFileImport(e));
    }

    // Add advanced import button
    this.addAdvancedImportButton();
  }

  addAdvancedImportButton() {
    const uploadTab = document.getElementById('upload-tab');
    if (uploadTab) {
      const advancedImportHTML = `
        <div class="mt-4 p-4 brand-panel-info rounded-lg">
          <h4 class="font-medium brand-text-primary mb-2">Advanced import</h4>
          <div class="grid grid-cols-2 gap-2">
            <button class="import-source-btn text-sm brand-button-secondary px-3 py-2 rounded transition" data-source="google-sheets">
              <i class="fab fa-google"></i> Google Sheets
            </button>
            <button class="import-source-btn text-sm brand-button-secondary px-3 py-2 rounded transition" data-source="api">
              <i class="fas fa-code"></i> API
            </button>
            <button class="import-source-btn text-sm brand-button-secondary px-3 py-2 rounded transition" data-source="database">
              <i class="fas fa-database"></i> Database
            </button>
            <button class="import-source-btn text-sm brand-button-secondary px-3 py-2 rounded transition" data-source="url">
              <i class="fas fa-link"></i> URL
            </button>
          </div>
        </div>
      `;
      uploadTab.insertAdjacentHTML('beforeend', advancedImportHTML);
      
      // Setup event listeners for import sources
      uploadTab.querySelectorAll('.import-source-btn').forEach(btn => {
        btn.addEventListener('click', () => this.handleImportSource(btn.dataset.source));
      });
    }
  }

  setupDragAndDrop() {
    const dropZone = document.getElementById('drop-zone');
    if (dropZone) {
      ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, this.preventDefaults, false);
      });

      ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => {
          dropZone.classList.add('brand-border', 'brand-hover-surface');
        }, false);
      });

      ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => {
          dropZone.classList.remove('brand-border', 'brand-hover-surface');
        }, false);
      });

      dropZone.addEventListener('drop', (e) => this.handleDrop(e), false);
    }
  }

  preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    this.handleFiles(files);
  }

  handleFileImport(e) {
    const files = e.target.files;
    this.handleFiles(files);
  }

  async handleFiles(files) {
    if (files.length === 0) return;

    const file = files[0];
    
    // Validate file
    if (!this.validateFile(file)) {
      return;
    }

    try {
      this.showImportProgress();
      const data = await this.parseFile(file);
      this.displayImportedData(data, file.name);
      this.hideImportProgress();
      this.showNotification(`File "${file.name}" imported successfully`, 'success');
    } catch (error) {
      this.hideImportProgress();
      this.showNotification(`Import error: ${error.message}`, 'error');
    }
  }

  validateFile(file) {
    // Check file size
    if (file.size > this.maxFileSize) {
      this.showNotification('File is too large (max 10MB)', 'error');
      return false;
    }

    // Check file extension
    const extension = file.name.split('.').pop().toLowerCase();
    if (!this.supportedFormats.includes(extension)) {
      this.showNotification(`Unsupported format: ${extension}`, 'error');
      return false;
    }

    return true;
  }

  async parseFile(file) {
    const extension = file.name.split('.').pop().toLowerCase();
    
    switch (extension) {
      case 'csv':
        return this.parseCSV(file);
      case 'json':
        return this.parseJSON(file);
      case 'xlsx':
        return this.parseExcel(file);
      case 'xml':
        return this.parseXML(file);
      case 'txt':
        return this.parseText(file);
      default:
        throw new Error('Unsupported file format');
    }
  }

  async parseCSV(file) {
    const text = await this.readFileAsText(file);
    const lines = text.trim().split('\n');
    const hasHeader = this.detectHeader(lines[0]);
    const dataLines = hasHeader ? lines.slice(1) : lines;
    
    return dataLines.map((line, index) => {
      const values = this.parseCSVLine(line);
      return {
        label: values[0] || `Row ${index + 1}`,
        value: parseFloat(values[1]) || 0,
        category: values[2] || '',
        ...this.parseExtraColumns(values.slice(3))
      };
    }).filter(item => !isNaN(item.value));
  }

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

  detectHeader(line) {
    const values = this.parseCSVLine(line);
    return values.some(value => 
      value.toLowerCase().includes('label') ||
      value.toLowerCase().includes('name') ||
      value.toLowerCase().includes('value') ||
      value.toLowerCase().includes('amount')
    );
  }

  async parseJSON(file) {
    const text = await this.readFileAsText(file);
    const data = JSON.parse(text);
    
    if (Array.isArray(data)) {
      return data.map(item => ({
        label: item.label || item.name || item.x || 'Item',
        value: parseFloat(item.value || item.y || item.amount || 0),
        category: item.category || item.group || '',
        ...item
      })).filter(item => !isNaN(item.value));
    } else if (data.data && Array.isArray(data.data)) {
      return this.parseJSONData(data.data);
    } else {
      throw new Error('Invalid JSON structure');
    }
  }

  parseJSONData(data) {
    return data.map(item => ({
      label: item.label || item.name || 'Item',
      value: parseFloat(item.value || 0),
      category: item.category || '',
      ...item
    })).filter(item => !isNaN(item.value));
  }

  async parseExcel(file) {
    // Simple Excel parsing (would need a library like SheetJS for full support)
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          // This is a simplified version - in production, use a proper Excel library
          const data = e.target.result;
          const workbook = this.parseWorkbook(data);
          resolve(this.extractDataFromWorkbook(workbook));
        } catch (error) {
          reject(error);
        }
      };
      reader.readAsArrayBuffer(file);
    });
  }

  parseWorkbook(data) {
    // Placeholder for Excel parsing
    // In production, use libraries like xlsx or exceljs
    throw new Error('Excel parsing requires additional library');
  }

  async parseXML(file) {
    const text = await this.readFileAsText(file);
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, 'text/xml');
    
    const items = xmlDoc.getElementsByTagName('item') || xmlDoc.getElementsByTagName('row');
    const result = [];
    
    for (let item of items) {
      const label = item.getElementsByTagName('label')[0]?.textContent ||
                   item.getElementsByTagName('name')[0]?.textContent ||
                   'Item';
      const value = parseFloat(
        item.getElementsByTagName('value')[0]?.textContent ||
        item.getElementsByTagName('amount')[0]?.textContent ||
        0
      );
      
      if (!isNaN(value)) {
        result.push({ label, value });
      }
    }
    
    return result;
  }

  async parseText(file) {
    const text = await this.readFileAsText(file);
    return this.parseTextData(text);
  }

  parseTextData(text) {
    const lines = text.trim().split('\n');
    const data = [];
    
    lines.forEach(line => {
      const patterns = [
        /([A-Za-z\s]+?)(?:[:\-]?\s*\$?)([\d,.]+)\s*(K|M|%)?/gi,
        /([A-Za-z\s]+?)\s+(\d+(?:,\d+)*(?:\.\d+)?)\s*(K|M|%)?/gi,
        /([A-Za-z\s]+?)\s*=\s*(\d+(?:,\d+)*(?:\.\d+)?)\s*(K|M|%)?/gi
      ];
      
      for (const pattern of patterns) {
        let match;
        while ((match = pattern.exec(line)) !== null) {
          const label = match[1].trim();
          let value = parseFloat(match[2].replace(/,/g, ''));
          const unit = match[3]?.toUpperCase();
          
          if (unit === 'K') value *= 1000;
          if (unit === 'M') value *= 1000000;
          if (unit === '%') value = value / 100;
          
          if (!isNaN(value) && label) {
            data.push({ label, value });
          }
        }
        
        if (data.length > 0) break;
      }
    });
    
    return data;
  }

  parseExtraColumns(values) {
    const extra = {};
    const keys = ['category', 'description', 'metadata', 'extra'];
    values.forEach((value, index) => {
      if (value && keys[index]) {
        extra[keys[index]] = value;
      }
    });
    return extra;
  }

  readFileAsText(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(new Error('File reading failed'));
      reader.readAsText(file);
    });
  }

  // Import Sources
  handleImportSource(source) {
    switch (source) {
      case 'google-sheets':
        this.importFromGoogleSheets();
        break;
      case 'api':
        this.importFromAPI();
        break;
      case 'database':
        this.importFromDatabase();
        break;
      case 'url':
        this.importFromURL();
        break;
    }
  }

  importFromGoogleSheets() {
    // Google Sheets integration
    const sheetUrl = prompt('Enter Google Sheets URL:');
    if (sheetUrl) {
      this.showNotification('Google Sheets integration is under development', 'info');
    }
  }

  importFromAPI() {
    // API integration
    const apiUrl = prompt('Enter API URL:');
    if (apiUrl) {
      this.fetchDataFromAPI(apiUrl);
    }
  }

  async fetchDataFromAPI(url) {
    try {
      this.showImportProgress();
      const response = await fetch(url);
      const data = await response.json();
      const parsedData = this.parseJSONData(data);
      this.displayImportedData(parsedData, 'API Data');
      this.hideImportProgress();
      this.showNotification('Data successfully loaded from API', 'success');
    } catch (error) {
      this.hideImportProgress();
      this.showNotification(`Error loading from API: ${error.message}`, 'error');
    }
  }

  importFromDatabase() {
    // Database integration
    this.showNotification('Database integration is under development', 'info');
  }

  async importFromURL() {
    const url = prompt('Enter data file URL:');
    if (url) {
      try {
        this.showImportProgress();
        const response = await fetch(url);
        const contentType = response.headers.get('content-type');
        let data;
        
        if (contentType?.includes('json')) {
          data = await response.json();
          data = this.parseJSONData(data);
        } else {
          const text = await response.text();
          data = this.parseTextData(text);
        }
        
        this.displayImportedData(data, 'URL Data');
        this.hideImportProgress();
        this.showNotification('Data successfully loaded from URL', 'success');
      } catch (error) {
        this.hideImportProgress();
        this.showNotification(`Error loading from URL: ${error.message}`, 'error');
      }
    }
  }

  // Export System
  setupExportHandlers() {
    this.addExportOptions();
  }

  addExportOptions() {
    const exportSection = document.querySelector('#settings-panel');
    if (exportSection) {
      const exportHTML = `
        <div class="space-y-4">
          <h3 class="text-lg font-semibold text-slate-900">Data export</h3>
          <div class="grid grid-cols-2 gap-2">
            <button class="export-btn bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:border-blue-400 hover:text-blue-600 transition" data-format="csv">
              <i class="fas fa-file-csv"></i> CSV
            </button>
            <button class="export-btn bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:border-blue-400 hover:text-blue-600 transition" data-format="json">
              <i class="fas fa-file-code"></i> JSON
            </button>
            <button class="export-btn bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:border-blue-400 hover:text-blue-600 transition" data-format="xlsx">
              <i class="fas fa-file-excel"></i> Excel
            </button>
            <button class="export-btn bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:border-blue-400 hover:text-blue-600 transition" data-format="xml">
              <i class="fas fa-file-code"></i> XML
            </button>
          </div>
          <div class="flex gap-2">
            <button id="export-chart" class="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
              <i class="fas fa-download"></i> Export chart
            </button>
            <button id="export-report" class="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
              <i class="fas fa-file-pdf"></i> Export report
            </button>
          </div>
        </div>
      `;
      
      exportSection.insertAdjacentHTML('beforeend', exportHTML);
      
      // Setup export event listeners
      exportSection.querySelectorAll('.export-btn').forEach(btn => {
        btn.addEventListener('click', () => this.exportData(btn.dataset.format));
      });
      
      document.getElementById('export-chart').addEventListener('click', () => this.exportChart());
      document.getElementById('export-report').addEventListener('click', () => this.exportReport());
    }
  }

  exportData(format) {
    const data = this.getCurrentChartData();
    if (!data || data.length === 0) {
      this.showNotification('No data to export', 'warning');
      return;
    }

    let content, filename, mimeType;

    switch (format) {
      case 'csv':
        content = this.convertToCSV(data);
        filename = `vizom-data-${Date.now()}.csv`;
        mimeType = 'text/csv';
        break;
      case 'json':
        content = JSON.stringify(data, null, 2);
        filename = `vizom-data-${Date.now()}.json`;
        mimeType = 'application/json';
        break;
      case 'xlsx':
        this.exportToExcel(data);
        return;
      case 'xml':
        content = this.convertToXML(data);
        filename = `vizom-data-${Date.now()}.xml`;
        mimeType = 'application/xml';
        break;
      default:
        return;
    }

    this.downloadFile(content, filename, mimeType);
    this.showNotification(`Data exported to ${format.toUpperCase()}`, 'success');
  }

  convertToCSV(data) {
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          return typeof value === 'string' && value.includes(',') 
            ? `"${value}"` 
            : value;
        }).join(',')
      )
    ].join('\n');
    
    return csvContent;
  }

  convertToXML(data) {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<data>\n';
    
    data.forEach(item => {
      xml += '  <item>\n';
      Object.entries(item).forEach(([key, value]) => {
        xml += `    <${key}>${value}</${key}>\n`;
      });
      xml += '  </item>\n';
    });
    
    xml += '</data>';
    return xml;
  }

  exportToExcel(data) {
    // Simplified Excel export (would need a library like SheetJS)
    this.showNotification('Export to Excel requires an additional library', 'info');
  }

  exportChart() {
    const chartElement = document.getElementById('preview');
    if (!chartElement) {
      this.showNotification('No chart to export', 'warning');
      return;
    }

    if (window.chartEngine) {
      const svgData = window.chartEngine.exportChart(chartElement, 'svg');
      if (svgData) {
        const blob = new Blob([svgData], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `vizom-chart-${Date.now()}.svg`;
        a.click();
        URL.revokeObjectURL(url);
        
        this.showNotification('Chart exported', 'success');
      }
    }
  }

  exportReport() {
    // Generate PDF report
    this.showNotification('PDF report export is under development', 'info');
  }

  downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  // Utility Functions
  getCurrentChartData() {
    // Get current chart data from the generator
    if (window.aiService && window.aiService.currentChartData) {
      return window.aiService.currentChartData;
    }
    
    // Fallback: try to extract from preview
    const preview = document.getElementById('preview');
    if (preview) {
      // This would need to be implemented based on how data is stored
      return [];
    }
    
    return [];
  }

  displayImportedData(data, filename) {
    const input = document.getElementById('prompt-input');
    if (input && data.length > 0) {
      const text = data.map(item => 
        `${item.label}: ${item.value}${item.category ? ` (${item.category})` : ''}`
      ).join('\n');
      
      input.value = text;
      
      // Update character count
      const counter = document.getElementById('char-count');
      if (counter) {
        counter.textContent = `${text.length} characters`;
      }
      
      // Trigger chart generation
      const generateBtn = document.getElementById('smart-parse-btn');
      if (generateBtn) {
        generateBtn.click();
      }
    }
  }

  showImportProgress() {
    const fileInfo = document.getElementById('file-info');
    if (fileInfo) {
      fileInfo.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Importing data...';
      fileInfo.classList.remove('hidden');
    }
  }

  hideImportProgress() {
    const fileInfo = document.getElementById('file-info');
    if (fileInfo) {
      fileInfo.classList.add('hidden');
    }
  }

  showNotification(message, type = 'info') {
    if (window.uiEnhancements) {
      window.uiEnhancements.showNotification(message, type);
    }
  }
}

// Initialize Data Import/Export
document.addEventListener('DOMContentLoaded', () => {
  window.dataImportExport = new DataImportExport();
});

export { DataImportExport };

/**
 * Chart Save/Load Service
 * Handles saving, loading, and managing chart configurations with local storage and cloud sync
 */

class ChartSaveLoadService {
  constructor() {
    this.savedCharts = new Map();
    this.storageKey = 'vizom_saved_charts';
    this.maxLocalCharts = 50;
    this.cloudSyncEnabled = false;
    this.init();
  }

  init() {
    this.loadFromLocalStorage();
    this.setupSaveLoadStyles();
    this.setupAutoSave();
  }

  /**
   * Setup save/load styles
   */
  setupSaveLoadStyles() {
    if (document.getElementById('save-load-styles')) return;

    const styles = document.createElement('style');
    styles.id = 'save-load-styles';
    styles.textContent = `
      /* Save/Load Panel */
      .save-load-panel {
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        border: 1px solid #e5e7eb;
        overflow: hidden;
        max-height: 500px;
        display: flex;
        flex-direction: column;
      }

      .save-load-header {
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        color: white;
        padding: 16px 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .save-load-title {
        font-size: 16px;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .save-load-close {
        background: rgba(255, 255, 255, 0.2);
        border: none;
        color: white;
        width: 28px;
        height: 28px;
        border-radius: 6px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.2s ease;
      }

      .save-load-close:hover {
        background: rgba(255, 255, 255, 0.3);
      }

      /* Save Form */
      .save-form {
        padding: 20px;
        border-bottom: 1px solid #e5e7eb;
      }

      .save-form-title {
        font-size: 14px;
        font-weight: 600;
        color: #1f2937;
        margin-bottom: 12px;
      }

      .save-form-description {
        font-size: 12px;
        color: #6b7280;
        margin-bottom: 16px;
      }

      .form-group {
        margin-bottom: 16px;
      }

      .form-label {
        display: block;
        font-size: 13px;
        font-weight: 500;
        color: #374151;
        margin-bottom: 6px;
      }

      .form-input {
        width: 100%;
        padding: 8px 12px;
        border: 1px solid #d1d5db;
        border-radius: 6px;
        font-size: 13px;
        transition: all 0.2s ease;
      }

      .form-input:focus {
        outline: none;
        border-color: #10b981;
        box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
      }

      .form-textarea {
        resize: vertical;
        min-height: 60px;
      }

      .form-select {
        width: 100%;
        padding: 8px 12px;
        border: 1px solid #d1d5db;
        border-radius: 6px;
        font-size: 13px;
        background: white;
        cursor: pointer;
      }

      /* Save Options */
      .save-options {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
        margin-bottom: 16px;
      }

      .save-option {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px;
        border: 1px solid #e5e7eb;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .save-option:hover {
        background: #f9fafb;
        border-color: #d1d5db;
      }

      .save-option.selected {
        background: #ecfdf5;
        border-color: #10b981;
      }

      .save-option-checkbox {
        width: 16px;
        height: 16px;
        border: 2px solid #d1d5db;
        border-radius: 3px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
      }

      .save-option.selected .save-option-checkbox {
        background: #10b981;
        border-color: #10b981;
      }

      .save-option.selected .save-option-checkbox::after {
        content: '✓';
        color: white;
        font-size: 10px;
        font-weight: bold;
      }

      /* Saved Charts List */
      .saved-charts-list {
        flex: 1;
        overflow-y: auto;
        padding: 16px;
      }

      .saved-charts-empty {
        text-align: center;
        padding: 40px 20px;
        color: #6b7280;
      }

      .saved-charts-empty-icon {
        font-size: 48px;
        margin-bottom: 12px;
        opacity: 0.3;
      }

      .saved-charts-empty-text {
        font-size: 14px;
        margin-bottom: 16px;
      }

      /* Saved Chart Card */
      .saved-chart-card {
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        padding: 12px;
        margin-bottom: 12px;
        cursor: pointer;
        transition: all 0.2s ease;
        position: relative;
      }

      .saved-chart-card:hover {
        border-color: #10b981;
        box-shadow: 0 2px 8px rgba(16, 185, 129, 0.1);
      }

      .saved-chart-card.selected {
        border-color: #10b981;
        background: #ecfdf5;
      }

      .saved-chart-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        margin-bottom: 8px;
      }

      .saved-chart-info {
        flex: 1;
      }

      .saved-chart-title {
        font-weight: 600;
        color: #1f2937;
        font-size: 14px;
        margin-bottom: 4px;
      }

      .saved-chart-meta {
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 11px;
        color: #6b7280;
      }

      .saved-chart-description {
        color: #6b7280;
        font-size: 12px;
        line-height: 1.4;
        margin-bottom: 8px;
      }

      .saved-chart-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        margin-bottom: 8px;
      }

      .saved-chart-tag {
        padding: 2px 6px;
        background: #f3f4f6;
        color: #6b7280;
        border-radius: 10px;
        font-size: 10px;
        font-weight: 500;
      }

      .saved-chart-actions {
        display: flex;
        gap: 8px;
        opacity: 0;
        transition: opacity 0.2s ease;
      }

      .saved-chart-card:hover .saved-chart-actions {
        opacity: 1;
      }

      .saved-chart-action {
        padding: 4px 8px;
        background: #f3f4f6;
        border: none;
        border-radius: 4px;
        font-size: 11px;
        color: #6b7280;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .saved-chart-action:hover {
        background: #e5e7eb;
        color: #374151;
      }

      .saved-chart-action.danger:hover {
        background: #fef2f2;
        color: #dc2626;
      }

      /* Action Buttons */
      .save-load-actions {
        display: flex;
        gap: 12px;
        padding: 16px 20px;
        background: #f9fafb;
        border-top: 1px solid #e5e7eb;
      }

      .save-load-button {
        flex: 1;
        padding: 10px 16px;
        border-radius: 8px;
        font-size: 13px;
        font-weight: 500;
        border: none;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
      }

      .save-load-button.primary {
        background: #10b981;
        color: white;
      }

      .save-load-button.primary:hover {
        background: #059669;
      }

      .save-load-button.secondary {
        background: white;
        color: #6b7280;
        border: 1px solid #d1d5db;
      }

      .save-load-button.secondary:hover {
        background: #f9fafb;
        border-color: #9ca3af;
      }

      /* Search and Filter */
      .search-filter-bar {
        display: flex;
        gap: 12px;
        margin-bottom: 16px;
      }

      .search-input {
        flex: 1;
        padding: 8px 12px;
        border: 1px solid #d1d5db;
        border-radius: 6px;
        font-size: 13px;
        background: white;
      }

      .filter-select {
        padding: 8px 12px;
        border: 1px solid #d1d5db;
        border-radius: 6px;
        font-size: 13px;
        background: white;
        cursor: pointer;
      }

      /* Import/Export */
      .import-export-section {
        padding: 16px 20px;
        background: #f9fafb;
        border-top: 1px solid #e5e7eb;
        display: flex;
        gap: 12px;
      }

      .import-export-button {
        flex: 1;
        padding: 8px 12px;
        border: 1px solid #d1d5db;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 500;
        background: white;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
      }

      .import-export-button:hover {
        background: #f3f4f6;
        border-color: #9ca3af;
      }

      /* Cloud Sync Status */
      .cloud-sync-status {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        background: #f0f9ff;
        border: 1px solid #bae6fd;
        border-radius: 6px;
        font-size: 12px;
        color: #0369a1;
        margin-bottom: 12px;
      }

      .cloud-sync-status.synced {
        background: #f0fdf4;
        border-color: #bbf7d0;
        color: #166534;
      }

      .cloud-sync-status.error {
        background: #fef2f2;
        border-color: #fecaca;
        color: #dc2626;
      }

      /* Mobile Optimizations */
      @media (max-width: 768px) {
        .save-load-panel {
          margin: 8px;
          max-height: 400px;
        }
        
        .save-options {
          grid-template-columns: 1fr;
        }
        
        .search-filter-bar {
          flex-direction: column;
        }
        
        .import-export-section {
          flex-direction: column;
        }
      }
    `;
    document.head.appendChild(styles);
  }

  /**
   * Setup auto-save functionality
   */
  setupAutoSave() {
    // Auto-save every 5 minutes if there are unsaved changes
    setInterval(() => {
      if (this.hasUnsavedChanges()) {
        this.autoSave();
      }
    }, 5 * 60 * 1000);
  }

  /**
   * Create save/load panel
   */
  createSaveLoadPanel(containerId, options = {}) {
    const {
      showSave = true,
      showLoad = true,
      showImport = true,
      showExport = true,
      onChartLoad = null,
      onChartSave = null
    } = options;

    const container = document.getElementById(containerId);
    if (!container) return null;

    const panelHTML = this.generateSaveLoadPanelHTML(options);
    container.innerHTML = panelHTML;

    // Setup event handlers
    this.setupSaveLoadEvents(containerId, options);

    // Store callbacks
    this.currentCallbacks = {
      onChartLoad,
      onChartSave
    };

    return containerId;
  }

  /**
   * Generate save/load panel HTML
   */
  generateSaveLoadPanelHTML(options) {
    const savedCharts = Array.from(this.savedCharts.values());

    return `
      <div class="save-load-panel">
        <div class="save-load-header">
          <div class="save-load-title">
            <i class="fas fa-save"></i>
            Save & Load Charts
          </div>
          <button class="save-load-close" onclick="chartSaveLoad.closePanel()">
            <i class="fas fa-times"></i>
          </button>
        </div>

        ${options.showSave ? `
          <div class="save-form">
            <div class="save-form-title">Save Current Chart</div>
            <div class="save-form-description">
              Save your chart configuration for later use
            </div>
            
            <div class="form-group">
              <label class="form-label">Chart Name *</label>
              <input type="text" class="form-input" id="chart-name-input" placeholder="My Awesome Chart" maxlength="50">
            </div>
            
            <div class="form-group">
              <label class="form-label">Description</label>
              <textarea class="form-input form-textarea" id="chart-description-input" placeholder="Brief description of your chart..." maxlength="200"></textarea>
            </div>
            
            <div class="form-group">
              <label class="form-label">Category</label>
              <select class="form-select" id="chart-category-select">
                <option value="business">Business</option>
                <option value="analytics">Analytics</option>
                <option value="personal">Personal</option>
                <option value="education">Education</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div class="save-options">
              <div class="save-option selected" data-option="data">
                <div class="save-option-checkbox"></div>
                <div>
                  <div style="font-size: 12px; font-weight: 500; color: #374151;">Save Data</div>
                  <div style="font-size: 10px; color: #6b7280;">Include chart data</div>
                </div>
              </div>
              
              <div class="save-option selected" data-option="style">
                <div class="save-option-checkbox"></div>
                <div>
                  <div style="font-size: 12px; font-weight: 500; color: #374151;">Save Style</div>
                  <div style="font-size: 10px; color: #6b7280;">Include colors & fonts</div>
                </div>
              </div>
              
              <div class="save-option" data-option="cloud">
                <div class="save-option-checkbox"></div>
                <div>
                  <div style="font-size: 12px; font-weight: 500; color: #374151;">Cloud Sync</div>
                  <div style="font-size: 10px; color: #6b7280;">Sync to cloud storage</div>
                </div>
              </div>
              
              <div class="save-option" data-option="public">
                <div class="save-option-checkbox"></div>
                <div>
                  <div style="font-size: 12px; font-weight: 500; color: #374151;">Make Public</div>
                  <div style="font-size: 10px; color: #6b7280;">Share with others</div>
                </div>
              </div>
            </div>
            
            <button class="save-load-button primary" onclick="chartSaveLoad.saveCurrentChart()">
              <i class="fas fa-save"></i>
              Save Chart
            </button>
          </div>
        ` : ''}

        ${options.showLoad ? `
          <div class="saved-charts-list">
            <div class="search-filter-bar">
              <input type="text" class="search-input" placeholder="Search saved charts..." oninput="chartSaveLoad.filterCharts(this.value)">
              <select class="filter-select" onchange="chartSaveLoad.filterByCategory(this.value)">
                <option value="all">All Categories</option>
                <option value="business">Business</option>
                <option value="analytics">Analytics</option>
                <option value="personal">Personal</option>
                <option value="education">Education</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            ${savedCharts.length === 0 ? `
              <div class="saved-charts-empty">
                <div class="saved-charts-empty-icon">
                  <i class="fas fa-chart-line"></i>
                </div>
                <div class="saved-charts-empty-text">No saved charts yet</div>
                <div style="font-size: 12px; color: #9ca3af;">Create and save your first chart to get started</div>
              </div>
            ` : `
              <div id="saved-charts-container">
                ${savedCharts.map(chart => this.generateSavedChartCardHTML(chart)).join('')}
              </div>
            `}
          </div>
        ` : ''}

        ${this.cloudSyncEnabled ? `
          <div class="cloud-sync-status synced" id="cloud-sync-status">
            <i class="fas fa-cloud-check"></i>
            <span>Synced to cloud</span>
          </div>
        ` : ''}

        ${options.showImport || options.showExport ? `
          <div class="import-export-section">
            ${options.showImport ? `
              <button class="import-export-button" onclick="chartSaveLoad.importChart()">
                <i class="fas fa-upload"></i>
                Import Chart
              </button>
            ` : ''}
            
            ${options.showExport ? `
              <button class="import-export-button" onclick="chartSaveLoad.exportAllCharts()">
                <i class="fas fa-download"></i>
                Export All
              </button>
            ` : ''}
          </div>
        ` : ''}

        <div class="save-load-actions">
          <button class="save-load-button secondary" onclick="chartSaveLoad.closePanel()">
            <i class="fas fa-times"></i>
            Close
          </button>
          <button class="save-load-button primary" onclick="chartSaveLoad.loadSelectedChart()" id="load-chart-btn" disabled>
            <i class="fas fa-folder-open"></i>
            Load Chart
          </button>
        </div>
      </div>
    `;
  }

  /**
   * Generate saved chart card HTML
   */
  generateSavedChartCardHTML(chart) {
    const date = new Date(chart.createdAt);
    const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return `
      <div class="saved-chart-card" data-chart-id="${chart.id}" onclick="chartSaveLoad.selectChart('${chart.id}')">
        <div class="saved-chart-header">
          <div class="saved-chart-info">
            <div class="saved-chart-title">${chart.name}</div>
            <div class="saved-chart-meta">
              <span><i class="fas fa-chart-${chart.chartType}"></i> ${chart.chartType}</span>
              <span><i class="fas fa-folder"></i> ${chart.category}</span>
              <span><i class="fas fa-clock"></i> ${formattedDate}</span>
            </div>
          </div>
        </div>
        
        ${chart.description ? `
          <div class="saved-chart-description">${chart.description}</div>
        ` : ''}
        
        ${chart.tags && chart.tags.length > 0 ? `
          <div class="saved-chart-tags">
            ${chart.tags.map(tag => `<span class="saved-chart-tag">${tag}</span>`).join('')}
          </div>
        ` : ''}
        
        <div class="saved-chart-actions">
          <button class="saved-chart-action" onclick="event.stopPropagation(); chartSaveLoad.duplicateChart('${chart.id}')">
            <i class="fas fa-copy"></i> Duplicate
          </button>
          <button class="saved-chart-action" onclick="event.stopPropagation(); chartSaveLoad.exportChart('${chart.id}')">
            <i class="fas fa-download"></i> Export
          </button>
          <button class="saved-chart-action danger" onclick="event.stopPropagation(); chartSaveLoad.deleteChart('${chart.id}')">
            <i class="fas fa-trash"></i> Delete
          </button>
        </div>
      </div>
    `;
  }

  /**
   * Setup save/load events
   */
  setupSaveLoadEvents(containerId, options) {
    // Setup save option toggles
    document.querySelectorAll('.save-option').forEach(option => {
      option.addEventListener('click', () => {
        option.classList.toggle('selected');
      });
    });
  }

  /**
   * Save current chart
   */
  async saveCurrentChart() {
    const nameInput = document.getElementById('chart-name-input');
    const descriptionInput = document.getElementById('chart-description-input');
    const categorySelect = document.getElementById('chart-category-select');

    if (!nameInput || !nameInput.value.trim()) {
      if (window.feedbackSystem) {
        window.feedbackSystem.showWarning('Missing Name', 'Please enter a name for your chart');
      }
      return;
    }

    try {
      // Get current chart configuration
      const chartConfig = this.getCurrentChartConfig();
      if (!chartConfig) {
        throw new Error('No chart configuration available');
      }

      // Get save options
      const saveOptions = this.getSaveOptions();

      // Create chart object
      const chart = {
        id: 'chart-' + Date.now(),
        name: nameInput.value.trim(),
        description: descriptionInput.value.trim(),
        category: categorySelect.value,
        chartType: chartConfig.type,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        config: {},
        tags: this.generateTags(chartConfig, categorySelect.value)
      };

      // Save configuration based on options
      if (saveOptions.data) {
        chart.config.data = chartConfig.data;
      }
      if (saveOptions.style) {
        chart.config.options = chartConfig.options;
      }

      // Add to saved charts
      this.savedCharts.set(chart.id, chart);

      // Save to local storage
      this.saveToLocalStorage();

      // Cloud sync if enabled
      if (saveOptions.cloud && this.cloudSyncEnabled) {
        await this.syncToCloud(chart);
      }

      // Update UI
      this.updateSavedChartsList();

      // Clear form
      nameInput.value = '';
      descriptionInput.value = '';

      // Show success feedback
      if (window.feedbackSystem) {
        window.feedbackSystem.showSuccess(
          'Chart Saved',
          `"${chart.name}" has been saved successfully`
        );
      }

      // Trigger callback
      if (this.currentCallbacks?.onChartSave) {
        this.currentCallbacks.onChartSave(chart);
      }

    } catch (error) {
      console.error('Failed to save chart:', error);
      if (window.feedbackSystem) {
        window.feedbackSystem.showError(
          'Save Failed',
          error.message
        );
      }
    }
  }

  /**
   * Load selected chart
   */
  async loadSelectedChart() {
    const selectedCard = document.querySelector('.saved-chart-card.selected');
    if (!selectedCard) return;

    const chartId = selectedCard.dataset.chartId;
    const chart = this.savedCharts.get(chartId);
    if (!chart) return;

    try {
      // Trigger callback with chart configuration
      if (this.currentCallbacks?.onChartLoad) {
        await this.currentCallbacks.onChartLoad(chart);
      }

      // Show success feedback
      if (window.feedbackSystem) {
        window.feedbackSystem.showSuccess(
          'Chart Loaded',
          `"${chart.name}" has been loaded successfully`
        );
      }

      // Close panel
      this.closePanel();

    } catch (error) {
      console.error('Failed to load chart:', error);
      if (window.feedbackSystem) {
        window.feedbackSystem.showError(
          'Load Failed',
          error.message
        );
      }
    }
  }

  /**
   * Select chart
   */
  selectChart(chartId) {
    // Remove previous selection
    document.querySelectorAll('.saved-chart-card').forEach(card => {
      card.classList.remove('selected');
    });

    // Add selection to clicked chart
    const selectedCard = document.querySelector(`[data-chart-id="${chartId}"]`);
    if (selectedCard) {
      selectedCard.classList.add('selected');
      
      // Enable load button
      const loadButton = document.getElementById('load-chart-btn');
      if (loadButton) {
        loadButton.disabled = false;
      }
    }
  }

  /**
   * Delete chart
   */
  deleteChart(chartId) {
    const chart = this.savedCharts.get(chartId);
    if (!chart) return;

    if (window.feedbackSystem) {
      window.feedbackSystem.showConfirmation({
        title: 'Delete Chart',
        message: `Are you sure you want to delete "${chart.name}"? This action cannot be undone.`,
        type: 'warning',
        confirmText: 'Delete',
        cancelText: 'Cancel',
        onConfirm: () => {
          this.savedCharts.delete(chartId);
          this.saveToLocalStorage();
          this.updateSavedChartsList();
          
          if (window.feedbackSystem) {
            window.feedbackSystem.showSuccess(
              'Chart Deleted',
              `"${chart.name}" has been deleted`
            );
          }
        }
      });
    }
  }

  /**
   * Duplicate chart
   */
  duplicateChart(chartId) {
    const originalChart = this.savedCharts.get(chartId);
    if (!originalChart) return;

    const duplicatedChart = {
      ...originalChart,
      id: 'chart-' + Date.now(),
      name: originalChart.name + ' (Copy)',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.savedCharts.set(duplicatedChart.id, duplicatedChart);
    this.saveToLocalStorage();
    this.updateSavedChartsList();

    if (window.feedbackSystem) {
      window.feedbackSystem.showSuccess(
        'Chart Duplicated',
        `"${originalChart.name}" has been duplicated`
      );
    }
  }

  /**
   * Export single chart
   */
  exportChart(chartId) {
    const chart = this.savedCharts.get(chartId);
    if (!chart) return;

    const exportData = {
      ...chart,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${chart.name.replace(/\s+/g, '-').toLowerCase()}-chart.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  }

  /**
   * Export all charts
   */
  exportAllCharts() {
    const exportData = {
      charts: Array.from(this.savedCharts.values()),
      exportedAt: new Date().toISOString(),
      version: '1.0',
      totalCharts: this.savedCharts.size
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `vizom-charts-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);

    if (window.feedbackSystem) {
      window.feedbackSystem.showSuccess(
        'Export Complete',
        `${this.savedCharts.size} charts exported successfully`
      );
    }
  }

  /**
   * Import chart
   */
  importChart() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      try {
        const text = await file.text();
        const data = JSON.parse(text);

        if (data.charts && Array.isArray(data.charts)) {
          // Import multiple charts
          data.charts.forEach(chart => {
            chart.id = 'chart-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
            this.savedCharts.set(chart.id, chart);
          });

          if (window.feedbackSystem) {
            window.feedbackSystem.showSuccess(
              'Import Complete',
              `${data.charts.length} charts imported successfully`
            );
          }
        } else if (data.config) {
          // Import single chart
          data.id = 'chart-' + Date.now();
          this.savedCharts.set(data.id, data);

          if (window.feedbackSystem) {
            window.feedbackSystem.showSuccess(
              'Import Complete',
              `"${data.name}" has been imported successfully`
            );
          }
        }

        this.saveToLocalStorage();
        this.updateSavedChartsList();

      } catch (error) {
        console.error('Import failed:', error);
        if (window.feedbackSystem) {
          window.feedbackSystem.showError(
            'Import Failed',
            'Invalid file format. Please select a valid chart export file.'
          );
        }
      }
    };

    fileInput.click();
  }

  /**
   * Filter charts by search term
   */
  filterCharts(searchTerm) {
    const cards = document.querySelectorAll('.saved-chart-card');
    const term = searchTerm.toLowerCase();

    cards.forEach(card => {
      const chartId = card.dataset.chartId;
      const chart = this.savedCharts.get(chartId);
      
      if (!chart) return;

      const matches = 
        chart.name.toLowerCase().includes(term) ||
        (chart.description && chart.description.toLowerCase().includes(term)) ||
        (chart.tags && chart.tags.some(tag => tag.toLowerCase().includes(term)));

      card.style.display = matches ? 'block' : 'none';
    });
  }

  /**
   * Filter charts by category
   */
  filterByCategory(category) {
    const cards = document.querySelectorAll('.saved-chart-card');

    cards.forEach(card => {
      const chartId = card.dataset.chartId;
      const chart = this.savedCharts.get(chartId);
      
      if (!chart) return;

      const matches = category === 'all' || chart.category === category;
      card.style.display = matches ? 'block' : 'none';
    });
  }

  /**
   * Get current chart configuration
   */
  getCurrentChartConfig() {
    // Try to get chart from global scope
    if (window.chart) {
      return {
        type: window.chart.config.type,
        data: window.chart.config.data,
        options: window.chart.config.options
      };
    }

    // Try to get from chart renderer
    if (window.chartRenderer && window.chartRenderer.charts.size > 0) {
      const chart = window.chartRenderer.charts.values().next().value;
      return {
        type: chart.config.type,
        data: chart.config.data,
        options: chart.config.options
      };
    }

    return null;
  }

  /**
   * Get save options
   */
  getSaveOptions() {
    const options = {
      data: false,
      style: false,
      cloud: false,
      public: false
    };

    document.querySelectorAll('.save-option').forEach(option => {
      if (option.classList.contains('selected')) {
        options[option.dataset.option] = true;
      }
    });

    return options;
  }

  /**
   * Generate tags for chart
   */
  generateTags(chartConfig, category) {
    const tags = [category, chartConfig.type];
    
    // Add data-based tags
    if (chartConfig.data && chartConfig.data.datasets) {
      if (chartConfig.data.datasets.length > 1) {
        tags.push('multi-dataset');
      }
      
      const totalDataPoints = chartConfig.data.datasets.reduce((sum, dataset) => {
        return sum + (dataset.data ? dataset.data.length : 0);
      }, 0);
      
      if (totalDataPoints > 50) {
        tags.push('large-data');
      }
    }

    return tags;
  }

  /**
   * Update saved charts list
   */
  updateSavedChartsList() {
    const container = document.getElementById('saved-charts-container');
    if (!container) return;

    const savedCharts = Array.from(this.savedCharts.values());
    
    if (savedCharts.length === 0) {
      container.innerHTML = `
        <div class="saved-charts-empty">
          <div class="saved-charts-empty-icon">
            <i class="fas fa-chart-line"></i>
          </div>
          <div class="saved-charts-empty-text">No saved charts yet</div>
          <div style="font-size: 12px; color: #9ca3af;">Create and save your first chart to get started</div>
        </div>
      `;
    } else {
      container.innerHTML = savedCharts.map(chart => this.generateSavedChartCardHTML(chart)).join('');
    }
  }

  /**
   * Save to local storage
   */
  saveToLocalStorage() {
    try {
      const data = {
        charts: Array.from(this.savedCharts.values()),
        version: '1.0',
        savedAt: new Date().toISOString()
      };

      // Check storage quota
      const dataSize = JSON.stringify(data).length;
      if (dataSize > 4 * 1024 * 1024) { // 4MB limit
        this.cleanupOldCharts();
      }

      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save to local storage:', error);
    }
  }

  /**
   * Load from local storage
   */
  loadFromLocalStorage() {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (!data) return;

      const parsed = JSON.parse(data);
      if (parsed.charts && Array.isArray(parsed.charts)) {
        parsed.charts.forEach(chart => {
          this.savedCharts.set(chart.id, chart);
        });
      }
    } catch (error) {
      console.error('Failed to load from local storage:', error);
    }
  }

  /**
   * Cleanup old charts
   */
  cleanupOldCharts() {
    const charts = Array.from(this.savedCharts.values());
    charts.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    // Keep only the most recent charts
    const chartsToKeep = charts.slice(0, this.maxLocalCharts);
    
    this.savedCharts.clear();
    chartsToKeep.forEach(chart => {
      this.savedCharts.set(chart.id, chart);
    });
  }

  /**
   * Check for unsaved changes
   */
  hasUnsavedChanges() {
    // This would compare current chart state with last saved state
    // For now, return false
    return false;
  }

  /**
   * Auto-save functionality
   */
  async autoSave() {
    try {
      const chartConfig = this.getCurrentChartConfig();
      if (!chartConfig) return;

      const autoSaveChart = {
        id: 'autosave-' + Date.now(),
        name: 'Auto Save ' + new Date().toLocaleTimeString(),
        description: 'Automatically saved chart',
        category: 'other',
        chartType: chartConfig.type,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        config: chartConfig,
        tags: ['autosave']
      };

      this.savedCharts.set(autoSaveChart.id, autoSaveChart);
      this.saveToLocalStorage();

    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  }

  /**
   * Sync to cloud (placeholder)
   */
  async syncToCloud(chart) {
    // This would integrate with a cloud storage service
    console.log('Syncing chart to cloud:', chart.name);
  }

  /**
   * Close panel
   */
  closePanel() {
    const panel = document.querySelector('.save-load-panel');
    if (panel) {
      panel.remove();
    }
  }

  /**
   * Get saved charts statistics
   */
  getStats() {
    const charts = Array.from(this.savedCharts.values());
    const categories = {};
    
    charts.forEach(chart => {
      categories[chart.category] = (categories[chart.category] || 0) + 1;
    });

    return {
      totalCharts: charts.length,
      categories,
      storageUsed: JSON.stringify(charts).length,
      lastSaved: charts.length > 0 ? Math.max(...charts.map(c => new Date(c.updatedAt).getTime())) : null
    };
  }
}

// Export singleton instance
export const chartSaveLoad = new ChartSaveLoadService();

// Make available globally
window.chartSaveLoad = chartSaveLoad;

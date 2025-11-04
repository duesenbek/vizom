// History Manager for Undo/Redo and Navigation
class HistoryManager {
  constructor() {
    this.history = [];
    this.currentIndex = -1;
    this.maxHistorySize = 50;
    this.isGenerating = false;
    this.generationController = null;
    
    this.init();
  }

  init() {
    this.loadHistoryFromStorage();
    this.setupEventListeners();
    this.createHistoryUI();
    this.setupKeyboardShortcuts();
    this.setupGenerationControl();
  }

  // Load history from localStorage
  loadHistoryFromStorage() {
    try {
      const savedHistory = localStorage.getItem('vizom_chart_history');
      if (savedHistory) {
        this.history = JSON.parse(savedHistory);
        this.currentIndex = this.history.length - 1;
      }
    } catch (error) {
      console.warn('Failed to load history from storage:', error);
      this.history = [];
      this.currentIndex = -1;
    }
  }

  // Save history to localStorage
  saveHistoryToStorage() {
    try {
      const historyToSave = this.history.slice(-this.maxHistorySize);
      localStorage.setItem('vizom_chart_history', JSON.stringify(historyToSave));
    } catch (error) {
      console.warn('Failed to save history to storage:', error);
    }
  }

  // Create history state object
  createHistoryState(type, data, metadata = {}) {
    return {
      id: this.generateStateId(),
      timestamp: Date.now(),
      type: type, // 'chart_generated', 'data_modified', 'settings_changed', 'theme_changed'
      data: data,
      metadata: {
        ...metadata,
        chartType: data.chartType || 'unknown',
        dataSize: this.calculateDataSize(data),
        generationTime: metadata.generationTime || 0
      }
    };
  }

  // Generate unique state ID
  generateStateId() {
    return `state_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Calculate data size for metadata
  calculateDataSize(data) {
    if (!data) return 0;
    return JSON.stringify(data).length;
  }

  // Add state to history
  addState(type, data, metadata = {}) {
    // Remove any states after current index (for redo functionality)
    if (this.currentIndex < this.history.length - 1) {
      this.history = this.history.slice(0, this.currentIndex + 1);
    }

    // Create new state
    const newState = this.createHistoryState(type, data, metadata);
    
    // Add to history
    this.history.push(newState);
    this.currentIndex++;

    // Limit history size
    if (this.history.length > this.maxHistorySize) {
      this.history.shift();
      this.currentIndex--;
    }

    // Save to storage
    this.saveHistoryToStorage();

    // Update UI
    this.updateHistoryUI();
    this.updateNavigationButtons();

    // Track analytics
    if (window.analytics) {
      window.analytics.trackCustomEvent('history_state_added', {
        type: type,
        chartType: metadata.chartType,
        dataSize: metadata.dataSize
      });
    }

    return newState.id;
  }

  // Navigate to previous state (undo)
  undo() {
    if (this.canUndo()) {
      this.currentIndex--;
      const state = this.history[this.currentIndex];
      this.restoreState(state);
      
      // Track analytics
      if (window.analytics) {
        window.analytics.trackCustomEvent('history_undo', {
          fromIndex: this.currentIndex + 1,
          toIndex: this.currentIndex,
          stateType: state.type
        });
      }
      
      return true;
    }
    return false;
  }

  // Navigate to next state (redo)
  redo() {
    if (this.canRedo()) {
      this.currentIndex++;
      const state = this.history[this.currentIndex];
      this.restoreState(state);
      
      // Track analytics
      if (window.analytics) {
        window.analytics.trackCustomEvent('history_redo', {
          fromIndex: this.currentIndex - 1,
          toIndex: this.currentIndex,
          stateType: state.type
        });
      }
      
      return true;
    }
    return false;
  }

  // Check if undo is possible
  canUndo() {
    return this.currentIndex > 0;
  }

  // Check if redo is possible
  canRedo() {
    return this.currentIndex < this.history.length - 1;
  }

  // Restore a specific state
  restoreState(state) {
    if (!state) return;

    // Cancel any ongoing generation
    this.cancelGeneration();

    // Restore data
    if (state.data) {
      this.restoreData(state.data);
    }

    // Restore settings
    if (state.metadata.settings) {
      this.restoreSettings(state.metadata.settings);
    }

    // Restore theme
    if (state.metadata.theme) {
      this.restoreTheme(state.metadata.theme);
    }

    // Update UI
    this.updateHistoryUI();
    this.updateNavigationButtons();

    // Show notification
    if (window.uiEnhancements) {
      window.uiEnhancements.showNotification(
        `Restored: ${this.getStateDescription(state)}`,
        'info'
      );
    }

    // Dispatch event
    document.dispatchEvent(new CustomEvent('historyStateRestored', {
      detail: { state: state }
    }));
  }

  // Get human-readable state description
  getStateDescription(state) {
    const descriptions = {
      'chart_generated': `Chart: ${state.metadata.chartType}`,
      'data_modified': 'Data updated',
      'settings_changed': 'Settings changed',
      'theme_changed': 'Theme changed',
      'export_completed': 'Export completed'
    };
    
    return descriptions[state.type] || 'Unknown action';
  }

  // Restore data from state
  restoreData(data) {
    const dataInput = document.getElementById('data-input');
    if (dataInput && data.rawData) {
      dataInput.value = data.rawData;
    }

    // Restore chart type
    if (data.chartType) {
      this.selectChartType(data.chartType);
    }

    // Restore chart configuration
    if (data.chartConfig) {
      this.restoreChartConfig(data.chartConfig);
    }

    // Regenerate chart if needed
    if (data.chartData) {
      this.regenerateChart(data.chartData);
    }
  }

  // Restore settings from state
  restoreSettings(settings) {
    if (window.customizationPanel) {
      Object.entries(settings).forEach(([key, value]) => {
        window.customizationPanel.updateSetting(key, value);
      });
    }
  }

  // Restore theme from state
  restoreTheme(theme) {
    if (window.themeManager) {
      window.themeManager.applyTheme(theme);
    }
  }

  // Select chart type
  selectChartType(chartType) {
    const chartOption = document.querySelector(`[data-chart-type="${chartType}"]`);
    if (chartOption) {
      // Remove previous selection
      document.querySelectorAll('.chart-option').forEach(option => {
        option.classList.remove('selected');
      });
      
      // Select new chart type
      chartOption.classList.add('selected');
    }
  }

  // Restore chart configuration
  restoreChartConfig(config) {
    // Apply chart-specific configurations
    if (config.colors) {
      this.applyChartColors(config.colors);
    }
    
    if (config.labels) {
      this.applyChartLabels(config.labels);
    }
    
    if (config.options) {
      this.applyChartOptions(config.options);
    }
  }

  // Apply chart colors
  applyChartColors(colors) {
    // Implementation depends on chart library
    document.documentElement.style.setProperty('--chart-primary-color', colors.primary);
    document.documentElement.style.setProperty('--chart-secondary-color', colors.secondary);
  }

  // Apply chart labels
  applyChartLabels(labels) {
    // Update chart labels
    const chartTitle = document.querySelector('.chart-title');
    if (chartTitle && labels.title) {
      chartTitle.textContent = labels.title;
    }
  }

  // Apply chart options
  applyChartOptions(options) {
    // Apply various chart options
    if (options.showLegend !== undefined) {
      this.toggleLegend(options.showLegend);
    }
    
    if (options.showGrid !== undefined) {
      this.toggleGrid(options.showGrid);
    }
  }

  // Regenerate chart from saved data
  regenerateChart(chartData) {
    // Implementation depends on chart library
    if (window.chartGenerator) {
      window.chartGenerator.generateChart(chartData);
    }
  }

  // Create history UI
  createHistoryUI() {
    const historyContainer = document.createElement('div');
    historyContainer.id = 'history-container';
    historyContainer.className = 'history-container';
    historyContainer.innerHTML = `
      <div class="history-header">
        <h3>🕐 History</h3>
        <div class="history-controls">
          <button class="history-btn" id="undo-btn" title="Undo (Ctrl+Z)" disabled>
            <i class="fas fa-undo"></i>
          </button>
          <button class="history-btn" id="redo-btn" title="Redo (Ctrl+Y)" disabled>
            <i class="fas fa-redo"></i>
          </button>
          <button class="history-btn" id="clear-history-btn" title="Clear History">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
      <div class="history-list" id="history-list">
        <!-- History items will be added here -->
      </div>
    `;

    // Add to sidebar or appropriate location
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
      sidebar.appendChild(historyContainer);
    } else {
      // Fallback: add to main content
      const mainContent = document.querySelector('.main-content');
      if (mainContent) {
        mainContent.appendChild(historyContainer);
      }
    }

    this.setupHistoryUIEvents();
    this.updateHistoryUI();
  }

  // Setup history UI events
  setupHistoryUIEvents() {
    const undoBtn = document.getElementById('undo-btn');
    const redoBtn = document.getElementById('redo-btn');
    const clearHistoryBtn = document.getElementById('clear-history-btn');

    if (undoBtn) {
      undoBtn.addEventListener('click', () => this.undo());
    }

    if (redoBtn) {
      redoBtn.addEventListener('click', () => this.redo());
    }

    if (clearHistoryBtn) {
      clearHistoryBtn.addEventListener('click', () => this.clearHistory());
    }
  }

  // Update history UI
  updateHistoryUI() {
    const historyList = document.getElementById('history-list');
    if (!historyList) return;

    historyList.innerHTML = '';

    if (this.history.length === 0) {
      historyList.innerHTML = '<div class="history-empty">No history yet</div>';
      return;
    }

    // Render history items
    this.history.forEach((state, index) => {
      const historyItem = this.createHistoryItem(state, index);
      historyList.appendChild(historyItem);
    });

    // Scroll to current item
    const currentItem = historyList.querySelector('.history-item.current');
    if (currentItem) {
      currentItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  // Create history item element
  createHistoryItem(state, index) {
    const item = document.createElement('div');
    item.className = 'history-item';
    item.classList.toggle('current', index === this.currentIndex);
    item.classList.toggle('future', index > this.currentIndex);
    
    const timeAgo = this.getTimeAgo(state.timestamp);
    const description = this.getStateDescription(state);
    
    item.innerHTML = `
      <div class="history-item-content" data-index="${index}">
        <div class="history-item-icon">${this.getStateIcon(state.type)}</div>
        <div class="history-item-info">
          <div class="history-item-title">${description}</div>
          <div class="history-item-meta">
            ${timeAgo} • ${state.metadata.chartType} • ${this.formatFileSize(state.metadata.dataSize)}
          </div>
        </div>
      </div>
      <div class="history-item-actions">
        <button class="history-action-btn" title="Restore this state" data-index="${index}">
          <i class="fas fa-restore"></i>
        </button>
        <button class="history-action-btn" title="Delete this state" data-index="${index}">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `;

    // Add click handler
    const content = item.querySelector('.history-item-content');
    content.addEventListener('click', () => {
      this.navigateToState(index);
    });

    // Add action handlers
    const restoreBtn = item.querySelector('.history-action-btn:first-child');
    const deleteBtn = item.querySelector('.history-action-btn:last-child');

    restoreBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.navigateToState(index);
    });

    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.deleteState(index);
    });

    return item;
  }

  // Get state icon based on type
  getStateIcon(type) {
    const icons = {
      'chart_generated': '📊',
      'data_modified': '📝',
      'settings_changed': '⚙️',
      'theme_changed': '🎨',
      'export_completed': '💾'
    };
    return icons[type] || '📌';
  }

  // Get time ago string
  getTimeAgo(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  }

  // Format file size
  formatFileSize(bytes) {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)}KB`;
    return `${Math.round(bytes / (1024 * 1024))}MB`;
  }

  // Navigate to specific state
  navigateToState(index) {
    if (index >= 0 && index < this.history.length) {
      this.currentIndex = index;
      const state = this.history[index];
      this.restoreState(state);
    }
  }

  // Delete specific state
  deleteState(index) {
    if (index >= 0 && index < this.history.length) {
      // Don't allow deleting current state
      if (index === this.currentIndex) {
        if (window.uiEnhancements) {
          window.uiEnhancements.showNotification('Cannot delete current state', 'error');
        }
        return;
      }

      // Remove state
      this.history.splice(index, 1);
      
      // Adjust current index
      if (index < this.currentIndex) {
        this.currentIndex--;
      }

      // Save and update
      this.saveHistoryToStorage();
      this.updateHistoryUI();
      this.updateNavigationButtons();

      if (window.uiEnhancements) {
        window.uiEnhancements.showNotification('State deleted', 'success');
      }
    }
  }

  // Clear all history
  clearHistory() {
    if (confirm('Are you sure you want to clear all history? This cannot be undone.')) {
      this.history = [];
      this.currentIndex = -1;
      this.saveHistoryToStorage();
      this.updateHistoryUI();
      this.updateNavigationButtons();

      if (window.uiEnhancements) {
        window.uiEnhancements.showNotification('History cleared', 'info');
      }
    }
  }

  // Update navigation buttons state
  updateNavigationButtons() {
    const undoBtn = document.getElementById('undo-btn');
    const redoBtn = document.getElementById('redo-btn');

    if (undoBtn) {
      undoBtn.disabled = !this.canUndo();
    }

    if (redoBtn) {
      redoBtn.disabled = !this.canRedo();
    }
  }

  // Setup keyboard shortcuts
  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Ctrl+Z for undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        this.undo();
      }
      
      // Ctrl+Y or Ctrl+Shift+Z for redo
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        this.redo();
      }
      
      // Escape to cancel generation
      if (e.key === 'Escape' && this.isGenerating) {
        e.preventDefault();
        this.cancelGeneration();
      }
    });
  }

  // Setup generation control
  setupGenerationControl() {
    // Listen for generation start
    document.addEventListener('chartGenerationStarted', (e) => {
      this.startGeneration(e.detail);
    });

    // Listen for generation complete
    document.addEventListener('chartGenerationCompleted', (e) => {
      this.completeGeneration(e.detail);
    });

    // Listen for generation error
    document.addEventListener('chartGenerationError', (e) => {
      this.handleGenerationError(e.detail);
    });
  }

  // Start generation tracking
  startGeneration(detail) {
    this.isGenerating = true;
    this.generationStartTime = Date.now();
    
    // Show cancel button
    this.showCancelButton();
    
    // Disable certain actions during generation
    this.disableActionsDuringGeneration();
  }

  // Complete generation tracking
  completeGeneration(detail) {
    this.isGenerating = false;
    const generationTime = Date.now() - this.generationStartTime;
    
    // Add to history
    this.addState('chart_generated', detail.data, {
      chartType: detail.chartType,
      generationTime: generationTime,
      settings: detail.settings
    });
    
    // Hide cancel button
    this.hideCancelButton();
    
    // Re-enable actions
    this.enableActionsAfterGeneration();
  }

  // Handle generation error
  handleGenerationError(detail) {
    this.isGenerating = false;
    
    // Hide cancel button
    this.hideCancelButton();
    
    // Re-enable actions
    this.enableActionsAfterGeneration();
    
    // Show error notification
    if (window.uiEnhancements) {
      window.uiEnhancements.showNotification('Generation failed', 'error');
    }
  }

  // Show cancel button
  showCancelButton() {
    let cancelBtn = document.getElementById('cancel-generation-btn');
    
    if (!cancelBtn) {
      cancelBtn = document.createElement('button');
      cancelBtn.id = 'cancel-generation-btn';
      cancelBtn.className = 'cancel-generation-btn';
      cancelBtn.innerHTML = `
        <i class="fas fa-times"></i>
        Cancel Generation
      `;
      
      // Add to generate button area
      const generateBtn = document.getElementById('generate-btn');
      if (generateBtn) {
        generateBtn.parentNode.appendChild(cancelBtn);
      }
      
      // Add event handler
      cancelBtn.addEventListener('click', () => {
        this.cancelGeneration();
      });
    }
    
    cancelBtn.style.display = 'flex';
  }

  // Hide cancel button
  hideCancelButton() {
    const cancelBtn = document.getElementById('cancel-generation-btn');
    if (cancelBtn) {
      cancelBtn.style.display = 'none';
    }
  }

  // Cancel ongoing generation
  cancelGeneration() {
    if (this.isGenerating && this.generationController) {
      this.generationController.abort();
      this.isGenerating = false;
      
      // Hide cancel button
      this.hideCancelButton();
      
      // Re-enable actions
      this.enableActionsAfterGeneration();
      
      // Show notification
      if (window.uiEnhancements) {
        window.uiEnhancements.showNotification('Generation cancelled', 'info');
      }
      
      // Track analytics
      if (window.analytics) {
        window.analytics.trackCustomEvent('generation_cancelled');
      }
    }
  }

  // Disable actions during generation
  disableActionsDuringGeneration() {
    // Disable chart type selection
    document.querySelectorAll('.chart-option').forEach(option => {
      option.style.pointerEvents = 'none';
      option.classList.add('disabled');
    });
    
    // Disable data input
    const dataInput = document.getElementById('data-input');
    if (dataInput) {
      dataInput.disabled = true;
    }
    
    // Disable generate button
    const generateBtn = document.getElementById('generate-btn');
    if (generateBtn) {
      generateBtn.disabled = true;
    }
  }

  // Enable actions after generation
  enableActionsAfterGeneration() {
    // Enable chart type selection
    document.querySelectorAll('.chart-option').forEach(option => {
      option.style.pointerEvents = 'auto';
      option.classList.remove('disabled');
    });
    
    // Enable data input
    const dataInput = document.getElementById('data-input');
    if (dataInput) {
      dataInput.disabled = false;
    }
    
    // Enable generate button
    const generateBtn = document.getElementById('generate-btn');
    if (generateBtn) {
      generateBtn.disabled = false;
    }
  }

  // Setup event listeners
  setupEventListeners() {
    // Listen for data changes
    const dataInput = document.getElementById('data-input');
    if (dataInput) {
      dataInput.addEventListener('input', (e) => {
        // Debounce data changes
        clearTimeout(this.dataChangeTimeout);
        this.dataChangeTimeout = setTimeout(() => {
          this.onDataChanged(e.target.value);
        }, 1000);
      });
    }

    // Listen for chart type changes
    document.addEventListener('chartTypeChanged', (e) => {
      this.onChartTypeChanged(e.detail.chartType);
    });

    // Listen for settings changes
    document.addEventListener('settingsChanged', (e) => {
      this.onSettingsChanged(e.detail.settings);
    });
  }

  // Handle data changes
  onDataChanged(data) {
    if (data && data.trim()) {
      this.addState('data_modified', {
        rawData: data,
        timestamp: Date.now()
      }, {
        dataSize: data.length
      });
    }
  }

  // Handle chart type changes
  onChartTypeChanged(chartType) {
    this.addState('chart_type_changed', {
      chartType: chartType,
      timestamp: Date.now()
    }, {
      chartType: chartType
    });
  }

  // Handle settings changes
  onSettingsChanged(settings) {
    this.addState('settings_changed', {
      settings: settings,
      timestamp: Date.now()
    }, {
      settings: settings
    });
  }

  // Public methods
  getHistory() {
    return [...this.history];
  }

  getCurrentState() {
    return this.history[this.currentIndex] || null;
  }

  getHistoryStats() {
    return {
      totalStates: this.history.length,
      currentIndex: this.currentIndex,
      canUndo: this.canUndo(),
      canRedo: this.canRedo(),
      isGenerating: this.isGenerating
    };
  }
}

// Initialize history manager
document.addEventListener('DOMContentLoaded', () => {
  window.historyManager = new HistoryManager();
});

export { HistoryManager };

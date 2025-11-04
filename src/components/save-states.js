// Save States and Auto-Save System
class SaveStateManager {
  constructor() {
    this.currentSession = null;
    this.autoSaveTimer = null;
    this.saveStates = new Map();
    this.maxSaveStates = 10;
    this.autoSaveInterval = 30000; // 30 seconds
    this.isDirty = false;
    this.lastSaveTime = null;
    
    this.init();
  }

  init() {
    this.loadSaveStates();
    this.setupAutoSave();
    this.setupEventListeners();
    this.createSaveIndicator();
    this.setupKeyboardShortcuts();
    this.checkForRecoverableData();
  }

  // Load existing save states from localStorage
  loadSaveStates() {
    try {
      const saved = localStorage.getItem('vizom_save_states');
      if (saved) {
        const data = JSON.parse(saved);
        this.saveStates = new Map(Object.entries(data));
      }
    } catch (error) {
      console.warn('Failed to load save states:', error);
    }
  }

  // Setup auto-save functionality
  setupAutoSave() {
    // Clear any existing timer
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
    }

    // Start auto-save timer
    this.autoSaveTimer = setInterval(() => {
      if (this.isDirty) {
        this.autoSave();
      }
    }, this.autoSaveInterval);
  }

  // Setup event listeners for changes
  setupEventListeners() {
    // Listen for input changes
    const textInput = document.getElementById('data-input');
    if (textInput) {
      textInput.addEventListener('input', () => this.markDirty());
    }

    // Listen for chart type changes
    document.addEventListener('chartTypeChanged', () => this.markDirty());

    // Listen for chart generation
    document.addEventListener('chartGenerated', () => this.markDirty());

    // Listen for page unload
    window.addEventListener('beforeunload', (e) => {
      if (this.isDirty) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
      }
    });

    // Listen for visibility changes (tab switching)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && this.isDirty) {
        this.autoSave();
      }
    });
  }

  // Create save indicator
  createSaveIndicator() {
    const indicator = document.createElement('div');
    indicator.id = 'save-indicator';
    indicator.className = 'save-indicator';
    indicator.innerHTML = `
      <div class="save-status">
        <div class="save-icon">
          <i class="fas fa-save"></i>
        </div>
        <div class="save-text">
          <div class="save-title">All changes saved</div>
          <div class="save-time">Saved just now</div>
        </div>
      </div>
      <div class="save-actions">
        <button class="btn btn-sm btn-secondary" id="manual-save-btn" title="Save now (Ctrl+S)">
          <i class="fas fa-save"></i>
        </button>
        <button class="btn btn-sm btn-secondary" id="save-history-btn" title="View save history">
          <i class="fas fa-history"></i>
        </button>
      </div>
    `;
    
    // Insert into header
    const header = document.querySelector('.header .container');
    if (header) {
      header.appendChild(indicator);
    }

    this.setupSaveIndicatorEvents();
  }

  // Setup save indicator events
  setupSaveIndicatorEvents() {
    const manualSaveBtn = document.getElementById('manual-save-btn');
    const historyBtn = document.getElementById('save-history-btn');

    manualSaveBtn?.addEventListener('click', () => this.manualSave());
    historyBtn?.addEventListener('click', () => this.showSaveHistory());
  }

  // Setup keyboard shortcuts
  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Ctrl+S or Cmd+S for manual save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        this.manualSave();
      }
      
      // Ctrl+Shift+S for save as
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'S') {
        e.preventDefault();
        this.saveAs();
      }
      
      // Ctrl+Z for undo (if implemented)
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        // Could implement undo functionality here
      }
    });
  }

  // Mark current state as dirty (needs saving)
  markDirty() {
    this.isDirty = true;
    this.updateSaveIndicator('unsaved');
  }

  // Mark current state as clean (saved)
  markClean() {
    this.isDirty = false;
    this.lastSaveTime = new Date();
    this.updateSaveIndicator('saved');
  }

  // Update save indicator display
  updateSaveIndicator(status) {
    const indicator = document.getElementById('save-indicator');
    if (!indicator) return;

    const icon = indicator.querySelector('.save-icon i');
    const title = indicator.querySelector('.save-title');
    const time = indicator.querySelector('.save-time');

    switch (status) {
      case 'saving':
        icon.className = 'fas fa-spinner fa-spin';
        title.textContent = 'Saving...';
        time.textContent = '';
        indicator.classList.add('saving');
        indicator.classList.remove('unsaved', 'saved');
        break;
        
      case 'unsaved':
        icon.className = 'fas fa-exclamation-circle';
        title.textContent = 'Unsaved changes';
        time.textContent = 'Last saved ' + this.getRelativeTime(this.lastSaveTime);
        indicator.classList.add('unsaved');
        indicator.classList.remove('saving', 'saved');
        break;
        
      case 'saved':
        icon.className = 'fas fa-check-circle';
        title.textContent = 'All changes saved';
        time.textContent = 'Saved ' + this.getRelativeTime(this.lastSaveTime);
        indicator.classList.add('saved');
        indicator.classList.remove('saving', 'unsaved');
        break;
        
      case 'error':
        icon.className = 'fas fa-exclamation-triangle';
        title.textContent = 'Save failed';
        time.textContent = 'Please try again';
        indicator.classList.add('error');
        indicator.classList.remove('saving', 'unsaved', 'saved');
        break;
    }
  }

  // Get relative time string
  getRelativeTime(date) {
    if (!date) return 'never';
    
    const now = new Date();
    const diff = Math.floor((now - date) / 1000); // seconds
    
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  }

  // Auto-save current state
  async autoSave() {
    if (!this.isDirty) return;

    try {
      this.updateSaveIndicator('saving');
      
      const state = this.captureCurrentState();
      const saveId = this.generateSaveId();
      
      // Save to localStorage
      this.saveStates.set(saveId, {
        ...state,
        timestamp: new Date().toISOString(),
        type: 'auto'
      });
      
      // Cleanup old saves
      this.cleanupOldSaves();
      
      // Persist to localStorage
      this.persistSaveStates();
      
      // Set current session
      this.currentSession = saveId;
      
      this.markClean();
      
      // Track analytics
      if (window.analytics) {
        window.analytics.trackCustomEvent('auto_save_completed');
      }
      
    } catch (error) {
      console.error('Auto-save failed:', error);
      this.updateSaveIndicator('error');
      
      // Track error
      if (window.analytics) {
        window.analytics.trackCustomEvent('auto_save_failed', {
          error: error.message
        });
      }
    }
  }

  // Manual save
  async manualSave() {
    try {
      this.updateSaveIndicator('saving');
      
      const state = this.captureCurrentState();
      const saveId = this.generateSaveId();
      
      // Save to localStorage
      this.saveStates.set(saveId, {
        ...state,
        timestamp: new Date().toISOString(),
        type: 'manual'
      });
      
      // Cleanup old saves
      this.cleanupOldSaves();
      
      // Persist to localStorage
      this.persistSaveStates();
      
      // Set current session
      this.currentSession = saveId;
      
      this.markClean();
      
      // Show success message
      if (window.uiEnhancements) {
        window.uiEnhancements.showNotification('Work saved successfully', 'success');
      }
      
      // Track analytics
      if (window.analytics) {
        window.analytics.trackCustomEvent('manual_save_completed');
      }
      
    } catch (error) {
      console.error('Manual save failed:', error);
      this.updateSaveIndicator('error');
      
      if (window.uiEnhancements) {
        window.uiEnhancements.showNotification('Save failed: ' + error.message, 'error');
      }
      
      // Track error
      if (window.analytics) {
        window.analytics.trackCustomEvent('manual_save_failed', {
          error: error.message
        });
      }
    }
  }

  // Save as (create new save with custom name)
  async saveAs() {
    const name = prompt('Enter a name for this save:');
    if (!name) return;

    try {
      this.updateSaveIndicator('saving');
      
      const state = this.captureCurrentState();
      const saveId = this.generateSaveId();
      
      // Save to localStorage
      this.saveStates.set(saveId, {
        ...state,
        timestamp: new Date().toISOString(),
        type: 'named',
        name: name
      });
      
      // Cleanup old saves
      this.cleanupOldSaves();
      
      // Persist to localStorage
      this.persistSaveStates();
      
      // Set current session
      this.currentSession = saveId;
      
      this.markClean();
      
      // Show success message
      if (window.uiEnhancements) {
        window.uiEnhancements.showNotification(`Saved as "${name}"`, 'success');
      }
      
      // Track analytics
      if (window.analytics) {
        window.analytics.trackCustomEvent('save_as_completed', { name });
      }
      
    } catch (error) {
      console.error('Save as failed:', error);
      this.updateSaveIndicator('error');
      
      if (window.uiEnhancements) {
        window.uiEnhancements.showNotification('Save failed: ' + error.message, 'error');
      }
    }
  }

  // Capture current state
  captureCurrentState() {
    const state = {
      chartType: this.getSelectedChartType(),
      dataInput: this.getDataInput(),
      generatedChart: this.getGeneratedChart(),
      url: window.location.href,
      userAgent: navigator.userAgent
    };
    
    return state;
  }

  // Get selected chart type
  getSelectedChartType() {
    const selectedOption = document.querySelector('.chart-option.selected');
    return selectedOption ? selectedOption.dataset.type : null;
  }

  // Get data input
  getDataInput() {
    const textInput = document.getElementById('data-input');
    return textInput ? textInput.value : '';
  }

  // Get generated chart
  getGeneratedChart() {
    const chartOutput = document.getElementById('chart-output');
    return chartOutput && !chartOutput.classList.contains('hidden') 
      ? chartOutput.innerHTML 
      : null;
  }

  // Restore state
  async restoreState(saveId) {
    try {
      const state = this.saveStates.get(saveId);
      if (!state) {
        throw new Error('Save state not found');
      }

      // Restore chart type
      if (state.chartType) {
        const chartOption = document.querySelector(`[data-type="${state.chartType}"]`);
        if (chartOption) {
          chartOption.click();
        }
      }

      // Restore data input
      if (state.dataInput) {
        const textInput = document.getElementById('data-input');
        if (textInput) {
          textInput.value = state.dataInput;
        }
      }

      // Restore generated chart
      if (state.generatedChart) {
        const chartOutput = document.getElementById('chart-output');
        const placeholder = document.getElementById('preview-placeholder');
        
        if (chartOutput && placeholder) {
          placeholder.classList.add('hidden');
          chartOutput.classList.remove('hidden');
          chartOutput.innerHTML = state.generatedChart;
          
          // Show status
          const status = document.getElementById('chart-status');
          if (status) {
            status.classList.remove('hidden');
          }
        }
      }

      // Set current session
      this.currentSession = saveId;
      this.markClean();

      // Show success message
      if (window.uiEnhancements) {
        const saveName = state.name || `Save from ${new Date(state.timestamp).toLocaleString()}`;
        window.uiEnhancements.showNotification(`Restored: ${saveName}`, 'success');
      }

      // Track analytics
      if (window.analytics) {
        window.analytics.trackCustomEvent('state_restored', {
          saveId: saveId,
          saveType: state.type
        });
      }

    } catch (error) {
      console.error('Restore failed:', error);
      
      if (window.uiEnhancements) {
        window.uiEnhancements.showNotification('Failed to restore save: ' + error.message, 'error');
      }
    }
  }

  // Show save history modal
  showSaveHistory() {
    const modal = document.createElement('div');
    modal.className = 'save-history-modal';
    modal.innerHTML = `
      <div class="modal-backdrop"></div>
      <div class="modal-container">
        <div class="modal-header">
          <h3>Save History</h3>
          <button class="modal-close" onclick="this.closest('.save-history-modal').remove()">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-content">
          <div class="save-list" id="save-list">
            ${this.generateSaveListHTML()}
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="this.closest('.save-history-modal').remove()">
            Close
          </button>
          <button class="btn btn-primary" onclick="window.saveStateManager.clearAllSaves()">
            Clear All Saves
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Animate in
    setTimeout(() => modal.classList.add('show'), 10);
  }

  // Generate save list HTML
  generateSaveListHTML() {
    if (this.saveStates.size === 0) {
      return `
        <div class="empty-state">
          <i class="fas fa-save"></i>
          <p>No saved states found</p>
        </div>
      `;
    }

    const saves = Array.from(this.saveStates.entries())
      .sort((a, b) => new Date(b[1].timestamp) - new Date(a[1].timestamp));

    return saves.map(([id, state]) => `
      <div class="save-item ${id === this.currentSession ? 'current' : ''}" data-save-id="${id}">
        <div class="save-info">
          <div class="save-name">
            ${state.name || this.getDefaultSaveName(state)}
          </div>
          <div class="save-meta">
            ${this.getRelativeTime(new Date(state.timestamp))} • 
            ${state.type === 'auto' ? 'Auto-saved' : state.type === 'manual' ? 'Manual save' : 'Named save'}
            ${id === this.currentSession ? ' • Current' : ''}
          </div>
        </div>
        <div class="save-actions">
          <button class="btn btn-sm btn-primary" onclick="window.saveStateManager.restoreState('${id}')">
            <i class="fas fa-undo"></i> Restore
          </button>
          <button class="btn btn-sm btn-secondary" onclick="window.saveStateManager.deleteSave('${id}')">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    `).join('');
  }

  // Get default save name
  getDefaultSaveName(state) {
    const date = new Date(state.timestamp);
    return date.toLocaleString();
  }

  // Delete specific save
  deleteSave(saveId) {
    this.saveStates.delete(saveId);
    this.persistSaveStates();
    
    // Update modal if open
    const saveList = document.getElementById('save-list');
    if (saveList) {
      saveList.innerHTML = this.generateSaveListHTML();
    }
    
    // Show notification
    if (window.uiEnhancements) {
      window.uiEnhancements.showNotification('Save deleted', 'info');
    }
  }

  // Clear all saves
  clearAllSaves() {
    if (confirm('Are you sure you want to delete all saved states? This cannot be undone.')) {
      this.saveStates.clear();
      this.currentSession = null;
      this.persistSaveStates();
      
      // Close modal
      document.querySelector('.save-history-modal')?.remove();
      
      // Update indicator
      this.updateSaveIndicator('saved');
      
      // Show notification
      if (window.uiEnhancements) {
        window.uiEnhancements.showNotification('All saves cleared', 'info');
      }
      
      // Track analytics
      if (window.analytics) {
        window.analytics.trackCustomEvent('all_saves_cleared');
      }
    }
  }

  // Check for recoverable data on page load
  checkForRecoverableData() {
    if (this.saveStates.size > 0) {
      // Find the most recent save
      const mostRecentSave = Array.from(this.saveStates.entries())
        .sort((a, b) => new Date(b[1].timestamp) - new Date(a[1].timestamp))[0];
      
      if (mostRecentSave) {
        const [id, state] = mostRecentSave;
        const timeSince = Date.now() - new Date(state.timestamp).getTime();
        
        // If save is less than 1 hour old, offer to restore
        if (timeSince < 3600000) { // 1 hour
          setTimeout(() => {
            this.showRecoveryOption(id, state);
          }, 2000);
        }
      }
    }
  }

  // Show recovery option
  showRecoveryOption(saveId, state) {
    const recovery = document.createElement('div');
    recovery.className = 'recovery-notification';
    recovery.innerHTML = `
      <div class="recovery-content">
        <i class="fas fa-history"></i>
        <div class="recovery-text">
          <strong>Recover your work?</strong>
          <p>We found an unsaved session from ${this.getRelativeTime(new Date(state.timestamp))}</p>
        </div>
        <div class="recovery-actions">
          <button class="btn btn-secondary" onclick="this.closest('.recovery-notification').remove()">
            Dismiss
          </button>
          <button class="btn btn-primary" onclick="window.saveStateManager.restoreState('${saveId}'); this.closest('.recovery-notification').remove();">
            Recover
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(recovery);
    
    // Auto-hide after 10 seconds
    setTimeout(() => {
      if (recovery.parentElement) {
        recovery.classList.add('hiding');
        setTimeout(() => recovery.remove(), 300);
      }
    }, 10000);
  }

  // Cleanup old saves
  cleanupOldSaves() {
    if (this.saveStates.size <= this.maxSaveStates) return;

    // Sort by timestamp and remove oldest
    const saves = Array.from(this.saveStates.entries())
      .sort((a, b) => new Date(a[1].timestamp) - new Date(b[1].timestamp));

    const toRemove = saves.slice(0, saves.length - this.maxSaveStates);
    toRemove.forEach(([id]) => this.saveStates.delete(id));
  }

  // Persist save states to localStorage
  persistSaveStates() {
    try {
      const data = Object.fromEntries(this.saveStates);
      localStorage.setItem('vizom_save_states', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to persist save states:', error);
    }
  }

  // Generate save ID
  generateSaveId() {
    return 'save_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Get save statistics
  getSaveStats() {
    const autoSaves = Array.from(this.saveStates.values()).filter(s => s.type === 'auto').length;
    const manualSaves = Array.from(this.saveStates.values()).filter(s => s.type === 'manual').length;
    const namedSaves = Array.from(this.saveStates.values()).filter(s => s.type === 'named').length;

    return {
      total: this.saveStates.size,
      auto: autoSaves,
      manual: manualSaves,
      named: namedSaves,
      currentSession: this.currentSession,
      isDirty: this.isDirty,
      lastSave: this.lastSaveTime
    };
  }

  // Export save states
  exportSaveStates() {
    const data = Object.fromEntries(this.saveStates);
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `vizom-saves-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  }

  // Import save states
  async importSaveStates(file) {
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      // Merge with existing saves
      Object.entries(data).forEach(([id, state]) => {
        this.saveStates.set(id, state);
      });
      
      // Cleanup and persist
      this.cleanupOldSaves();
      this.persistSaveStates();
      
      if (window.uiEnhancements) {
        window.uiEnhancements.showNotification('Save states imported successfully', 'success');
      }
      
    } catch (error) {
      if (window.uiEnhancements) {
        window.uiEnhancements.showNotification('Failed to import save states: ' + error.message, 'error');
      }
    }
  }

  // Cleanup on page unload
  cleanup() {
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
    }
  }
}

// Initialize save state manager
document.addEventListener('DOMContentLoaded', () => {
  window.saveStateManager = new SaveStateManager();
});

// Cleanup on page unload
window.addEventListener('unload', () => {
  if (window.saveStateManager) {
    window.saveStateManager.cleanup();
  }
});

export { SaveStateManager };

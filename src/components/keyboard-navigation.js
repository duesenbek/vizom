// Advanced Keyboard Navigation and Shortcuts System
class KeyboardNavigationManager {
  constructor() {
    this.shortcuts = new Map();
    this.context = 'global';
    this.focusHistory = [];
    this.modalStack = [];
    this.commandPalette = null;
    this.isCommandPaletteOpen = false;
    
    this.init();
  }

  init() {
    this.setupDefaultShortcuts();
    this.setupEventListeners();
    this.createCommandPalette();
    this.setupFocusManagement();
    this.createKeyboardHelp();
    this.setupQuickActions();
  }

  // Setup default keyboard shortcuts
  setupDefaultShortcuts() {
    // Global shortcuts
    this.registerShortcut('ctrl+k', 'cmd+k', () => this.toggleCommandPalette(), 'Open Command Palette');
    this.registerShortcut('ctrl+/', 'cmd+/', () => this.showKeyboardHelp(), 'Show Keyboard Shortcuts');
    this.registerShortcut('escape', null, () => this.handleEscape(), 'Close/Cancel');
    
    // Navigation shortcuts
    this.registerShortcut('alt+1', null, () => this.focusChartType(), 'Focus Chart Type');
    this.registerShortcut('alt+2', null, () => this.focusDataInput(), 'Focus Data Input');
    this.registerShortcut('alt+3', null, () => this.focusPreview(), 'Focus Preview');
    
    // Tab navigation (enhanced)
    this.registerShortcut('ctrl+tab', null, () => this.nextTab(), 'Next Tab');
    this.registerShortcut('ctrl+shift+tab', null, () => this.previousTab(), 'Previous Tab');
    
    // Chart generation
    this.registerShortcut('ctrl+enter', 'cmd+enter', () => this.generateChart(), 'Generate Chart');
    this.registerShortcut('ctrl+shift+g', 'cmd+shift+g', () => this.regenerateChart(), 'Regenerate Chart');
    
    // Data operations
    this.registerShortcut('ctrl+shift+c', 'cmd+shift+c', () => this.clearData(), 'Clear Data');
    this.registerShortcut('ctrl+shift+p', 'cmd+shift+p', () => this.previewData(), 'Preview Data');
    this.registerShortcut('ctrl+shift+u', 'cmd+shift+u', () => this.uploadFile(), 'Upload File');
    
    // Save operations
    this.registerShortcut('ctrl+s', 'cmd+s', () => this.saveWork(), 'Save Work');
    this.registerShortcut('ctrl+shift+s', 'cmd+shift+s', () => this.saveAs(), 'Save As');
    this.registerShortcut('ctrl+o', 'cmd+o', () => this.openSaveHistory(), 'Open Save History');
    
    // Export operations
    this.registerShortcut('ctrl+shift+e', 'cmd+shift+e', () => this.exportChart(), 'Export Chart');
    this.registerShortcut('ctrl+shift+p', 'cmd+shift+p', () => this.exportAsPNG(), 'Export as PNG');
    this.registerShortcut('ctrl+shift+j', 'cmd+shift+j', () => this.exportAsJSON(), 'Export as JSON');
    
    // View operations
    this.registerShortcut('ctrl+shift+d', 'cmd+shift+d', () => this.toggleDarkMode(), 'Toggle Dark Mode');
    this.registerShortcut('ctrl+shift+a', 'cmd+shift+a', () => this.toggleAccessibility(), 'Toggle Accessibility');
    this.registerShortcut('ctrl+shift+r', 'cmd+shift+r', () => this.resetView(), 'Reset View');
    
    // Quick actions
    this.registerShortcut('ctrl+1', null, () => this.selectChartType('bar'), 'Select Bar Chart');
    this.registerShortcut('ctrl+2', null, () => this.selectChartType('line'), 'Select Line Chart');
    this.registerShortcut('ctrl+3', null, () => this.selectChartType('pie'), 'Select Pie Chart');
    this.registerShortcut('ctrl+4', null, () => this.selectChartType('scatter'), 'Select Scatter Plot');
    this.registerShortcut('ctrl+5', null, () => this.selectChartType('area'), 'Select Area Chart');
    
    // Help and support
    this.registerShortcut('f1', null, () => this.showHelp(), 'Show Help');
    this.registerShortcut('ctrl+f1', 'cmd+f1', () => this.showOnboarding(), 'Show Onboarding');
    this.registerShortcut('ctrl+shift+f1', 'cmd+shift+f1', () => this.reportIssue(), 'Report Issue');
  }

  // Register a keyboard shortcut
  registerShortcut(windowsKey, macKey, callback, description) {
    const shortcut = {
      windows: windowsKey,
      mac: macKey || windowsKey,
      callback: callback,
      description: description,
      context: 'global'
    };
    
    const key = this.normalizeKey(windowsKey);
    this.shortcuts.set(key, shortcut);
  }

  // Normalize key for consistent handling
  normalizeKey(key) {
    return key.toLowerCase().replace(/\s+/g, '');
  }

  // Setup event listeners
  setupEventListeners() {
    document.addEventListener('keydown', (e) => {
      // Ignore if user is typing in input field (except for specific shortcuts)
      if (this.isTypingInInput(e) && !this.allowInInput(e)) {
        return;
      }

      // Check for matching shortcuts
      const key = this.getKeyString(e);
      const shortcut = this.shortcuts.get(key);
      
      if (shortcut && shortcut.callback) {
        e.preventDefault();
        e.stopPropagation();
        
        // Execute callback
        try {
          shortcut.callback();
          
          // Track usage
          if (window.analytics) {
            window.analytics.trackCustomEvent('keyboard_shortcut_used', {
              shortcut: key,
              description: shortcut.description
            });
          }
        } catch (error) {
          console.error('Shortcut execution failed:', error);
        }
      }
    });

    // Handle context changes
    document.addEventListener('focusin', (e) => {
      this.updateContext(e.target);
    });

    // Handle modal changes
    document.addEventListener('modalOpened', (e) => {
      this.modalStack.push(e.detail.modal);
    });

    document.addEventListener('modalClosed', (e) => {
      this.modalStack = this.modalStack.filter(m => m !== e.detail.modal);
    });
  }

  // Get key string from event
  getKeyString(e) {
    const parts = [];
    
    if (e.ctrlKey || e.metaKey) parts.push('ctrl');
    if (e.altKey) parts.push('alt');
    if (e.shiftKey) parts.push('shift');
    
    let key = e.key.toLowerCase();
    
    // Special key mappings
    const keyMap = {
      ' ': 'space',
      'arrowup': 'up',
      'arrowdown': 'down',
      'arrowleft': 'left',
      'arrowright': 'right',
      'escape': 'escape'
    };
    
    key = keyMap[key] || key;
    parts.push(key);
    
    return parts.join('+');
  }

  // Check if user is typing in input
  isTypingInInput(e) {
    const target = e.target;
    const inputTypes = ['input', 'textarea', 'select'];
    const contentEditable = target.isContentEditable;
    
    return inputTypes.includes(target.tagName.toLowerCase()) || contentEditable;
  }

  // Allow certain shortcuts even when typing
  allowInInput(e) {
    const allowedKeys = ['escape', 'ctrl+enter', 'cmd+enter', 'ctrl+s', 'cmd+s'];
    const key = this.getKeyString(e);
    return allowedKeys.includes(key);
  }

  // Create command palette
  createCommandPalette() {
    this.commandPalette = document.createElement('div');
    this.commandPalette.id = 'command-palette';
    this.commandPalette.className = 'command-palette';
    this.commandPalette.innerHTML = `
      <div class="command-palette-backdrop"></div>
      <div class="command-palette-container">
        <div class="command-palette-header">
          <div class="command-search">
            <i class="fas fa-search"></i>
            <input type="text" id="command-search-input" placeholder="Type a command or search..." autocomplete="off">
          </div>
          <div class="command-shortcut-hint">
            <kbd>ESC</kbd> to close
          </div>
        </div>
        <div class="command-palette-content">
          <div class="command-sections">
            <div class="command-section">
              <h4>Quick Actions</h4>
              <div class="command-list" id="quick-commands"></div>
            </div>
            <div class="command-section">
              <h4>Chart Types</h4>
              <div class="command-list" id="chart-commands"></div>
            </div>
            <div class="command-section">
              <h4>File Operations</h4>
              <div class="command-list" id="file-commands"></div>
            </div>
            <div class="command-section">
              <h4>View Options</h4>
              <div class="command-list" id="view-commands"></div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(this.commandPalette);
    this.setupCommandPaletteEvents();
    this.populateCommandPalette();
  }

  // Setup command palette events
  setupCommandPaletteEvents() {
    const searchInput = document.getElementById('command-search-input');
    const backdrop = this.commandPalette.querySelector('.command-palette-backdrop');

    // Search functionality
    searchInput.addEventListener('input', (e) => {
      this.filterCommands(e.target.value);
    });

    // Close on backdrop click
    backdrop.addEventListener('click', () => {
      this.closeCommandPalette();
    });

    // Keyboard navigation in palette
    this.commandPalette.addEventListener('keydown', (e) => {
      this.handleCommandPaletteNavigation(e);
    });
  }

  // Populate command palette with commands
  populateCommandPalette() {
    const quickCommands = [
      { name: 'Generate Chart', shortcut: 'Ctrl+Enter', action: () => this.generateChart() },
      { name: 'Clear Data', shortcut: 'Ctrl+Shift+C', action: () => this.clearData() },
      { name: 'Save Work', shortcut: 'Ctrl+S', action: () => this.saveWork() },
      { name: 'Export Chart', shortcut: 'Ctrl+Shift+E', action: () => this.exportChart() },
      { name: 'Upload File', shortcut: 'Ctrl+Shift+U', action: () => this.uploadFile() }
    ];

    const chartCommands = [
      { name: 'Bar Chart', shortcut: 'Ctrl+1', action: () => this.selectChartType('bar') },
      { name: 'Line Chart', shortcut: 'Ctrl+2', action: () => this.selectChartType('line') },
      { name: 'Pie Chart', shortcut: 'Ctrl+3', action: () => this.selectChartType('pie') },
      { name: 'Scatter Plot', shortcut: 'Ctrl+4', action: () => this.selectChartType('scatter') },
      { name: 'Area Chart', shortcut: 'Ctrl+5', action: () => this.selectChartType('area') }
    ];

    const fileCommands = [
      { name: 'Save As', shortcut: 'Ctrl+Shift+S', action: () => this.saveAs() },
      { name: 'Open Save History', shortcut: 'Ctrl+O', action: () => this.openSaveHistory() },
      { name: 'Export as PNG', shortcut: 'Ctrl+Shift+P', action: () => this.exportAsPNG() },
      { name: 'Export as JSON', shortcut: 'Ctrl+Shift+J', action: () => this.exportAsJSON() },
      { name: 'Import Data', shortcut: 'Ctrl+Shift+I', action: () => this.importData() }
    ];

    const viewCommands = [
      { name: 'Toggle Dark Mode', shortcut: 'Ctrl+Shift+D', action: () => this.toggleDarkMode() },
      { name: 'Toggle Accessibility', shortcut: 'Ctrl+Shift+A', action: () => this.toggleAccessibility() },
      { name: 'Reset View', shortcut: 'Ctrl+Shift+R', action: () => this.resetView() },
      { name: 'Show Keyboard Help', shortcut: 'Ctrl+/', action: () => this.showKeyboardHelp() },
      { name: 'Show Onboarding', shortcut: 'Ctrl+F1', action: () => this.showOnboarding() }
    ];

    this.renderCommandList('quick-commands', quickCommands);
    this.renderCommandList('chart-commands', chartCommands);
    this.renderCommandList('file-commands', fileCommands);
    this.renderCommandList('view-commands', viewCommands);
  }

  // Render command list
  renderCommandList(containerId, commands) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = commands.map((cmd, index) => `
      <div class="command-item" data-index="${index}" tabindex="0">
        <div class="command-info">
          <div class="command-name">${cmd.name}</div>
          <div class="command-shortcut">${cmd.shortcut}</div>
        </div>
        <div class="command-action">
          <i class="fas fa-chevron-right"></i>
        </div>
      </div>
    `).join('');

    // Add click handlers
    container.querySelectorAll('.command-item').forEach((item, index) => {
      item.addEventListener('click', () => {
        commands[index].action();
        this.closeCommandPalette();
      });
    });
  }

  // Toggle command palette
  toggleCommandPalette() {
    if (this.isCommandPaletteOpen) {
      this.closeCommandPalette();
    } else {
      this.openCommandPalette();
    }
  }

  // Open command palette
  openCommandPalette() {
    this.isCommandPaletteOpen = true;
    this.commandPalette.classList.add('show');
    
    const searchInput = document.getElementById('command-search-input');
    searchInput.value = '';
    searchInput.focus();
    
    // Reset filtered view
    this.filterCommands('');
    
    // Announce to screen readers
    if (window.accessibility) {
      window.accessibility.announce('Command palette opened');
    }
  }

  // Close command palette
  closeCommandPalette() {
    this.isCommandPaletteOpen = false;
    this.commandPalette.classList.remove('show');
    
    // Return focus to previous element
    if (this.focusHistory.length > 0) {
      const previousFocus = this.focusHistory.pop();
      previousFocus.focus();
    }
    
    // Announce to screen readers
    if (window.accessibility) {
      window.accessibility.announce('Command palette closed');
    }
  }

  // Filter commands based on search
  filterCommands(query) {
    const allItems = this.commandPalette.querySelectorAll('.command-item');
    const sections = this.commandPalette.querySelectorAll('.command-section');
    
    if (!query) {
      // Show all
      allItems.forEach(item => item.style.display = 'flex');
      sections.forEach(section => section.style.display = 'block');
      return;
    }

    const lowerQuery = query.toLowerCase();
    let sectionHasVisibleItems = new Set();

    allItems.forEach(item => {
      const name = item.querySelector('.command-name').textContent.toLowerCase();
      const shortcut = item.querySelector('.command-shortcut').textContent.toLowerCase();
      
      if (name.includes(lowerQuery) || shortcut.includes(lowerQuery)) {
        item.style.display = 'flex';
        // Find parent section
        const section = item.closest('.command-section');
        if (section) {
          sectionHasVisibleItems.add(section);
        }
      } else {
        item.style.display = 'none';
      }
    });

    // Hide sections with no visible items
    sections.forEach(section => {
      if (sectionHasVisibleItems.has(section)) {
        section.style.display = 'block';
      } else {
        section.style.display = 'none';
      }
    });
  }

  // Handle keyboard navigation in command palette
  handleCommandPaletteNavigation(e) {
    const visibleItems = Array.from(this.commandPalette.querySelectorAll('.command-item:not([style*="display: none"])'));
    const currentIndex = visibleItems.findIndex(item => item === document.activeElement);

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        const nextIndex = (currentIndex + 1) % visibleItems.length;
        visibleItems[nextIndex].focus();
        break;
        
      case 'ArrowUp':
        e.preventDefault();
        const prevIndex = currentIndex === 0 ? visibleItems.length - 1 : currentIndex - 1;
        visibleItems[prevIndex].focus();
        break;
        
      case 'Enter':
        e.preventDefault();
        if (currentIndex >= 0) {
          visibleItems[currentIndex].click();
        }
        break;
        
      case 'Escape':
        e.preventDefault();
        this.closeCommandPalette();
        break;
    }
  }

  // Create keyboard help modal
  createKeyboardHelp() {
    const helpModal = document.createElement('div');
    helpModal.id = 'keyboard-help-modal';
    helpModal.className = 'keyboard-help-modal';
    helpModal.innerHTML = `
      <div class="modal-backdrop"></div>
      <div class="modal-container">
        <div class="modal-header">
          <h3>Keyboard Shortcuts</h3>
          <button class="modal-close" onclick="window.keyboardNav.closeKeyboardHelp()">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-content">
          <div class="shortcut-categories">
            <div class="shortcut-category">
              <h4>Navigation</h4>
              <div class="shortcut-list"></div>
            </div>
            <div class="shortcut-category">
              <h4>Chart Operations</h4>
              <div class="shortcut-list"></div>
            </div>
            <div class="shortcut-category">
              <h4>File Operations</h4>
              <div class="shortcut-list"></div>
            </div>
            <div class="shortcut-category">
              <h4>View Options</h4>
              <div class="shortcut-list"></div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary" onclick="window.keyboardNav.closeKeyboardHelp()">
            Got it!
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(helpModal);
  }

  // Show keyboard help
  showKeyboardHelp() {
    const modal = document.getElementById('keyboard-help-modal');
    if (!modal) return;

    // Populate shortcuts
    const categories = modal.querySelectorAll('.shortcut-list');
    const shortcutsByCategory = this.getShortcutsByCategory();
    
    categories.forEach((category, index) => {
      const categoryShortcuts = Object.values(shortcutsByCategory)[index] || [];
      category.innerHTML = categoryShortcuts.map(shortcut => `
        <div class="shortcut-item">
          <div class="shortcut-keys">
            ${this.formatShortcutKeys(shortcut.keys)}
          </div>
          <div class="shortcut-description">${shortcut.description}</div>
        </div>
      `).join('');
    });

    modal.classList.add('show');
    
    // Announce to screen readers
    if (window.accessibility) {
      window.accessibility.announce('Keyboard shortcuts help opened');
    }
  }

  // Close keyboard help
  closeKeyboardHelp() {
    const modal = document.getElementById('keyboard-help-modal');
    if (modal) {
      modal.classList.remove('show');
    }
  }

  // Get shortcuts organized by category
  getShortcutsByCategory() {
    return {
      navigation: [
        { keys: 'Ctrl+K', description: 'Open Command Palette' },
        { keys: 'Alt+1/2/3', description: 'Focus Chart/Input/Preview' },
        { keys: 'Ctrl+Tab', description: 'Next Tab' },
        { keys: 'Ctrl+Shift+Tab', description: 'Previous Tab' }
      ],
      chart: [
        { keys: 'Ctrl+Enter', description: 'Generate Chart' },
        { keys: 'Ctrl+Shift+G', description: 'Regenerate Chart' },
        { keys: 'Ctrl+1-5', description: 'Select Chart Type' },
        { keys: 'Ctrl+Shift+C', description: 'Clear Data' }
      ],
      file: [
        { keys: 'Ctrl+S', description: 'Save Work' },
        { keys: 'Ctrl+Shift+S', description: 'Save As' },
        { keys: 'Ctrl+O', description: 'Open Save History' },
        { keys: 'Ctrl+Shift+E', description: 'Export Chart' },
        { keys: 'Ctrl+Shift+U', description: 'Upload File' }
      ],
      view: [
        { keys: 'Ctrl+Shift+D', description: 'Toggle Dark Mode' },
        { keys: 'Ctrl+Shift+A', description: 'Toggle Accessibility' },
        { keys: 'Ctrl+/', description: 'Show Keyboard Help' },
        { keys: 'Ctrl+F1', description: 'Show Onboarding' }
      ]
    };
  }

  // Format shortcut keys for display
  formatShortcutKeys(keys) {
    return keys.split('+').map(key => `<kbd>${key}</kbd>`).join(' + ');
  }

  // Setup focus management
  setupFocusManagement() {
    // Track focus history for smart focus return
    document.addEventListener('focusin', (e) => {
      this.focusHistory.push(e.target);
      
      // Keep only last 10 focus points
      if (this.focusHistory.length > 10) {
        this.focusHistory = this.focusHistory.slice(-10);
      }
    });
  }

  // Setup quick actions
  setupQuickActions() {
    // Add quick action buttons to UI
    const quickActions = document.createElement('div');
    quickActions.className = 'quick-actions';
    quickActions.innerHTML = `
      <button class="quick-action-btn" data-action="generate" title="Generate Chart (Ctrl+Enter)">
        <i class="fas fa-play"></i>
      </button>
      <button class="quick-action-btn" data-action="save" title="Save (Ctrl+S)">
        <i class="fas fa-save"></i>
      </button>
      <button class="quick-action-btn" data-action="export" title="Export (Ctrl+Shift+E)">
        <i class="fas fa-download"></i>
      </button>
      <button class="quick-action-btn" data-action="help" title="Help (Ctrl+/)">
        <i class="fas fa-keyboard"></i>
      </button>
    `;
    
    // Insert into appropriate location
    const header = document.querySelector('.header .container');
    if (header) {
      header.appendChild(quickActions);
    }

    // Add event listeners
    quickActions.addEventListener('click', (e) => {
      const action = e.target.closest('.quick-action-btn')?.dataset.action;
      if (action) {
        this.executeQuickAction(action);
      }
    });
  }

  // Execute quick action
  executeQuickAction(action) {
    switch (action) {
      case 'generate':
        this.generateChart();
        break;
      case 'save':
        this.saveWork();
        break;
      case 'export':
        this.exportChart();
        break;
      case 'help':
        this.showKeyboardHelp();
        break;
    }
  }

  // Action implementations
  handleEscape() {
    if (this.isCommandPaletteOpen) {
      this.closeCommandPalette();
    } else if (this.modalStack.length > 0) {
      // Close top modal
      const topModal = this.modalStack[this.modalStack.length - 1];
      topModal.classList.remove('show');
      this.modalStack.pop();
    } else {
      // Clear focus or return to default
      document.activeElement?.blur();
    }
  }

  focusChartType() {
    const firstChartOption = document.querySelector('.chart-option');
    if (firstChartOption) {
      firstChartOption.focus();
    }
  }

  focusDataInput() {
    const dataInput = document.getElementById('data-input');
    if (dataInput) {
      dataInput.focus();
    }
  }

  focusPreview() {
    const previewContainer = document.querySelector('.preview-container');
    if (previewContainer) {
      previewContainer.focus();
    }
  }

  nextTab() {
    const activeTab = document.querySelector('.tab.active');
    const allTabs = Array.from(document.querySelectorAll('.tab'));
    const currentIndex = allTabs.indexOf(activeTab);
    const nextIndex = (currentIndex + 1) % allTabs.length;
    allTabs[nextIndex].click();
  }

  previousTab() {
    const activeTab = document.querySelector('.tab.active');
    const allTabs = Array.from(document.querySelectorAll('.tab'));
    const currentIndex = allTabs.indexOf(activeTab);
    const prevIndex = currentIndex === 0 ? allTabs.length - 1 : currentIndex - 1;
    allTabs[prevIndex].click();
  }

  generateChart() {
    const generateBtn = document.getElementById('generate-btn');
    if (generateBtn && !generateBtn.disabled) {
      generateBtn.click();
    }
  }

  regenerateChart() {
    // Implementation would depend on your chart generation system
    this.generateChart();
  }

  clearData() {
    const dataInput = document.getElementById('data-input');
    if (dataInput) {
      dataInput.value = '';
      dataInput.focus();
    }
  }

  previewData() {
    // Trigger data preview if available
    if (window.dataPreview) {
      window.dataPreview.processTextInput(document.getElementById('data-input')?.value || '');
    }
  }

  uploadFile() {
    const fileInput = document.getElementById('file-input');
    if (fileInput) {
      fileInput.click();
    }
  }

  saveWork() {
    if (window.saveStateManager) {
      window.saveStateManager.manualSave();
    }
  }

  saveAs() {
    if (window.saveStateManager) {
      window.saveStateManager.saveAs();
    }
  }

  openSaveHistory() {
    if (window.saveStateManager) {
      window.saveStateManager.showSaveHistory();
    }
  }

  exportChart() {
    // Implementation would depend on your export system
    const exportBtn = document.querySelector('[data-export="chart"]');
    if (exportBtn) {
      exportBtn.click();
    }
  }

  exportAsPNG() {
    // Implementation would depend on your export system
    const pngBtn = document.querySelector('[data-export="png"]');
    if (pngBtn) {
      pngBtn.click();
    }
  }

  exportAsJSON() {
    // Implementation would depend on your export system
    const jsonBtn = document.querySelector('[data-export="json"]');
    if (jsonBtn) {
      jsonBtn.click();
    }
  }

  importData() {
    this.uploadFile();
  }

  toggleDarkMode() {
    // Implementation would depend on your theme system
    document.body.classList.toggle('dark-mode');
  }

  toggleAccessibility() {
    if (window.accessibility) {
      const panel = document.getElementById('accessibility-panel');
      if (panel) {
        panel.classList.toggle('show');
      }
    }
  }

  resetView() {
    // Reset zoom, clear filters, etc.
    window.scrollTo(0, 0);
    document.body.classList.remove('zoomed', 'filtered');
  }

  selectChartType(type) {
    const chartOption = document.querySelector(`[data-type="${type}"]`);
    if (chartOption) {
      chartOption.click();
    }
  }

  showHelp() {
    this.showKeyboardHelp();
  }

  showOnboarding() {
    if (window.onboarding) {
      window.onboarding.startOnboarding();
    }
  }

  reportIssue() {
    // Open issue reporting modal or redirect
    if (window.errorHandler) {
      window.errorHandler.handleError({
        message: 'User reported an issue via keyboard shortcut',
        type: 'user_report'
      }, { userReported: true });
    }
  }

  // Update context based on focused element
  updateContext(element) {
    if (element.closest('.modal')) {
      this.context = 'modal';
    } else if (element.closest('.command-palette')) {
      this.context = 'command-palette';
    } else if (element.closest('.preview-container')) {
      this.context = 'preview';
    } else if (element.closest('.input-panel')) {
      this.context = 'input';
    } else {
      this.context = 'global';
    }
  }

  // Get all shortcuts for display
  getAllShortcuts() {
    return Array.from(this.shortcuts.entries()).map(([key, shortcut]) => ({
      key: key,
      keys: this.isMac() ? shortcut.mac : shortcut.windows,
      description: shortcut.description,
      context: shortcut.context
    }));
  }

  // Check if running on Mac
  isMac() {
    return navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  }
}

// Initialize keyboard navigation manager
document.addEventListener('DOMContentLoaded', () => {
  window.keyboardNav = new KeyboardNavigationManager();
});

export { KeyboardNavigationManager };

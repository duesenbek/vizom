// Advanced Customization Panel for Power Users
class CustomizationPanel {
  constructor() {
    this.customizations = new Map();
    this.presets = new Map();
    this.currentPreset = 'default';
    this.isOpen = false;
    this.activeSection = 'general';
    
    this.init();
  }

  init() {
    this.loadDefaultCustomizations();
    this.loadPresets();
    this.loadSavedCustomizations();
    this.createCustomizationPanel();
    this.setupEventListeners();
    this.setupKeyboardShortcuts();
    this.applyCurrentCustomizations();
  }

  // Load default customization options
  loadDefaultCustomizations() {
    // General Settings
    this.customizations.set('general', {
      autoSave: {
        type: 'toggle',
        value: true,
        label: 'Auto-save',
        description: 'Automatically save your work every 30 seconds',
        category: 'performance'
      },
      animations: {
        type: 'toggle',
        value: true,
        label: 'Animations',
        description: 'Enable smooth transitions and animations',
        category: 'appearance'
      },
      notifications: {
        type: 'toggle',
        value: true,
        label: 'Notifications',
        description: 'Show success and error notifications',
        category: 'interface'
      },
      soundEffects: {
        type: 'toggle',
        value: false,
        label: 'Sound Effects',
        description: 'Play sounds for actions and errors',
        category: 'accessibility'
      },
      compactMode: {
        type: 'toggle',
        value: false,
        label: 'Compact Mode',
        description: 'Reduce spacing and padding for more content',
        category: 'appearance'
      },
      showTooltips: {
        type: 'toggle',
        value: true,
        label: 'Show Tooltips',
        description: 'Display helpful tooltips on hover',
        category: 'interface'
      }
    });

    // Chart Settings
    this.customizations.set('charts', {
      defaultChartType: {
        type: 'select',
        value: 'bar',
        options: [
          { value: 'bar', label: 'Bar Chart' },
          { value: 'line', label: 'Line Chart' },
          { value: 'pie', label: 'Pie Chart' },
          { value: 'scatter', label: 'Scatter Plot' },
          { value: 'area', label: 'Area Chart' }
        ],
        label: 'Default Chart Type',
        description: 'Chart type selected by default',
        category: 'charts'
      },
      colorScheme: {
        type: 'select',
        value: 'default',
        options: [
          { value: 'default', label: 'Default Colors' },
          { value: 'vibrant', label: 'Vibrant' },
          { value: 'pastel', label: 'Pastel' },
          { value: 'monochrome', label: 'Monochrome' },
          { value: 'rainbow', label: 'Rainbow' },
          { value: 'custom', label: 'Custom Colors' }
        ],
        label: 'Color Scheme',
        description: 'Color palette for charts',
        category: 'charts'
      },
      animationSpeed: {
        type: 'slider',
        value: 300,
        min: 0,
        max: 1000,
        step: 50,
        unit: 'ms',
        label: 'Animation Speed',
        description: 'Duration of chart animations',
        category: 'performance'
      },
      showGrid: {
        type: 'toggle',
        value: true,
        label: 'Show Grid Lines',
        description: 'Display grid lines in charts',
        category: 'charts'
      },
      showLegend: {
        type: 'toggle',
        value: true,
        label: 'Show Legend',
        description: 'Display chart legend',
        category: 'charts'
      },
      showDataLabels: {
        type: 'toggle',
        value: false,
        label: 'Show Data Labels',
        description: 'Display values on chart elements',
        category: 'charts'
      },
      chartOpacity: {
        type: 'slider',
        value: 100,
        min: 50,
        max: 100,
        step: 5,
        unit: '%',
        label: 'Chart Opacity',
        description: 'Transparency of chart elements',
        category: 'appearance'
      }
    });

    // Data Settings
    this.customizations.set('data', {
      maxDataPoints: {
        type: 'number',
        value: 100,
        min: 10,
        max: 1000,
        step: 10,
        label: 'Max Data Points',
        description: 'Maximum number of data points to process',
        category: 'performance'
      },
      autoDetectFormat: {
        type: 'toggle',
        value: true,
        label: 'Auto-detect Format',
        description: 'Automatically detect data format',
        category: 'data'
      },
      validateData: {
        type: 'toggle',
        value: true,
        label: 'Validate Data',
        description: 'Check data for errors and inconsistencies',
        category: 'data'
      },
      showDataPreview: {
        type: 'toggle',
        value: true,
        label: 'Show Data Preview',
        description: 'Display preview table for uploaded data',
        category: 'interface'
      },
      dateFormat: {
        type: 'select',
        value: 'auto',
        options: [
          { value: 'auto', label: 'Auto-detect' },
          { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
          { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
          { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
          { value: 'custom', label: 'Custom Format' }
        ],
        label: 'Date Format',
        description: 'Format for date values',
        category: 'data'
      },
      numberFormat: {
        type: 'select',
        value: 'auto',
        options: [
          { value: 'auto', label: 'Auto-detect' },
          { value: '1,234.56', label: '1,234.56' },
          { value: '1.234,56', label: '1.234,56' },
          { value: '1234.56', label: '1234.56' },
          { value: 'custom', label: 'Custom Format' }
        ],
        label: 'Number Format',
        description: 'Format for numeric values',
        category: 'data'
      }
    });

    // Export Settings
    this.customizations.set('export', {
      defaultFormat: {
        type: 'select',
        value: 'png',
        options: [
          { value: 'png', label: 'PNG Image' },
          { value: 'jpg', label: 'JPG Image' },
          { value: 'svg', label: 'SVG Vector' },
          { value: 'pdf', label: 'PDF Document' },
          { value: 'json', label: 'JSON Data' }
        ],
        label: 'Default Export Format',
        description: 'Format used for quick export',
        category: 'export'
      },
      imageQuality: {
        type: 'slider',
        value: 90,
        min: 50,
        max: 100,
        step: 5,
        unit: '%',
        label: 'Image Quality',
        description: 'Quality for exported images',
        category: 'export'
      },
      imageSize: {
        type: 'select',
        value: '1920x1080',
        options: [
          { value: '1280x720', label: 'HD (1280×720)' },
          { value: '1920x1080', label: 'Full HD (1920×1080)' },
          { value: '2560x1440', label: '2K (2560×1440)' },
          { value: '3840x2160', label: '4K (3840×2160)' },
          { value: 'custom', label: 'Custom Size' }
        ],
        label: 'Image Size',
        description: 'Dimensions for exported images',
        category: 'export'
      },
      includeMetadata: {
        type: 'toggle',
        value: false,
        label: 'Include Metadata',
        description: 'Add creation info to exported files',
        category: 'export'
      },
      transparentBackground: {
        type: 'toggle',
        value: false,
        label: 'Transparent Background',
        description: 'Use transparent background for images',
        category: 'export'
      }
    });

    // Advanced Settings
    this.customizations.set('advanced', {
      developerMode: {
        type: 'toggle',
        value: false,
        label: 'Developer Mode',
        description: 'Show advanced options and debugging info',
        category: 'advanced'
      },
      experimentalFeatures: {
        type: 'toggle',
        value: false,
        label: 'Experimental Features',
        description: 'Enable beta features and improvements',
        category: 'advanced'
      },
      performanceMonitoring: {
        type: 'toggle',
        value: false,
        label: 'Performance Monitoring',
        description: 'Track and display performance metrics',
        category: 'advanced'
      },
      apiDebugging: {
        type: 'toggle',
        value: false,
        label: 'API Debugging',
        description: 'Show detailed API request information',
        category: 'advanced'
      },
      cacheEnabled: {
        type: 'toggle',
        value: true,
        label: 'Enable Cache',
        description: 'Cache generated charts for faster loading',
        category: 'performance'
      },
      logLevel: {
        type: 'select',
        value: 'error',
        options: [
          { value: 'none', label: 'None' },
          { value: 'error', label: 'Errors Only' },
          { value: 'warn', label: 'Warnings + Errors' },
          { value: 'info', label: 'Info + Warnings + Errors' },
          { value: 'debug', label: 'All Messages' }
        ],
        label: 'Log Level',
        description: 'Amount of information to log',
        category: 'advanced'
      }
    });
  }

  // Load presets
  loadPresets() {
    // Performance Preset
    this.presets.set('performance', {
      name: 'Performance',
      description: 'Optimized for speed and efficiency',
      icon: '🚀',
      customizations: {
        general: {
          animations: false,
          soundEffects: false,
          compactMode: true,
          showTooltips: false
        },
        charts: {
          animationSpeed: 0,
          showGrid: false,
          showLegend: false,
          showDataLabels: false
        },
        data: {
          maxDataPoints: 50,
          validateData: false,
          showDataPreview: false
        },
        export: {
          imageQuality: 70,
          includeMetadata: false
        },
        advanced: {
          performanceMonitoring: true,
          cacheEnabled: true
        }
      }
    });

    // Accessibility Preset
    this.presets.set('accessibility', {
      name: 'Accessibility',
      description: 'Enhanced for users with disabilities',
      icon: '♿',
      customizations: {
        general: {
          animations: false,
          soundEffects: true,
          compactMode: false,
          showTooltips: true
        },
        charts: {
          animationSpeed: 500,
          showGrid: true,
          showLegend: true,
          showDataLabels: true,
          chartOpacity: 100
        },
        data: {
          validateData: true,
          showDataPreview: true
        },
        export: {
          imageQuality: 100,
          includeMetadata: true
        }
      }
    });

    // Presentation Preset
    this.presets.set('presentation', {
      name: 'Presentation',
      description: 'Optimized for presentations and demos',
      icon: '📊',
      customizations: {
        general: {
          animations: true,
          notifications: false,
          compactMode: false,
          showTooltips: true
        },
        charts: {
          animationSpeed: 600,
          showGrid: true,
          showLegend: true,
          showDataLabels: true,
          chartOpacity: 100
        },
        data: {
          showDataPreview: true
        },
        export: {
          imageQuality: 100,
          imageSize: '2560x1440',
          includeMetadata: true
        }
      }
    });

    // Developer Preset
    this.presets.set('developer', {
      name: 'Developer',
      description: 'Advanced options for power users',
      icon: '💻',
      customizations: {
        general: {
          animations: true,
          notifications: true
        },
        charts: {
          colorScheme: 'custom'
        },
        data: {
          autoDetectFormat: false,
          validateData: true
        },
        advanced: {
          developerMode: true,
          experimentalFeatures: true,
          performanceMonitoring: true,
          apiDebugging: true,
          logLevel: 'debug'
        }
      }
    });
  }

  // Load saved customizations
  loadSavedCustomizations() {
    try {
      const saved = localStorage.getItem('vizom_customizations');
      if (saved) {
        const customizations = JSON.parse(saved);
        Object.entries(customizations).forEach(([section, settings]) => {
          if (this.customizations.has(section)) {
            Object.entries(settings).forEach(([key, value]) => {
              if (this.customizations.get(section)[key]) {
                this.customizations.get(section)[key].value = value;
              }
            });
          }
        });
      }

      // Load current preset
      const currentPreset = localStorage.getItem('vizom_customization_preset');
      if (currentPreset && this.presets.has(currentPreset)) {
        this.currentPreset = currentPreset;
      }
    } catch (error) {
      console.warn('Failed to load customizations:', error);
    }
  }

  // Create customization panel UI
  createCustomizationPanel() {
    const panel = document.createElement('div');
    panel.id = 'customization-panel';
    panel.className = 'customization-panel';
    panel.innerHTML = `
      <div class="customization-backdrop"></div>
      <div class="customization-container">
        <div class="customization-header">
          <div class="header-content">
            <h2 class="panel-title">
              <i class="fas fa-sliders-h"></i>
              Advanced Customization
            </h2>
            <p class="panel-description">Fine-tune VIZOM to your preferences</p>
          </div>
          <div class="header-actions">
            <button class="preset-btn" id="preset-btn" title="Load preset">
              <i class="fas fa-bookmark"></i>
            </button>
            <button class="reset-btn" id="reset-btn" title="Reset to defaults">
              <i class="fas fa-undo"></i>
            </button>
            <button class="close-btn" id="close-btn" title="Close panel">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
        
        <div class="customization-content">
          <div class="customization-sidebar">
            <div class="section-nav">
              <div class="nav-item active" data-section="general">
                <i class="fas fa-cog"></i>
                <span>General</span>
              </div>
              <div class="nav-item" data-section="charts">
                <i class="fas fa-chart-bar"></i>
                <span>Charts</span>
              </div>
              <div class="nav-item" data-section="data">
                <i class="fas fa-database"></i>
                <span>Data</span>
              </div>
              <div class="nav-item" data-section="export">
                <i class="fas fa-download"></i>
                <span>Export</span>
              </div>
              <div class="nav-item" data-section="advanced">
                <i class="fas fa-code"></i>
                <span>Advanced</span>
              </div>
            </div>
            
            <div class="preset-info">
              <div class="current-preset">
                <span class="preset-label">Current Preset:</span>
                <span class="preset-name" id="current-preset-name">${this.getPresetDisplayName(this.currentPreset)}</span>
              </div>
            </div>
          </div>
          
          <div class="customization-main">
            <div class="section-content" id="section-content">
              <!-- Content will be dynamically loaded -->
            </div>
          </div>
        </div>
        
        <div class="customization-footer">
          <div class="footer-info">
            <span class="settings-count">
              <span id="modified-count">0</span> settings modified
            </span>
          </div>
          <div class="footer-actions">
            <button class="btn btn-secondary" id="cancel-btn">Cancel</button>
            <button class="btn btn-primary" id="apply-btn">Apply Changes</button>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(panel);
    this.setupPanelEvents();
    this.loadSection('general');
  }

  // Setup panel events
  setupPanelEvents() {
    const panel = document.getElementById('customization-panel');
    const closeBtn = document.getElementById('close-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const applyBtn = document.getElementById('apply-btn');
    const resetBtn = document.getElementById('reset-btn');
    const presetBtn = document.getElementById('preset-btn');
    const backdrop = panel.querySelector('.customization-backdrop');

    // Close panel
    closeBtn.addEventListener('click', () => this.closePanel());
    cancelBtn.addEventListener('click', () => this.closePanel());
    backdrop.addEventListener('click', () => this.closePanel());

    // Apply changes
    applyBtn.addEventListener('click', () => this.applyChanges());

    // Reset to defaults
    resetBtn.addEventListener('click', () => this.resetToDefaults());

    // Preset menu
    presetBtn.addEventListener('click', () => this.showPresetMenu());

    // Section navigation
    panel.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', () => {
        const section = item.dataset.section;
        this.loadSection(section);
        
        // Update active state
        panel.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');
      });
    });

    // Keyboard shortcuts
    panel.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closePanel();
      }
    });
  }

  // Load section content
  loadSection(sectionId) {
    this.activeSection = sectionId;
    const section = this.customizations.get(sectionId);
    if (!section) return;

    const content = document.getElementById('section-content');
    const settings = Object.entries(section);
    
    // Group by category
    const categorized = {};
    settings.forEach(([key, setting]) => {
      const category = setting.category || 'general';
      if (!categorized[category]) {
        categorized[category] = [];
      }
      categorized[category].push([key, setting]);
    });

    let html = '';
    Object.entries(categorized).forEach(([category, categorySettings]) => {
      html += `
        <div class="settings-category">
          <h3 class="category-title">${this.getCategoryDisplayName(category)}</h3>
          <div class="settings-grid">
            ${categorySettings.map(([key, setting]) => this.renderSetting(key, setting)).join('')}
          </div>
        </div>
      `;
    });

    content.innerHTML = html;
    this.attachSettingEvents();
    this.updateModifiedCount();
  }

  // Render individual setting
  renderSetting(key, setting) {
    const value = setting.value;
    let inputHtml = '';

    switch (setting.type) {
      case 'toggle':
        inputHtml = `
          <label class="toggle-switch">
            <input type="checkbox" ${value ? 'checked' : ''} data-setting="${key}">
            <span class="toggle-slider"></span>
          </label>
        `;
        break;

      case 'select':
        inputHtml = `
          <select class="setting-select" data-setting="${key}">
            ${setting.options.map(option => 
              `<option value="${option.value}" ${value === option.value ? 'selected' : ''}>${option.label}</option>`
            ).join('')}
          </select>
        `;
        break;

      case 'slider':
        inputHtml = `
          <div class="slider-container">
            <input type="range" 
                   class="setting-slider" 
                   data-setting="${key}"
                   min="${setting.min}" 
                   max="${setting.max}" 
                   step="${setting.step}"
                   value="${value}">
            <span class="slider-value">${value}${setting.unit || ''}</span>
          </div>
        `;
        break;

      case 'number':
        inputHtml = `
          <input type="number" 
                 class="setting-number" 
                 data-setting="${key}"
                 min="${setting.min}" 
                 max="${setting.max}" 
                 step="${setting.step}"
                 value="${value}">
        `;
        break;
    }

    return `
      <div class="setting-item" data-setting="${key}">
        <div class="setting-info">
          <label class="setting-label">${setting.label}</label>
          <p class="setting-description">${setting.description}</p>
        </div>
        <div class="setting-control">
          ${inputHtml}
        </div>
      </div>
    `;
  }

  // Attach events to settings
  attachSettingEvents() {
    // Toggle switches
    document.querySelectorAll('.toggle-switch input').forEach(toggle => {
      toggle.addEventListener('change', (e) => {
        this.updateSetting(e.target.dataset.setting, e.target.checked);
      });
    });

    // Select dropdowns
    document.querySelectorAll('.setting-select').forEach(select => {
      select.addEventListener('change', (e) => {
        this.updateSetting(e.target.dataset.setting, e.target.value);
      });
    });

    // Sliders
    document.querySelectorAll('.setting-slider').forEach(slider => {
      slider.addEventListener('input', (e) => {
        const value = e.target.value;
        const setting = this.getSetting(e.target.dataset.setting);
        e.target.nextElementSibling.textContent = `${value}${setting.unit || ''}`;
        this.updateSetting(e.target.dataset.setting, parseInt(value));
      });
    });

    // Number inputs
    document.querySelectorAll('.setting-number').forEach(input => {
      input.addEventListener('change', (e) => {
        this.updateSetting(e.target.dataset.setting, parseInt(e.target.value));
      });
    });
  }

  // Update setting value
  updateSetting(key, value) {
    const section = this.customizations.get(this.activeSection);
    if (section && section[key]) {
      section[key].value = value;
      this.updateModifiedCount();
    }
  }

  // Get setting
  getSetting(key) {
    const section = this.customizations.get(this.activeSection);
    return section ? section[key] : null;
  }

  // Update modified count
  updateModifiedCount() {
    let modifiedCount = 0;
    this.customizations.forEach((section, sectionId) => {
      Object.entries(section).forEach(([key, setting]) => {
        if (this.isSettingModified(sectionId, key)) {
          modifiedCount++;
        }
      });
    });

    document.getElementById('modified-count').textContent = modifiedCount;
  }

  // Check if setting is modified from default
  isSettingModified(sectionId, key) {
    // This would compare with original defaults
    // For now, just check if it's not the default value
    return true; // Simplified for implementation
  }

  // Show preset menu
  showPresetMenu() {
    const menu = document.createElement('div');
    menu.className = 'preset-menu';
    menu.innerHTML = `
      <div class="preset-menu-header">
        <h4>Load Preset</h4>
        <button class="close-menu-btn">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="preset-list">
        ${Array.from(this.presets.entries()).map(([id, preset]) => `
          <div class="preset-item ${this.currentPreset === id ? 'active' : ''}" data-preset="${id}">
            <div class="preset-icon">${preset.icon}</div>
            <div class="preset-info">
              <div class="preset-name">${preset.name}</div>
              <div class="preset-description">${preset.description}</div>
            </div>
          </div>
        `).join('')}
        <div class="preset-item" data-preset="custom">
          <div class="preset-icon">🎨</div>
          <div class="preset-info">
            <div class="preset-name">Custom</div>
            <div class="preset-description">Your current settings</div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(menu);

    // Position menu
    const presetBtn = document.getElementById('preset-btn');
    const rect = presetBtn.getBoundingClientRect();
    menu.style.top = rect.bottom + 8 + 'px';
    menu.style.right = window.innerWidth - rect.right + 'px';

    // Setup events
    menu.querySelector('.close-menu-btn').addEventListener('click', () => menu.remove());
    menu.addEventListener('click', (e) => {
      const presetItem = e.target.closest('.preset-item');
      if (presetItem) {
        const presetId = presetItem.dataset.preset;
        this.loadPreset(presetId);
        menu.remove();
      }
    });

    // Close on outside click
    setTimeout(() => {
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.preset-menu') && !e.target.closest('.preset-btn')) {
          menu.remove();
        }
      }, { once: true });
    }, 100);
  }

  // Load preset
  loadPreset(presetId) {
    if (presetId === 'custom') {
      // Keep current settings
      this.currentPreset = 'custom';
    } else if (this.presets.has(presetId)) {
      const preset = this.presets.get(presetId);
      
      // Apply preset customizations
      Object.entries(preset.customizations).forEach(([sectionId, settings]) => {
        const section = this.customizations.get(sectionId);
        if (section) {
          Object.entries(settings).forEach(([key, value]) => {
            if (section[key]) {
              section[key].value = value;
            }
          });
        }
      });
      
      this.currentPreset = presetId;
    }

    // Update UI
    document.getElementById('current-preset-name').textContent = this.getPresetDisplayName(this.currentPreset);
    this.loadSection(this.activeSection);
    
    // Apply changes immediately
    this.applyChanges();
  }

  // Get preset display name
  getPresetDisplayName(presetId) {
    if (presetId === 'custom') return 'Custom';
    if (presetId === 'default') return 'Default';
    
    const preset = this.presets.get(presetId);
    return preset ? preset.name : presetId;
  }

  // Reset to defaults
  resetToDefaults() {
    if (confirm('Are you sure you want to reset all settings to their default values? This cannot be undone.')) {
      this.loadDefaultCustomizations();
      this.currentPreset = 'default';
      this.loadSection(this.activeSection);
      
      // Update UI
      document.getElementById('current-preset-name').textContent = this.getPresetDisplayName(this.currentPreset);
      
      if (window.uiEnhancements) {
        window.uiEnhancements.showNotification('Settings reset to defaults', 'info');
      }
    }
  }

  // Apply changes
  applyChanges() {
    // Save to localStorage
    this.saveCustomizations();
    
    // Apply to current session
    this.applyCurrentCustomizations();
    
    // Update preset
    localStorage.setItem('vizom_customization_preset', this.currentPreset);
    
    // Show success message
    if (window.uiEnhancements) {
      window.uiEnhancements.showNotification('Customizations applied successfully', 'success');
    }
    
    // Track usage
    if (window.analytics) {
      window.analytics.trackCustomEvent('customizations_applied', {
        preset: this.currentPreset,
        section: this.activeSection
      });
    }
    
    // Close panel
    this.closePanel();
  }

  // Apply current customizations to the app
  applyCurrentCustomizations() {
    const general = this.customizations.get('general');
    const charts = this.customizations.get('charts');
    const data = this.customizations.get('data');
    const advanced = this.customizations.get('advanced');

    // Apply general settings
    if (general) {
      // Auto-save
      if (window.saveStateManager) {
        if (general.autoSave.value) {
          window.saveStateManager.setupAutoSave();
        } else {
          window.saveStateManager.cleanup();
        }
      }
      
      // Animations
      document.body.classList.toggle('no-animations', !general.animations.value);
      
      // Compact mode
      document.body.classList.toggle('compact-mode', general.compactMode.value);
      
      // Tooltips
      document.body.classList.toggle('no-tooltips', !general.showTooltips.value);
    }

    // Apply chart settings
    if (charts) {
      // Set CSS variables for chart customizations
      const root = document.documentElement;
      root.style.setProperty('--chart-animation-speed', `${charts.animationSpeed.value}ms`);
      root.style.setProperty('--chart-opacity', charts.chartOpacity.value / 100);
    }

    // Apply data settings
    if (data) {
      // Update data validation settings
      if (window.dataPreview) {
        window.dataPreview.validationRules.maxDataPoints = data.maxDataPoints.value;
      }
    }

    // Apply advanced settings
    if (advanced) {
      // Developer mode
      document.body.classList.toggle('developer-mode', advanced.developerMode.value);
      
      // Performance monitoring
      if (advanced.performanceMonitoring.value) {
        this.enablePerformanceMonitoring();
      } else {
        this.disablePerformanceMonitoring();
      }
      
      // Log level
      this.setLogLevel(advanced.logLevel.value);
    }

    // Dispatch event
    document.dispatchEvent(new CustomEvent('customizationsApplied', {
      detail: { customizations: this.getAllCustomizations() }
    }));
  }

  // Save customizations
  saveCustomizations() {
    try {
      const customizations = {};
      this.customizations.forEach((section, sectionId) => {
        customizations[sectionId] = {};
        Object.entries(section).forEach(([key, setting]) => {
          customizations[sectionId][key] = setting.value;
        });
      });
      
      localStorage.setItem('vizom_customizations', JSON.stringify(customizations));
    } catch (error) {
      console.warn('Failed to save customizations:', error);
    }
  }

  // Setup keyboard shortcuts
  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Ctrl+Shift+C for customization panel
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        this.togglePanel();
      }
    });
  }

  // Setup event listeners
  setupEventListeners() {
    // Listen for customization changes
    document.addEventListener('customizationChanged', (e) => {
      this.handleCustomizationChange(e.detail);
    });
  }

  // Handle customization change
  handleCustomizationChange(detail) {
    // Apply immediate changes if needed
    if (detail.immediate) {
      this.applyCurrentCustomizations();
    }
  }

  // Panel control methods
  openPanel() {
    this.isOpen = true;
    const panel = document.getElementById('customization-panel');
    panel.classList.add('show');
    
    // Track usage
    if (window.analytics) {
      window.analytics.trackCustomEvent('customization_panel_opened');
    }
  }

  closePanel() {
    this.isOpen = false;
    const panel = document.getElementById('customization-panel');
    panel.classList.remove('show');
  }

  togglePanel() {
    if (this.isOpen) {
      this.closePanel();
    } else {
      this.openPanel();
    }
  }

  // Utility methods
  getCategoryDisplayName(category) {
    const names = {
      'general': 'General Settings',
      'appearance': 'Appearance',
      'performance': 'Performance',
      'interface': 'Interface',
      'accessibility': 'Accessibility',
      'charts': 'Chart Settings',
      'data': 'Data Settings',
      'export': 'Export Settings',
      'advanced': 'Advanced Options'
    };
    
    return names[category] || category;
  }

  getAllCustomizations() {
    const result = {};
    this.customizations.forEach((section, sectionId) => {
      result[sectionId] = {};
      Object.entries(section).forEach(([key, setting]) => {
        result[sectionId][key] = setting.value;
      });
    });
    return result;
  }

  // Performance monitoring
  enablePerformanceMonitoring() {
    if (!this.performanceMonitor) {
      this.performanceMonitor = {
        startTime: performance.now(),
        marks: new Map(),
        measures: new Map()
      };
    }
  }

  disablePerformanceMonitoring() {
    this.performanceMonitor = null;
  }

  // Log level management
  setLogLevel(level) {
    this.logLevel = level;
    // Configure logging based on level
  }

  // Get customization stats
  getCustomizationStats() {
    return {
      totalSettings: Array.from(this.customizations.values()).reduce((total, section) => 
        total + Object.keys(section).length, 0
      ),
      currentPreset: this.currentPreset,
      availablePresets: this.presets.size,
      modifiedSettings: this.getModifiedCount()
    };
  }

  getModifiedCount() {
    let count = 0;
    this.customizations.forEach((section) => {
      Object.values(section).forEach((setting) => {
        if (this.isSettingModified(this.activeSection, setting.key)) {
          count++;
        }
      });
    });
    return count;
  }
}

// Initialize customization panel
document.addEventListener('DOMContentLoaded', () => {
  window.customizationPanel = new CustomizationPanel();
});

export { CustomizationPanel };

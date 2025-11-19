/**
 * Chart Customization Service
 * Provides color picker, font controls, legend positioning, and other customization options
 */

class ChartCustomizationService {
  constructor() {
    this.colorPresets = new Map();
    this.fontPresets = new Map();
    this.currentCustomization = null;
    this.init();
  }

  init() {
    this.setupColorPresets();
    this.setupFontPresets();
    this.setupCustomizationStyles();
  }

  /**
   * Setup color presets
   */
  setupColorPresets() {
    // Default color schemes
    this.colorPresets.set('default', {
      name: 'Default Blue',
      colors: ['#3B82F6', '#8B5CF6', '#06D6A0', '#60A5FA', '#A78BFA', '#34D399', '#93C5FD', '#C4B5FD'],
      category: 'professional'
    });

    this.colorPresets.set('vibrant', {
      name: 'Vibrant',
      colors: ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'],
      category: 'colorful'
    });

    this.colorPresets.set('pastel', {
      name: 'Pastel',
      colors: ['#FCA5A5', '#FCD34D', '#86EFAC', '#93C5FD', '#DDD6FE', '#F9A8D4', '#67E8F9', '#FDBA74'],
      category: 'soft'
    });

    this.colorPresets.set('monochrome', {
      name: 'Monochrome',
      colors: ['#1F2937', '#374151', '#4B5563', '#6B7280', '#9CA3AF', '#D1D5DB', '#E5E7EB', '#F3F4F6'],
      category: 'professional'
    });

    this.colorPresets.set('nature', {
      name: 'Nature',
      colors: ['#059669', '#10B981', '#34D399', '#6EE7B7', '#84CC16', '#BEF264', '#FDE047', '#FACC15'],
      category: 'organic'
    });

    this.colorPresets.set('sunset', {
      name: 'Sunset',
      colors: ['#DC2626', '#EA580C', '#F97316', '#FB923C', '#FBBF24', '#FDE047', '#FEF3C7', '#FFEDD5'],
      category: 'warm'
    });

    this.colorPresets.set('ocean', {
      name: 'Ocean',
      colors: ['#075985', '#0284C7', '#0EA5E9', '#38BDF8', '#7DD3FC', '#BAE6FD', '#E0F2FE', '#F0F9FF'],
      category: 'cool'
    });

    this.colorPresets.set('corporate', {
      name: 'Corporate',
      colors: ['#1E40AF', '#2563EB', '#3B82F6', '#60A5FA', '#6B7280', '#9CA3AF', '#D1D5DB', '#F3F4F6'],
      category: 'professional'
    });
  }

  /**
   * Setup font presets
   */
  setupFontPresets() {
    this.fontPresets.set('modern', {
      name: 'Modern',
      family: 'Inter, system-ui, sans-serif',
      sizes: {
        title: 16,
        subtitle: 14,
        body: 12,
        legend: 11,
        axis: 10
      },
      weights: {
        title: '600',
        subtitle: '500',
        body: '400',
        legend: '400',
        axis: '400'
      }
    });

    this.fontPresets.set('classic', {
      name: 'Classic',
      family: 'Georgia, serif',
      sizes: {
        title: 18,
        subtitle: 14,
        body: 12,
        legend: 11,
        axis: 10
      },
      weights: {
        title: '700',
        subtitle: '600',
        body: '400',
        legend: '400',
        axis: '400'
      }
    });

    this.fontPresets.set('minimal', {
      name: 'Minimal',
      family: 'SF Pro Display, -apple-system, sans-serif',
      sizes: {
        title: 14,
        subtitle: 12,
        body: 10,
        legend: 9,
        axis: 9
      },
      weights: {
        title: '500',
        subtitle: '400',
        body: '300',
        legend: '300',
        axis: '300'
      }
    });

    this.fontPresets.set('bold', {
      name: 'Bold',
      family: 'Inter, system-ui, sans-serif',
      sizes: {
        title: 20,
        subtitle: 16,
        body: 14,
        legend: 12,
        axis: 11
      },
      weights: {
        title: '700',
        subtitle: '600',
        body: '500',
        legend: '500',
        axis: '500'
      }
    });
  }

  /**
   * Setup customization styles
   */
  setupCustomizationStyles() {
    if (document.getElementById('customization-styles')) return;

    const styles = document.createElement('style');
    styles.id = 'customization-styles';
    styles.textContent = `
      /* Customization Panel */
      .customization-panel {
        background: var(--color-surface);
        border-radius: 12px;
        box-shadow: var(--shadow-lg);
        border: 1px solid var(--color-border);
        overflow: hidden;
      }

      .customization-header {
        background: var(--color-primary-600);
        color: var(--color-text-inverse);
        padding: 16px 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .customization-title {
        font-size: 16px;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .customization-close {
        background: rgba(255, 255, 255, 0.2);
        border: none;
        color: var(--color-text-inverse);
        width: 28px;
        height: 28px;
        border-radius: 6px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.2s ease;
      }

      .customization-close:hover {
        background: rgba(255, 255, 255, 0.35);
      }

      /* Customization Tabs */
      .customization-tabs {
        display: flex;
        background: var(--color-surface);
        border-bottom: 1px solid var(--color-border);
      }

      .customization-tab {
        flex: 1;
        padding: 12px 16px;
        background: none;
        border: none;
        color: var(--color-text-secondary);
        font-size: 13px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        border-bottom: 2px solid transparent;
      }

      .customization-tab:hover {
        color: var(--color-text-primary);
        background: var(--color-state-hover);
      }

      .customization-tab.active {
        color: var(--color-primary-600);
        border-bottom-color: var(--color-primary-600);
        background: var(--color-surface);
      }

      /* Customization Content */
      .customization-content {
        padding: 20px;
        max-height: 400px;
        overflow-y: auto;
      }

      .customization-section {
        margin-bottom: 24px;
      }

      .customization-section:last-child {
        margin-bottom: 0;
      }

      .customization-section-title {
        font-size: 14px;
        font-weight: 600;
        color: var(--color-text-primary);
        margin-bottom: 12px;
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .customization-section-description {
        font-size: 12px;
        color: var(--color-text-secondary);
        margin-bottom: 16px;
      }

      /* Color Picker */
      .color-picker-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(40px, 1fr));
        gap: 8px;
        margin-bottom: 16px;
      }

      .color-preset {
        width: 40px;
        height: 40px;
        border-radius: 8px;
        cursor: pointer;
        border: 2px solid transparent;
        transition: all 0.2s ease;
        position: relative;
        overflow: hidden;
      }

      .color-preset:hover {
        transform: scale(1.05);
        box-shadow: var(--shadow-sm);
      }

      .color-preset.selected {
        border-color: var(--color-primary-500);
        box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary-500) 20%, transparent);
      }

      .color-preset.selected::after {
        content: '✓';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: var(--color-text-inverse);
        font-size: 16px;
        font-weight: bold;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.35);
      }

      /* Custom Color Input */
      .custom-color-input {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 8px 12px;
        border: 1px solid var(--color-border);
        border-radius: 8px;
        background: var(--color-state-hover);
      }

      .custom-color-preview {
        width: 32px;
        height: 32px;
        border-radius: 6px;
        border: 1px solid var(--color-border);
      }

      .custom-color-text {
        flex: 1;
        padding: 6px 8px;
        border: 1px solid var(--color-border);
        border-radius: 4px;
        font-size: 12px;
        font-family: monospace;
        color: var(--color-text-primary);
        background: var(--color-surface);
      }

      /* Font Controls */
      .font-selector {
        display: grid;
        gap: 12px;
      }

      .font-preset {
        padding: 12px;
        border: 2px solid var(--color-border);
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s ease;
        background: var(--color-surface);
      }

      .font-preset:hover {
        border-color: var(--color-border-strong);
        background: var(--color-state-hover);
      }

      .font-preset.selected {
        border-color: var(--color-primary-500);
        background: var(--color-primary-50);
      }

      .font-preset-name {
        font-weight: 600;
        color: var(--color-text-primary);
        margin-bottom: 4px;
        font-size: 13px;
      }

      .font-preset-preview {
        font-size: 11px;
        color: var(--color-text-secondary);
        margin-bottom: 8px;
      }

      .font-preset-sample {
        padding: 8px;
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: 4px;
        font-size: 12px;
      }

      /* Size Controls */
      .size-control {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 12px;
      }

      .size-control-label {
        font-size: 12px;
        color: var(--color-text-secondary);
        min-width: 80px;
      }

      .size-slider {
        flex: 1;
        height: 4px;
        background: var(--color-border);
        border-radius: 2px;
        position: relative;
        cursor: pointer;
      }

      .size-slider-fill {
        height: 100%;
        background: var(--color-primary-500);
        border-radius: 2px;
        transition: width 0.2s ease;
      }

      .size-slider-thumb {
        position: absolute;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 16px;
        height: 16px;
        background: var(--color-surface);
        border: 2px solid var(--color-primary-500);
        border-radius: 50%;
        cursor: grab;
        box-shadow: var(--shadow-sm);
      }

      .size-slider-thumb:active {
        cursor: grabbing;
        box-shadow: var(--shadow-md);
      }

      .size-value {
        min-width: 40px;
        text-align: center;
        font-size: 12px;
        color: var(--color-text-secondary);
        font-weight: 500;
      }

      /* Legend Position */
      .legend-position-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 8px;
      }

      .legend-position-option {
        padding: 12px 8px;
        border: 2px solid var(--color-border);
        border-radius: 8px;
        cursor: pointer;
        text-align: center;
        transition: all 0.2s ease;
        font-size: 12px;
        color: var(--color-text-secondary);
        background: var(--color-surface);
      }

      .legend-position-option:hover {
        border-color: var(--color-border-strong);
        background: var(--color-state-hover);
      }

      .legend-position-option.selected {
        border-color: var(--color-primary-500);
        background: var(--color-primary-50);
        color: var(--color-primary-600);
      }

      /* Toggle Controls */
      .toggle-control {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 0;
        border-bottom: 1px solid var(--color-border-light);
      }

      .toggle-control:last-child {
        border-bottom: none;
      }

      .toggle-label {
        font-size: 13px;
        color: var(--color-text-secondary);
      }

      .toggle-switch {
        position: relative;
        width: 44px;
        height: 24px;
        background: var(--color-border);
        border-radius: 12px;
        cursor: pointer;
        transition: background 0.2s ease;
      }

      .toggle-switch.active {
        background: var(--color-primary-500);
      }

      .toggle-switch-thumb {
        position: absolute;
        top: 2px;
        left: 2px;
        width: 20px;
        height: 20px;
        background: var(--color-surface);
        border-radius: 50%;
        transition: transform 0.2s ease;
        box-shadow: var(--shadow-sm);
      }

      .toggle-switch.active .toggle-switch-thumb {
        transform: translateX(20px);
      }

      /* Action Buttons */
      .customization-actions {
        display: flex;
        gap: 12px;
        padding: 16px 20px;
        background: var(--color-surface);
        border-top: 1px solid var(--color-border);
      }

      .customization-button {
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

      .customization-button.primary {
        background: var(--color-primary);
        color: var(--color-text-inverse);
      }

      .customization-button.primary:hover {
        background: var(--color-primary-700);
      }

      .customization-button.secondary {
        background: var(--color-surface);
        color: var(--color-text-secondary);
        border: 1px solid var(--color-border);
      }

      .customization-button.secondary:hover {
        background: var(--color-state-hover);
      }

      /* Mobile Optimizations */
      @media (max-width: 768px) {
        .customization-panel {
          margin: 8px;
        }
        
        .customization-content {
          padding: 16px;
          max-height: 300px;
        }
        
        .color-picker-grid {
          grid-template-columns: repeat(auto-fill, minmax(32px, 1fr));
        }
        
        .color-preset {
          width: 32px;
          height: 32px;
        }
        
        .legend-position-grid {
          grid-template-columns: repeat(2, 1fr);
        }
      }
    `;
    document.head.appendChild(styles);
  }

  /**
   * Create customization panel
   */
  createCustomizationPanel(containerId, options = {}) {
    const {
      chartInstance = null,
      onCustomizationChange = null,
      showColors = true,
      showFonts = true,
      showLegend = true,
      showAdvanced = true
    } = options;

    const container = document.getElementById(containerId);
    if (!container) return null;

    const panelHTML = this.generateCustomizationPanelHTML(options);
    container.innerHTML = panelHTML;

    // Setup event handlers
    this.setupCustomizationEvents(containerId, options);

    // Store current customization
    this.currentCustomization = {
      chartInstance,
      onCustomizationChange,
      containerId
    };

    return containerId;
  }

  /**
   * Generate customization panel HTML
   */
  generateCustomizationPanelHTML(options) {
    const tabs = [];
    if (options.showColors) tabs.push('colors');
    if (options.showFonts) tabs.push('fonts');
    if (options.showLegend) tabs.push('legend');
    if (options.showAdvanced) tabs.push('advanced');

    return `
      <div class="customization-panel">
        <div class="customization-header">
          <div class="customization-title">
            <i class="fas fa-palette"></i>
            Customize Chart
          </div>
          <button class="customization-close" onclick="chartCustomization.closePanel()">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="customization-tabs">
          ${tabs.map((tab, index) => `
            <button class="customization-tab ${index === 0 ? 'active' : ''}" 
                    data-tab="${tab}" onclick="chartCustomization.switchTab('${tab}')">
              ${tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          `).join('')}
        </div>

        <div class="customization-content">
          ${options.showColors ? this.generateColorsTabHTML() : ''}
          ${options.showFonts ? this.generateFontsTabHTML() : ''}
          ${options.showLegend ? this.generateLegendTabHTML() : ''}
          ${options.showAdvanced ? this.generateAdvancedTabHTML() : ''}
        </div>

        <div class="customization-actions">
          <button class="customization-button secondary" onclick="chartCustomization.resetCustomization()">
            <i class="fas fa-undo"></i>
            Reset
          </button>
          <button class="customization-button primary" onclick="chartCustomization.applyCustomization()">
            <i class="fas fa-check"></i>
            Apply
          </button>
        </div>
      </div>
    `;
  }

  /**
   * Generate colors tab HTML
   */
  generateColorsTabHTML() {
    return `
      <div class="customization-tab-content" data-tab="colors">
        <div class="customization-section">
          <div class="customization-section-title">
            <i class="fas fa-swatchbook"></i>
            Color Presets
          </div>
          <div class="customization-section-description">
            Choose from predefined color schemes or create your own
          </div>
          
          <div class="color-picker-grid">
            ${Array.from(this.colorPresets.entries()).map(([key, preset]) => `
              <div class="color-preset" 
                   data-preset="${key}"
                   style="background: linear-gradient(135deg, ${preset.colors.slice(0, 4).join(', ')})"
                   onclick="chartCustomization.selectColorPreset('${key}')"
                   title="${preset.name}">
              </div>
            `).join('')}
          </div>
        </div>

        <div class="customization-section">
          <div class="customization-section-title">
            <i class="fas fa-eye-dropper"></i>
            Custom Colors
          </div>
          
          <div id="custom-colors-container">
            <div class="custom-color-input">
              <div class="custom-color-preview" style="background: #3B82F6;"></div>
              <input type="text" class="custom-color-text" value="#3B82F6" placeholder="#000000">
              <button class="text-xs text-blue-600 hover:text-blue-700" onclick="chartCustomization.addCustomColor()">
                <i class="fas fa-plus"></i>
              </button>
            </div>
          </div>
        </div>

        <div class="customization-section">
          <div class="customization-section-title">
            <i class="fas fa-adjust"></i>
            Color Settings
          </div>
          
          <div class="toggle-control">
            <span class="toggle-label">Use gradient fills</span>
            <div class="toggle-switch" onclick="chartCustomization.toggleSwitch(this)">
              <div class="toggle-switch-thumb"></div>
            </div>
          </div>
          
          <div class="toggle-control">
            <span class="toggle-label">Transparent backgrounds</span>
            <div class="toggle-switch" onclick="chartCustomization.toggleSwitch(this)">
              <div class="toggle-switch-thumb"></div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Generate fonts tab HTML
   */
  generateFontsTabHTML() {
    return `
      <div class="customization-tab-content" data-tab="fonts" style="display: none;">
        <div class="customization-section">
          <div class="customization-section-title">
            <i class="fas fa-font"></i>
            Font Presets
          </div>
          <div class="customization-section-description">
            Choose a font style for your chart
          </div>
          
          <div class="font-selector">
            ${Array.from(this.fontPresets.entries()).map(([key, preset]) => `
              <div class="font-preset" data-preset="${key}" onclick="chartCustomization.selectFontPreset('${key}')">
                <div class="font-preset-name">${preset.name}</div>
                <div class="font-preset-preview">${preset.family}</div>
                <div class="font-preset-sample" style="font-family: ${preset.family};">
                  Sample Text AaBb123
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="customization-section">
          <div class="customization-section-title">
            <i class="fas fa-text-height"></i>
            Font Sizes
          </div>
          
          <div class="size-control">
            <span class="size-control-label">Title</span>
            <div class="size-slider" onclick="chartCustomization.adjustSize(event, 'title')">
              <div class="size-slider-fill" style="width: 50%;"></div>
              <div class="size-slider-thumb" style="left: 50%;"></div>
            </div>
            <span class="size-value">16px</span>
          </div>
          
          <div class="size-control">
            <span class="size-control-label">Subtitle</span>
            <div class="size-slider" onclick="chartCustomization.adjustSize(event, 'subtitle')">
              <div class="size-slider-fill" style="width: 40%;"></div>
              <div class="size-slider-thumb" style="left: 40%;"></div>
            </div>
            <span class="size-value">14px</span>
          </div>
          
          <div class="size-control">
            <span class="size-control-label">Body</span>
            <div class="size-slider" onclick="chartCustomization.adjustSize(event, 'body')">
              <div class="size-slider-fill" style="width: 30%;"></div>
              <div class="size-slider-thumb" style="left: 30%;"></div>
            </div>
            <span class="size-value">12px</span>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Generate legend tab HTML
   */
  generateLegendTabHTML() {
    return `
      <div class="customization-tab-content" data-tab="legend" style="display: none;">
        <div class="customization-section">
          <div class="customization-section-title">
            <i class="fas fa-list"></i>
            Legend Position
          </div>
          <div class="customization-section-description">
            Choose where to display the legend
          </div>
          
          <div class="legend-position-grid">
            <div class="legend-position-option" data-position="top" onclick="chartCustomization.selectLegendPosition('top')">
              <i class="fas fa-arrow-up"></i><br>Top
            </div>
            <div class="legend-position-option" data-position="bottom" onclick="chartCustomization.selectLegendPosition('bottom')">
              <i class="fas fa-arrow-down"></i><br>Bottom
            </div>
            <div class="legend-position-option" data-position="left" onclick="chartCustomization.selectLegendPosition('left')">
              <i class="fas fa-arrow-left"></i><br>Left
            </div>
            <div class="legend-position-option" data-position="right" onclick="chartCustomization.selectLegendPosition('right')">
              <i class="fas fa-arrow-right"></i><br>Right
            </div>
            <div class="legend-position-option" data-position="hidden" onclick="chartCustomization.selectLegendPosition('hidden')">
              <i class="fas fa-eye-slash"></i><br>Hidden
            </div>
          </div>
        </div>

        <div class="customization-section">
          <div class="customization-section-title">
            <i class="fas fa-cog"></i>
            Legend Options
          </div>
          
          <div class="toggle-control">
            <span class="toggle-label">Show legend</span>
            <div class="toggle-switch active" onclick="chartCustomization.toggleSwitch(this)">
              <div class="toggle-switch-thumb"></div>
            </div>
          </div>
          
          <div class="toggle-control">
            <span class="toggle-label">Reverse order</span>
            <div class="toggle-switch" onclick="chartCustomization.toggleSwitch(this)">
              <div class="toggle-switch-thumb"></div>
            </div>
          </div>
          
          <div class="toggle-control">
            <span class="toggle-label">Show tooltips</span>
            <div class="toggle-switch active" onclick="chartCustomization.toggleSwitch(this)">
              <div class="toggle-switch-thumb"></div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Generate advanced tab HTML
   */
  generateAdvancedTabHTML() {
    return `
      <div class="customization-tab-content" data-tab="advanced" style="display: none;">
        <div class="customization-section">
          <div class="customization-section-title">
            <i class="fas fa-chart-line"></i>
            Chart Options
          </div>
          
          <div class="toggle-control">
            <span class="toggle-label">Show grid lines</span>
            <div class="toggle-switch active" onclick="chartCustomization.toggleSwitch(this)">
              <div class="toggle-switch-thumb"></div>
            </div>
          </div>
          
          <div class="toggle-control">
            <span class="toggle-label">Show data labels</span>
            <div class="toggle-switch" onclick="chartCustomization.toggleSwitch(this)">
              <div class="toggle-switch-thumb"></div>
            </div>
          </div>
          
          <div class="toggle-control">
            <span class="toggle-label">Enable animations</span>
            <div class="toggle-switch active" onclick="chartCustomization.toggleSwitch(this)">
              <div class="toggle-switch-thumb"></div>
            </div>
          </div>
          
          <div class="toggle-control">
            <span class="toggle-label">Responsive design</span>
            <div class="toggle-switch active" onclick="chartCustomization.toggleSwitch(this)">
              <div class="toggle-switch-thumb"></div>
            </div>
          </div>
        </div>

        <div class="customization-section">
          <div class="customization-section-title">
            <i class="fas fa-magic"></i>
            Animation Settings
          </div>
          
          <div class="size-control">
            <span class="size-control-label">Duration</span>
            <div class="size-slider" onclick="chartCustomization.adjustSize(event, 'animation')">
              <div class="size-slider-fill" style="width: 50%;"></div>
              <div class="size-slider-thumb" style="left: 50%;"></div>
            </div>
            <span class="size-value">1000ms</span>
          </div>
          
          <div class="toggle-control">
            <span class="toggle-label">Easing</span>
            <select class="px-3 py-1 border rounded text-sm">
              <option value="linear">Linear</option>
              <option value="easeInQuad">Ease In</option>
              <option value="easeOutQuad">Ease Out</option>
              <option value="easeInOutQuad" selected>Ease In Out</option>
              <option value="easeInCubic">Ease In Cubic</option>
              <option value="easeOutCubic">Ease Out Cubic</option>
            </select>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Setup customization events
   */
  setupCustomizationEvents(containerId, options) {
    // Initialize first tab as active
    const firstTab = document.querySelector('.customization-tab');
    if (firstTab) {
      this.switchTab(firstTab.dataset.tab);
    }
  }

  /**
   * Switch between tabs
   */
  switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.customization-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.tab === tabName);
    });

    // Update tab content
    document.querySelectorAll('.customization-tab-content').forEach(content => {
      content.style.display = content.dataset.tab === tabName ? 'block' : 'none';
    });
  }

  /**
   * Select color preset
   */
  selectColorPreset(presetKey) {
    const preset = this.colorPresets.get(presetKey);
    if (!preset) return;

    // Update UI
    document.querySelectorAll('.color-preset').forEach(el => {
      el.classList.toggle('selected', el.dataset.preset === presetKey);
    });

    // Store selection
    this.selectedColors = preset.colors;
    this.selectedColorPreset = presetKey;

    // Preview colors
    this.previewColorChanges();
  }

  /**
   * Select font preset
   */
  selectFontPreset(presetKey) {
    const preset = this.fontPresets.get(presetKey);
    if (!preset) return;

    // Update UI
    document.querySelectorAll('.font-preset').forEach(el => {
      el.classList.toggle('selected', el.dataset.preset === presetKey);
    });

    // Store selection
    this.selectedFont = preset;
    this.selectedFontPreset = presetKey;

    // Preview font changes
    this.previewFontChanges();
  }

  /**
   * Select legend position
   */
  selectLegendPosition(position) {
    // Update UI
    document.querySelectorAll('.legend-position-option').forEach(el => {
      el.classList.toggle('selected', el.dataset.position === position);
    });

    // Store selection
    this.selectedLegendPosition = position;

    // Preview legend changes
    this.previewLegendChanges();
  }

  /**
   * Toggle switch
   */
  toggleSwitch(element) {
    element.classList.toggle('active');
  }

  /**
   * Adjust size slider
   */
  adjustSize(event, type) {
    const slider = event.currentTarget;
    const rect = slider.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(100, ((event.clientX - rect.left) / rect.width) * 100));
    
    // Update UI
    const fill = slider.querySelector('.size-slider-fill');
    const thumb = slider.querySelector('.size-slider-thumb');
    const value = slider.nextElementSibling;
    
    fill.style.width = percentage + '%';
    thumb.style.left = percentage + '%';
    
    // Calculate actual value
    let actualValue;
    switch (type) {
      case 'title':
        actualValue = Math.round(12 + (percentage / 100) * 12);
        break;
      case 'subtitle':
        actualValue = Math.round(10 + (percentage / 100) * 10);
        break;
      case 'body':
        actualValue = Math.round(8 + (percentage / 100) * 8);
        break;
      case 'animation':
        actualValue = Math.round(percentage * 20);
        break;
    }
    
    value.textContent = actualValue + (type === 'animation' ? 'ms' : 'px');
    
    // Store and preview
    if (!this.sizeSettings) this.sizeSettings = {};
    this.sizeSettings[type] = actualValue;
    
    this.previewSizeChanges();
  }

  /**
   * Preview color changes
   */
  previewColorChanges() {
    if (!this.currentCustomization?.chartInstance || !this.selectedColors) return;

    const chart = this.currentCustomization.chartInstance;
    
    // Update dataset colors
    chart.data.datasets.forEach((dataset, index) => {
      if (this.selectedColors[index]) {
        dataset.backgroundColor = this.selectedColors[index];
        dataset.borderColor = this.selectedColors[index];
      }
    });
    
    chart.update('none');
  }

  /**
   * Preview font changes
   */
  previewFontChanges() {
    if (!this.currentCustomization?.chartInstance || !this.selectedFont) return;

    const chart = this.currentCustomization.chartInstance;
    const font = this.selectedFont;
    
    // Update font settings
    if (chart.options.plugins.title) {
      chart.options.plugins.title.font = {
        family: font.family,
        size: font.sizes.title,
        weight: font.weights.title
      };
    }
    
    if (chart.options.plugins.legend) {
      chart.options.plugins.legend.labels = {
        font: {
          family: font.family,
          size: font.sizes.legend,
          weight: font.weights.legend
        }
      };
    }
    
    chart.update('none');
  }

  /**
   * Preview legend changes
   */
  previewLegendChanges() {
    if (!this.currentCustomization?.chartInstance) return;

    const chart = this.currentCustomization.chartInstance;
    
    if (chart.options.plugins.legend) {
      if (this.selectedLegendPosition === 'hidden') {
        chart.options.plugins.legend.display = false;
      } else {
        chart.options.plugins.legend.display = true;
        chart.options.plugins.legend.position = this.selectedLegendPosition;
      }
    }
    
    chart.update('none');
  }

  /**
   * Preview size changes
   */
  previewSizeChanges() {
    if (!this.currentCustomization?.chartInstance || !this.sizeSettings) return;

    const chart = this.currentCustomization.chartInstance;
    
    // Update sizes based on settings
    if (this.sizeSettings.title && chart.options.plugins.title) {
      chart.options.plugins.title.font.size = this.sizeSettings.title;
    }
    
    if (this.sizeSettings.animation) {
      chart.options.animation.duration = this.sizeSettings.animation;
    }
    
    chart.update('none');
  }

  /**
   * Apply customization
   */
  applyCustomization() {
    if (!this.currentCustomization?.onCustomizationChange) return;

    const customization = {
      colors: this.selectedColors,
      colorPreset: this.selectedColorPreset,
      font: this.selectedFont,
      fontPreset: this.selectedFontPreset,
      legendPosition: this.selectedLegendPosition,
      sizeSettings: this.sizeSettings
    };

    // Call the callback
    this.currentCustomization.onCustomizationChange(customization);

    // Show success feedback
    if (window.feedbackSystem) {
      window.feedbackSystem.showSuccess(
        'Customization Applied',
        'Your chart customization has been applied'
      );
    }
  }

  /**
   * Reset customization
   */
  resetCustomization() {
    // Reset UI selections
    document.querySelectorAll('.color-preset.selected').forEach(el => {
      el.classList.remove('selected');
    });
    
    document.querySelectorAll('.font-preset.selected').forEach(el => {
      el.classList.remove('selected');
    });
    
    document.querySelectorAll('.legend-position-option.selected').forEach(el => {
      el.classList.remove('selected');
    });
    
    // Reset stored values
    this.selectedColors = null;
    this.selectedColorPreset = null;
    this.selectedFont = null;
    this.selectedFontPreset = null;
    this.selectedLegendPosition = null;
    this.sizeSettings = null;

    // Show feedback
    if (window.feedbackSystem) {
      window.feedbackSystem.showInfo(
        'Customization Reset',
        'All customization settings have been reset'
      );
    }
  }

  /**
   * Close customization panel
   */
  closePanel() {
    const panel = document.querySelector('.customization-panel');
    if (panel) {
      panel.remove();
    }
  }

  /**
   * Get current customization state
   */
  getCurrentCustomization() {
    return {
      colors: this.selectedColors,
      colorPreset: this.selectedColorPreset,
      font: this.selectedFont,
      fontPreset: this.selectedFontPreset,
      legendPosition: this.selectedLegendPosition,
      sizeSettings: this.sizeSettings
    };
  }

  /**
   * Apply customization to chart configuration
   */
  applyToChartConfig(config, customization) {
    if (!customization) return config;

    const newConfig = JSON.parse(JSON.stringify(config));

    // Apply colors
    if (customization.colors && newConfig.data.datasets) {
      newConfig.data.datasets.forEach((dataset, index) => {
        if (customization.colors[index]) {
          dataset.backgroundColor = customization.colors[index];
          dataset.borderColor = customization.colors[index];
        }
      });
    }

    // Apply fonts
    if (customization.font) {
      if (newConfig.options.plugins.title) {
        newConfig.options.plugins.title.font = {
          family: customization.font.family,
          size: customization.font.sizes.title,
          weight: customization.font.weights.title
        };
      }
      
      if (newConfig.options.plugins.legend) {
        newConfig.options.plugins.legend.labels = {
          font: {
            family: customization.font.family,
            size: customization.font.sizes.legend,
            weight: customization.font.weights.legend
          }
        };
      }
    }

    // Apply legend position
    if (customization.legendPosition) {
      if (customization.legendPosition === 'hidden') {
        newConfig.options.plugins.legend.display = false;
      } else {
        newConfig.options.plugins.legend.display = true;
        newConfig.options.plugins.legend.position = customization.legendPosition;
      }
    }

    // Apply size settings
    if (customization.sizeSettings) {
      if (customization.sizeSettings.title && newConfig.options.plugins.title) {
        newConfig.options.plugins.title.font.size = customization.sizeSettings.title;
      }
      
      if (customization.sizeSettings.animation) {
        newConfig.options.animation.duration = customization.sizeSettings.animation;
      }
    }

    return newConfig;
  }

  /**
   * Get available color presets
   */
  getColorPresets() {
    return Array.from(this.colorPresets.values());
  }

  /**
   * Get available font presets
   */
  getFontPresets() {
    return Array.from(this.fontPresets.values());
  }
}

// Export singleton instance
export const chartCustomization = new ChartCustomizationService();

// Make available globally
window.chartCustomization = chartCustomization;

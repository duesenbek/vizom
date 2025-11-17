// Theme Manager - Dark Mode and Theme Options
class ThemeManager {
  constructor() {
    this.currentTheme = 'light';
    this.themes = new Map();
    this.customThemes = new Map();
    this.systemPreference = null;
    this.themeTransition = null;
    
    this.init();
  }

  init() {
    this.loadDefaultThemes();
    this.loadCustomThemes();
    this.detectSystemPreference();
    this.loadSavedTheme();
    this.createThemeSelector();
    this.setupEventListeners();
    this.setupThemeTransitions();
    this.setupKeyboardShortcuts();
  }

  // Load default themes
  loadDefaultThemes() {
    // Light Theme
    this.themes.set('light', {
      name: 'Light',
      displayName: 'Light Mode',
            icon: 'fa-sun',
      colors: {
        primary: '#0066FF',
        primaryHover: '#0052CC',
        primaryLight: 'rgba(0, 102, 255, 0.1)',
        secondary: '#6C757D',
        success: '#00C853',
        warning: '#FF9500',
        error: '#FF3B30',
        info: '#007AFF',
        
        background: '#FFFFFF',
        surface: '#F8F9FA',
        surfaceDark: '#E9ECEF',
        
        textPrimary: '#212529',
        textSecondary: '#6C757D',
        textMuted: '#ADB5BD',
        
        border: '#DEE2E6',
        borderLight: '#E9ECEF',
        borderDark: '#ADB5BD',
        
        shadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        shadowMd: '0 4px 6px rgba(0, 0, 0, 0.1)',
        shadowLg: '0 10px 15px rgba(0, 0, 0, 0.1)'
      },
      gradients: {
        primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        success: 'linear-gradient(135deg, #56ab2f 0%, #a8e063 100%)',
        warning: 'linear-gradient(135deg, #f2994a 0%, #f2c94c 100%)',
        error: 'linear-gradient(135deg, #eb3349 0%, #f45c43 100%)'
      },
      chartColors: [
        '#0066FF', '#00C853', '#FF9500', '#FF3B30', '#007AFF',
        '#5856D6', '#AF52DE', '#FF2D92', '#FF3B30', '#FF9500'
      ]
    });

    // Dark Theme
    this.themes.set('dark', {
      name: 'Dark',
      displayName: 'Dark Mode',
            icon: 'fa-moon',
      colors: {
        primary: '#0A84FF',
        primaryHover: '#409CFF',
        primaryLight: 'rgba(10, 132, 255, 0.15)',
        secondary: '#98989D',
        success: '#30D158',
        warning: '#FF9F0A',
        error: '#FF453A',
        info: '#0A84FF',
        
        background: '#000000',
        surface: '#1C1C1E',
        surfaceDark: '#2C2C2E',
        
        textPrimary: '#FFFFFF',
        textSecondary: '#EBEBF5',
        textMuted: '#98989D',
        
        border: '#38383A',
        borderLight: '#48484A',
        borderDark: '#636366',
        
        shadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
        shadowMd: '0 4px 6px rgba(0, 0, 0, 0.4)',
        shadowLg: '0 10px 15px rgba(0, 0, 0, 0.5)'
      },
      gradients: {
        primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        success: 'linear-gradient(135deg, #56ab2f 0%, #a8e063 100%)',
        warning: 'linear-gradient(135deg, #f2994a 0%, #f2c94c 100%)',
        error: 'linear-gradient(135deg, #eb3349 0%, #f45c43 100%)'
      },
      chartColors: [
        '#0A84FF', '#30D158', '#FF9F0A', '#FF453A', '#64D2FF',
        '#5E5CE6', '#BF5AF2', '#FF2D92', '#FF453A', '#FF9F0A'
      ]
    });

    // High Contrast Theme
    this.themes.set('high-contrast', {
      name: 'High Contrast',
      displayName: 'High Contrast',
            icon: 'fa-bolt',
      colors: {
        primary: '#0000FF',
        primaryHover: '#0000CC',
        primaryLight: 'rgba(0, 0, 255, 0.1)',
        secondary: '#666666',
        success: '#008000',
        warning: '#FF8C00',
        error: '#FF0000',
        info: '#0000FF',
        
        background: '#FFFFFF',
        surface: '#F0F0F0',
        surfaceDark: '#E0E0E0',
        
        textPrimary: '#000000',
        textSecondary: '#333333',
        textMuted: '#666666',
        
        border: '#000000',
        borderLight: '#333333',
        borderDark: '#000000',
        
        shadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
        shadowMd: '0 4px 6px rgba(0, 0, 0, 0.6)',
        shadowLg: '0 10px 15px rgba(0, 0, 0, 0.7)'
      },
      gradients: {
        primary: 'linear-gradient(135deg, #0000FF 0%, #000080 100%)',
        success: 'linear-gradient(135deg, #008000 0%, #00FF00 100%)',
        warning: 'linear-gradient(135deg, #FF8C00 0%, #FFD700 100%)',
        error: 'linear-gradient(135deg, #FF0000 0%, #8B0000 100%)'
      },
      chartColors: [
        '#0000FF', '#008000', '#FF8C00', '#FF0000', '#000080',
        '#800080', '#008080', '#FF00FF', '#FF0000', '#FF8C00'
      ]
    });

    // Sepia Theme (for reduced eye strain)
    this.themes.set('sepia', {
      name: 'Sepia',
      displayName: 'Sepia Mode',
            icon: 'fa-book-open',
      colors: {
        primary: '#8B4513',
        primaryHover: '#654321',
        primaryLight: 'rgba(139, 69, 19, 0.1)',
        secondary: '#8B7355',
        success: '#6B8E23',
        warning: '#DAA520',
        error: '#CD5C5C',
        info: '#4682B4',
        
        background: '#FDF5E6',
        surface: '#F5E6D3',
        surfaceDark: '#E6D7C3',
        
        textPrimary: '#3E2723',
        textSecondary: '#5D4037',
        textMuted: '#8D6E63',
        
        border: '#D7CCC8',
        borderLight: '#EFEBE9',
        borderDark: '#BCAAA4',
        
        shadow: '0 2px 4px rgba(139, 69, 19, 0.1)',
        shadowMd: '0 4px 6px rgba(139, 69, 19, 0.15)',
        shadowLg: '0 10px 15px rgba(139, 69, 19, 0.2)'
      },
      gradients: {
        primary: 'linear-gradient(135deg, #8B4513 0%, #D2691E 100%)',
        success: 'linear-gradient(135deg, #6B8E23 0%, #9ACD32 100%)',
        warning: 'linear-gradient(135deg, #DAA520 0%, #FFD700 100%)',
        error: 'linear-gradient(135deg, #CD5C5C 0%, #F08080 100%)'
      },
      chartColors: [
        '#8B4513', '#6B8E23', '#DAA520', '#CD5C5C', '#4682B4',
        '#8B7355', '#A0522D', '#DEB887', '#D2691E', '#BC8F8F'
      ]
    });

    // Ocean Theme
    this.themes.set('ocean', {
      name: 'Ocean',
      displayName: 'Ocean Blue',
            icon: 'fa-water',
      colors: {
        primary: '#006994',
        primaryHover: '#004d6f',
        primaryLight: 'rgba(0, 105, 148, 0.1)',
        secondary: '#546E7A',
        success: '#00897B',
        warning: '#FFA726',
        error: '#EF5350',
        info: '#29B6F6',
        
        background: '#E0F7FA',
        surface: '#B2EBF2',
        surfaceDark: '#80DEEA',
        
        textPrimary: '#004D40',
        textSecondary: '#00695C',
        textMuted: '#607D8B',
        
        border: '#4DD0E1',
        borderLight: '#B2EBF2',
        borderDark: '#26C6DA',
        
        shadow: '0 2px 4px rgba(0, 105, 148, 0.1)',
        shadowMd: '0 4px 6px rgba(0, 105, 148, 0.15)',
        shadowLg: '0 10px 15px rgba(0, 105, 148, 0.2)'
      },
      gradients: {
        primary: 'linear-gradient(135deg, #006994 0%, #00ACC1 100%)',
        success: 'linear-gradient(135deg, #00897B 0%, #26A69A 100%)',
        warning: 'linear-gradient(135deg, #FFA726 0%, #FFB74D 100%)',
        error: 'linear-gradient(135deg, #EF5350 0%, #E57373 100%)'
      },
      chartColors: [
        '#006994', '#00897B', '#FFA726', '#EF5350', '#29B6F6',
        '#546E7A', '#26C6DA', '#00ACC1', '#00BCD4', '#009688'
      ]
    });
  }

  // Load custom themes from localStorage
  loadCustomThemes() {
    try {
      const saved = localStorage.getItem('vizom_custom_themes');
      if (saved) {
        const themes = JSON.parse(saved);
        Object.entries(themes).forEach(([id, theme]) => {
          this.customThemes.set(id, theme);
        });
      }
    } catch (error) {
      console.warn('Failed to load custom themes:', error);
    }
  }

  // Detect system color scheme preference
  detectSystemPreference() {
    if (window.matchMedia) {
      const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
      this.systemPreference = darkModeQuery.matches ? 'dark' : 'light';
      
      // Listen for system theme changes
      darkModeQuery.addEventListener('change', (e) => {
        this.systemPreference = e.matches ? 'dark' : 'light';
        
        // Auto-switch if user is using system theme
        if (this.currentTheme === 'system') {
          this.applySystemTheme();
        }
      });
    }
  }

  // Load saved theme preference
  loadSavedTheme() {
    try {
      const saved = localStorage.getItem('vizom_theme');
      if (saved) {
        if (saved === 'system') {
          this.currentTheme = 'system';
          this.applySystemTheme();
        } else if (this.themes.has(saved) || this.customThemes.has(saved)) {
          this.currentTheme = saved;
          this.applyTheme(this.currentTheme);
        } else {
          // Fallback to light theme
          this.currentTheme = 'light';
          this.applyTheme('light');
        }
      } else {
        // Default to light theme
        this.currentTheme = 'light';
        this.applyTheme('light');
      }
    } catch (error) {
      console.warn('Failed to load saved theme:', error);
      this.currentTheme = 'light';
      this.applyTheme('light');
    }
  }

  // Create theme selector UI
  createThemeSelector() {
    const themeSelector = document.createElement('div');
    themeSelector.id = 'theme-selector';
    themeSelector.className = 'theme-selector';
    themeSelector.innerHTML = `
      <div class="theme-toggle">
        <button class="theme-btn" id="theme-toggle-btn" aria-label="Toggle theme">
          <i class="fas fa-${this.getThemeIcon(this.currentTheme)}"></i>
        </button>
      </div>
      
      <div class="theme-dropdown" id="theme-dropdown">
        <div class="theme-dropdown-header">
          <h3>Choose Theme</h3>
          <button class="close-btn" id="theme-close-btn">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="theme-options">
          <div class="theme-section">
            <h4>System</h4>
            <div class="theme-option ${this.currentTheme === 'system' ? 'active' : ''}" data-theme="system">
              <div class="theme-preview system-preview">
                <i class="fas fa-desktop"></i>
              </div>
              <div class="theme-info">
                <div class="theme-name">System</div>
                <div class="theme-description">Follow system preference</div>
              </div>
            </div>
          </div>
          
          <div class="theme-section">
            <h4>Default Themes</h4>
            ${Array.from(this.themes.entries()).map(([id, theme]) => `
              <div class="theme-option ${this.currentTheme === id ? 'active' : ''}" data-theme="${id}">
                <div class="theme-preview" style="background: ${theme.colors.background}; border: 2px solid ${theme.colors.border};">
                  <div class="preview-colors">
                    <div class="preview-color" style="background: ${theme.colors.primary}"></div>
                    <div class="preview-color" style="background: ${theme.colors.success}"></div>
                    <div class="preview-color" style="background: ${theme.colors.warning}"></div>
                    <div class="preview-color" style="background: ${theme.colors.error}"></div>
                  </div>
                </div>
                <div class="theme-info">
                  <div class="theme-name">${theme.icon} ${theme.displayName}</div>
                  <div class="theme-description">${this.getThemeDescription(id)}</div>
                </div>
              </div>
            `).join('')}
          </div>
          
          ${this.customThemes.size > 0 ? `
            <div class="theme-section">
              <h4>Custom Themes</h4>
              ${Array.from(this.customThemes.entries()).map(([id, theme]) => `
                <div class="theme-option ${this.currentTheme === id ? 'active' : ''}" data-theme="${id}">
                  <div class="theme-preview" style="background: ${theme.colors.background}; border: 2px solid ${theme.colors.border};">
                    <div class="preview-colors">
                      <div class="preview-color" style="background: ${theme.colors.primary}"></div>
                      <div class="preview-color" style="background: ${theme.colors.success}"></div>
                      <div class="preview-color" style="background: ${theme.colors.warning}"></div>
                      <div class="preview-color" style="background: ${theme.colors.error}"></div>
                    </div>
                  </div>
                  <div class="theme-info">
                    <div class="theme-name">${theme.icon || '🎨'} ${theme.displayName}</div>
                    <div class="theme-description">Custom theme</div>
                  </div>
                </div>
              `).join('')}
            </div>
          ` : ''}
        </div>
        
        <div class="theme-actions">
          <button class="btn btn-secondary" id="create-theme-btn">
            <i class="fas fa-plus"></i> Create Theme
          </button>
          <button class="btn btn-secondary" id="import-theme-btn">
            <i class="fas fa-download"></i> Import Theme
          </button>
        </div>
      </div>
    `;
    
    // Insert into header
    const header = document.querySelector('.header .container');
    if (header) {
      header.appendChild(themeSelector);
    }
    
    this.setupThemeSelectorEvents();
  }

  // Setup theme selector events
  setupThemeSelectorEvents() {
    const toggleBtn = document.getElementById('theme-toggle-btn');
    const closeBtn = document.getElementById('theme-close-btn');
    const dropdown = document.getElementById('theme-dropdown');
    const createBtn = document.getElementById('create-theme-btn');
    const importBtn = document.getElementById('import-theme-btn');

    // Toggle dropdown
    toggleBtn.addEventListener('click', () => {
      dropdown.classList.toggle('show');
    });

    // Close dropdown
    closeBtn.addEventListener('click', () => {
      dropdown.classList.remove('show');
    });

    // Theme selection
    dropdown.addEventListener('click', (e) => {
      const themeOption = e.target.closest('.theme-option');
      if (themeOption) {
        const theme = themeOption.dataset.theme;
        this.setTheme(theme);
        dropdown.classList.remove('show');
      }
    });

    // Create custom theme
    createBtn.addEventListener('click', () => {
      this.openThemeCreator();
      dropdown.classList.remove('show');
    });

    // Import theme
    importBtn.addEventListener('click', () => {
      this.importTheme();
      dropdown.classList.remove('show');
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.theme-selector')) {
        dropdown.classList.remove('show');
      }
    });
  }

  // Setup event listeners
  setupEventListeners() {
    // Listen for theme preference changes
    document.addEventListener('themeChanged', (e) => {
      this.handleThemeChange(e.detail.theme);
    });

    // Listen for custom theme events
    document.addEventListener('customThemeCreated', (e) => {
      this.customThemes.set(e.detail.id, e.detail.theme);
      this.saveCustomThemes();
      this.refreshThemeSelector();
    });
  }

  // Setup theme transitions
  setupThemeTransitions() {
    // Add transition class to body for smooth theme changes
    document.body.classList.add('theme-transition-enabled');
    
    // Listen for transition end
    document.body.addEventListener('transitionend', (e) => {
      if (e.propertyName === 'background-color') {
        document.body.classList.remove('theme-transitioning');
      }
    });
  }

  // Setup keyboard shortcuts
  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Ctrl+Shift+D for dark mode toggle
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        this.toggleDarkMode();
      }
      
      // Ctrl+Shift+T for theme selector
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
        e.preventDefault();
        document.getElementById('theme-toggle-btn').click();
      }
    });
  }

  // Set theme
  setTheme(themeId) {
    if (themeId === 'system') {
      this.currentTheme = 'system';
      this.applySystemTheme();
    } else if (this.themes.has(themeId) || this.customThemes.has(themeId)) {
      this.currentTheme = themeId;
      this.applyTheme(themeId);
    } else {
      console.warn('Theme not found:', themeId);
      return;
    }

    // Save preference
    this.saveThemePreference();
    
    // Update UI
    this.updateThemeSelector();
    
    // Dispatch event
    document.dispatchEvent(new CustomEvent('themeChanged', {
      detail: { theme: this.currentTheme }
    }));
    
    // Track usage
    if (window.analytics) {
      window.analytics.trackCustomEvent('theme_changed', {
        theme: this.currentTheme
      });
    }
    
    // Announce to screen readers
    if (window.accessibility) {
      const themeName = this.getThemeDisplayName(this.currentTheme);
      window.accessibility.announce(`Theme changed to ${themeName}`);
    }
  }

  // Apply specific theme
  applyTheme(themeId) {
    const theme = this.themes.get(themeId) || this.customThemes.get(themeId);
    if (!theme) return;

    // Add transitioning class for smooth animation
    document.body.classList.add('theme-transitioning');
    
    // Apply CSS custom properties
    const root = document.documentElement;
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--${this.kebabCase(key)}`, value);
    });
    
    // Apply gradients
    Object.entries(theme.gradients).forEach(([key, value]) => {
      root.style.setProperty(`--gradient-${this.kebabCase(key)}`, value);
    });
    
    // Apply chart colors
    theme.chartColors.forEach((color, index) => {
      root.style.setProperty(`--chart-color-${index + 1}`, color);
    });
    
    // Update body classes
    document.body.className = document.body.className.replace(/theme-\w+/g, '');
    document.body.classList.add(`theme-${themeId}`);
    
    // Update meta theme-color for mobile browsers
    this.updateMetaThemeColor(theme.colors.background);
    
    // Remove transitioning class after animation
    setTimeout(() => {
      document.body.classList.remove('theme-transitioning');
    }, 300);
  }

  // Apply system theme
  applySystemTheme() {
    const systemTheme = this.systemPreference || 'light';
    this.applyTheme(systemTheme);
    
    // Add system class for additional styling
    document.body.classList.add('system-theme');
  }

  // Toggle between light and dark mode
  toggleDarkMode() {
    if (this.currentTheme === 'dark') {
      this.setTheme('light');
    } else if (this.currentTheme === 'light') {
      this.setTheme('dark');
    } else {
      // If using a custom theme, toggle to its opposite
      const isDark = this.isThemeDark(this.currentTheme);
      this.setTheme(isDark ? 'light' : 'dark');
    }
  }

  // Check if theme is dark
  isThemeDark(themeId) {
    if (themeId === 'dark') return true;
    if (themeId === 'light') return false;
    
    const theme = this.themes.get(themeId) || this.customThemes.get(themeId);
    if (!theme) return false;
    
    // Check background luminance
    const background = theme.colors.background;
    const rgb = this.hexToRgb(background);
    if (!rgb) return false;
    
    const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
    return luminance < 0.5;
  }

  // Get theme icon
  getThemeIcon(themeId) {
    if (themeId === 'system') {
      return 'desktop';
    }
    
    const theme = this.themes.get(themeId) || this.customThemes.get(themeId);
    return theme?.icon || 'palette';
  }

  // Get theme display name
  getThemeDisplayName(themeId) {
    if (themeId === 'system') {
      return 'System';
    }
    
    const theme = this.themes.get(themeId) || this.customThemes.get(themeId);
    return theme?.displayName || themeId;
  }

  // Get theme description
  getThemeDescription(themeId) {
    const descriptions = {
      'light': 'Clean and bright interface',
      'dark': 'Easy on the eyes in low light',
      'high-contrast': 'Maximum visibility and accessibility',
      'sepia': 'Warm tones for reduced eye strain',
      'ocean': 'Calming blue color scheme'
    };
    
    return descriptions[themeId] || 'Custom color scheme';
  }

  // Update theme selector UI
  updateThemeSelector() {
    const toggleBtn = document.getElementById('theme-toggle-btn');
    if (toggleBtn) {
      const icon = toggleBtn.querySelector('i');
      icon.className = `fas fa-${this.getThemeIcon(this.currentTheme)}`;
    }
    
    // Update active state in dropdown
    document.querySelectorAll('.theme-option').forEach(option => {
      option.classList.toggle('active', option.dataset.theme === this.currentTheme);
    });
  }

  // Refresh theme selector (for custom themes)
  refreshThemeSelector() {
    const selector = document.getElementById('theme-selector');
    if (selector) {
      selector.remove();
      this.createThemeSelector();
    }
  }

  // Open theme creator
  openThemeCreator() {
    const creator = document.createElement('div');
    creator.className = 'theme-creator-modal';
    creator.innerHTML = `
      <div class="modal-backdrop"></div>
      <div class="modal-container">
        <div class="modal-header">
          <h3>Create Custom Theme</h3>
          <button class="modal-close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-content">
          <div class="theme-creator-form">
            <div class="form-group">
              <label>Theme Name</label>
              <input type="text" id="theme-name-input" placeholder="My Custom Theme">
            </div>
            <div class="form-group">
              <label>Theme Icon</label>
              <select id="theme-icon-select">
                                <option value="fa-palette">Palette</option>
                                <option value="fa-rainbow">Rainbow</option>
                                <option value="fa-sparkles">Sparkles</option>
                                <option value="fa-bullseye">Target</option>
                                <option value="fa-fire">Fire</option>
                                <option value="fa-gem">Diamond</option>
              </select>
            </div>
            <div class="color-picker-section">
              <h4>Primary Colors</h4>
              <div class="color-grid">
                <div class="color-input">
                  <label>Primary</label>
                  <input type="color" id="primary-color" value="#0066FF">
                </div>
                <div class="color-input">
                  <label>Success</label>
                  <input type="color" id="success-color" value="#00C853">
                </div>
                <div class="color-input">
                  <label>Warning</label>
                  <input type="color" id="warning-color" value="#FF9500">
                </div>
                <div class="color-input">
                  <label>Error</label>
                  <input type="color" id="error-color" value="#FF3B30">
                </div>
              </div>
            </div>
            <div class="color-picker-section">
              <h4>Background Colors</h4>
              <div class="color-grid">
                <div class="color-input">
                  <label>Background</label>
                  <input type="color" id="background-color" value="#FFFFFF">
                </div>
                <div class="color-input">
                  <label>Surface</label>
                  <input type="color" id="surface-color" value="#F8F9FA">
                </div>
                <div class="color-input">
                  <label>Text Primary</label>
                  <input type="color" id="text-primary-color" value="#212529">
                </div>
                <div class="color-input">
                  <label>Text Secondary</label>
                  <input type="color" id="text-secondary-color" value="#6C757D">
                </div>
              </div>
            </div>
            <div class="theme-preview-section">
              <h4>Preview</h4>
              <div class="theme-preview-box" id="theme-preview-box">
                <div class="preview-header">
                  <h5>Sample Chart</h5>
                  <button class="preview-btn">Button</button>
                </div>
                <div class="preview-content">
                  <p>This is how your theme will look.</p>
                  <div class="preview-chart">
                    <div class="preview-bar" style="background: var(--preview-primary, #0066FF)"></div>
                    <div class="preview-bar" style="background: var(--preview-success, #00C853)"></div>
                    <div class="preview-bar" style="background: var(--preview-warning, #FF9500)"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" id="cancel-theme-btn">Cancel</button>
          <button class="btn btn-primary" id="save-theme-btn">Save Theme</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(creator);
    this.setupThemeCreatorEvents(creator);
  }

  // Setup theme creator events
  setupThemeCreatorEvents(creator) {
    const closeBtn = creator.querySelector('.modal-close');
    const cancelBtn = creator.getElementById('cancel-theme-btn');
    const saveBtn = creator.getElementById('save-theme-btn');
    const backdrop = creator.querySelector('.modal-backdrop');
    
    // Color inputs for live preview
    const colorInputs = creator.querySelectorAll('input[type="color"]');
    colorInputs.forEach(input => {
      input.addEventListener('input', () => this.updateThemePreview(creator));
    });
    
    // Close events
    closeBtn.addEventListener('click', () => creator.remove());
    cancelBtn.addEventListener('click', () => creator.remove());
    backdrop.addEventListener('click', () => creator.remove());
    
    // Save theme
    saveBtn.addEventListener('click', () => this.saveCustomTheme(creator));
  }

  // Update theme preview in creator
  updateThemePreview(creator) {
    const previewBox = creator.getElementById('theme-preview-box');
    const primary = creator.getElementById('primary-color').value;
    const success = creator.getElementById('success-color').value;
    const warning = creator.getElementById('warning-color').value;
    const background = creator.getElementById('background-color').value;
    const textPrimary = creator.getElementById('text-primary-color').value;
    
    previewBox.style.setProperty('--preview-primary', primary);
    previewBox.style.setProperty('--preview-success', success);
    previewBox.style.setProperty('--preview-warning', warning);
    previewBox.style.background = background;
    previewBox.style.color = textPrimary;
  }

  // Save custom theme
  saveCustomTheme(creator) {
    const name = creator.getElementById('theme-name-input').value.trim();
    const icon = creator.getElementById('theme-icon-select').value;
    
    if (!name) {
      alert('Please enter a theme name');
      return;
    }
    
    const themeId = 'custom_' + Date.now();
    const theme = {
      name: name,
      displayName: name,
      icon: icon,
      colors: {
        primary: creator.getElementById('primary-color').value,
        primaryHover: this.adjustColor(creator.getElementById('primary-color').value, -20),
        primaryLight: this.adjustColor(creator.getElementById('primary-color').value, 80),
        secondary: creator.getElementById('text-secondary-color').value,
        success: creator.getElementById('success-color').value,
        warning: creator.getElementById('warning-color').value,
        error: creator.getElementById('error-color').value,
        info: creator.getElementById('primary-color').value,
        
        background: creator.getElementById('background-color').value,
        surface: creator.getElementById('surface-color').value,
        surfaceDark: this.adjustColor(creator.getElementById('surface-color').value, -10),
        
        textPrimary: creator.getElementById('text-primary-color').value,
        textSecondary: creator.getElementById('text-secondary-color').value,
        textMuted: this.adjustColor(creator.getElementById('text-secondary-color').value, 30),
        
        border: this.adjustColor(creator.getElementById('background-color').value, -20),
        borderLight: this.adjustColor(creator.getElementById('background-color').value, -10),
        borderDark: this.adjustColor(creator.getElementById('background-color').value, -30),
        
        shadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        shadowMd: '0 4px 6px rgba(0, 0, 0, 0.1)',
        shadowLg: '0 10px 15px rgba(0, 0, 0, 0.1)'
      },
      gradients: {},
      chartColors: [
        creator.getElementById('primary-color').value,
        creator.getElementById('success-color').value,
        creator.getElementById('warning-color').value,
        creator.getElementById('error-color').value,
        creator.getElementById('primary-color').value,
        creator.getElementById('success-color').value,
        creator.getElementById('warning-color').value,
        creator.getElementById('error-color').value,
        creator.getElementById('primary-color').value,
        creator.getElementById('success-color').value
      ]
    };
    
    this.customThemes.set(themeId, theme);
    this.saveCustomThemes();
    this.setTheme(themeId);
    creator.remove();
    
    // Show success message
    if (window.uiEnhancements) {
      window.uiEnhancements.showNotification(`Theme "${name}" created successfully`, 'success');
    }
  }

  // Import theme
  importTheme() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const themeData = JSON.parse(e.target.result);
          const themeId = 'imported_' + Date.now();
          
          this.customThemes.set(themeId, themeData);
          this.saveCustomThemes();
          this.refreshThemeSelector();
          this.setTheme(themeId);
          
          if (window.uiEnhancements) {
            window.uiEnhancements.showNotification('Theme imported successfully', 'success');
          }
        } catch (error) {
          if (window.uiEnhancements) {
            window.uiEnhancements.showNotification('Failed to import theme: ' + error.message, 'error');
          }
        }
      };
      
      reader.readAsText(file);
    });
    
    input.click();
  }

  // Export current theme
  exportCurrentTheme() {
    const theme = this.themes.get(this.currentTheme) || this.customThemes.get(this.currentTheme);
    if (!theme) return;
    
    const blob = new Blob([JSON.stringify(theme, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${theme.name.replace(/\s+/g, '-').toLowerCase()}-theme.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  }

  // Save theme preference
  saveThemePreference() {
    localStorage.setItem('vizom_theme', this.currentTheme);
  }

  // Save custom themes
  saveCustomThemes() {
    try {
      const themes = Object.fromEntries(this.customThemes);
      localStorage.setItem('vizom_custom_themes', JSON.stringify(themes));
    } catch (error) {
      console.warn('Failed to save custom themes:', error);
    }
  }

  // Update meta theme color
  updateMetaThemeColor(color) {
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.name = 'theme-color';
      document.head.appendChild(metaThemeColor);
    }
    metaThemeColor.content = color;
  }

  // Handle theme change
  handleThemeChange(themeId) {
    // Additional logic for theme change handling
    console.log('Theme changed to:', themeId);
  }

  // Utility functions
  kebabCase(str) {
    return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
  }

  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  adjustColor(color, amount) {
    const rgb = this.hexToRgb(color);
    if (!rgb) return color;
    
    const adjust = (value) => {
      const adjusted = value + amount;
      return Math.max(0, Math.min(255, adjusted));
    };
    
    const r = adjust(rgb.r).toString(16).padStart(2, '0');
    const g = adjust(rgb.g).toString(16).padStart(2, '0');
    const b = adjust(rgb.b).toString(16).padStart(2, '0');
    
    return `#${r}${g}${b}`;
  }

  // Public methods
  getCurrentTheme() {
    return this.currentTheme;
  }

  getAvailableThemes() {
    return {
      default: Object.fromEntries(this.themes),
      custom: Object.fromEntries(this.customThemes)
    };
  }

  getThemeStats() {
    return {
      current: this.currentTheme,
      totalDefault: this.themes.size,
      totalCustom: this.customThemes.size,
      systemPreference: this.systemPreference
    };
  }
}

// Initialize theme manager
document.addEventListener('DOMContentLoaded', () => {
  window.themeManager = new ThemeManager();
});

export { ThemeManager };

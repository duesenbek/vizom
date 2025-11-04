// Chart Customization Panel for VIZOM
class CustomizationPanel {
  constructor() {
    this.currentSettings = {
      theme: 'default',
      colors: ['#3B82F6', '#8B5CF6', '#06D6A0'],
      fontSize: 12,
      fontFamily: 'Inter',
      showGrid: true,
      showLegend: true,
      showLabels: true,
      animationDuration: 1000,
      borderRadius: 8,
      strokeWidth: 2,
      opacity: 0.8
    };
    
    this.init();
  }

  init() {
    this.createPanel();
    this.setupEventListeners();
    this.loadSavedSettings();
  }

  createPanel() {
    const panelHTML = `
      <div id="customization-panel" class="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl transform translate-x-full transition-transform duration-300 z-50 overflow-y-auto">
        <div class="p-6 border-b border-slate-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-slate-900">Настройки диаграммы</h3>
            <button id="close-customization" class="text-slate-400 hover:text-slate-600">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
        
        <div class="p-6 space-y-6">
          <!-- Theme Selection -->
          <div class="space-y-3">
            <label class="text-sm font-medium text-slate-700">Тема</label>
            <div class="grid grid-cols-2 gap-2">
              ${this.getThemeOptions()}
            </div>
          </div>

          <!-- Color Palette -->
          <div class="space-y-3">
            <label class="text-sm font-medium text-slate-700">Цветовая палитра</label>
            <div class="space-y-2">
              <div class="flex items-center gap-2">
                <input type="color" id="color-1" value="#3B82F6" class="w-8 h-8 rounded">
                <input type="color" id="color-2" value="#8B5CF6" class="w-8 h-8 rounded">
                <input type="color" id="color-3" value="#06D6A0" class="w-8 h-8 rounded">
                <button id="add-color" class="text-blue-600 hover:text-blue-700">
                  <i class="fas fa-plus"></i>
                </button>
              </div>
              <div id="color-presets" class="flex flex-wrap gap-2">
                ${this.getColorPresets()}
              </div>
            </div>
          </div>

          <!-- Typography -->
          <div class="space-y-3">
            <label class="text-sm font-medium text-slate-700">Типографика</label>
            <div class="space-y-2">
              <select id="font-family" class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm">
                <option value="Inter">Inter</option>
                <option value="Arial">Arial</option>
                <option value="Helvetica">Helvetica</option>
                <option value="Georgia">Georgia</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Courier New">Courier New</option>
              </select>
              <div class="flex items-center gap-2">
                <input type="range" id="font-size" min="8" max="24" value="12" class="flex-1">
                <span id="font-size-value" class="text-sm text-slate-600 w-8">12</span>
              </div>
            </div>
          </div>

          <!-- Chart Elements -->
          <div class="space-y-3">
            <label class="text-sm font-medium text-slate-700">Элементы диаграммы</label>
            <div class="space-y-2">
              <label class="flex items-center gap-2">
                <input type="checkbox" id="show-grid" checked class="rounded">
                <span class="text-sm">Показать сетку</span>
              </label>
              <label class="flex items-center gap-2">
                <input type="checkbox" id="show-legend" checked class="rounded">
                <span class="text-sm">Показать легенду</span>
              </label>
              <label class="flex items-center gap-2">
                <input type="checkbox" id="show-labels" checked class="rounded">
                <span class="text-sm">Показать подписи</span>
              </label>
              <label class="flex items-center gap-2">
                <input type="checkbox" id="show-values" class="rounded">
                <span class="text-sm">Показать значения</span>
              </label>
            </div>
          </div>

          <!-- Style Settings -->
          <div class="space-y-3">
            <label class="text-sm font-medium text-slate-700">Стиль</label>
            <div class="space-y-2">
              <div class="flex items-center gap-2">
                <label class="text-sm text-slate-600 w-20">Скругление</label>
                <input type="range" id="border-radius" min="0" max="20" value="8" class="flex-1">
                <span id="border-radius-value" class="text-sm text-slate-600 w-8">8</span>
              </div>
              <div class="flex items-center gap-2">
                <label class="text-sm text-slate-600 w-20">Толщина</label>
                <input type="range" id="stroke-width" min="1" max="10" value="2" class="flex-1">
                <span id="stroke-width-value" class="text-sm text-slate-600 w-8">2</span>
              </div>
              <div class="flex items-center gap-2">
                <label class="text-sm text-slate-600 w-20">Прозрачность</label>
                <input type="range" id="opacity" min="0" max="100" value="80" class="flex-1">
                <span id="opacity-value" class="text-sm text-slate-600 w-8">80%</span>
              </div>
            </div>
          </div>

          <!-- Animation -->
          <div class="space-y-3">
            <label class="text-sm font-medium text-slate-700">Анимация</label>
            <div class="space-y-2">
              <label class="flex items-center gap-2">
                <input type="checkbox" id="enable-animation" checked class="rounded">
                <span class="text-sm">Включить анимацию</span>
              </label>
              <div class="flex items-center gap-2">
                <label class="text-sm text-slate-600 w-20">Длительность</label>
                <input type="range" id="animation-duration" min="0" max="3000" value="1000" step="100" class="flex-1">
                <span id="animation-duration-value" class="text-sm text-slate-600 w-12">1.0s</span>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="space-y-3 pt-4 border-t border-slate-200">
            <button id="apply-settings" class="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
              Применить настройки
            </button>
            <button id="reset-settings" class="w-full border border-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:border-slate-300 transition">
              Сбросить
            </button>
            <button id="save-preset" class="w-full border border-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:border-slate-300 transition">
              Сохранить как пресет
            </button>
          </div>

          <!-- Saved Presets -->
          <div class="space-y-3">
            <label class="text-sm font-medium text-slate-700">Сохраненные пресеты</label>
            <div id="saved-presets" class="space-y-2">
              <!-- Presets will be loaded here -->
            </div>
          </div>
        </div>
      </div>

      <!-- Toggle Button -->
      <button id="toggle-customization" class="fixed right-4 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-3 rounded-l-lg shadow-lg hover:bg-blue-700 transition z-40">
        <i class="fas fa-sliders-h"></i>
      </button>
    `;

    document.body.insertAdjacentHTML('beforeend', panelHTML);
  }

  getThemeOptions() {
    const themes = ['default', 'dark', 'vibrant', 'pastel', 'monochrome'];
    return themes.map(theme => `
      <button class="theme-option p-3 border border-slate-200 rounded-lg hover:border-blue-400 transition text-sm" data-theme="${theme}">
        <div class="w-full h-8 rounded mb-2" style="background: ${this.getThemePreview(theme)}"></div>
        <span class="capitalize">${theme}</span>
      </button>
    `).join('');
  }

  getThemePreview(theme) {
    const previews = {
      default: 'linear-gradient(45deg, #3B82F6, #8B5CF6)',
      dark: 'linear-gradient(45deg, #1f2937, #60A5FA)',
      vibrant: 'linear-gradient(45deg, #EF4444, #F59E0B)',
      pastel: 'linear-gradient(45deg, #FCA5A5, #FCD34D)',
      monochrome: 'linear-gradient(45deg, #1f2937, #9ca3af)'
    };
    return previews[theme] || previews.default;
  }

  getColorPresets() {
    const presets = [
      ['#3B82F6', '#8B5CF6', '#06D6A0'],
      ['#EF4444', '#F59E0B', '#10B981'],
      ['#8B5CF6', '#EC4899', '#F59E0B'],
      ['#14B8A6', '#06B6D4', '#3B82F6'],
      ['#F97316', '#EF4444', '#DC2626']
    ];

    return presets.map((preset, index) => `
      <button class="color-preset flex gap-1 p-2 border border-slate-200 rounded hover:border-blue-400 transition" data-preset="${index}">
        ${preset.map(color => `<div class="w-4 h-4 rounded" style="background-color: ${color}"></div>`).join('')}
      </button>
    `).join('');
  }

  setupEventListeners() {
    // Panel toggle
    document.getElementById('toggle-customization').addEventListener('click', () => {
      this.togglePanel();
    });

    document.getElementById('close-customization').addEventListener('click', () => {
      this.hidePanel();
    });

    // Theme selection
    document.querySelectorAll('.theme-option').forEach(btn => {
      btn.addEventListener('click', () => {
        this.selectTheme(btn.dataset.theme);
      });
    });

    // Color presets
    document.querySelectorAll('.color-preset').forEach(btn => {
      btn.addEventListener('click', () => {
        this.applyColorPreset(parseInt(btn.dataset.preset));
      });
    });

    // Individual color inputs
    ['color-1', 'color-2', 'color-3'].forEach((id, index) => {
      document.getElementById(id).addEventListener('input', (e) => {
        this.updateColor(index, e.target.value);
      });
    });

    // Range inputs
    const rangeInputs = [
      { id: 'font-size', property: 'fontSize', suffix: '' },
      { id: 'border-radius', property: 'borderRadius', suffix: '' },
      { id: 'stroke-width', property: 'strokeWidth', suffix: '' },
      { id: 'opacity', property: 'opacity', suffix: '%' },
      { id: 'animation-duration', property: 'animationDuration', suffix: 'ms' }
    ];

    rangeInputs.forEach(input => {
      const element = document.getElementById(input.id);
      const valueElement = document.getElementById(`${input.id}-value`);
      
      element.addEventListener('input', (e) => {
        const value = e.target.value;
        this.currentSettings[input.property] = input.suffix === '%' ? value / 100 : parseFloat(value);
        
        if (valueElement) {
          if (input.id === 'animation-duration') {
            valueElement.textContent = (value / 1000).toFixed(1) + 's';
          } else if (input.id === 'opacity') {
            valueElement.textContent = value + '%';
          } else {
            valueElement.textContent = value;
          }
        }
      });
    });

    // Checkboxes
    const checkboxes = [
      'show-grid', 'show-legend', 'show-labels', 'show-values', 'enable-animation'
    ];

    checkboxes.forEach(id => {
      document.getElementById(id).addEventListener('change', (e) => {
        const property = id.replace('-', '').replace('show', 'show').replace('enable', 'enable');
        this.currentSettings[property] = e.target.checked;
      });
    });

    // Select inputs
    document.getElementById('font-family').addEventListener('change', (e) => {
      this.currentSettings.fontFamily = e.target.value;
    });

    // Action buttons
    document.getElementById('apply-settings').addEventListener('click', () => {
      this.applySettings();
    });

    document.getElementById('reset-settings').addEventListener('click', () => {
      this.resetSettings();
    });

    document.getElementById('save-preset').addEventListener('click', () => {
      this.savePreset();
    });

    // Add color button
    document.getElementById('add-color').addEventListener('click', () => {
      this.addColorInput();
    });
  }

  togglePanel() {
    const panel = document.getElementById('customization-panel');
    const isOpen = !panel.classList.contains('translate-x-full');
    
    if (isOpen) {
      this.hidePanel();
    } else {
      this.showPanel();
    }
  }

  showPanel() {
    const panel = document.getElementById('customization-panel');
    panel.classList.remove('translate-x-full');
    document.body.style.overflow = 'hidden';
  }

  hidePanel() {
    const panel = document.getElementById('customization-panel');
    panel.classList.add('translate-x-full');
    document.body.style.overflow = '';
  }

  selectTheme(theme) {
    this.currentSettings.theme = theme;
    
    // Update UI
    document.querySelectorAll('.theme-option').forEach(btn => {
      btn.classList.toggle('border-blue-400', btn.dataset.theme === theme);
      btn.classList.toggle('bg-blue-50', btn.dataset.theme === theme);
    });

    // Apply theme colors
    const themeColors = this.getThemeColors(theme);
    if (themeColors) {
      this.currentSettings.colors = themeColors;
      this.updateColorInputs();
    }
  }

  getThemeColors(theme) {
    const themes = {
      default: ['#3B82F6', '#8B5CF6', '#06D6A0'],
      dark: ['#60A5FA', '#A78BFA', '#34D399'],
      vibrant: ['#EF4444', '#F59E0B', '#10B981'],
      pastel: ['#FCA5A5', '#FCD34D', '#86EFAC'],
      monochrome: ['#1f2937', '#4b5563', '#6b7280']
    };
    return themes[theme];
  }

  applyColorPreset(presetIndex) {
    const presets = [
      ['#3B82F6', '#8B5CF6', '#06D6A0'],
      ['#EF4444', '#F59E0B', '#10B981'],
      ['#8B5CF6', '#EC4899', '#F59E0B'],
      ['#14B8A6', '#06B6D4', '#3B82F6'],
      ['#F97316', '#EF4444', '#DC2626']
    ];

    this.currentSettings.colors = presets[presetIndex];
    this.updateColorInputs();
  }

  updateColorInputs() {
    this.currentSettings.colors.forEach((color, index) => {
      const input = document.getElementById(`color-${index + 1}`);
      if (input) {
        input.value = color;
      }
    });
  }

  updateColor(index, color) {
    if (this.currentSettings.colors[index]) {
      this.currentSettings.colors[index] = color;
    }
  }

  addColorInput() {
    const colorContainer = document.querySelector('#color-1').parentElement;
    const colorCount = this.currentSettings.colors.length;
    
    if (colorCount < 8) {
      const newColor = '#' + Math.floor(Math.random()*16777215).toString(16);
      this.currentSettings.colors.push(newColor);
      
      const newInput = document.createElement('input');
      newInput.type = 'color';
      newInput.value = newColor;
      newInput.className = 'w-8 h-8 rounded';
      newInput.id = `color-${colorCount + 1}`;
      newInput.addEventListener('input', (e) => {
        this.updateColor(colorCount, e.target.value);
      });
      
      colorContainer.appendChild(newInput);
    }
  }

  applySettings() {
    // Apply settings to current chart
    if (window.chartEngine) {
      window.chartEngine.currentTheme = this.currentSettings.theme;
      // Trigger chart re-render
      this.notifyChartUpdate();
    }
    
    // Save to localStorage
    this.saveSettings();
    
    // Show feedback
    this.showNotification('Настройки применены', 'success');
  }

  resetSettings() {
    this.currentSettings = {
      theme: 'default',
      colors: ['#3B82F6', '#8B5CF6', '#06D6A0'],
      fontSize: 12,
      fontFamily: 'Inter',
      showGrid: true,
      showLegend: true,
      showLabels: true,
      animationDuration: 1000,
      borderRadius: 8,
      strokeWidth: 2,
      opacity: 0.8
    };
    
    this.updateUI();
    this.applySettings();
  }

  updateUI() {
    // Update all form controls to match current settings
    document.getElementById('font-family').value = this.currentSettings.fontFamily;
    document.getElementById('font-size').value = this.currentSettings.fontSize;
    document.getElementById('border-radius').value = this.currentSettings.borderRadius;
    document.getElementById('stroke-width').value = this.currentSettings.strokeWidth;
    document.getElementById('opacity').value = this.currentSettings.opacity * 100;
    document.getElementById('animation-duration').value = this.currentSettings.animationDuration;
    
    // Update checkboxes
    document.getElementById('show-grid').checked = this.currentSettings.showGrid;
    document.getElementById('show-legend').checked = this.currentSettings.showLegend;
    document.getElementById('show-labels').checked = this.currentSettings.showLabels;
    document.getElementById('enable-animation').checked = this.currentSettings.enableAnimation;
    
    // Update colors
    this.updateColorInputs();
    
    // Update theme
    this.selectTheme(this.currentSettings.theme);
  }

  saveSettings() {
    localStorage.setItem('vizom-chart-settings', JSON.stringify(this.currentSettings));
  }

  loadSavedSettings() {
    const saved = localStorage.getItem('vizom-chart-settings');
    if (saved) {
      try {
        this.currentSettings = { ...this.currentSettings, ...JSON.parse(saved) };
        this.updateUI();
      } catch (e) {
        console.error('Error loading settings:', e);
      }
    }
  }

  savePreset() {
    const name = prompt('Введите название пресета:');
    if (name) {
      const presets = JSON.parse(localStorage.getItem('vizom-presets') || '[]');
      presets.push({
        name,
        settings: { ...this.currentSettings },
        timestamp: Date.now()
      });
      localStorage.setItem('vizom-presets', JSON.stringify(presets));
      this.loadPresets();
      this.showNotification('Пресет сохранен', 'success');
    }
  }

  loadPresets() {
    const presets = JSON.parse(localStorage.getItem('vizom-presets') || '[]');
    const container = document.getElementById('saved-presets');
    
    if (presets.length === 0) {
      container.innerHTML = '<p class="text-sm text-slate-500">Нет сохраненных пресетов</p>';
    } else {
      container.innerHTML = presets.map((preset, index) => `
        <div class="flex items-center justify-between p-2 border border-slate-200 rounded">
          <div>
            <div class="text-sm font-medium">${preset.name}</div>
            <div class="text-xs text-slate-500">${new Date(preset.timestamp).toLocaleDateString()}</div>
          </div>
          <div class="flex gap-2">
            <button class="text-blue-600 hover:text-blue-700 text-sm" onclick="window.customPanel.loadPreset(${index})">
              <i class="fas fa-download"></i>
            </button>
            <button class="text-red-600 hover:text-red-700 text-sm" onclick="window.customPanel.deletePreset(${index})">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      `).join('');
    }
  }

  loadPreset(index) {
    const presets = JSON.parse(localStorage.getItem('vizom-presets') || '[]');
    if (presets[index]) {
      this.currentSettings = { ...presets[index].settings };
      this.updateUI();
      this.applySettings();
    }
  }

  deletePreset(index) {
    const presets = JSON.parse(localStorage.getItem('vizom-presets') || '[]');
    presets.splice(index, 1);
    localStorage.setItem('vizom-presets', JSON.stringify(presets));
    this.loadPresets();
  }

  notifyChartUpdate() {
    // Trigger chart re-render with new settings
    const event = new CustomEvent('chartSettingsUpdate', {
      detail: this.currentSettings
    });
    document.dispatchEvent(event);
  }

  showNotification(message, type = 'info') {
    if (window.uiEnhancements) {
      window.uiEnhancements.showNotification(message, type);
    }
  }

  getSettings() {
    return { ...this.currentSettings };
  }
}

// Initialize Customization Panel
document.addEventListener('DOMContentLoaded', () => {
  window.customPanel = new CustomizationPanel();
});

export { CustomizationPanel };

// Modern Generator Page Integration
class ModernGenerator {
  constructor() {
    this.currentChartType = 'bar';
    this.currentData = '';
    this.generatedChart = null;
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.initializeAIIntegration();
    this.setupProjectManagement();
    this.setupCustomizationIntegration();
    this.setupAnalyticsIntegration();
  }

  setupEventListeners() {
    // Chart type selection
    document.querySelectorAll('.chart-option').forEach(option => {
      option.addEventListener('click', (e) => {
        this.selectChartType(e.currentTarget.dataset.type);
      });
    });

    // Tab switching
    document.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        this.switchTab(e.currentTarget.dataset.tab);
      });
    });

    // Generate button
    const generateBtn = document.getElementById('generate-btn');
    if (generateBtn) {
      generateBtn.addEventListener('click', () => this.generateChart());
    }

    // Export buttons
    document.getElementById('export-png')?.addEventListener('click', () => this.exportChart('png'));
    document.getElementById('save-project')?.addEventListener('click', () => this.saveProject());
    document.getElementById('share-chart')?.addEventListener('click', () => this.shareChart());

    // File upload
    this.setupFileUpload();
  }

  selectChartType(type) {
    this.currentChartType = type;
    
    // Update UI
    document.querySelectorAll('.chart-option').forEach(opt => {
      opt.classList.remove('selected');
    });
    document.querySelector(`[data-type="${type}"]`)?.classList.add('selected');

    // Update preview placeholder
    this.updatePreviewPlaceholder(type);

    // Track analytics
    if (window.analytics) {
      window.analytics.trackChartTypeSelection(type);
    }
  }

  updatePreviewPlaceholder(type) {
    const placeholder = document.getElementById('preview-placeholder');
    if (placeholder && !placeholder.classList.contains('hidden')) {
      const typeNames = {
        bar: 'Bar Chart',
        line: 'Line Chart',
        pie: 'Pie Chart',
        area: 'Area Chart',
        scatter: 'Scatter Plot',
        table: 'Data Table',
        dashboard: 'Dashboard',
        gauge: 'Gauge Chart'
      };

      placeholder.innerHTML = `
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
          <line x1="12" y1="22.08" x2="12" y2="12"></line>
        </svg>
        <p>Your ${typeNames[type] || 'chart'} will appear here</p>
        <p style="font-size: 13px; margin-top: 4px;">Describe your data to generate a visualization</p>
      `;
    }
  }

  switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab').forEach(tab => {
      tab.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`)?.classList.add('active');

    // Update tab content
    document.querySelectorAll('.input-area').forEach(area => {
      area.classList.add('hidden');
    });
    document.getElementById(`${tabName}-tab`)?.classList.remove('hidden');

    // Track tab usage
    if (window.analytics) {
      window.analytics.trackCustomEvent('tab_switched', { tab: tabName });
    }
  }

  async generateChart() {
    const input = document.querySelector('#data-input')?.value?.trim();
    if (!input) {
      this.showToast('Please describe your data first', 'warning');
      return;
    }

    this.currentData = input;
    const generateBtn = document.getElementById('generate-btn');
    
    // Show loading state
    generateBtn.innerHTML = '<div class="spinner mr-2"></div>Generating...';
    generateBtn.disabled = true;

    try {
      // Always use real AI backend
      const result = await this.callRealAIBackend(input, this.currentChartType);
      this.displayChart(result);

      // Track generation
      if (window.analytics) {
        window.analytics.trackCustomEvent('chart_generated', {
          type: this.currentChartType,
          inputLength: input.length,
          success: true
        });
      }

    } catch (error) {
      console.error('Chart generation failed:', error);
      this.showToast('Error generating chart: ' + error.message, 'error');
      
      // Track error
      if (window.analytics) {
        window.analytics.trackCustomEvent('chart_generation_failed', {
          type: this.currentChartType,
          error: error.message
        });
      }
    } finally {
      generateBtn.innerHTML = '<i class="fas fa-magic"></i>Generate Chart';
      generateBtn.disabled = false;
    }
  }

  displayChart(result) {
    if (!result || !result.html) {
      throw new Error('Invalid chart result');
    }

    // Hide placeholder, show chart
    document.getElementById('preview-placeholder')?.classList.add('hidden');
    const chartOutput = document.getElementById('chart-output');
    chartOutput?.classList.remove('hidden');
    
    if (chartOutput) {
      chartOutput.innerHTML = result.html;
      this.generatedChart = result;
    }

    // Show status indicator
    document.getElementById('chart-status')?.classList.remove('hidden');
    
    // Enable export buttons
    this.enableExportButtons();
    
    this.showToast('Chart generated successfully!', 'success');
  }

  async callRealAIBackend(input, chartType) {
    // Call real AI backend proxy - no mock/fallback
    const response = await fetch('/.netlify/functions/deepseek-proxy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: input, chartType })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      // Show unavailable banner
      this.showAIUnavailableBanner();
      throw new Error(errorData.error || 'AI service temporarily unavailable');
    }

    const result = await response.json();
    
    if (!result.success || !result.chartConfig) {
      this.showAIUnavailableBanner();
      throw new Error('Invalid response from AI service');
    }

    // Parse the AI response and create chart HTML
    let chartConfig;
    try {
      chartConfig = typeof result.chartConfig === 'string' 
        ? JSON.parse(result.chartConfig) 
        : result.chartConfig;
    } catch (e) {
      throw new Error('Failed to parse AI response');
    }

    // Generate chart HTML from config
    const chartHTML = this.generateChartHTML(chartConfig, chartType);
    return { html: chartHTML, config: chartConfig };
  }

  generateChartHTML(config, type) {
    // Generate SVG/HTML from Chart.js config
    const data = this.extractDataFromConfig(config);
    
    if (type === 'table') {
      return this.createTablePreview(data);
    } else if (type === 'pie') {
      return this.createPiePreview(data);
    } else {
      return this.createBarPreview(data);
    }
  }

  extractDataFromConfig(config) {
    const labels = config?.data?.labels || [];
    const values = config?.data?.datasets?.[0]?.data || [];
    
    if (labels.length === 0) {
      return [{ label: 'No data', value: 0 }];
    }
    
    return labels.map((label, i) => ({
      label: String(label),
      value: Number(values[i]) || 0
    }));
  }

  showAIUnavailableBanner() {
    // Show banner indicating AI is temporarily unavailable
    let banner = document.getElementById('ai-unavailable-banner');
    
    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'ai-unavailable-banner';
      banner.className = 'fixed top-0 left-0 right-0 bg-amber-500 text-white px-4 py-3 text-center z-50 flex items-center justify-center gap-2';
      banner.innerHTML = `
        <i class="fas fa-exclamation-triangle"></i>
        <span>AI temporarily unavailable. Please retry later.</span>
        <button onclick="this.parentElement.remove()" class="ml-4 text-white hover:text-amber-100">
          <i class="fas fa-times"></i>
        </button>
      `;
      document.body.prepend(banner);
    }
    
    // Auto-hide after 10 seconds
    setTimeout(() => banner?.remove(), 10000);
  }

  createSimpleChartPreview(input, type) {
    // Parse simple data from input
    const data = this.parseSimpleData(input);
    
    if (type === 'table') {
      return this.createTablePreview(data);
    } else if (type === 'pie') {
      return this.createPiePreview(data);
    } else {
      return this.createBarPreview(data);
    }
  }

  parseSimpleData(input) {
    const lines = input.split('\n').filter(line => line.trim());
    const data = [];
    
    lines.forEach(line => {
      const match = line.match(/([^:]+)[:\-]?\s*\$?([\d,.]+)\s*(K|M|%|k|m)?/);
      if (match) {
        let value = parseFloat(match[2].replace(/,/g, ''));
        const unit = match[3]?.toUpperCase();
        
        if (unit === 'K' || unit === 'k') value *= 1000;
        if (unit === 'M' || unit === 'm') value *= 1000000;
        if (unit === '%') value = value;
        
        data.push({
          label: match[1].trim(),
          value: value
        });
      }
    });

    return data.length > 0 ? data : [
      { label: 'Sample A', value: 45 },
      { label: 'Sample B', value: 30 },
      { label: 'Sample C', value: 25 }
    ];
  }

  createBarPreview(data) {
    const maxValue = Math.max(...data.map(d => d.value));
    const width = 360;
    const height = 240;
    const barWidth = width / data.length * 0.7;
    const spacing = width / data.length * 0.3;

    let bars = '';
    data.forEach((item, index) => {
      const barHeight = (item.value / maxValue) * (height - 40);
      const x = index * (barWidth + spacing) + spacing / 2;
      const y = height - barHeight - 20;
      
      bars += `
        <rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" 
              fill="#0066FF" rx="4">
          <title>${item.label}: ${item.value}</title>
        </rect>
        <text x="${x + barWidth/2}" y="${height - 5}" 
              text-anchor="middle" font-size="12" fill="#666">${item.label}</text>
      `;
    });

    return `
      <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" 
           style="width: 100%; height: auto; max-height: 400px;">
        ${bars}
      </svg>
    `;
  }

  createPiePreview(data) {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    const width = 240;
    const height = 240;
    const cx = width / 2;
    const cy = height / 2;
    const radius = 80;
    
    let currentAngle = -Math.PI / 2;
    const colors = ['#0066FF', '#8B5CF6', '#06D6A0', '#F59E0B', '#EF4444'];
    
    let slices = '';
    data.forEach((item, index) => {
      const percentage = item.value / total;
      const angle = percentage * Math.PI * 2;
      const endAngle = currentAngle + angle;
      
      const x1 = cx + Math.cos(currentAngle) * radius;
      const y1 = cy + Math.sin(currentAngle) * radius;
      const x2 = cx + Math.cos(endAngle) * radius;
      const y2 = cy + Math.sin(endAngle) * radius;
      
      const largeArc = angle > Math.PI ? 1 : 0;
      
      slices += `
        <path d="M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z"
              fill="${colors[index % colors.length]}" stroke="white" stroke-width="2">
          <title>${item.label}: ${item.value} (${(percentage * 100).toFixed(1)}%)</title>
        </path>
      `;
      
      currentAngle = endAngle;
    });

    return `
      <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" 
           style="width: 100%; height: auto; max-height: 400px;">
        ${slices}
      </svg>
    `;
  }

  createTablePreview(data) {
    let rows = '';
    data.forEach(item => {
      rows += `
        <tr style="border-bottom: 1px solid #F0F0F0;">
          <td style="padding: 8px; text-align: left;">${item.label}</td>
          <td style="padding: 8px; text-align: right; font-weight: 500;">${item.value}</td>
        </tr>
      `;
    });

    return `
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <thead>
          <tr style="border-bottom: 2px solid #F0F0F0;">
            <th style="padding: 8px; text-align: left; font-weight: 600;">Label</th>
            <th style="padding: 8px; text-align: right; font-weight: 600;">Value</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    `;
  }

  setupFileUpload() {
    const dropZone = document.getElementById('drop-zone-modern');
    const fileInput = document.getElementById('csv-upload-modern');
    const fileInfo = document.getElementById('file-info-modern');

    if (!dropZone || !fileInput) return;

    dropZone.addEventListener('click', () => fileInput.click());
    
    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.classList.add('border-blue-400', 'bg-blue-50');
    });
    
    dropZone.addEventListener('dragleave', () => {
      dropZone.classList.remove('border-blue-400', 'bg-blue-50');
    });
    
    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.classList.remove('border-blue-400', 'bg-blue-50');
      this.handleFileUpload(e.dataTransfer.files);
    });
    
    fileInput.addEventListener('change', (e) => {
      this.handleFileUpload(e.target.files);
    });
  }

  async handleFileUpload(files) {
    if (files.length === 0) return;
    
    const file = files[0];
    
    // Validate file
    if (!file.name.endsWith('.csv')) {
      this.showToast('Please upload a CSV file', 'error');
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) {
      this.showToast('File size must be less than 10MB', 'error');
      return;
    }
    
    // Show file info
    const fileInfo = document.getElementById('file-info-modern');
    if (fileInfo) {
      fileInfo.innerHTML = `<i class="fas fa-file-csv mr-2"></i>${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
      fileInfo.classList.remove('hidden');
    }
    
    // Process file with existing data import system
    if (window.dataImportExport) {
      try {
        await window.dataImportExport.handleFiles(files);
        this.showToast('File uploaded and processed successfully', 'success');
        
        // Switch to describe tab to show parsed data
        this.switchTab('describe');
      } catch (error) {
        this.showToast('Error processing file: ' + error.message, 'error');
      }
    } else {
      this.showToast('File upload functionality loading...', 'info');
    }
  }

  enableExportButtons() {
    document.getElementById('export-png')?.classList.remove('opacity-50', 'cursor-not-allowed');
    document.getElementById('save-project')?.classList.remove('opacity-50', 'cursor-not-allowed');
    document.getElementById('share-chart')?.classList.remove('opacity-50', 'cursor-not-allowed');
  }

  async exportChart(format = 'png') {
    if (!this.generatedChart) {
      this.showToast('Please generate a chart first', 'warning');
      return;
    }

    try {
      if (window.chartEngine) {
        const chartOutput = document.getElementById('chart-output');
        const result = await window.chartEngine.exportChart(chartOutput, format);
        
        if (format === 'png' || format === 'jpg') {
          // Download the image
          const link = document.createElement('a');
          link.download = `vizom-chart-${Date.now()}.${format}`;
          link.href = result;
          link.click();
        }
        
        this.showToast(`Chart exported as ${format.toUpperCase()}`, 'success');
        
        // Track export
        if (window.analytics) {
          window.analytics.trackCustomEvent('chart_exported', { format });
        }
      } else {
        this.showToast('Export functionality loading...', 'info');
      }
    } catch (error) {
      this.showToast('Export failed: ' + error.message, 'error');
    }
  }

  async saveProject() {
    if (!this.generatedChart) {
      this.showToast('Please generate a chart first', 'warning');
      return;
    }

    try {
      if (window.projectManager) {
        const title = prompt('Enter project title:');
        if (!title) return;
        
        await window.projectManager.saveProject(
          title,
          this.currentData,
          this.generatedChart.html,
          this.currentChartType
        );
        
        this.showToast('Project saved successfully!', 'success');
        
        // Track save
        if (window.analytics) {
          window.analytics.trackCustomEvent('project_saved', { chartType: this.currentChartType });
        }
      } else {
        this.showToast('Save functionality loading...', 'info');
      }
    } catch (error) {
      this.showToast('Save failed: ' + error.message, 'error');
    }
  }

  async shareChart() {
    if (!this.generatedChart) {
      this.showToast('Please generate a chart first', 'warning');
      return;
    }

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'VIZOM Chart',
          text: 'Check out this chart I created with VIZOM AI!',
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        this.showToast('Link copied to clipboard!', 'success');
      }
      
      // Track share
      if (window.analytics) {
        window.analytics.trackCustomEvent('chart_shared', { method: navigator.share ? 'native' : 'clipboard' });
      }
    } catch (error) {
      this.showToast('Share failed: ' + error.message, 'error');
    }
  }

  initializeAIIntegration() {
    // AI integration - always use real backend
    console.log('AI service: using real backend proxy');
  }

  setupProjectManagement() {
    // Hook into existing project manager
    if (window.projectManager) {
      console.log('Project manager integrated');
    }
  }

  setupCustomizationIntegration() {
    // Hook into customization panel
    if (window.customPanel) {
      // Listen for customization updates
      document.addEventListener('chartSettingsUpdate', (e) => {
        if (this.generatedChart && window.chartEngine) {
          // Regenerate chart with new settings
          this.regenerateChartWithSettings(e.detail);
        }
      });
    }
  }

  async regenerateChartWithSettings(settings) {
    if (!this.currentData) return;
    
    try {
      // Apply settings to chart engine
      if (window.chartEngine) {
        window.chartEngine.currentTheme = settings.theme || 'default';
        // Apply other settings...
        
        // Regenerate chart
        const result = await window.aiService.generateWithCache(this.currentData, this.currentChartType);
        this.displayChart(result);
      }
    } catch (error) {
      console.error('Failed to regenerate chart with new settings:', error);
    }
  }

  setupAnalyticsIntegration() {
    // Track page view
    if (window.analytics) {
      window.analytics.trackPageView();
    }
  }

  showToast(message, type = 'info') {
    // Use existing toast system or create new one
    if (window.uiEnhancements) {
      window.uiEnhancements.showNotification(message, type);
    } else {
      // Fallback toast
      const toast = document.createElement('div');
      const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
      };
      
      const colors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        warning: 'bg-orange-500',
        info: 'bg-blue-500'
      };
      
      toast.className = `${colors[type]} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 min-w-[250px] transform translate-x-full transition-transform duration-300`;
      toast.innerHTML = `
        <i class="fas ${icons[type]}"></i>
        <span>${message}</span>
      `;
      
      const container = document.getElementById('toast-container');
      if (container) {
        container.appendChild(toast);
        
        setTimeout(() => {
          toast.classList.remove('translate-x-full');
        }, 10);
        
        setTimeout(() => {
          toast.classList.add('translate-x-full');
          setTimeout(() => toast.remove(), 300);
        }, 3000);
      }
    }
  }
}

// Initialize Modern Generator
document.addEventListener('DOMContentLoaded', () => {
  window.modernGenerator = new ModernGenerator();
});

export { ModernGenerator };

/**
 * Chart Export Service
 * Handles PNG, SVG, and high-resolution chart exports with download functionality
 */

class ChartExportService {
  constructor() {
    this.exportFormats = ['png', 'svg', 'jpg', 'pdf'];
    this.defaultQuality = 0.95;
    this.defaultScale = 2; // For high-resolution exports
    this.init();
  }

  init() {
    this.setupExportStyles();
    this.loadExternalLibraries();
  }

  /**
   * Setup export-specific styles
   */
  setupExportStyles() {
    if (document.getElementById('export-styles')) return;

    const styles = document.createElement('style');
    styles.id = 'export-styles';
    styles.textContent = `
      /* Export Button Styles */
      .export-button {
        background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
        color: white;
        border: none;
        padding: 10px 16px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        position: relative;
        overflow: hidden;
      }

      .export-button:hover {
        background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
      }

      .export-button:disabled {
        background: #9ca3af;
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
      }

      /* Export Menu */
      .export-menu {
        position: absolute;
        top: 100%;
        right: 0;
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        min-width: 200px;
        margin-top: 4px;
        opacity: 0;
        visibility: hidden;
        transform: translateY(-10px);
        transition: all 0.2s ease;
      }

      .export-menu.show {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
      }

      .export-menu-header {
        padding: 12px 16px;
        border-bottom: 1px solid #e5e7eb;
        font-weight: 500;
        color: #1f2937;
        font-size: 14px;
      }

      .export-option {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 16px;
        cursor: pointer;
        transition: background 0.2s ease;
        border-bottom: 1px solid #f3f4f6;
      }

      .export-option:last-child {
        border-bottom: none;
      }

      .export-option:hover {
        background: #f9fafb;
      }

      .export-option-icon {
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #6b7280;
      }

      .export-option-content {
        flex: 1;
      }

      .export-option-title {
        font-weight: 500;
        color: #1f2937;
        font-size: 14px;
        margin-bottom: 2px;
      }

      .export-option-description {
        color: #6b7280;
        font-size: 12px;
      }

      /* Export Progress */
      .export-progress {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        border-radius: 12px;
        padding: 24px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
        z-index: 2000;
        min-width: 300px;
        text-align: center;
      }

      .export-progress-icon {
        width: 48px;
        height: 48px;
        margin: 0 auto 16px;
        background: linear-gradient(135deg, #3b82f6, #8b5cf6);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 20px;
        animation: pulse 2s infinite;
      }

      @keyframes pulse {
        0%, 100% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.05); opacity: 0.8; }
      }

      .export-progress-title {
        font-weight: 600;
        color: #1f2937;
        margin-bottom: 8px;
      }

      .export-progress-message {
        color: #6b7280;
        font-size: 14px;
        margin-bottom: 16px;
      }

      .export-progress-bar {
        height: 4px;
        background: #e5e7eb;
        border-radius: 2px;
        overflow: hidden;
        margin-bottom: 8px;
      }

      .export-progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #3b82f6, #8b5cf6);
        border-radius: 2px;
        transition: width 0.3s ease;
      }

      .export-progress-percentage {
        font-size: 12px;
        color: #6b7280;
      }

      /* High Quality Badge */
      .hq-badge {
        background: linear-gradient(135deg, #10b981, #059669);
        color: white;
        font-size: 10px;
        font-weight: 600;
        padding: 2px 6px;
        border-radius: 4px;
        margin-left: 4px;
      }

      /* Mobile Optimizations */
      @media (max-width: 768px) {
        .export-menu {
          right: -50px;
          min-width: 180px;
        }
        
        .export-option {
          padding: 10px 12px;
        }
        
        .export-progress {
          min-width: 260px;
          padding: 20px;
        }
      }
    `;
    document.head.appendChild(styles);
  }

  /**
   * Load external libraries for advanced export functionality
   */
  async loadExternalLibraries() {
    try {
      // Load html2canvas for high-quality PNG exports
      if (!window.html2canvas) {
        await this.loadScript('https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js');
      }

      // Load jsPDF for PDF exports
      if (!window.jspdf) {
        await this.loadScript('https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js');
        window.jsPDF = window.jspdf.jsPDF;
      }

      // Load Canvas2SVG for SVG exports
      if (!window.Canvas2SVG) {
        await this.loadScript('https://cdn.jsdelivr.net/npm/canvas2svg@1.0.19/canvas2svg.js');
      }

      console.log('✅ Export libraries loaded successfully');
    } catch (error) {
      console.error('❌ Failed to load export libraries:', error);
    }
  }

  /**
   * Load script dynamically
   */
  loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  /**
   * Create export button with menu
   */
  createExportButton(chartContainer, options = {}) {
    const {
      position = 'top-right',
      showHighQuality = true,
      formats = this.exportFormats
    } = options;

    const buttonId = `export-btn-${Date.now()}`;
    const menuId = `export-menu-${Date.now()}`;

    // Create export button
    const buttonHTML = `
      <div class="export-button-container" style="position: absolute; ${this.getPositionStyle(position)}; z-index: 100;">
        <button id="${buttonId}" class="export-button" onclick="chartExport.toggleExportMenu('${menuId}')">
          <i class="fas fa-download"></i>
          Export
          <i class="fas fa-chevron-down" style="font-size: 12px;"></i>
        </button>
        
        <div id="${menuId}" class="export-menu">
          <div class="export-menu-header">
            Export Chart
          </div>
          
          ${formats.map(format => this.createExportOption(format, showHighQuality)).join('')}
        </div>
      </div>
    `;

    // Add to container
    chartContainer.style.position = 'relative';
    chartContainer.insertAdjacentHTML('beforeend', buttonHTML);

    // Setup click outside to close menu
    this.setupClickOutside(menuId, buttonId);

    return { buttonId, menuId };
  }

  /**
   * Create export option HTML
   */
  createExportOption(format, showHighQuality) {
    const formatInfo = {
      png: {
        icon: 'fa-image',
        title: 'PNG Image',
        description: 'High-quality raster image',
        hq: showHighQuality
      },
      svg: {
        icon: 'fa-vector-square',
        title: 'SVG Vector',
        description: 'Scalable vector graphics',
        hq: false
      },
      jpg: {
        icon: 'fa-file-image',
        title: 'JPG Image',
        description: 'Compressed image format',
        hq: showHighQuality
      },
      pdf: {
        icon: 'fa-file-pdf',
        title: 'PDF Document',
        description: 'Portable document format',
        hq: false
      }
    };

    const info = formatInfo[format] || formatInfo.png;
    
    return `
      <div class="export-option" onclick="chartExport.exportChart('${format}')">
        <div class="export-option-icon">
          <i class="fas ${info.icon}"></i>
        </div>
        <div class="export-option-content">
          <div class="export-option-title">
            ${info.title}
            ${info.hq ? '<span class="hq-badge">HQ</span>' : ''}
          </div>
          <div class="export-option-description">${info.description}</div>
        </div>
      </div>
    `;
  }

  /**
   * Get position style for button
   */
  getPositionStyle(position) {
    const positions = {
      'top-right': 'top: 12px; right: 12px;',
      'top-left': 'top: 12px; left: 12px;',
      'bottom-right': 'bottom: 12px; right: 12px;',
      'bottom-left': 'bottom: 12px; left: 12px;'
    };
    return positions[position] || positions['top-right'];
  }

  /**
   * Toggle export menu
   */
  toggleExportMenu(menuId) {
    const menu = document.getElementById(menuId);
    if (menu) {
      menu.classList.toggle('show');
    }
  }

  /**
   * Setup click outside to close menu
   */
  setupClickOutside(menuId, buttonId) {
    const handleClickOutside = (event) => {
      const menu = document.getElementById(menuId);
      const button = document.getElementById(buttonId);
      
      if (menu && !menu.contains(event.target) && !button.contains(event.target)) {
        menu.classList.remove('show');
      }
    };

    document.addEventListener('click', handleClickOutside);
  }

  /**
   * Export chart in specified format
   */
  async exportChart(format, options = {}) {
    const {
      quality = this.defaultQuality,
      scale = this.defaultScale,
      filename = `chart-${Date.now()}`
    } = options;

    try {
      // Show progress
      this.showExportProgress(format);

      // Find the active chart
      const chart = this.findActiveChart();
      if (!chart) {
        throw new Error('No active chart found');
      }

      let result;

      switch (format.toLowerCase()) {
        case 'png':
          result = await this.exportToPNG(chart, { quality, scale, filename });
          break;
        case 'svg':
          result = await this.exportToSVG(chart, { filename });
          break;
        case 'jpg':
          result = await this.exportToJPG(chart, { quality, scale, filename });
          break;
        case 'pdf':
          result = await this.exportToPDF(chart, { filename });
          break;
        default:
          throw new Error(`Unsupported export format: ${format}`);
      }

      // Hide progress
      this.hideExportProgress();

      // Show success feedback
      this.showExportSuccess(format, result.filename);

      return result;

    } catch (error) {
      this.hideExportProgress();
      this.showExportError(error);
      throw error;
    }
  }

  /**
   * Find the active chart instance
   */
  findActiveChart() {
    // Try to find chart in global scope
    if (window.chart) return window.chart;
    
    // Try to find chart in chart renderer
    if (window.chartRenderer && window.chartRenderer.charts.size > 0) {
      return window.chartRenderer.charts.values().next().value;
    }

    // Try to find chart by canvas element
    const canvas = document.querySelector('canvas');
    if (canvas && canvas.chart) {
      return canvas.chart;
    }

    return null;
  }

  /**
   * Export to PNG with high-resolution support
   */
  async exportToPNG(chart, options) {
    const { quality, scale, filename } = options;

    // Update progress
    this.updateExportProgress(25, 'Preparing canvas...');

    // Create a temporary canvas for high-resolution export
    const originalCanvas = chart.canvas;
    const tempCanvas = document.createElement('canvas');
    const ctx = tempCanvas.getContext('2d');

    // Set high resolution dimensions
    tempCanvas.width = originalCanvas.width * scale;
    tempCanvas.height = originalCanvas.height * scale;

    // Scale context for high resolution
    ctx.scale(scale, scale);

    // Update progress
    this.updateExportProgress(50, 'Rendering high-quality image...');

    // Redraw chart at high resolution
    const originalOptions = chart.options;
    chart.options.animation = false; // Disable animation for export
    chart.render();

    // Draw the chart to temporary canvas
    ctx.drawImage(originalCanvas, 0, 0);

    // Update progress
    this.updateExportProgress(75, 'Generating file...');

    // Convert to blob and download
    return new Promise((resolve, reject) => {
      tempCanvas.toBlob((blob) => {
        if (blob) {
          this.downloadBlob(blob, `${filename}.png`);
          resolve({ filename: `${filename}.png`, size: blob.size });
        } else {
          reject(new Error('Failed to generate PNG blob'));
        }
      }, 'image/png', quality);
    });
  }

  /**
   * Export to SVG vector format
   */
  async exportToSVG(chart, options) {
    const { filename } = options;

    this.updateExportProgress(25, 'Preparing SVG export...');

    if (!window.Canvas2SVG) {
      throw new Error('Canvas2SVG library not loaded');
    }

    // Create SVG context
    const tempCanvas = document.createElement('canvas');
    const svgCtx = new window.Canvas2SVG(tempCanvas, {
      width: chart.canvas.width,
      height: chart.canvas.height
    });

    this.updateExportProgress(50, 'Rendering SVG...');

    // Clone chart configuration and render to SVG
    const chartConfig = chart.config;
    chartConfig.options.animation = false;
    
    const svgChart = new Chart(svgCtx, chartConfig);

    this.updateExportProgress(75, 'Generating SVG file...');

    // Get SVG string and download
    const svgString = svgCtx.getSerializedSvg();
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    
    this.downloadBlob(blob, `${filename}.svg`);
    
    // Cleanup
    svgChart.destroy();

    return { filename: `${filename}.svg`, size: blob.size };
  }

  /**
   * Export to JPG format
   */
  async exportToJPG(chart, options) {
    const { quality, scale, filename } = options;

    this.updateExportProgress(25, 'Preparing JPG export...');

    // Similar to PNG but with white background
    const originalCanvas = chart.canvas;
    const tempCanvas = document.createElement('canvas');
    const ctx = tempCanvas.getContext('2d');

    tempCanvas.width = originalCanvas.width * scale;
    tempCanvas.height = originalCanvas.height * scale;

    // Add white background for JPG
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

    ctx.scale(scale, scale);

    this.updateExportProgress(50, 'Rendering JPG image...');

    ctx.drawImage(originalCanvas, 0, 0);

    this.updateExportProgress(75, 'Generating JPG file...');

    return new Promise((resolve, reject) => {
      tempCanvas.toBlob((blob) => {
        if (blob) {
          this.downloadBlob(blob, `${filename}.jpg`);
          resolve({ filename: `${filename}.jpg`, size: blob.size });
        } else {
          reject(new Error('Failed to generate JPG blob'));
        }
      }, 'image/jpeg', quality);
    });
  }

  /**
   * Export to PDF format
   */
  async exportToPDF(chart, options) {
    const { filename } = options;

    this.updateExportProgress(25, 'Preparing PDF export...');

    if (!window.jsPDF) {
      throw new Error('jsPDF library not loaded');
    }

    // First export as PNG
    const pngResult = await this.exportToPNG(chart, {
      ...options,
      filename: 'temp-pdf-export'
    });

    this.updateExportProgress(50, 'Creating PDF document...');

    // Create PDF
    const pdf = new window.jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [chart.canvas.width, chart.canvas.height]
    });

    this.updateExportProgress(75, 'Adding chart to PDF...');

    // Add PNG to PDF
    const imgData = chart.canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 0, 0, chart.canvas.width, chart.canvas.height);

    // Save PDF
    pdf.save(`${filename}.pdf`);

    return { filename: `${filename}.pdf`, size: pdf.output().length };
  }

  /**
   * Download blob to user's device
   */
  downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Cleanup
    setTimeout(() => URL.revokeObjectURL(url), 100);
  }

  /**
   * Show export progress dialog
   */
  showExportProgress(format) {
    const progressHTML = `
      <div class="export-progress" id="export-progress">
        <div class="export-progress-icon">
          <i class="fas fa-download"></i>
        </div>
        <div class="export-progress-title">Exporting ${format.toUpperCase()}</div>
        <div class="export-progress-message">Preparing your chart export...</div>
        <div class="export-progress-bar">
          <div class="export-progress-fill" id="export-progress-fill" style="width: 0%"></div>
        </div>
        <div class="export-progress-percentage" id="export-progress-percentage">0%</div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', progressHTML);
  }

  /**
   * Update export progress
   */
  updateExportProgress(percentage, message) {
    const fillElement = document.getElementById('export-progress-fill');
    const percentageElement = document.getElementById('export-progress-percentage');
    const messageElement = document.querySelector('.export-progress-message');

    if (fillElement) fillElement.style.width = `${percentage}%`;
    if (percentageElement) percentageElement.textContent = `${percentage}%`;
    if (messageElement) messageElement.textContent = message;
  }

  /**
   * Hide export progress dialog
   */
  hideExportProgress() {
    const progressElement = document.getElementById('export-progress');
    if (progressElement) {
      progressElement.remove();
    }
  }

  /**
   * Show export success notification
   */
  showExportSuccess(format, filename) {
    // Use existing feedback system if available
    if (window.feedbackSystem) {
      window.feedbackSystem.showSuccess(
        'Export Complete',
        `${format.toUpperCase()} file "${filename}" downloaded successfully`
      );
    } else {
      // Fallback notification
      console.log(`✅ Export complete: ${filename}`);
    }
  }

  /**
   * Show export error
   */
  showExportError(error) {
    if (window.feedbackSystem) {
      window.feedbackSystem.showError(
        'Export Failed',
        error.message
      );
    } else {
      console.error('❌ Export failed:', error);
    }
  }

  /**
   * Get available export formats
   */
  getAvailableFormats() {
    return [...this.exportFormats];
  }

  /**
   * Check if format is supported
   */
  isFormatSupported(format) {
    return this.exportFormats.includes(format.toLowerCase());
  }

  /**
   * Export with custom options
   */
  async exportWithCustomOptions(chart, customOptions) {
    const {
      format = 'png',
      quality = this.defaultQuality,
      scale = this.defaultScale,
      filename = `chart-${Date.now()}`,
      backgroundColor = '#ffffff',
      ...options
    } = customOptions;

    return this.exportChart(format, {
      quality,
      scale,
      filename,
      backgroundColor,
      ...options
    });
  }
}

// Export singleton instance
export const chartExport = new ChartExportService();

// Make available globally
window.chartExport = chartExport;

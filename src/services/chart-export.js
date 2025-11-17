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

      console.log('[export] Libraries loaded successfully');
    } catch (error) {
      console.error('[export] Failed to load export libraries:', error);
    }
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

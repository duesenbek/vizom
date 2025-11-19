/**
 * Chart Export Utility - Handles PNG/SVG/CSV/PDF export with watermark support
 */

export class ChartExporter {
  constructor() {
    this.isPremium = false;
    this.dailyLimit = 3;
    this.todayExports = 0;
    this.watermarkText = 'VIZOM.AI';
  }

  /**
   * Initialize exporter with user data
   * @param {Object} userData - User authentication data
   */
  async initialize(userData = null) {
    if (userData && userData.subscription !== 'free') {
      this.isPremium = true;
    }
    
    // Load today's export count from localStorage
    const today = new Date().toDateString();
    const storedData = localStorage.getItem('vizom_export_stats');
    
    if (storedData) {
      const stats = JSON.parse(storedData);
      if (stats.date === today) {
        this.todayExports = stats.count;
      } else {
        // Reset for new day
        this.todayExports = 0;
        this.saveExportStats();
      }
    }
  }

  /**
   * Check if user can export more charts
   * @returns {boolean} True if export is allowed
   */
  canExport() {
    if (this.isPremium) return true;
    return this.todayExports < this.dailyLimit;
  }

  /**
   * Get remaining exports for free tier
   * @returns {number} Remaining exports
   */
  getRemainingExports() {
    if (this.isPremium) return Infinity;
    return Math.max(0, this.dailyLimit - this.todayExports);
  }

  /**
   * Show export limits notice
   */
  showLimitsNotice() {
    if (this.isPremium) return;

    const remaining = this.getRemainingExports();
    const notice = document.createElement('div');
    notice.className = 'export-notice brand-notice rounded-xl p-4 mb-4 flex items-center justify-between shadow-sm';
    notice.innerHTML = `
      <div class="flex items-center gap-3">
        <i class="fas fa-info-circle brand-notice-icon"></i>
        <div>
          <p class="text-sm font-medium brand-text-primary">
            Free tier: ${remaining} of ${this.dailyLimit} daily exports remaining
          </p>
          <p class="text-xs brand-text-secondary">
            Upgrade to Premium for unlimited exports and no watermarks
          </p>
        </div>
      </div>
      <button onclick="window.location.href='pricing.html'" class="text-sm inline-flex items-center gap-2 brand-button-primary px-4 py-2 rounded-lg transition-colors">
        Upgrade
      </button>
    `;

    // Insert notice at the top of export section
    const exportSection = document.querySelector('.export-section') || document.querySelector('.preview-panel');
    if (exportSection) {
      exportSection.insertBefore(notice, exportSection.firstChild);
    }

    // Auto-remove after 10 seconds
    setTimeout(() => {
      if (notice.parentNode) {
        notice.remove();
      }
    }, 10000);
  }

  /**
   * Save export statistics
   */
  saveExportStats() {
    const today = new Date().toDateString();
    const stats = {
      date: today,
      count: this.todayExports
    };
    localStorage.setItem('vizom_export_stats', JSON.stringify(stats));
  }

  /**
   * Add watermark to canvas
   * @param {HTMLCanvasElement} canvas - Canvas element
   */
  addWatermark(canvas) {
    if (this.isPremium) return canvas;

    const ctx = canvas.getContext('2d');
    const originalData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    // Create watermark
    ctx.font = 'bold 16px Arial';
    ctx.fillStyle = 'rgba(0, 52, 102, 0.7)';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';
    
    // Add watermark in bottom right corner
    const padding = 10;
    ctx.fillText(this.watermarkText, canvas.width - padding, canvas.height - padding);
    
    return canvas;
  }

  /**
   * Export chart as PNG
   * @param {HTMLCanvasElement|string} source - Canvas element or chart container
   * @param {string} filename - Output filename
   */
  async exportPNG(source, filename = 'chart.png') {
    if (!this.canExport()) {
      this.showLimitsNotice();
      throw new Error('Daily export limit exceeded');
    }

    try {
      let downloadUrl = '';
      let canvas = null;

      // Prefer Chart.js toBase64Image when available
      if (source && typeof source.toBase64Image === 'function') {
        const base64 = source.toBase64Image('image/png', 1.0);
        if (!base64) {
          throw new Error('Chart.js toBase64Image() returned empty data');
        }

        const img = new Image();
        img.src = base64;

        await new Promise((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () => reject(new Error('Failed to load chart image for PNG export'));
        });

        canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          throw new Error('Canvas context not available for PNG export');
        }

        ctx.drawImage(img, 0, 0, img.width, img.height);
        const finalCanvas = this.addWatermark(canvas);
        downloadUrl = finalCanvas.toDataURL('image/png');
      } else {
        // Fallback: use canvas or html2canvas on DOM elements
        if (source instanceof HTMLCanvasElement) {
          canvas = source;
        } else {
          const html2canvasModule = await import('html2canvas');
          const html2canvas = html2canvasModule.default || html2canvasModule;
          canvas = await html2canvas(source, {
            backgroundColor: '#ffffff',
            scale: 2
          });
        }

        const finalCanvas = this.addWatermark(canvas);
        downloadUrl = finalCanvas.toDataURL('image/png');
      }

      if (!downloadUrl) {
        throw new Error('PNG export produced empty output');
      }

      const link = document.createElement('a');
      link.download = filename;
      link.href = downloadUrl;
      link.click();

      // Update stats
      this.todayExports++;
      this.saveExportStats();

      return { success: true, filename };
    } catch (error) {
      console.error('PNG export failed:', error);
      throw error;
    }
  }

  /**
   * Export chart as SVG
   * @param {Object} chartInstance - Chart.js instance
   * @param {string} filename - Output filename
   */
  async exportSVG(chartInstance, filename = 'chart.svg') {
    if (!this.canExport()) {
      this.showLimitsNotice();
      throw new Error('Daily export limit exceeded');
    }

    try {
      let svgString = '';

      const isChartJsInstance = chartInstance && typeof chartInstance.toBase64Image === 'function';

      // Try vector export via canvas2svg when possible
      if (isChartJsInstance && chartInstance.canvas) {
        try {
          const c2sModule = await import('canvas2svg');
          const Canvas2SVG = c2sModule.default || c2sModule.Canvas2SVG;

          if (typeof Canvas2SVG === 'function') {
            const virtualCanvas = new Canvas2SVG({
              width: chartInstance.width,
              height: chartInstance.height
            });

            const originalCanvas = chartInstance.canvas;
            chartInstance.canvas = virtualCanvas;
            if (typeof chartInstance.render === 'function') {
              chartInstance.render();
            } else if (typeof chartInstance.draw === 'function') {
              chartInstance.draw();
            } else if (typeof chartInstance.update === 'function') {
              chartInstance.update();
            }
            chartInstance.canvas = originalCanvas;

            svgString = virtualCanvas.getSerializedSvg();
          }
        } catch (vectorError) {
          console.warn('Vector SVG export failed, falling back to rasterized SVG:', vectorError);
        }
      }

      // Fallback: rasterize to PNG and embed in an SVG wrapper
      if (!svgString) {
        let element = null;

        if (isChartJsInstance && chartInstance.canvas instanceof HTMLElement) {
          element = chartInstance.canvas;
        } else if (chartInstance instanceof HTMLElement) {
          element = chartInstance;
        } else {
          throw new Error('Unsupported source for SVG export');
        }

        const html2canvasModule = await import('html2canvas');
        const html2canvas = html2canvasModule.default || html2canvasModule;
        const canvas = await html2canvas(element, {
          backgroundColor: '#ffffff',
          scale: 2
        });

        const dataUrl = canvas.toDataURL('image/png');
        svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}">` +
                    `<image href="${dataUrl}" width="${canvas.width}" height="${canvas.height}" /></svg>`;
      }

      // Add watermark for free users
      if (!this.isPremium && svgString.includes('</svg>')) {
        const watermark = `<text x="95%" y="95%" text-anchor="end" font-family="Arial" font-size="16" font-weight="bold" fill="rgba(0, 52, 102, 0.7)">VIZOM.AI</text>`;
        svgString = svgString.replace('</svg>', `${watermark}</svg>`);
      }

      const blob = new Blob([svgString], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = filename;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);

      // Update stats
      this.todayExports++;
      this.saveExportStats();

      return { success: true, filename };
    } catch (error) {
      console.error('SVG export failed:', error);
      throw error;
    }
  }

  /**
   * Export chart data as CSV
   * @param {Array|Object} data - Chart data
   * @param {string} filename - Output filename
   */
  async exportCSV(data, filename = 'chart-data.csv') {
    if (!this.canExport()) {
      this.showLimitsNotice();
      throw new Error('Daily export limit exceeded');
    }

    try {
      let csvContent = '';
      
      if (Array.isArray(data)) {
        // Handle array data
        const headers = Object.keys(data[0] || {});
        csvContent = headers.join(',') + '\n';
        
        data.forEach(row => {
          const values = headers.map(header => {
            const value = row[header];
            return typeof value === 'string' && value.includes(',') 
              ? `"${value}"` 
              : value;
          });
          csvContent += values.join(',') + '\n';
        });
      } else {
        // Handle chart.js data format
        if (data.labels && data.datasets) {
          csvContent = 'Label,' + data.datasets.map(d => d.label).join(',') + '\n';
          
          data.labels.forEach((label, index) => {
            const row = [label];
            data.datasets.forEach(dataset => {
              row.push(dataset.data[index] || '');
            });
            csvContent += row.join(',') + '\n';
          });
        }
      }

      // Add watermark comment for free users
      if (!this.isPremium) {
        csvContent = `# Generated by VIZOM.AI\n${csvContent}`;
      }

      // Download
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = filename;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);

      // Update stats
      this.todayExports++;
      this.saveExportStats();

      return { success: true, filename };
    } catch (error) {
      console.error('CSV export failed:', error);
      throw error;
    }
  }

  /**
   * Export chart as PDF
   * @param {HTMLCanvasElement|string} source - Canvas element or chart container
   * @param {string} filename - Output filename
   */
  async exportPDF(source, filename = 'chart.pdf') {
    if (!this.canExport()) {
      this.showLimitsNotice();
      throw new Error('Daily export limit exceeded');
    }

    try {
      const { jsPDF } = await import('jspdf');
      
      let canvas;
      
      if (source instanceof HTMLCanvasElement) {
        canvas = source;
      } else {
        const html2canvas = await import('html2canvas');
        canvas = await html2canvas.default(source, {
          backgroundColor: '#ffffff',
          scale: 2
        });
      }

      // Add watermark for free users
      const finalCanvas = this.addWatermark(canvas);
      
      // Create PDF
      const imgData = finalCanvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      
      // Add watermark text for free users
      if (!this.isPremium) {
        pdf.setFontSize(12);
        pdf.setTextColor(0, 52, 102);
        pdf.text(this.watermarkText, canvas.width - 20, canvas.height - 10, { align: 'right' });
      }

      // Download
      pdf.save(filename);

      // Update stats
      this.todayExports++;
      this.saveExportStats();

      return { success: true, filename };
    } catch (error) {
      console.error('PDF export failed:', error);
      throw error;
    }
  }

  /**
   * Create export dropdown UI
   * @param {Function} onExport - Callback for export actions
   * @returns {HTMLElement} Export dropdown element
   */
  createExportUI(onExport) {
    const container = document.createElement('div');
    container.className = 'export-dropdown relative';
    
    container.innerHTML = `
      <button class="export-btn brand-button-primary px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
        <i class="fas fa-download"></i>
        <span>Export</span>
        <i class="fas fa-chevron-down text-xs"></i>
      </button>
      <div class="export-menu hidden absolute top-full left-0 mt-2 brand-dropdown z-50 min-w-[160px]">
        <button class="export-option brand-dropdown-option w-full text-left px-4 py-2 flex items-center gap-3" data-format="png">
          <i class="fas fa-image brand-icon-secondary"></i>
          <span>PNG Image</span>
        </button>
        <button class="export-option brand-dropdown-option w-full text-left px-4 py-2 flex items-center gap-3" data-format="svg">
          <i class="fas fa-vector-square brand-icon-secondary"></i>
          <span>SVG Vector</span>
        </button>
        <button class="export-option brand-dropdown-option w-full text-left px-4 py-2 flex items-center gap-3" data-format="csv">
          <i class="fas fa-table brand-icon-secondary"></i>
          <span>CSV Data</span>
        </button>
        <button class="export-option brand-dropdown-option w-full text-left px-4 py-2 flex items-center gap-3" data-format="pdf">
          <i class="fas fa-file-pdf brand-icon-secondary"></i>
          <span>PDF Document</span>
        </button>
      </div>
    `;

    // Toggle dropdown
    const exportBtn = container.querySelector('.export-btn');
    const exportMenu = container.querySelector('.export-menu');
    
    exportBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      exportMenu.classList.toggle('hidden');
    });

    // Handle export options
    const exportOptions = container.querySelectorAll('.export-option');
    exportOptions.forEach(option => {
      option.addEventListener('click', (e) => {
        e.stopPropagation();
        const format = option.dataset.format;
        exportMenu.classList.add('hidden');
        onExport(format);
      });
    });

    // Close on outside click
    document.addEventListener('click', () => {
      exportMenu.classList.add('hidden');
    });

    return container;
  }
}

// Export singleton instance
export const chartExporter = new ChartExporter();

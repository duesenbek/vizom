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
    notice.className = 'export-notice bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 flex items-center justify-between';
    notice.innerHTML = `
      <div class="flex items-center gap-3">
        <i class="fas fa-info-circle text-blue-600"></i>
        <div>
          <p class="text-sm font-medium text-blue-900">
            Free tier: ${remaining} of ${this.dailyLimit} daily exports remaining
          </p>
          <p class="text-xs text-blue-700">
            Upgrade to Premium for unlimited exports and no watermarks
          </p>
        </div>
      </div>
      <button onclick="window.location.href='pricing.html'" class="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
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
      let canvas;
      
      if (source instanceof HTMLCanvasElement) {
        canvas = source;
      } else {
        // Use html2canvas for DOM elements
        const html2canvas = await import('html2canvas');
        canvas = await html2canvas.default(source, {
          backgroundColor: '#ffffff',
          scale: 2
        });
      }

      // Add watermark for free users
      const finalCanvas = this.addWatermark(canvas);
      
      // Download
      const link = document.createElement('a');
      link.download = filename;
      link.href = finalCanvas.toDataURL('image/png');
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
      // Use canvas2svg for SVG export
      const { Canvas2SVG } = await import('canvas2svg');
      
      const canvas = new Canvas2SVG({
        width: chartInstance.width,
        height: chartInstance.height
      });

      // Redraw chart on SVG canvas
      const originalCanvas = chartInstance.canvas;
      chartInstance.canvas = canvas;
      chartInstance.render();
      chartInstance.canvas = originalCanvas;

      let svgString = canvas.getSerializedSvg();
      
      // Add watermark for free users
      if (!this.isPremium) {
        const watermark = `<text x="${chartInstance.width - 10}" y="${chartInstance.height - 10}" 
                          text-anchor="end" font-family="Arial" font-size="16" font-weight="bold" 
                          fill="rgba(0, 52, 102, 0.7)">VIZOM.AI</text>`;
        svgString = svgString.replace('</svg>', watermark + '</svg>');
      }

      // Download
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
      <button class="export-btn bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
        <i class="fas fa-download"></i>
        <span>Export</span>
        <i class="fas fa-chevron-down text-xs"></i>
      </button>
      <div class="export-menu hidden absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[160px]">
        <button class="export-option w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-3" data-format="png">
          <i class="fas fa-image text-gray-600"></i>
          <span>PNG Image</span>
        </button>
        <button class="export-option w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-3" data-format="svg">
          <i class="fas fa-vector-square text-gray-600"></i>
          <span>SVG Vector</span>
        </button>
        <button class="export-option w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-3" data-format="csv">
          <i class="fas fa-table text-gray-600"></i>
          <span>CSV Data</span>
        </button>
        <button class="export-option w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-3" data-format="pdf">
          <i class="fas fa-file-pdf text-gray-600"></i>
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

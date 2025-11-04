/**
 * Export Manager Module
 * Handles exporting charts to various formats (PNG, PDF, CSV, SVG)
 */

import { downloadFile } from '../utils.js';

export class ExportManager {
  constructor(container) {
    this.container = container;
  }

  /**
   * Export as PNG using html2canvas
   */
  async exportPNG(filename = 'vizom-chart') {
    if (typeof html2canvas === 'undefined') {
      throw new Error('html2canvas library not loaded');
    }

    try {
      // Get the element to export
      const element = this.getExportElement();
      
      // Capture with html2canvas
      const canvas = await html2canvas(element, {
        backgroundColor: '#ffffff',
        scale: 2, // Higher quality
        logging: false,
        useCORS: true,
        allowTaint: true,
      });

      // Convert to blob and download
      return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${filename}-${Date.now()}.png`;
            a.click();
            URL.revokeObjectURL(url);
            resolve();
          } else {
            reject(new Error('Failed to create PNG blob'));
          }
        }, 'image/png');
      });
    } catch (error) {
      console.error('PNG export error:', error);
      throw new Error(`PNG export failed: ${error.message}`);
    }
  }

  /**
   * Export as PDF using jsPDF
   */
  async exportPDF(filename = 'vizom-chart') {
    if (typeof jspdf === 'undefined') {
      throw new Error('jsPDF library not loaded');
    }

    try {
      const element = this.getExportElement();
      
      // First convert to canvas
      const canvas = await html2canvas(element, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
      });

      // Create PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jspdf.jsPDF({
        orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height],
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`${filename}-${Date.now()}.pdf`);
    } catch (error) {
      console.error('PDF export error:', error);
      throw new Error(`PDF export failed: ${error.message}`);
    }
  }

  /**
   * Export as CSV
   */
  exportCSV(data, filename = 'vizom-data') {
    try {
      let csv = '';

      if (Array.isArray(data) && data.length > 0) {
        // Extract headers
        const headers = Object.keys(data[0]);
        csv += headers.join(',') + '\n';

        // Add rows
        data.forEach(row => {
          const values = headers.map(header => {
            const value = row[header];
            // Escape commas and quotes
            if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
          });
          csv += values.join(',') + '\n';
        });
      } else if (typeof data === 'object') {
        // Convert object to CSV
        Object.entries(data).forEach(([key, value]) => {
          csv += `${key},${value}\n`;
        });
      }

      downloadFile(csv, `${filename}-${Date.now()}.csv`, 'text/csv');
    } catch (error) {
      console.error('CSV export error:', error);
      throw new Error(`CSV export failed: ${error.message}`);
    }
  }

  /**
   * Export as SVG
   */
  exportSVG(filename = 'vizom-chart') {
    try {
      const svg = this.container.querySelector('svg');
      
      if (!svg) {
        throw new Error('No SVG element found');
      }

      // Clone and serialize SVG
      const svgClone = svg.cloneNode(true);
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svgClone);

      // Add XML declaration and styling
      const fullSvg = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
${svgString}`;

      downloadFile(fullSvg, `${filename}-${Date.now()}.svg`, 'image/svg+xml');
    } catch (error) {
      console.error('SVG export error:', error);
      throw new Error(`SVG export failed: ${error.message}`);
    }
  }

  /**
   * Export as HTML
   */
  exportHTML(filename = 'vizom-chart') {
    try {
      const html = this.container.innerHTML;
      
      const fullHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>VIZOM Chart</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <style>
    body { 
      margin: 0; 
      padding: 2rem; 
      background: #f8fafc; 
      font-family: system-ui, -apple-system, sans-serif;
    }
  </style>
</head>
<body>
  ${html}
</body>
</html>`;

      downloadFile(fullHTML, `${filename}-${Date.now()}.html`, 'text/html');
    } catch (error) {
      console.error('HTML export error:', error);
      throw new Error(`HTML export failed: ${error.message}`);
    }
  }

  /**
   * Get the element to export
   */
  getExportElement() {
    // Try iframe first
    const iframe = this.container.querySelector('iframe');
    if (iframe) {
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      return iframeDoc.body;
    }
    
    // Otherwise use container
    return this.container;
  }

  /**
   * Export chart data for CSV
   */
  extractChartData() {
    const data = [];
    
    // Try to find Chart.js instances
    const canvases = this.container.querySelectorAll('canvas');
    canvases.forEach(canvas => {
      const chart = Chart.getChart(canvas);
      if (chart && chart.data) {
        const labels = chart.data.labels || [];
        const datasets = chart.data.datasets || [];
        
        // Create rows
        labels.forEach((label, index) => {
          const row = { label };
          datasets.forEach(dataset => {
            row[dataset.label || 'Value'] = dataset.data[index];
          });
          data.push(row);
        });
      }
    });

    // Fallback: try to extract from tables
    if (data.length === 0) {
      const table = this.container.querySelector('table');
      if (table) {
        const headers = Array.from(table.querySelectorAll('th')).map(th => th.textContent);
        const rows = table.querySelectorAll('tbody tr');
        
        rows.forEach(row => {
          const cells = row.querySelectorAll('td');
          const rowData = {};
          cells.forEach((cell, index) => {
            rowData[headers[index] || `Column${index + 1}`] = cell.textContent;
          });
          data.push(rowData);
        });
      }
    }

    return data;
  }
}

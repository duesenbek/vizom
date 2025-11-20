import { ChartExporter, chartExporter } from '../../../src/utils/ChartExporter.js';
import { exportChartToPDF } from '../../../src/utils/export-pdf.js';
import { trackEvent } from '../../../src/tracking/analytics.stub.js';

const noop = () => {};

export class ExportHandler {
   constructor(chartGenerator) {
      this.chartGenerator = chartGenerator;
      this.initializeExporter();
      this.setupExportMenu();
   }

   async initializeExporter() {
      try {
         const userData = await this.getUserData();
         await chartExporter.initialize(userData);

         if (!chartExporter.isPremium) {
            chartExporter.showLimitsNotice();
         }
      } catch (error) {
         console.warn('Failed to initialize exporter:', error);
      }
   }

   async getUserData() {
      try {
         const { authService } = await import('/src/services/authService.js');
         return await authService.getCurrentUser();
      } catch (error) {
         return null;
      }
   }

   setupExportMenu() {
      const controls = document.getElementById('export-controls');
      const menuButton = document.getElementById('export-menu-button');
      const menu = document.getElementById('export-menu');
      if (!controls || !menuButton || !menu) {
         return;
      }

      let isMenuOpen = false;

      const handleOutsideClick = (event) => {
         if (!controls.contains(event.target)) {
            closeMenu();
         }
      };

      const handleEscapeKey = (event) => {
         if (event.key === 'Escape') {
            closeMenu();
         }
      };

      const openMenu = () => {
         if (isMenuOpen) return;
         isMenuOpen = true;
         menu.classList.remove('hidden');
         requestAnimationFrame(() => {
            menu.classList.add('is-open');
         });
         menuButton.setAttribute('aria-expanded', 'true');
         document.addEventListener('click', handleOutsideClick);
         document.addEventListener('keydown', handleEscapeKey);
      };

      const closeMenu = () => {
         if (!isMenuOpen) return;
         isMenuOpen = false;
         menu.classList.remove('is-open');
         menuButton.setAttribute('aria-expanded', 'false');
         document.removeEventListener('click', handleOutsideClick);
         document.removeEventListener('keydown', handleEscapeKey);
      };

      menu.addEventListener('transitionend', (event) => {
         if (event.propertyName === 'opacity' && !isMenuOpen) {
            menu.classList.add('hidden');
         }
      });

      menu.addEventListener('click', (event) => event.stopPropagation());

      menuButton.addEventListener('click', (event) => {
         event.preventDefault();
         event.stopPropagation();
         if (isMenuOpen) {
            closeMenu();
         } else {
            openMenu();
         }
      });

      menu.querySelectorAll('.export-menu-option').forEach((option) => {
         option.addEventListener('click', (event) => {
            event.preventDefault();
            const format = option.dataset.format;
            closeMenu();
            if (format) {
               this.exportChart(format);
            }
         });
      });
   }

   exportChart(format) {
      const chart = this.chartGenerator?.currentChart;
      if (!chart) {
         this.showToast('Please generate a chart first.', 'warning');
         return;
      }

      switch (format) {
         case 'png':
            this.exportAsPNG(chart);
            break;
         case 'svg':
            this.exportAsSVG(chart);
            break;
         case 'pdf':
            this.exportAsPDF();
            break;
         default:
            this.showToast(`Exporting as ${format} is not yet implemented.`, 'info');
      }
   }

   exportAsPNG(chart) {
      const link = document.createElement('a');
      link.download = 'chart.png';
      link.href = chart.toBase64Image();
      link.click();
      try { trackEvent('chart_exported', { format: 'png' }); } catch {}
   }

   exportAsSVG(chart) {
      try {
         const svgData = chartExporter.toSVG(chart);
         if (!svgData) {
            this.showToast('SVG export is not available for this chart.', 'warning');
            return;
         }
         const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
         const url = URL.createObjectURL(blob);
         const link = document.createElement('a');
         link.href = url;
         link.download = 'chart.svg';
         link.click();
         URL.revokeObjectURL(url);
         try { trackEvent('chart_exported', { format: 'svg' }); } catch {}
      } catch (error) {
         console.error('SVG export failed:', error);
         this.showToast('Failed to export SVG.', 'error');
      }
   }

   exportAsPDF() {
      const container = document.getElementById('chart-container');
      exportChartToPDF(container, { filename: 'vizom-chart.pdf' })
         .then(() => { try { trackEvent('chart_exported', { format: 'pdf' }); } catch {} })
         .catch((error) => {
            console.error('PDF export failed:', error);
            this.showToast('Failed to export PDF.', 'error');
         });
   }

   showToast(message, type = 'info') {
      if (window.uiFeedback?.showToast) {
         window.uiFeedback.showToast(message, type);
      } else {
         console[type === 'error' ? 'error' : 'warn']('[toast]', message);
      }
   }
}


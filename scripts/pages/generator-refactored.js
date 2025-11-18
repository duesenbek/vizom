import { supabase } from '../../src/supabase-client.js';
import { ErrorTracker } from '../../src/tracking/error-tracking.js';
import { trackEvent } from '../../src/tracking/analytics.js';
import { ChartExporter } from '../../src/utils/ChartExporter.js';
import { exportChartToPDF } from '../../src/utils/export-pdf.js';
import { chartExporter } from '../../src/utils/ChartExporter.js';
import { AIRecommendations } from '../../src/components/AIRecommendations.js';
import { progressLoading } from '../../src/components/ProgressLoadingManager.js';
import { OptimizedChartTypeSelector } from '../../src/components/OptimizedChartTypeSelector.js';
import { simpleParse } from '../../src/utils/simple-parser.js';
import { showLoading as showGlobalLoading, hideLoading as hideGlobalLoading, showToast as showGlobalToast } from '../core/ui-feedback.js';

const noop = () => {};
const feedback = {
  showLoading: showGlobalLoading || noop,
  hideLoading: hideGlobalLoading || noop,
  showToast: showGlobalToast || ((message) => console.info('[toast]', message))
};

// Chart Generator Class
class ChartGenerator {
    constructor() {
        this.currentChart = null;
        this.currentChartType = 'bar';
        this.currentLibrary = 'auto';
        this.isPro = false;
        this.lastChartPayload = null;
        this.initializeEventListeners();
        this.selectChartType(this.currentChartType);
    }

    initializeEventListeners() {
        document.getElementById('generate-chart').addEventListener('click', () => {
            this.generateChart();
        });

        document.querySelectorAll('.chart-option').forEach(option => {
            option.addEventListener('click', () => {
                this.selectChartType(option.dataset.type);
            });
        });

        this.setupExportMenu();

        document.getElementById('refresh-preview').addEventListener('click', () => {
            this.refreshPreview();
        });

        document.getElementById('fullscreen-preview').addEventListener('click', () => {
            this.toggleFullscreen();
        });
    }

    setupExportMenu() {
        const controls = document.getElementById('export-controls');
        const menuButton = document.getElementById('export-menu-button');
        const menu = document.getElementById('export-menu');
        if (!controls || !menuButton || !menu) return;

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

    selectChartType(type) {
        if (!type) return;
        this.currentChartType = type;
        document.querySelectorAll('.chart-option').forEach(option => {
            const isActive = option.dataset.type === type;
            option.setAttribute('aria-pressed', String(isActive));
            option.classList.toggle('ring-2', isActive);
            option.classList.toggle('ring-blue-500', isActive);
            option.classList.toggle('border-blue-500', isActive);
            option.classList.toggle('border-slate-200', !isActive);
        });
        try { trackEvent('chart_type_selected', { chartType: type }); } catch {}
    }

    async generateChart() {
        const promptInput = document.getElementById('prompt-input');
        const prompt = promptInput?.value.trim() || '';

        if (!prompt) {
            feedback.showToast('Please enter a chart description.', 'error');
            return;
        }

        const loader = this.showLoading();

        try {
            const { labels, data } = simpleParse(prompt);

            if (labels.length === 0 || data.length === 0) {
                throw new Error('Could not parse data from your prompt.');
            }

            const chartConfig = {
                type: this.currentChartType,
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'My Dataset',
                        data: data,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                }
            };

            this.renderChart(chartConfig);
            this.lastChartPayload = { prompt, chartConfig };

        } catch (error) {
            feedback.showToast(error.message, 'error');
        } finally {
            loader.hide();
        }
    }

    renderChart(data) {
        const container = document.getElementById('chart-container');
        container.innerHTML = '<canvas></canvas>';
        const canvas = container.querySelector('canvas');
        if (!canvas) return;

        if (this.currentChart) {
            this.currentChart.destroy();
        }

        this.currentChart = new Chart(canvas, data);
    }

    exportChart(format) {
        if (!this.currentChart) {
            feedback.showToast('Please generate a chart first.', 'warning');
            return;
        }

        switch (format) {
            case 'png':
                this.exportAsPNG();
                break;
            case 'pdf':
                this.exportAsPDF();
                break;
            default:
                feedback.showToast(`Exporting as ${format} is not yet implemented.`, 'info');
        }
    }

    exportAsPNG() {
        const link = document.createElement('a');
        link.download = 'chart.png';
        link.href = this.currentChart.toBase64Image();
        link.click();
        trackEvent('chart_exported', { format: 'png' });
    }

    exportAsPDF() {
        const container = document.getElementById('chart-container');
        exportChartToPDF(container, { filename: 'vizom-chart.pdf' })
            .then(() => { trackEvent('chart_exported', { format: 'pdf' }); })
            .catch((error) => {
                ErrorTracker.trackError(error, { context: 'pdf-export' });
                feedback.showToast('Failed to export PDF.', 'error');
            });
    }

    refreshPreview() {
        if (this.lastChartPayload) {
            this.renderChart(this.lastChartPayload.chartConfig);
        }
    }

    toggleFullscreen() {
        const container = document.getElementById('chart-container');
        if (!document.fullscreenElement) {
            container.requestFullscreen().catch(err => {
                feedback.showToast(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`, 'error');
            });
        } else {
            document.exitFullscreen();
        }
    }

    showLoading() {
        const overlay = document.getElementById('loading-overlay');
        if(overlay) overlay.classList.remove('hidden');
        return { hide: () => this.hideLoading() };
    }

    hideLoading() {
        const overlay = document.getElementById('loading-overlay');
        if(overlay) overlay.classList.add('hidden');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.chartGenerator = new ChartGenerator();
});

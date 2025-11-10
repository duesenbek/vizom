/**
 * Chart Copy to Clipboard Utility
 * Allows users to copy chart data or image to clipboard
 */

class ChartClipboard {
  constructor() {
    this.init();
  }

  init() {
    this.addCopyButtonStyles();
    this.setupGlobalCopyHandler();
  }

  addCopyButtonStyles() {
    const styles = `
      <style>
        .chart-copy-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          padding: 8px 12px;
          font-size: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s ease;
          z-index: 10;
          backdrop-filter: blur(4px);
        }

        .chart-copy-btn:hover {
          background: white;
          border-color: #6366f1;
          color: #6366f1;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.15);
        }

        .chart-copy-btn.copied {
          background: #10b981;
          color: white;
          border-color: #10b981;
        }

        .chart-copy-btn .icon {
          font-size: 14px;
        }

        .chart-container {
          position: relative;
        }

        .copy-tooltip {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 5px;
          background: #1f2937;
          color: white;
          padding: 6px 10px;
          border-radius: 4px;
          font-size: 12px;
          white-space: nowrap;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.2s ease;
        }

        .copy-tooltip.show {
          opacity: 1;
        }
      </style>
    `;
    document.head.insertAdjacentHTML('beforeend', styles);
  }

  addCopyButton(chartContainer, chartData, chartInstance) {
    // Remove existing copy button if any
    const existingBtn = chartContainer.querySelector('.chart-copy-btn');
    if (existingBtn) existingBtn.remove();

    const copyButton = document.createElement('div');
    copyButton.className = 'chart-copy-btn';
    copyButton.innerHTML = `
      <i class="fas fa-copy icon"></i>
      <span>Copy</span>
      <div class="copy-tooltip">Click to copy chart data</div>
    `;

    // Add click handlers
    copyButton.addEventListener('click', (e) => {
      e.stopPropagation();
      this.showCopyMenu(copyButton, chartData, chartInstance);
    });

    // Show tooltip on hover
    copyButton.addEventListener('mouseenter', () => {
      copyButton.querySelector('.copy-tooltip').classList.add('show');
    });

    copyButton.addEventListener('mouseleave', () => {
      copyButton.querySelector('.copy-tooltip').classList.remove('show');
    });

    chartContainer.appendChild(copyButton);
  }

  showCopyMenu(button, chartData, chartInstance) {
    // Create dropdown menu
    const menu = document.createElement('div');
    menu.className = 'copy-menu';
    menu.innerHTML = `
      <div class="copy-menu-item" data-action="data">
        <i class="fas fa-table"></i> Copy Data
      </div>
      <div class="copy-menu-item" data-action="config">
        <i class="fas fa-code"></i> Copy Config
      </div>
      <div class="copy-menu-item" data-action="image">
        <i class="fas fa-image"></i> Copy as Image
      </div>
    `;

    // Add menu styles
    const menuStyles = `
      <style>
        .copy-menu {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 5px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          z-index: 1000;
          min-width: 150px;
          overflow: hidden;
        }

        .copy-menu-item {
          padding: 10px 15px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          color: #374151;
          transition: background 0.2s ease;
        }

        .copy-menu-item:hover {
          background: #f3f4f6;
          color: #6366f1;
        }

        .copy-menu-item i {
          width: 14px;
          text-align: center;
        }
      </style>
    `;
    
    if (!document.querySelector('style[data-copy-menu]')) {
      const styleElement = document.createElement('style');
      styleElement.setAttribute('data-copy-menu', '');
      styleElement.textContent = menuStyles.replace('<style>', '').replace('</style>', '');
      document.head.appendChild(styleElement);
    }

    button.appendChild(menu);

    // Handle menu item clicks
    menu.addEventListener('click', (e) => {
      e.stopPropagation();
      const action = e.target.closest('.copy-menu-item').dataset.action;
      this.handleCopyAction(action, chartData, chartInstance, button);
      menu.remove();
    });

    // Close menu when clicking outside
    setTimeout(() => {
      document.addEventListener('click', () => menu.remove(), { once: true });
    }, 100);
  }

  async handleCopyAction(action, chartData, chartInstance, button) {
    try {
      let content = '';
      let successMessage = '';

      switch (action) {
        case 'data':
          content = JSON.stringify(chartData, null, 2);
          successMessage = 'Data copied!';
          break;
        
        case 'config':
          content = JSON.stringify(chartInstance.config, null, 2);
          successMessage = 'Config copied!';
          break;
        
        case 'image':
          await this.copyChartAsImage(chartInstance);
          successMessage = 'Image copied!';
          break;
      }

      if (action !== 'image') {
        await navigator.clipboard.writeText(content);
      }

      this.showSuccessFeedback(button, successMessage);
    } catch (error) {
      console.error('Failed to copy:', error);
      this.showErrorFeedback(button, 'Copy failed');
    }
  }

  async copyChartAsImage(chartInstance) {
    const canvas = chartInstance.canvas;
    
    // Convert canvas to blob
    const blob = await new Promise((resolve) => {
      canvas.toBlob(resolve, 'image/png');
    });

    // Copy to clipboard
    await navigator.clipboard.write([
      new ClipboardItem({ 'image/png': blob })
    ]);
  }

  showSuccessFeedback(button, message) {
    const originalContent = button.innerHTML;
    button.classList.add('copied');
    button.innerHTML = `
      <i class="fas fa-check icon"></i>
      <span>${message}</span>
    `;

    setTimeout(() => {
      button.classList.remove('copied');
      button.innerHTML = originalContent;
    }, 2000);
  }

  showErrorFeedback(button, message) {
    const originalContent = button.innerHTML;
    button.style.background = '#ef4444';
    button.style.color = 'white';
    button.style.borderColor = '#ef4444';
    button.innerHTML = `
      <i class="fas fa-exclamation-triangle icon"></i>
      <span>${message}</span>
    `;

    setTimeout(() => {
      button.style.background = '';
      button.style.color = '';
      button.style.borderColor = '';
      button.innerHTML = originalContent;
    }, 2000);
  }

  setupGlobalCopyHandler() {
    // Auto-add copy buttons to new charts
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const charts = node.querySelectorAll ? 
              node.querySelectorAll('canvas[data-chart-id]') : [];
            
            charts.forEach((canvas) => {
              const container = canvas.closest('.chart-container') || canvas.parentElement;
              if (container && !container.querySelector('.chart-copy-btn')) {
                // Get chart data from global chart engine if available
                const chartId = canvas.dataset.chartId;
                const chartData = window.chartEngine?.getChartData?.(chartId);
                const chartInstance = Chart.getChart(canvas);
                
                if (chartData && chartInstance) {
                  this.addCopyButton(container, chartData, chartInstance);
                }
              }
            });
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
}

// Export for global use
window.ChartClipboard = ChartClipboard;
window.chartClipboard = new ChartClipboard();

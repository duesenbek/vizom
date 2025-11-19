// Generator Layout Component
// Manages the three-panel layout functionality

class GeneratorLayout {
  constructor() {
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupTabNavigation();
    this.setupChartTypeSelection();
    this.setupSettingsPanel();
    this.setupQuickActions();
    this.setupExportControls();
    this.setupResponsiveBehavior();
  }

  setupEventListeners() {
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initializeLayout());
    } else {
      this.initializeLayout();
    }
  }

  initializeLayout() {
    console.log('Generator Layout: Initializing three-panel layout');
    
    // Set initial active states
    this.setActiveTab('manual');
    this.setActiveChartType('bar');
    
    // Setup resize observers for responsive behavior
    this.setupResizeObserver();
    
    // Emit ready event
    document.dispatchEvent(new CustomEvent('generator:layout-ready'));
  }

  // Tab Navigation System
  setupTabNavigation() {
    const tabButtons = document.querySelectorAll('.tab-button');
    
    tabButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const tabName = button.dataset.tab;
        this.switchTab(tabName);
      });
    });
  }

  switchTab(tabName) {
    // Update tab buttons
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
      if (button.dataset.tab === tabName) {
        button.classList.add('active', 'brand-surface', 'brand-text-primary', 'shadow-sm');
        button.classList.remove('brand-text-secondary');
      } else {
        button.classList.remove('active', 'brand-surface', 'brand-text-primary', 'shadow-sm');
        button.classList.add('brand-text-secondary');
      }
    });

    // Update tab content in center panel
    const centerTabContents = {
      'manual': 'manual-tab-content',
      'upload': 'upload-tab-content', 
      'examples': 'examples-tab-content'
    };

    Object.values(centerTabContents).forEach(contentId => {
      const element = document.getElementById(contentId);
      if (element) {
        element.classList.add('hidden');
      }
    });

    const activeContent = document.getElementById(centerTabContents[tabName]);
    if (activeContent) {
      activeContent.classList.remove('hidden');
    }

    // Update tab content in left sidebar
    const leftTabContents = document.querySelectorAll('.data-tab-content');
    leftTabContents.forEach(content => {
      if (content.id === `${tabName}-tab`) {
        content.classList.remove('hidden');
      } else {
        content.classList.add('hidden');
      }
    });

    // Emit tab change event
    document.dispatchEvent(new CustomEvent('generator:tab-changed', {
      detail: { tab: tabName }
    }));
  }

  setActiveTab(tabName) {
    this.switchTab(tabName);
  }

  // Chart Type Selection
  setupChartTypeSelection() {
    const chartTypeCards = document.querySelectorAll('.chart-type-card');
    
    chartTypeCards.forEach(card => {
      card.addEventListener('click', (e) => {
        const chartType = card.dataset.type;
        this.selectChartType(chartType);
      });
    });
  }

  selectChartType(chartType) {
    // Update chart type cards
    const chartTypeCards = document.querySelectorAll('.chart-type-card');
    chartTypeCards.forEach(card => {
      if (card.dataset.type === chartType) {
        card.classList.add('brand-selection-active');
        card.classList.remove('border', 'border-slate-200');

        const icon = card.querySelector('.rounded-lg');
        if (icon) {
          icon.classList.add('brand-icon-pill-active');
          icon.classList.remove('brand-icon-pill');
        }
      } else {
        card.classList.remove('brand-selection-active');
        card.classList.add('border', 'brand-border');

        const icon = card.querySelector('.rounded-lg');
        if (icon) {
          icon.classList.remove('brand-icon-pill-active');
          icon.classList.add('brand-icon-pill');
        }
      }
    });

    // Update breadcrumb if it exists
    const breadcrumb = document.getElementById('breadcrumb-chart-type');
    if (breadcrumb) {
      breadcrumb.textContent = chartType.charAt(0).toUpperCase() + chartType.slice(1);
    }

    // Emit chart type change event
    document.dispatchEvent(new CustomEvent('generator:chart-type-changed', {
      detail: { chartType: chartType }
    }));
  }

  setActiveChartType(chartType) {
    this.selectChartType(chartType);
  }

  // Settings Panel
  setupSettingsPanel() {
    const settingsToggle = document.getElementById('settings-toggle');
    const settingsPanel = document.getElementById('settings-panel');
    const settingsChevron = document.getElementById('settings-chevron');

    if (settingsToggle && settingsPanel && settingsChevron) {
      settingsToggle.addEventListener('click', () => {
        const isHidden = settingsPanel.classList.contains('hidden');
        
        if (isHidden) {
          settingsPanel.classList.remove('hidden');
          settingsChevron.style.transform = 'rotate(180deg)';
        } else {
          settingsPanel.classList.add('hidden');
          settingsChevron.style.transform = 'rotate(0deg)';
        }
      });
    }

    // Setup toggle switches
    this.setupToggleSwitches();
  }

  setupToggleSwitches() {
    const toggles = document.querySelectorAll('.relative.inline-flex.h-6.w-11');
    
    toggles.forEach(toggle => {
      toggle.classList.add('brand-toggle-track');
      const thumb = toggle.querySelector('span');
      if (thumb) {
        thumb.classList.add('brand-toggle-thumb');
      }

      toggle.addEventListener('click', () => {
        const isActive = toggle.classList.contains('brand-toggle-track-active');

        if (isActive) {
          toggle.classList.remove('brand-toggle-track-active');
          if (thumb) {
            thumb.style.transform = 'translateX(0.25rem)';
          }
        } else {
          toggle.classList.add('brand-toggle-track-active');
          if (thumb) {
            thumb.style.transform = 'translateX(1.5rem)';
          }
        }
      });
    });
  }

  // Quick Actions
  setupQuickActions() {
    const quickActionButtons = document.querySelectorAll('.quick-action-btn');
    const promptInput = document.getElementById('prompt-input');

    quickActionButtons.forEach(button => {
      button.addEventListener('click', () => {
        const prompt = button.dataset.prompt;
        if (prompt && promptInput) {
          promptInput.value = prompt;
          promptInput.focus();
          
          // Trigger validation
          promptInput.dispatchEvent(new Event('input'));
        }
      });
    });

    // Clear input button
    const clearInput = document.getElementById('clear-input');
    if (clearInput && promptInput) {
      clearInput.addEventListener('click', () => {
        promptInput.value = '';
        promptInput.focus();
        promptInput.dispatchEvent(new Event('input'));
      });
    }
  }

  // Export Controls
  setupExportControls() {
    const exportFormatButtons = document.querySelectorAll('.export-format-btn');
    
    exportFormatButtons.forEach(button => {
      button.addEventListener('click', () => {
        const format = button.dataset.format;
        this.selectExportFormat(format);
      });
    });
  }

  selectExportFormat(format) {
    // Update format buttons
    const exportFormatButtons = document.querySelectorAll('.export-format-btn');
    exportFormatButtons.forEach(button => {
      if (button.dataset.format === format) {
        button.classList.add('brand-selection-active');
        button.classList.remove('brand-border');
      } else {
        button.classList.remove('brand-selection-active');
        button.classList.add('brand-border');
      }
    });

    // Enable download button
    const downloadButton = document.querySelector('[disabled] .fa-download');
    if (downloadButton) {
      const button = downloadButton.closest('button');
      if (button) {
        button.disabled = false;
      }
    }

    // Emit format selection event
    document.dispatchEvent(new CustomEvent('generator:export-format-changed', {
      detail: { format: format }
    }));
  }

  // Responsive Behavior
  setupResponsiveBehavior() {
    // Handle window resize
    window.addEventListener('resize', () => {
      this.handleResize();
    });

    // Initial resize check
    this.handleResize();
  }

  handleResize() {
    const width = window.innerWidth;
    const leftSidebar = document.querySelector('.w-80');
    const rightSidebar = document.querySelector('.w-96');
    const centerPanel = document.querySelector('.flex-1');

    if (width < 1024) {
      // Tablet: Collapse sidebars
      if (leftSidebar) leftSidebar.classList.add('hidden');
      if (rightSidebar) rightSidebar.classList.add('hidden');
      if (centerPanel) centerPanel.classList.remove('flex-1');
    } else if (width < 1280) {
      // Small desktop: Adjust widths
      if (leftSidebar) {
        leftSidebar.classList.remove('w-80');
        leftSidebar.classList.add('w-64');
      }
      if (rightSidebar) {
        rightSidebar.classList.remove('w-96');
        rightSidebar.classList.add('w-80');
      }
    } else {
      // Full desktop: Show all panels
      if (leftSidebar) {
        leftSidebar.classList.remove('hidden', 'w-64');
        leftSidebar.classList.add('w-80');
      }
      if (rightSidebar) {
        rightSidebar.classList.remove('hidden', 'w-80');
        rightSidebar.classList.add('w-96');
      }
      if (centerPanel) centerPanel.classList.add('flex-1');
    }
  }

  setupResizeObserver() {
    // Observe layout changes for dynamic adjustments
    const resizeObserver = new ResizeObserver(entries => {
      entries.forEach(entry => {
        if (entry.target.classList.contains('flex')) {
          this.adjustPanelSizes();
        }
      });
    });

    const mainLayout = document.querySelector('.flex.h-\\[calc\\(100vh-64px\\)\\]');
    if (mainLayout) {
      resizeObserver.observe(mainLayout);
    }
  }

  adjustPanelSizes() {
    // Dynamic panel size adjustments based on content
    const leftSidebar = document.querySelector('.w-80');
    const rightSidebar = document.querySelector('.w-96');
    
    // Adjust scroll behavior
    [leftSidebar, rightSidebar].forEach(sidebar => {
      if (sidebar) {
        const scrollableContent = sidebar.querySelector('.overflow-y-auto');
        if (scrollableContent) {
          const isOverflowing = scrollableContent.scrollHeight > scrollableContent.clientHeight;
          if (isOverflowing) {
            scrollableContent.classList.add('scrollbar-thin', 'scrollbar-thumb-slate-300');
          }
        }
      }
    });
  }

  // Public API Methods
  getCurrentTab() {
    const activeTabButton = document.querySelector('.tab-button.active');
    return activeTabButton ? activeTabButton.dataset.tab : 'manual';
  }

  getCurrentChartType() {
    const activeChartCard = document.querySelector('.chart-type-card.brand-selection-active');
    return activeChartCard ? activeChartCard.dataset.type : 'bar';
  }

  getCurrentExportFormat() {
    const activeFormatButton = document.querySelector('.export-format-btn.brand-selection-active');
    return activeFormatButton ? activeFormatButton.dataset.format : 'png';
  }

  switchToTab(tabName) {
    this.switchTab(tabName);
  }

  selectChart(chartType) {
    this.selectChartType(chartType);
  }

  exportChart(format = 'png') {
    this.selectExportFormat(format);
    
    // Trigger export
    document.dispatchEvent(new CustomEvent('generator:export-chart', {
      detail: { format: format }
    }));
  }

  saveProject() {
    document.dispatchEvent(new CustomEvent('generator:save-project'));
  }

  viewProjects() {
    document.dispatchEvent(new CustomEvent('generator:view-projects'));
  }

  // Layout state management
  getLayoutState() {
    return {
      activeTab: this.getCurrentTab(),
      selectedChartType: this.getCurrentChartType(),
      selectedExportFormat: this.getCurrentExportFormat(),
      viewportWidth: window.innerWidth,
      isMobile: window.innerWidth < 768,
      isTablet: window.innerWidth >= 768 && window.innerWidth < 1024,
      isDesktop: window.innerWidth >= 1024
    };
  }

  // Panel visibility controls
  showLeftSidebar() {
    const leftSidebar = document.querySelector('.w-80');
    if (leftSidebar) {
      leftSidebar.classList.remove('hidden');
    }
  }

  hideLeftSidebar() {
    const leftSidebar = document.querySelector('.w-80');
    if (leftSidebar) {
      leftSidebar.classList.add('hidden');
    }
  }

  showRightSidebar() {
    const rightSidebar = document.querySelector('.w-96');
    if (rightSidebar) {
      rightSidebar.classList.remove('hidden');
    }
  }

  hideRightSidebar() {
    const rightSidebar = document.querySelector('.w-96');
    if (rightSidebar) {
      rightSidebar.classList.add('hidden');
    }
  }

  toggleLeftSidebar() {
    const leftSidebar = document.querySelector('.w-80');
    if (leftSidebar) {
      leftSidebar.classList.toggle('hidden');
    }
  }

  toggleRightSidebar() {
    const rightSidebar = document.querySelector('.w-96');
    if (rightSidebar) {
      rightSidebar.classList.toggle('hidden');
    }
  }
}

// Initialize the generator layout
document.addEventListener('DOMContentLoaded', () => {
  window.generatorLayout = new GeneratorLayout();
});

// Export for use in other modules
export { GeneratorLayout };

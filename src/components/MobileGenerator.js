// Mobile Generator Component
// Mobile-specific adaptations for the chart generator

class MobileGenerator {
  constructor() {
    this.isMobile = this.checkIsMobile();
    this.originalLayout = null;
    this.touchHandlers = new Map();
    this.init();
  }

  init() {
    if (this.isMobile) {
      this.applyMobileLayout();
      this.setupTouchInteractions();
      this.setupMobileControls();
      this.optimizeForMobile();
    }
    
    this.setupResponsiveHandling();
  }

  checkIsMobile() {
    return window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  applyMobileLayout() {
    const generatorContainer = document.querySelector('.generator-container');
    if (!generatorContainer) return;

    // Store original layout
    this.originalLayout = {
      display: generatorContainer.style.display,
      flexDirection: generatorContainer.style.flexDirection
    };

    // Apply mobile layout
    generatorContainer.classList.add('mobile-layout');
    
    // Stack panels vertically
    const sidebar = document.querySelector('.workspace-sidebar');
    const content = document.querySelector('.workspace-content');
    
    if (sidebar) {
      sidebar.classList.add('mobile-sidebar');
      // Make sidebar collapsible
      this.makeSidebarCollapsible(sidebar);
    }
    
    if (content) {
      content.classList.add('mobile-content');
      // Adjust content area for mobile
      this.adjustContentArea(content);
    }

    // Reorganize controls
    this.reorganizeControls();
  }

  makeSidebarCollapsible(sidebar) {
    // Create collapse header
    const collapseHeader = document.createElement('div');
    collapseHeader.className = 'sidebar-collapse-header';
    collapseHeader.innerHTML = `
      <button class="sidebar-toggle" aria-expanded="true">
        <i class="fas fa-chevron-up"></i>
        <span>Chart Settings</span>
      </button>
    `;

    // Insert at the beginning of sidebar
    sidebar.insertBefore(collapseHeader, sidebar.firstChild);

    // Add toggle functionality
    const toggleButton = collapseHeader.querySelector('.sidebar-toggle');
    const sidebarContent = sidebar.querySelector('.workspace-sidebar-content');

    toggleButton.addEventListener('click', () => {
      const isExpanded = toggleButton.getAttribute('aria-expanded') === 'true';
      
      if (isExpanded) {
        sidebarContent.style.display = 'none';
        toggleButton.setAttribute('aria-expanded', 'false');
        toggleButton.querySelector('i').className = 'fas fa-chevron-down';
        sidebar.classList.add('collapsed');
      } else {
        sidebarContent.style.display = 'block';
        toggleButton.setAttribute('aria-expanded', 'true');
        toggleButton.querySelector('i').className = 'fas fa-chevron-up';
        sidebar.classList.remove('collapsed');
      }
    });
  }

  adjustContentArea(content) {
    // Adjust chart area for mobile
    const chartContainer = content.querySelector('.chart-container');
    if (chartContainer) {
      chartContainer.classList.add('mobile-chart-container');
      
      // Make chart responsive
      this.makeChartResponsive(chartContainer);
    }

    // Optimize prompt area
    const promptSection = content.querySelector('.prompt-section');
    if (promptSection) {
      promptSection.classList.add('mobile-prompt-section');
      this.optimizePromptArea(promptSection);
    }
  }

  makeChartResponsive(chartContainer) {
    // Add responsive chart wrapper
    const chartWrapper = document.createElement('div');
    chartWrapper.className = 'mobile-chart-wrapper';
    
    // Wrap existing chart
    const existingChart = chartContainer.querySelector('canvas');
    if (existingChart) {
      chartWrapper.appendChild(existingChart.cloneNode(true));
      chartContainer.innerHTML = '';
      chartContainer.appendChild(chartWrapper);
    }

    // Add touch controls for chart
    this.addChartTouchControls(chartWrapper);
  }

  addChartTouchControls(chartWrapper) {
    // Add zoom controls
    const zoomControls = document.createElement('div');
    zoomControls.className = 'mobile-chart-zoom-controls';
    zoomControls.innerHTML = `
      <button class="zoom-btn zoom-in" aria-label="Zoom in">
        <i class="fas fa-search-plus"></i>
      </button>
      <button class="zoom-btn zoom-out" aria-label="Zoom out">
        <i class="fas fa-search-minus"></i>
      </button>
      <button class="zoom-btn zoom-reset" aria-label="Reset zoom">
        <i class="fas fa-compress"></i>
      </button>
    `;

    chartWrapper.appendChild(zoomControls);

    // Add zoom functionality
    let currentZoom = 1;
    
    zoomControls.querySelector('.zoom-in').addEventListener('click', () => {
      currentZoom = Math.min(currentZoom + 0.1, 2);
      this.applyChartZoom(currentZoom);
    });

    zoomControls.querySelector('.zoom-out').addEventListener('click', () => {
      currentZoom = Math.max(currentZoom - 0.1, 0.5);
      this.applyChartZoom(currentZoom);
    });

    zoomControls.querySelector('.zoom-reset').addEventListener('click', () => {
      currentZoom = 1;
      this.applyChartZoom(currentZoom);
    });
  }

  applyChartZoom(zoomLevel) {
    const chartWrapper = document.querySelector('.mobile-chart-wrapper');
    if (chartWrapper) {
      chartWrapper.style.transform = `scale(${zoomLevel})`;
      chartWrapper.style.transformOrigin = 'center center';
    }
  }

  optimizePromptArea(promptSection) {
    // Make textarea larger and more accessible
    const textarea = promptSection.querySelector('textarea');
    if (textarea) {
      textarea.classList.add('mobile-textarea');
      textarea.setAttribute('placeholder', 'Describe your chart in detail...');
    }

    // Add voice input button
    this.addVoiceInputButton(promptSection);

    // Add quick prompts
    this.addQuickPrompts(promptSection);
  }

  addVoiceInputButton(promptSection) {
    const voiceButton = document.createElement('button');
    voiceButton.className = 'voice-input-btn';
    voiceButton.setAttribute('aria-label', 'Voice input');
    voiceButton.innerHTML = '<i class="fas fa-microphone"></i>';

    // Add to prompt controls
    const promptControls = promptSection.querySelector('.prompt-controls');
    if (promptControls) {
      promptControls.appendChild(voiceButton);
    }

    // Setup voice recognition
    this.setupVoiceRecognition(voiceButton);
  }

  setupVoiceRecognition(button) {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      button.style.display = 'none';
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    button.addEventListener('click', () => {
      if (button.classList.contains('recording')) {
        recognition.stop();
        return;
      }

      recognition.start();
      button.classList.add('recording');
      button.innerHTML = '<i class="fas fa-stop"></i>';
    });

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      const textarea = document.querySelector('.prompt-textarea');
      if (textarea) {
        textarea.value = transcript;
        textarea.dispatchEvent(new Event('input'));
      }
    };

    recognition.onerror = () => {
      button.classList.remove('recording');
      button.innerHTML = '<i class="fas fa-microphone"></i>';
      this.showToast('Voice recognition failed. Please try again.');
    };

    recognition.onend = () => {
      button.classList.remove('recording');
      button.innerHTML = '<i class="fas fa-microphone"></i>';
    };
  }

  addQuickPrompts(promptSection) {
    const quickPrompts = [
      'Create a bar chart showing sales data',
      'Generate a pie chart for market share',
      'Build a line chart for trends over time',
      'Make a scatter plot for correlation analysis'
    ];

    const quickPromptsContainer = document.createElement('div');
    quickPromptsContainer.className = 'mobile-quick-prompts';
    quickPromptsContainer.innerHTML = `
      <div class="quick-prompts-label">Quick prompts:</div>
      <div class="quick-prompts-list">
        ${quickPrompts.map(prompt => `
          <button class="quick-prompt-btn" data-prompt="${prompt}">
            ${prompt}
          </button>
        `).join('')}
      </div>
    `;

    promptSection.appendChild(quickPromptsContainer);

    // Add click handlers
    quickPromptsContainer.querySelectorAll('.quick-prompt-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const prompt = btn.dataset.prompt;
        const textarea = document.querySelector('.prompt-textarea');
        if (textarea) {
          textarea.value = prompt;
          textarea.dispatchEvent(new Event('input'));
          textarea.focus();
        }
      });
    });
  }

  reorganizeControls() {
    // Move export controls to a more accessible location
    const exportControls = document.querySelector('.export-controls');
    if (exportControls) {
      this.createMobileExportPanel(exportControls);
    }

    // Reorganize format options
    const formatOptions = document.querySelector('.format-options');
    if (formatOptions) {
      this.createMobileFormatSelector(formatOptions);
    }
  }

  createMobileExportPanel(originalControls) {
    // Create mobile-friendly export panel
    const mobileExportPanel = document.createElement('div');
    mobileExportPanel.className = 'mobile-export-panel';
    mobileExportPanel.innerHTML = `
      <div class="export-panel-header">
        <h3>Export Chart</h3>
        <button class="export-panel-close" aria-label="Close export panel">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="export-panel-content">
        <div class="export-format-grid">
          <button class="export-format-btn" data-format="png">
            <i class="fas fa-image"></i>
            <span>PNG</span>
          </button>
          <button class="export-format-btn" data-format="pdf">
            <i class="fas fa-file-pdf"></i>
            <span>PDF</span>
          </button>
          <button class="export-format-btn" data-format="svg">
            <i class="fas fa-vector-square"></i>
            <span>SVG</span>
          </button>
        </div>
        <div class="export-quality-section">
          <label>Quality:</label>
          <select class="export-quality-select">
            <option value="low">Low (Fast)</option>
            <option value="medium" selected>Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <button class="export-action-btn primary">
          <i class="fas fa-download"></i>
          Export
        </button>
      </div>
    `;

    // Add to page
    document.body.appendChild(mobileExportPanel);

    // Setup panel interactions
    this.setupMobileExportPanel(mobileExportPanel);

    // Create trigger button
    const exportTrigger = document.createElement('button');
    exportTrigger.className = 'mobile-export-trigger';
    exportTrigger.setAttribute('aria-label', 'Export chart');
    exportTrigger.innerHTML = '<i class="fas fa-download"></i>';

    // Add to chart area
    const chartArea = document.querySelector('.chart-container');
    if (chartArea) {
      chartArea.appendChild(exportTrigger);
    }

    // Setup trigger
    exportTrigger.addEventListener('click', () => {
      mobileExportPanel.classList.add('open');
    });
  }

  setupMobileExportPanel(panel) {
    const closeBtn = panel.querySelector('.export-panel-close');
    const formatBtns = panel.querySelectorAll('.export-format-btn');
    const exportBtn = panel.querySelector('.export-action-btn');

    closeBtn.addEventListener('click', () => {
      panel.classList.remove('open');
    });

    formatBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        formatBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    exportBtn.addEventListener('click', () => {
      const activeFormat = panel.querySelector('.export-format-btn.active');
      if (activeFormat) {
        this.handleMobileExport(activeFormat.dataset.format);
      }
    });
  }

  createMobileFormatSelector(originalOptions) {
    // Create mobile-friendly format selector
    const mobileSelector = document.createElement('div');
    mobileSelector.className = 'mobile-format-selector';
    mobileSelector.innerHTML = `
      <select class="format-select">
        <option value="bar">Bar Chart</option>
        <option value="line">Line Chart</option>
        <option value="pie">Pie Chart</option>
        <option value="scatter">Scatter Plot</option>
        <option value="area">Area Chart</option>
      </select>
    `;

    originalOptions.parentNode.replaceChild(mobileSelector, originalOptions);
  }

  setupTouchInteractions() {
    // Add touch gestures for chart navigation
    this.setupChartTouchGestures();
    
    // Add swipe gestures for panel navigation
    this.setupSwipeGestures();
    
    // Add pull-to-refresh functionality
    this.setupPullToRefresh();
  }

  setupChartTouchGestures() {
    const chartContainer = document.querySelector('.mobile-chart-wrapper');
    if (!chartContainer) return;

    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let currentY = 0;

    chartContainer.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    });

    chartContainer.addEventListener('touchmove', (e) => {
      currentX = e.touches[0].clientX;
      currentY = e.touches[0].clientY;
    });

    chartContainer.addEventListener('touchend', (e) => {
      const deltaX = currentX - startX;
      const deltaY = currentY - startY;

      // Handle swipe gestures
      if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0) {
          this.handleChartSwipe('right');
        } else {
          this.handleChartSwipe('left');
        }
      }
    });
  }

  setupSwipeGestures() {
    const sidebar = document.querySelector('.mobile-sidebar');
    if (!sidebar) return;

    let startX = 0;
    let isDragging = false;

    sidebar.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
    });

    sidebar.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      
      const currentX = e.touches[0].clientX;
      const deltaX = currentX - startX;

      // Provide visual feedback during swipe
      if (deltaX < -50) {
        sidebar.style.transform = `translateX(${deltaX}px)`;
      }
    });

    sidebar.addEventListener('touchend', (e) => {
      if (!isDragging) return;
      
      const currentX = e.changedTouches[0].clientX;
      const deltaX = currentX - startX;

      sidebar.style.transform = '';

      if (deltaX < -100) {
        // Swipe left - collapse sidebar
        const toggleBtn = sidebar.querySelector('.sidebar-toggle');
        if (toggleBtn && toggleBtn.getAttribute('aria-expanded') === 'true') {
          toggleBtn.click();
        }
      }

      isDragging = false;
    });
  }

  setupPullToRefresh() {
    const contentArea = document.querySelector('.mobile-content');
    if (!contentArea) return;

    let startY = 0;
    let isPulling = false;

    contentArea.addEventListener('touchstart', (e) => {
      if (contentArea.scrollTop === 0) {
        startY = e.touches[0].clientY;
        isPulling = true;
      }
    });

    contentArea.addEventListener('touchmove', (e) => {
      if (!isPulling) return;
      
      const currentY = e.touches[0].clientY;
      const deltaY = currentY - startY;

      if (deltaY > 0) {
        e.preventDefault();
        const pullDistance = Math.min(deltaY * 0.5, 100);
        contentArea.style.transform = `translateY(${pullDistance}px)`;
        
        if (pullDistance > 80) {
          this.showRefreshIndicator();
        }
      }
    });

    contentArea.addEventListener('touchend', (e) => {
      if (!isPulling) return;
      
      contentArea.style.transform = '';
      isPulling = false;

      const currentY = e.changedTouches[0].clientY;
      const deltaY = currentY - startY;

      if (deltaY > 100) {
        this.performRefresh();
      }
    });
  }

  showRefreshIndicator() {
    // Show refresh indicator
    const indicator = document.createElement('div');
    indicator.className = 'mobile-refresh-indicator';
    indicator.innerHTML = '<i class="fas fa-sync-alt fa-spin"></i>';
    
    const contentArea = document.querySelector('.mobile-content');
    if (contentArea) {
      contentArea.appendChild(indicator);
    }
  }

  performRefresh() {
    // Perform refresh action
    this.showToast('Refreshing chart...');
    
    // Hide refresh indicator
    const indicator = document.querySelector('.mobile-refresh-indicator');
    if (indicator) {
      setTimeout(() => indicator.remove(), 1000);
    }
  }

  setupMobileControls() {
    // Add mobile-specific control buttons
    this.addMobileControlButtons();
    
    // Optimize form controls
    this.optimizeFormControls();
    
    // Add keyboard shortcuts
    this.setupMobileKeyboardShortcuts();
  }

  addMobileControlButtons() {
    // Add floating action buttons
    const fabContainer = document.createElement('div');
    fabContainer.className = 'mobile-fab-container';
    fabContainer.innerHTML = `
      <button class="mobile-fab primary" id="mobile-generate-btn" aria-label="Generate chart">
        <i class="fas fa-magic"></i>
      </button>
      <button class="mobile-fab secondary" id="mobile-settings-btn" aria-label="Chart settings">
        <i class="fas fa-cog"></i>
      </button>
    `;

    document.body.appendChild(fabContainer);

    // Setup FAB actions
    document.getElementById('mobile-generate-btn').addEventListener('click', () => {
      this.handleMobileGenerate();
    });

    document.getElementById('mobile-settings-btn').addEventListener('click', () => {
      this.handleMobileSettings();
    });
  }

  optimizeFormControls() {
    // Make all form inputs mobile-friendly
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      input.classList.add('mobile-input');
      
      // Add input type optimizations
      if (input.type === 'number') {
        input.setAttribute('inputmode', 'decimal');
        input.setAttribute('pattern', '[0-9]*');
      }
      
      if (input.type === 'tel') {
        input.setAttribute('inputmode', 'tel');
      }
      
      if (input.type === 'email') {
        input.setAttribute('inputmode', 'email');
        input.setAttribute('autocapitalize', 'off');
        input.setAttribute('autocorrect', 'off');
      }
    });

    // Add mobile-friendly select dropdowns
    const selects = document.querySelectorAll('select');
    selects.forEach(select => {
      select.classList.add('mobile-select');
    });
  }

  setupMobileKeyboardShortcuts() {
    // Add keyboard shortcuts for mobile
    document.addEventListener('keydown', (e) => {
      // Ctrl/Cmd + Enter to generate
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        this.handleMobileGenerate();
      }
      
      // Escape to close modals
      if (e.key === 'Escape') {
        this.closeAllMobilePanels();
      }
    });
  }

  optimizeForMobile() {
    // Optimize images and assets
    this.optimizeImages();
    
    // Reduce animations for performance
    this.reduceAnimations();
    
    // Optimize fonts
    this.optimizeFonts();
  }

  optimizeImages() {
    // Add lazy loading to images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      img.setAttribute('loading', 'lazy');
    });
  }

  reduceAnimations() {
    // Reduce animations on mobile for better performance
    if (this.isLowEndDevice()) {
      document.body.classList.add('reduce-animations');
    }
  }

  optimizeFonts() {
    // Use system fonts on mobile for better performance
    const style = document.createElement('style');
    style.textContent = `
      @media (max-width: 768px) {
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
      }
    `;
    document.head.appendChild(style);
  }

  isLowEndDevice() {
    // Detect low-end devices
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const isSlowConnection = connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g');
    const isLowMemory = navigator.deviceMemory && navigator.deviceMemory < 2;
    
    return isSlowConnection || isLowMemory;
  }

  setupResponsiveHandling() {
    // Handle window resize
    window.addEventListener('resize', () => {
      const wasMobile = this.isMobile;
      this.isMobile = this.checkIsMobile();
      
      if (wasMobile !== this.isMobile) {
        this.handleMobileChange();
      }
    });

    // Handle orientation change
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        this.adjustForOrientation();
      }, 100);
    });
  }

  handleMobileChange() {
    if (this.isMobile) {
      this.applyMobileLayout();
    } else {
      this.removeMobileLayout();
    }
  }

  removeMobileLayout() {
    // Restore original layout
    const generatorContainer = document.querySelector('.generator-container');
    if (generatorContainer && this.originalLayout) {
      generatorContainer.classList.remove('mobile-layout');
      generatorContainer.style.display = this.originalLayout.display;
      generatorContainer.style.flexDirection = this.originalLayout.flexDirection;
    }

    // Remove mobile-specific elements
    const mobileElements = document.querySelectorAll('.mobile-sidebar, .mobile-content, .mobile-fab-container');
    mobileElements.forEach(el => el.remove());
  }

  adjustForOrientation() {
    const isLandscape = window.innerWidth > window.innerHeight;
    
    if (isLandscape) {
      document.body.classList.add('mobile-landscape');
      this.optimizeForLandscape();
    } else {
      document.body.classList.remove('mobile-landscape');
      this.optimizeForPortrait();
    }
  }

  optimizeForLandscape() {
    // Adjust layout for landscape
    const sidebar = document.querySelector('.mobile-sidebar');
    if (sidebar) {
      sidebar.style.maxHeight = '50vh';
    }
  }

  optimizeForPortrait() {
    // Adjust layout for portrait
    const sidebar = document.querySelector('.mobile-sidebar');
    if (sidebar) {
      sidebar.style.maxHeight = '';
    }
  }

  // Event handlers
  handleChartSwipe(direction) {
    // Handle chart swipe gestures
    if (direction === 'left') {
      this.showToast('Next chart template');
    } else if (direction === 'right') {
      this.showToast('Previous chart template');
    }
  }

  handleMobileGenerate() {
    // Handle mobile generate action
    const generateBtn = document.querySelector('.generate-btn');
    if (generateBtn) {
      generateBtn.click();
    }
  }

  handleMobileSettings() {
    // Handle mobile settings action
    const sidebar = document.querySelector('.mobile-sidebar');
    if (sidebar) {
      const toggleBtn = sidebar.querySelector('.sidebar-toggle');
      if (toggleBtn && toggleBtn.getAttribute('aria-expanded') === 'false') {
        toggleBtn.click();
      }
      sidebar.scrollIntoView({ behavior: 'smooth' });
    }
  }

  handleMobileExport(format) {
    // Handle mobile export
    this.showToast(`Exporting as ${format.toUpperCase()}...`);
    
    // Close export panel
    const panel = document.querySelector('.mobile-export-panel');
    if (panel) {
      panel.classList.remove('open');
    }
  }

  closeAllMobilePanels() {
    // Close all mobile panels
    const panels = document.querySelectorAll('.mobile-export-panel, .mobile-settings-panel');
    panels.forEach(panel => panel.classList.remove('open'));
  }

  showToast(message, duration = 3000) {
    // Create toast notification
    const toast = document.createElement('div');
    toast.className = 'mobile-toast';
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Animate in
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });
    
    // Remove after duration
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  // Public API
  updateMobileLayout() {
    if (this.isMobile) {
      this.applyMobileLayout();
    } else {
      this.removeMobileLayout();
    }
  }

  addMobileFeature(feature) {
    // Add custom mobile features
    switch (feature) {
      case 'voice-input':
        this.enableVoiceInput();
        break;
      case 'gesture-controls':
        this.enableGestureControls();
        break;
      case 'offline-mode':
        this.enableOfflineMode();
        break;
    }
  }

  enableVoiceInput() {
    // Enable voice input for all text areas
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach(textarea => {
      this.addVoiceInputButton(textarea.parentElement);
    });
  }

  enableGestureControls() {
    // Enable advanced gesture controls
    this.setupAdvancedGestures();
  }

  enableOfflineMode() {
    // Enable offline functionality
    this.setupOfflineSupport();
  }

  setupAdvancedGestures() {
    // Setup pinch-to-zoom, double-tap, etc.
    // Implementation depends on specific requirements
  }

  setupOfflineSupport() {
    // Setup service worker and offline caching
    // Implementation depends on specific requirements
  }
}

// Initialize mobile generator
document.addEventListener('DOMContentLoaded', () => {
  window.mobileGenerator = new MobileGenerator();
});

// Export for use in other modules
export { MobileGenerator };

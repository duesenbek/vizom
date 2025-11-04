// WCAG AAA Accessibility Compliance System
class AccessibilityManager {
  constructor() {
    this.settings = {
      highContrast: false,
      largeText: false,
      reducedMotion: false,
      screenReader: false,
      keyboardNavigation: true,
      focusVisible: true,
      colorBlind: 'none', // none, protanopia, deuteranopia, tritanopia
      announcements: true
    };
    
    this.focusableElements = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]'
    ];
    
    this.announcer = null;
    this.currentFocusIndex = -1;
    this.focusableElementsList = [];
    
    this.init();
  }

  init() {
    this.createAnnouncer();
    this.setupAccessibilityControls();
    this.setupKeyboardNavigation();
    this.setupFocusManagement();
    this.setupScreenReaderSupport();
    this.setupColorBlindSupport();
    this.setupMotionPreferences();
    this.setupHighContrast();
    this.runAccessibilityAudit();
  }

  // Create screen reader announcer
  createAnnouncer() {
    this.announcer = document.createElement('div');
    this.announcer.setAttribute('aria-live', 'polite');
    this.announcer.setAttribute('aria-atomic', 'true');
    this.announcer.className = 'sr-only';
    this.announcer.id = 'accessibility-announcer';
    document.body.appendChild(this.announcer);
  }

  // Announce messages to screen readers
  announce(message, priority = 'polite') {
    if (!this.settings.announcements) return;
    
    const announcer = priority === 'assertive' 
      ? this.createAssertiveAnnouncer() 
      : this.announcer;
    
    announcer.textContent = message;
    
    // Clear after announcement
    setTimeout(() => {
      announcer.textContent = '';
    }, 1000);
  }

  createAssertiveAnnouncer() {
    let announcer = document.getElementById('assertive-announcer');
    if (!announcer) {
      announcer = document.createElement('div');
      announcer.setAttribute('aria-live', 'assertive');
      announcer.setAttribute('aria-atomic', 'true');
      announcer.className = 'sr-only';
      announcer.id = 'assertive-announcer';
      document.body.appendChild(announcer);
    }
    return announcer;
  }

  // Setup accessibility controls panel
  setupAccessibilityControls() {
    const controls = document.createElement('div');
    controls.id = 'accessibility-controls';
    controls.className = 'accessibility-controls';
    controls.innerHTML = `
      <button class="accessibility-toggle" aria-label="Accessibility options" onclick="window.accessibility.toggleControls()">
        <i class="fas fa-universal-access"></i>
      </button>
      <div class="accessibility-panel" id="accessibility-panel">
        <h3>Accessibility Options</h3>
        
        <div class="accessibility-option">
          <label>
            <input type="checkbox" id="high-contrast" onchange="window.accessibility.toggleHighContrast()">
            <span>High Contrast</span>
          </label>
        </div>
        
        <div class="accessibility-option">
          <label>
            <input type="checkbox" id="large-text" onchange="window.accessibility.toggleLargeText()">
            <span>Large Text</span>
          </label>
        </div>
        
        <div class="accessibility-option">
          <label>
            <input type="checkbox" id="reduced-motion" onchange="window.accessibility.toggleReducedMotion()">
            <span>Reduced Motion</span>
          </label>
        </div>
        
        <div class="accessibility-option">
          <label>
            <input type="checkbox" id="focus-visible" checked onchange="window.accessibility.toggleFocusVisible()">
            <span>Focus Indicators</span>
          </label>
        </div>
        
        <div class="accessibility-option">
          <label for="color-blind">Color Vision:</label>
          <select id="color-blind" onchange="window.accessibility.setColorBlindMode(this.value)">
            <option value="none">Normal</option>
            <option value="protanopia">Protanopia</option>
            <option value="deuteranopia">Deuteranopia</option>
            <option value="tritanopia">Tritanopia</option>
          </select>
        </div>
        
        <div class="accessibility-option">
          <label>
            <input type="checkbox" id="screen-reader-mode" onchange="window.accessibility.toggleScreenReaderMode()">
            <span>Screen Reader Mode</span>
          </label>
        </div>
        
        <div class="accessibility-shortcuts">
          <h4>Keyboard Shortcuts</h4>
          <div class="shortcut-item">
            <kbd>Tab</kbd> Navigate forward
          </div>
          <div class="shortcut-item">
            <kbd>Shift + Tab</kbd> Navigate backward
          </div>
          <div class="shortcut-item">
            <kbd>Enter</kbd> Activate button
          </div>
          <div class="shortcut-item">
            <kbd>Space</kbd> Activate button/link
          </div>
          <div class="shortcut-item">
            <kbd>Escape</kbd> Close modal/dropdown
          </div>
          <div class="shortcut-item">
            <kbd>Alt + A</kbd> Accessibility panel
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(controls);
  }

  // Toggle accessibility controls
  toggleControls() {
    const panel = document.getElementById('accessibility-panel');
    const isOpen = panel.classList.contains('show');
    
    if (isOpen) {
      panel.classList.remove('show');
      this.announce('Accessibility options closed');
    } else {
      panel.classList.add('show');
      this.announce('Accessibility options opened');
      // Focus first control
      panel.querySelector('input').focus();
    }
  }

  // Setup keyboard navigation
  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      // Alt + A for accessibility panel
      if (e.altKey && e.key === 'a') {
        e.preventDefault();
        this.toggleControls();
        return;
      }

      // Tab navigation
      if (e.key === 'Tab') {
        this.handleTabNavigation(e);
      }

      // Escape key
      if (e.key === 'Escape') {
        this.handleEscapeKey(e);
      }

      // Enter and Space for activation
      if (e.key === 'Enter' || e.key === ' ') {
        this.handleActivationKey(e);
      }

      // Arrow keys for custom components
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        this.handleArrowKeys(e);
      }
    });
  }

  // Handle tab navigation
  handleTabNavigation(e) {
    this.updateFocusableElements();
    
    if (e.shiftKey) {
      // Shift + Tab - navigate backwards
      this.currentFocusIndex--;
      if (this.currentFocusIndex < 0) {
        this.currentFocusIndex = this.focusableElementsList.length - 1;
      }
    } else {
      // Tab - navigate forwards
      this.currentFocusIndex++;
      if (this.currentFocusIndex >= this.focusableElementsList.length) {
        this.currentFocusIndex = 0;
      }
    }

    const nextElement = this.focusableElementsList[this.currentFocusIndex];
    if (nextElement) {
      e.preventDefault();
      nextElement.focus();
      this.announceElement(nextElement);
    }
  }

  // Update focusable elements list
  updateFocusableElements() {
    const selector = this.focusableElements.join(', ');
    this.focusableElementsList = Array.from(document.querySelectorAll(selector))
      .filter(el => {
        // Filter out hidden elements
        const style = window.getComputedStyle(el);
        return style.display !== 'none' && 
               style.visibility !== 'hidden' && 
               !el.hasAttribute('disabled') &&
               el.tabIndex !== -1;
      });
  }

  // Announce focused element
  announceElement(element) {
    let announcement = '';
    
    if (element.tagName === 'BUTTON') {
      announcement = `Button: ${element.textContent.trim()}`;
    } else if (element.tagName === 'A') {
      announcement = `Link: ${element.textContent.trim()}`;
    } else if (element.tagName === 'INPUT') {
      const type = element.type || 'text';
      const label = element.getAttribute('aria-label') || 
                   element.getAttribute('placeholder') || 
                   type + ' input';
      announcement = `Input: ${label}`;
    } else if (element.hasAttribute('role')) {
      const role = element.getAttribute('role');
      const label = element.getAttribute('aria-label') || element.textContent.trim();
      announcement = `${role}: ${label}`;
    } else {
      announcement = element.textContent.trim() || element.tagName.toLowerCase();
    }
    
    this.announce(announcement);
  }

  // Handle escape key
  handleEscapeKey(e) {
    // Close modals
    const openModal = document.querySelector('.modal.show, .error-modal.show');
    if (openModal) {
      openModal.classList.remove('show');
      this.announce('Modal closed');
      return;
    }

    // Close dropdowns
    const openDropdown = document.querySelector('.dropdown.show');
    if (openDropdown) {
      openDropdown.classList.remove('show');
      this.announce('Dropdown closed');
      return;
    }

    // Close accessibility panel
    const panel = document.getElementById('accessibility-panel');
    if (panel.classList.contains('show')) {
      this.toggleControls();
    }
  }

  // Handle activation keys
  handleActivationKey(e) {
    const element = document.activeElement;
    
    // Prevent default space key scrolling
    if (e.key === ' ' && element.tagName === 'BUTTON') {
      e.preventDefault();
    }
    
    // Trigger click for buttons and links
    if (element && (element.tagName === 'BUTTON' || element.tagName === 'A')) {
      element.click();
    }
  }

  // Handle arrow keys for custom components
  handleArrowKeys(e) {
    const element = document.activeElement;
    
    // Handle chart type selector
    if (element.closest('.chart-options')) {
      this.handleChartTypeNavigation(e);
      return;
    }

    // Handle tabs
    if (element.closest('.input-tabs')) {
      this.handleTabNavigation(e);
      return;
    }
  }

  // Handle chart type navigation with arrows
  handleChartTypeNavigation(e) {
    const chartOptions = document.querySelectorAll('.chart-option');
    const currentIndex = Array.from(chartOptions).findIndex(el => el.classList.contains('selected'));
    
    let newIndex = currentIndex;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      newIndex = (currentIndex + 1) % chartOptions.length;
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      newIndex = currentIndex === 0 ? chartOptions.length - 1 : currentIndex - 1;
    }
    
    if (newIndex !== currentIndex) {
      e.preventDefault();
      chartOptions[newIndex].click();
      chartOptions[newIndex].focus();
    }
  }

  // Setup focus management
  setupFocusManagement() {
    // Add focus indicators
    this.addFocusIndicators();
    
    // Manage focus in modals
    this.setupModalFocusTrap();
    
    // Skip to main content link
    this.addSkipLink();
  }

  // Add focus indicators
  addFocusIndicators() {
    const style = document.createElement('style');
    style.textContent = `
      .focus-visible :focus {
        outline: 3px solid var(--primary, #0066FF) !important;
        outline-offset: 2px !important;
        border-radius: 4px !important;
      }
      
      .no-focus-outline :focus {
        outline: none !important;
      }
      
      .high-contrast .focus-visible :focus {
        outline: 3px solid #FFFFFF !important;
        background: #000000 !important;
        color: #FFFFFF !important;
      }
    `;
    document.head.appendChild(style);
    
    // Add focus-visible class to body
    document.body.classList.add('focus-visible');
  }

  // Setup modal focus trap
  setupModalFocusTrap() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        const modal = document.querySelector('.modal.show, .error-modal.show');
        if (modal) {
          this.trapFocus(e, modal);
        }
      }
    });
  }

  // Trap focus within modal
  trapFocus(e, container) {
    const focusableElements = container.querySelectorAll(this.focusableElements.join(', '));
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  }

  // Add skip to main content link
  addSkipLink() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';
    skipLink.setAttribute('aria-label', 'Skip to main content');
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main content id if not present
    const mainContent = document.querySelector('main, .generator-layout, .container');
    if (mainContent && !mainContent.id) {
      mainContent.id = 'main-content';
    }
  }

  // Setup screen reader support
  setupScreenReaderSupport() {
    this.addAriaLabels();
    this.addLiveRegions();
    this.setupFormLabels();
  }

  // Add ARIA labels to interactive elements
  addAriaLabels() {
    // Chart type selector
    document.querySelectorAll('.chart-option').forEach((option, index) => {
      const chartType = option.querySelector('.chart-name').textContent;
      option.setAttribute('role', 'button');
      option.setAttribute('aria-label', `Select ${chartType} chart type`);
      option.setAttribute('aria-pressed', option.classList.contains('selected'));
      option.setAttribute('tabindex', '0');
    });

    // Tab buttons
    document.querySelectorAll('.tab').forEach(tab => {
      const tabName = tab.textContent.trim();
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-selected', tab.classList.contains('active'));
      tab.setAttribute('aria-controls', `${tab.dataset.tab}-tab`);
      tab.setAttribute('tabindex', tab.classList.contains('active') ? '0' : '-1');
    });

    // Tab panels
    document.querySelectorAll('.input-area').forEach(panel => {
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-labelledby', `tab-${panel.id.replace('-tab', '')}`);
    });

    // Preview container
    const previewContainer = document.getElementById('preview-container');
    if (previewContainer) {
      previewContainer.setAttribute('role', 'region');
      previewContainer.setAttribute('aria-label', 'Chart preview');
      previewContainer.setAttribute('aria-live', 'polite');
    }

    // Export buttons
    document.querySelectorAll('.preview-actions button').forEach(btn => {
      const action = btn.textContent.trim();
      btn.setAttribute('aria-label', `${action} chart`);
    });
  }

  // Add live regions for dynamic content
  addLiveRegions() {
    // Generation status
    const statusRegion = document.createElement('div');
    statusRegion.setAttribute('aria-live', 'polite');
    statusRegion.setAttribute('aria-atomic', 'true');
    statusRegion.className = 'sr-only';
    statusRegion.id = 'generation-status';
    document.body.appendChild(statusRegion);

    // Error messages
    const errorRegion = document.createElement('div');
    errorRegion.setAttribute('aria-live', 'assertive');
    errorRegion.setAttribute('aria-atomic', 'true');
    errorRegion.className = 'sr-only';
    errorRegion.id = 'error-messages';
    document.body.appendChild(errorRegion);
  }

  // Setup form labels
  setupFormLabels() {
    // Textarea
    const textarea = document.getElementById('data-input');
    if (textarea) {
      if (!textarea.getAttribute('aria-label')) {
        textarea.setAttribute('aria-label', 'Describe your data for chart generation');
      }
      textarea.setAttribute('aria-describedby', 'input-help input-char-count');
    }

    // Add help text
    const inputHelp = document.createElement('div');
    inputHelp.id = 'input-help';
    inputHelp.className = 'sr-only';
    inputHelp.textContent = 'Enter your data in plain English or use the examples provided';
    textarea?.parentNode.insertBefore(inputHelp, textarea);

    // Character count
    const charCount = document.createElement('div');
    charCount.id = 'input-char-count';
    charCount.className = 'sr-only';
    charCount.setAttribute('aria-live', 'polite');
    textarea?.parentNode.appendChild(charCount);
  }

  // Setup color blind support
  setupColorBlindSupport() {
    const style = document.createElement('style');
    style.id = 'color-blind-filters';
    style.textContent = `
      .color-blind-protanopia {
        filter: url(#protanopia-filter);
      }
      
      .color-blind-deuteranopia {
        filter: url(#deuteranopia-filter);
      }
      
      .color-blind-tritanopia {
        filter: url(#tritanopia-filter);
      }
    `;
    document.head.appendChild(style);

    // Add SVG filters
    this.addColorBlindFilters();
  }

  // Add SVG color blind filters
  addColorBlindFilters() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('style', 'position: absolute; width: 0; height: 0;');
    svg.innerHTML = `
      <defs>
        <filter id="protanopia-filter">
          <feColorMatrix type="matrix" values="
            0.567, 0.433, 0,     0, 0
            0.558, 0.442, 0,     0, 0
            0,     0.242, 0.758, 0, 0
            0,     0,     0,     1, 0
          "/>
        </filter>
        
        <filter id="deuteranopia-filter">
          <feColorMatrix type="matrix" values="
            0.625, 0.375, 0,   0, 0
            0.7,   0.3,   0,   0, 0
            0,     0.3,   0.7, 0, 0
            0,     0,     0,   1, 0
          "/>
        </filter>
        
        <filter id="tritanopia-filter">
          <feColorMatrix type="matrix" values="
            0.95, 0.05,  0,     0, 0
            0,    0.433, 0.567, 0, 0
            0,    0.475, 0.525, 0, 0
            0,    0,     0,     1, 0
          "/>
        </filter>
      </defs>
    `;
    document.body.appendChild(svg);
  }

  // Setup motion preferences
  setupMotionPreferences() {
    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.settings.reducedMotion = true;
      document.body.classList.add('reduced-motion');
      document.getElementById('reduced-motion').checked = true;
    }

    // Listen for changes
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
      this.settings.reducedMotion = e.matches;
      this.toggleReducedMotion();
    });
  }

  // Setup high contrast
  setupHighContrast() {
    // Check for high contrast preference
    if (window.matchMedia('(prefers-contrast: high)').matches) {
      this.settings.highContrast = true;
      document.body.classList.add('high-contrast');
      document.getElementById('high-contrast').checked = true;
    }

    // Listen for changes
    window.matchMedia('(prefers-contrast: high)').addEventListener('change', (e) => {
      this.settings.highContrast = e.matches;
      this.toggleHighContrast();
    });
  }

  // Toggle functions
  toggleHighContrast() {
    this.settings.highContrast = !this.settings.highContrast;
    document.body.classList.toggle('high-contrast');
    this.announce(`High contrast ${this.settings.highContrast ? 'enabled' : 'disabled'}`);
  }

  toggleLargeText() {
    this.settings.largeText = !this.settings.largeText;
    document.body.classList.toggle('large-text');
    this.announce(`Large text ${this.settings.largeText ? 'enabled' : 'disabled'}`);
  }

  toggleReducedMotion() {
    this.settings.reducedMotion = !this.settings.reducedMotion;
    document.body.classList.toggle('reduced-motion');
    this.announce(`Reduced motion ${this.settings.reducedMotion ? 'enabled' : 'disabled'}`);
  }

  toggleFocusVisible() {
    this.settings.focusVisible = !this.settings.focusVisible;
    document.body.classList.toggle('focus-visible');
    document.body.classList.toggle('no-focus-outline');
    this.announce(`Focus indicators ${this.settings.focusVisible ? 'enabled' : 'disabled'}`);
  }

  setColorBlindMode(mode) {
    // Remove existing classes
    document.body.classList.remove('color-blind-protanopia', 'color-blind-deuteranopia', 'color-blind-tritanopia');
    
    this.settings.colorBlind = mode;
    
    if (mode !== 'none') {
      document.body.classList.add(`color-blind-${mode}`);
    }
    
    this.announce(`Color vision mode set to ${mode}`);
  }

  toggleScreenReaderMode() {
    this.settings.screenReader = !this.settings.screenReader;
    document.body.classList.toggle('screen-reader-mode');
    this.announce(`Screen reader mode ${this.settings.screenReader ? 'enabled' : 'disabled'}`);
  }

  // Run accessibility audit
  runAccessibilityAudit() {
    const issues = [];
    
    // Check for missing alt text
    document.querySelectorAll('img:not([alt])').forEach(img => {
      issues.push({
        type: 'missing-alt',
        element: img,
        message: 'Image missing alt text'
      });
    });

    // Check for missing labels
    document.querySelectorAll('input:not([aria-label]):not([placeholder])').forEach(input => {
      const label = document.querySelector(`label[for="${input.id}"]`);
      if (!label) {
        issues.push({
          type: 'missing-label',
          element: input,
          message: 'Input missing label or aria-label'
        });
      }
    });

    // Check for proper heading structure
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let lastLevel = 0;
    headings.forEach(heading => {
      const level = parseInt(heading.tagName.substring(1));
      if (level > lastLevel + 1) {
        issues.push({
          type: 'heading-skip',
          element: heading,
          message: `Heading level skipped (h${lastLevel} to h${level})`
        });
      }
      lastLevel = level;
    });

    // Log issues in development
    if (issues.length > 0 && window.location.hostname === 'localhost') {
      console.group('🔍 Accessibility Issues Found');
      issues.forEach(issue => {
        console.warn(`${issue.message}:`, issue.element);
      });
      console.groupEnd();
    }

    return issues;
  }

  // Get accessibility score
  getAccessibilityScore() {
    const issues = this.runAccessibilityAudit();
    const totalChecks = 100; // Simplified scoring
    const deductions = issues.length * 5;
    const score = Math.max(0, totalChecks - deductions);
    
    return {
      score: score,
      issues: issues.length,
      grade: score >= 90 ? 'AAA' : score >= 80 ? 'AA' : score >= 70 ? 'A' : 'Needs Improvement'
    };
  }
}

// Initialize accessibility manager
document.addEventListener('DOMContentLoaded', () => {
  window.accessibility = new AccessibilityManager();
});

export { AccessibilityManager };

// High Priority UX Fixes - Navigation, Validation, Mobile & Auto-Save
class HighPriorityUXFix {
  constructor() {
    this.navigationState = new Map();
    this.validationRules = new Map();
    this.mobileOptimizations = new Map();
    this.autoSaveState = new Map();
    this.currentBreakpoint = this.getBreakpoint();
    this.saveInProgress = false;
    this.lastSaveTime = null;
    this.unsavedChanges = false;
    
    this.init();
  }

  init() {
    this.fixInconsistentNavigation();
    this.fixInputValidation();
    this.fixMobileExperience();
    this.fixAutoSaveSystem();
    this.setupResponsiveHandling();
    this.setupCrossPageConsistency();
    this.setupAccessibilityEnhancements();
    this.setupPerformanceOptimizations();
  }

  // HIGH PRIORITY FIX 4: Inconsistent Navigation Across Pages
  fixInconsistentNavigation() {
    this.createUnifiedNavigation();
    this.setupNavigationState();
    this.setupBreadcrumbSystem();
    this.setupQuickActions();
    this.setupKeyboardNavigation();
    this.setupNavigationPersistence();
  }

  // Create unified navigation system
  createUnifiedNavigation() {
    // Remove existing inconsistent navigation
    this.removeExistingNavigation();

    // Create unified navigation component
    const unifiedNav = this.createUnifiedNavigationComponent();
    document.body.prepend(unifiedNav);

    // Setup navigation behavior
    this.setupNavigationBehavior(unifiedNav);

    // Ensure consistency across all pages
    this.enforceNavigationConsistency();
  }

  // Remove existing inconsistent navigation
  removeExistingNavigation() {
    const inconsistentSelectors = [
      '.nav', '.navigation', '.navbar', '.main-nav',
      '.header-nav', '.top-nav', '.menu-nav'
    ];

    inconsistentSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => el.remove());
    });
  }

  // Create unified navigation component
  createUnifiedNavigationComponent() {
    const nav = document.createElement('nav');
    nav.className = 'unified-navigation';
    nav.innerHTML = `
      <div class="nav-container">
        <div class="nav-brand">
          <a href="/" class="brand-link">
            <div class="brand-icon">
              <i class="fas fa-chart-line"></i>
            </div>
            <span class="brand-text">VIZOM</span>
          </a>
        </div>
        
        <div class="nav-menu" id="navMenu">
          <div class="nav-section">
            <div class="nav-section-title">Create</div>
            <div class="nav-items">
              <a href="/create" class="nav-item ${this.isActivePage('/create') ? 'active' : ''}" data-page="create">
                <i class="fas fa-plus"></i>
                <span>New Chart</span>
              </a>
              <a href="/templates" class="nav-item ${this.isActivePage('/templates') ? 'active' : ''}" data-page="templates">
                <i class="fas fa-layer-group"></i>
                <span>Templates</span>
              </a>
              <a href="/import" class="nav-item ${this.isActivePage('/import') ? 'active' : ''}" data-page="import">
                <i class="fas fa-upload"></i>
                <span>Import Data</span>
              </a>
            </div>
          </div>
          
          <div class="nav-section">
            <div class="nav-section-title">Manage</div>
            <div class="nav-items">
              <a href="/dashboard" class="nav-item ${this.isActivePage('/dashboard') ? 'active' : ''}" data-page="dashboard">
                <i class="fas fa-th-large"></i>
                <span>Dashboard</span>
              </a>
              <a href="/projects" class="nav-item ${this.isActivePage('/projects') ? 'active' : ''}" data-page="projects">
                <i class="fas fa-folder"></i>
                <span>Projects</span>
              </a>
              <a href="/recent" class="nav-item ${this.isActivePage('/recent') ? 'active' : ''}" data-page="recent">
                <i class="fas fa-clock"></i>
                <span>Recent</span>
              </a>
            </div>
          </div>
          
          <div class="nav-section">
            <div class="nav-section-title">Learn</div>
            <div class="nav-items">
              <a href="/tutorials" class="nav-item ${this.isActivePage('/tutorials') ? 'active' : ''}" data-page="tutorials">
                <i class="fas fa-graduation-cap"></i>
                <span>Tutorials</span>
              </a>
              <a href="/examples" class="nav-item ${this.isActivePage('/examples') ? 'active' : ''}" data-page="examples">
                <i class="fas fa-flask"></i>
                <span>Examples</span>
              </a>
              <a href="/help" class="nav-item ${this.isActivePage('/help') ? 'active' : ''}" data-page="help">
                <i class="fas fa-question-circle"></i>
                <span>Help</span>
              </a>
            </div>
          </div>
        </div>
        
        <div class="nav-actions">
          <button class="nav-action-btn" id="searchToggle" aria-label="Search">
            <i class="fas fa-search"></i>
          </button>
          <button class="nav-action-btn" id="notificationsToggle" aria-label="Notifications">
            <i class="fas fa-bell"></i>
            <span class="notification-badge" id="notificationBadge">3</span>
          </button>
          <button class="nav-action-btn" id="userMenuToggle" aria-label="User menu">
            <i class="fas fa-user-circle"></i>
          </button>
          <button class="nav-action-btn mobile-only" id="mobileMenuToggle" aria-label="Mobile menu">
            <i class="fas fa-bars"></i>
          </button>
        </div>
      </div>
      
      <!-- Mobile Navigation Overlay -->
      <div class="nav-mobile-overlay" id="navMobileOverlay">
        <div class="nav-mobile-content">
          <div class="nav-mobile-header">
            <div class="nav-brand">
              <div class="brand-icon">
                <i class="fas fa-chart-line"></i>
              </div>
              <span class="brand-text">VIZOM</span>
            </div>
            <button class="nav-mobile-close" id="navMobileClose">
              <i class="fas fa-times"></i>
            </button>
          </div>
          
          <div class="nav-mobile-body">
            <!-- Mobile menu items will be cloned here -->
          </div>
          
          <div class="nav-mobile-footer">
            <div class="mobile-user-info">
              <div class="user-avatar">
                <i class="fas fa-user"></i>
              </div>
              <div class="user-details">
                <div class="user-name">John Doe</div>
                <div class="user-email">john@example.com</div>
              </div>
            </div>
            <button class="mobile-signout-btn">
              <i class="fas fa-sign-out-alt"></i>
              Sign Out
            </button>
          </div>
        </div>
      </div>
      
      <!-- Search Overlay -->
      <div class="nav-search-overlay" id="navSearchOverlay">
        <div class="nav-search-content">
          <div class="search-input-wrapper">
            <i class="fas fa-search search-icon"></i>
            <input type="text" class="nav-search-input" id="navSearchInput" placeholder="Search charts, templates, help...">
            <button class="search-close" id="searchClose">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="search-results" id="searchResults">
            <div class="search-section">
              <h4>Quick Actions</h4>
              <div class="search-quick-actions">
                <a href="/create" class="search-action">
                  <i class="fas fa-plus"></i>
                  Create New Chart
                </a>
                <a href="/templates" class="search-action">
                  <i class="fas fa-layer-group"></i>
                  Browse Templates
                </a>
                <a href="/import" class="search-action">
                  <i class="fas fa-upload"></i>
                  Import Data
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    return nav;
  }

  // Setup navigation behavior
  setupNavigationBehavior(nav) {
    // Mobile menu toggle
    const mobileToggle = nav.querySelector('#mobileMenuToggle');
    const mobileOverlay = nav.querySelector('#navMobileOverlay');
    const mobileClose = nav.querySelector('#navMobileClose');

    mobileToggle.addEventListener('click', () => {
      this.openMobileNavigation();
    });

    mobileClose.addEventListener('click', () => {
      this.closeMobileNavigation();
    });

    // Search toggle
    const searchToggle = nav.querySelector('#searchToggle');
    const searchOverlay = nav.querySelector('#navSearchOverlay');
    const searchClose = nav.querySelector('#searchClose');
    const searchInput = nav.querySelector('#navSearchInput');

    searchToggle.addEventListener('click', () => {
      this.openSearch();
    });

    searchClose.addEventListener('click', () => {
      this.closeSearch();
    });

    searchInput.addEventListener('input', (e) => {
      this.handleSearch(e.target.value);
    });

    // Navigation item clicks
    nav.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', (e) => {
        this.handleNavigationClick(e);
      });
    });

    // Keyboard navigation
    this.setupNavigationKeyboardShortcuts(nav);

    // Clone desktop menu to mobile
    this.cloneMenuToMobile(nav);
  }

  // Handle navigation clicks
  handleNavigationClick(e) {
    e.preventDefault();
    const item = e.currentTarget;
    const href = item.getAttribute('href');
    const page = item.dataset.page;

    // Check for unsaved changes
    if (this.unsavedChanges) {
      this.showUnsavedChangesDialog(() => {
        this.navigateToPage(href, page);
      });
    } else {
      this.navigateToPage(href, page);
    }
  }

  // Navigate to page with state management
  navigateToPage(href, page) {
    // Update active state
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.remove('active');
    });
    document.querySelector(`[data-page="${page}"]`)?.classList.add('active');

    // Save navigation state
    this.navigationState.set('currentPage', page);
    this.navigationState.set('lastVisited', Date.now());

    // Close mobile menu if open
    this.closeMobileNavigation();

    // Navigate
    window.location.href = href;
  }

  // Setup breadcrumb system
  setupBreadcrumbSystem() {
    let breadcrumbContainer = document.querySelector('.breadcrumb-container');
    
    if (!breadcrumbContainer) {
      breadcrumbContainer = document.createElement('div');
      breadcrumbContainer.className = 'breadcrumb-container';
      
      const main = document.querySelector('.main-content') || document.querySelector('main');
      if (main) {
        main.prepend(breadcrumbContainer);
      }
    }

    this.updateBreadcrumbs();
  }

  // Update breadcrumbs based on current page
  updateBreadcrumbs() {
    const page = this.getCurrentPage();
    const breadcrumbStructure = this.getBreadcrumbStructure(page);
    
    const breadcrumbContainer = document.querySelector('.breadcrumb-container');
    if (breadcrumbContainer) {
      breadcrumbContainer.innerHTML = `
        <nav class="breadcrumb-nav" aria-label="Breadcrumb">
          <ol class="breadcrumb-list">
            ${breadcrumbStructure.map((crumb, index) => `
              <li class="breadcrumb-item ${index === breadcrumbStructure.length - 1 ? 'active' : ''}">
                ${index < breadcrumbStructure.length - 1 ? 
                  `<a href="${crumb.href}">${crumb.label}</a>` : 
                  crumb.label
                }
              </li>
            `).join('')}
          </ol>
        </nav>
      `;
    }
  }

  // Get breadcrumb structure for current page
  getBreadcrumbStructure(page) {
    const structures = {
      'create': [
        { label: 'Home', href: '/' },
        { label: 'Create', href: '/create' }
      ],
      'templates': [
        { label: 'Home', href: '/' },
        { label: 'Templates', href: '/templates' }
      ],
      'dashboard': [
        { label: 'Home', href: '/' },
        { label: 'Dashboard', href: '/dashboard' }
      ],
      'projects': [
        { label: 'Home', href: '/' },
        { label: 'Projects', href: '/projects' }
      ]
    };

    return structures[page] || [{ label: 'Home', href: '/' }];
  }

  // HIGH PRIORITY FIX 5: Missing Input Validation and Helpful Hints
  fixInputValidation() {
    this.createValidationSystem();
    this.setupRealTimeValidation();
    this.setupHelpfulHints();
    this.setupInputFormatting();
    this.setupErrorPrevention();
  }

  // Create comprehensive validation system
  createValidationSystem() {
    // Define validation rules
    this.defineValidationRules();

    // Apply validation to all forms
    document.querySelectorAll('form, .form, .input-group').forEach(form => {
      this.enhanceFormWithValidation(form);
    });

    // Setup validation event listeners
    this.setupValidationEvents();
  }

  // Define validation rules
  defineValidationRules() {
    this.validationRules = {
      'email': {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Please enter a valid email address',
        hint: 'Example: user@domain.com'
      },
      'phone': {
        pattern: /^[\d\s\-\+\(\)]+$/,
        message: 'Please enter a valid phone number',
        hint: 'Include country code: +1 555-123-4567'
      },
      'number': {
        pattern: /^-?\d*\.?\d+$/,
        message: 'Please enter a valid number',
        hint: 'Use decimal point for fractions: 123.45'
      },
      'url': {
        pattern: /^https?:\/\/.+/,
        message: 'Please enter a valid URL starting with http:// or https://',
        hint: 'Example: https://example.com'
      },
      'csv-file': {
        validation: (file) => {
          const validTypes = ['text/csv', 'application/vnd.ms-excel'];
          const validExtensions = ['.csv', '.xls', '.xlsx'];
          return validTypes.includes(file.type) || 
                 validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
        },
        message: 'Please upload a valid CSV or Excel file',
        hint: 'Supported formats: .csv, .xls, .xlsx'
      },
      'chart-title': {
        validation: (value) => {
          return value.trim().length >= 3 && value.trim().length <= 100;
        },
        message: 'Chart title must be between 3 and 100 characters',
        hint: 'Make it descriptive but concise'
      },
      'data-range': {
        validation: (value) => {
          const num = parseFloat(value);
          return !isNaN(num) && num >= 0 && num <= 1000000;
        },
        message: 'Value must be between 0 and 1,000,000',
        hint: 'Enter a positive number within the allowed range'
      }
    };
  }

  // Enhance form with validation
  enhanceFormWithValidation(form) {
    const inputs = form.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
      this.enhanceInputWithValidation(input);
    });
  }

  // Enhance individual input with validation
  enhanceInputWithValidation(input) {
    const validationType = this.getInputValidationType(input);
    if (!validationType) return;

    // Wrap input with validation container
    const wrapper = document.createElement('div');
    wrapper.className = 'validation-wrapper';
    
    // Insert wrapper before input
    input.parentNode.insertBefore(wrapper, input);
    wrapper.appendChild(input);

    // Add validation elements
    const hint = document.createElement('div');
    hint.className = 'input-hint';
    hint.textContent = this.validationRules[validationType].hint || '';
    
    const error = document.createElement('div');
    error.className = 'input-error';
    error.style.display = 'none';
    
    const success = document.createElement('div');
    success.className = 'input-success';
    success.style.display = 'none';
    success.innerHTML = '<i class="fas fa-check"></i> Valid';
    
    wrapper.appendChild(hint);
    wrapper.appendChild(error);
    wrapper.appendChild(success);

    // Store validation info
    input.dataset.validationType = validationType;
    input.dataset.validationWrapper = 'true';

    // Setup validation events
    this.setupInputValidationEvents(input, validationType);
  }

  // Get validation type for input
  getInputValidationType(input) {
    const type = input.type;
    const name = input.name;
    const className = input.className;
    const placeholder = input.placeholder;

    // Check explicit data attribute
    if (input.dataset.validation) {
      return input.dataset.validation;
    }

    // Check by type
    if (type === 'email') return 'email';
    if (type === 'tel') return 'phone';
    if (type === 'url') return 'url';
    if (type === 'number') return 'number';

    // Check by name
    if (name.includes('email')) return 'email';
    if (name.includes('phone')) return 'phone';
    if (name.includes('title')) return 'chart-title';

    // Check by class
    if (className.includes('csv') || className.includes('file-upload')) return 'csv-file';
    if (className.includes('range') || className.includes('data-value')) return 'data-range';

    // Check by placeholder
    if (placeholder.includes('email')) return 'email';
    if (placeholder.includes('phone')) return 'phone';

    return null;
  }

  // Setup input validation events
  setupInputValidationEvents(input, validationType) {
    const rule = this.validationRules[validationType];
    if (!rule) return;

    const wrapper = input.closest('.validation-wrapper');
    const error = wrapper.querySelector('.input-error');
    const success = wrapper.querySelector('.input-success');

    // Real-time validation on input
    input.addEventListener('input', () => {
      this.validateInput(input, rule, error, success);
    });

    // Validation on blur
    input.addEventListener('blur', () => {
      this.validateInput(input, rule, error, success);
    });

    // Clear error on focus
    input.addEventListener('focus', () => {
      this.clearInputError(input, error, success);
    });
  }

  // Validate input
  validateInput(input, rule, errorElement, successElement) {
    let isValid = false;
    const value = input.value.trim();

    if (!value) {
      // Empty is valid for optional fields
      isValid = !input.hasAttribute('required');
    } else if (rule.pattern) {
      isValid = rule.pattern.test(value);
    } else if (rule.validation) {
      isValid = rule.validation(value);
    } else {
      isValid = true;
    }

    if (isValid) {
      this.showInputSuccess(input, errorElement, successElement);
    } else {
      this.showInputError(input, errorElement, successElement, rule.message);
    }

    return isValid;
  }

  // Show input error
  showInputError(input, errorElement, successElement, message) {
    input.classList.add('input-error');
    input.classList.remove('input-success');
    
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    
    successElement.style.display = 'none';
    
    // Add shake animation
    input.classList.add('input-shake');
    setTimeout(() => {
      input.classList.remove('input-shake');
    }, 500);
  }

  // Show input success
  showInputSuccess(input, errorElement, successElement) {
    input.classList.add('input-success');
    input.classList.remove('input-error');
    
    errorElement.style.display = 'none';
    successElement.style.display = 'flex';
    
    // Hide success after 2 seconds
    setTimeout(() => {
      if (input.value.trim()) {
        successElement.style.display = 'none';
      }
    }, 2000);
  }

  // Clear input error
  clearInputError(input, errorElement, successElement) {
    input.classList.remove('input-error', 'input-shake');
    errorElement.style.display = 'none';
  }

  // Setup helpful hints system
  setupHelpfulHints() {
    this.createTooltipSystem();
    this.setupContextualHelp();
    this.setupProgressiveHints();
  }

  // Create tooltip system
  createTooltipSystem() {
    document.addEventListener('mouseenter', (e) => {
      const target = e.target.closest('[data-tooltip], [title]');
      if (target) {
        this.showTooltip(target);
      }
    });

    document.addEventListener('mouseleave', (e) => {
      const target = e.target.closest('[data-tooltip], [title]');
      if (target) {
        this.hideTooltip(target);
      }
    });
  }

  // Show tooltip
  showTooltip(element) {
    let tooltipText = element.dataset.tooltip || element.title;
    if (!tooltipText) return;

    // Remove title to prevent native tooltip
    if (element.title) {
      element.dataset.originalTitle = element.title;
      element.title = '';
    }

    // Create tooltip element
    const tooltip = document.createElement('div');
    tooltip.className = 'validation-tooltip';
    tooltip.textContent = tooltipText;
    tooltip.id = 'tooltip-' + Date.now();

    document.body.appendChild(tooltip);

    // Position tooltip
    const rect = element.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    
    let top = rect.top - tooltipRect.height - 8;
    let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);

    // Adjust position if needed
    if (top < 0) {
      top = rect.bottom + 8;
    }
    
    if (left < 0) {
      left = 8;
    } else if (left + tooltipRect.width > window.innerWidth) {
      left = window.innerWidth - tooltipRect.width - 8;
    }

    tooltip.style.top = top + 'px';
    tooltip.style.left = left + 'px';
    
    // Show with animation
    setTimeout(() => {
      tooltip.classList.add('tooltip-show');
    }, 10);

    // Store reference
    element.dataset.tooltipId = tooltip.id;
  }

  // Hide tooltip
  hideTooltip(element) {
    const tooltipId = element.dataset.tooltipId;
    if (tooltipId) {
      const tooltip = document.getElementById(tooltipId);
      if (tooltip) {
        tooltip.remove();
      }
      delete element.dataset.tooltipId;
    }

    // Restore original title
    if (element.dataset.originalTitle) {
      element.title = element.dataset.originalTitle;
      delete element.dataset.originalTitle;
    }
  }

  // HIGH PRIORITY FIX 6: Poor Mobile Experience on Key Flows
  fixMobileExperience() {
    this.optimizeMobileLayout();
    this.setupTouchInteractions();
    this.optimizeMobileForms();
    this.setupMobileGestures();
    this.optimizeMobilePerformance();
  }

  // Optimize mobile layout
  optimizeMobileLayout() {
    // Add mobile-specific classes
    document.body.classList.add('mobile-optimized');

    // Setup responsive breakpoints
    this.setupResponsiveBreakpoints();

    // Optimize navigation for mobile
    this.optimizeMobileNavigation();

    // Optimize content layout
    this.optimizeMobileContent();

    // Setup mobile viewport handling
    this.setupMobileViewport();
  }

  // Setup responsive breakpoints
  setupResponsiveBreakpoints() {
    const updateBreakpoint = () => {
      this.currentBreakpoint = this.getBreakpoint();
      document.body.setAttribute('data-breakpoint', this.currentBreakpoint);
      
      // Apply breakpoint-specific optimizations
      this.applyBreakpointOptimizations(this.currentBreakpoint);
    };

    // Initial update
    updateBreakpoint();

    // Update on resize
    window.addEventListener('resize', this.debounce(updateBreakpoint, 250));
  }

  // Get current breakpoint
  getBreakpoint() {
    const width = window.innerWidth;
    
    if (width < 480) return 'mobile';
    if (width < 768) return 'mobile-large';
    if (width < 1024) return 'tablet';
    if (width < 1440) return 'desktop';
    return 'desktop-large';
  }

  // Apply breakpoint-specific optimizations
  applyBreakpointOptimizations(breakpoint) {
    switch (breakpoint) {
      case 'mobile':
        this.enableMobileOptimizations();
        break;
      case 'mobile-large':
        this.enableMobileLargeOptimizations();
        break;
      case 'tablet':
        this.enableTabletOptimizations();
        break;
      case 'desktop':
        this.enableDesktopOptimizations();
        break;
    }
  }

  // Enable mobile optimizations
  enableMobileOptimizations() {
    // Optimize touch targets
    this.optimizeTouchTargets();
    
    // Enable swipe gestures
    this.enableSwipeGestures();
    
    // Optimize form layouts
    this.optimizeMobileForms();
    
    // Enable mobile-specific features
    this.enableMobileFeatures();
  }

  // Optimize touch targets
  optimizeTouchTargets() {
    const touchTargets = document.querySelectorAll('button, a, input, .clickable');
    
    touchTargets.forEach(target => {
      const rect = target.getBoundingClientRect();
      
      // Ensure minimum touch target size (44x44px)
      if (rect.width < 44 || rect.height < 44) {
        target.style.minWidth = '44px';
        target.style.minHeight = '44px';
        target.style.display = 'flex';
        target.style.alignItems = 'center';
        target.style.justifyContent = 'center';
      }
      
      // Add touch feedback
      target.addEventListener('touchstart', () => {
        target.classList.add('touch-active');
      });
      
      target.addEventListener('touchend', () => {
        setTimeout(() => {
          target.classList.remove('touch-active');
        }, 150);
      });
    });
  }

  // Setup mobile gestures
  setupMobileGestures() {
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;

    document.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    });

    document.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      touchEndY = e.changedTouches[0].screenY;
      this.handleSwipeGesture(touchStartX, touchStartY, touchEndX, touchEndY);
    });
  }

  // Handle swipe gestures
  handleSwipeGesture(startX, startY, endX, endY) {
    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const minSwipeDistance = 50;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      if (Math.abs(deltaX) > minSwipeDistance) {
        if (deltaX > 0) {
          this.handleSwipeRight();
        } else {
          this.handleSwipeLeft();
        }
      }
    } else {
      // Vertical swipe
      if (Math.abs(deltaY) > minSwipeDistance) {
        if (deltaY > 0) {
          this.handleSwipeDown();
        } else {
          this.handleSwipeUp();
        }
      }
    }
  }

  // Handle swipe right (open navigation)
  handleSwipeRight() {
    if (this.currentBreakpoint === 'mobile' || this.currentBreakpoint === 'mobile-large') {
      this.openMobileNavigation();
    }
  }

  // Handle swipe left (close navigation)
  handleSwipeLeft() {
    if (this.currentBreakpoint === 'mobile' || this.currentBreakpoint === 'mobile-large') {
      this.closeMobileNavigation();
    }
  }

  // Optimize mobile forms
  optimizeMobileForms() {
    const forms = document.querySelectorAll('form, .form');
    
    forms.forEach(form => {
      // Make inputs full width on mobile
      const inputs = form.querySelectorAll('input, textarea, select');
      inputs.forEach(input => {
        input.classList.add('mobile-input');
      });

      // Stack form elements vertically
      const formGroups = form.querySelectorAll('.form-group, .input-group');
      formGroups.forEach(group => {
        group.classList.add('mobile-form-group');
      });

      // Optimize buttons
      const buttons = form.querySelectorAll('button, .btn');
      buttons.forEach(button => {
        button.classList.add('mobile-button');
      });
    });
  }

  // HIGH PRIORITY FIX 7: No Way to Save Work in Progress
  fixAutoSaveSystem() {
    this.createAutoSaveSystem();
    this.setupSaveIndicators();
    this.setupConflictResolution();
    this.setupOfflineSupport();
    this.setupSaveRecovery();
  }

  // Create comprehensive auto-save system
  createAutoSaveSystem() {
    // Create save status indicator
    this.createSaveStatusIndicator();

    // Setup auto-save triggers
    this.setupAutoSaveTriggers();

    // Setup save intervals
    this.setupSaveIntervals();

    // Setup save state management
    this.setupSaveStateManagement();
  }

  // Create save status indicator
  createSaveStatusIndicator() {
    let indicator = document.querySelector('.save-status-indicator');
    
    if (!indicator) {
      indicator = document.createElement('div');
      indicator.className = 'save-status-indicator';
      indicator.innerHTML = `
        <div class="save-status-content">
          <div class="save-icon" id="saveIcon">
            <i class="fas fa-check"></i>
          </div>
          <div class="save-text" id="saveText">All changes saved</div>
          <div class="save-time" id="saveTime">Just now</div>
        </div>
        <div class="save-progress" id="saveProgress" style="display: none;">
          <div class="progress-bar">
            <div class="progress-fill" id="saveProgressFill"></div>
          </div>
        </div>
      `;
      
      document.body.appendChild(indicator);
    }

    this.saveIndicator = indicator;
  }

  // Setup auto-save triggers
  setupAutoSaveTriggers() {
    // Input changes
    document.addEventListener('input', (e) => {
      if (this.isRelevantInput(e.target)) {
        this.scheduleAutoSave('input');
      }
    });

    // Form submissions
    document.addEventListener('submit', (e) => {
      this.saveWork('manual');
    });

    // Page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.saveWork('visibility_hidden');
      }
    });

    // Before unload
    window.addEventListener('beforeunload', (e) => {
      if (this.unsavedChanges) {
        this.saveWork('before_unload');
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
      }
    });

    // Online/offline changes
    window.addEventListener('online', () => {
      this.syncOfflineChanges();
    });

    window.addEventListener('offline', () => {
      this.enableOfflineMode();
    });
  }

  // Schedule auto-save with debouncing
  scheduleAutoSave(trigger) {
    // Clear existing timeout
    if (this.autoSaveTimeout) {
      clearTimeout(this.autoSaveTimeout);
    }

    // Mark as having unsaved changes
    this.unsavedChanges = true;
    this.updateSaveStatus('unsaved');

    // Schedule save
    this.autoSaveTimeout = setTimeout(() => {
      this.saveWork(trigger);
    }, 2000); // 2 second debounce
  }

  // Save work with progress indication
  async saveWork(trigger) {
    if (this.saveInProgress) return;

    this.saveInProgress = true;
    this.updateSaveStatus('saving');

    try {
      // Collect form data
      const formData = this.collectFormData();
      
      // Save to localStorage first
      this.saveToLocalStorage(formData);
      
      // Save to server if online
      if (navigator.onLine) {
        await this.saveToServer(formData);
      }

      // Update save status
      this.lastSaveTime = Date.now();
      this.unsavedChanges = false;
      this.updateSaveStatus('saved');

      // Track save event
      this.trackSaveEvent(trigger);

    } catch (error) {
      console.error('Save failed:', error);
      this.updateSaveStatus('error');
      this.handleSaveError(error);
    } finally {
      this.saveInProgress = false;
    }
  }

  // Collect form data
  collectFormData() {
    const formData = {};
    const forms = document.querySelectorAll('form, .data-form');
    
    forms.forEach(form => {
      const formName = form.dataset.formName || 'default';
      formData[formName] = this.serializeForm(form);
    });

    // Add metadata
    formData.metadata = {
      url: window.location.href,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      version: '1.0.0'
    };

    return formData;
  }

  // Serialize form
  serializeForm(form) {
    const data = {};
    const inputs = form.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
      const name = input.name || input.id;
      if (name) {
        data[name] = input.value;
      }
    });

    return data;
  }

  // Save to localStorage
  saveToLocalStorage(data) {
    try {
      const key = this.getSaveKey();
      localStorage.setItem(key, JSON.stringify(data));
      
      // Also save to recent saves
      this.addToRecentSaves(data);
    } catch (error) {
      console.error('LocalStorage save failed:', error);
    }
  }

  // Save to server
  async saveToServer(data) {
    const response = await fetch('/api/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`Server save failed: ${response.status}`);
    }

    return response.json();
  }

  // Update save status indicator
  updateSaveStatus(status) {
    if (!this.saveIndicator) return;

    const icon = this.saveIndicator.querySelector('#saveIcon');
    const text = this.saveIndicator.querySelector('#saveText');
    const time = this.saveIndicator.querySelector('#saveTime');
    const progress = this.saveIndicator.querySelector('#saveProgress');

    const statusConfig = {
      'saved': {
        icon: 'fa-check',
        text: 'All changes saved',
        time: 'Just now',
        progress: false
      },
      'saving': {
        icon: 'fa-spinner fa-spin',
        text: 'Saving...',
        time: '',
        progress: true
      },
      'unsaved': {
        icon: 'fa-pencil-alt',
        text: 'Unsaved changes',
        time: '',
        progress: false
      },
      'error': {
        icon: 'fa-exclamation-triangle',
        text: 'Save failed',
        time: '',
        progress: false
      }
    };

    const config = statusConfig[status];
    if (config) {
      icon.innerHTML = `<i class="fas ${config.icon}"></i>`;
      text.textContent = config.text;
      time.textContent = config.time;
      progress.style.display = config.progress ? 'block' : 'none';
    }

    // Update last save time periodically
    if (status === 'saved') {
      this.startSaveTimeUpdate();
    }
  }

  // Start save time update
  startSaveTimeUpdate() {
    // Clear existing interval
    if (this.saveTimeInterval) {
      clearInterval(this.saveTimeInterval);
    }

    // Update time every minute
    this.saveTimeInterval = setInterval(() => {
      if (this.lastSaveTime) {
        const timeAgo = this.getTimeAgo(this.lastSaveTime);
        const timeElement = this.saveIndicator.querySelector('#saveTime');
        if (timeElement) {
          timeElement.textContent = timeAgo;
        }
      }
    }, 60000);
  }

  // Get time ago string
  getTimeAgo(timestamp) {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  }

  // Utility methods
  getCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('/create')) return 'create';
    if (path.includes('/templates')) return 'templates';
    if (path.includes('/dashboard')) return 'dashboard';
    if (path.includes('/projects')) return 'projects';
    return 'home';
  }

  isActivePage(page) {
    return this.getCurrentPage() === page;
  }

  isRelevantInput(input) {
    const relevantTypes = ['text', 'email', 'number', 'textarea', 'select-one'];
    return relevantTypes.includes(input.type) || input.tagName === 'TEXTAREA';
  }

  getSaveKey() {
    const page = this.getCurrentPage();
    return `vizom_autosave_${page}_${Date.now()}`;
  }

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Public methods
  openMobileNavigation() {
    const overlay = document.querySelector('.nav-mobile-overlay');
    if (overlay) {
      overlay.classList.add('mobile-nav-open');
      document.body.classList.add('mobile-nav-open');
    }
  }

  closeMobileNavigation() {
    const overlay = document.querySelector('.nav-mobile-overlay');
    if (overlay) {
      overlay.classList.remove('mobile-nav-open');
      document.body.classList.remove('mobile-nav-open');
    }
  }

  openSearch() {
    const overlay = document.querySelector('.nav-search-overlay');
    if (overlay) {
      overlay.classList.add('search-open');
      const input = overlay.querySelector('.nav-search-input');
      input.focus();
    }
  }

  closeSearch() {
    const overlay = document.querySelector('.nav-search-overlay');
    if (overlay) {
      overlay.classList.remove('search-open');
      const input = overlay.querySelector('.nav-search-input');
      input.value = '';
      this.handleSearch('');
    }
  }

  handleSearch(query) {
    const resultsContainer = document.querySelector('#searchResults');
    if (!resultsContainer) return;

    if (query.length < 2) {
      resultsContainer.innerHTML = `
        <div class="search-section">
          <h4>Quick Actions</h4>
          <div class="search-quick-actions">
            <a href="/create" class="search-action">
              <i class="fas fa-plus"></i>
              Create New Chart
            </a>
            <a href="/templates" class="search-action">
              <i class="fas fa-layer-group"></i>
              Browse Templates
            </a>
          </div>
        </div>
      `;
      return;
    }

    // Perform actual search
    this.performSearch(query, resultsContainer);
  }

  async performSearch(query, resultsContainer) {
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const results = await response.json();
      
      this.displaySearchResults(results, resultsContainer);
    } catch (error) {
      console.error('Search failed:', error);
      resultsContainer.innerHTML = `
        <div class="search-error">
          <i class="fas fa-exclamation-triangle"></i>
          <span>Search failed. Please try again.</span>
        </div>
      `;
    }
  }

  displaySearchResults(results, container) {
    let html = '';

    if (results.templates && results.templates.length > 0) {
      html += `
        <div class="search-section">
          <h4>Templates</h4>
          <div class="search-results-list">
            ${results.templates.map(template => `
              <a href="/templates/${template.id}" class="search-result">
                <div class="result-icon">
                  <i class="fas fa-layer-group"></i>
                </div>
                <div class="result-content">
                  <div class="result-title">${template.name}</div>
                  <div class="result-description">${template.description}</div>
                </div>
              </a>
            `).join('')}
          </div>
        </div>
      `;
    }

    if (results.charts && results.charts.length > 0) {
      html += `
        <div class="search-section">
          <h4>Your Charts</h4>
          <div class="search-results-list">
            ${results.charts.map(chart => `
              <a href="/charts/${chart.id}" class="search-result">
                <div class="result-icon">
                  <i class="fas fa-chart-line"></i>
                </div>
                <div class="result-content">
                  <div class="result-title">${chart.title}</div>
                  <div class="result-description">Modified ${this.getTimeAgo(chart.modified)}</div>
                </div>
              </a>
            `).join('')}
          </div>
        </div>
      `;
    }

    if (!html) {
      html = `
        <div class="search-empty">
          <i class="fas fa-search"></i>
          <span>No results found for "${query}"</span>
        </div>
      `;
    }

    container.innerHTML = html;
  }

  showUnsavedChangesDialog(callback) {
    const modal = document.createElement('div');
    modal.className = 'unsaved-changes-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>Unsaved Changes</h3>
          <p>You have unsaved changes. Are you sure you want to leave?</p>
        </div>
        <div class="modal-actions">
          <button class="modal-btn secondary" id="stayBtn">
            Stay and Save
          </button>
          <button class="modal-btn primary" id="leaveBtn">
            Leave Anyway
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const stayBtn = modal.querySelector('#stayBtn');
    const leaveBtn = modal.querySelector('#leaveBtn');

    stayBtn.addEventListener('click', () => {
      modal.remove();
    });

    leaveBtn.addEventListener('click', () => {
      modal.remove();
      callback();
    });
  }

  trackSaveEvent(trigger) {
    if (window.analytics) {
      window.analytics.trackCustomEvent('work_saved', {
        trigger: trigger,
        page: this.getCurrentPage(),
        timestamp: Date.now()
      });
    }
  }

  cloneMenuToMobile(nav) {
    const desktopMenu = nav.querySelector('.nav-menu');
    const mobileBody = nav.querySelector('.nav-mobile-body');
    
    if (desktopMenu && mobileBody) {
      mobileBody.innerHTML = desktopMenu.outerHTML;
    }
  }

  setupNavigationKeyboardShortcuts(nav) {
    document.addEventListener('keydown', (e) => {
      // Ctrl/Cmd + K for search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        this.openSearch();
      }
      
      // Escape to close overlays
      if (e.key === 'Escape') {
        this.closeSearch();
        this.closeMobileNavigation();
      }
    });
  }

  enforceNavigationConsistency() {
    // Ensure navigation is present on all pages
    const observer = new MutationObserver(() => {
      const nav = document.querySelector('.unified-navigation');
      if (!nav) {
        const unifiedNav = this.createUnifiedNavigationComponent();
        document.body.prepend(unifiedNav);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
}

// Initialize High Priority UX Fix
document.addEventListener('DOMContentLoaded', () => {
  window.highPriorityUXFix = new HighPriorityUXFix();
});

export { HighPriorityUXFix };

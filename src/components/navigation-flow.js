// Navigation Flow System - Enhanced Wayfinding and Mobile Experience
class NavigationFlowManager {
  constructor() {
    this.currentPath = [];
    this.breadcrumbs = [];
    this.navigationHistory = [];
    this.mobileNavOpen = false;
    this.activeStates = new Map();
    this.navigationGroups = new Map();
    this.shortcuts = new Map();
    
    this.init();
  }

  init() {
    this.setupNavigationGroups();
    this.setupBreadcrumbs();
    this.setupActiveStates();
    this.setupMobileNavigation();
    this.setupKeyboardShortcuts();
    this.setupWayfinding();
    this.setupNavigationHistory();
    this.setupMobileOptimizations();
  }

  // Setup logical navigation groups
  setupNavigationGroups() {
    this.navigationGroups.set('main', {
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-home', path: '/' },
        { id: 'create', label: 'Create Chart', icon: 'fas fa-plus', path: '/create' },
        { id: 'library', label: 'Chart Library', icon: 'fas fa-chart-bar', path: '/library' },
        { id: 'templates', label: 'Templates', icon: 'fas fa-layer-group', path: '/templates' }
      ],
      priority: 1
    });

    this.navigationGroups.set('tools', {
      items: [
        { id: 'data-import', label: 'Import Data', icon: 'fas fa-upload', path: '/import' },
        { id: 'export', label: 'Export', icon: 'fas fa-download', path: '/export' },
        { id: 'settings', label: 'Settings', icon: 'fas fa-cog', path: '/settings' },
        { id: 'help', label: 'Help', icon: 'fas fa-question-circle', path: '/help' }
      ],
      priority: 2
    });

    this.navigationGroups.set('account', {
      items: [
        { id: 'profile', label: 'Profile', icon: 'fas fa-user', path: '/profile' },
        { id: 'billing', label: 'Billing', icon: 'fas fa-credit-card', path: '/billing' },
        { id: 'team', label: 'Team', icon: 'fas fa-users', path: '/team' },
        { id: 'logout', label: 'Logout', icon: 'fas fa-sign-out-alt', path: '/logout' }
      ],
      priority: 3
    });
  }

  // Setup breadcrumb system
  setupBreadcrumbs() {
    this.createBreadcrumbContainer();
    this.updateBreadcrumbs();
    
    // Listen for navigation events
    document.addEventListener('navigationOccurred', (e) => {
      this.handleNavigation(e.detail);
    });

    // Listen for route changes
    window.addEventListener('popstate', () => {
      this.updateBreadcrumbs();
    });
  }

  // Create breadcrumb container
  createBreadcrumbContainer() {
    let container = document.querySelector('.breadcrumb-container');
    
    if (!container) {
      container = document.createElement('nav');
      container.className = 'breadcrumb-container';
      container.setAttribute('aria-label', 'Breadcrumb navigation');
      
      const header = document.querySelector('.header') || document.querySelector('header');
      if (header) {
        header.appendChild(container);
      } else {
        document.body.insertBefore(container, document.body.firstChild);
      }
    }

    container.innerHTML = `
      <ol class="breadcrumb-list" role="list">
        <!-- Breadcrumbs will be added dynamically -->
      </ol>
    `;
  }

  // Update breadcrumbs based on current path
  updateBreadcrumbs() {
    const currentPath = this.getCurrentPath();
    const breadcrumbList = document.querySelector('.breadcrumb-list');
    
    if (!breadcrumbList) return;

    breadcrumbList.innerHTML = '';
    this.breadcrumbs = [];

    // Add home breadcrumb
    this.addBreadcrumb({
      label: 'Home',
      path: '/',
      icon: 'fas fa-home',
      position: 0
    });

    // Add path segments
    const pathSegments = currentPath.split('/').filter(segment => segment);
    let currentPathBuilder = '';

    pathSegments.forEach((segment, index) => {
      currentPathBuilder += '/' + segment;
      const breadcrumb = this.createBreadcrumbFromSegment(segment, currentPathBuilder, index + 1);
      if (breadcrumb) {
        this.addBreadcrumb(breadcrumb);
      }
    });

    // Render breadcrumbs
    this.breadcrumbs.forEach((breadcrumb, index) => {
      const li = this.createBreadcrumbElement(breadcrumb, index);
      breadcrumbList.appendChild(li);
    });
  }

  // Create breadcrumb from path segment
  createBreadcrumbFromSegment(segment, path, position) {
    // Map path segments to user-friendly labels
    const segmentMap = {
      'create': { label: 'Create Chart', icon: 'fas fa-plus' },
      'library': { label: 'Chart Library', icon: 'fas fa-chart-bar' },
      'templates': { label: 'Templates', icon: 'fas fa-layer-group' },
      'import': { label: 'Import Data', icon: 'fas fa-upload' },
      'export': { label: 'Export', icon: 'fas fa-download' },
      'settings': { label: 'Settings', icon: 'fas fa-cog' },
      'help': { label: 'Help Center', icon: 'fas fa-question-circle' },
      'profile': { label: 'My Profile', icon: 'fas fa-user' },
      'billing': { label: 'Billing', icon: 'fas fa-credit-card' },
      'team': { label: 'Team', icon: 'fas fa-users' }
    };

    const mapped = segmentMap[segment];
    if (mapped) {
      return {
        label: mapped.label,
        path: path,
        icon: mapped.icon,
        position: position
      };
    }

    // Handle dynamic segments (like chart IDs)
    if (segment.match(/^[a-f0-9-]{36}$/)) {
      return {
        label: 'Chart Details',
        path: path,
        icon: 'fas fa-chart-line',
        position: position
      };
    }

    // Default to capitalized segment
    return {
      label: segment.charAt(0).toUpperCase() + segment.slice(1),
      path: path,
      icon: 'fas fa-angle-right',
      position: position
    };
  }

  // Add breadcrumb to list
  addBreadcrumb(breadcrumb) {
    this.breadcrumbs.push(breadcrumb);
  }

  // Create breadcrumb element
  createBreadcrumbElement(breadcrumb, index) {
    const li = document.createElement('li');
    li.className = 'breadcrumb-item';
    li.setAttribute('role', 'listitem');

    const isLast = index === this.breadcrumbs.length - 1;
    const isCurrent = this.isCurrentPath(breadcrumb.path);

    const link = document.createElement('a');
    link.href = breadcrumb.path;
    link.className = `breadcrumb-link ${isLast ? 'current' : ''} ${isCurrent ? 'active' : ''}`;
    link.setAttribute('aria-current', isCurrent ? 'page' : 'false');
    
    link.innerHTML = `
      ${breadcrumb.icon ? `<i class="${breadcrumb.icon} breadcrumb-icon"></i>` : ''}
      <span class="breadcrumb-text">${breadcrumb.label}</span>
    `;

    if (!isLast) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        this.navigateToPath(breadcrumb.path);
      });
    }

    li.appendChild(link);

    // Add separator for non-last items
    if (!isLast) {
      const separator = document.createElement('span');
      separator.className = 'breadcrumb-separator';
      separator.setAttribute('aria-hidden', 'true');
      separator.innerHTML = '<i class="fas fa-chevron-right"></i>';
      li.appendChild(separator);
    }

    return li;
  }

  // Setup active states
  setupActiveStates() {
    this.updateActiveStates();
    
    // Listen for navigation changes
    document.addEventListener('navigationOccurred', () => {
      this.updateActiveStates();
    });

    // Listen for route changes
    window.addEventListener('popstate', () => {
      this.updateActiveStates();
    });
  }

  // Update active states
  updateActiveStates() {
    const currentPath = this.getCurrentPath();
    
    // Clear all active states
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.remove('active');
      item.setAttribute('aria-current', 'false');
    });

    // Set active state for current path
    const activeItem = document.querySelector(`[data-nav-path="${currentPath}"]`);
    if (activeItem) {
      activeItem.classList.add('active');
      activeItem.setAttribute('aria-current', 'page');
    }

    // Set active state for parent paths
    const pathSegments = currentPath.split('/').filter(segment => segment);
    let parentPath = '';

    pathSegments.forEach(segment => {
      parentPath += '/' + segment;
      const parentItem = document.querySelector(`[data-nav-path="${parentPath}"]`);
      if (parentItem) {
        parentItem.classList.add('active-parent');
      }
    });

    // Update current location indicator
    this.updateCurrentLocationIndicator();
  }

  // Update current location indicator
  updateCurrentLocationIndicator() {
    let indicator = document.querySelector('.current-location-indicator');
    
    if (!indicator) {
      indicator = document.createElement('div');
      indicator.className = 'current-location-indicator';
      
      const header = document.querySelector('.header');
      if (header) {
        header.appendChild(indicator);
      }
    }

    const currentBreadcrumb = this.breadcrumbs[this.breadcrumbs.length - 1];
    if (currentBreadcrumb) {
      indicator.innerHTML = `
        <i class="${currentBreadcrumb.icon}"></i>
        <span>${currentBreadcrumb.label}</span>
      `;
    }
  }

  // Setup mobile navigation
  setupMobileNavigation() {
    this.createMobileNavigation();
    this.setupMobileToggle();
    this.setupMobileGestures();
    this.setupMobileOptimizations();
  }

  // Create mobile navigation
  createMobileNavigation() {
    let mobileNav = document.querySelector('.mobile-navigation');
    
    if (!mobileNav) {
      mobileNav = document.createElement('div');
      mobileNav.className = 'mobile-navigation';
      mobileNav.setAttribute('role', 'navigation');
      mobileNav.setAttribute('aria-label', 'Mobile navigation');
      
      document.body.appendChild(mobileNav);
    }

    mobileNav.innerHTML = `
      <div class="mobile-nav-overlay"></div>
      <div class="mobile-nav-panel">
        <div class="mobile-nav-header">
          <h3 class="mobile-nav-title">Navigation</h3>
          <button class="mobile-nav-close" aria-label="Close navigation">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="mobile-nav-content">
          <!-- Navigation groups will be added dynamically -->
        </div>
        <div class="mobile-nav-footer">
          <div class="mobile-nav-user">
            <div class="user-avatar">
              <i class="fas fa-user"></i>
            </div>
            <div class="user-info">
              <div class="user-name">John Doe</div>
              <div class="user-email">john@example.com</div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.populateMobileNavigation();
    this.setupMobileNavEvents();
  }

  // Populate mobile navigation
  populateMobileNavigation() {
    const content = document.querySelector('.mobile-nav-content');
    if (!content) return;

    content.innerHTML = '';

    // Sort groups by priority
    const sortedGroups = Array.from(this.navigationGroups.entries())
      .sort(([,a], [,b]) => a.priority - b.priority);

    sortedGroups.forEach(([groupId, group]) => {
      const groupElement = this.createMobileNavGroup(groupId, group);
      content.appendChild(groupElement);
    });
  }

  // Create mobile navigation group
  createMobileNavGroup(groupId, group) {
    const section = document.createElement('div');
    section.className = 'mobile-nav-section';
    
    const header = document.createElement('div');
    header.className = 'mobile-nav-section-header';
    header.innerHTML = `
      <h4 class="mobile-nav-section-title">${this.formatGroupName(groupId)}</h4>
    `;
    
    const list = document.createElement('ul');
    list.className = 'mobile-nav-list';
    list.setAttribute('role', 'list');

    group.items.forEach(item => {
      const li = this.createMobileNavItem(item);
      list.appendChild(li);
    });

    section.appendChild(header);
    section.appendChild(list);

    return section;
  }

  // Create mobile navigation item
  createMobileNavItem(item) {
    const li = document.createElement('li');
    li.className = 'mobile-nav-item';
    li.setAttribute('role', 'listitem');

    const link = document.createElement('a');
    link.href = item.path;
    link.className = 'mobile-nav-link';
    link.setAttribute('data-nav-path', item.path);
    
    link.innerHTML = `
      <i class="${item.icon} mobile-nav-icon"></i>
      <span class="mobile-nav-text">${item.label}</span>
      <i class="fas fa-chevron-right mobile-nav-arrow"></i>
    `;

    link.addEventListener('click', (e) => {
      e.preventDefault();
      this.navigateToPath(item.path);
      this.closeMobileNavigation();
    });

    li.appendChild(link);
    return li;
  }

  // Format group name
  formatGroupName(groupId) {
    const names = {
      'main': 'Main Navigation',
      'tools': 'Tools & Resources',
      'account': 'Account'
    };
    return names[groupId] || groupId.charAt(0).toUpperCase() + groupId.slice(1);
  }

  // Setup mobile navigation events
  setupMobileNavEvents() {
    const overlay = document.querySelector('.mobile-nav-overlay');
    const closeBtn = document.querySelector('.mobile-nav-close');

    if (overlay) {
      overlay.addEventListener('click', () => {
        this.closeMobileNavigation();
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.closeMobileNavigation();
      });
    }

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.mobileNavOpen) {
        this.closeMobileNavigation();
      }
    });
  }

  // Setup mobile toggle
  setupMobileToggle() {
    let toggle = document.querySelector('.mobile-nav-toggle');
    
    if (!toggle) {
      toggle = document.createElement('button');
      toggle.className = 'mobile-nav-toggle';
      toggle.setAttribute('aria-label', 'Toggle navigation');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.innerHTML = '<i class="fas fa-bars"></i>';
      
      const header = document.querySelector('.header');
      if (header) {
        header.appendChild(toggle);
      }
    }

    toggle.addEventListener('click', () => {
      this.toggleMobileNavigation();
    });
  }

  // Toggle mobile navigation
  toggleMobileNavigation() {
    if (this.mobileNavOpen) {
      this.closeMobileNavigation();
    } else {
      this.openMobileNavigation();
    }
  }

  // Open mobile navigation
  openMobileNavigation() {
    const mobileNav = document.querySelector('.mobile-navigation');
    const toggle = document.querySelector('.mobile-nav-toggle');
    
    if (mobileNav && toggle) {
      mobileNav.classList.add('open');
      toggle.setAttribute('aria-expanded', 'true');
      this.mobileNavOpen = true;
      
      // Focus management
      const firstLink = mobileNav.querySelector('.mobile-nav-link');
      if (firstLink) {
        firstLink.focus();
      }

      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    }
  }

  // Close mobile navigation
  closeMobileNavigation() {
    const mobileNav = document.querySelector('.mobile-navigation');
    const toggle = document.querySelector('.mobile-nav-toggle');
    
    if (mobileNav && toggle) {
      mobileNav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      this.mobileNavOpen = false;
      
      // Restore body scroll
      document.body.style.overflow = '';
      
      // Return focus to toggle
      toggle.focus();
    }
  }

  // Setup mobile gestures
  setupMobileGestures() {
    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });

    document.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      this.handleMobileGesture(touchStartX, touchEndX);
    });
  }

  // Handle mobile gesture
  handleMobileGesture(startX, endX) {
    const threshold = 50;
    const diff = startX - endX;

    // Swipe right to open navigation
    if (diff < -threshold && startX < 50) {
      this.openMobileNavigation();
    }

    // Swipe left to close navigation
    if (diff > threshold && this.mobileNavOpen) {
      this.closeMobileNavigation();
    }
  }

  // Setup keyboard shortcuts
  setupKeyboardShortcuts() {
    this.shortcuts.set('Ctrl+K', () => this.openQuickNavigation());
    this.shortcuts.set('Ctrl+B', () => this.toggleMobileNavigation());
    this.shortcuts.set('Escape', () => this.closeMobileNavigation());
    this.shortcuts.set('Alt+ArrowLeft', () => this.navigateBack());
    this.shortcuts.set('Alt+ArrowRight', () => this.navigateForward());

    document.addEventListener('keydown', (e) => {
      const key = this.getShortcutKey(e);
      const action = this.shortcuts.get(key);
      if (action) {
        e.preventDefault();
        action();
      }
    });
  }

  // Get shortcut key
  getShortcutKey(e) {
    const parts = [];
    
    if (e.ctrlKey || e.metaKey) parts.push('Ctrl');
    if (e.altKey) parts.push('Alt');
    if (e.shiftKey) parts.push('Shift');
    
    if (e.key === 'ArrowLeft') parts.push('ArrowLeft');
    else if (e.key === 'ArrowRight') parts.push('ArrowRight');
    else if (e.key === 'ArrowUp') parts.push('ArrowUp');
    else if (e.key === 'ArrowDown') parts.push('ArrowDown');
    else parts.push(e.key);
    
    return parts.join('+');
  }

  // Setup wayfinding
  setupWayfinding() {
    this.createWayfindingIndicators();
    this.setupProgressIndicators();
    this.setupContextualHelp();
  }

  // Create wayfinding indicators
  createWayfindingIndicators() {
    // Add "You are here" indicators
    this.updateWayfindingIndicators();
  }

  // Update wayfinding indicators
  updateWayfindingIndicators() {
    const currentPath = this.getCurrentPath();
    
    // Update all navigation items with wayfinding info
    document.querySelectorAll('.nav-item').forEach(item => {
      const itemPath = item.getAttribute('data-nav-path');
      const isCurrent = itemPath === currentPath;
      const isParent = this.isParentPath(itemPath, currentPath);
      
      item.setAttribute('aria-current', isCurrent ? 'page' : 'false');
      item.classList.toggle('current', isCurrent);
      item.classList.toggle('parent', isParent);
      
      // Add wayfinding tooltip
      if (isCurrent) {
        this.addWayfindingTooltip(item, 'Current page');
      } else if (isParent) {
        this.addWayfindingTooltip(item, 'Parent section');
      }
    });
  }

  // Check if path is parent
  isParentPath(parentPath, currentPath) {
    return currentPath.startsWith(parentPath + '/') && parentPath !== currentPath;
  }

  // Add wayfinding tooltip
  addWayfindingTooltip(element, text) {
    element.setAttribute('title', text);
    element.setAttribute('aria-label', text);
  }

  // Setup progress indicators
  setupProgressIndicators() {
    // Add progress indicators for multi-step processes
    this.updateProgressIndicators();
  }

  // Update progress indicators
  updateProgressIndicators() {
    const currentPath = this.getCurrentPath();
    
    // Define process flows
    const flows = {
      '/create': ['data-input', 'chart-selection', 'customization', 'generate'],
      '/import': ['file-upload', 'data-mapping', 'validation', 'complete']
    };

    const flow = flows[currentPath];
    if (flow) {
      this.createProgressIndicator(flow);
    }
  }

  // Create progress indicator
  createProgressIndicator(steps) {
    let container = document.querySelector('.progress-indicator');
    
    if (!container) {
      container = document.createElement('div');
      container.className = 'progress-indicator';
      
      const header = document.querySelector('.header');
      if (header) {
        header.appendChild(container);
      }
    }

    const stepsHtml = steps.map((step, index) => `
      <div class="progress-step ${index === 0 ? 'active' : ''}" data-step="${step}">
        <div class="progress-step-marker">${index + 1}</div>
        <div class="progress-step-label">${this.formatStepLabel(step)}</div>
      </div>
    `).join('');

    container.innerHTML = `
      <div class="progress-steps">
        ${stepsHtml}
      </div>
    `;
  }

  // Format step label
  formatStepLabel(step) {
    const labels = {
      'data-input': 'Data Input',
      'chart-selection': 'Chart Type',
      'customization': 'Customize',
      'generate': 'Generate',
      'file-upload': 'Upload File',
      'data-mapping': 'Map Data',
      'validation': 'Validate',
      'complete': 'Complete'
    };
    return labels[step] || step;
  }

  // Setup contextual help
  setupContextualHelp() {
    this.createContextualHelp();
  }

  // Create contextual help
  createContextualHelp() {
    let helpButton = document.querySelector('.contextual-help-button');
    
    if (!helpButton) {
      helpButton = document.createElement('button');
      helpButton.className = 'contextual-help-button';
      helpButton.setAttribute('aria-label', 'Get help for current page');
      helpButton.innerHTML = '<i class="fas fa-question-circle"></i>';
      
      const header = document.querySelector('.header');
      if (header) {
        header.appendChild(helpButton);
      }
    }

    helpButton.addEventListener('click', () => {
      this.showContextualHelp();
    });
  }

  // Show contextual help
  showContextualHelp() {
    const currentPath = this.getCurrentPath();
    const helpContent = this.getHelpContent(currentPath);
    
    // Show help modal or tooltip
    this.showHelpModal(helpContent);
  }

  // Get help content
  getHelpContent(path) {
    const helpMap = {
      '/create': {
        title: 'Creating Charts',
        content: 'Learn how to create beautiful charts from your data.',
        steps: [
          'Enter your data in CSV or JSON format',
          'Select the appropriate chart type',
          'Customize colors and styling',
          'Generate and export your chart'
        ]
      },
      '/import': {
        title: 'Importing Data',
        content: 'Import data from various sources for visualization.',
        steps: [
          'Choose your data source',
          'Upload or connect to your data',
          'Map data columns correctly',
          'Validate and preview your data'
        ]
      }
    };

    return helpMap[path] || {
      title: 'Help',
      content: 'Find answers to common questions.',
      steps: ['Browse our help center', 'Contact support']
    };
  }

  // Show help modal
  showHelpModal(content) {
    // Implementation would show a modal with help content
    console.log('Help:', content);
  }

  // Setup navigation history
  setupNavigationHistory() {
    this.navigationHistory = [];
    
    // Listen for navigation events
    document.addEventListener('navigationOccurred', (e) => {
      this.addToHistory(e.detail);
    });
  }

  // Add to history
  addToHistory(detail) {
    this.navigationHistory.push({
      path: detail.path || this.getCurrentPath(),
      timestamp: Date.now(),
      title: detail.title || document.title
    });

    // Limit history size
    if (this.navigationHistory.length > 50) {
      this.navigationHistory.shift();
    }
  }

  // Setup mobile optimizations
  setupMobileOptimizations() {
    this.setupMobileQuickActions();
    this.setupMobileSearch();
    this.setupMobile gestures();
  }

  // Setup mobile quick actions
  setupMobileQuickActions() {
    let quickActions = document.querySelector('.mobile-quick-actions');
    
    if (!quickActions) {
      quickActions = document.createElement('div');
      quickActions.className = 'mobile-quick-actions';
      
      const mobileNav = document.querySelector('.mobile-nav-footer');
      if (mobileNav) {
        mobileNav.appendChild(quickActions);
      }
    }

    quickActions.innerHTML = `
      <button class="quick-action-btn" data-action="new-chart">
        <i class="fas fa-plus"></i>
        <span>New Chart</span>
      </button>
      <button class="quick-action-btn" data-action="import">
        <i class="fas fa-upload"></i>
        <span>Import</span>
      </button>
      <button class="quick-action-btn" data-action="help">
        <i class="fas fa-question-circle"></i>
        <span>Help</span>
      </button>
    `;

    // Add event handlers
    quickActions.addEventListener('click', (e) => {
      const btn = e.target.closest('.quick-action-btn');
      if (btn) {
        const action = btn.getAttribute('data-action');
        this.handleQuickAction(action);
      }
    });
  }

  // Handle quick action
  handleQuickAction(action) {
    const actions = {
      'new-chart': () => this.navigateToPath('/create'),
      'import': () => this.navigateToPath('/import'),
      'help': () => this.showContextualHelp()
    };

    const handler = actions[action];
    if (handler) {
      handler();
      this.closeMobileNavigation();
    }
  }

  // Setup mobile search
  setupMobileSearch() {
    let searchContainer = document.querySelector('.mobile-nav-search');
    
    if (!searchContainer) {
      searchContainer = document.createElement('div');
      searchContainer.className = 'mobile-nav-search';
      
      const content = document.querySelector('.mobile-nav-content');
      if (content) {
        content.insertBefore(searchContainer, content.firstChild);
      }
    }

    searchContainer.innerHTML = `
      <div class="search-input-wrapper">
        <i class="fas fa-search search-icon"></i>
        <input type="search" class="mobile-search-input" placeholder="Search charts, features...">
        <button class="search-clear-btn" aria-label="Clear search">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `;

    this.setupMobileSearchEvents();
  }

  // Setup mobile search events
  setupMobileSearchEvents() {
    const searchInput = document.querySelector('.mobile-search-input');
    const clearBtn = document.querySelector('.search-clear-btn');

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.handleMobileSearch(e.target.value);
      });

      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          this.executeMobileSearch(e.target.value);
        }
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        this.handleMobileSearch('');
        searchInput.focus();
      });
    }
  }

  // Handle mobile search
  handleMobileSearch(query) {
    const clearBtn = document.querySelector('.search-clear-btn');
    if (clearBtn) {
      clearBtn.style.display = query ? 'block' : 'none';
    }

    // Filter navigation items
    const items = document.querySelectorAll('.mobile-nav-item');
    items.forEach(item => {
      const text = item.textContent.toLowerCase();
      const matches = text.includes(query.toLowerCase());
      item.style.display = matches ? 'block' : 'none';
    });
  }

  // Execute mobile search
  executeMobileSearch(query) {
    if (query.trim()) {
      // Navigate to search results
      this.navigateToPath(`/search?q=${encodeURIComponent(query)}`);
      this.closeMobileNavigation();
    }
  }

  // Open quick navigation
  openQuickNavigation() {
    // Implementation would open a command palette style navigation
    console.log('Opening quick navigation');
  }

  // Navigate to path
  navigateToPath(path) {
    // Update browser history
    history.pushState({}, '', path);
    
    // Update navigation state
    this.updateBreadcrumbs();
    this.updateActiveStates();
    this.updateWayfindingIndicators();
    
    // Dispatch navigation event
    document.dispatchEvent(new CustomEvent('navigationOccurred', {
      detail: { path: path }
    }));
  }

  // Navigate back
  navigateBack() {
    if (this.navigationHistory.length > 1) {
      this.navigationHistory.pop();
      const previousState = this.navigationHistory[this.navigationHistory.length - 1];
      if (previousState) {
        this.navigateToPath(previousState.path);
      }
    }
  }

  // Navigate forward
  navigateForward() {
    // Implementation would handle forward navigation
    console.log('Navigate forward');
  }

  // Get current path
  getCurrentPath() {
    return window.location.pathname || '/';
  }

  // Handle navigation
  handleNavigation(detail) {
    this.addToHistory(detail);
    this.updateBreadcrumbs();
    this.updateActiveStates();
    this.updateWayfindingIndicators();
  }

  // Public methods
  getCurrentLocation() {
    return {
      path: this.getCurrentPath(),
      breadcrumbs: this.breadcrumbs,
      activeStates: Array.from(document.querySelectorAll('.nav-item.active'))
    };
  }

  getNavigationHistory() {
    return [...this.navigationHistory];
  }

  clearNavigationHistory() {
    this.navigationHistory = [];
  }
}

// Initialize navigation flow manager
document.addEventListener('DOMContentLoaded', () => {
  window.navigationFlowManager = new NavigationFlowManager();
});

export { NavigationFlowManager };

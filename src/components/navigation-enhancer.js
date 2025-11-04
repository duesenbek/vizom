// Navigation Enhancer for Free Movement and Multiple Task Paths
class NavigationEnhancer {
  constructor() {
    this.navigationStack = [];
    this.currentPath = [];
    this.bookmarks = new Map();
    this.quickActions = new Map();
    this.navigationModes = new Set(['standard', 'expert', 'accessibility']);
    this.currentMode = 'standard';
    
    this.init();
  }

  init() {
    this.loadBookmarks();
    this.setupNavigationStack();
    this.createNavigationUI();
    this.setupKeyboardNavigation();
    this.setupQuickActions();
    this.setupBreadcrumbs();
    this.setupTabNavigation();
    this.setupContextualNavigation();
  }

  // Load bookmarks from storage
  loadBookmarks() {
    try {
      const saved = localStorage.getItem('vizom_navigation_bookmarks');
      if (saved) {
        this.bookmarks = new Map(JSON.parse(saved));
      }
    } catch (error) {
      console.warn('Failed to load bookmarks:', error);
    }
  }

  // Save bookmarks to storage
  saveBookmarks() {
    try {
      localStorage.setItem('vizom_navigation_bookmarks', JSON.stringify([...this.bookmarks]));
    } catch (error) {
      console.warn('Failed to save bookmarks:', error);
    }
  }

  // Setup navigation stack for back/forward functionality
  setupNavigationStack() {
    // Initialize with current state
    this.pushNavigationState({
      type: 'initial',
      path: '/',
      timestamp: Date.now(),
      data: this.getCurrentState()
    });

    // Listen for navigation events
    document.addEventListener('navigationOccurred', (e) => {
      this.handleNavigation(e.detail);
    });

    // Listen for chart generation
    document.addEventListener('chartGenerationCompleted', (e) => {
      this.pushNavigationState({
        type: 'chart_generated',
        path: '/chart/' + e.detail.chartType,
        timestamp: Date.now(),
        data: e.detail
      });
    });

    // Listen for settings changes
    document.addEventListener('settingsChanged', (e) => {
      this.pushNavigationState({
        type: 'settings_changed',
        path: '/settings',
        timestamp: Date.now(),
        data: e.detail
      });
    });
  }

  // Push state to navigation stack
  pushNavigationState(state) {
    // Remove any states after current position
    this.navigationStack = this.navigationStack.slice(0, this.getCurrentStackIndex() + 1);
    
    // Add new state
    this.navigationStack.push(state);
    
    // Limit stack size
    if (this.navigationStack.length > 100) {
      this.navigationStack.shift();
    }
    
    this.updateNavigationUI();
  }

  // Get current stack index
  getCurrentStackIndex() {
    return this.navigationStack.length - 1;
  }

  // Handle navigation event
  handleNavigation(detail) {
    this.pushNavigationState({
      type: detail.type || 'navigation',
      path: detail.path || window.location.pathname,
      timestamp: Date.now(),
      data: detail.data || {}
    });
  }

  // Get current state
  getCurrentState() {
    const dataInput = document.getElementById('data-input');
    const selectedChart = document.querySelector('.chart-option.selected');
    
    return {
      inputData: dataInput ? dataInput.value : '',
      chartType: selectedChart ? selectedChart.dataset.chartType : null,
      timestamp: Date.now()
    };
  }

  // Navigate back
  navigateBack() {
    const currentIndex = this.getCurrentStackIndex();
    if (currentIndex > 0) {
      const targetIndex = currentIndex - 1;
      this.navigateToIndex(targetIndex);
      return true;
    }
    return false;
  }

  // Navigate forward
  navigateForward() {
    const currentIndex = this.getCurrentStackIndex();
    if (currentIndex < this.navigationStack.length - 1) {
      const targetIndex = currentIndex + 1;
      this.navigateToIndex(targetIndex);
      return true;
    }
    return false;
  }

  // Navigate to specific index
  navigateToIndex(index) {
    if (index >= 0 && index < this.navigationStack.length) {
      const state = this.navigationStack[index];
      this.restoreNavigationState(state);
      this.currentPath = this.navigationStack.slice(0, index + 1);
      this.updateNavigationUI();
    }
  }

  // Restore navigation state
  restoreNavigationState(state) {
    switch (state.type) {
      case 'chart_generated':
        this.restoreChartState(state.data);
        break;
      case 'settings_changed':
        this.restoreSettingsState(state.data);
        break;
      case 'navigation':
        this.restoreGeneralState(state.data);
        break;
      default:
        this.restoreGeneralState(state.data);
    }
  }

  // Restore chart state
  restoreChartState(data) {
    if (data.chartType) {
      // Select chart type
      const chartOption = document.querySelector(`[data-chart-type="${data.chartType}"]`);
      if (chartOption) {
        document.querySelectorAll('.chart-option').forEach(option => {
          option.classList.remove('selected');
        });
        chartOption.classList.add('selected');
      }
    }

    if (data.data && data.data.rawData) {
      // Restore data input
      const dataInput = document.getElementById('data-input');
      if (dataInput) {
        dataInput.value = data.data.rawData;
      }
    }

    // Regenerate chart if needed
    if (window.chartGenerator && data.data) {
      window.chartGenerator.generateChart(data.data);
    }
  }

  // Restore settings state
  restoreSettingsState(data) {
    if (window.customizationPanel && data.settings) {
      Object.entries(data.settings).forEach(([key, value]) => {
        window.customizationPanel.updateSetting(key, value);
      });
    }
  }

  // Restore general state
  restoreGeneralState(data) {
    if (data.inputData) {
      const dataInput = document.getElementById('data-input');
      if (dataInput) {
        dataInput.value = data.inputData;
      }
    }

    if (data.chartType) {
      this.restoreChartState({ chartType: data.chartType });
    }
  }

  // Create navigation UI
  createNavigationUI() {
    this.createBackForwardButtons();
    this.createBreadcrumbs();
    this.createQuickAccessPanel();
    this.createBookmarkPanel();
  }

  // Create back/forward buttons
  createBackForwardButtons() {
    const container = document.createElement('div');
    container.className = 'navigation-controls';
    container.innerHTML = `
      <button class="nav-btn" id="nav-back-btn" title="Back (Alt+Left Arrow)" disabled>
        <i class="fas fa-arrow-left"></i>
      </button>
      <button class="nav-btn" id="nav-forward-btn" title="Forward (Alt+Right Arrow)" disabled>
        <i class="fas fa-arrow-right"></i>
      </button>
      <button class="nav-btn" id="nav-home-btn" title="Home (Alt+Home)">
        <i class="fas fa-home"></i>
      </button>
      <button class="nav-btn" id="nav-refresh-btn" title="Refresh Current State (F5)">
        <i class="fas fa-sync"></i>
      </button>
    `;

    // Add to header or toolbar
    const header = document.querySelector('.header') || document.querySelector('.toolbar');
    if (header) {
      header.appendChild(container);
    } else {
      // Fallback: add to body
      document.body.appendChild(container);
    }

    this.setupNavigationControls();
  }

  // Setup navigation controls
  setupNavigationControls() {
    const backBtn = document.getElementById('nav-back-btn');
    const forwardBtn = document.getElementById('nav-forward-btn');
    const homeBtn = document.getElementById('nav-home-btn');
    const refreshBtn = document.getElementById('nav-refresh-btn');

    if (backBtn) {
      backBtn.addEventListener('click', () => this.navigateBack());
    }

    if (forwardBtn) {
      forwardBtn.addEventListener('click', () => this.navigateForward());
    }

    if (homeBtn) {
      homeBtn.addEventListener('click', () => this.navigateHome());
    }

    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => this.refreshCurrentState());
    }

    this.updateNavigationButtons();
  }

  // Update navigation buttons state
  updateNavigationButtons() {
    const backBtn = document.getElementById('nav-back-btn');
    const forwardBtn = document.getElementById('nav-forward-btn');

    if (backBtn) {
      backBtn.disabled = this.getCurrentStackIndex() <= 0;
    }

    if (forwardBtn) {
      forwardBtn.disabled = this.getCurrentStackIndex() >= this.navigationStack.length - 1;
    }
  }

  // Navigate home
  navigateHome() {
    // Clear current state and go to initial state
    const dataInput = document.getElementById('data-input');
    if (dataInput) {
      dataInput.value = '';
    }

    // Clear chart selection
    document.querySelectorAll('.chart-option').forEach(option => {
      option.classList.remove('selected');
    });

    // Push home state
    this.pushNavigationState({
      type: 'home',
      path: '/',
      timestamp: Date.now(),
      data: this.getCurrentState()
    });

    if (window.uiEnhancements) {
      window.uiEnhancements.showNotification('Returned to home', 'info');
    }
  }

  // Refresh current state
  refreshCurrentState() {
    const currentState = this.getCurrentState();
    
    // Regenerate current chart
    if (currentState.chartType && currentState.inputData) {
      if (window.chartGenerator) {
        window.chartGenerator.generateChart({
          chartType: currentState.chartType,
          rawData: currentState.inputData
        });
      }
    }

    if (window.uiEnhancements) {
      window.uiEnhancements.showNotification('State refreshed', 'info');
    }
  }

  // Create breadcrumbs
  createBreadcrumbs() {
    const container = document.createElement('div');
    container.className = 'breadcrumbs-container';
    container.innerHTML = `
      <nav class="breadcrumbs" id="breadcrumbs">
        <ol class="breadcrumb-list">
          <!-- Breadcrumb items will be added dynamically -->
        </ol>
      </nav>
    `;

    // Add to header or main content
    const header = document.querySelector('.header');
    if (header) {
      header.appendChild(container);
    } else {
      const mainContent = document.querySelector('.main-content');
      if (mainContent) {
        mainContent.insertBefore(container, mainContent.firstChild);
      }
    }

    this.updateBreadcrumbs();
  }

  // Update breadcrumbs
  updateBreadcrumbs() {
    const breadcrumbList = document.querySelector('.breadcrumb-list');
    if (!breadcrumbList) return;

    breadcrumbList.innerHTML = '';

    // Add home breadcrumb
    const homeItem = this.createBreadcrumbItem('Home', '/', 0);
    breadcrumbList.appendChild(homeItem);

    // Add path breadcrumbs
    this.currentPath.slice(1).forEach((state, index) => {
      const title = this.getStateBreadcrumbTitle(state);
      const item = this.createBreadcrumbItem(title, state.path, index + 1);
      breadcrumbList.appendChild(item);
    });
  }

  // Create breadcrumb item
  createBreadcrumbItem(title, path, index) {
    const li = document.createElement('li');
    li.className = 'breadcrumb-item';
    
    const isLast = index === this.currentPath.length - 1;
    const isCurrent = index === this.getCurrentStackIndex();

    li.innerHTML = `
      <a href="#" class="breadcrumb-link ${isLast ? 'current' : ''} ${isCurrent ? 'active' : ''}" 
         data-index="${index}">
        ${title}
      </a>
    `;

    if (!isLast) {
      const separator = document.createElement('span');
      separator.className = 'breadcrumb-separator';
      separator.innerHTML = '›';
      li.appendChild(separator);
    }

    // Add click handler
    const link = li.querySelector('.breadcrumb-link');
    link.addEventListener('click', (e) => {
      e.preventDefault();
      this.navigateToIndex(index);
    });

    return li;
  }

  // Get state breadcrumb title
  getStateBreadcrumbTitle(state) {
    const titles = {
      'chart_generated': 'Chart',
      'settings_changed': 'Settings',
      'home': 'Home',
      'initial': 'Start'
    };

    if (state.type === 'chart_generated' && state.data && state.data.chartType) {
      return `Chart: ${state.data.chartType}`;
    }

    return titles[state.type] || 'Unknown';
  }

  // Create quick access panel
  createQuickAccessPanel() {
    const panel = document.createElement('div');
    panel.className = 'quick-access-panel';
    panel.innerHTML = `
      <div class="quick-access-header">
        <h4>Quick Access</h4>
        <button class="toggle-panel" id="toggle-quick-access">
          <i class="fas fa-chevron-down"></i>
        </button>
      </div>
      <div class="quick-access-content" id="quick-access-content">
        <div class="quick-actions-grid" id="quick-actions-grid">
          <!-- Quick actions will be added dynamically -->
        </div>
      </div>
    `;

    // Add to sidebar
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
      sidebar.appendChild(panel);
    }

    this.setupQuickAccessPanel();
  }

  // Setup quick access panel
  setupQuickAccessPanel() {
    const toggleBtn = document.getElementById('toggle-quick-access');
    const content = document.getElementById('quick-access-content');

    if (toggleBtn && content) {
      toggleBtn.addEventListener('click', () => {
        content.classList.toggle('collapsed');
        toggleBtn.querySelector('i').classList.toggle('fa-chevron-down');
        toggleBtn.querySelector('i').classList.toggle('fa-chevron-up');
      });
    }

    this.populateQuickActions();
  }

  // Populate quick actions
  populateQuickActions() {
    const grid = document.getElementById('quick-actions-grid');
    if (!grid) return;

    const actions = [
      {
        id: 'new-chart',
        title: 'New Chart',
        icon: 'fa-plus',
        description: 'Create a new chart',
        action: () => this.createNewChart()
      },
      {
        id: 'edit-data',
        title: 'Edit Data',
        icon: 'fa-edit',
        description: 'Modify current data',
        action: () => this.editCurrentData()
      },
      {
        id: 'change-chart',
        title: 'Change Chart Type',
        icon: 'fa-chart-bar',
        description: 'Switch chart type',
        action: () => this.changeChartType()
      },
      {
        id: 'export',
        title: 'Export',
        icon: 'fa-download',
        description: 'Export current chart',
        action: () => this.exportCurrentChart()
      },
      {
        id: 'settings',
        title: 'Settings',
        icon: 'fa-cog',
        description: 'Open settings',
        action: () => this.openSettings()
      },
      {
        id: 'help',
        title: 'Help',
        icon: 'fa-question',
        description: 'Get help',
        action: () => this.openHelp()
      }
    ];

    grid.innerHTML = actions.map(action => `
      <button class="quick-action-btn" data-action="${action.id}" title="${action.description}">
        <i class="fas ${action.icon}"></i>
        <span>${action.title}</span>
      </button>
    `).join('');

    // Add event handlers
    grid.querySelectorAll('.quick-action-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const actionId = btn.dataset.action;
        const action = actions.find(a => a.id === actionId);
        if (action) {
          action.action();
        }
      });
    });
  }

  // Quick action methods
  createNewChart() {
    this.navigateHome();
  }

  editCurrentData() {
    const dataInput = document.getElementById('data-input');
    if (dataInput) {
      dataInput.focus();
      dataInput.select();
    }
  }

  changeChartType() {
    // Open chart picker
    const chartPicker = document.querySelector('.chart-picker');
    if (chartPicker) {
      chartPicker.scrollIntoView({ behavior: 'smooth' });
      
      // Highlight first chart option
      const firstOption = chartPicker.querySelector('.chart-option');
      if (firstOption) {
        firstOption.focus();
      }
    }
  }

  exportCurrentChart() {
    // Trigger export
    const exportBtn = document.getElementById('export-btn');
    if (exportBtn) {
      exportBtn.click();
    }
  }

  openSettings() {
    if (window.customizationPanel) {
      window.customizationPanel.openPanel();
    }
  }

  openHelp() {
    if (window.helpSystem) {
      window.helpSystem.showHelp();
    }
  }

  // Create bookmark panel
  createBookmarkPanel() {
    const panel = document.createElement('div');
    panel.className = 'bookmark-panel';
    panel.innerHTML = `
      <div class="bookmark-header">
        <h4>Bookmarks</h4>
        <button class="add-bookmark-btn" id="add-bookmark-btn" title="Bookmark Current State">
          <i class="fas fa-bookmark"></i>
        </button>
      </div>
      <div class="bookmark-list" id="bookmark-list">
        <!-- Bookmarks will be added dynamically -->
      </div>
    `;

    // Add to sidebar
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
      sidebar.appendChild(panel);
    }

    this.setupBookmarkPanel();
  }

  // Setup bookmark panel
  setupBookmarkPanel() {
    const addBtn = document.getElementById('add-bookmark-btn');
    if (addBtn) {
      addBtn.addEventListener('click', () => this.addBookmark());
    }

    this.updateBookmarkList();
  }

  // Add bookmark
  addBookmark() {
    const currentState = this.getCurrentState();
    const bookmarkId = `bookmark_${Date.now()}`;
    
    const bookmark = {
      id: bookmarkId,
      title: this.generateBookmarkTitle(currentState),
      state: currentState,
      timestamp: Date.now()
    };

    this.bookmarks.set(bookmarkId, bookmark);
    this.saveBookmarks();
    this.updateBookmarkList();

    if (window.uiEnhancements) {
      window.uiEnhancements.showNotification('Bookmark added', 'success');
    }
  }

  // Generate bookmark title
  generateBookmarkTitle(state) {
    if (state.chartType) {
      return `Chart: ${state.chartType}`;
    }
    if (state.inputData) {
      return `Data: ${state.inputData.substring(0, 30)}...`;
    }
    return `State ${new Date().toLocaleTimeString()}`;
  }

  // Update bookmark list
  updateBookmarkList() {
    const list = document.getElementById('bookmark-list');
    if (!list) return;

    if (this.bookmarks.size === 0) {
      list.innerHTML = '<div class="no-bookmarks">No bookmarks yet</div>';
      return;
    }

    list.innerHTML = Array.from(this.bookmarks.values()).map(bookmark => `
      <div class="bookmark-item" data-bookmark-id="${bookmark.id}">
        <div class="bookmark-content">
          <div class="bookmark-title">${bookmark.title}</div>
          <div class="bookmark-time">${this.formatTime(bookmark.timestamp)}</div>
        </div>
        <div class="bookmark-actions">
          <button class="bookmark-action-btn" title="Go to bookmark" data-action="go">
            <i class="fas fa-arrow-right"></i>
          </button>
          <button class="bookmark-action-btn" title="Delete bookmark" data-action="delete">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    `).join('');

    // Add event handlers
    list.querySelectorAll('.bookmark-action-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const bookmarkId = btn.closest('.bookmark-item').dataset.bookmarkId;
        const action = btn.dataset.action;
        
        if (action === 'go') {
          this.goToBookmark(bookmarkId);
        } else if (action === 'delete') {
          this.deleteBookmark(bookmarkId);
        }
      });
    });

    list.querySelectorAll('.bookmark-item').forEach(item => {
      item.addEventListener('click', () => {
        const bookmarkId = item.dataset.bookmarkId;
        this.goToBookmark(bookmarkId);
      });
    });
  }

  // Go to bookmark
  goToBookmark(bookmarkId) {
    const bookmark = this.bookmarks.get(bookmarkId);
    if (bookmark) {
      this.restoreGeneralState(bookmark.state);
      
      // Push navigation state
      this.pushNavigationState({
        type: 'bookmark',
        path: '/bookmark/' + bookmarkId,
        timestamp: Date.now(),
        data: bookmark.state
      });

      if (window.uiEnhancements) {
        window.uiEnhancements.showNotification(`Restored: ${bookmark.title}`, 'info');
      }
    }
  }

  // Delete bookmark
  deleteBookmark(bookmarkId) {
    this.bookmarks.delete(bookmarkId);
    this.saveBookmarks();
    this.updateBookmarkList();

    if (window.uiEnhancements) {
      window.uiEnhancements.showNotification('Bookmark deleted', 'info');
    }
  }

  // Format time
  formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // Setup keyboard navigation
  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      // Alt + Left Arrow for back
      if (e.altKey && e.key === 'ArrowLeft') {
        e.preventDefault();
        this.navigateBack();
      }
      
      // Alt + Right Arrow for forward
      if (e.altKey && e.key === 'ArrowRight') {
        e.preventDefault();
        this.navigateForward();
      }
      
      // Alt + Home for home
      if (e.altKey && e.key === 'Home') {
        e.preventDefault();
        this.navigateHome();
      }
      
      // F5 for refresh
      if (e.key === 'F5') {
        e.preventDefault();
        this.refreshCurrentState();
      }
      
      // Ctrl + B for bookmark
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        this.addBookmark();
      }
    });
  }

  // Setup quick actions
  setupQuickActions() {
    // Add context menu items
    this.addContextMenuItems();
    
    // Add right-click actions
    this.setupRightClickActions();
  }

  // Add context menu items
  addContextMenuItems() {
    // This would integrate with a context menu system
    // For now, we'll add the actions to existing menus
  }

  // Setup right-click actions
  setupRightClickActions() {
    document.addEventListener('contextmenu', (e) => {
      // Add custom context menu for navigation
      if (e.target.closest('.chart-area') || e.target.closest('.data-input')) {
        e.preventDefault();
        this.showNavigationContextMenu(e.clientX, e.clientY);
      }
    });
  }

  // Show navigation context menu
  showNavigationContextMenu(x, y) {
    // Remove existing menu
    const existingMenu = document.querySelector('.navigation-context-menu');
    if (existingMenu) {
      existingMenu.remove();
    }

    const menu = document.createElement('div');
    menu.className = 'navigation-context-menu';
    menu.innerHTML = `
      <div class="context-menu-item" data-action="back">
        <i class="fas fa-arrow-left"></i>
        <span>Back</span>
        <kbd>Alt+←</kbd>
      </div>
      <div class="context-menu-item" data-action="forward">
        <i class="fas fa-arrow-right"></i>
        <span>Forward</span>
        <kbd>Alt+→</kbd>
      </div>
      <div class="context-menu-item" data-action="home">
        <i class="fas fa-home"></i>
        <span>Home</span>
        <kbd>Alt+Home</kbd>
      </div>
      <div class="context-menu-separator"></div>
      <div class="context-menu-item" data-action="bookmark">
        <i class="fas fa-bookmark"></i>
        <span>Bookmark</span>
        <kbd>Ctrl+B</kbd>
      </div>
      <div class="context-menu-item" data-action="refresh">
        <i class="fas fa-sync"></i>
        <span>Refresh</span>
        <kbd>F5</kbd>
      </div>
    `;

    // Position menu
    menu.style.left = x + 'px';
    menu.style.top = y + 'px';

    document.body.appendChild(menu);

    // Add event handlers
    menu.querySelectorAll('.context-menu-item').forEach(item => {
      item.addEventListener('click', () => {
        const action = item.dataset.action;
        this.executeContextAction(action);
        menu.remove();
      });
    });

    // Close on outside click
    setTimeout(() => {
      document.addEventListener('click', () => menu.remove(), { once: true });
    }, 100);
  }

  // Execute context action
  executeContextAction(action) {
    switch (action) {
      case 'back':
        this.navigateBack();
        break;
      case 'forward':
        this.navigateForward();
        break;
      case 'home':
        this.navigateHome();
        break;
      case 'bookmark':
        this.addBookmark();
        break;
      case 'refresh':
        this.refreshCurrentState();
        break;
    }
  }

  // Setup breadcrumbs
  setupBreadcrumbs() {
    // Already handled in createBreadcrumbs()
  }

  // Setup tab navigation
  setupTabNavigation() {
    // Add tab switching between different areas
    document.addEventListener('keydown', (e) => {
      // Ctrl + Tab for next tab
      if ((e.ctrlKey || e.metaKey) && e.key === 'Tab' && !e.shiftKey) {
        e.preventDefault();
        this.switchToNextTab();
      }
      
      // Ctrl + Shift + Tab for previous tab
      if ((e.ctrlKey || e.metaKey) && e.key === 'Tab' && e.shiftKey) {
        e.preventDefault();
        this.switchToPreviousTab();
      }
    });
  }

  // Switch to next tab
  switchToNextTab() {
    const tabs = ['data-input', 'chart-picker', 'export-options', 'settings-panel'];
    const currentFocus = document.activeElement;
    let currentIndex = -1;

    // Find current focused tab
    tabs.forEach((tabId, index) => {
      const element = document.getElementById(tabId);
      if (element && element.contains(currentFocus)) {
        currentIndex = index;
      }
    });

    // Focus next tab
    const nextIndex = (currentIndex + 1) % tabs.length;
    const nextTab = document.getElementById(tabs[nextIndex]);
    if (nextTab) {
      nextTab.focus();
    }
  }

  // Switch to previous tab
  switchToPreviousTab() {
    const tabs = ['data-input', 'chart-picker', 'export-options', 'settings-panel'];
    const currentFocus = document.activeElement;
    let currentIndex = -1;

    // Find current focused tab
    tabs.forEach((tabId, index) => {
      const element = document.getElementById(tabId);
      if (element && element.contains(currentFocus)) {
        currentIndex = index;
      }
    });

    // Focus previous tab
    const prevIndex = currentIndex <= 0 ? tabs.length - 1 : currentIndex - 1;
    const prevTab = document.getElementById(tabs[prevIndex]);
    if (prevTab) {
      prevTab.focus();
    }
  }

  // Setup contextual navigation
  setupContextualNavigation() {
    // Add smart navigation based on current context
    document.addEventListener('focus', (e) => {
      this.updateContextualNavigation(e.target);
    });
  }

  // Update contextual navigation
  updateContextualNavigation(element) {
    // Update navigation hints based on current focus
    if (element.closest('.data-input')) {
      this.showNavigationHint('Press Tab to go to chart options');
    } else if (element.closest('.chart-picker')) {
      this.showNavigationHint('Press Tab to go to export options');
    } else if (element.closest('.export-options')) {
      this.showNavigationHint('Press Tab to go to settings');
    }
  }

  // Show navigation hint
  showNavigationHint(hint) {
    let hintElement = document.querySelector('.navigation-hint');
    
    if (!hintElement) {
      hintElement = document.createElement('div');
      hintElement.className = 'navigation-hint';
      document.body.appendChild(hintElement);
    }

    hintElement.textContent = hint;
    hintElement.classList.add('show');

    // Hide after 3 seconds
    setTimeout(() => {
      hintElement.classList.remove('show');
    }, 3000);
  }

  // Update navigation UI
  updateNavigationUI() {
    this.updateNavigationButtons();
    this.updateBreadcrumbs();
  }

  // Public methods
  canGoBack() {
    return this.getCurrentStackIndex() > 0;
  }

  canGoForward() {
    return this.getCurrentStackIndex() < this.navigationStack.length - 1;
  }

  getNavigationHistory() {
    return [...this.navigationStack];
  }

  getBookmarks() {
    return Array.from(this.bookmarks.values());
  }
}

// Initialize navigation enhancer
document.addEventListener('DOMContentLoaded', () => {
  window.navigationEnhancer = new NavigationEnhancer();
});

export { NavigationEnhancer };

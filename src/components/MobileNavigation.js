import { initMobileMenu } from './mobile-menu.js';

// Mobile Navigation Component
// Provides mobile-specific navigation with bottom nav and hamburger menu

class MobileNavigation {
  constructor() {
    this.isMobile = this.checkIsMobile();
    this.bottomNavItems = this.getBottomNavItems();
    this.menuItems = this.getMenuItems();
    this.hamburgerMenuController = null;
    this.init();
  }

  init() {
    this.createMobileNavigation();
    this.setupEventListeners();
    this.setupResponsiveHandling();
    this.initializeActiveStates();
  }

  checkIsMobile() {
    return window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  getBottomNavItems() {
    return [
      {
        id: 'home',
        icon: 'fas fa-home',
        label: 'Home',
        href: 'index.html',
        active: false
      },
      {
        id: 'generator',
        icon: 'fas fa-chart-line',
        label: 'Generator',
        href: 'generator.html',
        active: false
      },
      {
        id: 'templates',
        icon: 'fas fa-layer-group',
        label: 'Templates',
        href: 'templates.html',
        active: false
      },
      {
        id: 'profile',
        icon: 'fas fa-user',
        label: 'Profile',
        href: '#profile',
        active: false,
        action: 'openProfile'
      }
    ];
  }

  getMenuItems() {
    return {
      main: [
        {
          id: 'home',
          icon: 'fas fa-home',
          label: 'Home',
          href: 'index.html',
          description: 'Dashboard and overview'
        },
        {
          id: 'generator',
          icon: 'fas fa-chart-line',
          label: 'Chart Generator',
          href: 'generator.html',
          description: 'Create AI-powered charts'
        },
        {
          id: 'templates',
          icon: 'fas fa-layer-group',
          label: 'Templates',
          href: 'templates.html',
          description: 'Professional templates'
        },
        {
          id: 'examples',
          icon: 'fas fa-chart-bar',
          label: 'Examples',
          href: '#examples',
          description: 'Chart examples and use cases'
        },
        {
          id: 'pricing',
          icon: 'fas fa-tag',
          label: 'Pricing',
          href: '#pricing',
          description: 'Plans and pricing'
        }
      ],
      resources: [
        {
          id: 'documentation',
          icon: 'fas fa-book',
          label: 'Documentation',
          href: '#docs',
          description: 'API and technical docs'
        },
        {
          id: 'help',
          icon: 'fas fa-life-ring',
          label: 'Help Center',
          href: '#help',
          description: 'Support and FAQs'
        },
        {
          id: 'tutorials',
          icon: 'fas fa-graduation-cap',
          label: 'Tutorials',
          href: '#tutorials',
          description: 'Learning resources'
        },
        {
          id: 'blog',
          icon: 'fas fa-blog',
          label: 'Blog',
          href: '#blog',
          description: 'Latest news and updates'
        }
      ],
      company: [
        {
          id: 'about',
          icon: 'fas fa-building',
          label: 'About',
          href: '#about',
          description: 'Company information'
        },
        {
          id: 'careers',
          icon: 'fas fa-briefcase',
          label: 'Careers',
          href: '#careers',
          description: 'Join our team'
        },
        {
          id: 'contact',
          icon: 'fas fa-envelope',
          label: 'Contact',
          href: '#contact',
          description: 'Get in touch'
        }
      ]
    };
  }

  createMobileNavigation() {
    this.createBottomNavigation();
    this.createHamburgerMenu();
  }

  createBottomNavigation() {
    // Check if bottom navigation already exists
    if (document.getElementById('mobile-bottom-nav')) {
      return;
    }

    const bottomNav = document.createElement('nav');
    bottomNav.id = 'mobile-bottom-nav';
    bottomNav.className = 'mobile-bottom-nav';
    bottomNav.setAttribute('role', 'navigation');
    bottomNav.setAttribute('aria-label', 'Main navigation');

    bottomNav.innerHTML = `
      <div class="bottom-nav-container">
        ${this.bottomNavItems.map(item => this.createBottomNavItem(item)).join('')}
      </div>
      <div class="bottom-nav-indicator"></div>
    `;

    document.body.appendChild(bottomNav);
  }

  createBottomNavItem(item) {
    const isActive = this.isItemActive(item.href);
    return `
      <a 
        href="${item.href}" 
        class="bottom-nav-item ${isActive ? 'active' : ''}"
        data-nav-id="${item.id}"
        role="tab"
        aria-selected="${isActive}"
        aria-label="${item.label}"
      >
        <div class="nav-icon">
          <i class="${item.icon}"></i>
          <div class="nav-indicator"></div>
        </div>
        <span class="nav-label">${item.label}</span>
      </a>
    `;
  }

  createHamburgerMenu() {
    // Check if hamburger menu already exists
    if (document.getElementById('mobile-hamburger-menu')) {
      return;
    }

    // Create hamburger button
    const hamburgerButton = document.createElement('button');
    hamburgerButton.id = 'mobile-hamburger-button';
    hamburgerButton.className = 'mobile-hamburger-button';
    hamburgerButton.setAttribute('aria-label', 'Open menu');
    hamburgerButton.setAttribute('aria-expanded', 'false');
    hamburgerButton.innerHTML = `
      <div class="hamburger-lines">
        <span class="line line-1"></span>
        <span class="line line-2"></span>
        <span class="line line-3"></span>
      </div>
    `;

    // Create menu overlay
    const menuOverlay = document.createElement('div');
    menuOverlay.id = 'mobile-menu-overlay';
    menuOverlay.className = 'mobile-menu-overlay';
    menuOverlay.setAttribute('aria-hidden', 'true');

    menuOverlay.innerHTML = `
      <div class="menu-container">
        <!-- Menu Header -->
        <div class="menu-header">
          <div class="menu-brand">
            <i class="fas fa-chart-simple"></i>
            <span>VIZOM</span>
          </div>
          <button class="menu-close" aria-label="Close menu" data-mobile-menu-close>
            <i class="fas fa-times"></i>
          </button>
        </div>

        <!-- User Account Section -->
        <div class="menu-user-section">
          <div class="user-avatar">
            <i class="fas fa-user"></i>
          </div>
          <div class="user-info">
            <div class="user-name">Guest User</div>
            <div class="user-email">Not signed in</div>
          </div>
          <button class="sign-in-btn" onclick="modalSystem.openAuthModal()">
            <i class="fas fa-sign-in-alt"></i>
            Sign In
          </button>
        </div>

        <!-- Menu Content -->
        <div class="menu-content">
          <div class="menu-scroll">
            <!-- Main Navigation -->
            <div class="menu-section">
              <h3 class="section-title">Main</h3>
              <div class="menu-items">
                ${this.menuItems.main.map(item => this.createMenuItem(item)).join('')}
              </div>
            </div>

            <!-- Resources -->
            <div class="menu-section">
              <h3 class="section-title">Resources</h3>
              <div class="menu-items">
                ${this.menuItems.resources.map(item => this.createMenuItem(item)).join('')}
              </div>
            </div>

            <!-- Company -->
            <div class="menu-section">
              <h3 class="section-title">Company</h3>
              <div class="menu-items">
                ${this.menuItems.company.map(item => this.createMenuItem(item)).join('')}
              </div>
            </div>

            <!-- Language Selector -->
            <div class="menu-section">
              <h3 class="section-title">Language</h3>
              <div class="language-selector">
                <select id="mobile-language-select" class="language-select">
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                  <option value="zh">中文</option>
                  <option value="ja">日本語</option>
                  <option value="ru">Русский</option>
                </select>
              </div>
            </div>

            <!-- App Download -->
            <div class="menu-section">
              <h3 class="section-title">Get the App</h3>
              <div class="app-downloads">
                <a href="#appstore" class="app-download-btn">
                  <i class="fab fa-apple"></i>
                  <div class="app-info">
                    <span class="app-store">Download on the</span>
                    <span class="app-name">App Store</span>
                  </div>
                </a>
                <a href="#playstore" class="app-download-btn">
                  <i class="fab fa-google-play"></i>
                  <div class="app-info">
                    <span class="app-store">Get it on</span>
                    <span class="app-name">Google Play</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Menu Footer -->
        <div class="menu-footer">
          <div class="social-links">
            <a href="#twitter" class="social-link" aria-label="Twitter">
              <i class="fab fa-twitter"></i>
            </a>
            <a href="#linkedin" class="social-link" aria-label="LinkedIn">
              <i class="fab fa-linkedin"></i>
            </a>
            <a href="#github" class="social-link" aria-label="GitHub">
              <i class="fab fa-github"></i>
            </a>
            <a href="#youtube" class="social-link" aria-label="YouTube">
              <i class="fab fa-youtube"></i>
            </a>
          </div>
          <div class="footer-links">
            <a href="#privacy">Privacy</a>
            <span class="separator">•</span>
            <a href="#terms">Terms</a>
            <span class="separator">•</span>
            <a href="#cookies">Cookies</a>
          </div>
        </div>
      </div>
    `;

    const menuContainer = menuOverlay.querySelector('.menu-container');
    if (menuContainer) {
      menuContainer.id = 'mobile-hamburger-menu';
      menuContainer.classList.add('hidden');
    }

    document.body.appendChild(hamburgerButton);
    document.body.appendChild(menuOverlay);

    this.initializeHamburgerMenuController();
  }

  createMenuItem(item) {
    const isActive = this.isItemActive(item.href);
    return `
      <a 
        href="${item.href}" 
        class="menu-item ${isActive ? 'active' : ''}"
        data-menu-id="${item.id}"
      >
        <div class="menu-item-icon">
          <i class="${item.icon}"></i>
        </div>
        <div class="menu-item-content">
          <div class="menu-item-label">${item.label}</div>
          <div class="menu-item-description">${item.description}</div>
        </div>
        <div class="menu-item-arrow">
          <i class="fas fa-chevron-right"></i>
        </div>
      </a>
    `;
  }

  setupEventListeners() {
    // Bottom navigation clicks
    document.addEventListener('click', (e) => {
      if (e.target.closest('.bottom-nav-item')) {
        this.handleBottomNavClick(e.target.closest('.bottom-nav-item'));
      }
    });

    // Menu item clicks
    document.addEventListener('click', (e) => {
      if (e.target.closest('.menu-item')) {
        this.handleMenuItemClick(e.target.closest('.menu-item'));
      }
    });
    
    // Language selector
    const languageSelect = document.getElementById('mobile-language-select');
    languageSelect?.addEventListener('change', (e) => {
      this.handleLanguageChange(e.target.value);
    });
  }

  setupResponsiveHandling() {
    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const wasMobile = this.isMobile;
        this.isMobile = this.checkIsMobile();
        
        if (wasMobile !== this.isMobile) {
          this.handleMobileChange();
        }
      }, 250);
    });

    // Handle orientation change
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        this.adjustForOrientation();
      }, 100);
    });
  }

  initializeActiveStates() {
    this.updateActiveStates();
    this.updateUserSection();
  }

  handleBottomNavClick(item) {
    const navId = item.dataset.navId;
    const href = item.getAttribute('href');
    
    // Update active state
    this.updateBottomNavActive(navId);
    
    // Handle special actions
    if (navId === 'profile') {
      this.handleProfileAction();
      return;
    }
    
    // Navigate if it's a real link
    if (href && !href.startsWith('#')) {
      // Add transition effect
      document.body.style.opacity = '0.8';
      setTimeout(() => {
        window.location.href = href;
      }, 150);
    }
  }

  handleMenuItemClick(item) {
    const menuId = item.dataset.menuId;
    const href = item.getAttribute('href');
    
    // Close menu
    this.closeHamburgerMenu();
    
    // Navigate if it's a real link
    if (href && !href.startsWith('#')) {
      setTimeout(() => {
        window.location.href = href;
      }, 300);
    }
  }

  handleProfileAction() {
    // Check if user is signed in
    const isSignedIn = this.checkUserSignedIn();
    
    if (isSignedIn) {
      this.openProfileMenu();
    } else {
      // Open auth modal
      if (window.modalSystem) {
        window.modalSystem.openAuthModal();
      }
    }
  }

  updateActiveStates() {
    // Update bottom navigation
    this.updateBottomNavActive(this.getCurrentPageId());
    
    // Update menu items
    this.updateMenuActiveStates();
  }

  updateBottomNavActive(activeId) {
    document.querySelectorAll('.bottom-nav-item').forEach(item => {
      const itemId = item.dataset.navId;
      if (itemId === activeId) {
        item.classList.add('active');
        item.setAttribute('aria-selected', 'true');
      } else {
        item.classList.remove('active');
        item.setAttribute('aria-selected', 'false');
      }
    });
  }

  updateMenuActiveStates() {
    const currentPageId = this.getCurrentPageId();
    document.querySelectorAll('.menu-item').forEach(item => {
      const itemId = item.dataset.menuId;
      if (itemId === currentPageId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  getCurrentPageId() {
    const path = window.location.pathname;
    const filename = path.split('/').pop();
    
    if (filename === 'index.html' || filename === '') return 'home';
    if (filename === 'generator.html') return 'generator';
    if (filename === 'templates.html') return 'templates';
    
    return 'home';
  }

  isItemActive(href) {
    const currentPath = window.location.pathname;
    if (href === 'index.html' && (currentPath.endsWith('/') || currentPath.endsWith('index.html'))) {
      return true;
    }
    return currentPath.endsWith(href);
  }

  handleLanguageChange(language) {
    // Store language preference
    localStorage.setItem('vizom-language', language);
    
    // Update page language (implementation depends on i18n system)
    console.log('Language changed to:', language);
    
    // Show feedback
    this.showToast(`Language changed to ${this.getLanguageName(language)}`);
  }

  getLanguageName(code) {
    const languages = {
      en: 'English',
      es: 'Español',
      fr: 'Français',
      de: 'Deutsch',
      zh: '中文',
      ja: '日本語',
      ru: 'Русский'
    };
    return languages[code] || code;
  }

  checkUserSignedIn() {
    // Check authentication status
    return localStorage.getItem('vizom-auth-token') !== null;
  }

  updateUserSection() {
    const isSignedIn = this.checkUserSignedIn();
    const userName = document.querySelector('.user-name');
    const userEmail = document.querySelector('.user-email');
    const signInBtn = document.querySelector('.sign-in-btn');
    
    if (isSignedIn) {
      const userData = this.getUserData();
      if (userName) userName.textContent = userData.name || 'User';
      if (userEmail) userEmail.textContent = userData.email || 'user@example.com';
      if (signInBtn) {
        signInBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Sign Out';
        signInBtn.onclick = () => this.handleSignOut();
      }
    } else {
      if (userName) userName.textContent = 'Guest User';
      if (userEmail) userEmail.textContent = 'Not signed in';
      if (signInBtn) {
        signInBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Sign In';
        signInBtn.onclick = () => window.modalSystem?.openAuthModal();
      }
    }
  }

  getUserData() {
    try {
      return JSON.parse(localStorage.getItem('vizom-user-data') || '{}');
    } catch {
      return {};
    }
  }

  handleSignOut() {
    localStorage.removeItem('vizom-auth-token');
    localStorage.removeItem('vizom-user-data');
    this.updateUserSection();
    this.showToast('Signed out successfully');
    this.closeHamburgerMenu();
  }

  openProfileMenu() {
    // Create profile menu or navigate to profile page
    console.log('Opening profile menu');
    this.closeHamburgerMenu();
  }

  handleMobileChange() {
    if (this.isMobile) {
      this.enableMobileFeatures();
    } else {
      this.disableMobileFeatures();
    }
  }

  enableMobileFeatures() {
    // Show mobile navigation
    const bottomNav = document.getElementById('mobile-bottom-nav');
    const hamburgerButton = document.getElementById('mobile-hamburger-button');
    
    if (bottomNav) bottomNav.style.display = 'flex';
    if (hamburgerButton) hamburgerButton.style.display = 'flex';
    
    // Apply mobile adaptations
    this.applyMobileAdaptations();
  }

  disableMobileFeatures() {
    // Hide mobile navigation
    const bottomNav = document.getElementById('mobile-bottom-nav');
    const hamburgerButton = document.getElementById('mobile-hamburger-button');
    
    if (bottomNav) bottomNav.style.display = 'none';
    if (hamburgerButton) hamburgerButton.style.display = 'none';
    
    // Close menu if open
    this.closeHamburgerMenu();
  }

  applyMobileAdaptations() {
    // Generator: Stack panels vertically
    this.adaptGeneratorLayout();
    
    // Templates: Single column grid
    this.adaptTemplatesLayout();
    
    // Modals: Full-screen on mobile
    this.adaptModalsForMobile();
    
    // Touch-friendly button sizes
    this.enforceTouchTargets();
  }

  adaptGeneratorLayout() {
    const generatorContainer = document.querySelector('.generator-container');
    if (generatorContainer) {
      generatorContainer.classList.add('mobile-layout');
    }
  }

  adaptTemplatesLayout() {
    const templatesGrid = document.querySelector('#templates-grid');
    if (templatesGrid) {
      templatesGrid.classList.add('mobile-single-column');
    }
  }

  adaptModalsForMobile() {
    // Override modal system for mobile
    if (window.modalSystem) {
      const originalShowModal = window.modalSystem.showModal.bind(window.modalSystem);
      window.modalSystem.showModal = (type, data) => {
        if (this.isMobile) {
          // Use full-screen modal on mobile
          originalShowModal(type, { ...data, mobileFullscreen: true });
        } else {
          originalShowModal(type, data);
        }
      };
    }
  }

  enforceTouchTargets() {
    // Ensure all interactive elements meet minimum touch target size
    const touchElements = document.querySelectorAll('button, a, input, .clickable');
    touchElements.forEach(element => {
      const computedStyle = window.getComputedStyle(element);
      const height = parseInt(computedStyle.height);
      const width = parseInt(computedStyle.width);
      
      if (height < 44) element.style.minHeight = '44px';
      if (width < 44) element.style.minWidth = '44px';
    });
  }

  adjustForOrientation() {
    // Adjust layout for landscape/portrait
    const isLandscape = window.innerWidth > window.innerHeight;
    
    if (isLandscape) {
      document.body.classList.add('mobile-landscape');
    } else {
      document.body.classList.remove('mobile-landscape');
    }
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
  showBottomNavigation() {
    const bottomNav = document.getElementById('mobile-bottom-nav');
    if (bottomNav && this.isMobile) {
      bottomNav.style.display = 'flex';
    }
  }

  hideBottomNavigation() {
    const bottomNav = document.getElementById('mobile-bottom-nav');
    if (bottomNav) {
      bottomNav.style.display = 'none';
    }
  }

  updateBottomNavItem(itemId, updates) {
    const item = document.querySelector(`[data-nav-id="${itemId}"]`);
    if (item) {
      if (updates.icon) {
        const icon = item.querySelector('.nav-icon i');
        if (icon) icon.className = updates.icon;
      }
      if (updates.label) {
        const label = item.querySelector('.nav-label');
        if (label) label.textContent = updates.label;
      }
      if (updates.href) {
        item.setAttribute('href', updates.href);
      }
      if (updates.badge) {
        // Add badge functionality
        this.addBadgeToNavItem(item, updates.badge);
      }
    }
  }

  addBadgeToNavItem(item, badge) {
    // Remove existing badge
    const existingBadge = item.querySelector('.nav-badge');
    if (existingBadge) existingBadge.remove();
    
    // Add new badge
    const badgeElement = document.createElement('span');
    badgeElement.className = 'nav-badge';
    badgeElement.textContent = badge;
    item.appendChild(badgeElement);
  }

  setHamburgerMenuPosition(position = 'top-right') {
    const button = document.getElementById('mobile-hamburger-button');
    if (button) {
      button.className = `mobile-hamburger-button position-${position}`;
    }
  }
}

// Initialize mobile navigation
document.addEventListener('DOMContentLoaded', () => {
  window.mobileNavigation = new MobileNavigation();
});

// Export for use in other modules
export { MobileNavigation };

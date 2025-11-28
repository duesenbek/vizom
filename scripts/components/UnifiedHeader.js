// Unified Header Navigation Component
class UnifiedHeader {
  constructor() {
    this.currentPage = this.getCurrentPage();
    this.isMobile = false;
    this.isMenuOpen = false;
    this.isUserLoggedIn = false;
    
    this.init();
  }

  init() {
    this.setupStyles();
    this.createHeader();
    this.bindEvents();
    this.setupMobileDetection();
    this.checkAuthState();
  }

  // Setup unified header styles
  setupStyles() {
    const styleId = 'unified-header-styles';
    
    if (document.getElementById(styleId)) {
      return;
    }

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      /* Unified Header Navigation */
      .unified-header {
        position: sticky;
        top: 0;
        z-index: 50;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(12px);
        border-bottom: 1px solid rgba(226, 232, 240, 0.8);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .unified-header.scrolled {
        background: rgba(255, 255, 255, 0.98);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }

      .header-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 24px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 64px;
      }

      /* Logo Section */
      .logo-section {
        display: flex;
        align-items: center;
        gap: 12px;
        flex-shrink: 0;
        min-width: 0;
      }

      .logo-link {
        display: flex;
        align-items: center;
        gap: 12px;
        text-decoration: none;
        color: #1e293b;
        font-weight: 700;
        font-size: 20px;
        transition: all 0.2s ease;
      }

      .logo-link:hover {
        color: #2563eb;
        transform: translateY(-1px);
      }

      .logo-icon {
        width: 40px;
        height: 40px;
        background-image: url('/public/images/vizom-icon.png');
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        color: transparent;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0;
        box-shadow: 0 2px 8px rgba(24, 114, 217, 0.3);
        transition: all 0.2s ease;
      }

      .logo-link:hover .logo-icon {
        transform: scale(1.05);
        box-shadow: 0 4px 12px rgba(24, 114, 217, 0.4);
      }

      .mobile-menu-toggle {
        display: none;
        width: 40px;
        height: 40px;
        border: none;
        background: #f8fafc;
        color: #64748b;
        border-radius: 8px;
        cursor: pointer;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        transition: all 0.2s ease;
        margin-left: 16px;
      }

      .mobile-menu-toggle:hover {
        background: #e2e8f0;
        color: #334155;
      }

      .mobile-menu-toggle.active {
        background: #dbeafe;
        color: #2563eb;
      }

      /* Primary Navigation */
      .primary-nav {
        display: flex;
        align-items: center;
        gap: 8px;
        flex: 1;
        justify-content: center;
        padding: 0 24px;
      }

      .nav-link {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 8px 16px;
        border-radius: 8px;
        text-decoration: none;
        color: #64748b;
        font-size: 14px;
        font-weight: 500;
        transition: all 0.2s ease;
        position: relative;
        white-space: nowrap;
      }

      .nav-link:hover {
        background: #f1f5f9;
        color: #334155;
        transform: translateY(-1px);
      }

      .nav-link.active {
        background: #dbeafe;
        color: #2563eb;
        font-weight: 600;
      }

      .nav-link.active::after {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 50%;
        transform: translateX(-50%);
        width: 4px;
        height: 4px;
        background: #2563eb;
        border-radius: 50%;
      }

      .nav-icon {
        font-size: 12px;
        width: 16px;
        text-align: center;
      }

      /* User Actions */
      .user-actions {
        display: flex;
        align-items: center;
        gap: 12px;
        flex-shrink: 0;
      }

      .auth-button {
        padding: 8px 20px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        border: none;
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        gap: 6px;
      }

      .auth-button.secondary {
        background: #f8fafc;
        color: #64748b;
        border: 1px solid #e2e8f0;
      }

      .auth-button.secondary:hover {
        background: #f1f5f9;
        color: #334155;
        border-color: #cbd5e1;
      }

      .auth-button.primary {
        background: #2563eb;
        color: white;
      }

      .auth-button.primary:hover {
        background: #1d4ed8;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
      }

      /* Language Selector */
      .language-selector {
        position: relative;
      }

      .language-button {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 8px 12px;
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        color: #64748b;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .language-button:hover {
        background: #f1f5f9;
        color: #334155;
        border-color: #cbd5e1;
      }

      .language-dropdown {
        position: absolute;
        top: 100%;
        right: 0;
        margin-top: 8px;
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        opacity: 0;
        visibility: hidden;
        transform: translateY(-10px);
        transition: all 0.2s ease;
        z-index: 100;
        min-width: 120px;
      }

      .language-dropdown.show {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
      }

      .language-option {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 12px;
        color: #374151;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .language-option:hover {
        background: #f9fafb;
        color: #111827;
      }

      .language-option.active {
        background: #dbeafe;
        color: #2563eb;
        font-weight: 500;
      }

      .language-flag {
        font-size: 16px;
      }

      /* User Dropdown */
      .user-dropdown {
        position: relative;
      }

      .user-avatar {
        width: 36px;
        height: 36px;
        background: linear-gradient(135deg, #8b5cf6, #7c3aed);
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
        border: 2px solid transparent;
      }

      .user-avatar:hover {
        transform: scale(1.05);
        border-color: #e0e7ff;
      }

      .user-menu {
        position: absolute;
        top: 100%;
        right: 0;
        margin-top: 8px;
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        opacity: 0;
        visibility: hidden;
        transform: translateY(-10px);
        transition: all 0.2s ease;
        z-index: 100;
        min-width: 200px;
      }

      .user-menu.show {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
      }

      .user-menu-header {
        padding: 12px 16px;
        border-bottom: 1px solid #f1f5f9;
      }

      .user-name {
        font-weight: 600;
        color: #111827;
        font-size: 14px;
      }

      .user-email {
        color: #6b7280;
        font-size: 12px;
        margin-top: 2px;
      }

      .user-menu-item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 16px;
        color: #374151;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.2s ease;
        text-decoration: none;
      }

      .user-menu-item:hover {
        background: #f9fafb;
        color: #111827;
      }

      .user-menu-divider {
        height: 1px;
        background: #f1f5f9;
        margin: 4px 0;
      }

      .user-menu-icon {
        width: 16px;
        text-align: center;
        color: #9ca3af;
      }

      /* Mobile Menu */
      .mobile-menu-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 90;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
      }

      .mobile-menu-overlay.show {
        opacity: 1;
        visibility: visible;
      }

      .mobile-menu {
        position: fixed;
        top: 0;
        left: 0;
        width: 280px;
        height: 100%;
        background: white;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
        transform: translateX(-100%);
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        z-index: 95;
        display: flex;
        flex-direction: column;
      }

      .mobile-menu.show {
        transform: translateX(0);
      }

      .mobile-menu-header {
        padding: 20px;
        border-bottom: 1px solid #f1f5f9;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .mobile-menu-title {
        font-weight: 600;
        color: #111827;
        font-size: 16px;
      }

      .mobile-menu-close {
        width: 32px;
        height: 32px;
        border: none;
        background: #f3f4f6;
        color: #6b7280;
        border-radius: 6px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
      }

      .mobile-menu-close:hover {
        background: #e5e7eb;
        color: #374151;
      }

      .mobile-nav {
        flex: 1;
        padding: 20px;
      }

      .mobile-nav-link {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 16px;
        margin-bottom: 4px;
        border-radius: 8px;
        color: #64748b;
        font-size: 15px;
        font-weight: 500;
        text-decoration: none;
        transition: all 0.2s ease;
      }

      .mobile-nav-link:hover {
        background: #f8fafc;
        color: #334155;
      }

      .mobile-nav-link.active {
        background: #dbeafe;
        color: #2563eb;
      }

      .mobile-nav-icon {
        width: 20px;
        text-align: center;
      }

      .mobile-actions {
        padding: 20px;
        border-top: 1px solid #f1f5f9;
      }

      .mobile-auth-buttons {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .mobile-auth-button {
        padding: 10px 16px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        border: none;
        text-decoration: none;
        text-align: center;
      }

      /* Responsive Design */
      @media (max-width: 768px) {
        .header-container {
          padding: 0 16px;
        }

        .mobile-menu-toggle {
          display: flex;
        }

        .primary-nav {
          display: none;
        }

        .user-actions .language-selector,
        .user-actions .auth-button:not(.mobile-only) {
          display: none;
        }

        .user-actions .auth-button.mobile-only {
          display: flex;
        }

        .logo-icon {
          width: 32px;
          height: 32px;
          font-size: 0;
        }

        .logo-link {
          font-size: 18px;
        }
      }

      @media (max-width: 640px) {
        .mobile-menu {
          width: 100%;
        }
      }

      /* Reduced Motion */
      @media (prefers-reduced-motion: reduce) {
        .unified-header,
        .logo-link,
        .nav-link,
        .auth-button,
        .language-button,
        .user-avatar,
        .mobile-menu-overlay,
        .mobile-menu {
          transition: none !important;
        }
      }

      /* High Contrast */
      @media (prefers-contrast: high) {
        .unified-header {
          border-bottom-width: 2px;
        }

        .nav-link,
        .auth-button,
        .language-button {
          border: 1px solid transparent;
        }

        .nav-link.active {
          border-color: #2563eb;
        }
      }
    `;

    document.head.appendChild(style);
  }

  // Create unified header HTML
  createHeader() {
    const headerHTML = `
      <header class="unified-header" id="unified-header">
        <div class="header-container">
          <!-- Logo Section -->
          <div class="logo-section">
            <a href="index.html" class="logo-link" aria-label="Vizom home">
              <img src="/favicon.png" alt="Vizom logo" class="logo-favicon">
              <span class="logo-text">VIZOM</span>
            </a>
            <button class="mobile-menu-toggle" id="mobile-menu-toggle" aria-label="Toggle menu">
              <i class="fas fa-bars"></i>
            </button>
          </div>

          <!-- Primary Navigation -->
          <nav class="primary-nav">
            <a href="index.html" class="nav-link" data-page="index">
              <i class="fas fa-home nav-icon"></i>
              <span>Home</span>
            </a>
            <a href="generator.html" class="nav-link" data-page="generator">
              <i class="fas fa-chart-line nav-icon"></i>
              <span>Generator</span>
            </a>
            <a href="templates.html" class="nav-link" data-page="templates">
              <i class="fas fa-layer-group nav-icon"></i>
              <span>Templates</span>
            </a>
            <a href="pricing.html" class="nav-link" data-page="pricing">
              <i class="fas fa-tag nav-icon"></i>
              <span>Pricing</span>
            </a>
          </nav>

          <!-- User Actions -->
          <div class="user-actions">
            <!-- Language Selector -->
            <div class="language-selector">
              <button class="language-button" id="language-button">
                <span class="language-flag" id="current-lang-flag">🇺🇸</span>
                <span class="language-text" id="current-lang-text">EN</span>
                <i class="fas fa-chevron-down" style="font-size: 10px;"></i>
              </button>
              <div class="language-dropdown" id="language-dropdown">
                <div class="language-option active" data-lang="en">
                  <span class="language-flag">🇺🇸</span>
                  <span>English</span>
                </div>
                <div class="language-option" data-lang="ru">
                  <span class="language-flag">🇷🇺</span>
                  <span>Русский</span>
                </div>
                <div class="language-option" data-lang="kk">
                  <span class="language-flag">🇰🇿</span>
                  <span>Қазақша</span>
                </div>
                <div class="language-option" data-lang="tr">
                  <span class="language-flag">🇹🇷</span>
                  <span>Türkçe</span>
                </div>
                <div class="language-option" data-lang="es">
                  <span class="language-flag">🇪🇸</span>
                  <span>Español</span>
                </div>
                <div class="language-option" data-lang="pt">
                  <span class="language-flag">🇧🇷</span>
                  <span>Português</span>
                </div>
                <div class="language-option" data-lang="fr">
                  <span class="language-flag">🇫🇷</span>
                  <span>Français</span>
                </div>
                <div class="language-option" data-lang="pl">
                  <span class="language-flag">🇵🇱</span>
                  <span>Polski</span>
                </div>
              </div>
            </div>

            <!-- Auth Buttons (shown when not logged in) -->
            <div class="auth-section" id="auth-section">
              <a href="#" class="auth-button secondary" id="sign-in-btn">
                <i class="fas fa-sign-in-alt"></i>
                <span>Sign In</span>
              </a>
              <a href="#" class="auth-button primary" id="get-started-btn">
                <i class="fas fa-rocket"></i>
                <span>Get Started</span>
              </a>
            </div>

            <!-- User Dropdown (shown when logged in) -->
            <div class="user-dropdown hidden" id="user-dropdown">
              <button class="user-avatar" id="user-avatar">
                <span id="user-initials">U</span>
              </button>
              <div class="user-menu" id="user-menu">
                <div class="user-menu-header">
                  <div class="user-name" id="user-name">User Name</div>
                  <div class="user-email" id="user-email">user@example.com</div>
                </div>
                <a href="#" class="user-menu-item">
                  <i class="fas fa-user user-menu-icon"></i>
                  <span>Profile</span>
                </a>
                <a href="#" class="user-menu-item">
                  <i class="fas fa-cog user-menu-icon"></i>
                  <span>Settings</span>
                </a>
                <a href="#" class="user-menu-item">
                  <i class="fas fa-folder user-menu-icon"></i>
                  <span>My Projects</span>
                </a>
                <div class="user-menu-divider"></div>
                <a href="#" class="user-menu-item" id="sign-out-btn">
                  <i class="fas fa-sign-out-alt user-menu-icon"></i>
                  <span>Sign Out</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Mobile Menu Overlay -->
      <div class="mobile-menu-overlay" id="mobile-menu-overlay"></div>
      
      <!-- Mobile Menu -->
      <div class="mobile-menu" id="mobile-menu">
        <div class="mobile-menu-header">
          <div class="mobile-menu-title">Menu</div>
          <button class="mobile-menu-close" id="mobile-menu-close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <nav class="mobile-nav">
          <a href="index.html" class="mobile-nav-link" data-page="index">
            <i class="fas fa-home mobile-nav-icon"></i>
            <span>Home</span>
          </a>
          <a href="generator.html" class="mobile-nav-link" data-page="generator">
            <i class="fas fa-chart-line mobile-nav-icon"></i>
            <span>Generator</span>
          </a>
          <a href="templates.html" class="mobile-nav-link" data-page="templates">
            <i class="fas fa-layer-group mobile-nav-icon"></i>
            <span>Templates</span>
          </a>
          <a href="pricing.html" class="mobile-nav-link" data-page="pricing">
            <i class="fas fa-tag mobile-nav-icon"></i>
            <span>Pricing</span>
          </a>
        </nav>
        <div class="mobile-actions">
          <div class="mobile-auth-buttons" id="mobile-auth-buttons">
            <a href="#" class="mobile-auth-button secondary" id="mobile-sign-in-btn">
              Sign In
            </a>
            <a href="#" class="mobile-auth-button primary" id="mobile-get-started-btn">
              Get Started
            </a>
          </div>
        </div>
      </div>
    `;

    // Replace existing header or add new one
    const existingHeader = document.querySelector('header');
    if (existingHeader) {
      existingHeader.replaceWith(this.createFragment(headerHTML));
    } else {
      document.body.insertAdjacentHTML('afterbegin', headerHTML);
    }
  }

  // Helper to create fragment from HTML
  createFragment(html) {
    const template = document.createElement('template');
    template.innerHTML = html.trim();
    return template.content.firstChild;
  }

  // Bind events
  bindEvents() {
    // Mobile menu toggle
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    const mobileOverlay = document.getElementById('mobile-menu-overlay');
    const mobileMenu = document.getElementById('mobile-menu-close');
    const mobileMenuElement = document.getElementById('mobile-menu');

    if (mobileToggle) {
      mobileToggle.addEventListener('click', () => this.toggleMobileMenu());
    }

    if (mobileOverlay) {
      mobileOverlay.addEventListener('click', () => this.closeMobileMenu());
    }

    if (mobileMenu) {
      mobileMenu.addEventListener('click', () => this.closeMobileMenu());
    }

    // Language selector
    const languageButton = document.getElementById('language-button');
    const languageDropdown = document.getElementById('language-dropdown');

    if (languageButton) {
      languageButton.addEventListener('click', () => this.toggleLanguageDropdown());
    }

    // Language options
    document.querySelectorAll('.language-option').forEach(option => {
      option.addEventListener('click', (e) => {
        this.selectLanguage(e.currentTarget.dataset.lang);
      });
    });

    // User dropdown
    const userAvatar = document.getElementById('user-avatar');
    const userMenu = document.getElementById('user-menu');

    if (userAvatar) {
      userAvatar.addEventListener('click', () => this.toggleUserMenu());
    }

    // Auth buttons
    const signInBtn = document.getElementById('sign-in-btn');
    const getStartedBtn = document.getElementById('get-started-btn');
    const signOutBtn = document.getElementById('sign-out-btn');

    if (signInBtn) {
      signInBtn.addEventListener('click', () => this.handleSignIn());
    }

    if (getStartedBtn) {
      getStartedBtn.addEventListener('click', () => this.handleGetStarted());
    }

    if (signOutBtn) {
      signOutBtn.addEventListener('click', () => this.handleSignOut());
    }

    // Set active navigation
    this.setActiveNavigation();

    // Scroll effect
    window.addEventListener('scroll', () => this.handleScroll());

    // Close dropdowns on outside click
    document.addEventListener('click', (e) => this.handleOutsideClick(e));
  }

  // Get current page from URL
  getCurrentPage() {
    const path = window.location.pathname;
    const filename = path.split('/').pop() || 'index.html';
    return filename.replace('.html', '');
  }

  // Set active navigation state
  setActiveNavigation() {
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    
    navLinks.forEach(link => {
      const page = link.dataset.page;
      if (page === this.currentPage) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  // Toggle mobile menu
  toggleMobileMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    
    const overlay = document.getElementById('mobile-menu-overlay');
    const menu = document.getElementById('mobile-menu');
    const toggle = document.getElementById('mobile-menu-toggle');

    if (this.isMenuOpen) {
      overlay?.classList.add('show');
      menu?.classList.add('show');
      toggle?.classList.add('active');
      document.body.style.overflow = 'hidden';
    } else {
      this.closeMobileMenu();
    }
  }

  // Close mobile menu
  closeMobileMenu() {
    this.isMenuOpen = false;
    
    const overlay = document.getElementById('mobile-menu-overlay');
    const menu = document.getElementById('mobile-menu');
    const toggle = document.getElementById('mobile-menu-toggle');

    overlay?.classList.remove('show');
    menu?.classList.remove('show');
    toggle?.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Toggle language dropdown
  toggleLanguageDropdown() {
    const dropdown = document.getElementById('language-dropdown');
    dropdown?.classList.toggle('show');
  }

  // Select language
  selectLanguage(lang) {
    const dropdown = document.getElementById('language-dropdown');
    const button = document.getElementById('language-button');
    const options = document.querySelectorAll('.language-option');

    // Update active state
    options.forEach(option => {
      if (option.dataset.lang === lang) {
        option.classList.add('active');
      } else {
        option.classList.remove('active');
      }
    });

    // Update button text and flag
    const langNames = { en: 'EN', ru: 'RU', kk: 'KK', tr: 'TR', es: 'ES', pt: 'PT', fr: 'FR', pl: 'PL' };
    const langFlags = { en: '🇺🇸', ru: '🇷🇺', kk: '🇰🇿', tr: '🇹🇷', es: '🇪🇸', pt: '🇧🇷', fr: '🇫🇷', pl: '🇵🇱' };
    if (button) {
      const textEl = button.querySelector('.language-text');
      const flagEl = button.querySelector('.language-flag');
      if (textEl) textEl.textContent = langNames[lang] || lang.toUpperCase();
      if (flagEl) flagEl.textContent = langFlags[lang] || '🇺🇸';
    }

    // Close dropdown
    dropdown?.classList.remove('show');

    // Store preference (both keys for compatibility)
    localStorage.setItem('preferred-language', lang);
    localStorage.setItem('vizom_lang', lang);

    // Apply translations using i18n system
    if (window.VIZOM_I18N?.set) {
      window.VIZOM_I18N.set(lang);
    }

    // Emit language change event
    document.dispatchEvent(new CustomEvent('language:change', {
      detail: { language: lang }
    }));
    
    console.log('[UnifiedHeader] Language changed to:', lang);
  }

  // Toggle user menu
  toggleUserMenu() {
    const menu = document.getElementById('user-menu');
    menu?.classList.toggle('show');
  }

  // Handle sign in
  handleSignIn() {
    // Emit sign in event
    document.dispatchEvent(new CustomEvent('auth:signIn'));
  }

  // Handle get started
  handleGetStarted() {
    // Emit get started event
    document.dispatchEvent(new CustomEvent('auth:getStarted'));
  }

  // Handle sign out
  handleSignOut() {
    this.isUserLoggedIn = false;
    this.updateAuthUI();
    
    // Emit sign out event
    document.dispatchEvent(new CustomEvent('auth:signOut'));
  }

  // Update auth UI based on login state
  updateAuthUI() {
    const authSection = document.getElementById('auth-section');
    const userDropdown = document.getElementById('user-dropdown');

    if (this.isUserLoggedIn) {
      authSection?.classList.add('hidden');
      userDropdown?.classList.remove('hidden');
    } else {
      authSection?.classList.remove('hidden');
      userDropdown?.classList.add('hidden');
    }
  }

  // Check auth state
  checkAuthState() {
    // This would integrate with your auth system
    // For now, we'll check localStorage
    const user = localStorage.getItem('user');
    this.isUserLoggedIn = !!user;
    
    if (this.isUserLoggedIn) {
      const userData = JSON.parse(user);
      this.updateUserProfile(userData);
    }
    
    this.updateAuthUI();
  }

  // Update user profile in UI
  updateUserProfile(userData) {
    const initials = document.getElementById('user-initials');
    const name = document.getElementById('user-name');
    const email = document.getElementById('user-email');

    if (initials && userData.name) {
      initials.textContent = userData.name.split(' ').map(n => n[0]).join('').toUpperCase();
    }

    if (name && userData.name) {
      name.textContent = userData.name;
    }

    if (email && userData.email) {
      email.textContent = userData.email;
    }
  }

  // Handle scroll effect
  handleScroll() {
    const header = document.getElementById('unified-header');
    if (window.scrollY > 50) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  }

  // Handle outside click for dropdowns
  handleOutsideClick(e) {
    const languageButton = document.getElementById('language-button');
    const languageDropdown = document.getElementById('language-dropdown');
    const userAvatar = document.getElementById('user-avatar');
    const userMenu = document.getElementById('user-menu');

    // Close language dropdown
    if (languageDropdown && !languageButton?.contains(e.target)) {
      languageDropdown.classList.remove('show');
    }

    // Close user menu
    if (userMenu && !userAvatar?.contains(e.target)) {
      userMenu.classList.remove('show');
    }
  }

  // Setup mobile detection
  setupMobileDetection() {
    const checkMobile = () => {
      this.isMobile = window.innerWidth <= 768;
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
  }

  // Public methods
  setUserInfo(userData) {
    this.isUserLoggedIn = true;
    this.updateUserProfile(userData);
    this.updateAuthUI();
  }

  signOut() {
    this.handleSignOut();
  }

  getCurrentLanguage() {
    return localStorage.getItem('preferred-language') || 'en';
  }
}

// Initialize unified header
document.addEventListener('DOMContentLoaded', () => {
  window.unifiedHeader = new UnifiedHeader();
});

// Export for use in other modules
export { UnifiedHeader };

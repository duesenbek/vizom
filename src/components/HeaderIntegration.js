// Header Integration Script
// Ensures unified header works properly across all pages

class HeaderIntegration {
  constructor() {
    this.init();
  }

  init() {
    // Wait for the header to be rendered before setting up integration
    document.addEventListener('header:rendered', () => this.setupIntegration(), { once: true });
  }

  setupIntegration() {
    // Setup auth integration
    this.setupAuthIntegration();
    
    // Setup page-specific navigation
    this.setupPageNavigation();
    
    // Setup language persistence
    this.setupLanguagePersistence();
    
    // Setup user state management
    this.setupUserStateManagement();
    
    // Emit ready event
    document.dispatchEvent(new CustomEvent('header:ready'));
  }

  // Setup integration with existing auth system
  setupAuthIntegration() {
    // Listen for auth events from existing system
    document.addEventListener('auth:signIn', () => {
      console.log('Header: User signed in');
      // Update header UI
      if (window.unifiedHeader) {
        // Simulate user login for demo
        window.unifiedHeader.setUserInfo({
          name: 'Demo User',
          email: 'demo@vizom.com'
        });
      }
    });

    document.addEventListener('auth:signOut', () => {
      console.log('Header: User signed out');
      // Clear user data
      localStorage.removeItem('user');
      if (window.unifiedHeader) {
        window.unifiedHeader.signOut();
      }
    });

    document.addEventListener('auth:getStarted', () => {
      console.log('Header: Get started clicked');
      // Redirect to sign up or show modal
      this.showAuthModal();
    });

    // Wire up header buttons (desktop and mobile)
    const signInTrigger = document.getElementById('auth-signin');
    const signInTriggerMobile = document.getElementById('auth-signin-mobile');
    
    const handleSignInClick = (event) => {
      event.preventDefault();
      if (window.modalSystem?.openAuthModal) {
        window.modalSystem.openAuthModal();
      } else {
        this.showAuthModal();
      }
    };

    if (signInTrigger) {
      signInTrigger.addEventListener('click', handleSignInClick);
    }
    if (signInTriggerMobile) {
      signInTriggerMobile.addEventListener('click', handleSignInClick);
    }

    // Get Started buttons - only intercept if they don't have href to generator
    const getStartedButtons = document.querySelectorAll('[data-action="get-started"]');
    getStartedButtons.forEach(btn => {
      // Skip if button is a link to generator page (let it navigate normally)
      if (btn.tagName === 'A' && btn.href?.includes('generator.html')) {
        return;
      }
      btn.addEventListener('click', (event) => {
        event.preventDefault();
        if (window.modalSystem?.openAuthModal) {
          window.modalSystem.openAuthModal();
        } else {
          this.showAuthModal();
        }
      });
    });

    // Check for existing user session
    const existingUser = localStorage.getItem('user');
    if (existingUser) {
      try {
        const userData = JSON.parse(existingUser);
        if (window.unifiedHeader) {
          window.unifiedHeader.setUserInfo(userData);
        }
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
  }

  // Setup page-specific navigation behavior
  setupPageNavigation() {
    const currentPage = this.getCurrentPage();
    
    // Add page-specific navigation enhancements
    switch (currentPage) {
      case 'index':
        this.setupHomePageNavigation();
        break;
      case 'generator':
        this.setupGeneratorPageNavigation();
        break;
      case 'templates':
        this.setupTemplatesPageNavigation();
        break;
      case 'pricing':
        this.setupPricingPageNavigation();
        break;
    }
  }

  // Setup home page specific navigation
  setupHomePageNavigation() {
    // Add smooth scroll to sections
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  // Setup generator page specific navigation
  setupGeneratorPageNavigation() {
    // Add generator-specific functionality
    const smartParseBtn = document.getElementById('smart-parse-btn');
    if (smartParseBtn) {
      // Ensure button is properly connected to header auth
      smartParseBtn.addEventListener('click', () => {
        const isUserLoggedIn = localStorage.getItem('user') !== null;
        
        if (!isUserLoggedIn) {
          // Show auth modal instead of generating
          this.showAuthModal();
          return;
        }
        
        // Proceed with generation
        console.log('Generating chart...');
      });
    }
  }

  // Setup templates page specific navigation
  setupTemplatesPageNavigation() {
    // Add template filtering or search functionality
    console.log('Templates page navigation setup');
  }

  // Setup pricing page specific navigation
  setupPricingPageNavigation() {
    // Add pricing-specific functionality
    const pricingButtons = document.querySelectorAll('.bg-white.text-blue-600, .bg-slate-900.text-white');
    pricingButtons.forEach(button => {
      if (button.textContent.includes('Start Free Trial') || button.textContent.includes('Get Started')) {
        button.addEventListener('click', () => {
          // Show auth modal for sign up
          this.showAuthModal();
        });
      }
    });
  }

  // Setup language persistence
  setupLanguagePersistence() {
    // Load saved language preference
    const savedLanguage = localStorage.getItem('preferred-language') || 'en';
    
    // Apply saved language after header is ready
    setTimeout(() => {
      if (window.unifiedHeader) {
        window.unifiedHeader.selectLanguage(savedLanguage);
      }
    }, 100);

    // Listen for language changes
    document.addEventListener('language:change', (e) => {
      const { language } = e.detail;
      console.log('Language changed to:', language);
      
      // Here you would implement actual language switching
      // For now, just save the preference
      localStorage.setItem('preferred-language', language);
    });
  }

  // Setup user state management
  setupUserStateManagement() {
    // Listen for user state changes
    document.addEventListener('user:updated', (e) => {
      const { userData } = e.detail;
      console.log('User data updated:', userData);
      
      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(userData));
    });

    // Setup periodic auth state check
    setInterval(() => {
      this.checkAuthState();
    }, 30000); // Check every 30 seconds
  }

  // Check authentication state
  checkAuthState() {
    const user = localStorage.getItem('user');
    const isCurrentlyLoggedIn = !!user;
    
    // Update header if state changed
    if (window.unifiedHeader) {
      const headerState = window.unifiedHeader.isUserLoggedIn;
      if (headerState !== isCurrentlyLoggedIn) {
        window.unifiedHeader.isUserLoggedIn = isCurrentlyLoggedIn;
        window.unifiedHeader.updateAuthUI();
      }
    }
  }

  // Get current page from URL
  getCurrentPage() {
    const path = window.location.pathname;
    const filename = path.split('/').pop() || 'index.html';
    return filename.replace('.html', '');
  }

  // Show auth modal
  showAuthModal() {
    const authModal = document.getElementById('auth-modal');
    if (authModal) {
      authModal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
      
      // Focus on the modal
      setTimeout(() => {
        authModal.focus();
      }, 100);

      // Setup close handlers if not already set
      if (!authModal.dataset.closeHandlersSet) {
        authModal.dataset.closeHandlersSet = 'true';
        
        // Close on backdrop click
        authModal.addEventListener('click', (e) => {
          if (e.target === authModal) {
            this.hideAuthModal();
          }
        });

        // Close button
        const closeBtn = document.getElementById('close-auth-modal');
        if (closeBtn) {
          closeBtn.addEventListener('click', () => this.hideAuthModal());
        }

        // ESC key
        document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape' && authModal && !authModal.classList.contains('hidden')) {
            this.hideAuthModal();
          }
        });
      }
    }
  }

  // Hide auth modal
  hideAuthModal() {
    const authModal = document.getElementById('auth-modal');
    if (authModal) {
      authModal.classList.add('hidden');
      document.body.style.overflow = '';
    }
  }

  // Setup global event listeners
  setupGlobalListeners() {
    // Close dropdowns on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        // Close all dropdowns
        const dropdowns = document.querySelectorAll('.language-dropdown.show, .user-menu.show');
        dropdowns.forEach(dropdown => {
          dropdown.classList.remove('show');
        });
      }
    });

    // Handle scroll effects
    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;
      const header = document.getElementById('unified-header');
      
      if (header) {
        // Hide/show header on scroll
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          // Scrolling down
          header.style.transform = 'translateY(-100%)';
        } else {
          // Scrolling up
          header.style.transform = 'translateY(0)';
        }
      }
      
      lastScrollY = currentScrollY;
    });
  }

  // Public API methods
  updateUser(userData) {
    if (window.unifiedHeader) {
      window.unifiedHeader.setUserInfo(userData);
    }
  }

  signOut() {
    if (window.unifiedHeader) {
      window.unifiedHeader.signOut();
    }
  }

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  setLanguage(language) {
    if (window.unifiedHeader) {
      window.unifiedHeader.selectLanguage(language);
    }
  }

  getCurrentLanguage() {
    return localStorage.getItem('preferred-language') || 'en';
  }
}

// Export class for external instantiation
export default HeaderIntegration;
export { HeaderIntegration };

/**
 * Enhanced Mobile Experience Component
 * Touch targets optimization, mobile navigation, and responsive interactions
 */

class EnhancedMobileExperience {
  constructor() {
    this.touchTargets = new Map();
    this.gestureHandlers = new Map();
    this.isMobile = this.detectMobile();
    this.init();
  }

  init() {
    this.setupMobileStyles();
    this.setupTouchOptimizations();
    this.setupMobileNavigation();
    this.setupGestureHandlers();
    this.setupViewportOptimizations();
  }

  /**
   * Detect mobile device
   */
  detectMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           window.innerWidth <= 768;
  }

  /**
   * Setup mobile-specific styles
   */
  setupMobileStyles() {
    if (document.getElementById('mobile-experience-styles')) return;

    const styles = document.createElement('style');
    styles.id = 'mobile-experience-styles';
    styles.textContent = `
      /* Touch Target Optimizations */
      .touch-target {
        min-height: 44px !important;
        min-width: 44px !important;
        padding: 12px !important;
        position: relative;
      }

      .touch-target::before {
        content: '';
        position: absolute;
        top: -8px;
        left: -8px;
        right: -8px;
        bottom: -8px;
        background: transparent;
        border-radius: inherit;
      }

      /* Mobile Button Styles */
      .btn-mobile {
        min-height: 48px;
        padding: 12px 24px;
        font-size: 16px;
        border-radius: 12px;
        font-weight: 500;
        transition: all 0.2s ease;
        position: relative;
        overflow: hidden;
      }

      .btn-mobile::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: translate(-50%, -50%);
        transition: width 0.6s, height 0.6s;
      }

      .btn-mobile:active::after {
        width: 300px;
        height: 300px;
      }

      /* Mobile Navigation */
      .mobile-nav {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: white;
        border-top: 1px solid #e5e7eb;
        padding: 8px 0;
        z-index: 100;
        transform: translateY(100%);
        transition: transform 0.3s ease;
      }

      .mobile-nav.show {
        transform: translateY(0);
      }

      .mobile-nav-items {
        display: flex;
        justify-content: space-around;
        align-items: center;
        max-width: 600px;
        margin: 0 auto;
      }

      .mobile-nav-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 8px 16px;
        text-decoration: none;
        color: #6b7280;
        transition: all 0.2s ease;
        min-width: 60px;
      }

      .mobile-nav-item.active {
        color: #3b82f6;
      }

      .mobile-nav-item:active {
        transform: scale(0.95);
      }

      .mobile-nav-icon {
        font-size: 20px;
        margin-bottom: 4px;
      }

      .mobile-nav-label {
        font-size: 11px;
        font-weight: 500;
      }

      /* Mobile Sidebar */
      .mobile-sidebar {
        position: fixed;
        top: 0;
        left: -100%;
        width: 280px;
        height: 100vh;
        background: white;
        box-shadow: 2px 0 20px rgba(0, 0, 0, 0.1);
        z-index: 200;
        transition: left 0.3s ease;
        overflow-y: auto;
      }

      .mobile-sidebar.show {
        left: 0;
      }

      .mobile-sidebar-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 199;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
      }

      .mobile-sidebar-overlay.show {
        opacity: 1;
        visibility: visible;
      }

      /* Mobile Menu Toggle */
      .mobile-menu-toggle {
        display: none;
        position: fixed;
        top: 16px;
        left: 16px;
        z-index: 201;
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 12px;
        padding: 12px;
        cursor: pointer;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        transition: all 0.2s ease;
      }

      .mobile-menu-toggle:active {
        transform: scale(0.95);
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
      }

      /* Touch Feedback */
      .touch-feedback {
        position: relative;
        overflow: hidden;
      }

      .touch-ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(59, 130, 246, 0.3);
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
      }

      @keyframes ripple {
        to {
          transform: scale(4);
          opacity: 0;
        }
      }

      /* Mobile Chart Container */
      .mobile-chart-container {
        position: relative;
        width: 100%;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: none;
        -ms-overflow-style: none;
      }

      .mobile-chart-container::-webkit-scrollbar {
        display: none;
      }

      .mobile-chart-wrapper {
        min-width: 100%;
        padding: 16px;
        box-sizing: border-box;
      }

      /* Mobile Input Styles */
      .mobile-input {
        font-size: 16px !important; /* Prevents zoom on iOS */
        padding: 12px 16px !important;
        border-radius: 12px !important;
        border: 2px solid #e5e7eb !important;
        transition: all 0.2s ease !important;
        min-height: 48px !important;
      }

      .mobile-input:focus {
        border-color: #3b82f6 !important;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
        outline: none !important;
      }

      /* Mobile Card Styles */
      .mobile-card {
        background: white;
        border-radius: 16px;
        padding: 20px;
        margin: 12px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
        border: 1px solid #f1f5f9;
      }

      /* Mobile Grid */
      .mobile-grid {
        display: grid;
        gap: 12px;
        padding: 12px;
      }

      .mobile-grid-1 {
        grid-template-columns: 1fr;
      }

      .mobile-grid-2 {
        grid-template-columns: repeat(2, 1fr);
      }

      /* Mobile Responsive Classes */
      @media (max-width: 768px) {
        .desktop-only { display: none !important; }
        .mobile-only { display: block !important; }
        .mobile-menu-toggle { display: flex; }
        
        /* Adjust touch targets */
        button, a, input, select, textarea {
          min-height: 44px;
          min-width: 44px;
        }
        
        /* Increase spacing */
        .container { padding: 12px; }
        .gap-4 { gap: 12px; }
        .gap-6 { gap: 16px; }
        
        /* Mobile typography */
        h1 { font-size: 24px; }
        h2 { font-size: 20px; }
        h3 { font-size: 18px; }
        
        /* Mobile charts */
        canvas { max-width: 100%; height: auto !important; }
      }

      @media (min-width: 769px) {
        .mobile-only { display: none !important; }
        .desktop-only { display: block !important; }
        .mobile-menu-toggle { display: none; }
        .mobile-nav { display: none; }
      }

      /* Safe Area Support */
      @supports (padding: max(0px)) {
        .mobile-nav {
          padding-bottom: max(8px, env(safe-area-inset-bottom));
        }
        
        .mobile-sidebar {
          padding-top: max(0px, env(safe-area-inset-top));
        }
      }

      /* Haptic Feedback Simulation */
      .haptic-feedback {
        /* Visual feedback for devices without haptic feedback */
        animation: haptic-pulse 0.1s ease-out;
      }

      @keyframes haptic-pulse {
        0% { transform: scale(1); }
        50% { transform: scale(0.98); }
        100% { transform: scale(1); }
      }

      /* Mobile Loading States */
      .mobile-loading {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
      }

      .mobile-spinner {
        width: 32px;
        height: 32px;
        border: 3px solid #e5e7eb;
        border-top: 3px solid #3b82f6;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(styles);
  }

  /**
   * Setup touch optimizations
   */
  setupTouchOptimizations() {
    // Add touch feedback to interactive elements
    document.addEventListener('touchstart', (e) => {
      const element = e.target.closest('button, a, .touch-target, .btn-mobile');
      if (element) {
        this.addTouchFeedback(element, e);
      }
    });

    // Prevent double-tap zoom on buttons
    document.addEventListener('touchend', (e) => {
      const element = e.target.closest('button, a');
      if (element) {
        e.preventDefault();
        setTimeout(() => {
          element.click();
        }, 100);
      }
    });

    // Optimize scrolling performance
    if (this.isMobile) {
      document.body.style.touchAction = 'pan-y';
      document.body.style.webkitOverflowScrolling = 'touch';
    }
  }

  /**
   * Add touch feedback ripple effect
   */
  addTouchFeedback(element, event) {
    const ripple = document.createElement('span');
    ripple.className = 'touch-ripple';
    
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.touches[0].clientX - rect.left - size / 2;
    const y = event.touches[0].clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    
    element.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  /**
   * Setup mobile navigation
   */
  setupMobileNavigation() {
    if (!this.isMobile) return;

    // Create mobile menu toggle
    const menuToggle = document.createElement('button');
    menuToggle.className = 'mobile-menu-toggle';
    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    menuToggle.setAttribute('aria-label', 'Toggle menu');
    document.body.appendChild(menuToggle);

    // Create mobile sidebar
    const sidebar = document.createElement('div');
    sidebar.className = 'mobile-sidebar';
    sidebar.innerHTML = `
      <div class="p-4 border-b">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold">VIZOM</h2>
          <button class="mobile-sidebar-close p-2" aria-label="Close menu">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
      <nav class="p-4">
        <a href="/" class="mobile-nav-item block py-3 px-4 rounded-lg hover:bg-gray-50">
          <i class="fas fa-home mr-3"></i> Home
        </a>
        <a href="/generator.html" class="mobile-nav-item block py-3 px-4 rounded-lg hover:bg-gray-50">
          <i class="fas fa-chart-line mr-3"></i> Generator
        </a>
        <a href="/templates.html" class="mobile-nav-item block py-3 px-4 rounded-lg hover:bg-gray-50">
          <i class="fas fa-layer-group mr-3"></i> Templates
        </a>
        <a href="/analytics.html" class="mobile-nav-item block py-3 px-4 rounded-lg hover:bg-gray-50">
          <i class="fas fa-chart-bar mr-3"></i> Analytics
        </a>
      </nav>
    `;
    document.body.appendChild(sidebar);

    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'mobile-sidebar-overlay';
    document.body.appendChild(overlay);

    // Setup toggle handlers
    menuToggle.addEventListener('click', () => {
      this.toggleMobileSidebar();
    });

    overlay.addEventListener('click', () => {
      this.toggleMobileSidebar();
    });

    sidebar.querySelector('.mobile-sidebar-close').addEventListener('click', () => {
      this.toggleMobileSidebar();
    });

    // Create bottom navigation
    this.createBottomNavigation();
  }

  /**
   * Create bottom navigation
   */
  createBottomNavigation() {
    const bottomNav = document.createElement('nav');
    bottomNav.className = 'mobile-nav';
    bottomNav.innerHTML = `
      <div class="mobile-nav-items">
        <a href="/" class="mobile-nav-item active">
          <i class="fas fa-home mobile-nav-icon"></i>
          <span class="mobile-nav-label">Home</span>
        </a>
        <a href="/generator.html" class="mobile-nav-item">
          <i class="fas fa-plus mobile-nav-icon"></i>
          <span class="mobile-nav-label">Create</span>
        </a>
        <a href="/templates.html" class="mobile-nav-item">
          <i class="fas fa-layer-group mobile-nav-icon"></i>
          <span class="mobile-nav-label">Templates</span>
        </a>
        <a href="/analytics.html" class="mobile-nav-item">
          <i class="fas fa-chart-bar mobile-nav-icon"></i>
          <span class="mobile-nav-label">Analytics</span>
        </a>
      </div>
    `;
    document.body.appendChild(bottomNav);

    // Show bottom navigation after a delay
    setTimeout(() => {
      bottomNav.classList.add('show');
    }, 500);
  }

  /**
   * Toggle mobile sidebar
   */
  toggleMobileSidebar() {
    const sidebar = document.querySelector('.mobile-sidebar');
    const overlay = document.querySelector('.mobile-sidebar-overlay');
    
    if (sidebar.classList.contains('show')) {
      sidebar.classList.remove('show');
      overlay.classList.remove('show');
    } else {
      sidebar.classList.add('show');
      overlay.classList.add('show');
    }
  }

  /**
   * Setup gesture handlers
   */
  setupGestureHandlers() {
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
      this.handleGesture(touchStartX, touchStartY, touchEndX, touchEndY);
    });
  }

  /**
   * Handle touch gestures
   */
  handleGesture(startX, startY, endX, endY) {
    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    // Minimum distance for gesture
    if (Math.max(absDeltaX, absDeltaY) < 50) return;

    // Horizontal swipe
    if (absDeltaX > absDeltaY) {
      if (deltaX > 0) {
        this.handleSwipeRight();
      } else {
        this.handleSwipeLeft();
      }
    }
    // Vertical swipe
    else {
      if (deltaY > 0) {
        this.handleSwipeDown();
      } else {
        this.handleSwipeUp();
      }
    }
  }

  /**
   * Handle swipe right (open sidebar)
   */
  handleSwipeRight() {
    if (startX < 50) { // Swipe from left edge
      this.toggleMobileSidebar();
    }
  }

  /**
   * Handle swipe left (close sidebar)
   */
  handleSwipeLeft() {
    const sidebar = document.querySelector('.mobile-sidebar');
    if (sidebar && sidebar.classList.contains('show')) {
      this.toggleMobileSidebar();
    }
  }

  /**
   * Handle swipe up/down (can be used for custom actions)
   */
  handleSwipeUp() {
    // Can be used for showing additional options
  }

  handleSwipeDown() {
    // Can be used for refreshing or dismissing
  }

  /**
   * Setup viewport optimizations
   */
  setupViewportOptimizations() {
    // Prevent zoom on input focus (iOS)
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      input.addEventListener('focus', () => {
        if (this.isMobile) {
          document.querySelector('meta[name="viewport"]').setAttribute('content', 
            'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0');
        }
      });

      input.addEventListener('blur', () => {
        document.querySelector('meta[name="viewport"]').setAttribute('content', 
          'width=device-width, initial-scale=1.0');
      });
    });

    // Optimize viewport height for mobile browsers
    this.setViewportHeight();
    window.addEventListener('resize', () => {
      this.setViewportHeight();
    });
  }

  /**
   * Set viewport height CSS variable
   */
  setViewportHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }

  /**
   * Optimize chart for mobile
   */
  optimizeChartForMobile(chartContainer) {
    if (!this.isMobile) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'mobile-chart-wrapper';
    
    // Wrap the chart container
    chartContainer.parentNode.insertBefore(wrapper, chartContainer);
    wrapper.appendChild(chartContainer);
    
    // Add mobile chart container class
    chartContainer.classList.add('mobile-chart-container');

    // Adjust chart options for mobile
    const canvas = chartContainer.querySelector('canvas');
    if (canvas && window.chart) {
      window.chart.options.responsive = true;
      window.chart.options.maintainAspectRatio = false;
      window.chart.options.plugins.legend.position = 'bottom';
      window.chart.options.plugins.title.display = false;
      window.chart.update();
    }
  }

  /**
   * Add haptic feedback (visual simulation)
   */
  triggerHapticFeedback(type = 'light') {
    if (!this.isMobile) return;

    const body = document.body;
    body.classList.add('haptic-feedback');
    
    setTimeout(() => {
      body.classList.remove('haptic-feedback');
    }, 100);

    // Try actual haptic feedback if available
    if ('vibrate' in navigator) {
      switch (type) {
        case 'light':
          navigator.vibrate(10);
          break;
        case 'medium':
          navigator.vibrate(20);
          break;
        case 'heavy':
          navigator.vibrate([30, 10, 30]);
          break;
      }
    }
  }

  /**
   * Get mobile experience statistics
   */
  getStats() {
    return {
      isMobile: this.isMobile,
      touchTargets: this.touchTargets.size,
      gestureHandlers: this.gestureHandlers.size,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight
    };
  }

  /**
   * Enable/disable mobile optimizations
   */
  setMobileMode(enabled) {
    this.isMobile = enabled;
    if (enabled) {
      document.body.classList.add('mobile-optimized');
    } else {
      document.body.classList.remove('mobile-optimized');
    }
  }
}

// Export singleton instance
export const mobileExperience = new EnhancedMobileExperience();

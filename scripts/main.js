// VIZOM Main JavaScript
// Organized script architecture with modular imports

/* =================================== */
/* CORE MODULES */
/* =================================== */
import { supabase } from './core/supabase-client.js';
import { Analytics } from './core/analytics.js';
import { ChartEngine } from './core/chart-engine.js';

/* =================================== */
/* COMPONENT MODULES */
/* =================================== */
import { ModalSystem } from '../src/components/ModalSystem.js';
import { LoadingStates } from '../src/components/LoadingStates.js';
import { MobileNavigation } from '../src/components/MobileNavigation.js';
import { UnifiedHeader } from '../src/components/UnifiedHeader.js';
import { UnifiedFooter } from '../src/components/UnifiedFooter.js';
import { HeaderIntegration } from '../src/components/HeaderIntegration.js';
import { ComingSoonModal } from '../src/components/ComingSoonModal.js';
import { TemplateGallery } from '../src/components/TemplateGallery.js';
import { GeneratorLayout } from '../src/components/GeneratorLayout.js';
import { MobileGenerator } from '../src/components/MobileGenerator.js';
import { MobileTemplates } from '../src/components/MobileTemplates.js';

/* =================================== */
/* PAGE-SPECIFIC MODULES */
/* =================================== */

/* =================================== */
/* MAIN APPLICATION CLASS */
/* =================================== */
const META_ENV = (typeof import.meta !== 'undefined' && import.meta && import.meta.env)
  ? import.meta.env
  : {};

class VizomApp {
  constructor() {
    this.version = '2.0.0';
    this.isInitialized = false;
    this.modules = new Map();
    this.config = this.getAppConfig();
    
    this.init();
  }

  getAppConfig() {
    return {
      environment: this.getEnvironment(),
      apiBaseUrl: this.getApiBaseUrl(),
      features: this.getEnabledFeatures(),
      theme: this.getThemeConfig(),
      analytics: this.getAnalyticsConfig(),
      mobile: this.getMobileConfig()
    };
  }

  getEnvironment() {
    return META_ENV.MODE || META_ENV.VITE_MODE || 'development';
  }

  getApiBaseUrl() {
    const env = this.getEnvironment();
    switch (env) {
      case 'production':
        return 'https://api.vizom.com';
      case 'staging':
        return 'https://staging-api.vizom.com';
      default:
        return 'http://localhost:3000';
    }
  }

  getEnabledFeatures() {
    return {
      aiGeneration: true,
      templates: true,
      export: true,
      mobileNavigation: true,
      darkMode: true,
      analytics: true,
      offlineMode: false,
      realTimeCollaboration: false
    };
  }

  getThemeConfig() {
    return {
      defaultTheme: 'light',
      enableDarkMode: true,
      enableSystemTheme: true,
      enableCustomThemes: true
    };
  }

  getAnalyticsConfig() {
    return {
      enabled: true,
      trackingId: META_ENV.VITE_GA_TRACKING_ID,
      debugMode: this.getEnvironment() !== 'production'
    };
  }

  getMobileConfig() {
    return {
      breakpoint: 768,
      enableTouchGestures: true,
      enableVoiceInput: true,
      enableOfflineMode: false
    };
  }

  async init() {
    try {
            console.log(`[VIZOM] v${this.version} initializing...`);
      
      // Initialize core services
      await this.initCoreServices();
      
      // Initialize components
      await this.initComponents();
      
      // Initialize page-specific functionality
      await this.initPageSpecific();
      
      // Setup global event listeners
      this.setupGlobalEventListeners();
      
      // Initialize error handling
      this.initErrorHandling();
      
      // Setup performance monitoring
      this.initPerformanceMonitoring();
      
      this.isInitialized = true;
            console.log('[VIZOM] Initialized successfully');
      
      // Announce ready state
      this.announceReady();
      
    } catch (error) {
            console.error('[VIZOM] Initialization failed:', error);
      this.handleInitializationError(error);
    }
  }

  async initCoreServices() {
        console.log('[Init] Initializing core services...');
    
    // Initialize Supabase client
    if (supabase) {
      this.modules.set('supabase', supabase);
            console.log('[Init] Supabase client initialized');
    }
    
    // Initialize analytics
        if (this.config.analytics.enabled && Analytics) {
      const analytics = new Analytics();
      await analytics.init(this.config.analytics);
      this.modules.set('analytics', analytics);
            console.log('[Init] Analytics initialized');
    }
    
    // Initialize chart engine
    if (ChartEngine) {
      const chartEngine = new ChartEngine(this.config.apiBaseUrl);
      await chartEngine.init();
      this.modules.set('chartEngine', chartEngine);
            console.log('[Init] Chart engine initialized');
    }
  }

  async initComponents() {
        console.log('[Init] Initializing components...');
    
    // Initialize modal system
    if (ModalSystem) {
      const modalSystem = new ModalSystem();
      this.modules.set('modalSystem', modalSystem);
      window.modalSystem = modalSystem; // Expose to global scope
            console.log('[Init] Modal system initialized');
    }
    
    // Initialize loading states
    if (LoadingStates) {
      const loadingStates = new LoadingStates();
      this.modules.set('loadingStates', loadingStates);
            console.log('[Init] Loading states initialized');
    }
    
    // Initialize mobile navigation
    if (this.config.features.mobileNavigation && MobileNavigation) {
      const mobileNavigation = new MobileNavigation();
      this.modules.set('mobileNavigation', mobileNavigation);
            console.log('[Init] Mobile navigation initialized');
    }
    
    // Initialize header
    if (UnifiedHeader) {
      const header = new UnifiedHeader();
      this.modules.set('header', header);
            console.log('[Init] Global error handlers initialized');
    }
    
    // Initialize footer
    if (UnifiedFooter) {
      const footer = new UnifiedFooter();
      this.modules.set('footer', footer);
      console.log('[Init] Footer initialized');
    }

    // Initialize header integration
    if (HeaderIntegration) {
      const headerIntegration = new HeaderIntegration();
      this.modules.set('headerIntegration', headerIntegration);
      console.log('[Init] Header integration initialized');
    }

    // Initialize coming soon modal
    if (ComingSoonModal) {
      const comingSoonModal = new ComingSoonModal();
      this.modules.set('comingSoonModal', comingSoonModal);
            console.log('[Init] Coming soon modal initialized');
    }
    
    // Initialize template gallery (if on templates page)
    if (this.isTemplatesPage() && TemplateGallery) {
      const templateGallery = new TemplateGallery();
      this.modules.set('templateGallery', templateGallery);
            console.log('[Init] Template gallery initialized');
    }
    
    // Initialize generator layout (if on generator page)
    if (this.isGeneratorPage() && GeneratorLayout) {
      const generatorLayout = new GeneratorLayout();
      this.modules.set('generatorLayout', generatorLayout);
            console.log('[Init] Generator layout initialized');
    }
    
    // Initialize mobile-specific components
    if (this.isMobileDevice()) {
      await this.initMobileComponents();
    }
  }

  async initMobileComponents() {
        console.log('[Init] Initializing mobile components...');
    
    // Initialize mobile generator
    if (this.isGeneratorPage() && MobileGenerator) {
      const mobileGenerator = new MobileGenerator();
      this.modules.set('mobileGenerator', mobileGenerator);
            console.log('[Init] Mobile generator initialized');
    }
    
    // Initialize mobile templates
    if (this.isTemplatesPage() && MobileTemplates) {
      const mobileTemplates = new MobileTemplates();
      this.modules.set('mobileTemplates', mobileTemplates);
            console.log('[Init] Mobile templates initialized');
    }
  }

  async initPageSpecific() {
        console.log('[Init] Initializing page-specific functionality...');
    
    
    // Initialize other page-specific modules based on current page
    await this.initCurrentPageModules();
  }

  async initCurrentPageModules() {
    const pageName = this.getCurrentPageName();
    
    switch (pageName) {
      case 'home':
        await this.initHomePage();
        break;
      case 'generator':
        await this.initGeneratorPage();
        break;
      case 'templates':
        await this.initTemplatesPage();
        break;
      case 'pricing':
        await this.initPricingPage();
        break;
      default:
            console.log(`[Init] No specific initialization for page: ${pageName}`);
    }
  }

  async initHomePage() {
    // Home page specific initialization
        console.log('[Init] Initializing home page...');
  }

  async initGeneratorPage() {
    // Generator page specific initialization
        console.log('[Init] Initializing generator page...');
  }

  async initTemplatesPage() {
    // Templates page specific initialization
        console.log('[Init] Initializing templates page...');
  }

  async initPricingPage() {
    // Pricing page specific initialization
        console.log('[Init] Initializing pricing page...');
  }

  setupGlobalEventListeners() {
        console.log('[Init] Setting up global event listeners...');
    
    // Handle visibility changes
    document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
    
    // Handle online/offline status
    window.addEventListener('online', this.handleOnlineStatus.bind(this));
    window.addEventListener('offline', this.handleOfflineStatus.bind(this));
    
    // Handle window resize
    window.addEventListener('resize', this.debounce(this.handleWindowResize.bind(this), 250));
    
    // Handle keyboard shortcuts
    document.addEventListener('keydown', this.handleKeyboardShortcuts.bind(this));
    
    // Handle error events
    window.addEventListener('error', this.handleGlobalError.bind(this));
    window.addEventListener('unhandledrejection', this.handleUnhandledRejection.bind(this));
    
    // Handle theme changes
    if (this.config.theme.enableSystemTheme) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', this.handleSystemThemeChange.bind(this));
    }
  }

  initErrorHandling() {
        console.log('[Init] Initializing error handling...');
    
    // Setup global error handlers
    this.setupErrorHandlers();
    
    // Setup error reporting
    this.setupErrorReporting();
  }

  setupErrorHandlers() {
    // Custom error handler for better debugging
    window.vizomErrorHandler = (error, context = {}) => {
            console.error('[VIZOM] Error:', error, context);
      
      // Track error in analytics
      if (this.modules.has('analytics')) {
        this.modules.get('analytics').trackError(error, context);
      }
      
      // Show user-friendly error message
      this.showUserError(error, context);
    };
  }

  setupErrorReporting() {
    // Setup error reporting to monitoring service
    if (this.config.environment === 'production') {
      // Initialize error reporting service (e.g., Sentry)
            console.log('[Init] Error reporting enabled');
    }
  }

  initPerformanceMonitoring() {
        console.log('[Init] Initializing performance monitoring...');
    
    // Monitor page load performance
    this.monitorPageLoadPerformance();
    
    // Monitor Core Web Vitals
    this.monitorCoreWebVitals();
    
    // Setup performance reporting
    this.setupPerformanceReporting();
  }

  monitorPageLoadPerformance() {
    if ('performance' in window) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const perfData = performance.getEntriesByType('navigation')[0];
          if (perfData) {
                console.log('[Init] Page Load Performance:', {
              domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
              loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
              totalTime: perfData.loadEventEnd - perfData.navigationStart
            });
          }
        }, 0);
      });
    }
  }

  monitorCoreWebVitals() {
    // Monitor LCP, FID, CLS
    if ('PerformanceObserver' in window) {
      // Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
                console.log('[Init] LCP:', lastEntry.renderTime || lastEntry.loadTime);
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      
      // First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
                console.log('[Init] FID:', entry.processingStart - entry.startTime);
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
      
      // Cumulative Layout Shift
      let clsScore = 0;
      const clsObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (!entry.hadRecentInput) {
            clsScore += entry.value;
          }
        });
                console.log('[Init] CLS:', clsScore);
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    }
  }

  setupPerformanceReporting() {
    // Report performance metrics to analytics
    if (this.modules.has('analytics') && this.config.analytics.enabled) {
      // Setup performance reporting
            console.log('[Init] Performance reporting enabled');
    }
  }

  // Event handlers
  handleVisibilityChange() {
    if (document.hidden) {
            console.log('[Init] Page hidden - pausing activities');
      this.pauseBackgroundActivities();
    } else {
            console.log('[Init] Page visible - resuming activities');
      this.resumeBackgroundActivities();
    }
  }

  handleOnlineStatus() {
        console.log('[Init] Connection restored');
    this.showConnectionStatus('online');
    this.syncOfflineData();
  }

  handleOfflineStatus() {
        console.log('[Init] Connection lost');
    this.showConnectionStatus('offline');
    this.enableOfflineMode();
  }

  handleWindowResize() {
    const isMobile = this.isMobileDevice();
    const wasMobile = this.previousMobileState;
    
    if (isMobile !== wasMobile) {
            console.log('[Init] Device type changed:', wasMobile ? 'desktop' : 'mobile', '->', isMobile ? 'mobile' : 'desktop');
      this.handleDeviceTypeChange(isMobile);
    }
    
    this.previousMobileState = isMobile;
  }

  handleKeyboardShortcuts(event) {
    // Global keyboard shortcuts
    if (event.ctrlKey || event.metaKey) {
      switch (event.key) {
        case 'k':
          event.preventDefault();
          this.openGlobalSearch();
          break;
        case '/':
          event.preventDefault();
          this.openHelpCenter();
          break;
        case 'b':
          event.preventDefault();
          this.toggleDarkMode();
          break;
      }
    }
    
    // Escape key handling
    if (event.key === 'Escape') {
      this.handleEscapeKey();
    }
  }

  handleGlobalError(event) {
    console.error('Global error:', event.error);
    if (window.vizomErrorHandler) {
      window.vizomErrorHandler(event.error, { type: 'global' });
    }
  }

  handleUnhandledRejection(event) {
    console.error('Unhandled promise rejection:', event.reason);
    if (window.vizomErrorHandler) {
      window.vizomErrorHandler(event.reason, { type: 'promise' });
    }
  }

  handleSystemThemeChange(event) {
    if (this.config.theme.enableSystemTheme) {
      const prefersDark = event.matches;
      this.applySystemTheme(prefersDark);
    }
  }

  // Utility methods
  isMobileDevice() {
    return window.innerWidth <= this.config.mobile.breakpoint || 
           /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  isTemplatesPage() {
    return window.location.pathname.includes('templates') || 
           document.body.classList.contains('templates-page');
  }

  isGeneratorPage() {
    return window.location.pathname.includes('generator') || 
           document.body.classList.contains('generator-page');
  }

  getCurrentPageName() {
    const path = window.location.pathname;
    const filename = path.split('/').pop() || 'index';
    
    if (filename.includes('generator')) return 'generator';
    if (filename.includes('templates')) return 'templates';
    if (filename.includes('pricing')) return 'pricing';
    if (filename.includes('index') || filename === '') return 'home';
    
    return filename.replace('.html', '');
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

  // State management
  pauseBackgroundActivities() {
    // Pause animations, timers, etc.
    document.body.classList.add('page-hidden');
  }

  resumeBackgroundActivities() {
    // Resume animations, timers, etc.
    document.body.classList.remove('page-hidden');
  }

  enableOfflineMode() {
    // Enable offline functionality
        console.log('[App] Offline mode enabled');
  }

  syncOfflineData() {
    // Sync data when coming back online
        console.log('[App] Syncing offline data');
  }

  handleDeviceTypeChange(isMobile) {
    // Handle mobile/desktop transitions
    if (isMobile) {
      document.body.classList.add('mobile-device');
    } else {
      document.body.classList.remove('mobile-device');
    }
    
    // Notify components of device type change
    this.notifyDeviceTypeChange(isMobile);
  }

  notifyDeviceTypeChange(isMobile) {
    // Notify all modules of device type change
    this.modules.forEach((module, name) => {
      if (module.handleDeviceTypeChange) {
        module.handleDeviceTypeChange(isMobile);
      }
    });
  }

  // UI methods
  showConnectionStatus(status) {
    const statusElement = document.getElementById('connection-status');
    if (statusElement) {
            statusElement.textContent = status === 'online' ? 'Online' : 'Offline';
      statusElement.className = status === 'online' ? 'online' : 'offline';
      
      // Auto-hide after 3 seconds
      setTimeout(() => {
        statusElement.textContent = '';
        statusElement.className = '';
      }, 3000);
    }
  }

  showUserError(error, context) {
    // Show user-friendly error message
    const loadingStates = this.modules.get('loadingStates');
    if (loadingStates) {
      loadingStates.showErrorState('main-content', error, {
        type: context.type || 'default',
        retryAction: context.retryAction
      });
    }
  }

  openGlobalSearch() {
    // Open global search modal
    const modalSystem = this.modules.get('modalSystem');
    if (modalSystem) {
      modalSystem.openSearchModal();
    }
  }

  openHelpCenter() {
    // Open help center
    const modalSystem = this.modules.get('modalSystem');
    if (modalSystem) {
      modalSystem.openHelpModal();
    }
  }

  toggleDarkMode() {
    // Toggle dark mode
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    this.applyTheme(newTheme);
  }

  applyTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('vizom-theme', theme);
    
    // Notify components of theme change
    this.notifyThemeChange(theme);
  }

  applySystemTheme(prefersDark) {
    const theme = prefersDark ? 'dark' : 'light';
    if (!localStorage.getItem('vizom-theme')) {
      this.applyTheme(theme);
    }
  }

  notifyThemeChange(theme) {
    // Notify all modules of theme change
    this.modules.forEach((module, name) => {
      if (module.handleThemeChange) {
        module.handleThemeChange(theme);
      }
    });
  }

  handleEscapeKey() {
    // Handle escape key (close modals, cancel operations, etc.)
    const modalSystem = this.modules.get('modalSystem');
    if (modalSystem) {
      modalSystem.closeAllModals();
    }
  }

  announceReady() {
    // Announce that the app is ready
    document.body.classList.add('app-ready');
    document.body.setAttribute('data-app-version', this.version);
    
    // Emit custom event
    const readyEvent = new CustomEvent('vizom:ready', {
      detail: { version: this.version, modules: Array.from(this.modules.keys()) }
    });
    document.dispatchEvent(readyEvent);
  }

  handleInitializationError(error) {
    // Handle initialization errors gracefully
    document.body.classList.add('app-error');
    
    // Show error page
    document.body.innerHTML = `
      <div class="viz-error-page">
        <div class="viz-error-container">
                    <h1>Application Error</h1>
          <p>VIZOM failed to initialize. Please refresh the page or contact support.</p>
          <button onclick="window.location.reload()" class="viz-button viz-button-primary">
            Refresh Page
          </button>
        </div>
      </div>
    `;
  }

  // Public API
  getModule(name) {
    return this.modules.get(name);
  }

  hasModule(name) {
    return this.modules.has(name);
  }

  getConfig() {
    return this.config;
  }

  getVersion() {
    return this.version;
  }

  isReady() {
    return this.isInitialized;
  }

  restart() {
    // Restart the application
        console.log('[VIZOM] Restarting...');
    this.isInitialized = false;
    this.modules.clear();
    this.init();
  }
}

/* =================================== */
// INITIALIZE APPLICATION
/* =================================== */
document.addEventListener('DOMContentLoaded', () => {
  window.vizomApp = new VizomApp();
});

/* =================================== */
// EXPORT FOR EXTERNAL USE
/* =================================== */
export { VizomApp };
export default VizomApp;

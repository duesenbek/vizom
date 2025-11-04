// Analytics and Usage Tracking for VIZOM
class Analytics {
  constructor() {
    this.events = [];
    this.sessionStart = Date.now();
    this.userId = null;
    this.sessionId = this.generateSessionId();
    this.init();
  }

  init() {
    this.trackPageView();
    this.trackUserInteractions();
    this.trackPerformance();
    this.trackFeatureUsage();
    this.setupErrorTracking();
    this.startSessionTracking();
  }

  generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Page Tracking
  trackPageView() {
    const pageData = {
      type: 'page_view',
      url: window.location.href,
      title: document.title,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userId: this.userId,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      screen: {
        width: screen.width,
        height: screen.height
      },
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    };

    this.trackEvent(pageData);
  }

  // User Interaction Tracking
  trackUserInteractions() {
    // Track clicks
    document.addEventListener('click', (e) => {
      const target = e.target.closest('[data-track]');
      if (target) {
        this.trackClick(target);
      }
    });

    // Track form submissions
    document.addEventListener('submit', (e) => {
      const form = e.target;
      if (form.dataset.track) {
        this.trackFormSubmission(form);
      }
    });

    // Track chart type selection
    document.addEventListener('click', (e) => {
      const chartCard = e.target.closest('.chart-type-card');
      if (chartCard) {
        this.trackChartTypeSelection(chartCard.dataset.type);
      }
    });

    // Track template usage
    document.addEventListener('click', (e) => {
      const templateBtn = e.target.closest('.quick-template-btn');
      if (templateBtn) {
        this.trackTemplateUsage(templateBtn.dataset.template);
      }
    });

    // Track export actions
    document.addEventListener('click', (e) => {
      if (e.target.id === 'download-chart') {
        this.trackExport('chart_download');
      }
      if (e.target.id === 'share-chart') {
        this.trackExport('chart_share');
      }
    });

    // Track project actions
    document.addEventListener('click', (e) => {
      if (e.target.id === 'save-project') {
        this.trackProjectAction('save');
      }
      if (e.target.id === 'load-projects') {
        this.trackProjectAction('load');
      }
    });
  }

  trackClick(element) {
    const eventData = {
      type: 'click',
      element: element.tagName.toLowerCase(),
      identifier: element.dataset.track,
      text: element.textContent?.trim(),
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userId: this.userId
    };

    this.trackEvent(eventData);
  }

  trackFormSubmission(form) {
    const formData = new FormData(form);
    const data = {};
    for (let [key, value] of formData.entries()) {
      // Sanitize sensitive data
      if (key.toLowerCase().includes('password') || key.toLowerCase().includes('token')) {
        data[key] = '[REDACTED]';
      } else {
        data[key] = value;
      }
    }

    const eventData = {
      type: 'form_submission',
      formId: form.id || form.dataset.track,
      data: data,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userId: this.userId
    };

    this.trackEvent(eventData);
  }

  trackChartTypeSelection(chartType) {
    const eventData = {
      type: 'chart_type_selection',
      chartType: chartType,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userId: this.userId
    };

    this.trackEvent(eventData);
  }

  trackTemplateUsage(templateId) {
    const eventData = {
      type: 'template_usage',
      templateId: templateId,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userId: this.userId
    };

    this.trackEvent(eventData);
  }

  trackExport(action) {
    const eventData = {
      type: 'export_action',
      action: action,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userId: this.userId
    };

    this.trackEvent(eventData);
  }

  trackProjectAction(action) {
    const eventData = {
      type: 'project_action',
      action: action,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userId: this.userId
    };

    this.trackEvent(eventData);
  }

  // Performance Tracking
  trackPerformance() {
    // Track page load time
    window.addEventListener('load', () => {
      const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
      
      const eventData = {
        type: 'performance',
        metric: 'page_load_time',
        value: loadTime,
        timestamp: Date.now(),
        sessionId: this.sessionId,
        userId: this.userId
      };

      this.trackEvent(eventData);
    });

    // Track Core Web Vitals
    this.trackCoreWebVitals();
  }

  trackCoreWebVitals() {
    // Largest Contentful Paint (LCP)
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      
      const eventData = {
        type: 'performance',
        metric: 'lcp',
        value: Math.round(lastEntry.startTime),
        timestamp: Date.now(),
        sessionId: this.sessionId,
        userId: this.userId
      };

      this.trackEvent(eventData);
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // First Input Delay (FID)
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry) => {
        const eventData = {
          type: 'performance',
          metric: 'fid',
          value: Math.round(entry.processingStart - entry.startTime),
          timestamp: Date.now(),
          sessionId: this.sessionId,
          userId: this.userId
        };

        this.trackEvent(eventData);
      });
    }).observe({ entryTypes: ['first-input'] });

    // Cumulative Layout Shift (CLS)
    let clsValue = 0;
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });

      const eventData = {
        type: 'performance',
        metric: 'cls',
        value: Math.round(clsValue * 1000) / 1000,
        timestamp: Date.now(),
        sessionId: this.sessionId,
        userId: this.userId
      };

      this.trackEvent(eventData);
    }).observe({ entryTypes: ['layout-shift'] });
  }

  // Feature Usage Tracking
  trackFeatureUsage() {
    // Track AI generation
    const originalGenerateWithAI = window.aiService?.generateWithCache;
    if (originalGenerateWithAI) {
      window.aiService.generateWithCache = async (...args) => {
        const startTime = Date.now();
        
        try {
          const result = await originalGenerateWithAI.apply(window.aiService, args);
          
          const eventData = {
            type: 'feature_usage',
            feature: 'ai_generation',
            success: true,
            duration: Date.now() - startTime,
            args: {
              promptLength: args[0]?.length || 0,
              chartType: args[1] || 'unknown'
            },
            timestamp: Date.now(),
            sessionId: this.sessionId,
            userId: this.userId
          };

          this.trackEvent(eventData);
          return result;
        } catch (error) {
          const eventData = {
            type: 'feature_usage',
            feature: 'ai_generation',
            success: false,
            duration: Date.now() - startTime,
            error: error.message,
            timestamp: Date.now(),
            sessionId: this.sessionId,
            userId: this.userId
          };

          this.trackEvent(eventData);
          throw error;
        }
      };
    }

    // Track data import
    const originalHandleFiles = window.dataImportExport?.handleFiles;
    if (originalHandleFiles) {
      window.dataImportExport.handleFiles = (...args) => {
        const eventData = {
          type: 'feature_usage',
          feature: 'data_import',
          fileCount: args[0]?.length || 0,
          timestamp: Date.now(),
          sessionId: this.sessionId,
          userId: this.userId
        };

        this.trackEvent(eventData);
        return originalHandleFiles.apply(window.dataImportExport, args);
      };
    }

    // Track customization panel usage
    document.getElementById('toggle-customization')?.addEventListener('click', () => {
      const eventData = {
        type: 'feature_usage',
        feature: 'customization_panel',
        action: 'open',
        timestamp: Date.now(),
        sessionId: this.sessionId,
        userId: this.userId
      };

      this.trackEvent(eventData);
    });
  }

  // Error Tracking
  setupErrorTracking() {
    window.addEventListener('error', (e) => {
      const eventData = {
        type: 'error',
        message: e.message,
        filename: e.filename,
        lineno: e.lineno,
        colno: e.colno,
        stack: e.error?.stack,
        timestamp: Date.now(),
        sessionId: this.sessionId,
        userId: this.userId
      };

      this.trackEvent(eventData);
    });

    window.addEventListener('unhandledrejection', (e) => {
      const eventData = {
        type: 'unhandled_rejection',
        reason: e.reason?.message || e.reason,
        timestamp: Date.now(),
        sessionId: this.sessionId,
        userId: this.userId
      };

      this.trackEvent(eventData);
    });
  }

  // Session Tracking
  startSessionTracking() {
    // Track session duration
    window.addEventListener('beforeunload', () => {
      const sessionDuration = Date.now() - this.sessionStart;
      
      const eventData = {
        type: 'session_end',
        duration: sessionDuration,
        timestamp: Date.now(),
        sessionId: this.sessionId,
        userId: this.userId
      };

      this.trackEvent(eventData, true); // Send immediately
    });

    // Track user engagement
    let lastActivity = Date.now();
    const updateLastActivity = () => {
      lastActivity = Date.now();
    };

    ['mousedown', 'keydown', 'scroll', 'touchstart'].forEach(event => {
      document.addEventListener(event, updateLastActivity, true);
    });

    // Check for idle time every minute
    setInterval(() => {
      const idleTime = Date.now() - lastActivity;
      if (idleTime > 5 * 60 * 1000) { // 5 minutes
        const eventData = {
          type: 'user_idle',
          idleTime: idleTime,
          timestamp: Date.now(),
          sessionId: this.sessionId,
          userId: this.userId
        };

        this.trackEvent(eventData);
      }
    }, 60000);
  }

  // Event Tracking
  trackEvent(eventData, immediate = false) {
    this.events.push(eventData);

    if (immediate || this.events.length >= 10) {
      this.flushEvents();
    }
  }

  async flushEvents() {
    if (this.events.length === 0) return;

    const eventsToSend = [...this.events];
    this.events = [];

    try {
      // Send to analytics endpoint
      await this.sendEvents(eventsToSend);
    } catch (error) {
      console.error('Failed to send analytics events:', error);
      // Retry logic or local storage fallback
      this.storeEventsLocally(eventsToSend);
    }
  }

  async sendEvents(events) {
    // In production, send to your analytics service
    // For now, we'll just log and store locally
    console.log('Analytics events:', events);
    
    // Example implementation with a real service:
    /*
    const response = await fetch('/api/analytics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ events })
    });

    if (!response.ok) {
      throw new Error('Failed to send events');
    }
    */
  }

  storeEventsLocally(events) {
    const stored = localStorage.getItem('vizom_analytics_events') || '[]';
    const allEvents = JSON.parse(stored);
    allEvents.push(...events);
    
    // Keep only last 100 events to avoid storage issues
    if (allEvents.length > 100) {
      allEvents.splice(0, allEvents.length - 100);
    }
    
    localStorage.setItem('vizom_analytics_events', JSON.stringify(allEvents));
  }

  // User Identification
  setUserId(userId) {
    this.userId = userId;
  }

  // Custom Event Tracking
  trackCustomEvent(eventName, properties = {}) {
    const eventData = {
      type: 'custom',
      eventName: eventName,
      properties: properties,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userId: this.userId
    };

    this.trackEvent(eventData);
  }

  // Analytics Dashboard Methods
  getAnalyticsSummary() {
    const stored = localStorage.getItem('vizom_analytics_events') || '[]';
    const events = JSON.parse(stored);
    
    const summary = {
      totalEvents: events.length,
      sessions: new Set(events.filter(e => e.type === 'page_view').map(e => e.sessionId)).size,
      chartTypes: this.getChartTypeUsage(events),
      features: this.getFeatureUsage(events),
      performance: this.getPerformanceMetrics(events),
      errors: events.filter(e => e.type === 'error').length
    };

    return summary;
  }

  getChartTypeUsage(events) {
    const chartEvents = events.filter(e => e.type === 'chart_type_selection');
    const usage = {};
    
    chartEvents.forEach(event => {
      usage[event.chartType] = (usage[event.chartType] || 0) + 1;
    });

    return usage;
  }

  getFeatureUsage(events) {
    const featureEvents = events.filter(e => e.type === 'feature_usage');
    const usage = {};
    
    featureEvents.forEach(event => {
      usage[event.feature] = (usage[event.feature] || 0) + 1;
    });

    return usage;
  }

  getPerformanceMetrics(events) {
    const perfEvents = events.filter(e => e.type === 'performance');
    const metrics = {};
    
    perfEvents.forEach(event => {
      if (!metrics[event.metric]) {
        metrics[event.metric] = [];
      }
      metrics[event.metric].push(event.value);
    });

    // Calculate averages
    Object.keys(metrics).forEach(metric => {
      const values = metrics[metric];
      metrics[metric] = {
        average: values.reduce((a, b) => a + b, 0) / values.length,
        min: Math.min(...values),
        max: Math.max(...values),
        count: values.length
      };
    });

    return metrics;
  }

  // Export Analytics Data
  exportAnalyticsData() {
    const summary = this.getAnalyticsSummary();
    const stored = localStorage.getItem('vizom_analytics_events') || '[]';
    const events = JSON.parse(stored);
    
    const exportData = {
      summary: summary,
      events: events,
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vizom-analytics-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
}

// Initialize Analytics
document.addEventListener('DOMContentLoaded', () => {
  window.analytics = new Analytics();
});

export { Analytics };

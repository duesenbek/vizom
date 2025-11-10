/**
 * Dynamic Import Manager for Code Splitting
 * Loads heavy modules only when needed
 */

class DynamicImportManager {
  constructor() {
    this.loadedModules = new Map();
    this.loadingPromises = new Map();
  }

  /**
   * Lazy load Chart.js with fallback
   */
  async loadChartJS() {
    const moduleName = 'chartjs';
    
    if (this.loadedModules.has(moduleName)) {
      return this.loadedModules.get(moduleName);
    }

    if (this.loadingPromises.has(moduleName)) {
      return this.loadingPromises.get(moduleName);
    }

    const loadPromise = this.importWithFallback(
      () => import('https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.js'),
      () => import('chart.js'),
      'Chart.js failed to load'
    );

    this.loadingPromises.set(moduleName, loadPromise);
    
    try {
      const module = await loadPromise;
      this.loadedModules.set(moduleName, module);
      return module;
    } finally {
      this.loadingPromises.delete(moduleName);
    }
  }

  /**
   * Lazy load export tools (PDF, PNG)
   */
  async loadExportTools() {
    const moduleName = 'export-tools';
    
    if (this.loadedModules.has(moduleName)) {
      return this.loadedModules.get(moduleName);
    }

    if (this.loadingPromises.has(moduleName)) {
      return this.loadingPromises.get(moduleName);
    }

    const loadPromise = Promise.all([
      this.importWithFallback(
        () => import('html2canvas'),
        () => import('https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js'),
        'html2canvas failed to load'
      ),
      this.importWithFallback(
        () => import('jspdf'),
        () => import('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'),
        'jsPDF failed to load'
      )
    ]);

    this.loadingPromises.set(moduleName, loadPromise);
    
    try {
      const [html2canvas, jsPDF] = await loadPromise;
      const modules = { html2canvas, jsPDF };
      this.loadedModules.set(moduleName, modules);
      return modules;
    } finally {
      this.loadingPromises.delete(moduleName);
    }
  }

  /**
   * Lazy load analytics module
   */
  async loadAnalytics() {
    const moduleName = 'analytics';
    
    if (this.loadedModules.has(moduleName)) {
      return this.loadedModules.get(moduleName);
    }

    if (this.loadingPromises.has(moduleName)) {
      return this.loadingPromises.get(moduleName);
    }

    const loadPromise = import('../analytics.js');
    this.loadingPromises.set(moduleName, loadPromise);
    
    try {
      const module = await loadPromise;
      this.loadedModules.set(moduleName, module);
      return module;
    } finally {
      this.loadingPromises.delete(moduleName);
    }
  }

  /**
   * Lazy load chart engine
   */
  async loadChartEngine() {
    const moduleName = 'chart-engine';
    
    if (this.loadedModules.has(moduleName)) {
      return this.loadedModules.get(moduleName);
    }

    if (this.loadingPromises.has(moduleName)) {
      return this.loadingPromises.get(moduleName);
    }

    const loadPromise = import('../chart-engine.js');
    this.loadingPromises.set(moduleName, loadPromise);
    
    try {
      const module = await loadPromise;
      this.loadedModules.set(moduleName, module);
      return module;
    } finally {
      this.loadingPromises.delete(moduleName);
    }
  }

  /**
   * Import with fallback and error handling
   */
  async importWithFallback(primaryImport, fallbackImport, errorMessage) {
    try {
      return await primaryImport();
    } catch (primaryError) {
      console.warn(`Primary import failed: ${primaryError.message}`);
      try {
        return await fallbackImport();
      } catch (fallbackError) {
        console.error(`Fallback import failed: ${fallbackError.message}`);
        throw new Error(errorMessage);
      }
    }
  }

  /**
   * Preload critical modules
   */
  async preloadCriticalModules() {
    // Preload Chart.js after initial render
    setTimeout(() => {
      this.loadChartJS().catch(console.warn);
    }, 1000);
  }

  /**
   * Get loading statistics
   */
  getStats() {
    return {
      loadedModules: Array.from(this.loadedModules.keys()),
      loadingModules: Array.from(this.loadingPromises.keys()),
      totalLoaded: this.loadedModules.size,
      totalLoading: this.loadingPromises.size
    };
  }

  /**
   * Clear cached modules (for development)
   */
  clearCache() {
    this.loadedModules.clear();
    this.loadingPromises.clear();
  }
}

// Export singleton instance
export const dynamicImports = new DynamicImportManager();

// Preload critical modules
dynamicImports.preloadCriticalModules();

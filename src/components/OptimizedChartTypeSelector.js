/**
 * Optimized ChartTypeSelector Component
 * High-performance chart type selector with 60+ chart types support
 * Uses virtual scrolling, debounced rendering, and optimized event handling
 */

import { getAllChartTypes, getCategories, searchChartTypes, getChartTypeById } from '../charts/chart-types.js';

export class OptimizedChartTypeSelector {
  constructor(container, options = {}) {
    this.container = typeof container === 'string' ? document.querySelector(container) : container;
    this.options = {
      onChange: options.onChange || (() => {}),
      selectedId: options.selectedId || null,
      aiRecommended: options.aiRecommended || null,
      i18n: options.i18n || this.defaultI18n(),
      mobileColumns: options.mobileColumns || 2,
      desktopColumns: options.desktopColumns || 4,
      virtualScrolling: options.virtualScrolling !== false,
      itemsPerRow: options.itemsPerRow || 4,
      rowHeight: options.rowHeight || 180,
      visibleRows: options.visibleRows || 4,
      debounceMs: options.debounceMs || 150,
      ...options
    };
    
    this.chartTypes = getAllChartTypes();
    this.categories = getCategories();
    this.filteredTypes = [...this.chartTypes];
    this.selectedId = this.options.selectedId;
    this.aiRecommended = this.options.aiRecommended;
    this.activeCategory = 'all';
    
    // Performance optimization properties
    this.renderTimeout = null;
    this.searchTimeout = null;
    this.visibleRange = { start: 0, end: 0 };
    this.scrollElement = null;
    this.isScrolling = false;
    this.lastClickTime = 0;
    this.clickDebounceMs = 100;
    
    // Memoization cache
    this.memoCache = new Map();
    this.lastSearchQuery = '';
    
    this.init();
  }
  
  defaultI18n() {
    return {
      searchPlaceholder: 'Search chart types...',
      allCategories: 'All',
      noResults: 'No chart types found',
      useCase: 'Use case',
      examples: 'Examples',
      aiRecommended: 'AI Recommended',
      categories: {
        basic: 'Basic Charts',
        composition: 'Composition',
        comparison: 'Comparison',
        distribution: 'Distribution',
        advanced: 'Advanced',
        custom: 'Custom'
      }
    };
  }

  /**
   * Initialize the selector with performance optimizations
   */
  init() {
    this.setupPerformanceOptimizations();
    this.render();
    this.bindEvents();
  }

  /**
   * Setup performance optimizations
   */
  setupPerformanceOptimizations() {
    // Use requestAnimationFrame for smooth rendering
    this.raf = window.requestAnimationFrame || window.webkitRequestAnimationFrame;
    
    // Setup Intersection Observer for lazy loading
    if (this.options.virtualScrolling && 'IntersectionObserver' in window) {
      this.setupIntersectionObserver();
    }
    
    // Debounced search
    this.debouncedSearch = this.debounce(this.handleSearch.bind(this), this.options.debounceMs);
    
    // Throttled scroll handler
    this.throttledScroll = this.throttle(this.handleVirtualScroll.bind(this), 16); // 60fps
  }

  /**
   * Setup Intersection Observer for virtual scrolling
   */
  setupIntersectionObserver() {
    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.dataset.index);
            this.renderChartTypeItem(entry.target, this.filteredTypes[index]);
            this.intersectionObserver.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '50px' }
    );
  }

  /**
   * Debounce function for performance
   */
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

  /**
   * Throttle function for scroll performance
   */
  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  /**
   * Memoized chart type rendering
   */
  memoizeChartType(chartType) {
    const cacheKey = `${chartType.id}-${this.selectedId}-${this.aiRecommended}`;
    
    if (this.memoCache.has(cacheKey)) {
      return this.memoCache.get(cacheKey);
    }

    const html = this.renderChartTypeHTML(chartType);
    this.memoCache.set(cacheKey, html);
    
    // Limit cache size
    if (this.memoCache.size > 100) {
      const firstKey = this.memoCache.keys().next().value;
      this.memoCache.delete(firstKey);
    }

    return html;
  }

  /**
   * Update AI recommendation efficiently
   * @param {string} typeId - Recommended chart type ID
   */
  updateAIRecommendation(typeId) {
    if (this.aiRecommended === typeId) return;
    
    this.aiRecommended = typeId;
    
    // Clear memo cache for affected items
    this.memoCache.clear();
    
    // Use requestAnimationFrame for smooth update
    this.raf(() => {
      this.highlightAIRecommendation();
    });
  }

  /**
   * Optimized render method
   */
  render() {
    // Cancel previous render timeout
    if (this.renderTimeout) {
      clearTimeout(this.renderTimeout);
    }

    // Debounce rendering for performance
    this.renderTimeout = setTimeout(() => {
      this.performRender();
    }, 16); // 60fps
  }

  /**
   * Perform actual rendering
   */
  performRender() {
    const t = this.options.i18n;
    
    this.container.innerHTML = `
      <div class="optimized-chart-type-selector" role="region" aria-label="Chart type selector">
        <!-- Search -->
        <div class="mb-6">
          <div class="relative">
            <input
              type="search"
              placeholder="${t.searchPlaceholder}"
              class="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              id="chart-search"
            >
            <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          </div>
        </div>

        <!-- Category Tabs -->
        <div class="mb-6">
          <div class="flex flex-wrap gap-2" role="tablist" id="category-tabs">
            <button class="category-tab active" data-category="all" role="tab" aria-selected="true">
              ${t.allCategories}
            </button>
            ${this.categories.map(cat => `
              <button class="category-tab" data-category="${cat.id}" role="tab" aria-selected="false">
                <i class="${cat.icon} mr-1"></i>
                ${t.categories[cat.id] || cat.name}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Chart Types Grid -->
        <div class="chart-types-container">
          ${this.options.virtualScrolling ? this.renderVirtualGrid() : this.renderStandardGrid()}
        </div>

        <!-- No Results -->
        <div class="no-results hidden text-center py-8 text-gray-500" id="no-results">
          <i class="fas fa-search text-4xl mb-2"></i>
          <p>${t.noResults}</p>
        </div>

        <!-- Performance Info (dev mode) -->
        ${this.isDevMode() ? `
          <div class="performance-info text-xs text-gray-500 mt-4 p-2 bg-gray-50 rounded">
            <span>Chart types: ${this.filteredTypes.length}</span> | 
            <span>Selected: ${this.selectedId}</span> |
            <span>AI Recommended: ${this.aiRecommended}</span>
          </div>
        ` : ''}
      </div>
    `;

    // Post-render optimizations
    this.raf(() => {
      this.highlightAIRecommendation();
      this.setupVirtualScrolling();
    });
  }

  /**
   * Render virtual scrolling grid
   */
  renderVirtualGrid() {
    const containerHeight = this.options.visibleRows * this.options.rowHeight;
    const totalHeight = Math.ceil(this.filteredTypes.length / this.options.itemsPerRow) * this.options.rowHeight;
    
    return `
      <div class="virtual-scroll-wrapper" style="height: ${containerHeight}px; overflow-y: auto;">
        <div class="virtual-scroll-content" style="height: ${totalHeight}px; position: relative;">
          <div class="chart-types-grid grid grid-cols-${this.options.mobileColumns} md:grid-cols-${this.options.desktopColumns} gap-4" 
               style="position: absolute; top: 0; left: 0; right: 0;">
            ${this.renderVisibleItems()}
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Render standard grid (non-virtual)
   */
  renderStandardGrid() {
    return `
      <div class="chart-types-grid grid grid-cols-${this.options.mobileColumns} md:grid-cols-${this.options.desktopColumns} gap-4" role="grid" id="chart-grid">
        ${this.filteredTypes.map(chartType => this.memoizeChartType(chartType)).join('')}
      </div>
    `;
  }

  /**
   * Render only visible items for virtual scrolling
   */
  renderVisibleItems() {
    const { start, end } = this.calculateVisibleRange();
    const visibleItems = this.filteredTypes.slice(start, end);
    
    // Add placeholder items for virtual scrolling
    const placeholdersBefore = Array(start).fill('').map((_, index) => 
      `<div class="chart-type-placeholder" style="height: ${this.options.rowHeight}px;"></div>`
    ).join('');

    const placeholdersAfter = Array(this.filteredTypes.length - end).fill('').map((_, index) => 
      `<div class="chart-type-placeholder" style="height: ${this.options.rowHeight}px;"></div>`
    ).join('');

    return placeholdersBefore + 
           visibleItems.map((chartType, index) => 
             this.renderChartTypeItem(chartType, start + index)
           ).join('') + 
           placeholdersAfter;
  }

  /**
   * Calculate visible range for virtual scrolling
   */
  calculateVisibleRange() {
    if (!this.scrollElement) {
      return { start: 0, end: Math.min(this.options.visibleRows * this.options.itemsPerRow, this.filteredTypes.length) };
    }

    const scrollTop = this.scrollElement.scrollTop;
    const containerHeight = this.scrollElement.clientHeight;
    
    const startRow = Math.floor(scrollTop / this.options.rowHeight);
    const endRow = Math.ceil((scrollTop + containerHeight) / this.options.rowHeight);
    
    const start = Math.max(0, startRow * this.options.itemsPerRow);
    const end = Math.min(this.filteredTypes.length, endRow * this.options.itemsPerRow);
    
    return { start, end };
  }

  /**
   * Render individual chart type item
   */
  renderChartTypeItem(chartType, index) {
    const isSelected = this.selectedId === chartType.id;
    const isAIRecommended = this.aiRecommended === chartType.id;
    
    return `
      <div class="chart-type-tile relative bg-white border-2 border-gray-200 rounded-lg p-4 cursor-pointer 
                  hover:border-blue-400 hover:shadow-lg transition-all duration-200 group
                  ${isSelected ? 'ring-2 ring-blue-600 bg-blue-50' : ''}"
           data-chart-type="${chartType.id}"
           data-index="${index}"
           role="gridcell"
           tabindex="0"
           aria-label="${chartType.name} - ${chartType.description}"
           style="height: ${this.options.rowHeight}px;">
        
        <!-- AI Recommendation Badge -->
        ${isAIRecommended ? `
          <div class="ai-recommendation-badge absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 z-10">
            <i class="fas fa-robot text-xs"></i> AI
          </div>
        ` : ''}
        
        <!-- Chart Content -->
        <div class="text-center h-full flex flex-col justify-between">
          <div>
            <div class="chart-icon text-3xl mb-3 group-hover:scale-110 transition-transform">
              ${chartType.icon}
            </div>
            <div class="chart-name font-semibold text-gray-900 mb-2">
              ${chartType.name}
            </div>
            <div class="chart-description text-sm text-gray-600 line-clamp-3">
              ${chartType.shortDescription || chartType.description}
            </div>
          </div>
        </div>

        <!-- Selection Indicator -->
        <div class="selection-indicator absolute top-2 left-2 w-6 h-6 rounded-full border-2 border-blue-600 bg-blue-600 text-white flex items-center justify-center ${!isSelected ? 'hidden' : ''}">
          <i class="fas fa-check text-xs"></i>
        </div>
      </div>
    `;
  }

  /**
   * Render chart type HTML (memoized)
   */
  renderChartTypeHTML(chartType) {
    const isSelected = this.selectedId === chartType.id;
    const isAIRecommended = this.aiRecommended === chartType.id;
    
    return `
      <div class="chart-type-tile relative bg-white border-2 border-gray-200 rounded-lg p-4 cursor-pointer 
                  hover:border-blue-400 hover:shadow-lg transition-all duration-200 group
                  ${isSelected ? 'ring-2 ring-blue-600 bg-blue-50' : ''}"
           data-chart-type="${chartType.id}"
           role="gridcell"
           tabindex="0"
           aria-label="${chartType.name} - ${chartType.description}">
        
        <!-- AI Recommendation Badge -->
        ${isAIRecommended ? `
          <div class="ai-recommendation-badge absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 z-10">
            <i class="fas fa-robot text-xs"></i> AI
          </div>
        ` : ''}
        
        <!-- Chart Content -->
        <div class="text-center">
          <div class="chart-icon text-3xl mb-3 group-hover:scale-110 transition-transform">
            ${chartType.icon}
          </div>
          <div class="chart-name font-semibold text-gray-900 mb-2">
            ${chartType.name}
          </div>
          <div class="chart-description text-sm text-gray-600 line-clamp-3">
            ${chartType.shortDescription || chartType.description}
          </div>
        </div>

        <!-- Selection Indicator -->
        <div class="selection-indicator absolute top-2 left-2 w-6 h-6 rounded-full border-2 border-blue-600 bg-blue-600 text-white flex items-center justify-center ${!isSelected ? 'hidden' : ''}">
          <i class="fas fa-check text-xs"></i>
        </div>
      </div>
    `;
  }

  /**
   * Setup virtual scrolling
   */
  setupVirtualScrolling() {
    if (!this.options.virtualScrolling) return;

    this.scrollElement = this.container.querySelector('.virtual-scroll-wrapper');
    if (this.scrollElement) {
      this.scrollElement.addEventListener('scroll', this.throttledScroll, { passive: true });
    }
  }

  /**
   * Handle virtual scroll
   */
  handleVirtualScroll() {
    if (this.isScrolling) return;
    
    this.isScrolling = true;
    this.raf(() => {
      this.updateVisibleItems();
      this.isScrolling = false;
    });
  }

  /**
   * Update visible items during scroll
   */
  updateVisibleItems() {
    const grid = this.container.querySelector('.chart-types-grid');
    if (!grid) return;

    const { start, end } = this.calculateVisibleRange();
    if (start === this.visibleRange.start && end === this.visibleRange.end) return;

    this.visibleRange = { start, end };
    
    // Re-render visible items
    const visibleItems = this.filteredTypes.slice(start, end);
    const html = visibleItems.map((chartType, index) => 
      this.renderChartTypeItem(chartType, start + index)
    ).join('');
    
    grid.innerHTML = html;
    this.highlightAIRecommendation();
  }

  /**
   * Highlight AI recommendation efficiently
   */
  highlightAIRecommendation() {
    if (!this.aiRecommended) return;

    const recommendedTile = this.container.querySelector(`[data-chart-type="${this.aiRecommended}"]`);
    if (recommendedTile) {
      // Add highlight effect if not already present
      if (!recommendedTile.classList.contains('ai-recommended')) {
        recommendedTile.classList.add('ai-recommended', 'ring-2', 'ring-blue-500', 'ring-offset-2');
      }
    }
  }
  
  /**
   * Optimized event binding
   */
  bindEvents() {
    // Search functionality with debouncing
    const searchInput = this.container.querySelector('#chart-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.debouncedSearch(e.target.value);
      });
    }

    // Category tabs with event delegation
    const categoryTabsContainer = this.container.querySelector('#category-tabs');
    if (categoryTabsContainer) {
      categoryTabsContainer.addEventListener('click', (e) => {
        const tab = e.target.closest('.category-tab');
        if (tab) {
          this.handleCategoryChange(tab.dataset.category);
        }
      });
    }

    // Chart type selection with debounced clicks
    const chartContainer = this.container.querySelector('.chart-types-container');
    if (chartContainer) {
      chartContainer.addEventListener('click', (e) => {
        const tile = e.target.closest('.chart-type-tile');
        if (tile) {
          this.handleDebouncedClick(tile.dataset.chartType);
        }
      });

      // Keyboard navigation
      chartContainer.addEventListener('keydown', (e) => {
        if (e.target.classList.contains('chart-type-tile') && 
            (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          this.handleDebouncedClick(e.target.dataset.chartType);
        }
      });
    }
  }

  /**
   * Handle debounced chart type selection
   */
  handleDebouncedClick(typeId) {
    const now = Date.now();
    if (now - this.lastClickTime < this.clickDebounceMs) {
      return; // Ignore rapid clicks
    }
    
    this.lastClickTime = now;
    this.handleChartTypeSelection(typeId);
  }

  /**
   * Handle search with caching
   */
  handleSearch(query) {
    const trimmedQuery = query.trim().toLowerCase();
    
    // Use cached results if same query
    if (trimmedQuery === this.lastSearchQuery) return;
    this.lastSearchQuery = trimmedQuery;
    
    if (trimmedQuery === '') {
      this.filteredTypes = [...this.chartTypes];
    } else {
      this.filteredTypes = searchChartTypes(trimmedQuery);
    }

    this.updateGrid();
  }

  /**
   * Handle category change
   */
  handleCategoryChange(categoryId) {
    this.activeCategory = categoryId;
    
    // Update tab states
    const tabs = this.container.querySelectorAll('.category-tab');
    tabs.forEach(tab => {
      const isActive = tab.dataset.category === categoryId;
      tab.classList.toggle('active', isActive);
      tab.setAttribute('aria-selected', isActive);
    });

    // Filter chart types
    if (categoryId === 'all') {
      this.filteredTypes = [...this.chartTypes];
    } else {
      this.filteredTypes = this.chartTypes.filter(type => type.category === categoryId);
    }

    this.updateGrid();
  }

  /**
   * Handle chart type selection with performance tracking
   */
  handleChartTypeSelection(typeId) {
    const startTime = performance.now();
    
    // Update selection state
    this.selectedId = typeId;
    
    // Update UI efficiently
    this.updateSelectionUI(typeId);
    
    // Track selection
    this.trackSelection(typeId);
    
    // Call onChange callback
    this.options.onChange(typeId);
    
    // Log performance
    const endTime = performance.now();
    if (this.isDevMode()) {
      console.log(`Chart type selection took ${endTime - startTime}ms`);
    }
  }

  /**
   * Update selection UI efficiently
   */
  updateSelectionUI(typeId) {
    const tiles = this.container.querySelectorAll('.chart-type-tile');
    
    tiles.forEach(tile => {
      const isSelected = tile.dataset.chartType === typeId;
      const indicator = tile.querySelector('.selection-indicator');
      
      if (isSelected) {
        tile.classList.add('ring-2', 'ring-blue-600', 'bg-blue-50');
        if (indicator) indicator.classList.remove('hidden');
      } else {
        tile.classList.remove('ring-2', 'ring-blue-600', 'bg-blue-50');
        if (indicator) indicator.classList.add('hidden');
      }
    });
  }

  /**
   * Update grid efficiently
   */
  updateGrid() {
    const grid = this.container.querySelector('.chart-types-grid');
    const noResults = this.container.querySelector('#no-results');
    
    if (this.filteredTypes.length === 0) {
      if (grid) grid.classList.add('hidden');
      if (noResults) noResults.classList.remove('hidden');
    } else {
      if (grid) grid.classList.remove('hidden');
      if (noResults) noResults.classList.add('hidden');
      
      if (this.options.virtualScrolling) {
        this.updateVisibleItems();
      } else {
        grid.innerHTML = this.filteredTypes.map(chartType => this.memoizeChartType(chartType)).join('');
        this.highlightAIRecommendation();
      }
    }
  }

  /**
   * Track selection for analytics
   */
  trackSelection(typeId) {
    try {
      const chartType = getChartTypeById(typeId);
      const selectionData = {
        chart_type: typeId,
        chart_name: chartType.name,
        chart_category: chartType.category,
        selection_source: this.aiRecommended === typeId ? 'ai_recommendation' : 'manual_selection',
        ai_recommended: this.aiRecommended,
        search_query: this.container.querySelector('#chart-search').value,
        active_category: this.activeCategory,
        filtered_count: this.filteredTypes.length,
        performance_mode: this.options.virtualScrolling ? 'virtual' : 'standard',
        timestamp: new Date().toISOString()
      };

      // Send to analytics if available
      if (typeof trackEvent === 'function') {
        trackEvent('chart_type_selected', selectionData);
      }

      if (this.isDevMode()) {
        console.log('Chart type selected:', selectionData);
      }
    } catch (error) {
      console.warn('Failed to track selection:', error);
    }
  }

  /**
   * Check if in development mode
   */
  isDevMode() {
    return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  }

  /**
   * Performance monitoring
   */
  getPerformanceMetrics() {
    return {
      totalChartTypes: this.chartTypes.length,
      filteredChartTypes: this.filteredTypes.length,
      cacheSize: this.memoCache.size,
      isVirtualScrolling: this.options.virtualScrolling,
      visibleRange: this.visibleRange,
      lastRenderTime: this.lastRenderTime || 0
    };
  }

  /**
   * Get current selection
   */
  getSelection() {
    return {
      selectedId: this.selectedId,
      aiRecommended: this.aiRecommended,
      isAIRecommendation: this.selectedId === this.aiRecommended,
      activeCategory: this.activeCategory,
      filteredCount: this.filteredTypes.length,
      performanceMetrics: this.getPerformanceMetrics()
    };
  }

  /**
   * Set selected chart type
   */
  setSelected(typeId) {
    this.selectedId = typeId;
    this.handleChartTypeSelection(typeId);
  }

  /**
   * Clear AI recommendation
   */
  clearAIRecommendation() {
    this.aiRecommended = null;
    this.memoCache.clear();
    
    const badges = this.container.querySelectorAll('.ai-recommendation-badge');
    badges.forEach(badge => badge.remove());
    
    const recommendedTiles = this.container.querySelectorAll('.ai-recommended');
    recommendedTiles.forEach(tile => {
      tile.classList.remove('ai-recommended', 'ring-2', 'ring-blue-500', 'ring-offset-2');
    });
  }

  /**
   * Destroy component and cleanup
   */
  destroy() {
    // Clear timeouts
    if (this.renderTimeout) clearTimeout(this.renderTimeout);
    if (this.searchTimeout) clearTimeout(this.searchTimeout);
    
    // Disconnect observers
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
    
    // Remove event listeners
    if (this.scrollElement) {
      this.scrollElement.removeEventListener('scroll', this.throttledScroll);
    }
    
    // Clear cache
    this.memoCache.clear();
    
    // Clear container
    this.container.innerHTML = '';
  }
}

// CSS for Optimized ChartTypeSelector
const optimizedSelectorCSS = `
.optimized-chart-type-selector {
  --primary-color: #1872D9;
  --hover-color: #2563EB;
  --success-color: #10B981;
  --text-primary: #003466;
  --text-secondary: #123472;
  --border-color: #E2E8F0;
  --bg-hover: #EEF4FF;
}

.category-tab {
  @apply px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium transition-all;
  background-color: white;
  color: var(--text-secondary);
}

.category-tab:hover {
  background-color: var(--bg-hover);
  border-color: var(--primary-color);
  color: var(--text-primary);
}

.category-tab.active {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
}

.chart-type-tile {
  position: relative;
  overflow: hidden;
  will-change: transform;
}

.chart-type-tile:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 52, 102, 0.15);
}

.ai-recommended {
  border-color: var(--primary-color) !important;
  background: linear-gradient(135deg, rgba(24, 114, 217, 0.05) 0%, rgba(33, 150, 243, 0.05) 100%);
}

.ai-recommendation-badge {
  animation: pulse 2s infinite;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Virtual scrolling optimizations */
.virtual-scroll-wrapper {
  scrollbar-width: thin;
  scrollbar-color: var(--primary-color) #f1f1f1;
}

.virtual-scroll-wrapper::-webkit-scrollbar {
  width: 6px;
}

.virtual-scroll-wrapper::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.virtual-scroll-wrapper::-webkit-scrollbar-thumb {
  background: var(--primary-color);
  border-radius: 3px;
}

.chart-type-placeholder {
  visibility: hidden;
}

/* Performance optimizations */
.chart-types-grid {
  contain: layout style paint;
}

.chart-type-tile {
  contain: layout style paint;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.9; transform: scale(1.05); }
}

/* Mobile responsive adjustments */
@media (max-width: 768px) {
  .chart-type-tile {
    height: 160px !important;
  }
  
  .category-tab {
    @apply px-3 py-1.5 text-xs;
  }
  
  .virtual-scroll-wrapper {
    scrollbar-width: none;
  }
  
  .virtual-scroll-wrapper::-webkit-scrollbar {
    display: none;
  }
}

/* Focus styles for accessibility */
.chart-type-tile:focus-visible {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

.category-tab:focus-visible {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

/* Reduced motion for accessibility */
@media (prefers-reduced-motion: reduce) {
  .chart-type-tile,
  .ai-recommendation-badge,
  .category-tab {
    animation: none;
    transition: none;
  }
}
`;

// Inject CSS if not already present
if (!document.querySelector('#optimized-chart-selector-css')) {
  const style = document.createElement('style');
  style.id = 'optimized-chart-selector-css';
  style.textContent = optimizedSelectorCSS;
  document.head.appendChild(style);
}

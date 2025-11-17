/**
 * Enhanced ChartTypeSelector Component
 * Interactive chart type picker with search, categories, tooltips, and AI recommendation highlights
 */

import { getAllChartTypes, getCategories, searchChartTypes, getChartTypeById } from '../charts/chart-types.js';

export class EnhancedChartTypeSelector {
  constructor(container, options = {}) {
    this.container = typeof container === 'string' ? document.querySelector(container) : container;
    this.options = {
      onChange: options.onChange || (() => {}),
      selectedId: options.selectedId || null,
      aiRecommended: options.aiRecommended || null,
      i18n: options.i18n || this.defaultI18n(),
      mobileColumns: options.mobileColumns || 2,
      desktopColumns: options.desktopColumns || 4,
      ...options
    };
    
    this.chartTypes = getAllChartTypes();
    this.categories = getCategories();
    this.filteredTypes = [...this.chartTypes];
    this.selectedId = this.options.selectedId;
    this.aiRecommended = this.options.aiRecommended;
    this.activeCategory = 'all';
    
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
  
  init() {
    this.render();
    this.bindEvents();
  }

  /**
   * Update AI recommendation
   * @param {string} typeId - Recommended chart type ID
   */
  updateAIRecommendation(typeId) {
    this.aiRecommended = typeId;
    this.render();
    this.highlightAIRecommendation();
  }

  /**
   * Highlight AI recommended chart type
   */
  highlightAIRecommendation() {
    if (!this.aiRecommended) return;

    const recommendedTile = this.container.querySelector(`[data-chart-type="${this.aiRecommended}"]`);
    if (recommendedTile) {
      // Add AI recommendation badge
      const badge = document.createElement('div');
      badge.className = 'ai-recommendation-badge absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 z-10';
      badge.innerHTML = '<i class="fas fa-robot text-xs"></i> AI';
      recommendedTile.appendChild(badge);

      // Add highlight effect
      recommendedTile.classList.add('ai-recommended', 'ring-2', 'ring-blue-500', 'ring-offset-2');
    }
  }
  
  render() {
    const t = this.options.i18n;
    
    this.container.innerHTML = `
      <div class="enhanced-chart-type-selector" role="region" aria-label="Chart type selector">
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
        <div class="chart-types-grid grid grid-cols-${this.options.mobileColumns} md:grid-cols-${this.options.desktopColumns} gap-4" role="grid" id="chart-grid">
          ${this.renderChartTypes()}
        </div>

        <!-- No Results -->
        <div class="no-results hidden text-center py-8 text-gray-500" id="no-results">
          <i class="fas fa-search text-4xl mb-2"></i>
          <p>${t.noResults}</p>
        </div>
      </div>
    `;

    // Highlight AI recommendation after render
    setTimeout(() => this.highlightAIRecommendation(), 100);
  }

  renderChartTypes() {
    const t = this.options.i18n;
    
    return this.filteredTypes.map(chartType => `
      <div class="chart-type-tile relative bg-white border-2 border-gray-200 rounded-lg p-4 cursor-pointer 
                  hover:border-blue-400 hover:shadow-lg transition-all duration-200 group"
           data-chart-type="${chartType.id}"
           role="gridcell"
           tabindex="0"
           aria-label="${chartType.name} - ${chartType.description}">
        
        <!-- AI Recommendation Badge (added dynamically) -->
        
        <!-- Chart Content -->
        <div class="text-center">
          <div class="chart-icon text-3xl mb-3 group-hover:scale-110 transition-transform">
            <i class="fa-solid ${chartType.icon && chartType.icon.includes('fa-') ? chartType.icon : 'fa-chart-column'}"></i>
          </div>
          <div class="chart-name font-semibold text-gray-900 mb-2">
            ${chartType.name}
          </div>
          <div class="chart-description text-sm text-gray-600 line-clamp-3">
            ${chartType.shortDescription || chartType.description}
          </div>
        </div>

        <!-- Hover Info -->
        <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity">
          <div class="text-white text-xs">
            <div class="font-medium mb-1">${t.useCase}:</div>
            <div class="line-clamp-2">${chartType.useCases[0] || 'Data visualization'}</div>
          </div>
        </div>

        <!-- Selection Indicator -->
        <div class="selection-indicator absolute top-2 left-2 w-6 h-6 rounded-full border-2 border-blue-600 bg-blue-600 text-white flex items-center justify-center hidden">
          <i class="fas fa-check text-xs"></i>
        </div>
      </div>
    `).join('');
  }
  
  bindEvents() {
    // Search functionality
    const searchInput = this.container.querySelector('#chart-search');
    searchInput.addEventListener('input', (e) => {
      this.handleSearch(e.target.value);
    });

    // Category tabs
    const categoryTabs = this.container.querySelectorAll('.category-tab');
    categoryTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        this.handleCategoryChange(tab.dataset.category);
      });
    });

    // Chart type selection
    const chartTiles = this.container.querySelectorAll('.chart-type-tile');
    chartTiles.forEach(tile => {
      tile.addEventListener('click', () => {
        this.handleChartTypeSelection(tile.dataset.chartType);
      });

      // Keyboard navigation
      tile.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.handleChartTypeSelection(tile.dataset.chartType);
        }
      });

      // Tooltip on hover
      tile.addEventListener('mouseenter', (e) => {
        this.showTooltip(e, tile.dataset.chartType);
      });

      tile.addEventListener('mouseleave', () => {
        this.hideTooltip();
      });
    });
  }

  handleSearch(query) {
    const trimmedQuery = query.trim().toLowerCase();
    
    if (trimmedQuery === '') {
      this.filteredTypes = [...this.chartTypes];
    } else {
      this.filteredTypes = searchChartTypes(trimmedQuery);
    }

    this.updateGrid();
  }

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

  handleChartTypeSelection(typeId) {
    // Update selection state
    this.selectedId = typeId;
    
    // Update UI
    const tiles = this.container.querySelectorAll('.chart-type-tile');
    tiles.forEach(tile => {
      const isSelected = tile.dataset.chartType === typeId;
      const indicator = tile.querySelector('.selection-indicator');
      
      if (isSelected) {
        tile.classList.add('ring-2', 'ring-blue-600', 'bg-blue-50');
        indicator.classList.remove('hidden');
      } else {
        tile.classList.remove('ring-2', 'ring-blue-600', 'bg-blue-50');
        indicator.classList.add('hidden');
      }
    });

    // Track selection
    this.trackSelection(typeId);

    // Call onChange callback
    this.options.onChange(typeId);
  }

  updateGrid() {
    const grid = this.container.querySelector('#chart-grid');
    const noResults = this.container.querySelector('#no-results');
    
    if (this.filteredTypes.length === 0) {
      grid.classList.add('hidden');
      noResults.classList.remove('hidden');
    } else {
      grid.classList.remove('hidden');
      noResults.classList.add('hidden');
      grid.innerHTML = this.renderChartTypes();
      
      // Re-bind events for new tiles
      this.bindTileEvents();
      
      // Re-highlight AI recommendation
      this.highlightAIRecommendation();
    }
  }

  bindTileEvents() {
    const chartTiles = this.container.querySelectorAll('.chart-type-tile');
    chartTiles.forEach(tile => {
      tile.addEventListener('click', () => {
        this.handleChartTypeSelection(tile.dataset.chartType);
      });

      tile.addEventListener('mouseenter', (e) => {
        this.showTooltip(e, tile.dataset.chartType);
      });

      tile.addEventListener('mouseleave', () => {
        this.hideTooltip();
      });
    });
  }

  showTooltip(event, typeId) {
    const chartType = getChartTypeById(typeId);
    if (!chartType) return;

    // Remove existing tooltip
    this.hideTooltip();

    const tooltip = document.createElement('div');
    tooltip.className = 'chart-tooltip absolute z-50 bg-gray-900 text-white p-4 rounded-lg shadow-xl max-w-sm';
    tooltip.style.left = `${event.pageX + 10}px`;
    tooltip.style.top = `${event.pageY - 10}px`;

    tooltip.innerHTML = `
      <div class="font-semibold mb-2">${chartType.name}</div>
      <div class="text-sm text-gray-300 mb-3">${chartType.description}</div>
      
      <div class="text-xs space-y-2">
        <div>
          <div class="font-medium text-blue-400 mb-1">Use Cases:</div>
          <ul class="list-disc list-inside space-y-1 text-gray-300">
            ${chartType.useCases.slice(0, 3).map(useCase => `<li>${useCase}</li>`).join('')}
          </ul>
        </div>
        
        <div>
          <div class="font-medium text-blue-400 mb-1">Examples:</div>
          <div class="text-gray-300">${chartType.examples.slice(0, 2).join(', ')}</div>
        </div>
        
        <div class="pt-2 border-t border-gray-700">
          <span class="text-gray-400">Difficulty:</span>
          <span class="ml-2 px-2 py-1 rounded text-xs ${
            chartType.difficulty === 'beginner' ? 'bg-green-600' :
            chartType.difficulty === 'intermediate' ? 'bg-yellow-600' :
            'bg-red-600'
          }">${chartType.difficulty}</span>
        </div>
      </div>
    `;

    document.body.appendChild(tooltip);
    this.currentTooltip = tooltip;

    // Auto-position to stay in viewport
    setTimeout(() => {
      const rect = tooltip.getBoundingClientRect();
      if (rect.right > window.innerWidth) {
        tooltip.style.left = `${event.pageX - rect.width - 10}px`;
      }
      if (rect.bottom > window.innerHeight) {
        tooltip.style.top = `${event.pageY - rect.height - 10}px`;
      }
    }, 10);
  }

  hideTooltip() {
    if (this.currentTooltip) {
      this.currentTooltip.remove();
      this.currentTooltip = null;
    }
  }

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
        timestamp: new Date().toISOString()
      };

      // Send to analytics if available
      if (typeof trackEvent === 'function') {
        trackEvent('chart_type_selected', selectionData);
      }

      console.log('Chart type selected:', selectionData);
    } catch (error) {
      console.warn('Failed to track selection:', error);
    }
  }

  /**
   * Get current selection
   * @returns {Object} Current selection data
   */
  getSelection() {
    return {
      selectedId: this.selectedId,
      aiRecommended: this.aiRecommended,
      isAIRecommendation: this.selectedId === this.aiRecommended,
      activeCategory: this.activeCategory,
      filteredCount: this.filteredTypes.length
    };
  }

  /**
   * Set selected chart type
   * @param {string} typeId - Chart type ID to select
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
    const badges = this.container.querySelectorAll('.ai-recommendation-badge');
    badges.forEach(badge => badge.remove());
    
    const recommendedTiles = this.container.querySelectorAll('.ai-recommended');
    recommendedTiles.forEach(tile => {
      tile.classList.remove('ai-recommended', 'ring-2', 'ring-blue-500', 'ring-offset-2');
    });
  }
}

// CSS for Enhanced ChartTypeSelector
const enhancedSelectorCSS = `
.enhanced-chart-type-selector {
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
  height: 180px;
  position: relative;
  overflow: hidden;
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

.chart-tooltip {
  animation: fadeIn 0.2s ease-out;
  backdrop-filter: blur(8px);
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.9; transform: scale(1.05); }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Mobile responsive adjustments */
@media (max-width: 768px) {
  .chart-type-tile {
    height: 160px;
  }
  
  .chart-tooltip {
    max-width: 280px;
    font-size: 12px;
  }
  
  .category-tab {
    @apply px-3 py-1.5 text-xs;
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
`;

// Inject CSS if not already present
if (!document.querySelector('#enhanced-chart-selector-css')) {
  const style = document.createElement('style');
  style.id = 'enhanced-chart-selector-css';
  style.textContent = enhancedSelectorCSS;
  document.head.appendChild(style);
}

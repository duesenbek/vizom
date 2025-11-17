/**
 * ChartTypeSelector Component
 * Interactive chart type picker with search, categories, and tooltips
 */

import { getAllChartTypes, getCategories, searchChartTypes } from '../charts/chart-types.js';

export class ChartTypeSelector {
  constructor(container, options = {}) {
    this.container = typeof container === 'string' ? document.querySelector(container) : container;
    this.options = {
      onChange: options.onChange || (() => {}),
      selectedId: options.selectedId || null,
      i18n: options.i18n || this.defaultI18n(),
      ...options
    };
    
    this.chartTypes = getAllChartTypes();
    this.categories = getCategories();
    this.filteredTypes = [...this.chartTypes];
    this.selectedId = this.options.selectedId;
    this.activeCategory = 'all';
    
    this.init();
  }
  
  defaultI18n() {
    return {
      searchPlaceholder: 'Search chart types...',
      allCategories: 'All',
      noResults: 'No chart types found',
      useCase: 'Use case',
      examples: 'Examples'
    };
  }
  
  init() {
    this.render();
    this.bindEvents();
  }
  
  render() {
    const t = this.options.i18n;
    
    this.container.innerHTML = `
      <div class="chart-type-selector" role="region" aria-label="Chart type selector">
        <!-- Search -->
        <div class="mb-6">
          <div class="relative">
            <input
              type="search"
              class="w-full px-4 py-3 pl-12 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="${t.searchPlaceholder}"
              role="searchbox"
              aria-label="Search chart types"
            />
            <svg class="absolute left-4 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>
        
        <!-- Category Tabs -->
        <div class="mb-6">
          <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-hide" role="tablist">
            <button
              class="category-tab active px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors"
              data-category="all"
              role="tab"
              aria-selected="true"
            >
              ${t.allCategories} <span class="ml-1 text-xs text-gray-500">(${this.chartTypes.length})</span>
            </button>
            ${this.categories.map(cat => `
              <button
                class="category-tab px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors"
                data-category="${cat.id}"
                role="tab"
                aria-selected="false"
              >
                ${cat.label} <span class="ml-1 text-xs text-gray-500">(${cat.items.length})</span>
              </button>
            `).join('')}
          </div>
        </div>
        
        <!-- Chart Grid -->
        <div class="chart-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" role="grid">
          ${this.renderChartTiles()}
        </div>
        
        <!-- No Results -->
        <div class="no-results hidden text-center py-12 text-gray-500" role="status">
          <svg class="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <p>${t.noResults}</p>
        </div>
      </div>
    `;
  }
  
  renderChartTiles() {
    if (this.filteredTypes.length === 0) {
      return '';
    }
    
    return this.filteredTypes.map(type => `
      <div
        class="chart-tile relative p-4 border border-gray-200 rounded-lg cursor-pointer transition-all hover:shadow-md hover:border-blue-300 ${this.selectedId === type.id ? 'ring-2 ring-blue-500 border-blue-500' : ''}"
        data-type-id="${type.id}"
        role="gridcell"
        tabindex="0"
        aria-label="${type.name} chart"
      >
        <div class="flex flex-col items-center text-center">
          <div class="text-2xl mb-2" role="img" aria-label="${type.name} icon"><i class="fa-solid ${type.icon && type.icon.includes('fa-') ? type.icon : 'fa-chart-column'}"></i></div>
          <h3 class="font-medium text-sm text-gray-900 mb-1">${type.name}</h3>
          <p class="text-xs text-gray-600 line-clamp-2">${type.description}</p>
        </div>
        
        <!-- Tooltip -->
        <div class="tooltip absolute z-10 invisible opacity-0 bg-gray-900 text-white text-xs rounded-lg p-3 w-64 -top-2 left-1/2 transform -translate-x-1/2 -translate-y-full transition-opacity group-hover:visible group-hover:opacity-100">
          <div class="font-medium mb-1">${type.name}</div>
          <div class="mb-2">
            <span class="font-semibold">${this.options.i18n.useCase}:</span>
            <p class="mt-1">${type.useCase}</p>
          </div>
          ${type.examples && type.examples.length > 0 ? `
            <div>
              <span class="font-semibold">${this.options.i18n.examples}:</span>
              <ul class="mt-1 list-disc list-inside">
                ${type.examples.slice(0, 2).map(ex => `<li>${ex}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
          <div class="absolute w-3 h-3 bg-gray-900 transform rotate-45 -bottom-1 left-1/2 -translate-x-1/2"></div>
        </div>
      </div>
    `).join('');
  }
  
  bindEvents() {
    const searchInput = this.container.querySelector('input[type="search"]');
    const categoryTabs = this.container.querySelectorAll('.category-tab');
    
    // Search functionality
    searchInput.addEventListener('input', (e) => {
      this.handleSearch(e.target.value);
    });
    
    // Category tabs
    categoryTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        this.handleCategoryChange(tab.dataset.category);
      });
    });
    
    // Chart tile selection
    this.container.addEventListener('click', (e) => {
      const tile = e.target.closest('.chart-tile');
      if (tile) {
        this.handleChartSelect(tile.dataset.typeId);
      }
    });
    
    // Keyboard navigation
    this.container.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        const tile = e.target.closest('.chart-tile');
        if (tile) {
          e.preventDefault();
          this.handleChartSelect(tile.dataset.typeId);
        }
      }
    });
    
    // Hover tooltips
    this.container.addEventListener('mouseenter', (e) => {
      const tile = e.target.closest('.chart-tile');
      if (tile) {
        tile.classList.add('group');
        const tooltip = tile.querySelector('.tooltip');
        if (tooltip) {
          tooltip.classList.remove('invisible', 'opacity-0');
          tooltip.classList.add('visible', 'opacity-100');
        }
      }
    }, true);
    
    this.container.addEventListener('mouseleave', (e) => {
      const tile = e.target.closest('.chart-tile');
      if (tile) {
        tile.classList.remove('group');
        const tooltip = tile.querySelector('.tooltip');
        if (tooltip) {
          tooltip.classList.add('invisible', 'opacity-0');
          tooltip.classList.remove('visible', 'opacity-100');
        }
      }
    }, true);
  }
  
  handleSearch(query) {
    if (query.trim() === '') {
      this.filteredTypes = this.activeCategory === 'all' 
        ? [...this.chartTypes]
        : this.chartTypes.filter(type => type.category === this.activeCategory);
    } else {
      const searchResults = searchChartTypes(query);
      this.filteredTypes = this.activeCategory === 'all'
        ? searchResults
        : searchResults.filter(type => type.category === this.activeCategory);
    }
    
    this.updateGrid();
  }
  
  handleCategoryChange(categoryId) {
    this.activeCategory = categoryId;
    
    // Update tab states
    this.container.querySelectorAll('.category-tab').forEach(tab => {
      const isActive = tab.dataset.category === categoryId;
      tab.classList.toggle('active', isActive);
      tab.setAttribute('aria-selected', isActive);
      
      if (isActive) {
        tab.classList.add('bg-blue-500', 'text-white');
        tab.classList.remove('bg-gray-100', 'text-gray-700', 'hover:bg-gray-200');
      } else {
        tab.classList.remove('bg-blue-500', 'text-white');
        tab.classList.add('bg-gray-100', 'text-gray-700', 'hover:bg-gray-200');
      }
    });
    
    // Filter types
    const searchInput = this.container.querySelector('input[type="search"]');
    const searchQuery = searchInput.value.trim();
    
    if (searchQuery === '') {
      this.filteredTypes = categoryId === 'all' 
        ? [...this.chartTypes]
        : this.chartTypes.filter(type => type.category === categoryId);
    } else {
      const searchResults = searchChartTypes(searchQuery);
      this.filteredTypes = categoryId === 'all'
        ? searchResults
        : searchResults.filter(type => type.category === categoryId);
    }
    
    this.updateGrid();
  }
  
  handleChartSelect(typeId) {
    this.selectedId = typeId;
    
    // Update tile states
    this.container.querySelectorAll('.chart-tile').forEach(tile => {
      const isSelected = tile.dataset.typeId === typeId;
      tile.classList.toggle('ring-2', isSelected);
      tile.classList.toggle('ring-blue-500', isSelected);
      tile.classList.toggle('border-blue-500', isSelected);
      tile.classList.toggle('border-gray-200', !isSelected);
      tile.setAttribute('aria-selected', isSelected);
    });
    
    // Call onChange callback
    this.options.onChange(typeId);
  }
  
  updateGrid() {
    const grid = this.container.querySelector('.chart-grid');
    const noResults = this.container.querySelector('.no-results');
    
    if (this.filteredTypes.length === 0) {
      grid.innerHTML = '';
      grid.classList.add('hidden');
      noResults.classList.remove('hidden');
    } else {
      grid.innerHTML = this.renderChartTiles();
      grid.classList.remove('hidden');
      noResults.classList.add('hidden');
    }
  }
  
  // Public methods
  setSelected(typeId) {
    this.handleChartSelect(typeId);
  }
  
  getSelected() {
    return this.selectedId;
  }
  
  destroy() {
    this.container.innerHTML = '';
  }
}

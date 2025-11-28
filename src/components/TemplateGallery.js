/**
 * @file src/components/TemplateGallery.js
 * @description UI component to render the template gallery with Pro badges and library indicators.
 * @version 2.0.0
 * @date 2025-11-26
 */

import { trackEvent } from '../tracking/analytics.js';
import { TEMPLATES, getTemplatesByTier, getTemplatesByCategory } from '../data/templates.js';
import featureGating from '../services/featureGating.js';
import { showUpgradeModal } from './UpgradeModal.js';

// Lazy import MiniChartPreview to avoid blocking initialization
let MiniChartPreviewModule = null;
const loadMiniChartPreview = async () => {
  if (!MiniChartPreviewModule) {
    try {
      MiniChartPreviewModule = await import('./MiniChartPreview.js');
    } catch (e) {
      console.warn('[TemplateGallery] MiniChartPreview not available:', e);
    }
  }
  return MiniChartPreviewModule;
};

/**
 * A class to manage the rendering of the template gallery.
 */
export class TemplateGallery {

  constructor() {
    /** @type {'idle' | 'loading' | 'success' | 'empty' | 'error'} */
    this.state = 'idle';
    /** @type {TemplateGalleryItem[]} */
    this.templates = [];

    /** @type {HTMLElement | null} */
    this.container = document.getElementById('templates-grid');
    /** @type {NodeListOf<HTMLElement>} */
    this.categoryButtons = /** @type {NodeListOf<HTMLElement>} */ (
      document.querySelectorAll('[data-category]')
    );
    /** @type {HTMLInputElement | null} */
    this.searchInput = /** @type {HTMLInputElement | null} */ (
      document.getElementById('template-search')
    );
    /** @type {HTMLButtonElement | null} */
    this.loadMoreButton = /** @type {HTMLButtonElement | null} */ (
      document.getElementById('load-more-templates')
    );
    /** @type {HTMLInputElement | null} */
    this.showPremiumCheckbox = /** @type {HTMLInputElement | null} */ (
      document.getElementById('show-premium')
    );
    /** @type {HTMLInputElement | null} */
    this.showFreeCheckbox = /** @type {HTMLInputElement | null} */ (
      document.getElementById('show-free')
    );
    /** @type {HTMLElement | null} */
    this.resultsCountEl = document.getElementById('results-count');

    /** @type {string} */
    this.activeCategory = 'all';
    /** @type {string} */
    this.searchQuery = '';
    /** @type {boolean} */
    this.showPremiumOnly = false;
    /** @type {boolean} */
    this.showFree = true;
    /** @type {number} */
    this.pageSize = 12;
    /** @type {number} */
    this.visibleCount = this.pageSize;
    /** @type {TemplateGalleryItem[]} */
    this.filteredTemplates = [];

    this.init();
  }

  /**
   * Initialize the gallery: load templates, render initial state, and wire events.
   *
   * @returns {Promise<void>}
   */
  async init() {
    if (!this.container) {
      console.warn('[TemplateGallery] #templates-grid not found; nothing to render.');
      return;
    }

    this.setState('loading');
    this.renderLoading();

    try {
      await this.loadTemplates();
      this.attachEventListeners();
      this.applyFiltersAndRender(true);
    } catch (error) {
      console.error('[TemplateGallery] Failed to initialize.', error);
      const message =
        (error && typeof error === 'object' && 'message' in error && error.message) ||
        'Failed to load templates.';
      this.setState('error');
      this.renderError(String(message));
    }
  }

  /**
   * Load gallery templates from the templates database.
   *
   * @returns {Promise<void>}
   */
  async loadTemplates() {
    // Load templates from the centralized templates database
    this.templates = TEMPLATES.map((t, index) => ({
      id: t.id || index + 1,
      name: t.title,
      category: t.category,
      chartType: t.chartType,
      library: t.library || 'chartjs',
      thumbnail: t.thumbnail || `assets/images/templates/${t.id}.png`,
      free: !t.isPro,
      isPro: t.isPro,
      description: t.description,
      prompt: t.prompt,
      config: t.config,
      echartsConfig: t.echartsConfig,
      useCases: this.generateUseCases(t)
    }));
    
    console.log(`[TemplateGallery] Loaded ${this.templates.length} templates (${this.templates.filter(t => t.free).length} free, ${this.templates.filter(t => !t.free).length} pro)`);
  }

  /**
   * Generate use cases based on template category
   * @param {Object} template
   * @returns {string[]}
   */
  generateUseCases(template) {
    const useCasesByCategory = {
      business: ['Executive dashboards', 'Team presentations', 'Performance tracking'],
      finance: ['Financial reporting', 'Investment analysis', 'Budget planning'],
      marketing: ['Campaign analysis', 'ROI tracking', 'Audience insights'],
      science: ['Research visualization', 'Data analysis', 'Academic papers'],
      education: ['Student progress', 'Course analytics', 'Learning metrics'],
      health: ['Health tracking', 'Medical data', 'Wellness monitoring']
    };
    return useCasesByCategory[template.category] || ['Data visualization', 'Reports', 'Presentations'];
  }

  /**
   * Update internal state.
   *
   * @param {'idle' | 'loading' | 'success' | 'empty' | 'error'} nextState
   */
  setState(nextState) {
    this.state = nextState;
    if (this.container) {
      this.container.setAttribute('data-gallery-state', nextState);
    }
  }

  /**
   * Apply current filters and render resulting templates.
   */
  applyFiltersAndRender(resetVisible = false) {
    if (!Array.isArray(this.templates) || this.templates.length === 0) {
      this.setState('empty');
      this.updateResultsCount(0, 0);
      this.updateLoadMoreState(0);
      this.renderEmpty();
      return;
    }

    if (resetVisible) {
      this.visibleCount = this.pageSize;
    }

    let filtered = [...this.templates];

    if (this.activeCategory && this.activeCategory !== 'all') {
      filtered = filtered.filter((t) => t.category === this.activeCategory);
    }

    const query = this.searchQuery.trim().toLowerCase();
    if (query) {
      filtered = filtered.filter((t) => {
        const nameMatch = t.name.toLowerCase().includes(query);
        const categoryMatch = (t.category || '').toLowerCase().includes(query);
        const typeMatch = (t.chartType || '').toLowerCase().includes(query);
        return nameMatch || categoryMatch || typeMatch;
      });
    }

    if (this.showPremiumOnly && !this.showFree) {
      filtered = filtered.filter((t) => t.free === false);
    } else if (!this.showPremiumOnly && this.showFree) {
      filtered = filtered.filter((t) => t.free !== false);
    } else if (!this.showPremiumOnly && !this.showFree) {
      filtered = [];
    }

    if (!filtered.length) {
      this.setState('empty');
      this.filteredTemplates = [];
      this.updateResultsCount(0, 0);
      this.updateLoadMoreState(0);
      this.renderEmpty();
      return;
    }

    this.setState('success');
    this.filteredTemplates = filtered;
    this.visibleCount = Math.min(this.visibleCount, filtered.length);
    const templatesToRender = filtered.slice(0, this.visibleCount);
    this.updateResultsCount(templatesToRender.length, filtered.length);
    this.render(templatesToRender);
    this.updateLoadMoreState(filtered.length);
  }

  /**
   * Render loading placeholder content.
   */
  renderLoading() {
    if (!this.container) return;
    this.container.innerHTML = `
      <div class="col-span-full flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white/40 px-6 py-12 text-center text-slate-500">
        <i class="fas fa-circle-notch fa-spin mb-3 text-2xl"></i>
        <p class="mb-1 text-sm font-medium text-slate-700">Loading templates...</p>
        <p class="text-xs text-slate-500">Please wait a moment while we prepare the gallery.</p>
      </div>
    `;
  }

  /**
   * Render an empty state message.
   */
  renderEmpty() {
    if (!this.container) return;
    this.container.innerHTML = `
      <div class="col-span-full flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center text-slate-500">
        <i class="fas fa-folder-open mb-3 text-3xl"></i>
        <p class="mb-1 text-sm font-medium text-slate-700">No templates found</p>
        <p class="text-xs text-slate-500">Try adjusting your category, type, or search filters.</p>
      </div>
    `;
  }

  /**
   * Render an error state message.
   *
   * @param {string} message
   */
  renderError(message) {
    if (!this.container) return;
    this.container.innerHTML = `
      <div class="col-span-full flex flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50 px-6 py-12 text-center text-red-700">
        <i class="fas fa-triangle-exclamation mb-3 text-3xl"></i>
        <p class="mb-1 text-sm font-medium">Unable to load templates</p>
        <p class="text-xs opacity-90">${message}</p>
      </div>
    `;
  }

  /**
   * Render a list of template cards into the grid.
   *
   * @param {TemplateGalleryItem[]} templates
   */
  render(templates) {
    if (!this.container) {
      console.error('Template gallery container not found.');
      return;
    }

    this.container.innerHTML = '';

    if (!templates || templates.length === 0) {
      this.renderEmpty();
      return;
    }

    templates.forEach((template) => {
      const card = this.createTemplateCard(template);
      this.container.appendChild(card);
    });

    // Initialize mini chart previews for the newly rendered cards
    setTimeout(async () => {
      const module = await loadMiniChartPreview();
      if (module?.initMiniChartPreviews) {
        module.initMiniChartPreviews();
      }
    }, 100);
  }

  /**
   * Creates a single template card element with Tailwind CSS classes.
   * Includes tier badge and feature gating.
   *
   * @param {TemplateGalleryItem} template - The template data.
   * @returns {HTMLElement} - The card element.
   * @private
   */
  createTemplateCard(template) {
    const card = document.createElement('article');
    const isPro = template.isPro || !template.free;
    const isLocked = isPro && !featureGating.isPro();
    
    card.className = `group flex flex-col overflow-hidden rounded-xl border bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg cursor-pointer ${isLocked ? 'border-amber-200' : 'border-slate-200'}`;
    card.dataset.templateId = String(template.id);
    card.dataset.category = template.category;
    card.dataset.chartType = template.chartType;
    card.dataset.isPro = String(isPro);

    // Tier badge (Free/Pro)
    const tierBadge = isPro
      ? `<span class="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-2.5 py-1 text-[10px] font-bold text-white shadow-sm">
          <i class="fas fa-crown"></i> PRO
        </span>`
      : `<span class="absolute left-3 top-3 inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
          FREE
        </span>`;

    // Chart type icon mapping
    const chartIcons = {
      bar: 'fa-chart-bar',
      line: 'fa-chart-line',
      pie: 'fa-chart-pie',
      doughnut: 'fa-circle-notch',
      radar: 'fa-spider',
      scatter: 'fa-braille',
      polarArea: 'fa-compass',
      bubble: 'fa-circle',
      area: 'fa-mountain',
      mixed: 'fa-layer-group',
      treemap: 'fa-th-large',
      sankey: 'fa-stream',
      funnel: 'fa-filter',
      gauge: 'fa-tachometer-alt',
      heatmap: 'fa-th',
      candlestick: 'fa-chart-candlestick',
      map: 'fa-globe'
    };
    const chartIcon = chartIcons[template.chartType] || 'fa-chart-simple';

    // Preview placeholder with chart icon
    const previewHTML = `
      <div class="h-full w-full flex items-center justify-center bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">
        <div class="text-center">
          <i class="fas ${chartIcon} text-4xl text-blue-400/60 mb-2"></i>
          <p class="text-[10px] text-slate-400 uppercase tracking-wide">${template.chartType}</p>
        </div>
        ${isLocked ? '<div class="absolute inset-0 bg-black/20 backdrop-blur-[1px]"></div>' : ''}
      </div>`;

    // Button text based on lock state
    const buttonHTML = isLocked
      ? `<button class="use-template-btn mt-auto inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-2 text-xs font-medium text-white shadow-sm transition hover:from-amber-600 hover:to-orange-600" data-action="unlock-template" data-template-id="${template.id}">
          <i class="fas fa-lock mr-1.5 text-[0.7rem]"></i> Unlock with Pro
        </button>`
      : `<button class="use-template-btn mt-auto inline-flex items-center justify-center rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white shadow-sm transition hover:bg-blue-700" data-action="use-template" data-template-id="${template.id}">
          <i class="fas fa-bolt mr-1.5 text-[0.7rem]"></i> Use Template
        </button>`;

    card.innerHTML = `
      <div class="relative h-44 w-full overflow-hidden">
        ${previewHTML}
        ${tierBadge}
      </div>
      <div class="flex flex-1 flex-col p-4">
        <h3 class="line-clamp-2 text-sm font-semibold text-slate-900">${template.name}</h3>
        <div class="mt-1 flex items-center gap-2 text-xs text-slate-500">
          <span class="capitalize">${template.category}</span>
          <span class="text-slate-300">•</span>
          <span class="flex items-center gap-1">
            <i class="fas ${chartIcon} text-[10px]"></i>
            <span class="capitalize">${template.chartType}</span>
          </span>
        </div>
        <p class="mt-2 line-clamp-2 flex-1 text-xs text-slate-500">${template.description || ''}</p>
        ${buttonHTML}
      </div>
    `;

    // Event handlers
    const useButton = card.querySelector('[data-action="use-template"]');
    const unlockButton = card.querySelector('[data-action="unlock-template"]');
    
    if (useButton) {
      useButton.addEventListener('click', (event) => {
        event.stopPropagation();
        this.useTemplate(template.id);
      });
    }
    
    if (unlockButton) {
      unlockButton.addEventListener('click', (event) => {
        event.stopPropagation();
        showUpgradeModal('template');
      });
    }

    card.addEventListener('click', () => {
      if (isLocked) {
        showUpgradeModal('template');
      } else {
        this.showTemplateModal(template);
      }
    });

    return card;
  }

  /**
   * Attach listeners for category, search, and filter controls.
   */
  attachEventListeners() {
    this.categoryButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const category = button.dataset.category || 'all';
        this.setActiveCategoryButton(button);
        this.filterByCategory(category);
      });
    });

    if (this.searchInput) {
      this.searchInput.addEventListener('input', () => {
        const value = this.searchInput ? this.searchInput.value : '';
        this.filterBySearch(value);
      });
    }

    if (this.showPremiumCheckbox) {
      this.showPremiumCheckbox.addEventListener('change', () => {
        this.showPremiumOnly = this.showPremiumCheckbox
          ? this.showPremiumCheckbox.checked
          : false;
        this.applyFiltersAndRender(true);
      });
    }

    if (this.showFreeCheckbox) {
      this.showFree = !!this.showFreeCheckbox.checked;
      this.showFreeCheckbox.addEventListener('change', () => {
        this.showFree = this.showFreeCheckbox ? this.showFreeCheckbox.checked : false;
        this.applyFiltersAndRender(true);
      });
    }

    if (this.loadMoreButton) {
      this.loadMoreButton.addEventListener('click', () => {
        this.handleLoadMore();
      });
    }
  }

  /**
   * Highlight the active category button.
   *
   * @param {HTMLElement} activeButton
   */
  setActiveCategoryButton(activeButton) {
    this.categoryButtons.forEach((btn) => {
      if (btn === activeButton) {
        btn.classList.add('bg-blue-600', 'text-white');
        btn.classList.remove('bg-white', 'text-slate-700');
      } else {
        btn.classList.remove('bg-blue-600', 'text-white');
        btn.classList.add('bg-white', 'text-slate-700');
      }
    });
  }

  /**
   * Filter templates by category.
   *
   * @param {string} category
   */
  filterByCategory(category) {
    this.activeCategory = category || 'all';
    this.applyFiltersAndRender(true);
    try {
      trackEvent('template_category_filtered', { category: this.activeCategory });
    } catch (_) {
      // Analytics is optional; ignore errors.
    }
  }

  /**
   * Filter templates by free-text search.
   *
   * @param {string} query
   */
  filterBySearch(query) {
    this.searchQuery = (query || '').toLowerCase();
    this.applyFiltersAndRender(true);
    try {
      trackEvent('template_searched', { query: this.searchQuery });
    } catch (_) {
      // Analytics is optional; ignore errors.
    }
  }

  /**
   * Update the results count element.
   *
   * @param {number} count
   */
  updateResultsCount(visibleCount, totalCount) {
    if (!this.resultsCountEl) return;
    if (totalCount <= 0) {
      this.resultsCountEl.textContent = '0';
      return;
    }
    const label = visibleCount >= totalCount
      ? `${totalCount}`
      : `${visibleCount} of ${totalCount}`;
    this.resultsCountEl.textContent = label;
  }

  /**
   * Handler for using a template. Navigates to the generator page.
   *
   * @param {string|number} templateId Selected template identifier.
   */
  useTemplate(templateId) {
    const template = this.templates.find((t) => t.id === templateId || t.id === String(templateId));
    if (!template) {
      console.warn('[TemplateGallery] Template not found:', templateId);
      return;
    }

    // Check if template is Pro and user doesn't have access
    if (template.isPro && !featureGating.isPro()) {
      showUpgradeModal('template');
      return;
    }

    console.log('[TemplateGallery] Using template:', template.name);
    try {
      trackEvent('template_used', { templateId: template.id, templateName: template.name, library: template.library });
    } catch (_) {
      // Analytics is optional; ignore errors.
    }
    
    // Store template config in sessionStorage for generator to use
    sessionStorage.setItem('vizom_selected_template', JSON.stringify({
      id: template.id,
      name: template.name,
      chartType: template.chartType,
      library: template.library,
      config: template.config,
      echartsConfig: template.echartsConfig,
      prompt: template.prompt
    }));
    
    window.location.href = `generator.html?template=${encodeURIComponent(template.id)}`;
  }

  /**
   * Show a modal with template details and preview.
   *
   * @param {TemplateGalleryItem} template Template payload to display.
   */
  showTemplateModal(template) {
    const modal = document.getElementById('template-modal');
    if (!modal) {
      console.warn('[TemplateGallery] #template-modal not found.');
      return;
    }

    const titleEl = modal.querySelector('#modal-template-title');
    const descEl = modal.querySelector('#modal-template-description');
    const categoryEl = modal.querySelector('#modal-template-category');
    const badgeEl = modal.querySelector('#modal-template-badge');
    const useCasesList = modal.querySelector('#modal-use-cases');
    const previewEl = modal.querySelector('#modal-preview');
    const closeButton = modal.querySelector('#close-template-modal');
    const useButton = modal.querySelector('#modal-use-template');

    if (titleEl) {
      titleEl.textContent = template.name;
    }
    if (descEl) {
      const description =
        template.description ||
        `This is a ${template.chartType} chart for the ${template.category} category.`;
      descEl.textContent = description;
    }
    if (categoryEl) {
      categoryEl.textContent = template.category;
    }
    if (badgeEl) {
      badgeEl.textContent = template.free ? 'Free' : 'Premium';
      badgeEl.classList.toggle('bg-slate-100', template.free);
      badgeEl.classList.toggle('bg-amber-100', !template.free);
    }
    if (useCasesList && Array.isArray(template.useCases)) {
      useCasesList.innerHTML = template.useCases
        .map(
          (item) => `
        <li class="flex items-start gap-2 text-sm text-slate-600">
          <i class="fas fa-check text-emerald-500 mt-0.5"></i>
          <span>${item}</span>
        </li>`
        )
        .join('');
    }
    if (previewEl) {
      previewEl.innerHTML = `
        <img src="${template.thumbnail}" alt="${template.name}" class="max-h-96 max-w-full rounded-xl object-contain shadow-sm">
      `;
    }

    if (closeButton) {
      closeButton.onclick = () => {
        modal.classList.add('hidden');
      };
    }

    if (useButton) {
      useButton.onclick = () => {
        this.useTemplate(template.id);
      };
    }

    modal.classList.remove('hidden');

    try {
      trackEvent('template_modal_opened', {
        templateId: template.id,
        templateName: template.name,
      });
    } catch (_) {
      // Analytics is optional; ignore errors.
    }
  }

  /**
   * Optional hook to react to device type changes.
   *
   * @param {boolean} isMobile True when viewport is considered mobile.
   */
  handleDeviceTypeChange(isMobile) {
    if (!this.container) return;
    if (isMobile) {
      this.container.classList.add('templates-mobile');
    } else {
      this.container.classList.remove('templates-mobile');
    }
  }

  /**
   * Optional hook to react to theme changes.
   *
   * @param {string} theme Current theme name (e.g. "light" or "dark").
   */
  handleThemeChange(theme) {
    if (!this.container) return;
    this.container.setAttribute('data-theme', theme);
  }

  /**
   * Handle clicking the Load More button.
   */
  handleLoadMore() {
    const total = this.filteredTemplates.length;
    if (!total) {
      this.updateLoadMoreState(0);
      return;
    }

    if (this.visibleCount >= total) {
      this.updateLoadMoreState(total);
      return;
    }

    this.visibleCount = Math.min(this.visibleCount + this.pageSize, total);
    const templatesToRender = this.filteredTemplates.slice(0, this.visibleCount);
    this.render(templatesToRender);
    this.updateResultsCount(templatesToRender.length, total);
    this.updateLoadMoreState(total);
  }

  /**
   * Update Load More button text/disabled state.
   * @param {number} totalFiltered
   */
  updateLoadMoreState(totalFiltered) {
    if (!this.loadMoreButton) return;
    const isDisabled = totalFiltered === 0 || this.visibleCount >= totalFiltered;
    this.loadMoreButton.disabled = isDisabled;
    this.loadMoreButton.textContent = isDisabled ? 'All templates loaded' : 'Load More Templates';
    this.loadMoreButton.classList.toggle('opacity-50', isDisabled);
    this.loadMoreButton.classList.toggle('cursor-not-allowed', isDisabled);
  }
}

/**
 * @typedef {Object} TemplateGalleryItem
 * @property {string|number} id
 * @property {string} name
 * @property {string} category
 * @property {string} chartType
 * @property {string} [library] - Chart library: 'chartjs', 'echarts', 'apexcharts', 'd3'
 * @property {string} [exampleId] - Reference to DEMO_DATASETS for live chart preview
 * @property {string} thumbnail
 * @property {boolean} free
 * @property {boolean} [isPro]
 * @property {string} [description]
 * @property {string} [prompt]
 * @property {Object} [config] - Chart.js config
 * @property {Object} [echartsConfig] - ECharts config
 * @property {string[]} [useCases]
 */

document.addEventListener('DOMContentLoaded', () => {
  new TemplateGallery();
});

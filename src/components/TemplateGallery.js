/**
 * @file src/components/TemplateGallery.js
 * @description UI component to render the template gallery.
 * @version 1.0.0
 * @date 2025-11-14
 */

import { trackEvent } from '../tracking/analytics.js';

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
      this.applyFiltersAndRender();
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
   * Load gallery templates. In a real application, this would fetch from an API.
   *
   * @returns {Promise<void>}
   */
  async loadTemplates() {
    /** @type {TemplateGalleryItem[]} */
    this.templates = [
      {
        id: 1,
        name: 'Sales Dashboard',
        category: 'business',
        chartType: 'bar',
        thumbnail: 'assets/images/screenshots/sales-dashboard.png',
        free: true,
        description: 'Track monthly revenue, pipeline, and team performance in a single view.',
        useCases: [
          'Monthly business reviews',
          'Executive reporting',
          'Sales team performance tracking',
        ],
      },
      {
        id: 2,
        name: 'Monthly Website Traffic',
        category: 'marketing',
        chartType: 'line',
        thumbnail: 'assets/images/screenshots/monthly-traffic.png',
        free: true,
        description: 'Monitor visits, sources, and conversions across your digital channels.',
        useCases: ['Marketing performance reviews', 'Campaign reporting', 'SEO monitoring'],
      },
      {
        id: 3,
        name: 'User Demographics',
        category: 'business',
        chartType: 'pie',
        thumbnail: 'assets/images/screenshots/user-demographics.png',
        free: true,
        description: 'Understand your audience by age, location, and device type.',
        useCases: ['Audience analysis', 'Product strategy', 'Targeting optimization'],
      },
      {
        id: 4,
        name: 'Social Media Analytics',
        category: 'marketing',
        chartType: 'line',
        thumbnail: 'assets/images/screenshots/social-media.png',
        free: false,
        description: 'Compare engagement and growth across social channels.',
        useCases: ['Social media reporting', 'Content performance', 'Brand tracking'],
      },
    ];
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
  applyFiltersAndRender() {
    if (!Array.isArray(this.templates) || this.templates.length === 0) {
      this.setState('empty');
      this.updateResultsCount(0);
      this.renderEmpty();
      return;
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
      this.updateResultsCount(0);
      this.renderEmpty();
      return;
    }

    this.setState('success');
    this.updateResultsCount(filtered.length);
    this.render(filtered);
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
  }

  /**
   * Creates a single template card element with Tailwind CSS classes.
   *
   * @param {TemplateGalleryItem} template - The template data.
   * @returns {HTMLElement} - The card element.
   * @private
   */
  createTemplateCard(template) {
    const card = document.createElement('article');
    card.className =
      'group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg cursor-pointer';
    card.dataset.templateId = String(template.id);
    card.dataset.category = template.category;
    card.dataset.chartType = template.chartType;

    const badgeText = template.free ? 'Free' : 'Premium';
    const badgeClass = template.free
      ? 'bg-emerald-50 text-emerald-700'
      : 'bg-amber-50 text-amber-700';

    card.innerHTML = `
      <div class="relative h-40 w-full overflow-hidden bg-slate-100">
        <img src="${template.thumbnail}" alt="${template.name}" class="h-full w-full object-cover transition duration-300 group-hover:scale-105">
        <span class="absolute left-3 top-3 inline-flex items-center rounded-full ${badgeClass} px-2.5 py-0.5 text-xs font-semibold">
          ${badgeText}
        </span>
      </div>
      <div class="flex flex-1 flex-col p-4">
        <h3 class="line-clamp-2 text-sm font-semibold text-slate-900">${template.name}</h3>
        <p class="mt-1 text-xs text-slate-500">
          <span class="capitalize">${template.category}</span> · <span class="uppercase">${template.chartType}</span>
        </p>
        <p class="mt-2 line-clamp-3 text-xs text-slate-500">${template.description || ''}</p>
        <button
          class="use-template-btn mt-4 inline-flex items-center justify-center rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white shadow-sm transition hover:bg-blue-700"
          data-action="use-template"
          data-template-id="${template.id}"
        >
          <i class="fas fa-bolt mr-1.5 text-[0.7rem]"></i>
          Use Template
        </button>
      </div>
    `;

    const useButton = /** @type {HTMLButtonElement | null} */ (
      card.querySelector('[data-action="use-template"]')
    );
    if (useButton) {
      useButton.addEventListener('click', (event) => {
        event.stopPropagation();
        const id = Number(useButton.dataset.templateId);
        this.useTemplate(id);
      });
    }

    card.addEventListener('click', () => {
      this.showTemplateModal(template);
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
        this.applyFiltersAndRender();
      });
    }

    if (this.showFreeCheckbox) {
      this.showFree = !!this.showFreeCheckbox.checked;
      this.showFreeCheckbox.addEventListener('change', () => {
        this.showFree = this.showFreeCheckbox ? this.showFreeCheckbox.checked : false;
        this.applyFiltersAndRender();
      });
    }

    if (this.loadMoreButton) {
      this.loadMoreButton.addEventListener('click', () => {
        if (window.uiFeedback?.showToast) {
          window.uiFeedback.showToast('No more templates to load.', 'info');
        } else {
          console.info('[templates] No more templates to load.');
        }
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
    this.applyFiltersAndRender();
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
    this.applyFiltersAndRender();
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
  updateResultsCount(count) {
    if (this.resultsCountEl) {
      this.resultsCountEl.textContent = String(count);
    }
  }

  /**
   * Handler for using a template. Navigates to the generator page.
   *
   * @param {number} templateId Selected template identifier.
   */
  useTemplate(templateId) {
    const template = this.templates.find((t) => t.id === templateId);
    if (!template) return;

    console.log('[TemplateGallery] Using template:', template);
    try {
      trackEvent('template_used', { templateId: template.id, templateName: template.name });
    } catch (_) {
      // Analytics is optional; ignore errors.
    }
    window.location.href = `generator.html?template=${encodeURIComponent(templateId)}`;
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
}

/**
 * @typedef {Object} TemplateGalleryItem
 * @property {number} id
 * @property {string} name
 * @property {string} category
 * @property {string} chartType
 * @property {string} thumbnail
 * @property {boolean} free
 * @property {string} [description]
 * @property {string[]} [useCases]
 */

document.addEventListener('DOMContentLoaded', () => {
  new TemplateGallery();
});

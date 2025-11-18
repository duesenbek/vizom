/**
 * @file src/components/TemplateGallery.stub.js
 * @description Minimal TemplateGallery stub used when the full gallery module
 *              is unavailable or not yet wired for the current HTML entry.
 */

/**
 * Lightweight stub implementation of the template gallery.
 *
 * This class is intentionally minimal: it only wires up the DOM container
 * and renders a basic placeholder so the Templates page can render without
 * runtime errors.
 *
 * The real/gallery implementation lives in other modules. When a full
 * implementation is ready for this entry point, update imports to target it
 * instead of this stub.
 */
export class TemplateGallery {
  /**
   * Create a new TemplateGallery stub.
   *
   * @param {Object} [options] Optional configuration.
   * @param {HTMLElement|null} [options.container] Optional container element.
   */
  constructor(options = {}) {
    /** @type {HTMLElement | null} */
    this.container = options.container || document.getElementById('templates-grid');
    /** @type {HTMLInputElement | null} */
    this.searchInput = /** @type {HTMLInputElement|null} */ (document.getElementById('template-search'));
    /** @type {NodeListOf<HTMLElement>} */
    this.categoryButtons = /** @type {NodeListOf<HTMLElement>} */ (document.querySelectorAll('[data-category]'));

    this.init();
  }

  /**
   * Initialize the stub gallery: render placeholder and attach listeners.
   * This keeps the UI stable without requiring real template data.
   */
  init() {
    if (!this.container) {
      console.warn('[TemplateGalleryStub] #templates-grid not found; nothing to render.');
      return;
    }
    this.renderPlaceholder();
    this.attachEventListeners();
  }

  /**
   * Render a simple placeholder block so the layout looks intentional.
   * The real implementation would render individual template cards here.
   */
  renderPlaceholder() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="col-span-full flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white/40 px-6 py-12 text-center text-slate-500">
        <i class="fas fa-layer-group mb-3 text-3xl"></i>
        <p class="mb-1 text-sm font-medium text-slate-700">Template gallery stub active</p>
        <p class="text-xs text-slate-500">
          The full template gallery is not loaded yet. This stub keeps the page
          interactive while the real implementation is being integrated.
        </p>
      </div>
    `;
  }

  /**
   * Attach minimal, no-op listeners so category buttons and search still
   * respond without throwing errors.
   */
  attachEventListeners() {
    this.categoryButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const category = button.dataset.category || 'all';
        this.filterByCategory(category);
      });
    });

    if (this.searchInput) {
      this.searchInput.addEventListener('input', () => {
        const query = String(this.searchInput && this.searchInput.value || '');
        this.filterBySearch(query);
      });
    }
  }

  /**
   * Stubbed category filter.
   *
   * @param {string} category The requested category key.
   */
  filterByCategory(category) {
    console.info('[TemplateGalleryStub] filterByCategory called.', { category });
  }

  /**
   * Stubbed text search filter.
   *
   * @param {string} query Raw search query string.
   */
  filterBySearch(query) {
    console.info('[TemplateGalleryStub] filterBySearch called.', { query });
  }

  /**
   * Stub handler for using a template.
   *
   * @param {string|number} templateId Selected template identifier.
   */
  useTemplate(templateId) {
    console.info('[TemplateGalleryStub] useTemplate called.', { templateId });
  }

  /**
   * Stub handler for showing a template details modal.
   *
   * @param {unknown} template Arbitrary template payload.
   */
  showTemplateModal(template) {
    console.info('[TemplateGalleryStub] showTemplateModal called.', { template });
  }

  /**
   * Optional hook to react to device type changes.
   *
   * @param {boolean} isMobile True when current viewport is considered mobile.
   */
  handleDeviceTypeChange(isMobile) {
    console.info('[TemplateGalleryStub] handleDeviceTypeChange called.', { isMobile });
  }

  /**
   * Optional hook to react to theme changes.
   *
   * @param {string} theme Current theme name (e.g. "light" or "dark").
   */
  handleThemeChange(theme) {
    console.info('[TemplateGalleryStub] handleThemeChange called.', { theme });
  }
}

// Ensure the stub is initialized on pages that include this module directly.
document.addEventListener('DOMContentLoaded', () => {
  try {
    if (!window.templateGalleryStub) {
      window.templateGalleryStub = new TemplateGallery();
    }
  } catch (error) {
    console.error('[TemplateGalleryStub] Failed to initialize.', error);
  }
});

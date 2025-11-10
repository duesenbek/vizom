import { TEMPLATE_CATEGORIES, VISUAL_TYPES } from './constants.js';
import { TemplateRegistry } from './registry.js';
import { debounce, getCategoryStyle, getVisualTypeStyle } from './utils.js';

/**
 * TemplateManager class for handling template UI operations
 */
export class TemplateManager {
    #registry;
    #eventListeners = new Map();
    #initializedPromise;

    constructor() {
        this.#registry = new TemplateRegistry();
        this.#initializedPromise = this.#initialize();
    }

    async #initialize() {
        try {
            // Initialize event listeners after DOM is ready
            if (document.readyState === 'loading') {
                await new Promise(resolve => {
                    document.addEventListener('DOMContentLoaded', resolve, { once: true });
                });
            }

            this.#setupEventListeners();
            this.renderTemplates();
            this.#setupFilters();
            this.#setupSearch();
            this.#setupAccessibility();

        } catch (error) {
            console.error('Failed to initialize TemplateManager:', error);
            this.showError('Failed to initialize template gallery');
        }
    }

    #setupEventListeners() {
        // Delegate events for better performance
        document.addEventListener('click', (e) => {
            const useTemplateBtn = e.target.closest('[data-action="use-template"]');
            if (useTemplateBtn) {
                e.preventDefault();
                const card = useTemplateBtn.closest('[data-template-id]');
                if (card) {
                    const templateId = card.getAttribute('data-template-id');
                    this.#handleTemplateSelection(templateId);
                }
            }
        });

        // Handle keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.target.matches('[data-template-id]')) {
                e.preventDefault();
                const templateId = e.target.getAttribute('data-template-id');
                this.#handleTemplateSelection(templateId);
            }
        });

        // Handle window resize for responsive layout
        window.addEventListener('resize', debounce(() => {
            this.#adjustLayoutForScreenSize();
        }, 250));
    }

    renderTemplates(filters = {}) {
        const templateContainer = document.getElementById('template-gallery');
        if (!templateContainer) return;

        const templates = this.#registry.getAllTemplates();
        const filteredTemplates = this.#filterTemplates(templates, filters);
        
        // Clear existing content
        templateContainer.innerHTML = '';
        
        // Create document fragment for better performance
        const fragment = document.createDocumentFragment();
        
        filteredTemplates.forEach(template => {
            const templateCard = this.#createTemplateCard(template);
            fragment.appendChild(templateCard);
        });

        // Update DOM only once
        templateContainer.appendChild(fragment);

        // Update results count
        this.#updateResultsCount(filteredTemplates.length);
    }

    #filterTemplates(templates, { category, visualType, searchQuery } = {}) {
        return templates.filter(template => {
            const categoryMatch = !category || template.category === category;
            const typeMatch = !visualType || template.visualType === visualType;
            const searchMatch = !searchQuery || 
                template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                template.description.toLowerCase().includes(searchQuery.toLowerCase());
            
            return categoryMatch && typeMatch && searchMatch;
        });
    }

    #createTemplateCard(template) {
        const card = document.createElement('article');
        card.className = 'template-card bg-white rounded-xl shadow-lg p-6 transition-transform hover:scale-105';
        card.setAttribute('data-template-id', template.id);
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', `Use ${template.title} template`);

        card.innerHTML = `
            <div class="space-y-4">
                <div class="flex items-center justify-between">
                    <span class="px-3 py-1 text-sm font-medium rounded-full ${getCategoryStyle(template.category)}" role="badge">
                        ${template.category}
                    </span>
                    <span class="px-3 py-1 text-sm font-medium rounded-full ${getVisualTypeStyle(template.visualType)}" role="badge">
                        ${template.visualType}
                    </span>
                </div>
                <h3 class="text-xl font-semibold text-slate-900">${template.title}</h3>
                <p class="text-slate-600">${template.description}</p>
                <button class="w-full btn btn-primary" 
                        data-action="use-template"
                        aria-label="Use ${template.title} template">
                    Use Template
                </button>
            </div>
        `;

        return card;
    }

    async #handleTemplateSelection(templateId) {
        try {
            const template = this.#registry.getTemplate(templateId);
            
            // Emit template selection event
            this.emit('templateSelected', template);
            
            // Store selected template in session storage
            sessionStorage.setItem('selectedTemplate', JSON.stringify({
                id: templateId,
                ...template.toJSON()
            }));
            
            // Navigate to generator with template
            const params = new URLSearchParams({ template: templateId });
            window.location.href = `generator.html?${params.toString()}`;

        } catch (error) {
            console.error('Failed to handle template selection:', error);
            this.showError('Failed to load template. Please try again.');
        }
    }

    #setupFilters() {
        const filterForm = document.getElementById('template-filters');
        if (!filterForm) return;

        // Add filter change handler
        filterForm.addEventListener('change', (e) => {
            const formData = new FormData(filterForm);
            const filters = {
                category: formData.get('category'),
                visualType: formData.get('visualType')
            };

            // Update URL params
            const params = new URLSearchParams(window.location.search);
            Object.entries(filters).forEach(([key, value]) => {
                if (value) {
                    params.set(key, value);
                } else {
                    params.delete(key);
                }
            });

            // Update URL without reload
            window.history.pushState({}, '', `${window.location.pathname}?${params.toString()}`);
            
            this.renderTemplates(filters);
        });
    }

    #setupSearch() {
        const searchInput = document.getElementById('template-search');
        if (!searchInput) return;

        const debouncedSearch = debounce((query) => {
            const filters = this.#getCurrentFilters();
            filters.searchQuery = query;
            this.renderTemplates(filters);
        }, 300);

        searchInput.addEventListener('input', (e) => {
            debouncedSearch(e.target.value.trim());
        });
    }

    #setupAccessibility() {
        // Add ARIA labels and roles
        const gallery = document.getElementById('template-gallery');
        if (gallery) {
            gallery.setAttribute('role', 'grid');
            gallery.setAttribute('aria-label', 'Template Gallery');
        }

        // Add screen reader announcements for dynamic content
        const announcer = document.createElement('div');
        announcer.setAttribute('role', 'status');
        announcer.setAttribute('aria-live', 'polite');
        announcer.className = 'sr-only';
        document.body.appendChild(announcer);
    }

    #adjustLayoutForScreenSize() {
        const gallery = document.getElementById('template-gallery');
        if (!gallery) return;

        const width = window.innerWidth;
        if (width < 640) {
            gallery.classList.remove('grid-cols-3', 'grid-cols-2');
            gallery.classList.add('grid-cols-1');
        } else if (width < 1024) {
            gallery.classList.remove('grid-cols-3', 'grid-cols-1');
            gallery.classList.add('grid-cols-2');
        } else {
            gallery.classList.remove('grid-cols-2', 'grid-cols-1');
            gallery.classList.add('grid-cols-3');
        }
    }

    #getCurrentFilters() {
        const filterForm = document.getElementById('template-filters');
        if (!filterForm) return {};

        const formData = new FormData(filterForm);
        return {
            category: formData.get('category'),
            visualType: formData.get('visualType')
        };
    }

    #updateResultsCount(count) {
        const resultsCount = document.getElementById('results-count');
        if (resultsCount) {
            resultsCount.textContent = `${count} template${count !== 1 ? 's' : ''} found`;
        }
    }

    showError(message) {
        const errorContainer = document.getElementById('error-container') || this.#createErrorContainer();
        
        const alert = document.createElement('div');
        alert.className = 'bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4';
        alert.setAttribute('role', 'alert');
        
        alert.innerHTML = `
            <p class="font-bold">Error</p>
            <p>${message}</p>
        `;

        errorContainer.appendChild(alert);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            alert.remove();
            if (errorContainer.children.length === 0) {
                errorContainer.remove();
            }
        }, 5000);
    }

    #createErrorContainer() {
        const container = document.createElement('div');
        container.id = 'error-container';
        container.className = 'fixed top-4 right-4 z-50 space-y-2 max-w-md';
        document.body.appendChild(container);
        return container;
    }

    on(event, callback) {
        if (!this.#eventListeners.has(event)) {
            this.#eventListeners.set(event, new Set());
        }
        this.#eventListeners.get(event).add(callback);
        return () => this.off(event, callback); // Return cleanup function
    }

    off(event, callback) {
        const listeners = this.#eventListeners.get(event);
        if (listeners) {
            listeners.delete(callback);
        }
    }

    emit(event, data) {
        const listeners = this.#eventListeners.get(event);
        if (listeners) {
            listeners.forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in event listener for ${event}:`, error);
                }
            });
        }
    }
}

// Create and export singleton instance
export const templateManager = new TemplateManager();

// Export for module usage
export {
    TEMPLATE_CATEGORIES,
    VISUAL_TYPES
};
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
        this.templates = [];
        this.container = document.getElementById('templates-grid');
        this.categoryButtons = document.querySelectorAll('[data-category]');
        this.search = document.getElementById('template-search');
        this.loadMoreButton = document.getElementById('load-more-templates');

        this.init();
    }

    async init() {
        await this.loadTemplates();
        this.render(this.templates);
        this.attachEventListeners();
    }

    async loadTemplates() {
        // In a real application, this would be an API call.
        this.templates = [
            {
                id: 1,
                name: "Sales Dashboard",
                category: "business",
                chartType: "bar",
                thumbnail: "assets/images/screenshots/sales-dashboard.png",
                free: true,
            },
            {
                id: 2,
                name: "Monthly Website Traffic",
                category: "marketing",
                chartType: "line",
                thumbnail: "assets/images/screenshots/monthly-traffic.png",
                free: true,
            },
            {
                id: 3,
                name: "User Demographics",
                category: "business",
                chartType: "pie",
                thumbnail: "assets/images/screenshots/user-demographics.png",
                free: true,
            },
            {
                id: 4,
                name: "Social Media Analytics",
                category: "marketing",
                chartType: "line",
                thumbnail: "assets/images/screenshots/social-media.png",
                free: false,
            }
        ];
    }

    render(templates) {
        if (!this.container) {
            console.error('Template gallery container not found.');
            return;
        }

        this.container.innerHTML = ''; // Clear previous content

        if (!templates || templates.length === 0) {
            this.container.innerHTML = '<p class="text-gray-500">No templates available.</p>';
            return;
        }

        templates.forEach(template => {
            const card = this.createTemplateCard(template);
            this.container.appendChild(card);
        });
    }

    /**
     * Creates a single template card element with Tailwind CSS classes.
     * @param {object} template - The template data.
     * @returns {HTMLElement} - The card element.
     * @private
     */
    createTemplateCard(template) {
        const card = document.createElement('div');
        card.className = 'bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300';

        card.innerHTML = `
            <img src="${template.thumbnail}" alt="${template.name}" class="w-full h-40 object-cover rounded-t-lg">
            <div class="p-4">
                <h3 class="text-xl font-semibold text-gray-800">${template.name}</h3>
                <p class="text-sm text-gray-600 capitalize mt-1">${template.category}</p>
                <button 
                    class="use-template-btn mt-4 w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300"
                    data-template-id="${template.id}"
                >
                    Use Template
                </button>
            </div>
        `;

        // Add click handler to the 'Use Template' button
        const useButton = card.querySelector('[data-action="use-template"]');
        useButton.addEventListener('click', (event) => {
            event.stopPropagation();
            this.useTemplate(template.id);
        });

        card.addEventListener('click', () => {
            this.showTemplateModal(template);
        });

        return card;
    }

    attachEventListeners() {
        this.categoryButtons.forEach(button => {
            button.addEventListener('click', () => {
                const category = button.dataset.category;
                this.filterByCategory(category);
            });
        });

        this.search.addEventListener('input', (e) => {
            this.filterBySearch(e.target.value);
        });

        this.loadMoreButton.addEventListener('click', () => {
            // In a real app, you would fetch more templates from an API
            alert('No more templates to load.');
        });
    }

    filterByCategory(category) {
        const filteredTemplates = category === 'all'
            ? this.templates
            : this.templates.filter(t => t.category === category);
        this.render(filteredTemplates);
        trackEvent('template_category_filtered', { category });
    }

    filterBySearch(query) {
        const lowerCaseQuery = query.toLowerCase();
        const filteredTemplates = this.templates.filter(t =>
            t.name.toLowerCase().includes(lowerCaseQuery) ||
            t.category.toLowerCase().includes(lowerCaseQuery)
        );
        this.render(filteredTemplates);
        trackEvent('template_searched', { query });
    }

    useTemplate(templateId) {
        const template = this.templates.find(t => t.id === templateId);
        if (template) {
            console.log(`Using template: ${template.name}`, template);
            // Redirect to generator with template data pre-filled.
            window.location.href = `generator.html?template=${templateId}`;
            trackEvent('template_used', { templateId: template.id, templateName: template.name });
        }
    }

    showTemplateModal(template) {
        const modal = document.getElementById('template-modal');
        if (modal) {
            modal.querySelector('#modal-template-title').textContent = template.name;
            modal.querySelector('#modal-template-description').textContent = `This is a ${template.chartType} chart for the ${template.category} category.`;
            modal.classList.remove('hidden');

            const closeButton = modal.querySelector('#close-template-modal');
            closeButton.onclick = () => modal.classList.add('hidden');

            const useButton = modal.querySelector('#modal-use-template');
            useButton.onclick = () => this.useTemplate(template.id);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TemplateGallery();
});

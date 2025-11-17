/**
 * @file src/components/TemplateGallery.js
 * @description UI component to render the template gallery.
 * @version 1.0.0
 * @date 2025-11-14
 */

import { useTemplate } from '../templates.js';
import { trackEvent } from '../analytics.js';

/**
 * A class to manage the rendering of the template gallery.
 */
export class TemplateGallery {

    /**
     * Renders a list of templates into a given container.
     * @param {Array<object>} templates - An array of template objects.
     * @param {HTMLElement} container - The container element to render the templates into.
     */
    render(templates, container) {
        if (!container) {
            console.error('Template gallery container not found.');
            return;
        }

        container.innerHTML = ''; // Clear previous content

        if (!templates || templates.length === 0) {
            container.innerHTML = '<p class="text-gray-500">No templates available.</p>';
            return;
        }

        templates.forEach(template => {
            const card = this.createTemplateCard(template);
            container.appendChild(card);
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
        const useButton = card.querySelector('.use-template-btn');
        useButton.addEventListener('click', (event) => {
            const templateId = parseInt(event.target.getAttribute('data-template-id'), 10);
            useTemplate(templateId);
            trackEvent('template_used', { templateId: templateId, templateName: template.name });
        });

        return card;
    }
}

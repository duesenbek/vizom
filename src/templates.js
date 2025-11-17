/**
 * @file src/templates.js
 * @description Handles template gallery display and filtering.
 * @version 1.0.0
 * @date 2025-11-14
 */

// Import global styles and main script
import '../styles/base/design-system.css';
import '../styles/layouts/visual-hierarchy.css';
import '../styles/components/button.css';
import '../styles/pages/home.css';
import '../styles/pages/generator.css';
import '../styles/pages/templates.css';
import '../scripts/main.js';

// Use static template data for MVP (no database yet)
const templates = [
    {
        id: 1,
        name: "Sales Dashboard",
        category: "business",
        chartType: "bar",
        thumbnail: "assets/images/screenshots/sales-dashboard.png",
        data: {
            labels: ["Q1", "Q2", "Q3", "Q4"],
            values: [1200, 1900, 3000, 5000]
        }
    },
    {
        id: 2,
        name: "Monthly Website Traffic",
        category: "marketing",
        chartType: "line",
        thumbnail: "assets/images/screenshots/monthly-traffic.png",
        data: {
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
            values: [2000, 2200, 2500, 2300, 2600, 2800]
        }
    },
    {
        id: 3,
        name: "User Demographics",
        category: "business",
        chartType: "pie",
        thumbnail: "assets/images/screenshots/user-demographics.png",
        data: {
            labels: ["18-24", "25-34", "35-44", "45+"],
            values: [30, 45, 15, 10]
        }
    }
];

/**
 * Loads all templates into the gallery.
 * This is the main function to render the initial state.
 */
export function loadTemplates() {
    const templateGrid = document.getElementById('template-grid');
    if (!templateGrid) {
        console.error('Template grid container not found.');
        return;
    }
    templateGrid.innerHTML = ''; // Clear existing templates
    templates.forEach(template => {
        const card = createTemplateCard(template);
        templateGrid.appendChild(card);
    });
}

/**
 * Filters templates by a given category.
 * @param {string} category - The category to filter by ('all', 'business', 'marketing', etc.)
 */
export function filterTemplates(category) {
    const templateGrid = document.getElementById('template-grid');
    if (!templateGrid) return;

    const filteredTemplates = category === 'all' 
        ? templates 
        : templates.filter(t => t.category === category);
    
    templateGrid.innerHTML = ''; // Clear and re-render
    filteredTemplates.forEach(template => {
        const card = createTemplateCard(template);
        templateGrid.appendChild(card);
    });
}

/**
 * Handles the action of using a selected template.
 * For MVP, it logs the action to the console.
 * @param {number} templateId - The ID of the template to use.
 */
export function useTemplate(templateId) {
    const template = templates.find(t => t.id === templateId);
    if (template) {
        console.log(`Using template: ${template.name}`, template);
        // Future improvement: Redirect to generator with template data pre-filled.
        // window.location.href = `generator.html?template=${templateId}`;
    }
}

/**
 * Helper function to create a single template card element.
 * @param {object} template - The template data object.
 * @returns {HTMLElement} - The card element.
 */
function createTemplateCard(template) {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-lg shadow-md overflow-hidden';
    
    card.innerHTML = `
        <img src="${template.thumbnail}" alt="${template.name}" class="w-full h-32 object-cover">
        <div class="p-4">
            <h3 class="text-lg font-semibold">${template.name}</h3>
            <p class="text-sm text-gray-500 capitalize">${template.category}</p>
            <button class="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 use-template-btn">
                Use Template
            </button>
        </div>
    `;

    const useButton = card.querySelector('.use-template-btn');
    useButton.addEventListener('click', () => useTemplate(template.id));

    return card;
}

// Initial load when the script is executed
document.addEventListener('DOMContentLoaded', loadTemplates);

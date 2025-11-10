import { TEMPLATE_CATEGORIES, VISUAL_TYPES } from './constants.js';
import { ValidationError, TemplateNotFoundError, TemplateInitializationError } from './errors.js';
import { sanitizePrompt, validateConfig } from './utils.js';

/**
 * Template class representing a single chart template
 */
export class Template {
    #data;

    constructor(config) {
        validateConfig(config);
        this.#data = {
            ...config,
            prompt: sanitizePrompt(config.prompt)
        };
    }

    get title() { return this.#data.title; }
    get category() { return this.#data.category; }
    get visualType() { return this.#data.visualType; }
    get description() { return this.#data.description; }
    get prompt() { return this.#data.prompt; }

    toJSON() {
        return { ...this.#data };
    }
}

/**
 * Registry class for managing templates
 */
export class TemplateRegistry {
    #templates = new Map();

    constructor(initialTemplates = {}) {
        this.initializeTemplates(initialTemplates);
    }

    initializeTemplates(templates) {
        try {
            Object.entries(templates).forEach(([id, config]) => {
                this.addTemplate(id, config);
            });
        } catch (error) {
            throw new TemplateInitializationError('Failed to initialize templates', error);
        }
    }

    addTemplate(id, config) {
        try {
            const template = new Template(config);
            this.#templates.set(id, template);
        } catch (error) {
            throw new ValidationError(`Failed to add template ${id}`, error);
        }
    }

    getTemplate(id) {
        const template = this.#templates.get(id);
        if (!template) {
            throw new TemplateNotFoundError(id);
        }
        return template;
    }

    getTemplatesByCategory(category) {
        if (!Object.values(TEMPLATE_CATEGORIES).includes(category)) {
            throw new ValidationError(`Invalid category: ${category}`);
        }
        
        return Array.from(this.#templates.entries())
            .filter(([_, template]) => template.category === category)
            .map(([id, template]) => ({ id, ...template.toJSON() }));
    }

    getAllTemplates() {
        return Array.from(this.#templates.entries())
            .map(([id, template]) => ({ id, ...template.toJSON() }));
    }

    clear() {
        this.#templates.clear();
    }

    size() {
        return this.#templates.size;
    }
}
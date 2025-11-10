// Custom error types for better error handling
export class TemplateError extends Error {
    constructor(message, type, details = {}) {
        super(message);
        this.name = 'TemplateError';
        this.type = type;
        this.details = details;
        this.timestamp = new Date();
    }
}

export class ValidationError extends TemplateError {
    constructor(message, details) {
        super(message, 'VALIDATION_ERROR', details);
        this.name = 'ValidationError';
    }
}

export class TemplateNotFoundError extends TemplateError {
    constructor(templateId) {
        super(`Template not found: ${templateId}`, 'NOT_FOUND_ERROR', { templateId });
        this.name = 'TemplateNotFoundError';
    }
}

export class TemplateInitializationError extends TemplateError {
    constructor(message, originalError) {
        super(message, 'INITIALIZATION_ERROR', { originalError });
        this.name = 'TemplateInitializationError';
    }
}
// Utils for template management
export const sanitizePrompt = (prompt) => {
    if (typeof prompt !== 'string') {
        throw new TypeError('Prompt must be a string');
    }
    return prompt
        .trim()
        .replace(/[<>]/g, '') // Remove potential HTML
        .replace(/[\u0000-\u001F\u007F-\u009F]/g, ''); // Remove control characters
};

export const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

export const generateTemplateId = (title) => {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
};

export const getCategoryStyle = (category) => {
    const styles = {
        business: 'bg-blue-100 text-blue-700',
        academic: 'bg-green-100 text-green-700',
        financial: 'bg-purple-100 text-purple-700',
        scientific: 'bg-orange-100 text-orange-700'
    };
    return styles[category] || 'bg-gray-100 text-gray-700';
};

export const getVisualTypeStyle = (visualType) => {
    const styles = {
        dashboard: 'bg-indigo-100 text-indigo-700',
        line: 'bg-cyan-100 text-cyan-700',
        pie: 'bg-pink-100 text-pink-700',
        table: 'bg-amber-100 text-amber-700',
        bar: 'bg-lime-100 text-lime-700'
    };
    return styles[visualType] || 'bg-gray-100 text-gray-700';
};

export const validateConfig = (config) => {
    const requiredFields = ['title', 'category', 'visualType', 'description', 'prompt'];
    const missingFields = requiredFields.filter(field => !config[field]);
    
    if (missingFields.length > 0) {
        throw new ValidationError(`Missing required fields: ${missingFields.join(', ')}`);
    }

    // Additional validation can be added here
    return true;
};
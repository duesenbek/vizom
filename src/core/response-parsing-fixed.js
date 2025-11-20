/**
 * Response Parsing System - Fixed Version
 * Robust JSON parsing with validation, fallback strategies, and error recovery
 */
/**
 * JSON Validator with Schema Support
 */
export class JSONValidator {
    /**
     * Validate JSON data against schema
     */
    static validate(data, schema) {
        const errors = [];
        const warnings = [];
        this.validateValue(data, schema, '', errors, warnings);
        return {
            isValid: errors.length === 0,
            errors,
            warnings
        };
    }
    static validateValue(value, schema, path, errors, warnings) {
        // Type validation
        if (schema.type === 'object') {
            if (typeof value !== 'object' || value === null || Array.isArray(value)) {
                errors.push(`${path}: Expected object, got ${typeof value}`);
                return;
            }
            // Required properties
            if (schema.required) {
                schema.required.forEach(prop => {
                    if (!(prop in value)) {
                        errors.push(`${path}.${prop}: Required property missing`);
                    }
                });
            }
            // Properties validation
            if (schema.properties) {
                Object.entries(schema.properties).forEach(([prop, propSchema]) => {
                    if (prop in value) {
                        this.validateValue(value[prop], propSchema, path ? `${path}.${prop}` : prop, errors, warnings);
                    }
                });
            }
            // Additional properties
            if (schema.additionalProperties === false) {
                const allowedProps = new Set(Object.keys(schema.properties || {}));
                Object.keys(value).forEach(prop => {
                    if (!allowedProps.has(prop)) {
                        errors.push(`${path}.${prop}: Additional property not allowed`);
                    }
                });
            }
        }
        else if (schema.type === 'array') {
            if (!Array.isArray(value)) {
                errors.push(`${path}: Expected array, got ${typeof value}`);
                return;
            }
            // Length validation
            if (schema.minLength !== undefined && value.length < schema.minLength) {
                errors.push(`${path}: Array length ${value.length} is less than minimum ${schema.minLength}`);
            }
            if (schema.maxLength !== undefined && value.length > schema.maxLength) {
                errors.push(`${path}: Array length ${value.length} exceeds maximum ${schema.maxLength}`);
            }
            // Items validation
            if (schema.items) {
                value.forEach((item, index) => {
                    this.validateValue(item, schema.items, `${path}[${index}]`, errors, warnings);
                });
            }
        }
        else if (schema.type === 'string') {
            if (typeof value !== 'string') {
                errors.push(`${path}: Expected string, got ${typeof value}`);
                return;
            }
            if (schema.minLength !== undefined && value.length < schema.minLength) {
                errors.push(`${path}: String length ${value.length} is less than minimum ${schema.minLength}`);
            }
            if (schema.maxLength !== undefined && value.length > schema.maxLength) {
                errors.push(`${path}: String length ${value.length} exceeds maximum ${schema.maxLength}`);
            }
            if (schema.pattern && !new RegExp(schema.pattern).test(value)) {
                errors.push(`${path}: String does not match required pattern`);
            }
        }
        else if (schema.type === 'number') {
            if (typeof value !== 'number') {
                errors.push(`${path}: Expected number, got ${typeof value}`);
                return;
            }
            if (schema.minimum !== undefined && value < schema.minimum) {
                errors.push(`${path}: Number ${value} is less than minimum ${schema.minimum}`);
            }
            if (schema.maximum !== undefined && value > schema.maximum) {
                errors.push(`${path}: Number ${value} exceeds maximum ${schema.maximum}`);
            }
        }
        else if (schema.type === 'boolean') {
            if (typeof value !== 'boolean') {
                errors.push(`${path}: Expected boolean, got ${typeof value}`);
            }
        }
    }
}
/**
 * Response Parser with Multiple Fallback Strategies
 */
export class ResponseParser {
    constructor() {
        this.fallbackStrategies = [];
        this.initializeFallbackStrategies();
    }
    /**
     * Parse API response with comprehensive error handling
     */
    async parse(response, schema, context = 'API response') {
        const startTime = Date.now();
        const metadata = {
            parseTime: 0,
            responseLength: response.length,
            validationPassed: false,
            fallbackUsed: false,
            confidence: 0
        };
        let attemptedFixes = [];
        let lastError = null;
        // Try direct JSON parsing first
        try {
            const data = JSON.parse(response);
            const validationResult = schema ? JSONValidator.validate(data, schema) : { isValid: true, errors: [], warnings: [] };
            metadata.parseTime = Date.now() - startTime;
            metadata.validationPassed = validationResult.isValid;
            metadata.confidence = this.calculateConfidence(response, validationResult);
            if (validationResult.isValid) {
                return {
                    success: true,
                    data,
                    metadata
                };
            }
            else {
                // Validation failed, try fallbacks
                lastError = {
                    code: 'VALIDATION_FAILED',
                    message: `JSON validation failed: ${validationResult.errors.join(', ')}`,
                    originalResponse: response,
                    attemptedFixes,
                    suggestions: this.generateSuggestions(validationResult.errors)
                };
            }
        }
        catch (error) {
            lastError = {
                code: 'JSON_PARSE_ERROR',
                message: `JSON parsing failed: ${error.message}`,
                originalResponse: response,
                attemptedFixes,
                suggestions: ['Check if response is valid JSON', 'Try cleaning up the response']
            };
        }
        // Try fallback strategies
        for (const strategy of this.fallbackStrategies.sort((a, b) => a.priority - b.priority)) {
            if (!lastError || !strategy.canHandle(lastError, response)) {
                continue;
            }
            attemptedFixes.push(strategy.name);
            try {
                const fallbackData = await strategy.execute(response);
                const validationResult = schema ? JSONValidator.validate(fallbackData, schema) : { isValid: true, errors: [], warnings: [] };
                if (validationResult.isValid) {
                    metadata.parseTime = Date.now() - startTime;
                    metadata.validationPassed = validationResult.isValid;
                    metadata.fallbackUsed = true;
                    metadata.confidence = this.calculateConfidence(response, validationResult) * 0.8; // Lower confidence for fallbacks
                    return {
                        success: true,
                        data: fallbackData,
                        metadata
                    };
                }
            }
            catch (fallbackError) {
                console.warn(`Fallback strategy "${strategy.name}" failed:`, fallbackError.message);
                continue;
            }
        }
        // All strategies failed
        metadata.parseTime = Date.now() - startTime;
        metadata.confidence = 0;
        return {
            success: false,
            error: lastError,
            metadata
        };
    }
    initializeFallbackStrategies() {
        this.fallbackStrategies = [
            {
                name: 'Clean and Retry',
                priority: 1,
                canHandle: (error, response) => error.code === 'JSON_PARSE_ERROR',
                execute: async (response) => {
                    // Clean common JSON issues
                    const cleaned = response
                        .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove control characters
                        .replace(/,\s*}/g, '}') // Remove trailing commas
                        .replace(/,\s*]/g, ']') // Remove trailing commas in arrays
                        .replace(/'/g, '"') // Replace single quotes with double quotes
                        .trim();
                    return JSON.parse(cleaned);
                }
            },
            {
                name: 'Extract JSON from Markdown',
                priority: 2,
                canHandle: (error, response) => {
                    return response.includes('```') || response.includes('json');
                },
                execute: async (response) => {
                    // Extract JSON from markdown code blocks
                    const jsonBlockMatch = response.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
                    if (jsonBlockMatch) {
                        return JSON.parse(jsonBlockMatch[1]);
                    }
                    // Try to find JSON-like structures
                    const jsonMatch = response.match(/\{[\s\S]*\}/);
                    if (jsonMatch) {
                        return JSON.parse(jsonMatch[0]);
                    }
                    throw new Error('No JSON block found in response');
                }
            },
            {
                name: 'Partial JSON Recovery',
                priority: 3,
                canHandle: (error, response) => error.code === 'JSON_PARSE_ERROR',
                execute: async (response) => {
                    // Try to find and fix common JSON syntax errors
                    let fixed = response;
                    // Fix unescaped quotes in strings
                    fixed = fixed.replace(/"([^"]*)"([^"]*?)"/g, (match, p1, p2) => {
                        if (p2.includes('"') && !p2.includes('\\"')) {
                            return `"${p1}"${p2.replace(/"/g, '\\"')}"`;
                        }
                        return match;
                    });
                    // Fix missing quotes around property names
                    fixed = fixed.replace(/(\w+):/g, '"$1":');
                    // Fix trailing commas
                    fixed = fixed.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
                    return JSON.parse(fixed);
                }
            },
            {
                name: 'Schema-Based Reconstruction',
                priority: 4,
                canHandle: (error, response) => error.code === 'VALIDATION_FAILED',
                execute: async (response) => {
                    // Try to extract valid parts and reconstruct based on schema
                    const partial = JSON.parse(response);
                    // Return a basic structure that matches expected schema
                    return {
                        config: partial.config || { type: 'bar', data: { labels: [], datasets: [] }, options: {} },
                        metadata: partial.metadata || { chartType: 'unknown', dataPoints: 0, recommendations: [], generatedAt: new Date().toISOString() }
                    };
                }
            },
            {
                name: 'Minimal Fallback',
                priority: 5,
                canHandle: () => true, // Always available as last resort
                execute: async () => {
                    // Return minimal valid structure
                    return {
                        config: {
                            type: 'bar',
                            data: { labels: ['Error'], datasets: [{ data: [0] }] },
                            options: { responsive: true }
                        },
                        metadata: {
                            chartType: 'fallback',
                            dataPoints: 1,
                            recommendations: ['API response could not be parsed'],
                            generatedAt: new Date().toISOString()
                        }
                    };
                }
            }
        ];
    }
    calculateConfidence(response, validationResult) {
        let confidence = 1.0;
        // Reduce confidence based on validation errors
        confidence -= validationResult.errors.length * 0.2;
        confidence -= validationResult.warnings.length * 0.1;
        // Reduce confidence based on response cleanliness
        if (response.includes('```'))
            confidence -= 0.1;
        if (response.includes('AI:'))
            confidence -= 0.1;
        if (response.length > 10000)
            confidence -= 0.1; // Very long responses might include extra text
        return Math.max(0, confidence);
    }
    generateSuggestions(errors) {
        const suggestions = new Set();
        errors.forEach(error => {
            if (error.includes('missing')) {
                suggestions.add('Ensure all required properties are included');
            }
            if (error.includes('type')) {
                suggestions.add('Check data types for all properties');
            }
            if (error.includes('pattern')) {
                suggestions.add('Verify string formats match required patterns');
            }
        });
        return Array.from(suggestions);
    }
}
/**
 * Response Parsing Service
 */
export class ResponseParsingService {
    constructor() {
        this.parser = new ResponseParser();
    }
    /**
     * Parse chart generation response
     */
    async parseChartResponse(response) {
        const schema = {
            type: 'object',
            required: ['config', 'metadata'],
            properties: {
                config: {
                    type: 'object',
                    required: ['type', 'data', 'options'],
                    properties: {
                        type: { type: 'string' },
                        data: {
                            type: 'object',
                            required: ['labels', 'datasets'],
                            properties: {
                                labels: { type: 'array', items: { type: 'string' } },
                                datasets: { type: 'array' }
                            }
                        },
                        options: { type: 'object' }
                    }
                },
                metadata: {
                    type: 'object',
                    required: ['chartType', 'generatedAt'],
                    properties: {
                        chartType: { type: 'string' },
                        dataPoints: { type: 'number' },
                        recommendations: { type: 'array', items: { type: 'string' } },
                        generatedAt: { type: 'string', pattern: '^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}' }
                    }
                }
            },
            additionalProperties: false
        };
        return this.parser.parse(response, schema, 'chart generation');
    }
    /**
     * Parse data analysis response
     */
    async parseAnalysisResponse(response) {
        const schema = {
            type: 'object',
            required: ['summary', 'insights', 'recommendations', 'visualizations'],
            properties: {
                summary: { type: 'object' },
                insights: { type: 'array', items: { type: 'string' } },
                recommendations: { type: 'array', items: { type: 'string' } },
                visualizations: { type: 'array', items: { type: 'string' } }
            },
            additionalProperties: false
        };
        return this.parser.parse(response, schema, 'data analysis');
    }
    /**
     * Parse generic response
     */
    async parseGenericResponse(response) {
        return this.parser.parse(response, undefined, 'generic response');
    }
    /**
     * Validate response structure without parsing
     */
    validateResponseStructure(response) {
        const issues = [];
        let isValidJSON = false;
        let hasValidStructure = false;
        let likelyChartConfig = false;
        try {
            const parsed = JSON.parse(response);
            isValidJSON = true;
            // Check for common chart structure
            if (parsed.config && parsed.data && parsed.options) {
                likelyChartConfig = true;
            }
            if (parsed.config || parsed.metadata || parsed.summary) {
                hasValidStructure = true;
            }
        }
        catch (error) {
            issues.push(`Invalid JSON: ${error.message}`);
        }
        // Check for common issues
        if (response.includes('```')) {
            issues.push('Response contains markdown code blocks');
        }
        if (response.includes('AI:')) {
            issues.push('Response contains AI conversation markers');
        }
        if (response.length > 50000) {
            issues.push('Response is unusually long');
        }
        return {
            isValidJSON,
            hasValidStructure,
            likelyChartConfig,
            issues
        };
    }
}
// Export singleton instance
export const responseParsing = new ResponseParsingService();

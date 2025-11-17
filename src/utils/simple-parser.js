// A simple, non-AI parser to extract chart data from a text prompt.
// This is a temporary solution to bypass the broken AI client.

/**
 * Tries to parse labels and data from a string.
 * Example format: "Show data [10, 20, 30] for labels [Jan, Feb, Mar]"
 * @param {string} prompt The user's text prompt.
 * @returns {{labels: string[], data: number[]}} Parsed labels and data.
 */
export function simpleParse(prompt) {
    console.log('Attempting to parse prompt:', prompt);

    const text = (prompt || '').trim();
    if (!text) {
        return { labels: [], data: [] };
    }

    // Handle shorthand "[labels], [values]" syntax
    const pairResult = tryParseArrayPairLiteral(text);
    if (pairResult) {
        console.log('Parsed labels:', pairResult.labels);
        console.log('Parsed data:', pairResult.data);
        return pairResult;
    }

    if (isLikelyJSON(text)) {
        const jsonResult = parseJSONPayload(text);
        console.log('Parsed labels:', jsonResult.labels);
        console.log('Parsed data:', jsonResult.data);
        return jsonResult;
    }

    const legacyResult = parseLegacyFormat(text);
    console.log('Parsed labels:', legacyResult.labels);
    console.log('Parsed data:', legacyResult.data);
    return legacyResult;
}

function parseLegacyFormat(text) {
    const labelsMatch = text.match(/labels \[(.*?)\]/i);
    const dataMatch = text.match(/data \[(.*?)\]/i);

    let labels = [];
    let data = [];

    if (labelsMatch && labelsMatch[1]) {
        labels = labelsMatch[1].split(',').map(s => s.trim());
    }

    if (dataMatch && dataMatch[1]) {
        data = dataMatch[1]
            .split(',')
            .map(s => toNumber(s.trim()))
            .filter((n) => !Number.isNaN(n));
    }

    return { labels, data };
}

function parseJSONPayload(text) {
    let parsed;
    try {
        parsed = JSON.parse(text);
    } catch (error) {
        const err = new Error('Invalid JSON format. Example: [{"label":"Jan","value":10}] or {"labels":["Jan"],"data":[10]}');
        err.code = 'invalid_json_prompt';
        throw err;
    }

    const normalized = normalizeParsedJSON(parsed);
    if (!normalized || normalized.labels.length === 0 || normalized.data.length === 0) {
        const err = new Error('JSON is missing labels/data arrays. Use [{"label":"Jan","value":10}] or {"labels":["Jan"],"data":[10]}');
        err.code = 'invalid_prompt_format';
        throw err;
    }

    return normalized;
}

function normalizeParsedJSON(value) {
    if (Array.isArray(value)) {
        if (value.length === 2 && Array.isArray(value[0]) && Array.isArray(value[1])) {
            return buildFromLabelDataArrays(value[0], value[1]);
        }

        if (value.every((item) => Array.isArray(item) && item.length >= 2)) {
            const labels = [];
            const data = [];
            value.forEach((item, index) => {
                const label = String(item[0] ?? `Item ${index + 1}`);
                const numericValue = toNumber(item[1]);
                if (!Number.isNaN(numericValue)) {
                    labels.push(label);
                    data.push(numericValue);
                }
            });
            return { labels, data };
        }

        if (value.every((item) => isLabelValueObject(item))) {
            return buildFromLabelValueObjects(value);
        }
    }

    if (typeof value === 'object' && value !== null) {
        const labels = value.labels || value.categories;
        const data = value.data || value.values;
        if (Array.isArray(labels) && Array.isArray(data)) {
            return buildFromLabelDataArrays(labels, data);
        }

        if (Array.isArray(value.points)) {
            return buildFromLabelValueObjects(value.points);
        }
    }

    return null;
}

function buildFromLabelValueObjects(items) {
    const labels = [];
    const data = [];

    items.forEach((item, index) => {
        if (!item || typeof item !== 'object') return;
        const label = item.label ?? item.name ?? `Item ${index + 1}`;
        const numericValue = toNumber(item.value ?? item.amount ?? item.metric ?? item.y);
        if (!Number.isNaN(numericValue) && label !== undefined) {
            labels.push(String(label));
            data.push(numericValue);
        }
    });

    return { labels, data };
}

function buildFromLabelDataArrays(labelArray, dataArray) {
    const labels = Array.isArray(labelArray) ? labelArray.map((label, index) => String(label ?? `Item ${index + 1}`)) : [];
    const data = Array.isArray(dataArray)
        ? dataArray
            .map((value) => toNumber(value))
            .filter((n) => !Number.isNaN(n))
        : [];

    if (labels.length !== data.length) {
        const minLength = Math.min(labels.length, data.length);
        return {
            labels: labels.slice(0, minLength),
            data: data.slice(0, minLength)
        };
    }

    return { labels, data };
}

function tryParseArrayPairLiteral(text) {
    const match = text.match(/^\s*(\[[^\]]*\])\s*,\s*(\[[^\]]*\])\s*$/s);
    if (!match) {
        return null;
    }

    try {
        const labelsArray = JSON.parse(match[1]);
        const dataArray = JSON.parse(match[2]);
        return buildFromLabelDataArrays(labelsArray, dataArray);
    } catch (error) {
        const err = new Error('Invalid array pair format. Example: ["Jan","Feb"], [10,20]');
        err.code = 'invalid_json_prompt';
        throw err;
    }
}

function isLikelyJSON(text) {
    const firstChar = text.trim()[0];
    return firstChar === '{' || firstChar === '[';
}

function isLabelValueObject(value) {
    return typeof value === 'object' && value !== null && ('label' in value || 'name' in value) && ('value' in value || 'amount' in value || 'metric' in value || 'y' in value);
}

function toNumber(value) {
    if (typeof value === 'number' && !Number.isNaN(value)) {
        return value;
    }

    if (typeof value === 'string') {
        const cleaned = value.replace(/[^0-9.-]/g, '');
        const parsed = parseFloat(cleaned);
        return Number.isNaN(parsed) ? NaN : parsed;
    }

    return NaN;
}

/**
 * Smart Data Parser - Understands messy user inputs
 * Handles: natural language, CSV, tables, JSON, key-value pairs
 */

/**
 * Main parsing function - tries multiple strategies
 */
export function parseUserInput(input) {
  if (!input || typeof input !== 'string') {
    return { success: false, error: 'Empty input' };
  }
  
  const text = input.trim();
  console.log('[SmartParser] Parsing input:', text.substring(0, 100) + '...');
  
  // Try each parser in order of specificity
  const parsers = [
    { name: 'JSON', fn: parseJSON },
    { name: 'CSV', fn: parseCSV },
    { name: 'KeyValue', fn: parseKeyValue },
    { name: 'Table', fn: parseTable },
    { name: 'NaturalLanguage', fn: parseNaturalLanguage },
    { name: 'NumbersOnly', fn: parseNumbersOnly },
  ];
  
  for (const parser of parsers) {
    try {
      const result = parser.fn(text);
      if (result && result.labels?.length >= 2 && result.data?.length >= 2) {
        console.log(`[SmartParser] Success with ${parser.name}:`, result);
        return {
          success: true,
          ...result,
          parser: parser.name
        };
      }
    } catch (e) {
      console.log(`[SmartParser] ${parser.name} failed:`, e.message);
    }
  }
  
  // Fallback: generate sample data
  console.log('[SmartParser] All parsers failed, using fallback');
  return {
    success: true,
    labels: ['Category A', 'Category B', 'Category C', 'Category D'],
    data: [25, 35, 20, 20],
    title: 'Sample Data',
    parser: 'fallback',
    warning: 'Could not parse your data. Showing sample chart.'
  };
}

/**
 * Parse JSON format
 * Supports: {"labels":[], "data":[]}, [{label, value}], [[labels], [values]]
 */
function parseJSON(text) {
  if (!text.trim().startsWith('{') && !text.trim().startsWith('[')) {
    return null;
  }
  
  const json = JSON.parse(text);
  
  // Format: {"labels": [...], "data": [...]}
  if (json.labels && json.data) {
    return {
      labels: json.labels.map(String),
      data: json.data.map(Number),
      title: json.title || null
    };
  }
  
  // Format: [{"label": "A", "value": 10}, ...]
  if (Array.isArray(json) && json[0]?.label !== undefined) {
    return {
      labels: json.map(item => item.label || item.name || item.category || ''),
      data: json.map(item => Number(item.value || item.amount || item.count || item.percent || 0)),
      title: null
    };
  }
  
  // Format: [["A", "B"], [10, 20]]
  if (Array.isArray(json) && Array.isArray(json[0]) && Array.isArray(json[1])) {
    return {
      labels: json[0].map(String),
      data: json[1].map(Number),
      title: null
    };
  }
  
  // Format: {"A": 10, "B": 20}
  if (typeof json === 'object' && !Array.isArray(json)) {
    const entries = Object.entries(json).filter(([k, v]) => typeof v === 'number');
    if (entries.length >= 2) {
      return {
        labels: entries.map(([k]) => k),
        data: entries.map(([, v]) => v),
        title: null
      };
    }
  }
  
  return null;
}

/**
 * Parse CSV format
 * Supports: "Label,Value\nA,10\nB,20" or "A,B,C\n10,20,30"
 */
function parseCSV(text) {
  const lines = text.split(/[\n\r]+/).filter(l => l.trim());
  if (lines.length < 2) return null;
  
  // Detect delimiter
  const delimiters = [',', '\t', ';', '|'];
  let delimiter = ',';
  for (const d of delimiters) {
    if (lines[0].includes(d)) {
      delimiter = d;
      break;
    }
  }
  
  const rows = lines.map(line => 
    line.split(delimiter).map(cell => cell.trim().replace(/^["']|["']$/g, ''))
  );
  
  // Check if first row is header
  const firstRowAllText = rows[0].every(cell => isNaN(parseFloat(cell)));
  const secondRowHasNumbers = rows[1]?.some(cell => !isNaN(parseFloat(cell)));
  
  if (firstRowAllText && secondRowHasNumbers) {
    // Vertical format: Header row + data rows
    // Label, Value
    // A, 10
    // B, 20
    if (rows[0].length === 2) {
      return {
        labels: rows.slice(1).map(r => r[0]),
        data: rows.slice(1).map(r => parseFloat(r[1]) || 0),
        title: null
      };
    }
    
    // Multiple columns: Category, Jan, Feb, Mar
    // Sales, 100, 200, 300
    return {
      labels: rows[0].slice(1),
      data: rows[1].slice(1).map(v => parseFloat(v) || 0),
      title: rows[1][0] || null,
      multiSeries: rows.length > 2 ? rows.slice(1).map(r => ({
        label: r[0],
        data: r.slice(1).map(v => parseFloat(v) || 0)
      })) : null
    };
  }
  
  // Horizontal format: A, B, C \n 10, 20, 30
  if (rows.length === 2 && firstRowAllText) {
    return {
      labels: rows[0],
      data: rows[1].map(v => parseFloat(v) || 0),
      title: null
    };
  }
  
  return null;
}

/**
 * Parse key-value pairs
 * Supports: "JavaScript: 0%, Python: 75%" or "Sales = 100, Revenue = 200"
 */
function parseKeyValue(text) {
  // Pattern: "Label: Value" or "Label = Value"
  const patterns = [
    /([A-Za-zА-Яа-яёЁ0-9\s_-]+):\s*([\d,.]+)\s*%?/g,
    /([A-Za-zА-Яа-яёЁ0-9\s_-]+)\s*=\s*([\d,.]+)\s*%?/g,
    /([A-Za-zА-Яа-яёЁ0-9\s_-]+)\s*-\s*([\d,.]+)\s*%?/g,
  ];
  
  for (const pattern of patterns) {
    const matches = [...text.matchAll(pattern)];
    if (matches.length >= 2) {
      return {
        labels: matches.map(m => m[1].trim()),
        data: matches.map(m => parseFloat(m[2].replace(/,/g, '')) || 0),
        title: null,
        isPercentage: text.includes('%')
      };
    }
  }
  
  return null;
}

/**
 * Parse table-like format
 * Supports: "| A | 10 |" or "A    10"
 */
function parseTable(text) {
  const lines = text.split(/[\n\r]+/).filter(l => l.trim());
  if (lines.length < 2) return null;
  
  const results = [];
  
  for (const line of lines) {
    // Remove table borders
    const cleaned = line.replace(/^\||\|$/g, '').trim();
    
    // Split by | or multiple spaces
    const parts = cleaned.split(/\||\s{2,}/).map(p => p.trim()).filter(Boolean);
    
    if (parts.length >= 2) {
      const label = parts[0];
      const value = parseFloat(parts[parts.length - 1].replace(/[^0-9.-]/g, ''));
      
      if (!isNaN(value)) {
        results.push({ label, value });
      }
    }
  }
  
  if (results.length >= 2) {
    return {
      labels: results.map(r => r.label),
      data: results.map(r => r.value),
      title: null
    };
  }
  
  return null;
}

/**
 * Parse natural language with numbers
 * Supports: "Sales were 100 in January, 200 in February"
 */
function parseNaturalLanguage(text) {
  // Extract word-number pairs
  const wordNumPattern = /([A-Za-zА-Яа-яёЁ]+)\s+(?:was|were|is|are|had|has|got|reached|hit)?\s*([\d,.]+)/gi;
  const numWordPattern = /([\d,.]+)\s+(?:for|in|of|on)?\s*([A-Za-zА-Яа-яёЁ]+)/gi;
  
  let matches = [...text.matchAll(wordNumPattern)];
  if (matches.length < 2) {
    matches = [...text.matchAll(numWordPattern)].map(m => [m[0], m[2], m[1]]);
  }
  
  if (matches.length >= 2) {
    return {
      labels: matches.map(m => m[1]),
      data: matches.map(m => parseFloat(m[2].replace(/,/g, '')) || 0),
      title: null
    };
  }
  
  // Try extracting any word followed by number
  const simplePattern = /([A-Za-zА-Яа-яёЁ]{2,})\s*([\d,.]+)/g;
  matches = [...text.matchAll(simplePattern)];
  
  if (matches.length >= 2) {
    return {
      labels: matches.map(m => m[1]),
      data: matches.map(m => parseFloat(m[2].replace(/,/g, '')) || 0),
      title: null
    };
  }
  
  return null;
}

/**
 * Parse numbers only - last resort
 * Generates labels automatically
 */
function parseNumbersOnly(text) {
  const numbers = text.match(/[\d,.]+/g)
    ?.map(n => parseFloat(n.replace(/,/g, '')))
    .filter(n => !isNaN(n) && n > 0);
  
  if (!numbers || numbers.length < 2) return null;
  
  // Extract any words for potential labels
  const words = text.match(/[A-Za-zА-Яа-яёЁ]{2,}/g) || [];
  
  // Generate smart labels
  let labels;
  if (words.length >= numbers.length) {
    labels = words.slice(0, numbers.length);
  } else {
    // Use context-aware labels
    const contextLabels = detectContextLabels(text, numbers.length);
    labels = contextLabels;
  }
  
  return {
    labels,
    data: numbers.slice(0, 8),
    title: null
  };
}

/**
 * Detect context and generate appropriate labels
 */
function detectContextLabels(text, count) {
  const lowerText = text.toLowerCase();
  
  // Time-based
  if (/month|quarter|year|week|day/i.test(lowerText)) {
    if (count <= 4) return ['Q1', 'Q2', 'Q3', 'Q4'].slice(0, count);
    if (count <= 7) return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].slice(0, count);
    return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].slice(0, count);
  }
  
  // Categories
  if (/categor|type|group|segment/i.test(lowerText)) {
    return Array.from({ length: count }, (_, i) => `Category ${String.fromCharCode(65 + i)}`);
  }
  
  // Products
  if (/product|item|sku/i.test(lowerText)) {
    return Array.from({ length: count }, (_, i) => `Product ${i + 1}`);
  }
  
  // Regions
  if (/region|country|city|area/i.test(lowerText)) {
    const regions = ['North', 'South', 'East', 'West', 'Central', 'Northeast', 'Southeast', 'Northwest'];
    return regions.slice(0, count);
  }
  
  // Default
  return Array.from({ length: count }, (_, i) => `Item ${i + 1}`);
}

/**
 * Suggest best chart type based on data
 */
export function suggestChartType(labels, data) {
  if (!labels || !data) return 'bar';
  
  const count = data.length;
  const sum = data.reduce((a, b) => a + b, 0);
  const allPositive = data.every(d => d >= 0);
  const isPercentage = Math.abs(sum - 100) < 5 || data.every(d => d >= 0 && d <= 1);
  
  // Time series detection
  const timePatterns = ['jan', 'feb', 'mar', 'q1', 'q2', 'mon', 'tue', '2020', '2021', '2022', '2023', '2024'];
  const isTimeSeries = labels.some(l => 
    timePatterns.some(p => l.toString().toLowerCase().includes(p))
  );
  
  if (isTimeSeries) {
    return 'line';
  }
  
  if (isPercentage && allPositive && count <= 6) {
    return 'doughnut';
  }
  
  if (count <= 4 && allPositive) {
    return 'pie';
  }
  
  if (count > 10) {
    return 'line';
  }
  
  return 'bar';
}

/**
 * Clean and normalize labels
 */
export function normalizeLabels(labels) {
  return labels.map(label => {
    if (!label) return 'Unknown';
    
    let cleaned = String(label).trim();
    
    // Capitalize first letter
    cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
    
    // Remove extra whitespace
    cleaned = cleaned.replace(/\s+/g, ' ');
    
    return cleaned;
  });
}

export { parseJSON, parseCSV, parseKeyValue, parseTable, parseNaturalLanguage };

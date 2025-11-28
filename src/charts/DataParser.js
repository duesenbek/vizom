/**
 * DataParser - Extracts structured data from messy user inputs
 * Supports: JSON, CSV, tables, key-value, row-headers, mixed separators, prose
 * 
 * Examples handled:
 * - "item1 item2 item3 \n 1 2 3" (row headers + values)
 * - "A,B,C / 10,20,30" (mixed separators)
 * - "Product | Sales / Apple 100 / Orange 200" (pipe + slash)
 * - "we sold 10 of X and 20 of Y" (unstructured prose)
 */

export class DataParser {
  constructor() {
    this.lastDetectedFormat = null;
    this.lastConfidence = 0;
    this.lastDataType = null;
  }

  /**
   * Detect input format and confidence level
   * @param {string} input - Raw user input
   * @returns {{ format: string, confidence: number, hints: object, dataType: string }}
   */
  detect(input) {
    if (!input || typeof input !== 'string') {
      return { format: 'unknown', confidence: 0, hints: {}, dataType: 'unknown' };
    }

    const text = input.trim();
    const detections = [];

    // 1. JSON detection
    if (text.startsWith('{') || text.startsWith('[')) {
      try {
        JSON.parse(text);
        detections.push({ format: 'json', confidence: 0.95, hints: { valid: true } });
      } catch {
        detections.push({ format: 'json', confidence: 0.3, hints: { valid: false, error: 'Invalid JSON' } });
      }
    }

    // 2. Row-headers format: "item1 item2 item3 \n 1 2 3"
    const lines = text.split(/[\n\r]+/).filter(l => l.trim());
    if (lines.length === 2) {
      const firstLineWords = lines[0].trim().split(/[\s,\t]+/).filter(Boolean);
      const secondLineNums = lines[1].trim().split(/[\s,\t]+/).map(s => parseFloat(s.replace(/,/g, ''))).filter(n => !isNaN(n));
      
      if (firstLineWords.length >= 2 && secondLineNums.length >= 2 && 
          firstLineWords.every(w => isNaN(parseFloat(w))) &&
          firstLineWords.length === secondLineNums.length) {
        detections.push({
          format: 'row-headers',
          confidence: 0.92,
          hints: { headers: firstLineWords, values: secondLineNums }
        });
      }
    }

    // 3. Mixed separators: "A,B,C / 10,20,30" or "labels: A,B,C values: 1,2,3"
    const slashParts = text.split(/\s*\/\s*/);
    if (slashParts.length === 2) {
      const part1Items = slashParts[0].split(/[,;\s]+/).filter(Boolean);
      const part2Items = slashParts[1].split(/[,;\s]+/).filter(Boolean);
      
      const part1AllText = part1Items.every(i => isNaN(parseFloat(i.replace(/,/g, ''))));
      const part2AllNums = part2Items.every(i => !isNaN(parseFloat(i.replace(/,/g, ''))));
      
      if (part1AllText && part2AllNums && part1Items.length === part2Items.length) {
        detections.push({
          format: 'mixed-separator',
          confidence: 0.88,
          hints: { 
            labels: part1Items, 
            values: part2Items.map(v => parseFloat(v.replace(/,/g, '')))
          }
        });
      }
    }

    // 4. Pipe + slash format: "Product | Sales / Apple 100 / Orange 200"
    if (text.includes('/') && (text.includes('|') || text.includes(':'))) {
      const segments = text.split(/\s*\/\s*/).filter(Boolean);
      if (segments.length >= 2) {
        const pairs = [];
        for (const seg of segments) {
          // Try to extract label-value pair
          const match = seg.match(/([A-Za-zА-Яа-яёЁ\s]+?)\s*([\d,.]+)\s*$/);
          if (match) {
            pairs.push({ label: match[1].trim(), value: parseFloat(match[2].replace(/,/g, '')) });
          }
        }
        if (pairs.length >= 2) {
          detections.push({
            format: 'pipe-slash',
            confidence: 0.85,
            hints: { pairs }
          });
        }
      }
    }

    // 5. CSV detection (standard)
    if (lines.length >= 2) {
      const delimiters = [',', '\t', ';', '|'];
      for (const d of delimiters) {
        const escapedD = d.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
        const counts = lines.map(l => (l.match(new RegExp(escapedD, 'g')) || []).length);
        if (counts.every(c => c > 0 && c === counts[0])) {
          detections.push({ 
            format: 'csv', 
            confidence: 0.85, 
            hints: { delimiter: d, rows: lines.length, cols: counts[0] + 1 } 
          });
          break;
        }
      }
    }

    // 6. Key-value detection (Label: Value or Label = Value)
    const kvPatterns = [
      { regex: /([A-Za-zА-Яа-яёЁ0-9\s_-]+):\s*([\d,.]+)\s*%?/g, type: 'colon' },
      { regex: /([A-Za-zА-Яа-яёЁ0-9\s_-]+)\s*=\s*([\d,.]+)\s*%?/g, type: 'equals' },
    ];
    for (const { regex, type } of kvPatterns) {
      const matches = [...text.matchAll(regex)];
      if (matches.length >= 2) {
        detections.push({ 
          format: 'keyvalue', 
          confidence: 0.9, 
          hints: { 
            type, 
            pairs: matches.length,
            hasPercent: text.includes('%'),
            sample: matches.slice(0, 3).map(m => ({ label: m[1].trim(), value: m[2] }))
          } 
        });
      }
    }

    // 7. Table detection (| A | 10 |)
    if (text.includes('|')) {
      const tableRows = lines.filter(l => l.includes('|'));
      if (tableRows.length >= 1) {
        detections.push({ format: 'table', confidence: 0.8, hints: { rows: tableRows.length } });
      }
    }

    // 8. Prose/unstructured: "we sold 10 of X and 20 of Y"
    const prosePatterns = [
      /(\d+)\s+(?:of|for|in|on)\s+([A-Za-zА-Яа-яёЁ]+)/gi,  // "10 of X"
      /([A-Za-zА-Яа-яёЁ]+)\s+(?:was|were|is|are|had|has|got|sold|bought|made)\s+(\d+)/gi, // "X was 10"
      /sold\s+(\d+)\s+([A-Za-zА-Яа-яёЁ]+)/gi, // "sold 10 apples"
    ];
    
    for (const pattern of prosePatterns) {
      const matches = [...text.matchAll(pattern)];
      if (matches.length >= 2) {
        detections.push({
          format: 'prose',
          confidence: 0.7,
          hints: {
            pattern: pattern.source,
            matches: matches.map(m => ({ 
              label: isNaN(parseFloat(m[1])) ? m[1] : m[2],
              value: isNaN(parseFloat(m[1])) ? m[2] : m[1]
            }))
          }
        });
        break;
      }
    }

    // 9. Natural language with numbers (fallback)
    const wordNumPattern = /([A-Za-zА-Яа-яёЁ]+)\s+([\d,.]+)/g;
    const nlMatches = [...text.matchAll(wordNumPattern)];
    if (nlMatches.length >= 2) {
      detections.push({ 
        format: 'natural', 
        confidence: 0.6, 
        hints: { 
          pairs: nlMatches.length,
          sample: nlMatches.slice(0, 3).map(m => ({ word: m[1], number: m[2] }))
        } 
      });
    }

    // 10. Numbers only (last resort)
    const numbers = text.match(/[\d,.]+/g);
    if (numbers && numbers.length >= 2) {
      detections.push({ 
        format: 'numbers', 
        confidence: 0.4, 
        hints: { count: numbers.length, values: numbers.slice(0, 5) } 
      });
    }

    // Return highest confidence detection
    detections.sort((a, b) => b.confidence - a.confidence);
    const best = detections[0] || { format: 'unknown', confidence: 0, hints: {} };
    
    // Infer data type
    best.dataType = this._inferDataType(text, best);
    
    this.lastDetectedFormat = best.format;
    this.lastConfidence = best.confidence;
    this.lastDataType = best.dataType;
    
    return best;
  }

  /**
   * Infer data type: categorical, numeric, time-series, percentage, currency
   */
  _inferDataType(text, detection) {
    const lowerText = text.toLowerCase();
    
    // Time-series detection
    const timePatterns = [
      /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\b/i,
      /\b(january|february|march|april|may|june|july|august|september|october|november|december)\b/i,
      /\b(q1|q2|q3|q4)\b/i,
      /\b(mon|tue|wed|thu|fri|sat|sun)\b/i,
      /\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i,
      /\b20[0-9]{2}\b/,
      /\b(week|month|year|quarter|day)\b/i
    ];
    
    if (timePatterns.some(p => p.test(lowerText))) {
      return 'time-series';
    }
    
    // Percentage detection
    if (text.includes('%') || /\b(percent|percentage)\b/i.test(lowerText)) {
      return 'percentage';
    }
    
    // Currency detection
    if (/[$€£¥₽₴]/.test(text) || /\b(dollar|euro|pound|yen|usd|eur|gbp)\b/i.test(lowerText)) {
      return 'currency';
    }
    
    // Ratio/comparison
    if (/\b(vs|versus|compared|ratio)\b/i.test(lowerText)) {
      return 'comparison';
    }
    
    // Check if values suggest categories
    const hints = detection.hints || {};
    if (hints.labels || hints.headers || hints.pairs) {
      return 'categorical';
    }
    
    return 'numeric';
  }

  /**
   * Parse input into structured chart data
   * @param {string} input - Raw user input
   * @returns {{ success: boolean, labels: string[], data: number[], title?: string, metadata?: object }}
   */
  parse(input) {
    const detection = this.detect(input);
    const text = (input || '').trim();

    console.log(`[DataParser] Detected format: ${detection.format} (${(detection.confidence * 100).toFixed(0)}%)`);

    const parsers = {
      'json': () => this._parseJSON(text),
      'row-headers': () => this._parseRowHeaders(text, detection.hints),
      'mixed-separator': () => this._parseMixedSeparator(text, detection.hints),
      'pipe-slash': () => this._parsePipeSlash(text, detection.hints),
      'csv': () => this._parseCSV(text, detection.hints),
      'keyvalue': () => this._parseKeyValue(text, detection.hints),
      'table': () => this._parseTable(text),
      'prose': () => this._parseProse(text, detection.hints),
      'natural': () => this._parseNatural(text),
      'numbers': () => this._parseNumbers(text),
    };

    const parser = parsers[detection.format];
    if (parser) {
      try {
        const result = parser();
        if (result && result.labels?.length >= 2 && result.data?.length >= 2) {
          return {
            success: true,
            ...result,
            dataType: detection.dataType,
            metadata: {
              format: detection.format,
              confidence: detection.confidence,
              dataType: detection.dataType,
              originalLength: text.length
            }
          };
        }
      } catch (e) {
        console.error(`[DataParser] ${detection.format} parser failed:`, e);
      }
    }

    // Fallback
    return this._fallback(text, detection.dataType);
  }

  // === NEW PARSERS ===

  /**
   * Parse row-headers format: "item1 item2 item3 \n 1 2 3"
   */
  _parseRowHeaders(text, hints) {
    if (hints?.headers && hints?.values) {
      return {
        labels: hints.headers,
        data: hints.values,
        title: null
      };
    }
    
    const lines = text.split(/[\n\r]+/).filter(l => l.trim());
    if (lines.length !== 2) return null;
    
    const headers = lines[0].trim().split(/[\s,\t]+/).filter(Boolean);
    const values = lines[1].trim().split(/[\s,\t]+/)
      .map(s => parseFloat(s.replace(/,/g, '')))
      .filter(n => !isNaN(n));
    
    if (headers.length >= 2 && values.length >= 2 && headers.length === values.length) {
      return { labels: headers, data: values, title: null };
    }
    
    return null;
  }

  /**
   * Parse mixed separator format: "A,B,C / 10,20,30"
   */
  _parseMixedSeparator(text, hints) {
    if (hints?.labels && hints?.values) {
      return {
        labels: hints.labels,
        data: hints.values,
        title: null
      };
    }
    
    const slashParts = text.split(/\s*\/\s*/);
    if (slashParts.length !== 2) return null;
    
    const labels = slashParts[0].split(/[,;\s]+/).filter(Boolean);
    const values = slashParts[1].split(/[,;\s]+/)
      .map(v => parseFloat(v.replace(/,/g, '')))
      .filter(n => !isNaN(n));
    
    if (labels.length >= 2 && values.length >= 2) {
      // Match lengths
      const minLen = Math.min(labels.length, values.length);
      return {
        labels: labels.slice(0, minLen),
        data: values.slice(0, minLen),
        title: null
      };
    }
    
    return null;
  }

  /**
   * Parse pipe-slash format: "Product | Sales / Apple 100 / Orange 200"
   */
  _parsePipeSlash(text, hints) {
    if (hints?.pairs && hints.pairs.length >= 2) {
      return {
        labels: hints.pairs.map(p => p.label),
        data: hints.pairs.map(p => p.value),
        title: null
      };
    }
    
    const segments = text.split(/\s*\/\s*/).filter(Boolean);
    const pairs = [];
    
    for (const seg of segments) {
      // Try multiple patterns
      const patterns = [
        /([A-Za-zА-Яа-яёЁ\s]+?)\s*([\d,.]+)\s*$/,  // "Apple 100"
        /^([\d,.]+)\s+([A-Za-zА-Яа-яёЁ\s]+)$/,     // "100 Apple"
      ];
      
      for (const pattern of patterns) {
        const match = seg.match(pattern);
        if (match) {
          const isFirstNum = !isNaN(parseFloat(match[1].replace(/,/g, '')));
          pairs.push({
            label: (isFirstNum ? match[2] : match[1]).trim(),
            value: parseFloat((isFirstNum ? match[1] : match[2]).replace(/,/g, ''))
          });
          break;
        }
      }
    }
    
    if (pairs.length >= 2) {
      return {
        labels: pairs.map(p => p.label),
        data: pairs.map(p => p.value),
        title: null
      };
    }
    
    return null;
  }

  /**
   * Parse prose/unstructured: "we sold 10 of X and 20 of Y"
   */
  _parseProse(text, hints) {
    if (hints?.matches && hints.matches.length >= 2) {
      return {
        labels: hints.matches.map(m => String(m.label)),
        data: hints.matches.map(m => parseFloat(String(m.value).replace(/,/g, ''))),
        title: null
      };
    }
    
    const patterns = [
      { regex: /(\d+)\s+(?:of|for)\s+([A-Za-zА-Яа-яёЁ]+)/gi, labelIdx: 2, valueIdx: 1 },
      { regex: /([A-Za-zА-Яа-яёЁ]+)\s+(?:was|were|is|are|had|has)\s+(\d+)/gi, labelIdx: 1, valueIdx: 2 },
      { regex: /sold\s+(\d+)\s+([A-Za-zА-Яа-яёЁ]+)/gi, labelIdx: 2, valueIdx: 1 },
      { regex: /bought\s+(\d+)\s+([A-Za-zА-Яа-яёЁ]+)/gi, labelIdx: 2, valueIdx: 1 },
      { regex: /made\s+(\d+)\s+([A-Za-zА-Яа-яёЁ]+)/gi, labelIdx: 2, valueIdx: 1 },
    ];
    
    for (const { regex, labelIdx, valueIdx } of patterns) {
      const matches = [...text.matchAll(regex)];
      if (matches.length >= 2) {
        return {
          labels: matches.map(m => m[labelIdx]),
          data: matches.map(m => parseFloat(m[valueIdx])),
          title: null
        };
      }
    }
    
    return null;
  }

  // === Private Parsers ===

  _parseJSON(text) {
    const json = JSON.parse(text);

    // {"labels": [...], "data": [...]}
    if (json.labels && json.data) {
      return {
        labels: json.labels.map(String),
        data: json.data.map(Number),
        title: json.title || null
      };
    }

    // [{"label": "A", "value": 10}, ...]
    if (Array.isArray(json) && json[0]?.label !== undefined) {
      return {
        labels: json.map(item => String(item.label || item.name || item.category || '')),
        data: json.map(item => Number(item.value || item.amount || item.count || 0)),
        title: null
      };
    }

    // [["A", "B"], [10, 20]]
    if (Array.isArray(json) && Array.isArray(json[0]) && Array.isArray(json[1])) {
      return {
        labels: json[0].map(String),
        data: json[1].map(Number),
        title: null
      };
    }

    // {"A": 10, "B": 20}
    if (typeof json === 'object' && !Array.isArray(json)) {
      const entries = Object.entries(json).filter(([, v]) => typeof v === 'number');
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

  _parseCSV(text, hints) {
    const delimiter = hints?.delimiter || ',';
    const lines = text.split(/[\n\r]+/).filter(l => l.trim());
    const rows = lines.map(line => 
      line.split(delimiter).map(cell => cell.trim().replace(/^["']|["']$/g, ''))
    );

    if (rows.length < 2) return null;

    const firstRowAllText = rows[0].every(cell => isNaN(parseFloat(cell)));
    
    if (firstRowAllText && rows[0].length === 2) {
      // Vertical: Label, Value
      return {
        labels: rows.slice(1).map(r => r[0]),
        data: rows.slice(1).map(r => parseFloat(r[1]) || 0),
        title: null
      };
    }

    if (firstRowAllText) {
      // Horizontal headers
      return {
        labels: rows[0].slice(1),
        data: rows[1].slice(1).map(v => parseFloat(v) || 0),
        title: rows[1][0] || null
      };
    }

    return null;
  }

  _parseKeyValue(text, hints) {
    const patterns = [
      /([A-Za-zА-Яа-яёЁ0-9\s_-]+):\s*([\d,.]+)\s*%?/g,
      /([A-Za-zА-Яа-яёЁ0-9\s_-]+)\s*=\s*([\d,.]+)\s*%?/g,
    ];

    for (const pattern of patterns) {
      const matches = [...text.matchAll(pattern)];
      if (matches.length >= 2) {
        return {
          labels: matches.map(m => m[1].trim()),
          data: matches.map(m => parseFloat(m[2].replace(/,/g, '')) || 0),
          title: null,
          isPercentage: hints?.hasPercent || text.includes('%')
        };
      }
    }

    return null;
  }

  _parseTable(text) {
    const lines = text.split(/[\n\r]+/).filter(l => l.trim() && l.includes('|'));
    const results = [];

    for (const line of lines) {
      const cleaned = line.replace(/^\||\|$/g, '').trim();
      const parts = cleaned.split('|').map(p => p.trim()).filter(Boolean);
      
      if (parts.length >= 2) {
        const value = parseFloat(parts[parts.length - 1].replace(/[^0-9.-]/g, ''));
        if (!isNaN(value)) {
          results.push({ label: parts[0], value });
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

  _parseNatural(text) {
    const patterns = [
      /([A-Za-zА-Яа-яёЁ]+)\s+(?:was|were|is|are|had|has)?\s*([\d,.]+)/gi,
      /([A-Za-zА-Яа-яёЁ]+)\s+([\d,.]+)/g,
    ];

    for (const pattern of patterns) {
      const matches = [...text.matchAll(pattern)];
      if (matches.length >= 2) {
        return {
          labels: matches.map(m => m[1]),
          data: matches.map(m => parseFloat(m[2].replace(/,/g, '')) || 0),
          title: null
        };
      }
    }

    return null;
  }

  _parseNumbers(text) {
    const numbers = text.match(/[\d,.]+/g)
      ?.map(n => parseFloat(n.replace(/,/g, '')))
      .filter(n => !isNaN(n) && n > 0);

    if (!numbers || numbers.length < 2) return null;

    const words = text.match(/[A-Za-zА-Яа-яёЁ]{2,}/g) || [];
    const labels = words.length >= numbers.length 
      ? words.slice(0, numbers.length)
      : this._generateLabels(text, numbers.length);

    return {
      labels,
      data: numbers.slice(0, 8),
      title: null
    };
  }

  _generateLabels(text, count) {
    const lowerText = text.toLowerCase();

    if (/month|quarter|year/i.test(lowerText)) {
      if (count <= 4) return ['Q1', 'Q2', 'Q3', 'Q4'].slice(0, count);
      return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].slice(0, count);
    }

    if (/product|item/i.test(lowerText)) {
      return Array.from({ length: count }, (_, i) => `Product ${i + 1}`);
    }

    if (/region|country/i.test(lowerText)) {
      return ['North', 'South', 'East', 'West', 'Central', 'Northeast'].slice(0, count);
    }

    return Array.from({ length: count }, (_, i) => `Category ${String.fromCharCode(65 + i)}`);
  }

  _fallback(text, dataType = 'numeric') {
    // Try to extract anything useful
    const numbers = text.match(/[\d,.]+/g)?.map(n => parseFloat(n.replace(/,/g, ''))).filter(n => !isNaN(n));
    
    if (numbers && numbers.length >= 2) {
      return {
        success: true,
        labels: this._generateLabels(text, numbers.length),
        data: numbers.slice(0, 8),
        title: 'Data Visualization',
        dataType,
        metadata: { format: 'fallback', confidence: 0.3, dataType }
      };
    }

    return {
      success: false,
      labels: ['Category A', 'Category B', 'Category C', 'Category D'],
      data: [25, 35, 20, 20],
      title: 'Sample Data',
      metadata: { format: 'sample', confidence: 0 },
      warning: 'Could not parse input. Showing sample data.'
    };
  }

  /**
   * Suggest best chart type based on parsed data
   */
  suggestChartType(labels, data) {
    const count = data.length;
    const sum = data.reduce((a, b) => a + b, 0);
    const allPositive = data.every(d => d >= 0);
    const isPercentage = Math.abs(sum - 100) < 5 || data.every(d => d >= 0 && d <= 1);

    // Time series detection
    const timePatterns = ['jan', 'feb', 'mar', 'q1', 'q2', 'mon', '2023', '2024', '2025'];
    const isTimeSeries = labels.some(l => 
      timePatterns.some(p => l.toString().toLowerCase().includes(p))
    );

    if (isTimeSeries) return { type: 'line', reason: 'Time series data detected' };
    if (isPercentage && allPositive && count <= 6) return { type: 'doughnut', reason: 'Percentage distribution' };
    if (count <= 4 && allPositive) return { type: 'pie', reason: 'Small category count' };
    if (count > 10) return { type: 'line', reason: 'Many data points' };

    return { type: 'bar', reason: 'Default comparison chart' };
  }
}

// Singleton export
export const dataParser = new DataParser();
export default DataParser;

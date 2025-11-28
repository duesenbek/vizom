/**
 * Chart Pipeline - Complete flow from user input to rendered chart
 * Flow: User Input → DataParser → DeepSeek AI → Chart Render
 */

import { DataParser } from './DataParser.js';
import { generateDeepSeekPrompt, parseDeepSeekResponse, createFallbackConfig } from './DeepSeekChartPrompt.js';

// DeepSeek API endpoint (proxied through Netlify function)
const DEEPSEEK_ENDPOINT = '/.netlify/functions/deepseek-proxy';

export class ChartPipeline {
  constructor(options = {}) {
    this.parser = new DataParser();
    this.useAI = options.useAI ?? true;
    this.timeout = options.timeout ?? 15000;
    this.onProgress = options.onProgress || (() => {});
  }

  /**
   * Main pipeline: input → parsed data → AI config → rendered chart
   * @param {string} userInput - Raw user input (messy or structured)
   * @param {object} options - { chartType, container, skipAI }
   * @returns {Promise<{ success: boolean, chart: Chart, config: object }>}
   */
  async process(userInput, options = {}) {
    const { chartType, container, skipAI = false } = options;
    
    console.log('[ChartPipeline] Starting pipeline...');
    this.onProgress({ step: 'parsing', message: 'Analyzing your data...' });

    // Step 1: Parse user input
    const parsed = this.parser.parse(userInput);
    console.log('[ChartPipeline] Parsed data:', parsed);

    if (!parsed.success && !parsed.data?.length) {
      return { success: false, error: 'Could not parse input data' };
    }

    // Step 2: Determine chart type
    const suggestedType = this.parser.suggestChartType(parsed.labels, parsed.data);
    const finalChartType = chartType || suggestedType.type;
    console.log('[ChartPipeline] Chart type:', finalChartType, `(${suggestedType.reason})`);

    // Step 3: Generate chart config
    let config;
    
    if (this.useAI && !skipAI) {
      this.onProgress({ step: 'ai', message: 'AI is generating your chart...' });
      config = await this.generateWithAI(parsed, finalChartType, userInput);
    }
    
    // Fallback to local generation if AI fails or is disabled
    if (!config) {
      this.onProgress({ step: 'fallback', message: 'Creating chart...' });
      config = createFallbackConfig(parsed, finalChartType);
      console.log('[ChartPipeline] Using fallback config');
    }

    // Step 4: Render chart
    if (container) {
      this.onProgress({ step: 'rendering', message: 'Rendering chart...' });
      const chart = await this.renderChart(config, container);
      
      return {
        success: true,
        chart,
        config,
        parsedData: parsed,
        chartType: finalChartType
      };
    }

    return {
      success: true,
      config,
      parsedData: parsed,
      chartType: finalChartType
    };
  }

  /**
   * Generate config using DeepSeek AI
   */
  async generateWithAI(parsedData, chartType, userPrompt) {
    try {
      const prompt = generateDeepSeekPrompt(parsedData, {
        chartType,
        userPrompt
      });

      console.log('[ChartPipeline] Calling DeepSeek API...');
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(DEEPSEEK_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, chartType }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const config = parseDeepSeekResponse(data.content || data.response || JSON.stringify(data));
      
      if (config) {
        console.log('[ChartPipeline] AI config generated successfully');
        return config;
      }
    } catch (e) {
      console.warn('[ChartPipeline] AI generation failed:', e.message);
    }

    return null;
  }

  /**
   * Render chart to container
   */
  async renderChart(config, container) {
    // Wait for Chart.js
    const Chart = await this.waitForChartJS();
    if (!Chart) {
      throw new Error('Chart.js not available');
    }

    // Clear container
    if (typeof container === 'string') {
      container = document.getElementById(container) || document.querySelector(container);
    }
    
    if (!container) {
      throw new Error('Container not found');
    }

    container.innerHTML = '<canvas style="width:100%;height:100%"></canvas>';
    const canvas = container.querySelector('canvas');
    
    // Destroy existing chart if any
    const existingChart = Chart.getChart(canvas);
    if (existingChart) {
      existingChart.destroy();
    }

    // Create new chart
    const chart = new Chart(canvas, config);
    
    // Store reference
    window.currentChart = chart;
    window.lastChartConfig = config;
    
    return chart;
  }

  /**
   * Wait for Chart.js to be available
   */
  waitForChartJS(maxWait = 10000) {
    return new Promise((resolve) => {
      const start = Date.now();
      const check = () => {
        if (window.Chart) {
          resolve(window.Chart);
        } else if (Date.now() - start > maxWait) {
          resolve(null);
        } else {
          setTimeout(check, 100);
        }
      };
      check();
    });
  }

  /**
   * Quick parse without AI - for preview
   */
  quickParse(input) {
    return this.parser.parse(input);
  }

  /**
   * Detect input format
   */
  detectFormat(input) {
    return this.parser.detect(input);
  }
}

// ============================================
// EXAMPLE INPUTS AND OUTPUTS
// ============================================

/*
EXAMPLE 1: Key-Value Format
Input: "Developer skills: JavaScript 0%, Python 75%, SQL 8%, DevOps 222%, Design 5%"
Parsed: {
  labels: ["JavaScript", "Python", "SQL", "DevOps", "Design"],
  data: [0, 75, 8, 222, 5],
  metadata: { format: "keyvalue", confidence: 0.9 }
}
Suggested Chart: bar (comparison)

EXAMPLE 2: JSON Format
Input: '[{"label":"Apple","value":35},{"label":"Google","value":28},{"label":"Microsoft","value":22}]'
Parsed: {
  labels: ["Apple", "Google", "Microsoft"],
  data: [35, 28, 22],
  metadata: { format: "json", confidence: 0.95 }
}
Suggested Chart: pie (small count, positive values)

EXAMPLE 3: CSV Format
Input: "Month,Sales\nJan,100\nFeb,150\nMar,200\nApr,180"
Parsed: {
  labels: ["Jan", "Feb", "Mar", "Apr"],
  data: [100, 150, 200, 180],
  metadata: { format: "csv", confidence: 0.85 }
}
Suggested Chart: line (time series detected)

EXAMPLE 4: Natural Language
Input: "Sales were 100 in January, 200 in February, and 150 in March"
Parsed: {
  labels: ["January", "February", "March"],
  data: [100, 200, 150],
  metadata: { format: "natural", confidence: 0.6 }
}
Suggested Chart: line (time series)

EXAMPLE 5: Table Format
Input: "| Product | Revenue |\n| Widget A | 5000 |\n| Widget B | 3500 |"
Parsed: {
  labels: ["Widget A", "Widget B"],
  data: [5000, 3500],
  metadata: { format: "table", confidence: 0.8 }
}
Suggested Chart: bar

EXAMPLE 6: Numbers Only
Input: "Q1 Q2 Q3 Q4 revenues: 1000 1500 1200 1800"
Parsed: {
  labels: ["Q1", "Q2", "Q3", "Q4"],
  data: [1000, 1500, 1200, 1800],
  metadata: { format: "numbers", confidence: 0.4 }
}
Suggested Chart: bar (quarterly data)
*/

// ============================================
// INTEGRATION CODE SNIPPET
// ============================================

/**
 * Integration Example - Use in generator.html
 * 
 * ```javascript
 * import { ChartPipeline } from './src/charts/ChartPipeline.js';
 * 
 * const pipeline = new ChartPipeline({
 *   useAI: true,
 *   timeout: 15000,
 *   onProgress: ({ step, message }) => {
 *     console.log(`[${step}] ${message}`);
 *     updateLoadingUI(message);
 *   }
 * });
 * 
 * // Process user input
 * async function generateChart() {
 *   const userInput = document.getElementById('prompt-input').value;
 *   const container = document.getElementById('chart-container');
 *   
 *   // Get selected chart type (optional)
 *   const selectedType = document.querySelector('.chart-option.selected')?.dataset?.type;
 *   
 *   try {
 *     const result = await pipeline.process(userInput, {
 *       chartType: selectedType,
 *       container: container
 *     });
 *     
 *     if (result.success) {
 *       console.log('Chart created:', result.chartType);
 *       console.log('Config:', result.config);
 *     } else {
 *       console.error('Failed:', result.error);
 *     }
 *   } catch (e) {
 *     console.error('Pipeline error:', e);
 *   }
 * }
 * ```
 */

// Singleton export
export const chartPipeline = new ChartPipeline();
export default ChartPipeline;

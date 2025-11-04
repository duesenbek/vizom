/**
 * Prompt Builder Module
 * Manages AI prompt templates for different chart types
 */

export const CHART_PROMPTS = {
  bar: {
    name: 'Bar Chart',
    description: 'Compare values across categories',
    template: `Generate a Chart.js configuration for a bar chart. Data: {data}
    
Requirements:
- Use gradient colors (rgba(99, 102, 241, 0.8))
- Set borderRadius: 8 for rounded bars
- Include responsive: true and maintainAspectRatio: false
- Add grid lines with color: 'rgba(0, 0, 0, 0.1)'
- Enable tooltips with modern styling
- Add title with font: { size: 18, weight: 'bold' }

Respond with ONLY the JSON object.`,
  },

  line: {
    name: 'Line Chart',
    description: 'Show trends over time',
    template: `Generate a Chart.js configuration for a line chart with area fill. Data: {data}

Requirements:
- Use multiple datasets if data has multiple series
- Set tension: 0.4 for smooth curves
- Use fill: true with gradient backgroundColor
- borderColor: 'rgb(99, 102, 241)', borderWidth: 3
- pointRadius: 5, pointHoverRadius: 7
- Add legend at top position
- Include grid lines and tooltips

Respond with ONLY the JSON object.`,
  },

  pie: {
    name: 'Pie Chart',
    description: 'Show proportions and percentages',
    template: `Generate a Chart.js configuration for a doughnut chart. Data: {data}

Requirements:
- Use vibrant colors: ['#6366f1', '#8b5cf6', '#06d6a0', '#60a5fa', '#a78bfa']
- Set cutout: '50%' for doughnut style
- Add percentage labels in tooltips
- Enable legend with position: 'right'
- Include hover effects with hoverOffset: 4

Respond with ONLY the JSON object.`,
  },

  scatter: {
    name: 'Scatter Plot',
    description: 'Show correlations between variables',
    template: `Generate a Chart.js configuration for a scatter plot. Data: {data}

Requirements:
- Use different colors for different data groups
- Set pointRadius: 8
- Include x and y axes with proper labels
- Add tooltips showing all data dimensions
- Use rgba colors with 0.6 opacity

Respond with ONLY the JSON object.`,
  },

  mixed: {
    name: 'Mixed Chart',
    description: 'Combine bars and lines',
    template: `Generate a Chart.js configuration for a mixed chart (bar + line). Data: {data}

Requirements:
- First dataset: type 'bar' with bars
- Second dataset: type 'line' with line overlay
- Use different y-axes if needed (yAxisID: 'y' and 'y1')
- Bar colors: rgba(99, 102, 241, 0.8)
- Line color: rgb(16, 185, 129), tension: 0.4
- Include dual legends

Respond with ONLY the JSON object.`,
  },

  table: {
    name: 'Table',
    description: 'Display structured data',
    template: `Generate a professional HTML table with color-coded cells. Data: {data}

Requirements:
- Use Tailwind CSS classes
- Add header with dark background (bg-slate-700 text-white)
- Alternate row colors (even:bg-slate-50)
- Color-code numeric cells: green for good values, red for bad
- Add hover effects (hover:bg-slate-100)
- Include rounded corners (rounded-xl) and shadow (shadow-lg)
- Make it responsive with overflow-x-auto wrapper

Return ONLY HTML.`,
  },

  dashboard: {
    name: 'Dashboard',
    description: 'Multiple charts and KPIs',
    template: `Generate a complete dashboard with Chart.js charts and KPI cards. Data: {data}

Requirements:
- Layout: Tailwind grid (grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6)
- 2-3 KPI cards with icons, values, and trend indicators
- 2-3 canvas elements for charts (bar, line, doughnut)
- Each canvas must have unique id (chart1, chart2, chart3)
- Cards: rounded-xl shadow-lg p-6 bg-white
- Title: text-2xl font-bold mb-6

Return JSON: { "layout": "...", "charts": [{ "canvasId": "...", "config": {...} }] }`,
  },
};

export class PromptBuilder {
  /**
   * Build prompt for chart generation
   */
  static build(chartType, data) {
    const prompt = CHART_PROMPTS[chartType];
    if (!prompt) {
      throw new Error(`Unknown chart type: ${chartType}`);
    }

    return prompt.template.replace('{data}', data);
  }

  /**
   * Get all available chart types
   */
  static getChartTypes() {
    return Object.entries(CHART_PROMPTS).map(([key, value]) => ({
      key,
      name: value.name,
      description: value.description,
    }));
  }

  /**
   * Detect chart type from user input
   */
  static detectChartType(text) {
    const lower = text.toLowerCase();

    if (lower.includes('bar') || lower.includes('column')) return 'bar';
    if (lower.includes('line') || lower.includes('trend')) return 'line';
    if (lower.includes('pie') || lower.includes('doughnut')) return 'pie';
    if (lower.includes('scatter') || lower.includes('correlation')) return 'scatter';
    if (lower.includes('mixed') || lower.includes('combo')) return 'mixed';
    if (lower.includes('table')) return 'table';
    if (lower.includes('dashboard')) return 'dashboard';

    return 'bar'; // Default
  }
}

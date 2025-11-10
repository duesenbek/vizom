/**
 * Prompt Templates Service
 * Manages optimized prompt templates for different visualization types
 */

import { CHART_TYPES } from './constants.js';

export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  template: string;
  requirements: string[];
  expectedOutput: string;
}

export class PromptTemplatesService {
  private templates: Map<string, PromptTemplate> = new Map();

  constructor() {
    this.initializeTemplates();
  }

  /**
   * Initialize all prompt templates
   */
  private initializeTemplates(): void {
    this.registerChartTemplates();
    this.registerTableTemplates();
    this.registerDashboardTemplates();
    this.registerCustomTemplates();
  }

  /**
   * Register chart-specific templates
   */
  private registerChartTemplates(): void {
    // Bar Chart Template
    this.templates.set(CHART_TYPES.BAR, {
      id: CHART_TYPES.BAR,
      name: 'Bar Chart',
      description: 'Vertical or horizontal bars for comparing values',
      template: `Generate a Chart.js configuration for a bar chart. Data: {data}. 
Requirements:
- Use gradient colors (e.g., rgba(99, 102, 241, 0.8) to rgba(139, 92, 246, 0.8))
- Include responsive: true and maintainAspectRatio: false in options
- Add grid lines with color: 'rgba(0, 0, 0, 0.1)'
- Enable tooltips with backgroundColor: 'rgba(0, 0, 0, 0.8)'
- Set borderRadius: 8 for rounded bars
- Add title with font: { size: 18, weight: 'bold' }
Respond with ONLY the JSON object: { type: 'bar', data: { labels: [...], datasets: [{ label: '...', data: [...], backgroundColor: [...], borderRadius: 8 }] }, options: { responsive: true, plugins: { legend: { display: true }, title: { display: true, text: '...' } }, scales: { y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.1)' } } } } }`,
      requirements: [
        'gradient colors',
        'responsive design',
        'grid lines',
        'rounded bars',
        'proper title'
      ],
      expectedOutput: 'Chart.js bar configuration JSON'
    });

    // Line Chart Template
    this.templates.set(CHART_TYPES.LINE, {
      id: CHART_TYPES.LINE,
      name: 'Line Chart',
      description: 'Connected points showing trends over time',
      template: `Generate a Chart.js configuration for a line chart with area fill. Data: {data}.
Requirements:
- Use multiple datasets if data has multiple series
- Set tension: 0.4 for smooth curves
- Use fill: true with gradient: backgroundColor: 'rgba(99, 102, 241, 0.2)'
- borderColor: 'rgb(99, 102, 241)', borderWidth: 3
- pointRadius: 5, pointHoverRadius: 7
- Add legend at top position
- Include grid lines and tooltips
Respond with ONLY the JSON: { type: 'line', data: { labels: [...], datasets: [{ label: '...', data: [...], borderColor: '...', backgroundColor: '...', fill: true, tension: 0.4, pointRadius: 5 }] }, options: { responsive: true, plugins: { legend: { position: 'top' }, title: { display: true, text: '...' } }, scales: { y: { beginAtZero: true } } } }`,
      requirements: [
        'smooth curves',
        'area fill',
        'multiple datasets support',
        'proper styling'
      ],
      expectedOutput: 'Chart.js line configuration JSON'
    });

    // Pie Chart Template
    this.templates.set(CHART_TYPES.PIE, {
      id: CHART_TYPES.PIE,
      name: 'Pie/Doughnut Chart',
      description: 'Circular chart showing parts of a whole',
      template: `Generate a Chart.js configuration for a pie or doughnut chart. Data: {data}.
Requirements:
- Use vibrant colors: ['#6366f1', '#8b5cf6', '#06d6a0', '#60a5fa', '#a78bfa', '#f59e0b']
- Set cutout: '50%' for doughnut style
- Add percentage labels in tooltips
- Enable legend with position: 'right'
- Include hover effects with hoverOffset: 4
Respond with ONLY the JSON: { type: 'doughnut', data: { labels: [...], datasets: [{ data: [...], backgroundColor: [...], hoverOffset: 4 }] }, options: { responsive: true, plugins: { legend: { position: 'right' }, title: { display: true, text: '...' } } } }`,
      requirements: [
        'vibrant colors',
        'doughnut style',
        'percentage tooltips',
        'hover effects'
      ],
      expectedOutput: 'Chart.js doughnut configuration JSON'
    });

    // Scatter Plot Template
    this.templates.set(CHART_TYPES.SCATTER, {
      id: CHART_TYPES.SCATTER,
      name: 'Scatter Plot',
      description: 'Points showing relationship between two variables',
      template: `Generate a Chart.js configuration for a scatter plot. Data: {data}.
Requirements:
- Use different colors for different data groups
- Set pointRadius based on data value (5-15 range)
- Include x and y axes with proper labels
- Add tooltips showing all data dimensions
- Use rgba colors with 0.6 opacity
Respond with ONLY the JSON: { type: 'scatter', data: { datasets: [{ label: '...', data: [{x: ..., y: ...}], backgroundColor: 'rgba(99, 102, 241, 0.6)', pointRadius: 8 }] }, options: { responsive: true, plugins: { legend: { position: 'top' }, title: { display: true, text: '...' } }, scales: { x: { title: { display: true, text: '...' } }, y: { title: { display: true, text: '...' } } } } }`,
      requirements: [
        'multiple data groups',
        'variable point sizes',
        'axis labels',
        'multi-dimensional tooltips'
      ],
      expectedOutput: 'Chart.js scatter configuration JSON'
    });

    // Mixed Chart Template
    this.templates.set(CHART_TYPES.MIXED, {
      id: CHART_TYPES.MIXED,
      name: 'Mixed Chart',
      description: 'Combination of bar and line charts',
      template: `Generate a Chart.js configuration for a mixed chart (bar + line). Data: {data}.
Requirements:
- First dataset: type 'bar' with bars
- Second dataset: type 'line' with line overlay
- Use different y-axes if needed (yAxisID: 'y' and 'y1')
- Bar colors: rgba(99, 102, 241, 0.8)
- Line color: rgb(16, 185, 129), tension: 0.4
- Include dual legends
Respond with ONLY the JSON: { type: 'bar', data: { labels: [...], datasets: [{ type: 'bar', label: '...', data: [...], backgroundColor: '...', yAxisID: 'y' }, { type: 'line', label: '...', data: [...], borderColor: '...', tension: 0.4, yAxisID: 'y1' }] }, options: { responsive: true, plugins: { legend: { display: true } }, scales: { y: { type: 'linear', position: 'left' }, y1: { type: 'linear', position: 'right', grid: { drawOnChartArea: false } } } } }`,
      requirements: [
        'bar and line combination',
        'dual y-axes',
        'different colors',
        'proper legends'
      ],
      expectedOutput: 'Chart.js mixed configuration JSON'
    });
  }

  /**
   * Register table templates
   */
  private registerTableTemplates(): void {
    this.templates.set(CHART_TYPES.TABLE, {
      id: CHART_TYPES.TABLE,
      name: 'HTML Table',
      description: 'Responsive HTML table with styling',
      template: `Generate a professional HTML table with color-coded cells. Data: {data}.
Requirements:
- Use Tailwind CSS classes
- Add header with dark background (bg-slate-700 text-white)
- Alternate row colors (even:bg-slate-50)
- Color-code numeric cells: green for good values (bg-green-100 text-green-800), red for bad (bg-red-100 text-red-800)
- Add hover effects (hover:bg-slate-100)
- Include rounded corners (rounded-xl) and shadow (shadow-lg)
- Make it responsive with overflow-x-auto wrapper
Return ONLY HTML: <div class="overflow-x-auto rounded-xl shadow-lg"><table class="min-w-full bg-white"><thead class="bg-slate-700 text-white"><tr><th class="px-6 py-3 text-left">...</th></tr></thead><tbody>...</tbody></table></div>`,
      requirements: [
        'Tailwind CSS styling',
        'responsive design',
        'color coding',
        'hover effects',
        'rounded corners'
      ],
      expectedOutput: 'Styled HTML table'
    });
  }

  /**
   * Register dashboard templates
   */
  private registerDashboardTemplates(): void {
    this.templates.set(CHART_TYPES.DASHBOARD, {
      id: CHART_TYPES.DASHBOARD,
      name: 'Dashboard',
      description: 'Complete dashboard with multiple charts and KPIs',
      template: `Generate a complete dashboard with multiple Chart.js charts and KPI cards. Data: {data}.
Requirements:
- Layout: Tailwind grid (grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6)
- 2-3 KPI cards with icons, values, and trend indicators
- 2-3 canvas elements for charts (bar, line, doughnut)
- Each canvas must have unique id (chart1, chart2, chart3)
- Cards: rounded-xl shadow-lg p-6 bg-white
- Title: text-2xl font-bold mb-6
Return JSON: { "layout": "<div class='p-6 bg-gray-50 min-h-screen'><h1 class='text-2xl font-bold mb-6'>Dashboard Title</h1><div class='grid grid-cols-1 md:grid-cols-3 gap-6 mb-6'><div class='bg-white rounded-xl shadow-lg p-6'>KPI Card</div></div><div class='grid grid-cols-1 lg:grid-cols-2 gap-6'><div class='bg-white rounded-xl shadow-lg p-6'><canvas id='chart1'></canvas></div></div></div>", "charts": [{ "canvasId": "chart1", "config": { type: 'bar', data: {...}, options: {...} } }] }`,
      requirements: [
        'grid layout',
        'KPI cards',
        'multiple charts',
        'unique canvas IDs',
        'responsive design'
      ],
      expectedOutput: 'Dashboard layout JSON with chart configurations'
    });
  }

  /**
   * Register custom templates
   */
  private registerCustomTemplates(): void {
    this.templates.set(CHART_TYPES.CUSTOM, {
      id: CHART_TYPES.CUSTOM,
      name: 'Custom Visualization',
      description: 'AI-selected best visualization for the data',
      template: `Analyze the data and generate the most appropriate visualization. Data: {data}.
Choose between: bar chart, line chart, scatter plot, mixed chart, pie chart, or table.
Follow the same requirements as the specific chart type prompts above.
Respond with ONLY the Chart.js JSON configuration or HTML table.`,
      requirements: [
        'data analysis',
        'automatic chart type selection',
        'best practices',
        'proper formatting'
      ],
      expectedOutput: 'Optimal visualization based on data'
    });
  }

  /**
   * Get prompt template by type
   */
  getTemplate(type: string): PromptTemplate | undefined {
    return this.templates.get(type);
  }

  /**
   * Generate prompt from template
   */
  generatePrompt(type: string, data: any): string {
    const template = this.getTemplate(type);
    if (!template) {
      throw new Error(`Template "${type}" not found`);
    }

    // Replace {data} placeholder with actual data
    return template.template.replace('{data}', JSON.stringify(data));
  }

  /**
   * Get all templates
   */
  getAllTemplates(): PromptTemplate[] {
    return Array.from(this.templates.values());
  }

  /**
   * Get templates by category
   */
  getTemplatesByCategory(category: 'chart' | 'table' | 'dashboard' | 'custom'): PromptTemplate[] {
    const categoryTypes = {
      chart: [CHART_TYPES.BAR, CHART_TYPES.LINE, CHART_TYPES.PIE, CHART_TYPES.SCATTER, CHART_TYPES.MIXED],
      table: [CHART_TYPES.TABLE],
      dashboard: [CHART_TYPES.DASHBOARD],
      custom: [CHART_TYPES.CUSTOM]
    };

    const types = categoryTypes[category] || [];
    return types.map(type => this.templates.get(type)).filter(Boolean) as PromptTemplate[];
  }

  /**
   * Register custom template
   */
  registerTemplate(template: PromptTemplate): void {
    this.templates.set(template.id, template);
  }

  /**
   * Update existing template
   */
  updateTemplate(id: string, updates: Partial<PromptTemplate>): boolean {
    const existing = this.templates.get(id);
    if (!existing) return false;

    const updated = { ...existing, ...updates };
    this.templates.set(id, updated);
    return true;
  }

  /**
   * Remove template
   */
  removeTemplate(id: string): boolean {
    return this.templates.delete(id);
  }

  /**
   * Validate template
   */
  validateTemplate(template: PromptTemplate): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!template.id) errors.push('Template ID is required');
    if (!template.name) errors.push('Template name is required');
    if (!template.template) errors.push('Template content is required');
    if (!template.template.includes('{data}')) errors.push('Template must include {data} placeholder');

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Export templates
   */
  exportTemplates(): Record<string, PromptTemplate> {
    const exported: Record<string, PromptTemplate> = {};
    this.templates.forEach((template, id) => {
      exported[id] = { ...template };
    });
    return exported;
  }

  /**
   * Import templates
   */
  importTemplates(templates: Record<string, PromptTemplate>): void {
    Object.entries(templates).forEach(([id, template]) => {
      const validation = this.validateTemplate(template);
      if (validation.isValid) {
        this.templates.set(id, template);
      } else {
        console.warn(`Invalid template "${id}":`, validation.errors);
      }
    });
  }
}

// Export singleton instance
export const promptTemplates = new PromptTemplatesService();

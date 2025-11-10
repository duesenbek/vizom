/**
 * Enhanced Prompt Engineering for DeepSeek API
 * Provides structured prompts with few-shot examples for consistent JSON output
 */

// TypeScript types for prompt engineering
export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  category: 'chart' | 'data' | 'analysis' | 'export';
  systemPrompt: string;
  userPromptTemplate: string;
  examples: PromptExample[];
  outputSchema: JSONSchema;
  parameters: PromptParameter[];
}

export interface PromptExample {
  input: any;
  output: any;
  explanation?: string;
}

export interface PromptParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  required: boolean;
  description: string;
  defaultValue?: any;
}

export interface JSONSchema {
  type: string;
  properties: Record<string, any>;
  required: string[];
  additionalProperties?: boolean;
}

/**
 * Chart Generation Prompt Templates
 */
export const CHART_PROMPTS: Record<string, PromptTemplate> = {
  barChart: {
    id: 'bar-chart',
    name: 'Bar Chart Generator',
    description: 'Generate optimized bar chart configurations',
    category: 'chart',
    systemPrompt: `You are a professional data visualization expert specializing in creating beautiful, informative charts using Chart.js. 

Your task is to analyze the provided data and generate an optimal bar chart configuration.

RULES:
1. Always return valid JSON that can be directly parsed
2. Include proper Chart.js configuration structure
3. Choose colors that are accessible and visually appealing
4. Add appropriate labels, titles, and descriptions
5. Include responsive design settings
6. Add interactive features like tooltips and legends
7. Consider data distribution for axis scaling
8. Include animation settings for smooth transitions

OUTPUT FORMAT:
{
  "config": {
    "type": "bar",
    "data": {
      "labels": ["array of labels"],
      "datasets": [{
        "label": "dataset label",
        "data": ["array of values"],
        "backgroundColor": ["array of colors"],
        "borderColor": ["array of border colors"],
        "borderWidth": 1
      }]
    },
    "options": {
      "responsive": true,
      "plugins": {
        "title": { "display": true, "text": "chart title" },
        "legend": { "display": true, "position": "top" }
      },
      "scales": {
        "y": { "beginAtZero": true },
        "x": {}
      }
    }
  },
  "metadata": {
    "chartType": "bar",
    "dataPoints": number,
    "recommendations": ["array of insights"],
    "generatedAt": "ISO timestamp"
  }
}`,
    userPromptTemplate: `Generate a bar chart configuration for the following data:

Data: {data}
Description: {description}
Title: {title}
Theme: {theme}

Additional requirements:
- Focus on: {focus}
- Color scheme: {colors}
- Interactive features: {interactive}

Please analyze the data and create an optimal visualization.`,
    examples: [
      {
        input: {
          data: {
            labels: ['Q1', 'Q2', 'Q3', 'Q4'],
            values: [120, 150, 180, 140]
          },
          description: 'Quarterly sales revenue',
          title: 'Sales by Quarter',
          theme: 'professional',
          focus: 'growth trends',
          colors: 'blue gradient',
          interactive: true
        },
        output: {
          config: {
            type: 'bar',
            data: {
              labels: ['Q1', 'Q2', 'Q3', 'Q4'],
              datasets: [{
                label: 'Sales Revenue ($)',
                data: [120, 150, 180, 140],
                backgroundColor: [
                  'rgba(59, 130, 246, 0.8)',
                  'rgba(37, 99, 235, 0.8)',
                  'rgba(29, 78, 216, 0.8)',
                  'rgba(30, 64, 175, 0.8)'
                ],
                borderColor: [
                  'rgba(59, 130, 246, 1)',
                  'rgba(37, 99, 235, 1)',
                  'rgba(29, 78, 216, 1)',
                  'rgba(30, 64, 175, 1)'
                ],
                borderWidth: 2
              }]
            },
            options: {
              responsive: true,
              plugins: {
                title: {
                  display: true,
                  text: 'Sales by Quarter',
                  font: { size: 16, weight: 'bold' }
                },
                legend: {
                  display: true,
                  position: 'top'
                },
                tooltip: {
                  callbacks: {
                    label: (context) => `$${context.parsed.y}k`
                  }
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: 'Revenue ($k)'
                  }
                },
                x: {
                  title: {
                    display: true,
                    text: 'Quarter'
                  }
                }
              },
              animation: {
                duration: 1000,
                easing: 'easeInOutQuart'
              }
            }
          },
          metadata: {
            chartType: 'bar',
            dataPoints: 4,
            recommendations: [
              'Q3 shows peak performance',
              'Consider investigating Q4 decline',
              'Overall positive growth trend'
            ],
            generatedAt: '2024-01-15T10:30:00Z'
          }
        },
        explanation: 'Professional bar chart with gradient colors showing quarterly sales trends'
      }
    ],
    outputSchema: {
      type: 'object',
      properties: {
        config: { type: 'object' },
        metadata: { type: 'object' }
      },
      required: ['config', 'metadata'],
      additionalProperties: false
    },
    parameters: [
      { name: 'data', type: 'object', required: true, description: 'Chart data with labels and values' },
      { name: 'description', type: 'string', required: true, description: 'What the data represents' },
      { name: 'title', type: 'string', required: true, description: 'Chart title' },
      { name: 'theme', type: 'string', required: false, defaultValue: 'default', description: 'Visual theme' },
      { name: 'focus', type: 'string', required: false, defaultValue: 'general', description: 'Main focus area' },
      { name: 'colors', type: 'string', required: false, defaultValue: 'default', description: 'Color scheme' },
      { name: 'interactive', type: 'boolean', required: false, defaultValue: true, description: 'Enable interactive features' }
    ]
  },

  lineChart: {
    id: 'line-chart',
    name: 'Line Chart Generator',
    description: 'Generate optimized line chart configurations',
    category: 'chart',
    systemPrompt: `You are a data visualization expert specializing in time series and trend analysis using Chart.js line charts.

Your task is to analyze temporal data and create insightful line chart visualizations.

RULES:
1. Always return valid JSON
2. Use smooth curves for continuous data
3. Highlight trends and patterns
4. Include proper time-based axis formatting
5. Add trend lines if beneficial
6. Use appropriate point styles and sizes
7. Include confidence intervals if applicable
8. Optimize for mobile responsiveness

OUTPUT FORMAT:
{
  "config": { "Chart.js line configuration" },
  "metadata": {
    "chartType": "line",
    "trends": ["identified trends"],
    "insights": ["key insights"],
    "recommendations": ["visualization recommendations"]
  }
}`,
    userPromptTemplate: `Generate a line chart for time series data:

Data: {data}
Time period: {timePeriod}
Metric: {metric}
Focus: {focus}

Create a visualization that highlights trends and patterns.`,
    examples: [
      {
        input: {
          data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            values: [65, 72, 78, 85, 89, 94]
          },
          timePeriod: '6 months',
          metric: 'User engagement',
          focus: 'growth trend'
        },
        output: {
          config: {
            type: 'line',
            data: {
              labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
              datasets: [{
                label: 'User Engagement',
                data: [65, 72, 78, 85, 89, 94],
                borderColor: 'rgba(99, 102, 241, 1)',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: 'rgba(99, 102, 241, 1)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7
              }]
            },
            options: {
              responsive: true,
              plugins: {
                title: { display: true, text: 'User Engagement Trend' },
                legend: { display: true }
              },
              scales: {
                y: {
                  beginAtZero: false,
                  title: { display: true, text: 'Engagement Score' }
                }
              },
              interaction: {
                intersect: false,
                mode: 'index'
              }
            }
          },
          metadata: {
            chartType: 'line',
            trends: ['Steady upward growth', 'Accelerating in recent months'],
            insights: ['44% growth over 6 months', 'Highest engagement in June'],
            recommendations: ['Continue current strategy', 'Invest in growth drivers']
          }
        }
      }
    ],
    outputSchema: {
      type: 'object',
      properties: {
        config: { type: 'object' },
        metadata: { type: 'object' }
      },
      required: ['config', 'metadata']
    },
    parameters: [
      { name: 'data', type: 'object', required: true, description: 'Time series data with labels and values' },
      { name: 'timePeriod', type: 'string', required: true, description: 'Time period for the data' },
      { name: 'metric', type: 'string', required: true, description: 'Metric being measured' },
      { name: 'focus', type: 'string', required: false, defaultValue: 'trends', description: 'Analysis focus area' }
    ]
  }
};

/**
 * Data Analysis Prompt Templates
 */
export const ANALYSIS_PROMPTS: Record<string, PromptTemplate> = {
  dataSummary: {
    id: 'data-summary',
    name: 'Data Summary Analysis',
    description: 'Generate comprehensive data summaries with statistics',
    category: 'analysis',
    systemPrompt: `You are a data analyst expert. Analyze the provided data and generate a comprehensive summary.

RULES:
1. Always return valid JSON
2. Include descriptive statistics
3. Identify patterns and outliers
4. Provide actionable insights
5. Suggest visualization recommendations
6. Highlight data quality issues

OUTPUT FORMAT:
{
  "summary": {
    "totalRecords": number,
    "columns": ["array of column names"],
    "dataTypes": {"column": "type"},
    "statistics": {"column": {"min": number, "max": number, "mean": number, "median": number}},
    "quality": {"completeness": number, "issues": ["array of issues"]}
  },
  "insights": ["array of key insights"],
  "recommendations": ["array of recommendations"],
  "visualizations": ["suggested chart types"]
}`,
    userPromptTemplate: `Analyze this dataset and provide a comprehensive summary:

Data: {data}
Context: {context}
Focus areas: {focus}

Include statistics, insights, and visualization recommendations.`,
    examples: [],
    outputSchema: {
      type: 'object',
      properties: {
        summary: { type: 'object' },
        insights: { type: 'array' },
        recommendations: { type: 'array' },
        visualizations: { type: 'array' }
      },
      required: ['summary', 'insights', 'recommendations', 'visualizations']
    },
    parameters: [
      { name: 'data', type: 'object', required: true, description: 'Dataset to analyze' },
      { name: 'context', type: 'string', required: true, description: 'Context or purpose of analysis' },
      { name: 'focus', type: 'array', required: false, defaultValue: [], description: 'Specific areas to focus on' }
    ]
  }
};

/**
 * Prompt Engineering Service
 */
export class PromptEngineeringService {
  private templates: Map<string, PromptTemplate> = new Map();

  constructor() {
    this.loadTemplates();
  }

  private loadTemplates() {
    // Load all templates
    Object.values(CHART_PROMPTS).forEach(template => {
      this.templates.set(template.id, template);
    });
    Object.values(ANALYSIS_PROMPTS).forEach(template => {
      this.templates.set(template.id, template);
    });
  }

  /**
   * Get prompt template by ID
   */
  getTemplate(templateId: string): PromptTemplate | null {
    return this.templates.get(templateId) || null;
  }

  generatePrompt(templateId: string, parameters: Record<string, any>): {
    systemPrompt: string;
    userPrompt: string;
    examples: any[];
    outputSchema: JSONSchema;
  } | null {
    const template = this.getTemplate(templateId);
    if (!template) return null;

    // Validate required parameters
    const missingParams = template.parameters
      .filter(p => p.required && !(p.name in parameters))
      .map(p => p.name);

    if (missingParams.length > 0) {
      throw new Error(`Missing required parameters: ${missingParams.join(', ')}`);
    }

    // Fill in default values for optional parameters
    const filledParams = { ...parameters };
    template.parameters.forEach(param => {
      if (!param.required && !(param.name in filledParams) && param.defaultValue !== undefined) {
        filledParams[param.name] = param.defaultValue;
      }
    });

    // Generate user prompt by replacing placeholders
    let userPrompt = template.userPromptTemplate;
    Object.entries(filledParams).forEach(([key, value]) => {
      userPrompt = userPrompt.replace(new RegExp(`{${key}}`, 'g'), String(value));
    });

    return {
      systemPrompt: template.systemPrompt,
      userPrompt,
      examples: template.examples,
      outputSchema: template.outputSchema
    };
  }

  /**
   * Get all available templates
   */
  getAllTemplates(): PromptTemplate[] {
    return Array.from(this.templates.values());
  }

  /**
   * Get templates by category
   */
  getTemplatesByCategory(category: PromptTemplate['category']): PromptTemplate[] {
    return Array.from(this.templates.values()).filter(t => t.category === category);
  }

  /**
   * Validate prompt parameters
   */
  validateParameters(templateId: string, parameters: Record<string, any>): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const template = this.getTemplate(templateId);
    if (!template) {
      return {
        isValid: false,
        errors: [`Template "${templateId}" not found`],
        warnings: []
      };
    }

    const errors: string[] = [];
    const warnings: string[] = [];

    // Check required parameters
    template.parameters.forEach(param => {
      if (param.required && !(param.name in parameters)) {
        errors.push(`Missing required parameter: ${param.name}`);
      }
    });

    // Check parameter types
    template.parameters.forEach(param => {
      if (param.name in parameters) {
        const value = parameters[param.name];
        const expectedType = param.type;
        
        // Basic type validation
        if (expectedType === 'string' && typeof value !== 'string') {
          errors.push(`Parameter "${param.name}" should be a string`);
        } else if (expectedType === 'number' && typeof value !== 'number') {
          errors.push(`Parameter "${param.name}" should be a number`);
        } else if (expectedType === 'boolean' && typeof value !== 'boolean') {
          errors.push(`Parameter "${param.name}" should be a boolean`);
        } else if (expectedType === 'array' && !Array.isArray(value)) {
          errors.push(`Parameter "${param.name}" should be an array`);
        }
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
}

// Export singleton instance
export const promptEngineering = new PromptEngineeringService();

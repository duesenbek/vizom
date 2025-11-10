/**
 * Chart Data Processor
 * Processes and validates chart data with normalization and optimization
 */

import { ChartType } from './types.js';

export interface ProcessedData {
  labels: string[];
  datasets: any[];
  metadata: {
    totalDataPoints: number;
    datasetCount: number;
    hasNullValues: boolean;
    hasNegativeValues: boolean;
    dataRange: { min: number; max: number };
  };
}

export interface DataValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
}

export class ChartDataProcessor {
  /**
   * Process raw data for chart rendering
   */
  static processData(rawData: any, chartType: string): ProcessedData {
    // Validate and normalize data based on chart type
    const normalizedData = this.normalizeData(rawData, chartType);
    
    // Extract labels and datasets
    const { labels, datasets } = this.extractLabelsAndDatasets(normalizedData);
    
    // Generate metadata
    const metadata = this.generateMetadata(datasets);
    
    return {
      labels,
      datasets,
      metadata
    };
  }

  /**
   * Validate data for specific chart type
   */
  static validateData(data: any, chartType: string): DataValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    // Basic validation
    if (!data) {
      errors.push('Data is required');
      return { isValid: false, errors, warnings, suggestions };
    }

    if (typeof data !== 'object') {
      errors.push('Data must be an object');
      return { isValid: false, errors, warnings, suggestions };
    }

    // Chart type specific validation
    const typeValidation = this.validateChartType(data, chartType);
    errors.push(...typeValidation.errors);
    warnings.push(...typeValidation.warnings);
    suggestions.push(...typeValidation.suggestions);

    // Data quality validation
    const qualityValidation = this.validateDataQuality(data);
    warnings.push(...qualityValidation.warnings);
    suggestions.push(...qualityValidation.suggestions);

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions
    };
  }

  /**
   * Normalize data structure
   */
  private static normalizeData(data: any, chartType: string): any {
    let normalized = { ...data };

    // Handle different data formats
    if (Array.isArray(data)) {
      // Convert array to object format
      normalized = this.arrayToObjectFormat(data, chartType);
    } else if (data.rows && data.columns) {
      // Convert table format to Chart.js format
      normalized = this.tableToChartFormat(data);
    } else if (data.values && data.labels) {
      // Convert simple format to Chart.js format
      normalized = this.simpleToChartFormat(data);
    }

    // Ensure required structure
    normalized = this.ensureChartStructure(normalized, chartType);

    return normalized;
  }

  /**
   * Convert array data to object format
   */
  private static arrayToObjectFormat(data: any[], chartType: string): any {
    if (data.length === 0) {
      return { labels: [], datasets: [] };
    }

    // Determine if array is simple values or objects
    const firstItem = data[0];
    
    if (typeof firstItem === 'number' || typeof firstItem === 'string') {
      // Simple array: [1, 2, 3] -> { labels: ['Item 1', 'Item 2'], datasets: [{ data: [1, 2, 3] }] }
      return {
        labels: data.map((_, index) => `Item ${index + 1}`),
        datasets: [{ data, label: 'Data' }]
      };
    } else if (typeof firstItem === 'object' && firstItem !== null) {
      // Array of objects: [{x: 1, y: 2}, {x: 2, y: 3}]
      return this.objectArrayToChartFormat(data);
    }

    return { labels: [], datasets: [] };
  }

  /**
   * Convert table format to Chart.js format
   */
  private static tableToChartFormat(table: { rows: any[]; columns: string[] }): any {
    const { rows, columns } = table;
    
    if (columns.length < 2) {
      return { labels: [], datasets: [] };
    }

    // First column is labels, rest are datasets
    const labels = rows.map(row => row[columns[0]]);
    const datasets = columns.slice(1).map((column, index) => ({
      label: column,
      data: rows.map(row => row[column]),
      backgroundColor: this.getDefaultColor(index)
    }));

    return { labels, datasets };
  }

  /**
   * Convert simple format to Chart.js format
   */
  private static simpleToChartFormat(simple: { values: any[]; labels?: string[]; label?: string }): any {
    const { values, labels, label } = simple;
    
    return {
      labels: labels || values.map((_, index) => `Item ${index + 1}`),
      datasets: [{
        data: values,
        label: label || 'Data'
      }]
    };
  }

  /**
   * Convert object array to Chart.js format
   */
  private static objectArrayToChartFormat(data: any[]): any {
    if (data.length === 0) {
      return { labels: [], datasets: [] };
    }

    const keys = Object.keys(data[0]);
    
    if (keys.length === 2) {
      // Simple x,y data
      const xKey = keys[0];
      const yKey = keys[1];
      
      return {
        labels: data.map(item => item[xKey]),
        datasets: [{
          data: data.map(item => item[yKey]),
          label: yKey
        }]
      };
    } else if (keys.length > 2) {
      // Multi-dataset data
      const labelKey = keys[0];
      const dataKeys = keys.slice(1);
      
      return {
        labels: data.map(item => item[labelKey]),
        datasets: dataKeys.map((key, index) => ({
          label: key,
          data: data.map(item => item[key]),
          backgroundColor: this.getDefaultColor(index)
        }))
      };
    }

    return { labels: [], datasets: [] };
  }

  /**
   * Ensure Chart.js structure
   */
  private static ensureChartStructure(data: any, chartType: string): any {
    const structure = { ...data };

    // Ensure labels array exists
    if (!structure.labels) {
      structure.labels = [];
    }

    // Ensure datasets array exists
    if (!structure.datasets) {
      structure.datasets = [];
    }

    // Validate datasets
    structure.datasets = structure.datasets.map((dataset: any, index: number) => {
      const normalizedDataset = { ...dataset };

      // Ensure data array exists
      if (!normalizedDataset.data) {
        normalizedDataset.data = [];
      }

      // Ensure label exists
      if (!normalizedDataset.label) {
        normalizedDataset.label = `Dataset ${index + 1}`;
      }

      // Set default colors if not provided
      if (!normalizedDataset.backgroundColor) {
        normalizedDataset.backgroundColor = this.getDefaultColor(index);
      }

      if (!normalizedDataset.borderColor) {
        normalizedDataset.borderColor = this.getDefaultColor(index);
      }

      return normalizedDataset;
    });

    return structure;
  }

  /**
   * Extract labels and datasets from processed data
   */
  private static extractLabelsAndDatasets(data: any): { labels: string[]; datasets: any[] } {
    return {
      labels: data.labels || [],
      datasets: data.datasets || []
    };
  }

  /**
   * Generate metadata about the data
   */
  private static generateMetadata(datasets: any[]): ProcessedData['metadata'] {
    let totalDataPoints = 0;
    let hasNullValues = false;
    let hasNegativeValues = false;
    let min = Infinity;
    let max = -Infinity;

    datasets.forEach(dataset => {
      if (dataset.data) {
        totalDataPoints += dataset.data.length;
        
        dataset.data.forEach((value: any) => {
          if (value === null || value === undefined) {
            hasNullValues = true;
          } else if (typeof value === 'number') {
            if (value < 0) hasNegativeValues = true;
            if (value < min) min = value;
            if (value > max) max = value;
          }
        });
      }
    });

    return {
      totalDataPoints,
      datasetCount: datasets.length,
      hasNullValues,
      hasNegativeValues,
      dataRange: {
        min: min === Infinity ? 0 : min,
        max: max === -Infinity ? 0 : max
      }
    };
  }

  /**
   * Validate chart type specific requirements
   */
  private static validateChartType(data: any, chartType: string): DataValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    switch (chartType) {
      case 'pie':
      case 'doughnut':
        if (data.datasets && data.datasets.length > 1) {
          warnings.push('Pie charts typically work better with a single dataset');
        }
        if (data.labels && data.labels.length > 10) {
          warnings.push('Pie charts with many categories can be hard to read');
          suggestions.push('Consider grouping smaller categories or using a bar chart');
        }
        break;

      case 'line':
      case 'area':
        if (data.datasets && data.datasets.length === 0) {
          errors.push('Line charts require at least one dataset');
        }
        if (data.labels && data.labels.length < 2) {
          warnings.push('Line charts need at least 2 data points to show trends');
        }
        break;

      case 'scatter':
      case 'bubble':
        if (data.datasets && data.datasets.length > 0) {
          data.datasets.forEach((dataset: any, index: number) => {
            if (dataset.data) {
              dataset.data.forEach((point: any) => {
                if (Array.isArray(point)) {
                  if (point.length < (chartType === 'bubble' ? 3 : 2)) {
                    errors.push(`Dataset ${index + 1}: ${chartType} charts require ${chartType === 'bubble' ? 3 : 2} values per data point`);
                  }
                } else if (typeof point === 'object' && point !== null) {
                  const requiredProps = chartType === 'bubble' ? ['x', 'y', 'r'] : ['x', 'y'];
                  requiredProps.forEach(prop => {
                    if (!(prop in point)) {
                      errors.push(`Dataset ${index + 1}: Missing required property '${prop}' for ${chartType} chart`);
                    }
                  });
                }
              });
            }
          });
        }
        break;

      case 'radar':
        if (data.labels && data.labels.length < 3) {
          warnings.push('Radar charts work best with 3 or more axes');
        }
        break;
    }

    return { isValid: errors.length === 0, errors, warnings, suggestions };
  }

  /**
   * Validate data quality
   */
  private static validateDataQuality(data: any): DataValidationResult {
    const warnings: string[] = [];
    const suggestions: string[] = [];

    if (data.datasets) {
      data.datasets.forEach((dataset: any, index: number) => {
        if (dataset.data) {
          const nonNullCount = dataset.data.filter((value: any) => 
            value !== null && value !== undefined && value !== ''
          ).length;

          const nullPercentage = ((dataset.data.length - nonNullCount) / dataset.data.length) * 100;

          if (nullPercentage > 20) {
            warnings.push(`Dataset ${index + 1} has ${nullPercentage.toFixed(1)}% missing values`);
            suggestions.push('Consider cleaning the data or using interpolation');
          }

          if (nonNullCount === 0) {
            warnings.push(`Dataset ${index + 1} is empty`);
          }
        }
      });
    }

    return { isValid: true, errors: [], warnings, suggestions };
  }

  /**
   * Get default color for dataset
   */
  private static getDefaultColor(index: number): string {
    const colors = [
      '#3B82F6', '#8B5CF6', '#06D6A0', '#60A5FA', '#A78BFA',
      '#34D399', '#93C5FD', '#C4B5FD', '#6EE7B7', '#A5F3FC'
    ];
    return colors[index % colors.length];
  }

  /**
   * Clean and optimize data
   */
  static cleanData(data: any): any {
    const cleaned = { ...data };

    if (cleaned.datasets) {
      cleaned.datasets = cleaned.datasets.map((dataset: any) => {
        const cleanedDataset = { ...dataset };

        if (cleanedDataset.data) {
          // Remove null/undefined values and corresponding labels
          const validIndices: number[] = [];
          cleanedDataset.data.forEach((value: any, index: number) => {
            if (value !== null && value !== undefined && value !== '') {
              validIndices.push(index);
            }
          });

          cleanedDataset.data = validIndices.map(i => cleanedDataset.data[i]);
        }

        return cleanedDataset;
      });

      // Sync labels if datasets were cleaned
      if (cleaned.labels && cleaned.datasets.length > 0) {
        const minLength = Math.min(
          cleaned.labels.length,
          ...cleaned.datasets.map((d: any) => d.data.length)
        );
        cleaned.labels = cleaned.labels.slice(0, minLength);
      }
    }

    return cleaned;
  }

  /**
   * Aggregate data for better performance with large datasets
   */
  static aggregateData(data: any, maxPoints: number = 100): any {
    if (!data.datasets || data.datasets.length === 0) {
      return data;
    }

    const aggregated = { ...data };

    // Check if aggregation is needed
    const totalPoints = data.datasets.reduce((sum: number, dataset: any) => 
      sum + (dataset.data?.length || 0), 0
    );

    if (totalPoints <= maxPoints) {
      return data; // No aggregation needed
    }

    // Simple aggregation: sample every nth point
    const sampleRate = Math.ceil(totalPoints / maxPoints);

    aggregated.datasets = data.datasets.map((dataset: any) => {
      if (!dataset.data) return dataset;

      const sampledData = dataset.data.filter((_: any, index: number) => 
        index % sampleRate === 0
      );

      return {
        ...dataset,
        data: sampledData
      };
    });

    // Sample labels accordingly
    if (aggregated.labels) {
      aggregated.labels = aggregated.labels.filter((_: any, index: number) => 
        index % sampleRate === 0
      );
    }

    return aggregated;
  }
}

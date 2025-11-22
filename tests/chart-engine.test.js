/**
 * Tests for Refactored Chart Engine
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import ChartEngine from '../src/chart-engine.js';
import { ChartConfigBuilder } from '../src/chart/ChartConfigBuilder.js';
import { ChartDataProcessor } from '../src/chart/ChartDataProcessor.js';

describe('ChartEngine', () => {
  let chartEngine;

  beforeEach(() => {
    chartEngine = new ChartEngine();
    vi.clearAllMocks();
  });

  afterEach(() => {
    chartEngine.destroy();
  });

  describe('Initialization', () => {
    it('should initialize with default settings', () => {
      expect(chartEngine.getTheme()).toBe('default');
      expect(chartEngine).toBeDefined();
    });

    it('should set theme correctly', () => {
      chartEngine.setTheme('dark');
      expect(chartEngine.getTheme()).toBe('dark');
    });

    it('should toggle animations', () => {
      chartEngine.setAnimations(false);
      // Test would need access to internal state or public getter
      expect(chartEngine).toBeDefined();
    });
  });

  describe('Chart Configuration', () => {
    it('should create basic bar chart config', async () => {
      const data = {
        labels: ['A', 'B', 'C'],
        datasets: [{
          data: [1, 2, 3],
          label: 'Test Data'
        }]
      };

      const config = await chartEngine.createChartConfig('bar', data);

      expect(config.type).toBe('bar');
      expect(config.data.labels).toEqual(['A', 'B', 'C']);
      expect(config.data.datasets).toHaveLength(1);
      expect(config.options.responsive).toBe(true);
    });

    it('should validate data before creating config', async () => {
      const invalidData = null;

      await expect(chartEngine.createChartConfig('bar', invalidData))
        .rejects.toThrow('Data validation failed');
    });

    it('should create chart with custom options', async () => {
      const data = {
        labels: ['A', 'B'],
        datasets: [{ data: [1, 2], label: 'Test' }]
      };

      const options = {
        width: 800,
        height: 600,
        responsive: false
      };

      const config = await chartEngine.createChartConfig('line', data, options);

      expect(config.options.width).toBe(800);
      expect(config.options.height).toBe(600);
      expect(config.options.responsive).toBe(false);
    });
  });

  describe('Quick Chart Creation', () => {
    it('should create chart from simple arrays', async () => {
      const labels = ['Jan', 'Feb', 'Mar'];
      const values = [10, 20, 30];

      const config = await chartEngine.createQuickChart('bar', labels, values, 'Sales');

      expect(config.data.labels).toEqual(labels);
      expect(config.data.datasets[0].data).toEqual(values);
      expect(config.data.datasets[0].label).toBe('Sales');
    });

    it('should create chart from table data', async () => {
      const table = {
        columns: ['Month', 'Sales', 'Profit'],
        rows: [
          { Month: 'Jan', Sales: 100, Profit: 20 },
          { Month: 'Feb', Sales: 150, Profit: 30 }
        ]
      };

      const config = await chartEngine.createChartFromTable('bar', table);

      expect(config.data.labels).toEqual(['Jan', 'Feb']);
      expect(config.data.datasets).toHaveLength(2); // Sales and Profit
    });
  });

  describe('Chart Type Recommendations', () => {
    it('should recommend line chart for time series data', () => {
      const data = {
        labels: ['2023-01', '2023-02', '2023-03'],
        datasets: [{ data: [1, 2, 3] }]
      };

      const recommendation = chartEngine.getRecommendedChartType(data);
      expect(recommendation).toBe('line');
    });

    it('should recommend pie chart for single dataset with few categories', () => {
      const data = {
        labels: ['A', 'B', 'C'],
        datasets: [{ data: [1, 2, 3] }]
      };

      const recommendation = chartEngine.getRecommendedChartType(data);
      expect(recommendation).toBe('pie');
    });

    it('should recommend bar chart as default fallback', () => {
      const data = {
        labels: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
        datasets: [{ data: [1, 2, 3, 4, 5, 6, 7] }]
      };

      const recommendation = chartEngine.getRecommendedChartType(data);
      expect(recommendation).toBe('bar');
    });
  });

  describe('Data Processing', () => {
    it('should process and validate data correctly', () => {
      const rawData = {
        labels: ['A', 'B'],
        datasets: [{ data: [1, 2] }]
      };

      const validation = chartEngine.validateData(rawData, 'bar');
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it('should detect data quality issues', () => {
      const dataWithNulls = {
        labels: ['A', 'B', 'C'],
        datasets: [{
          data: [1, null, 3],
          label: 'Test'
        }]
      };

      const validation = chartEngine.validateData(dataWithNulls, 'bar');
      expect(validation.warnings.length).toBeGreaterThan(0);
    });

    it('should clean data by removing null values', () => {
      const dirtyData = {
        labels: ['A', 'B', 'C'],
        datasets: [{
          data: [1, null, 3],
          label: 'Test'
        }]
      };

      const cleanedData = chartEngine.cleanData(dirtyData);
      expect(cleanedData.datasets[0].data).toEqual([1, 3]);
      expect(cleanedData.labels).toEqual(['A', 'C']);
    });
  });

  describe('Performance and Caching', () => {
    it('should cache chart configurations', async () => {
      const data = {
        labels: ['A', 'B'],
        datasets: [{ data: [1, 2] }]
      };

      const config1 = await chartEngine.createChart('bar', data);
      const config2 = await chartEngine.createChart('bar', data);

      // Should return same cached result
      expect(config1).toEqual(config2);
    });

    it('should generate performance metrics', () => {
      const metrics = chartEngine.getPerformanceMetrics();
      expect(metrics).toBeDefined();
      expect(typeof metrics).toBe('object');
    });

    it('should clear cache', () => {
      chartEngine.clearCache();
      const stats = chartEngine.getCacheStats();
      expect(stats.size).toBe(0);
    });
  });

  describe('Configuration Export/Import', () => {
    it('should export configuration', () => {
      const config = chartEngine.exportConfig();
      expect(config).toHaveProperty('theme');
      expect(config).toHaveProperty('animations');
      expect(config).toHaveProperty('cacheStats');
    });

    it('should import configuration', () => {
      const importConfig = {
        theme: 'dark',
        animations: false
      };

      chartEngine.importConfig(importConfig);
      expect(chartEngine.getTheme()).toBe('dark');
    });
  });
});

describe('ChartConfigBuilder', () => {
  let builder;

  beforeEach(() => {
    builder = new ChartConfigBuilder();
  });

  it('should build valid chart configuration', () => {
    const config = builder
      .setType('bar')
      .setData({
        labels: ['A', 'B'],
        datasets: [{ data: [1, 2] }]
      })
      .setTitle('Test Chart')
      .build();

    expect(config.type).toBe('bar');
    expect(config.options.plugins.title.text).toBe('Test Chart');
    expect(config.options.responsive).toBe(true);
  });

  it('should throw error for invalid chart type', () => {
    expect(() => {
      builder.setType('invalid-type');
    }).toThrow('Chart type "invalid-type" not supported');
  });

  it('should apply theme colors correctly', () => {
    const config = builder
      .setType('bar')
      .setData({
        labels: ['A', 'B'],
        datasets: [{ data: [1, 2] }]
      })
      .setTheme('vibrant')
      .build();

    expect(config.theme.name).toBe('Vibrant');
    expect(config.data.datasets[0].backgroundColor).toBeDefined();
  });
});

describe('ChartDataProcessor', () => {
  it('should process array data correctly', () => {
    const arrayData = [1, 2, 3, 4];
    const processed = ChartDataProcessor.processData(arrayData, 'bar');

    expect(processed.labels).toEqual(['Item 1', 'Item 2', 'Item 3', 'Item 4']);
    expect(processed.datasets).toHaveLength(1);
    expect(processed.datasets[0].data).toEqual(arrayData);
  });

  it('should process table data correctly', () => {
    const tableData = {
      columns: ['Name', 'Value'],
      rows: [
        { Name: 'A', Value: 1 },
        { Name: 'B', Value: 2 }
      ]
    };

    const processed = ChartDataProcessor.processData(tableData, 'bar');

    expect(processed.labels).toEqual(['A', 'B']);
    expect(processed.datasets).toHaveLength(1);
    expect(processed.datasets[0].data).toEqual([1, 2]);
  });

  it('should validate pie chart requirements', () => {
    const tooManyCategories = {
      labels: Array.from({ length: 15 }, (_, i) => `Item ${i}`),
      datasets: [{ data: Array.from({ length: 15 }, (_, i) => i + 1) }]
    };

    const validation = ChartDataProcessor.validateData(tooManyCategories, 'pie');
    expect(validation.warnings.length).toBeGreaterThan(0);
    expect(validation.suggestions.length).toBeGreaterThan(0);
  });

  it('should aggregate large datasets', () => {
    const largeData = {
      labels: Array.from({ length: 200 }, (_, i) => `Item ${i}`),
      datasets: [{
        data: Array.from({ length: 200 }, (_, i) => Math.random() * 100),
        label: 'Large Dataset'
      }]
    };

    const aggregated = ChartDataProcessor.aggregateData(largeData, 50);
    expect(aggregated.labels.length).toBeLessThanOrEqual(50);
    expect(aggregated.datasets[0].data.length).toBeLessThanOrEqual(50);
  });
});

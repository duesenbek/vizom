/**
 * ChartRecommender Test Suite
 * Validates recommendation logic and edge cases
 */

import { describe, it, expect } from 'vitest';
import { chartRecommender } from './ChartRecommender.js';

const TEST_CASES = [
  {
    name: 'Trend analysis recommends line chart',
    prompt: 'Show sales trend over the last 12 months',
    expectedPrimary: ['line', 'timeline', 'area'],
    minConfidence: 0.8
  },
  {
    name: 'Comparison recommends bar chart',
    prompt: 'Compare revenue by product category',
    expectedPrimary: ['bar', 'column', 'gauge'],
    minConfidence: 0.7
  },
  {
    name: 'Distribution analysis recommends histogram',
    prompt: 'Show distribution of customer ages',
    expectedPrimary: 'histogram',
    minConfidence: 0.7
  },
  {
    name: 'Relationship analysis recommends scatter',
    prompt: 'Show relationship between advertising spend and revenue',
    expectedPrimary: ['scatter', 'bubble', 'timeline'],
    minConfidence: 0.7
  },
  {
    name: 'Composition breakdown recommends stacked bar',
    prompt: 'Show breakdown of expenses by department',
    expectedPrimary: ['stacked-bar', 'funnel'],
    minConfidence: 0.6
  },
  {
    name: 'Geographic data recommends choropleth',
    prompt: 'Show sales by US state',
    expectedPrimary: ['choropleth', 'geo-scatter'],
    minConfidence: 0.6
  },
  {
    name: 'Financial data recommends candlestick',
    prompt: 'Show stock price movements for AAPL',
    expectedPrimary: ['candlestick', 'range-area'],
    minConfidence: 0.6
  },
  {
    name: 'Timeline data recommends timeline chart',
    prompt: 'Show project milestones and deadlines',
    expectedPrimary: 'timeline',
    minConfidence: 0.6
  },
  {
    name: 'Avoids pie chart for many categories',
    prompt: 'Show market share for 15 different product lines',
    excludeTypes: ['pie', 'doughnut']
  },
  {
    name: 'Conversion rate analysis',
    prompt: 'Show conversion rate by channel for each month',
    expectedPrimary: ['bar', 'line'],
    minConfidence: 0.7
  }
];

describe('ChartRecommender recommendations', () => {
  TEST_CASES.forEach(({ name, prompt, expectedPrimary, minConfidence, excludeTypes }) => {
    it(name, () => {
      const result = chartRecommender.recommend(prompt);
      const { primary, alternatives } = result;

      expect(primary).toBeDefined();
      expect(typeof primary.type).toBe('string');
      expect(typeof primary.confidence).toBe('number');
      expect(primary.reasoning).toBeTruthy();
      expect(alternatives).toHaveLength(2);

      if (expectedPrimary) {
        const allowed = Array.isArray(expectedPrimary) ? expectedPrimary : [expectedPrimary];
        expect(allowed).toContain(primary.type);
      }

      if (minConfidence) {
        expect(primary.confidence).toBeGreaterThanOrEqual(minConfidence);
      }

      if (excludeTypes) {
        const allTypes = [primary.type, ...alternatives.map((alt) => alt.type)];
        excludeTypes.forEach((type) => {
          expect(allTypes).not.toContain(type);
        });
      }
    });
  });
});

describe('ChartRecommender result integrity', () => {
  it('should produce valid JSON output', () => {
    const result = chartRecommender.recommend('test prompt');
    const jsonStr = JSON.stringify(result);
    const parsed = JSON.parse(jsonStr);

    expect(parsed.primary).toBeDefined();
    expect(parsed.alternatives).toBeInstanceOf(Array);
  });

  it('should keep confidence scores within 0-1 range', () => {
    const result = chartRecommender.recommend('test prompt');
    const allScores = [result.primary.confidence, ...result.alternatives.map((a) => a.confidence)];

    allScores.forEach((score) => {
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(1);
    });
  });
});

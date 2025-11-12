/**
 * ChartRecommender - AI-powered chart type recommendation engine
 * Analyzes user prompts and data to suggest optimal visualizations
 */

import { getAllChartTypes, getChartTypeById } from './chart-types.js';

export class ChartRecommender {
  constructor() {
    this.chartTypes = getAllChartTypes();
    this.typeIndex = new Map(this.chartTypes.map(t => [t.id, t]));
    this.keywords = this.buildKeywordMap();
    this.rules = this.buildRules();
  }
  
  buildKeywordMap() {
    return {
      // Trend keywords
      trend: ['trend', 'over time', 'change', 'growth', 'decline', 'increase', 'decrease', 'progress', 'evolution'],
      
      // Comparison keywords  
      comparison: ['compare', 'vs', 'versus', 'difference', 'better', 'worse', 'ranking', 'top', 'bottom'],
      
      // Distribution keywords
      distribution: ['distribution', 'spread', 'range', 'variability', 'histogram', 'frequency', 'density'],
      
      // Relationship keywords
      relationship: ['relationship', 'correlation', 'between', 'vs', 'against', 'depends on', 'affects'],
      
      // Composition keywords
      composition: ['breakdown', 'composition', 'parts', 'segments', 'share', 'percentage', 'proportion', 'total'],
      
      // Geographic keywords
      geographic: ['map', 'country', 'state', 'region', 'location', 'geo', 'spatial'],
      
      // Financial keywords
      financial: ['stock', 'price', 'trading', 'candlestick', 'ohlc', 'volume', 'market'],
      
      // Time keywords
      temporal: ['timeline', 'schedule', 'duration', 'start', 'end', 'milestone', 'gantt']
    };
  }
  
  buildRules() {
    return {
      // Rule: Avoid pie charts for >5 categories
      pieLimit: (prompt, data) => {
        const categories = this.extractCategories(prompt, data);
        if (categories.length > 5) {
          return { exclude: ['pie', 'doughnut'], reason: 'Too many categories for pie chart' };
        }
        return null;
      },
      
      // Rule: Prioritize line/area for trends
      trendPriority: (prompt, data) => {
        if (this.matchesKeywords(prompt, this.keywords.trend)) {
          return { boost: ['line', 'area', 'spline', 'stepped-area'], factor: 0.2 };
        }
        return null;
      },
      
      // Rule: Distribution charts for spread analysis
      distributionPriority: (prompt, data) => {
        if (this.matchesKeywords(prompt, this.keywords.distribution)) {
          return { boost: ['histogram', 'boxplot', 'violin', 'density'], factor: 0.25 };
        }
        return null;
      },
      
      // Rule: Scatter for relationships
      relationshipPriority: (prompt, data) => {
        if (this.matchesKeywords(prompt, this.keywords.relationship)) {
          return { boost: ['scatter', 'bubble'], factor: 0.3 };
        }
        return null;
      },
      
      // Rule: Composition charts for breakdowns
      compositionPriority: (prompt, data) => {
        if (this.matchesKeywords(prompt, this.keywords.composition)) {
          return { boost: ['stacked-bar', 'stacked-area', 'treemap', 'sunburst', 'funnel'], factor: 0.2 };
        }
        return null;
      },
      
      // Rule: Geographic charts for location data
      geographicPriority: (prompt, data) => {
        if (this.matchesKeywords(prompt, this.keywords.geographic)) {
          return { boost: ['choropleth', 'geo-scatter', 'geo-heatmap'], factor: 0.3 };
        }
        return null;
      },
      
      // Rule: Financial charts for market data
      financialPriority: (prompt, data) => {
        if (this.matchesKeywords(prompt, this.keywords.financial)) {
          return { boost: ['candlestick', 'ohlc', 'range-area'], factor: 0.25 };
        }
        return null;
      },
      
      // Rule: Temporal charts for time-based events
      temporalPriority: (prompt, data) => {
        if (this.matchesKeywords(prompt, this.keywords.temporal)) {
          return { boost: ['timeline', 'gantt', 'range-bar'], factor: 0.2 };
        }
        return null;
      }
    };
  }
  
  matchesKeywords(text, keywords) {
    const lower = text.toLowerCase();
    return keywords.some(keyword => lower.includes(keyword));
  }
  
  extractCategories(prompt, data = null) {
    // Simple extraction - in real implementation would be more sophisticated
    const categories = [];
    
    // Extract from prompt
    const words = prompt.toLowerCase().split(/\s+/);
    const categoryWords = words.filter(word => 
      word.includes('channel') || 
      word.includes('category') || 
      word.includes('segment') ||
      word.includes('type')
    );
    
    if (data && Array.isArray(data)) {
      // Extract from data structure
      if (data.length > 0 && typeof data[0] === 'object') {
        const keys = Object.keys(data[0]);
        // Assume non-numeric keys are categories
        categories.push(...keys.filter(key => 
          !isNaN(parseFloat(data[0][key])) && key !== 'date' && key !== 'time'
        ));
      }
    }
    
    return categories.length > 0 ? categories : ['unknown'];
  }
  
  calculateBaseScore(chartType, prompt, data) {
    let score = 0.5; // Base score
    
    // Boost based on chart type characteristics
    switch (chartType.category) {
      case 'basic':
        score += 0.1; // Basic charts are generally versatile
        break;
      case 'comparison':
        if (this.matchesKeywords(prompt, this.keywords.comparison)) {
          score += 0.2;
        }
        break;
      case 'distribution':
        if (this.matchesKeywords(prompt, this.keywords.distribution)) {
          score += 0.2;
        }
        break;
      case 'composition':
        if (this.matchesKeywords(prompt, this.keywords.composition)) {
          score += 0.2;
        }
        break;
      case 'financial':
        if (this.matchesKeywords(prompt, this.keywords.financial)) {
          score += 0.2;
        }
        break;
      case 'spatial':
        if (this.matchesKeywords(prompt, this.keywords.geographic)) {
          score += 0.2;
        }
        break;
      case 'temporal':
        if (this.matchesKeywords(prompt, this.keywords.temporal)) {
          score += 0.2;
        }
        break;
    }
    
    // Adjust for difficulty (prefer simpler charts for general use)
    switch (chartType.difficulty) {
      case 'beginner':
        score += 0.1;
        break;
      case 'advanced':
        score -= 0.1;
        break;
    }
    
    // Adjust for data size
    if (data) {
      const dataSize = Array.isArray(data) ? data.length : Object.keys(data).length;
      if (dataSize > 10000 && chartType.library === 'chartjs') {
        score -= 0.2; // Chart.js may struggle with very large datasets
      }
      if (dataSize < chartType.dataRequirements.minPoints) {
        score -= 0.3; // Insufficient data
      }
    }
    
    return Math.max(0, Math.min(1, score));
  }
  
  applyRules(chartType, prompt, data, baseScore) {
    let finalScore = baseScore;
    const appliedRules = [];
    
    Object.values(this.rules).forEach(rule => {
      const result = rule(prompt, data);
      if (result) {
        if (result.exclude && result.exclude.includes(chartType.id)) {
          finalScore = 0;
          appliedRules.push(`Excluded: ${result.reason}`);
        } else if (result.boost && result.boost.includes(chartType.id)) {
          finalScore = Math.min(1, finalScore + result.factor);
          appliedRules.push(`Boosted: +${result.factor}`);
        }
      }
    });
    
    return { score: finalScore, appliedRules };
  }
  
  generateReasoning(chartType, prompt, score, appliedRules) {
    const reasons = [];
    
    if (score > 0.8) {
      reasons.push('Excellent match for your requirements');
    } else if (score > 0.6) {
      reasons.push('Good fit for this data');
    } else if (score > 0.4) {
      reasons.push('Possible option with limitations');
    }
    
    // Add category-specific reasoning
    switch (chartType.category) {
      case 'basic':
        reasons.push('Simple and clear visualization');
        break;
      case 'comparison':
        reasons.push('Great for comparing values');
        break;
      case 'distribution':
        reasons.push('Shows data spread and patterns');
        break;
      case 'composition':
        reasons.push('Highlights parts of a whole');
        break;
      case 'financial':
        reasons.push('Specialized for financial data');
        break;
      case 'spatial':
        reasons.push('Geographic visualization');
        break;
      case 'temporal':
        reasons.push('Time-based analysis');
        break;
    }
    
    return reasons.join('. ');
  }
  
  recommend(prompt, data = null) {
    const scores = [];
    
    // Calculate scores for all chart types
    this.chartTypes.forEach(chartType => {
      const baseScore = this.calculateBaseScore(chartType, prompt, data);
      const { score, appliedRules } = this.applyRules(chartType, prompt, data, baseScore);
      
      if (score > 0) {
        scores.push({
          type: chartType.id,
          score,
          chartType,
          appliedRules
        });
      }
    });
    
    // Sort by score
    scores.sort((a, b) => b.score - a.score);
    
    // Get top recommendations
    const primary = scores[0];
    const alternatives = scores.slice(1, 3);
    
    const result = {
      primary: {
        type: primary.type,
        confidence: Math.round(primary.score * 100) / 100,
        reasoning: this.generateReasoning(primary.chartType, prompt, primary.score, primary.appliedRules)
      },
      alternatives: alternatives.map(alt => ({
        type: alt.type,
        confidence: Math.round(alt.score * 100) / 100,
        reasoning: this.generateReasoning(alt.chartType, prompt, alt.score, alt.appliedRules)
      }))
    };
    
    return result;
  }
  
  // Utility method for quick recommendations
  quickRecommend(prompt) {
    return this.recommend(prompt);
  }
}

// Export singleton instance
export const chartRecommender = new ChartRecommender();

/**
 * ChartRecommender Test Suite
 * Validates recommendation logic and edge cases
 */

import { chartRecommender } from './ChartRecommender.js';

function runTests() {
  console.log('🧪 Running ChartRecommender tests...\n');
  
  const tests = [
    {
      name: 'Trend analysis recommends line chart',
      prompt: 'Show sales trend over the last 12 months',
      expectedPrimary: 'line',
      minConfidence: 0.8
    },
    {
      name: 'Comparison recommends bar chart',
      prompt: 'Compare revenue by product category',
      expectedPrimary: 'bar',
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
      expectedPrimary: 'scatter',
      minConfidence: 0.7
    },
    {
      name: 'Composition breakdown recommends stacked bar',
      prompt: 'Show breakdown of expenses by department',
      expectedPrimary: 'stacked-bar',
      minConfidence: 0.6
    },
    {
      name: 'Geographic data recommends choropleth',
      prompt: 'Show sales by US state',
      expectedPrimary: 'choropleth',
      minConfidence: 0.6
    },
    {
      name: 'Financial data recommends candlestick',
      prompt: 'Show stock price movements for AAPL',
      expectedPrimary: 'candlestick',
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
      expectedPrimary: 'bar',
      minConfidence: 0.7
    }
  ];
  
  let passed = 0;
  let failed = 0;
  
  tests.forEach(test => {
    try {
      const result = chartRecommender.recommend(test.prompt);
      const primary = result.primary;
      
      let testPassed = true;
      let issues = [];
      
      // Check expected primary type
      if (test.expectedPrimary && primary.type !== test.expectedPrimary) {
        testPassed = false;
        issues.push(`Expected ${test.expectedPrimary}, got ${primary.type}`);
      }
      
      // Check minimum confidence
      if (test.minConfidence && primary.confidence < test.minConfidence) {
        testPassed = false;
        issues.push(`Confidence ${primary.confidence} below minimum ${test.minConfidence}`);
      }
      
      // Check excluded types
      if (test.excludeTypes) {
        const allTypes = [primary.type, ...result.alternatives.map(a => a.type)];
        const excludedFound = allTypes.filter(type => test.excludeTypes.includes(type));
        if (excludedFound.length > 0) {
          testPassed = false;
          issues.push(`Found excluded types: ${excludedFound.join(', ')}`);
        }
      }
      
      // Check result structure
      if (!primary.type || typeof primary.confidence !== 'number' || !primary.reasoning) {
        testPassed = false;
        issues.push('Invalid primary result structure');
      }
      
      if (!Array.isArray(result.alternatives) || result.alternatives.length !== 2) {
        testPassed = false;
        issues.push('Invalid alternatives structure');
      }
      
      if (testPassed) {
        console.log(`✅ ${test.name}`);
        console.log(`   Primary: ${primary.type} (${primary.confidence})`);
        console.log(`   Reasoning: ${primary.reasoning}\n`);
        passed++;
      } else {
        console.log(`❌ ${test.name}`);
        console.log(`   Issues: ${issues.join(', ')}`);
        console.log(`   Got: ${JSON.stringify(result, null, 2)}\n`);
        failed++;
      }
      
    } catch (error) {
      console.log(`❌ ${test.name} - Error: ${error.message}\n`);
      failed++;
    }
  });
  
  console.log(`📊 Test Results: ${passed} passed, ${failed} failed`);
  
  // Additional validation tests
  console.log('\n🔍 Additional validation tests...');
  
  // Test JSON output format
  try {
    const result = chartRecommender.recommend('test prompt');
    const jsonStr = JSON.stringify(result);
    const parsed = JSON.parse(jsonStr);
    console.log('✅ JSON output format is valid');
  } catch (error) {
    console.log('❌ JSON output format is invalid:', error.message);
  }
  
  // Test confidence scores are within bounds
  try {
    const result = chartRecommender.recommend('test prompt');
    const allScores = [
      result.primary.confidence,
      ...result.alternatives.map(a => a.confidence)
    ];
    
    const allValid = allScores.every(score => score >= 0 && score <= 1);
    if (allValid) {
      console.log('✅ All confidence scores are within 0-1 range');
    } else {
      console.log('❌ Some confidence scores are out of bounds:', allScores);
    }
  } catch (error) {
    console.log('❌ Error validating confidence scores:', error.message);
  }
  
  console.log('\n🎯 Recommendation engine tests complete!');
}

// Export for use in other modules
export { runTests };

// Auto-run if this file is executed directly
if (typeof window !== 'undefined') {
  // Browser environment
  window.runChartRecommenderTests = runTests;
} else if (typeof global !== 'undefined') {
  // Node environment
  global.runChartRecommenderTests = runTests;
}

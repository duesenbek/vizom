/**
 * ChartTypeSelector Performance Test Suite
 * Tests performance with 60+ chart types, rapid clicks, and mobile validation
 */

import { OptimizedChartTypeSelector } from './OptimizedChartTypeSelector.js';
import { getAllChartTypes } from '../charts/chart-types.js';

export class ChartTypeSelectorTest {
  constructor() {
    this.testResults = [];
    this.isRunning = false;
    this.testContainer = null;
  }

  /**
   * Run comprehensive performance tests
   */
  async runPerformanceTests() {
    console.log('🚀 Starting ChartTypeSelector Performance Tests...');
    this.isRunning = true;
    
    try {
      // Test 1: Large dataset rendering performance
      await this.testLargeDatasetRendering();
      
      // Test 2: Rapid clicking performance
      await this.testRapidClicking();
      
      // Test 3: Mobile scroll performance
      await this.testMobileScrolling();
      
      // Test 4: Search performance
      await this.testSearchPerformance();
      
      // Test 5: Memory usage
      await this.testMemoryUsage();
      
      // Test 6: AI recommendation updates
      await this.testAIRecommendationUpdates();
      
      this.displayResults();
      
    } catch (error) {
      console.error('❌ Test suite failed:', error);
    } finally {
      this.isRunning = false;
    }
  }

  /**
   * Test rendering performance with 60+ chart types
   */
  async testLargeDatasetRendering() {
    console.log('📊 Testing large dataset rendering...');
    
    const startTime = performance.now();
    
    // Create test container
    this.createTestContainer();
    
    // Generate 60+ chart types for testing
    const chartTypes = this.generateTestChartTypes(65);
    
    // Mock getAllChartTypes to return our test data
    const originalGetAllChartTypes = window.getAllChartTypes;
    window.getAllChartTypes = () => chartTypes;
    
    // Initialize selector
    const selector = new OptimizedChartTypeSelector(this.testContainer, {
      virtualScrolling: true,
      itemsPerRow: 4,
      visibleRows: 4
    });
    
    const renderTime = performance.now() - startTime;
    
    // Measure first paint
    const paintTime = await this.measureFirstPaint();
    
    // Test results
    this.addTestResult('Large Dataset Rendering', {
      chartTypesCount: chartTypes.length,
      renderTime: Math.round(renderTime),
      firstPaintTime: Math.round(paintTime),
      passed: renderTime < 100 && paintTime < 50,
      recommendation: renderTime < 100 ? '✅ Excellent' : renderTime < 200 ? '⚠️ Good' : '❌ Needs optimization'
    });
    
    // Cleanup
    selector.destroy();
    window.getAllChartTypes = originalGetAllChartTypes;
  }

  /**
   * Test rapid clicking performance
   */
  async testRapidClicking() {
    console.log('⚡ Testing rapid clicking performance...');
    
    this.createTestContainer();
    
    const selector = new OptimizedChartTypeSelector(this.testContainer);
    const tiles = selector.container.querySelectorAll('.chart-type-tile');
    
    if (tiles.length === 0) {
      this.addTestResult('Rapid Clicking', {
        passed: false,
        error: 'No chart tiles found',
        recommendation: '❌ Component not rendering properly'
      });
      return;
    }
    
    const startTime = performance.now();
    const clickCount = 20;
    let successfulClicks = 0;
    let lastSelectedId = null;
    
    // Simulate rapid clicks
    for (let i = 0; i < clickCount; i++) {
      const randomTile = tiles[Math.floor(Math.random() * tiles.length)];
      const typeId = randomTile.dataset.chartType;
      
      randomTile.click();
      
      // Check if selection was processed
      if (selector.selectedId !== lastSelectedId) {
        successfulClicks++;
        lastSelectedId = selector.selectedId;
      }
      
      // Small delay to simulate real user behavior
      await this.sleep(10);
    }
    
    const totalTime = performance.now() - startTime;
    const avgClickTime = totalTime / clickCount;
    
    this.addTestResult('Rapid Clicking', {
      totalClicks: clickCount,
      successfulClicks,
      totalTime: Math.round(totalTime),
      avgClickTime: Math.round(avgClickTime),
      passed: avgClickTime < 50 && successfulClicks === clickCount,
      recommendation: avgClickTime < 20 ? '✅ Excellent' : avgClickTime < 50 ? '⚠️ Good' : '❌ Needs optimization'
    });
    
    selector.destroy();
  }

  /**
   * Test mobile scrolling performance
   */
  async testMobileScrolling() {
    console.log('📱 Testing mobile scrolling performance...');
    
    // Simulate mobile viewport
    this.simulateMobileViewport();
    this.createTestContainer();
    
    // Generate many chart types
    const chartTypes = this.generateTestChartTypes(80);
    window.getAllChartTypes = () => chartTypes;
    
    const selector = new OptimizedChartTypeSelector(this.testContainer, {
      virtualScrolling: true,
      mobileColumns: 2,
      desktopColumns: 2
    });
    
    const scrollContainer = selector.container.querySelector('.virtual-scroll-wrapper');
    
    if (!scrollContainer) {
      this.addTestResult('Mobile Scrolling', {
        passed: false,
        error: 'Virtual scroll container not found',
        recommendation: '❌ Virtual scrolling not enabled'
      });
      return;
    }
    
    // Test scroll performance
    const startTime = performance.now();
    const scrollSteps = 10;
    let frameDrops = 0;
    
    for (let i = 0; i < scrollSteps; i++) {
      const scrollStart = performance.now();
      
      // Scroll to random position
      const maxScroll = scrollContainer.scrollHeight - scrollContainer.clientHeight;
      const randomScroll = Math.random() * maxScroll;
      scrollContainer.scrollTop = randomScroll;
      
      // Wait for scroll to complete
      await this.sleep(100);
      
      const scrollEnd = performance.now();
      const scrollTime = scrollEnd - scrollStart;
      
      // Check for frame drops (should be under 16ms for 60fps)
      if (scrollTime > 32) {
        frameDrops++;
      }
    }
    
    const totalTime = performance.now() - startTime;
    
    this.addTestResult('Mobile Scrolling', {
      scrollSteps,
      frameDrops,
      totalTime: Math.round(totalTime),
      avgScrollTime: Math.round(totalTime / scrollSteps),
      passed: frameDrops < 3,
      recommendation: frameDrops === 0 ? '✅ Excellent' : frameDrops < 3 ? '⚠️ Good' : '❌ Needs optimization'
    });
    
    selector.destroy();
    this.restoreViewport();
    window.getAllChartTypes = getAllChartTypes;
  }

  /**
   * Test search performance
   */
  async testSearchPerformance() {
    console.log('🔍 Testing search performance...');
    
    this.createTestContainer();
    
    const selector = new OptimizedChartTypeSelector(this.testContainer);
    const searchInput = selector.container.querySelector('#chart-search');
    
    if (!searchInput) {
      this.addTestResult('Search Performance', {
        passed: false,
        error: 'Search input not found',
        recommendation: '❌ Search functionality missing'
      });
      return;
    }
    
    const testQueries = [
      'bar',
      'line chart',
      'pie',
      'scatter plot',
      'data visualization',
      'very long search query with many words to test performance'
    ];
    
    const searchTimes = [];
    
    for (const query of testQueries) {
      const startTime = performance.now();
      
      searchInput.value = query;
      searchInput.dispatchEvent(new Event('input'));
      
      // Wait for debounced search
      await this.sleep(200);
      
      const searchTime = performance.now() - startTime;
      searchTimes.push(searchTime);
    }
    
    const avgSearchTime = searchTimes.reduce((a, b) => a + b, 0) / searchTimes.length;
    const maxSearchTime = Math.max(...searchTimes);
    
    this.addTestResult('Search Performance', {
      queriesTested: testQueries.length,
      avgSearchTime: Math.round(avgSearchTime),
      maxSearchTime: Math.round(maxSearchTime),
      passed: avgSearchTime < 100,
      recommendation: avgSearchTime < 50 ? '✅ Excellent' : avgSearchTime < 100 ? '⚠️ Good' : '❌ Needs optimization'
    });
    
    selector.destroy();
  }

  /**
   * Test memory usage
   */
  async testMemoryUsage() {
    console.log('💾 Testing memory usage...');
    
    const initialMemory = this.getMemoryUsage();
    
    // Create multiple selectors to test memory leaks
    const selectors = [];
    
    for (let i = 0; i < 5; i++) {
      this.createTestContainer();
      const selector = new OptimizedChartTypeSelector(this.testContainer);
      selectors.push(selector);
      
      // Simulate some interactions
      const tiles = selector.container.querySelectorAll('.chart-type-tile');
      if (tiles.length > 0) {
        tiles[0].click();
        tiles[1]?.click();
      }
      
      await this.sleep(50);
    }
    
    const peakMemory = this.getMemoryUsage();
    
    // Cleanup all selectors
    selectors.forEach(selector => selector.destroy());
    
    // Force garbage collection if available
    if (window.gc) {
      window.gc();
    }
    
    await this.sleep(100);
    
    const finalMemory = this.getMemoryUsage();
    const memoryLeak = finalMemory - initialMemory;
    
    this.addTestResult('Memory Usage', {
      initialMemory: Math.round(initialMemory),
      peakMemory: Math.round(peakMemory),
      finalMemory: Math.round(finalMemory),
      memoryLeak: Math.round(memoryLeak),
      passed: memoryLeak < 5,
      recommendation: memoryLeak < 1 ? '✅ Excellent' : memoryLeak < 5 ? '⚠️ Good' : '❌ Memory leak detected'
    });
  }

  /**
   * Test AI recommendation updates
   */
  async testAIRecommendationUpdates() {
    console.log('🤖 Testing AI recommendation updates...');
    
    this.createTestContainer();
    
    const selector = new OptimizedChartTypeSelector(this.testContainer);
    
    const startTime = performance.now();
    const updateCount = 10;
    let successfulUpdates = 0;
    
    // Test rapid AI recommendation updates
    for (let i = 0; i < updateCount; i++) {
      const updateStart = performance.now();
      
      selector.updateAIRecommendation(`chart-type-${i}`);
      
      const updateEnd = performance.now();
      const updateTime = updateEnd - updateStart;
      
      // Check if recommendation was updated
      if (selector.aiRecommended === `chart-type-${i}`) {
        successfulUpdates++;
      }
      
      await this.sleep(20);
    }
    
    const totalTime = performance.now() - startTime;
    const avgUpdateTime = totalTime / updateCount;
    
    this.addTestResult('AI Recommendation Updates', {
      updateCount,
      successfulUpdates,
      totalTime: Math.round(totalTime),
      avgUpdateTime: Math.round(avgUpdateTime),
      passed: avgUpdateTime < 30 && successfulUpdates === updateCount,
      recommendation: avgUpdateTime < 10 ? '✅ Excellent' : avgUpdateTime < 30 ? '⚠️ Good' : '❌ Needs optimization'
    });
    
    selector.destroy();
  }

  /**
   * Generate test chart types
   */
  generateTestChartTypes(count) {
    const types = [];
    const categories = ['basic', 'composition', 'comparison', 'distribution', 'advanced'];
    const icons = ['📊', '📈', '📉', '🥧', '⭕', '🎯', '🌐', '🕸️', '📋', '🔷'];
    
    for (let i = 0; i < count; i++) {
      types.push({
        id: `chart-type-${i}`,
        name: `Chart Type ${i + 1}`,
        description: `This is a test chart type number ${i + 1} for performance testing`,
        shortDescription: `Test chart ${i + 1}`,
        category: categories[i % categories.length],
        icon: icons[i % icons.length],
        useCases: [`Use case ${i + 1}`, `Another use case for chart ${i + 1}`],
        examples: [`Example ${i + 1}`, `Another example`],
        difficulty: ['beginner', 'intermediate', 'advanced'][i % 3]
      });
    }
    
    return types;
  }

  /**
   * Create test container
   */
  createTestContainer() {
    if (this.testContainer) {
      this.testContainer.remove();
    }
    
    this.testContainer = document.createElement('div');
    this.testContainer.className = 'test-container';
    this.testContainer.style.cssText = `
      position: fixed;
      top: -2000px;
      left: 0;
      width: 800px;
      height: 600px;
      background: white;
      border: 1px solid #ccc;
      z-index: 9999;
    `;
    
    document.body.appendChild(this.testContainer);
  }

  /**
   * Simulate mobile viewport
   */
  simulateMobileViewport() {
    // Store original viewport meta
    this.originalViewport = document.querySelector('meta[name="viewport"]');
    
    // Add mobile viewport meta
    const mobileViewport = document.createElement('meta');
    mobileViewport.name = 'viewport';
    mobileViewport.content = 'width=375, initial-scale=1';
    document.head.appendChild(mobileViewport);
    
    // Simulate mobile screen size
    this.originalWidth = this.testContainer.style.width;
    this.testContainer.style.width = '375px';
  }

  /**
   * Restore viewport
   */
  restoreViewport() {
    if (this.originalViewport) {
      document.head.appendChild(this.originalViewport);
    }
    
    const mobileViewport = document.querySelector('meta[name="viewport"]');
    if (mobileViewport && mobileViewport !== this.originalViewport) {
      mobileViewport.remove();
    }
    
    if (this.originalWidth) {
      this.testContainer.style.width = this.originalWidth;
    }
  }

  /**
   * Measure first paint time
   */
  async measureFirstPaint() {
    return new Promise(resolve => {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const paintEntry = entries.find(entry => entry.name === 'first-contentful-paint');
        if (paintEntry) {
          resolve(paintEntry.startTime);
          observer.disconnect();
        }
      });
      
      observer.observe({ entryTypes: ['paint'] });
      
      // Fallback timeout
      setTimeout(() => resolve(0), 1000);
    });
  }

  /**
   * Get memory usage
   */
  getMemoryUsage() {
    if (performance.memory) {
      return performance.memory.usedJSHeapSize / 1024 / 1024; // MB
    }
    return 0;
  }

  /**
   * Add test result
   */
  addTestResult(testName, result) {
    this.testResults.push({
      testName,
      ...result,
      timestamp: new Date().toISOString()
    });
    
    console.log(`📋 ${testName}:`, result);
  }

  /**
   * Display test results
   */
  displayResults() {
    console.log('\n🎯 PERFORMANCE TEST RESULTS');
    console.log('================================');
    
    let passedTests = 0;
    let totalTests = this.testResults.length;
    
    this.testResults.forEach(result => {
      const status = result.passed ? '✅ PASS' : '❌ FAIL';
      console.log(`${status} ${result.testName}`);
      console.log(`   ${result.recommendation}`);
      
      if (result.passed) passedTests++;
    });
    
    console.log('\n📊 SUMMARY');
    console.log('================================');
    console.log(`Passed: ${passedTests}/${totalTests} tests`);
    console.log(`Success Rate: ${Math.round((passedTests / totalTests) * 100)}%`);
    
    if (passedTests === totalTests) {
      console.log('🎉 All tests passed! ChartTypeSelector is production-ready.');
    } else {
      console.log('⚠️ Some tests failed. Review recommendations for optimization.');
    }
    
    // Show detailed metrics
    console.log('\n📈 DETAILED METRICS');
    console.log('================================');
    this.testResults.forEach(result => {
      console.log(`\n${result.testName}:`);
      Object.keys(result).forEach(key => {
        if (!['testName', 'passed', 'recommendation', 'timestamp'].includes(key)) {
          console.log(`  ${key}: ${result[key]}`);
        }
      });
    });
  }

  /**
   * Sleep utility
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Cleanup test environment
   */
  cleanup() {
    if (this.testContainer) {
      this.testContainer.remove();
      this.testContainer = null;
    }
    
    this.restoreViewport();
    this.testResults = [];
  }
}

// Export for use in tests
export const chartTypeSelectorTest = new ChartTypeSelectorTest();

// Auto-run tests in development mode
if (window.location.hostname === 'localhost') {
  // Uncomment to auto-run tests
  // setTimeout(() => chartTypeSelectorTest.runPerformanceTests(), 1000);
}

/**
 * Performance Utilities with Memoization
 * Caches expensive operations to improve performance
 */

class MemoizationCache {
  constructor(maxSize = 100) {
    this.cache = new Map();
    this.maxSize = maxSize;
    this.accessOrder = new Map(); // LRU tracking
  }

  /**
   * Generate cache key from arguments
   */
  generateKey(args) {
    return JSON.stringify(args);
  }

  /**
   * Get cached value or compute and store
   */
  async get(key, computeFn) {
    if (this.cache.has(key)) {
      // Update access order for LRU
      this.accessOrder.set(key, Date.now());
      return this.cache.get(key);
    }

    // Compute value
    const value = await computeFn();
    
    // Store in cache
    this.set(key, value);
    
    return value;
  }

  /**
   * Set value in cache with LRU eviction
   */
  set(key, value) {
    // Evict oldest if cache is full
    if (this.cache.size >= this.maxSize) {
      this.evictOldest();
    }

    this.cache.set(key, value);
    this.accessOrder.set(key, Date.now());
  }

  /**
   * Evict least recently used item
   */
  evictOldest() {
    let oldestKey = null;
    let oldestTime = Date.now();

    for (const [key, time] of this.accessOrder) {
      if (time < oldestTime) {
        oldestTime = time;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
      this.accessOrder.delete(oldestKey);
    }
  }

  /**
   * Clear cache
   */
  clear() {
    this.cache.clear();
    this.accessOrder.clear();
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hitRate: this.hits / (this.hits + this.misses) || 0
    };
  }
}

/**
 * Memoize function with configurable cache
 */
function memoize(fn, options = {}) {
  const {
    maxSize = 50,
    ttl = 5 * 60 * 1000, // 5 minutes
    keyGenerator = (...args) => JSON.stringify(args)
  } = options;

  const cache = new MemoizationCache(maxSize);
  const timestamps = new Map();

  return async function(...args) {
    const key = keyGenerator(...args);
    const now = Date.now();

    // Check if cache entry is still valid
    if (timestamps.has(key)) {
      const timestamp = timestamps.get(key);
      if (now - timestamp > ttl) {
        cache.cache.delete(key);
        timestamps.delete(key);
      }
    }

    return cache.get(key, () => fn.apply(this, args));
  };
}

/**
 * Chart-specific memoization utilities
 */
class ChartMemoizer {
  constructor() {
    this.configCache = new MemoizationCache(30);
    this.dataCache = new MemoizationCache(50);
    this.colorCache = new MemoizationCache(20);
  }

  /**
   * Memoize chart configuration generation
   */
  memoizeChartConfig = memoize(
    async (chartType, data, options) => {
      // Expensive chart config generation
      return this.generateChartConfig(chartType, data, options);
    },
    {
      maxSize: 30,
      keyGenerator: (chartType, data, options) => 
        `${chartType}:${JSON.stringify(data)}:${JSON.stringify(options)}`
    }
  );

  /**
   * Memoize data processing
   */
  memoizeDataProcessing = memoize(
    async (rawData, processingType) => {
      // Expensive data processing
      return this.processData(rawData, processingType);
    },
    {
      maxSize: 50,
      ttl: 10 * 60 * 1000 // 10 minutes for data cache
    }
  );

  /**
   * Memoize color scheme generation
   */
  memoizeColorScheme = memoize(
    async (count, theme) => {
      // Color generation can be expensive for large counts
      return this.generateColorScheme(count, theme);
    },
    {
      maxSize: 20,
      keyGenerator: (count, theme) => `${count}:${theme}`
    }
  );

  /**
   * Generate chart configuration (expensive operation)
   */
  async generateChartConfig(chartType, data, options) {
    // Simulate expensive computation
    await new Promise(resolve => setTimeout(resolve, 10));
    
    return {
      type: chartType,
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        ...options
      }
    };
  }

  /**
   * Process raw data (expensive operation)
   */
  async processData(rawData, processingType) {
    // Simulate expensive data processing
    await new Promise(resolve => setTimeout(resolve, 20));
    
    switch (processingType) {
      case 'normalize':
        return this.normalizeData(rawData);
      case 'aggregate':
        return this.aggregateData(rawData);
      default:
        return rawData;
    }
  }

  /**
   * Generate color scheme
   */
  async generateColorScheme(count, theme = 'default') {
    const themes = {
      default: ['#3B82F6', '#8B5CF6', '#06D6A0', '#60A5FA', '#A78BFA'],
      vibrant: ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6'],
      pastel: ['#FCA5A5', '#FCD34D', '#86EFAC', '#93C5FD', '#DDD6FE']
    };

    const baseColors = themes[theme] || themes.default;
    const colors = [];

    for (let i = 0; i < count; i++) {
      colors.push(baseColors[i % baseColors.length]);
    }

    return colors;
  }

  /**
   * Normalize data
   */
  normalizeData(data) {
    if (!Array.isArray(data) || data.length === 0) return data;
    
    const values = data.filter(d => typeof d === 'number');
    if (values.length === 0) return data;
    
    const max = Math.max(...values);
    const min = Math.min(...values);
    const range = max - min;
    
    return data.map(item => {
      if (typeof item === 'number') {
        return range === 0 ? 0 : (item - min) / range;
      }
      return item;
    });
  }

  /**
   * Aggregate data
   */
  aggregateData(data) {
    // Simple aggregation example
    if (!Array.isArray(data)) return data;
    
    const result = {};
    data.forEach(item => {
      if (typeof item === 'object' && item !== null) {
        Object.keys(item).forEach(key => {
          if (!result[key]) result[key] = 0;
          result[key] += item[key] || 0;
        });
      }
    });
    
    return result;
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return {
      config: this.configCache.getStats(),
      data: this.dataCache.getStats(),
      colors: this.colorCache.getStats()
    };
  }

  /**
   * Clear all caches
   */
  clearAll() {
    this.configCache.clear();
    this.dataCache.clear();
    this.colorCache.clear();
  }
}

/**
 * Performance monitor for tracking optimization effectiveness
 */
class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.observers = new Set();
  }

  /**
   * Start timing an operation
   */
  startTiming(operation) {
    const startTime = performance.now();
    this.metrics.set(operation, { startTime, endTime: null, duration: null });
    return startTime;
  }

  /**
   * End timing an operation
   */
  endTiming(operation) {
    const metric = this.metrics.get(operation);
    if (metric) {
      metric.endTime = performance.now();
      metric.duration = metric.endTime - metric.startTime;
      
      // Notify observers
      this.observers.forEach(observer => {
        observer(operation, metric);
      });
      
      return metric.duration;
    }
    return null;
  }

  /**
   * Add performance observer
   */
  addObserver(observer) {
    this.observers.add(observer);
  }

  /**
   * Remove performance observer
   */
  removeObserver(observer) {
    this.observers.delete(observer);
  }

  /**
   * Get all metrics
   */
  getMetrics() {
    const result = {};
    for (const [operation, metric] of this.metrics) {
      result[operation] = metric.duration;
    }
    return result;
  }

  /**
   * Clear all metrics
   */
  clear() {
    this.metrics.clear();
  }
}

// Export instances
export const chartMemoizer = new ChartMemoizer();
export const performanceMonitor = new PerformanceMonitor();

// Export utilities
export { memoize, MemoizationCache };

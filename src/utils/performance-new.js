/**
 * Performance Monitoring and Optimization Utilities
 * Provides caching, memoization, and performance tracking
 */

export interface PerformanceMetrics {
  operation: string;
  startTime: number;
  endTime: number;
  duration: number;
  memoryUsage?: number;
  metadata?: any;
}

export interface CacheEntry<T> {
  value: T;
  timestamp: number;
  expiresAt?: number;
  accessCount: number;
  lastAccessed: number;
}

export interface CacheStats {
  size: number;
  hitCount: number;
  missCount: number;
  hitRate: number;
  memoryUsage: number;
}

/**
 * Performance Monitor
 * Tracks operation performance and provides insights
 */
export class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetrics[]> = new Map();
  private activeOperations: Map<string, number> = new Map();

  /**
   * Start timing an operation
   */
  startTiming(operation: string, metadata?: any): string {
    const operationId = `${operation}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const startTime = performance.now();
    
    this.activeOperations.set(operationId, startTime);
    
    return operationId;
  }

  /**
   * End timing an operation
   */
  endTiming(operationId: string, metadata?: any): PerformanceMetrics | null {
    const startTime = this.activeOperations.get(operationId);
    if (!startTime) return null;

    const endTime = performance.now();
    const duration = endTime - startTime;
    const operation = operationId.split('-')[0];

    const metric: PerformanceMetrics = {
      operation,
      startTime,
      endTime,
      duration,
      memoryUsage: this.getMemoryUsage(),
      metadata
    };

    // Store metric
    if (!this.metrics.has(operation)) {
      this.metrics.set(operation, []);
    }
    this.metrics.get(operation)!.push(metric);

    // Clean up active operation
    this.activeOperations.delete(operationId);

    return metric;
  }

  /**
   * Get metrics for an operation
   */
  getMetrics(operation?: string): PerformanceMetrics[] {
    if (operation) {
      return this.metrics.get(operation) || [];
    }
    
    // Return all metrics
    const allMetrics: PerformanceMetrics[] = [];
    this.metrics.forEach(metrics => allMetrics.push(...metrics));
    return allMetrics;
  }

  /**
   * Get performance summary
   */
  getSummary(operation?: string): {
    count: number;
    averageDuration: number;
    minDuration: number;
    maxDuration: number;
    totalDuration: number;
  } {
    const metrics = this.getMetrics(operation);
    
    if (metrics.length === 0) {
      return {
        count: 0,
        averageDuration: 0,
        minDuration: 0,
        maxDuration: 0,
        totalDuration: 0
      };
    }

    const durations = metrics.map(m => m.duration);
    
    return {
      count: metrics.length,
      averageDuration: durations.reduce((a, b) => a + b, 0) / durations.length,
      minDuration: Math.min(...durations),
      maxDuration: Math.max(...durations),
      totalDuration: durations.reduce((a, b) => a + b, 0)
    };
  }

  /**
   * Clear metrics
   */
  clear(operation?: string): void {
    if (operation) {
      this.metrics.delete(operation);
    } else {
      this.metrics.clear();
    }
  }

  /**
   * Get memory usage
   */
  private getMemoryUsage(): number {
    if ('memory' in performance) {
      return (performance as any).memory.usedJSHeapSize;
    }
    return 0;
  }

  /**
   * Generate performance report
   */
  generateReport(): string {
    const report: string[] = [];
    
    report.push('=== Performance Report ===');
    report.push(`Generated: ${new Date().toISOString()}`);
    report.push('');
    
    this.metrics.forEach((metrics, operation) => {
      const summary = this.getSummary(operation);
      report.push(`${operation}:`);
      report.push(`  Count: ${summary.count}`);
      report.push(`  Average: ${summary.averageDuration.toFixed(2)}ms`);
      report.push(`  Min: ${summary.minDuration.toFixed(2)}ms`);
      report.push(`  Max: ${summary.maxDuration.toFixed(2)}ms`);
      report.push(`  Total: ${summary.totalDuration.toFixed(2)}ms`);
      report.push('');
    });
    
    return report.join('\n');
  }
}

/**
 * Memoization Cache
 * Provides intelligent caching with expiration and LRU eviction
 */
export class MemoizationCache<T> {
  private cache: Map<string, CacheEntry<T>> = new Map();
  private maxSize: number;
  private defaultTTL: number;
  private stats: CacheStats = {
    size: 0,
    hitCount: 0,
    missCount: 0,
    hitRate: 0,
    memoryUsage: 0
  };

  constructor(maxSize: number = 100, defaultTTL: number = 300000) { // 5 minutes default TTL
    this.maxSize = maxSize;
    this.defaultTTL = defaultTTL;
  }

  /**
   * Set a value in cache
   */
  set(key: string, value: T, ttl?: number): void {
    const now = Date.now();
    const expiresAt = ttl ? now + ttl : now + this.defaultTTL;

    // Remove oldest entry if cache is full
    if (this.cache.size >= this.maxSize) {
      this.evictOldest();
    }

    const entry: CacheEntry<T> = {
      value,
      timestamp: now,
      expiresAt,
      accessCount: 0,
      lastAccessed: now
    };

    this.cache.set(key, entry);
    this.updateStats();
  }

  /**
   * Get a value from cache
   */
  get(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.stats.missCount++;
      this.updateStats();
      return null;
    }

    // Check if expired
    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      this.stats.missCount++;
      this.updateStats();
      return null;
    }

    // Update access info
    entry.accessCount++;
    entry.lastAccessed = Date.now();
    this.stats.hitCount++;
    this.updateStats();

    return entry.value;
  }

  /**
   * Check if key exists and is not expired
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    
    if (!entry) return false;
    
    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Delete a key from cache
   */
  delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    this.updateStats();
    return deleted;
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
    this.stats.hitCount = 0;
    this.stats.missCount = 0;
    this.updateStats();
  }

  /**
   * Evict expired entries
   */
  evictExpired(): number {
    const now = Date.now();
    let evicted = 0;

    this.cache.forEach((entry, key) => {
      if (entry.expiresAt && now > entry.expiresAt) {
        this.cache.delete(key);
        evicted++;
      }
    });

    this.updateStats();
    return evicted;
  }

  /**
   * Evict least recently used entry
   */
  private evictOldest(): void {
    let oldestKey: string | null = null;
    let oldestTime = Date.now();

    this.cache.forEach((entry, key) => {
      if (entry.lastAccessed < oldestTime) {
        oldestTime = entry.lastAccessed;
        oldestKey = key;
      }
    });

    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  /**
   * Update cache statistics
   */
  private updateStats(): void {
    this.stats.size = this.cache.size;
    const total = this.stats.hitCount + this.stats.missCount;
    this.stats.hitRate = total > 0 ? this.stats.hitCount / total : 0;
    
    // Estimate memory usage
    this.stats.memoryUsage = this.estimateMemoryUsage();
  }

  /**
   * Estimate memory usage of cache
   */
  private estimateMemoryUsage(): number {
    let size = 0;
    
    this.cache.forEach((entry, key) => {
      size += key.length * 2; // String size
      size += JSON.stringify(entry.value).length * 2;
      size += 64; // Entry metadata
    });
    
    return size;
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    return { ...this.stats };
  }

  /**
   * Get cache entries (for debugging)
   */
  getEntries(): Array<{ key: string; entry: CacheEntry<T> }> {
    const entries: Array<{ key: string; entry: CacheEntry<T> }> = [];
    
    this.cache.forEach((entry, key) => {
      entries.push({ key, entry });
    });
    
    return entries;
  }
}

/**
 * Function Memoizer
 * Memoizes function results with intelligent caching
 */
export class FunctionMemoizer {
  private caches: Map<string, MemoizationCache<any>> = new Map();

  /**
   * Cache a function
   */
  cacheFunction<T extends (...args: any[]) => any>(
    name: string,
    fn: T,
    options: {
      ttl?: number;
      maxSize?: number;
      keyGenerator?: (...args: Parameters<T>) => string;
    } = {}
  ): T {
    const cache = new MemoizationCache(options.maxSize, options.tTL);
    this.caches.set(name, cache);

    const keyGenerator = options.keyGenerator || this.defaultKeyGenerator;

    return ((...args: Parameters<T>) => {
      const key = keyGenerator(...args);
      
      // Check cache
      const cached = cache.get(key);
      if (cached !== null) {
        return cached;
      }

      // Execute function and cache result
      const result = fn(...args);
      cache.set(key, result);
      
      return result;
    }) as T;
  }

  /**
   * Memoize a function call
   */
  memoize<T>(
    cacheName: string,
    key: string,
    fn: () => T,
    ttl?: number
  ): T {
    const cache = this.caches.get(cacheName);
    if (!cache) {
      throw new Error(`Cache "${cacheName}" not found`);
    }

    // Check cache
    const cached = cache.get(key);
    if (cached !== null) {
      return cached;
    }

    // Execute function and cache result
    const result = fn();
    cache.set(key, result, ttl);
    
    return result;
  }

  /**
   * Clear a specific cache
   */
  clearCache(name: string): void {
    const cache = this.caches.get(name);
    if (cache) {
      cache.clear();
    }
  }

  /**
   * Clear all caches
   */
  clear(): void {
    this.caches.forEach(cache => cache.clear());
  }

  /**
   * Get cache statistics
   */
  getStats(name?: string): CacheStats | Record<string, CacheStats> {
    if (name) {
      const cache = this.caches.get(name);
      return cache ? cache.getStats() : {
        size: 0,
        hitCount: 0,
        missCount: 0,
        hitRate: 0,
        memoryUsage: 0
      };
    }

    const stats: Record<string, CacheStats> = {};
    this.caches.forEach((cache, cacheName) => {
      stats[cacheName] = cache.getStats();
    });
    
    return stats;
  }

  /**
   * Default key generator
   */
  private defaultKeyGenerator(...args: any[]): string {
    return JSON.stringify(args);
  }
}

/**
 * Debounce utility
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): T {
  let timeoutId: NodeJS.Timeout;

  return ((...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  }) as T;
}

/**
 * Throttle utility
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): T {
  let lastCall = 0;

  return ((...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      return fn(...args);
    }
  }) as T;
}

/**
 * Create performance decorator
 */
export function performanceMonitor(operation: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const monitor = new PerformanceMonitor();
      const operationId = monitor.startTiming(operation);
      
      try {
        const result = originalMethod.apply(this, args);
        
        if (result instanceof Promise) {
          return result.finally(() => {
            monitor.endTiming(operationId);
          });
        } else {
          monitor.endTiming(operationId);
          return result;
        }
      } catch (error) {
        monitor.endTiming(operationId);
        throw error;
      }
    };

    return descriptor;
  };
}

// Export singleton instances
export const performanceMonitor = new PerformanceMonitor();
export const chartMemoizer = new FunctionMemoizer();

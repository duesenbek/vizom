/**
 * Advanced Caching System - Fixed Version
 * Intelligent caching with invalidation strategies and performance optimization
 */

// TypeScript types for caching
export interface CacheEntry<T = any> {
  key: string;
  data: T;
  metadata: CacheMetadata;
  createdAt: number;
  lastAccessed: number;
  accessCount: number;
  ttl: number;
  tags: string[];
  priority: number;
}

export interface CacheMetadata {
  size: number;
  compressed: boolean;
  source: 'api' | 'fallback' | 'user';
  requestId?: string;
  model?: string;
  tokens?: number;
  processingTime: number;
}

export interface CacheConfig {
  maxSize: number; // Maximum cache size in bytes
  maxEntries: number; // Maximum number of entries
  defaultTtl: number; // Default TTL in milliseconds
  cleanupInterval: number; // Cleanup interval in milliseconds
  compressionThreshold: number; // Minimum size to compress
  priorityLevels: number;
}

export interface CacheStats {
  totalEntries: number;
  totalSize: number;
  hitRate: number;
  missRate: number;
  evictionCount: number;
  compressionRatio: number;
  averageAccessTime: number;
  topQueries: CacheQuery[];
}

export interface CacheQuery {
  key: string;
  frequency: number;
  lastAccessed: number;
  size: number;
}

export interface CacheInvalidationRule {
  id: string;
  name: string;
  condition: (entry: CacheEntry) => boolean;
  priority: number;
}

/**
 * LRU Cache Implementation with Advanced Features
 */
export class AdvancedCache {
  private cache: Map<string, CacheEntry> = new Map();
  private accessOrder: Map<string, number> = new Map();
  private stats = {
    hits: 0,
    misses: 0,
    evictions: 0,
    totalSize: 0
  };
  private accessCounter = 0;
  private cleanupTimer: NodeJS.Timeout | null = null;

  constructor(private config: CacheConfig) {
    this.startCleanupTimer();
  }

  /**
   * Get value from cache
   */
  get<T = any>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.stats.misses++;
      return null;
    }

    // Check TTL
    if (this.isExpired(entry)) {
      this.delete(key);
      this.stats.misses++;
      return null;
    }

    // Update access information
    entry.lastAccessed = Date.now();
    entry.accessCount++;
    this.accessOrder.set(key, ++this.accessCounter);
    
    this.stats.hits++;
    return entry.data as T;
  }

  /**
   * Set value in cache
   */
  set<T = any>(
    key: string,
    data: T,
    options: {
      ttl?: number;
      tags?: string[];
      priority?: number;
      metadata?: Partial<CacheMetadata>;
    } = {}
  ): void {
    const now = Date.now();
    const ttl = options.ttl || this.config.defaultTtl;
    
    // Calculate data size
    const serializedData = JSON.stringify(data);
    const size = this.calculateSize(serializedData);
    
    // Check if we need to make space
    this.ensureCapacity(size);
    
    // Compress if necessary
    const compressed = size > this.config.compressionThreshold;
    const finalData = compressed ? this.compress(serializedData) : serializedData;
    
    const entry: CacheEntry<T> = {
      key,
      data: compressed ? JSON.parse(finalData) : data,
      metadata: {
        size,
        compressed,
        source: 'api',
        processingTime: 0,
        ...options.metadata
      },
      createdAt: now,
      lastAccessed: now,
      accessCount: 1,
      ttl,
      tags: options.tags || [],
      priority: options.priority || 0
    };

    this.cache.set(key, entry);
    this.accessOrder.set(key, ++this.accessCounter);
    this.stats.totalSize += size;
  }

  /**
   * Delete entry from cache
   */
  delete(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    this.stats.totalSize -= entry.metadata.size;
    this.cache.delete(key);
    this.accessOrder.delete(key);
    return true;
  }

  /**
   * Clear cache
   */
  clear(): void {
    this.cache.clear();
    this.accessOrder.clear();
    this.stats = {
      hits: 0,
      misses: 0,
      evictions: 0,
      totalSize: 0
    };
    this.accessCounter = 0;
  }

  /**
   * Get entries by tags
   */
  getByTag(tag: string): CacheEntry[] {
    return Array.from(this.cache.values()).filter(entry => 
      entry.tags.includes(tag)
    );
  }

  /**
   * Invalidate entries by tags
   */
  invalidateByTag(tag: string): number {
    let count = 0;
    for (const [key, entry] of this.cache.entries()) {
      if (entry.tags.includes(tag)) {
        this.delete(key);
        count++;
      }
    }
    return count;
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    const totalRequests = this.stats.hits + this.stats.misses;
    const hitRate = totalRequests > 0 ? this.stats.hits / totalRequests : 0;
    const missRate = totalRequests > 0 ? this.stats.misses / totalRequests : 0;

    // Get top queries
    const topQueries = Array.from(this.cache.values())
      .map(entry => ({
        key: entry.key,
        frequency: entry.accessCount,
        lastAccessed: entry.lastAccessed,
        size: entry.metadata.size
      }))
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 10);

    return {
      totalEntries: this.cache.size,
      totalSize: this.stats.totalSize,
      hitRate,
      missRate,
      evictionCount: this.stats.evictions,
      compressionRatio: this.calculateCompressionRatio(),
      averageAccessTime: this.calculateAverageAccessTime(),
      topQueries
    };
  }

  private isExpired(entry: CacheEntry): boolean {
    return Date.now() - entry.createdAt > entry.ttl;
  }

  private ensureCapacity(requiredSize: number): void {
    // Check size limit
    while (this.stats.totalSize + requiredSize > this.config.maxSize && this.cache.size > 0) {
      this.evictLRU();
    }

    // Check entry limit
    while (this.cache.size >= this.config.maxEntries) {
      this.evictLRU();
    }
  }

  private evictLRU(): void {
    let oldestKey = '';
    let oldestAccess = Infinity;

    for (const [key, accessTime] of this.accessOrder.entries()) {
      if (accessTime < oldestAccess) {
        oldestAccess = accessTime;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.delete(oldestKey);
      this.stats.evictions++;
    }
  }

  private calculateSize(data: string): number {
    return new Blob([data]).size;
  }

  private compress(data: string): string {
    // Simple compression - in production, use proper compression library
    return data.replace(/\s+/g, ' ').trim();
  }

  private calculateCompressionRatio(): number {
    const compressed = Array.from(this.cache.values())
      .filter(entry => entry.metadata.compressed)
      .length;
    
    return this.cache.size > 0 ? compressed / this.cache.size : 0;
  }

  private calculateAverageAccessTime(): number {
    const entries = Array.from(this.cache.values());
    if (entries.length === 0) return 0;

    const totalTime = entries.reduce((sum, entry) => 
      sum + (entry.lastAccessed - entry.createdAt), 0
    );

    return totalTime / entries.length;
  }

  private startCleanupTimer(): void {
    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, this.config.cleanupInterval);
  }

  private cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    for (const [key, entry] of this.cache.entries()) {
      if (this.isExpired(entry)) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => this.delete(key));
    
    if (keysToDelete.length > 0) {
      console.log(`Cache cleanup: removed ${keysToDelete.length} expired entries`);
    }
  }

  /**
   * Destroy cache and cleanup timers
   */
  destroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
    this.clear();
  }
}

/**
 * Cache Key Generator
 */
export class CacheKeyGenerator {
  /**
   * Generate cache key for API requests
   */
  static generateKey(
    endpoint: string,
    params: Record<string, any>,
    options: {
      includeHeaders?: string[];
      excludeParams?: string[];
      hashAlgorithm?: 'md5' | 'sha256' | 'simple';
    } = {}
  ): string {
    const { includeHeaders = [], excludeParams = [], hashAlgorithm = 'simple' } = options;

    // Filter parameters
    const filteredParams = { ...params };
    excludeParams.forEach(param => delete filteredParams[param]);

    // Sort parameters for consistent key generation
    const sortedParams = Object.keys(filteredParams)
      .sort()
      .reduce((result, key) => {
        result[key] = filteredParams[key];
        return result;
      }, {} as Record<string, any>);

    const keyData = {
      endpoint,
      params: sortedParams,
      headers: includeHeaders.length > 0 ? includeHeaders.sort() : undefined
    };

    const serialized = JSON.stringify(keyData);

    switch (hashAlgorithm) {
      case 'simple':
        return btoa(serialized).replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);
      case 'md5':
        // In production, use proper crypto library
        return this.simpleHash(serialized);
      case 'sha256':
        return this.simpleHash(serialized + 'sha256');
      default:
        return this.simpleHash(serialized);
    }
  }

  private static simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  /**
   * Generate semantic cache key for similar queries
   */
  static generateSemanticKey(
    queryType: string,
    content: string,
    options: {
      normalize?: boolean;
      ignoreCase?: boolean;
      removeStopWords?: boolean;
    } = {}
  ): string {
    const { normalize = true, ignoreCase = true, removeStopWords = false } = options;

    let processedContent = content;

    if (ignoreCase) {
      processedContent = processedContent.toLowerCase();
    }

    if (removeStopWords) {
      processedContent = this.removeStopWords(processedContent);
    }

    if (normalize) {
      processedContent = processedContent.replace(/\s+/g, ' ').trim();
    }

    return `${queryType}:${this.simpleHash(processedContent)}`;
  }

  private static removeStopWords(text: string): string {
    const stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
      'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have',
      'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should'
    ]);

    return text
      .split(/\s+/)
      .filter(word => !stopWords.has(word))
      .join(' ');
  }
}

/**
 * Cache Invalidation Manager
 */
export class CacheInvalidationManager {
  private rules: Map<string, CacheInvalidationRule> = new Map();

  constructor() {
    this.initializeDefaultRules();
  }

  /**
   * Add invalidation rule
   */
  addRule(rule: CacheInvalidationRule): void {
    this.rules.set(rule.id, rule);
  }

  /**
   * Remove invalidation rule
   */
  removeRule(ruleId: string): boolean {
    return this.rules.delete(ruleId);
  }

  /**
   * Apply invalidation rules
   */
  applyRules(cache: AdvancedCache): {
    invalidatedCount: number;
    appliedRules: string[];
  } {
    const appliedRules: string[] = [];
    let invalidatedCount = 0;

    // Sort rules by priority
    const sortedRules = Array.from(this.rules.values())
      .sort((a, b) => b.priority - a.priority);

    for (const entry of cache.getStats().topQueries) {
      const cacheEntry = cache.get(entry.key);
      if (!cacheEntry) continue;

      for (const rule of sortedRules) {
        if (rule.condition(cacheEntry)) {
          cache.delete(entry.key);
          invalidatedCount++;
          appliedRules.push(rule.name);
          break; // Apply only first matching rule per entry
        }
      }
    }

    return { invalidatedCount, appliedRules };
  }

  private initializeDefaultRules(): void {
    // Rule: Invalidate old chart configurations
    this.addRule({
      id: 'old-charts',
      name: 'Old Chart Configurations',
      priority: 1,
      condition: (entry) => {
        const age = Date.now() - entry.createdAt;
        return entry.tags.includes('chart') && age > 24 * 60 * 60 * 1000; // 24 hours
      }
    });

    // Rule: Invalidate large unused entries
    this.addRule({
      id: 'large-unused',
      name: 'Large Unused Entries',
      priority: 2,
      condition: (entry) => {
        const age = Date.now() - entry.lastAccessed;
        return entry.metadata.size > 10000 && age > 60 * 60 * 1000; // 1 hour
      }
    });

    // Rule: Invalidate error responses
    this.addRule({
      id: 'error-responses',
      name: 'Error Responses',
      priority: 3,
      condition: (entry) => {
        return entry.tags.includes('error') || entry.tags.includes('fallback');
      }
    });
  }
}

/**
 * Caching Service
 */
export class CachingService {
  private cache: AdvancedCache;
  private keyGenerator: typeof CacheKeyGenerator;
  private invalidationManager: CacheInvalidationManager;

  constructor() {
    this.cache = new AdvancedCache({
      maxSize: 50 * 1024 * 1024, // 50MB
      maxEntries: 1000,
      defaultTtl: 5 * 60 * 1000, // 5 minutes
      cleanupInterval: 60 * 1000, // 1 minute
      compressionThreshold: 1024, // 1KB
      priorityLevels: 3
    });

    this.keyGenerator = CacheKeyGenerator;
    this.invalidationManager = new CacheInvalidationManager();
  }

  /**
   * Cache API response
   */
  cacheResponse(
    endpoint: string,
    params: Record<string, any>,
    response: any,
    options: {
      ttl?: number;
      tags?: string[];
      priority?: number;
    } = {}
  ): void {
    const key = this.keyGenerator.generateKey(endpoint, params);
    
    this.cache.set(key, response, {
      ttl: options.ttl,
      tags: ['api', endpoint.split('/')[1], ...(options.tags || [])],
      priority: options.priority,
      metadata: {
        source: 'api',
        requestId: params.requestId,
        processingTime: 0
      }
    });
  }

  /**
   * Get cached response
   */
  getCachedResponse(endpoint: string, params: Record<string, any>): any | null {
    const key = this.keyGenerator.generateKey(endpoint, params);
    return this.cache.get(key);
  }

  /**
   * Cache with semantic key for similar queries
   */
  cacheSemanticResponse(
    queryType: string,
    content: string,
    response: any,
    options: {
      ttl?: number;
      tags?: string[];
    } = {}
  ): void {
    const key = this.keyGenerator.generateSemanticKey(queryType, content, {
      normalize: true,
      ignoreCase: true,
      removeStopWords: true
    });

    this.cache.set(key, response, {
      ttl: options.ttl || 10 * 60 * 1000, // 10 minutes for semantic cache
      tags: ['semantic', queryType, ...(options.tags || [])],
      metadata: {
        source: 'api',
        processingTime: 0
      }
    });
  }

  /**
   * Get semantic cached response
   */
  getSemanticCachedResponse(queryType: string, content: string): any | null {
    const key = this.keyGenerator.generateSemanticKey(queryType, content, {
      normalize: true,
      ignoreCase: true,
      removeStopWords: true
    });

    return this.cache.get(key);
  }

  /**
   * Invalidate cache by tags
   */
  invalidate(tag: string): number {
    return this.cache.invalidateByTag(tag);
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    return this.cache.getStats();
  }

  /**
   * Apply invalidation rules
   */
  applyInvalidationRules(): { invalidatedCount: number; appliedRules: string[] } {
    return this.invalidationManager.applyRules(this.cache);
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Destroy caching service
   */
  destroy(): void {
    this.cache.destroy();
  }
}

// Export singleton instance
export const caching = new CachingService();

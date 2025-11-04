/**
 * Unit Tests for Utils Module
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { 
  debounce, 
  throttle,
  parseSeries, 
  formatNumber,
  formatCurrency,
  generateId,
  sanitizeHTML,
  copyToClipboard,
  downloadFile,
  isMobile,
} from '../../src/core/utils.js';

describe('Utils Module', () => {
  describe('parseSeries', () => {
    it('should parse comma-separated data', () => {
      const input = 'Jan 100, Feb 200, Mar 300';
      const result = parseSeries(input);
      
      expect(result).toHaveLength(3);
      expect(result[0]).toEqual({ label: 'Jan', value: 100 });
      expect(result[1]).toEqual({ label: 'Feb', value: 200 });
      expect(result[2]).toEqual({ label: 'Mar', value: 300 });
    });

    it('should handle K suffix', () => {
      const input = 'Q1 10K, Q2 15K, Q3 20K';
      const result = parseSeries(input);
      
      expect(result[0].value).toBe(10000);
      expect(result[1].value).toBe(15000);
      expect(result[2].value).toBe(20000);
    });

    it('should handle dollar signs', () => {
      const input = 'Jan $1000, Feb $2000';
      const result = parseSeries(input);
      
      expect(result[0].value).toBe(1000);
      expect(result[1].value).toBe(2000);
    });

    it('should return default data for invalid input', () => {
      const result = parseSeries('invalid data');
      
      expect(result).toHaveLength(3);
      expect(result[0].label).toBe('Jan');
    });

    it('should handle empty input', () => {
      const result = parseSeries('');
      
      expect(result).toHaveLength(3);
    });
  });

  describe('formatNumber', () => {
    it('should format numbers with commas', () => {
      expect(formatNumber(1000)).toBe('1,000');
      expect(formatNumber(1000000)).toBe('1,000,000');
      expect(formatNumber(123456789)).toBe('123,456,789');
    });

    it('should handle small numbers', () => {
      expect(formatNumber(100)).toBe('100');
      expect(formatNumber(10)).toBe('10');
      expect(formatNumber(1)).toBe('1');
    });

    it('should handle zero', () => {
      expect(formatNumber(0)).toBe('0');
    });
  });

  describe('formatCurrency', () => {
    it('should format USD currency', () => {
      expect(formatCurrency(1000)).toBe('$1,000.00');
      expect(formatCurrency(1234.56)).toBe('$1,234.56');
    });

    it('should handle different currencies', () => {
      expect(formatCurrency(1000, 'EUR')).toContain('1,000');
    });
  });

  describe('generateId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateId();
      const id2 = generateId();
      
      expect(id1).not.toBe(id2);
      expect(id1).toMatch(/^id_\d+_[a-z0-9]+$/);
    });

    it('should use custom prefix', () => {
      const id = generateId('chart');
      expect(id).toMatch(/^chart_\d+_[a-z0-9]+$/);
    });
  });

  describe('sanitizeHTML', () => {
    it('should escape HTML special characters', () => {
      const input = '<script>alert("xss")</script>';
      const result = sanitizeHTML(input);
      
      expect(result).not.toContain('<script>');
      expect(result).toContain('&lt;');
    });

    it('should handle safe text', () => {
      const input = 'Hello World';
      const result = sanitizeHTML(input);
      
      expect(result).toBe('Hello World');
    });
  });

  describe('debounce', () => {
    it('should debounce function calls', async () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100);
      
      debounced();
      debounced();
      debounced();
      
      expect(fn).not.toHaveBeenCalled();
      
      await new Promise(resolve => setTimeout(resolve, 150));
      
      expect(fn).toHaveBeenCalledTimes(1);
    });
  });

  describe('throttle', () => {
    it('should throttle function calls', async () => {
      const fn = vi.fn();
      const throttled = throttle(fn, 100);
      
      throttled();
      throttled();
      throttled();
      
      expect(fn).toHaveBeenCalledTimes(1);
      
      await new Promise(resolve => setTimeout(resolve, 150));
      
      throttled();
      expect(fn).toHaveBeenCalledTimes(2);
    });
  });

  describe('isMobile', () => {
    it('should detect mobile devices', () => {
      const originalUserAgent = navigator.userAgent;
      
      // Mock mobile user agent
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
        configurable: true,
      });
      
      expect(isMobile()).toBe(true);
      
      // Restore
      Object.defineProperty(navigator, 'userAgent', {
        value: originalUserAgent,
        configurable: true,
      });
    });
  });
});

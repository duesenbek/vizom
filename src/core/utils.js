/**
 * Utility Functions
 * Shared helper functions used across the application
 */

/**
 * Debounce function calls
 */
export function debounce(func, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function calls
 */
export function throttle(func, limit = 300) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Generate unique ID
 */
export function generateId(prefix = 'id') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Format number with commas
 */
export function formatNumber(num) {
  return new Intl.NumberFormat('en-US').format(num);
}

/**
 * Format currency
 */
export function formatCurrency(num, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(num);
}

/**
 * Parse data series from text
 */
export function parseSeries(text) {
  const normalized = typeof text === 'string' ? text.trim() : '';
  const parts = normalized.split(/[,;]+/).map(part => part.trim()).filter(Boolean);
  const result = [];
  const multipliers = { k: 1000, m: 1_000_000, b: 1_000_000_000 };

  parts.forEach((part, index) => {
    const labeledMatch = part.match(/^(.+?)\s*[:\-]?\s*\$?([\d.,]+)\s*([KkMmBb])?\s*$/);
    const numericMatch = part.match(/^\$?([\d.,]+)\s*([KkMmBb])?\s*$/);

    if (!labeledMatch && !numericMatch) {
      return;
    }

    const [, rawLabel = '', labeledValue, labeledSuffix] = labeledMatch || [];
    const [, numericValue, numericSuffix] = numericMatch || [];

    const valueString = labeledValue ?? numericValue;
    const suffix = (labeledSuffix ?? numericSuffix ?? '').toLowerCase();
    let value = parseFloat((valueString || '').replace(/,/g, ''));

    if (Number.isNaN(value)) {
      return;
    }

    if (suffix && multipliers[suffix]) {
      value *= multipliers[suffix];
    }

    const label = (rawLabel || '').trim() || `Item ${index + 1}`;
    result.push({ label, value });
  });

  return result.length ? result : [
    { label: 'Jan', value: 12000 },
    { label: 'Feb', value: 15000 },
    { label: 'Mar', value: 18000 },
  ];
}

/**
 * Sanitize HTML to prevent XSS
 */
export function sanitizeHTML(html) {
  const temp = document.createElement('div');
  temp.textContent = html;
  return temp.innerHTML;
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textarea);
    return success;
  }
}

/**
 * Download file
 */
export function downloadFile(content, filename, type = 'text/plain') {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Check if mobile device
 */
export function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

/**
 * Get query parameter
 */
export function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

/**
 * Set query parameter
 */
export function setQueryParam(param, value) {
  const url = new URL(window.location);
  url.searchParams.set(param, value);
  window.history.pushState({}, '', url);
}

/**
 * Show toast notification
 */
export function showToast(message, type = 'info', duration = 3000) {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 1.5rem;
    right: 1.5rem;
    padding: 1rem 1.5rem;
    border-radius: 0.75rem;
    background: ${type === 'error' ? '#ef4444' : type === 'success' ? '#10b981' : '#2563eb'};
    color: white;
    font-size: 0.875rem;
    font-weight: 500;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
    z-index: 9999;
    animation: slideIn 0.3s ease;
  `;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

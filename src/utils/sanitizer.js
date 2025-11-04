/**
 * HTML Sanitizer Module
 * Prevents XSS attacks by sanitizing HTML content
 */

export class HTMLSanitizer {
  /**
   * Allowed HTML elements
   */
  static ALLOWED_ELEMENTS = [
    'div', 'section', 'article', 'header', 'footer', 'main', 'aside', 'nav',
    'p', 'span', 'a', 'strong', 'em', 'b', 'i', 'u', 'br', 'hr',
    'ul', 'ol', 'li', 'dl', 'dt', 'dd',
    'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'caption',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'svg', 'g', 'path', 'rect', 'circle', 'ellipse', 'line', 'polyline', 'polygon',
    'text', 'tspan', 'defs', 'linearGradient', 'radialGradient', 'stop',
    'use', 'symbol', 'image', 'foreignObject',
    'canvas', 'img', 'figure', 'figcaption',
    'blockquote', 'pre', 'code',
  ];

  /**
   * Allowed SVG elements
   */
  static ALLOWED_SVG_ELEMENTS = [
    'svg', 'g', 'path', 'rect', 'circle', 'ellipse', 'line', 'polyline', 'polygon',
    'text', 'tspan', 'defs', 'linearGradient', 'radialGradient', 'stop',
    'use', 'symbol', 'image', 'foreignObject', 'animate', 'animateTransform',
  ];

  /**
   * Dangerous attributes to remove
   */
  static DANGEROUS_ATTRIBUTES = [
    'onerror', 'onclick', 'onload', 'onmouseover', 'onmouseout',
    'onfocus', 'onblur', 'onchange', 'onsubmit', 'onkeydown', 'onkeyup',
  ];

  /**
   * Sanitize HTML content
   */
  static sanitizeHTML(html) {
    if (!html || typeof html !== 'string') {
      return '';
    }

    try {
      const temp = document.createElement('div');
      temp.innerHTML = html;

      // Remove disallowed elements
      this.removeDisallowedElements(temp, this.ALLOWED_ELEMENTS);

      // Remove dangerous attributes
      this.removeDangerousAttributes(temp);

      // Sanitize URLs
      this.sanitizeURLs(temp);

      return temp.innerHTML;
    } catch (error) {
      console.error('HTML sanitization error:', error);
      return '';
    }
  }

  /**
   * Sanitize SVG content
   */
  static sanitizeSVG(svg) {
    if (!svg || typeof svg !== 'string') {
      return '';
    }

    try {
      const temp = document.createElement('div');
      temp.innerHTML = svg;

      // Remove disallowed elements
      this.removeDisallowedElements(temp, this.ALLOWED_SVG_ELEMENTS);

      // Remove dangerous attributes
      this.removeDangerousAttributes(temp);

      // Remove href and src attributes (potential XSS)
      const allElements = temp.querySelectorAll('*');
      allElements.forEach(el => {
        el.removeAttribute('href');
        el.removeAttribute('src');
      });

      return temp.innerHTML;
    } catch (error) {
      console.error('SVG sanitization error:', error);
      return '';
    }
  }

  /**
   * Remove disallowed elements
   */
  static removeDisallowedElements(container, allowedElements) {
    const allElements = container.querySelectorAll('*');
    
    allElements.forEach(el => {
      if (!allowedElements.includes(el.tagName.toLowerCase())) {
        el.remove();
      }
    });
  }

  /**
   * Remove dangerous attributes
   */
  static removeDangerousAttributes(container) {
    const allElements = container.querySelectorAll('*');
    
    allElements.forEach(el => {
      // Remove event handler attributes
      Array.from(el.attributes).forEach(attr => {
        if (attr.name.startsWith('on') || this.DANGEROUS_ATTRIBUTES.includes(attr.name)) {
          el.removeAttribute(attr.name);
        }
      });

      // Remove javascript: URLs
      ['href', 'src', 'action', 'formaction'].forEach(attr => {
        const value = el.getAttribute(attr);
        if (value && value.toLowerCase().includes('javascript:')) {
          el.removeAttribute(attr);
        }
      });
    });
  }

  /**
   * Sanitize URLs
   */
  static sanitizeURLs(container) {
    const links = container.querySelectorAll('a[href]');
    
    links.forEach(link => {
      const href = link.getAttribute('href');
      if (href) {
        try {
          const url = new URL(href, window.location.origin);
          // Only allow http, https, and relative URLs
          if (!['http:', 'https:', ''].includes(url.protocol)) {
            link.removeAttribute('href');
          }
        } catch (error) {
          // Invalid URL, remove it
          link.removeAttribute('href');
        }
      }
    });
  }

  /**
   * Escape HTML special characters
   */
  static escapeHTML(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    };
    
    return String(text).replace(/[&<>"']/g, char => map[char]);
  }

  /**
   * Strip all HTML tags
   */
  static stripHTML(html) {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || '';
  }

  /**
   * Sanitize for attribute value
   */
  static sanitizeAttribute(value) {
    if (typeof value !== 'string') {
      return '';
    }

    return value
      .replace(/[<>'"]/g, '')
      .trim();
  }

  /**
   * Check if content is safe
   */
  static isSafe(html) {
    if (!html || typeof html !== 'string') {
      return true;
    }

    const dangerousPatterns = [
      /<script/i,
      /javascript:/i,
      /onerror=/i,
      /onclick=/i,
      /onload=/i,
      /<iframe/i,
      /eval\(/i,
      /document\.cookie/i,
      /window\.location/i,
    ];

    return !dangerousPatterns.some(pattern => pattern.test(html));
  }
}

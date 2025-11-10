/**
 * HTML Sanitizer Service
 * Security-focused HTML sanitization to prevent XSS attacks
 */

export interface SanitizationOptions {
  allowedTags?: string[];
  allowedAttributes?: Record<string, string[]>;
  allowStyles?: boolean;
  allowScripts?: boolean;
  allowIframes?: boolean;
}

export class HTMLSanitizerService {
  private static readonly DEFAULT_ALLOWED_TAGS = [
    'div', 'span', 'p', 'br', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li', 'strong', 'em', 'b', 'i', 'u', 'strike',
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
    'a', 'img', 'button', 'input', 'textarea', 'select', 'option',
    'hr', 'blockquote', 'code', 'pre'
  ];

  private static readonly DEFAULT_ALLOWED_ATTRIBUTES = {
    '*': ['class', 'id', 'title', 'aria-label', 'role'],
    'a': ['href', 'target', 'rel'],
    'img': ['src', 'alt', 'width', 'height', 'loading'],
    'button': ['type', 'disabled', 'onclick'],
    'input': ['type', 'name', 'value', 'placeholder', 'disabled', 'required'],
    'textarea': ['name', 'placeholder', 'disabled', 'required', 'rows', 'cols'],
    'select': ['name', 'disabled', 'required'],
    'option': ['value', 'selected', 'disabled'],
    'table': ['border', 'cellpadding', 'cellspacing'],
    'td': ['colspan', 'rowspan'],
    'th': ['colspan', 'rowspan', 'scope']
  };

  private static readonly DANGEROUS_PROTOCOLS = [
    'javascript:', 'data:', 'vbscript:', 'file:', 'ftp:'
  ];

  private static readonly DANGEROUS_TAGS = [
    'script', 'iframe', 'object', 'embed', 'form', 'meta', 'link', 'style'
  ];

  /**
   * Sanitize HTML string
   */
  static sanitize(html: string, options: SanitizationOptions = {}): string {
    const opts = this.mergeOptions(options);

    // Create a temporary DOM element to parse HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    // Sanitize the DOM tree
    this.sanitizeNode(tempDiv, opts);

    return tempDiv.innerHTML;
  }

  /**
   * Sanitize DOM element
   */
  static sanitizeElement(element: Element, options: SanitizationOptions = {}): void {
    const opts = this.mergeOptions(options);
    this.sanitizeNode(element, opts);
  }

  /**
   * Escape HTML special characters
   */
  static escape(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Unescape HTML entities
   */
  static unescape(html: string): string {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  }

  /**
   * Check if HTML contains potentially dangerous content
   */
  static isDangerous(html: string): boolean {
    // Check for dangerous tags
    const dangerousTagRegex = new RegExp(
      `<\\s*(${this.DANGEROUS_TAGS.join('|')})\\b[^>]*>`,
      'gi'
    );
    
    if (dangerousTagRegex.test(html)) {
      return true;
    }

    // Check for dangerous protocols
    const protocolRegex = new RegExp(
      `\\b(${this.DANGEROUS_PROTOCOLS.join('|')})`,
      'gi'
    );
    
    if (protocolRegex.test(html)) {
      return true;
    }

    // Check for event handlers
    const eventHandlerRegex = /on\w+\s*=/gi;
    if (eventHandlerRegex.test(html)) {
      return true;
    }

    return false;
  }

  /**
   * Sanitize a single node and its children
   */
  private static sanitizeNode(node: Node, options: SanitizationOptions): void {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as Element;
      
      // Remove dangerous elements
      if (this.DANGEROUS_TAGS.includes(element.tagName.toLowerCase())) {
        if (!options.allowScripts && !options.allowIframes) {
          element.remove();
          return;
        }
      }

      // Sanitize attributes
      this.sanitizeAttributes(element, options);

      // Process children
      const children = Array.from(element.childNodes);
      children.forEach(child => this.sanitizeNode(child, options));
    } else if (node.nodeType === Node.TEXT_NODE) {
      // Text nodes are safe by default
      return;
    } else {
      // Remove other node types (comments, etc.)
      node.remove();
    }
  }

  /**
   * Sanitize element attributes
   */
  private static sanitizeAttributes(element: Element, options: SanitizationOptions): void {
    const attributes = Array.from(element.attributes);
    
    attributes.forEach(attr => {
      const attrName = attr.name.toLowerCase();
      const tagName = element.tagName.toLowerCase();

      // Check if attribute is allowed
      if (!this.isAttributeAllowed(tagName, attrName, options)) {
        element.removeAttribute(attr.name);
        return;
      }

      // Sanitize attribute values
      const sanitizedValue = this.sanitizeAttributeValue(
        attrName, 
        attr.value, 
        options
      );
      
      if (sanitizedValue !== attr.value) {
        if (sanitizedValue) {
          element.setAttribute(attr.name, sanitizedValue);
        } else {
          element.removeAttribute(attr.name);
        }
      }
    });
  }

  /**
   * Check if attribute is allowed
   */
  private static isAttributeAllowed(
    tagName: string, 
    attrName: string, 
    options: SanitizationOptions
  ): boolean {
    const allowedAttributes = options.allowedAttributes || this.DEFAULT_ALLOWED_ATTRIBUTES;

    // Check global attributes
    if (allowedAttributes['*']?.includes(attrName)) {
      return true;
    }

    // Check tag-specific attributes
    if (allowedAttributes[tagName]?.includes(attrName)) {
      return true;
    }

    return false;
  }

  /**
   * Sanitize attribute value
   */
  private static sanitizeAttributeValue(
    attrName: string, 
    value: string, 
    options: SanitizationOptions
  ): string {
    // Sanitize URLs
    if (attrName === 'href' || attrName === 'src') {
      return this.sanitizeUrl(value);
    }

    // Sanitize style attributes
    if (attrName === 'style' && !options.allowStyles) {
      return '';
    }

    // Remove event handlers
    if (attrName.startsWith('on')) {
      return '';
    }

    // Escape potentially dangerous values
    return this.escapeAttribute(value);
  }

  /**
   * Sanitize URL
   */
  private static sanitizeUrl(url: string): string {
    const trimmed = url.trim();
    
    // Check for dangerous protocols
    for (const protocol of this.DANGEROUS_PROTOCOLS) {
      if (trimmed.toLowerCase().startsWith(protocol)) {
        return '';
      }
    }

    // Allow http, https, mailto, tel protocols
    const allowedProtocols = ['http:', 'https:', 'mailto:', 'tel:'];
    const hasAllowedProtocol = allowedProtocols.some(protocol => 
      trimmed.toLowerCase().startsWith(protocol)
    );

    if (hasAllowedProtocol) {
      return trimmed;
    }

    // For relative URLs, ensure they don't start with dangerous characters
    if (trimmed.startsWith('/') || trimmed.startsWith('./') || trimmed.startsWith('../')) {
      return trimmed;
    }

    return '';
  }

  /**
   * Escape attribute value
   */
  private static escapeAttribute(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  /**
   * Merge user options with defaults
   */
  private static mergeOptions(options: SanitizationOptions): Required<SanitizationOptions> {
    return {
      allowedTags: options.allowedTags || this.DEFAULT_ALLOWED_TAGS,
      allowedAttributes: options.allowedAttributes || this.DEFAULT_ALLOWED_ATTRIBUTES,
      allowStyles: options.allowStyles || false,
      allowScripts: options.allowScripts || false,
      allowIframes: options.allowIframes || false
    };
  }

  /**
   * Create safe HTML from string
   */
  static createSafeHTML(html: string, options: SanitizationOptions = {}): string {
    return this.sanitize(html, options);
  }

  /**
   * Create safe text node
   */
  static createSafeText(text: string): Text {
    return document.createTextNode(text);
  }

  /**
   * Create safe element with sanitized content
   */
  static createSafeElement(
    tagName: string, 
    content: string = '', 
    attributes: Record<string, string> = {},
    options: SanitizationOptions = {}
  ): HTMLElement {
    const element = document.createElement(tagName);
    
    // Set attributes
    Object.entries(attributes).forEach(([name, value]) => {
      if (this.isAttributeAllowed(tagName, name, options)) {
        const sanitizedValue = this.sanitizeAttributeValue(name, value, options);
        if (sanitizedValue) {
          element.setAttribute(name, sanitizedValue);
        }
      }
    });

    // Set content
    if (content) {
      element.innerHTML = this.sanitize(content, options);
    }

    return element;
  }

  /**
   * Validate CSS value
   */
  static validateCSS(value: string): boolean {
    // Basic CSS validation - prevent dangerous CSS
    const dangerousPatterns = [
      /javascript:/gi,
      /expression\s*\(/gi,
      /import\s+/gi,
      /binding\s*:/gi
    ];

    return !dangerousPatterns.some(pattern => pattern.test(value));
  }

  /**
   * Sanitize CSS
   */
  static sanitizeCSS(css: string): string {
    if (!this.validateCSS(css)) {
      return '';
    }
    
    // Remove dangerous CSS functions
    return css
      .replace(/javascript\s*:/gi, '')
      .replace(/expression\s*\([^)]*\)/gi, '')
      .replace(/@import\s+[^;]+;/gi, '')
      .replace(/binding\s*:\s*[^;]+;/gi, '');
  }
}

// Export singleton instance
export const htmlSanitizer = HTMLSanitizerService;

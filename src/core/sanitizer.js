/**
 * @module sanitizer
 * @description A centralized and strict HTML sanitizer to prevent XSS.
 */

const ALLOWED_TAGS = [
  'p', 'b', 'i', 'u', 'strong', 'em', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li', 'a', 'br', 'span', 'div',
  'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td',
  'svg', 'g', 'path', 'rect', 'circle', 'line', 'polyline', 'polygon', 'text', 'tspan',
  'defs', 'linearGradient', 'radialGradient', 'stop', 'use', 'symbol', 'image', 'foreignObject'
];

const ALLOWED_ATTR = [
  'href', 'target', 'rel', 'class', 'id', 'style',
  'viewbox', 'd', 'fill', 'stroke', 'stroke-width', 'cx', 'cy', 'r', 'x', 'y', 'width', 'height',
  'transform', 'points', 'fill-rule', 'clip-path',
  'offset', 'stop-color', 'x1', 'y1', 'x2', 'y2'
];

/**
 * Sanitizes an HTML string by parsing it and removing any disallowed tags or attributes.
 * @param {string} dirtyHtml - The potentially unsafe HTML string.
 * @returns {string} The sanitized HTML string.
 */
export function sanitize(dirtyHtml) {
  if (typeof DOMParser === 'undefined') {
    // Fallback for environments without DOMParser (e.g., some server-side contexts)
    // This is a very basic fallback and should be improved if server-side rendering is a goal.
    return dirtyHtml.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/g, '');
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(dirtyHtml, 'text/html');

  const walk = (node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      if (!ALLOWED_TAGS.includes(node.tagName.toLowerCase())) {
        node.parentNode.removeChild(node);
        return;
      }

      const attributes = Array.from(node.attributes);
      for (const { name } of attributes) {
        if (!ALLOWED_ATTR.includes(name.toLowerCase()) && !name.startsWith('data-')) {
          node.removeAttribute(name);
        }
      }

      // Sanitize href attributes
      if (node.hasAttribute('href')) {
        const url = node.getAttribute('href');
        if (!url.startsWith('http') && !url.startsWith('#') && !url.startsWith('/')) {
          node.removeAttribute('href');
        }
      }
    }

    for (let i = node.childNodes.length - 1; i >= 0; i--) {
      walk(node.childNodes[i]);
    }
  };

  walk(doc.body);

  return doc.body.innerHTML;
}

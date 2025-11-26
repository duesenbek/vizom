/**
 * Unified Toast Notification System
 * Provides consistent toast notifications across the entire application
 */

class ToastSystem {
  constructor() {
    this.container = null;
    this.toasts = new Map();
    this.toastId = 0;
    this.defaultDuration = 4000;
    this.maxToasts = 5;
    this.position = 'bottom-right'; // bottom-right, bottom-left, top-right, top-left
    
    this.init();
  }

  init() {
    // Create container if it doesn't exist
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'vizom-toast-container';
      this.container.className = 'toast-container';
      this.container.setAttribute('aria-live', 'polite');
      this.container.setAttribute('aria-label', 'Notifications');
      this.applyContainerStyles();
      document.body.appendChild(this.container);
    }
  }

  applyContainerStyles() {
    const positions = {
      'bottom-right': { bottom: '1.5rem', right: '1.5rem' },
      'bottom-left': { bottom: '1.5rem', left: '1.5rem' },
      'top-right': { top: '1.5rem', right: '1.5rem' },
      'top-left': { top: '1.5rem', left: '1.5rem' }
    };

    const pos = positions[this.position] || positions['bottom-right'];
    
    Object.assign(this.container.style, {
      position: 'fixed',
      zIndex: '9999',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
      maxWidth: '400px',
      width: '100%',
      pointerEvents: 'none',
      ...pos
    });
  }

  /**
   * Show a toast notification
   * @param {string} message - The message to display
   * @param {string} type - Type: 'success', 'error', 'warning', 'info'
   * @param {object} options - Additional options
   * @returns {number} Toast ID for programmatic dismissal
   */
  show(message, type = 'info', options = {}) {
    const {
      duration = this.defaultDuration,
      icon = null,
      action = null,
      actionLabel = 'Undo',
      dismissible = true,
      persistent = false
    } = options;

    // Limit number of toasts
    if (this.toasts.size >= this.maxToasts) {
      const oldestId = this.toasts.keys().next().value;
      this.dismiss(oldestId);
    }

    const id = ++this.toastId;
    const toast = this.createToastElement(id, message, type, {
      icon,
      action,
      actionLabel,
      dismissible
    });

    this.container.appendChild(toast);
    this.toasts.set(id, { element: toast, timeout: null });

    // Trigger animation
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    // Auto-dismiss unless persistent
    if (!persistent && duration > 0) {
      const timeout = setTimeout(() => this.dismiss(id), duration);
      this.toasts.get(id).timeout = timeout;
    }

    return id;
  }

  createToastElement(id, message, type, options) {
    const { icon, action, actionLabel, dismissible } = options;

    const toast = document.createElement('div');
    toast.className = `vizom-toast vizom-toast--${type}`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('data-toast-id', id);
    toast.style.pointerEvents = 'auto';

    // Icon SVGs
    const icons = {
      success: `<svg class="vizom-toast__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
        <polyline points="22 4 12 14.01 9 11.01"/>
      </svg>`,
      error: `<svg class="vizom-toast__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="15" y1="9" x2="9" y2="15"/>
        <line x1="9" y1="9" x2="15" y2="15"/>
      </svg>`,
      warning: `<svg class="vizom-toast__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>`,
      info: `<svg class="vizom-toast__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="16" x2="12" y2="12"/>
        <line x1="12" y1="8" x2="12.01" y2="8"/>
      </svg>`
    };

    const iconHtml = icon || icons[type] || icons.info;

    toast.innerHTML = `
      <div class="vizom-toast__content">
        ${iconHtml}
        <span class="vizom-toast__message">${this.escapeHtml(message)}</span>
      </div>
      <div class="vizom-toast__actions">
        ${action ? `<button class="vizom-toast__action" type="button">${this.escapeHtml(actionLabel)}</button>` : ''}
        ${dismissible ? `<button class="vizom-toast__dismiss" type="button" aria-label="Dismiss notification">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>` : ''}
      </div>
    `;

    // Apply styles
    this.applyToastStyles(toast, type);

    // Event listeners
    if (dismissible) {
      const dismissBtn = toast.querySelector('.vizom-toast__dismiss');
      dismissBtn?.addEventListener('click', () => this.dismiss(id));
    }

    if (action) {
      const actionBtn = toast.querySelector('.vizom-toast__action');
      actionBtn?.addEventListener('click', () => {
        action();
        this.dismiss(id);
      });
    }

    // Pause auto-dismiss on hover
    toast.addEventListener('mouseenter', () => {
      const toastData = this.toasts.get(id);
      if (toastData?.timeout) {
        clearTimeout(toastData.timeout);
        toastData.timeout = null;
      }
    });

    toast.addEventListener('mouseleave', () => {
      const toastData = this.toasts.get(id);
      if (toastData && !toastData.timeout) {
        toastData.timeout = setTimeout(() => this.dismiss(id), 2000);
      }
    });

    return toast;
  }

  applyToastStyles(toast, type) {
    const colors = {
      success: { bg: 'linear-gradient(135deg, #ecfdf5 0%, #ffffff 100%)', border: '#10b981', icon: '#059669' },
      error: { bg: 'linear-gradient(135deg, #fef2f2 0%, #ffffff 100%)', border: '#ef4444', icon: '#dc2626' },
      warning: { bg: 'linear-gradient(135deg, #fffbeb 0%, #ffffff 100%)', border: '#f59e0b', icon: '#d97706' },
      info: { bg: 'linear-gradient(135deg, #eff6ff 0%, #ffffff 100%)', border: '#3b82f6', icon: '#2563eb' }
    };

    const color = colors[type] || colors.info;

    Object.assign(toast.style, {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '0.75rem',
      padding: '0.875rem 1rem',
      background: color.bg,
      borderRadius: '0.75rem',
      borderLeft: `4px solid ${color.border}`,
      boxShadow: '0 20px 40px -10px rgba(15, 23, 42, 0.15), 0 0 0 1px rgba(15, 23, 42, 0.05)',
      transform: 'translateX(120%)',
      opacity: '0',
      transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease'
    });

    // Style icon
    const iconEl = toast.querySelector('.vizom-toast__icon');
    if (iconEl) {
      Object.assign(iconEl.style, {
        width: '1.25rem',
        height: '1.25rem',
        flexShrink: '0',
        color: color.icon
      });
    }

    // Style content
    const content = toast.querySelector('.vizom-toast__content');
    if (content) {
      Object.assign(content.style, {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        flex: '1'
      });
    }

    // Style message
    const message = toast.querySelector('.vizom-toast__message');
    if (message) {
      Object.assign(message.style, {
        fontSize: '0.875rem',
        fontWeight: '500',
        color: '#1e293b',
        lineHeight: '1.4'
      });
    }

    // Style actions
    const actions = toast.querySelector('.vizom-toast__actions');
    if (actions) {
      Object.assign(actions.style, {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        flexShrink: '0'
      });
    }

    // Style action button
    const actionBtn = toast.querySelector('.vizom-toast__action');
    if (actionBtn) {
      Object.assign(actionBtn.style, {
        padding: '0.375rem 0.75rem',
        fontSize: '0.75rem',
        fontWeight: '600',
        color: color.icon,
        background: 'transparent',
        border: 'none',
        borderRadius: '0.375rem',
        cursor: 'pointer',
        transition: 'background 0.2s ease'
      });
      actionBtn.addEventListener('mouseenter', () => {
        actionBtn.style.background = 'rgba(0,0,0,0.05)';
      });
      actionBtn.addEventListener('mouseleave', () => {
        actionBtn.style.background = 'transparent';
      });
    }

    // Style dismiss button
    const dismissBtn = toast.querySelector('.vizom-toast__dismiss');
    if (dismissBtn) {
      Object.assign(dismissBtn.style, {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '1.5rem',
        height: '1.5rem',
        padding: '0',
        background: 'transparent',
        border: 'none',
        borderRadius: '0.25rem',
        color: '#94a3b8',
        cursor: 'pointer',
        transition: 'color 0.2s ease, background 0.2s ease'
      });
      dismissBtn.querySelector('svg').style.cssText = 'width: 0.875rem; height: 0.875rem;';
      dismissBtn.addEventListener('mouseenter', () => {
        dismissBtn.style.color = '#64748b';
        dismissBtn.style.background = 'rgba(0,0,0,0.05)';
      });
      dismissBtn.addEventListener('mouseleave', () => {
        dismissBtn.style.color = '#94a3b8';
        dismissBtn.style.background = 'transparent';
      });
    }
  }

  /**
   * Dismiss a toast by ID
   */
  dismiss(id) {
    const toastData = this.toasts.get(id);
    if (!toastData) return;

    const { element, timeout } = toastData;
    
    if (timeout) {
      clearTimeout(timeout);
    }

    // Animate out
    element.style.transform = 'translateX(120%)';
    element.style.opacity = '0';

    setTimeout(() => {
      element.remove();
      this.toasts.delete(id);
    }, 300);
  }

  /**
   * Dismiss all toasts
   */
  dismissAll() {
    this.toasts.forEach((_, id) => this.dismiss(id));
  }

  /**
   * Convenience methods
   */
  success(message, options = {}) {
    return this.show(message, 'success', options);
  }

  error(message, options = {}) {
    return this.show(message, 'error', { duration: 6000, ...options });
  }

  warning(message, options = {}) {
    return this.show(message, 'warning', options);
  }

  info(message, options = {}) {
    return this.show(message, 'info', options);
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Create singleton instance
const toastSystem = new ToastSystem();

// Export for ES modules
export { ToastSystem, toastSystem };

// Make available globally for legacy code
if (typeof window !== 'undefined') {
  window.vizomToast = toastSystem;
  
  // Compatibility layer for existing code
  window.uiFeedback = window.uiFeedback || {};
  window.uiFeedback.showToast = (message, type = 'info', duration) => {
    return toastSystem.show(message, type, { duration });
  };
}

export default toastSystem;

/**
 * Modal Manager
 * Core modal functionality with state management
 */

import { ModalError, ModalNotFoundError, ModalAlreadyOpenError } from './types.js';

export class ModalManager {
  constructor() {
    this.modals = new Map();
    this.modalStack = [];
    this.container = null;
    this.zIndexBase = 1000;
    this.nextZIndex = this.zIndexBase;

    this.createContainer();
    this.setupGlobalStyles();
    this.setupGlobalEventListeners();
  }

  /**
   * Create modal container
   */
  createContainer() {
    this.container = document.createElement('div');
    this.container.id = 'modal-container';
    this.container.className = 'modal-container';
    document.body.appendChild(this.container);
  }

  /**
   * Setup global modal styles
   */
  setupGlobalStyles() {
    if (document.getElementById('modal-styles')) return;

    const styles = document.createElement('style');
    styles.id = 'modal-styles';
    styles.textContent = `
      .modal-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1000;
      }

      .modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        pointer-events: auto;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
      }

      .modal.open {
        opacity: 1;
        visibility: visible;
      }

      .modal-backdrop {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(4px);
      }

      .modal-content {
        position: relative;
        background: white;
        border-radius: 12px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        max-height: 90vh;
        overflow: hidden;
        transform: scale(0.9);
        transition: transform 0.3s ease;
      }

      .modal.open .modal-content {
        transform: scale(1);
      }

      .modal.small .modal-content {
        width: 90%;
        max-width: 400px;
      }

      .modal.medium .modal-content {
        width: 90%;
        max-width: 600px;
      }

      .modal.large .modal-content {
        width: 90%;
        max-width: 900px;
      }

      .modal.fullscreen .modal-content {
        width: 95%;
        height: 95%;
        max-width: none;
        max-height: none;
      }

      .modal-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 20px 24px;
        border-bottom: 1px solid #e5e7eb;
      }

      .modal-title {
        font-size: 18px;
        font-weight: 600;
        color: #1f2937;
        margin: 0;
      }

      .modal-close {
        background: none;
        border: none;
        width: 32px;
        height: 32px;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: #6b7280;
        transition: all 0.2s ease;
      }

      .modal-close:hover {
        background: #f3f4f6;
        color: #374151;
      }

      .modal-body {
        padding: 24px;
        overflow-y: auto;
        max-height: calc(90vh - 140px);
      }

      .modal-footer {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 12px;
        padding: 16px 24px;
        border-top: 1px solid #e5e7eb;
        background: #f9fafb;
      }

      /* Animation variants */
      .modal.fade .modal-content {
        transform: scale(1);
        opacity: 0;
      }

      .modal.fade.open .modal-content {
        opacity: 1;
      }

      .modal.slide .modal-content {
        transform: translateY(-50px);
      }

      .modal.slide.open .modal-content {
        transform: translateY(0);
      }

      .modal.scale .modal-content {
        transform: scale(0.8);
      }

      .modal.scale.open .modal-content {
        transform: scale(1);
      }
    `;
    document.head.appendChild(styles);
  }

  /**
   * Setup global event listeners
   */
  setupGlobalEventListeners() {
    // Handle escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modalStack.length > 0) {
        const topModalId = this.modalStack[this.modalStack.length - 1];
        const modalState = this.modals.get(topModalId);
        
        if (modalState && modalState.options.closeOnEscape !== false) {
          this.close(topModalId);
        }
      }
    });

    // Handle backdrop clicks
    this.container?.addEventListener('click', (e) => {
      if (e.target === this.container && this.modalStack.length > 0) {
        const topModalId = this.modalStack[this.modalStack.length - 1];
        const modalState = this.modals.get(topModalId);
        
        if (modalState && modalState.options.closeOnBackdrop !== false) {
          this.close(topModalId);
        }
      }
    });
  }

  /**
   * Open a modal
   */
  async open(id, config, options = {}) {
    // Check if modal is already open
    if (this.modals.has(id)) {
      throw new ModalAlreadyOpenError(id);
    }

    // Create modal state
    const modalState = {
      id,
      config: { ...config },
      options: { 
        closeOnEscape: true,
        closeOnBackdrop: true,
        trapFocus: true,
        ...options 
      },
      isOpen: false,
      zIndex: this.nextZIndex++,
      element: null
    };

    // Create modal element
    const modalElement = this.createModalElement(modalState);
    modalState.element = modalElement;

    // Add to container and state
    this.container?.appendChild(modalElement);
    this.modals.set(id, modalState);
    this.modalStack.push(id);

    // Trigger open
    await this.animateOpen(modalState);
    modalState.isOpen = true;

    // Setup focus management
    if (modalState.options.trapFocus) {
      this.trapFocus(modalState);
    }

    // Emit events
    this.emitEvent({ type: 'modal:open', modalId: id });
    modalState.options.onOpen?.();

    // Focus element if specified
    if (modalState.options.focusElement) {
      this.focusElement(modalState.options.focusElement, modalElement);
    }
  }

  /**
   * Close a modal
   */
  async close(id) {
    const modalState = this.modals.get(id);
    if (!modalState) {
      throw new ModalNotFoundError(id);
    }

    // Check before close callback
    if (modalState.options.onBeforeClose) {
      const canClose = await modalState.options.onBeforeClose();
      if (canClose === false) {
        return; // Cancel close
      }
    }

    // Animate close
    await this.animateClose(modalState);
    modalState.isOpen = false;

    // Remove from stack and state
    const stackIndex = this.modalStack.indexOf(id);
    if (stackIndex > -1) {
      this.modalStack.splice(stackIndex, 1);
    }

    // Remove element
    modalState.element?.remove();

    // Emit events
    this.emitEvent({ type: 'modal:close', modalId: id });
    modalState.options.onClose?.();

    // Clean up
    this.modals.delete(id);

    // Restore focus to previous modal or body
    if (this.modalStack.length > 0) {
      const previousModalId = this.modalStack[this.modalStack.length - 1];
      const previousModal = this.modals.get(previousModalId);
      if (previousModal && previousModal.options.trapFocus) {
        this.trapFocus(previousModal);
      }
    } else {
      document.body.focus();
    }
  }

  /**
   * Create modal element
   */
  createModalElement(modalState) {
    const modal = document.createElement('div');
    modal.className = `modal modal-${modalState.config.size} ${modalState.config.animation || 'fade'}`;
    modal.style.zIndex = modalState.zIndex.toString();

    // Add backdrop if needed
    if (modalState.config.backdrop !== false) {
      const backdrop = document.createElement('div');
      backdrop.className = 'modal-backdrop';
      modal.appendChild(backdrop);
    }

    // Create content
    const content = document.createElement('div');
    content.className = 'modal-content';
    
    if (modalState.config.className) {
      content.classList.add(modalState.config.className);
    }

    // Add attributes
    if (modalState.config.attributes) {
      Object.entries(modalState.config.attributes).forEach(([key, value]) => {
        content.setAttribute(key, value);
      });
    }

    // Add header if title is provided
    if (modalState.config.title) {
      const header = this.createModalHeader(modalState);
      content.appendChild(header);
    }

    // Add body
    const body = this.createModalBody(modalState);
    content.appendChild(body);

    // Add close button if closable
    if (modalState.config.closable !== false) {
      const closeButton = document.createElement('button');
      closeButton.className = 'modal-close';
      closeButton.innerHTML = '<i class="fas fa-times"></i>';
      closeButton.addEventListener('click', () => this.close(modalState.id));
      
      const header = content.querySelector('.modal-header');
      if (header) {
        header.appendChild(closeButton);
      }
    }

    modal.appendChild(content);
    return modal;
  }

  /**
   * Create modal header
   */
  createModalHeader(modalState) {
    const header = document.createElement('div');
    header.className = 'modal-header';
    
    const title = document.createElement('h2');
    title.className = 'modal-title';
    title.textContent = modalState.config.title;
    
    header.appendChild(title);
    return header;
  }

  /**
   * Create modal body
   */
  createModalBody(modalState) {
    const body = document.createElement('div');
    body.className = 'modal-body';

    if (typeof modalState.config.content === 'string') {
      body.innerHTML = modalState.config.content;
    } else if (modalState.config.content instanceof HTMLElement) {
      body.appendChild(modalState.config.content);
    }

    return body;
  }

  /**
   * Animate modal open
   */
  async animateOpen(modalState) {
    if (!modalState.element) return;

    // Force reflow
    modalState.element.offsetHeight;
    
    // Add open class
    modalState.element.classList.add('open');

    // Wait for animation
    await new Promise(resolve => {
      modalState.element?.addEventListener('transitionend', resolve, { once: true });
    });

    this.emitEvent({ type: 'modal:after-open', modalId: modalState.id });
  }

  /**
   * Animate modal close
   */
  async animateClose(modalState) {
    if (!modalState.element) return;

    // Remove open class
    modalState.element.classList.remove('open');

    // Wait for animation
    await new Promise(resolve => {
      modalState.element?.addEventListener('transitionend', resolve, { once: true });
    });
  }

  /**
   * Trap focus within modal
   */
  trapFocus(modalState) {
    if (!modalState.element) return;

    const focusableElements = modalState.element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    modalState.element.addEventListener('keydown', handleTabKey);
    firstElement.focus();

    // Store handler for cleanup
    modalState.focusHandler = handleTabKey;
  }

  /**
   * Focus specific element
   */
  focusElement(element, modalElement) {
    let targetElement = null;

    if (typeof element === 'string') {
      targetElement = modalElement.querySelector(element);
    } else if (element instanceof HTMLElement) {
      targetElement = element;
    }

    targetElement?.focus();
  }

  /**
   * Emit modal event
   */
  emitEvent(event) {
    const customEvent = new CustomEvent('modalEvent', {
      detail: event
    });
    document.dispatchEvent(customEvent);
  }

  /**
   * Check if modal is open
   */
  isOpen(id) {
    const modalState = this.modals.get(id);
    return modalState?.isOpen || false;
  }

  /**
   * Get modal state
   */
  getModal(id) {
    return this.modals.get(id);
  }

  /**
   * Get all open modals
   */
  getAllModals() {
    return Array.from(this.modals.values());
  }

  /**
   * Get modal stack
   */
  getModalStack() {
    return [...this.modalStack];
  }

  /**
   * Close all modals
   */
  async closeAll() {
    const modalIds = [...this.modalStack];
    await Promise.all(modalIds.map(id => this.close(id)));
  }

  /**
   * Cleanup manager
   */
  destroy() {
    this.closeAll();
    this.container?.remove();
    this.modals.clear();
    this.modalStack = [];
  }
}

// Export singleton instance
export const modalManager = new ModalManager();

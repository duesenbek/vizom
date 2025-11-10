/**
 * Modal Types and Interfaces
 * Type definitions for the modal system
 */

export interface ModalConfig {
  id?: string;
  title: string;
  content: string | HTMLElement;
  size: 'small' | 'medium' | 'large' | 'fullscreen';
  backdrop?: boolean;
  closable?: boolean;
  persistent?: boolean;
  animation?: 'fade' | 'slide' | 'scale';
  className?: string;
  attributes?: Record<string, string>;
}

export interface ModalOptions {
  onOpen?: () => void;
  onClose?: () => void;
  onBeforeClose?: () => boolean | Promise<boolean>;
  focusElement?: string | HTMLElement;
  trapFocus?: boolean;
  closeOnEscape?: boolean;
  closeOnBackdrop?: boolean;
}

export interface ModalState {
  id: string;
  config: ModalConfig;
  options: ModalOptions;
  isOpen: boolean;
  zIndex: number;
  element: HTMLElement | null;
}

export interface ModalTemplate {
  title: string;
  content: string;
  size: ModalConfig['size'];
  backdrop?: boolean;
  closable?: boolean;
}

export interface ModalEvent {
  type: 'modal:open' | 'modal:close' | 'modal:before-close' | 'modal:after-open';
  modalId: string;
  data?: any;
}

// Error types
export class ModalError extends Error {
  constructor(message: string, public modalId?: string, public code?: string) {
    super(message);
    this.name = 'ModalError';
  }
}

export class ModalNotFoundError extends ModalError {
  constructor(modalId: string) {
    super(`Modal with ID "${modalId}" not found`, modalId, 'MODAL_NOT_FOUND');
    this.name = 'ModalNotFoundError';
  }
}

export class ModalAlreadyOpenError extends ModalError {
  constructor(modalId: string) {
    super(`Modal "${modalId}" is already open`, modalId, 'MODAL_ALREADY_OPEN');
    this.name = 'ModalAlreadyOpenError';
  }
}

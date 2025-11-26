/**
 * Modal Types and Interfaces
 * Type definitions for the modal system
 */
// Error types
export class ModalError extends Error {
    constructor(message, modalId, code) {
        super(message);
        this.modalId = modalId;
        this.code = code;
        this.name = 'ModalError';
    }
}
export class ModalNotFoundError extends ModalError {
    constructor(modalId) {
        super(`Modal with ID "${modalId}" not found`, modalId, 'MODAL_NOT_FOUND');
        this.name = 'ModalNotFoundError';
    }
}
export class ModalAlreadyOpenError extends ModalError {
    constructor(modalId) {
        super(`Modal "${modalId}" is already open`, modalId, 'MODAL_ALREADY_OPEN');
        this.name = 'ModalAlreadyOpenError';
    }
}

// Modal type definitions
export const ModalType = {
    INFO: 'info',
    WARNING: 'warning',
    ERROR: 'error',
    SUCCESS: 'success',
    CONFIRM: 'confirm',
    CUSTOM: 'custom'
};

export const ModalSize = {
    SMALL: 'sm',
    MEDIUM: 'md',
    LARGE: 'lg',
    FULL: 'full'
};

export class ModalConfig {
    constructor(options = {}) {
        this.type = options.type || ModalType.INFO;
        this.size = options.size || ModalSize.MEDIUM;
        this.title = options.title || '';
        this.content = options.content || '';
        this.closeOnBackdrop = options.closeOnBackdrop !== false;
        this.showCloseButton = options.showCloseButton !== false;
    }
}

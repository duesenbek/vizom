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

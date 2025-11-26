/**
 * Workflow Types and Interfaces
 * Central type definitions for workflow system
 */
// Error types
export class WorkflowError extends Error {
    constructor(message, workflowId, stepId, code) {
        super(message);
        this.workflowId = workflowId;
        this.stepId = stepId;
        this.code = code;
        this.name = 'WorkflowError';
    }
}
export class WorkflowValidationError extends WorkflowError {
    constructor(message, workflowId, stepId) {
        super(message, workflowId, stepId, 'VALIDATION_ERROR');
        this.name = 'WorkflowValidationError';
    }
}
export class WorkflowTransitionError extends WorkflowError {
    constructor(message, workflowId, stepId) {
        super(message, workflowId, stepId, 'TRANSITION_ERROR');
        this.name = 'WorkflowTransitionError';
    }
}

// Workflow type definitions
export const WorkflowStatus = {
    PENDING: 'pending',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    FAILED: 'failed',
    CANCELLED: 'cancelled'
};

export const WorkflowStep = {
    VALIDATION: 'validation',
    PROCESSING: 'processing',
    RENDERING: 'rendering',
    EXPORT: 'export',
    CLEANUP: 'cleanup'
};

export class WorkflowConfig {
    constructor(options = {}) {
        this.steps = options.steps || [];
        this.timeout = options.timeout || 30000;
        this.retries = options.retries || 3;
        this.onProgress = options.onProgress || (() => {});
        this.onComplete = options.onComplete || (() => {});
        this.onError = options.onError || (() => {});
    }
}

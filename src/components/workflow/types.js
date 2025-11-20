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

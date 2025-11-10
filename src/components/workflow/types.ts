/**
 * Workflow Types and Interfaces
 * Central type definitions for workflow system
 */

// Base workflow interface
export interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  component: string;
  estimatedTime: string;
  tips: string[];
  nextSteps: string[];
  skipAllowed: boolean;
  automation?: AutomationRule;
  painPoint?: string;
  solution?: string;
}

export interface AutomationRule {
  skipIf?: string;
  autoSelect?: string;
  conditions?: Record<string, any>;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  metrics?: WorkflowMetrics;
}

export interface WorkflowMetrics {
  completionRate: number;
  averageTime: number;
  dropOffPoints: string[];
  userSatisfaction: number;
}

export interface UserPreferences {
  skipIntro: boolean;
  autoSave: boolean;
  preferredInputMethod: string;
  theme: string;
}

export interface WorkflowState {
  currentWorkflow: string | null;
  currentStep: number;
  history: WorkflowHistoryEntry[];
  progress: Map<string, number>;
  preferences: UserPreferences;
}

export interface WorkflowHistoryEntry {
  workflowId: string;
  stepId: string;
  timestamp: Date;
  action: 'start' | 'complete' | 'skip' | 'back';
  duration?: number;
}

// Workflow events
export interface WorkflowEvent {
  type: 'workflow:start' | 'workflow:complete' | 'step:start' | 'step:complete' | 'step:skip';
  workflowId: string;
  stepId?: string;
  data?: any;
}

// Error types
export class WorkflowError extends Error {
  constructor(
    message: string,
    public workflowId?: string,
    public stepId?: string,
    public code?: string
  ) {
    super(message);
    this.name = 'WorkflowError';
  }
}

export class WorkflowValidationError extends WorkflowError {
  constructor(message: string, workflowId?: string, stepId?: string) {
    super(message, workflowId, stepId, 'VALIDATION_ERROR');
    this.name = 'WorkflowValidationError';
  }
}

export class WorkflowTransitionError extends WorkflowError {
  constructor(message: string, workflowId?: string, stepId?: string) {
    super(message, workflowId, stepId, 'TRANSITION_ERROR');
    this.name = 'WorkflowTransitionError';
  }
}

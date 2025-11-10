/**
 * Workflow Detection Service
 * Detects and manages current workflow based on URL and user actions
 */

import { Workflow, WorkflowState, WorkflowEvent } from './types.js';

export class WorkflowDetectionService {
  private currentWorkflow: string | null = null;
  private workflows: Map<string, Workflow> = new Map();
  private eventListeners: Set<{ target: EventTarget; event: string; handler: Function }> = new Set();

  constructor() {
    this.setupEventListeners();
  }

  /**
   * Initialize workflow detection
   */
  init() {
    this.detectCurrentWorkflow();
    this.registerWorkflows();
  }

  /**
   * Setup event listeners for workflow changes
   */
  private setupEventListeners() {
    const handleNavigationChange = () => {
      this.detectCurrentWorkflow();
    };

    // Listen for browser navigation
    window.addEventListener('popstate', handleNavigationChange);
    this.trackEventListener(window, 'popstate', handleNavigationChange);

    // Listen for custom navigation events
    document.addEventListener('navigationOccurred', handleNavigationChange);
    this.trackEventListener(document, 'navigationOccurred', handleNavigationChange);
  }

  /**
   * Track event listeners for cleanup
   */
  private trackEventListener(target: EventTarget, event: string, handler: Function) {
    this.eventListeners.add({ target, event, handler });
  }

  /**
   * Detect current workflow based on URL path
   */
  private detectCurrentWorkflow(): string | null {
    const path = window.location.pathname;
    const previousWorkflow = this.currentWorkflow;

    // Workflow detection rules
    if (path.includes('/create')) {
      this.currentWorkflow = 'chart-creation';
    } else if (path.includes('/templates')) {
      this.currentWorkflow = 'template';
    } else if (path.includes('/import')) {
      this.currentWorkflow = 'data-import';
    } else if (path.includes('/dashboard')) {
      this.currentWorkflow = 'dashboard';
    } else {
      this.currentWorkflow = null;
    }

    // Emit workflow change event
    if (previousWorkflow !== this.currentWorkflow) {
      this.emitWorkflowChange(previousWorkflow, this.currentWorkflow);
    }

    return this.currentWorkflow;
  }

  /**
   * Register available workflows
   */
  private registerWorkflows() {
    // These will be populated by workflow definitions
    // Chart creation workflow
    this.workflows.set('chart-creation', {
      id: 'chart-creation',
      name: 'Create Chart from Data',
      description: 'Transform your data into beautiful visualizations',
      steps: [] // Will be populated by ChartCreationWorkflow
    });

    // Template workflow
    this.workflows.set('template', {
      id: 'template',
      name: 'Template Selection',
      description: 'Choose and customize pre-built templates',
      steps: [] // Will be populated by TemplateWorkflow
    });
  }

  /**
   * Emit workflow change event
   */
  private emitWorkflowChange(previousWorkflow: string | null, newWorkflow: string | null) {
    const event: WorkflowEvent = {
      type: newWorkflow ? 'workflow:start' : 'workflow:complete',
      workflowId: newWorkflow || previousWorkflow || '',
      data: {
        previousWorkflow,
        newWorkflow
      }
    };

    this.dispatchEvent(event);
  }

  /**
   * Dispatch custom workflow event
   */
  private dispatchEvent(event: WorkflowEvent) {
    const customEvent = new CustomEvent('workflowChange', {
      detail: event
    });
    document.dispatchEvent(customEvent);
  }

  /**
   * Get current workflow
   */
  getCurrentWorkflow(): string | null {
    return this.currentWorkflow;
  }

  /**
   * Get workflow by ID
   */
  getWorkflow(id: string): Workflow | undefined {
    return this.workflows.get(id);
  }

  /**
   * Get all available workflows
   */
  getAllWorkflows(): Workflow[] {
    return Array.from(this.workflows.values());
  }

  /**
   * Register a new workflow
   */
  registerWorkflow(workflow: Workflow): void {
    this.workflows.set(workflow.id, workflow);
  }

  /**
   * Check if a workflow exists
   */
  hasWorkflow(id: string): boolean {
    return this.workflows.has(id);
  }

  /**
   * Cleanup event listeners
   */
  destroy(): void {
    this.eventListeners.forEach(({ target, event, handler }) => {
      target.removeEventListener(event, handler as EventListener);
    });
    this.eventListeners.clear();
    this.workflows.clear();
  }
}

// Export singleton instance
export const workflowDetection = new WorkflowDetectionService();

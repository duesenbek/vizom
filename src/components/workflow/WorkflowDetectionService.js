/**
 * Workflow Detection Service
 * Detects and manages current workflow based on URL and user actions
 */

import { WorkflowEvent } from './types.js';

export class WorkflowDetectionService {
  constructor() {
    this.currentWorkflow = null;
    this.workflows = new Map();
    this.eventListeners = new Set();
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
  setupEventListeners() {
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
  trackEventListener(target, event, handler) {
    this.eventListeners.add({ target, event, handler });
  }

  /**
   * Detect current workflow based on URL path
   */
  detectCurrentWorkflow() {
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
  registerWorkflows() {
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
  emitWorkflowChange(previousWorkflow, newWorkflow) {
    const event = /** @type {WorkflowEvent} */ ({
      type: newWorkflow ? 'workflow:start' : 'workflow:complete',
      workflowId: newWorkflow || previousWorkflow || '',
      data: {
        previousWorkflow,
        newWorkflow
      }
    });

    this.dispatchEvent(event);
  }

  /**
   * Dispatch custom workflow event
   */
  dispatchEvent(event) {
    const customEvent = new CustomEvent('workflowChange', {
      detail: event
    });
    document.dispatchEvent(customEvent);
  }

  /**
   * Get current workflow
   */
  getCurrentWorkflow() {
    return this.currentWorkflow;
  }

  /**
   * Get workflow by ID
   */
  getWorkflow(id) {
    return this.workflows.get(id);
  }

  /**
   * Get all available workflows
   */
  getAllWorkflows() {
    return Array.from(this.workflows.values());
  }

  /**
   * Register a new workflow
   */
  registerWorkflow(workflow) {
    this.workflows.set(workflow.id, workflow);
  }

  /**
   * Check if a workflow exists
   */
  hasWorkflow(id) {
    return this.workflows.has(id);
  }

  /**
   * Cleanup event listeners
   */
  destroy() {
    this.eventListeners.forEach(({ target, event, handler }) => {
      target.removeEventListener(event, handler as EventListener);
    });
    this.eventListeners.clear();
    this.workflows.clear();
  }
}

// Export singleton instance
export const workflowDetection = new WorkflowDetectionService();

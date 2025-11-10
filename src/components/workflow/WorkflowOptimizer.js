/**
 * Refactored Workflow Optimizer
 * Now acts as a coordinator for focused, single-responsibility components
 */

import { WorkflowDetectionService } from './WorkflowDetectionService.js';
import { ChartCreationWorkflow } from './ChartCreationWorkflow.js';
import { WorkflowProgressTracker } from './WorkflowProgressTracker.js';
import { WorkflowUIManager } from './WorkflowUIManager.js';
import { Workflow, WorkflowState, WorkflowEvent } from './types.js';

/**
 * Main Workflow Optimizer - Coordinates all workflow components
 * Reduced from 1,822 lines to ~200 lines with clear separation of concerns
 */
export class WorkflowOptimizer {
  private detectionService: WorkflowDetectionService;
  private chartCreationWorkflow: ChartCreationWorkflow;
  private progressTracker: WorkflowProgressTracker;
  private uiManager: WorkflowUIManager;
  private currentWorkflow: ChartCreationWorkflow | null = null;

  constructor() {
    this.initializeServices();
    this.setupEventHandlers();
  }

  /**
   * Initialize all workflow services
   */
  private initializeServices(): void {
    this.detectionService = new WorkflowDetectionService();
    this.chartCreationWorkflow = new ChartCreationWorkflow();
    this.progressTracker = new WorkflowProgressTracker();
    this.uiManager = new WorkflowUIManager();

    // Initialize services
    this.detectionService.init();
  }

  /**
   * Setup event handlers for workflow coordination
   */
  private setupEventHandlers(): void {
    // Listen for workflow changes
    document.addEventListener('workflowChange', (e: CustomEvent) => {
      this.handleWorkflowChange(e.detail);
    });

    // Listen for navigation events
    document.addEventListener('workflowNavigation', (e: CustomEvent) => {
      this.handleNavigation(e.detail);
    });

    // Listen for step completion
    document.addEventListener('stepComplete', (e: CustomEvent) => {
      this.handleStepComplete(e.detail);
    });
  }

  /**
   * Handle workflow change events
   */
  private handleWorkflowChange(event: WorkflowEvent): void {
    const { workflowId } = event;

    if (workflowId === 'chart-creation') {
      this.startChartCreationWorkflow();
    } else {
      this.stopCurrentWorkflow();
    }
  }

  /**
   * Start chart creation workflow
   */
  private startChartCreationWorkflow(): void {
    this.currentWorkflow = this.chartCreationWorkflow;
    
    const workflow = this.currentWorkflow.getWorkflow();
    const state = this.currentWorkflow.getState();

    // Update UI
    this.uiManager.updateWorkflowUI(workflow, state);

    // Start tracking first step
    const currentStep = this.currentWorkflow.getCurrentStep();
    if (currentStep) {
      this.progressTracker.startStep(workflow.id, currentStep.id);
    }

    // Emit workflow start event
    this.emitWorkflowEvent('workflow:start', workflow.id);
  }

  /**
   * Stop current workflow
   */
  private stopCurrentWorkflow(): void {
    if (this.currentWorkflow) {
      const workflow = this.currentWorkflow.getWorkflow();
      
      // Complete current step if active
      const currentStep = this.currentWorkflow.getCurrentStep();
      if (currentStep) {
        this.progressTracker.completeStep(workflow.id, currentStep.id);
      }

      this.currentWorkflow = null;
      this.emitWorkflowEvent('workflow:complete', workflow.id);
    }
  }

  /**
   * Handle navigation events
   */
  private handleNavigation(detail: { action: string; data?: any }): void {
    if (!this.currentWorkflow) return;

    const { action, data } = detail;
    const workflow = this.currentWorkflow.getWorkflow();
    const state = this.currentWorkflow.getState();

    switch (action) {
      case 'next':
        this.moveToNextStep();
        break;
      case 'previous':
        this.moveToPreviousStep();
        break;
      case 'goto':
        this.goToStep(data);
        break;
      case 'skip':
        this.skipCurrentStep();
        break;
    }

    // Update UI after navigation
    const newState = this.currentWorkflow.getState();
    this.uiManager.updateWorkflowUI(workflow, newState);
  }

  /**
   * Move to next step
   */
  private moveToNextStep(): void {
    if (!this.currentWorkflow) return;

    const workflow = this.currentWorkflow.getWorkflow();
    const currentStep = this.currentWorkflow.getCurrentStep();

    if (currentStep) {
      // Complete current step
      this.progressTracker.completeStep(workflow.id, currentStep.id);
    }

    // Move to next step
    if (this.currentWorkflow.nextStep()) {
      const newStep = this.currentWorkflow.getCurrentStep();
      if (newStep) {
        this.progressTracker.startStep(workflow.id, newStep.id);
        this.emitWorkflowEvent('step:start', workflow.id, newStep.id);
      }
    }
  }

  /**
   * Move to previous step
   */
  private moveToPreviousStep(): void {
    if (!this.currentWorkflow) return;

    const workflow = this.currentWorkflow.getWorkflow();
    const currentStep = this.currentWorkflow.getCurrentStep();

    if (currentStep) {
      // Record going back
      this.progressTracker.skipStep(workflow.id, currentStep.id);
    }

    if (this.currentWorkflow.previousStep()) {
      const newStep = this.currentWorkflow.getCurrentStep();
      if (newStep) {
        this.progressTracker.startStep(workflow.id, newStep.id);
        this.emitWorkflowEvent('step:start', workflow.id, newStep.id);
      }
    }
  }

  /**
   * Go to specific step
   */
  private goToStep(stepIndex: number): void {
    if (!this.currentWorkflow) return;

    const workflow = this.currentWorkflow.getWorkflow();
    const currentStep = this.currentWorkflow.getCurrentStep();

    if (currentStep) {
      this.progressTracker.skipStep(workflow.id, currentStep.id);
    }

    // Set current step
    this.currentWorkflow.reset();
    for (let i = 0; i < stepIndex; i++) {
      this.currentWorkflow.nextStep();
    }

    const newStep = this.currentWorkflow.getCurrentStep();
    if (newStep) {
      this.progressTracker.startStep(workflow.id, newStep.id);
      this.emitWorkflowEvent('step:start', workflow.id, newStep.id);
    }
  }

  /**
   * Skip current step
   */
  private skipCurrentStep(): void {
    if (!this.currentWorkflow) return;

    const workflow = this.currentWorkflow.getWorkflow();
    const currentStep = this.currentWorkflow.getCurrentStep();

    if (currentStep) {
      this.progressTracker.skipStep(workflow.id, currentStep.id);
      this.emitWorkflowEvent('step:skip', workflow.id, currentStep.id);
    }

    if (this.currentWorkflow.skipStep()) {
      const newStep = this.currentWorkflow.getCurrentStep();
      if (newStep) {
        this.progressTracker.startStep(workflow.id, newStep.id);
        this.emitWorkflowEvent('step:start', workflow.id, newStep.id);
      }
    }
  }

  /**
   * Handle step completion
   */
  private handleStepComplete(detail: { stepId: string; data?: any }): void {
    if (!this.currentWorkflow) return;

    const workflow = this.currentWorkflow.getWorkflow();
    const currentStep = this.currentWorkflow.getCurrentStep();

    if (currentStep && currentStep.id === detail.stepId) {
      this.progressTracker.completeStep(workflow.id, currentStep.id);
      this.emitWorkflowEvent('step:complete', workflow.id, currentStep.id, detail.data);
    }
  }

  /**
   * Show help for current step
   */
  showStepHelp(): void {
    if (!this.currentWorkflow) return;

    const currentStep = this.currentWorkflow.getCurrentStep();
    if (currentStep) {
      this.uiManager.showStepHelp(currentStep);
    }
  }

  /**
   * Get workflow metrics
   */
  getMetrics(): any {
    if (!this.currentWorkflow) return null;

    const workflow = this.currentWorkflow.getWorkflow();
    return this.progressTracker.getMetrics(workflow.id);
  }

  /**
   * Get workflow progress
   */
  getProgress(): number {
    if (!this.currentWorkflow) return 0;

    const workflow = this.currentWorkflow.getWorkflow();
    return this.progressTracker.getProgress(workflow.id, workflow.steps.length);
  }

  /**
   * Reset current workflow
   */
  resetWorkflow(): void {
    if (!this.currentWorkflow) return;

    const workflow = this.currentWorkflow.getWorkflow();
    this.progressTracker.resetProgress(workflow.id);
    this.currentWorkflow.reset();

    // Restart workflow
    this.startChartCreationWorkflow();
  }

  /**
   * Emit workflow events
   */
  private emitWorkflowEvent(
    type: string, 
    workflowId: string, 
    stepId?: string, 
    data?: any
  ): void {
    const event: WorkflowEvent = {
      type: type as any,
      workflowId,
      stepId,
      data
    };

    const customEvent = new CustomEvent('workflowEvent', {
      detail: event
    });
    document.dispatchEvent(customEvent);
  }

  /**
   * Export workflow data
   */
  exportData(): any {
    return {
      progress: this.progressTracker.exportData(),
      currentWorkflow: this.currentWorkflow?.getState(),
      metrics: this.getMetrics()
    };
  }

  /**
   * Import workflow data
   */
  importData(data: any): void {
    if (data.progress) {
      this.progressTracker.importData(data.progress);
    }

    if (data.currentWorkflow) {
      // Restore workflow state
      // Implementation depends on specific requirements
    }
  }

  /**
   * Cleanup all services
   */
  destroy(): void {
    this.stopCurrentWorkflow();
    this.detectionService.destroy();
    this.uiManager.destroy();
    this.progressTracker.cleanup();
  }
}

// Export singleton instance
export const workflowOptimizer = new WorkflowOptimizer();

// Make available globally for backward compatibility
window.workflowOptimizer = workflowOptimizer;

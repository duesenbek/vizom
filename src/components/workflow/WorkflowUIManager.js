/**
 * Workflow UI Manager
 * Manages UI updates and user interactions for workflow system
 */

import { Workflow, WorkflowStep, WorkflowState } from './types.js';
import { workflowProgress } from './WorkflowProgressTracker.js';

export class WorkflowUIManager {
  private currentUI: HTMLElement | null = null;
  private progressIndicator: HTMLElement | null = null;
  private stepNavigation: HTMLElement | null = null;
  private helpPanel: HTMLElement | null = null;

  constructor() {
    this.setupUIComponents();
  }

  /**
   * Initialize UI components
   */
  private setupUIComponents(): void {
    this.createProgressIndicator();
    this.createStepNavigation();
    this.createHelpPanel();
  }

  /**
   * Create progress indicator
   */
  private createProgressIndicator(): void {
    const progressHTML = `
      <div class="workflow-progress" id="workflow-progress">
        <div class="progress-header">
          <h3 class="progress-title">Chart Creation Progress</h3>
          <span class="progress-percentage" id="progress-percentage">0%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" id="progress-fill" style="width: 0%"></div>
        </div>
        <div class="progress-steps" id="progress-steps">
          <!-- Steps will be populated dynamically -->
        </div>
      </div>
    `;

    // Insert into page
    const container = document.querySelector('.generator-layout') || document.body;
    container.insertAdjacentHTML('afterbegin', progressHTML);
    
    this.progressIndicator = document.getElementById('workflow-progress');
    this.setupProgressStyles();
  }

  /**
   * Create step navigation
   */
  private createStepNavigation(): void {
    const navigationHTML = `
      <div class="workflow-navigation" id="workflow-navigation">
        <div class="nav-header">
          <h4>Quick Navigation</h4>
          <button class="nav-toggle" id="nav-toggle">
            <i class="fas fa-chevron-up"></i>
          </button>
        </div>
        <div class="nav-content" id="nav-content">
          <div class="nav-steps" id="nav-steps">
            <!-- Steps will be populated dynamically -->
          </div>
          <div class="nav-actions">
            <button class="nav-btn secondary" id="prev-step-btn" disabled>
              <i class="fas fa-arrow-left"></i>
              Previous
            </button>
            <button class="nav-btn primary" id="next-step-btn">
              Next
              <i class="fas fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
    `;

    const sidebar = document.querySelector('.left-sidebar') || document.body;
    sidebar.insertAdjacentHTML('beforeend', navigationHTML);
    
    this.stepNavigation = document.getElementById('workflow-navigation');
    this.setupNavigationEvents();
  }

  /**
   * Create help panel
   */
  private createHelpPanel(): void {
    const helpHTML = `
      <div class="workflow-help" id="workflow-help" style="display: none;">
        <div class="help-header">
          <h4>Step Help</h4>
          <button class="help-close" id="help-close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="help-content" id="help-content">
          <div class="help-tips" id="help-tips">
            <!-- Tips will be populated dynamically -->
          </div>
          <div class="help-solution" id="help-solution">
            <!-- Solution will be populated dynamically -->
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', helpHTML);
    this.helpPanel = document.getElementById('workflow-help');
    this.setupHelpEvents();
  }

  /**
   * Setup progress styles
   */
  private setupProgressStyles(): void {
    if (document.getElementById('workflow-ui-styles')) return;

    const styles = document.createElement('style');
    styles.id = 'workflow-ui-styles';
    styles.textContent = `
      .workflow-progress {
        background: white;
        border-radius: 12px;
        padding: 20px;
        margin-bottom: 20px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        border: 1px solid #e5e7eb;
      }

      .progress-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
      }

      .progress-title {
        font-size: 16px;
        font-weight: 600;
        color: #1f2937;
        margin: 0;
      }

      .progress-percentage {
        font-size: 14px;
        font-weight: 500;
        color: #3b82f6;
      }

      .progress-bar {
        height: 8px;
        background: #e5e7eb;
        border-radius: 4px;
        overflow: hidden;
        margin-bottom: 16px;
      }

      .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #3b82f6, #8b5cf6);
        border-radius: 4px;
        transition: width 0.3s ease;
      }

      .progress-steps {
        display: flex;
        justify-content: space-between;
        position: relative;
      }

      .progress-step {
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
        z-index: 1;
      }

      .progress-step-marker {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: #e5e7eb;
        color: #6b7280;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: 600;
        margin-bottom: 8px;
        transition: all 0.2s ease;
      }

      .progress-step.completed .progress-step-marker {
        background: #10b981;
        color: white;
      }

      .progress-step.current .progress-step-marker {
        background: #3b82f6;
        color: white;
        box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2);
      }

      .progress-step-label {
        font-size: 11px;
        color: #6b7280;
        text-align: center;
        max-width: 80px;
      }

      .workflow-navigation {
        background: white;
        border-radius: 12px;
        padding: 16px;
        margin-bottom: 20px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        border: 1px solid #e5e7eb;
      }

      .nav-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
        padding-bottom: 12px;
        border-bottom: 1px solid #e5e7eb;
      }

      .nav-header h4 {
        font-size: 14px;
        font-weight: 600;
        color: #1f2937;
        margin: 0;
      }

      .nav-toggle {
        background: none;
        border: none;
        color: #6b7280;
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        transition: all 0.2s ease;
      }

      .nav-toggle:hover {
        background: #f3f4f6;
        color: #374151;
      }

      .nav-steps {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-bottom: 16px;
      }

      .nav-step {
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 12px;
        color: #6b7280;
        cursor: pointer;
        transition: all 0.2s ease;
        border: 1px solid transparent;
      }

      .nav-step:hover {
        background: #f9fafb;
        border-color: #e5e7eb;
      }

      .nav-step.completed {
        color: #10b981;
        background: #ecfdf5;
      }

      .nav-step.current {
        color: #3b82f6;
        background: #eff6ff;
        border-color: #3b82f6;
      }

      .nav-actions {
        display: flex;
        gap: 8px;
      }

      .nav-btn {
        flex: 1;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 500;
        border: none;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
      }

      .nav-btn.primary {
        background: #3b82f6;
        color: white;
      }

      .nav-btn.primary:hover:not(:disabled) {
        background: #2563eb;
      }

      .nav-btn.secondary {
        background: #f3f4f6;
        color: #6b7280;
        border: 1px solid #d1d5db;
      }

      .nav-btn.secondary:hover:not(:disabled) {
        background: #e5e7eb;
        color: #374151;
      }

      .nav-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .workflow-help {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        border-radius: 12px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        min-width: 300px;
        max-width: 400px;
      }

      .help-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 20px;
        border-bottom: 1px solid #e5e7eb;
      }

      .help-header h4 {
        font-size: 16px;
        font-weight: 600;
        color: #1f2937;
        margin: 0;
      }

      .help-close {
        background: none;
        border: none;
        color: #6b7280;
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        transition: all 0.2s ease;
      }

      .help-close:hover {
        background: #f3f4f6;
        color: #374151;
      }

      .help-content {
        padding: 20px;
      }

      .help-tips {
        margin-bottom: 16px;
      }

      .help-tips h5 {
        font-size: 14px;
        font-weight: 600;
        color: #1f2937;
        margin-bottom: 8px;
      }

      .help-tip {
        font-size: 12px;
        color: #6b7280;
        margin-bottom: 4px;
        padding-left: 16px;
        position: relative;
      }

      .help-tip::before {
        content: '•';
        position: absolute;
        left: 8px;
        color: #3b82f6;
      }

      .help-solution {
        padding: 12px;
        background: #eff6ff;
        border-radius: 6px;
        border: 1px solid #dbeafe;
      }

      .help-solution h5 {
        font-size: 12px;
        font-weight: 600;
        color: #1e40af;
        margin-bottom: 4px;
      }

      .help-solution p {
        font-size: 11px;
        color: #3730a3;
        margin: 0;
      }
    `;

    document.head.appendChild(styles);
  }

  /**
   * Setup navigation events
   */
  private setupNavigationEvents(): void {
    const prevBtn = document.getElementById('prev-step-btn');
    const nextBtn = document.getElementById('next-step-btn');
    const toggleBtn = document.getElementById('nav-toggle');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        this.emitNavigationEvent('previous');
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        this.emitNavigationEvent('next');
      });
    }

    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        this.toggleNavigation();
      });
    }
  }

  /**
   * Setup help events
   */
  private setupHelpEvents(): void {
    const closeBtn = document.getElementById('help-close');
    
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.hideHelp();
      });
    }

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (this.helpPanel && !this.helpPanel.contains(e.target as Node)) {
        this.hideHelp();
      }
    });
  }

  /**
   * Update UI for current workflow
   */
  updateWorkflowUI(workflow: Workflow, currentState: WorkflowState): void {
    this.updateProgressIndicator(workflow, currentState);
    this.updateStepNavigation(workflow, currentState);
  }

  /**
   * Update progress indicator
   */
  private updateProgressIndicator(workflow: Workflow, currentState: WorkflowState): void {
    if (!this.progressIndicator) return;

    const progress = workflowProgress.getProgress(workflow.id, workflow.steps.length);
    const currentStep = workflow.steps[currentState.currentStep];

    // Update percentage
    const percentageEl = document.getElementById('progress-percentage');
    if (percentageEl) {
      percentageEl.textContent = `${Math.round(progress)}%`;
    }

    // Update progress bar
    const progressFill = document.getElementById('progress-fill');
    if (progressFill) {
      progressFill.style.width = `${progress}%`;
    }

    // Update steps
    const stepsContainer = document.getElementById('progress-steps');
    if (stepsContainer) {
      stepsContainer.innerHTML = workflow.steps.map((step, index) => {
        const status = this.getStepStatus(index, currentState.currentStep);
        return `
          <div class="progress-step ${status}">
            <div class="progress-step-marker">${this.getStepMarker(status, index + 1)}</div>
            <div class="progress-step-label">${step.name}</div>
          </div>
        `;
      }).join('');
    }
  }

  /**
   * Update step navigation
   */
  private updateStepNavigation(workflow: Workflow, currentState: WorkflowState): void {
    if (!this.stepNavigation) return;

    // Update step list
    const navSteps = document.getElementById('nav-steps');
    if (navSteps) {
      navSteps.innerHTML = workflow.steps.map((step, index) => {
        const status = this.getStepStatus(index, currentState.currentStep);
        return `
          <div class="nav-step ${status}" data-step="${index}">
            ${step.name}
          </div>
        `;
      }).join('');

      // Add click handlers
      navSteps.querySelectorAll('.nav-step').forEach((stepEl, index) => {
        stepEl.addEventListener('click', () => {
          this.emitNavigationEvent('goto', index);
        });
      });
    }

    // Update button states
    const prevBtn = document.getElementById('prev-step-btn');
    const nextBtn = document.getElementById('next-step-btn');

    if (prevBtn) {
      prevBtn.disabled = currentState.currentStep === 0;
    }

    if (nextBtn) {
      nextBtn.disabled = currentState.currentStep === workflow.steps.length - 1;
    }
  }

  /**
   * Show help for current step
   */
  showStepHelp(step: WorkflowStep): void {
    if (!this.helpPanel) return;

    const tipsContainer = document.getElementById('help-tips');
    const solutionContainer = document.getElementById('help-solution');

    if (tipsContainer) {
      tipsContainer.innerHTML = `
        <h5>Tips for this step:</h5>
        ${step.tips.map(tip => `<div class="help-tip">${tip}</div>`).join('')}
      `;
    }

    if (solutionContainer && step.painPoint && step.solution) {
      solutionContainer.innerHTML = `
        <h5>Solution for: ${step.painPoint}</h5>
        <p>${step.solution}</p>
      `;
      solutionContainer.style.display = 'block';
    } else if (solutionContainer) {
      solutionContainer.style.display = 'none';
    }

    this.helpPanel.style.display = 'block';
  }

  /**
   * Hide help panel
   */
  hideHelp(): void {
    if (this.helpPanel) {
      this.helpPanel.style.display = 'none';
    }
  }

  /**
   * Toggle navigation panel
   */
  private toggleNavigation(): void {
    const content = document.getElementById('nav-content');
    const toggle = document.getElementById('nav-toggle');

    if (content && toggle) {
      const isCollapsed = content.style.display === 'none';
      content.style.display = isCollapsed ? 'block' : 'none';
      
      const icon = toggle.querySelector('i');
      if (icon) {
        icon.className = isCollapsed ? 'fas fa-chevron-up' : 'fas fa-chevron-down';
      }
    }
  }

  /**
   * Get step status
   */
  private getStepStatus(stepIndex: number, currentStep: number): string {
    if (stepIndex < currentStep) return 'completed';
    if (stepIndex === currentStep) return 'current';
    return 'pending';
  }

  /**
   * Get step marker
   */
  private getStepMarker(status: string, stepNumber: number): string {
    switch (status) {
      case 'completed': return '✓';
      case 'current': return stepNumber.toString();
      default: return stepNumber.toString();
    }
  }

  /**
   * Emit navigation event
   */
  private emitNavigationEvent(action: string, data?: any): void {
    const event = new CustomEvent('workflowNavigation', {
      detail: { action, data }
    });
    document.dispatchEvent(event);
  }

  /**
   * Cleanup UI elements
   */
  destroy(): void {
    // Remove DOM elements
    this.progressIndicator?.remove();
    this.stepNavigation?.remove();
    this.helpPanel?.remove();

    // Remove styles
    const styles = document.getElementById('workflow-ui-styles');
    styles?.remove();

    // Clear references
    this.progressIndicator = null;
    this.stepNavigation = null;
    this.helpPanel = null;
  }
}

// Export singleton instance
export const workflowUI = new WorkflowUIManager();

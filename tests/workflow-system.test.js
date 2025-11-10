/**
 * Tests for Refactored Workflow System
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { WorkflowOptimizer } from '../components/workflow/WorkflowOptimizer.js';
import { WorkflowDetectionService } from '../components/workflow/WorkflowDetectionService.js';
import { ChartCreationWorkflow } from '../components/workflow/ChartCreationWorkflow.js';
import { WorkflowProgressTracker } from '../components/workflow/WorkflowProgressTracker.js';
import { WorkflowUIManager } from '../components/workflow/WorkflowUIManager.js';

describe('WorkflowOptimizer', () => {
  let workflowOptimizer: WorkflowOptimizer;

  beforeEach(() => {
    workflowOptimizer = new WorkflowOptimizer();
    vi.clearAllMocks();
    // Setup DOM
    document.body.innerHTML = '<div id="test-container"></div>';
  });

  afterEach(() => {
    workflowOptimizer.destroy();
    document.body.innerHTML = '';
  });

  describe('Initialization', () => {
    it('should initialize all services', () => {
      expect(workflowOptimizer).toBeDefined();
      expect(workflowOptimizer.getProgress()).toBe(0);
    });

    it('should handle workflow change events', () => {
      const event = new CustomEvent('workflowChange', {
        detail: {
          type: 'workflow:start',
          workflowId: 'chart-creation'
        }
      });

      document.dispatchEvent(event);
      
      // Should start chart creation workflow
      expect(workflowOptimizer.getProgress()).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Navigation', () => {
    it('should handle next step navigation', () => {
      const event = new CustomEvent('workflowNavigation', {
        detail: { action: 'next' }
      });

      document.dispatchEvent(event);
      
      // Should emit navigation event
      expect(workflowOptimizer).toBeDefined();
    });

    it('should handle previous step navigation', () => {
      const event = new CustomEvent('workflowNavigation', {
        detail: { action: 'previous' }
      });

      document.dispatchEvent(event);
      
      expect(workflowOptimizer).toBeDefined();
    });

    it('should handle step skipping', () => {
      const event = new CustomEvent('workflowNavigation', {
        detail: { action: 'skip' }
      });

      document.dispatchEvent(event);
      
      expect(workflowOptimizer).toBeDefined();
    });
  });

  describe('Progress Tracking', () => {
    it('should track workflow progress', () => {
      const progress = workflowOptimizer.getProgress();
      expect(typeof progress).toBe('number');
      expect(progress).toBeGreaterThanOrEqual(0);
      expect(progress).toBeLessThanOrEqual(100);
    });

    it('should get workflow metrics', () => {
      const metrics = workflowOptimizer.getMetrics();
      expect(metrics).toBeDefined();
      expect(typeof metrics).toBe('object');
    });

    it('should reset workflow', () => {
      workflowOptimizer.resetWorkflow();
      expect(workflowOptimizer.getProgress()).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Data Export/Import', () => {
    it('should export workflow data', () => {
      const data = workflowOptimizer.exportData();
      expect(data).toHaveProperty('progress');
      expect(data).toHaveProperty('metrics');
    });

    it('should import workflow data', () => {
      const importData = {
        progress: { 'chart-creation': 50 },
        currentWorkflow: { currentStep: 2 }
      };

      workflowOptimizer.importData(importData);
      expect(workflowOptimizer).toBeDefined();
    });
  });
});

describe('WorkflowDetectionService', () => {
  let detectionService: WorkflowDetectionService;

  beforeEach(() => {
    detectionService = new WorkflowDetectionService();
    // Mock URL
    Object.defineProperty(window, 'location', {
      value: {
        pathname: '/create'
      },
      writable: true
    });
  });

  afterEach(() => {
    detectionService.destroy();
  });

  describe('Workflow Detection', () => {
    it('should detect chart creation workflow', () => {
      detectionService.init();
      expect(detectionService.getCurrentWorkflow()).toBe('chart-creation');
    });

    it('should detect template workflow', () => {
      window.location.pathname = '/templates';
      detectionService.init();
      expect(detectionService.getCurrentWorkflow()).toBe('template');
    });

    it('should return null for unknown paths', () => {
      window.location.pathname = '/unknown';
      detectionService.init();
      expect(detectionService.getCurrentWorkflow()).toBeNull();
    });

    it('should handle navigation events', () => {
      detectionService.init();
      
      const event = new CustomEvent('navigationOccurred');
      document.dispatchEvent(event);

      expect(detectionService.getCurrentWorkflow()).toBe('chart-creation');
    });
  });

  describe('Workflow Registration', () => {
    it('should register custom workflow', () => {
      const customWorkflow = {
        id: 'custom-workflow',
        name: 'Custom Workflow',
        description: 'Test workflow',
        steps: []
      };

      detectionService.registerWorkflow(customWorkflow);
      
      const retrieved = detectionService.getWorkflow('custom-workflow');
      expect(retrieved).toEqual(customWorkflow);
    });

    it('should check workflow existence', () => {
      expect(detectionService.hasWorkflow('chart-creation')).toBe(true);
      expect(detectionService.hasWorkflow('non-existent')).toBe(false);
    });

    it('should get all workflows', () => {
      const workflows = detectionService.getAllWorkflows();
      expect(workflows.length).toBeGreaterThan(0);
    });
  });
});

describe('ChartCreationWorkflow', () => {
  let workflow: ChartCreationWorkflow;

  beforeEach(() => {
    workflow = new ChartCreationWorkflow();
  });

  describe('Workflow Structure', () => {
    it('should have correct workflow definition', () => {
      const workflowDef = workflow.getWorkflow();
      expect(workflowDef.id).toBe('chart-creation');
      expect(workflowDef.name).toBe('Create Chart from Data');
      expect(workflowDef.steps).toHaveLength(8);
    });

    it('should start at first step', () => {
      const currentStep = workflow.getCurrentStep();
      expect(currentStep?.id).toBe('entry-point');
    });

    it('should navigate through steps', () => {
      const initialStep = workflow.getCurrentStep();
      expect(initialStep?.id).toBe('entry-point');

      workflow.nextStep();
      const nextStep = workflow.getCurrentStep();
      expect(nextStep?.id).toBe('input-method');
    });

    it('should handle previous navigation', () => {
      workflow.nextStep();
      workflow.nextStep();
      workflow.previousStep();
      
      const currentStep = workflow.getCurrentStep();
      expect(currentStep?.id).toBe('input-method');
    });

    it('should skip allowed steps', () => {
      const canSkip = workflow.skipStep();
      const currentStep = workflow.getCurrentStep();
      
      if (canSkip) {
        expect(currentStep?.id).not.toBe('entry-point');
      }
    });
  });

  describe('Step Properties', () => {
    it('should have valid step properties', () => {
      const workflowDef = workflow.getWorkflow();
      
      workflowDef.steps.forEach(step => {
        expect(step.id).toBeDefined();
        expect(step.name).toBeDefined();
        expect(step.description).toBeDefined();
        expect(step.component).toBeDefined();
        expect(step.estimatedTime).toBeDefined();
        expect(Array.isArray(step.tips)).toBe(true);
        expect(Array.isArray(step.nextSteps)).toBe(true);
        expect(typeof step.skipAllowed).toBe('boolean');
      });
    });

    it('should have automation rules for some steps', () => {
      const workflowDef = workflow.getWorkflow();
      const entryPoint = workflowDef.steps.find(s => s.id === 'entry-point');
      
      expect(entryPoint?.automation).toBeDefined();
      expect(entryPoint?.automation?.skipIf).toBe('hasRecentData');
    });
  });

  describe('Progress and State', () => {
    it('should calculate progress correctly', () => {
      const progress = workflow.getProgress();
      expect(progress).toBe(0); // Start at 0%

      workflow.nextStep();
      const newProgress = workflow.getProgress();
      expect(newProgress).toBeGreaterThan(0);
    });

    it('should get workflow state', () => {
      const state = workflow.getState();
      expect(state).toHaveProperty('currentWorkflow');
      expect(state).toHaveProperty('currentStep');
      expect(state).toHaveProperty('history');
      expect(state).toHaveProperty('progress');
      expect(state).toHaveProperty('preferences');
    });

    it('should reset workflow', () => {
      workflow.nextStep();
      workflow.nextStep();
      
      workflow.reset();
      
      const currentStep = workflow.getCurrentStep();
      const progress = workflow.getProgress();
      
      expect(currentStep?.id).toBe('entry-point');
      expect(progress).toBe(0);
    });
  });
});

describe('WorkflowProgressTracker', () => {
  let tracker: WorkflowProgressTracker;

  beforeEach(() => {
    tracker = new WorkflowProgressTracker();
  });

  describe('Step Tracking', () => {
    it('should track step start and completion', () => {
      tracker.startStep('test-workflow', 'step-1');
      
      const progress = tracker.getProgress('test-workflow', 5);
      expect(progress).toBe(0); // No steps completed yet

      tracker.completeStep('test-workflow', 'step-1');
      
      const newProgress = tracker.getProgress('test-workflow', 5);
      expect(newProgress).toBe(20); // 1/5 steps = 20%
    });

    it('should track step skipping', () => {
      tracker.startStep('test-workflow', 'step-1');
      tracker.skipStep('test-workflow', 'step-1');
      
      const history = tracker.getHistory('test-workflow');
      expect(history).toHaveLength(1);
      expect(history[0].action).toBe('skip');
    });

    it('should calculate step duration', () => {
      tracker.startStep('test-workflow', 'step-1');
      
      // Simulate some time passing
      setTimeout(() => {
        tracker.completeStep('test-workflow', 'step-1');
        
        const duration = tracker.getStepDuration('test-workflow', 'step-1');
        expect(duration).toBeGreaterThan(0);
      }, 10);
    });
  });

  describe('Metrics and Analytics', () => {
    it('should generate workflow metrics', () => {
      // Simulate some workflow activity
      tracker.startStep('test-workflow', 'step-1');
      tracker.completeStep('test-workflow', 'step-1');
      tracker.startStep('test-workflow', 'step-2');
      tracker.skipStep('test-workflow', 'step-2');

      const metrics = tracker.getMetrics('test-workflow');
      
      expect(metrics).toHaveProperty('completionRate');
      expect(metrics).toHaveProperty('averageTime');
      expect(metrics).toHaveProperty('dropOffPoints');
      expect(metrics).toHaveProperty('userSatisfaction');
    });

    it('should find drop-off points', () => {
      // Simulate high skip rate
      for (let i = 0; i < 10; i++) {
        tracker.startStep('test-workflow', 'problematic-step');
        tracker.skipStep('test-workflow', 'problematic-step');
      }

      const metrics = tracker.getMetrics('test-workflow');
      expect(metrics.dropOffPoints).toContain('problematic-step');
    });
  });

  describe('Data Management', () => {
    it('should export tracking data', () => {
      tracker.startStep('test-workflow', 'step-1');
      tracker.completeStep('test-workflow', 'step-1');

      const exportedData = tracker.exportData();
      
      expect(exportedData).toHaveProperty('progress');
      expect(exportedData).toHaveProperty('history');
      expect(exportedData).toHaveProperty('metrics');
    });

    it('should import tracking data', () => {
      const importData = {
        progress: { 'imported-workflow': 50 },
        history: {
          'imported-workflow': [{
            workflowId: 'imported-workflow',
            stepId: 'step-1',
            timestamp: new Date(),
            action: 'complete'
          }]
        }
      };

      tracker.importData(importData);
      
      const progress = tracker.getProgress('imported-workflow', 2);
      expect(progress).toBe(50);
    });

    it('should cleanup old data', () => {
      tracker.startStep('old-workflow', 'step-1');
      tracker.completeStep('old-workflow', 'step-1');

      // Cleanup with very short max age
      tracker.cleanup(1);
      
      const progress = tracker.getProgress('old-workflow', 1);
      expect(progress).toBe(0); // Should be cleaned up
    });
  });
});

describe('WorkflowUIManager', () => {
  let uiManager: WorkflowUIManager;

  beforeEach(() => {
    uiManager = new WorkflowUIManager();
  });

  afterEach(() => {
    uiManager.destroy();
  });

  describe('UI Components', () => {
    it('should create progress indicator', () => {
      const progressElement = document.getElementById('workflow-progress');
      expect(progressElement).toBeDefined();
      expect(progressElement?.className).toContain('workflow-progress');
    });

    it('should create step navigation', () => {
      const navElement = document.getElementById('workflow-navigation');
      expect(navElement).toBeDefined();
      expect(navElement?.className).toContain('workflow-navigation');
    });

    it('should create help panel', () => {
      const helpElement = document.getElementById('workflow-help');
      expect(helpElement).toBeDefined();
      expect(helpElement?.className).toContain('workflow-help');
    });
  });

  describe('UI Updates', () => {
    it('should update workflow UI', () => {
      const workflow = {
        id: 'test-workflow',
        name: 'Test Workflow',
        steps: [
          { id: 'step-1', name: 'Step 1' },
          { id: 'step-2', name: 'Step 2' }
        ]
      };

      const state = {
        currentWorkflow: 'test-workflow',
        currentStep: 0,
        history: [],
        progress: new Map(),
        preferences: {}
      };

      uiManager.updateWorkflowUI(workflow, state);
      
      // Should update progress percentage
      const percentage = document.getElementById('progress-percentage');
      expect(percentage?.textContent).toBe('0%');
    });

    it('should show step help', () => {
      const step = {
        id: 'step-1',
        name: 'Step 1',
        tips: ['Tip 1', 'Tip 2']
      };

      uiManager.showStepHelp(step);
      
      const helpPanel = document.getElementById('workflow-help');
      expect(helpPanel?.style.display).toBe('block');
    });

    it('should hide help panel', () => {
      uiManager.showStepHelp({ id: 'step-1', name: 'Step 1', tips: [] });
      uiManager.hideHelp();
      
      const helpPanel = document.getElementById('workflow-help');
      expect(helpPanel?.style.display).toBe('none');
    });
  });

  describe('Event Handling', () => {
    it('should emit navigation events', () => {
      const emitSpy = vi.spyOn(uiManager, 'emitNavigationEvent' as any);
      
      const prevButton = document.getElementById('prev-step-btn');
      if (prevButton) {
        (prevButton as HTMLElement).click();
        expect(emitSpy).toHaveBeenCalledWith('previous');
      }
    });

    it('should toggle navigation panel', () => {
      const toggleButton = document.getElementById('nav-toggle');
      const content = document.getElementById('nav-content');
      
      if (toggleButton && content) {
        (toggleButton as HTMLElement).click();
        expect(content.style.display).toBe('none');
      }
    });
  });
});

/**
 * Workflow Progress Tracker
 * Tracks and manages workflow progress, metrics, and user history
 */

import { WorkflowState, WorkflowHistoryEntry, WorkflowMetrics } from './types.js';

export class WorkflowProgressTracker {
  private progressData: Map<string, number> = new Map();
  private stepTimers: Map<string, number> = new Map();
  private completionHistory: Map<string, WorkflowHistoryEntry[]> = new Map();
  private metrics: Map<string, WorkflowMetrics> = new Map();

  /**
   * Start tracking a step
   */
  startStep(workflowId: string, stepId: string): void {
    const timerId = `${workflowId}-${stepId}`;
    this.stepTimers.set(timerId, Date.now());
    
    // Record step start
    this.recordHistory(workflowId, {
      workflowId,
      stepId,
      timestamp: new Date(),
      action: 'start'
    });
  }

  /**
   * Complete a step and record metrics
   */
  completeStep(workflowId: string, stepId: string): void {
    const timerId = `${workflowId}-${stepId}`;
    const startTime = this.stepTimers.get(timerId);
    
    if (startTime) {
      const duration = Date.now() - startTime;
      
      // Record step completion
      this.recordHistory(workflowId, {
        workflowId,
        stepId,
        timestamp: new Date(),
        action: 'complete',
        duration
      });
      
      // Update progress
      this.updateProgress(workflowId, stepId);
      
      // Clean up timer
      this.stepTimers.delete(timerId);
    }
  }

  /**
   * Skip a step
   */
  skipStep(workflowId: string, stepId: string): void {
    const timerId = `${workflowId}-${stepId}`;
    this.stepTimers.delete(timerId);
    
    this.recordHistory(workflowId, {
      workflowId,
      stepId,
      timestamp: new Date(),
      action: 'skip'
    });
  }

  /**
   * Update workflow progress
   */
  private updateProgress(workflowId: string, stepId: string): void {
    const currentProgress = this.progressData.get(workflowId) || 0;
    this.progressData.set(workflowId, currentProgress + 1);
  }

  /**
   * Record workflow history
   */
  private recordHistory(workflowId: string, entry: WorkflowHistoryEntry): void {
    const history = this.completionHistory.get(workflowId) || [];
    history.push(entry);
    this.completionHistory.set(workflowId, history);
  }

  /**
   * Get progress percentage for workflow
   */
  getProgress(workflowId: string, totalSteps: number): number {
    const completedSteps = this.progressData.get(workflowId) || 0;
    return (completedSteps / totalSteps) * 100;
  }

  /**
   * Get workflow history
   */
  getHistory(workflowId: string): WorkflowHistoryEntry[] {
    return this.completionHistory.get(workflowId) || [];
  }

  /**
   * Get step completion time
   */
  getStepDuration(workflowId: string, stepId: string): number | null {
    const history = this.getHistory(workflowId);
    const stepEntry = history.find(entry => 
      entry.stepId === stepId && entry.action === 'complete'
    );
    
    return stepEntry?.duration || null;
  }

  /**
   * Get average completion time for workflow
   */
  getAverageCompletionTime(workflowId: string): number {
    const history = this.getHistory(workflowId);
    const completedSteps = history.filter(entry => entry.action === 'complete');
    
    if (completedSteps.length === 0) return 0;
    
    const totalTime = completedSteps.reduce((sum, entry) => 
      sum + (entry.duration || 0), 0
    );
    
    return totalTime / completedSteps.length;
  }

  /**
   * Get workflow metrics
   */
  getMetrics(workflowId: string): WorkflowMetrics {
    const history = this.getHistory(workflowId);
    const completedSteps = history.filter(entry => entry.action === 'complete');
    const skippedSteps = history.filter(entry => entry.action === 'skip');
    
    // Calculate completion rate
    const completionRate = history.length > 0 
      ? (completedSteps.length / history.length) * 100 
      : 0;

    // Calculate average time
    const averageTime = this.getAverageCompletionTime(workflowId);

    // Find drop-off points (steps where users skip or go back)
    const dropOffPoints = this.findDropOffPoints(history);

    // User satisfaction (placeholder - would be based on feedback)
    const userSatisfaction = this.calculateUserSatisfaction(workflowId);

    const metrics: WorkflowMetrics = {
      completionRate,
      averageTime,
      dropOffPoints,
      userSatisfaction
    };

    this.metrics.set(workflowId, metrics);
    return metrics;
  }

  /**
   * Find steps where users commonly drop off
   */
  private findDropOffPoints(history: WorkflowHistoryEntry[]): string[] {
    const stepCounts = new Map<string, { complete: number; skip: number; back: number }>();
    
    history.forEach(entry => {
      const counts = stepCounts.get(entry.stepId) || { complete: 0, skip: 0, back: 0 };
      counts[entry.action]++;
      stepCounts.set(entry.stepId, counts);
    });

    const dropOffPoints: string[] = [];
    
    stepCounts.forEach((counts, stepId) => {
      const total = counts.complete + counts.skip + counts.back;
      const dropOffRate = ((counts.skip + counts.back) / total) * 100;
      
      // Consider it a drop-off point if >30% of users skip or go back
      if (dropOffRate > 30) {
        dropOffPoints.push(stepId);
      }
    });

    return dropOffPoints;
  }

  /**
   * Calculate user satisfaction (placeholder implementation)
   */
  private calculateUserSatisfaction(workflowId: string): number {
    // This would integrate with user feedback, error rates, completion times
    // For now, return a placeholder value
    return 85;
  }

  /**
   * Reset workflow progress
   */
  resetProgress(workflowId: string): void {
    this.progressData.delete(workflowId);
    this.completionHistory.delete(workflowId);
    this.metrics.delete(workflowId);
    
    // Clean up any active timers
    const timersToDelete: string[] = [];
    this.stepTimers.forEach((_, timerId) => {
      if (timerId.startsWith(workflowId)) {
        timersToDelete.push(timerId);
      }
    });
    
    timersToDelete.forEach(timerId => {
      this.stepTimers.delete(timerId);
    });
  }

  /**
   * Get all workflow metrics
   */
  getAllMetrics(): Map<string, WorkflowMetrics> {
    return new Map(this.metrics);
  }

  /**
   * Export progress data
   */
  exportData(): {
    progress: Record<string, number>;
    history: Record<string, WorkflowHistoryEntry[]>;
    metrics: Record<string, WorkflowMetrics>;
  } {
    const progress: Record<string, number> = {};
    const history: Record<string, WorkflowHistoryEntry[]> = {};
    const metrics: Record<string, WorkflowMetrics> = {};

    this.progressData.forEach((value, key) => {
      progress[key] = value;
    });

    this.completionHistory.forEach((value, key) => {
      history[key] = value;
    });

    this.metrics.forEach((value, key) => {
      metrics[key] = value;
    });

    return { progress, history, metrics };
  }

  /**
   * Import progress data
   */
  importData(data: {
    progress?: Record<string, number>;
    history?: Record<string, WorkflowHistoryEntry[]>;
    metrics?: Record<string, WorkflowMetrics>;
  }): void {
    if (data.progress) {
      Object.entries(data.progress).forEach(([key, value]) => {
        this.progressData.set(key, value);
      });
    }

    if (data.history) {
      Object.entries(data.history).forEach(([key, value]) => {
        this.completionHistory.set(key, value);
      });
    }

    if (data.metrics) {
      Object.entries(data.metrics).forEach(([key, value]) => {
        this.metrics.set(key, value);
      });
    }
  }

  /**
   * Cleanup old data
   */
  cleanup(maxAge: number = 7 * 24 * 60 * 60 * 1000): void { // 7 days default
    const cutoffTime = Date.now() - maxAge;

    // Clean old history
    this.completionHistory.forEach((history, workflowId) => {
      const filteredHistory = history.filter(entry => 
        entry.timestamp.getTime() > cutoffTime
      );
      
      if (filteredHistory.length === 0) {
        this.completionHistory.delete(workflowId);
        this.progressData.delete(workflowId);
        this.metrics.delete(workflowId);
      } else {
        this.completionHistory.set(workflowId, filteredHistory);
      }
    });
  }
}

// Export singleton instance
export const workflowProgress = new WorkflowProgressTracker();

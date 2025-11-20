/**
 * User Feedback System for DeepSeek API
 * Real-time indicators, partial results, and request cancellation
 */
/**
 * Abort Controller for Request Cancellation
 */
export class AbortController {
    constructor(id) {
        this.id = id;
        this.aborted = false;
        this.abortCallbacks = [];
    }
    abort() {
        if (this.aborted)
            return;
        this.aborted = true;
        this.abortCallbacks.forEach(callback => callback());
        this.abortCallbacks = [];
    }
    get signal() {
        return {
            aborted: this.aborted,
            addEventListener: (_, listener) => {
                if (this.aborted) {
                    listener();
                }
                else {
                    this.abortCallbacks.push(listener);
                }
            },
            removeEventListener: () => { } // Simplified implementation
        };
    }
    onAbort(callback) {
        if (this.aborted) {
            callback();
        }
        else {
            this.abortCallbacks.push(callback);
        }
    }
}
/**
 * Thinking Indicator Manager
 */
export class ThinkingIndicatorManager {
    constructor() {
        this.indicators = new Map();
        this.animationFrames = new Map();
    }
    /**
     * Show thinking indicator
     */
    show(requestId, config = {}) {
        const indicator = {
            id: requestId,
            message: config.message || 'AI is thinking...',
            progress: 0,
            steps: config.steps || [
                'Analyzing your request...',
                'Processing data...',
                'Generating insights...',
                'Creating visualization...'
            ],
            currentStepIndex: 0,
            estimatedTimeRemaining: config.estimatedDuration
        };
        this.indicators.set(requestId, indicator);
        this.startAnimation(requestId);
        this.renderIndicator(indicator);
        return indicator;
    }
    /**
     * Update thinking indicator
     */
    update(requestId, updates) {
        const indicator = this.indicators.get(requestId);
        if (!indicator)
            return;
        Object.assign(indicator, updates);
        this.renderIndicator(indicator);
    }
    /**
     * Hide thinking indicator
     */
    hide(requestId) {
        this.stopAnimation(requestId);
        this.indicators.delete(requestId);
        this.removeIndicator(requestId);
    }
    /**
     * Get indicator state
     */
    getIndicator(requestId) {
        return this.indicators.get(requestId);
    }
    startAnimation(requestId) {
        const indicator = this.indicators.get(requestId);
        if (!indicator)
            return;
        const animate = () => {
            if (!this.indicators.has(requestId))
                return;
            // Update progress
            indicator.progress = Math.min(indicator.progress + 2, 95);
            // Update current step
            const stepProgress = (indicator.progress / 100) * indicator.steps.length;
            indicator.currentStepIndex = Math.min(Math.floor(stepProgress), indicator.steps.length - 1);
            // Update message
            indicator.message = indicator.steps[indicator.currentStepIndex];
            // Update estimated time
            if (indicator.estimatedTimeRemaining) {
                const elapsed = Date.now() - indicator.startTime;
                indicator.estimatedTimeRemaining = Math.max(0, indicator.estimatedTimeRemaining - elapsed);
            }
            this.renderIndicator(indicator);
            const frameId = requestAnimationFrame(animate);
            this.animationFrames.set(requestId, frameId);
        };
        // Store start time
        indicator.startTime = Date.now();
        animate();
    }
    stopAnimation(requestId) {
        const frameId = this.animationFrames.get(requestId);
        if (frameId) {
            cancelAnimationFrame(frameId);
            this.animationFrames.delete(requestId);
        }
    }
    renderIndicator(indicator) {
        let container = document.getElementById(`thinking-indicator-${indicator.id}`);
        if (!container) {
            container = this.createIndicatorContainer(indicator.id);
            document.body.appendChild(container);
        }
        const progressPercentage = indicator.progress;
        const currentStep = indicator.steps[indicator.currentStepIndex];
        const timeRemaining = indicator.estimatedTimeRemaining;
        container.innerHTML = `
      <div class="thinking-indicator-content">
        <div class="thinking-animation">
          <div class="thinking-dots">
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
          </div>
        </div>
        <div class="thinking-message">
          <p class="message-text">${currentStep}</p>
          <div class="thinking-progress">
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${progressPercentage}%"></div>
            </div>
            <span class="progress-text">${Math.round(progressPercentage)}%</span>
          </div>
          ${timeRemaining ? `
            <div class="time-remaining">
              <i class="fas fa-clock"></i>
              ${this.formatTime(timeRemaining)}
            </div>
          ` : ''}
        </div>
        <button class="cancel-btn" onclick="window.userFeedback.cancelRequest('${indicator.id}')">
          <i class="fas fa-times"></i>
          Cancel
        </button>
      </div>
    `;
    }
    createIndicatorContainer(requestId) {
        const container = document.createElement('div');
        container.id = `thinking-indicator-${requestId}`;
        container.className = 'thinking-indicator-overlay';
        // Add styles if not already added
        if (!document.getElementById('thinking-indicator-styles')) {
            this.addStyles();
        }
        return container;
    }
    removeIndicator(requestId) {
        const container = document.getElementById(`thinking-indicator-${requestId}`);
        if (container) {
            container.remove();
        }
    }
    addStyles() {
        const styles = `
      <style id="thinking-indicator-styles">
        .thinking-indicator-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          animation: fadeIn 0.3s ease;
        }

        .thinking-indicator-content {
          background: white;
          border-radius: 12px;
          padding: 24px;
          max-width: 400px;
          width: 90%;
          text-align: center;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          animation: slideUp 0.3s ease;
        }

        .thinking-animation {
          margin-bottom: 16px;
        }

        .thinking-dots {
          display: flex;
          justify-content: center;
          gap: 8px;
        }

        .dot {
          width: 12px;
          height: 12px;
          background: #6366f1;
          border-radius: 50%;
          animation: dotPulse 1.5s ease-in-out infinite;
        }

        .dot:nth-child(2) {
          animation-delay: 0.2s;
        }

        .dot:nth-child(3) {
          animation-delay: 0.4s;
        }

        .message-text {
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 16px 0;
        }

        .thinking-progress {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }

        .progress-bar {
          flex: 1;
          height: 6px;
          background: #e5e7eb;
          border-radius: 3px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #6366f1, #8b5cf6);
          border-radius: 3px;
          transition: width 0.3s ease;
        }

        .progress-text {
          font-size: 12px;
          color: #6b7280;
          font-weight: 600;
          min-width: 40px;
        }

        .time-remaining {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 16px;
        }

        .cancel-btn {
          background: #ef4444;
          color: white;
          border: none;
          border-radius: 6px;
          padding: 8px 16px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .cancel-btn:hover {
          background: #dc2626;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes dotPulse {
          0%, 60%, 100% {
            opacity: 0.3;
            transform: scale(0.8);
          }
          30% {
            opacity: 1;
            transform: scale(1);
          }
        }
      </style>
    `;
        document.head.insertAdjacentHTML('beforeend', styles);
    }
    formatTime(milliseconds) {
        const seconds = Math.ceil(milliseconds / 1000);
        if (seconds < 60) {
            return `${seconds}s remaining`;
        }
        const minutes = Math.ceil(seconds / 60);
        return `${minutes}m remaining`;
    }
}
/**
 * Partial Results Manager
 */
export class PartialResultsManager {
    constructor() {
        this.partialResults = new Map();
        this.resultCallbacks = new Map();
    }
    /**
     * Add partial result
     */
    addPartialResult(requestId, data, confidence = 0.5, isComplete = false) {
        const result = {
            id: this.generateResultId(),
            timestamp: Date.now(),
            data,
            confidence,
            isComplete
        };
        if (!this.partialResults.has(requestId)) {
            this.partialResults.set(requestId, []);
        }
        const results = this.partialResults.get(requestId);
        results.push(result);
        // Notify callback
        const callback = this.resultCallbacks.get(requestId);
        if (callback) {
            callback(result);
        }
        // Render partial result
        this.renderPartialResult(requestId, result);
    }
    /**
     * Register for partial result updates
     */
    onPartialResult(requestId, callback) {
        this.resultCallbacks.set(requestId, callback);
    }
    /**
     * Get all partial results for request
     */
    getPartialResults(requestId) {
        return this.partialResults.get(requestId) || [];
    }
    /**
     * Clear partial results for request
     */
    clearPartialResults(requestId) {
        this.partialResults.delete(requestId);
        this.resultCallbacks.delete(requestId);
        this.removePartialResultsContainer(requestId);
    }
    renderPartialResult(requestId, result) {
        let container = document.getElementById(`partial-results-${requestId}`);
        if (!container) {
            container = this.createResultsContainer(requestId);
            document.body.appendChild(container);
        }
        const resultsList = container.querySelector('.partial-results-list');
        const resultElement = document.createElement('div');
        resultElement.className = 'partial-result-item';
        resultElement.innerHTML = `
      <div class="result-header">
        <span class="result-confidence">Confidence: ${Math.round(result.confidence * 100)}%</span>
        <span class="result-time">${new Date(result.timestamp).toLocaleTimeString()}</span>
      </div>
      <div class="result-content">
        ${this.formatResultContent(result.data)}
      </div>
      ${result.isComplete ? '<div class="result-complete-badge">Complete</div>' : ''}
    `;
        resultsList.appendChild(resultElement);
        // Scroll to latest result
        resultsList.scrollTop = resultsList.scrollHeight;
    }
    createResultsContainer(requestId) {
        const container = document.createElement('div');
        container.id = `partial-results-${requestId}`;
        container.className = 'partial-results-overlay';
        container.innerHTML = `
      <div class="partial-results-content">
        <div class="results-header">
          <h3>Live Results</h3>
          <button class="close-results" onclick="window.userFeedback.closePartialResults('${requestId}')">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="partial-results-list"></div>
      </div>
    `;
        // Add styles if not already added
        if (!document.getElementById('partial-results-styles')) {
            this.addPartialResultsStyles();
        }
        return container;
    }
    removePartialResultsContainer(requestId) {
        const container = document.getElementById(`partial-results-${requestId}`);
        if (container) {
            container.remove();
        }
    }
    addPartialResultsStyles() {
        const styles = `
      <style id="partial-results-styles">
        .partial-results-overlay {
          position: fixed;
          top: 20px;
          right: 20px;
          width: 350px;
          max-height: 400px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          z-index: 9999;
          animation: slideInRight 0.3s ease;
        }

        .partial-results-content {
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .results-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          border-bottom: 1px solid #e5e7eb;
        }

        .results-header h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
        }

        .close-results {
          background: none;
          border: none;
          color: #6b7280;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          transition: background 0.2s ease;
        }

        .close-results:hover {
          background: #f3f4f6;
        }

        .partial-results-list {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          max-height: 300px;
        }

        .partial-result-item {
          background: #f9fafb;
          border-radius: 8px;
          padding: 12px;
          margin-bottom: 8px;
          border-left: 3px solid #6366f1;
          animation: fadeInUp 0.3s ease;
        }

        .result-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
          font-size: 12px;
          color: #6b7280;
        }

        .result-confidence {
          font-weight: 600;
        }

        .result-content {
          font-size: 14px;
          color: #374151;
          line-height: 1.4;
        }

        .result-complete-badge {
          display: inline-block;
          background: #10b981;
          color: white;
          font-size: 11px;
          font-weight: 600;
          padding: 2px 6px;
          border-radius: 4px;
          margin-top: 8px;
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      </style>
    `;
        document.head.insertAdjacentHTML('beforeend', styles);
    }
    formatResultContent(data) {
        if (typeof data === 'string') {
            return data;
        }
        if (data.config && data.metadata) {
            return `Generated ${data.metadata.chartType || 'chart'} with ${data.metadata.dataPoints || 0} data points`;
        }
        if (data.insights || data.recommendations) {
            const insights = data.insights?.slice(0, 2).join(', ') || '';
            return insights ? `Insights: ${insights}...` : 'Analysis complete';
        }
        return JSON.stringify(data).substring(0, 100) + '...';
    }
    generateResultId() {
        return `result-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
}
/**
 * User Feedback Service
 */
export class UserFeedbackService {
    constructor(config = {}) {
        this.requestStates = new Map();
        this.config = {
            showThinkingIndicator: true,
            showPartialResults: true,
            allowCancellation: true,
            partialResultInterval: 2000,
            maxPartialResults: 5,
            animationDuration: 300,
            ...config
        };
        this.thinkingManager = new ThinkingIndicatorManager();
        this.partialResultsManager = new PartialResultsManager();
        // Make available globally for UI interactions
        window.userFeedback = this;
    }
    /**
     * Start new request with feedback
     */
    startRequest(requestId, options = {}) {
        const state = {
            id: requestId,
            status: 'pending',
            startTime: Date.now(),
            progress: 0,
            currentStep: 'Initializing...',
            partialResults: [],
            cancelToken: new AbortController(requestId)
        };
        this.requestStates.set(requestId, state);
        // Show thinking indicator
        if (this.config.showThinkingIndicator) {
            this.thinkingManager.show(requestId, {
                message: options.message,
                steps: options.steps || this.getDefaultSteps(options.type),
                estimatedDuration: options.estimatedDuration
            });
        }
        return state.cancelToken;
    }
    /**
     * Update request progress
     */
    updateProgress(requestId, progress, step) {
        const state = this.requestStates.get(requestId);
        if (!state)
            return;
        state.progress = progress;
        if (step)
            state.currentStep = step;
        this.thinkingManager.update(requestId, {
            progress,
            currentStepIndex: Math.floor((progress / 100) * 4) // Assuming 4 steps
        });
    }
    /**
     * Add partial result
     */
    addPartialResult(requestId, data, confidence = 0.5) {
        if (!this.config.showPartialResults)
            return;
        const state = this.requestStates.get(requestId);
        if (!state)
            return;
        state.partialResults.push(data);
        // Limit partial results
        if (state.partialResults.length > this.config.maxPartialResults) {
            state.partialResults.shift();
        }
        this.partialResultsManager.addPartialResult(requestId, data, confidence);
    }
    /**
     * Complete request
     */
    completeRequest(requestId, finalResult) {
        const state = this.requestStates.get(requestId);
        if (!state)
            return;
        state.status = 'completed';
        state.endTime = Date.now();
        state.progress = 100;
        // Update thinking indicator to show completion
        this.thinkingManager.update(requestId, {
            progress: 100,
            message: 'Complete!'
        });
        // Hide indicators after delay
        setTimeout(() => {
            this.cleanupRequest(requestId);
        }, 2000);
        // Add final result if provided
        if (finalResult) {
            this.partialResultsManager.addPartialResult(requestId, finalResult, 1.0, true);
        }
    }
    /**
     * Fail request
     */
    failRequest(requestId, error) {
        const state = this.requestStates.get(requestId);
        if (!state)
            return;
        state.status = 'error';
        state.endTime = Date.now();
        state.error = error;
        // Update thinking indicator to show error
        this.thinkingManager.update(requestId, {
            message: `Error: ${error}`,
            progress: 0
        });
        // Hide indicators after delay
        setTimeout(() => {
            this.cleanupRequest(requestId);
        }, 3000);
    }
    /**
     * Cancel request
     */
    cancelRequest(requestId) {
        const state = this.requestStates.get(requestId);
        if (!state)
            return;
        state.status = 'cancelled';
        state.endTime = Date.now();
        // Abort the request
        if (state.cancelToken) {
            state.cancelToken.abort();
        }
        // Update UI
        this.thinkingManager.update(requestId, {
            message: 'Request cancelled',
            progress: 0
        });
        // Hide indicators
        setTimeout(() => {
            this.cleanupRequest(requestId);
        }, 1000);
    }
    /**
     * Get request state
     */
    getRequestState(requestId) {
        return this.requestStates.get(requestId);
    }
    /**
     * Get all active requests
     */
    getActiveRequests() {
        return Array.from(this.requestStates.values()).filter(state => state.status === 'pending' || state.status === 'thinking' || state.status === 'processing');
    }
    /**
     * Cleanup request resources
     */
    cleanupRequest(requestId) {
        this.thinkingManager.hide(requestId);
        this.partialResultsManager.clearPartialResults(requestId);
        this.requestStates.delete(requestId);
    }
    /**
     * Get default steps for request type
     */
    getDefaultSteps(type) {
        switch (type) {
            case 'chart':
                return [
                    'Analyzing your data...',
                    'Choosing the best chart type...',
                    'Generating visualization...',
                    'Applying styles and animations...'
                ];
            case 'analysis':
                return [
                    'Processing your data...',
                    'Running statistical analysis...',
                    'Identifying patterns...',
                    'Generating insights...'
                ];
            case 'export':
                return [
                    'Preparing export...',
                    'Optimizing file format...',
                    'Applying compression...',
                    'Finalizing export...'
                ];
            default:
                return [
                    'Processing request...',
                    'Analyzing requirements...',
                    'Generating response...',
                    'Finalizing results...'
                ];
        }
    }
    /**
     * Close partial results panel
     */
    closePartialResults(requestId) {
        this.partialResultsManager.clearPartialResults(requestId);
    }
    /**
     * Update configuration
     */
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
    }
    /**
     * Get current configuration
     */
    getConfig() {
        return { ...this.config };
    }
}
// Export singleton instance
export const userFeedback = new UserFeedbackService();

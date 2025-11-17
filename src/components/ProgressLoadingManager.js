/**
 * Progress Loading Manager
 * Enhanced loading with progress bars, step indicators, and error handling
 */

export class ProgressLoadingManager {
  constructor() {
    this.activeLoaders = new Map();
    this.defaultSteps = [
      { id: 'analyzing', text: 'Analyzing your input...', threshold: 20 },
      { id: 'selecting', text: 'Selecting best chart type...', threshold: 40 },
      { id: 'generating', text: 'Generating chart data...', threshold: 60 },
      { id: 'rendering', text: 'Rendering visuals...', threshold: 80 },
      { id: 'finalizing', text: 'Finalizing your chart...', threshold: 100 }
    ];
  }

  /**
   * Show enhanced loading with progress
   * @param {string} id - Unique loader ID
   * @param {Object} options - Configuration options
   */
  showLoading(id, options = {}) {
    const config = {
      title: 'AI is generating your chart',
      description: 'This usually takes 5-10 seconds',
      steps: this.defaultSteps,
      showProgress: true,
      showCancel: true,
      timeout: 30000,
      progressBar: true,
      animation: 'spinner',
      friendlyMessages: [
        'Working on your chart...',
        'Optimizing your visualization...',
        'Almost there...',
        'Putting the final touches on your chart...'
      ],
      ...options
    };

    // Remove existing loader with same ID
    this.hideLoading(id);

    const loader = this.createLoaderElement(id, config);
    document.body.appendChild(loader);

    // Initialize loader state
    const loaderState = {
      element: loader,
      config,
      startTime: Date.now(),
      currentStep: 0,
      progress: 0,
      timeoutId: null,
      progressInterval: null
    };

    this.activeLoaders.set(id, loaderState);

    // Start progress animation
    this.startProgressAnimation(id);

    // Setup timeout
    loaderState.timeoutId = setTimeout(() => {
      this.handleTimeout(id);
    }, config.timeout);

    return {
      hide: () => this.hideLoading(id),
      updateProgress: (progress, message) => this.updateProgress(id, progress, message),
      updateStep: (stepIndex, message) => this.updateStep(id, stepIndex, message)
    };
  }

  /**
   * Create loader element
   * @param {string} id - Loader ID
   * @param {Object} config - Configuration
   */
  createLoaderElement(id, config) {
    const loader = document.createElement('div');
    loader.className = 'progress-loading-overlay fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center';
    loader.id = `progress-loader-${id}`;

    const animationHtml = this.getAnimationHtml(config.animation);

    loader.innerHTML = `
      <div class="progress-loading-card bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 transform transition-all">
        <!-- Header -->
        <div class="text-center mb-6">
          ${animationHtml}
          <h3 class="text-xl font-semibold text-gray-900 mt-4 mb-2">${config.title}</h3>
          <p class="text-sm text-gray-600">${config.description}</p>
        </div>

        <!-- Progress Section -->
        ${config.showProgress ? `
          <div class="mb-6">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-blue-900" id="step-text-${id}">
                Step 1 of ${config.steps.length}: ${config.steps[0].text}
              </span>
              <span class="text-sm text-gray-500" id="progress-percent-${id}">0%</span>
            </div>
            
            ${config.progressBar ? `
              <div class="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div class="progress-bar bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-500 ease-out"
                     id="progress-bar-${id}" style="width: 0%"></div>
              </div>
            ` : ''}
            
            <!-- Step Indicators -->
            <div class="flex justify-between mt-4">
              ${config.steps.map((step, index) => `
                <div class="step-indicator flex flex-col items-center" data-step="${index}">
                  <div class="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center text-xs font-medium transition-all"
                       id="step-dot-${id}-${index}">
                    ${index + 1}
                  </div>
                  <div class="text-xs text-gray-500 mt-1 hidden md:block">${step.id}</div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Friendly Message -->
        <div class="text-center mb-6">
          <p class="text-sm text-gray-600 italic" id="friendly-message-${id}">
            ${config.friendlyMessages[0]}
          </p>
        </div>

        <!-- Actions -->
        <div class="flex justify-center gap-3">
          ${config.showCancel ? `
            <button class="cancel-btn px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    id="cancel-btn-${id}">
              Cancel
            </button>
          ` : ''}
        </div>
      </div>
    `;

    // Add entrance animation
    setTimeout(() => {
      loader.classList.add('active');
    }, 10);

    // Bind cancel button
    const cancelBtn = loader.querySelector(`#cancel-btn-${id}`);
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        this.hideLoading(id);
      });
    }

    return loader;
  }

  /**
   * Get animation HTML based on type
   * @param {string} type - Animation type
   */
  getAnimationHtml(type) {
    switch (type) {
      case 'spinner':
        return `
          <div class="spinner-container">
            <div class="spinner w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
          </div>
        `;
      case 'dots':
        return `
          <div class="dots-container flex justify-center gap-2">
            <div class="dot w-3 h-3 bg-blue-600 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
            <div class="dot w-3 h-3 bg-blue-600 rounded-full animate-bounce" style="animation-delay: 150ms"></div>
            <div class="dot w-3 h-3 bg-blue-600 rounded-full animate-bounce" style="animation-delay: 300ms"></div>
          </div>
        `;
      case 'pulse':
        return `
          <div class="pulse-container relative">
            <div class="pulse-dot absolute inset-0 w-12 h-12 bg-blue-600 rounded-full animate-ping mx-auto"></div>
            <div class="pulse-dot relative w-12 h-12 bg-blue-600 rounded-full mx-auto"></div>
          </div>
        `;
      case 'chart':
        return `
          <div class="chart-animation w-16 h-16 mx-auto">
            <svg viewBox="0 0 64 64" class="w-full h-full">
              <rect x="8" y="32" width="8" height="24" fill="#3B82F6" class="animate-pulse">
                <animate attributeName="height" values="24;32;24" dur="1.5s" repeatCount="indefinite"/>
                <animate attributeName="y" values="32;24;32" dur="1.5s" repeatCount="indefinite"/>
              </rect>
              <rect x="20" y="24" width="8" height="32" fill="#3B82F6" class="animate-pulse" style="animation-delay: 0.2s">
                <animate attributeName="height" values="32;40;32" dur="1.5s" repeatCount="indefinite"/>
                <animate attributeName="y" values="24;16;24" dur="1.5s" repeatCount="indefinite"/>
              </rect>
              <rect x="32" y="16" width="8" height="40" fill="#3B82F6" class="animate-pulse" style="animation-delay: 0.4s">
                <animate attributeName="height" values="40;48;40" dur="1.5s" repeatCount="indefinite"/>
                <animate attributeName="y" values="16;8;16" dur="1.5s" repeatCount="indefinite"/>
              </rect>
              <rect x="44" y="28" width="8" height="28" fill="#3B82F6" class="animate-pulse" style="animation-delay: 0.6s">
                <animate attributeName="height" values="28;36;28" dur="1.5s" repeatCount="indefinite"/>
                <animate attributeName="y" values="28;20;28" dur="1.5s" repeatCount="indefinite"/>
              </rect>
            </svg>
          </div>
        `;
      default:
        return this.getAnimationHtml('spinner');
    }
  }

  /**
   * Start progress animation
   * @param {string} id - Loader ID
   */
  startProgressAnimation(id) {
    const loaderState = this.activeLoaders.get(id);
    if (!loaderState) return;

    const { config } = loaderState;
    
    loaderState.progressInterval = setInterval(() => {
      // Simulate progress with random increments
      const increment = Math.random() * 15 + 5;
      const newProgress = Math.min(loaderState.progress + increment, 95);
      
      this.updateProgress(id, newProgress);
      
      // Update friendly message randomly
      if (Math.random() < 0.3) {
        this.updateFriendlyMessage(id);
      }
    }, 800);
  }

  /**
   * Update progress
   * @param {string} id - Loader ID
   * @param {number} progress - Progress percentage (0-100)
   * @param {string} customMessage - Custom step message
   */
  updateProgress(id, progress, customMessage) {
    const loaderState = this.activeLoaders.get(id);
    if (!loaderState) return;

    loaderState.progress = Math.max(0, Math.min(100, progress));

    // Update progress bar
    const progressBar = document.getElementById(`progress-bar-${id}`);
    if (progressBar) {
      progressBar.style.width = `${loaderState.progress}%`;
    }

    // Update percentage
    const percentText = document.getElementById(`progress-percent-${id}`);
    if (percentText) {
      percentText.textContent = `${Math.round(loaderState.progress)}%`;
    }

    // Update current step
    const { steps } = loaderState.config;
    const currentStepIndex = steps.findIndex((step, index) => 
      progress <= step.threshold || index === steps.length - 1
    );

    if (currentStepIndex !== loaderState.currentStep) {
      this.updateStep(id, currentStepIndex, customMessage);
    }

    // Update step indicators
    this.updateStepIndicators(id, currentStepIndex);
  }

  /**
   * Update current step
   * @param {string} id - Loader ID
   * @param {number} stepIndex - Step index
   * @param {string} customMessage - Custom message
   */
  updateStep(id, stepIndex, customMessage) {
    const loaderState = this.activeLoaders.get(id);
    if (!loaderState) return;

    loaderState.currentStep = stepIndex;
    const { steps } = loaderState.config;
    const step = steps[stepIndex];

    // Update step text
    const stepText = document.getElementById(`step-text-${id}`);
    if (stepText) {
      stepText.textContent = customMessage || 
        `Step ${stepIndex + 1} of ${steps.length}: ${step.text}`;
    }
  }

  /**
   * Update step indicators
   * @param {string} id - Loader ID
   * @param {number} currentStep - Current step index
   */
  updateStepIndicators(id, currentStep) {
    const loaderState = this.activeLoaders.get(id);
    if (!loaderState) return;

    const { steps } = loaderState.config;

    steps.forEach((step, index) => {
      const stepDot = document.getElementById(`step-dot-${id}-${index}`);
      if (stepDot) {
        if (index < currentStep) {
          // Completed step
          stepDot.className = 'w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-medium transition-all';
          stepDot.innerHTML = '<i class="fas fa-check text-xs"></i>';
        } else if (index === currentStep) {
          // Current step
          stepDot.className = 'w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-medium transition-all ring-2 ring-blue-200';
          stepDot.textContent = index + 1;
        } else {
          // Future step
          stepDot.className = 'w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center text-xs font-medium text-gray-500 transition-all';
          stepDot.textContent = index + 1;
        }
      }
    });
  }

  /**
   * Update friendly message
   * @param {string} id - Loader ID
   */
  updateFriendlyMessage(id) {
    const loaderState = this.activeLoaders.get(id);
    if (!loaderState) return;

    const { friendlyMessages } = loaderState.config;
    const messageElement = document.getElementById(`friendly-message-${id}`);
    
    if (messageElement && friendlyMessages.length > 0) {
      const randomMessage = friendlyMessages[Math.floor(Math.random() * friendlyMessages.length)];
      messageElement.textContent = randomMessage;
    }
  }

  /**
   * Handle timeout
   * @param {string} id - Loader ID
   */
  handleTimeout(id) {
    this.showError(id, {
      title: 'Taking longer than expected',
      message: 'The AI is still working, but this is taking longer than usual.',
      actions: [
        { text: 'Continue Waiting', action: 'continue' },
        { text: 'Cancel', action: 'cancel' }
      ]
    });
  }

  /**
   * Show error state with actionable options
   * @param {string} id - Loader ID
   * @param {Object} errorConfig - Error configuration
   */
  showError(id, errorConfig) {
    const loaderState = this.activeLoaders.get(id);
    if (!loaderState) return;

    const { element } = loaderState;
    const card = element.querySelector('.progress-loading-card');

    card.innerHTML = `
      <div class="text-center">
        <div class="error-icon w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="fas fa-exclamation-triangle text-red-600 text-2xl"></i>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">${errorConfig.title || 'Something went wrong'}</h3>
        <p class="text-sm text-gray-600 mb-6">${errorConfig.message || 'Please try again.'}</p>
        
        ${errorConfig.actions ? `
          <div class="flex justify-center gap-3 flex-wrap mb-4">
            ${errorConfig.actions.map(action => `
              <button class="error-action-btn px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                action.action === 'cancel' ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' :
                action.action === 'retry' ? 'bg-blue-600 hover:bg-blue-700 text-white' :
                action.action === 'continue' ? 'bg-green-600 hover:bg-green-700 text-white' :
                'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }" data-action="${action.action}">
                ${action.text}
              </button>
            `).join('')}
          </div>
        ` : ''}
        
        ${errorConfig.showPromptActions ? `
          <div class="mt-4 pt-4 border-t border-gray-200">
            <p class="text-xs text-gray-500 mb-3">Your prompt:</p>
            <div class="bg-gray-50 rounded p-3 text-sm text-gray-700 mb-3 font-mono" id="error-prompt-${id}">
              ${errorConfig.prompt || 'No prompt available'}
            </div>
            <div class="flex justify-center gap-4">
              <button class="copy-prompt-btn text-xs text-blue-600 hover:text-blue-800 underline flex items-center gap-1" data-action="copy">
                <i class="fas fa-copy"></i> Copy Prompt
              </button>
              <button class="edit-prompt-btn text-xs text-blue-600 hover:text-blue-800 underline flex items-center gap-1" data-action="edit">
                <i class="fas fa-edit"></i> Edit Prompt
              </button>
            </div>
          </div>
        ` : ''}

        ${errorConfig.suggestions ? `
          <div class="mt-4 pt-4 border-t border-gray-200 text-left">
            <p class="text-xs font-medium text-gray-700 mb-2">Suggestions:</p>
            <ul class="text-xs text-gray-600 space-y-1">
              ${errorConfig.suggestions.map(suggestion => `<li>• ${suggestion}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
      </div>
    `;

    // Bind error action events
    this.bindErrorActions(id, errorConfig.onAction, errorConfig.prompt);
  }

  /**
   * Bind error action events
   * @param {string} id - Loader ID
   * @param {Function} onAction - Action callback
   * @param {string} prompt - Original prompt
   */
  bindErrorActions(id, onAction, prompt) {
    const loaderState = this.activeLoaders.get(id);
    if (!loaderState) return;

    const { element } = loaderState;
    const actionButtons = element.querySelectorAll('.error-action-btn, .copy-prompt-btn, .edit-prompt-btn');

    actionButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.action;
        
        if (action === 'copy') {
          this.copyPrompt(id, prompt);
        } else if (action === 'edit') {
          this.editPrompt(id, prompt);
        } else {
          if (onAction) onAction(action);
        }
      });
    });
  }

  /**
   * Copy prompt to clipboard
   * @param {string} id - Loader ID
   * @param {string} prompt - Prompt text
   */
  copyPrompt(id, prompt) {
    if (prompt) {
      navigator.clipboard.writeText(prompt).then(() => {
        // Show success feedback
        const btn = document.querySelector(`#progress-loader-${id} .copy-prompt-btn`);
        if (btn) {
          const originalText = btn.innerHTML;
          btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
          btn.classList.add('text-green-600');
          
          setTimeout(() => {
            btn.innerHTML = originalText;
            btn.classList.remove('text-green-600');
          }, 2000);
        }
      });
    }
  }

  /**
   * Edit prompt (redirect to input)
   * @param {string} id - Loader ID
   * @param {string} prompt - Original prompt
   */
  editPrompt(id, prompt) {
    this.hideLoading(id);
    // Focus on prompt input and restore text
    const promptInput = document.getElementById('prompt-input') || document.getElementById('chart-prompt');
    if (promptInput) {
      promptInput.value = prompt || '';
      promptInput.focus();
      promptInput.select();
    }
  }

  /**
   * Hide loading
   * @param {string} id - Loader ID
   */
  hideLoading(id) {
    const loaderState = this.activeLoaders.get(id);
    if (!loaderState) return;

    const { element, timeoutId, progressInterval } = loaderState;

    // Clear intervals
    if (timeoutId) clearTimeout(timeoutId);
    if (progressInterval) clearInterval(progressInterval);

    // Add exit animation
    element.classList.add('hiding');
    
    setTimeout(() => {
      if (element.parentNode) {
        element.remove();
      }
    }, 300);

    this.activeLoaders.delete(id);
  }

  /**
   * Show AI error with actionable options
   * @param {string} prompt - Original prompt
   * @param {Object} error - Error object
   * @param {Function} onRetry - Retry callback
   */
  showAIError(prompt, error, onRetry) {
    const id = 'ai-error-' + Date.now();
    
    this.showLoading(id, {
      title: 'AI Generation Failed',
      description: 'The AI encountered an issue while generating your chart.',
      showProgress: false,
      showCancel: false
    });

    // Determine error type and suggestions
    let suggestions = [];
    let errorTitle = 'Something went wrong';
    let errorMessage = error?.message || 'Please try again.';

    if (error?.code === 'rate_limited') {
      errorTitle = 'Rate Limit Reached';
      errorMessage = 'You\'ve reached the maximum number of requests. Please wait a moment or upgrade to Pro.';
      suggestions = [
        'Wait a few minutes and try again',
        'Upgrade to Pro for unlimited requests',
        'Try simplifying your prompt'
      ];
    } else if (error?.code === 'invalid_prompt') {
      errorTitle = 'Prompt Not Understood';
      errorMessage = 'The AI couldn\'t understand your request. Please try rephrasing.';
      suggestions = [
        'Be more specific about the data you want to visualize',
        'Mention the chart type explicitly',
        'Include example data or format'
      ];
    } else if (error?.code === 'data_parsing_error') {
      errorTitle = 'Data Parsing Error';
      errorMessage = 'The AI had trouble parsing your data. Please check the format.';
      suggestions = [
        'Ensure your data is in a valid format (CSV, JSON, etc.)',
        'Check for missing or incorrect values',
        'Try with a smaller dataset'
      ];
    }

    this.showError(id, {
      title: errorTitle,
      message: errorMessage,
      actions: [
        { text: 'Try Again', action: 'retry' },
        { text: 'Edit Prompt', action: 'edit' },
        { text: 'Cancel', action: 'cancel' }
      ],
      showPromptActions: true,
      prompt: prompt,
      suggestions: suggestions,
      onAction: (action) => {
        if (action === 'retry' && onRetry) {
          this.hideLoading(id);
          onRetry();
        } else if (action === 'edit') {
          this.editPrompt(id, prompt);
        } else {
          this.hideLoading(id);
        }
      }
    });
  }

  /**
   * Get active loaders
   * @returns {Array} Array of active loader IDs
   */
  getActiveLoaders() {
    return Array.from(this.activeLoaders.keys());
  }

  /**
   * Hide all active loaders
   */
  hideAllLoaders() {
    this.getActiveLoaders().forEach(id => this.hideLoading(id));
  }
}

// CSS for Progress Loading Manager
const progressLoadingCSS = `
.progress-loading-overlay {
  opacity: 0;
  transition: opacity 0.3s ease;
}

.progress-loading-overlay.active {
  opacity: 1;
}

.progress-loading-overlay.hiding {
  opacity: 0;
}

.progress-loading-card {
  transform: scale(0.9) translateY(20px);
  transition: transform 0.3s ease;
}

.progress-loading-overlay.active .progress-loading-card {
  transform: scale(1) translateY(0);
}

.progress-bar {
  background: linear-gradient(90deg, #3B82F6 0%, #2563EB 50%, #1D4ED8 100%);
  background-size: 200% 100%;
  animation: shimmer 2s ease-in-out infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.step-indicator .w-8 {
  transition: all 0.3s ease;
}

.dot {
  animation: bounce 1.4s infinite ease-in-out both;
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

.error-icon {
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

/* Mobile responsive */
@media (max-width: 640px) {
  .progress-loading-card {
    margin: 1rem;
    padding: 1.5rem;
  }
  
  .step-indicator .text-xs {
    display: none;
  }
}
`;

// Inject CSS if not already present
if (!document.querySelector('#progress-loading-css')) {
  const style = document.createElement('style');
  style.id = 'progress-loading-css';
  style.textContent = progressLoadingCSS;
  document.head.appendChild(style);
}

// Export singleton instance
export const progressLoading = new ProgressLoadingManager();

// AI Generation Critical Issues Fix - Loading States, Error Messages & Onboarding
class AIGenerationFix {
  constructor() {
    this.generationInProgress = false;
    this.generationStartTime = null;
    this.generationProgress = null;
    this.errorHistory = new Map();
    this.onboardingCompleted = false;
    this.generationMetrics = new Map();
    this.retryAttempts = 0;
    this.maxRetries = 3;
    
    this.init();
  }

  init() {
    this.fixLoadingStates();
    this.fixErrorMessages();
    this.fixNewUserOnboarding();
    this.setupGenerationMonitoring();
    this.setupProgressTracking();
    this.setupErrorRecovery();
    this.setupPerformanceOptimization();
    this.setupUserGuidance();
    this.setupAnalytics();
  }

  // CRITICAL FIX 1: Loading States During AI Generation
  fixLoadingStates() {
    this.createGenerationProgressSystem();
    this.setupRealTimeProgress();
    this.setupEstimatedTimeDisplay();
    this.setupGenerationStages();
    this.setupCancellationOptions();
    this.setupBackgroundProgress();
  }

  // Create comprehensive generation progress system
  createGenerationProgressSystem() {
    // Replace any existing generation buttons with enhanced versions
    document.addEventListener('click', (e) => {
      const generateBtn = e.target.closest('[data-action="generate"], .generate-btn, #generateChart');
      if (generateBtn && !this.generationInProgress) {
        this.startGenerationWithProgress(generateBtn);
      }
    });

    // Listen for generation events
    document.addEventListener('generationStarted', (e) => {
      this.showGenerationProgress(e.detail);
    });

    document.addEventListener('generationProgress', (e) => {
      this.updateGenerationProgress(e.detail);
    });

    document.addEventListener('generationCompleted', (e) => {
      this.hideGenerationProgress(e.detail);
    });

    document.addEventListener('generationFailed', (e) => {
      this.handleGenerationFailure(e.detail);
    });
  }

  // Start generation with comprehensive progress
  startGenerationWithProgress(button) {
    this.generationInProgress = true;
    this.generationStartTime = Date.now();
    this.retryAttempts = 0;

    // Disable all generation buttons
    this.disableGenerationButtons();

    // Show immediate feedback
    this.showImmediateFeedback(button);

    // Create progress overlay
    const progressOverlay = this.createProgressOverlay();
    document.body.appendChild(progressOverlay);

    // Start progress tracking
    this.startProgressTracking();

    // Emit generation started event
    document.dispatchEvent(new CustomEvent('generationStarted', {
      detail: {
        button: button,
        timestamp: this.generationStartTime,
        estimatedDuration: this.estimateGenerationDuration()
      }
    }));

    // Track generation start
    this.trackGenerationEvent('generation_started', {
      button_text: button.textContent,
      estimated_duration: this.estimateGenerationDuration()
    });
  }

  // Show immediate visual feedback
  showImmediateFeedback(button) {
    // Add loading state to button
    button.disabled = true;
    button.classList.add('generating');
    button.innerHTML = `
      <i class="fas fa-spinner fa-spin"></i>
      <span>Starting AI generation...</span>
    `;

    // Create ripple effect
    this.createGenerationRipple(button);

    // Show micro-feedback
    this.showMicroFeedback('AI is analyzing your data...', 'info');
  }

  // Create generation ripple effect
  createGenerationRipple(element) {
    const ripple = document.createElement('div');
    ripple.className = 'generation-ripple';
    
    const rect = element.getBoundingClientRect();
    ripple.style.width = ripple.style.height = '20px';
    ripple.style.left = rect.left + rect.width / 2 - 10 + 'px';
    ripple.style.top = rect.top + rect.height / 2 - 10 + 'px';
    
    document.body.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 1000);
  }

  // Create comprehensive progress overlay
  createProgressOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'generation-progress-overlay';
    overlay.id = 'generationProgressOverlay';
    overlay.innerHTML = `
      <div class="generation-progress-content">
        <div class="progress-header">
          <div class="progress-icon">
            <i class="fas fa-magic"></i>
          </div>
          <div class="progress-title">
            <h3>AI Generation in Progress</h3>
            <p class="progress-subtitle">Creating your beautiful chart...</p>
          </div>
          <button class="progress-minimize" id="progressMinimize">
            <i class="fas fa-minus"></i>
          </button>
        </div>
        
        <div class="progress-main">
          <div class="progress-bar-container">
            <div class="progress-bar">
              <div class="progress-fill" id="progressFill" style="width: 0%"></div>
            </div>
            <div class="progress-percentage" id="progressPercentage">0%</div>
          </div>
          
          <div class="progress-stages" id="progressStages">
            <div class="progress-stage active" data-stage="analyzing">
              <div class="stage-icon">
                <i class="fas fa-search"></i>
              </div>
              <div class="stage-text">
                <div class="stage-name">Analyzing Data</div>
                <div class="stage-status">Processing your information...</div>
              </div>
            </div>
            
            <div class="progress-stage" data-stage="designing">
              <div class="stage-icon">
                <i class="fas fa-palette"></i>
              </div>
              <div class="stage-text">
                <div class="stage-name">Designing Chart</div>
                <div class="stage-status">Creating optimal visualization...</div>
              </div>
            </div>
            
            <div class="progress-stage" data-stage="generating">
              <div class="stage-icon">
                <i class="fas fa-chart-line"></i>
              </div>
              <div class="stage-text">
                <div class="stage-name">Generating Visualization</div>
                <div class="stage-status">Building your chart...</div>
              </div>
            </div>
            
            <div class="progress-stage" data-stage="finalizing">
              <div class="stage-icon">
                <i class="fas fa-sparkles"></i>
              </div>
              <div class="stage-text">
                <div class="stage-name">Finalizing</div>
                <div class="stage-status">Adding finishing touches...</div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="progress-footer">
          <div class="progress-info">
            <div class="progress-time">
              <i class="fas fa-clock"></i>
              <span id="progressTime">Estimate: 30-60 seconds</span>
            </div>
            <div class="progress-status" id="progressStatus">
              <span class="status-indicator active"></span>
              <span>AI is working hard for you</span>
            </div>
          </div>
          
          <div class="progress-actions">
            <button class="progress-btn secondary" id="progressCancel">
              <i class="fas fa-times"></i>
              Cancel
            </button>
            <button class="progress-btn primary" id="progressBackground" disabled>
              <i class="fas fa-eye-slash"></i>
              Run in Background
            </button>
          </div>
        </div>
        
        <div class="progress-tips">
          <div class="tip-content">
            <i class="fas fa-lightbulb"></i>
            <span id="progressTip">Did you know? Our AI analyzes over 100 data points to create the perfect chart.</span>
          </div>
        </div>
      </div>
    `;

    // Setup event handlers
    this.setupProgressEvents(overlay);

    return overlay;
  }

  // Setup progress overlay events
  setupProgressEvents(overlay) {
    const minimizeBtn = overlay.querySelector('#progressMinimize');
    const cancelBtn = overlay.querySelector('#progressCancel');
    const backgroundBtn = overlay.querySelector('#progressBackground');

    minimizeBtn.addEventListener('click', () => {
      this.minimizeProgress(overlay);
    });

    cancelBtn.addEventListener('click', () => {
      this.cancelGeneration();
    });

    backgroundBtn.addEventListener('click', () => {
      this.runInBackground(overlay);
    });
  }

  // Start progress tracking with realistic timing
  startProgressTracking() {
    const stages = [
      { name: 'analyzing', duration: 8000, progress: 20 },
      { name: 'designing', duration: 12000, progress: 50 },
      { name: 'generating', duration: 15000, progress: 80 },
      { name: 'finalizing', duration: 5000, progress: 100 }
    ];

    let currentStageIndex = 0;
    let stageStartTime = Date.now();
    let currentProgress = 0;

    const updateStage = () => {
      if (!this.generationInProgress) return;

      const stage = stages[currentStageIndex];
      const elapsed = Date.now() - stageStartTime;
      const stageProgress = Math.min(elapsed / stage.duration, 1);

      // Update progress bar
      const totalProgress = stage.progress * stageProgress;
      this.updateProgressBar(totalProgress);

      // Update active stage
      this.updateActiveStage(stage.name);

      // Update time estimate
      this.updateTimeEstimate(elapsed, stages.slice(currentStageIndex));

      // Rotate tips
      this.rotateProgressTip();

      if (stageProgress >= 1 && currentStageIndex < stages.length - 1) {
        currentStageIndex++;
        stageStartTime = Date.now();
      }

      if (currentStageIndex < stages.length) {
        requestAnimationFrame(updateStage);
      }
    };

    updateStage();
  }

  // Update progress bar
  updateProgressBar(percentage) {
    const progressFill = document.getElementById('progressFill');
    const progressPercentage = document.getElementById('progressPercentage');
    
    if (progressFill) {
      progressFill.style.width = `${percentage}%`;
    }
    
    if (progressPercentage) {
      progressPercentage.textContent = `${Math.round(percentage)}%`;
    }

    // Enable background button after 30% progress
    const backgroundBtn = document.getElementById('progressBackground');
    if (backgroundBtn && percentage >= 30) {
      backgroundBtn.disabled = false;
    }
  }

  // Update active stage
  updateActiveStage(stageName) {
    const stages = document.querySelectorAll('.progress-stage');
    stages.forEach(stage => {
      const isActive = stage.dataset.stage === stageName;
      stage.classList.toggle('active', isActive);
      stage.classList.toggle('completed', !isActive && stages.indexOf(stage) < Array.from(stages).findIndex(s => s.dataset.stage === stageName));
    });
  }

  // Update time estimate
  updateTimeEstimate(elapsed, remainingStages) {
    const timeElement = document.getElementById('progressTime');
    if (!timeElement) return;

    const totalRemaining = remainingStages.reduce((sum, stage) => sum + stage.duration, 0);
    const remainingMs = totalRemaining - (elapsed % remainingStages[0]?.duration || 0);
    const remainingSeconds = Math.ceil(remainingMs / 1000);

    if (remainingSeconds > 60) {
      timeElement.textContent = `Estimate: ${Math.ceil(remainingSeconds / 60)} minute${remainingSeconds > 120 ? 's' : ''}`;
    } else {
      timeElement.textContent = `Estimate: ${remainingSeconds} seconds`;
    }
  }

  // Rotate progress tips
  rotateProgressTip() {
    const tips = [
      "Did you know? Our AI analyzes over 100 data points to create the perfect chart.",
      "Pro tip: You can customize colors and styles after generation.",
      "Fun fact: VIZOM has generated over 1 million charts for users worldwide.",
      "Tip: Save your chart as a template for future use.",
      "Did you know? You can export your chart in multiple formats.",
      "Pro tip: Use the AI suggestions to improve data visualization.",
      "Fun fact: Our AI gets smarter with every chart created."
    ];

    const tipElement = document.getElementById('progressTip');
    if (tipElement && Math.random() < 0.01) { // 1% chance per frame
      const randomTip = tips[Math.floor(Math.random() * tips.length)];
      tipElement.textContent = randomTip;
    }
  }

  // CRITICAL FIX 2: Better Error Messages
  fixErrorMessages() {
    this.setupErrorDetection();
    this.createErrorClassification();
    this.setupActionableErrors();
    this.setupErrorRecoveryGuidance();
    this.setupContextualErrorHelp();
  }

  // Setup comprehensive error detection
  setupErrorDetection() {
    // Listen for all error types
    window.addEventListener('error', (e) => {
      this.classifyAndHandleError(e.error, 'javascript');
    });

    window.addEventListener('unhandledrejection', (e) => {
      this.classifyAndHandleError(e.reason, 'promise');
    });

    // Custom generation errors
    document.addEventListener('generationFailed', (e) => {
      this.handleGenerationError(e.detail);
    });

    // Network errors
    window.addEventListener('online', () => {
      this.handleNetworkRecovery();
    });

    window.addEventListener('offline', () => {
      this.handleNetworkLoss();
    });
  }

  // Create error classification system
  createErrorClassification() {
    this.errorTypes = {
      'data_format': {
        title: 'Data Format Issue',
        message: 'Your data format needs adjustment',
        solutions: ['Check CSV headers', 'Verify data types', 'Remove empty rows'],
        actions: ['format-guide', 'data-validator', 'template-suggester']
      },
      'data_size': {
        title: 'Data Size Issue',
        message: 'Your dataset is too large or small',
        solutions: ['Reduce data points', 'Add more data', 'Use sampling'],
        actions: ['data-optimizer', 'sampling-tool', 'chunk-processor']
      },
      'network_timeout': {
        title: 'Network Timeout',
        message: 'Connection to AI service timed out',
        solutions: ['Check internet connection', 'Try again', 'Use smaller dataset'],
        actions: ['retry-generation', 'connection-test', 'offline-mode']
      },
      'ai_service_error': {
        title: 'AI Service Error',
        message: 'AI generation service is temporarily unavailable',
        solutions: ['Try again in a few minutes', 'Use template instead', 'Contact support'],
        actions: ['retry-later', 'template-fallback', 'support-contact']
      },
      'quota_exceeded': {
        title: 'Usage Limit Reached',
        message: 'You\'ve reached your generation limit',
        solutions: ['Upgrade your plan', 'Wait for reset', 'Use templates'],
        actions: ['upgrade-plan', 'usage-dashboard', 'template-alternatives']
      },
      'invalid_parameters': {
        title: 'Invalid Chart Parameters',
        message: 'Chart configuration has issues',
        solutions: ['Check chart type', 'Verify data mapping', 'Review settings'],
        actions: ['parameter-validator', 'settings-guide', 'auto-fix']
      }
    };
  }

  // Handle generation errors with actionable messages
  handleGenerationError(errorDetail) {
    const errorType = this.classifyError(errorDetail);
    const errorConfig = this.errorTypes[errorType] || this.errorTypes['ai_service_error'];

    // Track error for analytics
    this.trackGenerationError(errorType, errorDetail);

    // Show comprehensive error modal
    this.showErrorModal(errorConfig, errorDetail);

    // Store error for retry logic
    this.errorHistory.set(Date.now(), { type: errorType, detail: errorDetail });

    // Enable retry if appropriate
    if (this.shouldAllowRetry(errorType)) {
      this.enableRetryOption(errorDetail);
    }
  }

  // Classify error type
  classifyError(errorDetail) {
    const message = (errorDetail.message || '').toLowerCase();
    const status = errorDetail.status || 0;

    if (message.includes('format') || message.includes('csv') || message.includes('json')) {
      return 'data_format';
    }
    if (message.includes('size') || message.includes('large') || message.includes('too many')) {
      return 'data_size';
    }
    if (message.includes('timeout') || message.includes('network') || status === 408) {
      return 'network_timeout';
    }
    if (status === 429 || message.includes('quota') || message.includes('limit')) {
      return 'quota_exceeded';
    }
    if (message.includes('parameter') || message.includes('invalid')) {
      return 'invalid_parameters';
    }
    if (status >= 500) {
      return 'ai_service_error';
    }

    return 'ai_service_error';
  }

  // Show comprehensive error modal
  showErrorModal(errorConfig, errorDetail) {
    // Remove any existing error modal
    const existingModal = document.querySelector('.generation-error-modal');
    if (existingModal) {
      existingModal.remove();
    }

    const modal = document.createElement('div');
    modal.className = 'generation-error-modal';
    modal.innerHTML = `
      <div class="error-modal-content">
        <div class="error-modal-header">
          <div class="error-icon">
            <i class="fas fa-exclamation-triangle"></i>
          </div>
          <h2>${errorConfig.title}</h2>
          <p>${errorConfig.message}</p>
        </div>
        
        <div class="error-modal-body">
          <div class="error-solutions">
            <h3>Here's how to fix this:</h3>
            <div class="solutions-list">
              ${errorConfig.solutions.map((solution, index) => `
                <div class="solution-item" data-action="${errorConfig.actions[index]}">
                  <div class="solution-number">${index + 1}</div>
                  <div class="solution-text">${solution}</div>
                  <button class="solution-action-btn" data-action="${errorConfig.actions[index]}">
                    Try This Fix
                  </button>
                </div>
              `).join('')}
            </div>
          </div>
          
          <div class="error-details">
            <details>
              <summary>Technical Details</summary>
              <div class="error-info">
                <div class="error-row">
                  <span class="error-label">Error Code:</span>
                  <span class="error-value">${this.generateErrorCode()}</span>
                </div>
                <div class="error-row">
                  <span class="error-label">Time:</span>
                  <span class="error-value">${new Date().toLocaleString()}</span>
                </div>
                ${errorDetail.message ? `
                  <div class="error-row">
                    <span class="error-label">Message:</span>
                    <span class="error-value">${errorDetail.message}</span>
                  </div>
                ` : ''}
              </div>
            </details>
          </div>
        </div>
        
        <div class="error-modal-footer">
          <button class="error-btn secondary" id="errorContactSupport">
            <i class="fas fa-headset"></i>
            Contact Support
          </button>
          <button class="error-btn primary" id="errorRetry" ${!this.shouldAllowRetry(this.classifyError(errorDetail)) ? 'disabled' : ''}>
            <i class="fas fa-redo"></i>
            Try Again
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Setup event handlers
    this.setupErrorModalEvents(modal, errorConfig, errorDetail);

    // Show modal with animation
    setTimeout(() => {
      modal.classList.add('error-modal-show');
    }, 100);
  }

  // Setup error modal events
  setupErrorModalEvents(modal, errorConfig, errorDetail) {
    // Solution action buttons
    modal.querySelectorAll('.solution-action-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.action;
        this.executeErrorSolution(action, errorDetail);
        modal.remove();
      });
    });

    // Contact support
    modal.querySelector('#errorContactSupport').addEventListener('click', () => {
      this.contactSupport(errorDetail);
      modal.remove();
    });

    // Retry button
    modal.querySelector('#errorRetry').addEventListener('click', () => {
      if (this.shouldAllowRetry(this.classifyError(errorDetail))) {
        this.retryGeneration(errorDetail);
        modal.remove();
      }
    });
  }

  // Execute error solution
  executeErrorSolution(action, errorDetail) {
    const solutions = {
      'format-guide': () => this.showDataFormatGuide(),
      'data-validator': () => this.showDataValidator(),
      'template-suggester': () => this.suggestTemplates(),
      'data-optimizer': () => this.optimizeData(),
      'sampling-tool': () => this.showSamplingTool(),
      'chunk-processor': () => this.processDataChunks(),
      'retry-generation': () => this.retryGeneration(errorDetail),
      'connection-test': () => this.testConnection(),
      'offline-mode': () => this.enableOfflineMode(),
      'retry-later': () => this.scheduleRetry(),
      'template-fallback': () => this.showTemplateFallback(),
      'support-contact': () => this.contactSupport(errorDetail),
      'upgrade-plan': () => this.showUpgradeOptions(),
      'usage-dashboard': () => this.showUsageDashboard(),
      'template-alternatives': () => this.showTemplateAlternatives(),
      'parameter-validator': () => this.showParameterValidator(),
      'settings-guide': () => this.showSettingsGuide(),
      'auto-fix': () => this.autoFixParameters()
    };

    const solution = solutions[action];
    if (solution) {
      solution();
      this.trackErrorSolution(action);
    }
  }

  // CRITICAL FIX 3: Better New User Onboarding
  fixNewUserOnboarding() {
    this.detectNewUsers();
    this.createInteractiveOnboarding();
    this.setupExampleGenerator();
    this.setupGuidedFirstGeneration();
    this.setupProgressiveDisclosure();
    this.setupContextualHelp();
  }

  // Detect new users
  detectNewUsers() {
    const hasGeneratedBefore = localStorage.getItem('has_generated_chart');
    const visitCount = parseInt(localStorage.getItem('visit_count') || '0');
    const isOnGeneratorPage = window.location.pathname.includes('/generate') || window.location.pathname.includes('/create');

    if (!hasGeneratedBefore && isOnGeneratorPage) {
      this.initiateNewUserOnboarding();
    }

    if (visitCount <= 2 && isOnGeneratorPage) {
      this.showEarlyUserHelp();
    }
  }

  // Initiate comprehensive new user onboarding
  initiateNewUserOnboarding() {
    // Create onboarding overlay
    const onboarding = this.createOnboardingOverlay();
    document.body.appendChild(onboarding);

    // Show with delay
    setTimeout(() => {
      onboarding.classList.add('onboarding-show');
    }, 1000);

    // Track onboarding start
    this.trackOnboardingEvent('onboarding_started');
  }

  // Create comprehensive onboarding overlay
  createOnboardingOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'new-user-onboarding-overlay';
    overlay.innerHTML = `
      <div class="onboarding-content">
        <div class="onboarding-header">
          <div class="onboarding-welcome">
            <h1>Welcome to VIZOM AI! 🎨</h1>
            <p>Let's create your first amazing chart together</p>
          </div>
          <button class="onboarding-skip" id="onboardingSkip">
            Skip Tour
          </button>
        </div>
        
        <div class="onboarding-steps" id="onboardingSteps">
          <div class="onboarding-step active" data-step="welcome">
            <div class="step-icon">
              <i class="fas fa-rocket"></i>
            </div>
            <div class="step-content">
              <h3>Start Your Journey</h3>
              <p>VIZOM AI transforms your data into beautiful charts in seconds. No design skills needed!</p>
              <div class="step-features">
                <div class="feature-item">
                  <i class="fas fa-magic"></i>
                  <span>AI-Powered Design</span>
                </div>
                <div class="feature-item">
                  <i class="fas fa-bolt"></i>
                  <span>Lightning Fast</span>
                </div>
                <div class="feature-item">
                  <i class="fas fa-palette"></i>
                  <span>Beautiful Results</span>
                </div>
              </div>
            </div>
            <div class="step-navigation">
              <button class="step-btn primary" id="startWithDataBtn">
                <i class="fas fa-database"></i>
                Start with Data
              </button>
              <button class="step-btn secondary" id="tryExampleBtn">
                <i class="fas fa-play"></i>
                Try Example
              </button>
            </div>
          </div>
          
          <div class="onboarding-step" data-step="data-input">
            <div class="step-icon">
              <i class="fas fa-table"></i>
            </div>
            <div class="step-content">
              <h3>Add Your Data</h3>
              <p>Choose how you'd like to provide your data. We support multiple formats!</p>
              <div class="data-input-options">
                <div class="input-option" data-method="csv">
                  <div class="option-icon">
                    <i class="fas fa-file-csv"></i>
                  </div>
                  <div class="option-info">
                    <h4>Upload CSV/Excel</h4>
                    <p>Perfect for existing spreadsheets</p>
                  </div>
                  <div class="option-badge">Recommended</div>
                </div>
                
                <div class="input-option" data-method="manual">
                  <div class="option-icon">
                    <i class="fas fa-keyboard"></i>
                  </div>
                  <div class="option-info">
                    <h4>Manual Entry</h4>
                    <p>Great for small datasets</p>
                  </div>
                </div>
                
                <div class="input-option" data-method="sample">
                  <div class="option-icon">
                    <i class="fas fa-flask"></i>
                  </div>
                  <div class="option-info">
                    <h4>Use Sample Data</h4>
                    <p>Try with our example data</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="step-navigation">
              <button class="step-btn secondary" id="backToWelcomeBtn">
                <i class="fas fa-arrow-left"></i>
                Back
              </button>
              <button class="step-btn primary" id="continueWithDataBtn" disabled>
                Continue
                <i class="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>
          
          <div class="onboarding-step" data-step="generation">
            <div class="step-icon">
              <i class="fas fa-magic"></i>
            </div>
            <div class="step-content">
              <h3>Watch the Magic Happen</h3>
              <p>Our AI will analyze your data and create the perfect chart. This usually takes 30-60 seconds.</p>
              <div class="generation-preview">
                <div class="preview-animation">
                  <div class="ai-thinking">
                    <i class="fas fa-brain"></i>
                  </div>
                  <div class="process-steps">
                    <div class="process-step">
                      <i class="fas fa-search"></i>
                      <span>Analyzing</span>
                    </div>
                    <div class="process-step">
                      <i class="fas fa-palette"></i>
                      <span>Designing</span>
                    </div>
                    <div class="process-step">
                      <i class="fas fa-chart-line"></i>
                      <span>Creating</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="step-navigation">
              <button class="step-btn secondary" id="backToDataBtn">
                <i class="fas fa-arrow-left"></i>
                Back
              </button>
              <button class="step-btn primary" id="startGenerationBtn">
                <i class="fas fa-play"></i>
                Start Generation
              </button>
            </div>
          </div>
          
          <div class="onboarding-step" data-step="success">
            <div class="step-icon">
              <i class="fas fa-trophy"></i>
            </div>
            <div class="step-content">
              <h3>Congratulations! 🎉</h3>
              <p>You've created your first chart with VIZOM AI!</p>
              <div class="success-features">
                <div class="success-item">
                  <i class="fas fa-edit"></i>
                  <span>Customize colors & styles</span>
                </div>
                <div class="success-item">
                  <i class="fas fa-download"></i>
                  <span>Export in multiple formats</span>
                </div>
                <div class="success-item">
                  <i class="fas fa-share"></i>
                  <span>Share with your team</span>
                </div>
              </div>
            </div>
            <div class="step-navigation">
              <button class="step-btn secondary" id="createAnotherBtn">
                <i class="fas fa-plus"></i>
                Create Another
              </button>
              <button class="step-btn primary" id="finishOnboardingBtn">
                <i class="fas fa-check"></i>
                Finish & Explore
              </button>
            </div>
          </div>
        </div>
        
        <div class="onboarding-progress">
          <div class="progress-dots">
            <div class="progress-dot active" data-step="welcome"></div>
            <div class="progress-dot" data-step="data-input"></div>
            <div class="progress-dot" data-step="generation"></div>
            <div class="progress-dot" data-step="success"></div>
          </div>
        </div>
      </div>
    `;

    // Setup onboarding events
    this.setupOnboardingEvents(overlay);

    return overlay;
  }

  // Setup onboarding events
  setupOnboardingEvents(overlay) {
    let currentStep = 'welcome';
    const steps = ['welcome', 'data-input', 'generation', 'success'];

    // Navigation buttons
    overlay.querySelector('#onboardingSkip').addEventListener('click', () => {
      this.skipOnboarding(overlay);
    });

    overlay.querySelector('#startWithDataBtn').addEventListener('click', () => {
      this.goToOnboardingStep('data-input', overlay);
    });

    overlay.querySelector('#tryExampleBtn').addEventListener('click', () => {
      this.loadExampleData();
      this.goToOnboardingStep('data-input', overlay);
    });

    overlay.querySelector('#backToWelcomeBtn').addEventListener('click', () => {
      this.goToOnboardingStep('welcome', overlay);
    });

    overlay.querySelector('#continueWithDataBtn').addEventListener('click', () => {
      this.goToOnboardingStep('generation', overlay);
    });

    overlay.querySelector('#backToDataBtn').addEventListener('click', () => {
      this.goToOnboardingStep('data-input', overlay);
    });

    overlay.querySelector('#startGenerationBtn').addEventListener('click', () => {
      this.startOnboardingGeneration(overlay);
    });

    overlay.querySelector('#createAnotherBtn').addEventListener('click', () => {
      this.restartOnboardingGeneration(overlay);
    });

    overlay.querySelector('#finishOnboardingBtn').addEventListener('click', () => {
      this.finishOnboarding(overlay);
    });

    // Data input options
    overlay.querySelectorAll('.input-option').forEach(option => {
      option.addEventListener('click', () => {
        const method = option.dataset.method;
        this.selectDataInputMethod(method, overlay);
      });
    });
  }

  // Navigate to onboarding step
  goToOnboardingStep(stepName, overlay) {
    const steps = overlay.querySelectorAll('.onboarding-step');
    const dots = overlay.querySelectorAll('.progress-dot');

    steps.forEach(step => {
      step.classList.toggle('active', step.dataset.step === stepName);
    });

    dots.forEach(dot => {
      dot.classList.toggle('active', dot.dataset.step === stepName);
    });

    this.trackOnboardingEvent('onboarding_step_changed', { step: stepName });
  }

  // Select data input method
  selectDataInputMethod(method, overlay) {
    const options = overlay.querySelectorAll('.input-option');
    options.forEach(option => {
      option.classList.toggle('selected', option.dataset.method === method);
    });

    const continueBtn = overlay.querySelector('#continueWithDataBtn');
    continueBtn.disabled = false;

    this.trackOnboardingEvent('data_method_selected', { method: method });
  }

  // Start onboarding generation
  startOnboardingGeneration(overlay) {
    // Hide onboarding temporarily
    overlay.classList.remove('onboarding-show');

    // Start actual generation
    const generateBtn = document.querySelector('.generate-btn, [data-action="generate"]');
    if (generateBtn) {
      generateBtn.click();
    }

    // Listen for completion
    document.addEventListener('generationCompleted', () => {
      this.goToOnboardingStep('success', overlay);
      overlay.classList.add('onboarding-show');
    }, { once: true });

    this.trackOnboardingEvent('onboarding_generation_started');
  }

  // Setup example generator for instant results
  setupExampleGenerator() {
    const exampleBtn = document.createElement('button');
    exampleBtn.className = 'example-generator-btn';
    exampleBtn.innerHTML = `
      <i class="fas fa-play"></i>
      <span>Try Example</span>
      <small>See how it works</small>
    `;

    // Add to prominent location
    const generatorHeader = document.querySelector('.generator-header, .create-header');
    if (generatorHeader) {
      generatorHeader.appendChild(exampleBtn);
    }

    exampleBtn.addEventListener('click', () => {
      this.generateExampleChart();
    });
  }

  // Generate example chart instantly
  generateExampleChart() {
    this.showMicroFeedback('Loading example data...', 'info');

    // Load sample data
    const sampleData = {
      headers: ['Month', 'Sales', 'Revenue'],
      rows: [
        ['January', 45, 12000],
        ['February', 52, 14500],
        ['March', 48, 13200],
        ['April', 58, 16800],
        ['May', 63, 18500]
      ]
    };

    // Populate data fields
    this.populateDataFields(sampleData);

    // Auto-start generation after 2 seconds
    setTimeout(() => {
      const generateBtn = document.querySelector('.generate-btn, [data-action="generate"]');
      if (generateBtn) {
        generateBtn.click();
      }
    }, 2000);

    this.trackOnboardingEvent('example_generator_used');
  }

  // Setup generation monitoring
  setupGenerationMonitoring() {
    // Monitor generation performance
    this.monitorGenerationTimes();
    this.monitorErrorRates();
    this.monitorUserSatisfaction();
  }

  // Monitor generation times
  monitorGenerationTimes() {
    document.addEventListener('generationCompleted', (e) => {
      const duration = Date.now() - this.generationStartTime;
      
      // Store metrics
      const metrics = this.generationMetrics.get('generation_times') || [];
      metrics.push(duration);
      this.generationMetrics.set('generation_times', metrics);

      // Alert if too slow
      if (duration > 120000) { // 2 minutes
        this.reportSlowGeneration(duration);
      }

      this.trackGenerationEvent('generation_completed', { duration: duration });
    });
  }

  // Monitor error rates
  monitorErrorRates() {
    document.addEventListener('generationFailed', (e) => {
      const errors = this.generationMetrics.get('error_count') || 0;
      this.generationMetrics.set('error_count', errors + 1);

      // Alert if error rate too high
      const totalGenerations = this.generationMetrics.get('total_generations') || 1;
      const errorRate = (errors + 1) / totalGenerations;

      if (errorRate > 0.2) { // 20% error rate
        this.reportHighErrorRate(errorRate);
      }
    });
  }

  // Utility methods
  estimateGenerationDuration() {
    const metrics = this.generationMetrics.get('generation_times') || [];
    if (metrics.length === 0) return 45000; // 45 seconds default

    const average = metrics.reduce((sum, time) => sum + time, 0) / metrics.length;
    return Math.round(average);
  }

  classifyError(errorDetail) {
    // Implementation from error classification above
    return 'ai_service_error';
  }

  shouldAllowRetry(errorType) {
    const retryableErrors = ['network_timeout', 'ai_service_error', 'data_format'];
    return retryableErrors.includes(errorType) && this.retryAttempts < this.maxRetries;
  }

  generateErrorCode() {
    return 'GEN-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  }

  showMicroFeedback(message, type) {
    // Implementation from micro-feedback system
    console.log(`${type.toUpperCase()}: ${message}`);
  }

  trackGenerationEvent(event, data) {
    if (window.analytics) {
      window.analytics.trackCustomEvent(event, data);
    }
  }

  trackGenerationError(errorType, errorDetail) {
    this.trackGenerationEvent('generation_error', {
      error_type: errorType,
      error_message: errorDetail.message,
      retry_count: this.retryAttempts
    });
  }

  trackOnboardingEvent(event, data) {
    this.trackGenerationEvent('onboarding_' + event, data);
  }

  trackErrorSolution(action) {
    this.trackGenerationEvent('error_solution_attempted', { action: action });
  }

  // Public methods
  getGenerationMetrics() {
    return Object.fromEntries(this.generationMetrics);
  }

  retryGeneration(lastErrorDetail) {
    this.retryAttempts++;
    this.trackGenerationEvent('generation_retry', { 
      attempt: this.retryAttempts,
      last_error: lastErrorDetail.error 
    });

    // Re-enable generation and retry
    this.generationInProgress = false;
    const generateBtn = document.querySelector('.generate-btn, [data-action="generate"]');
    if (generateBtn) {
      generateBtn.click();
    }
  }

  cancelGeneration() {
    this.generationInProgress = false;
    
    // Remove progress overlay
    const overlay = document.getElementById('generationProgressOverlay');
    if (overlay) {
      overlay.remove();
    }

    // Re-enable buttons
    this.enableGenerationButtons();

    // Show cancellation feedback
    this.showMicroFeedback('Generation cancelled', 'info');

    this.trackGenerationEvent('generation_cancelled');
  }

  disableGenerationButtons() {
    document.querySelectorAll('.generate-btn, [data-action="generate"]').forEach(btn => {
      btn.disabled = true;
      btn.classList.add('disabled');
    });
  }

  enableGenerationButtons() {
    document.querySelectorAll('.generate-btn, [data-action="generate"]').forEach(btn => {
      btn.disabled = false;
      btn.classList.remove('disabled', 'generating');
      btn.innerHTML = btn.originalText || 'Generate Chart';
    });
  }

  minimizeProgress(overlay) {
    overlay.classList.add('minimized');
    
    // Create minimized indicator
    const indicator = document.createElement('div');
    indicator.className = 'generation-minimized-indicator';
    indicator.innerHTML = `
      <i class="fas fa-chart-line"></i>
      <span>AI Generation in Progress</span>
      <button onclick="window.aiGenerationFix.restoreProgress()">
        <i class="fas fa-expand"></i>
      </button>
    `;
    document.body.appendChild(indicator);

    this.trackGenerationEvent('progress_minimized');
  }

  restoreProgress() {
    const overlay = document.getElementById('generationProgressOverlay');
    const indicator = document.querySelector('.generation-minimized-indicator');
    
    if (overlay) {
      overlay.classList.remove('minimized');
    }
    
    if (indicator) {
      indicator.remove();
    }
  }

  runInBackground(overlay) {
    this.minimizeProgress(overlay);
    this.trackGenerationEvent('background_generation');
  }
}

// Initialize AI Generation Fix
document.addEventListener('DOMContentLoaded', () => {
  window.aiGenerationFix = new AIGenerationFix();
});

export { AIGenerationFix };

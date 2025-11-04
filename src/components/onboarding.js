// Interactive Onboarding System for VIZOM
class OnboardingManager {
  constructor() {
    this.currentStep = 0;
    this.isOnboarding = false;
    this.steps = [];
    this.overlay = null;
    this.tooltip = null;
    this.skipped = false;
    this.completed = false;
    
    this.init();
  }

  init() {
    this.setupOnboardingSteps();
    this.createOnboardingElements();
    this.checkFirstTimeUser();
    this.setupEventListeners();
  }

  // Define onboarding steps
  setupOnboardingSteps() {
    this.steps = [
      {
        id: 'welcome',
        title: 'Welcome to VIZOM! 🎉',
        content: 'Let\'s take a quick tour to help you create beautiful charts with AI.',
        target: null,
        position: 'center',
        action: 'next',
        showProgress: true,
        canSkip: true
      },
      {
        id: 'chart-type',
        title: 'Choose Your Chart Type',
        content: 'Start by selecting the type of visualization you want to create. Each chart type is optimized for different kinds of data.',
        target: '.chart-picker',
        position: 'right',
        action: 'highlight',
        highlightPadding: 10,
        showProgress: true,
        canSkip: true
      },
      {
        id: 'data-input',
        title: 'Describe Your Data',
        content: 'Type or paste your data in plain English. You can also upload a CSV file or use one of our templates.',
        target: '#data-input',
        position: 'left',
        action: 'focus',
        showProgress: true,
        canSkip: true
      },
      {
        id: 'quick-prompts',
        title: 'Quick Start Examples',
        content: 'Need inspiration? Click these buttons to load example data and see how it works.',
        target: '.quick-prompts',
        position: 'top',
        action: 'demo',
        showProgress: true,
        canSkip: true
      },
      {
        id: 'generate',
        title: 'Generate Your Chart',
        content: 'Click here to create your chart. Our AI will process your data and generate a beautiful visualization.',
        target: '#generate-btn',
        position: 'top',
        action: 'demo',
        showProgress: true,
        canSkip: true
      },
      {
        id: 'preview',
        title: 'See Your Results',
        content: 'Your generated chart appears here. You can export it, save it, or share it with others.',
        target: '.preview-container',
        position: 'left',
        action: 'highlight',
        showProgress: true,
        canSkip: true
      },
      {
        id: 'export',
        title: 'Export and Share',
        content: 'Download your chart in multiple formats or share it directly with your team.',
        target: '.preview-actions',
        position: 'top',
        action: 'highlight',
        showProgress: true,
        canSkip: true
      },
      {
        id: 'accessibility',
        title: 'Accessibility Options',
        content: 'VIZOM is designed for everyone. Click the accessibility icon to adjust contrast, text size, and more.',
        target: '.accessibility-toggle',
        position: 'bottom',
        action: 'highlight',
        showProgress: true,
        canSkip: true
      },
      {
        id: 'completion',
        title: 'You\'re All Set! 🚀',
        content: 'Great job! You now know how to create amazing charts with VIZOM. Start creating or explore more features.',
        target: null,
        position: 'center',
        action: 'complete',
        showProgress: false,
        canSkip: false
      }
    ];
  }

  // Create onboarding overlay and tooltip
  createOnboardingElements() {
    // Create overlay
    this.overlay = document.createElement('div');
    this.overlay.id = 'onboarding-overlay';
    this.overlay.className = 'onboarding-overlay';
    this.overlay.innerHTML = `
      <div class="onboarding-highlight"></div>
    `;
    document.body.appendChild(this.overlay);

    // Create tooltip
    this.tooltip = document.createElement('div');
    this.tooltip.id = 'onboarding-tooltip';
    this.tooltip.className = 'onboarding-tooltip';
    this.tooltip.innerHTML = `
      <div class="onboarding-tooltip-content">
        <div class="onboarding-header">
          <h3 class="onboarding-title"></h3>
          <button class="onboarding-close" aria-label="Close onboarding">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="onboarding-body">
          <p class="onboarding-content"></p>
          <div class="onboarding-progress">
            <div class="progress-dots"></div>
            <div class="progress-text"></div>
          </div>
        </div>
        <div class="onboarding-footer">
          <button class="btn btn-secondary onboarding-skip">Skip Tour</button>
          <div class="onboarding-actions">
            <button class="btn btn-secondary onboarding-prev" disabled>
              <i class="fas fa-arrow-left"></i> Previous
            </button>
            <button class="btn btn-primary onboarding-next">
              Next <i class="fas fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
      <div class="onboarding-tooltip-arrow"></div>
    `;
    document.body.appendChild(this.tooltip);

    this.setupTooltipEvents();
  }

  // Setup tooltip event listeners
  setupTooltipEvents() {
    const closeBtn = this.tooltip.querySelector('.onboarding-close');
    const skipBtn = this.tooltip.querySelector('.onboarding-skip');
    const prevBtn = this.tooltip.querySelector('.onboarding-prev');
    const nextBtn = this.tooltip.querySelector('.onboarding-next');

    closeBtn.addEventListener('click', () => this.skipOnboarding());
    skipBtn.addEventListener('click', () => this.skipOnboarding());
    prevBtn.addEventListener('click', () => this.previousStep());
    nextBtn.addEventListener('click', () => this.nextStep());

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!this.isOnboarding) return;
      
      switch (e.key) {
        case 'Escape':
          this.skipOnboarding();
          break;
        case 'ArrowLeft':
          this.previousStep();
          break;
        case 'ArrowRight':
        case 'Enter':
        case ' ':
          e.preventDefault();
          this.nextStep();
          break;
      }
    });
  }

  // Check if user is first time visitor
  checkFirstTimeUser() {
    const hasSeenOnboarding = localStorage.getItem('vizom_onboarding_completed');
    const hasSeenVersion = localStorage.getItem('vizom_onboarding_version');
    const currentVersion = '2.0.0'; // Update this when onboarding changes

    if (!hasSeenOnboarding || hasSeenVersion !== currentVersion) {
      // Show onboarding after a short delay
      setTimeout(() => {
        this.startOnboarding();
      }, 1000);
    }
  }

  // Start onboarding
  startOnboarding() {
    if (this.isOnboarding || this.completed) return;
    
    this.isOnboarding = true;
    this.currentStep = 0;
    this.showStep();
    
    // Announce to screen readers
    if (window.accessibility) {
      window.accessibility.announce('Onboarding tour started. Use arrow keys to navigate.');
    }
    
    // Track analytics
    if (window.analytics) {
      window.analytics.trackCustomEvent('onboarding_started');
    }
  }

  // Show current step
  showStep() {
    const step = this.steps[this.currentStep];
    if (!step) return;

    // Update overlay
    this.updateOverlay(step);
    
    // Update tooltip
    this.updateTooltip(step);
    
    // Execute step action
    this.executeStepAction(step);
    
    // Update progress
    this.updateProgress();
    
    // Track step view
    if (window.analytics) {
      window.analytics.trackCustomEvent('onboarding_step_viewed', {
        step_id: step.id,
        step_number: this.currentStep + 1
      });
    }
  }

  // Update overlay highlight
  updateOverlay(step) {
    const highlight = this.overlay.querySelector('.onboarding-highlight');
    
    if (step.target) {
      const target = document.querySelector(step.target);
      if (target) {
        const rect = target.getBoundingClientRect();
        const padding = step.highlightPadding || 0;
        
        highlight.style.display = 'block';
        highlight.style.left = `${rect.left - padding}px`;
        highlight.style.top = `${rect.top - padding}px`;
        highlight.style.width = `${rect.width + padding * 2}px`;
        highlight.style.height = `${rect.height + padding * 2}px`;
        highlight.style.borderRadius = window.getComputedStyle(target).borderRadius;
        
        // Scroll target into view
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else {
      highlight.style.display = 'none';
    }
  }

  // Update tooltip content and position
  updateTooltip(step) {
    const title = this.tooltip.querySelector('.onboarding-title');
    const content = this.tooltip.querySelector('.onboarding-content');
    const prevBtn = this.tooltip.querySelector('.onboarding-prev');
    const nextBtn = this.tooltip.querySelector('.onboarding-next');
    const skipBtn = this.tooltip.querySelector('.onboarding-skip');

    title.textContent = step.title;
    content.textContent = step.content;
    
    // Update button states
    prevBtn.disabled = this.currentStep === 0;
    skipBtn.style.display = step.canSkip ? 'block' : 'none';
    
    // Update next button text
    if (step.action === 'complete') {
      nextBtn.innerHTML = 'Get Started <i class="fas fa-check"></i>';
      nextBtn.classList.remove('btn-primary');
      nextBtn.classList.add('btn-success');
    } else if (this.currentStep === this.steps.length - 1) {
      nextBtn.innerHTML = 'Complete <i class="fas fa-check"></i>';
    } else {
      nextBtn.innerHTML = 'Next <i class="fas fa-arrow-right"></i>';
    }

    // Position tooltip
    this.positionTooltip(step);
  }

  // Position tooltip relative to target
  positionTooltip(step) {
    if (step.position === 'center') {
      this.tooltip.style.position = 'fixed';
      this.tooltip.style.top = '50%';
      this.tooltip.style.left = '50%';
      this.tooltip.style.transform = 'translate(-50%, -50%)';
      this.tooltip.classList.add('centered');
    } else {
      const target = document.querySelector(step.target);
      if (target) {
        const rect = target.getBoundingClientRect();
        const tooltipRect = this.tooltip.getBoundingClientRect();
        
        this.tooltip.style.position = 'absolute';
        this.tooltip.classList.remove('centered');
        
        switch (step.position) {
          case 'top':
            this.tooltip.style.bottom = `${window.innerHeight - rect.top + 20}px`;
            this.tooltip.style.left = `${rect.left + rect.width / 2 - tooltipRect.width / 2}px`;
            break;
          case 'bottom':
            this.tooltip.style.top = `${rect.bottom + 20}px`;
            this.tooltip.style.left = `${rect.left + rect.width / 2 - tooltipRect.width / 2}px`;
            break;
          case 'left':
            this.tooltip.style.right = `${window.innerWidth - rect.left + 20}px`;
            this.tooltip.style.top = `${rect.top + rect.height / 2 - tooltipRect.height / 2}px`;
            break;
          case 'right':
            this.tooltip.style.left = `${rect.right + 20}px`;
            this.tooltip.style.top = `${rect.top + rect.height / 2 - tooltipRect.height / 2}px`;
            break;
        }
      }
    }
  }

  // Execute step-specific actions
  executeStepAction(step) {
    switch (step.action) {
      case 'focus':
        const input = document.querySelector(step.target);
        if (input) {
          input.focus();
          // Add pulse animation
          input.classList.add('pulse');
          setTimeout(() => input.classList.remove('pulse'), 2000);
        }
        break;
        
      case 'highlight':
        const target = document.querySelector(step.target);
        if (target) {
          target.classList.add('onboarding-highlight-target');
          setTimeout(() => target.classList.remove('onboarding-highlight-target'), 2000);
        }
        break;
        
      case 'demo':
        this.executeDemo(step.id);
        break;
    }
  }

  // Execute demo actions
  executeDemo(stepId) {
    switch (stepId) {
      case 'quick-prompts':
        // Animate quick prompt buttons
        const prompts = document.querySelectorAll('.prompt-btn');
        prompts.forEach((btn, index) => {
          setTimeout(() => {
            btn.classList.add('pulse');
            setTimeout(() => btn.classList.remove('pulse'), 1000);
          }, index * 200);
        });
        break;
        
      case 'generate':
        // Simulate button hover
        const generateBtn = document.querySelector('#generate-btn');
        if (generateBtn) {
          generateBtn.classList.add('pulse');
          setTimeout(() => generateBtn.classList.remove('pulse'), 2000);
        }
        break;
    }
  }

  // Update progress indicators
  updateProgress() {
    const progressDots = this.tooltip.querySelector('.progress-dots');
    const progressText = this.tooltip.querySelector('.progress-text');
    
    if (this.steps[this.currentStep].showProgress) {
      // Create dots
      progressDots.innerHTML = '';
      this.steps.forEach((step, index) => {
        if (step.showProgress) {
          const dot = document.createElement('div');
          dot.className = 'progress-dot';
          if (index === this.currentStep) {
            dot.classList.add('active');
          }
          progressDots.appendChild(dot);
        }
      });
      
      // Update text
      const currentProgress = this.steps.slice(0, this.currentStep + 1).filter(s => s.showProgress).length;
      const totalProgress = this.steps.filter(s => s.showProgress).length;
      progressText.textContent = `${currentProgress} of ${totalProgress}`;
      
      progressDots.style.display = 'flex';
      progressText.style.display = 'block';
    } else {
      progressDots.style.display = 'none';
      progressText.style.display = 'none';
    }
  }

  // Navigation methods
  nextStep() {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
      this.showStep();
    } else {
      this.completeOnboarding();
    }
  }

  previousStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.showStep();
    }
  }

  skipOnboarding() {
    this.skipped = true;
    this.hideOnboarding();
    
    // Mark as seen to not show again
    localStorage.setItem('vizom_onboarding_completed', 'true');
    localStorage.setItem('vizom_onboarding_version', '2.0.0');
    
    // Track analytics
    if (window.analytics) {
      window.analytics.trackCustomEvent('onboarding_skipped');
    }
    
    // Announce to screen readers
    if (window.accessibility) {
      window.accessibility.announce('Onboarding tour skipped');
    }
  }

  completeOnboarding() {
    this.completed = true;
    this.hideOnboarding();
    
    // Mark as completed
    localStorage.setItem('vizom_onboarding_completed', 'true');
    localStorage.setItem('vizom_onboarding_version', '2.0.0');
    
    // Show completion message
    this.showCompletionMessage();
    
    // Track analytics
    if (window.analytics) {
      window.analytics.trackCustomEvent('onboarding_completed');
    }
    
    // Announce to screen readers
    if (window.accessibility) {
      window.accessibility.announce('Onboarding tour completed successfully');
    }
  }

  // Hide onboarding
  hideOnboarding() {
    this.isOnboarding = false;
    this.overlay.classList.remove('show');
    this.tooltip.classList.remove('show');
    
    // Remove any highlight classes
    document.querySelectorAll('.onboarding-highlight-target').forEach(el => {
      el.classList.remove('onboarding-highlight-target');
    });
  }

  // Show completion message
  showCompletionMessage() {
    const message = document.createElement('div');
    message.className = 'onboarding-completion-message';
    message.innerHTML = `
      <div class="completion-icon">
        <i class="fas fa-check-circle"></i>
      </div>
      <div class="completion-text">
        <h4>Tour Completed!</h4>
        <p>You're ready to create amazing charts. Need help? Click the help button anytime.</p>
      </div>
      <button class="btn btn-primary" onclick="this.parentElement.remove()">
        Start Creating
      </button>
    `;
    
    document.body.appendChild(message);
    
    // Animate in
    setTimeout(() => message.classList.add('show'), 10);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      if (message.parentElement) {
        message.classList.remove('show');
        setTimeout(() => message.remove(), 300);
      }
    }, 5000);
  }

  // Setup additional event listeners
  setupEventListeners() {
    // Start onboarding button (if exists)
    const startBtn = document.getElementById('start-onboarding');
    if (startBtn) {
      startBtn.addEventListener('click', () => this.startOnboarding());
    }

    // Help button
    const helpBtn = document.getElementById('help-button');
    if (helpBtn) {
      helpBtn.addEventListener('click', () => this.startOnboarding());
    }

    // Window resize - reposition tooltip
    window.addEventListener('resize', () => {
      if (this.isOnboarding) {
        const step = this.steps[this.currentStep];
        this.positionTooltip(step);
        this.updateOverlay(step);
      }
    });
  }

  // Public methods
  restartOnboarding() {
    this.currentStep = 0;
    this.completed = false;
    this.skipped = false;
    localStorage.removeItem('vizom_onboarding_completed');
    this.startOnboarding();
  }

  goToStep(stepId) {
    const stepIndex = this.steps.findIndex(step => step.id === stepId);
    if (stepIndex !== -1) {
      this.currentStep = stepIndex;
      this.showStep();
    }
  }

  // Get onboarding progress
  getProgress() {
    return {
      currentStep: this.currentStep + 1,
      totalSteps: this.steps.length,
      completed: this.completed,
      skipped: this.skipped
    };
  }
}

// Initialize onboarding manager
document.addEventListener('DOMContentLoaded', () => {
  window.onboarding = new OnboardingManager();
});

export { OnboardingManager };

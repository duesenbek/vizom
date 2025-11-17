// User Journey Optimizer - Template Flow Enhancement & New User Onboarding
class UserJourneyOptimizer {
  constructor() {
    this.currentUserType = null;
    this.onboardingProgress = new Map();
    this.journeyMetrics = new Map();
    this.dropOffAnalysis = new Map();
    this.successStates = new Map();
    this.guidedTourActive = false;
    this.tourStep = 0;
    this.celebrationShown = new Set();
    
    this.init();
  }

  init() {
    this.setupUserTypeDetection();
    this.setupTemplateFlowOptimization();
    this.setupNewUserOnboarding();
    this.setupDropOffPrevention();
    this.setupSuccessCelebrations();
    this.setupErrorRecovery();
    this.setupJourneyAnalytics();
    this.setupPersonalization();
    this.setupProgressiveDisclosure();
    this.setupContextualHelp();
  }

  // Setup user type detection
  setupUserTypeDetection() {
    this.detectUserType();
    this.setupUserTypePreferences();
  }

  // Detect user type (new vs returning)
  detectUserType() {
    const hasVisited = localStorage.getItem('has_visited_before');
    const visitCount = parseInt(localStorage.getItem('visit_count') || '0');
    const lastVisit = localStorage.getItem('last_visit');
    const hasGeneratedCharts = localStorage.getItem('has_generated_charts');
    
    if (!hasVisited) {
      this.currentUserType = 'new';
      this.initiateNewUserFlow();
    } else if (visitCount <= 3 && !hasGeneratedCharts) {
      this.currentUserType = 'early';
      this.initiateEarlyUserFlow();
    } else {
      this.currentUserType = 'returning';
      this.initiateReturningUserFlow();
    }
    
    // Update visit tracking
    localStorage.setItem('has_visited_before', 'true');
    localStorage.setItem('visit_count', (visitCount + 1).toString());
    localStorage.setItem('last_visit', Date.now().toString());
  }

  // Setup user type preferences
  setupUserTypePreferences() {
    const preferences = {
      'new': {
        showGuidedTour: true,
        showTips: true,
        simplifyInterface: true,
        enableQuickStart: true
      },
      'early': {
        showGuidedTour: false,
        showTips: true,
        simplifyInterface: true,
        enableQuickStart: false
      },
      'returning': {
        showGuidedTour: false,
        showTips: false,
        simplifyInterface: false,
        enableQuickStart: false
      }
    };
    
    this.userPreferences = preferences[this.currentUserType];
    this.applyUserPreferences();
  }

  // Apply user preferences
  applyUserPreferences() {
    if (this.userPreferences.showGuidedTour && this.currentUserType === 'new') {
      this.scheduleGuidedTour();
    }
    
    if (this.userPreferences.simplifyInterface) {
      this.simplifyInterface();
    }
    
    if (this.userPreferences.showTips) {
      this.enableContextualTips();
    }
  }

  // Setup Template Flow Optimization (6 Steps)
  setupTemplateFlowOptimization() {
    this.templateFlow = {
      name: 'Template Creation Journey',
      description: 'Create beautiful charts from professional templates',
      steps: [
        {
          id: 'template-discovery',
          name: 'Discover Templates',
          description: 'Find the perfect template for your data',
          estimatedTime: '1-2 minutes',
          painPoint: 'Poor discoverability',
          solution: 'EnhancedSearchAndFiltering',
          components: ['SmartSearch', 'CategoryFilter', 'TrendingTemplates', 'PersonalizedRecommendations']
        },
        {
          id: 'template-preview',
          name: 'Preview Template',
          description: 'See how your data looks in the template',
          estimatedTime: '1 minute',
          painPoint: 'Limited preview capabilities',
          solution: 'InteractivePreviewSystem',
          components: ['LivePreview', 'ResponsiveTesting', 'DataMapping', 'CustomizationPreview']
        },
        {
          id: 'customization',
          name: 'Customize Template',
          description: 'Make the template your own',
          estimatedTime: '3-10 minutes',
          painPoint: 'Template customization complexity',
          solution: 'GuidedCustomization',
          components: ['StepByStepGuide', 'SmartSuggestions', 'QuickCustomize', 'AdvancedOptions']
        },
        {
          id: 'generation',
          name: 'Generate Chart',
          description: 'Create your final chart with custom data',
          estimatedTime: '30 seconds - 1 minute',
          components: ['ProgressIndicator', 'ErrorHandling', 'PreviewOptions', 'QualityCheck']
        },
        {
          id: 'final-adjustments',
          name: 'Final Adjustments',
          description: 'Perfect your chart before export',
          estimatedTime: '1-2 minutes',
          components: ['QuickEdits', 'AccessibilityCheck', 'ExportPreview', 'QualityAssurance']
        },
        {
          id: 'save-export',
          name: 'Save & Export',
          description: 'Save your work and share with others',
          estimatedTime: '30 seconds',
          components: ['QuickExport', 'ShareOptions', 'SaveToLibrary', 'ExportHistory']
        }
      ],
      dropOffPoints: [
        { step: 'template-discovery', rate: 0.15, reason: 'overwhelmed_by_options' },
        { step: 'template-preview', rate: 0.10, reason: 'preview_not_clear' },
        { step: 'customization', rate: 0.25, reason: 'too_complex' },
        { step: 'generation', rate: 0.08, reason: 'generation_failed' }
      ]
    };
  }

  // Setup New User Onboarding (5 Steps)
  setupNewUserOnboarding() {
    this.newUserFlow = {
      name: 'First Time User Journey',
      description: 'Welcome and guide new users to their first success',
      steps: [
        {
          id: 'value-proposition',
          name: 'Understand Value',
          description: 'Learn what VIZOM can do for you',
          estimatedTime: '2 minutes',
          components: ['WelcomeVideo', 'ValueProposition', 'UseCaseExamples', 'SuccessStories']
        },
        {
          id: 'guided-first-use',
          name: 'Guided First Use',
          description: 'Step-by-step guidance to create your first chart',
          estimatedTime: '5-10 minutes',
          components: ['InteractiveTutorial', 'StepByStepGuide', 'LiveAssistance', 'ProgressTracking']
        },
        {
          id: 'success-celebration',
          name: 'Success Celebration',
          description: 'Celebrate your first chart creation',
          estimatedTime: '1 minute',
          components: ['CelebrationAnimation', 'AchievementUnlocked', 'ShareSuccess', 'NextSteps']
        },
        {
          id: 'feature-exploration',
          name: 'Explore Features',
          description: 'Discover advanced features and capabilities',
          estimatedTime: '3-5 minutes',
          components: ['FeatureTour', 'AdvancedTips', 'UseCaseSuggestions', 'PersonalizedRecommendations']
        },
        {
          id: 'repeat-use',
          name: 'Repeat Use',
          description: 'Create your next chart with confidence',
          estimatedTime: '2-3 minutes',
          components: ['QuickStart', 'TemplateMemory', 'RecentProjects', 'ProductivityTips']
        }
      ],
      gaps: [
        'No guided tour for new users',
        'Missing success celebration',
        'Poor error recovery for failed first attempts'
      ]
    };
  }

  // Initiate new user flow
  initiateNewUserFlow() {
    this.showWelcomeExperience();
    this.startValueProposition();
    this.setupFirstTimeGuidance();
  }

  // Show welcome experience
  showWelcomeExperience() {
    const welcomeModal = this.createWelcomeModal();
    document.body.appendChild(welcomeModal);
    
    // Show modal after a short delay
    setTimeout(() => {
      welcomeModal.style.display = 'flex';
      this.trackJourneyEvent('welcome_shown');
    }, 1000);
  }

  // Create welcome modal
  createWelcomeModal() {
    const modal = document.createElement('div');
    modal.className = 'welcome-modal';
    modal.innerHTML = `
      <div class="welcome-content">
        <div class="welcome-header">
          <div class="welcome-logo">
            <i class="fas fa-chart-line"></i>
          </div>
          <h1>Welcome to VIZOM</h1>
          <p>Create beautiful charts and visualizations in minutes</p>
        </div>
        
        <div class="welcome-value-props">
          <div class="value-prop">
            <i class="fas fa-rocket"></i>
            <h3>Lightning Fast</h3>
            <p>Go from data to chart in under 5 minutes</p>
          </div>
          
          <div class="value-prop">
            <i class="fas fa-magic"></i>
            <h3>AI-Powered</h3>
            <p>Smart suggestions and automated styling</p>
          </div>
          
          <div class="value-prop">
            <i class="fas fa-palette"></i>
            <h3>Beautiful Designs</h3>
            <p>Professional templates for every need</p>
          </div>
        </div>
        
        <div class="welcome-actions">
          <button class="welcome-btn primary" id="startTourBtn">
            <i class="fas fa-play"></i>
            Take Quick Tour (2 min)
          </button>
          <button class="welcome-btn secondary" id="skipTourBtn">
            <i class="fas fa-arrow-right"></i>
            Start Creating
          </button>
        </div>
        
        <div class="welcome-testimonial">
          <blockquote>
            "VIZOM helped me create professional charts for my presentation in just 3 minutes!"
          </blockquote>
          <cite>- Sarah K., Marketing Manager</cite>
        </div>
      </div>
    `;
    
    // Setup event handlers
    this.setupWelcomeEvents(modal);
    
    return modal;
  }

  // Setup welcome events
  setupWelcomeEvents(modal) {
    const startTourBtn = modal.querySelector('#startTourBtn');
    const skipTourBtn = modal.querySelector('#skipTourBtn');
    
    startTourBtn.addEventListener('click', () => {
      modal.remove();
      this.startGuidedTour();
      this.trackJourneyEvent('tour_started');
    });
    
    skipTourBtn.addEventListener('click', () => {
      modal.remove();
      this.startQuickCreation();
      this.trackJourneyEvent('tour_skipped');
    });
  }

  // Start guided tour
  startGuidedTour() {
    this.guidedTourActive = true;
    this.tourStep = 0;
    
    const tourSteps = [
      {
        target: '.template-discovery',
        title: 'Discover Templates',
        content: 'Start by browsing our collection of professional templates. Use the search bar to find exactly what you need.',
        position: 'bottom'
      },
      {
        target: '.template-categories',
        title: 'Browse by Category',
        content: 'Templates are organized by industry and use case. Click on any category to see relevant templates.',
        position: 'right'
      },
      {
        target: '.template-preview',
        title: 'Preview Your Choice',
        content: 'See how your data will look in the template. Test with sample data or upload your own.',
        position: 'left'
      },
      {
        target: '.customization-panel',
        title: 'Make It Yours',
        content: 'Customize colors, fonts, and styling to match your brand. We\'ll guide you through each option.',
        position: 'top'
      },
      {
        target: '.export-options',
        title: 'Export & Share',
        content: 'Save your chart in multiple formats or share directly with your team. One click is all it takes!',
        position: 'top'
      }
    ];
    
    this.showTourStep(tourSteps[0]);
    this.setupTourNavigation(tourSteps);
  }

  // Show tour step
  showTourStep(step) {
    // Remove existing tour tooltip
    const existingTooltip = document.querySelector('.tour-tooltip');
    if (existingTooltip) {
      existingTooltip.remove();
    }
    
    // Create new tooltip
    const tooltip = document.createElement('div');
    tooltip.className = 'tour-tooltip';
    tooltip.innerHTML = `
      <div class="tour-tooltip-content">
        <div class="tour-header">
          <h4>${step.title}</h4>
          <button class="tour-close" id="tourCloseBtn">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="tour-body">
          <p>${step.content}</p>
        </div>
        <div class="tour-footer">
          <div class="tour-progress">
            Step ${this.tourStep + 1} of 5
          </div>
          <div class="tour-actions">
            <button class="tour-btn secondary" id="tourSkipBtn">Skip Tour</button>
            <button class="tour-btn primary" id="tourNextBtn">Next</button>
          </div>
        </div>
      </div>
      <div class="tour-tooltip-arrow"></div>
    `;
    
    // Position tooltip
    const target = document.querySelector(step.target);
    if (target) {
      this.positionTooltip(tooltip, target, step.position);
      document.body.appendChild(tooltip);
      
      // Highlight target
      target.classList.add('tour-highlight');
      
      // Scroll into view
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    // Setup tour events
    this.setupTourStepEvents(tooltip, step);
  }

  // Position tooltip
  positionTooltip(tooltip, target, position) {
    const targetRect = target.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    
    // Simple positioning - in production, use more sophisticated positioning
    switch (position) {
      case 'top':
        tooltip.style.top = `${targetRect.top - tooltipRect.height - 10}px`;
        tooltip.style.left = `${targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2)}px`;
        break;
      case 'bottom':
        tooltip.style.top = `${targetRect.bottom + 10}px`;
        tooltip.style.left = `${targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2)}px`;
        break;
      case 'left':
        tooltip.style.top = `${targetRect.top + (targetRect.height / 2) - (tooltipRect.height / 2)}px`;
        tooltip.style.left = `${targetRect.left - tooltipRect.width - 10}px`;
        break;
      case 'right':
        tooltip.style.top = `${targetRect.top + (targetRect.height / 2) - (tooltipRect.height / 2)}px`;
        tooltip.style.left = `${targetRect.right + 10}px`;
        break;
    }
  }

  // Setup tour step events
  setupTourStepEvents(tooltip, step) {
    const closeBtn = tooltip.querySelector('#tourCloseBtn');
    const skipBtn = tooltip.querySelector('#tourSkipBtn');
    const nextBtn = tooltip.querySelector('#tourNextBtn');
    
    closeBtn.addEventListener('click', () => {
      this.endTour();
    });
    
    skipBtn.addEventListener('click', () => {
      this.endTour();
      this.trackJourneyEvent('tour_skipped_early');
    });
    
    nextBtn.addEventListener('click', () => {
      this.nextTourStep();
    });
  }

  // Next tour step
  nextTourStep() {
    // Remove current highlight
    document.querySelectorAll('.tour-highlight').forEach(el => {
      el.classList.remove('tour-highlight');
    });
    
    this.tourStep++;
    
    if (this.tourStep < 5) {
      // Show next step
      const tourSteps = [
        {
          target: '.template-discovery',
          title: 'Discover Templates',
          content: 'Start by browsing our collection of professional templates. Use the search bar to find exactly what you need.',
          position: 'bottom'
        },
        {
          target: '.template-categories',
          title: 'Browse by Category',
          content: 'Templates are organized by industry and use case. Click on any category to see relevant templates.',
          position: 'right'
        },
        {
          target: '.template-preview',
          title: 'Preview Your Choice',
          content: 'See how your data will look in the template. Test with sample data or upload your own.',
          position: 'left'
        },
        {
          target: '.customization-panel',
          title: 'Make It Yours',
          content: 'Customize colors, fonts, and styling to match your brand. We\'ll guide you through each option.',
          position: 'top'
        },
        {
          target: '.export-options',
          title: 'Export & Share',
          content: 'Save your chart in multiple formats or share directly with your team. One click is all it takes!',
          position: 'top'
        }
      ];
      
      this.showTourStep(tourSteps[this.tourStep]);
    } else {
      this.endTour();
      this.showTourCompletion();
    }
  }

  // End tour
  endTour() {
    this.guidedTourActive = false;
    
    // Remove tour elements
    document.querySelectorAll('.tour-tooltip, .tour-highlight').forEach(el => {
      el.remove();
    });
    
    this.trackJourneyEvent('tour_completed');
  }

  // Show tour completion
  showTourCompletion() {
    const completionModal = this.createTourCompletionModal();
    document.body.appendChild(completionModal);
    
    setTimeout(() => {
      completionModal.style.display = 'flex';
    }, 500);
  }

  // Create tour completion modal
  createTourCompletionModal() {
    const modal = document.createElement('div');
    modal.className = 'tour-completion-modal';
    modal.innerHTML = `
      <div class="completion-content">
        <div class="completion-celebration">
          <div class="celebration-icon">
            <i class="fas fa-trophy"></i>
          </div>
          <h2>Tour Completed!</h2>
          <p>You're ready to create amazing charts</p>
        </div>
        
        <div class="completion-next">
          <h3>Ready to create your first chart?</h3>
          <div class="next-options">
            <button class="next-btn primary" id="createFirstChartBtn">
              <i class="fas fa-plus"></i>
              Create First Chart
            </button>
            <button class="next-btn secondary" id="browseTemplatesBtn">
              <i class="fas fa-search"></i>
              Browse Templates
            </button>
          </div>
        </div>
      </div>
    `;
    
    // Setup events
    const createBtn = modal.querySelector('#createFirstChartBtn');
    const browseBtn = modal.querySelector('#browseTemplatesBtn');
    
    createBtn.addEventListener('click', () => {
      modal.remove();
      this.startFirstChartCreation();
    });
    
    browseBtn.addEventListener('click', () => {
      modal.remove();
      this.navigateToTemplates();
    });
    
    return modal;
  }

  // Setup drop-off prevention
  setupDropOffPrevention() {
    this.setupDropOffDetection();
    this.setupInterventionStrategies();
    this.setupProgressRecovery();
  }

  // Setup drop-off detection
  setupDropOffDetection() {
    // Track user inactivity
    let inactivityTimer;
    
    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        this.handleUserInactivity();
      }, 30000); // 30 seconds
    };
    
    document.addEventListener('mousemove', resetTimer);
    document.addEventListener('keypress', resetTimer);
    document.addEventListener('click', resetTimer);
    document.addEventListener('scroll', resetTimer);
    
    resetTimer();
  }

  // Handle user inactivity
  handleUserInactivity() {
    const currentStep = this.getCurrentJourneyStep();
    
    if (currentStep === 'template-discovery') {
      this.showDiscoveryHelp();
    } else if (currentStep === 'customization') {
      this.showCustomizationHelp();
    } else if (currentStep === 'generation' && this.isGenerationInProgress()) {
      this.showGenerationReassurance();
    }
    
    this.trackJourneyEvent('inactivity_detected', { step: currentStep });
  }

  // Show discovery help
  showDiscoveryHelp() {
    const helpTooltip = this.createHelpTooltip({
      title: 'Need help finding a template?',
      content: 'Try searching for "sales report" or "dashboard" or browse by category on the left.',
      position: 'bottom',
      target: '.template-search'
    });
    
    document.body.appendChild(helpTooltip);
    
    // Auto-hide after 10 seconds
    setTimeout(() => {
      helpTooltip.remove();
    }, 10000);
  }

  // Show customization help
  showCustomizationHelp() {
    const helpTooltip = this.createHelpTooltip({
      title: 'Customization made easy',
      content: 'Start with the Basic tab for colors and fonts. Advanced options are available when you need them.',
      position: 'right',
      target: '.customization-tabs'
    });
    
    document.body.appendChild(helpTooltip);
    
    setTimeout(() => {
      helpTooltip.remove();
    }, 10000);
  }

  // Show generation reassurance
  showGenerationReassurance() {
    const reassurance = document.createElement('div');
    reassurance.className = 'generation-reassurance';
    reassurance.innerHTML = `
      <div class="reassurance-content">
        <i class="fas fa-info-circle"></i>
        <span>Your chart is being generated. This usually takes 30-60 seconds.</span>
      </div>
    `;
    
    const progressContainer = document.querySelector('.generation-progress');
    if (progressContainer) {
      progressContainer.appendChild(reassurance);
    }
  }

  // Setup success celebrations
  setupSuccessCelebrations() {
    this.setupFirstChartCelebration();
    this.setupMilestoneCelebrations();
    this.setupAchievementSystem();
  }

  // Setup first chart celebration
  setupFirstChartCelebration() {
    // Listen for first successful chart generation
    document.addEventListener('chartGenerated', (e) => {
      const hasGeneratedBefore = localStorage.getItem('has_generated_charts');
      
      if (!hasGeneratedBefore) {
        this.celebrateFirstChart();
        localStorage.setItem('has_generated_charts', 'true');
      }
    });
  }

  // Celebrate first chart
  celebrateFirstChart() {
    const celebration = this.createCelebrationModal({
      type: 'first-chart',
      title: 'Congratulations!',
      message: 'You\'ve created your first chart with VIZOM!',
      achievement: 'First Chart Creator',
      stats: {
        time: 'Under 5 minutes',
        quality: 'Professional grade',
        next: 'Create more charts'
      }
    });
    
    document.body.appendChild(celebration);
    
    setTimeout(() => {
      celebration.style.display = 'flex';
      this.triggerConfetti();
    }, 1000);
    
    this.trackJourneyEvent('first_chart_celebrated');
  }

  // Create celebration modal
  createCelebrationModal(config) {
    const modal = document.createElement('div');
    modal.className = 'celebration-modal';
    modal.innerHTML = `
      <div class="celebration-content">
        <div class="celebration-header">
          <div class="celebration-icon">
            <i class="fas fa-trophy"></i>
          </div>
          <h2>${config.title}</h2>
          <p>${config.message}</p>
        </div>
        
        <div class="celebration-achievement">
          <div class="achievement-badge">
            <i class="fas fa-medal"></i>
            <span>${config.achievement}</span>
          </div>
        </div>
        
        <div class="celebration-stats">
          ${Object.entries(config.stats).map(([key, value]) => `
            <div class="stat-item">
              <span class="stat-label">${key.charAt(0).toUpperCase() + key.slice(1)}:</span>
              <span class="stat-value">${value}</span>
            </div>
          `).join('')}
        </div>
        
        <div class="celebration-actions">
          <button class="celebration-btn primary" id="shareSuccessBtn">
            <i class="fas fa-share"></i>
            Share Your Success
          </button>
          <button class="celebration-btn secondary" id="continueBtn">
            <i class="fas fa-arrow-right"></i>
            Continue Creating
          </button>
        </div>
      </div>
    `;
    
    // Setup events
    this.setupCelebrationEvents(modal, config);
    
    return modal;
  }

  // Setup celebration events
  setupCelebrationEvents(modal, config) {
    const shareBtn = modal.querySelector('#shareSuccessBtn');
    const continueBtn = modal.querySelector('#continueBtn');
    
    shareBtn.addEventListener('click', () => {
      this.shareSuccess(config);
      modal.remove();
    });
    
    continueBtn.addEventListener('click', () => {
      modal.remove();
      this.continueJourney();
    });
  }

  // Trigger confetti effect
  triggerConfetti() {
    // Simple confetti implementation
    const confettiContainer = document.createElement('div');
    confettiContainer.className = 'confetti-container';
    
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.animationDelay = Math.random() * 3 + 's';
      confetti.style.backgroundColor = this.getRandomColor();
      confettiContainer.appendChild(confetti);
    }
    
    document.body.appendChild(confettiContainer);
    
    // Remove after animation
    setTimeout(() => {
      confettiContainer.remove();
    }, 5000);
  }

  // Get random color
  getRandomColor() {
    const colors = ['#0ea5e9', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  // Setup error recovery
  setupErrorRecovery() {
    this.setupFirstAttemptRecovery();
    this.setupGenerationErrorRecovery();
    this.setupDataErrorRecovery();
  }

  // Setup first attempt recovery
  setupFirstAttemptRecovery() {
    document.addEventListener('generationFailed', (e) => {
      const hasGeneratedBefore = localStorage.getItem('has_generated_charts');
      
      if (!hasGeneratedBefore) {
        this.handleFirstAttemptFailure(e.detail);
      }
    });
  }

  // Handle first attempt failure
  handleFirstAttemptFailure(errorDetail) {
    const recoveryModal = this.createRecoveryModal({
      title: 'Don\'t worry! Let\'s fix this together.',
      message: 'First attempts can be tricky. We\'ll help you succeed.',
      error: errorDetail.error,
      solutions: [
        {
          title: 'Check Your Data',
          description: 'Make sure your data is clean and properly formatted.',
          action: () => this.showDataFormatGuide()
        },
        {
          title: 'Try a Simpler Template',
          description: 'Start with a basic template and build from there.',
          action: () => this.suggestSimplerTemplate()
        },
        {
          title: 'Get Live Help',
          description: 'Chat with our support team for immediate assistance.',
          action: () => this.startLiveSupport()
        }
      ]
    });
    
    document.body.appendChild(recoveryModal);
    
    setTimeout(() => {
      recoveryModal.style.display = 'flex';
    }, 1000);
    
    this.trackJourneyEvent('first_attempt_failed', { error: errorDetail.error });
  }

  // Create recovery modal
  createRecoveryModal(config) {
    const modal = document.createElement('div');
    modal.className = 'recovery-modal';
    modal.innerHTML = `
      <div class="recovery-content">
        <div class="recovery-header">
          <div class="recovery-icon">
            <i class="fas fa-life-ring"></i>
          </div>
          <h2>${config.title}</h2>
          <p>${config.message}</p>
        </div>
        
        <div class="recovery-error">
          <div class="error-details">
            <strong>Error:</strong> ${config.error}
          </div>
        </div>
        
        <div class="recovery-solutions">
          <h3>Here\'s how we can fix this:</h3>
          <div class="solutions-list">
            ${config.solutions.map((solution, index) => `
              <div class="solution-card" data-solution="${index}">
                <div class="solution-icon">
                  <i class="fas fa-lightbulb"></i>
                </div>
                <div class="solution-content">
                  <h4>${solution.title}</h4>
                  <p>${solution.description}</p>
                </div>
                <button class="solution-btn" data-index="${index}">
                  Try This
                </button>
              </div>
            `).join('')}
          </div>
        </div>
        
        <div class="recovery-actions">
          <button class="recovery-btn secondary" id="skipRecoveryBtn">
            I\'ll try again later
          </button>
        </div>
      </div>
    `;
    
    // Setup events
    this.setupRecoveryEvents(modal, config);
    
    return modal;
  }

  // Setup recovery events
  setupRecoveryEvents(modal, config) {
    const solutionBtns = modal.querySelectorAll('.solution-btn');
    const skipBtn = modal.querySelector('#skipRecoveryBtn');
    
    solutionBtns.forEach((btn, index) => {
      btn.addEventListener('click', () => {
        const solution = config.solutions[index];
        solution.action();
        modal.remove();
        this.trackJourneyEvent('recovery_solution_selected', { solution: solution.title });
      });
    });
    
    skipBtn.addEventListener('click', () => {
      modal.remove();
      this.trackJourneyEvent('recovery_skipped');
    });
  }

  // Setup journey analytics
  setupJourneyAnalytics() {
    this.trackJourneyStart();
    this.setupStepTracking();
    this.setupDropOffTracking();
    this.setupSuccessTracking();
  }

  // Track journey start
  trackJourneyStart() {
    this.trackJourneyEvent('journey_started', {
      user_type: this.currentUserType,
      timestamp: Date.now(),
      url: window.location.href
    });
  }

  // Setup step tracking
  setupStepTracking() {
    // Track time spent in each step
    const stepObserver = new MutationObserver(() => {
      const currentStep = this.getCurrentJourneyStep();
      if (currentStep !== this.lastTrackedStep) {
        if (this.lastTrackedStep) {
          this.trackStepCompletion(this.lastTrackedStep);
        }
        this.trackStepStart(currentStep);
        this.lastTrackedStep = currentStep;
      }
    });
    
    stepObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class']
    });
  }

  // Track step start
  trackStepStart(stepId) {
    this.stepStartTime = Date.now();
    this.trackJourneyEvent('step_started', { step_id: stepId });
  }

  // Track step completion
  trackStepCompletion(stepId) {
    const duration = Date.now() - this.stepStartTime;
    this.trackJourneyEvent('step_completed', { 
      step_id: stepId, 
      duration: duration 
    });
    
    // Update metrics
    const metrics = this.journeyMetrics.get(stepId) || {};
    metrics.averageDuration = ((metrics.averageDuration || 0) + duration) / 2;
    metrics.completionCount = (metrics.completionCount || 0) + 1;
    this.journeyMetrics.set(stepId, metrics);
  }

  // Setup drop-off tracking
  setupDropOffTracking() {
    // Track page unload for drop-off analysis
    window.addEventListener('beforeunload', () => {
      const currentStep = this.getCurrentJourneyStep();
      this.trackJourneyEvent('drop_off', { 
        step_id: currentStep,
        time_spent: Date.now() - (this.stepStartTime || Date.now())
      });
    });
    
    // Track session timeout
    let sessionTimer;
    const resetSessionTimer = () => {
      clearTimeout(sessionTimer);
      sessionTimer = setTimeout(() => {
        this.trackJourneyEvent('session_timeout');
      }, 30 * 60 * 1000); // 30 minutes
    };
    
    document.addEventListener('mousemove', resetSessionTimer);
    document.addEventListener('keypress', resetSessionTimer);
    resetSessionTimer();
  }

  // Setup success tracking
  setupSuccessTracking() {
    document.addEventListener('chartGenerated', () => {
      this.trackJourneyEvent('generation_success');
    });
    
    document.addEventListener('chartExported', () => {
      this.trackJourneyEvent('export_success');
    });
    
    document.addEventListener('templateSelected', () => {
      this.trackJourneyEvent('template_selected');
    });
  }

  // Track journey event
  trackJourneyEvent(eventName, data = {}) {
    if (window.analytics) {
      window.analytics.trackCustomEvent(eventName, {
        user_type: this.currentUserType,
        journey_type: this.getCurrentJourneyType(),
        ...data
      });
    }
    
    // Store in local storage for analysis
    const events = JSON.parse(localStorage.getItem('journey_events') || '[]');
    events.push({
      event: eventName,
      data: data,
      timestamp: Date.now()
    });
    
    // Keep only last 100 events
    if (events.length > 100) {
      events.shift();
    }
    
    localStorage.setItem('journey_events', JSON.stringify(events));
  }

  // Get current journey step
  getCurrentJourneyStep() {
    // Implementation would detect current step based on URL/DOM
    const path = window.location.pathname;
    
    if (path.includes('/templates')) return 'template-discovery';
    if (path.includes('/preview')) return 'template-preview';
    if (path.includes('/customize')) return 'customization';
    if (path.includes('/generate')) return 'generation';
    if (path.includes('/export')) return 'save-export';
    
    return 'unknown';
  }

  // Get current journey type
  getCurrentJourneyType() {
    const path = window.location.pathname;
    return path.includes('/templates') ? 'template-flow' : 'chart-creation';
  }

  // Setup personalization
  setupPersonalization() {
    this.setupPersonalizedRecommendations();
    this.setupAdaptiveInterface();
    this.setupSmartDefaults();
  }

  // Setup personalized recommendations
  setupPersonalizedRecommendations() {
    const userHistory = this.getUserHistory();
    const recommendations = this.generateRecommendations(userHistory);
    
    this.displayRecommendations(recommendations);
  }

  // Get user history
  getUserHistory() {
    return JSON.parse(localStorage.getItem('user_history') || '{}');
  }

  // Generate recommendations
  generateRecommendations(history) {
    const recommendations = [];
    
    if (history.industry === 'marketing') {
      recommendations.push({
        type: 'template',
        title: 'Marketing Dashboard Templates',
        description: 'Perfect for marketing reports and presentations'
      });
    }
    
    if (history.preferredChartType === 'bar') {
      recommendations.push({
        type: 'tutorial',
        title: 'Master Bar Charts',
        description: 'Learn advanced bar chart customization'
      });
    }
    
    return recommendations;
  }

  // Display recommendations
  displayRecommendations(recommendations) {
    const container = document.querySelector('.recommendations-panel');
    if (!container) return;
    
    container.innerHTML = `
      <h3>Recommended for You</h3>
      <div class="recommendations-list">
        ${recommendations.map(rec => `
          <div class="recommendation-card">
            <div class="rec-icon">
              <i class="fas fa-${rec.type === 'template' ? 'layer-group' : 'graduation-cap'}"></i>
            </div>
            <div class="rec-content">
              <h4>${rec.title}</h4>
              <p>${rec.description}</p>
            </div>
            <button class="rec-btn">View</button>
          </div>
        `).join('')}
      </div>
    `;
  }

  // Utility methods
  createHelpTooltip(config) {
    const tooltip = document.createElement('div');
    tooltip.className = 'help-tooltip';
    tooltip.innerHTML = `
      <div class="help-tooltip-content">
        <h4>${config.title}</h4>
        <p>${config.content}</p>
        <button class="help-close">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `;
    
    const closeBtn = tooltip.querySelector('.help-close');
    closeBtn.addEventListener('click', () => {
      tooltip.remove();
    });
    
    return tooltip;
  }

  startQuickCreation() {
    window.location.href = '/create?quick=true';
  }

  navigateToTemplates() {
    window.location.href = '/templates';
  }

  startFirstChartCreation() {
    window.location.href = '/create?first=true';
  }

  shareSuccess(config) {
    // Implementation would open share modal
    console.log('Sharing success:', config);
  }

  continueJourney() {
    // Implementation would continue to next logical step
    console.log('Continuing journey');
  }

  showDataFormatGuide() {
    // Implementation would show data format guide
    console.log('Showing data format guide');
  }

  suggestSimplerTemplate() {
    // Implementation would suggest simpler templates
    console.log('Suggesting simpler template');
  }

  startLiveSupport() {
    // Implementation would start live support chat
    console.log('Starting live support');
  }

  isGenerationInProgress() {
    // Implementation would check generation status
    return false;
  }

  // Public methods
  getCurrentUserType() {
    return this.currentUserType;
  }

  getJourneyMetrics() {
    return Object.fromEntries(this.journeyMetrics);
  }

  getDropOffAnalysis() {
    return Object.fromEntries(this.dropOffAnalysis);
  }

  triggerCelebration(type, data) {
    switch (type) {
      case 'first-chart':
        this.celebrateFirstChart();
        break;
      case 'milestone':
        this.celebrateMilestone(data);
        break;
      default:
        console.log('Unknown celebration type:', type);
    }
  }
}

// Initialize user journey optimizer
document.addEventListener('DOMContentLoaded', () => {
  window.userJourneyOptimizer = new UserJourneyOptimizer();
});

export { UserJourneyOptimizer };

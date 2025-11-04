// Workflow Optimizer - Streamlined User Flows with Enhanced UX
class WorkflowOptimizer {
  constructor() {
    this.currentWorkflow = null;
    this.currentStep = 0;
    this.workflowHistory = [];
    this.stepProgress = new Map();
    this.userPreferences = new Map();
    this.workflowMetrics = new Map();
    this.automationRules = new Map();
    this.quickActions = new Map();
    
    this.init();
  }

  init() {
    this.setupWorkflowDetection();
    this.setupChartCreationFlow();
    this.setupTemplateFlow();
    this.setupWorkflowTransitions();
    this.setupProgressTracking();
    this.setupSmartDefaults();
    this.setupQuickActions();
    this.setupWorkflowOptimization();
    this.setupUserGuidance();
    this.setupPerformanceOptimization();
  }

  // Setup workflow detection
  setupWorkflowDetection() {
    // Detect current workflow based on URL and user actions
    this.detectCurrentWorkflow();
    
    // Listen for workflow changes
    window.addEventListener('popstate', () => {
      this.detectCurrentWorkflow();
    });
    
    document.addEventListener('navigationOccurred', (e) => {
      this.detectCurrentWorkflow();
    });
  }

  // Detect current workflow
  detectCurrentWorkflow() {
    const path = window.location.pathname;
    
    if (path.includes('/create')) {
      this.currentWorkflow = 'chart-creation';
      this.initializeChartCreationWorkflow();
    } else if (path.includes('/templates')) {
      this.currentWorkflow = 'template';
      this.initializeTemplateWorkflow();
    } else {
      this.currentWorkflow = null;
    }
    
    this.updateWorkflowUI();
  }

  // Setup Chart Creation Flow (Optimized 8-step process)
  setupChartCreationFlow() {
    this.workflows = {
      'chart-creation': {
        name: 'Create Chart from Data',
        description: 'Transform your data into beautiful visualizations',
        steps: [
          {
            id: 'entry-point',
            name: 'Get Started',
            description: 'Choose how to begin creating your chart',
            component: 'EntryPointSelector',
            estimatedTime: '30 seconds',
            tips: [
              'Start with data if you have it ready',
              'Choose a template for quick results',
              'Use AI generation for complex data'
            ],
            nextSteps: ['input-method', 'template-discovery'],
            skipAllowed: false,
            automation: {
              skipIf: 'hasRecentData',
              autoSelect: 'mostRecentMethod'
            }
          },
          {
            id: 'input-method',
            name: 'Input Method',
            description: 'Select the best way to input your data',
            component: 'InputMethodSelector',
            estimatedTime: '1 minute',
            tips: [
              'CSV/Excel for structured data',
              'Manual input for small datasets',
              'API connection for live data'
            ],
            nextSteps: ['data-entry'],
            skipAllowed: false,
            painPoint: 'Unclear benefits',
            solution: 'MethodComparisonTable'
          },
          {
            id: 'data-entry',
            name: 'Data Entry',
            description: 'Provide your data for visualization',
            component: 'DataEntryInterface',
            estimatedTime: '2-5 minutes',
            tips: [
              'Ensure clean headers in first row',
              'Remove empty rows and columns',
              'Check for consistent data types'
            ],
            nextSteps: ['chart-type'],
            skipAllowed: false,
            features: [
              'auto-save',
              'format-validation',
              'data-preview'
            ]
          },
          {
            id: 'chart-type',
            name: 'Chart Type',
            description: 'Choose the perfect visualization for your data',
            component: 'ChartTypeSelector',
            estimatedTime: '1 minute',
            tips: [
              'Bar charts for comparisons',
              'Line charts for trends over time',
              'Pie charts for proportions'
            ],
            nextSteps: ['ai-generation'],
            skipAllowed: true,
            skipTo: 'customization',
            painPoint: 'Analysis paralysis',
            solution: 'SmartRecommendations'
          },
          {
            id: 'ai-generation',
            name: 'AI Generation',
            description: 'Let AI create the perfect chart visualization',
            component: 'AIGenerationInterface',
            estimatedTime: '30 seconds - 2 minutes',
            tips: [
              'AI analyzes your data patterns',
              'Multiple style options generated',
              'You can always customize later'
            ],
            nextSteps: ['preview'],
            skipAllowed: true,
            skipTo: 'customization',
            painPoint: 'Long wait without feedback',
            solution: 'RealTimeProgress'
          },
          {
            id: 'preview',
            name: 'Preview & Review',
            description: 'Review your generated chart and make adjustments',
            component: 'ChartPreviewInterface',
            estimatedTime: '1 minute',
            tips: [
              'Check data accuracy',
              'Verify chart readability',
              'Test interactive features'
            ],
            nextSteps: ['customization'],
            skipAllowed: true,
            skipTo: 'export',
            features: [
              'interactive-preview',
              'data-validation',
              'quick-edits'
            ]
          },
          {
            id: 'customization',
            name: 'Customization',
            description: 'Fine-tune colors, fonts, and styling',
            component: 'CustomizationInterface',
            estimatedTime: '2-5 minutes',
            tips: [
              'Match your brand colors',
              'Ensure accessibility compliance',
              'Test on different screen sizes'
            ],
            nextSteps: ['export'],
            skipAllowed: true,
            skipTo: 'export',
            painPoint: 'Limited options',
            solution: 'AdvancedOptionsPanel'
          },
          {
            id: 'export',
            name: 'Export & Share',
            description: 'Save your chart in the perfect format',
            component: 'ExportInterface',
            estimatedTime: '30 seconds',
            tips: [
              'PNG for presentations',
              'SVG for websites',
              'PDF for documents'
            ],
            nextSteps: [],
            skipAllowed: false,
            painPoint: 'Complex workflow',
            solution: 'QuickExportOptions'
          }
        ],
        shortcuts: [
          { from: 'entry-point', to: 'customization', condition: 'hasTemplate' },
          { from: 'data-entry', to: 'export', condition: 'hasValidData' },
          { from: 'chart-type', to: 'preview', condition: 'skipAI' }
        ]
      }
    };
  }

  // Setup Template Flow (Optimized 6-step process)
  setupTemplateFlow() {
    this.workflows['template'] = {
      name: 'Create from Template',
      description: 'Start with a professional template and customize',
      steps: [
        {
          id: 'template-discovery',
          name: 'Discover Templates',
          description: 'Find the perfect template for your needs',
          component: 'TemplateDiscovery',
          estimatedTime: '1-2 minutes',
          tips: [
            'Use categories to narrow down options',
            'Filter by industry or chart type',
            'Preview multiple templates before choosing'
          ],
          nextSteps: ['template-preview'],
          skipAllowed: false,
          painPoint: 'Poor discoverability',
          solution: 'SmartSearchAndFilter'
        },
        {
          id: 'template-preview',
          name: 'Preview Template',
          description: 'See how the template looks with your data',
          component: 'TemplatePreview',
          estimatedTime: '1 minute',
          tips: [
            'Test with sample data',
            'Check all view variations',
            'Verify mobile responsiveness'
          ],
          nextSteps: ['customization'],
          skipAllowed: false,
          painPoint: 'Limited preview',
          solution: 'InteractivePreview'
        },
        {
          id: 'customization',
          name: 'Customize Template',
          description: 'Make the template your own',
          component: 'TemplateCustomization',
          estimatedTime: '3-10 minutes',
          tips: [
            'Start with colors and branding',
            'Adjust data sources and mappings',
            'Fine-tune labels and formatting'
          ],
          nextSteps: ['generation'],
          skipAllowed: false,
          painPoint: 'Complex customization',
          solution: 'GuidedCustomization'
        },
        {
          id: 'generation',
          name: 'Generate Chart',
          description: 'Create your final chart with custom data',
          component: 'ChartGeneration',
          estimatedTime: '30 seconds - 1 minute',
          tips: [
            'Review data one final time',
            'Check for any formatting issues',
            'Test all interactive elements'
          ],
          nextSteps: ['final-adjustments'],
          skipAllowed: false,
          features: [
            'progress-indication',
            'error-handling',
            'preview-options'
          ]
        },
        {
          id: 'final-adjustments',
          name: 'Final Adjustments',
          description: 'Make last-minute tweaks to perfect your chart',
          component: 'FinalAdjustments',
          estimatedTime: '1-2 minutes',
          tips: [
            'Check text readability',
            'Verify color contrast',
            'Test export quality'
          ],
          nextSteps: ['save-export'],
          skipAllowed: true,
          skipTo: 'save-export'
        },
        {
          id: 'save-export',
          name: 'Save & Export',
          description: 'Save your work and export in your preferred format',
          component: 'SaveExport',
          estimatedTime: '30 seconds',
          tips: [
            'Save to your library for future edits',
            'Export in multiple formats',
            'Share directly with your team'
          ],
          nextSteps: [],
          skipAllowed: false
        }
      ],
      shortcuts: [
        { from: 'template-discovery', to: 'generation', condition: 'hasSelectedTemplate' },
        { from: 'customization', to: 'save-export', condition: 'noAdjustmentsNeeded' }
      ]
    };
  }

  // Initialize Chart Creation Workflow
  initializeChartCreationWorkflow() {
    this.currentStep = 0;
    this.createWorkflowInterface();
    this.setupWorkflowProgress();
    this.setupStepNavigation();
    this.applyWorkflowOptimizations();
  }

  // Initialize Template Workflow
  initializeTemplateWorkflow() {
    this.currentStep = 0;
    this.createWorkflowInterface();
    this.setupWorkflowProgress();
    this.setupStepNavigation();
    this.applyWorkflowOptimizations();
  }

  // Create workflow interface
  createWorkflowInterface() {
    let workflowContainer = document.querySelector('.workflow-container');
    
    if (!workflowContainer) {
      workflowContainer = document.createElement('div');
      workflowContainer.className = 'workflow-container';
      
      const mainContent = document.querySelector('.main-content') || document.body;
      mainContent.appendChild(workflowContainer);
    }
    
    const workflow = this.workflows[this.currentWorkflow];
    if (!workflow) return;
    
    workflowContainer.innerHTML = `
      <div class="workflow-header">
        <div class="workflow-info">
          <h2 class="workflow-title">${workflow.name}</h2>
          <p class="workflow-description">${workflow.description}</p>
        </div>
        <div class="workflow-actions">
          <button class="workflow-quick-start" id="quickStartBtn">
            <i class="fas fa-rocket"></i>
            Quick Start
          </button>
          <button class="workflow-help" id="workflowHelpBtn">
            <i class="fas fa-question-circle"></i>
            Help
          </button>
        </div>
      </div>
      
      <div class="workflow-progress" id="workflowProgress">
        <!-- Progress steps will be added dynamically -->
      </div>
      
      <div class="workflow-content" id="workflowContent">
        <!-- Current step content will be loaded here -->
      </div>
      
      <div class="workflow-navigation" id="workflowNavigation">
        <!-- Navigation buttons will be added dynamically -->
      </div>
      
      <div class="workflow-tips" id="workflowTips">
        <!-- Contextual tips will be shown here -->
      </div>
    `;
    
    this.setupWorkflowEvents();
    this.renderWorkflowProgress();
    this.loadCurrentStep();
  }

  // Setup workflow events
  setupWorkflowEvents() {
    const quickStartBtn = document.getElementById('quickStartBtn');
    const helpBtn = document.getElementById('workflowHelpBtn');
    
    if (quickStartBtn) {
      quickStartBtn.addEventListener('click', () => {
        this.startQuickWorkflow();
      });
    }
    
    if (helpBtn) {
      helpBtn.addEventListener('click', () => {
        this.showWorkflowHelp();
      });
    }
  }

  // Start quick workflow
  startQuickWorkflow() {
    // Use smart defaults to skip non-essential steps
    const quickPath = this.getQuickWorkflowPath();
    this.followQuickPath(quickPath);
  }

  // Get quick workflow path
  getQuickWorkflowPath() {
    const workflow = this.workflows[this.currentWorkflow];
    
    if (this.currentWorkflow === 'chart-creation') {
      // Quick path: Entry → Data Entry → AI Generation → Export
      return ['entry-point', 'data-entry', 'ai-generation', 'export'];
    } else if (this.currentWorkflow === 'template') {
      // Quick path: Discovery → Customization → Export
      return ['template-discovery', 'customization', 'save-export'];
    }
    
    return workflow.steps.map(step => step.id);
  }

  // Follow quick path
  followQuickPath(path) {
    this.quickPath = path;
    this.currentStep = 0;
    this.loadCurrentStep();
    this.renderWorkflowProgress();
  }

  // Show workflow help
  showWorkflowHelp() {
    const workflow = this.workflows[this.currentWorkflow];
    const currentStep = workflow.steps[this.currentStep];
    
    const helpModal = this.createHelpModal(workflow, currentStep);
    document.body.appendChild(helpModal);
    
    // Show modal
    helpModal.style.display = 'flex';
  }

  // Create help modal
  createHelpModal(workflow, currentStep) {
    const modal = document.createElement('div');
    modal.className = 'workflow-help-modal';
    modal.innerHTML = `
      <div class="help-modal-content">
        <div class="help-modal-header">
          <h3>Workflow Help</h3>
          <button class="help-modal-close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="help-modal-body">
          <div class="help-current-step">
            <h4>Current Step: ${currentStep.name}</h4>
            <p>${currentStep.description}</p>
            <div class="help-tips">
              <h5>Tips:</h5>
              <ul>
                ${currentStep.tips.map(tip => `<li>${tip}</li>`).join('')}
              </ul>
            </div>
          </div>
          <div class="help-workflow-overview">
            <h4>Workflow Overview</h4>
            <div class="workflow-steps-list">
              ${workflow.steps.map((step, index) => `
                <div class="help-step-item ${index === this.currentStep ? 'current' : ''} ${index < this.currentStep ? 'completed' : ''}">
                  <div class="help-step-number">${index + 1}</div>
                  <div class="help-step-info">
                    <div class="help-step-name">${step.name}</div>
                    <div class="help-step-time">${step.estimatedTime}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
    
    // Setup close button
    const closeBtn = modal.querySelector('.help-modal-close');
    closeBtn.addEventListener('click', () => {
      modal.remove();
    });
    
    // Close on backdrop click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
    
    return modal;
  }

  // Render workflow progress
  renderWorkflowProgress() {
    const progressContainer = document.getElementById('workflowProgress');
    if (!progressContainer) return;
    
    const workflow = this.workflows[this.currentWorkflow];
    const steps = this.quickPath || workflow.steps.map(step => step.id);
    
    progressContainer.innerHTML = `
      <div class="progress-steps">
        ${steps.map((stepId, index) => {
          const step = workflow.steps.find(s => s.id === stepId);
          const isCompleted = index < this.currentStep;
          const isCurrent = index === this.currentStep;
          
          return `
            <div class="progress-step ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}" 
                 data-step="${stepId}" data-index="${index}">
              <div class="step-marker">
                ${isCompleted ? '<i class="fas fa-check"></i>' : index + 1}
              </div>
              <div class="step-info">
                <div class="step-name">${step.name}</div>
                <div class="step-time">${step.estimatedTime}</div>
              </div>
              ${index < steps.length - 1 ? '<div class="step-connector"></div>' : ''}
            </div>
          `;
        }).join('')}
      </div>
    `;
    
    // Setup step click navigation
    progressContainer.addEventListener('click', (e) => {
      const stepElement = e.target.closest('.progress-step');
      if (stepElement && !stepElement.classList.contains('completed')) {
        const stepIndex = parseInt(stepElement.dataset.index);
        this.navigateToStep(stepIndex);
      }
    });
  }

  // Load current step
  loadCurrentStep() {
    const workflow = this.workflows[this.currentWorkflow];
    const steps = this.quickPath || workflow.steps.map(step => step.id);
    const currentStepId = steps[this.currentStep];
    const stepConfig = workflow.steps.find(s => s.id === currentStepId);
    
    if (!stepConfig) return;
    
    const contentContainer = document.getElementById('workflowContent');
    if (!contentContainer) return;
    
    // Load step component
    this.loadStepComponent(stepConfig, contentContainer);
    
    // Update navigation
    this.updateStepNavigation(stepConfig);
    
    // Show tips
    this.showStepTips(stepConfig);
    
    // Track step progress
    this.trackStepProgress(stepConfig);
    
    // Apply step-specific optimizations
    this.applyStepOptimizations(stepConfig);
  }

  // Load step component
  loadStepComponent(stepConfig, container) {
    container.innerHTML = `
      <div class="step-component" data-step="${stepConfig.id}">
        <div class="step-header">
          <h3 class="step-title">${stepConfig.name}</h3>
          <p class="step-description">${stepConfig.description}</p>
          <div class="step-meta">
            <span class="step-time">
              <i class="fas fa-clock"></i>
              ${stepConfig.estimatedTime}
            </span>
            ${stepConfig.skipAllowed ? `
              <button class="step-skip-btn" data-step="${stepConfig.id}">
                <i class="fas fa-forward"></i>
                Skip this step
              </button>
            ` : ''}
          </div>
        </div>
        
        <div class="step-content" id="stepContent_${stepConfig.id}">
          <!-- Step-specific content will be loaded here -->
        </div>
      </div>
    `;
    
    // Load step-specific content
    this.loadStepContent(stepConfig);
    
    // Setup skip button
    const skipBtn = container.querySelector('.step-skip-btn');
    if (skipBtn) {
      skipBtn.addEventListener('click', () => {
        this.skipCurrentStep();
      });
    }
  }

  // Load step content
  loadStepContent(stepConfig) {
    const contentContainer = document.getElementById(`stepContent_${stepConfig.id}`);
    if (!contentContainer) return;
    
    switch (stepConfig.id) {
      case 'entry-point':
        this.loadEntryPointContent(contentContainer);
        break;
      case 'input-method':
        this.loadInputMethodContent(contentContainer);
        break;
      case 'data-entry':
        this.loadDataEntryContent(contentContainer);
        break;
      case 'chart-type':
        this.loadChartTypeContent(contentContainer);
        break;
      case 'ai-generation':
        this.loadAIGenerationContent(contentContainer);
        break;
      case 'preview':
        this.loadPreviewContent(contentContainer);
        break;
      case 'customization':
        this.loadCustomizationContent(contentContainer);
        break;
      case 'export':
        this.loadExportContent(contentContainer);
        break;
      case 'template-discovery':
        this.loadTemplateDiscoveryContent(contentContainer);
        break;
      case 'template-preview':
        this.loadTemplatePreviewContent(contentContainer);
        break;
      case 'generation':
        this.loadGenerationContent(contentContainer);
        break;
      case 'final-adjustments':
        this.loadFinalAdjustmentsContent(contentContainer);
        break;
      case 'save-export':
        this.loadSaveExportContent(contentContainer);
        break;
    }
  }

  // Load Entry Point content
  loadEntryPointContent(container) {
    container.innerHTML = `
      <div class="entry-point-options">
        <div class="option-card" data-option="data">
          <div class="option-icon">
            <i class="fas fa-database"></i>
          </div>
          <div class="option-content">
            <h4>Start with Data</h4>
            <p>Upload or enter your data first</p>
            <ul>
              <li>CSV, Excel, or JSON files</li>
              <li>Manual data entry</li>
              <li>API connections</li>
            </ul>
          </div>
          <button class="option-select-btn" data-option="data">
            Choose Data First
          </button>
        </div>
        
        <div class="option-card" data-option="template">
          <div class="option-icon">
            <i class="fas fa-layer-group"></i>
          </div>
          <div class="option-content">
            <h4>Start with Template</h4>
            <p>Choose a template and customize it</p>
            <ul>
              <li>Professional designs</li>
              <li>Quick setup</li>
              <li>Industry-specific</li>
            </ul>
          </div>
          <button class="option-select-btn" data-option="template">
            Choose Template First
          </button>
        </div>
        
        <div class="option-card" data-option="ai">
          <div class="option-icon">
            <i class="fas fa-magic"></i>
          </div>
          <div class="option-content">
            <h4>AI-Powered Creation</h4>
            <p>Let AI guide you through the process</p>
            <ul>
              <li>Smart recommendations</li>
              <li>Automated styling</li>
              <li>Best practice suggestions</li>
            </ul>
          </div>
          <button class="option-select-btn" data-option="ai">
            Use AI Assistant
          </button>
        </div>
      </div>
    `;
    
    // Setup option selection
    container.addEventListener('click', (e) => {
      const btn = e.target.closest('.option-select-btn');
      if (btn) {
        const option = btn.dataset.option;
        this.selectEntryPoint(option);
      }
    });
  }

  // Load Input Method content (with pain point solution)
  loadInputMethodContent(container) {
    container.innerHTML = `
      <div class="input-method-content">
        <div class="method-comparison-table">
          <h4>Compare Input Methods</h4>
          <table class="comparison-table">
            <thead>
              <tr>
                <th>Method</th>
                <th>Best For</th>
                <th>Setup Time</th>
                <th>Flexibility</th>
                <th>Choose</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div class="method-info">
                    <i class="fas fa-file-csv"></i>
                    <span>CSV/Excel Upload</span>
                  </div>
                </td>
                <td>Structured data, existing datasets</td>
                <td>30 seconds</td>
                <td>⭐⭐⭐⭐</td>
                <td>
                  <button class="method-select-btn" data-method="csv">
                    Select
                  </button>
                </td>
              </tr>
              <tr>
                <td>
                  <div class="method-info">
                    <i class="fas fa-keyboard"></i>
                    <span>Manual Entry</span>
                  </div>
                </td>
                <td>Small datasets, quick data</td>
                <td>2-5 minutes</td>
                <td>⭐⭐⭐⭐⭐</td>
                <td>
                  <button class="method-select-btn" data-method="manual">
                    Select
                  </button>
                </td>
              </tr>
              <tr>
                <td>
                  <div class="method-info">
                    <i class="fas fa-plug"></i>
                    <span>API Connection</span>
                  </div>
                </td>
                <td>Live data, real-time updates</td>
                <td>5 minutes</td>
                <td>⭐⭐⭐</td>
                <td>
                  <button class="method-select-btn" data-method="api">
                    Select
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div class="method-features">
          <div class="feature-card" data-method="csv">
            <h5>CSV/Excel Features</h5>
            <ul>
              <li>Automatic format detection</li>
              <li>Data validation and cleanup</li>
              <li>Support for large files</li>
              <li>Header recognition</li>
            </ul>
          </div>
          
          <div class="feature-card" data-method="manual">
            <h5>Manual Entry Features</h5>
            <ul>
              <li>Real-time validation</li>
              <li>Auto-save functionality</li>
              <li>Format suggestions</li>
              <li>Undo/redo support</li>
            </ul>
          </div>
          
          <div class="feature-card" data-method="api">
            <h5>API Connection Features</h5>
            <ul>
              <li>Real-time data sync</li>
              <li>Automatic refresh</li>
              <li>Custom data mapping</li>
              <li>Authentication support</li>
            </ul>
          </div>
        </div>
      </div>
    `;
    
    // Setup method selection
    this.setupInputMethodSelection(container);
  }

  // Load AI Generation content (with pain point solution)
  loadAIGenerationContent(container) {
    container.innerHTML = `
      <div class="ai-generation-content">
        <div class="generation-progress" id="generationProgress" style="display: none;">
          <div class="progress-header">
            <i class="fas fa-magic"></i>
            <span>AI is creating your chart...</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" id="progressFill" style="width: 0%"></div>
          </div>
          <div class="progress-details">
            <span class="progress-percentage" id="progressPercentage">0%</span>
            <span class="progress-status" id="progressStatus">Initializing...</span>
          </div>
          <div class="progress-options">
            <button class="progress-cancel" id="cancelGeneration">
              <i class="fas fa-times"></i>
              Cancel
            </button>
          </div>
        </div>
        
        <div class="generation-options" id="generationOptions">
          <h4>Generation Options</h4>
          <div class="option-group">
            <label>
              <input type="checkbox" id="smartStyle" checked>
              Apply smart styling
            </label>
            <label>
              <input type="checkbox" id="autoColors" checked>
              Optimize colors for accessibility
            </label>
            <label>
              <input type="checkbox" id="dataInsights">
              Include data insights
            </label>
          </div>
          
          <div class="style-preferences">
            <h5>Style Preferences</h5>
            <div class="style-options">
              <button class="style-btn" data-style="modern">Modern</button>
              <button class="style-btn" data-style="classic">Classic</button>
              <button class="style-btn" data-style="minimal">Minimal</button>
              <button class="style-btn" data-style="bold">Bold</button>
            </div>
          </div>
          
          <button class="start-generation-btn" id="startGeneration">
            <i class="fas fa-play"></i>
            Start AI Generation
          </button>
        </div>
        
        <div class="generation-preview" id="generationPreview" style="display: none;">
          <h4>Generated Options</h4>
          <div class="preview-grid" id="previewGrid">
            <!-- Generated previews will appear here -->
          </div>
        </div>
      </div>
    `;
    
    // Setup generation
    this.setupAIGeneration(container);
  }

  // Load Customization content (with pain point solution)
  loadCustomizationContent(container) {
    container.innerHTML = `
      <div class="customization-content">
        <div class="customization-tabs">
          <button class="tab-btn active" data-tab="basic">Basic</button>
          <button class="tab-btn" data-tab="advanced">Advanced</button>
          <button class="tab-btn" data-tab="accessibility">Accessibility</button>
        </div>
        
        <div class="customization-panels">
          <div class="customization-panel active" id="basicPanel">
            <div class="customization-section">
              <h4>Colors</h4>
              <div class="color-options">
                <div class="color-scheme-selector">
                  <label>Color Scheme:</label>
                  <select id="colorScheme">
                    <option value="default">Default</option>
                    <option value="vibrant">Vibrant</option>
                    <option value="pastel">Pastel</option>
                    <option value="monochrome">Monochrome</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
                
                <div class="custom-colors" id="customColors" style="display: none;">
                  <label>Custom Colors:</label>
                  <div class="color-inputs">
                    <input type="color" id="primaryColor" value="#0ea5e9">
                    <input type="color" id="secondaryColor" value="#64748b">
                    <input type="color" id="accentColor" value="#f59e0b">
                  </div>
                </div>
              </div>
            </div>
            
            <div class="customization-section">
              <h4>Typography</h4>
              <div class="typography-options">
                <div class="font-selector">
                  <label>Font Family:</label>
                  <select id="fontFamily">
                    <option value="system">System</option>
                    <option value="sans-serif">Sans Serif</option>
                    <option value="serif">Serif</option>
                    <option value="monospace">Monospace</option>
                  </select>
                </div>
                
                <div class="font-size-controls">
                  <label>Font Size:</label>
                  <input type="range" id="fontSize" min="12" max="24" value="16">
                  <span id="fontSizeValue">16px</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="customization-panel" id="advancedPanel">
            <div class="customization-section">
              <h4>Layout & Spacing</h4>
              <div class="layout-options">
                <div class="spacing-controls">
                  <label>Chart Padding:</label>
                  <input type="range" id="chartPadding" min="0" max="50" value="20">
                </div>
                
                <div class="grid-controls">
                  <label>
                    <input type="checkbox" id="showGrid">
                    Show grid lines
                  </label>
                </div>
                
                <div class="legend-controls">
                  <label>Legend Position:</label>
                  <select id="legendPosition">
                    <option value="top">Top</option>
                    <option value="bottom">Bottom</option>
                    <option value="left">Left</option>
                    <option value="right">Right</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div class="customization-section">
              <h4>Animations & Interactions</h4>
              <div class="interaction-options">
                <label>
                  <input type="checkbox" id="enableAnimations" checked>
                  Enable animations
                </label>
                <label>
                  <input type="checkbox" id="enableTooltips" checked>
                  Show tooltips on hover
                </label>
                <label>
                  <input type="checkbox" id="enableZoom">
                  Enable zoom and pan
                </label>
              </div>
            </div>
          </div>
          
          <div class="customization-panel" id="accessibilityPanel">
            <div class="customization-section">
              <h4>Accessibility Options</h4>
              <div class="accessibility-options">
                <label>
                  <input type="checkbox" id="highContrast">
                  High contrast mode
                </label>
                <label>
                  <input type="checkbox" id="largeText">
                  Large text mode
                </label>
                <label>
                  <input type="checkbox" id="colorblindFriendly">
                  Colorblind friendly palette
                </label>
              </div>
            </div>
            
            <div class="accessibility-preview">
              <h4>Accessibility Preview</h4>
              <div class="preview-modes">
                <button class="preview-mode-btn" data-mode="normal">Normal</button>
                <button class="preview-mode-btn" data-mode="high-contrast">High Contrast</button>
                <button class="preview-mode-btn" data-mode="colorblind">Colorblind</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // Setup customization
    this.setupCustomization(container);
  }

  // Load Export content (with pain point solution)
  loadExportContent(container) {
    container.innerHTML = `
      <div class="export-content">
        <div class="quick-export-options">
          <h4>Quick Export</h4>
          <div class="export-formats">
            <button class="export-format-btn primary" data-format="png">
              <i class="fas fa-image"></i>
              <div class="format-info">
                <span class="format-name">PNG</span>
                <span class="format-desc">Best for presentations</span>
              </div>
            </button>
            
            <button class="export-format-btn" data-format="svg">
              <i class="fas fa-vector-square"></i>
              <div class="format-info">
                <span class="format-name">SVG</span>
                <span class="format-desc">Best for websites</span>
              </div>
            </button>
            
            <button class="export-format-btn" data-format="pdf">
              <i class="fas fa-file-pdf"></i>
              <div class="format-info">
                <span class="format-name">PDF</span>
                <span class="format-desc">Best for documents</span>
              </div>
            </button>
          </div>
        </div>
        
        <div class="advanced-export-options">
          <details>
            <summary>Advanced Options</summary>
            <div class="advanced-options-content">
              <div class="export-settings">
                <div class="setting-group">
                  <label>Resolution:</label>
                  <select id="exportResolution">
                    <option value="1x">Standard (1x)</option>
                    <option value="2x">High (2x)</option>
                    <option value="3x">Ultra (3x)</option>
                  </select>
                </div>
                
                <div class="setting-group">
                  <label>Background:</label>
                  <select id="exportBackground">
                    <option value="transparent">Transparent</option>
                    <option value="white">White</option>
                    <option value="current">Current</option>
                  </select>
                </div>
                
                <div class="setting-group">
                  <label>
                    <input type="checkbox" id="includeData">
                    Include data table
                  </label>
                </div>
              </div>
            </div>
          </details>
        </div>
        
        <div class="export-actions">
          <button class="export-btn" id="exportBtn">
            <i class="fas fa-download"></i>
            Export Chart
          </button>
          
          <div class="share-options">
            <button class="share-btn" id="shareBtn">
              <i class="fas fa-share"></i>
              Share
            </button>
            
            <button class="save-btn" id="saveBtn">
              <i class="fas fa-save"></i>
              Save to Library
            </button>
          </div>
        </div>
      </div>
    `;
    
    // Setup export
    this.setupExport(container);
  }

  // Load Template Discovery content (with pain point solution)
  loadTemplateDiscoveryContent(container) {
    container.innerHTML = `
      <div class="template-discovery-content">
        <div class="discovery-search">
          <div class="search-container">
            <i class="fas fa-search"></i>
            <input type="search" id="templateSearch" placeholder="Search templates...">
            <div class="search-filters">
              <button class="filter-btn" data-filter="category">
                <i class="fas fa-folder"></i>
                Category
              </button>
              <button class="filter-btn" data-filter="industry">
                <i class="fas fa-building"></i>
                Industry
              </button>
              <button class="filter-btn" data-filter="chart-type">
                <i class="fas fa-chart-bar"></i>
                Chart Type
              </button>
            </div>
          </div>
        </div>
        
        <div class="template-categories">
          <h4>Browse by Category</h4>
          <div class="category-grid">
            <div class="category-card" data-category="business">
              <i class="fas fa-briefcase"></i>
              <span>Business</span>
              <span class="template-count">24 templates</span>
            </div>
            
            <div class="category-card" data-category="marketing">
              <i class="fas fa-megaphone"></i>
              <span>Marketing</span>
              <span class="template-count">18 templates</span>
            </div>
            
            <div class="category-card" data-category="finance">
              <i class="fas fa-chart-line"></i>
              <span>Finance</span>
              <span class="template-count">32 templates</span>
            </div>
            
            <div class="category-card" data-category="education">
              <i class="fas fa-graduation-cap"></i>
              <span>Education</span>
              <span class="template-count">15 templates</span>
            </div>
          </div>
        </div>
        
        <div class="template-grid" id="templateGrid">
          <!-- Templates will be loaded here -->
        </div>
        
        <div class="discovery-tips">
          <div class="tip-card">
            <i class="fas fa-lightbulb"></i>
            <div class="tip-content">
              <h5>Pro Tip</h5>
              <p>Use the search bar to find templates for specific use cases like "sales report" or "dashboard".</p>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // Setup template discovery
    this.setupTemplateDiscovery(container);
  }

  // Load Template Preview content (with pain point solution)
  loadTemplatePreviewContent(container) {
    container.innerHTML = `
      <div class="template-preview-content">
        <div class="preview-container">
          <div class="preview-main">
            <div class="preview-canvas" id="previewCanvas">
              <!-- Interactive preview will be rendered here -->
            </div>
            
            <div class="preview-controls">
              <div class="view-controls">
                <button class="view-btn active" data-view="desktop">
                  <i class="fas fa-desktop"></i>
                  Desktop
                </button>
                <button class="view-btn" data-view="tablet">
                  <i class="fas fa-tablet"></i>
                  Tablet
                </button>
                <button class="view-btn" data-view="mobile">
                  <i class="fas fa-mobile"></i>
                  Mobile
                </button>
              </div>
              
              <div class="data-controls">
                <button class="data-btn" id="sampleDataBtn">
                  <i class="fas fa-database"></i>
                  Use Sample Data
                </button>
                <button class="data-btn" id="uploadDataBtn">
                  <i class="fas fa-upload"></i>
                  Upload Your Data
                </button>
              </div>
            </div>
          </div>
          
          <div class="preview-sidebar">
            <div class="template-info">
              <h4>Template Details</h4>
              <div class="info-item">
                <label>Chart Type:</label>
                <span id="templateChartType">Bar Chart</span>
              </div>
              <div class="info-item">
                <label>Best For:</label>
                <span id="templateBestFor">Comparing categories</span>
              </div>
              <div class="info-item">
                <label>Data Requirements:</label>
                <span id="templateDataReq">2+ columns, categorical data</span>
              </div>
            </div>
            
            <div class="customization-preview">
              <h5>Customization Options</h5>
              <div class="option-list">
                <div class="option-item">
                  <i class="fas fa-palette"></i>
                  <span>Colors & Styling</span>
                </div>
                <div class="option-item">
                  <i class="fas fa-font"></i>
                  <span>Typography</span>
                </div>
                <div class="option-item">
                  <i class="fas fa-chart-bar"></i>
                  <span>Chart Settings</span>
                </div>
                <div class="option-item">
                  <i class="fas fa-tags"></i>
                  <span>Labels & Annotations</span>
                </div>
              </div>
            </div>
            
            <div class="preview-actions">
              <button class="select-template-btn" id="selectTemplateBtn">
                <i class="fas fa-check"></i>
                Use This Template
              </button>
              <button class="browse-more-btn" id="browseMoreBtn">
                <i class="fas fa-search"></i>
                Browse More
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // Setup template preview
    this.setupTemplatePreview(container);
  }

  // Setup step navigation
  setupStepNavigation() {
    this.updateStepNavigation();
  }

  // Update step navigation
  updateStepNavigation(stepConfig) {
    const navContainer = document.getElementById('workflowNavigation');
    if (!navContainer) return;
    
    const workflow = this.workflows[this.currentWorkflow];
    const steps = this.quickPath || workflow.steps.map(step => step.id);
    const currentStepConfig = stepConfig || workflow.steps.find(s => s.id === steps[this.currentStep]);
    
    const canGoBack = this.currentStep > 0;
    const canGoForward = this.currentStep < steps.length - 1;
    const canSkip = currentStepConfig && currentStepConfig.skipAllowed;
    
    navContainer.innerHTML = `
      <div class="nav-buttons">
        ${canGoBack ? `
          <button class="nav-btn back-btn" id="backBtn">
            <i class="fas fa-arrow-left"></i>
            Back
          </button>
        ` : '<div></div>'}
        
        <div class="nav-center">
          ${canSkip ? `
            <button class="nav-btn skip-btn" id="skipBtn">
              <i class="fas fa-forward"></i>
              Skip Step
            </button>
          ` : ''}
        </div>
        
        ${canGoForward ? `
          <button class="nav-btn next-btn primary" id="nextBtn">
            Next
            <i class="fas fa-arrow-right"></i>
          </button>
        ` : `
          <button class="nav-btn finish-btn success" id="finishBtn">
            <i class="fas fa-check"></i>
            Finish
          </button>
        `}
      </div>
    `;
    
    // Setup navigation events
    this.setupNavigationEvents(navContainer);
  }

  // Setup navigation events
  setupNavigationEvents(navContainer) {
    const backBtn = navContainer.querySelector('#backBtn');
    const nextBtn = navContainer.querySelector('#nextBtn');
    const skipBtn = navContainer.querySelector('#skipBtn');
    const finishBtn = navContainer.querySelector('#finishBtn');
    
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        this.navigateToStep(this.currentStep - 1);
      });
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        this.navigateToStep(this.currentStep + 1);
      });
    }
    
    if (skipBtn) {
      skipBtn.addEventListener('click', () => {
        this.skipCurrentStep();
      });
    }
    
    if (finishBtn) {
      finishBtn.addEventListener('click', () => {
        this.finishWorkflow();
      });
    }
  }

  // Navigate to step
  navigateToStep(stepIndex) {
    const workflow = this.workflows[this.currentWorkflow];
    const steps = this.quickPath || workflow.steps.map(step => step.id);
    
    if (stepIndex >= 0 && stepIndex < steps.length) {
      this.currentStep = stepIndex;
      this.loadCurrentStep();
      this.renderWorkflowProgress();
      this.trackStepChange(stepIndex);
    }
  }

  // Skip current step
  skipCurrentStep() {
    const workflow = this.workflows[this.currentWorkflow];
    const steps = this.quickPath || workflow.steps.map(step => step.id);
    const currentStepConfig = workflow.steps.find(s => s.id === steps[this.currentStep]);
    
    if (currentStepConfig && currentStepConfig.skipAllowed) {
      this.trackStepSkip(currentStepConfig.id);
      this.navigateToStep(this.currentStep + 1);
    }
  }

  // Show step tips
  showStepTips(stepConfig) {
    const tipsContainer = document.getElementById('workflowTips');
    if (!tipsContainer || !stepConfig.tips) return;
    
    tipsContainer.innerHTML = `
      <div class="tips-container">
        <div class="tips-header">
          <i class="fas fa-lightbulb"></i>
          <h4>Tips for this step</h4>
        </div>
        <ul class="tips-list">
          ${stepConfig.tips.map(tip => `<li>${tip}</li>`).join('')}
        </ul>
      </div>
    `;
  }

  // Track step progress
  trackStepProgress(stepConfig) {
    const startTime = Date.now();
    this.stepProgress.set(stepConfig.id, { startTime });
    
    // Track completion when navigating away
    const originalNavigate = this.navigateToStep.bind(this);
    this.navigateToStep = (stepIndex) => {
      const currentStepId = this.workflows[this.currentWorkflow].steps[this.currentStep].id;
      const progress = this.stepProgress.get(currentStepId);
      
      if (progress) {
        const duration = Date.now() - progress.startTime;
        this.trackStepCompletion(currentStepId, duration);
      }
      
      return originalNavigate(stepIndex);
    };
  }

  // Track step completion
  trackStepCompletion(stepId, duration) {
    // Analytics tracking
    if (window.analytics) {
      window.analytics.trackCustomEvent('step_completed', {
        step_id: stepId,
        workflow: this.currentWorkflow,
        duration: duration
      });
    }
    
    // Update metrics
    const metrics = this.workflowMetrics.get(this.currentWorkflow) || {};
    metrics[stepId] = { duration, completed: true };
    this.workflowMetrics.set(this.currentWorkflow, metrics);
  }

  // Track step change
  trackStepChange(stepIndex) {
    if (window.analytics) {
      window.analytics.trackCustomEvent('step_changed', {
        workflow: this.currentWorkflow,
        step_index: stepIndex
      });
    }
  }

  // Track step skip
  trackStepSkip(stepId) {
    if (window.analytics) {
      window.analytics.trackCustomEvent('step_skipped', {
        step_id: stepId,
        workflow: this.currentWorkflow
      });
    }
  }

  // Apply workflow optimizations
  applyWorkflowOptimizations() {
    // Apply smart defaults based on user behavior
    this.applySmartDefaults();
    
    // Setup automation rules
    this.setupAutomationRules();
    
    // Optimize for performance
    this.optimizeWorkflowPerformance();
  }

  // Apply smart defaults
  applySmartDefaults() {
    const preferences = this.getUserPreferences();
    
    // Apply default input method
    if (preferences.preferredInputMethod) {
      this.setDefaultInputMethod(preferences.preferredInputMethod);
    }
    
    // Apply default chart type
    if (preferences.preferredChartType) {
      this.setDefaultChartType(preferences.preferredChartType);
    }
    
    // Apply default export format
    if (preferences.preferredExportFormat) {
      this.setDefaultExportFormat(preferences.preferredExportFormat);
    }
  }

  // Get user preferences
  getUserPreferences() {
    const stored = localStorage.getItem('workflow_preferences');
    return stored ? JSON.parse(stored) : {};
  }

  // Set user preference
  setUserPreference(key, value) {
    const preferences = this.getUserPreferences();
    preferences[key] = value;
    localStorage.setItem('workflow_preferences', JSON.stringify(preferences));
  }

  // Setup automation rules
  setupAutomationRules() {
    // Skip steps based on conditions
    this.automationRules.set('skipChartType', {
      condition: () => this.hasRecentChartType(),
      action: () => this.skipToStep('ai-generation')
    });
    
    this.automationRules.set('skipPreview', {
      condition: () => this.hasValidData(),
      action: () => this.skipToStep('customization')
    });
    
    // Apply rules
    this.applyAutomationRules();
  }

  // Apply automation rules
  applyAutomationRules() {
    this.automationRules.forEach((rule, name) => {
      if (rule.condition()) {
        rule.action();
      }
    });
  }

  // Check if has recent chart type
  hasRecentChartType() {
    const recent = localStorage.getItem('recent_chart_type');
    return recent && (Date.now() - parseInt(recent)) < 24 * 60 * 60 * 1000; // 24 hours
  }

  // Check if has valid data
  hasValidData() {
    // Implementation would check current data validity
    return false;
  }

  // Skip to step
  skipToStep(stepId) {
    const workflow = this.workflows[this.currentWorkflow];
    const stepIndex = workflow.steps.findIndex(s => s.id === stepId);
    
    if (stepIndex !== -1) {
      this.navigateToStep(stepIndex);
    }
  }

  // Optimize workflow performance
  optimizeWorkflowPerformance() {
    // Lazy load step components
    this.setupLazyLoading();
    
    // Cache step data
    this.setupStepCaching();
    
    // Preload next step
    this.preloadNextStep();
  }

  // Setup lazy loading
  setupLazyLoading() {
    // Implementation would lazy load step components
  }

  // Setup step caching
  setupStepCaching() {
    // Implementation would cache step data
  }

  // Preload next step
  preloadNextStep() {
    const workflow = this.workflows[this.currentWorkflow];
    const steps = this.quickPath || workflow.steps.map(step => step.id);
    
    if (this.currentStep < steps.length - 1) {
      const nextStepId = steps[this.currentStep + 1];
      this.preloadStep(nextStepId);
    }
  }

  // Preload step
  preloadStep(stepId) {
    // Implementation would preload step resources
  }

  // Finish workflow
  finishWorkflow() {
    this.trackWorkflowCompletion();
    this.showCompletionSummary();
    this.cleanupWorkflow();
  }

  // Track workflow completion
  trackWorkflowCompletion() {
    const duration = Date.now() - this.workflowStartTime;
    
    if (window.analytics) {
      window.analytics.trackCustomEvent('workflow_completed', {
        workflow: this.currentWorkflow,
        duration: duration,
        steps_completed: this.currentStep + 1
      });
    }
  }

  // Show completion summary
  showCompletionSummary() {
    const summary = this.createCompletionSummary();
    document.body.appendChild(summary);
    
    // Show modal
    summary.style.display = 'flex';
  }

  // Create completion summary
  createCompletionSummary() {
    const modal = document.createElement('div');
    modal.className = 'completion-summary-modal';
    modal.innerHTML = `
      <div class="summary-content">
        <div class="summary-header">
          <div class="success-icon">
            <i class="fas fa-check-circle"></i>
          </div>
          <h3>Chart Created Successfully!</h3>
        </div>
        
        <div class="summary-body">
          <div class="summary-stats">
            <div class="stat-item">
              <span class="stat-label">Time Saved:</span>
              <span class="stat-value">5 minutes</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Steps Completed:</span>
              <span class="stat-value">${this.currentStep + 1}</span>
            </div>
          </div>
          
          <div class="summary-actions">
            <button class="action-btn primary" id="viewChartBtn">
              <i class="fas fa-eye"></i>
              View Chart
            </button>
            <button class="action-btn" id="createAnotherBtn">
              <i class="fas fa-plus"></i>
              Create Another
            </button>
            <button class="action-btn" id="goToLibraryBtn">
              <i class="fas fa-folder"></i>
              Go to Library
            </button>
          </div>
        </div>
      </div>
    `;
    
    // Setup action buttons
    this.setupSummaryActions(modal);
    
    return modal;
  }

  // Setup summary actions
  setupSummaryActions(modal) {
    const viewBtn = modal.querySelector('#viewChartBtn');
    const createBtn = modal.querySelector('#createAnotherBtn');
    const libraryBtn = modal.querySelector('#goToLibraryBtn');
    
    if (viewBtn) {
      viewBtn.addEventListener('click', () => {
        modal.remove();
        this.navigateToChart();
      });
    }
    
    if (createBtn) {
      createBtn.addEventListener('click', () => {
        modal.remove();
        this.restartWorkflow();
      });
    }
    
    if (libraryBtn) {
      libraryBtn.addEventListener('click', () => {
        modal.remove();
        this.navigateToLibrary();
      });
    }
  }

  // Navigate to chart
  navigateToChart() {
    window.location.href = '/chart/view';
  }

  // Restart workflow
  restartWorkflow() {
    this.currentStep = 0;
    this.workflowStartTime = Date.now();
    this.loadCurrentStep();
    this.renderWorkflowProgress();
  }

  // Navigate to library
  navigateToLibrary() {
    window.location.href = '/library';
  }

  // Cleanup workflow
  cleanupWorkflow() {
    // Clear temporary data
    this.stepProgress.clear();
    
    // Save metrics
    this.saveWorkflowMetrics();
    
    // Reset state
    this.currentWorkflow = null;
    this.currentStep = 0;
  }

  // Save workflow metrics
  saveWorkflowMetrics() {
    const metrics = Object.fromEntries(this.workflowMetrics);
    localStorage.setItem('workflow_metrics', JSON.stringify(metrics));
  }

  // Public methods
  getCurrentWorkflow() {
    return this.currentWorkflow;
  }

  getCurrentStep() {
    return this.currentStep;
  }

  getWorkflowProgress() {
    const workflow = this.workflows[this.currentWorkflow];
    return {
      current: this.currentStep,
      total: workflow ? workflow.steps.length : 0,
      percentage: workflow ? ((this.currentStep + 1) / workflow.steps.length) * 100 : 0
    };
  }

  skipToStepById(stepId) {
    this.skipToStep(stepId);
  }

  setQuickPath(path) {
    this.quickPath = path;
    this.currentStep = 0;
    this.loadCurrentStep();
    this.renderWorkflowProgress();
  }
}

// Initialize workflow optimizer
document.addEventListener('DOMContentLoaded', () => {
  window.workflowOptimizer = new WorkflowOptimizer();
});

export { WorkflowOptimizer };

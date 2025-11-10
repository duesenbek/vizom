/**
 * Chart Templates Service
 * Provides predefined chart templates with selector UI and customization options
 */

class ChartTemplatesService {
  constructor() {
    this.templates = new Map();
    this.selectedTemplate = null;
    this.init();
  }

  init() {
    this.setupTemplates();
    this.setupTemplateStyles();
  }

  /**
   * Setup predefined chart templates
   */
  setupTemplates() {
    // Template 1: Sales Dashboard
    this.templates.set('sales-dashboard', {
      id: 'sales-dashboard',
      name: 'Sales Dashboard',
      description: 'Track monthly sales performance with revenue trends',
      category: 'business',
      icon: 'fa-chart-line',
      difficulty: 'beginner',
      tags: ['sales', 'revenue', 'monthly', 'trend'],
      chartType: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            label: 'Sales Revenue',
            data: [45000, 52000, 48000, 61000, 58000, 67000, 72000, 69000, 75000, 82000, 78000, 85000],
            borderColor: '#3B82F6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.4,
            fill: true
          },
          {
            label: 'Target',
            data: [50000, 50000, 55000, 55000, 60000, 60000, 65000, 65000, 70000, 70000, 75000, 75000],
            borderColor: '#EF4444',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            borderDash: [5, 5],
            tension: 0.4,
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Monthly Sales Performance',
            font: { size: 16, weight: 'bold' }
          },
          legend: {
            display: true,
            position: 'top'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return '$' + value.toLocaleString();
              }
            }
          }
        }
      },
      customization: {
        colors: ['#3B82F6', '#EF4444'],
        showGrid: true,
        showDataLabels: false,
        animationDuration: 1000
      }
    });

    // Template 2: Market Share Analysis
    this.templates.set('market-share', {
      id: 'market-share',
      name: 'Market Share Analysis',
      description: 'Visualize market distribution across competitors',
      category: 'business',
      icon: 'fa-chart-pie',
      difficulty: 'beginner',
      tags: ['market', 'share', 'competition', 'pie'],
      chartType: 'pie',
      data: {
        labels: ['Our Company', 'Competitor A', 'Competitor B', 'Competitor C', 'Others'],
        datasets: [
          {
            data: [35, 25, 20, 15, 5],
            backgroundColor: [
              '#3B82F6',
              '#8B5CF6',
              '#06D6A0',
              '#F59E0B',
              '#EF4444'
            ],
            borderWidth: 2,
            borderColor: '#ffffff'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Market Share Distribution',
            font: { size: 16, weight: 'bold' }
          },
          legend: {
            display: true,
            position: 'right'
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return context.label + ': ' + context.parsed + '%';
              }
            }
          }
        }
      },
      customization: {
        colors: ['#3B82F6', '#8B5CF6', '#06D6A0', '#F59E0B', '#EF4444'],
        showPercentages: true,
        showLegend: true,
        animationDuration: 800
      }
    });

    // Template 3: Customer Satisfaction Metrics
    this.templates.set('customer-satisfaction', {
      id: 'customer-satisfaction',
      name: 'Customer Satisfaction Metrics',
      description: 'Track customer satisfaction scores across different dimensions',
      category: 'analytics',
      icon: 'fa-chart-radar',
      difficulty: 'intermediate',
      tags: ['customer', 'satisfaction', 'nps', 'radar'],
      chartType: 'radar',
      data: {
        labels: ['Product Quality', 'Customer Service', 'Price', 'Delivery', 'User Experience', 'Support'],
        datasets: [
          {
            label: 'Current Quarter',
            data: [85, 78, 72, 88, 82, 75],
            borderColor: '#3B82F6',
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            pointBackgroundColor: '#3B82F6',
            pointBorderColor: '#ffffff',
            pointHoverBackgroundColor: '#ffffff',
            pointHoverBorderColor: '#3B82F6'
          },
          {
            label: 'Previous Quarter',
            data: [78, 75, 70, 82, 78, 72],
            borderColor: '#8B5CF6',
            backgroundColor: 'rgba(139, 92, 246, 0.2)',
            pointBackgroundColor: '#8B5CF6',
            pointBorderColor: '#ffffff',
            pointHoverBackgroundColor: '#ffffff',
            pointHoverBorderColor: '#8B5CF6'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Customer Satisfaction Analysis',
            font: { size: 16, weight: 'bold' }
          },
          legend: {
            display: true,
            position: 'top'
          }
        },
        scales: {
          r: {
            beginAtZero: true,
            max: 100,
            ticks: {
              stepSize: 20
            }
          }
        }
      },
      customization: {
        colors: ['#3B82F6', '#8B5CF6'],
        showGrid: true,
        fillArea: true,
        animationDuration: 1200
      }
    });

    // Template 4: Project Timeline
    this.templates.set('project-timeline', {
      id: 'project-timeline',
      name: 'Project Timeline Gantt',
      description: 'Visualize project phases and milestones',
      category: 'project',
      icon: 'fa-tasks',
      difficulty: 'advanced',
      tags: ['project', 'timeline', 'gantt', 'milestones'],
      chartType: 'bar',
      data: {
        labels: ['Planning', 'Design', 'Development', 'Testing', 'Deployment', 'Launch'],
        datasets: [
          {
            label: 'Duration (weeks)',
            data: [2, 3, 6, 2, 1, 1],
            backgroundColor: [
              '#3B82F6',
              '#8B5CF6',
              '#06D6A0',
              '#F59E0B',
              '#EF4444',
              '#10B981'
            ],
            borderColor: '#ffffff',
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
          title: {
            display: true,
            text: 'Project Timeline',
            font: { size: 16, weight: 'bold' }
          },
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Duration (weeks)'
            }
          }
        }
      },
      customization: {
        colors: ['#3B82F6', '#8B5CF6', '#06D6A0', '#F59E0B', '#EF4444', '#10B981'],
        horizontal: true,
        showValues: true,
        animationDuration: 1000
      }
    });

    // Template 5: Performance Comparison
    this.templates.set('performance-comparison', {
      id: 'performance-comparison',
      name: 'Performance Comparison',
      description: 'Compare performance metrics across different periods',
      category: 'analytics',
      icon: 'fa-chart-column',
      difficulty: 'intermediate',
      tags: ['performance', 'comparison', 'metrics', 'bar'],
      chartType: 'bar',
      data: {
        labels: ['Q1 2023', 'Q2 2023', 'Q3 2023', 'Q4 2023', 'Q1 2024'],
        datasets: [
          {
            label: 'Revenue',
            data: [120000, 135000, 142000, 158000, 175000],
            backgroundColor: '#3B82F6',
            borderColor: '#2563EB',
            borderWidth: 1
          },
          {
            label: 'Expenses',
            data: [80000, 85000, 88000, 92000, 95000],
            backgroundColor: '#EF4444',
            borderColor: '#DC2626',
            borderWidth: 1
          },
          {
            label: 'Profit',
            data: [40000, 50000, 54000, 66000, 80000],
            backgroundColor: '#10B981',
            borderColor: '#059669',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Quarterly Performance Comparison',
            font: { size: 16, weight: 'bold' }
          },
          legend: {
            display: true,
            position: 'top'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return '$' + (value / 1000) + 'K';
              }
            }
          }
        }
      },
      customization: {
        colors: ['#3B82F6', '#EF4444', '#10B981'],
        grouped: true,
        showGrid: true,
        animationDuration: 800
      }
    });
  }

  /**
   * Setup template selector styles
   */
  setupTemplateStyles() {
    if (document.getElementById('template-styles')) return;

    const styles = document.createElement('style');
    styles.id = 'template-styles';
    styles.textContent = `
      /* Template Selector Container */
      .template-selector {
        background: white;
        border-radius: 12px;
        padding: 20px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        border: 1px solid #e5e7eb;
      }

      .template-selector-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 20px;
        padding-bottom: 16px;
        border-bottom: 1px solid #e5e7eb;
      }

      .template-selector-title {
        font-size: 18px;
        font-weight: 600;
        color: #1f2937;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .template-selector-subtitle {
        font-size: 14px;
        color: #6b7280;
        margin-top: 4px;
      }

      /* Template Categories */
      .template-categories {
        display: flex;
        gap: 8px;
        margin-bottom: 20px;
        flex-wrap: wrap;
      }

      .template-category {
        padding: 6px 12px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        border: 1px solid #e5e7eb;
        background: white;
        color: #6b7280;
      }

      .template-category:hover {
        background: #f9fafb;
        border-color: #d1d5db;
      }

      .template-category.active {
        background: #3b82f6;
        color: white;
        border-color: #3b82f6;
      }

      /* Template Grid */
      .template-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 16px;
        margin-bottom: 20px;
      }

      /* Template Card */
      .template-card {
        background: white;
        border: 2px solid #e5e7eb;
        border-radius: 12px;
        padding: 16px;
        cursor: pointer;
        transition: all 0.2s ease;
        position: relative;
        overflow: hidden;
      }

      .template-card:hover {
        border-color: #3b82f6;
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(59, 130, 246, 0.15);
      }

      .template-card.selected {
        border-color: #3b82f6;
        background: #eff6ff;
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
      }

      .template-card-header {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        margin-bottom: 12px;
      }

      .template-card-icon {
        width: 40px;
        height: 40px;
        background: linear-gradient(135deg, #3b82f6, #8b5cf6);
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 16px;
        flex-shrink: 0;
      }

      .template-card-info {
        flex: 1;
      }

      .template-card-title {
        font-weight: 600;
        color: #1f2937;
        margin-bottom: 4px;
        font-size: 14px;
      }

      .template-card-description {
        color: #6b7280;
        font-size: 12px;
        line-height: 1.4;
      }

      /* Template Metadata */
      .template-card-meta {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 12px;
        font-size: 11px;
        color: #9ca3af;
      }

      .template-difficulty {
        padding: 2px 6px;
        border-radius: 4px;
        font-weight: 500;
      }

      .template-difficulty.beginner {
        background: #dcfce7;
        color: #166534;
      }

      .template-difficulty.intermediate {
        background: #fef3c7;
        color: #92400e;
      }

      .template-difficulty.advanced {
        background: #fee2e2;
        color: #991b1b;
      }

      /* Template Tags */
      .template-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }

      .template-tag {
        padding: 2px 8px;
        background: #f3f4f6;
        color: #6b7280;
        border-radius: 12px;
        font-size: 10px;
        font-weight: 500;
      }

      /* Template Preview */
      .template-preview {
        height: 120px;
        background: #f9fafb;
        border-radius: 8px;
        margin-top: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        overflow: hidden;
      }

      .template-preview-canvas {
        max-width: 100%;
        max-height: 100%;
      }

      .template-preview-placeholder {
        color: #9ca3af;
        font-size: 12px;
        text-align: center;
      }

      /* Template Actions */
      .template-actions {
        display: flex;
        gap: 8px;
        margin-top: 16px;
      }

      .template-button {
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

      .template-button.primary {
        background: #3b82f6;
        color: white;
      }

      .template-button.primary:hover {
        background: #2563eb;
      }

      .template-button.secondary {
        background: #f3f4f6;
        color: #374151;
        border: 1px solid #d1d5db;
      }

      .template-button.secondary:hover {
        background: #e5e7eb;
      }

      /* Template Customization */
      .template-customization {
        background: #f9fafb;
        border-radius: 8px;
        padding: 16px;
        margin-top: 16px;
        border: 1px solid #e5e7eb;
      }

      .template-customization-title {
        font-weight: 500;
        color: #1f2937;
        margin-bottom: 12px;
        font-size: 14px;
      }

      .template-customization-options {
        display: grid;
        gap: 12px;
      }

      .template-option {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .template-option-label {
        font-size: 13px;
        color: #4b5563;
      }

      .template-option-control {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      /* Mobile Optimizations */
      @media (max-width: 768px) {
        .template-grid {
          grid-template-columns: 1fr;
        }
        
        .template-categories {
          justify-content: center;
        }
        
        .template-selector {
          padding: 16px;
        }
      }
    `;
    document.head.appendChild(styles);
  }

  /**
   * Create template selector UI
   */
  createTemplateSelector(containerId, options = {}) {
    const {
      showCategories = true,
      showPreviews = true,
      allowCustomization = true,
      onTemplateSelect = null,
      onTemplateUse = null
    } = options;

    const container = document.getElementById(containerId);
    if (!container) return null;

    const selectorHTML = this.generateTemplateSelectorHTML(options);
    container.innerHTML = selectorHTML;

    // Setup event handlers
    this.setupTemplateSelectorEvents(containerId, options);

    return containerId;
  }

  /**
   * Generate template selector HTML
   */
  generateTemplateSelectorHTML(options) {
    const categories = this.getCategories();
    const templates = Array.from(this.templates.values());

    return `
      <div class="template-selector">
        <div class="template-selector-header">
          <div>
            <div class="template-selector-title">
              <i class="fas fa-layer-group"></i>
              Chart Templates
            </div>
            <div class="template-selector-subtitle">
              Choose a template to get started quickly
            </div>
          </div>
          <button class="template-button secondary" onclick="chartTemplates.refreshTemplates()">
            <i class="fas fa-sync"></i>
            Refresh
          </button>
        </div>

        ${options.showCategories ? `
          <div class="template-categories">
            <button class="template-category active" data-category="all">All Templates</button>
            ${categories.map(cat => `
              <button class="template-category" data-category="${cat}">
                ${cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            `).join('')}
          </div>
        ` : ''}

        <div class="template-grid" id="template-grid">
          ${templates.map(template => this.generateTemplateCardHTML(template, options)).join('')}
        </div>

        <div class="template-actions">
          <button class="template-button primary" onclick="chartTemplates.useSelectedTemplate()" id="use-template-btn" disabled>
            <i class="fas fa-play"></i>
            Use Template
          </button>
          <button class="template-button secondary" onclick="chartTemplates.customizeSelectedTemplate()" id="customize-template-btn" disabled>
            <i class="fas fa-sliders-h"></i>
            Customize
          </button>
        </div>

        ${options.allowCustomization ? `
          <div class="template-customization" id="template-customization" style="display: none;">
            <div class="template-customization-title">
              <i class="fas fa-palette"></i>
              Customize Template
            </div>
            <div class="template-customization-options" id="customization-options">
              <!-- Customization options will be populated dynamically -->
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }

  /**
   * Generate template card HTML
   */
  generateTemplateCardHTML(template, options) {
    return `
      <div class="template-card" data-template-id="${template.id}" onclick="chartTemplates.selectTemplate('${template.id}')">
        <div class="template-card-header">
          <div class="template-card-icon">
            <i class="fas ${template.icon}"></i>
          </div>
          <div class="template-card-info">
            <div class="template-card-title">${template.name}</div>
            <div class="template-card-description">${template.description}</div>
          </div>
        </div>

        <div class="template-card-meta">
          <span class="template-difficulty ${template.difficulty}">
            ${template.difficulty.charAt(0).toUpperCase() + template.difficulty.slice(1)}
          </span>
          <span><i class="fas fa-chart-${template.chartType}"></i> ${template.chartType}</span>
        </div>

        <div class="template-tags">
          ${template.tags.map(tag => `
            <span class="template-tag">${tag}</span>
          `).join('')}
        </div>

        ${options.showPreviews ? `
          <div class="template-preview">
            <canvas class="template-preview-canvas" id="preview-${template.id}" width="200" height="100"></canvas>
          </div>
        ` : ''}
      </div>
    `;
  }

  /**
   * Setup template selector events
   */
  setupTemplateSelectorEvents(containerId, options) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Category filter
    if (options.showCategories) {
      const categoryButtons = container.querySelectorAll('.template-category');
      categoryButtons.forEach(button => {
        button.addEventListener('click', (e) => {
          this.filterByCategory(e.target.dataset.category);
        });
      });
    }

    // Generate previews if enabled
    if (options.showPreviews) {
      setTimeout(() => {
        this.generateTemplatePreviews();
      }, 100);
    }
  }

  /**
   * Select a template
   */
  selectTemplate(templateId) {
    // Remove previous selection
    document.querySelectorAll('.template-card').forEach(card => {
      card.classList.remove('selected');
    });

    // Add selection to clicked template
    const selectedCard = document.querySelector(`[data-template-id="${templateId}"]`);
    if (selectedCard) {
      selectedCard.classList.add('selected');
      this.selectedTemplate = this.templates.get(templateId);

      // Enable action buttons
      document.getElementById('use-template-btn').disabled = false;
      document.getElementById('customize-template-btn').disabled = false;

      // Show customization options if enabled
      this.showCustomizationOptions(templateId);
    }
  }

  /**
   * Use selected template
   */
  useSelectedTemplate() {
    if (!this.selectedTemplate) return;

    // Trigger template use event
    const event = new CustomEvent('templateSelected', {
      detail: {
        template: this.selectedTemplate,
        chartConfig: {
          type: this.selectedTemplate.chartType,
          data: this.selectedTemplate.data,
          options: this.selectedTemplate.options
        }
      }
    });

    window.dispatchEvent(event);

    // Show success feedback
    if (window.feedbackSystem) {
      window.feedbackSystem.showSuccess(
        'Template Applied',
        `${this.selectedTemplate.name} template has been applied`
      );
    }
  }

  /**
   * Customize selected template
   */
  customizeSelectedTemplate() {
    if (!this.selectedTemplate) return;

    const customizationPanel = document.getElementById('template-customization');
    if (customizationPanel) {
      customizationPanel.style.display = customizationPanel.style.display === 'none' ? 'block' : 'none';
    }
  }

  /**
   * Show customization options
   */
  showCustomizationOptions(templateId) {
    const template = this.templates.get(templateId);
    if (!template) return;

    const optionsContainer = document.getElementById('customization-options');
    if (!optionsContainer) return;

    const optionsHTML = `
      <div class="template-option">
        <span class="template-option-label">Chart Title</span>
        <div class="template-option-control">
          <input type="text" id="template-title" value="${template.options.plugins.title.text}" 
                 class="px-3 py-1 border rounded text-sm" style="width: 200px;">
        </div>
      </div>
      
      <div class="template-option">
        <span class="template-option-label">Color Scheme</span>
        <div class="template-option-control">
          <select id="template-colors" class="px-3 py-1 border rounded text-sm">
            <option value="default">Default</option>
            <option value="vibrant">Vibrant</option>
            <option value="pastel">Pastel</option>
            <option value="dark">Dark</option>
          </select>
        </div>
      </div>
      
      <div class="template-option">
        <span class="template-option-label">Animation Duration</span>
        <div class="template-option-control">
          <input type="range" id="template-animation" min="0" max="2000" value="${template.customization.animationDuration || 1000}" 
                 class="w-32">
          <span id="animation-value">${template.customization.animationDuration || 1000}ms</span>
        </div>
      </div>
      
      <div class="template-option">
        <span class="template-option-label">Show Grid</span>
        <div class="template-option-control">
          <input type="checkbox" id="template-grid" ${template.customization.showGrid ? 'checked' : ''} 
                 class="rounded">
        </div>
      </div>
    `;

    optionsContainer.innerHTML = optionsHTML;

    // Setup event listeners for customization
    this.setupCustomizationEvents();
  }

  /**
   * Setup customization events
   */
  setupCustomizationEvents() {
    // Animation slider
    const animationSlider = document.getElementById('template-animation');
    const animationValue = document.getElementById('animation-value');
    if (animationSlider && animationValue) {
      animationSlider.addEventListener('input', (e) => {
        animationValue.textContent = e.target.value + 'ms';
      });
    }
  }

  /**
   * Filter templates by category
   */
  filterByCategory(category) {
    // Update active category button
    document.querySelectorAll('.template-category').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.category === category);
    });

    // Filter template cards
    const templateCards = document.querySelectorAll('.template-card');
    templateCards.forEach(card => {
      const templateId = card.dataset.templateId;
      const template = this.templates.get(templateId);
      
      if (category === 'all' || template.category === category) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  }

  /**
   * Generate template previews
   */
  async generateTemplatePreviews() {
    if (!window.Chart) return;

    for (const [templateId, template] of this.templates) {
      const canvas = document.getElementById(`preview-${templateId}`);
      if (!canvas) continue;

      try {
        // Create mini chart configuration
        const previewConfig = {
          type: template.chartType,
          data: this.minifyDataForPreview(template.data),
          options: {
            ...template.options,
            responsive: false,
            maintainAspectRatio: false,
            plugins: {
              ...template.options.plugins,
              legend: { display: false },
              title: { display: false }
            },
            scales: template.options.scales ? {
              ...template.options.scales,
              ticks: { display: false },
              grid: { display: false }
            } : undefined
          }
        };

        // Create mini chart
        const ctx = canvas.getContext('2d');
        new Chart(ctx, previewConfig);

      } catch (error) {
        console.error(`Failed to generate preview for ${templateId}:`, error);
      }
    }
  }

  /**
   * Minify data for preview rendering
   */
  minifyDataForPreview(data) {
    const previewData = JSON.parse(JSON.stringify(data));
    
    // Limit data points for preview
    if (previewData.labels && previewData.labels.length > 6) {
      const step = Math.ceil(previewData.labels.length / 6);
      previewData.labels = previewData.labels.filter((_, i) => i % step === 0);
      
      if (previewData.datasets) {
        previewData.datasets.forEach(dataset => {
          if (dataset.data) {
            dataset.data = dataset.data.filter((_, i) => i % step === 0);
          }
        });
      }
    }
    
    return previewData;
  }

  /**
   * Get available categories
   */
  getCategories() {
    const categories = new Set();
    this.templates.forEach(template => {
      categories.add(template.category);
    });
    return Array.from(categories);
  }

  /**
   * Get template by ID
   */
  getTemplate(templateId) {
    return this.templates.get(templateId);
  }

  /**
   * Get all templates
   */
  getAllTemplates() {
    return Array.from(this.templates.values());
  }

  /**
   * Get templates by category
   */
  getTemplatesByCategory(category) {
    return Array.from(this.templates.values()).filter(template => template.category === category);
  }

  /**
   * Add custom template
   */
  addTemplate(template) {
    if (!template.id) {
      template.id = 'custom-' + Date.now();
    }
    
    this.templates.set(template.id, template);
    return template.id;
  }

  /**
   * Remove template
   */
  removeTemplate(templateId) {
    return this.templates.delete(templateId);
  }

  /**
   * Refresh template selector
   */
  refreshTemplates() {
    const container = document.querySelector('.template-selector');
    if (container) {
      // Regenerate previews
      this.generateTemplatePreviews();
      
      // Show feedback
      if (window.feedbackSystem) {
        window.feedbackSystem.showInfo('Templates Refreshed', 'Template previews have been updated');
      }
    }
  }

  /**
   * Export template configuration
   */
  exportTemplate(templateId) {
    const template = this.templates.get(templateId);
    if (!template) return null;

    const exportData = {
      ...template,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${template.name.replace(/\s+/g, '-').toLowerCase()}-template.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    return exportData;
  }

  /**
   * Import template configuration
   */
  importTemplate(templateData) {
    try {
      const template = {
        ...templateData,
        id: templateData.id || 'imported-' + Date.now()
      };
      
      this.addTemplate(template);
      return template.id;
    } catch (error) {
      console.error('Failed to import template:', error);
      return null;
    }
  }
}

// Export singleton instance
export const chartTemplates = new ChartTemplatesService();

// Make available globally
window.chartTemplates = chartTemplates;

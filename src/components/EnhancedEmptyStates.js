/**
 * Enhanced Empty States Component
 * Helpful empty state messages with examples and getting started tips
 */

class EnhancedEmptyStates {
  constructor() {
    this.exampleData = this.generateExampleData();
    this.tips = this.generateTips();
    this.init();
  }

  init() {
    this.setupEmptyStateStyles();
  }

  /**
   * Setup empty state styling
   */
  setupEmptyStateStyles() {
    if (document.getElementById('empty-state-styles')) return;

    const styles = document.createElement('style');
    styles.id = 'empty-state-styles';
    styles.textContent = `
      /* Empty State Container */
      .empty-state {
        background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
        border: 2px dashed #cbd5e1;
        border-radius: 16px;
        padding: 3rem 2rem;
        text-align: center;
        margin: 2rem 0;
        position: relative;
        overflow: hidden;
      }

      .empty-state::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, #3b82f6, #8b5cf6, #06d6a0);
        animation: gradient-shift 3s ease-in-out infinite;
      }

      @keyframes gradient-shift {
        0%, 100% { transform: translateX(0); }
        50% { transform: translateX(10px); }
      }

      /* Empty State Icon */
      .empty-state-icon {
        width: 80px;
        height: 80px;
        margin: 0 auto 1.5rem;
        background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 32px;
        color: #4f46e5;
        position: relative;
      }

      .empty-state-icon::after {
        content: '';
        position: absolute;
        inset: -4px;
        border-radius: 50%;
        background: linear-gradient(135deg, #3b82f6, #8b5cf6);
        opacity: 0;
        animation: pulse-ring 2s ease-in-out infinite;
      }

      @keyframes pulse-ring {
        0% { transform: scale(1); opacity: 0.5; }
        100% { transform: scale(1.2); opacity: 0; }
      }

      /* Empty State Content */
      .empty-state-title {
        font-size: 1.5rem;
        font-weight: 600;
        color: #1e293b;
        margin-bottom: 0.75rem;
      }

      .empty-state-description {
        color: #64748b;
        font-size: 1rem;
        line-height: 1.6;
        margin-bottom: 2rem;
        max-width: 500px;
        margin-left: auto;
        margin-right: auto;
      }

      /* Action Buttons */
      .empty-state-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        justify-content: center;
        margin-bottom: 2rem;
      }

      .empty-state-button {
        background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        font-size: 0.875rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        text-decoration: none;
      }

      .empty-state-button:hover {
        background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
      }

      .empty-state-button.secondary {
        background: white;
        color: #3b82f6;
        border: 2px solid #3b82f6;
      }

      .empty-state-button.secondary:hover {
        background: #3b82f6;
        color: white;
      }

      /* Example Data Section */
      .empty-state-examples {
        background: white;
        border-radius: 12px;
        padding: 1.5rem;
        margin-top: 2rem;
        border: 1px solid #e2e8f0;
      }

      .example-tabs {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 1rem;
        border-bottom: 1px solid #e2e8f0;
      }

      .example-tab {
        padding: 0.5rem 1rem;
        background: none;
        border: none;
        color: #64748b;
        cursor: pointer;
        font-size: 0.875rem;
        font-weight: 500;
        border-bottom: 2px solid transparent;
        transition: all 0.2s ease;
      }

      .example-tab.active {
        color: #3b82f6;
        border-bottom-color: #3b82f6;
      }

      .example-content {
        display: none;
        animation: fadeIn 0.3s ease-in-out;
      }

      .example-content.active {
        display: block;
      }

      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .example-data {
        background: #f8fafc;
        border-radius: 8px;
        padding: 1rem;
        font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
        font-size: 0.875rem;
        color: #374151;
        border: 1px solid #e2e8f0;
        position: relative;
        overflow: hidden;
      }

      .example-data::before {
        content: 'Example Data';
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        background: #3b82f6;
        color: white;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.75rem;
        font-family: system-ui;
      }

      /* Tips Section */
      .empty-state-tips {
        background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
        border-radius: 12px;
        padding: 1.5rem;
        margin-top: 1.5rem;
        border: 1px solid #fbbf24;
      }

      .tips-title {
        font-weight: 600;
        color: #92400e;
        margin-bottom: 1rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .tips-list {
        list-style: none;
        padding: 0;
        margin: 0;
      }

      .tips-list li {
        padding: 0.5rem 0;
        color: #78350f;
        display: flex;
        align-items: flex-start;
        gap: 0.5rem;
      }

      .tips-list li::before {
        content: '💡';
        flex-shrink: 0;
      }

      /* Mobile Optimizations */
      @media (max-width: 768px) {
        .empty-state {
          padding: 2rem 1rem;
          margin: 1rem 0;
        }
        
        .empty-state-icon {
          width: 60px;
          height: 60px;
          font-size: 24px;
        }
        
        .empty-state-title {
          font-size: 1.25rem;
        }
        
        .empty-state-actions {
          flex-direction: column;
          align-items: center;
        }
        
        .empty-state-button {
          width: 100%;
          max-width: 280px;
          justify-content: center;
        }
      }
    `;
    document.head.appendChild(styles);
  }

  /**
   * Show empty state for charts
   */
  showChartEmptyState(containerId, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const { chartType = 'bar' } = options;
    const emptyStateHTML = this.generateChartEmptyState(chartType);
    
    container.innerHTML = emptyStateHTML;
    this.setupEmptyStateInteractions(containerId, chartType);
  }

  /**
   * Generate chart-specific empty state
   */
  generateChartEmptyState(chartType) {
    const examples = this.exampleData[chartType] || this.exampleData.bar;
    const tips = this.tips[chartType] || this.tips.general;

    return `
      <div class="empty-state">
        <div class="empty-state-icon">
          <i class="fas fa-chart-${this.getChartIcon(chartType)}"></i>
        </div>
        
        <h2 class="empty-state-title">No ${chartType} chart data yet</h2>
        <p class="empty-state-description">
          Start creating beautiful ${chartType} charts by describing your data or trying one of our examples below.
        </p>

        <div class="empty-state-actions">
          <button class="empty-state-button" onclick="emptyStates.loadExample('${chartType}', 'sales')">
            <i class="fas fa-magic"></i>
            Try Sales Example
          </button>
          <button class="empty-state-button secondary" onclick="emptyStates.loadExample('${chartType}', 'custom')">
            <i class="fas fa-plus"></i>
            Create Custom Chart
          </button>
        </div>

        <div class="empty-state-examples">
          <div class="example-tabs">
            ${Object.keys(examples).map((key, index) => `
              <button class="example-tab ${index === 0 ? 'active' : ''}" 
                      onclick="emptyStates.switchExample('${chartType}', '${key}')">
                ${key.charAt(0).toUpperCase() + key.slice(1)}
              </button>
            `).join('')}
          </div>
          
          ${Object.entries(examples).map(([key, data], index) => `
            <div class="example-content ${index === 0 ? 'active' : ''}" 
                 id="example-${chartType}-${key}">
              <div class="example-data">${data}</div>
              <button class="empty-state-button mt-3" 
                      onclick="emptyStates.useExampleData('${chartType}', '${key}')">
                <i class="fas fa-play"></i>
                Use This Example
              </button>
            </div>
          `).join('')}
        </div>

        <div class="empty-state-tips">
          <div class="tips-title">
            <i class="fas fa-lightbulb"></i>
            Pro Tips for ${chartType} Charts
          </div>
          <ul class="tips-list">
            ${tips.map(tip => `<li>${tip}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;
  }

  /**
   * Show empty state for data input
   */
  showDataEmptyState(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const emptyStateHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">
          <i class="fas fa-database"></i>
        </div>
        
        <h2 class="empty-state-title">No data imported yet</h2>
        <p class="empty-state-description">
          Import your data to get started. You can paste data directly, upload a file, or connect to a data source.
        </p>

        <div class="empty-state-actions">
          <button class="empty-state-button" onclick="emptyStates.showDataImportDialog()">
            <i class="fas fa-upload"></i>
            Import Data
          </button>
          <button class="empty-state-button secondary" onclick="emptyStates.showSampleData()">
            <i class="fas fa-flask"></i>
            Use Sample Data
          </button>
        </div>

        <div class="empty-state-examples">
          <div class="example-tabs">
            <button class="example-tab active">CSV Format</button>
            <button class="example-tab">JSON Format</button>
            <button class="example-tab">Excel Format</button>
          </div>
          
          <div class="example-content active">
            <div class="example-data">Month,Sales,Revenue
January,120,15000
February,150,18000
March,180,22000
April,140,17000
May,200,25000</div>
          </div>
        </div>
      </div>
    `;
    
    container.innerHTML = emptyStateHTML;
  }

  /**
   * Show empty state for templates gallery
   */
  showTemplatesEmptyState(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const emptyStateHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">
          <i class="fas fa-layer-group"></i>
        </div>
        
        <h2 class="empty-state-title">No templates saved yet</h2>
        <p class="empty-state-description">
          Save your chart configurations as templates to reuse them later and maintain consistency across your visualizations.
        </p>

        <div class="empty-state-actions">
          <button class="empty-state-button" onclick="emptyStates.createFirstTemplate()">
            <i class="fas fa-plus"></i>
            Create Your First Template
          </button>
          <button class="empty-state-button secondary" onclick="emptyStates.browseTemplateGallery()">
            <i class="fas fa-th"></i>
            Browse Template Gallery
          </button>
        </div>

        <div class="empty-state-tips">
          <div class="tips-title">
            <i class="fas fa-lightbulb"></i>
            Template Benefits
          </div>
          <ul class="tips-list">
            <li>Save time by reusing chart configurations</li>
            <li>Maintain consistent branding across charts</li>
            <li>Share templates with your team members</li>
            <li>Quickly create similar charts with different data</li>
          </ul>
        </div>
      </div>
    `;
    
    container.innerHTML = emptyStateHTML;
  }

  /**
   * Generate example data for different chart types
   */
  generateExampleData() {
    return {
      bar: {
        sales: `Product,Q1,Q2,Q3,Q4
Laptops,450,520,480,610
Tablets,320,380,420,390
Phones,680,720,750,820
Accessories,150,180,200,240`,
        revenue: `Month,Revenue,Profit,Expenses
Jan,50000,12000,38000
Feb,55000,15000,40000
Mar,62000,18000,44000
Apr,58000,16000,42000`,
        custom: `Category,Value,Target
Marketing,25000,30000
Sales,45000,40000
Development,35000,35000
Support,15000,20000`
      },
      line: {
        growth: `Month,Users,Growth,Revenue
Jan,1000,0,5000
Feb,1200,20,6000
Mar,1450,21,7200
Apr,1750,21,8700
May,2100,20,10500`,
        trends: `Date,Stock Price,Volume,Market Cap
2024-01-01,150.25,1000000,45.5B
2024-01-02,152.80,1200000,46.2B
2024-01-03,151.90,900000,45.8B
2024-01-04,154.20,1400000,46.8B`,
        custom: `Week,Performance,Benchmark,Target
W1,85,80,90
W2,88,82,90
W3,92,85,95
W4,87,83,95`
      },
      pie: {
        market: `Segment,Percentage,Revenue
Enterprise,45,2500000
SMB,35,1800000
Startup,20,1000000`,
        budget: `Department,Budget,Spent,Remaining
Marketing,30,25,5
Development,40,35,5
Sales,20,18,2
Operations,10,8,2`,
        custom: `Source,Traffic,Conversions,Rate
Organic,40,120,3.0
Paid,35,140,4.0
Social,20,80,4.0
Direct,5,60,12.0`
      }
    };
  }

  /**
   * Generate tips for different chart types
   */
  generateTips() {
    return {
      general: [
        'Start with clear, descriptive column headers',
        'Ensure consistent data types in each column',
        'Remove empty rows and columns before importing',
        'Use commas to separate values in CSV format'
      ],
      bar: [
        'Limit to 8-10 categories for best readability',
        'Sort data by value for easier comparison',
        'Use consistent color schemes across related charts',
        'Add clear labels and units to your axes'
      ],
      line: [
        'Use time-based data on the X-axis for trends',
        'Limit to 5-7 lines for clarity',
        'Use different line styles for better distinction',
        'Add data points for precise values'
      ],
      pie: [
        'Limit to 5-7 segments for readability',
        'Start the largest segment at 12 o\'clock',
        'Use contrasting colors for adjacent segments',
        'Include percentages for clarity'
      ]
    };
  }

  /**
   * Get chart icon for chart type
   */
  getChartIcon(chartType) {
    const icons = {
      bar: 'column',
      line: 'line',
      pie: 'pie',
      area: 'area-chart',
      scatter: 'braille',
      bubble: 'circle',
      radar: 'spider',
      doughnut: 'chart-pie'
    };
    return icons[chartType] || 'chart-simple';
  }

  /**
   * Setup empty state interactions
   */
  setupEmptyStateInteractions(containerId, chartType) {
    // Setup tab switching
    const tabs = document.querySelectorAll(`#${containerId} .example-tab`);
    tabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        const key = e.target.textContent.toLowerCase();
        this.switchExample(chartType, key);
      });
    });
  }

  /**
   * Switch between examples
   */
  switchExample(chartType, exampleKey) {
    // Hide all examples
    document.querySelectorAll(`[id^="example-${chartType}-"]`).forEach(content => {
      content.classList.remove('active');
    });

    // Remove active class from all tabs
    document.querySelectorAll(`#${chartType}-examples .example-tab`).forEach(tab => {
      tab.classList.remove('active');
    });

    // Show selected example
    const selectedContent = document.getElementById(`example-${chartType}-${exampleKey}`);
    if (selectedContent) {
      selectedContent.classList.add('active');
    }

    // Add active class to selected tab
    event.target.classList.add('active');
  }

  /**
   * Load example data
   */
  loadExample(chartType, exampleType) {
    const examples = this.exampleData[chartType];
    if (!examples || !examples[exampleType]) return;

    const data = examples[exampleType];
    
    // Trigger data load event
    window.dispatchEvent(new CustomEvent('loadExampleData', {
      detail: { chartType, data, exampleType }
    }));
  }

  /**
   * Use example data
   */
  useExampleData(chartType, exampleKey) {
    const examples = this.exampleData[chartType];
    if (!examples || !examples[exampleKey]) return;

    const data = examples[exampleKey];
    
    // Find the data input area and populate it
    const dataInput = document.getElementById('data-input') || document.querySelector('textarea');
    if (dataInput) {
      dataInput.value = data;
      dataInput.dispatchEvent(new Event('input', { bubbles: true }));
    }

    // Show success feedback
    this.showSuccessFeedback('Example data loaded successfully!');
  }

  /**
   * Show data import dialog
   */
  showDataImportDialog() {
    // Dispatch event to show import dialog
    window.dispatchEvent(new CustomEvent('showDataImportDialog'));
  }

  /**
   * Show sample data
   */
  showSampleData() {
    const sampleData = this.exampleData.bar.sales;
    const dataInput = document.getElementById('data-input') || document.querySelector('textarea');
    if (dataInput) {
      dataInput.value = sampleData;
      dataInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
    this.showSuccessFeedback('Sample data loaded!');
  }

  /**
   * Create first template
   */
  createFirstTemplate() {
    window.dispatchEvent(new CustomEvent('createTemplate'));
  }

  /**
   * Browse template gallery
   */
  browseTemplateGallery() {
    window.location.href = '/templates.html';
  }

  /**
   * Show success feedback
   */
  showSuccessFeedback(message) {
    const feedback = document.createElement('div');
    feedback.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2';
    feedback.innerHTML = `
      <i class="fas fa-check-circle"></i>
      <span>${message}</span>
    `;
    
    document.body.appendChild(feedback);
    
    // Animate in
    setTimeout(() => {
      feedback.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
      feedback.style.transform = 'translateX(400px)';
      setTimeout(() => feedback.remove(), 300);
    }, 3000);
  }
}

// Export singleton instance
export const emptyStates = new EnhancedEmptyStates();

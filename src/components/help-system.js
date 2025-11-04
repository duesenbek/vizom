// Comprehensive Help System for VIZOM
class HelpSystem {
  constructor() {
    this.helpContent = new Map();
    this.searchIndex = new Map();
    this.currentTopic = null;
    this.helpModal = null;
    this.isHelpOpen = false;
    
    this.init();
  }

  init() {
    this.loadHelpContent();
    this.buildSearchIndex();
    this.createHelpModal();
    this.setupHelpTriggers();
    this.setupContextualHelp();
    this.setupSearchFunctionality();
  }

  // Load comprehensive help content
  loadHelpContent() {
    // Getting Started
    this.helpContent.set('getting-started', {
      title: 'Getting Started with VIZOM',
      category: 'basics',
      content: `
        <p>VIZOM is an AI-powered chart generation tool that transforms your data into beautiful visualizations.</p>
        <h3>Quick Start</h3>
        <ol>
          <li>Choose a chart type from the options on the left</li>
          <li>Describe your data in plain English or upload a file</li>
          <li>Click "Generate Chart" to create your visualization</li>
          <li>Export or share your chart with others</li>
        </ol>
        <h3>First Time User?</h3>
        <p>Take our <a href="#" onclick="window.onboarding.startOnboarding()">interactive tour</a> to learn all the features.</p>
      `,
      related: ['chart-types', 'data-input', 'exporting'],
      video: 'getting-started-tutorial'
    });

    // Chart Types
    this.helpContent.set('chart-types', {
      title: 'Understanding Chart Types',
      category: 'charts',
      content: `
        <p>VIZOM supports multiple chart types, each optimized for different kinds of data:</p>
        <div class="chart-types-grid">
          <div class="chart-type-help">
            <h4>📊 Bar Chart</h4>
            <p>Best for comparing quantities across categories. Use for sales data, survey results, or categorical comparisons.</p>
            <div class="example-data">Sales: Product A: 100, Product B: 150, Product C: 75</div>
          </div>
          <div class="chart-type-help">
            <h4>📈 Line Chart</h4>
            <p>Ideal for showing trends over time. Perfect for stock prices, temperature changes, or growth metrics.</p>
            <div class="example-data">Monthly Revenue: Jan: 1000, Feb: 1200, Mar: 1350, Apr: 1100</div>
          </div>
          <div class="chart-type-help">
            <h4>🥧 Pie Chart</h4>
            <p>Shows proportions of a whole. Use for market share, budget allocation, or percentage breakdowns.</p>
            <div class="example-data">Market Share: Company A: 40%, Company B: 35%, Company C: 25%</div>
          </div>
          <div class="chart-type-help">
            <h4>📉 Scatter Plot</h4>
            <p>Displays relationships between two variables. Great for correlation analysis and scientific data.</p>
            <div class="example-data">Height vs Weight: (170, 65), (175, 70), (180, 75), (165, 60)</div>
          </div>
          <div class="chart-type-help">
            <h4>📊 Area Chart</h4>
            <p>Similar to line charts but with filled areas. Excellent for showing cumulative totals and volume changes.</p>
            <div class="example-data">Website Traffic: Monday: 1000, Tuesday: 1200, Wednesday: 900</div>
          </div>
        </div>
      `,
      related: ['data-formats', 'choosing-charts', 'customization'],
      interactive: true
    });

    // Data Input
    this.helpContent.set('data-input', {
      title: 'Inputting Your Data',
      category: 'data',
      content: `
        <p>VIZOM accepts data in multiple formats. Choose the method that works best for you:</p>
        
        <h3>📝 Text Description</h3>
        <p>Describe your data in plain English using natural patterns:</p>
        <div class="code-example">
          <strong>Sales by Region:</strong><br>
          North: $50,000<br>
          South: $35,000<br>
          East: $42,000<br>
          West: $38,000
        </div>
        
        <h3>📁 File Upload</h3>
        <p>Upload CSV, JSON, or text files with your data. VIZOM will automatically detect the format and structure.</p>
        <ul>
          <li><strong>CSV:</strong> Comma-separated values with headers</li>
          <li><strong>JSON:</strong> Structured data in JSON format</li>
          <li><strong>TXT:</strong> Plain text with recognizable patterns</li>
        </ul>
        
        <h3>🎯 Quick Prompts</h3>
        <p>Use our pre-built examples to understand the format and get started quickly.</p>
        
        <h3>💡 Tips for Better Results</h3>
        <ul>
          <li>Use consistent formatting (labels: values)</li>
          <li>Include clear, descriptive labels</li>
          <li>Ensure numeric values are properly formatted</li>
          <li>Limit to 100 data points for best performance</li>
        </ul>
      `,
      related: ['data-formats', 'data-validation', 'examples'],
      examples: [
        { title: 'Sales Data', data: 'Q1 Sales: Product A: 1000, Product B: 1500, Product C: 800' },
        { title: 'Survey Results', data: 'Satisfaction: Very Satisfied: 45%, Satisfied: 30%, Neutral: 15%' }
      ]
    });

    // Data Formats
    this.helpContent.set('data-formats', {
      title: 'Supported Data Formats',
      category: 'data',
      content: `
        <p>VIZOM supports multiple data formats for maximum flexibility:</p>
        
        <h3>CSV Format</h3>
        <div class="code-example">
          product,amount,region<br>
          Product A,1000,North<br>
          Product B,1500,South<br>
          Product C,800,East
        </div>
        
        <h3>JSON Format</h3>
        <div class="code-example">
          [<br>
          &nbsp;&nbsp;{"label": "Product A", "value": 1000},<br>
          &nbsp;&nbsp;{"label": "Product B", "value": 1500},<br>
          &nbsp;&nbsp;{"label": "Product C", "value": 800}<br>
          ]
        </div>
        
        <h3>Text Format</h3>
        <div class="code-example">
          Product A: 1000<br>
          Product B: 1500<br>
          Product C: 800
        </div>
        
        <h3>Best Practices</h3>
        <ul>
          <li>Use clear column headers</li>
          <li>Consistent data formatting</li>
          <li>Avoid empty rows or columns</li>
          <li>Ensure numeric values don't contain text</li>
        </ul>
      `,
      related: ['data-input', 'data-validation', 'examples']
    });

    // Export Options
    this.helpContent.set('exporting', {
      title: 'Exporting Your Charts',
      category: 'export',
      content: `
        <p>Once you've created your chart, VIZOM offers multiple export options:</p>
        
        <h3>📸 Image Formats</h3>
        <ul>
          <li><strong>PNG:</strong> High-quality raster image, perfect for web and documents</li>
          <li><strong>JPG:</strong> Compressed image, smaller file size</li>
          <li><strong>SVG:</strong> Vector format, infinitely scalable</li>
          <li><strong>PDF:</strong> Document format, great for reports</li>
        </ul>
        
        <h3>📊 Data Formats</h3>
        <ul>
          <li><strong>CSV:</strong> Raw data in spreadsheet format</li>
          <li><strong>JSON:</strong> Structured data for developers</li>
          <li><strong>Excel:</strong> Direct export to Excel format</li>
        </ul>
        
        <h3>🔗 Sharing Options</h3>
        <ul>
          <li><strong>Link:</strong> Share a viewable link to your chart</li>
          <li><strong>Embed:</strong> Get HTML code for websites</li>
          <li><strong>Social Media:</strong> Optimized formats for different platforms</li>
        </ul>
        
        <h3>⚙️ Export Settings</h3>
        <p>Customize your export with:</p>
        <ul>
          <li>Resolution and quality settings</li>
          <li>Color scheme (light/dark)</li>
          <li>Size and dimensions</li>
          <li>Background transparency</li>
        </ul>
      `,
      related: ['sharing', 'customization', 'formats']
    });

    // Troubleshooting
    this.helpContent.set('troubleshooting', {
      title: 'Troubleshooting Common Issues',
      category: 'support',
      content: `
        <p>Solutions to common issues you might encounter:</p>
        
        <h3>🚫 Chart Not Generating</h3>
        <ul>
          <li>Check your data format and ensure it's properly structured</li>
          <li>Verify you have selected a chart type</li>
          <li>Make sure numeric values are actually numbers</li>
          <li>Try with a smaller dataset (under 100 points)</li>
        </ul>
        
        <h3>📊 Chart Looks Wrong</h3>
        <ul>
          <li>Ensure labels and values are correctly paired</li>
          <li>Check if you've chosen the right chart type for your data</li>
          <li>Verify data ranges are reasonable</li>
          <li>Try the data preview feature to validate input</li>
        </ul>
        
        <h3>📁 File Upload Issues</h3>
        <ul>
          <li>Check file size (max 10MB)</li>
          <li>Ensure file format is supported (CSV, JSON, TXT)</li>
          <li>Verify file encoding is UTF-8</li>
          <li>Check for special characters in headers</li>
        </ul>
        
        <h3>🌐 Connection Problems</h3>
        <ul>
          <li>Check your internet connection</li>
          <li>Try refreshing the page</li>
          <li>Clear browser cache and cookies</li>
          <li>Disable browser extensions temporarily</li>
        </ul>
        
        <h3>💾 Save/Export Issues</h3>
        <ul>
          <li>Check browser download permissions</li>
          <li>Ensure sufficient disk space</li>
          <li>Try a different export format</li>
          <li>Check popup blockers aren't interfering</li>
        </ul>
      `,
      related: ['data-validation', 'error-messages', 'contact-support']
    });

    // Keyboard Shortcuts
    this.helpContent.set('keyboard-shortcuts', {
      title: 'Keyboard Shortcuts',
      category: 'productivity',
      content: `
        <p>Master VIZOM with these keyboard shortcuts:</p>
        
        <div class="shortcuts-grid">
          <div class="shortcut-category">
            <h4>🎯 Navigation</h4>
            <div class="shortcut-item">
              <kbd>Ctrl</kbd> + <kbd>K</kbd>
              <span>Open Command Palette</span>
            </div>
            <div class="shortcut-item">
              <kbd>Alt</kbd> + <kbd>1</kbd>
              <span>Focus Chart Type</span>
            </div>
            <div class="shortcut-item">
              <kbd>Alt</kbd> + <kbd>2</kbd>
              <span>Focus Data Input</span>
            </div>
            <div class="shortcut-item">
              <kbd>Alt</kbd> + <kbd>3</kbd>
              <span>Focus Preview</span>
            </div>
          </div>
          
          <div class="shortcut-category">
            <h4>📊 Chart Operations</h4>
            <div class="shortcut-item">
              <kbd>Ctrl</kbd> + <kbd>Enter</kbd>
              <span>Generate Chart</span>
            </div>
            <div class="shortcut-item">
              <kbd>Ctrl</kbd> + <kbd>1</kbd>-<kbd>5</kbd>
              <span>Select Chart Type</span>
            </div>
            <div class="shortcut-item">
              <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>C</kbd>
              <span>Clear Data</span>
            </div>
            <div class="shortcut-item">
              <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>G</kbd>
              <span>Regenerate Chart</span>
            </div>
          </div>
          
          <div class="shortcut-category">
            <h4>💾 File Operations</h4>
            <div class="shortcut-item">
              <kbd>Ctrl</kbd> + <kbd>S</kbd>
              <span>Save Work</span>
            </div>
            <div class="shortcut-item">
              <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>S</kbd>
              <span>Save As</span>
            </div>
            <div class="shortcut-item">
              <kbd>Ctrl</kbd> + <kbd>O</kbd>
              <span>Open Save History</span>
            </div>
            <div class="shortcut-item">
              <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>E</kbd>
              <span>Export Chart</span>
            </div>
          </div>
          
          <div class="shortcut-category">
            <h4>🎨 View Options</h4>
            <div class="shortcut-item">
              <kbd>Ctrl</kbd> + <kbd>/</kbd>
              <span>Show Help</span>
            </div>
            <div class="shortcut-item">
              <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>D</kbd>
              <span>Toggle Dark Mode</span>
            </div>
            <div class="shortcut-item">
              <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>A</kbd>
              <span>Accessibility Options</span>
            </div>
            <div class="shortcut-item">
              <kbd>F1</kbd>
              <span>Show Help</span>
            </div>
          </div>
        </div>
        
        <p><strong>Pro Tip:</strong> Press <kbd>Ctrl</kbd> + <kbd>K</kbd> to access all commands quickly!</p>
      `,
      related: ['productivity', 'command-palette', 'accessibility']
    });

    // Accessibility
    this.helpContent.set('accessibility', {
      title: 'Accessibility Features',
      category: 'accessibility',
      content: `
        <p>VIZOM is committed to making chart creation accessible to everyone:</p>
        
        <h3>👁️ Visual Accessibility</h3>
        <ul>
          <li><strong>High Contrast Mode:</strong> Enhanced contrast for better visibility</li>
          <li><strong>Large Text:</strong> Increased font sizes for better readability</li>
          <li><strong>Color Blind Support:</strong> Filters for different color vision types</li>
          <li><strong>Focus Indicators:</strong> Clear visual focus for keyboard navigation</li>
        </ul>
        
        <h3>⌨️ Keyboard Navigation</h3>
        <ul>
          <li>Full keyboard control of all features</li>
          <li>Tab navigation between elements</li>
          <li>Shortcut keys for common actions</li>
          <li>Screen reader compatibility</li>
        </ul>
        
        <h3>🔊 Screen Reader Support</h3>
        <ul>
          <li>ARIA labels on all interactive elements</li>
          <li>Live regions for dynamic content updates</li>
          <li>Descriptive announcements for actions</li>
          <li>Proper heading structure for navigation</li>
        </ul>
        
        <h3>⚙️ Accessibility Options</h3>
        <p>Access accessibility features by:</p>
        <ul>
          <li>Clicking the accessibility icon in the header</li>
          <li>Using keyboard shortcut <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>A</kbd></li>
          <li>Through browser accessibility settings</li>
        </ul>
        
        <h3>📱 Mobile Accessibility</h3>
        <ul>
          <li>Touch-friendly interface</li>
          <li>Responsive design for all screen sizes</li>
          <li>Voice control compatibility</li>
          <li>Gesture support for common actions</li>
        </ul>
      `,
      related: ['keyboard-shortcuts', 'screen-readers', 'mobile-support']
    });

    // Advanced Features
    this.helpContent.set('advanced-features', {
      title: 'Advanced Features',
      category: 'advanced',
      content: `
        <p>Unlock the full potential of VIZOM with these advanced features:</p>
        
        <h3>🎨 Customization Panel</h3>
        <ul>
          <li>Color scheme customization</li>
          <li>Font and typography controls</li>
          <li>Axis and grid settings</li>
          <li>Animation and transition effects</li>
          <li>Legend and label positioning</li>
        </ul>
        
        <h3>📊 Data Analysis</h3>
        <ul>
          <li>Statistical summaries</li>
          <li>Trend analysis</li>
          <li>Correlation detection</li>
          <li>Anomaly identification</li>
          <li>Data cleaning suggestions</li>
        </ul>
        
        <h3>🔄 Automation</h3>
        <ul>
          <li>Batch chart generation</li>
          <li>Template creation and reuse</li>
          <li>API integration for developers</li>
          <li>Scheduled chart updates</li>
          <li>Custom workflows</li>
        </ul>
        
        <h3>🌐 Collaboration</h3>
        <ul>
          <li>Real-time collaboration</li>
          <li>Team workspaces</li>
          <li>Comment and annotation tools</li>
          <li>Version control</li>
          <li>Permission management</li>
        </ul>
        
        <h3>📈 Analytics</h3>
        <ul>
          <li>Usage tracking and insights</li>
          <li>Performance metrics</li>
          <li>Export analytics</li>
          <li>User behavior analysis</li>
          <li>Custom reporting</li>
        </ul>
      `,
      related: ['customization', 'api', 'collaboration']
    });

    // API Documentation
    this.helpContent.set('api', {
      title: 'API Documentation',
      category: 'developers',
      content: `
        <p>Integrate VIZOM into your applications with our REST API:</p>
        
        <h3>🔑 Authentication</h3>
        <div class="code-example">
          POST /api/auth/login<br>
          {<br>
          &nbsp;&nbsp;"email": "user@example.com",<br>
          &nbsp;&nbsp;"password": "your-password"<br>
          }
        </div>
        
        <h3>📊 Generate Chart</h3>
        <div class="code-example">
          POST /api/charts/generate<br>
          {<br>
          &nbsp;&nbsp;"type": "bar",<br>
          &nbsp;&nbsp;"data": "Product A: 100, Product B: 150",<br>
          &nbsp;&nbsp;"options": {<br>
          &nbsp;&nbsp;&nbsp;&nbsp;"colors": ["#FF6B6B", "#4ECDC4"]<br>
          &nbsp;&nbsp;}<br>
          }
        </div>
        
        <h3>📋 List Charts</h3>
        <div class="code-example">
          GET /api/charts<br>
          Returns: Array of chart objects with metadata
        </div>
        
        <h3>💾 Save Chart</h3>
        <div class="code-example">
          POST /api/charts<br>
          {<br>
          &nbsp;&nbsp;"name": "Sales Report",<br>
          &nbsp;&nbsp;"chart_data": {...},<br>
          &nbsp;&nbsp;"settings": {...}<br>
          }
        </div>
        
        <h3>🔍 Rate Limits</h3>
        <ul>
          <li>Free tier: 100 requests/hour</li>
          <li>Pro tier: 1000 requests/hour</li>
          <li>Enterprise: Unlimited</li>
        </ul>
        
        <h3>📚 SDK Libraries</h3>
        <ul>
          <li><strong>JavaScript:</strong> npm install vizom-js</li>
          <li><strong>Python:</strong> pip install vizom-python</li>
          <li><strong>PHP:</strong> composer require vizom/php</li>
        </ul>
      `,
      related: ['webhooks', 'examples', 'rate-limits']
    });
  }

  // Build search index for help content
  buildSearchIndex() {
    this.helpContent.forEach((content, id) => {
      const searchableText = [
        content.title,
        content.category,
        content.content.replace(/<[^>]*>/g, ' '), // Remove HTML tags
        ...(content.related || [])
      ].join(' ').toLowerCase();
      
      const words = searchableText.split(/\s+/);
      words.forEach(word => {
        if (word.length > 2) { // Skip very short words
          if (!this.searchIndex.has(word)) {
            this.searchIndex.set(word, new Set());
          }
          this.searchIndex.get(word).add(id);
        }
      });
    });
  }

  // Create help modal
  createHelpModal() {
    this.helpModal = document.createElement('div');
    this.helpModal.id = 'help-modal';
    this.helpModal.className = 'help-modal';
    this.helpModal.innerHTML = `
      <div class="help-backdrop"></div>
      <div class="help-container">
        <div class="help-header">
          <div class="help-search">
            <i class="fas fa-search"></i>
            <input type="text" id="help-search-input" placeholder="Search for help..." autocomplete="off">
          </div>
          <div class="help-actions">
            <button class="help-btn" id="help-tour-btn" title="Start guided tour">
              <i class="fas fa-play"></i>
            </button>
            <button class="help-btn" id="help-shortcuts-btn" title="Keyboard shortcuts">
              <i class="fas fa-keyboard"></i>
            </button>
            <button class="help-btn help-close" title="Close help">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
        
        <div class="help-content">
          <div class="help-sidebar">
            <div class="help-categories">
              <div class="help-category active" data-category="all">
                <i class="fas fa-home"></i>
                <span>All Topics</span>
              </div>
              <div class="help-category" data-category="basics">
                <i class="fas fa-book"></i>
                <span>Basics</span>
              </div>
              <div class="help-category" data-category="charts">
                <i class="fas fa-chart-bar"></i>
                <span>Charts</span>
              </div>
              <div class="help-category" data-category="data">
                <i class="fas fa-database"></i>
                <span>Data</span>
              </div>
              <div class="help-category" data-category="export">
                <i class="fas fa-download"></i>
                <span>Export</span>
              </div>
              <div class="help-category" data-category="productivity">
                <i class="fas fa-rocket"></i>
                <span>Productivity</span>
              </div>
              <div class="help-category" data-category="accessibility">
                <i class="fas fa-universal-access"></i>
                <span>Accessibility</span>
              </div>
              <div class="help-category" data-category="advanced">
                <i class="fas fa-cog"></i>
                <span>Advanced</span>
              </div>
              <div class="help-category" data-category="support">
                <i class="fas fa-life-ring"></i>
                <span>Support</span>
              </div>
            </div>
          </div>
          
          <div class="help-main">
            <div class="help-article" id="help-article">
              <div class="help-welcome">
                <h2>How can we help you today?</h2>
                <p>Search for a topic above or browse categories on the left.</p>
                
                <div class="help-quick-links">
                  <h3>Quick Links</h3>
                  <div class="quick-links-grid">
                    <a href="#" class="quick-link" data-topic="getting-started">
                      <i class="fas fa-rocket"></i>
                      <span>Getting Started</span>
                    </a>
                    <a href="#" class="quick-link" data-topic="chart-types">
                      <i class="fas fa-chart-bar"></i>
                      <span>Chart Types</span>
                    </a>
                    <a href="#" class="quick-link" data-topic="data-input">
                      <i class="fas fa-keyboard"></i>
                      <span>Data Input</span>
                    </a>
                    <a href="#" class="quick-link" data-topic="exporting">
                      <i class="fas fa-download"></i>
                      <span>Export Charts</span>
                    </a>
                    <a href="#" class="quick-link" data-topic="keyboard-shortcuts">
                      <i class="fas fa-keyboard"></i>
                      <span>Shortcuts</span>
                    </a>
                    <a href="#" class="quick-link" data-topic="troubleshooting">
                      <i class="fas fa-wrench"></i>
                      <span>Troubleshooting</span>
                    </a>
                  </div>
                </div>
                
                <div class="help-popular">
                  <h3>Popular Articles</h3>
                  <div class="popular-articles">
                    <a href="#" class="popular-article" data-topic="getting-started">
                      <span class="article-title">Getting Started with VIZOM</span>
                      <span class="article-category">Basics</span>
                    </a>
                    <a href="#" class="popular-article" data-topic="chart-types">
                      <span class="article-title">Choosing the Right Chart Type</span>
                      <span class="article-category">Charts</span>
                    </a>
                    <a href="#" class="popular-article" data-topic="data-formats">
                      <span class="article-title">Supported Data Formats</span>
                      <span class="article-category">Data</span>
                    </a>
                    <a href="#" class="popular-article" data-topic="keyboard-shortcuts">
                      <span class="article-title">Keyboard Shortcuts</span>
                      <span class="article-category">Productivity</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="help-footer">
          <div class="help-feedback">
            <span>Was this helpful?</span>
            <button class="feedback-btn" data-feedback="yes">
              <i class="fas fa-thumbs-up"></i>
            </button>
            <button class="feedback-btn" data-feedback="no">
              <i class="fas fa-thumbs-down"></i>
            </button>
          </div>
          <div class="help-contact">
            <span>Still need help?</span>
            <a href="#" class="contact-link" data-action="contact">Contact Support</a>
            <a href="#" class="contact-link" data-action="feedback">Send Feedback</a>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(this.helpModal);
    this.setupHelpModalEvents();
  }

  // Setup help modal events
  setupHelpModalEvents() {
    const backdrop = this.helpModal.querySelector('.help-backdrop');
    const closeBtn = this.helpModal.querySelector('.help-close');
    const searchInput = document.getElementById('help-search-input');
    const tourBtn = document.getElementById('help-tour-btn');
    const shortcutsBtn = document.getElementById('help-shortcuts-btn');

    // Close modal
    backdrop.addEventListener('click', () => this.closeHelp());
    closeBtn.addEventListener('click', () => this.closeHelp());

    // Search functionality
    searchInput.addEventListener('input', (e) => this.searchHelp(e.target.value));

    // Tour button
    tourBtn.addEventListener('click', () => {
      this.closeHelp();
      if (window.onboarding) {
        window.onboarding.startOnboarding();
      }
    });

    // Shortcuts button
    shortcutsBtn.addEventListener('click', () => {
      this.showTopic('keyboard-shortcuts');
    });

    // Category navigation
    this.helpModal.querySelectorAll('.help-category').forEach(category => {
      category.addEventListener('click', () => {
        this.filterByCategory(category.dataset.category);
        this.helpModal.querySelectorAll('.help-category').forEach(c => c.classList.remove('active'));
        category.classList.add('active');
      });
    });

    // Quick links
    this.helpModal.querySelectorAll('.quick-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        this.showTopic(link.dataset.topic);
      });
    });

    // Popular articles
    this.helpModal.querySelectorAll('.popular-article').forEach(article => {
      article.addEventListener('click', (e) => {
        e.preventDefault();
        this.showTopic(article.dataset.topic);
      });
    });

    // Feedback buttons
    this.helpModal.querySelectorAll('.feedback-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.submitFeedback(btn.dataset.feedback);
      });
    });

    // Contact links
    this.helpModal.querySelectorAll('.contact-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleContactAction(link.dataset.action);
      });
    });

    // Keyboard navigation
    this.helpModal.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeHelp();
      }
    });
  }

  // Setup help triggers throughout the app
  setupHelpTriggers() {
    // Add help buttons to various UI elements
    const helpTriggers = [
      { selector: '.chart-picker', topic: 'chart-types', position: 'top' },
      { selector: '.input-panel', topic: 'data-input', position: 'top' },
      { selector: '.preview-container', topic: 'exporting', position: 'top' },
      { selector: '#generate-btn', topic: 'troubleshooting', position: 'bottom' }
    ];

    helpTriggers.forEach(trigger => {
      const element = document.querySelector(trigger.selector);
      if (element) {
        this.addContextualHelpButton(element, trigger.topic, trigger.position);
      }
    });
  }

  // Add contextual help button to element
  addContextualHelpButton(element, topic, position = 'top') {
    const helpBtn = document.createElement('button');
    helpBtn.className = 'contextual-help-btn';
    helpBtn.setAttribute('aria-label', 'Get help');
    helpBtn.innerHTML = '<i class="fas fa-question-circle"></i>';
    helpBtn.dataset.topic = topic;

    helpBtn.addEventListener('click', () => {
      this.showTopic(topic);
    });

    // Position the button
    helpBtn.style.position = 'absolute';
    switch (position) {
      case 'top':
        helpBtn.style.top = '8px';
        helpBtn.style.right = '8px';
        break;
      case 'bottom':
        helpBtn.style.bottom = '8px';
        helpBtn.style.right = '8px';
        break;
    }

    element.style.position = 'relative';
    element.appendChild(helpBtn);
  }

  // Setup contextual help based on user actions
  setupContextualHelp() {
    // Show help when users encounter errors
    document.addEventListener('errorOccurred', (e) => {
      setTimeout(() => {
        this.showContextualHelp('error', e.detail.error);
      }, 1000);
    });

    // Show help for first-time chart generation
    let hasGeneratedChart = false;
    document.addEventListener('chartGenerated', () => {
      if (!hasGeneratedChart) {
        hasGeneratedChart = true;
        setTimeout(() => {
          this.showContextualHelp('success', 'chart-generated');
        }, 2000);
      }
    });

    // Show help for file uploads
    document.addEventListener('fileUploaded', () => {
      setTimeout(() => {
        this.showContextualHelp('info', 'file-uploaded');
      }, 1000);
    });
  }

  // Setup search functionality
  setupSearchFunctionality() {
    // Add keyboard shortcut for help search
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        this.openHelp();
        setTimeout(() => {
          document.getElementById('help-search-input').focus();
        }, 100);
      }
    });
  }

  // Open help modal
  openHelp(topic = null) {
    this.isHelpOpen = true;
    this.helpModal.classList.add('show');
    
    if (topic) {
      this.showTopic(topic);
    }
    
    // Track help usage
    if (window.analytics) {
      window.analytics.trackCustomEvent('help_opened', { topic });
    }
    
    // Announce to screen readers
    if (window.accessibility) {
      window.accessibility.announce('Help system opened');
    }
  }

  // Close help modal
  closeHelp() {
    this.isHelpOpen = false;
    this.helpModal.classList.remove('show');
    
    // Track help usage
    if (window.analytics) {
      window.analytics.trackCustomEvent('help_closed');
    }
    
    // Announce to screen readers
    if (window.accessibility) {
      window.accessibility.announce('Help system closed');
    }
  }

  // Show specific help topic
  showTopic(topicId) {
    const content = this.helpContent.get(topicId);
    if (!content) return;

    this.currentTopic = topicId;
    const article = document.getElementById('help-article');
    
    article.innerHTML = `
      <div class="help-article-content">
        <div class="article-header">
          <h2>${content.title}</h2>
          <div class="article-meta">
            <span class="article-category">${content.category}</span>
            <button class="article-bookmark" data-topic="${topicId}">
              <i class="far fa-bookmark"></i>
            </button>
          </div>
        </div>
        
        <div class="article-body">
          ${content.content}
        </div>
        
        ${content.related ? `
          <div class="article-related">
            <h3>Related Topics</h3>
            <div class="related-topics">
              ${content.related.map(relatedId => {
                const relatedContent = this.helpContent.get(relatedId);
                return relatedContent ? `
                  <a href="#" class="related-topic" data-topic="${relatedId}">
                    ${relatedContent.title}
                  </a>
                ` : '';
              }).join('')}
            </div>
          </div>
        ` : ''}
        
        ${content.examples ? `
          <div class="article-examples">
            <h3>Examples</h3>
            <div class="examples-list">
              ${content.examples.map(example => `
                <div class="example-item">
                  <h4>${example.title}</h4>
                  <div class="example-data">${example.data}</div>
                  <button class="example-use-btn" data-data="${example.data}">
                    Use This Example
                  </button>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
        
        ${content.video ? `
          <div class="article-video">
            <h3>Video Tutorial</h3>
            <div class="video-placeholder">
              <i class="fas fa-play-circle"></i>
              <span>Video: ${content.video}</span>
            </div>
          </div>
        ` : ''}
      </div>
    `;

    // Add event listeners for related topics
    article.querySelectorAll('.related-topic').forEach(topic => {
      topic.addEventListener('click', (e) => {
        e.preventDefault();
        this.showTopic(topic.dataset.topic);
      });
    });

    // Add event listeners for example buttons
    article.querySelectorAll('.example-use-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.useExample(btn.dataset.data);
      });
    });

    // Add event listener for bookmark
    article.querySelector('.article-bookmark')?.addEventListener('click', (e) => {
      this.toggleBookmark(e.currentTarget.dataset.topic);
    });

    // Track topic view
    if (window.analytics) {
      window.analytics.trackCustomEvent('help_topic_viewed', {
        topic: topicId,
        category: content.category
      });
    }
  }

  // Search help content
  searchHelp(query) {
    if (!query.trim()) {
      this.showWelcome();
      return;
    }

    const results = this.searchContent(query.toLowerCase());
    const article = document.getElementById('help-article');
    
    if (results.length === 0) {
      article.innerHTML = `
        <div class="help-search-results">
          <h2>No Results Found</h2>
          <p>No help topics found for "${query}".</p>
          <div class="search-suggestions">
            <h3>Suggestions:</h3>
            <ul>
              <li>Check your spelling</li>
              <li>Try different keywords</li>
              <li>Browse categories on the left</li>
              <li>Contact support for personalized help</li>
            </ul>
          </div>
        </div>
      `;
    } else {
      article.innerHTML = `
        <div class="help-search-results">
          <h2>Search Results</h2>
          <p>Found ${results.length} result${results.length !== 1 ? 's' : ''} for "${query}":</p>
          <div class="search-results-list">
            ${results.map(result => `
              <div class="search-result" data-topic="${result.id}">
                <h3>${result.title}</h3>
                <p class="result-category">${result.category}</p>
                <p class="result-excerpt">${result.excerpt}</p>
              </div>
            `).join('')}
          </div>
        </div>
      `;

      // Add click handlers for results
      article.querySelectorAll('.search-result').forEach(result => {
        result.addEventListener('click', () => {
          this.showTopic(result.dataset.topic);
        });
      });
    }
  }

  // Search content for matching topics
  searchContent(query) {
    const results = [];
    const queryWords = query.split(/\s+/).filter(word => word.length > 2);

    this.helpContent.forEach((content, id) => {
      let score = 0;
      const searchText = [
        content.title,
        content.category,
        content.content.replace(/<[^>]*>/g, ' ')
      ].join(' ').toLowerCase();

      // Calculate relevance score
      queryWords.forEach(word => {
        if (content.title.toLowerCase().includes(word)) {
          score += 10; // Title matches are most relevant
        }
        if (content.category.toLowerCase().includes(word)) {
          score += 5; // Category matches are relevant
        }
        if (searchText.includes(word)) {
          score += 1; // Content matches are relevant
        }
      });

      if (score > 0) {
        // Create excerpt
        const excerpt = this.createExcerpt(content.content, query);
        
        results.push({
          id: id,
          title: content.title,
          category: content.category,
          excerpt: excerpt,
          score: score
        });
      }
    });

    // Sort by relevance score
    return results.sort((a, b) => b.score - a.score);
  }

  // Create search excerpt
  createExcerpt(content, query) {
    const textContent = content.replace(/<[^>]*>/g, ' ');
    const queryWords = query.split(/\s+/);
    
    // Find the most relevant sentence
    const sentences = textContent.split(/[.!?]+/);
    let bestSentence = '';
    let bestScore = 0;
    
    sentences.forEach(sentence => {
      let score = 0;
      queryWords.forEach(word => {
        if (sentence.toLowerCase().includes(word)) {
          score += 1;
        }
      });
      
      if (score > bestScore && sentence.trim().length > 20) {
        bestScore = score;
        bestSentence = sentence.trim();
      }
    });
    
    return bestSentence || textContent.substring(0, 150) + '...';
  }

  // Filter by category
  filterByCategory(category) {
    if (category === 'all') {
      this.showWelcome();
      return;
    }

    const filtered = Array.from(this.helpContent.entries())
      .filter(([id, content]) => content.category === category);
    
    const article = document.getElementById('help-article');
    
    article.innerHTML = `
      <div class="help-category-view">
        <h2>${category.charAt(0).toUpperCase() + category.slice(1)}</h2>
        <div class="category-topics">
          ${filtered.map(([id, content]) => `
            <div class="category-topic" data-topic="${id}">
              <h3>${content.title}</h3>
              <p class="topic-excerpt">${this.createExcerpt(content.content, '')}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    // Add click handlers
    article.querySelectorAll('.category-topic').forEach(topic => {
      topic.addEventListener('click', () => {
        this.showTopic(topic.dataset.topic);
      });
    });
  }

  // Show welcome screen
  showWelcome() {
    const article = document.getElementById('help-article');
    article.innerHTML = this.helpModal.querySelector('.help-welcome').outerHTML;
    
    // Re-attach event listeners
    article.querySelectorAll('.quick-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        this.showTopic(link.dataset.topic);
      });
    });
    
    article.querySelectorAll('.popular-article').forEach(article => {
      article.addEventListener('click', (e) => {
        e.preventDefault();
        this.showTopic(article.dataset.topic);
      });
    });
  }

  // Show contextual help
  showContextualHelp(type, context) {
    let topic = null;
    
    switch (type) {
      case 'error':
        topic = 'troubleshooting';
        break;
      case 'success':
        topic = 'exporting';
        break;
      case 'info':
        topic = 'data-formats';
        break;
    }
    
    if (topic) {
      this.openHelp(topic);
    }
  }

  // Use example data
  useExample(data) {
    const textInput = document.getElementById('data-input');
    if (textInput) {
      textInput.value = data;
      textInput.focus();
    }
    
    this.closeHelp();
    
    // Show notification
    if (window.uiEnhancements) {
      window.uiEnhancements.showNotification('Example loaded to input field', 'success');
    }
  }

  // Toggle bookmark
  toggleBookmark(topicId) {
    const bookmarks = JSON.parse(localStorage.getItem('vizom_help_bookmarks') || '[]');
    const index = bookmarks.indexOf(topicId);
    
    if (index === -1) {
      bookmarks.push(topicId);
    } else {
      bookmarks.splice(index, 1);
    }
    
    localStorage.setItem('vizom_help_bookmarks', JSON.stringify(bookmarks));
    
    // Update bookmark button
    const bookmarkBtn = document.querySelector(`.article-bookmark[data-topic="${topicId}"] i`);
    if (bookmarkBtn) {
      bookmarkBtn.className = index === -1 ? 'fas fa-bookmark' : 'far fa-bookmark';
    }
  }

  // Submit feedback
  submitFeedback(feedback) {
    // Track feedback
    if (window.analytics) {
      window.analytics.trackCustomEvent('help_feedback', {
        topic: this.currentTopic,
        helpful: feedback === 'yes'
      });
    }
    
    // Show thank you message
    const feedbackSection = this.helpModal.querySelector('.help-feedback');
    feedbackSection.innerHTML = '<span>Thank you for your feedback!</span>';
  }

  // Handle contact actions
  handleContactAction(action) {
    switch (action) {
      case 'contact':
        this.openContactSupport();
        break;
      case 'feedback':
        this.openFeedbackForm();
        break;
    }
  }

  // Open contact support
  openContactSupport() {
    // Implementation would depend on your support system
    if (window.errorHandler) {
      window.errorHandler.handleError({
        message: 'User requested support contact',
        type: 'support_request'
      }, { supportRequest: true });
    }
  }

  // Open feedback form
  openFeedbackForm() {
    // Implementation would show a feedback modal
    const feedback = prompt('Please share your feedback about VIZOM:');
    if (feedback) {
      if (window.analytics) {
        window.analytics.trackCustomEvent('user_feedback', {
          feedback: feedback,
          context: 'help_system'
        });
      }
      
      if (window.uiEnhancements) {
        window.uiEnhancements.showNotification('Thank you for your feedback!', 'success');
      }
    }
  }

  // Public methods
  showHelp(topic = null) {
    this.openHelp(topic);
  }

  closeHelp() {
    this.closeHelp();
  }

  getHelpStats() {
    return {
      totalTopics: this.helpContent.size,
      categories: [...new Set(Array.from(this.helpContent.values()).map(c => c.category))],
      searchableWords: this.searchIndex.size
    };
  }
}

// Initialize help system
document.addEventListener('DOMContentLoaded', () => {
  window.helpSystem = new HelpSystem();
});

export { HelpSystem };

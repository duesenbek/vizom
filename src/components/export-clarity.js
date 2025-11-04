// Export Options Clarity Enhancement
class ExportClarityManager {
  constructor() {
    this.exportTerminology = new Map();
    this.useCaseMappings = new Map();
    this.fileFormatInfo = new Map();
    
    this.init();
  }

  init() {
    this.loadExportTerminology();
    this.loadUseCaseMappings();
    this.loadFileFormatInfo();
    this.enhanceExportInterface();
    this.setupSmartExportSuggestions();
  }

  // Load export terminology with user-friendly names
  loadExportTerminology() {
    this.exportTerminology.set('png', {
      technicalName: 'PNG',
      userFriendlyNames: ['Image', 'Picture', 'Screenshot', 'Visual'],
      description: 'High-quality image for documents and presentations',
      useCases: [
        'PowerPoint presentations',
        'Word documents',
        'Email attachments',
        'Social media posts',
        'Website images'
      ],
      pros: ['Perfect quality', 'Transparent background', 'Works everywhere'],
      cons: ['Larger file size'],
      technicalSpecs: '24-bit color, lossless compression',
      bestFor: 'Presentations and documents'
    });

    this.exportTerminology.set('jpg', {
      technicalName: 'JPG',
      userFriendlyNames: ['Photo', 'Compressed Image', 'Small Image'],
      description: 'Smaller image file size for sharing and web use',
      useCases: [
        'Email attachments',
        'Website images',
        'Social media',
        'Quick sharing',
        'Mobile apps'
      ],
      pros: ['Small file size', 'Fast loading', 'Universal support'],
      cons: ['Slight quality loss', 'No transparency'],
      technicalSpecs: '24-bit color, lossy compression',
      bestFor: 'Web and email'
    });

    this.exportTerminology.set('svg', {
      technicalName: 'SVG',
      userFriendlyNames: ['Vector', 'Scalable Image', 'Editable Graphic'],
      description: 'Infinitely scalable image that never loses quality',
      useCases: [
        'Logos and icons',
        'Print materials',
        'High-resolution displays',
        'Graphic design',
        'Professional publications'
      ],
      pros: ['Infinite scalability', 'Editable', 'Small file size for simple graphics'],
      cons: ['Not for photos', 'Complex for detailed images'],
      technicalSpecs: 'Vector graphics, XML-based',
      bestFor: 'Logos and print'
    });

    this.exportTerminology.set('pdf', {
      technicalName: 'PDF',
      userFriendlyNames: ['Document', 'Report', 'Printable File'],
      description: 'Professional document format for reports and printing',
      useCases: [
        'Business reports',
        'Academic papers',
        'Print publications',
        'Client presentations',
        'Archival documents'
      ],
      pros: ['Professional appearance', 'Print-ready', 'Universal access'],
      cons: ['Not easily editable', 'Larger than images'],
      technicalSpecs: 'Document format with embedded graphics',
      bestFor: 'Reports and printing'
    });

    this.exportTerminology.set('json', {
      technicalName: 'JSON',
      userFriendlyNames: ['Data', 'Raw Data', 'Developer Data', 'API Data'],
      description: 'Raw data format for developers and analysis',
      useCases: [
        'Programming projects',
        'Data analysis',
        'API integration',
        'Database import',
        'Custom visualizations'
      ],
      pros: ['Complete data', 'Machine-readable', 'Developer-friendly'],
      cons: ['Not visual', 'Requires technical knowledge'],
      technicalSpecs: 'JavaScript Object Notation',
      bestFor: 'Developers and data analysis'
    });

    this.exportTerminology.set('csv', {
      technicalName: 'CSV',
      userFriendlyNames: ['Spreadsheet', 'Excel Data', 'Table Data'],
      description: 'Data table format for spreadsheets and analysis',
      useCases: [
        'Excel spreadsheets',
        'Google Sheets',
        'Data analysis',
        'Database import',
        'Statistical software'
      ],
      pros: ['Opens in Excel', 'Easy to analyze', 'Universal format'],
      cons: ['No formatting', 'Data only'],
      technicalSpecs: 'Comma-separated values',
      bestFor: 'Data analysis'
    });

    this.exportTerminology.set('excel', {
      technicalName: 'Excel',
      userFriendlyNames: ['Excel File', 'Spreadsheet', 'Microsoft Excel'],
      description: 'Direct Excel format with charts and data',
      useCases: [
        'Microsoft Excel',
        'Business analytics',
        'Financial reports',
        'Data dashboards',
        'Corporate environments'
      ],
      pros: ['Native Excel format', 'Includes charts', 'Fully editable'],
      cons: ['Microsoft specific', 'Larger files'],
      technicalSpecs: 'Microsoft Excel format',
      bestFor: 'Excel users'
    });
  }

  // Load use case mappings for smart suggestions
  loadUseCaseMappings() {
    this.useCaseMappings.set('presentation', {
      keywords: ['presentation', 'powerpoint', 'slides', 'talk', 'meeting'],
      recommended: ['png', 'pdf'],
      reasoning: 'High quality for presentations, professional appearance'
    });

    this.useCaseMappings.set('document', {
      keywords: ['document', 'report', 'paper', 'thesis', 'article'],
      recommended: ['png', 'pdf'],
      reasoning: 'Professional formats for documents and reports'
    });

    this.useCaseMappings.set('web', {
      keywords: ['website', 'web', 'online', 'internet', 'blog'],
      recommended: ['jpg', 'png'],
      reasoning: 'Optimized for web use and fast loading'
    });

    this.useCaseMappings.set('email', {
      keywords: ['email', 'mail', 'send', 'message'],
      recommended: ['jpg', 'png'],
      reasoning: 'Small file sizes for email attachments'
    });

    this.useCaseMappings.set('print', {
      keywords: ['print', 'printing', 'poster', 'banner', 'brochure'],
      recommended: ['svg', 'pdf'],
      reasoning: 'High resolution for print materials'
    });

    this.useCaseMappings.set('social', {
      keywords: ['social', 'facebook', 'twitter', 'instagram', 'linkedin'],
      recommended: ['jpg', 'png'],
      reasoning: 'Optimized for social media platforms'
    });

    this.useCaseMappings.set('analysis', {
      keywords: ['analysis', 'data', 'statistics', 'research', 'study'],
      recommended: ['csv', 'json', 'excel'],
      reasoning: 'Data formats for analysis and processing'
    });

    this.useCaseMappings.set('development', {
      keywords: ['developer', 'programming', 'code', 'api', 'app'],
      recommended: ['json', 'svg'],
      reasoning: 'Developer-friendly formats for integration'
    });

    this.useCaseMappings.set('mobile', {
      keywords: ['mobile', 'phone', 'app', 'tablet'],
      recommended: ['jpg', 'png'],
      reasoning: 'Optimized for mobile devices and apps'
    });
  }

  // Load detailed file format information
  loadFileFormatInfo() {
    this.fileFormatInfo.set('png', {
      extension: '.png',
      mimeType: 'image/png',
      maxFileSize: '50MB',
      colorSupport: '24-bit (16.7 million colors)',
      compression: 'Lossless',
      transparency: 'Yes',
      animation: 'No',
      scalability: 'Fixed resolution',
      editing: 'Limited'
    });

    this.fileFormatInfo.set('jpg', {
      extension: '.jpg',
      mimeType: 'image/jpeg',
      maxFileSize: '25MB',
      colorSupport: '24-bit (16.7 million colors)',
      compression: 'Lossy',
      transparency: 'No',
      animation: 'No',
      scalability: 'Fixed resolution',
      editing: 'Limited'
    });

    this.fileFormatInfo.set('svg', {
      extension: '.svg',
      mimeType: 'image/svg+xml',
      maxFileSize: '10MB',
      colorSupport: 'Unlimited',
      compression: 'Lossless (vector)',
      transparency: 'Yes',
      animation: 'Yes (SMIL)',
      scalability: 'Infinite',
      editing: 'Full (vector editing)'
    });

    this.fileFormatInfo.set('pdf', {
      extension: '.pdf',
      mimeType: 'application/pdf',
      maxFileSize: '100MB',
      colorSupport: 'Full color',
      compression: 'Mixed',
      transparency: 'Yes',
      animation: 'No',
      scalability: 'Vector + raster',
      editing: 'Limited (PDF editor required)'
    });

    this.fileFormatInfo.set('json', {
      extension: '.json',
      mimeType: 'application/json',
      maxFileSize: '10MB',
      colorSupport: 'N/A (data)',
      compression: 'Text-based',
      transparency: 'N/A',
      animation: 'N/A',
      scalability: 'N/A',
      editing: 'Full (text editor)'
    });

    this.fileFormatInfo.set('csv', {
      extension: '.csv',
      mimeType: 'text/csv',
      maxFileSize: '10MB',
      colorSupport: 'N/A (data)',
      compression: 'Text-based',
      transparency: 'N/A',
      animation: 'N/A',
      scalability: 'N/A',
      editing: 'Full (spreadsheet)'
    });

    this.fileFormatInfo.set('excel', {
      extension: '.xlsx',
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      maxFileSize: '50MB',
      colorSupport: 'Full color',
      compression: 'Mixed',
      transparency: 'Yes',
      animation: 'No',
      scalability: 'Vector + raster',
      editing: 'Full (Excel)'
    });
  }

  // Enhance export interface with better terminology
  enhanceExportInterface() {
    const exportModal = document.getElementById('export-modal');
    if (!exportModal) return;

    // Find export options
    const exportOptions = exportModal.querySelectorAll('.export-option');
    
    exportOptions.forEach(option => {
      const format = option.dataset.format;
      const terminology = this.exportTerminology.get(format);
      
      if (terminology) {
        this.enhanceExportOption(option, format, terminology);
      }
    });

    // Add use case selector
    this.addUseCaseSelector(exportModal);
    
    // Add format comparison
    this.addFormatComparison(exportModal);
  }

  // Enhance individual export option
  enhanceExportOption(option, format, terminology) {
    // Update title with user-friendly names
    const title = option.querySelector('.option-title');
    if (title) {
      const primaryName = terminology.userFriendlyNames[0];
      title.innerHTML = `
        ${primaryName}
        <div class="technical-name">${terminology.technicalName}</div>
      `;
    }

    // Update description
    const description = option.querySelector('.option-description');
    if (description) {
      description.textContent = terminology.description;
    }

    // Add use cases
    const useCases = option.querySelector('.option-use-cases');
    if (!useCases) {
      const useCasesDiv = document.createElement('div');
      useCasesDiv.className = 'option-use-cases';
      useCasesDiv.innerHTML = `
        <h4>Perfect for:</h4>
        <ul>
          ${terminology.useCases.slice(0, 3).map(useCase => 
            `<li>${useCase}</li>`
          ).join('')}
        </ul>
      `;
      option.appendChild(useCasesDiv);
    }

    // Add pros and cons
    const prosCons = option.querySelector('.option-pros-cons');
    if (!prosCons) {
      const prosConsDiv = document.createElement('div');
      prosConsDiv.className = 'option-pros-cons';
      prosConsDiv.innerHTML = `
        <div class="pros">
          <h5>✅ Advantages</h5>
          <ul>
            ${terminology.pros.slice(0, 2).map(pro => 
              `<li>${pro}</li>`
            ).join('')}
          </ul>
        </div>
        <div class="cons">
          <h5>⚠️ Considerations</h5>
          <ul>
            ${terminology.cons.map(con => 
              `<li>${con}</li>`
            ).join('')}
          </ul>
        </div>
      `;
      option.appendChild(prosConsDiv);
    }

    // Add technical specs
    const specs = this.fileFormatInfo.get(format);
    if (specs) {
      const specsDiv = document.createElement('div');
      specsDiv.className = 'option-specs';
      specsDiv.innerHTML = `
        <h5>📋 Technical Details</h5>
        <div class="specs-grid">
          <div class="spec-item">
            <span class="spec-label">File Extension:</span>
            <span class="spec-value">${specs.extension}</span>
          </div>
          <div class="spec-item">
            <span class="spec-label">Max Size:</span>
            <span class="spec-value">${specs.maxFileSize}</span>
          </div>
          <div class="spec-item">
            <span class="spec-label">Best For:</span>
            <span class="spec-value">${terminology.bestFor}</span>
          </div>
        </div>
      `;
      option.appendChild(specsDiv);
    }
  }

  // Add use case selector for smart recommendations
  addUseCaseSelector(exportModal) {
    const existingSelector = exportModal.querySelector('.use-case-selector');
    if (existingSelector) return;

    const selector = document.createElement('div');
    selector.className = 'use-case-selector';
    selector.innerHTML = `
      <div class="selector-header">
        <h3>💡 What will you use this export for?</h3>
        <p>Get personalized recommendations based on your needs</p>
      </div>
      <div class="use-case-options">
        <button class="use-case-btn" data-use-case="presentation">
          <i class="fas fa-presentation"></i>
          <span>Presentation</span>
        </button>
        <button class="use-case-btn" data-use-case="document">
          <i class="fas fa-file-alt"></i>
          <span>Document</span>
        </button>
        <button class="use-case-btn" data-use-case="web">
          <i class="fas fa-globe"></i>
          <span>Website</span>
        </button>
        <button class="use-case-btn" data-use-case="email">
          <i class="fas fa-envelope"></i>
          <span>Email</span>
        </button>
        <button class="use-case-btn" data-use-case="print">
          <i class="fas fa-print"></i>
          <span>Print</span>
        </button>
        <button class="use-case-btn" data-use-case="social">
          <i class="fas fa-share-alt"></i>
          <span>Social Media</span>
        </button>
        <button class="use-case-btn" data-use-case="analysis">
          <i class="fas fa-chart-line"></i>
          <span>Data Analysis</span>
        </button>
        <button class="use-case-btn" data-use-case="development">
          <i class="fas fa-code"></i>
          <span>Development</span>
        </button>
      </div>
      <div class="recommendation-result" id="recommendation-result" style="display: none;">
        <h4>🎯 Recommended Format</h4>
        <div class="recommended-format" id="recommended-format"></div>
        <p class="recommendation-reasoning" id="recommendation-reasoning"></p>
      </div>
    `;

    // Insert at the beginning of export modal
    const modalContent = exportModal.querySelector('.modal-content');
    if (modalContent) {
      modalContent.insertBefore(selector, modalContent.firstChild);
    }

    // Setup event handlers
    this.setupUseCaseSelectors(selector);
  }

  // Setup use case selector event handlers
  setupUseCaseSelectors(selector) {
    const useCaseBtns = selector.querySelectorAll('.use-case-btn');
    const resultDiv = selector.querySelector('#recommendation-result');
    const recommendedFormat = selector.querySelector('#recommended-format');
    const reasoning = selector.querySelector('#recommendation-reasoning');

    useCaseBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const useCase = btn.dataset.useCase;
        const mapping = this.useCaseMappings.get(useCase);
        
        if (mapping) {
          // Highlight selected use case
          useCaseBtns.forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected');

          // Show recommendation
          const primaryRecommendation = mapping.recommended[0];
          const terminology = this.exportTerminology.get(primaryRecommendation);
          
          if (terminology) {
            recommendedFormat.innerHTML = `
              <div class="format-card">
                <div class="format-icon">${this.getFormatIcon(primaryRecommendation)}</div>
                <div class="format-info">
                  <div class="format-name">${terminology.userFriendlyNames[0]}</div>
                  <div class="format-technical">${terminology.technicalName}</div>
                </div>
              </div>
            `;
            
            reasoning.textContent = mapping.reasoning;
            resultDiv.style.display = 'block';

            // Highlight recommended export options
            this.highlightRecommendedFormats(mapping.recommended);

            // Scroll to first recommended option
            const firstRecommended = document.querySelector(`.export-option[data-format="${primaryRecommendation}"]`);
            if (firstRecommended) {
              firstRecommended.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }
        }
      });
    });
  }

  // Get format icon
  getFormatIcon(format) {
    const icons = {
      'png': '🖼️',
      'jpg': '📷',
      'svg': '🎨',
      'pdf': '📄',
      'json': '💾',
      'csv': '📊',
      'excel': '📈'
    };
    return icons[format] || '📁';
  }

  // Highlight recommended export formats
  highlightRecommendedFormats(recommended) {
    const exportOptions = document.querySelectorAll('.export-option');
    
    exportOptions.forEach(option => {
      const format = option.dataset.format;
      const isRecommended = recommended.includes(format);
      
      option.classList.toggle('recommended', isRecommended);
      
      // Add or remove recommendation badge
      let badge = option.querySelector('.recommendation-badge');
      if (isRecommended && !badge) {
        badge = document.createElement('div');
        badge.className = 'recommendation-badge';
        badge.innerHTML = '⭐ Recommended';
        option.appendChild(badge);
      } else if (!isRecommended && badge) {
        badge.remove();
      }
    });
  }

  // Add format comparison table
  addFormatComparison(exportModal) {
    const existingComparison = exportModal.querySelector('.format-comparison');
    if (existingComparison) return;

    const comparison = document.createElement('div');
    comparison.className = 'format-comparison';
    comparison.innerHTML = `
      <div class="comparison-header">
        <h3>📊 Format Comparison</h3>
        <button class="toggle-comparison" id="toggle-comparison">
          Show Comparison
        </button>
      </div>
      <div class="comparison-table" id="comparison-table" style="display: none;">
        <table>
          <thead>
            <tr>
              <th>Format</th>
              <th>Best For</th>
              <th>File Size</th>
              <th>Quality</th>
              <th>Transparency</th>
              <th>Editing</th>
            </tr>
          </thead>
          <tbody>
            ${this.generateComparisonRows()}
          </tbody>
        </table>
      </div>
    `;

    // Add to modal footer
    const modalFooter = exportModal.querySelector('.modal-footer');
    if (modalFooter) {
      modalFooter.appendChild(comparison);
    }

    // Setup toggle
    const toggleBtn = comparison.querySelector('#toggle-comparison');
    const table = comparison.querySelector('#comparison-table');
    
    toggleBtn.addEventListener('click', () => {
      const isVisible = table.style.display !== 'none';
      table.style.display = isVisible ? 'none' : 'block';
      toggleBtn.textContent = isVisible ? 'Show Comparison' : 'Hide Comparison';
    });
  }

  // Generate comparison table rows
  generateComparisonRows() {
    const formats = ['png', 'jpg', 'svg', 'pdf', 'json', 'csv'];
    
    return formats.map(format => {
      const terminology = this.exportTerminology.get(format);
      const specs = this.fileFormatInfo.get(format);
      
      if (!terminology || !specs) return '';
      
      return `
        <tr data-format="${format}">
          <td>
            <div class="format-cell">
              <span class="format-icon">${this.getFormatIcon(format)}</span>
              <div>
                <div class="format-name">${terminology.userFriendlyNames[0]}</div>
                <div class="format-technical">${terminology.technicalName}</div>
              </div>
            </div>
          </td>
          <td>${terminology.bestFor}</td>
          <td>${this.getFileSizeRating(format)}</td>
          <td>${this.getQualityRating(format)}</td>
          <td>${specs.transparency === 'Yes' ? '✅ Yes' : '❌ No'}</td>
          <td>${this.getEditingRating(specs.editing)}</td>
        </tr>
      `;
    }).join('');
  }

  // Get file size rating
  getFileSizeRating(format) {
    const ratings = {
      'svg': '🟢 Small',
      'jpg': '🟢 Small',
      'png': '🟡 Medium',
      'pdf': '🟡 Medium',
      'json': '🟢 Small',
      'csv': '🟢 Small',
      'excel': '🔴 Large'
    };
    return ratings[format] || '🟡 Medium';
  }

  // Get quality rating
  getQualityRating(format) {
    const ratings = {
      'svg': '🟢 Perfect',
      'png': '🟢 Excellent',
      'jpg': '🟡 Good',
      'pdf': '🟢 Excellent',
      'json': 'N/A',
      'csv': 'N/A',
      'excel': '🟢 Excellent'
    };
    return ratings[format] || '🟡 Good';
  }

  // Get editing rating
  getEditingRating(editing) {
    if (editing.includes('Full')) return '🟢 Full';
    if (editing.includes('Limited')) return '🟡 Limited';
    return '🔴 None';
  }

  // Setup smart export suggestions
  setupSmartExportSuggestions() {
    // Add smart suggestions to export button
    const exportBtn = document.getElementById('export-btn');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        this.analyzeExportContext();
      });
    }

    // Add quick export based on user behavior
    this.addQuickExportOptions();
  }

  // Analyze export context for smart suggestions
  analyzeExportContext() {
    // Analyze current chart type
    const selectedChart = document.querySelector('.chart-option.selected');
    const chartType = selectedChart ? selectedChart.dataset.chartType : null;
    
    // Analyze data size
    const dataInput = document.getElementById('data-input');
    const dataSize = dataInput ? dataInput.value.length : 0;
    
    // Analyze user's previous export choices
    const previousExports = this.getPreviousExportHistory();
    
    // Generate smart suggestions
    const suggestions = this.generateSmartSuggestions(chartType, dataSize, previousExports);
    
    // Display suggestions
    this.displaySmartSuggestions(suggestions);
  }

  // Get previous export history
  getPreviousExportHistory() {
    try {
      const history = localStorage.getItem('vizom_export_history');
      return history ? JSON.parse(history) : [];
    } catch (error) {
      return [];
    }
  }

  // Generate smart suggestions based on context
  generateSmartSuggestions(chartType, dataSize, previousExports) {
    const suggestions = [];
    
    // Based on chart type
    if (chartType === 'scatter-plot' || chartType === 'bubble-chart') {
      suggestions.push({
        format: 'svg',
        reason: 'Vector format preserves detail for complex charts'
      });
    }
    
    // Based on data size
    if (dataSize > 1000) {
      suggestions.push({
        format: 'json',
        reason: 'Large datasets are better exported as data'
      });
    }
    
    // Based on history
    if (previousExports.length > 0) {
      const mostUsed = this.getMostUsedFormat(previousExports);
      suggestions.push({
        format: mostUsed,
        reason: 'You used this format most often'
      });
    }
    
    // Default suggestions
    if (suggestions.length === 0) {
      suggestions.push({
        format: 'png',
        reason: 'Most versatile format for general use'
      });
    }
    
    return suggestions;
  }

  // Get most used format from history
  getMostUsedFormat(history) {
    const counts = {};
    history.forEach(export_ => {
      counts[export_.format] = (counts[export_.format] || 0) + 1;
    });
    
    return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
  }

  // Display smart suggestions
  displaySmartSuggestions(suggestions) {
    const existing = document.querySelector('.smart-suggestions');
    if (existing) existing.remove();

    const suggestionsDiv = document.createElement('div');
    suggestionsDiv.className = 'smart-suggestions';
    suggestionsDiv.innerHTML = `
      <h4>💡 Smart Suggestions</h4>
      <div class="suggestion-list">
        ${suggestions.map(suggestion => {
          const terminology = this.exportTerminology.get(suggestion.format);
          return `
            <div class="suggestion-item" data-format="${suggestion.format}">
              <div class="suggestion-format">
                <span class="format-icon">${this.getFormatIcon(suggestion.format)}</span>
                <span class="format-name">${terminology?.userFriendlyNames[0] || suggestion.format}</span>
              </div>
              <div class="suggestion-reason">${suggestion.reason}</div>
              <button class="suggestion-apply" data-format="${suggestion.format}">
                Use This
              </button>
            </div>
          `;
        }).join('')}
      </div>
    `;

    // Add to export modal
    const exportModal = document.getElementById('export-modal');
    if (exportModal) {
      const modalContent = exportModal.querySelector('.modal-content');
      modalContent.appendChild(suggestionsDiv);

      // Setup event handlers
      suggestionsDiv.querySelectorAll('.suggestion-apply').forEach(btn => {
        btn.addEventListener('click', () => {
          const format = btn.dataset.format;
          this.selectExportFormat(format);
        });
      });
    }
  }

  // Select export format
  selectExportFormat(format) {
    const exportOption = document.querySelector(`.export-option[data-format="${format}"]`);
    if (exportOption) {
      // Remove previous selection
      document.querySelectorAll('.export-option').forEach(option => {
        option.classList.remove('selected');
      });
      
      // Select new format
      exportOption.classList.add('selected');
      exportOption.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  // Add quick export options
  addQuickExportOptions() {
    const exportBtn = document.getElementById('export-btn');
    if (!exportBtn) return;

    // Create quick export dropdown
    const quickExport = document.createElement('div');
    quickExport.className = 'quick-export-dropdown';
    quickExport.innerHTML = `
      <div class="quick-export-header">
        <h4>Quick Export</h4>
        <p>Export to your most used formats</p>
      </div>
      <div class="quick-export-options" id="quick-export-options">
        <!-- Will be populated dynamically -->
      </div>
    `;

    // Position near export button
    exportBtn.parentNode.appendChild(quickExport);

    // Populate with recent formats
    this.populateQuickExport(quickExport);

    // Setup toggle
    exportBtn.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      quickExport.classList.toggle('show');
    });
  }

  // Populate quick export options
  populateQuickExport(container) {
    const history = this.getPreviousExportHistory();
    const recentFormats = history.slice(-3).map(h => h.format);
    
    // If no history, show defaults
    if (recentFormats.length === 0) {
      recentFormats.push('png', 'jpg', 'pdf');
    }

    const optionsContainer = container.querySelector('#quick-export-options');
    optionsContainer.innerHTML = recentFormats.map(format => {
      const terminology = this.exportTerminology.get(format);
      if (!terminology) return '';
      
      return `
        <button class="quick-export-btn" data-format="${format}">
          <span class="format-icon">${this.getFormatIcon(format)}</span>
          <span class="format-name">${terminology.userFriendlyNames[0]}</span>
        </button>
      `;
    }).join('');

    // Setup event handlers
    optionsContainer.querySelectorAll('.quick-export-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const format = btn.dataset.format;
        this.quickExport(format);
        container.classList.remove('show');
      });
    });
  }

  // Quick export to format
  quickExport(format) {
    // Trigger export with format
    document.dispatchEvent(new CustomEvent('quickExport', {
      detail: { format: format }
    }));
  }

  // Public methods
  getExportTerminology(format) {
    return this.exportTerminology.get(format);
  }

  getUseCaseRecommendation(useCase) {
    return this.useCaseMappings.get(useCase);
  }

  getFileFormatInfo(format) {
    return this.fileFormatInfo.get(format);
  }
}

// Initialize export clarity manager
document.addEventListener('DOMContentLoaded', () => {
  window.exportClarityManager = new ExportClarityManager();
});

export { ExportClarityManager };

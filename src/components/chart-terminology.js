// Chart Terminology and Mental Model Alignment
class ChartTerminologyManager {
  constructor() {
    this.terminologyMap = new Map();
    this.userMentalModels = new Map();
    this.searchAliases = new Map();
    
    this.init();
  }

  init() {
    this.loadTerminologyMappings();
    this.loadUserMentalModels();
    this.loadSearchAliases();
    this.setupTerminologyEnhancements();
  }

  // Load terminology mappings from technical to user-friendly terms
  loadTerminologyMappings() {
    this.terminologyMap.set('bar-chart', {
      technicalName: 'Bar Chart',
      userFriendlyNames: ['Bar Chart', 'Column Chart', 'Vertical Bars'],
      description: 'Compare quantities across different categories',
      useCases: [
        'Sales by product',
        'Survey responses',
        'Population by region',
        'Test scores by subject'
      ],
      mentalModel: 'Comparing heights of different bars'
    });

    this.terminologyMap.set('line-chart', {
      technicalName: 'Line Chart',
      userFriendlyNames: ['Line Chart', 'Trend Chart', 'Time Series', 'Progress Chart'],
      description: 'Show changes over time or continuous data',
      useCases: [
        'Stock prices over time',
        'Temperature changes',
        'Website traffic trends',
        'Growth metrics'
      ],
      mentalModel: 'Following a line that goes up and down'
    });

    this.terminologyMap.set('pie-chart', {
      technicalName: 'Pie Chart',
      userFriendlyNames: ['Pie Chart', 'Circle Chart', 'Percentage Chart', 'Parts of Whole'],
      description: 'Show proportions and percentages of a whole',
      useCases: [
        'Market share',
        'Budget allocation',
        'Survey answer distribution',
        'Time spent on activities'
      ],
      mentalModel: 'Slicing a pie into different sized pieces'
    });

    this.terminologyMap.set('scatter-plot', {
      technicalName: 'Scatter Plot',
      userFriendlyNames: ['Scatter Plot', 'Correlation Chart', 'Dot Plot', 'Relationship Chart'],
      description: 'Show relationships between two variables',
      useCases: [
        'Height vs weight',
        'Price vs quality ratings',
        'Study time vs test scores',
        'Age vs income'
      ],
      mentalModel: 'Sprinkling dots to see if they form a pattern'
    });

    this.terminologyMap.set('area-chart', {
      technicalName: 'Area Chart',
      userFriendlyNames: ['Area Chart', 'Filled Line Chart', 'Mountain Chart', 'Volume Chart'],
      description: 'Show trends over time with filled areas',
      useCases: [
        'Cumulative sales',
        'Website traffic over time',
        'Revenue growth',
        'Population changes'
      ],
      mentalModel: 'Like a line chart but colored underneath'
    });

    this.terminologyMap.set('histogram', {
      technicalName: 'Histogram',
      userFriendlyNames: ['Histogram', 'Frequency Chart', 'Distribution Chart', 'Bar Frequency'],
      description: 'Show distribution of data across intervals',
      useCases: [
        'Age distribution',
        'Test score ranges',
        'Income brackets',
        'Product price ranges'
      ],
      mentalModel: 'Grouping similar things and counting how many in each group'
    });

    this.terminologyMap.set('bubble-chart', {
      technicalName: 'Bubble Chart',
      userFriendlyNames: ['Bubble Chart', 'Size Chart', 'Three-Variable Chart'],
      description: 'Compare three variables using bubble size and position',
      useCases: [
        'Products: sales, profit, market share',
        'Countries: GDP, population, happiness',
        'Projects: cost, duration, team size'
      ],
      mentalModel: 'Like a scatter plot but bubbles show importance'
    });

    this.terminologyMap.set('donut-chart', {
      technicalName: 'Donut Chart',
      userFriendlyNames: ['Donut Chart', 'Ring Chart', 'Hole Pie Chart'],
      description: 'Show proportions like a pie chart with a center hole',
      useCases: [
        'Budget breakdown',
        'Market share with total in center',
        'Time allocation',
        'Resource distribution'
      ],
      mentalModel: 'A pie chart with a donut hole in the middle'
    });
  }

  // Load user mental models and common questions
  loadUserMentalModels() {
    this.userMentalModels.set('comparison', {
      keywords: ['compare', 'difference', 'versus', 'vs', 'better', 'worse', 'more', 'less'],
      suggestedCharts: ['bar-chart', 'column-chart'],
      questionPatterns: [
        'Which is better?',
        'Compare X and Y',
        'What has more?',
        'Show differences'
      ]
    });

    this.userMentalModels.set('trend', {
      keywords: ['trend', 'over time', 'change', 'growth', 'increase', 'decrease', 'history'],
      suggestedCharts: ['line-chart', 'area-chart'],
      questionPatterns: [
        'How has X changed?',
        'Show the trend',
        'Over time',
        'Historical data'
      ]
    });

    this.userMentalModels.set('proportion', {
      keywords: ['percentage', 'proportion', 'part of', 'share', 'portion', 'slice'],
      suggestedCharts: ['pie-chart', 'donut-chart'],
      questionPatterns: [
        'What percentage?',
        'Part of whole',
        'How much of X?',
        'Share breakdown'
      ]
    });

    this.userMentalModels.set('relationship', {
      keywords: ['relationship', 'correlation', 'connection', 'affects', 'impact', 'depends on'],
      suggestedCharts: ['scatter-plot', 'bubble-chart'],
      questionPatterns: [
        'How does X affect Y?',
        'Is there a relationship?',
        'Correlation between',
        'X vs Y'
      ]
    });

    this.userMentalModels.set('distribution', {
      keywords: ['distribution', 'spread', 'range', 'frequency', 'how many', 'grouped'],
      suggestedCharts: ['histogram', 'bar-chart'],
      questionPatterns: [
        'How are X distributed?',
        'What is the range?',
        'How many in each group?',
        'Frequency of'
      ]
    });
  }

  // Load search aliases for better discoverability
  loadSearchAliases() {
    this.searchAliases.set('sales', ['bar-chart', 'line-chart']);
    this.searchAliases.set('money', ['pie-chart', 'bar-chart']);
    this.searchAliases.set('time', ['line-chart', 'area-chart']);
    this.searchAliases.set('comparison', ['bar-chart', 'column-chart']);
    this.searchAliases.set('percentage', ['pie-chart', 'donut-chart']);
    this.searchAliases.set('relationship', ['scatter-plot', 'bubble-chart']);
    this.searchAliases.set('trend', ['line-chart', 'area-chart']);
    this.searchAliases.set('growth', ['line-chart', 'area-chart']);
    this.searchAliases.set('budget', ['pie-chart', 'donut-chart']);
    this.searchAliases.set('population', ['bar-chart', 'histogram']);
    this.searchAliases.set('survey', ['bar-chart', 'pie-chart']);
    this.searchAliases.set('grades', ['histogram', 'bar-chart']);
    this.searchAliases.set('scores', ['histogram', 'scatter-plot']);
    this.searchAliases.set('correlation', ['scatter-plot']);
    this.searchAliases.set('comparison', ['bar-chart']);
    this.searchAliases.set('progress', ['line-chart', 'area-chart']);
    this.searchAliases.set('market share', ['pie-chart', 'donut-chart']);
    this.searchAliases.set('frequency', ['histogram']);
  }

  // Setup terminology enhancements
  setupTerminologyEnhancements() {
    this.enhanceChartPicker();
    this.enhanceDataInput();
    this.enhanceHelpSystem();
    this.setupSmartSuggestions();
  }

  // Enhance chart picker with user-friendly terminology
  enhanceChartPicker() {
    const chartOptions = document.querySelectorAll('.chart-option');
    
    chartOptions.forEach(option => {
      const chartType = option.dataset.chartType;
      const terminology = this.terminologyMap.get(chartType);
      
      if (terminology) {
        // Add user-friendly names
        const title = option.querySelector('.chart-title');
        if (title) {
          const originalTitle = title.textContent;
          title.innerHTML = `
            ${originalTitle}
            <div class="chart-aliases">
              ${terminology.userFriendlyNames.slice(1).map(name => 
                `<span class="alias-tag">${name}</span>`
              ).join('')}
            </div>
          `;
        }

        // Add mental model description
        const description = option.querySelector('.chart-description');
        if (description) {
          description.innerHTML = `
            <p class="technical-desc">${terminology.description}</p>
            <p class="mental-model">💭 ${terminology.mentalModel}</p>
          `;
        }

        // Add relatable examples
        const examples = option.querySelector('.chart-examples');
        if (examples) {
          examples.innerHTML = `
            <h4>Perfect for:</h4>
            <ul>
              ${terminology.useCases.map(useCase => 
                `<li>${useCase}</li>`
              ).join('')}
            </ul>
          `;
        }
      }
    });
  }

  // Enhance data input with smart terminology detection
  enhanceDataInput() {
    const dataInput = document.getElementById('data-input');
    if (!dataInput) return;

    // Add smart suggestions based on user language
    dataInput.addEventListener('input', (e) => {
      const userInput = e.target.value.toLowerCase();
      this.analyzeUserIntent(userInput);
    });

    // Add placeholder examples with relatable scenarios
    this.updateInputPlaceholders();
  }

  // Update input placeholders with relatable examples
  updateInputPlaceholders() {
    const placeholders = [
      'Monthly sales: January: $5,000, February: $6,500, March: $4,800',
      'Survey results: Very satisfied: 45%, Satisfied: 30%, Neutral: 15%',
      'Website traffic: Monday: 1,200 visitors, Tuesday: 1,500, Wednesday: 1,100',
      'Product ratings: Product A: 4.5 stars, Product B: 3.8 stars, Product C: 4.2 stars',
      'Class grades: A: 15 students, B: 22 students, C: 18 students',
      'Budget expenses: Rent: $1,200, Food: $400, Transportation: $200, Entertainment: $150'
    ];

    const dataInput = document.getElementById('data-input');
    if (dataInput) {
      // Rotate through relatable examples
      let currentIndex = 0;
      setInterval(() => {
        if (!dataInput.value) {
          dataInput.placeholder = placeholders[currentIndex];
          currentIndex = (currentIndex + 1) % placeholders.length;
        }
      }, 5000);
    }
  }

  // Analyze user intent and suggest appropriate chart types
  analyzeUserIntent(userInput) {
    let detectedMentalModel = null;
    let maxMatches = 0;

    // Check against mental models
    this.userMentalModels.forEach((model, modelType) => {
      const matches = model.keywords.filter(keyword => 
        userInput.includes(keyword)
      ).length;
      
      if (matches > maxMatches) {
        maxMatches = matches;
        detectedMentalModel = modelType;
      }
    });

    if (detectedMentalModel) {
      this.suggestChartTypes(detectedMentalModel);
    }
  }

  // Suggest chart types based on detected mental model
  suggestChartTypes(mentalModel) {
    const model = this.userMentalModels.get(mentalModel);
    if (!model) return;

    // Highlight suggested chart types
    const chartOptions = document.querySelectorAll('.chart-option');
    chartOptions.forEach(option => {
      const chartType = option.dataset.chartType;
      const isSuggested = model.suggestedCharts.includes(chartType);
      
      option.classList.toggle('suggested', isSuggested);
      
      if (isSuggested) {
        // Add suggestion badge
        let badge = option.querySelector('.suggestion-badge');
        if (!badge) {
          badge = document.createElement('div');
          badge.className = 'suggestion-badge';
          badge.innerHTML = '✨ Recommended';
          option.appendChild(badge);
        }
      }
    });
  }

  // Enhance help system with better terminology
  enhanceHelpSystem() {
    if (window.helpSystem) {
      // Add terminology section to help
      const terminologyHelp = {
        id: 'chart-terminology',
        title: 'Understanding Chart Types',
        category: 'basics',
        content: this.generateTerminologyHelp()
      };
      
      window.helpSystem.helpContent.set('chart-terminology', terminologyHelp);
    }
  }

  // Generate terminology help content
  generateTerminologyHelp() {
    let content = '<p>Charts can have different names, but they all tell stories with data. Here\'s how to think about them:</p>';
    
    this.terminologyMap.forEach((terminology, chartType) => {
      content += `
        <div class="terminology-section">
          <h4>${terminology.technicalName}</h4>
          <p><strong>Also called:</strong> ${terminology.userFriendlyNames.join(', ')}</p>
          <p><strong>Think of it as:</strong> ${terminology.mentalModel}</p>
          <p><strong>Perfect for:</strong></p>
          <ul>
            ${terminology.useCases.map(useCase => `<li>${useCase}</li>`).join('')}
          </ul>
        </div>
      `;
    });
    
    return content;
  }

  // Setup smart suggestions based on context
  setupSmartSuggestions() {
    // Add smart search to chart picker
    this.addChartSearch();
    
    // Add context-aware tooltips
    this.addContextualTooltips();
    
    // Add natural language chart suggestions
    this.addNaturalLanguageSuggestions();
  }

  // Add chart search functionality
  addChartSearch() {
    const chartPicker = document.querySelector('.chart-picker');
    if (!chartPicker) return;

    const searchContainer = document.createElement('div');
    searchContainer.className = 'chart-search-container';
    searchContainer.innerHTML = `
      <div class="chart-search">
        <i class="fas fa-search"></i>
        <input type="text" placeholder="What do you want to show? (e.g., 'compare sales', 'show trends')" 
               id="chart-search-input">
        <div class="search-suggestions" id="chart-search-suggestions"></div>
      </div>
    `;

    chartPicker.insertBefore(searchContainer, chartPicker.firstChild);

    // Setup search functionality
    const searchInput = document.getElementById('chart-search-input');
    const suggestions = document.getElementById('chart-search-suggestions');

    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      this.performChartSearch(query, suggestions);
    });

    searchInput.addEventListener('focus', () => {
      if (searchInput.value) {
        this.performChartSearch(searchInput.value.toLowerCase(), suggestions);
      }
    });

    // Hide suggestions when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.chart-search-container')) {
        suggestions.style.display = 'none';
      }
    });
  }

  // Perform chart search based on user query
  performChartSearch(query, suggestionsContainer) {
    if (!query) {
      suggestionsContainer.style.display = 'none';
      return;
    }

    const results = [];

    // Search in terminology
    this.terminologyMap.forEach((terminology, chartType) => {
      const searchText = [
        ...terminology.userFriendlyNames,
        ...terminology.useCases,
        terminology.description,
        terminology.mentalModel
      ].join(' ').toLowerCase();

      if (searchText.includes(query)) {
        results.push({
          chartType: chartType,
          terminology: terminology,
          relevance: this.calculateRelevance(query, terminology)
        });
      }
    });

    // Search in aliases
    this.searchAliases.forEach((chartTypes, alias) => {
      if (alias.includes(query)) {
        chartTypes.forEach(chartType => {
          const terminology = this.terminologyMap.get(chartType);
          if (terminology) {
            results.push({
              chartType: chartType,
              terminology: terminology,
              relevance: 10 // High relevance for direct alias matches
            });
          }
        });
      }
    });

    // Sort by relevance
    results.sort((a, b) => b.relevance - a.relevance);

    // Display results
    this.displaySearchResults(results.slice(0, 5), suggestionsContainer);
  }

  // Calculate relevance score for search results
  calculateRelevance(query, terminology) {
    let score = 0;
    const queryWords = query.split(' ');

    // Check exact matches in names
    terminology.userFriendlyNames.forEach(name => {
      if (name.toLowerCase() === query) score += 20;
      if (name.toLowerCase().includes(query)) score += 10;
    });

    // Check use cases
    terminology.useCases.forEach(useCase => {
      queryWords.forEach(word => {
        if (useCase.toLowerCase().includes(word)) score += 5;
      });
    });

    // Check description and mental model
    queryWords.forEach(word => {
      if (terminology.description.toLowerCase().includes(word)) score += 3;
      if (terminology.mentalModel.toLowerCase().includes(word)) score += 2;
    });

    return score;
  }

  // Display search results
  displaySearchResults(results, container) {
    if (results.length === 0) {
      container.innerHTML = '<div class="no-results">No matching charts found. Try different keywords.</div>';
      container.style.display = 'block';
      return;
    }

    container.innerHTML = results.map(result => `
      <div class="search-result" data-chart-type="${result.chartType}">
        <div class="result-icon">📊</div>
        <div class="result-content">
          <div class="result-title">${result.terminology.technicalName}</div>
          <div class="result-description">${result.terminology.mentalModel}</div>
        </div>
        <div class="result-action">
          <i class="fas fa-arrow-right"></i>
        </div>
      </div>
    `).join('');

    container.style.display = 'block';

    // Add click handlers
    container.querySelectorAll('.search-result').forEach(result => {
      result.addEventListener('click', () => {
        const chartType = result.dataset.chartType;
        this.selectChartType(chartType);
        container.style.display = 'none';
        document.getElementById('chart-search-input').value = '';
      });
    });
  }

  // Select chart type and update UI
  selectChartType(chartType) {
    const chartOption = document.querySelector(`[data-chart-type="${chartType}"]`);
    if (chartOption) {
      // Remove previous selection
      document.querySelectorAll('.chart-option').forEach(option => {
        option.classList.remove('selected');
      });
      
      // Select new chart type
      chartOption.classList.add('selected');
      chartOption.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // Trigger selection event
      chartOption.click();
    }
  }

  // Add contextual tooltips
  addContextualTooltips() {
    const chartOptions = document.querySelectorAll('.chart-option');
    
    chartOptions.forEach(option => {
      const chartType = option.dataset.chartType;
      const terminology = this.terminologyMap.get(chartType);
      
      if (terminology) {
        option.title = `Think of it as: ${terminology.mentalModel}`;
      }
    });
  }

  // Add natural language suggestions
  addNaturalLanguageSuggestions() {
    const dataInput = document.getElementById('data-input');
    if (!dataInput) return;

    const suggestionList = document.createElement('div');
    suggestionList.className = 'natural-language-suggestions';
    suggestionList.innerHTML = `
      <div class="suggestion-header">
        <span>💡 Try asking:</span>
      </div>
      <div class="suggestion-items">
        <button class="suggestion-item" data-suggestion="compare">Compare my sales data</button>
        <button class="suggestion-item" data-suggestion="trend">Show trends over time</button>
        <button class="suggestion-item" data-suggestion="percentage">What percentage of...</button>
        <button class="suggestion-item" data-suggestion="relationship">Is there a relationship between...</button>
      </div>
    `;

    dataInput.parentNode.appendChild(suggestionList);

    // Add click handlers
    suggestionList.querySelectorAll('.suggestion-item').forEach(item => {
      item.addEventListener('click', () => {
        const suggestion = item.dataset.suggestion;
        this.handleNaturalLanguageSuggestion(suggestion);
      });
    });
  }

  // Handle natural language suggestions
  handleNaturalLanguageSuggestion(suggestion) {
    const dataInput = document.getElementById('data-input');
    if (!dataInput) return;

    const suggestions = {
      compare: {
        text: 'Product A: 100 sales, Product B: 150 sales, Product C: 75 sales',
        chartType: 'bar-chart'
      },
      trend: {
        text: 'January: 1000, February: 1200, March: 1350, April: 1100',
        chartType: 'line-chart'
      },
      percentage: {
        text: 'Category A: 40%, Category B: 35%, Category C: 25%',
        chartType: 'pie-chart'
      },
      relationship: {
        text: 'Study hours: 2, 4, 6, 8 | Test scores: 65, 75, 85, 95',
        chartType: 'scatter-plot'
      }
    };

    const suggestionData = suggestions[suggestion];
    if (suggestionData) {
      dataInput.value = suggestionData.text;
      this.selectChartType(suggestionData.chartType);
      dataInput.focus();
    }
  }

  // Public methods
  getChartTerminology(chartType) {
    return this.terminologyMap.get(chartType);
  }

  getUserMentalModels() {
    return this.userMentalModels;
  }

  getSearchAliases() {
    return this.searchAliases;
  }
}

// Initialize terminology manager
document.addEventListener('DOMContentLoaded', () => {
  window.chartTerminologyManager = new ChartTerminologyManager();
});

export { ChartTerminologyManager };

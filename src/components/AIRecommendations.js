/**
 * AI Recommendations Component
 * Shows AI-suggested chart types with manual override capability
 */

import { getAllChartTypes, getChartTypeById } from '../charts/chart-types.js';

export class AIRecommendations {
  constructor(chartGenerator) {
    this.chartGenerator = chartGenerator;
    this.recommendations = [];
    this.selectedRecommendation = null;
    this.userOverride = false;
    this.element = null;
  }

  /**
   * Create AI recommendations UI
   * @param {Array} recommendedTypes - Array of recommended chart type IDs
   * @param {string} originalPrompt - Original user prompt
   */
  createRecommendationsUI(recommendedTypes, originalPrompt) {
    this.recommendations = recommendedTypes.slice(0, 4); // Top 4 recommendations
    this.selectedRecommendation = recommendedTypes[0]; // Auto-select top recommendation
    this.userOverride = false;

    const container = document.createElement('div');
    container.className = 'ai-recommendations bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4';
    
    container.innerHTML = `
      <div class="flex items-center gap-2 mb-3">
        <div class="ai-badge bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
          <i class="fas fa-robot"></i>
          AI Recommends
        </div>
        <span class="text-sm text-blue-700">Based on your prompt</span>
      </div>
      
      <div class="recommendations-grid grid grid-cols-2 md:grid-cols-4 gap-3">
        ${this.recommendations.map((typeId, index) => this.createRecommendationTile(typeId, index === 0)).join('')}
      </div>
      
      <div class="mt-3 flex items-center justify-between">
        <button class="text-sm text-blue-600 hover:text-blue-800 underline" onclick="this.parentElement.parentElement.classList.add('hidden')">
          Dismiss recommendations
        </button>
        <div class="text-xs text-blue-600">
          <i class="fas fa-info-circle"></i>
          Click any chart type to override
        </div>
      </div>
    `;

    this.element = container;
    this.attachEventListeners();
    
    return container;
  }

  /**
   * Create individual recommendation tile
   * @param {string} typeId - Chart type ID
   * @param {boolean} isRecommended - If this is the top recommendation
   */
  createRecommendationTile(typeId, isRecommended) {
    const chartType = getChartTypeById(typeId);
    if (!chartType) return '';

    const recommendedBadge = isRecommended ? `
      <div class="recommended-badge absolute top-1 right-1 bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded">
        <i class="fas fa-star text-xs"></i> Top
      </div>
    ` : '';

    return `
      <div class="recommendation-tile relative bg-white border-2 ${isRecommended ? 'border-blue-500' : 'border-gray-200'} 
                  rounded-lg p-3 cursor-pointer hover:border-blue-400 hover:shadow-md transition-all"
           data-type="${typeId}" data-recommended="${isRecommended}">
        ${recommendedBadge}
        <div class="flex flex-col items-center text-center">
          <div class="chart-icon text-2xl mb-2">${chartType.icon}</div>
          <div class="chart-name font-medium text-sm text-gray-900">${chartType.name}</div>
          <div class="chart-description text-xs text-gray-600 mt-1 line-clamp-2">${chartType.shortDescription || chartType.description}</div>
        </div>
      </div>
    `;
  }

  /**
   * Attach event listeners to recommendation tiles
   */
  attachEventListeners() {
    if (!this.element) return;

    const tiles = this.element.querySelectorAll('.recommendation-tile');
    tiles.forEach(tile => {
      tile.addEventListener('click', () => {
        const typeId = tile.dataset.type;
        const wasRecommended = tile.dataset.recommended === 'true';
        
        this.handleTileSelection(typeId, wasRecommended);
      });

      // Add hover tooltips
      tile.addEventListener('mouseenter', (e) => {
        this.showTooltip(e, tile.dataset.type);
      });

      tile.addEventListener('mouseleave', () => {
        this.hideTooltip();
      });
    });
  }

  /**
   * Handle tile selection
   * @param {string} typeId - Selected chart type ID
   * @param {boolean} wasRecommended - If this was originally recommended
   */
  async handleTileSelection(typeId, wasRecommended) {
    // Log user override for analytics
    if (!wasRecommended || this.userOverride) {
      this.logUserOverride(typeId, wasRecommended);
    }

    // Update UI state
    this.updateTileSelection(typeId);
    this.selectedRecommendation = typeId;

    if (!wasRecommended) {
      this.userOverride = true;
    }

    // Update chart generator
    this.chartGenerator.currentChartType = typeId;
    this.chartGenerator.selectChartType(typeId);

    // Update main chart type selector
    this.updateMainSelector(typeId);

    // Regenerate chart with new type
    await this.regenerateChartWithNewType(typeId);
  }

  /**
   * Update tile selection UI
   * @param {string} selectedTypeId - Selected chart type ID
   */
  updateTileSelection(selectedTypeId) {
    const tiles = this.element.querySelectorAll('.recommendation-tile');
    tiles.forEach(tile => {
      const typeId = tile.dataset.type;
      const wasRecommended = tile.dataset.recommended === 'true';
      
      // Update border colors
      if (typeId === selectedTypeId) {
        tile.classList.remove('border-gray-200', 'border-blue-500');
        tile.classList.add('border-blue-600', 'bg-blue-50');
      } else {
        tile.classList.remove('border-blue-600', 'bg-blue-50');
        tile.classList.add(wasRecommended ? 'border-blue-500' : 'border-gray-200');
      }

      // Update recommended badge
      const badge = tile.querySelector('.recommended-badge');
      if (badge && typeId !== selectedTypeId && wasRecommended) {
        badge.innerHTML = '<i class="fas fa-star text-xs"></i> Was top';
        badge.classList.remove('bg-blue-600');
        badge.classList.add('bg-gray-400');
      } else if (badge && typeId === selectedTypeId) {
        badge.innerHTML = '<i class="fas fa-check text-xs"></i> Selected';
      }
    });
  }

  /**
   * Update main chart type selector
   * @param {string} typeId - Selected chart type ID
   */
  updateMainSelector(typeId) {
    const mainOptions = document.querySelectorAll('.chart-option');
    mainOptions.forEach(option => {
      option.classList.remove('selected');
      if (option.dataset.type === typeId) {
        option.classList.add('selected');
      }
    });
  }

  /**
   * Regenerate chart with new type
   * @param {string} typeId - New chart type ID
   */
  async regenerateChartWithNewType(typeId) {
    try {
      // Get current prompt
      const promptInput = document.getElementById('chart-prompt');
      const prompt = promptInput?.value || '';
      
      if (!prompt) return;

      // Show loading state
      this.chartGenerator.showLoading();

      // Generate new chart with selected type
      await this.chartGenerator.generateChartWithSpecificType(prompt, typeId);

      // Track selection
      this.trackSelection(typeId);

    } catch (error) {
      console.error('Failed to regenerate chart:', error);
      this.chartGenerator.showError('Failed to update chart type');
    }
  }

  /**
   * Show tooltip with chart details
   * @param {Event} event - Mouse event
   * @param {string} typeId - Chart type ID
   */
  showTooltip(event, typeId) {
    const chartType = getChartTypeById(typeId);
    if (!chartType) return;

    // Remove existing tooltip
    this.hideTooltip();

    const tooltip = document.createElement('div');
    tooltip.className = 'chart-tooltip absolute z-50 bg-gray-900 text-white p-3 rounded-lg shadow-xl max-w-xs';
    tooltip.style.left = `${event.pageX + 10}px`;
    tooltip.style.top = `${event.pageY - 10}px`;

    tooltip.innerHTML = `
      <div class="font-medium mb-2">${chartType.name}</div>
      <div class="text-sm text-gray-300 mb-2">${chartType.description}</div>
      <div class="text-xs">
        <div class="mb-1"><strong>Use Cases:</strong></div>
        <ul class="list-disc list-inside space-y-1">
          ${chartType.useCases.slice(0, 3).map(useCase => `<li>${useCase}</li>`).join('')}
        </ul>
      </div>
      <div class="text-xs mt-2 pt-2 border-t border-gray-700">
        <strong>Examples:</strong> ${chartType.examples.slice(0, 2).join(', ')}
      </div>
    `;

    document.body.appendChild(tooltip);
    this.currentTooltip = tooltip;
  }

  /**
   * Hide tooltip
   */
  hideTooltip() {
    if (this.currentTooltip) {
      this.currentTooltip.remove();
      this.currentTooltip = null;
    }
  }

  /**
   * Log user override for analytics
   * @param {string} selectedType - User selected chart type
   * @param {boolean} wasRecommended - If this was originally recommended
   */
  logUserOverride(selectedType, wasRecommended) {
    try {
      // Track override event
      const overrideData = {
        original_recommendation: this.recommendations[0],
        user_selection: selectedType,
        was_original_recommendation: wasRecommended,
        all_recommendations: this.recommendations,
        override_reason: wasRecommended ? 'manual_selection' : 'alternative_selection',
        timestamp: new Date().toISOString()
      };

      // Send to analytics
      if (typeof trackEvent === 'function') {
        trackEvent('chart_type_override', overrideData);
      }

      // Log to console for debugging
      console.log('Chart type override:', overrideData);

    } catch (error) {
      console.warn('Failed to log user override:', error);
    }
  }

  /**
   * Track chart type selection
   * @param {string} typeId - Selected chart type ID
   */
  trackSelection(typeId) {
    try {
      const selectionData = {
        chart_type: typeId,
        selection_source: this.userOverride ? 'manual_override' : 'ai_recommendation',
        ai_recommendations: this.recommendations,
        final_selection: typeId,
        user_overridden: this.userOverride
      };

      if (typeof trackEvent === 'function') {
        trackEvent('chart_type_selected', selectionData);
      }

    } catch (error) {
      console.warn('Failed to track selection:', error);
    }
  }

  /**
   * Show recommendations in the UI
   * @param {Array} recommendedTypes - Recommended chart types
   * @param {string} prompt - Original prompt
   */
  show(recommendedTypes, prompt) {
    // Remove existing recommendations
    this.hide();

    // Create and insert new recommendations
    const recommendationsUI = this.createRecommendationsUI(recommendedTypes, prompt);
    
    // Insert after prompt section
    const promptSection = document.querySelector('.input-panel') || document.querySelector('.chart-picker');
    if (promptSection) {
      promptSection.parentNode.insertBefore(recommendationsUI, promptSection.nextSibling);
    }

    // Auto-scroll to recommendations
    setTimeout(() => {
      recommendationsUI.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  }

  /**
   * Hide recommendations
   */
  hide() {
    if (this.element && this.element.parentNode) {
      this.element.remove();
    }
    this.hideTooltip();
  }

  /**
   * Get current selection
   * @returns {Object} Current selection data
   */
  getCurrentSelection() {
    return {
      selected: this.selectedRecommendation,
      wasOverridden: this.userOverride,
      originalRecommendation: this.recommendations[0],
      allRecommendations: this.recommendations
    };
  }
}

// CSS for AI Recommendations
const aiRecommendationsCSS = `
.ai-recommendations {
  animation: slideDown 0.3s ease-out;
}

.recommendation-tile {
  transition: all 0.2s ease;
  position: relative;
}

.recommendation-tile:hover {
  transform: translateY(-2px);
}

.recommended-badge {
  animation: pulse 2s infinite;
}

.chart-tooltip {
  animation: fadeIn 0.2s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@media (max-width: 768px) {
  .recommendations-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .chart-tooltip {
    max-width: 250px;
    font-size: 12px;
  }
}
`;

// Inject CSS
if (!document.querySelector('#ai-recommendations-css')) {
  const style = document.createElement('style');
  style.id = 'ai-recommendations-css';
  style.textContent = aiRecommendationsCSS;
  document.head.appendChild(style);
}

// Enhanced Input Validation System for VIZOM
class InputValidationEnhanced {
  constructor() {
    this.validationRules = {
      // Basic data validation
      hasNumbers: /\d/.test,
      hasLabels: /[a-zA-Z]/.test,
      hasSufficientLength: (value) => value.length > 10,
      
      // Advanced patterns
      hasDataPairs: /([a-zA-Z]+\s*[:\-]?\s*\d+|[a-zA-Z]+\s+\d+)/.test,
      hasCurrency: /[$€£¥₹]/.test,
      hasPercentage: /%/.test,
      hasCommas: /,/.test,
      hasNewlines: /\n/.test,
      
      // Chart-specific patterns
      looksLikeTimeSeries: /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|Q[1-4]|\d{4})/i.test,
      looksLikeCategories: /(Product|Category|Type|Item|Team|Department)/i.test,
      looksLikeFinancial: /(\$|€|£|¥|₹|revenue|sales|profit|cost|income)/i.test,
      
      // Quality indicators
      hasMultipleDataPoints: (value) => {
        const matches = value.match(/([a-zA-Z]+\s*[:\-]?\s*\d+)/g);
        return matches && matches.length >= 2;
      },
      hasConsistentFormat: (value) => {
        // Check for consistent format patterns
        const colonFormat = value.match(/([a-zA-Z]+:\s*\d+)/g);
        const spaceFormat = value.match(/([a-zA-Z]+\s+\d+)/g);
        return (colonFormat && colonFormat.length >= 2) || 
               (spaceFormat && spaceFormat.length >= 2);
      }
    };
    
    this.feedbackMessages = {
      valid: {
        excellent: 'Perfect! Your data looks great for visualization',
        good: 'Great! Ready to generate your chart',
        acceptable: '✓ Good! This should work well'
      },
      invalid: {
        empty: 'Start typing your data to see validation feedback',
        tooShort: 'Add more data (at least 10 characters)',
        noNumbers: 'Add numbers to your data (e.g., "January 12000")',
        noLabels: 'Add labels to your data (e.g., "Sales $12000")',
        unclear: 'Try a clearer format like "Label: Value" or "Label Value"',
        inconsistent: 'Use consistent formatting (all "Label: Value" or all "Label Value")',
        singlePoint: 'Add more data points for better visualization'
      },
      suggestions: {
        format: 'Tip: Try "January $12K, February $15K, March $18K"',
        currency: 'Tip: Include currency symbols: "$12000" or "€15000"',
        percentage: 'Tip: Use percentages: "Design 85%, Development 92%"',
        timeSeries: 'Tip: Time series: "Jan 100, Feb 120, Mar 140"',
        categories: 'Tip: Categories: "Product A 45, Product B 30, Product C 25"'
      }
    };
    
    this.init();
  }

  init() {
    this.setupValidationStyles();
    this.setupGlobalValidation();
    this.bindEvents();
  }

  // Setup validation styles
  setupValidationStyles() {
    const styleId = 'input-validation-styles';
    
    if (document.getElementById(styleId)) {
      return;
    }

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      /* Enhanced Validation Styles */
      .input-feedback {
        margin-top: 12px;
        padding: 12px 16px;
        border-radius: 8px;
        font-size: 14px;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        overflow: hidden;
      }

      .input-feedback::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        transition: all 0.3s ease;
      }

      .input-feedback.valid {
        background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
        border: 1px solid #bae6fd;
        color: #0369a1;
      }

      .input-feedback.valid::before {
        background: linear-gradient(90deg, #0ea5e9, #0284c7);
      }

      .input-feedback.invalid {
        background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
        border: 1px solid #fecaca;
        color: #dc2626;
      }

      .input-feedback.invalid::before {
        background: linear-gradient(90deg, #ef4444, #dc2626);
      }

      .input-feedback.warning {
        background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
        border: 1px solid #fde68a;
        color: #d97706;
      }

      .input-feedback.warning::before {
        background: linear-gradient(90deg, #f59e0b, #d97706);
      }

      .feedback-content {
        display: flex;
        align-items: flex-start;
        gap: 10px;
      }

      .feedback-icon {
        font-size: 16px;
        font-weight: bold;
        flex-shrink: 0;
        margin-top: 1px;
      }

      .feedback-text {
        flex: 1;
        line-height: 1.4;
      }

      .feedback-suggestion {
        margin-top: 6px;
        font-size: 12px;
        opacity: 0.8;
        font-style: italic;
      }

      /* Validation quality indicator */
      .validation-quality {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        margin-left: 8px;
        padding: 2px 6px;
        border-radius: 12px;
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;
      }

      .validation-quality.excellent {
        background: #10b981;
        color: white;
      }

      .validation-quality.good {
        background: #3b82f6;
        color: white;
      }

      .validation-quality.acceptable {
        background: #f59e0b;
        color: white;
      }

      /* Input enhancement styles */
      .data-input.valid {
        border-color: #10b981 !important;
        box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1) !important;
      }

      .data-input.invalid {
        border-color: #ef4444 !important;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
      }

      .data-input.warning {
        border-color: #f59e0b !important;
        box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1) !important;
      }

      /* Character count enhancement */
      .char-count {
        transition: color 0.2s ease;
      }

      .char-count.valid {
        color: #10b981;
      }

      .char-count.warning {
        color: #f59e0b;
      }

      .char-count.invalid {
        color: #ef4444;
      }

      /* Validation animations */
      @keyframes feedbackSlideIn {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .input-feedback:not(.hidden) {
        animation: feedbackSlideIn 0.3s ease-out;
      }

      /* Responsive design */
      @media (max-width: 640px) {
        .input-feedback {
          padding: 10px 12px;
          font-size: 13px;
        }
        
        .feedback-content {
          gap: 8px;
        }
        
        .feedback-icon {
          font-size: 14px;
        }
      }

      /* Reduced motion */
      @media (prefers-reduced-motion: reduce) {
        .input-feedback,
        .input-feedback::before,
        .data-input,
        .char-count {
          transition: none !important;
          animation: none !important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  // Setup global validation
  setupGlobalValidation() {
    // Create global validation event listeners
    document.addEventListener('input:validate', (e) => {
      const { input, feedbackId } = e.detail;
      this.validateInput(input, feedbackId);
    });

    // Character count update
    document.addEventListener('input:charCount', (e) => {
      const { input, countId } = e.detail;
      this.updateCharCount(input, countId);
    });
  }

  // Bind events to textarea
  bindEvents() {
    const textarea = document.getElementById('prompt-input');
    const feedback = document.getElementById('input-feedback');
    const charCount = document.getElementById('char-count');

    if (textarea) {
      // Real-time validation
      textarea.addEventListener('input', () => {
        this.validateInput(textarea, 'input-feedback');
        this.updateCharCount(textarea, 'char-count');
      });

      // Blur validation
      textarea.addEventListener('blur', () => {
        this.validateInput(textarea, 'input-feedback', true);
      });

      // Focus validation
      textarea.addEventListener('focus', () => {
        if (textarea.value.trim().length > 0) {
          this.validateInput(textarea, 'input-feedback');
        }
      });
    }
  }

  // Main validation function
  validateInput(input, feedbackId, isBlur = false) {
    const feedback = document.getElementById(feedbackId);
    if (!input || !feedback) return;

    const value = input.value.trim();
    const validation = this.analyzeInput(value);

    // Update input styling
    this.updateInputStyling(input, validation);

    // Update feedback
    this.updateFeedback(feedback, validation, isBlur);

    // Emit validation event
    this.emitValidationEvent(input, validation);
  }

  // Analyze input and return validation result
  analyzeInput(value) {
    if (value.length === 0) {
      return {
        isValid: false,
        quality: 'empty',
        message: this.feedbackMessages.invalid.empty,
        suggestion: null,
        score: 0
      };
    }

    // Check basic requirements
    const hasNumbers = this.validationRules.hasNumbers(value);
    const hasLabels = this.validationRules.hasLabels(value);
    const hasSufficientLength = this.validationRules.hasSufficientLength(value);

    if (!hasSufficientLength) {
      return {
        isValid: false,
        quality: 'tooShort',
        message: this.feedbackMessages.invalid.tooShort,
        suggestion: this.feedbackMessages.suggestions.format,
        score: 10
      };
    }

    if (!hasNumbers) {
      return {
        isValid: false,
        quality: 'noNumbers',
        message: this.feedbackMessages.invalid.noNumbers,
        suggestion: this.feedbackMessages.suggestions.format,
        score: 20
      };
    }

    if (!hasLabels) {
      return {
        isValid: false,
        quality: 'noLabels',
        message: this.feedbackMessages.invalid.noLabels,
        suggestion: this.feedbackMessages.suggestions.format,
        score: 30
      };
    }

    // Advanced validation
    const hasDataPairs = this.validationRules.hasDataPairs(value);
    const hasMultipleDataPoints = this.validationRules.hasMultipleDataPoints(value);
    const hasConsistentFormat = this.validationRules.hasConsistentFormat(value);

    if (!hasDataPairs) {
      return {
        isValid: false,
        quality: 'unclear',
        message: this.feedbackMessages.invalid.unclear,
        suggestion: this.feedbackMessages.suggestions.format,
        score: 40
      };
    }

    if (!hasMultipleDataPoints) {
      return {
        isValid: false,
        quality: 'singlePoint',
        message: this.feedbackMessages.invalid.singlePoint,
        suggestion: this.feedbackMessages.suggestions.format,
        score: 50
      };
    }

    if (!hasConsistentFormat) {
      return {
        isValid: false,
        quality: 'inconsistent',
        message: this.feedbackMessages.invalid.inconsistent,
        suggestion: this.feedbackMessages.suggestions.format,
        score: 60
      };
    }

    // Calculate quality score
    let score = 70;
    let quality = 'acceptable';
    let message = this.feedbackMessages.valid.acceptable;

    // Bonus points for additional features
    if (this.validationRules.hasCurrency(value)) {
      score += 10;
    }
    if (this.validationRules.hasPercentage(value)) {
      score += 10;
    }
    if (this.validationRules.looksLikeTimeSeries(value)) {
      score += 5;
    }
    if (this.validationRules.looksLikeCategories(value)) {
      score += 5;
    }

    // Determine quality level
    if (score >= 90) {
      quality = 'excellent';
      message = this.feedbackMessages.valid.excellent;
    } else if (score >= 80) {
      quality = 'good';
      message = this.feedbackMessages.valid.good;
    }

    // Add contextual suggestions
    let suggestion = null;
    if (this.validationRules.looksLikeFinancial(value)) {
      suggestion = this.feedbackMessages.suggestions.currency;
    } else if (this.validationRules.looksLikeTimeSeries(value)) {
      suggestion = this.feedbackMessages.suggestions.timeSeries;
    } else if (this.validationRules.looksLikeCategories(value)) {
      suggestion = this.feedbackMessages.suggestions.categories;
    }

    return {
      isValid: true,
      quality,
      message,
      suggestion,
      score
    };
  }

  // Update input styling based on validation
  updateInputStyling(input, validation) {
    // Remove all validation classes
    input.classList.remove('valid', 'invalid', 'warning');

    // Add appropriate class
    if (validation.isValid) {
      input.classList.add('valid');
    } else if (validation.score > 40) {
      input.classList.add('warning');
    } else {
      input.classList.add('invalid');
    }
  }

  // Update feedback display
  updateFeedback(feedback, validation, isBlur = false) {
    // Remove all classes
    feedback.classList.remove('valid', 'invalid', 'warning', 'hidden');

    // Add appropriate class
    if (validation.isValid) {
      feedback.classList.add('valid');
    } else if (validation.score > 40) {
      feedback.classList.add('warning');
    } else {
      feedback.classList.add('invalid');
    }

    // Update content
    const icon = feedback.querySelector('.feedback-icon');
    const text = feedback.querySelector('.feedback-text');

    if (validation.isValid) {
      icon.innerHTML = '<i class="fas fa-check-circle"></i>';
      text.innerHTML = validation.message;
      
      // Add quality indicator
      if (validation.quality !== 'acceptable') {
        text.innerHTML += `<span class="validation-quality ${validation.quality}">${validation.quality}</span>`;
      }
    } else {
      icon.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
      text.innerHTML = validation.message;
    }

    // Add suggestion if available
    if (validation.suggestion) {
      const suggestionEl = document.createElement('div');
      suggestionEl.className = 'feedback-suggestion';
      suggestionEl.textContent = validation.suggestion;
      text.appendChild(suggestionEl);
    }

    // Hide on blur if empty
    if (isBlur && validation.quality === 'empty') {
      feedback.classList.add('hidden');
    }
  }

  // Update character count
  updateCharCount(input, countId) {
    const countEl = document.getElementById(countId);
    if (!countEl) return;

    const length = input.value.length;
    countEl.textContent = `${length} characters`;

    // Update styling based on length
    countEl.classList.remove('valid', 'warning', 'invalid');
    if (length === 0) {
      // Default color
    } else if (length < 10) {
      countEl.classList.add('invalid');
    } else if (length < 50) {
      countEl.classList.add('warning');
    } else {
      countEl.classList.add('valid');
    }
  }

  // Emit validation event for other components
  emitValidationEvent(input, validation) {
    const event = new CustomEvent('input:validated', {
      detail: {
        input: input.id,
        validation,
        value: input.value
      }
    });
    document.dispatchEvent(event);
  }

  // Public method to validate any input
  validate(inputId, feedbackId) {
    const input = document.getElementById(inputId);
    if (input) {
      this.validateInput(input, feedbackId);
    }
  }

  // Get validation score
  getValidationScore(inputId) {
    const input = document.getElementById(inputId);
    if (input) {
      const validation = this.analyzeInput(input.value.trim());
      return validation.score;
    }
    return 0;
  }

  // Check if input is ready for generation
  isReadyForGeneration(inputId) {
    const score = this.getValidationScore(inputId);
    return score >= 70;
  }
}

// Initialize enhanced validation
document.addEventListener('DOMContentLoaded', () => {
  window.inputValidation = new InputValidationEnhanced();
});

// Export for use in other modules
export { InputValidationEnhanced };

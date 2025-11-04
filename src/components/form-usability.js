// Form Usability System - Enhanced Input Experience and Auto-Save
class FormUsabilityManager {
  constructor() {
    this.autoSaveTimers = new Map();
    this.formatters = new Map();
    this.validators = new Map();
    this.inputHistory = new Map();
    this.tabOrder = [];
    this.focusStack = [];
    this.autoSaveDelay = 2000; // 2 seconds
    this.debounceDelay = 300; // 300ms for validation
    
    this.init();
  }

  init() {
    this.setupInputFormatting();
    this.setupAutoSave();
    this.setupTabOrder();
    this.setupInputSizing();
    this.setupLabelPlacement();
    this.setupValidationTiming();
    this.setupInputExamples();
    this.setupFocusManagement();
    this.setupKeyboardShortcuts();
  }

  // Setup input formatting with examples
  setupInputFormatting() {
    // CSV formatter with live preview
    this.formatters.set('csv', {
      format: (value) => this.formatCSV(value),
      example: `Name,Age,City\nJohn,25,New York\nJane,30,London`,
      placeholder: 'Enter CSV data...\nExample:\nName,Age,City\nJohn,25,New York',
      maxLength: 50000,
      rows: 8
    });

    // JSON formatter with syntax highlighting
    this.formatters.set('json', {
      format: (value) => this.formatJSON(value),
      example: `[\n  {"name": "John", "age": 25},\n  {"name": "Jane", "age": 30}\n]`,
      placeholder: 'Enter JSON data...\nExample:\n[\n  {"name": "John", "age": 25}\n]',
      maxLength: 50000,
      rows: 8
    });

    // Email formatter
    this.formatters.set('email', {
      format: (value) => this.formatEmail(value),
      example: 'john@example.com',
      placeholder: 'Enter email address...',
      maxLength: 254,
      rows: 1
    });

    // Number formatter with thousand separators
    this.formatters.set('number', {
      format: (value) => this.formatNumber(value),
      example: '1,000 or 1000',
      placeholder: 'Enter number...',
      maxLength: 20,
      rows: 1
    });

    // Date formatter
    this.formatters.set('date', {
      format: (value) => this.formatDate(value),
      example: '2024-01-15 or Jan 15, 2024',
      placeholder: 'Enter date...',
      maxLength: 20,
      rows: 1
    });

    this.applyFormatters();
  }

  // Format CSV input
  formatCSV(value) {
    if (!value) return '';
    
    // Basic CSV formatting
    const lines = value.split('\n');
    const formattedLines = lines.map(line => {
      const values = line.split(',').map(v => v.trim());
      return values.join(', ');
    });
    
    return formattedLines.join('\n');
  }

  // Format JSON input
  formatJSON(value) {
    if (!value) return '';
    
    try {
      const parsed = JSON.parse(value);
      return JSON.stringify(parsed, null, 2);
    } catch (e) {
      return value; // Return original if invalid
    }
  }

  // Format email input
  formatEmail(value) {
    if (!value) return '';
    return value.toLowerCase().trim();
  }

  // Format number input
  formatNumber(value) {
    if (!value) return '';
    
    // Remove non-digit characters except decimal point
    const cleanValue = value.replace(/[^\d.]/g, '');
    
    // Add thousand separators
    const parts = cleanValue.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    
    return parts.join('.');
  }

  // Format date input
  formatDate(value) {
    if (!value) return '';
    
    // Try to parse and format date
    try {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        return date.toISOString().split('T')[0];
      }
    } catch (e) {
      // Return original if invalid
    }
    
    return value;
  }

  // Apply formatters to inputs
  applyFormatters() {
    document.querySelectorAll('[data-format]').forEach(input => {
      const formatType = input.dataset.format;
      const formatter = this.formatters.get(formatType);
      
      if (formatter) {
        this.setupFormattedInput(input, formatter);
      }
    });
  }

  // Setup formatted input
  setupFormattedInput(input, formatter) {
    // Set placeholder and example
    input.placeholder = formatter.placeholder;
    
    // Add example display
    this.addInputExample(input, formatter.example);
    
    // Set initial attributes
    if (input.tagName === 'TEXTAREA') {
      input.rows = formatter.rows;
      input.maxLength = formatter.maxLength;
    }
    
    // Setup auto-formatting
    let formatTimeout;
    
    input.addEventListener('input', (e) => {
      clearTimeout(formatTimeout);
      formatTimeout = setTimeout(() => {
        const formatted = formatter.format(e.target.value);
        if (formatted !== e.target.value) {
          // Preserve cursor position
          const start = e.target.selectionStart;
          const end = e.target.selectionEnd;
          
          e.target.value = formatted;
          
          // Restore cursor position
          e.target.setSelectionRange(start, end);
        }
      }, this.debounceDelay);
    });
    
    // Setup auto-resize for textareas
    if (input.tagName === 'TEXTAREA') {
      this.setupAutoResize(input);
    }
  }

  // Add input example
  addInputExample(input, example) {
    let exampleContainer = input.parentNode.querySelector('.input-example');
    
    if (!exampleContainer) {
      exampleContainer = document.createElement('div');
      exampleContainer.className = 'input-example';
      input.parentNode.insertBefore(exampleContainer, input.nextSibling);
    }
    
    exampleContainer.innerHTML = `
      <div class="example-label">Example:</div>
      <pre class="example-content">${example}</pre>
      <button class="example-use-btn" type="button">
        <i class="fas fa-copy"></i>
        Use Example
      </button>
    `;
    
    // Setup example usage
    const useBtn = exampleContainer.querySelector('.example-use-btn');
    useBtn.addEventListener('click', () => {
      input.value = example;
      input.dispatchEvent(new Event('input'));
      input.focus();
      
      // Show feedback
      this.showInputFeedback(input, 'Example loaded', 'success');
    });
  }

  // Setup auto-resize for textareas
  setupAutoResize(textarea) {
    const resize = () => {
      textarea.style.height = 'auto';
      textarea.style.height = Math.max(textarea.scrollHeight, 100) + 'px';
    };
    
    textarea.addEventListener('input', resize);
    textarea.addEventListener('focus', resize);
    
    // Initial resize
    resize();
  }

  // Setup auto-save functionality
  setupAutoSave() {
    document.querySelectorAll('[data-auto-save]').forEach(input => {
      this.setupAutoSaveInput(input);
    });
  }

  // Setup auto-save for individual input
  setupAutoSaveInput(input) {
    const saveKey = input.dataset.autoSave || input.id || input.name;
    
    // Load saved value
    this.loadAutoSaveValue(input, saveKey);
    
    // Setup auto-save on input
    let saveTimeout;
    
    input.addEventListener('input', (e) => {
      clearTimeout(saveTimeout);
      
      // Show saving indicator
      this.showSavingIndicator(input, true);
      
      saveTimeout = setTimeout(() => {
        this.saveAutoSaveValue(input, saveKey);
      }, this.autoSaveDelay);
    });
    
    // Save on blur
    input.addEventListener('blur', () => {
      clearTimeout(saveTimeout);
      this.saveAutoSaveValue(input, saveKey);
    });
    
    // Setup restore button
    this.addRestoreButton(input, saveKey);
  }

  // Load auto-saved value
  loadAutoSaveValue(input, key) {
    const saved = localStorage.getItem(`autosave_${key}`);
    if (saved && saved !== input.value) {
      input.value = saved;
      input.dispatchEvent(new Event('input'));
      
      // Show restore notification
      this.showRestoreNotification(input);
    }
  }

  // Save auto-saved value
  saveAutoSaveValue(input, key) {
    const value = input.value;
    localStorage.setItem(`autosave_${key}`, value);
    
    // Hide saving indicator
    this.showSavingIndicator(input, false);
    
    // Show saved feedback
    this.showInputFeedback(input, 'Auto-saved', 'success');
    
    // Track auto-save event
    this.trackAutoSave(key, value.length);
  }

  // Add restore button
  addRestoreButton(input, key) {
    let restoreBtn = input.parentNode.querySelector('.restore-btn');
    
    if (!restoreBtn) {
      restoreBtn = document.createElement('button');
      restoreBtn.className = 'restore-btn';
      restoreBtn.type = 'button';
      restoreBtn.innerHTML = '<i class="fas fa-history"></i>';
      restoreBtn.title = 'Restore last saved';
      
      input.parentNode.appendChild(restoreBtn);
    }
    
    restoreBtn.addEventListener('click', () => {
      this.loadAutoSaveValue(input, key);
    });
  }

  // Show saving indicator
  showSavingIndicator(input, show) {
    let indicator = input.parentNode.querySelector('.saving-indicator');
    
    if (!indicator) {
      indicator = document.createElement('div');
      indicator.className = 'saving-indicator';
      indicator.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
      input.parentNode.appendChild(indicator);
    }
    
    indicator.style.display = show ? 'block' : 'none';
  }

  // Show restore notification
  showRestoreNotification(input) {
    const notification = document.createElement('div');
    notification.className = 'restore-notification';
    notification.innerHTML = `
      <i class="fas fa-history"></i>
      Previous data restored
      <button class="restore-dismiss" type="button">
        <i class="fas fa-times"></i>
      </button>
    `;
    
    input.parentNode.appendChild(notification);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      notification.remove();
    }, 5000);
    
    // Manual dismiss
    const dismissBtn = notification.querySelector('.restore-dismiss');
    dismissBtn.addEventListener('click', () => {
      notification.remove();
    });
  }

  // Setup tab order and focus management
  setupTabOrder() {
    // Build tab order from form elements
    this.buildTabOrder();
    
    // Setup focus trapping for modals
    this.setupFocusTrapping();
    
    // Setup auto-focus
    this.setupAutoFocus();
  }

  // Build logical tab order
  buildTabOrder() {
    const focusableElements = [
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'button:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      'a[href]',
      '[contenteditable="true"]'
    ].join(', ');
    
    const elements = document.querySelectorAll(focusableElements);
    
    // Sort by tabindex, then document order
    this.tabOrder = Array.from(elements).sort((a, b) => {
      const aIndex = parseInt(a.getAttribute('tabindex')) || 0;
      const bIndex = parseInt(b.getAttribute('tabindex')) || 0;
      
      if (aIndex !== bIndex) {
        return aIndex - bIndex;
      }
      
      return 0;
    });
  }

  // Setup focus trapping for modals
  setupFocusTrapping() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        this.handleTabNavigation(e);
      }
    });
  }

  // Handle tab navigation
  handleTabNavigation(e) {
    const currentElement = document.activeElement;
    const currentIndex = this.tabOrder.indexOf(currentElement);
    
    let nextIndex;
    
    if (e.shiftKey) {
      // Tab backwards
      nextIndex = currentIndex > 0 ? currentIndex - 1 : this.tabOrder.length - 1;
    } else {
      // Tab forwards
      nextIndex = currentIndex < this.tabOrder.length - 1 ? currentIndex + 1 : 0;
    }
    
    const nextElement = this.tabOrder[nextIndex];
    
    if (nextElement) {
      e.preventDefault();
      nextElement.focus();
    }
  }

  // Setup auto-focus
  setupAutoFocus() {
    // Auto-focus first input in forms
    document.querySelectorAll('form').forEach(form => {
      const firstInput = form.querySelector('input:not([disabled]), select:not([disabled]), textarea:not([disabled])');
      if (firstInput && !this.hasUserInteraction()) {
        setTimeout(() => firstInput.focus(), 100);
      }
    });
    
    // Auto-focus error inputs
    this.setupErrorFocus();
  }

  // Setup error focus
  setupErrorFocus() {
    const observer = new MutationObserver(() => {
      const firstError = document.querySelector('.form-input.error');
      if (firstError) {
        firstError.focus();
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class']
    });
  }

  // Setup input sizing
  setupInputSizing() {
    // Dynamic textarea sizing for data input
    this.setupDataInputSizing();
    
    // Responsive input sizing
    this.setupResponsiveSizing();
  }

  // Setup data input sizing
  setupDataInputSizing() {
    const dataInputs = document.querySelectorAll('.data-input, textarea[data-input="data"]');
    
    dataInputs.forEach(textarea => {
      // Set minimum size
      textarea.style.minHeight = '200px';
      textarea.style.width = '100%';
      
      // Auto-resize based on content
      this.setupSmartResize(textarea);
      
      // Add size controls
      this.addSizeControls(textarea);
    });
  }

  // Setup smart resize
  setupSmartResize(textarea) {
    const resize = () => {
      const lineHeight = parseInt(getComputedStyle(textarea).lineHeight);
      const minLines = 6;
      const maxLines = 20;
      
      // Calculate required lines
      const lines = textarea.value.split('\n').length;
      const targetHeight = Math.max(minLines, Math.min(maxLines, lines)) * lineHeight;
      
      textarea.style.height = targetHeight + 'px';
    };
    
    textarea.addEventListener('input', resize);
    textarea.addEventListener('focus', resize);
    
    // Initial resize
    resize();
  }

  // Add size controls
  addSizeControls(textarea) {
    let controls = textarea.parentNode.querySelector('.size-controls');
    
    if (!controls) {
      controls = document.createElement('div');
      controls.className = 'size-controls';
      textarea.parentNode.appendChild(controls);
    }
    
    controls.innerHTML = `
      <button class="size-btn size-small" data-size="small" title="Small">
        <i class="fas fa-compress"></i>
      </button>
      <button class="size-btn size-medium active" data-size="medium" title="Medium">
        <i class="fas fa-expand-arrows-alt"></i>
      </button>
      <button class="size-btn size-large" data-size="large" title="Large">
        <i class="fas fa-expand"></i>
      </button>
      <span class="size-info">${textarea.value.length} characters</span>
    `;
    
    // Setup size buttons
    controls.addEventListener('click', (e) => {
      const btn = e.target.closest('.size-btn');
      if (btn) {
        this.resizeTextarea(textarea, btn.dataset.size, controls);
      }
    });
    
    // Update character count
    textarea.addEventListener('input', () => {
      const info = controls.querySelector('.size-info');
      if (info) {
        info.textContent = `${textarea.value.length} characters`;
      }
    });
  }

  // Resize textarea
  resizeTextarea(textarea, size, controls) {
    const sizes = {
      small: { height: '100px', rows: 4 },
      medium: { height: '200px', rows: 8 },
      large: { height: '400px', rows: 16 }
    };
    
    const sizeConfig = sizes[size];
    if (sizeConfig) {
      textarea.style.height = sizeConfig.height;
      textarea.rows = sizeConfig.rows;
      
      // Update active button
      controls.querySelectorAll('.size-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.size === size);
      });
      
      // Save preference
      localStorage.setItem('textarea_size', size);
    }
  }

  // Setup responsive sizing
  setupResponsiveSizing() {
    const adjustForMobile = () => {
      const isMobile = window.innerWidth <= 768;
      
      document.querySelectorAll('.form-input').forEach(input => {
        if (isMobile) {
          input.style.fontSize = '16px'; // Prevent zoom on iOS
        } else {
          input.style.fontSize = '';
        }
      });
    };
    
    window.addEventListener('resize', adjustForMobile);
    adjustForMobile();
  }

  // Setup label placement
  setupLabelPlacement() {
    // Floating labels
    this.setupFloatingLabels();
    
    // Inline labels for compact forms
    this.setupInlineLabels();
    
    // Icon labels
    this.setupIconLabels();
  }

  // Setup floating labels
  setupFloatingLabels() {
    document.querySelectorAll('.form-group.floating-label').forEach(group => {
      const input = group.querySelector('.form-input');
      const label = group.querySelector('.form-label');
      
      if (input && label) {
        // Initial state
        this.updateFloatingLabel(input, label);
        
        // Update on input
        input.addEventListener('input', () => {
          this.updateFloatingLabel(input, label);
        });
        
        input.addEventListener('focus', () => {
          label.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
          label.classList.remove('focused');
          this.updateFloatingLabel(input, label);
        });
      }
    });
  }

  // Update floating label
  updateFloatingLabel(input, label) {
    const hasValue = input.value.trim().length > 0;
    const isFocused = input === document.activeElement;
    
    label.classList.toggle('float', hasValue || isFocused);
  }

  // Setup inline labels
  setupInlineLabels() {
    document.querySelectorAll('.form-group.inline-label').forEach(group => {
      const input = group.querySelector('.form-input');
      const label = group.querySelector('.form-label');
      
      if (input && label) {
        // Add screen reader only label
        label.classList.add('sr-only');
        
        // Add placeholder as visible label
        input.placeholder = label.textContent;
      }
    });
  }

  // Setup icon labels
  setupIconLabels() {
    document.querySelectorAll('.form-group.icon-label').forEach(group => {
      const input = group.querySelector('.form-input');
      const icon = group.querySelector('.input-icon');
      
      if (input && icon) {
        // Position icon
        input.style.paddingLeft = '2.5rem';
        
        // Add icon click to focus input
        icon.addEventListener('click', () => {
          input.focus();
        });
      }
    });
  }

  // Setup validation timing
  setupValidationTiming() {
    document.querySelectorAll('.form-input').forEach(input => {
      this.setupValidationTimingForInput(input);
    });
  }

  // Setup validation timing for individual input
  setupValidationTimingForInput(input) {
    let validationTimeout;
    let hasBlurredOnce = false;
    
    // Immediate validation on blur (first time)
    input.addEventListener('blur', () => {
      if (!hasBlurredOnce) {
        this.validateInput(input);
        hasBlurredOnce = true;
      }
    });
    
    // Debounced validation on input (after first blur)
    input.addEventListener('input', () => {
      if (hasBlurredOnce) {
        clearTimeout(validationTimeout);
        validationTimeout = setTimeout(() => {
          this.validateInput(input);
        }, this.debounceDelay);
      }
    });
    
    // Immediate validation on submit
    input.addEventListener('submit', () => {
      this.validateInput(input);
    });
  }

  // Validate input
  validateInput(input) {
    const validationType = input.dataset.validate;
    const value = input.value.trim();
    
    if (!validationType) return true;
    
    const validator = this.validators.get(validationType);
    if (validator) {
      const result = validator.validate(value);
      this.showValidationFeedback(input, result);
      return result.valid;
    }
    
    return true;
  }

  // Show validation feedback
  showValidationFeedback(input, result) {
    let feedback = input.parentNode.querySelector('.validation-feedback');
    
    if (!feedback) {
      feedback = document.createElement('div');
      feedback.className = 'validation-feedback';
      input.parentNode.appendChild(feedback);
    }
    
    feedback.className = `validation-feedback ${result.valid ? 'valid' : 'error'}`;
    feedback.innerHTML = `
      <i class="fas fa-${result.valid ? 'check' : 'exclamation-triangle'}"></i>
      <span>${result.message}</span>
    `;
    
    // Update input state
    input.classList.toggle('valid', result.valid);
    input.classList.toggle('error', !result.valid);
  }

  // Setup focus management
  setupFocusManagement() {
    // Focus stack for modals
    this.setupFocusStack();
    
    // Skip links
    this.setupSkipLinks();
    
    // Focus restoration
    this.setupFocusRestoration();
  }

  // Setup focus stack
  setupFocusStack() {
    document.addEventListener('focusin', (e) => {
      this.focusStack.push(e.target);
      
      // Limit stack size
      if (this.focusStack.length > 50) {
        this.focusStack.shift();
      }
    });
  }

  // Setup skip links
  setupSkipLinks() {
    const skipLinks = [
      { href: '#main-content', text: 'Skip to main content' },
      { href: '#navigation', text: 'Skip to navigation' },
      { href: '#search', text: 'Skip to search' }
    ];
    
    let container = document.querySelector('.skip-links');
    
    if (!container) {
      container = document.createElement('div');
      container.className = 'skip-links';
      document.body.insertBefore(container, document.body.firstChild);
    }
    
    skipLinks.forEach(link => {
      const a = document.createElement('a');
      a.href = link.href;
      a.textContent = link.text;
      a.className = 'skip-link';
      container.appendChild(a);
    });
  }

  // Setup focus restoration
  setupFocusRestoration() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.restoreFocus();
      }
    });
  }

  // Restore focus
  restoreFocus() {
    if (this.focusStack.length > 1) {
      this.focusStack.pop(); // Remove current element
      const previousElement = this.focusStack[this.focusStack.length - 1];
      
      if (previousElement && typeof previousElement.focus === 'function') {
        previousElement.focus();
      }
    }
  }

  // Setup keyboard shortcuts
  setupKeyboardShortcuts() {
    const shortcuts = {
      'Ctrl+S': () => this.saveAllForms(),
      'Ctrl+Z': () => this.undoLastInput(),
      'Ctrl+Y': () => this.redoLastInput(),
      'Ctrl+Enter': () => this.submitCurrentForm(),
      'Escape': () => this.clearCurrentInput()
    };
    
    document.addEventListener('keydown', (e) => {
      const key = this.getShortcutKey(e);
      const action = shortcuts[key];
      
      if (action) {
        e.preventDefault();
        action();
      }
    });
  }

  // Get shortcut key
  getShortcutKey(e) {
    const parts = [];
    
    if (e.ctrlKey || e.metaKey) parts.push('Ctrl');
    if (e.altKey) parts.push('Alt');
    if (e.shiftKey) parts.push('Shift');
    
    parts.push(e.key);
    
    return parts.join('+');
  }

  // Save all forms
  saveAllForms() {
    document.querySelectorAll('form').forEach(form => {
      this.saveFormData(form);
    });
    
    this.showNotification('All forms saved', 'success');
  }

  // Save form data
  saveFormData(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    const formId = form.id || 'unnamed_form';
    
    localStorage.setItem(`form_${formId}`, JSON.stringify(data));
  }

  // Undo last input
  undoLastInput() {
    const currentInput = document.activeElement;
    if (currentInput && currentInput.tagName === 'INPUT' || currentInput.tagName === 'TEXTAREA') {
      const history = this.inputHistory.get(currentInput) || [];
      if (history.length > 1) {
        history.pop(); // Remove current
        const previous = history[history.length - 1];
        currentInput.value = previous;
        currentInput.dispatchEvent(new Event('input'));
      }
    }
  }

  // Redo last input
  redoLastInput() {
    // Implementation would depend on history management
    console.log('Redo last input');
  }

  // Submit current form
  submitCurrentForm() {
    const currentInput = document.activeElement;
    if (currentInput) {
      const form = currentInput.closest('form');
      if (form) {
        form.requestSubmit();
      }
    }
  }

  // Clear current input
  clearCurrentInput() {
    const currentInput = document.activeElement;
    if (currentInput && (currentInput.tagName === 'INPUT' || currentInput.tagName === 'TEXTAREA')) {
      currentInput.value = '';
      currentInput.dispatchEvent(new Event('input'));
    }
  }

  // Show input feedback
  showInputFeedback(input, message, type) {
    const feedback = document.createElement('div');
    feedback.className = `input-feedback ${type}`;
    feedback.innerHTML = `
      <i class="fas fa-${type === 'success' ? 'check' : 'info'}"></i>
      <span>${message}</span>
    `;
    
    input.parentNode.appendChild(feedback);
    
    // Auto-remove after 2 seconds
    setTimeout(() => {
      feedback.remove();
    }, 2000);
  }

  // Show notification
  showNotification(message, type) {
    // Use existing notification system or create fallback
    if (window.uiEnhancements && window.uiEnhancements.showNotification) {
      window.uiEnhancements.showNotification(message, type);
    } else {
      console.log(`${type.toUpperCase()}: ${message}`);
    }
  }

  // Track auto-save
  trackAutoSave(key, length) {
    // Analytics tracking
    if (window.analytics) {
      window.analytics.trackCustomEvent('auto_save', {
        input_key: key,
        content_length: length
      });
    }
  }

  // Check if user has interacted
  hasUserInteraction() {
    return this.focusStack.length > 0;
  }

  // Public methods
  getAutoSaveData() {
    const data = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('autosave_')) {
        data[key] = localStorage.getItem(key);
      }
    }
    return data;
  }

  clearAutoSaveData() {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('autosave_')) {
        localStorage.removeItem(key);
      }
    });
  }

  validateForm(form) {
    const inputs = form.querySelectorAll('.form-input');
    let isValid = true;
    
    inputs.forEach(input => {
      if (!this.validateInput(input)) {
        isValid = false;
      }
    });
    
    return isValid;
  }
}

// Initialize form usability manager
document.addEventListener('DOMContentLoaded', () => {
  window.formUsabilityManager = new FormUsabilityManager();
});

export { FormUsabilityManager };

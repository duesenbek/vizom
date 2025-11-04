// VIZOM UI/UX Enhancement Module
class UIEnhancements {
  constructor() {
    this.init();
  }

  init() {
    this.setupTooltips();
    this.setupCharacterCount();
    this.setupTabNavigation();
    this.setupQuickActions();
    this.setupClearInput();
    this.setupChartActions();
    this.setupMobileMenu();
    this.setupNotifications();
    this.setupKeyboardShortcuts();
  }

  // Tooltip System
  setupTooltips() {
    const tooltips = document.querySelectorAll('.tooltip');
    tooltips.forEach(element => {
      element.addEventListener('mouseenter', (e) => {
        this.showTooltip(e.target);
      });
      
      element.addEventListener('mouseleave', (e) => {
        this.hideTooltip(e.target);
      });
    });
  }

  showTooltip(element) {
    const text = element.getAttribute('data-tooltip');
    if (!text) return;

    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip-popup';
    tooltip.textContent = text;
    tooltip.style.cssText = `
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      background: #1f2937;
      color: white;
      padding: 0.5rem 0.75rem;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      white-space: nowrap;
      z-index: 1000;
      margin-bottom: 0.5rem;
      opacity: 0;
      transition: opacity 0.2s ease;
    `;

    element.style.position = 'relative';
    element.appendChild(tooltip);

    setTimeout(() => {
      tooltip.style.opacity = '1';
    }, 10);
  }

  hideTooltip(element) {
    const tooltip = element.querySelector('.tooltip-popup');
    if (tooltip) {
      tooltip.style.opacity = '0';
      setTimeout(() => {
        tooltip.remove();
      }, 200);
    }
  }

  // Character Counter
  setupCharacterCount() {
    const input = document.getElementById('prompt-input');
    const counter = document.getElementById('char-count');
    
    if (input && counter) {
      input.addEventListener('input', () => {
        const count = input.value.length;
        counter.textContent = `${count} символов`;
        
        if (count > 1000) {
          counter.classList.add('text-orange-600');
        } else {
          counter.classList.remove('text-orange-600');
        }
      });
    }
  }

  // Enhanced Tab Navigation
  setupTabNavigation() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.data-tab-content');

    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        const targetTab = button.getAttribute('data-tab');
        
        // Update button states
        tabButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Update content visibility
        tabContents.forEach(content => {
          if (content.id === `${targetTab}-tab`) {
            content.classList.remove('hidden');
            this.animateTabContent(content);
          } else {
            content.classList.add('hidden');
          }
        });
      });
    });
  }

  animateTabContent(content) {
    content.style.opacity = '0';
    content.style.transform = 'translateY(10px)';
    
    setTimeout(() => {
      content.style.transition = 'all 0.3s ease';
      content.style.opacity = '1';
      content.style.transform = 'translateY(0)';
    }, 10);
  }

  // Quick Actions
  setupQuickActions() {
    const quickActions = document.querySelectorAll('.quick-action-btn');
    
    quickActions.forEach(btn => {
      btn.addEventListener('click', () => {
        this.handleQuickAction(btn);
      });
    });
  }

  handleQuickAction(button) {
    const icon = button.querySelector('i');
    const text = button.textContent.trim();
    
    // Add loading state
    button.classList.add('loading');
    button.disabled = true;

    // Simulate action
    setTimeout(() => {
      button.classList.remove('loading');
      button.disabled = false;
      
      // Show success feedback
      this.showNotification(`${text} выполнен успешно`, 'success');
    }, 800);
  }

  // Clear Input Functionality
  setupClearInput() {
    const clearBtn = document.getElementById('clear-input');
    const input = document.getElementById('prompt-input');
    
    if (clearBtn && input) {
      clearBtn.addEventListener('click', () => {
        input.value = '';
        input.focus();
        this.updateCharCount();
        this.showNotification('Поле очищено', 'info');
      });
    }
  }

  updateCharCount() {
    const input = document.getElementById('prompt-input');
    const counter = document.getElementById('char-count');
    
    if (input && counter) {
      counter.textContent = `${input.value.length} символов`;
    }
  }

  // Chart Actions
  setupChartActions() {
    const downloadBtn = document.getElementById('download-chart');
    const shareBtn = document.getElementById('share-chart');
    const fullscreenBtn = document.getElementById('fullscreen-chart');

    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => {
        this.downloadChart();
      });
    }

    if (shareBtn) {
      shareBtn.addEventListener('click', () => {
        this.shareChart();
      });
    }

    if (fullscreenBtn) {
      fullscreenBtn.addEventListener('click', () => {
        this.toggleFullscreen();
      });
    }
  }

  downloadChart() {
    const preview = document.getElementById('preview');
    if (preview && preview.innerHTML) {
      // Create download link
      const link = document.createElement('a');
      link.download = `vizom-chart-${Date.now()}.svg`;
      link.href = 'data:image/svg+xml;base64,' + btoa(preview.innerHTML);
      link.click();
      
      this.showNotification('Диаграмма скачана', 'success');
    } else {
      this.showNotification('Сначала создайте диаграмму', 'warning');
    }
  }

  shareChart() {
    if (navigator.share) {
      navigator.share({
        title: 'VIZOM Chart',
        text: 'Посмотрите на диаграмму, которую я создал!',
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      this.showNotification('Ссылка скопирована в буфер обмена', 'success');
    }
  }

  toggleFullscreen() {
    const preview = document.getElementById('preview');
    
    if (!document.fullscreenElement) {
      preview.requestFullscreen().catch(err => {
        this.showNotification('Не удалось открыть полный экран', 'error');
      });
    } else {
      document.exitFullscreen();
    }
  }

  // Enhanced Mobile Menu
  setupMobileMenu() {
    const toggle = document.getElementById('mobile-menu-toggle');
    const menu = document.getElementById('mobile-menu');
    
    if (toggle && menu) {
      toggle.addEventListener('click', () => {
        menu.classList.toggle('open');
        toggle.classList.toggle('active');
        
        // Animate icon
        const icon = toggle.querySelector('i');
        if (menu.classList.contains('open')) {
          icon.classList.remove('fa-bars');
          icon.classList.add('fa-times');
        } else {
          icon.classList.remove('fa-times');
          icon.classList.add('fa-bars');
        }
      });

      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (!toggle.contains(e.target) && !menu.contains(e.target)) {
          menu.classList.remove('open');
          toggle.classList.remove('active');
          const icon = toggle.querySelector('i');
          icon.classList.remove('fa-times');
          icon.classList.add('fa-bars');
        }
      });
    }
  }

  // Notification System
  setupNotifications() {
    // Create notification container
    if (!document.getElementById('notification-container')) {
      const container = document.createElement('div');
      container.id = 'notification-container';
      container.style.cssText = `
        position: fixed;
        top: 1rem;
        right: 1rem;
        z-index: 1000;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      `;
      document.body.appendChild(container);
    }
  }

  showNotification(message, type = 'info') {
    const container = document.getElementById('notification-container');
    const notification = document.createElement('div');
    
    const colors = {
      success: 'bg-green-500',
      error: 'bg-red-500',
      warning: 'bg-orange-500',
      info: 'bg-blue-500'
    };

    const icons = {
      success: 'fa-check-circle',
      error: 'fa-exclamation-circle',
      warning: 'fa-exclamation-triangle',
      info: 'fa-info-circle'
    };

    notification.className = `notification ${colors[type]} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 min-w-[250px]`;
    notification.style.cssText = `
      transform: translateX(400px);
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    `;

    notification.innerHTML = `
      <i class="fas ${icons[type]}"></i>
      <span>${message}</span>
    `;

    container.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 10);

    // Remove after delay
    setTimeout(() => {
      notification.style.transform = 'translateX(400px)';
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 3000);
  }

  // Keyboard Shortcuts
  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Ctrl/Cmd + Enter: Generate chart
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        this.generateChart();
      }

      // Escape: Close modals
      if (e.key === 'Escape') {
        this.closeAllModals();
      }

      // Ctrl/Cmd + S: Save project
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        this.saveProject();
      }
    });
  }

  generateChart() {
    const generateBtn = document.getElementById('smart-parse-btn');
    if (generateBtn) {
      generateBtn.click();
    }
  }

  closeAllModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
      modal.classList.add('hidden');
    });
    document.body.style.overflow = '';
  }

  saveProject() {
    const saveBtn = document.getElementById('save-project');
    if (saveBtn) {
      saveBtn.click();
    }
  }

  // Loading States
  setLoading(element, loading = true) {
    if (loading) {
      element.classList.add('loading');
      element.disabled = true;
    } else {
      element.classList.remove('loading');
      element.disabled = false;
    }
  }

  // Form Validation
  validateInput(input) {
    const value = input.value.trim();
    const validationMessage = document.getElementById('validation-message');
    
    if (!value) {
      this.showValidation('Пожалуйста, введите данные', 'error');
      return false;
    }

    if (value.length < 10) {
      this.showValidation('Слишком мало данных для построения диаграммы', 'warning');
      return false;
    }

    this.hideValidation();
    return true;
  }

  showValidation(message, type) {
    const validationMessage = document.getElementById('validation-message');
    if (validationMessage) {
      validationMessage.textContent = message;
      validationMessage.classList.remove('hidden');
      
      const colors = {
        error: 'border-red-200 bg-red-50 text-red-700',
        warning: 'border-orange-200 bg-orange-50 text-orange-700',
        success: 'border-green-200 bg-green-50 text-green-700'
      };
      
      validationMessage.className = `rounded-lg border px-4 py-3 text-sm ${colors[type]}`;
    }
  }

  hideValidation() {
    const validationMessage = document.getElementById('validation-message');
    if (validationMessage) {
      validationMessage.classList.add('hidden');
    }
  }
}

// Initialize UI Enhancements
document.addEventListener('DOMContentLoaded', () => {
  window.uiEnhancements = new UIEnhancements();
});

// Export for use in other modules
export { UIEnhancements };

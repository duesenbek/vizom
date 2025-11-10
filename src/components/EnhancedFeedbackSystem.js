/**
 * Enhanced Feedback and Confirmation System
 * Success messages, destructive action confirmations, and operation status tracking
 */

class EnhancedFeedbackSystem {
  constructor() {
    this.activeNotifications = new Map();
    this.confirmationQueue = [];
    this.operationHistory = [];
    this.init();
  }

  init() {
    this.setupFeedbackStyles();
    this.setupGlobalHandlers();
  }

  /**
   * Setup feedback styling
   */
  setupFeedbackStyles() {
    if (document.getElementById('feedback-system-styles')) return;

    const styles = document.createElement('style');
    styles.id = 'feedback-system-styles';
    styles.textContent = `
      /* Notification Container */
      .notification-container {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1000;
        pointer-events: none;
      }

      /* Base Notification */
      .notification {
        background: white;
        border-radius: 12px;
        padding: 16px 20px;
        margin-bottom: 12px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
        border-left: 4px solid #3b82f6;
        display: flex;
        align-items: flex-start;
        gap: 12px;
        min-width: 320px;
        max-width: 480px;
        pointer-events: auto;
        transform: translateX(400px);
        transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
      }

      .notification.show {
        transform: translateX(0);
      }

      .notification.success {
        border-left-color: #10b981;
        background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
      }

      .notification.error {
        border-left-color: #ef4444;
        background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
      }

      .notification.warning {
        border-left-color: #f59e0b;
        background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
      }

      .notification.info {
        border-left-color: #3b82f6;
        background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
      }

      /* Notification Icon */
      .notification-icon {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        font-size: 12px;
        color: white;
      }

      .notification.success .notification-icon {
        background: linear-gradient(135deg, #10b981, #059669);
      }

      .notification.error .notification-icon {
        background: linear-gradient(135deg, #ef4444, #dc2626);
      }

      .notification.warning .notification-icon {
        background: linear-gradient(135deg, #f59e0b, #d97706);
      }

      .notification.info .notification-icon {
        background: linear-gradient(135deg, #3b82f6, #2563eb);
      }

      /* Notification Content */
      .notification-content {
        flex: 1;
      }

      .notification-title {
        font-weight: 600;
        color: #1f293b;
        margin-bottom: 4px;
        font-size: 14px;
      }

      .notification-message {
        color: #6b7280;
        font-size: 13px;
        line-height: 1.4;
      }

      /* Notification Actions */
      .notification-actions {
        display: flex;
        gap: 8px;
        margin-top: 12px;
      }

      .notification-action {
        padding: 4px 12px;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 500;
        border: none;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .notification-action.primary {
        background: #3b82f6;
        color: white;
      }

      .notification-action.primary:hover {
        background: #2563eb;
      }

      .notification-action.secondary {
        background: #f3f4f6;
        color: #374151;
      }

      .notification-action.secondary:hover {
        background: #e5e7eb;
      }

      /* Notification Close */
      .notification-close {
        background: none;
        border: none;
        color: #9ca3af;
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        transition: all 0.2s ease;
        flex-shrink: 0;
      }

      .notification-close:hover {
        background: rgba(0, 0, 0, 0.1);
        color: #6b7280;
      }

      /* Progress Bar */
      .notification-progress {
        position: absolute;
        bottom: 0;
        left: 0;
        height: 3px;
        background: currentColor;
        opacity: 0.2;
        border-radius: 0 0 12px 12px;
        transition: width linear;
      }

      /* Confirmation Dialog */
      .confirmation-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(4px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      .confirmation-overlay.show {
        opacity: 1;
      }

      .confirmation-dialog {
        background: white;
        border-radius: 16px;
        padding: 24px;
        max-width: 480px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        transform: scale(0.9);
        transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
      }

      .confirmation-overlay.show .confirmation-dialog {
        transform: scale(1);
      }

      .confirmation-icon {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 16px;
        font-size: 20px;
        color: white;
      }

      .confirmation-icon.danger {
        background: linear-gradient(135deg, #ef4444, #dc2626);
      }

      .confirmation-icon.warning {
        background: linear-gradient(135deg, #f59e0b, #d97706);
      }

      .confirmation-icon.info {
        background: linear-gradient(135deg, #3b82f6, #2563eb);
      }

      .confirmation-title {
        font-size: 18px;
        font-weight: 600;
        color: #1f293b;
        text-align: center;
        margin-bottom: 12px;
      }

      .confirmation-message {
        color: #6b7280;
        text-align: center;
        line-height: 1.5;
        margin-bottom: 24px;
      }

      .confirmation-details {
        background: #f9fafb;
        border-radius: 8px;
        padding: 16px;
        margin-bottom: 24px;
        border: 1px solid #e5e7eb;
      }

      .confirmation-detail-item {
        display: flex;
        justify-content: space-between;
        padding: 8px 0;
        border-bottom: 1px solid #e5e7eb;
      }

      .confirmation-detail-item:last-child {
        border-bottom: none;
      }

      .confirmation-detail-label {
        font-weight: 500;
        color: #374151;
      }

      .confirmation-detail-value {
        color: #6b7280;
      }

      .confirmation-actions {
        display: flex;
        gap: 12px;
      }

      .confirmation-button {
        flex: 1;
        padding: 12px 20px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        border: none;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .confirmation-button.danger {
        background: linear-gradient(135deg, #ef4444, #dc2626);
        color: white;
      }

      .confirmation-button.danger:hover {
        background: linear-gradient(135deg, #dc2626, #b91c1c);
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
      }

      .confirmation-button.secondary {
        background: #f3f4f6;
        color: #374151;
      }

      .confirmation-button.secondary:hover {
        background: #e5e7eb;
      }

      /* Operation Status */
      .operation-status {
        position: fixed;
        bottom: 20px;
        left: 20px;
        background: white;
        border-radius: 12px;
        padding: 16px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        border: 1px solid #e5e7eb;
        min-width: 280px;
        z-index: 900;
      }

      .operation-status-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 12px;
      }

      .operation-status-icon {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: #3b82f6;
        animation: pulse 2s infinite;
      }

      .operation-status-title {
        font-weight: 500;
        color: #1f293b;
        font-size: 14px;
      }

      .operation-status-progress {
        height: 4px;
        background: #e5e7eb;
        border-radius: 2px;
        overflow: hidden;
        margin-bottom: 8px;
      }

      .operation-status-fill {
        height: 100%;
        background: linear-gradient(90deg, #3b82f6, #8b5cf6);
        border-radius: 2px;
        transition: width 0.3s ease;
      }

      .operation-status-message {
        font-size: 12px;
        color: #6b7280;
      }

      /* Mobile Optimizations */
      @media (max-width: 768px) {
        .notification-container {
          top: 10px;
          right: 10px;
          left: 10px;
        }

        .notification {
          min-width: auto;
          max-width: none;
          margin-bottom: 8px;
        }

        .confirmation-dialog {
          width: 95%;
          padding: 20px;
        }

        .operation-status {
          bottom: 10px;
          left: 10px;
          right: 10px;
          min-width: auto;
        }
      }

      /* Animations */
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }

      @keyframes slideIn {
        from { transform: translateX(100%); }
        to { transform: translateX(0); }
      }

      @keyframes slideOut {
        from { transform: translateX(0); }
        to { transform: translateX(100%); }
      }
    `;
    document.head.appendChild(styles);
  }

  /**
   * Setup global handlers
   */
  setupGlobalHandlers() {
    // Create notification container
    if (!document.getElementById('notification-container')) {
      const container = document.createElement('div');
      container.id = 'notification-container';
      container.className = 'notification-container';
      document.body.appendChild(container);
    }
  }

  /**
   * Show success notification
   */
  showSuccess(title, message, options = {}) {
    return this.showNotification('success', title, message, options);
  }

  /**
   * Show error notification
   */
  showError(title, message, options = {}) {
    return this.showNotification('error', title, message, options);
  }

  /**
   * Show warning notification
   */
  showWarning(title, message, options = {}) {
    return this.showNotification('warning', title, message, options);
  }

  /**
   * Show info notification
   */
  showInfo(title, message, options = {}) {
    return this.showNotification('info', title, message, options);
  }

  /**
   * Show notification
   */
  showNotification(type, title, message, options = {}) {
    const {
      duration = type === 'error' ? 8000 : 5000,
      actions = [],
      showProgress = true,
      persistent = false
    } = options;

    const notificationId = `notification-${Date.now()}`;
    
    const notification = document.createElement('div');
    notification.id = notificationId;
    notification.className = `notification ${type}`;
    
    const icons = {
      success: 'fa-check',
      error: 'fa-times',
      warning: 'fa-exclamation',
      info: 'fa-info'
    };

    notification.innerHTML = `
      <div class="notification-icon">
        <i class="fas ${icons[type]}"></i>
      </div>
      <div class="notification-content">
        <div class="notification-title">${title}</div>
        <div class="notification-message">${message}</div>
        ${actions.length > 0 ? `
          <div class="notification-actions">
            ${actions.map(action => `
              <button class="notification-action ${action.type || 'secondary'}" 
                      onclick="${action.onClick || ''}">
                ${action.label}
              </button>
            `).join('')}
          </div>
        ` : ''}
      </div>
      <button class="notification-close" onclick="feedbackSystem.hideNotification('${notificationId}')">
        <i class="fas fa-times"></i>
      </button>
      ${showProgress && !persistent ? '<div class="notification-progress"></div>' : ''}
    `;

    // Add to container
    const container = document.getElementById('notification-container');
    container.appendChild(notification);

    // Track notification
    this.activeNotifications.set(notificationId, {
      type,
      title,
      message,
      element: notification,
      timestamp: Date.now()
    });

    // Show animation
    setTimeout(() => {
      notification.classList.add('show');
    }, 100);

    // Setup progress bar
    if (showProgress && !persistent) {
      const progressBar = notification.querySelector('.notification-progress');
      if (progressBar) {
        progressBar.style.transition = `width ${duration}ms linear`;
        progressBar.style.width = '100%';
        
        setTimeout(() => {
          progressBar.style.width = '0%';
        }, 100);
      }
    }

    // Auto hide
    if (!persistent) {
      setTimeout(() => {
        this.hideNotification(notificationId);
      }, duration);
    }

    return notificationId;
  }

  /**
   * Hide notification
   */
  hideNotification(notificationId) {
    const notification = document.getElementById(notificationId);
    if (!notification) return;

    notification.classList.remove('show');
    
    setTimeout(() => {
      notification.remove();
      this.activeNotifications.delete(notificationId);
    }, 300);
  }

  /**
   * Show confirmation dialog
   */
  showConfirmation(options = {}) {
    const {
      title = 'Confirm Action',
      message = 'Are you sure you want to proceed?',
      type = 'warning',
      details = null,
      confirmText = 'Confirm',
      cancelText = 'Cancel',
      onConfirm = null,
      onCancel = null,
      dangerous = false
    } = options;

    const confirmationId = `confirmation-${Date.now()}`;
    
    const overlay = document.createElement('div');
    overlay.id = confirmationId;
    overlay.className = 'confirmation-overlay';
    
    overlay.innerHTML = `
      <div class="confirmation-dialog">
        <div class="confirmation-icon ${type}">
          <i class="fas ${type === 'danger' ? 'fa-trash' : type === 'warning' ? 'fa-exclamation' : 'fa-question'}"></i>
        </div>
        
        <h3 class="confirmation-title">${title}</h3>
        <p class="confirmation-message">${message}</p>
        
        ${details ? `
          <div class="confirmation-details">
            ${Object.entries(details).map(([key, value]) => `
              <div class="confirmation-detail-item">
                <span class="confirmation-detail-label">${key}:</span>
                <span class="confirmation-detail-value">${value}</span>
              </div>
            `).join('')}
          </div>
        ` : ''}
        
        <div class="confirmation-actions">
          <button class="confirmation-button secondary" onclick="feedbackSystem.cancelConfirmation('${confirmationId}')">
            ${cancelText}
          </button>
          <button class="confirmation-button ${dangerous ? 'danger' : 'primary'}" 
                  onclick="feedbackSystem.confirmAction('${confirmationId}')">
            ${confirmText}
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    // Store confirmation data
    this.confirmationQueue.push({
      id: confirmationId,
      onConfirm,
      onCancel,
      overlay
    });

    // Show animation
    setTimeout(() => {
      overlay.classList.add('show');
    }, 100);

    return confirmationId;
  }

  /**
   * Confirm action
   */
  confirmAction(confirmationId) {
    const confirmation = this.confirmationQueue.find(c => c.id === confirmationId);
    if (!confirmation) return;

    // Remove from queue
    this.confirmationQueue = this.confirmationQueue.filter(c => c.id !== confirmationId);

    // Hide overlay
    confirmation.overlay.classList.remove('show');
    setTimeout(() => {
      confirmation.overlay.remove();
    }, 300);

    // Execute callback
    if (confirmation.onConfirm) {
      confirmation.onConfirm();
    }
  }

  /**
   * Cancel confirmation
   */
  cancelConfirmation(confirmationId) {
    const confirmation = this.confirmationQueue.find(c => c.id === confirmationId);
    if (!confirmation) return;

    // Remove from queue
    this.confirmationQueue = this.confirmationQueue.filter(c => c.id !== confirmationId);

    // Hide overlay
    confirmation.overlay.classList.remove('show');
    setTimeout(() => {
      confirmation.overlay.remove();
    }, 300);

    // Execute callback
    if (confirmation.onCancel) {
      confirmation.onCancel();
    }
  }

  /**
   * Show operation status
   */
  showOperationStatus(title, steps = []) {
    const statusId = `operation-${Date.now()}`;
    
    const status = document.createElement('div');
    status.id = statusId;
    status.className = 'operation-status';
    
    status.innerHTML = `
      <div class="operation-status-header">
        <div class="operation-status-icon"></div>
        <div class="operation-status-title">${title}</div>
      </div>
      <div class="operation-status-progress">
        <div class="operation-status-fill" style="width: 0%"></div>
      </div>
      <div class="operation-status-message">Starting...</div>
    `;

    document.body.appendChild(status);

    // Track operation
    const operation = {
      id: statusId,
      title,
      steps,
      currentStep: 0,
      element: status,
      startTime: Date.now()
    };

    this.operationHistory.push(operation);

    return {
      updateProgress: (percentage, message) => {
        this.updateOperationStatus(statusId, percentage, message);
      },
      complete: (message = 'Operation completed successfully') => {
        this.completeOperationStatus(statusId, message);
      },
      fail: (message = 'Operation failed') => {
        this.failOperationStatus(statusId, message);
      }
    };
  }

  /**
   * Update operation status
   */
  updateOperationStatus(statusId, percentage, message) {
    const status = document.getElementById(statusId);
    if (!status) return;

    const fill = status.querySelector('.operation-status-fill');
    const messageEl = status.querySelector('.operation-status-message');

    if (fill) fill.style.width = `${Math.min(percentage, 100)}%`;
    if (messageEl) messageEl.textContent = message;
  }

  /**
   * Complete operation status
   */
  completeOperationStatus(statusId, message) {
    const status = document.getElementById(statusId);
    if (!status) return;

    const icon = status.querySelector('.operation-status-icon');
    const fill = status.querySelector('.operation-status-fill');
    const messageEl = status.querySelector('.operation-status-message');

    if (icon) {
      icon.style.background = '#10b981';
      icon.style.animation = 'none';
    }
    if (fill) fill.style.width = '100%';
    if (messageEl) messageEl.textContent = message;

    // Auto hide after 3 seconds
    setTimeout(() => {
      status.remove();
    }, 3000);
  }

  /**
   * Fail operation status
   */
  failOperationStatus(statusId, message) {
    const status = document.getElementById(statusId);
    if (!status) return;

    const icon = status.querySelector('.operation-status-icon');
    const messageEl = status.querySelector('.operation-status-message');

    if (icon) {
      icon.style.background = '#ef4444';
      icon.style.animation = 'none';
    }
    if (messageEl) messageEl.textContent = message;

    // Auto hide after 5 seconds
    setTimeout(() => {
      status.remove();
    }, 5000);
  }

  /**
   * Quick confirm for destructive actions
   */
  confirmDelete(itemType, itemName, onConfirm) {
    return this.showConfirmation({
      title: `Delete ${itemType}`,
      message: `Are you sure you want to delete "${itemName}"? This action cannot be undone.`,
      type: 'danger',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      dangerous: true,
      onConfirm,
      details: {
        'Item Type': itemType,
        'Item Name': itemName,
        'Action': 'Permanent Delete'
      }
    });
  }

  /**
   * Quick confirm for save actions
   */
  confirmSave(itemType, itemName, onConfirm) {
    return this.showConfirmation({
      title: `Save ${itemType}`,
      message: `Save changes to "${itemName}"?`,
      type: 'info',
      confirmText: 'Save',
      cancelText: 'Cancel',
      onConfirm
    });
  }

  /**
   * Get notification statistics
   */
  getStats() {
    return {
      activeNotifications: this.activeNotifications.size,
      pendingConfirmations: this.confirmationQueue.length,
      operationHistory: this.operationHistory.length,
      recentOperations: this.operationHistory.slice(-5)
    };
  }

  /**
   * Clear all notifications
   */
  clearAllNotifications() {
    this.activeNotifications.forEach((_, id) => {
      this.hideNotification(id);
    });
  }

  /**
   * Clear all confirmations
   */
  clearAllConfirmations() {
    this.confirmationQueue.forEach(confirmation => {
      confirmation.overlay.remove();
    });
    this.confirmationQueue = [];
  }
}

// Export singleton instance
export const feedbackSystem = new EnhancedFeedbackSystem();

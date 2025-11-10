/**
 * Loading Spinner Component
 * Provides beautiful loading states for chart generation
 */

class LoadingSpinner {
  constructor() {
    this.spinnerHtml = `
      <div class="loading-spinner-overlay" id="loadingSpinner" style="display: none;">
        <div class="loading-spinner-container">
          <div class="loading-spinner">
            <div class="spinner-ring"></div>
            <div class="spinner-ring"></div>
            <div class="spinner-ring"></div>
            <div class="spinner-ring"></div>
          </div>
          <div class="loading-text">
            <p class="loading-message">Creating your visualization...</p>
            <div class="loading-progress">
              <div class="progress-bar">
                <div class="progress-fill"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    this.styles = `
      <style>
        .loading-spinner-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          animation: fadeIn 0.3s ease;
        }

        .loading-spinner-container {
          text-align: center;
          color: white;
        }

        .loading-spinner {
          position: relative;
          width: 80px;
          height: 80px;
          margin: 0 auto 20px;
        }

        .spinner-ring {
          position: absolute;
          width: 100%;
          height: 100%;
          border: 3px solid transparent;
          border-top-color: #6366f1;
          border-radius: 50%;
          animation: spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
        }

        .spinner-ring:nth-child(1) {
          animation-delay: -0.45s;
        }

        .spinner-ring:nth-child(2) {
          animation-delay: -0.3s;
          border-top-color: #8b5cf6;
        }

        .spinner-ring:nth-child(3) {
          animation-delay: -0.15s;
          border-top-color: #06d6a0;
        }

        .spinner-ring:nth-child(4) {
          border-top-color: #f59e0b;
        }

        .loading-message {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 15px;
          animation: pulse 2s ease-in-out infinite;
        }

        .loading-progress {
          width: 200px;
          margin: 0 auto;
        }

        .progress-bar {
          width: 100%;
          height: 4px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 2px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #6366f1, #8b5cf6);
          border-radius: 2px;
          animation: progressAnimation 2s ease-in-out infinite;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        @keyframes progressAnimation {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
      </style>
    `;
    
    this.init();
  }

  init() {
    // Add styles to head
    document.head.insertAdjacentHTML('beforeend', this.styles);
    
    // Add spinner to body
    document.body.insertAdjacentHTML('beforeend', this.spinnerHtml);
    
    // Setup message variations
    this.messages = [
      'Creating your visualization...',
      'Analyzing your data...',
      'Generating chart configuration...',
      'Applying beautiful styling...',
      'Almost ready...'
    ];
  }

  show(message = null) {
    const spinner = document.getElementById('loadingSpinner');
    const messageEl = spinner.querySelector('.loading-message');
    
    if (message) {
      messageEl.textContent = message;
    } else {
      this.animateMessages();
    }
    
    spinner.style.display = 'flex';
  }

  hide() {
    const spinner = document.getElementById('loadingSpinner');
    spinner.style.display = 'none';
  }

  animateMessages() {
    let messageIndex = 0;
    const messageEl = document.querySelector('.loading-message');
    
    const interval = setInterval(() => {
      if (document.getElementById('loadingSpinner').style.display === 'none') {
        clearInterval(interval);
        return;
      }
      
      messageEl.textContent = this.messages[messageIndex];
      messageIndex = (messageIndex + 1) % this.messages.length;
    }, 800);
  }

  updateProgress(percentage) {
    const progressFill = document.querySelector('.progress-fill');
    progressFill.style.width = `${percentage}%`;
  }
}

// Export for global use
window.LoadingSpinner = LoadingSpinner;
window.loadingSpinner = new LoadingSpinner();

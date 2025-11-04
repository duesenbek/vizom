// Modal System Component
// Provides consistent modal functionality across all VIZOM pages

class ModalSystem {
  constructor() {
    this.activeModal = null;
    this.modalStack = [];
    this.modalTypes = {
      AUTH: 'auth',
      TEMPLATE_PREVIEW: 'template-preview',
      EXPORT_SETTINGS: 'export-settings',
      PROJECT_SAVE: 'project-save'
    };
    
    this.modalTemplates = this.getModalTemplates();
    this.init();
  }

  init() {
    this.setupGlobalEventListeners();
    this.setupFocusManagement();
    this.setupAccessibility();
    this.createModalContainer();
  }

  getModalTemplates() {
    return {
      [this.modalTypes.AUTH]: {
        title: 'Welcome to VIZOM',
        content: this.getAuthModalContent(),
        size: 'medium',
        backdrop: true,
        closable: true
      },
      [this.modalTypes.TEMPLATE_PREVIEW]: {
        title: 'Template Preview',
        content: this.getTemplatePreviewContent(),
        size: 'large',
        backdrop: true,
        closable: true
      },
      [this.modalTypes.EXPORT_SETTINGS]: {
        title: 'Export Settings',
        content: this.getExportSettingsContent(),
        size: 'small',
        backdrop: true,
        closable: true
      },
      [this.modalTypes.PROJECT_SAVE]: {
        title: 'Save Project',
        content: this.getProjectSaveContent(),
        size: 'medium',
        backdrop: true,
        closable: true
      }
    };
  }

  getAuthModalContent() {
    return `
      <div class="auth-modal">
        <!-- Tab Navigation -->
        <div class="auth-tabs">
          <button class="auth-tab active" data-tab="signin">
            <i class="fas fa-sign-in-alt"></i>
            Sign In
          </button>
          <button class="auth-tab" data-tab="signup">
            <i class="fas fa-user-plus"></i>
            Sign Up
          </button>
        </div>

        <!-- Tab Content -->
        <div class="auth-content">
          <!-- Sign In Tab -->
          <div class="auth-tab-content active" id="signin-tab">
            <form id="signin-form" class="auth-form">
              <div class="form-group">
                <label for="signin-email">Email Address</label>
                <input 
                  type="email" 
                  id="signin-email" 
                  name="email"
                  placeholder="Enter your email"
                  required
                  class="form-input"
                >
                <span class="form-error"></span>
              </div>
              
              <div class="form-group">
                <label for="signin-password">Password</label>
                <div class="password-input-wrapper">
                  <input 
                    type="password" 
                    id="signin-password" 
                    name="password"
                    placeholder="Enter your password"
                    required
                    class="form-input"
                  >
                  <button type="button" class="password-toggle" data-target="signin-password">
                    <i class="fas fa-eye"></i>
                  </button>
                </div>
                <span class="form-error"></span>
              </div>

              <div class="form-options">
                <label class="checkbox-label">
                  <input type="checkbox" name="remember">
                  <span class="checkmark"></span>
                  Remember me
                </label>
                <button type="button" class="forgot-password-link">
                  Forgot password?
                </button>
              </div>

              <button type="submit" class="auth-submit-btn primary">
                <i class="fas fa-sign-in-alt"></i>
                Sign In
              </button>
            </form>

            <div class="auth-divider">
              <span>or continue with</span>
            </div>

            <div class="oauth-providers">
              <button class="oauth-btn google" data-provider="google">
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>
            </div>
          </div>

          <!-- Sign Up Tab -->
          <div class="auth-tab-content" id="signup-tab">
            <form id="signup-form" class="auth-form">
              <div class="form-group">
                <label for="signup-name">Full Name</label>
                <input 
                  type="text" 
                  id="signup-name" 
                  name="name"
                  placeholder="Enter your full name"
                  required
                  class="form-input"
                >
                <span class="form-error"></span>
              </div>

              <div class="form-group">
                <label for="signup-email">Email Address</label>
                <input 
                  type="email" 
                  id="signup-email" 
                  name="email"
                  placeholder="Enter your email"
                  required
                  class="form-input"
                >
                <span class="form-error"></span>
              </div>
              
              <div class="form-group">
                <label for="signup-password">Password</label>
                <div class="password-input-wrapper">
                  <input 
                    type="password" 
                    id="signup-password" 
                    name="password"
                    placeholder="Create a password"
                    required
                    class="form-input"
                  >
                  <button type="button" class="password-toggle" data-target="signup-password">
                    <i class="fas fa-eye"></i>
                  </button>
                </div>
                <div class="password-strength">
                  <div class="strength-bar">
                    <div class="strength-fill"></div>
                  </div>
                  <span class="strength-text">Password strength</span>
                </div>
                <span class="form-error"></span>
              </div>

              <div class="form-options">
                <label class="checkbox-label">
                  <input type="checkbox" name="terms" required>
                  <span class="checkmark"></span>
                  I agree to the Terms of Service and Privacy Policy
                </label>
              </div>

              <button type="submit" class="auth-submit-btn primary">
                <i class="fas fa-user-plus"></i>
                Create Account
              </button>
            </form>

            <div class="auth-divider">
              <span>or sign up with</span>
            </div>

            <div class="oauth-providers">
              <button class="oauth-btn google" data-provider="google">
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign up with Google
              </button>
            </div>
          </div>
        </div>

        <!-- Forgot Password Form (Hidden by default) -->
        <div class="forgot-password-form hidden" id="forgot-password-form">
          <div class="forgot-password-header">
            <button type="button" class="back-to-signin">
              <i class="fas fa-arrow-left"></i>
              Back to Sign In
            </button>
            <h3>Reset Password</h3>
            <p>Enter your email address and we'll send you a link to reset your password.</p>
          </div>

          <form id="forgot-password-form-inner" class="auth-form">
            <div class="form-group">
              <label for="reset-email">Email Address</label>
              <input 
                type="email" 
                id="reset-email" 
                name="email"
                placeholder="Enter your email"
                required
                class="form-input"
              >
              <span class="form-error"></span>
            </div>

            <button type="submit" class="auth-submit-btn primary">
              <i class="fas fa-paper-plane"></i>
              Send Reset Link
            </button>
          </form>
        </div>
      </div>
    `;
  }

  getTemplatePreviewContent() {
    return `
      <div class="template-preview-modal">
        <div class="template-preview-container">
          <!-- Preview Section -->
          <div class="preview-section">
            <div class="preview-header">
              <h3>Template Preview</h3>
              <div class="preview-actions">
                <button class="preview-action-btn" id="fullscreen-preview">
                  <i class="fas fa-expand"></i>
                  Fullscreen
                </button>
                <button class="preview-action-btn" id="view-screenshots">
                  <i class="fas fa-images"></i>
                  Screenshots
                </button>
              </div>
            </div>
            
            <div class="preview-content" id="modal-preview-content">
              <div class="preview-placeholder">
                <i class="fas fa-chart-simple"></i>
                <p>Loading preview...</p>
              </div>
            </div>
          </div>

          <!-- Details Section -->
          <div class="details-section">
            <div class="template-info">
              <h3 id="template-modal-title">Template Title</h3>
              <div class="template-meta">
                <span class="template-category" id="template-modal-category">📊 Dashboard</span>
                <span class="template-badge free" id="template-modal-badge">Free</span>
              </div>
              <p class="template-description" id="template-modal-description">
                Template description will be loaded here...
              </p>
            </div>

            <!-- Use Cases -->
            <div class="template-use-cases">
              <h4>Use Cases</h4>
              <ul id="template-use-cases-list">
                <li><i class="fas fa-check text-emerald-500"></i> Monthly business reviews</li>
                <li><i class="fas fa-check text-emerald-500"></i> Investor presentations</li>
                <li><i class="fas fa-check text-emerald-500"></i> Team performance tracking</li>
              </ul>
            </div>

            <!-- Features -->
            <div class="template-features">
              <h4>Features</h4>
              <div class="feature-grid">
                <div class="feature-item">
                  <span class="feature-label">Setup Time</span>
                  <span class="feature-value" id="template-setup-time">15 minutes</span>
                </div>
                <div class="feature-item">
                  <span class="feature-label">Export Formats</span>
                  <span class="feature-value" id="template-exports">PNG, PDF, SVG, CSV</span>
                </div>
                <div class="feature-item">
                  <span class="feature-label">Customization</span>
                  <span class="feature-value">Full</span>
                </div>
                <div class="feature-item">
                  <span class="feature-label">Data Sources</span>
                  <span class="feature-value">CSV, API, Manual</span>
                </div>
              </div>
            </div>

            <!-- Customization Options -->
            <div class="template-customization">
              <h4>Customization Options</h4>
              <div class="customization-controls">
                <div class="control-group">
                  <label>Color Scheme</label>
                  <select id="template-color-scheme">
                    <option value="default">Default Blue</option>
                    <option value="professional">Professional Gray</option>
                    <option value="vibrant">Vibrant Purple</option>
                    <option value="emerald">Emerald Green</option>
                    <option value="custom">Custom Colors</option>
                  </select>
                </div>
                <div class="control-group">
                  <label>Layout Style</label>
                  <select id="template-layout">
                    <option value="compact">Compact</option>
                    <option value="standard">Standard</option>
                    <option value="spacious">Spacious</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="template-actions">
              <button class="primary-action-btn" id="use-template-btn">
                <i class="fas fa-bolt"></i>
                Use This Template
              </button>
              <div class="secondary-actions">
                <button class="secondary-action-btn" id="save-template-btn">
                  <i class="far fa-bookmark"></i>
                  Save for Later
                </button>
                <button class="secondary-action-btn" id="share-template-btn">
                  <i class="fas fa-share-alt"></i>
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  getExportSettingsContent() {
    return `
      <div class="export-settings-modal">
        <form id="export-form" class="export-form">
          <!-- Format Selection -->
          <div class="form-section">
            <h4>Export Format</h4>
            <div class="format-options">
              <label class="format-option">
                <input type="radio" name="format" value="png" checked>
                <div class="format-card">
                  <i class="fas fa-image"></i>
                  <span class="format-name">PNG</span>
                  <span class="format-description">Best for web and presentations</span>
                </div>
              </label>
              
              <label class="format-option">
                <input type="radio" name="format" value="pdf">
                <div class="format-card">
                  <i class="fas fa-file-pdf"></i>
                  <span class="format-name">PDF</span>
                  <span class="format-description">Best for documents and printing</span>
                </div>
              </label>
              
              <label class="format-option">
                <input type="radio" name="format" value="svg">
                <div class="format-card">
                  <i class="fas fa-vector-square"></i>
                  <span class="format-name">SVG</span>
                  <span class="format-description">Best for editing and scaling</span>
                </div>
              </label>
            </div>
          </div>

          <!-- Quality Settings -->
          <div class="form-section" id="quality-section">
            <h4>Quality Settings</h4>
            <div class="quality-controls">
              <div class="control-group">
                <label for="export-quality">Quality</label>
                <select id="export-quality" name="quality">
                  <option value="low">Low (Fast)</option>
                  <option value="medium" selected>Medium (Balanced)</option>
                  <option value="high">High (Best)</option>
                  <option value="ultra">Ultra (Maximum)</option>
                </select>
              </div>
              
              <div class="control-group">
                <label for="export-dpi">DPI</label>
                <select id="export-dpi" name="dpi">
                  <option value="72">72 DPI (Web)</option>
                  <option value="150">150 DPI (Standard)</option>
                  <option value="300" selected>300 DPI (Print)</option>
                  <option value="600">600 DPI (High Print)</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Size Options -->
          <div class="form-section">
            <h4>Size Options</h4>
            <div class="size-controls">
              <div class="control-group">
                <label for="export-size">Size</label>
                <select id="export-size" name="size">
                  <option value="original">Original Size</option>
                  <option value="custom">Custom Size</option>
                  <option value="preset">Preset Sizes</option>
                </select>
              </div>
              
              <div class="custom-size-controls hidden" id="custom-size-controls">
                <div class="size-inputs">
                  <div class="size-input-group">
                    <label for="export-width">Width (px)</label>
                    <input type="number" id="export-width" name="width" min="100" max="5000" value="1920">
                  </div>
                  <div class="size-input-group">
                    <label for="export-height">Height (px)</label>
                    <input type="number" id="export-height" name="height" min="100" max="5000" value="1080">
                  </div>
                </div>
                <label class="checkbox-label">
                  <input type="checkbox" id="maintain-aspect" checked>
                  <span class="checkmark"></span>
                  Maintain aspect ratio
                </label>
              </div>
            </div>
          </div>

          <!-- Additional Options -->
          <div class="form-section">
            <h4>Additional Options</h4>
            <div class="additional-options">
              <label class="checkbox-label">
                <input type="checkbox" name="transparent" checked>
                <span class="checkmark"></span>
                Transparent background (PNG only)
              </label>
              <label class="checkbox-label">
                <input type="checkbox" name="metadata">
                <span class="checkmark"></span>
                Include metadata
              </label>
              <label class="checkbox-label">
                <input type="checkbox" name="grid" checked>
                <span class="checkmark"></span>
                Show grid lines
              </label>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="form-actions">
            <button type="button" class="cancel-btn" onclick="modalSystem.closeModal()">
              Cancel
            </button>
            <button type="submit" class="export-btn primary">
              <i class="fas fa-download"></i>
              Export
            </button>
          </div>
        </form>
      </div>
    `;
  }

  getProjectSaveContent() {
    return `
      <div class="project-save-modal">
        <form id="project-save-form" class="project-save-form">
          <!-- Project Details -->
          <div class="form-section">
            <h4>Project Details</h4>
            <div class="project-details">
              <div class="form-group">
                <label for="project-name">Project Name *</label>
                <input 
                  type="text" 
                  id="project-name" 
                  name="name"
                  placeholder="Enter project name"
                  required
                  class="form-input"
                  maxlength="100"
                >
                <div class="input-hint">
                  <span id="name-char-count">0/100</span> characters
                </div>
                <span class="form-error"></span>
              </div>

              <div class="form-group">
                <label for="project-description">Description</label>
                <textarea 
                  id="project-description" 
                  name="description"
                  placeholder="Describe your project (optional)"
                  class="form-textarea"
                  rows="4"
                  maxlength="500"
                ></textarea>
                <div class="input-hint">
                  <span id="desc-char-count">0/500</span> characters
                </div>
              </div>

              <div class="form-group">
                <label for="project-tags">Tags</label>
                <div class="tags-input-container">
                  <input 
                    type="text" 
                    id="project-tags" 
                    placeholder="Add tags (press Enter)"
                    class="form-input"
                  >
                  <div class="tags-list" id="tags-list"></div>
                </div>
                <div class="input-hint">
                  Add tags to help organize your projects
                </div>
              </div>
            </div>
          </div>

          <!-- Privacy Settings -->
          <div class="form-section">
            <h4>Privacy Settings</h4>
            <div class="privacy-options">
              <label class="privacy-option">
                <input type="radio" name="privacy" value="private" checked>
                <div class="privacy-card">
                  <div class="privacy-header">
                    <i class="fas fa-lock"></i>
                    <span class="privacy-title">Private</span>
                  </div>
                  <p class="privacy-description">Only you can view and edit this project</p>
                </div>
              </label>
              
              <label class="privacy-option">
                <input type="radio" name="privacy" value="public">
                <div class="privacy-card">
                  <div class="privacy-header">
                    <i class="fas fa-globe"></i>
                    <span class="privacy-title">Public</span>
                  </div>
                  <p class="privacy-description">Anyone with the link can view this project</p>
                </div>
              </label>
              
              <label class="privacy-option">
                <input type="radio" name="privacy" value="team">
                <div class="privacy-card">
                  <div class="privacy-header">
                    <i class="fas fa-users"></i>
                    <span class="privacy-title">Team</span>
                  </div>
                  <p class="privacy-description">Only team members can access this project</p>
                </div>
              </label>
            </div>
          </div>

          <!-- Advanced Settings -->
          <div class="form-section">
            <h4>Advanced Settings</h4>
            <div class="advanced-options">
              <label class="checkbox-label">
                <input type="checkbox" name="auto-save" checked>
                <span class="checkmark"></span>
                Enable auto-save
              </label>
              <label class="checkbox-label">
                <input type="checkbox" name="version-history" checked>
                <span class="checkmark"></span>
                Keep version history
              </label>
              <label class="checkbox-label">
                <input type="checkbox" name="comments">
                <span class="checkmark"></span>
                Allow comments
              </label>
              <label class="checkbox-label">
                <input type="checkbox" name="download">
                <span class="checkmark"></span>
                Allow downloads
              </label>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="form-actions">
            <button type="button" class="cancel-btn" onclick="modalSystem.closeModal()">
              Cancel
            </button>
            <button type="submit" class="save-btn primary">
              <i class="fas fa-save"></i>
              Save Project
            </button>
          </div>
        </form>
      </div>
    `;
  }

  createModalContainer() {
    // Create modal container if it doesn't exist
    if (!document.getElementById('modal-container')) {
      const container = document.createElement('div');
      container.id = 'modal-container';
      container.className = 'modal-container';
      document.body.appendChild(container);
    }
  }

  showModal(type, data = {}) {
    if (this.activeModal) {
      this.modalStack.push(this.activeModal);
    }

    const modalTemplate = this.modalTemplates[type];
    if (!modalTemplate) {
      console.error(`Modal type "${type}" not found`);
      return;
    }

    this.activeModal = this.createModalElement(type, modalTemplate, data);
    this.renderModal();
    this.setupModalEventListeners(type, data);
    this.trapFocus();
    
    // Add animation
    requestAnimationFrame(() => {
      this.activeModal.element.classList.add('modal-active');
    });
  }

  createModalElement(type, template, data) {
    const modal = document.createElement('div');
    modal.className = `modal modal-${template.size}`;
    modal.dataset.modalType = type;

    modal.innerHTML = `
      <div class="modal-backdrop"></div>
      <div class="modal-content" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div class="modal-header">
          <h2 id="modal-title" class="modal-title">${template.title}</h2>
          ${template.closable ? '<button class="modal-close" aria-label="Close modal"><i class="fas fa-times"></i></button>' : ''}
        </div>
        <div class="modal-body">
          ${template.content}
        </div>
      </div>
    `;

    return {
      element: modal,
      type: type,
      data: data,
      template: template
    };
  }

  renderModal() {
    const container = document.getElementById('modal-container');
    container.appendChild(this.activeModal.element);
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    if (!this.activeModal) return;

    const modal = this.activeModal.element;
    modal.classList.remove('modal-active');
    
    setTimeout(() => {
      modal.remove();
      
      if (this.modalStack.length > 0) {
        this.activeModal = this.modalStack.pop();
        this.renderModal();
        this.trapFocus();
      } else {
        this.activeModal = null;
        document.body.style.overflow = '';
      }
    }, 300);
  }

  setupGlobalEventListeners() {
    // ESC key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.activeModal) {
        this.closeModal();
      }
    });

    // Backdrop click to close
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-backdrop') && this.activeModal) {
        this.closeModal();
      }
    });

    // Close button clicks
    document.addEventListener('click', (e) => {
      if (e.target.closest('.modal-close')) {
        this.closeModal();
      }
    });
  }

  setupModalEventListeners(type, data) {
    const modal = this.activeModal.element;

    switch (type) {
      case this.modalTypes.AUTH:
        this.setupAuthModalListeners(modal);
        break;
      case this.modalTypes.TEMPLATE_PREVIEW:
        this.setupTemplatePreviewListeners(modal, data);
        break;
      case this.modalTypes.EXPORT_SETTINGS:
        this.setupExportSettingsListeners(modal, data);
        break;
      case this.modalTypes.PROJECT_SAVE:
        this.setupProjectSaveListeners(modal, data);
        break;
    }
  }

  setupAuthModalListeners(modal) {
    // Tab switching
    modal.querySelectorAll('.auth-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const targetTab = tab.dataset.tab;
        this.switchAuthTab(targetTab);
      });
    });

    // Password toggles
    modal.querySelectorAll('.password-toggle').forEach(toggle => {
      toggle.addEventListener('click', () => {
        const targetId = toggle.dataset.target;
        const input = document.getElementById(targetId);
        const icon = toggle.querySelector('i');
        
        if (input.type === 'password') {
          input.type = 'text';
          icon.classList.remove('fa-eye');
          icon.classList.add('fa-eye-slash');
        } else {
          input.type = 'password';
          icon.classList.remove('fa-eye-slash');
          icon.classList.add('fa-eye');
        }
      });
    });

    // Forgot password
    modal.querySelector('.forgot-password-link')?.addEventListener('click', () => {
      this.showForgotPasswordForm();
    });

    modal.querySelector('.back-to-signin')?.addEventListener('click', () => {
      this.hideForgotPasswordForm();
    });

    // Form submissions
    modal.querySelector('#signin-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSignIn(e.target);
    });

    modal.querySelector('#signup-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSignUp(e.target);
    });

    modal.querySelector('#forgot-password-form-inner')?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleForgotPassword(e.target);
    });

    // OAuth buttons
    modal.querySelectorAll('.oauth-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const provider = btn.dataset.provider;
        this.handleOAuth(provider);
      });
    });
  }

  setupTemplatePreviewListeners(modal, data) {
    // Fullscreen preview
    modal.querySelector('#fullscreen-preview')?.addEventListener('click', () => {
      this.openFullscreenPreview(data);
    });

    // View screenshots
    modal.querySelector('#view-screenshots')?.addEventListener('click', () => {
      this.viewScreenshots(data);
    });

    // Use template button
    modal.querySelector('#use-template-btn')?.addEventListener('click', () => {
      this.useTemplate(data);
    });

    // Save template button
    modal.querySelector('#save-template-btn')?.addEventListener('click', () => {
      this.saveTemplate(data);
    });

    // Share template button
    modal.querySelector('#share-template-btn')?.addEventListener('click', () => {
      this.shareTemplate(data);
    });

    // Customization controls
    modal.querySelector('#template-color-scheme')?.addEventListener('change', (e) => {
      this.updateTemplatePreview('color', e.target.value, data);
    });

    modal.querySelector('#template-layout')?.addEventListener('change', (e) => {
      this.updateTemplatePreview('layout', e.target.value, data);
    });
  }

  setupExportSettingsListeners(modal, data) {
    // Format selection
    modal.querySelectorAll('input[name="format"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        this.updateExportOptions(e.target.value);
      });
    });

    // Size selection
    modal.querySelector('#export-size')?.addEventListener('change', (e) => {
      this.handleSizeSelection(e.target.value);
    });

    // Maintain aspect ratio
    modal.querySelector('#maintain-aspect')?.addEventListener('change', (e) => {
      this.maintainAspectRatio(e.target.checked);
    });

    // Form submission
    modal.querySelector('#export-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleExport(e.target, data);
    });
  }

  setupProjectSaveListeners(modal, data) {
    // Character counters
    const nameInput = modal.querySelector('#project-name');
    const descInput = modal.querySelector('#project-description');
    
    nameInput?.addEventListener('input', (e) => {
      this.updateCharCount('name-char-count', e.target.value.length, 100);
    });

    descInput?.addEventListener('input', (e) => {
      this.updateCharCount('desc-char-count', e.target.value.length, 500);
    });

    // Tags input
    this.setupTagsInput(modal);

    // Form submission
    modal.querySelector('#project-save-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleProjectSave(e.target, data);
    });
  }

  setupFocusManagement() {
    // Focus trap implementation
    this.focusableElements = [
      'a[href]',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ].join(',');
  }

  trapFocus() {
    if (!this.activeModal) return;

    const modal = this.activeModal.element;
    const focusable = modal.querySelectorAll(this.focusableElements);
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    modal.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === first) {
            last.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === last) {
            first.focus();
            e.preventDefault();
          }
        }
      }
    });

    // Focus first element
    first?.focus();
  }

  setupAccessibility() {
    // ARIA attributes and screen reader support
    // This is handled in the modal creation
  }

  // Modal-specific methods
  switchAuthTab(tabName) {
    const tabs = document.querySelectorAll('.auth-tab');
    const contents = document.querySelectorAll('.auth-tab-content');

    tabs.forEach(tab => {
      if (tab.dataset.tab === tabName) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });

    contents.forEach(content => {
      if (content.id === `${tabName}-tab`) {
        content.classList.add('active');
      } else {
        content.classList.remove('active');
      }
    });
  }

  showForgotPasswordForm() {
    document.querySelector('.auth-content').classList.add('hidden');
    document.getElementById('forgot-password-form').classList.remove('hidden');
  }

  hideForgotPasswordForm() {
    document.querySelector('.auth-content').classList.remove('hidden');
    document.getElementById('forgot-password-form').classList.add('hidden');
  }

  // Form handlers
  async handleSignIn(form) {
    const formData = new FormData(form);
    const email = formData.get('email');
    const password = formData.get('password');
    const remember = formData.get('remember');

    try {
      this.showFormLoading(form, 'Signing in...');
      
      // Simulate API call
      await this.signInUser(email, password, remember);
      
      this.showFormSuccess(form, 'Sign in successful!');
      setTimeout(() => this.closeModal(), 1500);
      
    } catch (error) {
      this.showFormError(form, error.message);
    }
  }

  async handleSignUp(form) {
    const formData = new FormData(form);
    const name = formData.get('name');
    const email = formData.get('email');
    const password = formData.get('password');
    const terms = formData.get('terms');

    try {
      this.showFormLoading(form, 'Creating account...');
      
      // Validate password strength
      if (!this.isPasswordStrong(password)) {
        throw new Error('Password is not strong enough');
      }
      
      // Simulate API call
      await this.signUpUser(name, email, password);
      
      this.showFormSuccess(form, 'Account created successfully!');
      setTimeout(() => this.closeModal(), 1500);
      
    } catch (error) {
      this.showFormError(form, error.message);
    }
  }

  async handleForgotPassword(form) {
    const formData = new FormData(form);
    const email = formData.get('email');

    try {
      this.showFormLoading(form, 'Sending reset link...');
      
      // Simulate API call
      await this.sendPasswordReset(email);
      
      this.showFormSuccess(form, 'Reset link sent! Check your email.');
      
    } catch (error) {
      this.showFormError(form, error.message);
    }
  }

  async handleExport(form, data) {
    const formData = new FormData(form);
    const exportData = Object.fromEntries(formData.entries());

    try {
      this.showFormLoading(form, 'Exporting...');
      
      // Simulate export process
      await this.exportChart(data, exportData);
      
      this.showFormSuccess(form, 'Export successful!');
      setTimeout(() => this.closeModal(), 1500);
      
    } catch (error) {
      this.showFormError(form, error.message);
    }
  }

  async handleProjectSave(form, data) {
    const formData = new FormData(form);
    const projectData = Object.fromEntries(formData.entries());

    try {
      this.showFormLoading(form, 'Saving project...');
      
      // Add tags
      projectData.tags = this.getCurrentTags();
      
      // Simulate API call
      await this.saveProject(projectData, data);
      
      this.showFormSuccess(form, 'Project saved successfully!');
      setTimeout(() => this.closeModal(), 1500);
      
    } catch (error) {
      this.showFormError(form, error.message);
    }
  }

  // Utility methods
  showFormLoading(form, message) {
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${message}`;
  }

  showFormSuccess(form, message) {
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = false;
    submitBtn.innerHTML = `<i class="fas fa-check"></i> ${message}`;
    submitBtn.classList.add('success');
  }

  showFormError(form, message) {
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = false;
    submitBtn.innerHTML = submitBtn.dataset.originalText || 'Submit';
    
    // Show error message
    const errorElement = form.querySelector('.form-error') || this.createErrorElement(form);
    errorElement.textContent = message;
    errorElement.style.display = 'block';
  }

  createErrorElement(form) {
    const error = document.createElement('span');
    error.className = 'form-error';
    form.appendChild(error);
    return error;
  }

  isPasswordStrong(password) {
    // Basic password strength validation
    return password.length >= 8 && 
           /[A-Z]/.test(password) && 
           /[a-z]/.test(password) && 
           /[0-9]/.test(password);
  }

  updateCharCount(elementId, current, max) {
    const element = document.getElementById(elementId);
    if (element) {
      element.textContent = `${current}/${max}`;
    }
  }

  setupTagsInput(modal) {
    const tagsInput = modal.querySelector('#project-tags');
    const tagsList = modal.querySelector('#tags-list');
    const tags = [];

    tagsInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const tag = tagsInput.value.trim();
        if (tag && !tags.includes(tag)) {
          tags.push(tag);
          this.renderTags(tags, tagsList);
          tagsInput.value = '';
        }
      }
    });
  }

  renderTags(tags, container) {
    container.innerHTML = tags.map(tag => `
      <span class="tag">
        ${tag}
        <button type="button" class="tag-remove" data-tag="${tag}">
          <i class="fas fa-times"></i>
        </button>
      </span>
    `).join('');

    container.querySelectorAll('.tag-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        const tagToRemove = btn.dataset.tag;
        const index = tags.indexOf(tagToRemove);
        if (index > -1) {
          tags.splice(index, 1);
          this.renderTags(tags, container);
        }
      });
    });
  }

  getCurrentTags() {
    const tagElements = document.querySelectorAll('.tag');
    return Array.from(tagElements).map(el => el.textContent.trim());
  }

  // Mock API methods (replace with real implementations)
  async signInUser(email, password, remember) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    // Simulate successful sign in
    return { user: { email } };
  }

  async signUpUser(name, email, password) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    // Simulate successful sign up
    return { user: { name, email } };
  }

  async sendPasswordReset(email) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Simulate sending reset email
    return { success: true };
  }

  async exportChart(data, options) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    // Simulate export process
    return { url: 'https://example.com/export' };
  }

  async saveProject(projectData, data) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    // Simulate saving project
    return { id: 'project-' + Date.now() };
  }

  // Public API
  openAuthModal() {
    this.showModal(this.modalTypes.AUTH);
  }

  openTemplatePreview(templateData) {
    this.showModal(this.modalTypes.TEMPLATE_PREVIEW, templateData);
  }

  openExportSettings(chartData) {
    this.showModal(this.modalTypes.EXPORT_SETTINGS, chartData);
  }

  openProjectSave(projectData) {
    this.showModal(this.modalTypes.PROJECT_SAVE, projectData);
  }

  closeAllModals() {
    while (this.activeModal) {
      this.closeModal();
    }
  }
}

// Initialize modal system
document.addEventListener('DOMContentLoaded', () => {
  if (!window.modalSystem) {
    window.modalSystem = new ModalSystem();
  }
});

// Export for use in other modules
export { ModalSystem };

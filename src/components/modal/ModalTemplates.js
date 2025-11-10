/**
 * Modal Templates
 * Predefined modal templates for common use cases
 */

import { ModalTemplate } from './types.js';

export class ModalTemplates {
  private static templates: Map<string, ModalTemplate> = new Map();

  /**
   * Initialize all modal templates
   */
  static init(): void {
    this.registerAuthTemplate();
    this.registerTemplatePreviewTemplate();
    this.registerExportSettingsTemplate();
    this.registerProjectSaveTemplate();
    this.registerConfirmationTemplate();
    this.registerAlertTemplate();
  }

  /**
   * Register authentication modal template
   */
  private static registerAuthTemplate(): void {
    const template: ModalTemplate = {
      title: 'Welcome to VIZOM',
      content: this.getAuthContent(),
      size: 'medium',
      backdrop: true,
      closable: true
    };

    this.templates.set('auth', template);
  }

  /**
   * Register template preview modal template
   */
  private static registerTemplatePreviewTemplate(): void {
    const template: ModalTemplate = {
      title: 'Template Preview',
      content: this.getTemplatePreviewContent(),
      size: 'large',
      backdrop: true,
      closable: true
    };

    this.templates.set('template-preview', template);
  }

  /**
   * Register export settings modal template
   */
  private static registerExportSettingsTemplate(): void {
    const template: ModalTemplate = {
      title: 'Export Settings',
      content: this.getExportSettingsContent(),
      size: 'small',
      backdrop: true,
      closable: true
    };

    this.templates.set('export-settings', template);
  }

  /**
   * Register project save modal template
   */
  private static registerProjectSaveTemplate(): void {
    const template: ModalTemplate = {
      title: 'Save Project',
      content: this.getProjectSaveContent(),
      size: 'medium',
      backdrop: true,
      closable: true
    };

    this.templates.set('project-save', template);
  }

  /**
   * Register confirmation modal template
   */
  private static registerConfirmationTemplate(): void {
    const template: ModalTemplate = {
      title: 'Confirm Action',
      content: this.getConfirmationContent(),
      size: 'small',
      backdrop: true,
      closable: true
    };

    this.templates.set('confirmation', template);
  }

  /**
   * Register alert modal template
   */
  private static registerAlertTemplate(): void {
    const template: ModalTemplate = {
      title: 'Alert',
      content: this.getAlertContent(),
      size: 'small',
      backdrop: true,
      closable: true
    };

    this.templates.set('alert', template);
  }

  /**
   * Get authentication modal content
   */
  private static getAuthContent(): string {
    return `
      <div class="auth-modal">
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

        <div class="auth-content">
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
                  <button type="button" class="password-toggle">
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
                <a href="#" class="forgot-password">Forgot password?</a>
              </div>

              <button type="submit" class="btn btn-primary btn-full">
                Sign In
              </button>
            </form>
          </div>

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
                  <button type="button" class="password-toggle">
                    <i class="fas fa-eye"></i>
                  </button>
                </div>
                <span class="form-error"></span>
              </div>

              <div class="form-options">
                <label class="checkbox-label">
                  <input type="checkbox" name="terms" required>
                  <span class="checkmark"></span>
                  I agree to the Terms of Service
                </label>
              </div>

              <button type="submit" class="btn btn-primary btn-full">
                Create Account
              </button>
            </form>
          </div>
        </div>

        <div class="auth-divider">
          <span>or continue with</span>
        </div>

        <div class="social-auth">
          <button class="btn btn-social btn-google">
            <i class="fab fa-google"></i>
            Google
          </button>
          <button class="btn btn-social btn-github">
            <i class="fab fa-github"></i>
            GitHub
          </button>
        </div>
      </div>
    `;
  }

  /**
   * Get template preview content
   */
  private static getTemplatePreviewContent(): string {
    return `
      <div class="template-preview-modal">
        <div class="template-preview-header">
          <div class="template-info">
            <h3 class="template-title">Template Name</h3>
            <p class="template-description">Template description goes here</p>
          </div>
          <div class="template-actions">
            <button class="btn btn-secondary">Preview</button>
            <button class="btn btn-primary">Use Template</button>
          </div>
        </div>
        
        <div class="template-preview-content">
          <div class="preview-canvas">
            <canvas id="template-preview-canvas"></canvas>
          </div>
          
          <div class="template-details">
            <div class="detail-section">
              <h4>Features</h4>
              <ul class="feature-list">
                <li>Responsive design</li>
                <li>Interactive elements</li>
                <li>Customizable colors</li>
              </ul>
            </div>
            
            <div class="detail-section">
              <h4>Requirements</h4>
              <ul class="requirement-list">
                <li>Minimum 3 data points</li>
                <li>CSV or JSON format</li>
                <li>Structured headers</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Get export settings content
   */
  private static getExportSettingsContent(): string {
    return `
      <div class="export-settings-modal">
        <div class="setting-group">
          <label>Export Format</label>
          <select class="form-select" id="export-format">
            <option value="png">PNG Image</option>
            <option value="svg">SVG Vector</option>
            <option value="pdf">PDF Document</option>
            <option value="jpg">JPG Image</option>
          </select>
        </div>

        <div class="setting-group">
          <label>Quality</label>
          <div class="quality-options">
            <label class="radio-label">
              <input type="radio" name="quality" value="standard" checked>
              <span class="radio-mark"></span>
              Standard (1x)
            </label>
            <label class="radio-label">
              <input type="radio" name="quality" value="high">
              <span class="radio-mark"></span>
              High (2x)
            </label>
            <label class="radio-label">
              <input type="radio" name="quality" value="ultra">
              <span class="radio-mark"></span>
              Ultra (4x)
            </label>
          </div>
        </div>

        <div class="setting-group">
          <label>Options</label>
          <div class="checkbox-options">
            <label class="checkbox-label">
              <input type="checkbox" id="include-background" checked>
              <span class="checkmark"></span>
              Include background
            </label>
            <label class="checkbox-label">
              <input type="checkbox" id="include-legend" checked>
              <span class="checkmark"></span>
              Include legend
            </label>
            <label class="checkbox-label">
              <input type="checkbox" id="include-title" checked>
              <span class="checkmark"></span>
              Include title
            </label>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Get project save content
   */
  private static getProjectSaveContent(): string {
    return `
      <div class="project-save-modal">
        <div class="form-group">
          <label for="project-name">Project Name</label>
          <input 
            type="text" 
            id="project-name" 
            class="form-input"
            placeholder="Enter project name"
            required
          >
        </div>

        <div class="form-group">
          <label for="project-description">Description</label>
          <textarea 
            id="project-description" 
            class="form-textarea"
            placeholder="Describe your project (optional)"
            rows="3"
          ></textarea>
        </div>

        <div class="form-group">
          <label>Save Location</label>
          <div class="save-options">
            <label class="radio-label">
              <input type="radio" name="save-location" value="local" checked>
              <span class="radio-mark"></span>
              Local Storage
            </label>
            <label class="radio-label">
              <input type="radio" name="save-location" value="cloud">
              <span class="radio-mark"></span>
              Cloud Storage
            </label>
          </div>
        </div>

        <div class="form-group">
          <label>Sharing</label>
          <div class="sharing-options">
            <label class="checkbox-label">
              <input type="checkbox" id="make-public">
              <span class="checkmark"></span>
              Make public
            </label>
            <label class="checkbox-label">
              <input type="checkbox" id="allow-copy">
              <span class="checkmark"></span>
              Allow copying
            </label>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Get confirmation content
   */
  private static getConfirmationContent(): string {
    return `
      <div class="confirmation-modal">
        <div class="confirmation-icon">
          <i class="fas fa-exclamation-triangle"></i>
        </div>
        <h3 class="confirmation-title">Are you sure?</h3>
        <p class="confirmation-message">
          This action cannot be undone. Please confirm you want to proceed.
        </p>
        <div class="confirmation-actions">
          <button class="btn btn-secondary" data-action="cancel">Cancel</button>
          <button class="btn btn-danger" data-action="confirm">Confirm</button>
        </div>
      </div>
    `;
  }

  /**
   * Get alert content
   */
  private static getAlertContent(): string {
    return `
      <div class="alert-modal">
        <div class="alert-icon">
          <i class="fas fa-info-circle"></i>
        </div>
        <h3 class="alert-title">Notice</h3>
        <p class="alert-message">
          This is an important message that you need to acknowledge.
        </p>
        <div class="alert-actions">
          <button class="btn btn-primary" data-action="ok">OK</button>
        </div>
      </div>
    `;
  }

  /**
   * Get template by ID
   */
  static getTemplate(id: string): ModalTemplate | undefined {
    return this.templates.get(id);
  }

  /**
   * Get all templates
   */
  static getAllTemplates(): Map<string, ModalTemplate> {
    return new Map(this.templates);
  }

  /**
   * Register custom template
   */
  static registerTemplate(id: string, template: ModalTemplate): void {
    this.templates.set(id, template);
  }

  /**
   * Remove template
   */
  static removeTemplate(id: string): boolean {
    return this.templates.delete(id);
  }
}

/**
 * Button Component
 * Reusable button with variants and states
 */

export class Button {
  constructor(options = {}) {
    const {
      text = 'Button',
      variant = 'primary', // primary, secondary, ghost, outline
      size = 'medium', // small, medium, large
      icon = null,
      onClick = null,
      disabled = false,
      loading = false,
      className = '',
    } = options;

    this.text = text;
    this.variant = variant;
    this.size = size;
    this.icon = icon;
    this.onClick = onClick;
    this.disabled = disabled;
    this.loading = loading;
    this.className = className;
    this.element = this.create();
  }

  create() {
    const button = document.createElement('button');
    button.className = this.getClasses();
    button.disabled = this.disabled || this.loading;
    
    if (this.loading) {
      button.innerHTML = this.getLoadingContent();
    } else {
      button.innerHTML = this.getContent();
    }

    if (this.onClick) {
      button.addEventListener('click', this.onClick);
    }

    return button;
  }

  getClasses() {
    const base = 'btn';
    const variants = {
      primary: 'btn-primary',
      secondary: 'btn-secondary',
      ghost: 'btn-ghost',
      outline: 'btn-outline',
    };
    const sizes = {
      small: 'btn-sm',
      medium: '',
      large: 'btn-lg',
    };

    return `${base} ${variants[this.variant] || ''} ${sizes[this.size] || ''} ${this.className}`.trim();
  }

  getContent() {
    if (this.icon && this.text) {
      return `${this.icon} <span>${this.text}</span>`;
    }
    if (this.icon) {
      return this.icon;
    }
    return this.text;
  }

  getLoadingContent() {
    return `
      <svg class="animate-spin h-5 w-5 inline-block" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
      </svg>
      <span class="ml-2">Loading...</span>
    `;
  }

  setLoading(loading) {
    this.loading = loading;
    this.element.disabled = loading || this.disabled;
    this.element.innerHTML = loading ? this.getLoadingContent() : this.getContent();
  }

  setDisabled(disabled) {
    this.disabled = disabled;
    this.element.disabled = disabled || this.loading;
  }

  setText(text) {
    this.text = text;
    if (!this.loading) {
      this.element.innerHTML = this.getContent();
    }
  }

  mount(container) {
    container.appendChild(this.element);
    return this;
  }

  remove() {
    this.element.remove();
  }
}

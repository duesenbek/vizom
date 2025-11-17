const DEFAULT_CONFIG = {
  toggleSelector: '#mobile-menu-toggle',
  menuSelector: '#mobile-menu',
  overlaySelector: '#mobile-menu-overlay',
  activeToggleClass: 'is-active',
  hiddenClass: 'hidden',
  animationDuration: 220,
  trapFocus: true,
  closeOnNavigate: true,
  bodyLockClass: 'mobile-menu-open'
};

const STYLE_TAG_ID = 'mobile-menu-component-styles';
const OVERLAY_VISIBLE_CLASS = 'mobile-menu-overlay--visible';
const OVERLAY_BASE_CLASS = 'mobile-menu-overlay';
const TOGGLE_ICON_CLASS = 'mobile-menu-toggle-icon';
const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])'
].join(',');

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

const resolveElement = (ref) => {
  if (!ref) return null;
  if (typeof ref === 'string') return document.querySelector(ref);
  return ref instanceof Element ? ref : null;
};

const applyClassList = (el, classes, action) => {
  if (!classes || !el) return;
  classes
    .split(/\s+/)
    .filter(Boolean)
    .forEach((cls) => el.classList[action](cls));
};

const createOverlay = (selector) => {
  const overlay = document.createElement('div');
  overlay.className = OVERLAY_BASE_CLASS;
  overlay.setAttribute('aria-hidden', 'true');
  overlay.setAttribute('data-generated', 'true');

  if (typeof selector === 'string' && selector.startsWith('#')) {
    overlay.id = selector.slice(1);
  }

  document.body.appendChild(overlay);
  return overlay;
};

class MobileMenuController {
  constructor(toggle, menu, options) {
    this.toggle = toggle;
    this.menu = menu;
    this.options = { ...options };
    this.isOpen = false;
    this.lastFocused = null;
    this.animationTimer = null;

    this.overlay = resolveElement(this.options.overlaySelector);
    if (!this.overlay && this.options.overlaySelector) {
      this.overlay = createOverlay(this.options.overlaySelector);
    }
    if (this.overlay) {
      this.overlay.classList.add(OVERLAY_BASE_CLASS);
      this.overlay.setAttribute('aria-hidden', 'true');
    }

    this.icon =
      this.toggle.querySelector('[data-mobile-menu-icon]') ||
      this.toggle.querySelector('i, svg') ||
      null;
    if (this.icon) {
      this.icon.classList.add(TOGGLE_ICON_CLASS);
    }

    if (prefersReducedMotion()) {
      this.options.animationDuration = 0;
    }

    this.handleToggleClick = this.handleToggleClick.bind(this);
    this.handleDocumentPointerDown = this.handleDocumentPointerDown.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
    this.handleMenuClick = this.handleMenuClick.bind(this);
    this.handleOverlayClick = this.handleOverlayClick.bind(this);
  }

  init() {
    ensureStylesInjected();

    if (!this.menu.id) {
      this.menu.id = 'mobile-menu';
    }

    this.toggle.setAttribute('aria-expanded', 'false');
    this.toggle.setAttribute('aria-haspopup', 'true');
    this.toggle.setAttribute('aria-controls', this.menu.id);
    const initialState = this.menuIsHidden() ? 'closed' : 'open';
    this.menu.setAttribute('data-mobile-menu-state', initialState);
    this.menu.setAttribute('data-state', initialState);
    this.menu.setAttribute('aria-hidden', this.menuIsHidden() ? 'true' : 'false');
    this.menu.setAttribute('role', this.menu.getAttribute('role') || 'navigation');
    this.menu.setAttribute('tabindex', '-1');

    this.toggle.addEventListener('click', this.handleToggleClick);
    this.menu.addEventListener('click', this.handleMenuClick);
    document.addEventListener('pointerdown', this.handleDocumentPointerDown);
    document.addEventListener('keydown', this.handleKeydown);
    if (this.overlay) {
      this.overlay.addEventListener('click', this.handleOverlayClick);
    }
  }

  destroy() {
    this.toggle.removeEventListener('click', this.handleToggleClick);
    this.menu.removeEventListener('click', this.handleMenuClick);
    document.removeEventListener('pointerdown', this.handleDocumentPointerDown);
    document.removeEventListener('keydown', this.handleKeydown);
    if (this.overlay) {
      this.overlay.removeEventListener('click', this.handleOverlayClick);
      if (this.overlay.dataset.generated === 'true') {
        this.overlay.remove();
      }
    }
  }

  handleToggleClick(event) {
    event.preventDefault();
    event.stopPropagation();
    this.toggleMenu();
  }

  handleDocumentPointerDown(event) {
    if (!this.isOpen) return;
    if (this.menu.contains(event.target) || this.toggle.contains(event.target)) return;
    this.close();
  }

  handleKeydown(event) {
    if (!this.isOpen) {
      if (event.key === 'Escape' && document.activeElement === this.toggle) {
        this.toggle.blur();
      }
      return;
    }

    if (event.key === 'Escape') {
      this.close();
      return;
    }

    if (event.key === 'Tab' && this.options.trapFocus) {
      this.trapFocus(event);
    }
  }

  handleMenuClick(event) {
    if (!this.options.closeOnNavigate) return;
    const target = event.target.closest('a, button, [data-mobile-menu-close]');
    if (!target) return;
    if (target.hasAttribute('data-mobile-menu-keep-open')) return;
    this.close();
  }

  handleOverlayClick(event) {
    if (event.target === this.overlay) {
      this.close();
    }
  }

  toggleMenu() {
    this.isOpen ? this.close() : this.open();
  }

  open() {
    if (this.isOpen) return;
    this.isOpen = true;
    this.lastFocused = document.activeElement;

    this.toggle.setAttribute('aria-expanded', 'true');
    this.toggle.classList.add(this.options.activeToggleClass);
    this.animateIcon(true);
    this.showMenu();
    this.showOverlay();
    document.body.classList.add(this.options.bodyLockClass);
    document.body.style.overflow = 'hidden';

    const focusTarget = this.getFocusableElements()[0];
    if (focusTarget) {
      focusTarget.focus({ preventScroll: true });
    } else {
      this.menu.focus({ preventScroll: true });
    }
  }

  close() {
    if (!this.isOpen) return;
    this.isOpen = false;

    this.toggle.setAttribute('aria-expanded', 'false');
    this.toggle.classList.remove(this.options.activeToggleClass);
    this.animateIcon(false);
    this.hideMenu();
    this.hideOverlay();
    document.body.classList.remove(this.options.bodyLockClass);
    document.body.style.overflow = '';

    if (this.lastFocused) {
      this.lastFocused.focus({ preventScroll: true });
    } else {
      this.toggle.focus({ preventScroll: true });
    }
  }

  showMenu() {
    applyClassList(this.menu, this.options.hiddenClass, 'remove');
    this.updateMenuState('opening');
    this.nextFrame(() => this.updateMenuState('open'));
  }

  hideMenu() {
    this.updateMenuState('closing');
    clearTimeout(this.animationTimer);
    this.animationTimer = setTimeout(() => {
      if (this.isOpen) return;
      applyClassList(this.menu, this.options.hiddenClass, 'add');
      this.updateMenuState('closed');
    }, this.options.animationDuration);
  }

  showOverlay() {
    if (!this.overlay) return;
    this.overlay.classList.add(OVERLAY_VISIBLE_CLASS);
    this.overlay.setAttribute('aria-hidden', 'false');
  }

  hideOverlay() {
    if (!this.overlay) return;
    this.overlay.classList.remove(OVERLAY_VISIBLE_CLASS);
    this.overlay.setAttribute('aria-hidden', 'true');
  }

  trapFocus(event) {
    const focusable = this.getFocusableElements();
    if (!focusable.length) {
      event.preventDefault();
      this.menu.focus({ preventScroll: true });
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  getFocusableElements() {
    return Array.from(this.menu.querySelectorAll(FOCUSABLE_SELECTOR)).filter(
      (el) => !el.hasAttribute('disabled') && el.getAttribute('aria-hidden') !== 'true'
    );
  }

  nextFrame(callback) {
    requestAnimationFrame(() => requestAnimationFrame(callback));
  }

  animateIcon(isOpen) {
    if (!this.icon) return;
    if (this.icon.classList.contains('fa-bars')) {
      this.icon.classList.toggle('fa-bars', !isOpen);
      this.icon.classList.toggle('fa-times', isOpen);
    }
  }

  updateMenuState(state) {
    this.menu.setAttribute('data-mobile-menu-state', state);
    if (state === 'open') {
      this.menu.setAttribute('data-state', 'open');
    } else if (state === 'closed') {
      this.menu.setAttribute('data-state', 'closed');
    }
    this.menu.setAttribute('aria-hidden', state === 'open' ? 'false' : 'true');
  }

  menuIsHidden() {
    return this.options.hiddenClass
      .split(/\s+/)
      .filter(Boolean)
      .some((cls) => this.menu.classList.contains(cls));
  }
}

function ensureStylesInjected() {
  if (document.getElementById(STYLE_TAG_ID)) return;
  const styleTag = document.createElement('style');
  styleTag.id = STYLE_TAG_ID;
  styleTag.textContent = `
    [data-mobile-menu-state] {
      transition: transform 0.24s cubic-bezier(0.18, 0.89, 0.32, 1.28), opacity 0.24s ease;
      transform-origin: top center;
      will-change: transform, opacity;
    }
    [data-mobile-menu-state='opening'] {
      opacity: 0;
      transform: translateY(-8px) scale(0.99);
    }
    [data-mobile-menu-state='open'] {
      opacity: 1;
      transform: translateY(0) scale(1);
      pointer-events: auto;
    }
    [data-mobile-menu-state='closing'] {
      opacity: 0;
      transform: translateY(-6px) scale(0.99);
      pointer-events: none;
    }
    [data-mobile-menu-state='closed'] {
      opacity: 0;
      transform: translateY(-4px);
      pointer-events: none;
    }
    .${OVERLAY_BASE_CLASS} {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.45);
      backdrop-filter: blur(2px);
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.2s ease, visibility 0.2s ease;
      z-index: 40;
    }
    .${OVERLAY_VISIBLE_CLASS} {
      opacity: 1;
      visibility: visible;
    }
    body.${DEFAULT_CONFIG.bodyLockClass} {
      touch-action: none;
      overscroll-behavior: contain;
    }
    .${TOGGLE_ICON_CLASS} {
      transition: transform 0.28s cubic-bezier(0.18, 0.89, 0.32, 1.28);
    }
    .${DEFAULT_CONFIG.activeToggleClass} .${TOGGLE_ICON_CLASS} {
      transform: rotate(90deg) scale(0.85);
    }
  `;
  document.head.appendChild(styleTag);
}

export function initMobileMenu(userConfig = {}) {
  const config = { ...DEFAULT_CONFIG, ...userConfig };
  const toggle = resolveElement(config.toggleSelector);
  const menu = resolveElement(config.menuSelector);

  if (!toggle || !menu) {
    if (import.meta?.env?.DEV) {
      console.warn('[mobile-menu] Toggle or menu element not found', config);
    }
    return null;
  }

  if (toggle.dataset.mobileMenuBound === 'true') {
    return toggle.__mobileMenuInstance;
  }

  const controller = new MobileMenuController(toggle, menu, config);
  controller.init();

  toggle.dataset.mobileMenuBound = 'true';
  toggle.__mobileMenuInstance = controller;
  menu.dataset.mobileMenuInit = 'true';

  return controller;
}

export function destroyMobileMenu(toggle) {
  const controller = toggle?.__mobileMenuInstance;
  if (controller) {
    controller.destroy();
    delete toggle.__mobileMenuInstance;
    toggle.dataset.mobileMenuBound = 'false';
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    const autoToggle = document.querySelector(DEFAULT_CONFIG.toggleSelector);
    const autoMenu = document.querySelector(DEFAULT_CONFIG.menuSelector);
    if (autoToggle && autoMenu && autoToggle.dataset.mobileMenuAuto !== 'false') {
      initMobileMenu();
    }
  });
}

const STYLE_ID = 'vizom-feedback-styles';
const OVERLAY_ID = 'vizom-loading-overlay';
const HEADING_ID = 'vizom-loading-heading';
const MESSAGE_ID = 'vizom-loading-message';
const TOAST_CONTAINER_ID = 'vizom-toast-container';
const MAX_TOASTS = 4;

let overlayEl = null;
let overlayHeadingEl = null;
let overlayMessageEl = null;
let overlayCounter = 0;

function ensureStylesInjected() {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    #${OVERLAY_ID} {
      position: fixed;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      background: rgba(15, 23, 42, 0.55);
      backdrop-filter: blur(6px);
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.2s ease;
      transform: scale(0.98);
    }
    #${OVERLAY_ID}.active {
      opacity: 1;
      transform: scale(1);
      pointer-events: all;
    }
    #${OVERLAY_ID} .vizom-spinner {
      width: 56px;
      height: 56px;
      border-radius: 999px;
      border: 4px solid rgba(255, 255, 255, 0.25);
      border-top-color: #60a5fa;
      animation: vizom-spin 1s linear infinite;
      box-shadow: 0 0 18px rgba(96, 165, 250, 0.35);
    }
    #${OVERLAY_ID} .vizom-loading-heading {
      font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      color: #f8fafc;
      font-size: 1.05rem;
      font-weight: 600;
      text-align: center;
    }
    #${OVERLAY_ID} .vizom-loading-message {
      font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      color: #f8fafc;
      font-size: 0.95rem;
      font-weight: 500;
      text-align: center;
      max-width: 320px;
      line-height: 1.5;
    }
    #${TOAST_CONTAINER_ID} {
      position: fixed;
      inset-inline-end: 1.5rem;
      inset-block-end: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      z-index: 9999;
    }
    .vizom-toast {
      min-width: 240px;
      max-width: 360px;
      padding: 0.85rem 1.1rem;
      border-radius: 0.9rem;
      background: #0f172a;
      color: #f8fafc;
      font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 0.9rem;
      font-weight: 500;
      box-shadow: 0 25px 60px -25px rgba(15, 23, 42, 0.65);
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      transform: translateY(16px);
      opacity: 0;
      transition: opacity 0.25s ease, transform 0.25s ease;
    }
    .vizom-toast.show {
      opacity: 1;
      transform: translateY(0);
    }
    .vizom-toast svg {
      flex-shrink: 0;
      width: 1rem;
      height: 1rem;
    }
    .vizom-toast[data-type='success'] {
      background: linear-gradient(135deg, #22c55e, #15803d);
    }
    .vizom-toast[data-type='error'] {
      background: linear-gradient(135deg, #f87171, #b91c1c);
    }
    .vizom-toast[data-type='warning'] {
      background: linear-gradient(135deg, #fb923c, #c2410c);
    }
    .vizom-toast[data-type='info'] {
      background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    }
    @keyframes vizom-spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    @media (prefers-reduced-motion: reduce) {
      #${OVERLAY_ID} {
        transition: none;
        transform: none;
      }
      #${OVERLAY_ID} .vizom-spinner {
        animation: none;
      }
    }
    @media (max-width: 640px) {
      #${TOAST_CONTAINER_ID} {
        inset-inline: 0.75rem;
        inset-block-end: 1rem;
      }
    }
  `;
  document.head.appendChild(style);
}

function ensureOverlay() {
  if (overlayEl) return;
  overlayEl = document.createElement('div');
  overlayEl.id = OVERLAY_ID;
  overlayEl.setAttribute('role', 'status');
  overlayEl.setAttribute('aria-live', 'polite');
  overlayEl.innerHTML = `
    <div class="vizom-spinner" aria-hidden="true"></div>
    <p id="${HEADING_ID}" class="vizom-loading-heading"></p>
    <p id="${MESSAGE_ID}" class="vizom-loading-message"></p>
  `;
  document.body.appendChild(overlayEl);
  overlayHeadingEl = overlayEl.querySelector(`#${HEADING_ID}`);
  overlayMessageEl = overlayEl.querySelector(`#${MESSAGE_ID}`);
  overlayEl.addEventListener('click', () => {
    hideLoading(true);
  });
}

function ensureToastContainer() {
  let container = document.getElementById(TOAST_CONTAINER_ID);
  if (!container) {
    container = document.createElement('div');
    container.id = TOAST_CONTAINER_ID;
    container.setAttribute('aria-live', 'polite');
    document.body.appendChild(container);
  }
  return container;
}

export function showLoading(message = 'Подождите, операция выполняется...', heading = 'Выполняем действие') {
  ensureStylesInjected();
  ensureOverlay();
  overlayCounter += 1;
  if (overlayHeadingEl) {
    overlayHeadingEl.textContent = heading;
  }
  if (overlayMessageEl) {
    overlayMessageEl.textContent = message;
  }
  requestAnimationFrame(() => {
    overlayEl?.classList.add('active');
  });
}

export function hideLoading(force = false) {
  if (!overlayEl) return;
  overlayCounter = force ? 0 : Math.max(overlayCounter - 1, 0);
  if (overlayCounter === 0) {
    overlayEl.classList.remove('active');
  }
}

const ICONS = {
  success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 13l4 4L19 7"/></svg>',
  error: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 18L18 6M6 6l12 12"/></svg>',
  warning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 9v4m0 4h.01"/><path d="M10.29 3.86L1.82 18a1 1 0 00.86 1.5h18.64a1 1 0 00.86-1.5L13.71 3.86a1 1 0 00-1.72 0z"/></svg>',
  info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 16h-1v-4h-1"/><path d="M12 7h.01"/><circle cx="12" cy="12" r="10"/></svg>'
};

export function showToast(message, type = 'info', options = {}) {
  ensureStylesInjected();
  const container = ensureToastContainer();
  const duration = options.duration ?? 3200;
  while (container.children.length >= MAX_TOASTS) {
    container.firstChild?.remove();
  }
  const toast = document.createElement('div');
  toast.className = 'vizom-toast';
  toast.dataset.type = type;
  toast.innerHTML = `
    <span class="vizom-toast-icon">${ICONS[type] || ICONS.info}</span>
    <span>${message}</span>
  `;
  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));

  const timeout = setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 250);
  }, duration);

  toast.addEventListener('pointerdown', () => {
    clearTimeout(timeout);
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 150);
  }, { once: true });
}

if (typeof window !== 'undefined') {
  window.uiFeedback = {
    showLoading,
    hideLoading,
    showToast,
  };
}

export default { showLoading, hideLoading, showToast };

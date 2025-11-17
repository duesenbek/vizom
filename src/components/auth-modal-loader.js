let authModalPromise = null;

const injectAuthModal = async () => {
  if (typeof document === 'undefined') {
    return null;
  }

  const existing = document.getElementById('auth-modal');
  if (existing) {
    return existing;
  }

  try {
    const response = await fetch('/auth-modal.html', { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`Failed to fetch auth modal: ${response.status}`);
    }

    const html = await response.text();
    const template = document.createElement('template');
    template.innerHTML = html.trim();
    const modal = template.content.firstElementChild;

    if (!modal) {
      throw new Error('Auth modal template is empty');
    }

    document.body.appendChild(modal);
    return modal;
  } catch (error) {
    console.error('[auth-modal-loader] Unable to inject auth modal', error);
    throw error;
  }
};

export const ensureAuthModal = async () => {
  if (typeof window === 'undefined') {
    return null;
  }

  if (document.getElementById('auth-modal')) {
    return document.getElementById('auth-modal');
  }

  if (!authModalPromise) {
    authModalPromise = injectAuthModal().catch((error) => {
      authModalPromise = null;
      throw error;
    });
  }

  return authModalPromise;
};

const autoInit = () => {
  if (typeof document === 'undefined') {
    return;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      ensureAuthModal().catch(() => {
        /* handled in ensureAuthModal */
      });
    });
  } else {
    ensureAuthModal().catch(() => {
      /* handled in ensureAuthModal */
    });
  }
};

autoInit();

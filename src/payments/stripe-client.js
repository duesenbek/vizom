import { supabase } from '../supabase-client.js';

const DEFAULT_STRIPE_PK = 'pk_test_51SPiae7vKdbErsb8SNV40Epd8l7dfUaKl86sAP7RCKk6RXUj1rSOqHgylnICv77QfLWnwaSz4q2TmFtFGzrWhE1A002opWUCV';
const CHECKOUT_ENDPOINT = '/.netlify/functions/create-checkout-session';
const WATCH_AD_ENDPOINT = '/.netlify/functions/watch-ad';

let stripeInstancePromise = null;
let listenersBound = false;

function resolvePublishableKey() {
  if (typeof window !== 'undefined' && window.__VIZOM_ENV__?.STRIPE_PUBLISHABLE_KEY) {
    return window.__VIZOM_ENV__.STRIPE_PUBLISHABLE_KEY;
  }

  if (typeof process !== 'undefined' && process.env?.STRIPE_PUBLISHABLE_KEY) {
    return process.env.STRIPE_PUBLISHABLE_KEY;
  }

  return DEFAULT_STRIPE_PK;
}

function ensureStripeScript() {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Stripe cannot load outside the browser.'));
  }

  if (window.Stripe) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const existing = document.querySelector('script[src="https://js.stripe.com/v3"]');
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', reject, { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Stripe.js'));
    document.head.appendChild(script);
  });
}

async function getStripe() {
  if (!stripeInstancePromise) {
    stripeInstancePromise = ensureStripeScript()
      .then(() => {
        const publishableKey = resolvePublishableKey();
        if (!publishableKey) {
          throw new Error('Stripe publishable key is not configured.');
        }
        return window.Stripe(publishableKey);
      })
      .catch((error) => {
        console.error('Stripe initialization failed:', error);
        stripeInstancePromise = null;
        throw error;
      });
  }

  return stripeInstancePromise;
}

async function getAccessToken() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token ?? null;
  } catch (error) {
    console.warn('Unable to fetch Supabase session:', error);
    return null;
  }
}

async function startCheckout(plan = 'pro') {
  try {
    const stripe = await getStripe();
    const token = await getAccessToken();

    const response = await fetch(CHECKOUT_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ plan }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || 'Failed to start checkout');
    }

    const payload = await response.json();
    if (payload?.url) {
      window.location.assign(payload.url);
    } else {
      throw new Error('Checkout session URL missing');
    }
  } catch (error) {
    console.error('Checkout error:', error);
    alert('Unable to start checkout. Please try again later.');
  }
}

async function notifyAdWatched() {
  try {
    const token = await getAccessToken();
    const response = await fetch(WATCH_AD_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ action: 'watch-ad' }),
    });

    if (!response.ok) {
      throw new Error('Failed to record ad watch');
    }

    const payload = await response.json().catch(() => ({}));
    if (payload?.message) {
      console.info(payload.message);
    }
  } catch (error) {
    console.warn('Ad watch tracking failed:', error);
  }
}

function bindUpgradeButtons(root = document) {
  const scope = root || document;
  scope.querySelectorAll('[data-action="upgrade-pro"]').forEach((btn) => {
    if (btn.dataset.upgradeBound === 'true') return;
    btn.dataset.upgradeBound = 'true';
    btn.addEventListener('click', (event) => {
      event.preventDefault();
      startCheckout('pro');
    });
  });
}

function bindGlobalListeners() {
  if (listenersBound) return;
  listenersBound = true;

  document.addEventListener('billing:upgrade', () => startCheckout('pro'));
  document.addEventListener('billing:watchAd', notifyAdWatched);

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      mutation.addedNodes.forEach((node) => {
        if (node instanceof HTMLElement) {
          bindUpgradeButtons(node);
        }
      });
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
  bindUpgradeButtons();
}

if (typeof document !== 'undefined') {
  bindGlobalListeners();
}

export {
  startCheckout,
  notifyAdWatched,
  bindUpgradeButtons,
};

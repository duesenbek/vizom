import { supabase } from '../supabase-client.js';

const DEFAULT_STRIPE_PK = 'pk_test_51SPiae7vKdbErsb8SNV40Epd8l7dfUaKl86sAP7RCKk6RXUj1rSOqHgylnICv77QfLWnwaSz4q2TmFtFGzrWhE1A002opWUCV';

function resolveCheckoutEndpoint() {
  // Prefer Supabase Edge Functions if configured
  try {
    const env = (typeof window !== 'undefined' && window.__VIZOM_ENV__) ? window.__VIZOM_ENV__ : {};
    if (env.EDGE_FUNCTIONS_BASE) {
      return env.EDGE_FUNCTIONS_BASE.replace(/\/$/, '') + '/create-checkout-session';
    }
  } catch {}
  // Local dev proxy for Supabase functions
  if (typeof window !== 'undefined') {
    const supabaseFunctions = '/functions/v1/create-checkout-session';
    // If site is served with Supabase functions proxy, this will work
    return supabaseFunctions;
  }
  // Fallback to Netlify function (legacy)
  return '/.netlify/functions/create-checkout-session';
}

const CHECKOUT_ENDPOINT = resolveCheckoutEndpoint();
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

// Stripe Payment Links (pre-configured in Stripe Dashboard)
// Create these at: https://dashboard.stripe.com/payment-links
// 1. Go to Stripe Dashboard > Products > Payment Links
// 2. Create a payment link for Pro Monthly ($2.99/mo)
// 3. Create a payment link for Pro Yearly ($28.68/year = $2.39/mo)
// 4. Replace the URLs below with your actual payment links
const PAYMENT_LINKS = {
  // TODO: Replace with your actual Stripe Payment Links
  pro: process.env.STRIPE_PAYMENT_LINK_MONTHLY || 'https://buy.stripe.com/test_placeholder',
  pro_yearly: process.env.STRIPE_PAYMENT_LINK_YEARLY || 'https://buy.stripe.com/test_placeholder',
};

// Check if payment links are configured
function isPaymentConfigured() {
  return PAYMENT_LINKS.pro && !PAYMENT_LINKS.pro.includes('placeholder');
}

async function startCheckout(plan = 'pro') {
  try {
    // First try server-side checkout (production)
    const token = await getAccessToken();
    
    // Check if we're in production with Netlify functions
    const isProduction = window.location.hostname !== 'localhost' && 
                         window.location.hostname !== '127.0.0.1';
    
    if (isProduction) {
      // Try server-side checkout
      try {
        const response = await fetch(CHECKOUT_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ plan }),
        });

        if (response.ok) {
          const payload = await response.json();
          if (payload?.url) {
            window.location.assign(payload.url);
            return;
          }
        }
      } catch (serverError) {
        console.warn('Server checkout failed, falling back to payment link:', serverError);
      }
    }
    
    // Fallback: Use Stripe Payment Links (works without server)
    if (!isPaymentConfigured()) {
      // Payment not configured - show contact modal
      console.warn('Stripe Payment Links not configured. Please set up payment links in Stripe Dashboard.');
      showUpgradeModal();
      return;
    }
    
    const paymentLink = PAYMENT_LINKS[plan] || PAYMENT_LINKS.pro;
    
    // Show info toast
    if (typeof window !== 'undefined' && window.uiFeedback?.showToast) {
      window.uiFeedback.showToast('Redirecting to Stripe checkout...', 'info');
    }
    
    // Get user email for prefill
    const email = await getUserEmail();
    
    // Build redirect URL
    let redirectUrl = paymentLink;
    if (email) {
      redirectUrl += `?prefilled_email=${encodeURIComponent(email)}`;
    }
    
    // Redirect to Stripe Payment Link
    window.location.href = redirectUrl;
    
  } catch (error) {
    console.error('Checkout error:', error);
    
    // Final fallback: show manual upgrade instructions
    if (typeof window !== 'undefined') {
      const modal = document.getElementById('upgrade-modal');
      if (modal) {
        modal.classList.remove('hidden');
      } else if (window.uiFeedback?.showToast) {
        window.uiFeedback.showToast('Please contact billing@vizom.com to upgrade.', 'info');
      }
    }
  }
}

async function getUserEmail() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.user?.email || '';
  } catch {
    return '';
  }
}

function showUpgradeModal() {
  // Try to show the upgrade modal
  const modal = document.getElementById('upgrade-modal');
  if (modal) {
    modal.classList.remove('hidden');
    return;
  }
  
  // Create a simple modal if none exists
  const modalHtml = `
    <div id="stripe-upgrade-modal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div class="bg-white rounded-2xl p-8 max-w-md mx-4 shadow-2xl">
        <div class="text-center">
          <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="fas fa-gem text-white text-2xl"></i>
          </div>
          <h3 class="text-xl font-bold text-slate-900 mb-2">Upgrade to Pro</h3>
          <p class="text-slate-600 mb-6">Contact us to upgrade your account and unlock all premium features.</p>
          <div class="space-y-3">
            <a href="mailto:billing@vizom.com?subject=Upgrade to Pro" 
               class="block w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-600 transition">
              <i class="fas fa-envelope mr-2"></i>Email billing@vizom.com
            </a>
            <button onclick="document.getElementById('stripe-upgrade-modal').remove()" 
                    class="block w-full py-3 px-4 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', modalHtml);
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

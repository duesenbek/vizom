/**
 * Universal Analytics Module (Plausible, Umami, Google Analytics)
 * - Works on the client (browser)
 * - Provider selection via env (Vite):
 *   ENABLE_ANALYTICS=true
 *   PLAUSIBLE_DOMAIN, PLAUSIBLE_SCRIPT_URL (default https://plausible.io/js/script.js)
 *   UMAMI_WEBSITE_ID, UMAMI_SCRIPT_URL (default https://umami.is/script.js)
 *   GA_TRACKING_ID (e.g., G-XXXXXXXXXX)
 */

const ENV = {
  ENABLE_ANALYTICS: toBool(import.meta.env.ENABLE_ANALYTICS ?? import.meta.env.VITE_ENABLE_ANALYTICS ?? true),
  PROVIDER: (import.meta.env.VITE_ANALYTICS_PROVIDER || '').toLowerCase(), // 'plausible' | 'umami' | 'ga' | 'none'
  PLAUSIBLE_DOMAIN: import.meta.env.PLAUSIBLE_DOMAIN ?? import.meta.env.VITE_PLAUSIBLE_DOMAIN,
  PLAUSIBLE_SCRIPT_URL: import.meta.env.PLAUSIBLE_SCRIPT_URL ?? 'https://plausible.io/js/script.js',
  UMAMI_WEBSITE_ID: import.meta.env.UMAMI_WEBSITE_ID ?? import.meta.env.VITE_UMAMI_WEBSITE_ID,
  UMAMI_SCRIPT_URL: import.meta.env.UMAMI_SCRIPT_URL ?? 'https://umami.is/script.js',
  GA_TRACKING_ID: import.meta.env.GA_TRACKING_ID ?? import.meta.env.VITE_GA_TRACKING_ID,
};

function toBool(v) {
  if (typeof v === 'boolean') return v;
  if (typeof v === 'string') return v.toLowerCase() === 'true';
  return !!v;
}

const state = {
  initialized: false,
  provider: null, // 'plausible' | 'umami' | 'ga'
};

function insertScript({ src, async = true, defer = true, attrs = {} }) {
  return new Promise((resolve, reject) => {
    if (!src) return resolve(false);
    const id = `analytics-${btoa(src).replace(/=/g, '')}`;
    if (document.getElementById(id)) return resolve(true);
    const s = document.createElement('script');
    s.id = id;
    s.src = src;
    s.async = async;
    s.defer = defer;
    Object.entries(attrs).forEach(([k, v]) => { if (v != null) s.setAttribute(k, String(v)); });
    s.onload = () => resolve(true);
    s.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(s);
  });
}

async function initPlausible() {
  if (!ENV.PLAUSIBLE_DOMAIN) return false;
  await insertScript({
    src: ENV.PLAUSIBLE_SCRIPT_URL,
    attrs: { 'data-domain': ENV.PLAUSIBLE_DOMAIN }
  });
  state.provider = 'plausible';
  return true;
}

async function initUmami() {
  if (!ENV.UMAMI_WEBSITE_ID) return false;
  await insertScript({
    src: ENV.UMAMI_SCRIPT_URL,
    attrs: { 'data-website-id': ENV.UMAMI_WEBSITE_ID }
  });
  state.provider = 'umami';
  return true;
}

async function initGA() {
  if (!ENV.GA_TRACKING_ID) return false;
  await insertScript({ src: `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ENV.GA_TRACKING_ID)}` });
  window.dataLayer = window.dataLayer || [];
  function gtag(){ window.dataLayer.push(arguments); }
  // @ts-ignore
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', ENV.GA_TRACKING_ID);
  state.provider = 'ga';
  return true;
}

export async function initializeAnalytics(preferred = ['plausible', 'umami', 'ga']) {
  if (state.initialized) return state.provider;
  // Respect Do Not Track
  const dnt = (navigator.doNotTrack === '1' || window.doNotTrack === '1' || navigator.msDoNotTrack === '1');
  if (dnt) {
    state.initialized = true;
    state.provider = null;
    return null;
  }
  if (!ENV.ENABLE_ANALYTICS || ENV.PROVIDER === 'none') {
    state.initialized = true;
    state.provider = null;
    return null;
  }
  // If provider is forced by env, try only that one first
  let order = Array.isArray(preferred) ? preferred : ['plausible', 'umami', 'ga'];
  if (ENV.PROVIDER && ['plausible','umami','ga'].includes(ENV.PROVIDER)) {
    order = [ENV.PROVIDER];
  }
  for (const p of order) {
    try {
      if (p === 'plausible' && await initPlausible()) break;
      if (p === 'umami' && await initUmami()) break;
      if (p === 'ga' && await initGA()) break;
    } catch (_) {/* ignore and try next */}
  }
  state.initialized = true;
  return state.provider;
}

export function trackPageview(url = location.href, title = document.title) {
  if (!ENV.ENABLE_ANALYTICS || !state.initialized) return false;
  try {
    if (state.provider === 'plausible' && window.plausible) {
      window.plausible('pageview', { u: url });
      return true;
    }
    if (state.provider === 'umami' && window.umami) {
      // Umami v2
      if (typeof window.umami.track === 'function') {
        window.umami.track('pageview', { url, title });
      } else if (typeof window.umami === 'function') {
        window.umami('pageview', { url, title });
      }
      return true;
    }
    if (state.provider === 'ga' && typeof window.gtag === 'function') {
      window.gtag('event', 'page_view', { page_location: url, page_title: title });
      return true;
    }
  } catch (_) { /* noop */ }
  return false;
}

export function trackEvent(name, params = {}) {
  if (!ENV.ENABLE_ANALYTICS || !state.initialized) return false;
  try {
    if (state.provider === 'plausible' && window.plausible) {
      window.plausible(name, { props: params });
      return true;
    }
    if (state.provider === 'umami' && window.umami) {
      if (typeof window.umami.track === 'function') {
        window.umami.track(name, params);
      } else if (typeof window.umami === 'function') {
        window.umami(name, params);
      }
      return true;
    }
    if (state.provider === 'ga' && typeof window.gtag === 'function') {
      window.gtag('event', name, params);
      return true;
    }
  } catch (_) { /* noop */ }
  return false;
}

export function setUser(userId) {
  if (!ENV.ENABLE_ANALYTICS || !state.initialized) return false;
  try {
    if (state.provider === 'ga' && typeof window.gtag === 'function') {
      window.gtag('set', { user_id: userId });
      return true;
    }
    // Plausible/Umami typically anonymized; skip unless custom setup
  } catch (_) { /* noop */ }
  return false;
}

// Auto-init and pageview (safe)
try {
  initializeAnalytics().then(() => {
    try { trackPageview(); } catch (_) {}
  });
} catch (_) {}

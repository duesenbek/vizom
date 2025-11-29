import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const warnMissingConfig = () => {
  if (typeof console !== 'undefined') {
    console.warn('[Supabase] Missing SUPABASE_URL/SUPABASE_ANON_KEY. Auth features are disabled.');
  }
};

const resolveConfig = () => {
  if (typeof window !== 'undefined' && window.__VIZOM_ENV__) {
    const { SUPABASE_URL, SUPABASE_ANON_KEY } = window.__VIZOM_ENV__;
    if (SUPABASE_URL && SUPABASE_ANON_KEY) {
      return { url: SUPABASE_URL, key: SUPABASE_ANON_KEY };
    }
  }

  const envUrl = typeof process !== 'undefined' ? process.env?.SUPABASE_URL : undefined;
  const envKey = typeof process !== 'undefined' ? process.env?.SUPABASE_ANON_KEY : undefined;

  if (envUrl && envKey) {
    return { url: envUrl, key: envKey };
  }

  warnMissingConfig();
  return null;
};

const config = resolveConfig();

export const supabase = config
  ? createClient(config.url, config.key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        storageKey: 'vizom-auth',
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
        detectSessionInUrl: true,
        flowType: 'pkce',
      },
    })
  : null;

if (supabase) {
  supabase.auth.onAuthStateChange((event, session) => {
    console.log('[Supabase] Auth state changed:', event, session?.user?.email || 'no user');
  });
}

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const FALLBACK_URL = 'https://poptvesywntelmtbrige.supabase.co';
const FALLBACK_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvcHR2ZXN5d250ZWxtdGJyaWdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyNTU3NDEsImV4cCI6MjA3NzgzMTc0MX0.ZxFabOvBxy6l2CoGXcuxZeoZzge_BYw7V33mlbpKp2U';

const resolveConfig = () => {
  if (typeof window !== 'undefined' && window.__VIZOM_ENV__) {
    const { SUPABASE_URL, SUPABASE_ANON_KEY } = window.__VIZOM_ENV__;
    if (SUPABASE_URL && SUPABASE_ANON_KEY) {
      return { url: SUPABASE_URL, key: SUPABASE_ANON_KEY };
    }
  }

  const envUrl = typeof process !== 'undefined' ? process.env?.SUPABASE_URL : undefined;
  const envKey = typeof process !== 'undefined' ? process.env?.SUPABASE_ANON_KEY : undefined;

  return {
    url: envUrl || FALLBACK_URL,
    key: envKey || FALLBACK_KEY,
  };
};

const { url: supabaseUrl, key: supabaseKey } = resolveConfig();

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storageKey: 'vizom-auth',
    storage: window.localStorage,
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
});

// Debug: log auth state
supabase.auth.onAuthStateChange((event, session) => {
  console.log('[Supabase] Auth state changed:', event, session?.user?.email || 'no user');
});

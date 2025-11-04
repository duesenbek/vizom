import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
const DAILY_FREE_LIMIT = Number(process.env.DAILY_FREE_LIMIT || 5);

const supabase = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : null;

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

async function getUserFromRequest(event) {
  if (!supabase) return null;
  const authHeader = event.headers.authorization || event.headers.Authorization;
  if (!authHeader?.startsWith('Bearer ')) return null;
  const token = authHeader.slice(7);

  try {
    const { data, error } = await supabase.auth.getUser(token);
    if (error) throw error;
    return data?.user || null;
  } catch (error) {
    console.warn('Supabase auth error:', error);
    return null;
  }
}

async function ensureProfile(userId, email) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw error;
  }

  if (!data) {
    const { data: inserted, error: insertError } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        email,
        subscription_plan: 'free',
        daily_generations: 0,
        last_generation_date: todayISO(),
        ads_enabled: true,
      })
      .select()
      .single();

    if (insertError) throw insertError;
    return inserted;
  }

  return data;
}

function buildResponse(payload, statusCode = 200) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify(payload),
  };
}

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return buildResponse({ error: 'Method Not Allowed' }, 405);
  }

  if (!supabase) {
    return buildResponse({
      allowed: true,
      showBanner: false,
      shouldShowAd: false,
      message: 'Quota service not configured; unlimited mode.',
    });
  }

  try {
    const user = await getUserFromRequest(event);

    if (!user) {
      return buildResponse({
        allowed: true,
        showBanner: false,
        shouldShowAd: false,
        remaining: null,
        message: 'Guest user - quota not enforced.',
      });
    }

    const profile = await ensureProfile(user.id, user.email);
    const isPro = profile.subscription_plan === 'pro';
    const today = todayISO();
    let dailyGenerations = profile.daily_generations || 0;
    let lastDate = profile.last_generation_date || today;

    if (lastDate !== today) {
      dailyGenerations = 0;
      lastDate = today;
    }

    if (isPro) {
      if (dailyGenerations !== profile.daily_generations || lastDate !== profile.last_generation_date) {
        await supabase
          .from('profiles')
          .update({ daily_generations: dailyGenerations, last_generation_date: lastDate })
          .eq('id', user.id);
      }

      return buildResponse({
        allowed: true,
        remaining: null,
        showBanner: false,
        shouldShowAd: false,
        bannerText: null,
      });
    }

    const nextCount = dailyGenerations + 1;
    const remaining = Math.max(DAILY_FREE_LIMIT - nextCount, 0);
    const shouldShowAd = nextCount > DAILY_FREE_LIMIT;
    const allowed = !shouldShowAd;

    if (allowed) {
      await supabase
        .from('profiles')
        .update({
          daily_generations: nextCount,
          last_generation_date: lastDate,
        })
        .eq('id', user.id);
    }

    const bannerText = allowed
      ? `You have ${remaining} generations left today.`
      : 'You reached the free daily limit. Watch an ad or upgrade to Pro for unlimited access.';

    return buildResponse({
      allowed,
      remaining,
      showBanner: true,
      shouldShowAd,
      canWatchAd: true,
      bannerText,
    });
  } catch (error) {
    console.error('Quota check error:', error);
    return buildResponse({
      allowed: true,
      showBanner: false,
      shouldShowAd: false,
      message: 'Quota service unavailable; proceeding without limits.',
    }, 200);
  }
};

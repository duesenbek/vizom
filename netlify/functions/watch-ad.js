import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
const BONUS_GENERATIONS = Number(process.env.AD_BONUS_GENERATIONS || 1);

const supabase = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : null;

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

async function getUser(event) {
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
    return buildResponse({ message: 'Ad tracking disabled; no quota adjustments.' });
  }

  try {
    const user = await getUser(event);
    if (!user) {
      return buildResponse({ message: 'Guest users do not earn bonus generations.' });
    }

    const today = new Date().toISOString().slice(0, 10);
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      throw error;
    }

    const updated = {
      daily_generations: Math.max((profile.daily_generations || 0) - BONUS_GENERATIONS, 0),
      last_generation_date: today,
    };

    await supabase
      .from('profiles')
      .update(updated)
      .eq('id', user.id);

    return buildResponse({ message: 'Ad watched, bonus applied.', bonus: BONUS_GENERATIONS });
  } catch (error) {
    console.error('Ad watch error:', error);
    return buildResponse({ error: 'Failed to record ad watch' }, 500);
  }
};

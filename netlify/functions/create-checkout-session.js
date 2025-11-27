import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

// Price IDs for different billing periods
const PRICE_IDS = {
  monthly: process.env.STRIPE_PRICE_ID_MONTHLY || process.env.STRIPE_PRICE_ID,
  yearly: process.env.STRIPE_PRICE_ID_YEARLY || process.env.STRIPE_PRICE_ID
};

const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;
const supabase = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

export const handler = async (event) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  if (!stripe) {
    console.error('Stripe not configured - missing STRIPE_SECRET_KEY');
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Payment system not configured' })
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const billingPeriod = body.billingPeriod || 'monthly';
    const priceId = PRICE_IDS[billingPeriod] || PRICE_IDS.monthly;

    if (!priceId) {
      console.error('No price ID configured for billing period:', billingPeriod);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Price not configured' })
      };
    }

    // Get user ID from auth header if available
    let userId = null;
    let userEmail = null;
    if (supabase) {
      const authHeader = event.headers.authorization || event.headers.Authorization;
      if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.slice(7);
        const { data, error } = await supabase.auth.getUser(token);
        if (!error && data?.user) {
          userId = data.user.id;
          userEmail = data.user.email;
        }
      }
    }

    const baseUrl = process.env.URL || process.env.DEPLOY_URL || 'https://vizom.netlify.app';
    
    const sessionConfig = {
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        userId: userId || 'anonymous',
        billingPeriod,
      },
      allow_promotion_codes: true,
      success_url: `${baseUrl}/generator.html?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/pricing.html?payment=cancelled`,
    };

    // Pre-fill email if we have it
    if (userEmail) {
      sessionConfig.customer_email = userEmail;
    }

    console.log('Creating checkout session:', { billingPeriod, priceId, userId });
    const session = await stripe.checkout.sessions.create(sessionConfig);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ url: session.url, sessionId: session.id }),
    };
  } catch (error) {
    console.error('Checkout session error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message || 'Failed to create checkout session' })
    };
  }
};

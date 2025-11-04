import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
const priceId = process.env.STRIPE_PRICE_ID;

const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;
const supabase = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  if (!stripe || !priceId) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Stripe server not configured' })
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const plan = body.plan || 'pro';

    let userId = null;
    if (supabase) {
      const authHeader = event.headers.authorization || event.headers.Authorization;
      if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.slice(7);
        const { data, error } = await supabase.auth.getUser(token);
        if (!error) {
          userId = data?.user?.id || null;
        }
      }
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        userId: userId || 'unknown',
        plan,
      },
      allow_promotion_codes: true,
      success_url: `${process.env.SUCCESS_URL || 'https://vizom.netlify.app'}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CANCEL_URL || 'https://vizom.netlify.app'}/billing/cancel`,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ url: session.url }),
    };
  } catch (error) {
    console.error('Checkout session error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to create checkout session' })
    };
  }
};

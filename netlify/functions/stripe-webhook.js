import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;
const supabase = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
      
      
      
    })
  : null;

function buildResponse(body, statusCode = 200) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  };
}

async function ensureProfile(userId, email) {
  if (!supabase || !userId) return null;

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
        ads_enabled: true,
        daily_generations: 0,
      })
      .select()
      .single();

    if (insertError) throw insertError;
    return inserted;
  }

  return data;
}

async function setProStatus(userId, customerId, subscriptionId, email) {
  if (!supabase || !userId) return;

  await ensureProfile(userId, email);

  await supabase
    .from('profiles')
    .update({
      subscription_plan: 'pro',
      ads_enabled: false,
      stripe_customer_id: customerId,
      stripe_subscription_id: subscriptionId,
    })
    .eq('id', userId);
}

async function setFreeStatusByCustomer(customerId, subscriptionId, isActive) {
  if (!supabase || !customerId) return;

  const { data: profiles } = await supabase
    .from('profiles')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .limit(1);

  if (!profiles?.length) return;

  const userId = profiles[0].id;

  await supabase
    .from('profiles')
    .update({
      subscription_plan: isActive ? 'pro' : 'free',
      ads_enabled: !isActive,
      stripe_subscription_id: subscriptionId,
    })
    .eq('id', userId);
}

async function handleCheckoutCompleted(session) {
  const userId = session.metadata?.userId || null;
  await setProStatus(
    userId,
    session.customer,
    session.subscription,
    session.customer_details?.email || null
  );
}

async function handleSubscriptionEvent(subscription, isActive) {
  await setFreeStatusByCustomer(
    subscription.customer,
    subscription.id,
    isActive
  );
}

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return buildResponse({ error: 'Method Not Allowed' }, 405);
  }

  if (!stripe || !webhookSecret) {
    console.error('Stripe webhook not configured');
    return buildResponse({ error: 'Webhook not configured' }, 500);
  }

  const signature = event.headers['stripe-signature'];
  if (!signature) {
    return buildResponse({ error: 'Missing stripe-signature header' }, 400);
  }

  let stripeEvent;

  try {
    stripeEvent = stripe.webhooks.constructEvent(
      event.body,
      signature,
      webhookSecret
    );
  } catch (error) {
    console.error('Stripe signature verification failed:', error.message);
    return buildResponse({ error: 'Invalid signature' }, 400);
  }

  try {
    switch (stripeEvent.type) {
      case 'checkout.session.completed': {
        await handleCheckoutCompleted(stripeEvent.data.object);
        break;
      }
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = stripeEvent.data.object;
        const isActive = ['active', 'trialing'].includes(subscription.status);
        await handleSubscriptionEvent(subscription, isActive);
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = stripeEvent.data.object;
        await handleSubscriptionEvent(subscription, false);
        break;
      }
      default:
        console.log(`Unhandled event type ${stripeEvent.type}`);
    }

    return buildResponse({ received: true });
  } catch (error) {
    console.error('Webhook handling error:', error);
    return buildResponse({ error: 'Webhook handling failed' }, 500);
  }
};

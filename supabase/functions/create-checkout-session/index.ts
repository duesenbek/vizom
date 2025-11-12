// Supabase Edge Function: create-checkout-session
// Creates a Stripe Checkout Session for $2.99/mo subscription and returns session URL
// Env vars required: STRIPE_SECRET_KEY, PRICE_ID_PRO, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY

// deno-lint-ignore-file no-explicit-any
import Stripe from "npm:stripe@12.18.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const stripeSecret = Deno.env.get("STRIPE_SECRET_KEY");
const priceId = Deno.env.get("PRICE_ID_PRO");
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

if (!stripeSecret) {
  throw new Error("STRIPE_SECRET_KEY is not set");
}
if (!priceId) {
  console.warn("PRICE_ID_PRO is not set. Please configure Stripe price ID for $2.99/mo plan.");
}
if (!supabaseUrl || !serviceRoleKey) {
  console.warn("SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing. Profile updates via webhook will require these.");
}

const stripe = new Stripe(stripeSecret, { apiVersion: "2023-10-16" });
const supabaseAdmin = createClient(supabaseUrl!, serviceRoleKey!);

function getOrigin(req: Request): string {
  const hdr = req.headers.get("origin");
  if (hdr) return hdr;
  try { return new URL(req.url).origin; } catch { return "http://localhost:54321"; }
}

async function getUserFromAuthHeader(req: Request) {
  const auth = req.headers.get("authorization") || req.headers.get("Authorization");
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) return null;
  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error) return null;
  return data.user;
}

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const user = await getUserFromAuthHeader(req);
    const { plan } = await req.json().catch(() => ({ plan: "pro" }));
    const origin = getOrigin(req);

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      success_url: `${origin}/pricing.html?success=1`,
      cancel_url: `${origin}/pricing.html?canceled=1`,
      line_items: priceId ? [{ price: priceId, quantity: 1 }] : [],
      // Fallback: create price inline if PRICE_ID_PRO missing (not recommended for prod)
      ...(priceId ? {} : { line_items: [{ price_data: { currency: "usd", product_data: { name: "Vizom Pro" }, recurring: { interval: "month" }, unit_amount: 299 }, quantity: 1 }] }),
      customer_creation: "if_required",
      customer_email: user?.email || undefined,
      client_reference_id: user?.id || undefined,
      metadata: { user_id: user?.id || "anon", plan: plan || "pro" },
      allow_promotion_codes: true,
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (e) {
    console.error("checkout error", e);
    return new Response(String(e?.message || "Checkout error"), { status: 500 });
  }
});

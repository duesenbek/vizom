// Supabase Edge Function: stripe-webhook
// Verifies Stripe webhook signatures and updates profiles.subscription to 'pro'
// Required env: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY

// deno-lint-ignore-file no-explicit-any
import Stripe from "npm:stripe@12.18.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const stripeSecret = Deno.env.get("STRIPE_SECRET_KEY");
const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

if (!stripeSecret || !webhookSecret) {
  throw new Error("Missing Stripe secrets");
}

const stripe = new Stripe(stripeSecret, { apiVersion: "2023-10-16" });
const supabaseAdmin = createClient(supabaseUrl!, serviceRoleKey!);

async function text(req: Request) {
  const buf = await req.arrayBuffer();
  const decoder = new TextDecoder("utf-8");
  return decoder.decode(buf);
}

async function setPro(userId: string) {
  if (!userId) return;
  await supabaseAdmin.from("profiles").upsert({ id: userId, subscription: "pro" }, { onConflict: "id" });
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405 });

  const sig = req.headers.get("Stripe-Signature");
  if (!sig) return new Response("Missing signature", { status: 400 });

  try {
    const payload = await text(req);
    const event = stripe.webhooks.constructEvent(payload, sig, webhookSecret);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as any;
        const userId = session?.client_reference_id || session?.metadata?.user_id;
        await setPro(userId);
        break;
      }
      case "customer.subscription.updated":
      case "customer.subscription.created": {
        const sub = event.data.object as any;
        const userId = sub?.metadata?.user_id;
        if (sub?.status === "active" || sub?.status === "trialing") {
          await setPro(userId);
        }
        break;
      }
      case "customer.subscription.deleted": {
        const sub = event.data.object as any;
        const userId = sub?.metadata?.user_id;
        if (userId) {
          await supabaseAdmin.from("profiles").update({ subscription: "free" }).eq("id", userId);
        }
        break;
      }
      default:
        // Ignore other events
        break;
    }

    return new Response(JSON.stringify({ received: true }), { headers: { "Content-Type": "application/json" } });
  } catch (e) {
    console.error("webhook error", e);
    return new Response("Webhook Error", { status: 400 });
  }
});

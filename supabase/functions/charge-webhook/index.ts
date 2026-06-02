import Stripe from "https://esm.sh/stripe@17.7.0?target=deno";
import { createClient } from "https://esm.sh/v2/@supabase/supabase-js@2.0.0";

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405, headers: { Allow: "POST" } });
  }

  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return new Response("Missing stripe-signature header", { status: 400 });
  }

  const body = await req.text();
  const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "");
  const cryptoProvider = Stripe.createSubtleCryptoProvider();

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      sig,
      Deno.env.get("STRIPE_WEBHOOK_SECRET") || "",
      undefined,
      cryptoProvider
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Webhook verification failed:", msg);
    return new Response(`Webhook verification failed: ${msg}`, { status: 400 });
  }

  if (event.type !== "payment_intent.succeeded") {
    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  const intent = event.data.object as Stripe.PaymentIntent;
  const { classId, userId, children } = intent.metadata ?? {};

  if (!classId || !userId || !children) {
    console.error("Missing metadata on PaymentIntent", intent.id, { classId, userId, children });
    return new Response("Missing required metadata", { status: 400 });
  }

  const childIds = children.split(",").map((id) => id.trim()).filter(Boolean);
  if (childIds.length === 0) {
    console.error("No valid child IDs in metadata:", children);
    return new Response("No valid child IDs", { status: 400 });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") || "",
    Deno.env.get("SECRET_KEY") || ""
  );

  const rows = childIds.map((childId) => ({
    class_id: Number(classId),
    user_id: userId,
    child_id: Number(childId),
    charge_id: intent.id,
  }));

  // Upsert is idempotent against Stripe webhook retries: if the same payment_intent.succeeded
  // fires twice, the conflict on (class_id, user_id, child_id) silently skips the duplicate.
  const { error } = await supabase
    .from("Class_User_Child")
    .upsert(rows, { onConflict: "class_id,user_id,child_id", ignoreDuplicates: true });

  if (error) {
    console.error("Failed to insert enrollment:", error);
    return new Response("Failed to record enrollment", { status: 500 });
  }

  return new Response(JSON.stringify({ received: true, enrolled: childIds.length }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});

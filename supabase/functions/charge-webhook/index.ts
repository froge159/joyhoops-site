import Stripe from "https://esm.sh/stripe?target=deno";
import { createClient } from "https://esm.sh/v2/@supabase/supabase-js@2.0.0";

const ALLOWED_ORIGIN = "https://joyhoops.org";
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
  "Access-Control-Allow-Methods": "POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, apiKey, x-client-info",
};


Deno.serve(async (req)=>{
   if (req.method === "OPTIONS") {
     return new Response(null, {
       status: 204,
       headers: { ...CORS_HEADERS, "Access-Control-Max-Age": "3600" },
     });
   }
  if (req.method !== "POST") {
    // return CORS headers too so the caller (and Stripe UI) sees the response
    return new Response("Method Not Allowed", {
      status: 405,
      headers: { Allow: "POST, OPTIONS", ...CORS_HEADERS },
    });
  }
  const stripe = Stripe(Deno.env.get("STRIPE_SECRET_KEY"));
  const supabase = createClient(Deno.env.get("SUPABASE_URL"), Deno.env.get("SECRET_KEY"));
  const sig = req.headers.get("stripe-signature");
  const rawBody = await req.text();
  let event;
  try {
    event = await stripe.webhooks.constructEventAsync(rawBody, sig, Deno.env.get("STRIPE_WEBHOOK_SECRET"));
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error("signature verification failed:", errorMessage);
    return new Response(`Webhook signature verification failed: ${errorMessage}`, {
      status: 400,
      headers: { ...CORS_HEADERS, "Access-Control-Max-Age": "3600" }
    });
  }
  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    const paymentIntentId = paymentIntent.id;
    const { classId, userId, children } = paymentIntent.metadata;

    if (!classId || !userId || !children) {
      console.error("Missing payment metadata:", {
        classId,
        userId,
        children
      });
      return new Response("Missing payment metadata", {
        status: 400,
        headers: { ...CORS_HEADERS, "Access-Control-Max-Age": "3600" }
      });
    }

    const childIds = children.split(",").map((childId) => childId.trim()).filter(Boolean);
    if (!childIds.length) {
      console.error("Empty children metadata:", children);
      return new Response("Missing child IDs", {
        status: 400,
        headers: { ...CORS_HEADERS, "Access-Control-Max-Age": "3600" }
      });
    }

    const rows = childIds.map((childId) => ({
      class_id: classId,
      user_id: userId,
      child_id: childId,
      charge_id: paymentIntentId
    }));
    const { error } = await supabase.from("Class_User_Child").upsert(rows, {
      onConflict: "class_id,user_id,child_id,charge_id",
      ignoreDuplicates: true
    });
    if (error) {
      console.error("Supabase upsert error:", error);
      return new Response("Error inserting class enrollment into Supabase", {
        status: 500
      });
    }
    return new Response(JSON.stringify({
      message: "Enrollment successful - user charged"
    }), {
      headers: { ...CORS_HEADERS, "Access-Control-Max-Age": "3600" }
    });
  }
  return new Response("Event ignored", {
    status: 200,
    headers: { ...CORS_HEADERS, "Access-Control-Max-Age": "3600" }
  });
});

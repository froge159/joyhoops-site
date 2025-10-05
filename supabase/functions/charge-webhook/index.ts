import Stripe from "https://esm.sh/stripe?target=deno";
import { createClient } from "https://esm.sh/v2/@supabase/supabase-js@2.0.0";

Deno.serve(async (req)=>{
  console.log("serving the request with supabase/functions/charge-webhook");
  const stripe = Stripe(Deno.env.get("STRIPE_SECRET_KEY"));
  const supabase = createClient(Deno.env.get("URL"), Deno.env.get("SERVICE_ROLE_KEY"));
  const sig = req.headers.get("stripe-signature");
  const rawBody = await req.text();
  let event;
  try {
    event = await stripe.webhooks.constructEventAsync(rawBody, sig, Deno.env.get("STRIPE_WEBHOOK_SECRET"));
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error("signature verification failed:", errorMessage);
    return new Response(`Webhook signature verification failed: ${errorMessage}`, {
      status: 400
    });
  }
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    console.log("Checkout session:", JSON.stringify(session, null, 2));
    const paymentIntentId = session.payment_intent;
    const { classId, userId, children } = session.metadata;

    for (const child_id of children.split(",")){
      const { error } = await supabase.from("Class_User_Child").insert({
        class_id:classId,
        user_id:userId,
        child_id:child_id,
        charge_id: paymentIntentId
      });
      if (error) {
        console.error("Supabase insert error:", error);
        return new Response("Error inserting class enrollment into Supabase", {
          status: 500
        });
      }
    }
    return new Response(JSON.stringify({
      message: "Enrollment successful - user charged"
    }));
  }
  return new Response("Event ignored", {
    status: 200
  });
});

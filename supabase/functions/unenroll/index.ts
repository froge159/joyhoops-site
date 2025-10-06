import Stripe from "https://esm.sh/stripe?target=deno";
import { createClient } from "https://esm.sh/v2/@supabase/supabase-js@2.0.0";
Deno.serve(async (req) => {
  const stripe = Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "");
  const supabase = createClient(Deno.env.get("URL"), Deno.env.get("SERVICE_ROLE_KEY"));
  let body;
  try {
    body = await req.json();
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({
      error: errorMessage
    }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
  const { class_id, user_id, children } = body;
  if (!Array.isArray(children) || children.length === 0) {
    console.error("No children provided in request body");
    return new Response(JSON.stringify({
      error: "No children provided"
    }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json' 
      }
    });
  }
  try {
    // get class price once
    const { data: price_data, error: price_error } = await supabase.from("Class").select("price_id").eq("id", class_id).single();
    if (price_error || !price_data) {
      console.error("Supabase select error:", price_error);
      return new Response(JSON.stringify({ error: "Error retrieving class price from Supabase" }), {
        status: 500
      });
    }
    const price = await stripe.prices.retrieve(price_data.price_id);

    const results = [];
    for (const child_id of children) {
      // REFUND
      const { data: charge_data, error: charge_error } = await supabase.from("Class_User_Child").select("charge_id").eq("class_id", class_id).eq("user_id", user_id).eq("child_id", child_id).single();
      if (charge_error || !charge_data) {
        console.error("Supabase select error:", charge_error);
        results.push({ child_id, error: "Error retrieving charge ID from Supabase" });
        continue;
      }
      const paymentIntent = await stripe.paymentIntents.retrieve(charge_data.charge_id, {
        expand: ["charges"]
      });
      const chargeId = paymentIntent.latest_charge;
      if (!chargeId) {
        console.error("No charge found for PaymentIntent:", JSON.stringify(paymentIntent, null, 2));
        results.push({ child_id, error: "No charge found for this PaymentIntent" });
        continue;
      }
      try {
        await stripe.refunds.create({
          charge: chargeId,
          amount: price.unit_amount,
          reason: "requested_by_customer"
        });
      } catch (refundErr) {
        console.error("Stripe refund error:", refundErr);
        results.push({ child_id, error: "Error creating refund in Stripe" });
        continue;
      }
      // REMOVE FROM TABLE
      const { error } = await supabase.from("Class_User_Child").delete().eq("class_id", class_id).eq("user_id", user_id).eq("child_id", child_id);
      if (error) {
        console.error("Supabase delete error:", error);
        results.push({ child_id, error: "Error deleting class enrollment from Supabase" });
        continue;
      }
      results.push({ child_id, message: "Refund and unenroll successful" });
    }
    return new Response(JSON.stringify({
      results
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error("General error:", errorMessage);
    return new Response(JSON.stringify({
      error: errorMessage
    }), {
      headers: {
        "Content-Type": "application/json"
      },
      status: 500
    });
  }
});
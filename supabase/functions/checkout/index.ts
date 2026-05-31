import Stripe from "https://esm.sh/stripe?target=deno";
import { createClient } from "https://esm.sh/v2/@supabase/supabase-js@2.0.0";

const ALLOWED_ORIGIN = "https://joyhoops.org";
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
  "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-client-info, apiKey",
};

Deno.serve(async (req)=>{
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: { ...CORS_HEADERS, "Access-Control-Max-Age": "3600" },
    });
  }
  const stripe = Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "");
  const supabase = createClient(Deno.env.get("SUPABASE_URL"), Deno.env.get("SECRET_KEY"));
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
        'Content-Type': 'application/json',
        ...CORS_HEADERS,
        "Access-Control-Max-Age": "3600"
      }
    });
  }
  const { classId, userId, childIds } = body;
  try {
    const { data: price_data, error: price_error } = await supabase.from("Class").select("price_id").eq("id", classId).single();
    if (price_error || !price_data) {
      console.error("Supabase select error:", price_error);
      return new Response(JSON.stringify({
        error: "Error retrieving class price from Supabase"
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...CORS_HEADERS,
          "Access-Control-Max-Age": "3600"
        }
      });
    }
    const session = await stripe.checkout.sessions.create({
      // CHANGE THIS LATER
      success_url: `${Deno.env.get("FRONTEND_URL")}/user-home`,
      // CHANGE THIS LATER
      mode: "payment",
      line_items: [
        {
          price: price_data.price_id,
          quantity: childIds.length
        }
      ],
      currency: "usd",
      ui_mode: "hosted",
      metadata: {
        classId,
        userId,
        children: childIds.join(",")
      },
      payment_intent_data: {
        metadata: {
          classId,
          userId,
          children: childIds.join(",")
        }
      }
    });
    return new Response(JSON.stringify({
      message: 'Checkout session created successfully',
      url: session.url
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...CORS_HEADERS,
        "Access-Control-Max-Age": "3600"
      }
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({
      error: errorMessage
    }), {
      headers: {
        "Content-Type": "application/json",
        ...CORS_HEADERS,
        "Access-Control-Max-Age": "3600"
      },
      status: 500
    });
  }
});

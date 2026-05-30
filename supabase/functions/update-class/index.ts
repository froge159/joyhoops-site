import Stripe from "https://esm.sh/stripe?target=deno";
import { createClient } from "https://esm.sh/v2/@supabase/supabase-js@2.0.0";
Deno.serve(async (req)=>{
  const stripe = Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "");
  const supabase = createClient(Deno.env.get("SUPABASE_URL"), Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"));
  let body;
  try {
    body = await req.json();
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  const updatedPayload = body;
  const allowedFields = [
    "start_datetime",
    "end_datetime",
    "location",
    "name",
    "description",
    "active",
    "price"
  ];
  const stripeAllowedFields = [
    "name",
    "description",
    "active",
  ];
  const filteredPayload: { [key: string]: any } = {};
  const filteredStripePayload: { [key: string]: any } = {};
  for (const key of allowedFields){
    if (key in updatedPayload) {
      filteredPayload[key] = updatedPayload[key];
      if (key in stripeAllowedFields) {
        filteredStripePayload[key] = updatedPayload[key];
      }
    }
  }
  const { data: product_id, error: productIdError } = await supabase.from("Class").select("product_id").eq("id", updatedPayload.id).single();
  if (productIdError) {
    console.error('failed to get product id:', productIdError);
    return new Response(JSON.stringify({ error: productIdError.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  try {
    if (updatedPayload.price) {
      const stripePrice = await stripe.prices.create({
        product: product_id.product_id,
        unit_amount: updatedPayload.price * 100,
        currency: "usd"
      });
      filteredStripePayload['default_price'] = stripePrice.id;
      filteredPayload['price_id'] = stripePrice.id;
    }
    const product = await stripe.products.update(product_id.product_id, filteredStripePayload);
    const { data, error } = await supabase.from("Class").update(filteredPayload).eq("id", updatedPayload.id).select();
    if (error) {
      console.error('Supabase update error:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    if (!data || data.length === 0) {
      return new Response(JSON.stringify({ error: 'Class not found or no changes made' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    return new Response(JSON.stringify({
      message: 'Class updated successfully',
      data: data[0]
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { "Content-Type": "application/json" },
      status: 500
    });
  }
});

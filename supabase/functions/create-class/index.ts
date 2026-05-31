import Stripe from "https://esm.sh/stripe?target=deno";
import { createClient } from "https://esm.sh/v2/@supabase/supabase-js@2.0.0";
Deno.serve(async (req)=>{
  const stripe = Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "");
  const supabase = createClient(Deno.env.get("SUPABASE_URL"), Deno.env.get("SECRET_KEY"));
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
  const { id, startDatetime, endDatetime, location, name, description, active, price } = body;
  try {
    const product = await stripe.products.create({ name, description, active });
    const stripePrice = await stripe.prices.create({
      product: product.id,
      unit_amount: price * 100,
      currency: "usd"
    });
    const { error: classError } = await supabase.from("Class").insert({
      start_datetime: new Date(startDatetime).toISOString(),
      end_datetime: new Date(endDatetime).toISOString(),
      location,
      name,
      description,
      active,
      price,
      product_id: product.id,
      price_id: stripePrice.id,
      id
    }).select().single();
    if (classError) {
      console.error("Supabase insert error:", classError);
      return new Response("Error inserting class into Supabase", { status: 500 });
    }
    return new Response(JSON.stringify({
      message: "Class created",
      product_id: product.id
    }), {
      headers: { "Content-Type": "application/json" },
      status: 201
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { "Content-Type": "application/json" },
      status: 500
    });
  }
});

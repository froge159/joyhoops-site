import Stripe from "https://esm.sh/stripe?target=deno";
import { createClient } from "https://esm.sh/v2/@supabase/supabase-js@2.0.0";
Deno.serve(async (req)=>{
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
        "Content-Type": "application/json"
      }
    });
  }
  const { id } = body;
  if (!id) {
    return new Response(JSON.stringify({
      error: "Missing class id"
    }), {
      status: 400,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
  const supabase = createClient(Deno.env.get("SUPABASE_URL"), Deno.env.get("SECRET_KEY"));
  const stripe = Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "");
  try {
    // Get the class to retrieve product_id
    const { data: classData, error: fetchError } = await supabase.from("Class").select("id, product_id").eq("id", id).single();
    if (fetchError || !classData) {
      return new Response(JSON.stringify({
        error: "Class not found"
      }), {
        status: 404,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
    // Archive Stripe product after deactivating user-created prices
    if (classData.product_id) {
      try {
        let hasMore = true;
        let startingAfter: string | undefined;
        while (hasMore) {
          const prices = await stripe.prices.list({
            product: classData.product_id,
            limit: 100,
            starting_after: startingAfter
          });
          if (prices?.data?.length) {
            await Promise.all(prices.data.map((price) => stripe.prices.update(price.id, {
              active: false
            })));
            startingAfter = prices.data[prices.data.length - 1]?.id;
          }
          hasMore = prices.has_more;
        }
        await stripe.products.update(classData.product_id, {
          active: false
        });
      } catch (stripeErr) {
        // Log Stripe error but continue with Supabase deletion
        console.error("Stripe product archive error:", stripeErr);
      }
    }
    // Delete class from Supabase
    const { data, error } = await supabase.from("Class").delete().eq("id", id).select();
    if (error) {
      console.error("Supabase delete error:", error);
      return new Response(JSON.stringify({
        error: error.message
      }), {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
    return new Response(JSON.stringify({
      success: true,
      deletedClass: data?.[0] || null
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({
      error: errorMessage
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
});

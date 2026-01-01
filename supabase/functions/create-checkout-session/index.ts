/// <reference path="../_shared/types.ts" />
// Edge Function para criar sessão de pagamento Stripe
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@12.0.0?target=deno';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.53.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-08-16',
});

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // SECURITY: Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Autenticação necessária' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // Create Supabase client with user's auth token
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_ANON_KEY') || '',
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
        global: {
          headers: {
            Authorization: authHeader,
          },
        },
      }
    );

    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error('Auth error:', authError);
      return new Response(JSON.stringify({ error: 'Usuário não autenticado' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // SECURITY: Validate prices server-side using the database function
    const { data: validatedItems, error: validationError } = await supabase
      .rpc('validate_checkout_session', { p_user_id: user.id });

    if (validationError) {
      console.error('Validation error:', validationError);
      return new Response(JSON.stringify({ error: 'Erro ao validar carrinho' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    if (!validatedItems || validatedItems.length === 0) {
      return new Response(JSON.stringify({ error: 'Carrinho vazio' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // Check all items are valid
    const invalidItems = validatedItems.filter((item: any) => !item.valid);
    if (invalidItems.length > 0) {
      return new Response(JSON.stringify({ 
        error: 'Alguns produtos não estão mais disponíveis',
        invalidItems 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // Build Stripe line items from validated server-side prices
    const lineItems = validatedItems.map((item: any) => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.product_title,
        },
        unit_amount: Math.round(parseFloat(item.unit_price) * 100), // Convert to cents
      },
      quantity: item.quantity,
    }));

    // Create Stripe checkout session with validated prices
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: 'https://keepla.pt/sucesso',
      cancel_url: 'https://keepla.pt/erro',
      client_reference_id: user.id, // Track which user made the purchase
      metadata: {
        user_id: user.id,
      },
    });

    return new Response(JSON.stringify({ id: session.id }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });

  } catch (error) {
    console.error('Erro Stripe:', error);
    return new Response(JSON.stringify({ error: 'Erro interno' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
});
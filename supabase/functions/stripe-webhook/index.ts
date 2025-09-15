import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14.21.0'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
})

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

const cryptoProvider = Stripe.createSubtleCryptoProvider()

serve(async (request) => {
  const signature = request.headers.get('Stripe-Signature')
  const body = await request.text()
  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')

  if (!signature || !webhookSecret) {
    return new Response('Webhook signature verification failed', { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      webhookSecret,
      undefined,
      cryptoProvider
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return new Response('Webhook signature verification failed', { status: 400 })
  }

  console.log('Received event:', event.type)

  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionChange(subscription)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionCancellation(subscription)
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        await handlePaymentSucceeded(invoice)
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        await handlePaymentFailed(invoice)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return new Response('Webhook processing failed', { status: 500 })
  }
})

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string
  const subscriptionId = subscription.id
  const status = subscription.status
  const currentPeriodStart = new Date(subscription.current_period_start * 1000)
  const currentPeriodEnd = new Date(subscription.current_period_end * 1000)
  
  // Determinar o plano baseado no price_id
  const priceId = subscription.items.data[0]?.price.id
  let planType = 'free'
  
  // Mapear price_ids para tipos de plano
  const pricePlansMap: Record<string, string> = {
    // Adicionar os price_ids reais do Stripe aqui
    'price_premium_monthly': 'premium',
    'price_premium_yearly': 'premium',
    'price_family_monthly': 'family',
    'price_family_yearly': 'family',
  }
  
  if (priceId && pricePlansMap[priceId]) {
    planType = pricePlansMap[priceId]
  }

  // Buscar usuário pelo customer_id do Stripe
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single()

  if (profileError || !profile) {
    console.error('User not found for customer:', customerId)
    return
  }

  // Atualizar ou inserir dados da assinatura
  const { error: upsertError } = await supabase
    .from('user_subscriptions')
    .upsert({
      user_id: profile.id,
      stripe_subscription_id: subscriptionId,
      stripe_customer_id: customerId,
      plan_type: planType,
      status: status,
      current_period_start: currentPeriodStart.toISOString(),
      current_period_end: currentPeriodEnd.toISOString(),
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'user_id'
    })

  if (upsertError) {
    console.error('Error upserting subscription:', upsertError)
    throw upsertError
  }

  // Atualizar perfil do usuário
  const { error: profileUpdateError } = await supabase
    .from('profiles')
    .update({
      subscription_plan: planType,
      subscription_status: status,
      updated_at: new Date().toISOString()
    })
    .eq('id', profile.id)

  if (profileUpdateError) {
    console.error('Error updating profile:', profileUpdateError)
    throw profileUpdateError
  }

  console.log(`Subscription ${status} for user ${profile.id}, plan: ${planType}`)
}

async function handleSubscriptionCancellation(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string
  const subscriptionId = subscription.id

  // Buscar usuário pelo customer_id do Stripe
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single()

  if (profileError || !profile) {
    console.error('User not found for customer:', customerId)
    return
  }

  // Atualizar status da assinatura para cancelada
  const { error: updateError } = await supabase
    .from('user_subscriptions')
    .update({
      status: 'canceled',
      canceled_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('stripe_subscription_id', subscriptionId)

  if (updateError) {
    console.error('Error updating canceled subscription:', updateError)
    throw updateError
  }

  // Reverter usuário para plano gratuito
  const { error: profileUpdateError } = await supabase
    .from('profiles')
    .update({
      subscription_plan: 'free',
      subscription_status: 'canceled',
      updated_at: new Date().toISOString()
    })
    .eq('id', profile.id)

  if (profileUpdateError) {
    console.error('Error updating profile to free plan:', profileUpdateError)
    throw profileUpdateError
  }

  console.log(`Subscription canceled for user ${profile.id}, reverted to free plan`)
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string
  const subscriptionId = invoice.subscription as string
  const amountPaid = invoice.amount_paid / 100 // Converter de centavos para reais

  // Buscar usuário pelo customer_id do Stripe
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single()

  if (profileError || !profile) {
    console.error('User not found for customer:', customerId)
    return
  }

  // Registrar pagamento bem-sucedido
  const { error: paymentError } = await supabase
    .from('payment_history')
    .insert({
      user_id: profile.id,
      stripe_invoice_id: invoice.id,
      stripe_subscription_id: subscriptionId,
      amount: amountPaid,
      currency: invoice.currency,
      status: 'succeeded',
      paid_at: new Date(invoice.status_transitions.paid_at! * 1000).toISOString(),
      created_at: new Date().toISOString()
    })

  if (paymentError) {
    console.error('Error recording payment:', paymentError)
    throw paymentError
  }

  // Atualizar status da assinatura para ativa
  const { error: subscriptionError } = await supabase
    .from('user_subscriptions')
    .update({
      status: 'active',
      updated_at: new Date().toISOString()
    })
    .eq('stripe_subscription_id', subscriptionId)

  if (subscriptionError) {
    console.error('Error updating subscription status:', subscriptionError)
    throw subscriptionError
  }

  console.log(`Payment succeeded for user ${profile.id}, amount: R$ ${amountPaid}`)
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string
  const subscriptionId = invoice.subscription as string
  const amountDue = invoice.amount_due / 100

  // Buscar usuário pelo customer_id do Stripe
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single()

  if (profileError || !profile) {
    console.error('User not found for customer:', customerId)
    return
  }

  // Registrar falha no pagamento
  const { error: paymentError } = await supabase
    .from('payment_history')
    .insert({
      user_id: profile.id,
      stripe_invoice_id: invoice.id,
      stripe_subscription_id: subscriptionId,
      amount: amountDue,
      currency: invoice.currency,
      status: 'failed',
      created_at: new Date().toISOString()
    })

  if (paymentError) {
    console.error('Error recording failed payment:', paymentError)
    throw paymentError
  }

  // Atualizar status da assinatura
  const { error: subscriptionError } = await supabase
    .from('user_subscriptions')
    .update({
      status: 'past_due',
      updated_at: new Date().toISOString()
    })
    .eq('stripe_subscription_id', subscriptionId)

  if (subscriptionError) {
    console.error('Error updating subscription status:', subscriptionError)
    throw subscriptionError
  }

  console.log(`Payment failed for user ${profile.id}, amount: R$ ${amountDue}`)
}
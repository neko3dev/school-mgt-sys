import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14.21.0'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
})

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

const cryptoProvider = Stripe.createSubtleCryptoProvider()

serve(async (req) => {
  const signature = req.headers.get('Stripe-Signature')
  const body = await req.text()
  
  let receivedEvent
  try {
    receivedEvent = await stripe.webhooks.constructEventAsync(
      body,
      signature!,
      Deno.env.get('STRIPE_WEBHOOK_SECRET')!,
      undefined,
      cryptoProvider
    )
  } catch (err) {
    console.log(`Webhook signature verification failed.`, err.message)
    return new Response(err.message, { status: 400 })
  }

  console.log(`🔔 Event received: ${receivedEvent.type}`)

  try {
    switch (receivedEvent.type) {
      case 'checkout.session.completed':
        const session = receivedEvent.data.object
        await handleCheckoutCompleted(session)
        break
        
      case 'customer.subscription.updated':
        const subscription = receivedEvent.data.object
        await handleSubscriptionUpdated(subscription)
        break
        
      case 'customer.subscription.deleted':
        const deletedSubscription = receivedEvent.data.object
        await handleSubscriptionDeleted(deletedSubscription)
        break
        
      case 'invoice.payment_succeeded':
        const invoice = receivedEvent.data.object
        await handlePaymentSucceeded(invoice)
        break
        
      case 'invoice.payment_failed':
        const failedInvoice = receivedEvent.data.object
        await handlePaymentFailed(failedInvoice)
        break
        
      default:
        console.log(`Unhandled event type: ${receivedEvent.type}`)
    }
  } catch (error) {
    console.error('Error processing webhook:', error)
    return new Response('Webhook processing failed', { status: 500 })
  }

  return new Response('ok', { status: 200 })
})

async function handleCheckoutCompleted(session: any) {
  const tenantId = session.metadata.tenant_id
  
  // Update subscription status
  await supabase
    .from('tenant_subscriptions')
    .update({
      status: 'active',
      stripe_subscription_id: session.subscription,
      stripe_customer_id: session.customer,
      current_period_start: new Date().toISOString(),
      current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    })
    .eq('tenant_id', tenantId)

  // Update tenant status
  await supabase
    .from('tenants')
    .update({ status: 'active' })
    .eq('id', tenantId)
}

async function handleSubscriptionUpdated(subscription: any) {
  await supabase
    .from('tenant_subscriptions')
    .update({
      status: subscription.status,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end
    })
    .eq('stripe_subscription_id', subscription.id)
}

async function handleSubscriptionDeleted(subscription: any) {
  await supabase
    .from('tenant_subscriptions')
    .update({ status: 'cancelled' })
    .eq('stripe_subscription_id', subscription.id)

  // Update tenant status
  const { data: tenantSub } = await supabase
    .from('tenant_subscriptions')
    .select('tenant_id')
    .eq('stripe_subscription_id', subscription.id)
    .single()

  if (tenantSub) {
    await supabase
      .from('tenants')
      .update({ status: 'cancelled' })
      .eq('id', tenantSub.tenant_id)
  }
}

async function handlePaymentSucceeded(invoice: any) {
  console.log('Payment succeeded for invoice:', invoice.id)
  // Handle successful payment logic
}

async function handlePaymentFailed(invoice: any) {
  console.log('Payment failed for invoice:', invoice.id)
  
  // Update subscription status to past_due
  await supabase
    .from('tenant_subscriptions')
    .update({ status: 'past_due' })
    .eq('stripe_customer_id', invoice.customer)
}
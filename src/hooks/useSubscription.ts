import { useState, useEffect } from 'react'
import { SubscriptionService } from '@/lib/supabase'
import { useAuth } from './useAuth'

export function useSubscription() {
  const { tenant, subscription } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createCheckoutSession = async (priceId: string) => {
    if (!tenant) throw new Error('No tenant selected')
    
    try {
      setLoading(true)
      setError(null)
      
      const session = await SubscriptionService.createCheckoutSession(priceId, tenant.id)
      
      // Redirect to Stripe Checkout
      if (session.url) {
        window.location.href = session.url
      }
      
      return session
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const openCustomerPortal = async () => {
    if (!subscription?.stripe_customer_id) throw new Error('No customer ID found')
    
    try {
      setLoading(true)
      setError(null)
      
      const session = await SubscriptionService.createPortalSession(subscription.stripe_customer_id)
      
      // Redirect to Stripe Customer Portal
      if (session.url) {
        window.location.href = session.url
      }
      
      return session
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const cancelSubscription = async () => {
    if (!subscription?.stripe_subscription_id) throw new Error('No subscription found')
    
    try {
      setLoading(true)
      setError(null)
      
      const result = await SubscriptionService.cancelSubscription(subscription.stripe_subscription_id)
      return result
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const getUsageStats = () => {
    // Calculate current usage against plan limits
    const plan = subscription?.plan
    if (!plan) return null

    return {
      students: {
        current: 0, // This would be fetched from actual data
        limit: plan.max_students,
        percentage: 0
      },
      staff: {
        current: 0,
        limit: plan.max_staff,
        percentage: 0
      }
    }
  }

  const getDaysUntilTrialEnd = () => {
    if (!subscription?.trial_end) return null
    
    const trialEnd = new Date(subscription.trial_end)
    const now = new Date()
    const diffTime = trialEnd.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    return Math.max(0, diffDays)
  }

  return {
    subscription,
    loading,
    error,
    createCheckoutSession,
    openCustomerPortal,
    cancelSubscription,
    getUsageStats,
    getDaysUntilTrialEnd,
    isTrial: subscription?.status === 'trialing',
    isActive: subscription?.status === 'active',
    isPastDue: subscription?.status === 'past_due',
    willCancelAtPeriodEnd: subscription?.cancel_at_period_end
  }
}
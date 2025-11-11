import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase, AuthService, DatabaseService } from '@/lib/supabase'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [tenant, setTenant] = useState<any>(null)
  const [subscription, setSubscription] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        loadUserTenant(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        if (session?.user) {
          await loadUserTenant(session.user.id)
        } else {
          setTenant(null)
          setSubscription(null)
          setLoading(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const loadUserTenant = async (userId: string) => {
    try {
      setLoading(true)

      // Get user's tenant relationship
      const { data: tenantUser } = await supabase
        .from('tenant_users')
        .select(`
          *,
          tenant:tenants(*)
        `)
        .eq('user_id', userId)
        .eq('is_active', true)
        .maybeSingle()

      if (tenantUser?.tenant) {
        setTenant(tenantUser.tenant)

        // Load subscription info
        try {
          const subscription = await DatabaseService.getSubscription(tenantUser.tenant.id)
          setSubscription(subscription)
        } catch (err) {
          console.warn('Failed to load subscription:', err)
        }
      }
    } catch (err) {
      console.error('Error loading tenant:', err)
      setError('Failed to load tenant information')
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, tenantData?: any) => {
    try {
      setError(null)
      const result = await AuthService.signUp(email, password, { full_name: tenantData?.ownerName })
      
      if (tenantData && result.user) {
        // Create tenant and link user
        const tenant = await DatabaseService.createTenant({
          ...tenantData,
          status: 'trial',
          trial_ends_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        })

        // Create tenant-user relationship
        await supabase
          .from('tenant_users')
          .insert({
            tenant_id: tenant.id,
            user_id: result.user.id,
            role: 'owner',
            is_active: true,
            joined_at: new Date().toISOString()
          })
      }
      
      return result
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      setError(null)
      return await AuthService.signIn(email, password)
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  const signOut = async () => {
    try {
      await AuthService.signOut()
      setUser(null)
      setTenant(null)
      setSubscription(null)
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  const updateProfile = async (updates: any) => {
    try {
      setError(null)
      return await AuthService.updateProfile(updates)
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  return {
    user,
    tenant,
    subscription,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    updateProfile,
    isAuthenticated: !!user,
    isTrial: subscription?.status === 'trialing',
    trialEndsAt: subscription?.trial_end,
    hasActiveSubscription: subscription?.status === 'active'
  }
}
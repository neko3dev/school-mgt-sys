import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useAuth } from '@/hooks/useAuth'
import { useSubscription } from '@/hooks/useSubscription'
import { formatCurrency } from '@/lib/utils'
import { 
  Crown, 
  Calendar, 
  Users, 
  CreditCard, 
  AlertTriangle,
  CheckCircle,
  Settings,
  ExternalLink,
  Clock,
  Star,
  Zap,
  Shield
} from 'lucide-react'

export function SubscriptionManager() {
  const { tenant, subscription } = useAuth()
  const { 
    createCheckoutSession, 
    openCustomerPortal, 
    cancelSubscription,
    getDaysUntilTrialEnd,
    getUsageStats,
    isTrial,
    isActive,
    isPastDue,
    willCancelAtPeriodEnd,
    loading
  } = useSubscription()

  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<any>(null)

  const daysUntilTrialEnd = getDaysUntilTrialEnd()
  const usageStats = getUsageStats()

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      price: 15000,
      priceId: 'price_starter_monthly',
      description: 'Perfect for small primary schools',
      maxStudents: 200,
      maxStaff: 20,
      features: [
        'Up to 200 students',
        'Basic CBC assessment',
        'M-PESA integration',
        'Standard reports',
        'Email support'
      ]
    },
    {
      id: 'professional',
      name: 'Professional',
      price: 35000,
      priceId: 'price_professional_monthly',
      description: 'Ideal for medium-sized schools',
      maxStudents: 800,
      maxStaff: 80,
      features: [
        'Up to 800 students',
        'Advanced CBC tools',
        'Full M-PESA integration',
        'All report types',
        'Transport management',
        'Priority support',
        'Analytics dashboard'
      ],
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 75000,
      priceId: 'price_enterprise_monthly',
      description: 'For large schools and institutions',
      maxStudents: null,
      maxStaff: null,
      features: [
        'Unlimited students',
        'Multi-campus support',
        'Custom integrations',
        'Dedicated support',
        'Training included',
        'SLA guarantee',
        'White-label options'
      ]
    }
  ]

  const handleUpgrade = async (plan: any) => {
    try {
      await createCheckoutSession(plan.priceId)
    } catch (error) {
      console.error('Upgrade failed:', error)
      alert('Failed to start upgrade process. Please try again.')
    }
  }

  const handleManageSubscription = async () => {
    try {
      await openCustomerPortal()
    } catch (error) {
      console.error('Portal access failed:', error)
      alert('Failed to open billing portal. Please contact support.')
    }
  }

  const handleCancelSubscription = async () => {
    if (confirm('Are you sure you want to cancel your subscription? You will lose access at the end of your billing period.')) {
      try {
        await cancelSubscription()
        alert('Subscription cancelled. You will retain access until the end of your billing period.')
      } catch (error) {
        console.error('Cancellation failed:', error)
        alert('Failed to cancel subscription. Please contact support.')
      }
    }
  }

  if (!tenant || !subscription) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <AlertTriangle className="h-8 w-8 text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600">No subscription information available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Current Subscription Status */}
      <Card className={`${isTrial ? 'border-orange-200 bg-orange-50' : isActive ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <Crown className={`h-5 w-5 ${isTrial ? 'text-orange-600' : isActive ? 'text-green-600' : 'text-red-600'}`} />
              <span>Current Plan: {subscription.plan?.name}</span>
            </span>
            <Badge variant={isTrial ? 'secondary' : isActive ? 'default' : 'destructive'}>
              {isTrial ? 'Trial' : subscription.status}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Monthly Cost</p>
              <p className="text-2xl font-bold">
                {isTrial ? 'Free' : formatCurrency(subscription.plan?.price_monthly || 0)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Billing Period</p>
              <p className="font-medium">
                {new Date(subscription.current_period_start).toLocaleDateString()} - {' '}
                {new Date(subscription.current_period_end).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">
                {isTrial ? 'Trial Ends' : 'Next Billing'}
              </p>
              <p className="font-medium">
                {isTrial && daysUntilTrialEnd !== null ? (
                  <span className={daysUntilTrialEnd <= 7 ? 'text-red-600' : 'text-orange-600'}>
                    {daysUntilTrialEnd} days remaining
                  </span>
                ) : (
                  new Date(subscription.current_period_end).toLocaleDateString()
                )}
              </p>
            </div>
          </div>

          {isTrial && daysUntilTrialEnd !== null && daysUntilTrialEnd <= 7 && (
            <div className="mt-4 p-4 bg-orange-100 border border-orange-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <span className="text-orange-800 font-medium">
                  Your trial expires in {daysUntilTrialEnd} days. Upgrade now to continue using the system.
                </span>
              </div>
            </div>
          )}

          <div className="mt-4 flex space-x-2">
            {isTrial ? (
              <Button onClick={() => setShowUpgradeDialog(true)} className="bg-green-600 hover:bg-green-700">
                <Crown className="h-4 w-4 mr-2" />
                Upgrade Now
              </Button>
            ) : (
              <Button variant="outline" onClick={handleManageSubscription}>
                <Settings className="h-4 w-4 mr-2" />
                Manage Subscription
              </Button>
            )}
            <Button variant="outline" onClick={() => setShowUpgradeDialog(true)}>
              <ExternalLink className="h-4 w-4 mr-2" />
              View Plans
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Usage Statistics */}
      {usageStats && (
        <Card>
          <CardHeader>
            <CardTitle>Usage Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Students</span>
                  <span>{usageStats.students.current} / {usageStats.students.limit || '∞'}</span>
                </div>
                <Progress value={usageStats.students.percentage} className="w-full" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Staff Members</span>
                  <span>{usageStats.staff.current} / {usageStats.staff.limit || '∞'}</span>
                </div>
                <Progress value={usageStats.staff.percentage} className="w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upgrade Dialog */}
      <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Choose Your Plan</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {plans.map((plan) => (
              <Card key={plan.id} className={`relative ${plan.popular ? 'border-blue-500 shadow-lg' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-500 text-white">
                      <Star className="h-3 w-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-center">
                    <div className="text-2xl font-bold">{plan.name}</div>
                    <div className="text-3xl font-bold text-blue-600 mt-2">
                      {formatCurrency(plan.price)}
                      <span className="text-lg text-gray-500">/month</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{plan.description}</p>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full" 
                    variant={plan.popular ? 'default' : 'outline'}
                    onClick={() => handleUpgrade(plan)}
                    disabled={loading}
                  >
                    {subscription.plan?.name === plan.name ? 'Current Plan' : 'Select Plan'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/useAuth'
import { useSubscription } from '@/hooks/useSubscription'
import { Clock, Crown, AlertTriangle } from 'lucide-react'

export function TrialBanner() {
  const { isTrial } = useAuth()
  const { getDaysUntilTrialEnd } = useSubscription()
  
  const daysRemaining = getDaysUntilTrialEnd()

  if (!isTrial || daysRemaining === null) return null

  const isUrgent = daysRemaining <= 7

  return (
    <Card className={`${isUrgent ? 'border-red-200 bg-red-50' : 'border-orange-200 bg-orange-50'} mb-6`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {isUrgent ? (
              <AlertTriangle className="h-5 w-5 text-red-600" />
            ) : (
              <Clock className="h-5 w-5 text-orange-600" />
            )}
            <div>
              <p className={`font-medium ${isUrgent ? 'text-red-800' : 'text-orange-800'}`}>
                {isUrgent ? 'Trial Ending Soon!' : 'Free Trial Active'}
              </p>
              <p className={`text-sm ${isUrgent ? 'text-red-600' : 'text-orange-600'}`}>
                {daysRemaining} days remaining in your free trial
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={isUrgent ? 'destructive' : 'secondary'}>
              {daysRemaining} days left
            </Badge>
            <Button size="sm" className="bg-green-600 hover:bg-green-700">
              <Crown className="h-4 w-4 mr-2" />
              Upgrade Now
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
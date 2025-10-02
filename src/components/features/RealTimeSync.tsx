import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { subscribeToChanges } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle,
  Database,
  Users,
  Activity
} from 'lucide-react'

export function RealTimeSync() {
  const { tenant } = useAuth()
  const [isConnected, setIsConnected] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [recentChanges, setRecentChanges] = useState<any[]>([])
  const [activeConnections, setActiveConnections] = useState(0)

  useEffect(() => {
    if (!tenant) return

    const subscriptions: any[] = []
    
    // Subscribe to key tables for real-time updates
    const tables = ['students', 'staff', 'attendance_records', 'fee_invoices', 'messages']
    
    tables.forEach(table => {
      const subscription = subscribeToChanges(table, (payload) => {
        setLastUpdate(new Date())
        setRecentChanges(prev => [
          {
            id: Date.now(),
            table,
            eventType: payload.eventType,
            timestamp: new Date(),
            record: payload.new || payload.old
          },
          ...prev.slice(0, 9) // Keep last 10 changes
        ])
      })
      
      subscriptions.push(subscription)
      setActiveConnections(prev => prev + 1)
    })

    // Connection status monitoring
    const checkConnection = () => {
      setIsConnected(navigator.onLine)
    }

    window.addEventListener('online', checkConnection)
    window.addEventListener('offline', checkConnection)

    return () => {
      subscriptions.forEach(sub => sub.unsubscribe())
      window.removeEventListener('online', checkConnection)
      window.removeEventListener('offline', checkConnection)
      setActiveConnections(0)
    }
  }, [tenant])

  const getChangeIcon = (table: string) => {
    switch (table) {
      case 'students': return Users
      case 'staff': return Users
      case 'attendance_records': return CheckCircle
      case 'fee_invoices': return Database
      case 'messages': return Activity
      default: return Database
    }
  }

  const getChangeColor = (eventType: string) => {
    switch (eventType) {
      case 'INSERT': return 'text-green-600'
      case 'UPDATE': return 'text-blue-600'
      case 'DELETE': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center space-x-2">
            {isConnected ? (
              <Wifi className="h-5 w-5 text-green-600" />
            ) : (
              <WifiOff className="h-5 w-5 text-red-600" />
            )}
            <span>Real-time Sync</span>
          </span>
          <div className="flex items-center space-x-2">
            <Badge variant={isConnected ? 'default' : 'destructive'}>
              {isConnected ? 'Connected' : 'Offline'}
            </Badge>
            <Badge variant="secondary">
              {activeConnections} channels
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <Database className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <p className="font-medium text-green-800 dark:text-green-300">Database</p>
            <p className="text-sm text-green-600 dark:text-green-400">
              {isConnected ? 'Live sync active' : 'Offline mode'}
            </p>
          </div>
          <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <Activity className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <p className="font-medium text-blue-800 dark:text-blue-300">Last Update</p>
            <p className="text-sm text-blue-600 dark:text-blue-400">
              {lastUpdate ? lastUpdate.toLocaleTimeString() : 'No updates'}
            </p>
          </div>
          <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <RefreshCw className="h-6 w-6 text-purple-600 mx-auto mb-2" />
            <p className="font-medium text-purple-800 dark:text-purple-300">Changes</p>
            <p className="text-sm text-purple-600 dark:text-purple-400">
              {recentChanges.length} recent
            </p>
          </div>
        </div>

        {recentChanges.length > 0 && (
          <div className="mt-4">
            <h4 className="font-medium text-foreground mb-2">Recent Changes</h4>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {recentChanges.slice(0, 5).map((change) => {
                const Icon = getChangeIcon(change.table)
                return (
                  <div key={change.id} className="flex items-center space-x-2 text-xs">
                    <Icon className="h-3 w-3 text-muted-foreground" />
                    <span className="capitalize">{change.table.replace('_', ' ')}</span>
                    <span className={getChangeColor(change.eventType)}>
                      {change.eventType.toLowerCase()}
                    </span>
                    <span className="text-muted-foreground">
                      {change.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/store';
import { DatabaseStatus } from '@/components/features/DatabaseStatus';
import { 
  Users, 
  BookOpen, 
  CreditCard, 
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Bus,
  GraduationCap,
  Target,
  FileText
} from 'lucide-react';

export function Overview() {
  const { user, tenant } = useAuth();

  const stats = [
    {
      title: "Total Students",
      value: "245",
      change: "+12",
      changeType: "positive" as const,
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "CBC Assessments",
      value: "89%",
      change: "+2.1%",
      changeType: "positive" as const,
      icon: BookOpen,
      color: "text-green-600"
    },
    {
      title: "Fee Collection",
      value: "KES 2.4M",
      change: "+15%",
      changeType: "positive" as const,
      icon: CreditCard,
      color: "text-purple-600"
    },
    {
      title: "Attendance Rate",
      value: "98.5%",
      change: "-0.3%",
      changeType: "negative" as const,
      icon: Calendar,
      color: "text-orange-600"
    }
  ];

  const recentActivity = [
    { type: "assessment", title: "Grade 3A Mathematics SBA completed", time: "2 hours ago", status: "success" },
    { type: "payment", title: "KES 15,000 fee payment received", time: "4 hours ago", status: "success" },
    { type: "attendance", title: "Morning attendance marked for all classes", time: "6 hours ago", status: "success" },
    { type: "alert", title: "3 students absent without notice", time: "8 hours ago", status: "warning" },
  ];

  const quickActions = [
    { label: "Mark Attendance", icon: Calendar, action: "attendance", color: "bg-blue-500" },
    { label: "Create SBA Task", icon: BookOpen, action: "assessment", color: "bg-green-500" },
    { label: "Generate Reports", icon: FileText, action: "reports", color: "bg-purple-500" },
    { label: "Send M-PESA Invoice", icon: CreditCard, action: "finance", color: "bg-orange-500" },
  ];

  const upcomingTasks = [
    { title: "Term 1 Report Cards Due", date: "March 25, 2024", priority: "high" },
    { title: "KNEC SBA Submission", date: "March 30, 2024", priority: "high" },
    { title: "Parent-Teacher Conferences", date: "April 5, 2024", priority: "medium" },
    { title: "Fee Collection Deadline", date: "April 10, 2024", priority: "medium" },
  ];

  return (
    <div className="space-y-6">
      {/* Database Status */}
      <DatabaseStatus />
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}</h1>
          <p className="text-gray-600 mt-1">Here's what's happening at {tenant?.name || 'your school'} today</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="bg-green-50 text-green-700">
            🇰🇪 CBC Compliant
          </Badge>
          <Badge variant="secondary" className="bg-blue-50 text-blue-700">
            NEMIS Ready
          </Badge>
        </div>
      </div>

      {/* Key Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <div className="flex items-center mt-2">
                      <TrendingUp className={`h-4 w-4 mr-1 ${
                        stat.changeType === 'positive' ? 'text-green-500' : 'text-red-500'
                      }`} />
                      <span className={`text-sm ${
                        stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-full bg-gray-50`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-blue-600" />
              <span>Quick Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-center space-y-2"
                  >
                    <div className={`p-2 rounded-full ${action.color}`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-sm font-medium">{action.label}</span>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-orange-600" />
              <span>Upcoming Deadlines</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingTasks.map((task, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{task.title}</p>
                    <p className="text-sm text-gray-600">{task.date}</p>
                  </div>
                  <Badge variant={task.priority === 'high' ? 'destructive' : 'secondary'}>
                    {task.priority}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span>Recent Activity</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 border-l-4 border-l-blue-200 bg-blue-50/30">
                <div className={`p-2 rounded-full ${
                  activity.status === 'success' ? 'bg-green-100' : 
                  activity.status === 'warning' ? 'bg-orange-100' : 'bg-gray-100'
                }`}>
                  {activity.status === 'success' ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : activity.status === 'warning' ? (
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                  ) : (
                    <Clock className="h-4 w-4 text-gray-600" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{activity.title}</p>
                  <p className="text-sm text-gray-600">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* CBC Compliance Status */}
      <Card className="border-green-200 bg-green-50/30">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <GraduationCap className="h-5 w-5 text-green-600" />
            <span>CBC Compliance Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">245</div>
              <div className="text-sm text-gray-600">Students with UPI Numbers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">89%</div>
              <div className="text-sm text-gray-600">SBA Tasks Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">100%</div>
              <div className="text-sm text-gray-600">ODPC Compliance</div>
            </div>
          </div>
          <div className="mt-4 p-4 bg-green-100 rounded-lg">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-green-800 font-medium">
                Your school is fully compliant with CBC requirements and ready for KNEC submissions
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
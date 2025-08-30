import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { mockLearners, mockSBATasks, mockAttendance, mockFeeInvoices } from '@/data/mock-data';
import { ReportExporter } from '@/components/features/ReportExporter';
import { formatCurrency } from '@/lib/utils';
import { useReports } from '@/store';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Users, 
  BookOpen, 
  CreditCard,
  Calendar,
  Target,
  AlertTriangle,
  CheckCircle,
  Download,
  FileText,
  Filter,
  RefreshCw,
  Eye,
  Settings,
  PieChart,
  LineChart,
  Activity
} from 'lucide-react';

export function Analytics() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('current_term');
  const [selectedMetric, setSelectedMetric] = useState('all');
  const [showReportExporter, setShowReportExporter] = useState(false);

  const { generateReport } = useReports();

  // Calculate analytics data
  const totalStudents = mockLearners.length;
  const activeStudents = mockLearners.filter(s => s.status === 'active').length;
  const sneStudents = mockLearners.filter(s => s.special_needs).length;
  
  const totalTasks = mockSBATasks.length;
  const completedTasks = Math.floor(totalTasks * 0.89);
  
  const totalFees = mockFeeInvoices.reduce((sum, inv) => sum + inv.total, 0);
  const collectedFees = mockFeeInvoices.reduce((sum, inv) => sum + (inv.total - inv.balance), 0);
  const collectionRate = (collectedFees / totalFees) * 100;

  const attendanceRate = 98.5;

  const handleExportAnalytics = (type: string) => {
    generateReport({
      type: `analytics_${type}`,
      title: `Analytics Report - ${type.replace('_', ' ').toUpperCase()}`,
      data: { students: mockLearners, tasks: mockSBATasks, attendance: mockAttendance, fees: mockFeeInvoices },
      format: 'pdf'
    });
  };

  const handleExportDashboard = () => {
    generateReport({
      type: 'executive_dashboard',
      title: 'Executive Dashboard Report',
      data: {
        students: mockLearners,
        tasks: mockSBATasks,
        attendance: mockAttendance,
        fees: mockFeeInvoices,
        period: selectedPeriod
      },
      format: 'pdf'
    });
  };

  const MetricCard = ({ title, value, change, changeType, icon: Icon, color, onClick }: any) => (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={onClick}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <div className="flex items-center mt-2">
              {changeType === 'positive' ? (
                <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 mr-1 text-red-500" />
              )}
              <span className={`text-sm ${changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                {change}
              </span>
            </div>
          </div>
          <div className={`p-3 rounded-full bg-gray-50`}>
            <Icon className={`h-6 w-6 ${color}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const PerformanceChart = ({ title, data, type = 'bar' }: any) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{title}</span>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-1" />
              View Details
            </Button>
            <Button variant="outline" size="sm" onClick={() => generateReport({ type: 'chart_export', title, data, format: 'pdf' })}>
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center text-gray-500">
            {type === 'bar' ? <BarChart3 className="h-12 w-12 mx-auto mb-2" /> : 
             type === 'pie' ? <PieChart className="h-12 w-12 mx-auto mb-2" /> :
             <LineChart className="h-12 w-12 mx-auto mb-2" />}
            <p>{title} Chart</p>
            <p className="text-sm">Interactive chart would be displayed here</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics & Insights</h1>
          <p className="text-gray-600 mt-1">Data-driven insights for school performance</p>
        </div>
        <div className="flex items-center space-x-3">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current_term">Current Term</SelectItem>
              <SelectItem value="current_year">Academic Year</SelectItem>
              <SelectItem value="last_30_days">Last 30 Days</SelectItem>
              <SelectItem value="custom">Custom Period</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
          <Button onClick={handleExportDashboard}>
            <Download className="h-4 w-4 mr-2" />
            Export Dashboard
          </Button>
          <Button onClick={() => setShowReportExporter(true)} variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            All Analytics
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Students"
          value={totalStudents}
          change="+12 this term"
          changeType="positive"
          icon={Users}
          color="text-blue-600"
          onClick={() => handleExportAnalytics('student_enrollment')}
        />
        <MetricCard
          title="CBC Completion"
          value={`${Math.round((completedTasks / totalTasks) * 100)}%`}
          change="+5.2% this month"
          changeType="positive"
          icon={BookOpen}
          color="text-green-600"
          onClick={() => handleExportAnalytics('cbc_completion')}
        />
        <MetricCard
          title="Fee Collection"
          value={`${collectionRate.toFixed(1)}%`}
          change="+8.1% this term"
          changeType="positive"
          icon={CreditCard}
          color="text-purple-600"
          onClick={() => handleExportAnalytics('fee_collection')}
        />
        <MetricCard
          title="Attendance Rate"
          value={`${attendanceRate}%`}
          change="-0.3% this week"
          changeType="negative"
          icon={Calendar}
          color="text-orange-600"
          onClick={() => handleExportAnalytics('attendance_trends')}
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="academic">Academic Performance</TabsTrigger>
          <TabsTrigger value="financial">Financial Analytics</TabsTrigger>
          <TabsTrigger value="operational">Operational Metrics</TabsTrigger>
          <TabsTrigger value="predictive">Predictive Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PerformanceChart 
              title="Student Enrollment Trends" 
              data={mockLearners}
              type="line"
            />
            <PerformanceChart 
              title="CBC Competency Distribution" 
              data={mockSBATasks}
              type="pie"
            />
            <PerformanceChart 
              title="Attendance Patterns" 
              data={mockAttendance}
              type="bar"
            />
            <PerformanceChart 
              title="Fee Collection Trends" 
              data={mockFeeInvoices}
              type="line"
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>School Performance Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="font-semibold text-green-800">Academic Excellence</p>
                  <p className="text-2xl font-bold text-green-600">87%</p>
                  <p className="text-sm text-green-600">Students proficient or above</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Target className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="font-semibold text-blue-800">Operational Efficiency</p>
                  <p className="text-2xl font-bold text-blue-600">92%</p>
                  <p className="text-sm text-blue-600">Overall system efficiency</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Activity className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <p className="font-semibold text-purple-800">Parent Satisfaction</p>
                  <p className="text-2xl font-bold text-purple-600">94%</p>
                  <p className="text-sm text-purple-600">Based on feedback surveys</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="academic" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>CBC Competency Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { competency: 'Communication & Collaboration', score: 89, trend: '+3%' },
                    { competency: 'Critical Thinking', score: 76, trend: '+1%' },
                    { competency: 'Creativity & Imagination', score: 82, trend: '+5%' },
                    { competency: 'Citizenship', score: 91, trend: '+2%' },
                    { competency: 'Digital Literacy', score: 68, trend: '-1%' },
                    { competency: 'Learning to Learn', score: 85, trend: '+4%' }
                  ].map((item) => (
                    <div key={item.competency} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.competency}</span>
                      <div className="flex items-center space-x-3">
                        <Progress value={item.score} className="w-24" />
                        <span className="text-sm font-semibold w-12">{item.score}%</span>
                        <span className={`text-xs ${item.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                          {item.trend}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Button variant="outline" size="sm" onClick={() => handleExportAnalytics('competency_analysis')}>
                    <Download className="h-4 w-4 mr-2" />
                    Export Analysis
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Learning Area Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { area: 'Languages', proficient: 85, approaching: 12, emerging: 3 },
                    { area: 'Mathematical Activities', proficient: 78, approaching: 18, emerging: 4 },
                    { area: 'Environmental Activities', proficient: 92, approaching: 7, emerging: 1 },
                    { area: 'Religious Education', proficient: 88, approaching: 10, emerging: 2 },
                    { area: 'Creative Arts', proficient: 81, approaching: 15, emerging: 4 }
                  ].map((area) => (
                    <div key={area.area} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">{area.area}</span>
                        <span className="text-sm text-gray-600">{area.proficient}% proficient</span>
                      </div>
                      <div className="flex space-x-1">
                        <div className="flex-1 bg-green-500 h-2 rounded-l" style={{ width: `${area.proficient}%` }}></div>
                        <div className="flex-1 bg-yellow-500 h-2" style={{ width: `${area.approaching}%` }}></div>
                        <div className="flex-1 bg-red-500 h-2 rounded-r" style={{ width: `${area.emerging}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Button variant="outline" size="sm" onClick={() => handleExportAnalytics('learning_area_performance')}>
                    <Download className="h-4 w-4 mr-2" />
                    Export Performance Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Student Progress Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="font-semibold text-green-800">Improving Students</p>
                  <p className="text-2xl font-bold text-green-600">156</p>
                  <p className="text-sm text-green-600">63% of total students</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Target className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="font-semibold text-blue-800">Stable Performance</p>
                  <p className="text-2xl font-bold text-blue-600">78</p>
                  <p className="text-sm text-blue-600">32% of total students</p>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <AlertTriangle className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <p className="font-semibold text-orange-800">Need Support</p>
                  <p className="text-2xl font-bold text-orange-600">11</p>
                  <p className="text-sm text-orange-600">5% of total students</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Fee Collection Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <CreditCard className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="font-semibold text-green-800">Collection Rate</p>
                    <p className="text-2xl font-bold text-green-600">{collectionRate.toFixed(1)}%</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Total Fees Billed:</span>
                      <span className="font-semibold">{formatCurrency(totalFees)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Amount Collected:</span>
                      <span className="font-semibold text-green-600">{formatCurrency(collectedFees)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Outstanding Balance:</span>
                      <span className="font-semibold text-red-600">{formatCurrency(totalFees - collectedFees)}</span>
                    </div>
                  </div>

                  <Button variant="outline" size="sm" onClick={() => handleExportAnalytics('financial_performance')}>
                    <Download className="h-4 w-4 mr-2" />
                    Export Financial Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Method Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { method: 'M-PESA', percentage: 75, amount: collectedFees * 0.75, color: 'bg-green-500' },
                    { method: 'Bank Transfer', percentage: 20, amount: collectedFees * 0.20, color: 'bg-blue-500' },
                    { method: 'Cash', percentage: 5, amount: collectedFees * 0.05, color: 'bg-gray-500' }
                  ].map((method) => (
                    <div key={method.method} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">{method.method}</span>
                        <span className="text-sm text-gray-600">{formatCurrency(method.amount)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`${method.color} h-2 rounded-full`} 
                            style={{ width: `${method.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-semibold">{method.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <PerformanceChart 
            title="Monthly Fee Collection Trends" 
            data={mockFeeInvoices}
            type="line"
          />
        </TabsContent>

        <TabsContent value="operational" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Resource Utilization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { resource: 'Classrooms', utilization: 85, capacity: 12, used: 10 },
                    { resource: 'Computer Lab', utilization: 92, capacity: 40, used: 37 },
                    { resource: 'Science Lab', utilization: 68, capacity: 30, used: 20 },
                    { resource: 'Library', utilization: 45, capacity: 60, used: 27 },
                    { resource: 'Sports Field', utilization: 78, capacity: 100, used: 78 }
                  ].map((item) => (
                    <div key={item.resource} className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium">{item.resource}</span>
                        <p className="text-xs text-gray-600">{item.used}/{item.capacity} capacity</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Progress value={item.utilization} className="w-24" />
                        <span className="text-sm font-semibold">{item.utilization}%</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Button variant="outline" size="sm" onClick={() => handleExportAnalytics('resource_utilization')}>
                    <Download className="h-4 w-4 mr-2" />
                    Export Utilization Report
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Staff Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { metric: 'Teaching Effectiveness', score: 88, benchmark: 85 },
                    { metric: 'Student Engagement', score: 82, benchmark: 80 },
                    { metric: 'Curriculum Delivery', score: 91, benchmark: 85 },
                    { metric: 'Professional Development', score: 76, benchmark: 75 },
                    { metric: 'Collaboration', score: 89, benchmark: 80 }
                  ].map((metric) => (
                    <div key={metric.metric} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">{metric.metric}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-semibold">{metric.score}%</span>
                          {metric.score >= metric.benchmark ? (
                            <CheckCircle className="h-3 w-3 text-green-500" />
                          ) : (
                            <AlertTriangle className="h-3 w-3 text-orange-500" />
                          )}
                        </div>
                      </div>
                      <Progress value={metric.score} className="w-full" />
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Button variant="outline" size="sm" onClick={() => handleExportAnalytics('staff_performance')}>
                    <Download className="h-4 w-4 mr-2" />
                    Export Staff Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="predictive" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Predictive Insights & Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Academic Predictions</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• 23 students likely to achieve proficient+ in Mathematics</li>
                      <li>• 8 students need additional support in Languages</li>
                      <li>• Grade 3A projected to exceed term targets by 12%</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">Financial Forecasts</h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• Fee collection likely to reach 95% by term end</li>
                      <li>• M-PESA adoption increasing by 3% monthly</li>
                      <li>• Projected revenue: {formatCurrency(totalFees * 1.05)}</li>
                    </ul>
                  </div>
                </div>

                <div className="p-4 bg-orange-50 rounded-lg">
                  <h4 className="font-semibold text-orange-800 mb-2">Risk Alerts</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4 text-orange-600" />
                      <span className="text-sm text-orange-700">3 students showing declining attendance patterns</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4 text-orange-600" />
                      <span className="text-sm text-orange-700">Mathematics performance gap widening in Grade 4</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4 text-orange-600" />
                      <span className="text-sm text-orange-700">Teacher workload imbalance detected</span>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button onClick={() => handleExportAnalytics('predictive_insights')}>
                    <Download className="h-4 w-4 mr-2" />
                    Export Insights Report
                  </Button>
                  <Button variant="outline" onClick={() => generateReport({ type: 'risk_assessment', title: 'Risk Assessment Report', data: { students: mockLearners, risks: [] }, format: 'pdf' })}>
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Risk Assessment
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Report Exporter Dialog */}
      <Dialog open={showReportExporter} onOpenChange={setShowReportExporter}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Analytics Reports</DialogTitle>
          </DialogHeader>
          <ReportExporter 
            data={{
              students: mockLearners,
              tasks: mockSBATasks,
              attendance: mockAttendance,
              fees: mockFeeInvoices
            }} 
            title="Analytics Reports" 
            type="analytics"
            onClose={() => setShowReportExporter(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
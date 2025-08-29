import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { mockLearners, mockSBATasks, mockAttendance, mockFeeInvoices } from '@/data/mock-data';
import { ReportExporter } from '@/components/features/ReportExporter';
import { useReports } from '@/store';
import { formatDate, formatCurrency } from '@/lib/utils';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Target,
  Calendar,
  CreditCard,
  BookOpen,
  AlertTriangle,
  CheckCircle,
  Download,
  Filter,
  RefreshCw,
  Eye,
  FileText,
  Award,
  Clock,
  DollarSign
  Heart
} from 'lucide-react';

export function Analytics() {
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('current-term');
  const [selectedMetric, setSelectedMetric] = useState('all');
  const [showReportExporter, setShowReportExporter] = useState(false);

  // Analytics calculations
  const totalStudents = mockLearners.filter(s => s.status === 'active').length;
  const sbaCompletion = (mockSBATasks.length * 0.89); // 89% completion rate
  const attendanceRate = 98.5;
  const feeCollection = mockFeeInvoices.reduce((sum, inv) => sum + (inv.total - inv.balance), 0);
  const totalFees = mockFeeInvoices.reduce((sum, inv) => sum + inv.total, 0);
  const collectionRate = (feeCollection / totalFees) * 100;

  const performanceMetrics = [
  const { generateReport } = useReports();

  const handleExportAnalytics = () => {
    generateReport({
      type: 'analytics_dashboard',
      title: 'School Analytics Dashboard',
      data: performanceMetrics,
      format: 'pdf'
    });
  };

  const handleExportKPIReport = () => {
    generateReport({
      type: 'kpi_report',
      title: 'Key Performance Indicators Report',
      data: performanceMetrics,
      format: 'xlsx'
    });
  };

  const performanceMetrics = [
    {
      category: 'Academic Performance',
      metrics: [
        { name: 'SBA Completion Rate', value: '89%', trend: '+5.2%', status: 'good' },
        { name: 'Proficient+ Students', value: '76%', trend: '+3.1%', status: 'good' },
        { name: 'Learning Outcomes Met', value: '92%', trend: '+1.8%', status: 'excellent' },
        { name: 'Assessment Quality Score', value: '8.4/10', trend: '+0.3', status: 'good' }
      ]
    },
    {
      category: 'Operational Efficiency',
      metrics: [
        { name: 'Attendance Rate', value: '98.5%', trend: '-0.2%', status: 'excellent' },
        { name: 'Teacher Utilization', value: '85%', trend: '+2.1%', status: 'good' },
        { name: 'Room Utilization', value: '78%', trend: '+1.5%', status: 'good' },
        { name: 'Transport Efficiency', value: '94%', trend: '+0.8%', status: 'excellent' }
      ]
    },
    {
      category: 'Financial Health',
      metrics: [
        { name: 'Fee Collection Rate', value: `${collectionRate.toFixed(1)}%`, trend: '+12%', status: 'excellent' },
        { name: 'Outstanding Balances', value: formatCurrency(totalFees - feeCollection), trend: '-8%', status: 'good' },
        { name: 'M-PESA Success Rate', value: '98.2%', trend: '+0.5%', status: 'excellent' },
        { name: 'Payment Timeliness', value: '87%', trend: '+4.2%', status: 'good' }
      ]
    }
  ];

  const competencyAnalysis = [
    { area: 'Languages', proficient: 82, approaching: 15, emerging: 3 },
    { area: 'Mathematical Activities', proficient: 76, approaching: 19, emerging: 5 },
    { area: 'Environmental Activities', proficient: 89, approaching: 9, emerging: 2 },
    { area: 'Religious Education', proficient: 94, approaching: 5, emerging: 1 },
    { area: 'Creative Arts', proficient: 78, approaching: 18, emerging: 4 }
  ];

  const trendData = [
    { period: 'Term 1 2023', academic: 78, attendance: 96, finance: 82 },
    { period: 'Term 2 2023', academic: 81, attendance: 97, finance: 85 },
    { period: 'Term 3 2023', academic: 84, attendance: 98, finance: 88 },
    { period: 'Term 1 2024', academic: 89, attendance: 98.5, finance: 92 }
  ];

  const riskFactors = [
    { student: 'Brian Kiprotich', risk: 'Academic', score: 85, factors: ['Low SBA scores', 'Irregular attendance'] },
    { student: 'Amina Hassan', risk: 'Financial', score: 72, factors: ['Outstanding fees', 'Payment delays'] },
    { student: 'Grace Wanjiku', risk: 'Welfare', score: 45, factors: ['Counseling case', 'Family issues'] }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics & Insights</h1>
          <p className="text-gray-600 mt-1">Data-driven insights for school performance</p>
        </div>
        <div className="flex items-center space-x-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current-term">Current Term</SelectItem>
              <SelectItem value="current-year">Academic Year</SelectItem>
              <SelectItem value="last-30-days">Last 30 Days</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => setShowReportExporter(true)} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Analytics
          </Button>
          <Button variant="outline" onClick={handleExportAnalytics}>
            <FileText className="h-4 w-4 mr-2" />
            Dashboard PDF
          </Button>
          <Button variant="outline" onClick={handleExportKPIReport}>
            <BarChart3 className="h-4 w-4 mr-2" />
            KPI Report
          </Button>
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Academic Score</p>
                <p className="text-2xl font-bold text-blue-600">89%</p>
                <p className="text-xs text-green-600">+5.2% from last term</p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Attendance</p>
                <p className="text-2xl font-bold text-green-600">98.5%</p>
                <p className="text-xs text-red-600">-0.2% from last term</p>
              </div>
              <Calendar className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Fee Collection</p>
                <p className="text-2xl font-bold text-purple-600">{collectionRate.toFixed(0)}%</p>
                <p className="text-xs text-green-600">+12% from last term</p>
              </div>
              <CreditCard className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Overall Health</p>
                <p className="text-2xl font-bold text-orange-600">92%</p>
                <p className="text-xs text-green-600">+2.8% from last term</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Performance Overview</TabsTrigger>
          <TabsTrigger value="academic">Academic Analytics</TabsTrigger>
          <TabsTrigger value="operational">Operational Metrics</TabsTrigger>
          <TabsTrigger value="financial">Financial Analytics</TabsTrigger>
          <TabsTrigger value="predictive">Predictive Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {performanceMetrics.map((category, categoryIndex) => (
              <Card key={categoryIndex}>
                <CardHeader>
                  <CardTitle className="text-lg">{category.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {category.metrics.map((metric, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{metric.name}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-lg font-bold">{metric.value}</span>
                            <span className={`text-xs ${
                              metric.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {metric.trend}
                            </span>
                          </div>
                        </div>
                        <div className={`w-3 h-3 rounded-full ${
                          metric.status === 'excellent' ? 'bg-green-500' :
                          metric.status === 'good' ? 'bg-blue-500' : 'bg-yellow-500'
                        }`}></div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trendData.map((period, index) => (
                  <div key={index} className="grid grid-cols-4 gap-4 items-center">
                    <div className="font-medium text-gray-900">{period.period}</div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">Academic:</span>
                      <Progress value={period.academic} className="flex-1" />
                      <span className="text-sm font-semibold">{period.academic}%</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">Attendance:</span>
                      <Progress value={period.attendance} className="flex-1" />
                      <span className="text-sm font-semibold">{period.attendance}%</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">Finance:</span>
                      <Progress value={period.finance} className="flex-1" />
                      <span className="text-sm font-semibold">{period.finance}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="academic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>CBC Competency Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {competencyAnalysis.map((area, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">{area.area}</h4>
                      <Badge variant="default">{area.proficient}% Proficient+</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 bg-green-500 rounded"></div>
                        <span>Proficient: {area.proficient}%</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                        <span>Approaching: {area.approaching}%</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 bg-red-500 rounded"></div>
                        <span>Emerging: {area.emerging}%</span>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <div className={`h-2 bg-green-500 rounded-l`} style={{ width: `${area.proficient}%` }}></div>
                      <div className={`h-2 bg-yellow-500`} style={{ width: `${area.approaching}%` }}></div>
                      <div className={`h-2 bg-red-500 rounded-r`} style={{ width: `${area.emerging}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Grade Performance Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((grade) => {
                    const performance = Math.floor(Math.random() * 15) + 80;
                    return (
                      <div key={grade} className="flex items-center justify-between">
                        <span className="text-sm font-medium">Grade {grade}</span>
                        <div className="flex items-center space-x-2">
                          <Progress value={performance} className="w-24" />
                          <span className="text-sm font-semibold w-12">{performance}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Subject Mastery Levels</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['English', 'Kiswahili', 'Mathematics', 'Environmental', 'CRE'].map((subject) => {
                    const mastery = Math.floor(Math.random() * 20) + 75;
                    return (
                      <div key={subject} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{subject}</span>
                        <div className="flex items-center space-x-2">
                          <Progress 
                            value={mastery} 
                            className={`w-24 ${
                              mastery >= 90 ? '[&>div]:bg-green-500' :
                              mastery >= 80 ? '[&>div]:bg-blue-500' :
                              mastery >= 70 ? '[&>div]:bg-yellow-500' : '[&>div]:bg-red-500'
                            }`}
                          />
                          <span className="text-sm font-semibold w-12">{mastery}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="operational" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Daily Operations Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-green-800">Attendance Tracking</span>
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <p className="text-sm text-green-700">98.5% daily attendance rate</p>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-blue-800">Transport Safety</span>
                      <CheckCircle className="h-5 w-5 text-blue-600" />
                    </div>
                    <p className="text-sm text-blue-700">All routes operating on schedule</p>
                  </div>

                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-purple-800">Staff Utilization</span>
                      <CheckCircle className="h-5 w-5 text-purple-600" />
                    </div>
                    <p className="text-sm text-purple-700">Optimal teacher workload distribution</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resource Utilization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { resource: 'Classrooms', utilization: 85, capacity: 12 },
                    { resource: 'Computer Lab', utilization: 72, capacity: 1 },
                    { resource: 'Science Lab', utilization: 68, capacity: 1 },
                    { resource: 'Library', utilization: 45, capacity: 1 },
                    { resource: 'Sports Field', utilization: 60, capacity: 1 }
                  ].map((item) => (
                    <div key={item.resource} className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium">{item.resource}</span>
                        <p className="text-xs text-gray-500">{item.capacity} available</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Progress value={item.utilization} className="w-20" />
                        <span className="text-sm font-semibold w-12">{item.utilization}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="financial" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <DollarSign className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <div className="text-2xl font-bold text-green-600">{formatCurrency(feeCollection)}</div>
                <div className="text-sm text-gray-600">Total Collected</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <AlertTriangle className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <div className="text-2xl font-bold text-orange-600">{formatCurrency(totalFees - feeCollection)}</div>
                <div className="text-sm text-gray-600">Outstanding</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Target className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <div className="text-2xl font-bold text-blue-600">{collectionRate.toFixed(1)}%</div>
                <div className="text-sm text-gray-600">Collection Rate</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Payment Method Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">85%</div>
                  <div className="text-sm text-gray-600">M-PESA Payments</div>
                  <Progress value={85} className="mt-2" />
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">12%</div>
                  <div className="text-sm text-gray-600">Bank Transfers</div>
                  <Progress value={12} className="mt-2" />
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-600">3%</div>
                  <div className="text-sm text-gray-600">Cash Payments</div>
                  <Progress value={3} className="mt-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictive" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>At-Risk Student Identification</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {riskFactors.map((student, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">{student.student}</h4>
                        <Badge variant={
                          student.score >= 80 ? 'secondary' :
                          student.score >= 60 ? 'destructive' : 'destructive'
                        }>
                          {student.risk} Risk
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-red-600">{student.score}</div>
                        <div className="text-xs text-gray-500">Risk Score</div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      {student.factors.map((factor, factorIndex) => (
                        <div key={factorIndex} className="text-sm text-gray-600 flex items-center">
                          <AlertTriangle className="h-3 w-3 text-orange-500 mr-2" />
                          {factor}
                        </div>
                      ))}
                    </div>
                    <div className="flex space-x-2 mt-3">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        View Profile
                      </Button>
                      <Button size="sm" onClick={() => {
                        generateReport({
                          type: 'intervention_plan',
                          title: `${student.student} - Intervention Plan`,
                          data: student,
                          format: 'pdf'
                        });
                      }}>
                        <Heart className="h-4 w-4 mr-1" />
                        Create Intervention
                      </Button>
                    </div>
                  </div>
                ))}
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
            data={performanceMetrics} 
            title="School Analytics Report" 
            type="privacy"
            onClose={() => setShowReportExporter(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
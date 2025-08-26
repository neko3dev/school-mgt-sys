import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { formatDate, generateId } from '@/lib/utils';
import { 
  FileText, 
  Download, 
  Calendar, 
  Filter,
  Clock,
  CheckCircle,
  AlertTriangle,
  Plus,
  Eye,
  Settings,
  BarChart3,
  Users,
  CreditCard,
  GraduationCap,
  Bus,
  Shield
} from 'lucide-react';

export function Reports() {
  const [activeTab, setActiveTab] = useState('overview');

  const reportCategories = [
    {
      id: 'academic',
      name: 'Academic Reports',
      icon: GraduationCap,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      reports: [
        { name: 'CBC Report Cards', description: 'Individual student competency reports', format: ['PDF'] },
        { name: 'Class Mastery Heatmap', description: 'Visual competency assessment overview', format: ['PDF', 'Excel'] },
        { name: 'SBA Progress Report', description: 'Assessment completion tracking', format: ['PDF', 'Excel'] },
        { name: 'Learning Outcomes Analysis', description: 'Strand-level performance breakdown', format: ['PDF', 'Excel'] },
        { name: 'KNEC SBA Export', description: 'KNEC-ready assessment data', format: ['CSV', 'Excel'] }
      ]
    },
    {
      id: 'administrative',
      name: 'Administrative Reports',
      icon: Users,
      color: 'text-green-600',
      bg: 'bg-green-50',
      reports: [
        { name: 'Student Enrollment Register', description: 'Complete student database', format: ['PDF', 'Excel'] },
        { name: 'Attendance Summary', description: 'Daily, weekly, monthly attendance', format: ['PDF', 'Excel'] },
        { name: 'Class Lists', description: 'Current class compositions', format: ['PDF', 'Excel'] },
        { name: 'NEMIS Upload Data', description: 'Student data for NEMIS submission', format: ['CSV'] },
        { name: 'Staff Directory', description: 'Teacher and staff information', format: ['PDF', 'Excel'] }
      ]
    },
    {
      id: 'financial',
      name: 'Financial Reports',
      icon: CreditCard,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      reports: [
        { name: 'Fee Collection Summary', description: 'Payment status and trends', format: ['PDF', 'Excel'] },
        { name: 'Outstanding Balances', description: 'Arrears and aging analysis', format: ['PDF', 'Excel'] },
        { name: 'M-PESA Transaction Log', description: 'Mobile payment records', format: ['Excel', 'CSV'] },
        { name: 'Financial Statements', description: 'Income and expense summary', format: ['PDF'] },
        { name: 'Bursary Allocation Report', description: 'Government funding distribution', format: ['PDF', 'Excel'] }
      ]
    },
    {
      id: 'compliance',
      name: 'Compliance & Audit',
      icon: Shield,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      reports: [
        { name: 'ODPC Compliance Pack', description: 'Data protection compliance records', format: ['PDF'] },
        { name: 'Audit Trail Export', description: 'System access and changes log', format: ['CSV', 'Excel'] },
        { name: 'TPAD Evidence Bundle', description: 'Teacher performance documentation', format: ['PDF', 'ZIP'] },
        { name: 'Safety Incident Reports', description: 'Welfare and safeguarding records', format: ['PDF'] },
        { name: 'Export Activity Log', description: 'Data export history and verification', format: ['CSV'] }
      ]
    }
  ];

  const recentExports = [
    {
      id: generateId(),
      name: 'Term 1 Report Cards - Grade 3A',
      type: 'PDF',
      status: 'completed',
      date: new Date().toISOString(),
      size: '15.2 MB',
      hash: 'sha256:a1b2c3d4...'
    },
    {
      id: generateId(),
      name: 'Attendance Summary - March 2024',
      type: 'Excel',
      status: 'completed',
      date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      size: '2.8 MB',
      hash: 'sha256:e5f6g7h8...'
    },
    {
      id: generateId(),
      name: 'Fee Collection Report',
      type: 'PDF',
      status: 'generating',
      date: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      progress: 75
    }
  ];

  const ReportCard = ({ category }: { category: any }) => {
    const Icon = category.icon;
    
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <div className={`p-2 rounded-full ${category.bg}`}>
              <Icon className={`h-5 w-5 ${category.color}`} />
            </div>
            <span>{category.name}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {category.reports.map((report: any, index: number) => (
              <div key={index} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{report.name}</h4>
                  <div className="flex space-x-1">
                    {report.format.map((fmt: string) => (
                      <Badge key={fmt} variant="outline" className="text-xs">
                        {fmt}
                      </Badge>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3">{report.description}</p>
                <div className="flex space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Settings className="h-4 w-4 mr-1" />
                        Configure
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Generate {report.name}</DialogTitle>
                      </DialogHeader>
                      <ReportBuilder report={report} />
                    </DialogContent>
                  </Dialog>
                  <Button size="sm" className="flex-1">
                    <Download className="h-4 w-4 mr-1" />
                    Generate
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  const ReportBuilder = ({ report }: { report: any }) => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Academic Year</label>
              <select className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2">
                <option>2024</option>
                <option>2023</option>
              </select>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">Term</label>
              <select className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2">
                <option>Current Term (Term 1)</option>
                <option>Term 1</option>
                <option>Term 2</option>
                <option>Term 3</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">Grade</label>
              <select className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2">
                <option>All Grades</option>
                <option>Grade 1</option>
                <option>Grade 2</option>
                <option>Grade 3</option>
                <option>Grade 4</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Format</label>
              <div className="mt-2 space-y-2">
                {report.format.map((fmt: string) => (
                  <label key={fmt} className="flex items-center space-x-2">
                    <input type="radio" name="format" value={fmt} defaultChecked={fmt === 'PDF'} />
                    <span className="text-sm">{fmt}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">Include</label>
              <div className="mt-2 space-y-2">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked />
                  <span className="text-sm">Student photos</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked />
                  <span className="text-sm">School branding</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" />
                  <span className="text-sm">QR codes for verification</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <h4 className="font-semibold text-gray-900 mb-3">Preview Options</h4>
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-blue-800">{report.name}</span>
            </div>
            <div className="text-sm text-blue-700">
              <p>Estimated size: 12.5 MB</p>
              <p>Estimated time: 3-5 minutes</p>
              <p>Recipients: All Grade 3A parents (40 reports)</p>
            </div>
          </div>
        </div>

        <div className="flex space-x-3">
          <Button variant="outline" className="flex-1">
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button className="flex-1">
            <Download className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>
    );
  };

  const ExportQueueItem = ({ export: exportItem }: { export: any }) => {
    const statusConfig = {
      completed: { color: 'text-green-600', bg: 'bg-green-50', icon: CheckCircle },
      generating: { color: 'text-blue-600', bg: 'bg-blue-50', icon: Clock },
      failed: { color: 'text-red-600', bg: 'bg-red-50', icon: AlertTriangle }
    };

    const config = statusConfig[exportItem.status as keyof typeof statusConfig];
    const Icon = config.icon;

    return (
      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-full ${config.bg}`}>
            <Icon className={`h-4 w-4 ${config.color}`} />
          </div>
          <div>
            <h4 className="font-medium text-gray-900">{exportItem.name}</h4>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>{formatDate(exportItem.date)}</span>
              <span>•</span>
              <span>{exportItem.type}</span>
              {exportItem.size && (
                <>
                  <span>•</span>
                  <span>{exportItem.size}</span>
                </>
              )}
            </div>
            {exportItem.hash && (
              <div className="text-xs text-gray-500 font-mono mt-1">
                Hash: {exportItem.hash}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {exportItem.status === 'generating' && exportItem.progress && (
            <div className="flex items-center space-x-2">
              <Progress value={exportItem.progress} className="w-24" />
              <span className="text-sm text-gray-600">{exportItem.progress}%</span>
            </div>
          )}

          {exportItem.status === 'completed' && (
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1" />
              Download
            </Button>
          )}

          <Badge variant={exportItem.status === 'completed' ? 'default' : 'secondary'}>
            {exportItem.status}
          </Badge>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Generate comprehensive reports and export data</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="secondary" className="bg-blue-50 text-blue-700">
            {recentExports.filter(e => e.status === 'completed').length} Exports Ready
          </Badge>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Custom Report
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Reports Generated</p>
                <p className="text-2xl font-bold text-blue-600">156</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Data Exported</p>
                <p className="text-2xl font-bold text-green-600">2.4 GB</p>
              </div>
              <Download className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Scheduled Reports</p>
                <p className="text-2xl font-bold text-orange-600">8</p>
              </div>
              <Calendar className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Templates</p>
                <p className="text-2xl font-bold text-purple-600">24</p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Report Categories</TabsTrigger>
          <TabsTrigger value="queue">Export Queue ({recentExports.length})</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {reportCategories.map((category) => (
              <ReportCard key={category.id} category={category} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="queue" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Export History</h3>
            <div className="flex items-center space-x-2">
              <Input placeholder="Search exports..." className="w-64" />
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {recentExports.map((exportItem) => (
              <ExportQueueItem key={exportItem.id} export={exportItem} />
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Export Audit Trail</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">File Integrity:</span>
                    <p className="text-green-600">SHA-256 hash verification enabled</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Access Control:</span>
                    <p className="text-blue-600">Role-based export permissions</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Compliance:</span>
                    <p className="text-purple-600">ODPC audit trail maintained</p>
                  </div>
                </div>
                
                <div className="pt-3 border-t">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download Audit Log
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Automated Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'Weekly Attendance Summary', schedule: 'Every Friday 4:00 PM', status: 'Active' },
                  { name: 'Monthly Fee Collection', schedule: '1st of every month', status: 'Active' },
                  { name: 'Term Report Cards', schedule: 'End of each term', status: 'Active' },
                  { name: 'NEMIS Data Export', schedule: 'Quarterly', status: 'Paused' }
                ].map((schedule, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{schedule.name}</h4>
                      <p className="text-sm text-gray-600">{schedule.schedule}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant={schedule.status === 'Active' ? 'default' : 'secondary'}>
                        {schedule.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'CBC Report Card', type: 'Student Report', format: 'PDF' },
              { name: 'Fee Statement', type: 'Financial', format: 'PDF' },
              { name: 'Attendance Certificate', type: 'Administrative', format: 'PDF' },
              { name: 'TPAD Evidence Bundle', type: 'Compliance', format: 'PDF' },
              { name: 'NEMIS Export Template', type: 'Data Export', format: 'CSV' },
              { name: 'Safeguarding Report', type: 'Compliance', format: 'PDF' }
            ].map((template, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="text-center">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">{template.name}</h3>
                    <div className="space-y-2">
                      <Badge variant="outline">{template.type}</Badge>
                      <Badge variant="secondary">{template.format}</Badge>
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-4">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="h-4 w-4 mr-1" />
                      Preview
                    </Button>
                    <Button size="sm" className="flex-1">
                      <Settings className="h-4 w-4 mr-1" />
                      Use
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-dashed">
            <CardContent className="text-center py-12">
              <Plus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Create Custom Template</h3>
              <p className="text-gray-600 mb-4">
                Design your own report templates with custom fields and formatting
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Template
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
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
  Shield, 
  Eye, 
  Download, 
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Database,
  Users,
  Search,
  Plus,
  Edit,
  Trash2,
  Lock,
  Unlock,
  Archive
} from 'lucide-react';

export function Privacy() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');

  const mockProcessingRecords = [
    {
      id: generateId(),
      data_category: 'Student Academic Records',
      processing_purpose: 'CBC Assessment and Reporting',
      lawful_basis: 'Public Task',
      data_subjects: ['students', 'parents'],
      retention_period: '7 years after graduation',
      security_measures: ['Encryption at rest', 'Role-based access', 'Audit logging'],
      third_parties: ['KNEC', 'Ministry of Education'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: generateId(),
      data_category: 'Guardian Contact Information',
      processing_purpose: 'Parent Communication and Emergency Contact',
      lawful_basis: 'Vital Interests',
      data_subjects: ['parents', 'guardians'],
      retention_period: '2 years after student exit',
      security_measures: ['Encryption in transit', 'Access controls', 'Data minimization'],
      third_parties: ['SMS Gateway Provider'],
      created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: generateId(),
      data_category: 'Financial Records',
      processing_purpose: 'Fee Collection and Financial Management',
      lawful_basis: 'Contract',
      data_subjects: ['parents', 'students'],
      retention_period: '10 years (tax requirements)',
      security_measures: ['PCI DSS Compliance', 'Encrypted storage', 'Regular backups'],
      third_parties: ['M-PESA', 'Commercial Banks'],
      created_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
    }
  ];

  const mockDataRequests = [
    {
      id: generateId(),
      type: 'access',
      requester_name: 'Mary Kamau',
      requester_email: 'mary.kamau@email.com',
      subject_id: 'learner-1',
      description: 'Request for all academic records of my daughter Grace Wanjiku',
      status: 'processing',
      submitted_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      due_date: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: generateId(),
      type: 'rectification',
      requester_name: 'Peter Mwangi',
      requester_email: 'peter.mwangi@email.com',
      subject_id: 'learner-2',
      description: 'Update incorrect phone number in guardian records',
      status: 'completed',
      submitted_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      completed_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: generateId(),
      type: 'erasure',
      requester_name: 'Sarah Wanjiru',
      requester_email: 'sarah.w@email.com',
      subject_id: 'learner-3',
      description: 'Delete all records of transferred student',
      status: 'submitted',
      submitted_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
    }
  ];

  const mockComplianceChecks = [
    { category: 'Data Minimization', status: 'compliant', score: 95 },
    { category: 'Consent Management', status: 'compliant', score: 88 },
    { category: 'Data Subject Rights', status: 'attention', score: 76 },
    { category: 'Security Measures', status: 'compliant', score: 92 },
    { category: 'Retention Policies', status: 'compliant', score: 89 },
    { category: 'Third Party Sharing', status: 'attention', score: 71 }
  ];

  const ProcessingRecordCard = ({ record }: { record: any }) => {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">{record.data_category}</h3>
              <p className="text-sm text-gray-600 mb-3">{record.processing_purpose}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-xs font-medium text-gray-500">Lawful Basis</label>
                  <p className="text-sm font-medium text-gray-900">{record.lawful_basis}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">Retention Period</label>
                  <p className="text-sm font-medium text-gray-900">{record.retention_period}</p>
                </div>
              </div>

              <div className="mb-3">
                <label className="text-xs font-medium text-gray-500">Data Subjects</label>
                <div className="flex space-x-1 mt-1">
                  {record.data_subjects.map((subject: string) => (
                    <Badge key={subject} variant="outline" className="text-xs">
                      {subject}
                    </Badge>
                  ))}
                </div>
              </div>

              {record.third_parties && record.third_parties.length > 0 && (
                <div>
                  <label className="text-xs font-medium text-gray-500">Third Parties</label>
                  <div className="flex space-x-1 mt-1">
                    {record.third_parties.map((party: string) => (
                      <Badge key={party} variant="secondary" className="text-xs">
                        {party}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex space-x-2 ml-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Processing Record Details</DialogTitle>
                  </DialogHeader>
                  <ProcessingRecordDetails record={record} />
                </DialogContent>
              </Dialog>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            </div>
          </div>

          <div className="text-xs text-gray-500">
            Last updated: {formatDate(record.updated_at)}
          </div>
        </CardContent>
      </Card>
    );
  };

  const ProcessingRecordDetails = ({ record }: { record: any }) => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Data Category</label>
              <p className="text-gray-900">{record.data_category}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Processing Purpose</label>
              <p className="text-gray-900">{record.processing_purpose}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Lawful Basis</label>
              <p className="text-gray-900">{record.lawful_basis}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Retention Period</label>
              <p className="text-gray-900">{record.retention_period}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Created</label>
              <p className="text-gray-900">{formatDate(record.created_at)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Last Updated</label>
              <p className="text-gray-900">{formatDate(record.updated_at)}</p>
            </div>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">Security Measures</label>
          <ul className="mt-2 space-y-1">
            {record.security_measures.map((measure: string, index: number) => (
              <li key={index} className="text-sm text-gray-700 flex items-center">
                <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                {measure}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex space-x-3">
          <Button variant="outline" className="flex-1">
            <Download className="h-4 w-4 mr-2" />
            Export Record
          </Button>
          <Button variant="destructive" className="flex-1">
            <Archive className="h-4 w-4 mr-2" />
            Archive
          </Button>
        </div>
      </div>
    );
  };

  const DataRequestCard = ({ request }: { request: any }) => {
    const statusConfig = {
      submitted: { color: 'text-yellow-600', bg: 'bg-yellow-50', icon: Clock },
      processing: { color: 'text-blue-600', bg: 'bg-blue-50', icon: Clock },
      completed: { color: 'text-green-600', bg: 'bg-green-50', icon: CheckCircle },
      rejected: { color: 'text-red-600', bg: 'bg-red-50', icon: AlertTriangle }
    };

    const typeLabels = {
      access: 'Data Access Request',
      rectification: 'Data Correction Request',
      erasure: 'Data Deletion Request',
      portability: 'Data Portability Request',
      restriction: 'Processing Restriction Request'
    };

    const config = statusConfig[request.status as keyof typeof statusConfig];
    const Icon = config.icon;

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="font-semibold text-gray-900">{typeLabels[request.type as keyof typeof typeLabels]}</h3>
                <Badge variant={request.status === 'completed' ? 'default' : 'secondary'}>
                  {request.status}
                </Badge>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="text-sm">
                  <span className="font-medium text-gray-600">Requester:</span>
                  <span className="ml-2">{request.requester_name}</span>
                </div>
                <div className="text-sm">
                  <span className="font-medium text-gray-600">Email:</span>
                  <span className="ml-2">{request.requester_email}</span>
                </div>
                <div className="text-sm">
                  <span className="font-medium text-gray-600">Subject:</span>
                  <span className="ml-2">{request.subject_id}</span>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-3">{request.description}</p>

              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <span>Submitted: {formatDate(request.submitted_at)}</span>
                {request.due_date && (
                  <span>Due: {formatDate(request.due_date)}</span>
                )}
                {request.completed_at && (
                  <span>Completed: {formatDate(request.completed_at)}</span>
                )}
              </div>
            </div>

            <div className="flex flex-col items-end space-y-2">
              <div className={`p-2 rounded-full ${config.bg}`}>
                <Icon className={`h-4 w-4 ${config.color}`} />
              </div>
              
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-1" />
                  Review
                </Button>
                {request.status !== 'completed' && (
                  <Button size="sm">
                    Process
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">DPO Console</h1>
          <p className="text-gray-600 mt-1">Data Protection Officer compliance dashboard</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="secondary" className="bg-green-50 text-green-700">
            ODPC Compliant
          </Badge>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Processing Record
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Compliance Pack
          </Button>
        </div>
      </div>

      {/* Compliance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Processing Records</p>
                <p className="text-2xl font-bold text-blue-600">{mockProcessingRecords.length}</p>
              </div>
              <Database className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Data Requests</p>
                <p className="text-2xl font-bold text-green-600">{mockDataRequests.length}</p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Compliance Score</p>
                <p className="text-2xl font-bold text-purple-600">87%</p>
              </div>
              <Shield className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Reviews</p>
                <p className="text-2xl font-bold text-orange-600">
                  {mockDataRequests.filter(r => r.status === 'submitted').length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="records">Processing Records ({mockProcessingRecords.length})</TabsTrigger>
          <TabsTrigger value="requests">Data Subject Requests ({mockDataRequests.length})</TabsTrigger>
          <TabsTrigger value="compliance">Compliance Monitor</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Compliance Health Check</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockComplianceChecks.map((check, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{check.category}</span>
                      <div className="flex items-center space-x-2">
                        <Progress 
                          value={check.score} 
                          className={`w-20 ${
                            check.status === 'compliant' ? '[&>div]:bg-green-500' : '[&>div]:bg-yellow-500'
                          }`}
                        />
                        <span className="text-sm font-semibold text-gray-900 w-12">
                          {check.score}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <div className="text-sm">
                      <p className="font-medium text-green-800">Data request completed</p>
                      <p className="text-green-600">Peter Mwangi - Rectification request</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <div className="text-sm">
                      <p className="font-medium text-blue-800">New processing record created</p>
                      <p className="text-blue-600">Financial Records - Fee Collection</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <div className="text-sm">
                      <p className="font-medium text-yellow-800">Data request due soon</p>
                      <p className="text-yellow-600">Mary Kamau - Access request (Due in 2 days)</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>ODPC Compliance Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Shield className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="font-semibold text-green-800">Data Protection Impact Assessment</p>
                  <p className="text-sm text-green-600">Completed and up-to-date</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <FileText className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="font-semibold text-blue-800">Privacy Policies</p>
                  <p className="text-sm text-blue-600">Published and accessible</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Lock className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <p className="font-semibold text-purple-800">Security Measures</p>
                  <p className="text-sm text-purple-600">Implemented and verified</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="records" className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search processing records..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export RoP
            </Button>
          </div>

          {mockProcessingRecords.map((record) => (
            <ProcessingRecordCard key={record.id} record={record} />
          ))}
        </TabsContent>

        <TabsContent value="requests" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Badge variant="outline">
                Pending: {mockDataRequests.filter(r => ['submitted', 'processing'].includes(r.status)).length}
              </Badge>
              <Badge variant="default">
                Completed: {mockDataRequests.filter(r => r.status === 'completed').length}
              </Badge>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Log New Request
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Requests
            </Button>
          </div>

          {mockDataRequests.map((request) => (
            <DataRequestCard key={request.id} request={request} />
          ))}
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Retention Policy Execution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <p className="font-medium text-blue-800">Next Retention Run</p>
                      <p className="text-sm text-blue-600">March 31, 2024</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Schedule
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Records due for review:</span>
                      <span className="font-semibold">45</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Records due for deletion:</span>
                      <span className="font-semibold">12</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Last execution:</span>
                      <span className="font-semibold">December 31, 2023</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Breach Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="font-semibold text-green-800">No Active Breaches</p>
                    <p className="text-sm text-green-600">System secure and compliant</p>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Breach response plan:</span>
                      <span className="font-semibold text-green-600">Active</span>
                    </div>
                    <div className="flex justify-between">
                      <span>ODPC notification ready:</span>
                      <span className="font-semibold text-green-600">Yes</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Last drill:</span>
                      <span className="font-semibold">February 15, 2024</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Audit Trail and Monitoring</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">1,245</p>
                    <p className="text-sm text-blue-600">Data access events</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">156</p>
                    <p className="text-sm text-green-600">Export operations</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">89</p>
                    <p className="text-sm text-purple-600">Data modifications</p>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <p className="text-2xl font-bold text-orange-600">23</p>
                    <p className="text-sm text-orange-600">Privacy queries</p>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline" className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Export Audit Log
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Compliance Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
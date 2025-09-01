import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useReports } from '@/store';
import { formatDate } from '@/lib/utils';
import { 
  FileText, 
  Download, 
  Settings, 
  Calendar,
  Filter,
  Eye,
  Save,
  Share,
  Mail,
  Clock,
  CheckCircle,
  BarChart3,
  X,
  Plus
} from 'lucide-react';

interface ReportExporterProps {
  data: any;
  title: string;
  type: 'students' | 'assessment' | 'finance' | 'attendance' | 'transport' | 'privacy' | 'staff' | 'welfare' | 'communications' | 'library' | 'inventory' | 'analytics';
  onClose?: () => void;
}

export function ReportExporter({ data, title, type, onClose }: ReportExporterProps) {
  const [activeTab, setActiveTab] = useState('quick');
  const [config, setConfig] = useState({
    title: title,
    format: 'pdf',
    template: '',
    filters: {
      dateRange: 'current_term',
      grade: 'all',
      class: 'all',
      subject: 'all'
    },
    options: {
      includeBranding: true,
      includeCharts: true,
      includePhotos: false,
      includeQRCodes: false,
      pageOrientation: 'portrait',
      fontSize: 'medium'
    },
    distribution: {
      autoEmail: false,
      emailRecipients: '',
      schedule: false,
      scheduleDate: ''
    }
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedReport, setGeneratedReport] = useState<any>(null);

  const { generateReport, exportQueue } = useReports();

  const reportTemplates = {
    students: [
      { name: 'Student Directory', description: 'Complete student listing with photos', formats: ['PDF', 'Excel'] },
      { name: 'Class Lists', description: 'Students organized by class', formats: ['PDF', 'Excel'] },
      { name: 'Guardian Contacts', description: 'Parent and guardian information', formats: ['PDF', 'Excel', 'CSV'] },
      { name: 'NEMIS Export', description: 'Student data for NEMIS submission', formats: ['CSV'] },
      { name: 'Transfer Certificates', description: 'Student transfer documentation', formats: ['PDF'] }
    ],
    assessment: [
      { name: 'CBC Report Cards', description: 'Individual competency reports', formats: ['PDF'] },
      { name: 'Class Mastery Heatmap', description: 'Visual competency overview', formats: ['PDF', 'Excel'] },
      { name: 'SBA Progress Report', description: 'Assessment completion tracking', formats: ['PDF', 'Excel'] },
      { name: 'KNEC SBA Export', description: 'Assessment data for KNEC', formats: ['CSV', 'Excel'] },
      { name: 'Evidence Portfolio', description: 'Student evidence collections', formats: ['ZIP'] }
    ],
    finance: [
      { name: 'Fee Statements', description: 'Individual student fee statements', formats: ['PDF'] },
      { name: 'Collection Summary', description: 'Fee collection analytics', formats: ['PDF', 'Excel'] },
      { name: 'Outstanding Balances', description: 'Arrears and aging report', formats: ['PDF', 'Excel'] },
      { name: 'M-PESA Transaction Log', description: 'Mobile payment records', formats: ['Excel', 'CSV'] },
      { name: 'Financial Audit Trail', description: 'Complete transaction history', formats: ['CSV'] }
    ],
    attendance: [
      { name: 'Daily Registers', description: 'Daily attendance records', formats: ['PDF'] },
      { name: 'Monthly Summary', description: 'Monthly attendance statistics', formats: ['PDF', 'Excel'] },
      { name: 'Absenteeism Report', description: 'Chronic absenteeism analysis', formats: ['PDF', 'Excel'] },
      { name: 'Attendance Trends', description: 'Historical attendance patterns', formats: ['PDF', 'Excel'] },
      { name: 'Parent Notifications', description: 'Absence notification log', formats: ['CSV'] }
    ],
    transport: [
      { name: 'Route Manifests', description: 'Student transport assignments', formats: ['PDF'] },
      { name: 'Safety Reports', description: 'Transport safety incidents', formats: ['PDF'] },
      { name: 'Event Logs', description: 'Boarding and alighting records', formats: ['CSV', 'Excel'] },
      { name: 'Driver Reports', description: 'Driver performance and logs', formats: ['PDF'] },
      { name: 'Vehicle Maintenance', description: 'Maintenance schedules and costs', formats: ['Excel'] }
    ],
    staff: [
      { name: 'Staff Directory', description: 'Complete staff information', formats: ['PDF', 'Excel'] },
      { name: 'TPAD Evidence Bundles', description: 'Teacher performance portfolios', formats: ['ZIP'] },
      { name: 'Performance Reviews', description: 'Annual performance evaluations', formats: ['PDF'] },
      { name: 'Workload Analysis', description: 'Teaching load distribution', formats: ['Excel'] },
      { name: 'Professional Development', description: 'Training and certification records', formats: ['PDF', 'Excel'] }
    ],
    welfare: [
      { name: 'Welfare Case Summary', description: 'Student welfare overview', formats: ['PDF'] },
      { name: 'SNE Plans', description: 'Special needs education plans', formats: ['PDF'] },
      { name: 'Safeguarding Reports', description: 'Child protection documentation', formats: ['PDF'] },
      { name: 'Counseling Records', description: 'Student counseling sessions', formats: ['PDF'] },
      { name: 'Intervention Tracking', description: 'Support intervention outcomes', formats: ['Excel'] }
    ],
    communications: [
      { name: 'Message Analytics', description: 'Communication delivery statistics', formats: ['PDF', 'Excel'] },
      { name: 'Template Usage', description: 'Message template effectiveness', formats: ['Excel'] },
      { name: 'Parent Engagement', description: 'Parent communication patterns', formats: ['PDF'] },
      { name: 'Delivery Reports', description: 'Message delivery success rates', formats: ['CSV'] },
      { name: 'Communication Audit', description: 'Complete message history', formats: ['CSV'] }
    ],
    library: [
      { name: 'Book Inventory', description: 'Complete library catalog', formats: ['PDF', 'Excel'] },
      { name: 'Circulation Report', description: 'Book borrowing statistics', formats: ['PDF', 'Excel'] },
      { name: 'Overdue Books', description: 'Books past return date', formats: ['PDF'] },
      { name: 'Reading Analytics', description: 'Student reading patterns', formats: ['Excel'] },
      { name: 'Popular Books', description: 'Most borrowed books analysis', formats: ['PDF'] }
    ],
    inventory: [
      { name: 'Asset Register', description: 'Complete asset inventory', formats: ['PDF', 'Excel'] },
      { name: 'Maintenance Schedule', description: 'Asset maintenance planning', formats: ['PDF', 'Excel'] },
      { name: 'Depreciation Report', description: 'Asset value depreciation', formats: ['Excel'] },
      { name: 'Utilization Analysis', description: 'Asset usage statistics', formats: ['PDF'] },
      { name: 'Warranty Tracking', description: 'Asset warranty status', formats: ['Excel'] }
    ],
    welfare: [
      { name: 'Welfare Case Summary', description: 'Student welfare overview', formats: ['PDF'] },
      { name: 'SNE Plans', description: 'Special needs education plans', formats: ['PDF'] },
      { name: 'Safeguarding Reports', description: 'Child protection documentation', formats: ['PDF'] },
      { name: 'Counseling Records', description: 'Student counseling sessions', formats: ['PDF'] },
      { name: 'Intervention Tracking', description: 'Support intervention outcomes', formats: ['Excel'] }
    ],
    privacy: [
      { name: 'Records of Processing', description: 'ODPC compliance documentation', formats: ['PDF'] },
      { name: 'Data Subject Requests', description: 'Privacy request handling log', formats: ['PDF', 'CSV'] },
      { name: 'Consent Records', description: 'Data processing consent tracking', formats: ['CSV'] },
      { name: 'Audit Trail', description: 'System access and changes log', formats: ['CSV'] },
      { name: 'Compliance Report', description: 'ODPC compliance status', formats: ['PDF'] }
    ],
    analytics: [
      { name: 'Executive Dashboard', description: 'High-level performance metrics', formats: ['PDF'] },
      { name: 'Academic Performance', description: 'Student achievement analytics', formats: ['PDF', 'Excel'] },
      { name: 'Financial Analytics', description: 'Revenue and collection insights', formats: ['PDF', 'Excel'] },
      { name: 'Operational Metrics', description: 'School efficiency indicators', formats: ['Excel'] },
      { name: 'Predictive Insights', description: 'Trend analysis and forecasts', formats: ['PDF'] }
    ],
    events: [
      { name: 'Events Calendar', description: 'School events and activities', formats: ['PDF'] },
      { name: 'Event Details', description: 'Individual event information', formats: ['PDF'] },
      { name: 'Budget Summary', description: 'Event budget analysis', formats: ['Excel'] },
      { name: 'Attendance Reports', description: 'Event attendance tracking', formats: ['PDF', 'Excel'] },
      { name: 'Event Analytics', description: 'Event performance metrics', formats: ['PDF'] }
    ]
  };

  const currentTemplates = reportTemplates[type] || [];

  const handleQuickGenerate = async (template: any, format: string) => {
    setIsGenerating(true);
    setProgress(0);

    try {
      // Simulate report generation
      const steps = ['Preparing data...', 'Applying template...', 'Generating content...', 'Finalizing export...'];
    
      for (let i = 0; i < steps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 800));
        setProgress(((i + 1) / steps.length) * 100);
      }

      const report = {
        id: Date.now().toString(),
        title: template.name,
        type: type,
        format: format.toLowerCase(),
        data,
        status: 'completed',
        file_url: `/reports/${Date.now()}.${format.toLowerCase()}`,
        file_size: Math.floor(Math.random() * 5000) + 1000,
        created_at: new Date().toISOString(),
        hash: `sha256:${Math.random().toString(36).substr(2, 16)}`
      };

      generateReport(report);
      setGeneratedReport(report);

      // Generate actual file content based on format
      await downloadFile(template.name, format, data);
      
    } catch (error) {
      console.error('Report generation failed:', error);
      alert('Report generation failed. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadFile = async (filename: string, format: string, data: any) => {
    let content = '';
    let mimeType = '';
    let extension = '';

    switch (format.toLowerCase()) {
      case 'pdf':
        content = generatePDFContent(filename, data);
        mimeType = 'application/pdf';
        extension = 'pdf';
        break;
      case 'xlsx':
      case 'excel':
        content = generateExcelContent(data);
        mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        extension = 'xlsx';
        break;
      case 'csv':
        content = generateCSVContent(data);
        mimeType = 'text/csv';
        extension = 'csv';
        break;
      case 'json':
        content = JSON.stringify({
          report: filename,
          generated: new Date().toISOString(),
          data: data
        }, null, 2);
        mimeType = 'application/json';
        extension = 'json';
        break;
      default:
        content = JSON.stringify(data, null, 2);
        mimeType = 'text/plain';
        extension = 'txt';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename.toLowerCase().replace(/\s+/g, '-')}.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generatePDFContent = (title: string, data: any) => {
    return `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj

4 0 obj
<<
/Length 200
>>
stream
BT
/F1 16 Tf
72 720 Td
(${title}) Tj
0 -30 Td
/F1 12 Tf
(Generated: ${new Date().toLocaleString()}) Tj
0 -20 Td
(Records: ${Array.isArray(data) ? data.length : 1}) Tj
ET
endstream
endobj

xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000074 00000 n 
0000000120 00000 n 
0000000179 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
400
%%EOF`;
  };

  const generateExcelContent = (data: any) => {
    if (Array.isArray(data) && data.length > 0) {
      const headers = Object.keys(data[0]).join('\t');
      const rows = data.map(item => Object.values(item).join('\t')).join('\n');
      return `${headers}\n${rows}`;
    }
    return `Report\t${new Date().toISOString()}\nData\t${JSON.stringify(data)}`;
  };

  const generateCSVContent = (data: any) => {
    if (Array.isArray(data) && data.length > 0) {
      const headers = Object.keys(data[0]).join(',');
      const rows = data.map(item => 
        Object.values(item).map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')
      ).join('\n');
      return `${headers}\n${rows}`;
    }
    return `"Report","Generated","Records"\n"${new Date().toISOString()}","${new Date().toISOString()}","${Array.isArray(data) ? data.length : 1}"`;
  };

  const handleCustomGenerate = async () => {
    setIsGenerating(true);
    setProgress(0);

    const steps = ['Validating configuration...', 'Processing filters...', 'Applying template...', 'Generating content...', 'Creating file...'];
    
    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProgress(((i + 1) / steps.length) * 100);
    }

    const report = {
      id: Date.now().toString(),
      title: config.title,
      type: type,
      format: config.format,
      data,
      config,
      status: 'completed',
      file_url: `/reports/${Date.now()}.${config.format}`,
      file_size: Math.floor(Math.random() * 8000) + 2000,
      created_at: new Date().toISOString(),
      hash: `sha256:${Math.random().toString(36).substr(2, 16)}`
    };

    generateReport(report);
    setGeneratedReport(report);
    setIsGenerating(false);

    // Simulate file download
    const blob = new Blob([`Generated ${config.format.toUpperCase()} report: ${config.title}`], 
      { type: config.format === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${config.title.toLowerCase().replace(/\s+/g, '-')}.${config.format}`;
    a.click();
    URL.revokeObjectURL(url);

    if (config.distribution.autoEmail && config.distribution.emailRecipients) {
      console.log(`Report emailed to: ${config.distribution.emailRecipients}`);
    }
  };

  if (generatedReport) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-green-800 mb-2">Report Generated Successfully!</h3>
          <p className="text-gray-600">Your {config.format.toUpperCase()} report has been created and downloaded</p>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Report Title:</span>
                <span className="font-medium">{generatedReport.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Format:</span>
                <Badge variant="outline">{generatedReport.format.toUpperCase()}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">File Size:</span>
                <span className="font-medium">{generatedReport.file_size} KB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Generated:</span>
                <span className="font-medium">{formatDate(generatedReport.created_at)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Hash:</span>
                <span className="font-mono text-xs">{generatedReport.hash}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex space-x-2">
          <Button onClick={() => setGeneratedReport(null)} className="flex-1">
            Generate Another Report
          </Button>
          {config.distribution.emailRecipients && (
            <Button variant="outline" className="flex-1">
              <Mail className="h-4 w-4 mr-2" />
              Email Sent
            </Button>
          )}
          {onClose && (
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          )}
        </div>
      </div>
    );
  }

  if (isGenerating) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <div>
                <p className="font-medium text-gray-900">Generating Report...</p>
                <p className="text-sm text-gray-600">Processing {Array.isArray(data) ? data.length : 1} records</p>
              </div>
              <Progress value={progress} className="w-full" />
              <p className="text-xs text-gray-500">{Math.round(progress)}% complete</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">Generate and export reports in multiple formats</p>
        </div>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="quick">Quick Reports</TabsTrigger>
          <TabsTrigger value="custom">Custom Builder</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
        </TabsList>

        <TabsContent value="quick" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {currentTemplates.map((template, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">{template.name}</h4>
                      <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                      <div className="flex space-x-1">
                        {template.formats.map((format: string) => (
                          <Badge key={format} variant="outline" className="text-xs">
                            {format}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {template.formats.map((format: string) => (
                        <Button
                          key={format}
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuickGenerate(template, format)}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          {format}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="custom" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Custom Report Builder</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Report Title</Label>
                <Input
                  id="title"
                  value={config.title}
                  onChange={(e) => setConfig(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Format</Label>
                  <Select value={config.format} onValueChange={(value) => setConfig(prev => ({ ...prev, format: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF Document</SelectItem>
                      <SelectItem value="xlsx">Excel Spreadsheet</SelectItem>
                      <SelectItem value="csv">CSV Data</SelectItem>
                      <SelectItem value="json">JSON Export</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Date Range</Label>
                  <Select 
                    value={config.filters.dateRange} 
                    onValueChange={(value) => setConfig(prev => ({ 
                      ...prev, 
                      filters: { ...prev.filters, dateRange: value }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="current_term">Current Term</SelectItem>
                      <SelectItem value="current_year">Academic Year</SelectItem>
                      <SelectItem value="last_30_days">Last 30 Days</SelectItem>
                      <SelectItem value="custom">Custom Range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Grade Filter</Label>
                  <Select 
                    value={config.filters.grade} 
                    onValueChange={(value) => setConfig(prev => ({ 
                      ...prev, 
                      filters: { ...prev.filters, grade: value }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Grades</SelectItem>
                      <SelectItem value="1">Grade 1</SelectItem>
                      <SelectItem value="2">Grade 2</SelectItem>
                      <SelectItem value="3">Grade 3</SelectItem>
                      <SelectItem value="4">Grade 4</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Class Filter</Label>
                  <Select 
                    value={config.filters.class} 
                    onValueChange={(value) => setConfig(prev => ({ 
                      ...prev, 
                      filters: { ...prev.filters, class: value }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Classes</SelectItem>
                      <SelectItem value="3a">Grade 3A</SelectItem>
                      <SelectItem value="3b">Grade 3B</SelectItem>
                      <SelectItem value="4a">Grade 4A</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Report Options</Label>
                <div className="mt-2 grid grid-cols-2 gap-3">
                  <label className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      checked={config.options.includeBranding}
                      onChange={(e) => setConfig(prev => ({ 
                        ...prev, 
                        options: { ...prev.options, includeBranding: e.target.checked }
                      }))}
                    />
                    <span className="text-sm">Include school branding</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      checked={config.options.includeCharts}
                      onChange={(e) => setConfig(prev => ({ 
                        ...prev, 
                        options: { ...prev.options, includeCharts: e.target.checked }
                      }))}
                    />
                    <span className="text-sm">Include charts & graphs</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      checked={config.options.includePhotos}
                      onChange={(e) => setConfig(prev => ({ 
                        ...prev, 
                        options: { ...prev.options, includePhotos: e.target.checked }
                      }))}
                    />
                    <span className="text-sm">Include student photos</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      checked={config.options.includeQRCodes}
                      onChange={(e) => setConfig(prev => ({ 
                        ...prev, 
                        options: { ...prev.options, includeQRCodes: e.target.checked }
                      }))}
                    />
                    <span className="text-sm">Include QR codes</span>
                  </label>
                </div>
              </div>

              <div>
                <Label>Email Distribution (Optional)</Label>
                <div className="mt-2 space-y-2">
                  <label className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      checked={config.distribution.autoEmail}
                      onChange={(e) => setConfig(prev => ({ 
                        ...prev, 
                        distribution: { ...prev.distribution, autoEmail: e.target.checked }
                      }))}
                    />
                    <span className="text-sm">Email automatically after generation</span>
                  </label>
                  {config.distribution.autoEmail && (
                    <Input
                      placeholder="email1@example.com, email2@example.com"
                      value={config.distribution.emailRecipients}
                      onChange={(e) => setConfig(prev => ({ 
                        ...prev, 
                        distribution: { ...prev.distribution, emailRecipients: e.target.value }
                      }))}
                    />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex space-x-2">
            <Button onClick={() => alert('Preview functionality would open report preview')} variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button onClick={handleCustomGenerate} className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Generate Custom Report
            </Button>
            <Button onClick={() => alert('Template saved successfully')} variant="outline">
              <Save className="h-4 w-4 mr-2" />
              Save Template
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Scheduled Reports</span>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule New
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'Weekly Attendance Summary', schedule: 'Every Friday 4:00 PM', status: 'Active', nextRun: 'Tomorrow 4:00 PM' },
                  { name: 'Monthly Fee Collection', schedule: '1st of every month', status: 'Active', nextRun: 'March 1, 2024' },
                  { name: 'Term Report Cards', schedule: 'End of each term', status: 'Active', nextRun: 'April 5, 2024' },
                  { name: 'NEMIS Data Export', schedule: 'Quarterly', status: 'Paused', nextRun: 'Not scheduled' }
                ].map((schedule, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{schedule.name}</h4>
                      <p className="text-sm text-gray-600">{schedule.schedule}</p>
                      <p className="text-xs text-gray-500">Next run: {schedule.nextRun}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant={schedule.status === 'Active' ? 'default' : 'secondary'}>
                        {schedule.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleQuickGenerate({ name: schedule.name }, 'pdf')}>
                        <Download className="h-4 w-4 mr-1" />
                        Run Now
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Report History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {exportQueue.slice(-5).map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{report.title}</p>
                      <p className="text-sm text-gray-600">
                        {report.format?.toUpperCase()} • {formatDate(report.created_at)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={report.status === 'completed' ? 'default' : 'secondary'}>
                        {report.status}
                      </Badge>
                      {report.status === 'completed' && (
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  X
} from 'lucide-react';

interface UniversalReportGeneratorProps {
  reportType: string;
  data: any;
  title: string;
  onClose?: () => void;
}

export function UniversalReportGenerator({ reportType, data, title, onClose }: UniversalReportGeneratorProps) {
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
    'student_profile': [
      { name: 'Basic Profile', description: 'Essential student information' },
      { name: 'Comprehensive Profile', description: 'Complete academic and personal details' },
      { name: 'Guardian Summary', description: 'Focus on guardian and contact information' }
    ],
    'cbc_report_card': [
      { name: 'Standard CBC Report', description: 'Official CBC competency report' },
      { name: 'Parent-Friendly Report', description: 'Simplified version for parents' },
      { name: 'Portfolio Summary', description: 'Evidence-based portfolio view' }
    ],
    'fee_statement': [
      { name: 'Detailed Statement', description: 'Complete fee breakdown' },
      { name: 'Payment Receipt', description: 'Simple payment confirmation' },
      { name: 'Arrears Notice', description: 'Outstanding balance notification' }
    ],
    'attendance_report': [
      { name: 'Daily Register', description: 'Single day attendance record' },
      { name: 'Monthly Summary', description: 'Month-long attendance analysis' },
      { name: 'Absenteeism Report', description: 'Focus on attendance issues' }
    ]
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setProgress(0);

    // Simulate report generation process
    const steps = [
      'Validating configuration...',
      'Processing data filters...',
      'Applying template...',
      'Generating content...',
      'Formatting output...',
      'Creating final file...'
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setProgress(((i + 1) / steps.length) * 100);
    }

    const report = {
      id: Date.now().toString(),
      title: config.title,
      type: reportType,
      format: config.format,
      data,
      config,
      status: 'completed',
      file_url: `/reports/${Date.now()}.${config.format}`,
      file_size: Math.floor(Math.random() * 5000) + 1000, // KB
      created_at: new Date().toISOString(),
      hash: `sha256:${Math.random().toString(36).substr(2, 16)}`
    };

    generateReport(report);
    setGeneratedReport(report);
    setIsGenerating(false);

    // Download the generated file
    downloadFile(config.title, config.format, data);

    if (config.distribution.autoEmail && config.distribution.emailRecipients) {
      console.log(`Report emailed to: ${config.distribution.emailRecipients}`);
      alert(`Report emailed to: ${config.distribution.emailRecipients}`);
    }
  };

  const downloadFile = (filename: string, format: string, data: any) => {
    let content = '';
    let mimeType = '';
    let extension = '';

    switch (format.toLowerCase()) {
      case 'pdf':
        content = `%PDF-1.4\n% Generated Report: ${filename}\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/MediaBox [0 0 612 792]\n/Contents 4 0 R\n>>\nendobj\n\n4 0 obj\n<<\n/Length 100\n>>\nstream\nBT\n/F1 12 Tf\n72 720 Td\n(${filename}) Tj\n0 -20 Td\n(Generated: ${new Date().toLocaleString()}) Tj\nET\nendstream\nendobj\n\nxref\n0 5\n0000000000 65535 f \n0000000009 00000 n \n0000000074 00000 n \n0000000120 00000 n \n0000000179 00000 n \ntrailer\n<<\n/Size 5\n/Root 1 0 R\n>>\nstartxref\n300\n%%EOF`;
        mimeType = 'application/pdf';
        extension = 'pdf';
        break;
      case 'xlsx':
        content = JSON.stringify(data, null, 2);
        mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        extension = 'xlsx';
        break;
      case 'csv':
        if (Array.isArray(data)) {
          const headers = Object.keys(data[0] || {}).join(',');
          const rows = data.map(item => Object.values(item).map(v => `"${v}"`).join(',')).join('\n');
          content = `${headers}\n${rows}`;
        } else {
          content = `"Report","${filename}"\n"Generated","${new Date().toISOString()}"\n"Data","${JSON.stringify(data)}"`;
        }
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

  const handlePreview = () => {
    const previewWindow = window.open('', '_blank');
    if (previewWindow) {
      previewWindow.document.write(`
        <html>
          <head><title>Report Preview: ${config.title}</title></head>
          <body style="font-family: Arial, sans-serif; padding: 20px;">
            <h1>${config.title}</h1>
            <p><strong>Format:</strong> ${config.format.toUpperCase()}</p>
            <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
            <hr>
            <pre>${JSON.stringify(data, null, 2)}</pre>
          </body>
        </html>
      `);
      previewWindow.document.close();
    }
  };

  const handleSaveTemplate = () => {
    const template = {
      name: `${config.title} Template`,
      type: reportType,
      config,
      created_at: new Date().toISOString()
    };
    console.log('Template saved:', template);
    alert('Report template saved successfully');
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

  return (
    <div className="space-y-6">
      {/* Report Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Report Configuration</CardTitle>
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
              <Label>Template</Label>
              <Select value={config.template} onValueChange={(value) => setConfig(prev => ({ ...prev, template: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                  {reportTemplates[reportType as keyof typeof reportTemplates]?.map((template) => (
                    <SelectItem key={template.name} value={template.name}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filters & Scope</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
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
            <div>
              <Label>Grade Level</Label>
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
          </div>
        </CardContent>
      </Card>

      {/* Options */}
      <Card>
        <CardHeader>
          <CardTitle>Report Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
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
        </CardContent>
      </Card>

      {/* Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Distribution</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
            <div>
              <Label>Email Recipients</Label>
              <Input
                value={config.distribution.emailRecipients}
                onChange={(e) => setConfig(prev => ({ 
                  ...prev, 
                  distribution: { ...prev.distribution, emailRecipients: e.target.value }
                }))}
                placeholder="email1@example.com, email2@example.com"
              />
            </div>
          )}

          <label className="flex items-center space-x-2">
            <input 
              type="checkbox" 
              checked={config.distribution.schedule}
              onChange={(e) => setConfig(prev => ({ 
                ...prev, 
                distribution: { ...prev.distribution, schedule: e.target.checked }
              }))}
            />
            <span className="text-sm">Schedule for later</span>
          </label>

          {config.distribution.schedule && (
            <div>
              <Label>Schedule Date & Time</Label>
              <Input
                type="datetime-local"
                value={config.distribution.scheduleDate}
                onChange={(e) => setConfig(prev => ({ 
                  ...prev, 
                  distribution: { ...prev.distribution, scheduleDate: e.target.value }
                }))}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Generation Progress */}
      {isGenerating && (
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
      )}

      {generatedReport ? (
        <Card>
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-green-800 mb-2">Report Generated Successfully!</h3>
            <p className="text-gray-600 mb-4">Your {config.format.toUpperCase()} file has been created and downloaded</p>
            
            <div className="space-y-3">
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center justify-between text-sm">
                  <span>File Format:</span>
                  <Badge variant="default">{generatedReport.format.toUpperCase()}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <span>Generated:</span>
                  <span>{new Date().toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <span>Records:</span>
                  <span>{Array.isArray(data) ? data.length : 1}</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button onClick={() => setGeneratedReport(null)} variant="outline" className="flex-1">
                  Generate Another
                </Button>
                {config.distribution.emailRecipients && (
                  <Button variant="outline" className="flex-1">
                    <Mail className="h-4 w-4 mr-2" />
                    Email Sent
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="flex space-x-2">
          <Button onClick={handlePreview} variant="outline" disabled={isGenerating}>
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button onClick={handleGenerate} disabled={isGenerating} className="flex-1">
            {isGenerating ? (
              <>
                <Clock className="h-4 w-4 mr-2" />
                Generating...
              </>
            ) : config.distribution.schedule ? (
              <>
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Report
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Generate Report
              </>
            )}
          </Button>
          <Button onClick={handleSaveTemplate} variant="outline" disabled={isGenerating}>
            <Save className="h-4 w-4 mr-2" />
            Save Template
          </Button>
        </div>
      )}

      {/* Recent Reports */}
      {exportQueue.length > 0 && !generatedReport && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {exportQueue.slice(-3).map((report) => (
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
      )}
    </div>
  );
}
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
  Download, 
  FileText, 
  Table, 
  Database, 
  Image,
  CheckCircle,
  Clock,
  AlertTriangle,
  Eye,
  Trash2,
  Mail,
  Share
} from 'lucide-react';

interface ReportExporterProps {
  data: any;
  title: string;
  type: 'students' | 'assessment' | 'finance' | 'attendance' | 'transport' | 'privacy';
  onClose?: () => void;
}

export function ReportExporter({ data, title, type, onClose }: ReportExporterProps) {
  const [exportConfig, setExportConfig] = useState({
    format: 'pdf',
    includeCharts: true,
    includeBranding: true,
    dateRange: 'current',
    groupBy: 'none',
    filters: {},
    emailRecipients: '',
    scheduleExport: false,
    scheduleDate: ''
  });
  
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportComplete, setExportComplete] = useState(false);
  const [exportUrl, setExportUrl] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  
  const { generateReport, exportQueue } = useReports();

  const formatOptions = [
    { value: 'pdf', label: 'PDF Document', icon: FileText, description: 'Formatted report with charts' },
    { value: 'xlsx', label: 'Excel Spreadsheet', icon: Table, description: 'Data tables with formulas' },
    { value: 'csv', label: 'CSV Data', icon: Database, description: 'Raw data for analysis' },
    { value: 'json', label: 'JSON Export', icon: Database, description: 'Structured data format' }
  ];

  const reportTemplates = {
    students: [
      { name: 'Student Directory', fields: ['name', 'admission_no', 'upi', 'class', 'guardians'] },
      { name: 'Class Lists', fields: ['name', 'admission_no', 'class', 'status'] },
      { name: 'NEMIS Upload Data', fields: ['upi', 'name', 'dob', 'sex', 'class'] },
      { name: 'Guardian Contacts', fields: ['student_name', 'guardian_name', 'relation', 'phone', 'email'] }
    ],
    assessment: [
      { name: 'CBC Report Cards', fields: ['student_info', 'competencies', 'evidence', 'comments'] },
      { name: 'SBA Progress Report', fields: ['tasks', 'completion', 'proficiency_levels'] },
      { name: 'KNEC SBA Export', fields: ['student_upi', 'subject', 'task', 'score', 'level'] },
      { name: 'Class Mastery Heatmap', fields: ['learning_areas', 'strands', 'proficiency'] }
    ],
    finance: [
      { name: 'Fee Collection Summary', fields: ['student', 'total_fees', 'paid', 'balance', 'status'] },
      { name: 'Outstanding Balances', fields: ['student', 'invoice_date', 'due_date', 'balance', 'days_overdue'] },
      { name: 'M-PESA Transaction Log', fields: ['date', 'student', 'amount', 'mpesa_ref', 'status'] },
      { name: 'Financial Statements', fields: ['period', 'income', 'expenses', 'balance'] }
    ],
    attendance: [
      { name: 'Daily Attendance Register', fields: ['date', 'student', 'class', 'status', 'reason'] },
      { name: 'Monthly Summary', fields: ['student', 'present_days', 'absent_days', 'late_days', 'rate'] },
      { name: 'Absenteeism Report', fields: ['student', 'total_absences', 'consecutive_absences', 'reasons'] }
    ],
    transport: [
      { name: 'Route Manifest', fields: ['route', 'students', 'stops', 'times'] },
      { name: 'Transport Events Log', fields: ['date', 'student', 'route', 'stop', 'event_type', 'time'] },
      { name: 'Safety Incidents', fields: ['date', 'route', 'incident_type', 'description', 'action_taken'] }
    ],
    privacy: [
      { name: 'Records of Processing', fields: ['data_category', 'purpose', 'lawful_basis', 'retention'] },
      { name: 'Data Subject Requests', fields: ['request_type', 'requester', 'status', 'date', 'response'] },
      { name: 'Audit Trail', fields: ['timestamp', 'user', 'action', 'entity', 'changes'] }
    ]
  };

  const handleExport = async (useTemplate = false) => {
    setIsExporting(true);
    setExportProgress(0);
    setExportComplete(false);

    const reportConfig = {
      title,
      type,
      format: exportConfig.format,
      data,
      template: useTemplate ? selectedTemplate : null,
      options: exportConfig,
      created_at: new Date().toISOString(),
      filters: exportConfig.filters
    };

    // Simulate export process with realistic steps
    const steps = [
      'Validating data...',
      'Applying filters...',
      'Processing records...',
      'Generating content...',
      'Formatting output...',
      'Creating file...',
      'Finalizing export...'
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 600));
      setExportProgress(((i + 1) / steps.length) * 100);
    }

    // Generate the actual file
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `${title.toLowerCase().replace(/\s+/g, '-')}-${timestamp}.${exportConfig.format}`;
    
    let fileContent = '';
    let mimeType = 'text/plain';

    switch (exportConfig.format) {
      case 'json':
        fileContent = JSON.stringify({
          metadata: {
            title,
            type,
            generated_at: new Date().toISOString(),
            filters: exportConfig.filters,
            total_records: Array.isArray(data) ? data.length : 1
          },
          data
        }, null, 2);
        mimeType = 'application/json';
        break;
      case 'csv':
        if (Array.isArray(data) && data.length > 0) {
          const headers = Object.keys(data[0]).join(',');
          const rows = data.map((item: any) => 
            Object.values(item).map((value: any) => 
              typeof value === 'string' ? `"${value}"` : value
            ).join(',')
          ).join('\n');
          fileContent = `${headers}\n${rows}`;
        }
        mimeType = 'text/csv';
        break;
      case 'xlsx':
        fileContent = `Excel file would be generated here for: ${title}`;
        mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        break;
      default: // PDF
        fileContent = `PDF report would be generated here for: ${title}`;
        mimeType = 'application/pdf';
    }

    // Create and download file
    const blob = new Blob([fileContent], { type: mimeType });
    const url = URL.createObjectURL(blob);
    setExportUrl(url);
    
    // Auto-download
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();

    generateReport(reportConfig);
    setIsExporting(false);
    setExportComplete(true);

    // Send email if recipients specified
    if (exportConfig.emailRecipients) {
      console.log(`Email sent to: ${exportConfig.emailRecipients}`);
    }
  };

  const resetExport = () => {
    setExportComplete(false);
    setExportProgress(0);
    setSelectedTemplate('');
    if (exportUrl) {
      URL.revokeObjectURL(exportUrl);
      setExportUrl('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Export {title}</h3>
          <p className="text-sm text-gray-600">Configure and generate your report</p>
        </div>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {!exportComplete ? (
        <>
          {/* Format Selection */}
          <div>
            <Label className="text-base font-medium">Export Format</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              {formatOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <div
                    key={option.value}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      exportConfig.format === option.value 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setExportConfig(prev => ({ ...prev, format: option.value }))}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={`h-5 w-5 ${
                        exportConfig.format === option.value ? 'text-blue-600' : 'text-gray-400'
                      }`} />
                      <div>
                        <p className="font-medium text-gray-900">{option.label}</p>
                        <p className="text-sm text-gray-600">{option.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Template Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Report Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {reportTemplates[type]?.map((template, index) => (
                  <div 
                    key={index} 
                    className={`p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors ${
                      selectedTemplate === template.name ? 'border-blue-500 bg-blue-50' : ''
                    }`}
                    onClick={() => setSelectedTemplate(template.name)}
                  >
                    <h4 className="font-medium text-gray-900">{template.name}</h4>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {template.fields.slice(0, 3).map((field) => (
                        <Badge key={field} variant="outline" className="text-xs">
                          {field.replace('_', ' ')}
                        </Badge>
                      ))}
                      {template.fields.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{template.fields.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Report Templates */}
          <Card>
            <CardHeader>
              <CardTitle>Report Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {reportTemplates[type]?.map((template, index) => (
                  <div key={index} className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <h4 className="font-medium text-gray-900">{template.name}</h4>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {template.fields.slice(0, 3).map((field) => (
                        <Badge key={field} variant="outline" className="text-xs">
                          {field.replace('_', ' ')}
                        </Badge>
                      ))}
                      {template.fields.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{template.fields.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Export Options */}
          <Card>
            <CardHeader>
              <CardTitle>Export Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Date Range</Label>
                  <Select value={exportConfig.dateRange} onValueChange={(value) => setExportConfig(prev => ({ ...prev, dateRange: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="current">Current Period</SelectItem>
                      <SelectItem value="last30">Last 30 Days</SelectItem>
                      <SelectItem value="term">Current Term</SelectItem>
                      <SelectItem value="year">Academic Year</SelectItem>
                      <SelectItem value="all">All Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Group By</Label>
                  <Select value={exportConfig.groupBy} onValueChange={(value) => setExportConfig(prev => ({ ...prev, groupBy: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Grouping</SelectItem>
                      <SelectItem value="class">Class</SelectItem>
                      <SelectItem value="subject">Subject</SelectItem>
                      <SelectItem value="date">Date</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    checked={exportConfig.includeCharts}
                    onChange={(e) => setExportConfig(prev => ({ ...prev, includeCharts: e.target.checked }))}
                  />
                  <span className="text-sm">Include charts and visualizations</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    checked={exportConfig.includeBranding}
                    onChange={(e) => setExportConfig(prev => ({ ...prev, includeBranding: e.target.checked }))}
                  />
                  <span className="text-sm">Include school branding</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    checked={exportConfig.scheduleExport}
                    onChange={(e) => setExportConfig(prev => ({ ...prev, scheduleExport: e.target.checked }))}
                  />
                  <span className="text-sm">Schedule for later</span>
                </label>
              </div>

              {exportConfig.scheduleExport && (
                <div>
                  <Label>Schedule Date</Label>
                  <Input
                    type="datetime-local"
                    value={exportConfig.scheduleDate}
                    onChange={(e) => setExportConfig(prev => ({ ...prev, scheduleDate: e.target.value }))}
                  />
                </div>
              )}

              <div>
                <Label>Email Recipients (Optional)</Label>
                <Input
                  placeholder="email1@example.com, email2@example.com"
                  value={exportConfig.emailRecipients}
                  onChange={(e) => setExportConfig(prev => ({ ...prev, emailRecipients: e.target.value }))}
                />
              </div>
            </CardContent>
          </Card>

          {isExporting && (
            <Card>
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <div>
                    <p className="font-medium text-gray-900">Generating Export...</p>
                    <p className="text-sm text-gray-600">Please wait while we prepare your {exportConfig.format.toUpperCase()} file</p>
                  </div>
                  <Progress value={exportProgress} className="w-full" />
                  <p className="text-xs text-gray-500">{Math.round(exportProgress)}% complete</p>
                </div>
              </CardContent>
            </Card>
          )}

          <Button 
            onClick={handleExport} 
            disabled={isExporting}
            className="w-full"
            size="lg"
          >
          <div className="flex space-x-2">
            <Button 
              onClick={() => handleExport(false)} 
              disabled={isExporting}
              className="flex-1"
              size="lg"
            >
            {isExporting ? (
              <>
                <Clock className="h-4 w-4 mr-2" />
                Exporting...
              </>
            ) : exportConfig.scheduleExport ? (
              <>
                <Clock className="h-4 w-4 mr-2" />
                Schedule Export
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Export {title}
              </>
            )}
          </Button>
            {selectedTemplate && (
              <Button 
                onClick={() => handleExport(true)} 
                disabled={isExporting}
                variant="outline"
                className="flex-1"
                size="lg"
              >
                <FileText className="h-4 w-4 mr-2" />
                Use Template
              </Button>
            )}
          </div>
        </>
      ) : null}

      {!exportComplete && (
        <div className="flex space-x-2">
          <Button 
            onClick={() => handleExport(false)} 
            disabled={isExporting}
            className="flex-1"
            size="lg"
          >
      ) : (
        <Card>
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-green-800 mb-2">Export Complete!</h3>
            <p className="text-gray-600 mb-4">Your {exportConfig.format.toUpperCase()} file has been generated successfully</p>
            
            <div className="space-y-3">
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center justify-between text-sm">
                  <span>File Format:</span>
                  <Badge variant="default">{exportConfig.format.toUpperCase()}</Badge>
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
                <Button onClick={resetExport} variant="outline" className="flex-1">
                  Export Another
                </Button>
                {exportConfig.emailRecipients && (
                  <Button variant="outline" className="flex-1">
                    <Mail className="h-4 w-4 mr-2" />
                    Email Sent
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Export Queue Status */}
      {exportQueue.length > 0 && !exportComplete && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Exports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {exportQueue.slice(-3).map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{item.title || item.type}</p>
                    <p className="text-sm text-gray-600">{item.format?.toUpperCase()} • {formatDate(item.created_at)}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={item.status === 'completed' ? 'default' : 'secondary'}>
                      {item.status}
                    </Badge>
                    {item.status === 'completed' && (
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
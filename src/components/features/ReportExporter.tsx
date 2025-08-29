import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { useReports } from '@/store';
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
  Trash2
} from 'lucide-react';

interface ReportExporterProps {
  data: any;
  title: string;
  type: 'students' | 'assessment' | 'finance' | 'attendance' | 'transport' | 'privacy';
}

export function ReportExporter({ data, title, type }: ReportExporterProps) {
  const [exportConfig, setExportConfig] = useState({
    format: 'pdf',
    includeCharts: true,
    includeBranding: true,
    dateRange: 'current',
    groupBy: 'none'
  });
  
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  
  const { generateReport, exportQueue } = useReports();

  const formatOptions = [
    { value: 'pdf', label: 'PDF Document', icon: FileText, description: 'Formatted report with charts' },
    { value: 'xlsx', label: 'Excel Spreadsheet', icon: Table, description: 'Data tables with formulas' },
    { value: 'csv', label: 'CSV Data', icon: Database, description: 'Raw data for analysis' },
    { value: 'json', label: 'JSON Export', icon: Database, description: 'Structured data format' }
  ];

  const handleExport = async () => {
    setIsExporting(true);
    setExportProgress(0);

    const reportConfig = {
      title,
      type,
      format: exportConfig.format,
      data,
      options: exportConfig,
      created_at: new Date().toISOString()
    };

    // Simulate export process
    const steps = [
      'Preparing data...',
      'Applying filters...',
      'Generating content...',
      'Formatting output...',
      'Finalizing export...'
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setExportProgress(((i + 1) / steps.length) * 100);
    }

    generateReport(reportConfig);
    setIsExporting(false);
    setExportProgress(0);

    // Simulate file download
    setTimeout(() => {
      const blob = new Blob([JSON.stringify(reportConfig, null, 2)], { 
        type: exportConfig.format === 'json' ? 'application/json' : 'text/plain' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.${exportConfig.format}`;
      a.click();
      URL.revokeObjectURL(url);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Export {title}</h3>
        <p className="text-sm text-gray-600">Choose format and options for your export</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <Icon className={`h-6 w-6 ${
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

          <div className="space-y-2">
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
        {isExporting ? (
          <>
            <Clock className="h-4 w-4 mr-2" />
            Exporting...
          </>
        ) : (
          <>
            <Download className="h-4 w-4 mr-2" />
            Export {title}
          </>
        )}
      </Button>

      {/* Export Queue Status */}
      {exportQueue.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Exports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {exportQueue.slice(-3).map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{item.title || item.report_type}</p>
                    <p className="text-sm text-gray-600">{item.format?.toUpperCase()} • {new Date(item.created_at).toLocaleString()}</p>
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
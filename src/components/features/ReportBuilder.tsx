import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Download, 
  Eye, 
  Settings, 
  Calendar,
  Users,
  Filter,
  Plus,
  X
} from 'lucide-react';

interface ReportBuilderProps {
  reportType: string;
  onGenerate: (config: any) => void;
  onPreview: (config: any) => void;
}

export function ReportBuilder({ reportType, onGenerate, onPreview }: ReportBuilderProps) {
  const [config, setConfig] = useState({
    title: '',
    description: '',
    format: 'pdf',
    filters: {},
    fields: [],
    groupBy: '',
    sortBy: '',
    includeCharts: false,
    includeBranding: true
  });

  const [activeTab, setActiveTab] = useState('basic');

  const reportTypes = {
    'report-card': {
      name: 'CBC Report Card',
      description: 'Individual student competency reports',
      fields: ['student_info', 'competencies', 'evidence', 'teacher_comments', 'next_steps']
    },
    'class-mastery': {
      name: 'Class Mastery Heatmap',
      description: 'Visual competency assessment overview',
      fields: ['learning_areas', 'strands', 'proficiency_levels', 'student_names']
    },
    'attendance-summary': {
      name: 'Attendance Summary',
      description: 'Daily, weekly, monthly attendance',
      fields: ['dates', 'student_names', 'attendance_status', 'reasons', 'totals']
    },
    'fee-collection': {
      name: 'Fee Collection Report',
      description: 'Payment status and trends',
      fields: ['student_info', 'fee_items', 'payments', 'balances', 'due_dates']
    }
  };

  const currentReportType = reportTypes[reportType as keyof typeof reportTypes];

  const handleFieldToggle = (field: string) => {
    setConfig(prev => ({
      ...prev,
      fields: prev.fields.includes(field) 
        ? prev.fields.filter(f => f !== field)
        : [...prev.fields, field]
    }));
  };

  const addFilter = () => {
    const newFilter = {
      field: '',
      operator: 'equals',
      value: ''
    };
    setConfig(prev => ({
      ...prev,
      filters: {
        ...prev.filters,
        [`filter_${Date.now()}`]: newFilter
      }
    }));
  };

  const removeFilter = (filterId: string) => {
    setConfig(prev => {
      const newFilters = { ...prev.filters };
      delete newFilters[filterId];
      return { ...prev, filters: newFilters };
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{currentReportType?.name}</h3>
          <p className="text-sm text-gray-600">{currentReportType?.description}</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => onPreview(config)}>
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button onClick={() => onGenerate(config)}>
            <Download className="h-4 w-4 mr-2" />
            Generate
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="basic">Basic Settings</TabsTrigger>
          <TabsTrigger value="fields">Fields & Layout</TabsTrigger>
          <TabsTrigger value="filters">Filters</TabsTrigger>
          <TabsTrigger value="formatting">Formatting</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
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
                  placeholder="Enter report title"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={config.description}
                  onChange={(e) => setConfig(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of the report"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Output Format</Label>
                  <Select value={config.format} onValueChange={(value) => setConfig(prev => ({ ...prev, format: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="xlsx">Excel</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="json">JSON</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Date Range</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="current-term">Current Term</SelectItem>
                      <SelectItem value="current-year">Current Year</SelectItem>
                      <SelectItem value="last-30-days">Last 30 Days</SelectItem>
                      <SelectItem value="custom">Custom Range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fields" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Report Fields</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-gray-600">Select which fields to include in your report:</p>
                <div className="grid grid-cols-2 gap-3">
                  {currentReportType?.fields.map((field) => (
                    <label key={field} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={config.fields.includes(field)}
                        onChange={() => handleFieldToggle(field)}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm capitalize">{field.replace('_', ' ')}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div>
                  <Label>Group By</Label>
                  <Select value={config.groupBy} onValueChange={(value) => setConfig(prev => ({ ...prev, groupBy: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select grouping" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="class">Class</SelectItem>
                      <SelectItem value="subject">Subject</SelectItem>
                      <SelectItem value="date">Date</SelectItem>
                      <SelectItem value="none">No Grouping</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Sort By</Label>
                  <Select value={config.sortBy} onValueChange={(value) => setConfig(prev => ({ ...prev, sortBy: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select sorting" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="date">Date</SelectItem>
                      <SelectItem value="performance">Performance</SelectItem>
                      <SelectItem value="custom">Custom Order</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="filters" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Report Filters</span>
                <Button variant="outline" size="sm" onClick={addFilter}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Filter
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(config.filters).map(([filterId, filter]: [string, any]) => (
                  <div key={filterId} className="flex items-center space-x-2 p-3 border rounded-lg">
                    <Select value={filter.field} onValueChange={(value) => {
                      setConfig(prev => ({
                        ...prev,
                        filters: {
                          ...prev.filters,
                          [filterId]: { ...filter, field: value }
                        }
                      }));
                    }}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Field" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="class">Class</SelectItem>
                        <SelectItem value="subject">Subject</SelectItem>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="date">Date</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={filter.operator} onValueChange={(value) => {
                      setConfig(prev => ({
                        ...prev,
                        filters: {
                          ...prev.filters,
                          [filterId]: { ...filter, operator: value }
                        }
                      }));
                    }}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Operator" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="equals">Equals</SelectItem>
                        <SelectItem value="contains">Contains</SelectItem>
                        <SelectItem value="greater_than">Greater Than</SelectItem>
                        <SelectItem value="less_than">Less Than</SelectItem>
                      </SelectContent>
                    </Select>

                    <Input
                      value={filter.value}
                      onChange={(e) => {
                        setConfig(prev => ({
                          ...prev,
                          filters: {
                            ...prev.filters,
                            [filterId]: { ...filter, value: e.target.value }
                          }
                        }));
                      }}
                      placeholder="Value"
                      className="flex-1"
                    />

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeFilter(filterId)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                {Object.keys(config.filters).length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Filter className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No filters added. Click "Add Filter" to get started.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="formatting" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Formatting Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={config.includeBranding}
                    onChange={(e) => setConfig(prev => ({ ...prev, includeBranding: e.target.checked }))}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">Include school branding (logo, motto)</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={config.includeCharts}
                    onChange={(e) => setConfig(prev => ({ ...prev, includeCharts: e.target.checked }))}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">Include charts and visualizations</span>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Page Orientation</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select orientation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="portrait">Portrait</SelectItem>
                      <SelectItem value="landscape">Landscape</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Font Size</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center space-x-2">
          <FileText className="h-5 w-5 text-blue-600" />
          <div>
            <p className="font-medium text-blue-800">Report Preview</p>
            <p className="text-sm text-blue-600">
              {config.fields.length} fields selected • {Object.keys(config.filters).length} filters applied
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Badge variant="outline">{config.format.toUpperCase()}</Badge>
          <Badge variant="secondary">
            Est. {Math.floor(Math.random() * 5) + 1} min
          </Badge>
        </div>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { mockLearners } from '@/data/mock-data';
import { formatDate, generateId } from '@/lib/utils';
import { ReportExporter } from '@/components/features/ReportExporter';
import { useCommunications, useReports } from '@/store';
import { 
  MessageSquare, 
  Mail, 
  Smartphone, 
  Send,
  Plus, 
  Eye, 
  Edit,
  Download,
  Search,
  Filter,
  Clock,
  CheckCircle,
  AlertTriangle,
  FileText,
  Save,
  X,
  Trash2,
  Users,
  Bell,
  Settings,
  BarChart3
} from 'lucide-react';

export function Communications() {
  const [activeTab, setActiveTab] = useState('messages');
  const [searchTerm, setSearchTerm] = useState('');
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [showTemplateForm, setShowTemplateForm] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [showReportExporter, setShowReportExporter] = useState(false);
  const [showMessageDetails, setShowMessageDetails] = useState(false);
  const [selectedMessageForView, setSelectedMessageForView] = useState<any>(null);

  const { messages, templates, addMessage, updateMessage, deleteMessage, addTemplate, updateTemplate, deleteTemplate } = useCommunications();
  const { generateReport } = useReports();

  const mockMessages = [
    {
      id: generateId(),
      type: 'sms',
      recipients: [
        { id: 'rec-1', type: 'guardian', contact: '+254700123456', status: 'delivered' }
      ],
      subject: 'Fee Payment Reminder',
      content: 'Dear parent, this is a reminder that Term 1 fees are due on March 15th.',
      status: 'sent',
      sent_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      created_by: 'admin-1'
    },
    {
      id: generateId(),
      type: 'email',
      recipients: [
        { id: 'rec-2', type: 'guardian', contact: 'mary.kamau@email.com', status: 'delivered' }
      ],
      subject: 'Grade 3A Report Cards Ready',
      content: 'Your child\'s Term 1 report card is now available for download.',
      status: 'sent',
      sent_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      created_by: 'teacher-1'
    }
  ];

  const mockTemplates = [
    {
      id: generateId(),
      name: 'Fee Payment Reminder',
      type: 'sms',
      content: 'Dear {{guardian_name}}, Term {{term}} fees for {{student_name}} are due on {{due_date}}. Amount: {{amount}}',
      variables: ['guardian_name', 'student_name', 'term', 'due_date', 'amount'],
      category: 'finance'
    },
    {
      id: generateId(),
      name: 'Absence Notification',
      type: 'sms',
      content: 'Your child {{student_name}} was absent from school today. Please contact the school if this was unplanned.',
      variables: ['student_name'],
      category: 'attendance'
    }
  ];

  const allMessages = messages.length > 0 ? messages : mockMessages;
  const allTemplates = templates.length > 0 ? templates : mockTemplates;

  const handleAddMessage = () => {
    setSelectedMessage(null);
    setShowMessageForm(true);
  };

  const handleEditMessage = (message: any) => {
    setSelectedMessage(message);
    setShowMessageForm(true);
  };

  const handleSaveMessage = (messageData: any) => {
    if (selectedMessage) {
      updateMessage(selectedMessage.id, messageData);
    } else {
      addMessage(messageData);
    }
    setShowMessageForm(false);
  };

  const handleAddTemplate = () => {
    setSelectedTemplate(null);
    setShowTemplateForm(true);
  };

  const handleEditTemplate = (template: any) => {
    setSelectedTemplate(template);
    setShowTemplateForm(true);
  };

  const handleSaveTemplate = (templateData: any) => {
    if (selectedTemplate) {
      updateTemplate(selectedTemplate.id, templateData);
    } else {
      addTemplate(templateData);
    }
    setShowTemplateForm(false);
  };

  const handleViewMessage = (message: any) => {
    setSelectedMessageForView(message);
    setShowMessageDetails(true);
  };

  const handleSendMessage = (message: any) => {
    // Simulate sending message
    updateMessage(message.id, { status: 'sent', sent_at: new Date().toISOString() });
    alert(`Message "${message.subject}" sent to ${message.recipients.length} recipients`);
  };

  const handleExportMessage = (message: any) => {
    generateReport({
      type: 'message_report',
      title: `Message Report - ${message.subject}`,
      data: message,
      format: 'pdf'
    });
  };

  const handleGenerateCommunicationReport = () => {
    generateReport({
      type: 'communication_analytics',
      title: 'Communication Analytics Report',
      data: allMessages,
      format: 'xlsx'
    });
  };

  const handleDeleteMessage = (message: any) => {
    if (confirm(`Delete message "${message.subject}"?`)) {
      deleteMessage(message.id);
    }
  };

  const MessageCard = ({ message }: { message: any }) => {
    const deliveredCount = message.recipients.filter((r: any) => r.status === 'delivered').length;
    const deliveryRate = (deliveredCount / message.recipients.length) * 100;

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <Badge variant="outline" className="capitalize">{message.type}</Badge>
                <Badge variant={message.status === 'sent' ? 'default' : 'secondary'}>
                  {message.status}
                </Badge>
              </div>
              
              <h3 className="font-semibold text-gray-900 mb-2">{message.subject}</h3>
              <p className="text-sm text-gray-600 mb-3">{message.content.substring(0, 100)}...</p>
              
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>Sent: {formatDate(message.sent_at)}</span>
                <span>Recipients: {message.recipients.length}</span>
                <span>Delivered: {deliveryRate.toFixed(0)}%</span>
              </div>
            </div>
            
            <div className="flex flex-col items-end space-y-2">
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleViewMessage(message)}>
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleEditMessage(message)}>
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleSendMessage(message)}>
                  <Send className="h-4 w-4 mr-1" />
                  Send
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleExportMessage(message)}>
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDeleteMessage(message)}>
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
              <Progress value={deliveryRate} className="w-24" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const MessageForm = () => {
    const [formData, setFormData] = useState({
      type: selectedMessage?.type || 'sms',
      subject: selectedMessage?.subject || '',
      content: selectedMessage?.content || '',
      recipients: selectedMessage?.recipients || [],
      template_id: selectedMessage?.template_id || '',
      scheduled_at: selectedMessage?.scheduled_at || ''
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      handleSaveMessage(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Message Type *</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sms">SMS</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="push">Push Notification</SelectItem>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label>Template (Optional)</Label>
            <Select value={formData.template_id} onValueChange={(value) => setFormData(prev => ({ ...prev, template_id: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select template" />
              </SelectTrigger>
              <SelectContent>
                {allTemplates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {formData.type === 'email' && (
          <div>
            <Label htmlFor="subject">Subject *</Label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
              required
            />
          </div>
        )}

        <div>
          <Label htmlFor="content">Message Content *</Label>
          <Textarea
            id="content"
            value={formData.content}
            onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
            placeholder="Enter your message..."
            rows={4}
            required
          />
        </div>

        <div>
          <Label>Recipients</Label>
          <div className="mt-2 space-y-2">
            <label className="flex items-center space-x-2">
              <input type="checkbox" />
              <span className="text-sm">All parents</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" />
              <span className="text-sm">Grade 3 parents only</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" />
              <span className="text-sm">Students with outstanding fees</span>
            </label>
          </div>
        </div>

        <div>
          <Label htmlFor="scheduled_at">Schedule for Later (Optional)</Label>
          <Input
            id="scheduled_at"
            type="datetime-local"
            value={formData.scheduled_at}
            onChange={(e) => setFormData(prev => ({ ...prev, scheduled_at: e.target.value }))}
          />
        </div>

        <div className="flex space-x-2">
          <Button type="submit">
            <Send className="h-4 w-4 mr-2" />
            {formData.scheduled_at ? 'Schedule Message' : 'Send Now'}
          </Button>
          <Button type="button" variant="outline" onClick={() => setShowMessageForm(false)}>
            Cancel
          </Button>
        </div>
      </form>
    );
  };

  const TemplateForm = () => {
    const [formData, setFormData] = useState({
      name: selectedTemplate?.name || '',
      type: selectedTemplate?.type || 'sms',
      subject: selectedTemplate?.subject || '',
      content: selectedTemplate?.content || '',
      category: selectedTemplate?.category || 'general',
      variables: selectedTemplate?.variables || []
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      handleSaveTemplate(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Template Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>
          
          <div>
            <Label>Type *</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sms">SMS</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="push">Push Notification</SelectItem>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Category</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="attendance">Attendance</SelectItem>
                <SelectItem value="assessment">Assessment</SelectItem>
                <SelectItem value="transport">Transport</SelectItem>
                <SelectItem value="welfare">Welfare</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {formData.type === 'email' && (
            <div>
              <Label htmlFor="subject">Subject Template</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                placeholder="Email subject with {{variables}}"
              />
            </div>
          )}
        </div>

        <div>
          <Label htmlFor="content">Message Template *</Label>
          <Textarea
            id="content"
            value={formData.content}
            onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
            placeholder="Message content with {{variables}}..."
            rows={4}
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Use {{variable_name}} for dynamic content. Available: {{student_name}}, {{guardian_name}}, {{amount}}, {{due_date}}
          </p>
        </div>

        <div className="flex space-x-2">
          <Button type="submit">
            <Save className="h-4 w-4 mr-2" />
            {selectedTemplate ? 'Update Template' : 'Create Template'}
          </Button>
          <Button type="button" variant="outline" onClick={() => setShowTemplateForm(false)}>
            Cancel
          </Button>
        </div>
      </form>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Communications</h1>
          <p className="text-gray-600 mt-1">Manage parent communications and notifications</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="secondary" className="bg-blue-50 text-blue-700">
            {allMessages.length} Messages Sent
          </Badge>
          <Button onClick={handleAddMessage}>
            <Plus className="h-4 w-4 mr-2" />
            New Message
          </Button>
          <Button variant="outline" onClick={handleGenerateCommunicationReport}>
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </Button>
          <Button onClick={() => setShowReportExporter(true)} variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Communication Reports
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Reports
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Communication Reports</DialogTitle>
              </DialogHeader>
              <ReportExporter 
                data={allMessages} 
                title="Communication Reports" 
                type="privacy"
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Messages Sent</p>
                <p className="text-2xl font-bold text-blue-600">{allMessages.length}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Delivery Rate</p>
                <p className="text-2xl font-bold text-green-600">98.5%</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Templates</p>
                <p className="text-2xl font-bold text-purple-600">{allTemplates.length}</p>
              </div>
              <FileText className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Recipients</p>
                <p className="text-2xl font-bold text-orange-600">245</p>
              </div>
              <Users className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="messages">Messages ({allMessages.length})</TabsTrigger>
          <TabsTrigger value="templates">Templates ({allTemplates.length})</TabsTrigger>
          <TabsTrigger value="channels">Channels</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="messages" className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>

          {allMessages.map((message) => (
            <MessageCard key={message.id} message={message} />
          ))}
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Badge variant="outline">
                Total: {allTemplates.length}
              </Badge>
            </div>
            <Button onClick={handleAddTemplate}>
              <Plus className="h-4 w-4 mr-2" />
              New Template
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {allTemplates.map((template) => (
              <Card key={template.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">{template.name}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="capitalize">{template.type}</Badge>
                        <Badge variant="secondary">{template.category}</Badge>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditTemplate(template)}>
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => {
                        if (confirm(`Delete template "${template.name}"?`)) {
                          deleteTemplate(template.id);
                        }
                      }}>
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                      <Button size="sm">
                        <Send className="h-4 w-4 mr-1" />
                        Use Template
                      </Button>
                     <Button variant="outline" size="sm" onClick={() => {
                       generateReport({
                         type: 'template_usage_report',
                         title: `${template.name} - Usage Report`,
                         data: template,
                         format: 'pdf'
                       });
                     }}>
                       <FileText className="h-4 w-4 mr-1" />
                       Usage Report
                     </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{template.content.substring(0, 100)}...</p>
                  
                  <div className="flex flex-wrap gap-1">
                    {template.variables.map((variable: string) => (
                      <Badge key={variable} variant="outline" className="text-xs">
                        {variable}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="channels" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { name: 'SMS Gateway', type: 'sms', status: 'active', icon: Smartphone, usage: '85%' },
              { name: 'Email Service', type: 'email', status: 'active', icon: Mail, usage: '92%' },
              { name: 'Push Notifications', type: 'push', status: 'inactive', icon: Bell, usage: '0%' },
              { name: 'WhatsApp Business', type: 'whatsapp', status: 'inactive', icon: MessageSquare, usage: '0%' }
            ].map((channel) => {
              const Icon = channel.icon;
              return (
                <Card key={channel.type}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${channel.status === 'active' ? 'bg-green-50' : 'bg-gray-50'}`}>
                          <Icon className={`h-5 w-5 ${channel.status === 'active' ? 'text-green-600' : 'text-gray-600'}`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{channel.name}</h3>
                          <Badge variant={channel.status === 'active' ? 'default' : 'secondary'}>
                            {channel.status}
                          </Badge>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-1" />
                        Configure
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Usage this month:</span>
                        <span className="font-semibold">{channel.usage}</span>
                      </div>
                      <Progress value={parseInt(channel.usage)} className="w-full" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Message Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { metric: 'Delivery Rate', value: '98.5%', trend: '+2.1%' },
                    { metric: 'Open Rate (Email)', value: '76%', trend: '+5.2%' },
                    { metric: 'Response Rate', value: '23%', trend: '-1.1%' },
                    { metric: 'Bounce Rate', value: '1.5%', trend: '-0.3%' }
                  ].map((metric) => (
                    <div key={metric.metric} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{metric.metric}</span>
                      <div className="text-right">
                        <span className="font-semibold">{metric.value}</span>
                        <span className={`text-xs ml-2 ${metric.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                          {metric.trend}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Channel Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { channel: 'SMS', percentage: 65, count: 1250 },
                    { channel: 'Email', percentage: 30, count: 580 },
                    { channel: 'Push', percentage: 3, count: 58 },
                    { channel: 'WhatsApp', percentage: 2, count: 38 }
                  ].map((item) => (
                    <div key={item.channel} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.channel}</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={item.percentage} className="w-20" />
                        <span className="text-sm text-gray-600 w-16">{item.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Message Form Dialog */}
      <Dialog open={showMessageForm} onOpenChange={setShowMessageForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedMessage ? 'Edit Message' : 'New Message'}</DialogTitle>
          </DialogHeader>
          <MessageForm />
        </DialogContent>
      </Dialog>

      {/* Template Form Dialog */}
      <Dialog open={showTemplateForm} onOpenChange={setShowTemplateForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedTemplate ? 'Edit Template' : 'New Template'}</DialogTitle>
          </DialogHeader>
          <TemplateForm />
        </DialogContent>
      </Dialog>

      {/* Message Details Dialog */}
      <Dialog open={showMessageDetails} onOpenChange={setShowMessageDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Message Details</DialogTitle>
          </DialogHeader>
          <MessageDetailsView message={selectedMessageForView} />
        </DialogContent>
      </Dialog>

      {/* Report Exporter Dialog */}
      <Dialog open={showReportExporter} onOpenChange={setShowReportExporter}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Communication Reports</DialogTitle>
          </DialogHeader>
          <ReportExporter 
            data={allMessages} 
            title="Communication Reports" 
            type="privacy"
            onClose={() => setShowReportExporter(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

const MessageDetailsView = ({ message }: { message: any }) => {
  if (!message) return null;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Type</Label>
          <Badge variant="outline" className="capitalize">{message.type}</Badge>
        </div>
        <div>
          <Label>Status</Label>
          <Badge variant={message.status === 'sent' ? 'default' : 'secondary'}>
            {message.status}
          </Badge>
        </div>
      </div>
      
      <div>
        <Label>Subject</Label>
        <p className="font-medium">{message.subject}</p>
      </div>
      
      <div>
        <Label>Content</Label>
        <p className="text-gray-700">{message.content}</p>
      </div>

      <div>
        <Label>Recipients ({message.recipients.length})</Label>
        <div className="max-h-32 overflow-y-auto space-y-1">
          {message.recipients.map((recipient: any, index: number) => (
            <div key={index} className="flex justify-between text-sm">
              <span>{recipient.contact}</span>
              <Badge variant={recipient.status === 'delivered' ? 'default' : 'secondary'}>
                {recipient.status}
              </Badge>
            </div>
          ))}
        </div>
      </div>
      <div className="flex space-x-2">
        <Button className="flex-1">
          <Send className="h-4 w-4 mr-2" />
          Resend
        </Button>
        <Button variant="outline" className="flex-1">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>
    </div>
  );
}
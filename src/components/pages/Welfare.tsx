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
import { mockLearners } from '@/data/mock-data';
import { formatDate, generateId } from '@/lib/utils';
import { ReportExporter } from '@/components/features/ReportExporter';
import { useWelfare } from '@/store';
import { 
  Heart, 
  Shield, 
  AlertTriangle, 
  Plus, 
  Eye, 
  Edit,
  Clock,
  CheckCircle,
  Users,
  FileText,
  Lock,
  Search,
  Download,
  Save,
  X,
  Trash2,
  Award
} from 'lucide-react';

export function Welfare() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCaseForm, setShowCaseForm] = useState(false);
  const [selectedCase, setSelectedCase] = useState<any>(null);
  const [showSNEForm, setShowSNEForm] = useState(false);
  const [selectedSNEPlan, setSelectedSNEPlan] = useState<any>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const [showReportExporter, setShowReportExporter] = useState(false);
  const [showCaseDetails, setShowCaseDetails] = useState(false);
  const [showSNEDetails, setShowSNEDetails] = useState(false);

  const { cases, snePlans, addCase, updateCase, deleteCase, addSNEPlan, updateSNEPlan, deleteSNEPlan } = useWelfare();

  const mockWelfareCases = [
    {
      id: generateId(),
      learner_id: 'learner-2',
      category: 'counseling',
      priority: 'medium',
      restricted_roles: ['admin', 'welfare_officer'],
      summary: 'Student showing signs of anxiety during assessments',
      notes_encrypted: 'Detailed counseling notes...',
      status: 'in_progress',
      assigned_to: 'welfare-officer-1',
      opened_by: 'teacher-1',
      opened_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: generateId(),
      learner_id: 'learner-3',
      category: 'discipline',
      priority: 'low',
      restricted_roles: ['admin', 'welfare_officer', 'class_teacher'],
      summary: 'Minor classroom disruption incident',
      notes_encrypted: 'Discipline action taken...',
      status: 'resolved',
      assigned_to: 'teacher-1',
      opened_by: 'teacher-1',
      opened_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  const mockSNEPlans = [
    {
      id: generateId(),
      learner_id: 'learner-2',
      stage: 'implementation',
      accommodations: [
        {
          id: generateId(),
          type: 'extra_time',
          description: 'Additional 50% time for assessments',
          subjects: ['sub-3']
        },
        {
          id: generateId(),
          type: 'assistive_tech',
          description: 'Calculator permitted for number work',
          subjects: ['sub-3']
        }
      ],
      review_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      created_by: 'welfare-officer-1',
      created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  const allCases = cases.length > 0 ? cases : mockWelfareCases;
  const allSNEPlans = snePlans.length > 0 ? snePlans : mockSNEPlans;

  const getStudent = (studentId: string) => {
    return mockLearners.find(s => s.id === studentId);
  };

  const handleAddCase = () => {
    setSelectedCase(null);
    setShowCaseForm(true);
  };

  const handleEditCase = (welfareCase: any) => {
    setSelectedCase(welfareCase);
    setShowCaseForm(true);
  };

  const handleSaveCase = (caseData: any) => {
    if (selectedCase) {
      updateCase(selectedCase.id, caseData);
    } else {
      addCase(caseData);
    }
    setShowCaseForm(false);
  };

  const handleDeleteCase = (welfareCase: any) => {
    setItemToDelete({ type: 'case', item: welfareCase });
    setShowDeleteDialog(true);
  };

  const handleAddSNEPlan = () => {
    setSelectedSNEPlan(null);
    setShowSNEForm(true);
  };

  const handleEditSNEPlan = (plan: any) => {
    setSelectedSNEPlan(plan);
    setShowSNEForm(true);
  };

  const handleSaveSNEPlan = (planData: any) => {
    if (selectedSNEPlan) {
      updateSNEPlan(selectedSNEPlan.id, planData);
    } else {
      addSNEPlan(planData);
    }
    setShowSNEForm(false);
  };

  const handleDeleteSNEPlan = (plan: any) => {
    setItemToDelete({ type: 'sne', item: plan });
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      if (itemToDelete.type === 'case') {
        deleteCase(itemToDelete.item.id);
      } else {
        deleteSNEPlan(itemToDelete.item.id);
      }
      setShowDeleteDialog(false);
      setItemToDelete(null);
    }
  };

  const handleViewCase = (welfareCase: any) => {
    setSelectedCase(welfareCase);
    setShowCaseDetails(true);
  };

  const handleViewSNEPlan = (plan: any) => {
    setSelectedSNEPlan(plan);
    setShowSNEDetails(true);
  };

  const WelfareCaseCard = ({ welfareCase }: { welfareCase: any }) => {
    const student = getStudent(welfareCase.learner_id);
    
    const priorityConfig = {
      low: { color: 'text-green-600', bg: 'bg-green-50' },
      medium: { color: 'text-yellow-600', bg: 'bg-yellow-50' },
      high: { color: 'text-orange-600', bg: 'bg-orange-50' },
      critical: { color: 'text-red-600', bg: 'bg-red-50' }
    };

    const statusConfig = {
      open: { color: 'text-blue-600', bg: 'bg-blue-50', icon: Clock },
      in_progress: { color: 'text-yellow-600', bg: 'bg-yellow-50', icon: Clock },
      resolved: { color: 'text-green-600', bg: 'bg-green-50', icon: CheckCircle },
      escalated: { color: 'text-red-600', bg: 'bg-red-50', icon: AlertTriangle }
    };

    const priority = priorityConfig[welfareCase.priority as keyof typeof priorityConfig];
    const status = statusConfig[welfareCase.status as keyof typeof statusConfig];
    const StatusIcon = status.icon;

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <Badge variant="outline">{student?.name}</Badge>
                <Badge variant="secondary" className="capitalize">{welfareCase.category}</Badge>
                <Badge variant={welfareCase.priority === 'critical' || welfareCase.priority === 'high' ? 'destructive' : 'secondary'}>
                  {welfareCase.priority}
                </Badge>
              </div>
              
              <p className="text-gray-700 mb-3">{welfareCase.summary}</p>
              
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>Opened: {formatDate(welfareCase.opened_at)}</span>
                {welfareCase.closed_at && (
                  <span>Closed: {formatDate(welfareCase.closed_at)}</span>
                )}
                <span>Assigned: {welfareCase.assigned_to}</span>
              </div>
            </div>
            
            <div className="flex flex-col items-end space-y-2">
              <div className={`p-2 rounded-full ${status.bg}`}>
                <StatusIcon className={`h-4 w-4 ${status.color}`} />
              </div>
              
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleViewCase(welfareCase)}>
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleEditCase(welfareCase)}>
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDeleteCase(welfareCase)}>
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
                <Button size="sm">
                  <FileText className="h-4 w-4 mr-1" />
                  Report
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const SNEPlanCard = ({ plan }: { plan: any }) => {
    const student = getStudent(plan.learner_id);
    
    const stageConfig = {
      identification: { color: 'text-blue-600', bg: 'bg-blue-50' },
      assessment: { color: 'text-yellow-600', bg: 'bg-yellow-50' },
      planning: { color: 'text-orange-600', bg: 'bg-orange-50' },
      implementation: { color: 'text-green-600', bg: 'bg-green-50' },
      review: { color: 'text-purple-600', bg: 'bg-purple-50' }
    };

    const stage = stageConfig[plan.stage as keyof typeof stageConfig];

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <Badge variant="outline">{student?.name}</Badge>
                <Badge variant="secondary" className="capitalize">{plan.stage.replace('_', ' ')}</Badge>
              </div>
              
              <div className="space-y-2 mb-4">
                <p className="text-sm text-gray-600">
                  <strong>Accommodations:</strong> {plan.accommodations.length} active
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Next Review:</strong> {formatDate(plan.review_date)}
                </p>
              </div>

              <div className="space-y-1">
                {plan.accommodations.slice(0, 2).map((acc: any) => (
                  <div key={acc.id} className="text-sm text-gray-700">
                    • {acc.description}
                  </div>
                ))}
                {plan.accommodations.length > 2 && (
                  <div className="text-sm text-gray-500">
                    +{plan.accommodations.length - 2} more accommodations
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex flex-col items-end space-y-2">
              <div className={`p-2 rounded-full ${stage.bg}`}>
                <Shield className={`h-4 w-4 ${stage.color}`} />
              </div>
              
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleViewSNEPlan(plan)}>
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleEditSNEPlan(plan)}>
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDeleteSNEPlan(plan)}>
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
                <Button size="sm">
                  <Award className="h-4 w-4 mr-1" />
                  Progress
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const CaseForm = () => {
    const [formData, setFormData] = useState({
      learner_id: selectedCase?.learner_id || '',
      category: selectedCase?.category || 'counseling',
      priority: selectedCase?.priority || 'medium',
      summary: selectedCase?.summary || '',
      notes: selectedCase?.notes_encrypted || '',
      assigned_to: selectedCase?.assigned_to || ''
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      handleSaveCase(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Student *</Label>
            <Select value={formData.learner_id} onValueChange={(value) => setFormData(prev => ({ ...prev, learner_id: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select student" />
              </SelectTrigger>
              <SelectContent>
                {mockLearners.map((student) => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.name} ({student.admission_no})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label>Category *</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="discipline">Discipline</SelectItem>
                <SelectItem value="counseling">Counseling</SelectItem>
                <SelectItem value="health">Health</SelectItem>
                <SelectItem value="family">Family</SelectItem>
                <SelectItem value="academic">Academic</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Priority *</Label>
            <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label>Assign To</Label>
            <Select value={formData.assigned_to} onValueChange={(value) => setFormData(prev => ({ ...prev, assigned_to: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select staff member" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="welfare-officer-1">Mary Njeri (Welfare Officer)</SelectItem>
                <SelectItem value="teacher-1">John Mwangi (Class Teacher)</SelectItem>
                <SelectItem value="counselor-1">Sarah Wanjiku (Counselor)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="summary">Summary (Visible to Class Teachers) *</Label>
          <Textarea
            id="summary"
            value={formData.summary}
            onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
            placeholder="Brief summary visible to class teachers..."
            required
          />
        </div>

        <div>
          <Label htmlFor="notes">Detailed Notes (Restricted Access)</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            placeholder="Detailed case notes (encrypted and access-controlled)..."
            rows={4}
          />
        </div>

        <div className="flex space-x-2">
          <Button type="submit">
            <Save className="h-4 w-4 mr-2" />
            {selectedCase ? 'Update Case' : 'Create Case'}
          </Button>
          <Button type="button" variant="outline" onClick={() => setShowCaseForm(false)}>
            Cancel
          </Button>
        </div>
      </form>
    );
  };

  const SNEPlanForm = () => {
    const [formData, setFormData] = useState({
      learner_id: selectedSNEPlan?.learner_id || '',
      stage: selectedSNEPlan?.stage || 'identification',
      review_date: selectedSNEPlan?.review_date || '',
      accommodations: selectedSNEPlan?.accommodations || []
    });

    const addAccommodation = () => {
      const newAccommodation = {
        id: generateId(),
        type: 'extra_time',
        description: '',
        subjects: []
      };
      setFormData(prev => ({ 
        ...prev, 
        accommodations: [...prev.accommodations, newAccommodation] 
      }));
    };

    const removeAccommodation = (index: number) => {
      setFormData(prev => ({
        ...prev,
        accommodations: prev.accommodations.filter((_: any, i: number) => i !== index)
      }));
    };

    const updateAccommodation = (index: number, field: string, value: any) => {
      setFormData(prev => ({
        ...prev,
        accommodations: prev.accommodations.map((acc: any, i: number) =>
          i === index ? { ...acc, [field]: value } : acc
        )
      }));
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      handleSaveSNEPlan(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Student *</Label>
            <Select value={formData.learner_id} onValueChange={(value) => setFormData(prev => ({ ...prev, learner_id: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select student" />
              </SelectTrigger>
              <SelectContent>
                {mockLearners.filter(s => s.special_needs).map((student) => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.name} ({student.admission_no})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label>Stage *</Label>
            <Select value={formData.stage} onValueChange={(value) => setFormData(prev => ({ ...prev, stage: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="identification">Identification</SelectItem>
                <SelectItem value="assessment">Assessment</SelectItem>
                <SelectItem value="planning">Planning</SelectItem>
                <SelectItem value="implementation">Implementation</SelectItem>
                <SelectItem value="review">Review</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="review_date">Next Review Date *</Label>
          <Input
            id="review_date"
            type="date"
            value={formData.review_date}
            onChange={(e) => setFormData(prev => ({ ...prev, review_date: e.target.value }))}
            required
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <Label>Accommodations</Label>
            <Button type="button" onClick={addAccommodation} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Accommodation
            </Button>
          </div>
          
          <div className="space-y-4">
            {formData.accommodations.map((accommodation: any, index: number) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <Select 
                    value={accommodation.type} 
                    onValueChange={(value) => updateAccommodation(index, 'type', value)}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="extra_time">Extra Time</SelectItem>
                      <SelectItem value="assistive_tech">Assistive Technology</SelectItem>
                      <SelectItem value="modified_tasks">Modified Tasks</SelectItem>
                      <SelectItem value="alternative_assessment">Alternative Assessment</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeAccommodation(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <Textarea
                  value={accommodation.description}
                  onChange={(e) => updateAccommodation(index, 'description', e.target.value)}
                  placeholder="Describe the accommodation..."
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex space-x-2">
          <Button type="submit">
            <Save className="h-4 w-4 mr-2" />
            {selectedSNEPlan ? 'Update Plan' : 'Create Plan'}
          </Button>
          <Button type="button" variant="outline" onClick={() => setShowSNEForm(false)}>
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
          <h1 className="text-3xl font-bold text-gray-900">Welfare & SNE</h1>
          <p className="text-gray-600 mt-1">Student welfare, safeguarding, and special needs support</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="secondary" className="bg-green-50 text-green-700">
            {allCases.length} Active Cases
          </Badge>
          <Button onClick={handleAddCase}>
            <Plus className="h-4 w-4 mr-2" />
            New Case
          </Button>
          <Button onClick={() => setShowReportExporter(true)} variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Welfare Reports
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
                <DialogTitle>Welfare & SNE Reports</DialogTitle>
              </DialogHeader>
              <ReportExporter 
                data={allCases} 
                title="Welfare Reports" 
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
                <p className="text-sm text-gray-600">Active Cases</p>
                <p className="text-2xl font-bold text-blue-600">{allCases.filter(c => c.status !== 'resolved').length}</p>
              </div>
              <Heart className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">SNE Students</p>
                <p className="text-2xl font-bold text-green-600">{mockLearners.filter(s => s.special_needs).length}</p>
              </div>
              <Shield className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Critical Cases</p>
                <p className="text-2xl font-bold text-red-600">{allCases.filter(c => c.priority === 'critical').length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-purple-600">{allCases.length}</p>
              </div>
              <FileText className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="cases">Welfare Cases ({allCases.length})</TabsTrigger>
          <TabsTrigger value="sne">SNE Plans ({allSNEPlans.length})</TabsTrigger>
          <TabsTrigger value="safeguarding">Safeguarding</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Case Priority Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { priority: 'Critical', count: allCases.filter(c => c.priority === 'critical').length, color: 'bg-red-500' },
                    { priority: 'High', count: allCases.filter(c => c.priority === 'high').length, color: 'bg-orange-500' },
                    { priority: 'Medium', count: allCases.filter(c => c.priority === 'medium').length, color: 'bg-yellow-500' },
                    { priority: 'Low', count: allCases.filter(c => c.priority === 'low').length, color: 'bg-green-500' }
                  ].map((item) => (
                    <div key={item.priority} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.priority}</span>
                      <div className="flex items-center space-x-2">
                        <div className={`w-4 h-4 rounded ${item.color}`}></div>
                        <span className="text-sm font-semibold">{item.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>SNE Support Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Shield className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="font-semibold text-blue-800">{allSNEPlans.length} Active Plans</p>
                    <p className="text-sm text-blue-600">Students with support plans</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Implementation stage:</span>
                      <span className="font-semibold">{allSNEPlans.filter(p => p.stage === 'implementation').length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Due for review:</span>
                      <span className="font-semibold">1</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="cases" className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search cases..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {allCases.map((welfareCase) => (
            <WelfareCaseCard key={welfareCase.id} welfareCase={welfareCase} />
          ))}
        </TabsContent>

        <TabsContent value="sne" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Badge variant="outline">
                Active Plans: {allSNEPlans.length}
              </Badge>
              <Badge variant="secondary">
                Students with SNE: {mockLearners.filter(s => s.special_needs).length}
              </Badge>
            </div>
            <Button onClick={handleAddSNEPlan}>
              <Plus className="h-4 w-4 mr-2" />
              New SNE Plan
            </Button>
          </div>

          {allSNEPlans.map((plan) => (
            <SNEPlanCard key={plan.id} plan={plan} />
          ))}
        </TabsContent>

        <TabsContent value="safeguarding" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Safeguarding Protocols</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="font-semibold text-green-800">Policies Updated</p>
                  <p className="text-sm text-green-600">All staff trained</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Shield className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="font-semibold text-blue-800">Reporting System</p>
                  <p className="text-sm text-blue-600">Anonymous reporting available</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Lock className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <p className="font-semibold text-purple-800">Data Protection</p>
                  <p className="text-sm text-purple-600">Encrypted case records</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Case Form Dialog */}
      <Dialog open={showCaseForm} onOpenChange={setShowCaseForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedCase ? 'Edit Welfare Case' : 'New Welfare Case'}</DialogTitle>
          </DialogHeader>
          <CaseForm />
        </DialogContent>
      </Dialog>

      {/* SNE Plan Form Dialog */}
      <Dialog open={showSNEForm} onOpenChange={setShowSNEForm}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedSNEPlan ? 'Edit SNE Plan' : 'New SNE Plan'}</DialogTitle>
          </DialogHeader>
          <SNEPlanForm />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {itemToDelete?.type === 'case' ? 'Welfare Case' : 'SNE Plan'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Are you sure you want to delete this {itemToDelete?.type === 'case' ? 'welfare case' : 'SNE plan'}?</p>
            <p className="text-sm text-gray-600">This action cannot be undone.</p>
            <div className="flex space-x-2">
              <Button variant="destructive" onClick={confirmDelete}>
                Delete {itemToDelete?.type === 'case' ? 'Case' : 'Plan'}
              </Button>
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Case Details Dialog */}
      <Dialog open={showCaseDetails} onOpenChange={setShowCaseDetails}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Welfare Case Details</DialogTitle>
          </DialogHeader>
          <CaseDetailsView case={selectedCase} />
        </DialogContent>
      </Dialog>

      {/* SNE Details Dialog */}
      <Dialog open={showSNEDetails} onOpenChange={setShowSNEDetails}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>SNE Plan Details</DialogTitle>
          </DialogHeader>
          <SNEPlanDetailsView plan={selectedSNEPlan} />
        </DialogContent>
      </Dialog>

      {/* Report Exporter Dialog */}
      <Dialog open={showReportExporter} onOpenChange={setShowReportExporter}>
        <DialogContent className="max-w-4xl">
          <ReportExporter data={allCases} title="Welfare Reports" type="privacy" />
        </DialogContent>
      </Dialog>
    </div>
  );
}

const CaseDetailsView = ({ case: welfareCase }: { case: any }) => {
  if (!welfareCase) return null;

  const student = mockLearners.find(s => s.id === welfareCase.learner_id);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <Label>Student</Label>
          <p className="font-medium">{student?.name}</p>
        </div>
        <div>
          <Label>Category</Label>
          <Badge variant="secondary" className="capitalize">{welfareCase.category}</Badge>
        </div>
      </div>
      
      <div>
        <Label>Summary</Label>
        <p className="text-gray-700">{welfareCase.summary}</p>
      </div>

      <div className="flex space-x-2">
        <Button className="flex-1">
          <Edit className="h-4 w-4 mr-2" />
          Edit Case
        </Button>
        <Button variant="outline" className="flex-1">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>
    </div>
  );
};

const SNEPlanDetailsView = ({ plan }: { plan: any }) => {
  if (!plan) return null;

  const student = mockLearners.find(s => s.id === plan.learner_id);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <Label>Student</Label>
          <p className="font-medium">{student?.name}</p>
        </div>
        <div>
          <Label>Stage</Label>
          <Badge variant="secondary" className="capitalize">{plan.stage}</Badge>
        </div>
      </div>
      
      <div>
        <Label>Accommodations</Label>
        <div className="space-y-2">
          {plan.accommodations?.map((acc: any, index: number) => (
            <div key={index} className="p-3 bg-gray-50 rounded">
              <p className="font-medium capitalize">{acc.type.replace('_', ' ')}</p>
              <p className="text-sm text-gray-600">{acc.description}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex space-x-2">
        <Button className="flex-1">
          <Edit className="h-4 w-4 mr-2" />
          Edit Plan
        </Button>
        <Button variant="outline" className="flex-1">
          <Download className="h-4 w-4 mr-2" />
          Export Plan
        </Button>
      </div>
    </div>
  );
}
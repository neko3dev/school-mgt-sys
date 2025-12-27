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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { mockTeachers, mockSubjects } from '@/data/mock-data';
import { ReportExporter } from '@/components/features/ReportExporter';
import { PerformanceReview } from '@/components/features/PerformanceReview';
import { useReports } from '@/store';
import { formatDate, generateId } from '@/lib/utils';
import { useStaff } from '@/store';
import { 
  Users, 
  GraduationCap, 
  Award, 
  Plus, 
  Eye, 
  Edit,
  Download,
  Search,
  Filter,
  Clock,
  CheckCircle,
  FileText,
  Save,
  X,
  Trash2,
  BookOpen,
  Calendar,
  TrendingUp,
  Star,
  Target
} from 'lucide-react';

export function Staff() {
  const [activeTab, setActiveTab] = useState('staff');
  const [searchTerm, setSearchTerm] = useState('');
  const [showStaffForm, setShowStaffForm] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState<any>(null);
  const [showPerformanceReview, setShowPerformanceReview] = useState(false);
  const [staffForReview, setStaffForReview] = useState<any>(null);
  const [showReportExporter, setShowReportExporter] = useState(false);
  const [showTPADDialog, setShowTPADDialog] = useState(false);
  const [staffForTPAD, setStaffForTPAD] = useState<any>(null);

  const { staff, addStaff, updateStaff, deleteStaff } = useStaff();
  const { generateReport } = useReports();

  const allStaff = staff.length > 0 ? staff : mockTeachers;

  const filteredStaff = allStaff.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.tsc_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddStaff = () => {
    setSelectedStaff(null);
    setShowStaffForm(true);
  };

  const handleEditStaff = (staffMember: any) => {
    setSelectedStaff(staffMember);
    setShowStaffForm(true);
  };

  const handleSaveStaff = (staffData: any) => {
    if (selectedStaff) {
      updateStaff(selectedStaff.id, staffData);
    } else {
      addStaff(staffData);
    }
    setShowStaffForm(false);
  };

  const handleDeleteStaff = (staffMember: any) => {
    setStaffToDelete(staffMember);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (staffToDelete) {
      deleteStaff(staffToDelete.id);
      setShowDeleteDialog(false);
      setStaffToDelete(null);
    }
  };

  const handlePerformanceReview = (staffMember: any) => {
    setStaffForReview(staffMember);
    setShowPerformanceReview(true);
  };

  const handleTPADExport = (staffMember: any) => {
    setStaffForTPAD(staffMember);
    setShowTPADDialog(true);
  };

  const handleExportStaffDirectory = () => {
    generateReport({
      type: 'staff_directory',
      title: 'Staff Directory',
      data: allStaff,
      format: 'pdf'
    });
  };

  const handleExportTPADBundle = (staffMember: any) => {
    generateReport({
      type: 'tpad_evidence_bundle',
      title: `TPAD Bundle - ${staffMember.name}`,
      data: staffMember,
      format: 'zip'
    });
  };

  const StaffCard = ({ staffMember }: { staffMember: any }) => {
    const workload = staffMember.subjects?.length || 0;
    const performance = Math.floor(Math.random() * 20) + 80; // Mock performance score

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-700 font-semibold">
                  {staffMember.name.split(' ').map((n: string) => n[0]).join('')}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{staffMember.name}</h3>
                <p className="text-sm text-gray-600">TSC No: {staffMember.tsc_no}</p>
                <p className="text-sm text-gray-600">{staffMember.email}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant={staffMember.status === 'active' ? 'default' : 'secondary'}>
                    {staffMember.status}
                  </Badge>
                  <Badge variant="outline">
                    {workload} Subjects
                  </Badge>
                  <Badge variant="outline" className="text-green-600">
                    {performance}% Performance
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Staff Profile: {staffMember.name}</DialogTitle>
                  </DialogHeader>
                  <StaffProfile staffMember={staffMember} />
                </DialogContent>
              </Dialog>
              <Button variant="outline" size="sm" onClick={() => handleEditStaff(staffMember)}>
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button variant="outline" size="sm" onClick={() => handlePerformanceReview(staffMember)}>
                <Award className="h-4 w-4 mr-1" />
                Review
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleTPADExport(staffMember)}>
                <FileText className="h-4 w-4 mr-1" />
                TPAD
              </Button>
              <Button variant="outline" size="sm" onClick={() => generateReport({ type: 'staff_profile', title: `${staffMember.name} Profile`, data: staffMember, format: 'pdf' })}>
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleDeleteStaff(staffMember)}>
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const StaffProfile = ({ staffMember }: { staffMember: any }) => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Full Name</label>
              <p className="text-gray-900">{staffMember.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">TSC Number</label>
              <p className="text-gray-900 font-mono">{staffMember.tsc_no}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Email</label>
              <p className="text-gray-900">{staffMember.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Phone</label>
              <p className="text-gray-900">{staffMember.phone}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Employment Date</label>
              <p className="text-gray-900">{formatDate(staffMember.employment_date)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Status</label>
              <Badge variant={staffMember.status === 'active' ? 'default' : 'secondary'}>
                {staffMember.status}
              </Badge>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Subjects</label>
              <div className="flex flex-wrap gap-1">
                {staffMember.subjects?.map((subjectId: string) => {
                  const subject = mockSubjects.find(s => s.id === subjectId);
                  return (
                    <Badge key={subjectId} variant="outline" className="text-xs">
                      {subject?.name}
                    </Badge>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Qualifications</h4>
          {staffMember.qualifications?.length > 0 ? (
            <div className="space-y-2">
              {staffMember.qualifications.map((qual: any, index: number) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-900">{qual.title}</p>
                  <p className="text-sm text-gray-600">{qual.institution} • {qual.year}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">No qualifications recorded</p>
          )}
        </div>

        <div className="flex space-x-2">
          <Button className="flex-1">
            <Award className="h-4 w-4 mr-2" />
            Performance Review
          </Button>
          <Button variant="outline" className="flex-1">
            <FileText className="h-4 w-4 mr-2" />
            TPAD Bundle
          </Button>
        </div>
      </div>
    );
  };

  const StaffForm = () => {
    const [formData, setFormData] = useState({
      name: selectedStaff?.name || '',
      tsc_no: selectedStaff?.tsc_no || '',
      email: selectedStaff?.email || '',
      phone: selectedStaff?.phone || '',
      employment_date: selectedStaff?.employment_date || '',
      status: selectedStaff?.status || 'active',
      subjects: selectedStaff?.subjects || [],
      qualifications: selectedStaff?.qualifications || []
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      handleSaveStaff(formData);
    };

    const addQualification = () => {
      setFormData(prev => ({
        ...prev,
        qualifications: [...prev.qualifications, { id: generateId(), title: '', institution: '', year: new Date().getFullYear() }]
      }));
    };

    const removeQualification = (index: number) => {
      setFormData(prev => ({
        ...prev,
        qualifications: prev.qualifications.filter((_: any, i: number) => i !== index)
      }));
    };

    const updateQualification = (index: number, field: string, value: any) => {
      setFormData(prev => ({
        ...prev,
        qualifications: prev.qualifications.map((qual: any, i: number) =>
          i === index ? { ...qual, [field]: value } : qual
        )
      }));
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>
          <div>
            <Label htmlFor="tsc_no">TSC Number *</Label>
            <Input
              id="tsc_no"
              value={formData.tsc_no}
              onChange={(e) => setFormData(prev => ({ ...prev, tsc_no: e.target.value }))}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="employment_date">Employment Date</Label>
            <Input
              id="employment_date"
              type="date"
              value={formData.employment_date}
              onChange={(e) => setFormData(prev => ({ ...prev, employment_date: e.target.value }))}
            />
          </div>
          <div>
            <Label>Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="leave">On Leave</SelectItem>
                <SelectItem value="terminated">Terminated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label>Subjects</Label>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {mockSubjects.map((subject) => (
              <label key={subject.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.subjects.includes(subject.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFormData(prev => ({ ...prev, subjects: [...prev.subjects, subject.id] }));
                    } else {
                      setFormData(prev => ({ ...prev, subjects: prev.subjects.filter((s: string) => s !== subject.id) }));
                    }
                  }}
                />
                <span className="text-sm">{subject.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <Label>Qualifications</Label>
            <Button type="button" onClick={addQualification} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Qualification
            </Button>
          </div>
          
          <div className="space-y-4">
            {formData.qualifications.map((qualification: any, index: number) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Qualification {index + 1}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeQualification(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={qualification.title}
                      onChange={(e) => updateQualification(index, 'title', e.target.value)}
                      placeholder="Qualification title"
                    />
                  </div>
                  <div>
                    <Label>Institution</Label>
                    <Input
                      value={qualification.institution}
                      onChange={(e) => updateQualification(index, 'institution', e.target.value)}
                      placeholder="Institution name"
                    />
                  </div>
                </div>
                <div>
                  <Label>Year</Label>
                  <Input
                    type="number"
                    value={qualification.year}
                    onChange={(e) => updateQualification(index, 'year', parseInt(e.target.value))}
                    min="1950"
                    max={new Date().getFullYear()}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex space-x-2">
          <Button type="submit">
            <Save className="h-4 w-4 mr-2" />
            {selectedStaff ? 'Update Staff' : 'Add Staff'}
          </Button>
          <Button type="button" variant="outline" onClick={() => setShowStaffForm(false)}>
            Cancel
          </Button>
        </div>
      </form>
    );
  };

  const TPADExportDialog = ({ staffMember }: { staffMember: any }) => {
    const [selectedItems, setSelectedItems] = useState<string[]>([
      'lesson_plans',
      'attendance_data',
      'assessment_evidence',
      'professional_development'
    ]);

    const tpadItems = [
      { id: 'lesson_plans', name: 'Lesson Plans', description: 'All lesson plans for the term' },
      { id: 'attendance_data', name: 'Attendance Records', description: 'Student attendance data' },
      { id: 'assessment_evidence', name: 'Assessment Evidence', description: 'SBA tasks and evidence' },
      { id: 'professional_development', name: 'Professional Development', description: 'Training certificates and records' },
      { id: 'performance_reviews', name: 'Performance Reviews', description: 'Annual performance evaluations' },
      { id: 'student_feedback', name: 'Student Feedback', description: 'Student evaluation forms' }
    ];

    const handleExport = () => {
      generateReport({
        type: 'tpad_evidence_bundle',
        title: `TPAD Evidence Bundle - ${staffMember.name}`,
        data: { staff: staffMember, items: selectedItems },
        format: 'zip'
      });
      setShowTPADDialog(false);
    };

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">TPAD Evidence Bundle</h3>
          <p className="text-gray-600">Select items to include in the TPAD evidence bundle for {staffMember.name}</p>
        </div>

        <div className="space-y-3">
          {tpadItems.map((item) => (
            <label key={item.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
              <input
                type="checkbox"
                checked={selectedItems.includes(item.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedItems(prev => [...prev, item.id]);
                  } else {
                    setSelectedItems(prev => prev.filter(id => id !== item.id));
                  }
                }}
                className="mt-1"
              />
              <div>
                <p className="font-medium text-gray-900">{item.name}</p>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            </label>
          ))}
        </div>

        <div className="flex space-x-2">
          <Button onClick={handleExport} disabled={selectedItems.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            Generate TPAD Bundle
          </Button>
          <Button variant="outline" onClick={() => setShowTPADDialog(false)}>
            Cancel
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Staff & TPAD</h1>
          <p className="text-gray-600 mt-1">Manage staff records and teacher performance documentation</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="secondary" className="bg-blue-50 text-blue-700">
            {allStaff.length} Staff Members
          </Badge>
          <Button onClick={handleAddStaff}>
            <Plus className="h-4 w-4 mr-2" />
            Add Staff
          </Button>
          <Button variant="outline" onClick={handleExportStaffDirectory}>
            <Download className="h-4 w-4 mr-2" />
            Staff Directory
          </Button>
          <Button onClick={() => setShowReportExporter(true)} variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            All Reports
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Staff</p>
                <p className="text-2xl font-bold text-blue-600">{allStaff.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Teachers</p>
                <p className="text-2xl font-bold text-green-600">{allStaff.filter(s => s.status === 'active').length}</p>
              </div>
              <GraduationCap className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Performance</p>
                <p className="text-2xl font-bold text-purple-600">87%</p>
              </div>
              <Award className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">TPAD Ready</p>
                <p className="text-2xl font-bold text-orange-600">{Math.floor(allStaff.length * 0.8)}</p>
              </div>
              <FileText className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="staff">Staff Directory ({allStaff.length})</TabsTrigger>
          <TabsTrigger value="performance">Performance Reviews</TabsTrigger>
          <TabsTrigger value="tpad">TPAD Management</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="staff" className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search staff..."
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

          {filteredStaff.map((staffMember) => (
            <StaffCard key={staffMember.id} staffMember={staffMember} />
          ))}
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {allStaff.map((staffMember) => {
              const performance = Math.floor(Math.random() * 20) + 80;
              return (
                <Card key={staffMember.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">{staffMember.name}</h3>
                        <p className="text-sm text-gray-600">{staffMember.tsc_no}</p>
                      </div>
                      <Badge variant="default">{performance}%</Badge>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Teaching Effectiveness:</span>
                        <span className="font-semibold">{performance - 5}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Student Engagement:</span>
                        <span className="font-semibold">{performance + 2}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Professional Development:</span>
                        <span className="font-semibold">{performance - 3}%</span>
                      </div>
                    </div>

                    <div className="flex space-x-2 mt-4">
                      <Button size="sm" onClick={() => handlePerformanceReview(staffMember)}>
                        <Award className="h-4 w-4 mr-1" />
                        Review
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => generateReport({ type: 'performance_summary', title: `${staffMember.name} Performance`, data: staffMember, format: 'pdf' })}>
                        <Download className="h-4 w-4 mr-1" />
                        Export
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="tpad" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>TPAD Evidence Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {allStaff.map((staffMember) => (
                  <div key={staffMember.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{staffMember.name}</h4>
                      <p className="text-sm text-gray-600">TSC: {staffMember.tsc_no}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline">Evidence: 85% Complete</Badge>
                        <Badge variant="default">Ready for Review</Badge>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleTPADExport(staffMember)}>
                        <FileText className="h-4 w-4 mr-1" />
                        Generate Bundle
                      </Button>
                      <Button size="sm" onClick={() => generateReport({ type: 'tpad_checklist', title: `TPAD Checklist - ${staffMember.name}`, data: staffMember, format: 'pdf' })}>
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Checklist
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Staff Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: 'Staff Directory', description: 'Complete staff listing', action: handleExportStaffDirectory },
                    { name: 'Performance Summary', description: 'All staff performance data', action: () => generateReport({ type: 'staff_performance_summary', title: 'Staff Performance Summary', data: allStaff, format: 'xlsx' }) },
                    { name: 'Workload Analysis', description: 'Teaching load distribution', action: () => generateReport({ type: 'workload_analysis', title: 'Teaching Workload Analysis', data: allStaff, format: 'pdf' }) },
                    { name: 'Qualification Matrix', description: 'Staff qualifications overview', action: () => generateReport({ type: 'qualification_matrix', title: 'Staff Qualification Matrix', data: allStaff, format: 'xlsx' }) },
                    { name: 'Leave Records', description: 'Staff leave and absence data', action: () => generateReport({ type: 'leave_records', title: 'Staff Leave Records', data: allStaff, format: 'pdf' }) }
                  ].map((report, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{report.name}</p>
                        <p className="text-sm text-gray-600">{report.description}</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={report.action}>
                        <Download className="h-4 w-4 mr-1" />
                        Generate
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>TPAD Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: 'TPAD Evidence Bundles', description: 'Individual teacher portfolios', action: () => generateReport({ type: 'bulk_tpad_bundles', title: 'Bulk TPAD Bundles', data: allStaff, format: 'zip' }) },
                    { name: 'Performance Analytics', description: 'School-wide performance trends', action: () => generateReport({ type: 'performance_analytics', title: 'Performance Analytics', data: allStaff, format: 'pdf' }) },
                    { name: 'Professional Development', description: 'Training and development records', action: () => generateReport({ type: 'professional_development', title: 'Professional Development Report', data: allStaff, format: 'xlsx' }) },
                    { name: 'Appraisal Summary', description: 'Annual appraisal outcomes', action: () => generateReport({ type: 'appraisal_summary', title: 'Staff Appraisal Summary', data: allStaff, format: 'pdf' }) }
                  ].map((report, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{report.name}</p>
                        <p className="text-sm text-gray-600">{report.description}</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={report.action}>
                        <Download className="h-4 w-4 mr-1" />
                        Generate
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Staff Form Dialog */}
      <Dialog open={showStaffForm} onOpenChange={setShowStaffForm}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedStaff ? 'Edit Staff Member' : 'Add New Staff Member'}</DialogTitle>
          </DialogHeader>
          <StaffForm />
        </DialogContent>
      </Dialog>

      {/* Performance Review Dialog */}
      <Dialog open={showPerformanceReview} onOpenChange={setShowPerformanceReview}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Performance Review - {staffForReview?.name}</DialogTitle>
          </DialogHeader>
          {staffForReview && (
            <PerformanceReview 
              teacher={staffForReview} 
              onClose={() => setShowPerformanceReview(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* TPAD Export Dialog */}
      <Dialog open={showTPADDialog} onOpenChange={setShowTPADDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>TPAD Evidence Bundle</DialogTitle>
          </DialogHeader>
          {staffForTPAD && <TPADExportDialog staffMember={staffForTPAD} />}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Staff Member</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Are you sure you want to delete <strong>{staffToDelete?.name}</strong>?</p>
            <p className="text-sm text-gray-600">This action cannot be undone.</p>
            <div className="flex space-x-2">
              <Button variant="destructive" onClick={confirmDelete}>
                Delete Staff Member
              </Button>
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Report Exporter Dialog */}
      <Dialog open={showReportExporter} onOpenChange={setShowReportExporter}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Staff Reports</DialogTitle>
          </DialogHeader>
          <ReportExporter 
            data={allStaff} 
            title="Staff Reports" 
            type="staff"
            onClose={() => setShowReportExporter(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
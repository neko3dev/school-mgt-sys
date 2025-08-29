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
import { mockTeachers, mockSubjects } from '@/data/mock-data';
import { formatDate, generateId } from '@/lib/utils';
import { ReportExporter } from '@/components/features/ReportExporter';
import { useStaff } from '@/store';
import { 
  Users, 
  GraduationCap, 
  Calendar, 
  Award,
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
  BookOpen,
  Target
} from 'lucide-react';

export function Staff() {
  const [activeTab, setActiveTab] = useState('teachers');
  const [searchTerm, setSearchTerm] = useState('');
  const [showTeacherForm, setShowTeacherForm] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<any>(null);
  const [showTPADBuilder, setShowTPADBuilder] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState<any>(null);
  const [showReportExporter, setShowReportExporter] = useState(false);

  const { staff, addStaff, updateStaff, deleteStaff } = useStaff();

  const mockStaff = [
    ...mockTeachers,
    {
      id: 'staff-2',
      tsc_no: 'TSC789012',
      name: 'Mary Wanjiku Njeri',
      email: 'mary.njeri@karagita-primary.ac.ke',
      phone: '+254700123789',
      role: 'welfare_officer',
      subjects: [],
      qualifications: [
        {
          id: 'qual-2',
          title: 'Bachelor of Arts (Counseling Psychology)',
          institution: 'University of Nairobi',
          year: 2016
        }
      ],
      employment_date: '2020-03-01',
      status: 'active'
    },
    {
      id: 'staff-3',
      tsc_no: 'TSC345678',
      name: 'Peter Kiprotich Kones',
      email: 'peter.kones@karagita-primary.ac.ke',
      phone: '+254700456123',
      role: 'hod',
      subjects: ['sub-3', 'sub-4'],
      qualifications: [
        {
          id: 'qual-3',
          title: 'Master of Education (Mathematics)',
          institution: 'Moi University',
          year: 2019
        }
      ],
      employment_date: '2018-01-15',
      status: 'active'
    }
  ];

  const allStaff = staff.length > 0 ? staff : mockStaff;

  const mockTPADData = [
    {
      id: generateId(),
      teacher_id: 'teacher-1',
      academic_year: '2024',
      term: 1,
      lesson_plans: 45,
      assessments_created: 12,
      student_progress: 89,
      professional_development: 3,
      status: 'in_progress',
      due_date: '2024-04-15'
    }
  ];

  const handleAddTeacher = () => {
    setSelectedTeacher(null);
    setShowTeacherForm(true);
  };

  const handleEditTeacher = (teacher: any) => {
    setSelectedTeacher(teacher);
    setShowTeacherForm(true);
  };

  const handleSaveTeacher = (teacherData: any) => {
    if (selectedTeacher) {
      updateStaff(selectedTeacher.id, teacherData);
    } else {
      addStaff(teacherData);
    }
    setShowTeacherForm(false);
  };

  const handleDeleteTeacher = (teacher: any) => {
    setTeacherToDelete(teacher);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (teacherToDelete) {
      deleteStaff(teacherToDelete.id);
      setShowDeleteDialog(false);
      setTeacherToDelete(null);
    }
  };

  const TeacherCard = ({ teacher }: { teacher: any }) => {
    const teacherSubjects = teacher.subjects?.map((subId: string) => 
      mockSubjects.find(s => s.id === subId)?.name
    ).filter(Boolean) || [];

    const workload = Math.floor(Math.random() * 10) + 15; // Mock workload

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-700 font-semibold">
                  {teacher.name.split(' ').map((n: string) => n[0]).join('')}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{teacher.name}</h3>
                <p className="text-sm text-gray-600">
                  TSC: {teacher.tsc_no} • {teacher.email}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="secondary" className="capitalize">
                    {teacher.role?.replace('_', ' ') || 'Teacher'}
                  </Badge>
                  <Badge variant={teacher.status === 'active' ? 'default' : 'secondary'}>
                    {teacher.status}
                  </Badge>
                  <Badge variant="outline">
                    {workload} periods/week
                  </Badge>
                </div>
                {teacherSubjects.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-500">Subjects: {teacherSubjects.join(', ')}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Staff Profile: {teacher.name}</DialogTitle>
                  </DialogHeader>
                  <TeacherProfile teacher={teacher} />
                </DialogContent>
              </Dialog>
              <Button variant="outline" size="sm" onClick={() => handleEditTeacher(teacher)}>
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <ReportExporter 
                    data={teacher} 
                    title={`${teacher.name} Profile`} 
                    type="privacy"
                  />
                </DialogContent>
              </Dialog>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-1" />
                    TPAD
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>TPAD Portfolio - {teacher.name}</DialogTitle>
                  </DialogHeader>
                  <TPADBuilder teacher={teacher} />
                </DialogContent>
              </Dialog>
              <Button variant="outline" size="sm" onClick={() => handleDeleteTeacher(teacher)}>
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
              <Button size="sm">
                <Award className="h-4 w-4 mr-1" />
                Performance
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const TeacherProfile = ({ teacher }: { teacher: any }) => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Full Name</label>
              <p className="text-gray-900">{teacher.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">TSC Number</label>
              <p className="text-gray-900 font-mono">{teacher.tsc_no}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Email</label>
              <p className="text-gray-900">{teacher.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Phone</label>
              <p className="text-gray-900">{teacher.phone}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Employment Date</label>
              <p className="text-gray-900">{formatDate(teacher.employment_date)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Status</label>
              <Badge variant={teacher.status === 'active' ? 'default' : 'secondary'}>
                {teacher.status}
              </Badge>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Role</label>
              <p className="text-gray-900 capitalize">{teacher.role?.replace('_', ' ') || 'Teacher'}</p>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Qualifications</h4>
          <div className="space-y-2">
            {teacher.qualifications?.map((qual: any) => (
              <div key={qual.id} className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-900">{qual.title}</p>
                <p className="text-sm text-gray-600">{qual.institution} • {qual.year}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex space-x-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex-1">
                <FileText className="h-4 w-4 mr-2" />
                Generate TPAD Bundle
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Export TPAD Bundle</DialogTitle>
              </DialogHeader>
              <ReportExporter 
                data={teacher} 
                title={`${teacher.name} TPAD Bundle`} 
                type="privacy"
              />
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Export Profile
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Export Staff Profile</DialogTitle>
              </DialogHeader>
              <ReportExporter 
                data={teacher} 
                title={`${teacher.name} Profile`} 
                type="privacy"
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    );
  };

  const TeacherForm = () => {
    const [formData, setFormData] = useState({
      name: selectedTeacher?.name || '',
      tsc_no: selectedTeacher?.tsc_no || '',
      email: selectedTeacher?.email || '',
      phone: selectedTeacher?.phone || '',
      role: selectedTeacher?.role || 'teacher',
      subjects: selectedTeacher?.subjects || [],
      employment_date: selectedTeacher?.employment_date || '',
      status: selectedTeacher?.status || 'active',
      qualifications: selectedTeacher?.qualifications || []
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      handleSaveTeacher(formData);
    };

    const addQualification = () => {
      const newQual = {
        id: Date.now().toString(),
        title: '',
        institution: '',
        year: new Date().getFullYear()
      };
      setFormData(prev => ({ 
        ...prev, 
        qualifications: [...prev.qualifications, newQual] 
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
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Role *</Label>
            <Select value={formData.role} onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="teacher">Teacher</SelectItem>
                <SelectItem value="class_teacher">Class Teacher</SelectItem>
                <SelectItem value="hod">Head of Department</SelectItem>
                <SelectItem value="welfare_officer">Welfare Officer</SelectItem>
                <SelectItem value="admin">Administrator</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="employment_date">Employment Date *</Label>
            <Input
              id="employment_date"
              type="date"
              value={formData.employment_date}
              onChange={(e) => setFormData(prev => ({ ...prev, employment_date: e.target.value }))}
              required
            />
          </div>
        </div>

        <div>
          <Label>Teaching Subjects</Label>
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
            {formData.qualifications.map((qual: any, index: number) => (
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
                      value={qual.title}
                      onChange={(e) => updateQualification(index, 'title', e.target.value)}
                      placeholder="Qualification title"
                    />
                  </div>
                  <div>
                    <Label>Institution</Label>
                    <Input
                      value={qual.institution}
                      onChange={(e) => updateQualification(index, 'institution', e.target.value)}
                      placeholder="Institution name"
                    />
                  </div>
                </div>
                <div>
                  <Label>Year</Label>
                  <Input
                    type="number"
                    value={qual.year}
                    onChange={(e) => updateQualification(index, 'year', parseInt(e.target.value))}
                    min="1980"
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
            {selectedTeacher ? 'Update Teacher' : 'Add Teacher'}
          </Button>
          <Button type="button" variant="outline" onClick={() => setShowTeacherForm(false)}>
            Cancel
          </Button>
        </div>
      </form>
    );
  };

  const TPADBuilder = ({ teacher }: { teacher: any }) => {
    const tpadData = mockTPADData.find(t => t.teacher_id === teacher.id);
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Academic Year</label>
              <p className="text-gray-900">{tpadData?.academic_year || '2024'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Term</label>
              <p className="text-gray-900">Term {tpadData?.term || 1}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Due Date</label>
              <p className="text-gray-900">{formatDate(tpadData?.due_date || new Date().toISOString())}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Status</label>
              <Badge variant={tpadData?.status === 'completed' ? 'default' : 'secondary'}>
                {tpadData?.status || 'Not Started'}
              </Badge>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900">TPAD Evidence</h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Lesson Plans</span>
                <Badge variant="default">{tpadData?.lesson_plans || 0}</Badge>
              </div>
              <Progress value={((tpadData?.lesson_plans || 0) / 50) * 100} className="mb-2" />
              <p className="text-xs text-gray-600">Target: 50 plans</p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Assessments</span>
                <Badge variant="default">{tpadData?.assessments_created || 0}</Badge>
              </div>
              <Progress value={((tpadData?.assessments_created || 0) / 15) * 100} className="mb-2" />
              <p className="text-xs text-gray-600">Target: 15 assessments</p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Student Progress</span>
                <Badge variant="default">{tpadData?.student_progress || 0}%</Badge>
              </div>
              <Progress value={tpadData?.student_progress || 0} className="mb-2" />
              <p className="text-xs text-gray-600">Class average improvement</p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Professional Development</span>
                <Badge variant="default">{tpadData?.professional_development || 0}</Badge>
              </div>
              <Progress value={((tpadData?.professional_development || 0) / 4) * 100} className="mb-2" />
              <p className="text-xs text-gray-600">Target: 4 sessions</p>
            </div>
          </div>
        </div>

        <div className="flex space-x-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Generate TPAD Bundle
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Export TPAD Bundle</DialogTitle>
              </DialogHeader>
              <ReportExporter 
                data={tpadData} 
                title={`${teacher.name} TPAD Bundle`} 
                type="privacy"
              />
            </DialogContent>
          </Dialog>
          <Button variant="outline" className="flex-1">
            <FileText className="h-4 w-4 mr-2" />
            View Evidence
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Staff Management</h1>
          <p className="text-gray-600 mt-1">Manage teachers, staff, and TPAD documentation</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="secondary" className="bg-blue-50 text-blue-700">
            {allStaff.length} Staff Members
          </Badge>
          <Button onClick={handleAddTeacher}>
            <Plus className="h-4 w-4 mr-2" />
            Add Staff
          </Button>
          <Button onClick={() => setShowReportExporter(true)} variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Staff Reports
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export All
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
                <DialogTitle>Staff Reports</DialogTitle>
              </DialogHeader>
              <ReportExporter 
                data={allStaff} 
                title="Staff Reports" 
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
                <p className="text-sm text-gray-600">Teachers</p>
                <p className="text-2xl font-bold text-green-600">{allStaff.filter(s => s.role?.includes('teacher')).length}</p>
              </div>
              <GraduationCap className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">TPAD Due</p>
                <p className="text-2xl font-bold text-orange-600">{mockTPADData.filter(t => t.status !== 'completed').length}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Workload</p>
                <p className="text-2xl font-bold text-purple-600">18</p>
              </div>
              <Target className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="teachers">Teachers ({allStaff.length})</TabsTrigger>
          <TabsTrigger value="tpad">TPAD ({mockTPADData.length})</TabsTrigger>
          <TabsTrigger value="workload">Workload Analysis</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="teachers" className="space-y-4">
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

          {allStaff.map((teacher) => (
            <TeacherCard key={teacher.id} teacher={teacher} />
          ))}
        </TabsContent>

        <TabsContent value="tpad" className="space-y-4">
          {allStaff.filter(s => s.role?.includes('teacher')).map((teacher) => (
            <Card key={teacher.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{teacher.name} - TPAD Portfolio</span>
                  <div className="flex space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View TPAD
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>TPAD Portfolio - {teacher.name}</DialogTitle>
                        </DialogHeader>
                        <TPADBuilder teacher={teacher} />
                      </DialogContent>
                    </Dialog>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Export Bundle
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Export TPAD Bundle</DialogTitle>
                        </DialogHeader>
                        <ReportExporter 
                          data={teacher} 
                          title={`${teacher.name} TPAD Bundle`} 
                          type="privacy"
                        />
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">45</div>
                    <div className="text-xs text-gray-600">Lesson Plans</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">12</div>
                    <div className="text-xs text-gray-600">Assessments</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-orange-600">89%</div>
                    <div className="text-xs text-gray-600">Student Progress</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-600">3</div>
                    <div className="text-xs text-gray-600">PD Sessions</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="workload" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Teaching Load Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {allStaff.filter(s => s.role?.includes('teacher')).map((teacher) => {
                  const workload = Math.floor(Math.random() * 10) + 15;
                  const maxLoad = 25;
                  const percentage = (workload / maxLoad) * 100;
                  
                  return (
                    <div key={teacher.id} className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{teacher.name}</p>
                        <p className="text-sm text-gray-600">{teacher.subjects?.length || 0} subjects</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="w-32">
                          <Progress 
                            value={percentage} 
                            className={percentage > 90 ? '[&>div]:bg-red-500' : percentage > 75 ? '[&>div]:bg-yellow-500' : '[&>div]:bg-green-500'}
                          />
                        </div>
                        <div className="text-right w-20">
                          <span className="font-semibold">{workload}</span>
                          <span className="text-sm text-gray-500">/{maxLoad}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
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
                    { name: 'Staff Directory', description: 'Complete staff listing with contacts', data: allStaff },
                    { name: 'Teaching Loads', description: 'Workload distribution analysis', data: allStaff },
                    { name: 'Qualifications Summary', description: 'Staff qualifications and certifications', data: allStaff },
                    { name: 'Leave Records', description: 'Staff attendance and leave tracking', data: allStaff }
                  ].map((report, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{report.name}</p>
                        <p className="text-sm text-gray-600">{report.description}</p>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-1" />
                            Generate
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Export {report.name}</DialogTitle>
                          </DialogHeader>
                          <ReportExporter 
                            data={report.data} 
                            title={report.name} 
                            type="privacy"
                          />
                        </DialogContent>
                      </Dialog>
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
                    { name: 'Individual TPAD Bundle', description: 'Complete evidence package per teacher', data: mockTPADData },
                    { name: 'School TPAD Summary', description: 'Overall TPAD completion status', data: mockTPADData },
                    { name: 'Professional Development Log', description: 'Training and development records', data: allStaff },
                    { name: 'Performance Analytics', description: 'Teaching effectiveness metrics', data: mockTPADData }
                  ].map((report, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{report.name}</p>
                        <p className="text-sm text-gray-600">{report.description}</p>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-1" />
                            Generate
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Export {report.name}</DialogTitle>
                          </DialogHeader>
                          <ReportExporter 
                            data={report.data} 
                            title={report.name} 
                            type="privacy"
                          />
                        </DialogContent>
                      </Dialog>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Teacher Form Dialog */}
      <Dialog open={showTeacherForm} onOpenChange={setShowTeacherForm}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedTeacher ? 'Edit Staff Member' : 'Add New Staff Member'}</DialogTitle>
          </DialogHeader>
          <TeacherForm />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Staff Member</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Are you sure you want to delete <strong>{teacherToDelete?.name}</strong>?</p>
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
          <ReportExporter data={allStaff} title="Staff Reports" type="privacy" />
        </DialogContent>
      </Dialog>
    </div>
  );
}
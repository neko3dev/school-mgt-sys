import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockLearners, mockClassrooms } from '@/data/mock-data';
import { useStudents, useReports } from '@/store';
import { StudentForm } from '@/components/forms/StudentForm';
import { formatDate } from '@/lib/utils';
import { ReportExporter } from '@/components/features/ReportExporter';
import { CBCReportCard } from '@/components/features/CBCReportCard';
import { 
  Search, 
  Plus, 
  Eye, 
  Edit, 
  FileText, 
  Users, 
  Phone,
  Mail,
  AlertTriangle,
  CheckCircle,
  QrCode,
  Download,
  Trash2
} from 'lucide-react';

export function Students() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [showStudentForm, setShowStudentForm] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<any>(null);
  const [showReportCard, setShowReportCard] = useState(false);
  const [reportStudent, setReportStudent] = useState<any>(null);
  
  const { students, addStudent, updateStudent, deleteStudent } = useStudents();
  const { generateReport } = useReports();
  
  // Use mock data initially, but allow for real CRUD operations
  const allStudents = students.length > 0 ? students : mockLearners;

  const filteredStudents = allStudents.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.admission_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.upi.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getClassroom = (classroomId: string) => {
    return mockClassrooms.find(c => c.id === classroomId);
  };

  const handleAddStudent = () => {
    setSelectedStudent(null);
    setShowStudentForm(true);
  };

  const handleEditStudent = (student: any) => {
    setSelectedStudent(student);
    setShowStudentForm(true);
  };

  const handleSaveStudent = (studentData: any) => {
    if (selectedStudent) {
      updateStudent(selectedStudent.id, studentData);
    } else {
      addStudent(studentData);
    }
  };

  const handleDeleteStudent = (student: any) => {
    setStudentToDelete(student);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (studentToDelete) {
      deleteStudent(studentToDelete.id);
      setShowDeleteDialog(false);
      setStudentToDelete(null);
    }
  };

  const handleGenerateReportCard = (student: any) => {
    setReportStudent(student);
    setShowReportCard(true);
  };

  const handleExportStudentData = (student: any) => {
    generateReport({
      type: 'student_profile',
      title: `${student.name} - Student Profile`,
      data: student,
      format: 'pdf'
    });
  };

  const handleBulkExport = () => {
    generateReport({
      type: 'student_directory',
      title: 'Student Directory',
      data: filteredStudents,
      format: 'xlsx'
    });
  };

  const handleBulkDelete = () => {
    if (confirm(`Delete ${selectedStudents.length} students?`)) {
      selectedStudents.forEach(id => deleteStudent(id));
      setSelectedStudents([]);
    }
  };

  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  const toggleStudentSelection = (studentId: string) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const selectAllStudents = () => {
    setSelectedStudents(filteredStudents.map(s => s.id));
  };

  const clearSelection = () => {
    setSelectedStudents([]);
  };
  const StudentCard = ({ student }: { student: any }) => {
    const classroom = getClassroom(student.classroom_id);
    
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <input
                type="checkbox"
                checked={selectedStudents.includes(student.id)}
                onChange={() => toggleStudentSelection(student.id)}
                className="rounded border-gray-300"
              />
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-700 font-semibold">
                  {student.name.split(' ').map((n: string) => n[0]).join('')}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{student.name}</h3>
                <p className="text-sm text-gray-600">
                  {student.admission_no} • UPI: {student.upi}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="secondary">
                    Grade {classroom?.grade}{classroom?.stream}
                  </Badge>
                  <Badge variant={student.status === 'active' ? 'default' : 'secondary'}>
                    {student.status}
                  </Badge>
                  {student.special_needs && (
                    <Badge variant="outline" className="text-orange-600 border-orange-200">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      SNE
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Student Profile: {student.name}</DialogTitle>
                  </DialogHeader>
                  <StudentProfile student={student} />
                </DialogContent>
              </Dialog>
              <Button variant="outline" size="sm" onClick={() => handleEditStudent(student)}>
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleGenerateReportCard(student)}>
                <FileText className="h-4 w-4 mr-1" />
                Report Card
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleExportStudentData(student)}>
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleDeleteStudent(student)}>
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const StudentProfile = ({ student }: { student: any }) => {
    const classroom = getClassroom(student.classroom_id);
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Full Name</label>
              <p className="text-gray-900">{student.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Date of Birth</label>
              <p className="text-gray-900">{formatDate(student.dob)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Gender</label>
              <p className="text-gray-900">{student.sex === 'M' ? 'Male' : 'Female'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Class</label>
              <p className="text-gray-900">Grade {classroom?.grade}{classroom?.stream}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Admission Number</label>
              <p className="text-gray-900 font-mono">{student.admission_no}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">UPI Number</label>
              <p className="text-gray-900 font-mono">{student.upi}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Status</label>
              <Badge variant={student.status === 'active' ? 'default' : 'secondary'}>
                {student.status}
              </Badge>
            </div>
            {student.special_needs && (
              <div>
                <label className="text-sm font-medium text-gray-600">Special Needs</label>
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                  <span className="text-orange-600">SNE Support Required</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="border-t pt-4">
          <h4 className="font-semibold text-gray-900 mb-3">Guardians</h4>
          {student.guardians?.length > 0 ? (
            <div className="space-y-3">
              {student.guardians.map((guardian: any, index: number) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{guardian.name}</p>
                      <p className="text-sm text-gray-600 capitalize">{guardian.relation}</p>
                    </div>
                    <div className="text-right text-sm">
                      <div className="flex items-center text-gray-600">
                        <Phone className="h-4 w-4 mr-1" />
                        {guardian.phone}
                      </div>
                      {guardian.email && (
                        <div className="flex items-center text-gray-600 mt-1">
                          <Mail className="h-4 w-4 mr-1" />
                          {guardian.email}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">No guardian information recorded</p>
          )}
        </div>

        <div className="border-t pt-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-gray-900">Digital Learner Passport</h4>
            <Button variant="outline" size="sm">
              <QrCode className="h-4 w-4 mr-2" />
              Generate QR Code
            </Button>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Secure, portable record of competencies and achievements for seamless transitions.
          </p>
        </div>

        <div className="flex space-x-2">
          <Button className="flex-1">
            <FileText className="h-4 w-4 mr-2" />
            Generate Report Card
          </Button>
          <Button variant="outline" className="flex-1">
            <Download className="h-4 w-4 mr-2" />
            Export Profile
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Students</h1>
          <p className="text-gray-600 mt-1">Manage learner profiles and CBC records</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="secondary" className="bg-blue-50 text-blue-700">
            {filteredStudents.length} Students
          </Badge>
          <Button onClick={handleAddStudent}>
            <Plus className="h-4 w-4 mr-2" />
            Add Student
          </Button>
        </div>
      </div>

      {selectedStudents.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-blue-600" />
                <span className="text-blue-800 font-medium">
                  {selectedStudents.length} students selected
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" onClick={handleBulkExport}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Selected
                </Button>
                <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Selected
                </Button>
                <Button variant="outline" size="sm" onClick={clearSelection}>
                  Clear Selection
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by name, admission no, or UPI..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={selectedStudents.length === filteredStudents.length ? clearSelection : selectAllStudents}>
            {selectedStudents.length === filteredStudents.length ? 'Deselect All' : 'Select All'}
          </Button>
          <Button variant="outline" onClick={handleBulkExport}>
            <Download className="h-4 w-4 mr-2" />
            Export List
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Generate Reports
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Student Reports</DialogTitle>
              </DialogHeader>
              <ReportExporter 
                data={filteredStudents} 
                title="Student Reports" 
                type="students"
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Students ({filteredStudents.length})</TabsTrigger>
          <TabsTrigger value="active">Active ({filteredStudents.filter(s => s.status === 'active').length})</TabsTrigger>
          <TabsTrigger value="sne">SNE Support ({filteredStudents.filter(s => s.special_needs).length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {filteredStudents.map((student) => (
            <StudentCard key={student.id} student={student} />
          ))}
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          {filteredStudents.filter(s => s.status === 'active').map((student) => (
            <StudentCard key={student.id} student={student} />
          ))}
        </TabsContent>

        <TabsContent value="sne" className="space-y-4">
          {filteredStudents.filter(s => s.special_needs).map((student) => (
            <StudentCard key={student.id} student={student} />
          ))}
        </TabsContent>
      </Tabs>

      {filteredStudents.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No students found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? 'Try adjusting your search criteria' : 'Get started by adding your first student'}
            </p>
            <Button onClick={handleAddStudent}>
              <Plus className="h-4 w-4 mr-2" />
              Add Student
            </Button>
            <Button variant="outline" onClick={handleBulkExport}>
              <Download className="h-4 w-4 mr-2" />
              Export All
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Report Card Dialog */}
      <Dialog open={showReportCard} onOpenChange={setShowReportCard}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>CBC Report Card - {reportStudent?.name}</DialogTitle>
          </DialogHeader>
          {reportStudent && (
            <CBCReportCard 
              student={reportStudent}
              term={1}
              academicYear="2024"
              assessments={[]}
              school={{ name: "Karagita Primary School" }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Enrolled</p>
                <p className="text-2xl font-bold text-blue-600">{allStudents.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Status</p>
                <p className="text-2xl font-bold text-green-600">
                  {allStudents.filter(s => s.status === 'active').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">SNE Support</p>
                <p className="text-2xl font-bold text-orange-600">
                  {allStudents.filter(s => s.special_needs).length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">UPI Registered</p>
                <p className="text-2xl font-bold text-purple-600">100%</p>
              </div>
              <FileText className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Student Form Dialog */}
      <Dialog open={showStudentForm} onOpenChange={setShowStudentForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <StudentForm
            student={selectedStudent}
            onClose={() => setShowStudentForm(false)}
            onSave={handleSaveStudent}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Student</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Are you sure you want to delete <strong>{studentToDelete?.name}</strong>?</p>
            <p className="text-sm text-gray-600">This action cannot be undone.</p>
            <div className="flex space-x-2">
              <Button variant="destructive" onClick={confirmDelete}>
                Delete Student
              </Button>
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
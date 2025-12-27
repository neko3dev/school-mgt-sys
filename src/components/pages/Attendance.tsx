import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { mockLearners, mockClassrooms, mockAttendance } from '@/data/mock-data';
import { ReportExporter } from '@/components/features/ReportExporter';
import { formatDate, generateId } from '@/lib/utils';
import { useAttendance, useReports } from '@/store';
import { 
  Calendar, 
  Users, 
  CheckCircle, 
  X,
  Clock,
  AlertTriangle,
  Plus,
  Eye,
  Edit,
  Download,
  Search,
  Filter,
  Save,
  Trash2,
  FileText,
  BarChart3,
  UserCheck,
  UserX,
  UserMinus
} from 'lucide-react';

export function Attendance() {
  const [activeTab, setActiveTab] = useState('daily');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAttendanceForm, setShowAttendanceForm] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<any>(null);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [bulkStatus, setBulkStatus] = useState('present');
  const [showReportExporter, setShowReportExporter] = useState(false);

  const { attendance, addAttendanceRecord, updateAttendanceRecord, deleteAttendanceRecord } = useAttendance();
  const { generateReport } = useReports();

  const allAttendance = attendance.length > 0 ? attendance : mockAttendance;

  const filteredStudents = mockLearners.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.admission_no.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClass === 'all' || student.classroom_id === selectedClass;
    return matchesSearch && matchesClass;
  });

  const getAttendanceForStudent = (studentId: string, date: string) => {
    return allAttendance.find(a => 
      a.learner_id === studentId && 
      a.date === date && 
      a.type === 'homeroom'
    );
  };

  const handleMarkAttendance = (studentId: string, status: string, reason?: string) => {
    const existingRecord = getAttendanceForStudent(studentId, selectedDate);
    
    if (existingRecord) {
      updateAttendanceRecord(existingRecord.id, { status, reason });
    } else {
      addAttendanceRecord({
        date: selectedDate,
        type: 'homeroom',
        learner_id: studentId,
        status,
        reason,
        recorded_by: 'current-user',
        recorded_at: new Date().toISOString()
      });
    }
  };

  const handleBulkMarkAttendance = () => {
    selectedStudents.forEach(studentId => {
      handleMarkAttendance(studentId, bulkStatus);
    });
    setSelectedStudents([]);
    setShowBulkActions(false);
  };

  const handleEditRecord = (record: any) => {
    setSelectedRecord(record);
    setShowAttendanceForm(true);
  };

  const handleSaveRecord = (recordData: any) => {
    if (selectedRecord) {
      updateAttendanceRecord(selectedRecord.id, recordData);
    } else {
      addAttendanceRecord(recordData);
    }
    setShowAttendanceForm(false);
  };

  const handleDeleteRecord = (record: any) => {
    setRecordToDelete(record);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (recordToDelete) {
      deleteAttendanceRecord(recordToDelete.id);
      setShowDeleteDialog(false);
      setRecordToDelete(null);
    }
  };

  const handleExportDailyRegister = () => {
    generateReport({
      type: 'daily_attendance_register',
      title: `Daily Register - ${formatDate(selectedDate)}`,
      data: { date: selectedDate, students: filteredStudents, attendance: allAttendance },
      format: 'pdf'
    });
  };

  const handleExportMonthlyReport = () => {
    generateReport({
      type: 'monthly_attendance_summary',
      title: 'Monthly Attendance Summary',
      data: allAttendance,
      format: 'xlsx'
    });
  };

  const handleExportAbsenteeismReport = () => {
    const absentStudents = allAttendance.filter(a => a.status === 'absent');
    generateReport({
      type: 'absenteeism_analysis',
      title: 'Absenteeism Analysis Report',
      data: absentStudents,
      format: 'pdf'
    });
  };

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

  const getAttendanceStats = () => {
    const todayAttendance = allAttendance.filter(a => a.date === selectedDate);
    const present = todayAttendance.filter(a => a.status === 'present').length;
    const absent = todayAttendance.filter(a => a.status === 'absent').length;
    const late = todayAttendance.filter(a => a.status === 'late').length;
    const total = filteredStudents.length;
    
    return { present, absent, late, total, rate: total > 0 ? (present / total) * 100 : 0 };
  };

  const stats = getAttendanceStats();

  const AttendanceForm = () => {
    const [formData, setFormData] = useState({
      learner_id: selectedRecord?.learner_id || '',
      date: selectedRecord?.date || selectedDate,
      type: selectedRecord?.type || 'homeroom',
      status: selectedRecord?.status || 'present',
      reason: selectedRecord?.reason || ''
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      handleSaveRecord(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
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
            <Label>Date *</Label>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Type</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="homeroom">Homeroom</SelectItem>
                <SelectItem value="lesson">Lesson</SelectItem>
                <SelectItem value="activity">Activity</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Status *</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="present">Present</SelectItem>
                <SelectItem value="absent">Absent</SelectItem>
                <SelectItem value="late">Late</SelectItem>
                <SelectItem value="excused">Excused</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {(formData.status === 'absent' || formData.status === 'late' || formData.status === 'excused') && (
          <div>
            <Label>Reason</Label>
            <Input
              value={formData.reason}
              onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
              placeholder="Enter reason for absence/lateness"
            />
          </div>
        )}

        <div className="flex space-x-2">
          <Button type="submit">
            <Save className="h-4 w-4 mr-2" />
            {selectedRecord ? 'Update Record' : 'Mark Attendance'}
          </Button>
          <Button type="button" variant="outline" onClick={() => setShowAttendanceForm(false)}>
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
          <h1 className="text-3xl font-bold text-gray-900">Attendance</h1>
          <p className="text-gray-600 mt-1">Track daily attendance and generate reports</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="secondary" className="bg-green-50 text-green-700">
            {stats.rate.toFixed(1)}% Present Today
          </Badge>
          <Button onClick={() => setShowAttendanceForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Mark Attendance
          </Button>
          <Button variant="outline" onClick={handleExportDailyRegister}>
            <Download className="h-4 w-4 mr-2" />
            Daily Register
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
                <p className="text-sm text-gray-600">Present</p>
                <p className="text-2xl font-bold text-green-600">{stats.present}</p>
              </div>
              <UserCheck className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Absent</p>
                <p className="text-2xl font-bold text-red-600">{stats.absent}</p>
              </div>
              <UserX className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Late</p>
                <p className="text-2xl font-bold text-orange-600">{stats.late}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Attendance Rate</p>
                <p className="text-2xl font-bold text-blue-600">{stats.rate.toFixed(1)}%</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="daily">Daily Attendance</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="space-y-4">
          <div className="flex items-center space-x-4">
            <div>
              <Label>Date</Label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            <div>
              <Label>Class</Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {mockClassrooms.map((classroom) => (
                    <SelectItem key={classroom.id} value={classroom.id}>
                      Grade {classroom.grade}{classroom.stream}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {selectedStudents.length > 0 && (
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    <span className="text-blue-800 font-medium">
                      {selectedStudents.length} students selected
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Select value={bulkStatus} onValueChange={setBulkStatus}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="present">Present</SelectItem>
                        <SelectItem value="absent">Absent</SelectItem>
                        <SelectItem value="late">Late</SelectItem>
                        <SelectItem value="excused">Excused</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button onClick={handleBulkMarkAttendance} size="sm">
                      Mark All
                    </Button>
                    <Button variant="outline" size="sm" onClick={clearSelection}>
                      Clear
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Attendance Register - {formatDate(selectedDate)}</span>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={selectedStudents.length === filteredStudents.length ? clearSelection : selectAllStudents}>
                    {selectedStudents.length === filteredStudents.length ? 'Deselect All' : 'Select All'}
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleExportDailyRegister}>
                    <Download className="h-4 w-4 mr-1" />
                    Export Register
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <input
                        type="checkbox"
                        checked={selectedStudents.length === filteredStudents.length}
                        onChange={selectedStudents.length === filteredStudents.length ? clearSelection : selectAllStudents}
                      />
                    </TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Admission No</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => {
                    const attendanceRecord = getAttendanceForStudent(student.id, selectedDate);
                    const classroom = mockClassrooms.find(c => c.id === student.classroom_id);
                    
                    return (
                      <TableRow key={student.id}>
                        <TableCell>
                          <input
                            type="checkbox"
                            checked={selectedStudents.includes(student.id)}
                            onChange={() => toggleStudentSelection(student.id)}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell className="font-mono text-sm">{student.admission_no}</TableCell>
                        <TableCell>Grade {classroom?.grade}{classroom?.stream}</TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button
                              variant={attendanceRecord?.status === 'present' ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => handleMarkAttendance(student.id, 'present')}
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Present
                            </Button>
                            <Button
                              variant={attendanceRecord?.status === 'absent' ? 'destructive' : 'outline'}
                              size="sm"
                              onClick={() => handleMarkAttendance(student.id, 'absent')}
                            >
                              <X className="h-3 w-3 mr-1" />
                              Absent
                            </Button>
                            <Button
                              variant={attendanceRecord?.status === 'late' ? 'secondary' : 'outline'}
                              size="sm"
                              onClick={() => handleMarkAttendance(student.id, 'late')}
                            >
                              <Clock className="h-3 w-3 mr-1" />
                              Late
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-600">
                            {attendanceRecord?.reason || '-'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            {attendanceRecord && (
                              <>
                                <Button variant="outline" size="sm" onClick={() => handleEditRecord(attendanceRecord)}>
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => handleDeleteRecord(attendanceRecord)}>
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Attendance Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day, index) => {
                    const rate = Math.floor(Math.random() * 10) + 90;
                    return (
                      <div key={day} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{day}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full" 
                              style={{ width: `${rate}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-semibold w-12">{rate}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Attendance by Class</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockClassrooms.map((classroom) => {
                    const rate = Math.floor(Math.random() * 15) + 85;
                    return (
                      <div key={classroom.id} className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          Grade {classroom.grade}{classroom.stream}
                        </span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full" 
                              style={{ width: `${rate}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-semibold">{rate}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Absenteeism Patterns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                  <p className="font-semibold text-red-800">Chronic Absenteeism</p>
                  <p className="text-2xl font-bold text-red-600">3</p>
                  <p className="text-sm text-red-600">Students {'>'} 20% absent</p>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                  <p className="font-semibold text-yellow-800">Frequent Lateness</p>
                  <p className="text-2xl font-bold text-yellow-600">8</p>
                  <p className="text-sm text-yellow-600">Students often late</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="font-semibold text-green-800">Perfect Attendance</p>
                  <p className="text-2xl font-bold text-green-600">45</p>
                  <p className="text-sm text-green-600">Students 100% present</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Attendance Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: 'Daily Register', description: 'Single day attendance record', action: handleExportDailyRegister },
                    { name: 'Weekly Summary', description: 'Week-long attendance analysis', action: () => generateReport({ type: 'weekly_attendance', title: 'Weekly Attendance Summary', data: allAttendance, format: 'pdf' }) },
                    { name: 'Monthly Report', description: 'Monthly attendance statistics', action: handleExportMonthlyReport },
                    { name: 'Absenteeism Analysis', description: 'Focus on attendance issues', action: handleExportAbsenteeismReport },
                    { name: 'Class Comparison', description: 'Compare attendance across classes', action: () => generateReport({ type: 'class_attendance_comparison', title: 'Class Attendance Comparison', data: allAttendance, format: 'xlsx' }) }
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
                <CardTitle>Export Options</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Quick Exports</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm" onClick={() => generateReport({ type: 'attendance_csv', title: 'Attendance Data', data: allAttendance, format: 'csv' })}>
                        <Download className="h-4 w-4 mr-1" />
                        CSV Export
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => generateReport({ type: 'attendance_excel', title: 'Attendance Workbook', data: allAttendance, format: 'xlsx' })}>
                        <Download className="h-4 w-4 mr-1" />
                        Excel Export
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => generateReport({ type: 'attendance_pdf', title: 'Attendance Report', data: allAttendance, format: 'pdf' })}>
                        <Download className="h-4 w-4 mr-1" />
                        PDF Report
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => generateReport({ type: 'attendance_json', title: 'Attendance Data', data: allAttendance, format: 'json' })}>
                        <Download className="h-4 w-4 mr-1" />
                        JSON Export
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Scheduled Reports</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Daily register (PDF)</span>
                        <Badge variant="default">Active</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Weekly summary (Excel)</span>
                        <Badge variant="default">Active</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Monthly analytics (PDF)</span>
                        <Badge variant="secondary">Paused</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Attendance Form Dialog */}
      <Dialog open={showAttendanceForm} onOpenChange={setShowAttendanceForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedRecord ? 'Edit Attendance Record' : 'Mark Attendance'}</DialogTitle>
          </DialogHeader>
          <AttendanceForm />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Attendance Record</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Are you sure you want to delete this attendance record?</p>
            <p className="text-sm text-gray-600">This action cannot be undone.</p>
            <div className="flex space-x-2">
              <Button variant="destructive" onClick={confirmDelete}>
                Delete Record
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
            <DialogTitle>Attendance Reports</DialogTitle>
          </DialogHeader>
          <ReportExporter 
            data={allAttendance} 
            title="Attendance Reports" 
            type="attendance"
            onClose={() => setShowReportExporter(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
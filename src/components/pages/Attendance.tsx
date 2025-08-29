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
import { Progress } from '@/components/ui/progress';
import { mockAttendance, mockLearners, mockClassrooms } from '@/data/mock-data';
import { useAttendance } from '@/store';
import { formatDate } from '@/lib/utils';
import { ReportExporter } from '@/components/features/ReportExporter';
import { 
  Calendar, 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  TrendingUp,
  Download,
  Plus,
  Eye,
  Edit,
  Save,
  FileText,
  Filter
} from 'lucide-react';

export function Attendance() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('all');
  const [activeTab, setActiveTab] = useState('daily');
  const [showMarkAttendance, setShowMarkAttendance] = useState(false);
  const [showBulkMark, setShowBulkMark] = useState(false);
  const [attendanceData, setAttendanceData] = useState<any>({});
  const [showReportExporter, setShowReportExporter] = useState(false);
  const [showEditAttendance, setShowEditAttendance] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  const [showBulkActions, setShowBulkActions] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  const { attendance, addAttendanceRecord, updateAttendanceRecord, deleteAttendanceRecord } = useAttendance();
  const { generateReport } = useReports();

  const todayAttendance = mockAttendance.filter(a => a.date === selectedDate);
  const presentCount = todayAttendance.filter(a => a.status === 'present').length;
  const absentCount = todayAttendance.filter(a => a.status === 'absent').length;
  const lateCount = todayAttendance.filter(a => a.status === 'late').length;
  const totalStudents = mockLearners.filter(l => l.status === 'active').length;
  const attendanceRate = totalStudents > 0 ? ((presentCount + lateCount) / totalStudents * 100) : 0;

  const getStudent = (studentId: string) => {
    return mockLearners.find(s => s.id === studentId);
  };

  const getClassroom = (classroomId: string) => {
    return mockClassrooms.find(c => c.id === classroomId);
  };

  const handleMarkAttendance = (studentId: string, status: string, reason?: string) => {
    const record = {
      id: `att-${Date.now()}`,
      date: selectedDate,
      type: 'homeroom' as const,
      learner_id: studentId,
      status: status as any,
      reason,
      recorded_by: 'current-user',
      recorded_at: new Date().toISOString()
    };
    addAttendanceRecord(record);
  };

  const handleEditRecord = (record: any) => {
    setSelectedRecord(record);
    setShowEditAttendance(true);
  };

  const handleUpdateRecord = (recordData: any) => {
    if (selectedRecord) {
      updateAttendanceRecord(selectedRecord.id, recordData);
    }
    setShowEditAttendance(false);
    setSelectedRecord(null);
  };

  const handleBulkMarkPresent = () => {
    selectedStudents.forEach(studentId => {
      handleMarkAttendance(studentId, 'present');
    });
    setSelectedStudents([]);
    setShowBulkActions(false);
  };

  const handleGenerateAttendanceReport = () => {
    generateReport({
      type: 'daily_attendance_register',
      title: `Attendance Register - ${formatDate(selectedDate)}`,
      data: todayAttendance,
      format: 'pdf'
    });
  };

  const handleExportMonthlyReport = () => {
    generateReport({
      type: 'monthly_attendance_summary',
      title: 'Monthly Attendance Summary',
      data: mockAttendance,
      format: 'xlsx'
    });
  };

  const handleDeleteRecord = (record: any) => {
    if (confirm(`Delete attendance record for ${getStudent(record.learner_id)?.name}?`)) {
      deleteAttendanceRecord(record.id);
    }
  };

  const handleBulkMarkAttendance = () => {
    const students = mockLearners.filter(s => s.status === 'active');
    students.forEach(student => {
      const status = attendanceData[student.id] || 'present';
      handleMarkAttendance(student.id, status);
    });
    setShowBulkMark(false);
    setAttendanceData({});
  };

  const BulkAttendanceForm = () => {
    const students = mockLearners.filter(s => s.status === 'active');
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Mark Attendance - {formatDate(selectedDate)}</h3>
          <div className="flex space-x-2">
            <Button onClick={handleBulkMarkAttendance}>
              <Save className="h-4 w-4 mr-2" />
              Save All
            </Button>
            <Button variant="outline" onClick={() => setShowBulkMark(false)}>
              Cancel
            </Button>
          </div>
        </div>

        <div className="space-y-4 max-h-96 overflow-y-auto">
          {students.map(student => {
            const classroom = getClassroom(student.classroom_id);
            return (
              <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{student.name}</p>
                  <p className="text-sm text-gray-600">
                    {student.admission_no} • Grade {classroom?.grade}{classroom?.stream}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Select 
                    value={attendanceData[student.id] || 'present'} 
                    onValueChange={(value) => setAttendanceData(prev => ({ ...prev, [student.id]: value }))}
                  >
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
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const AttendanceCard = ({ record }: { record: any }) => {
    const student = getStudent(record.learner_id);
    const classroom = student ? getClassroom(student.classroom_id) : null;
    
    const statusConfig = {
      present: { color: 'text-green-600', bg: 'bg-green-50', icon: CheckCircle },
      absent: { color: 'text-red-600', bg: 'bg-red-50', icon: XCircle },
      late: { color: 'text-yellow-600', bg: 'bg-yellow-50', icon: Clock },
      excused: { color: 'text-blue-600', bg: 'bg-blue-50', icon: AlertTriangle }
    };

    const config = statusConfig[record.status as keyof typeof statusConfig];
    const Icon = config.icon;

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full ${config.bg}`}>
                <Icon className={`h-4 w-4 ${config.color}`} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{student?.name}</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span>{student?.admission_no}</span>
                  <span>•</span>
                  <span>Grade {classroom?.grade}{classroom?.stream}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <Badge variant={record.status === 'present' ? 'default' : 'secondary'}>
                {record.status}
              </Badge>
              <div className="flex space-x-1 mt-2">
                <Button variant="outline" size="sm" onClick={() => handleEditRecord(record)}>
                  <Edit className="h-3 w-3" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDeleteRecord(record)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
              {record.reason && (
                <p className="text-xs text-gray-500 mt-1">{record.reason}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const ClassAttendanceSummary = ({ classId }: { classId: string }) => {
    const classroom = getClassroom(classId);
    const classStudents = mockLearners.filter(s => s.classroom_id === classId && s.status === 'active');
    const classAttendance = todayAttendance.filter(a => 
      classStudents.some(s => s.id === a.learner_id)
    );
    
    const present = classAttendance.filter(a => a.status === 'present').length;
    const absent = classAttendance.filter(a => a.status === 'absent').length;
    const late = classAttendance.filter(a => a.status === 'late').length;
    const rate = classStudents.length > 0 ? ((present + late) / classStudents.length * 100) : 0;

    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Grade {classroom?.grade}{classroom?.stream}
              </h3>
              <p className="text-sm text-gray-600">{classStudents.length} total students</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{rate.toFixed(0)}%</div>
              <div className="text-xs text-gray-500">Attendance</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-lg font-semibold text-green-600">{present}</div>
              <div className="text-xs text-gray-500">Present</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-yellow-600">{late}</div>
              <div className="text-xs text-gray-500">Late</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-red-600">{absent}</div>
              <div className="text-xs text-gray-500">Absent</div>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="flex-1">
              <Eye className="h-4 w-4 mr-1" />
              View Details
            </Button>
            <Button size="sm" className="flex-1">
              <Plus className="h-4 w-4 mr-1" />
              Mark Attendance
            </Button>
            <Button variant="outline" onClick={() => setShowBulkActions(true)}>
              <Users className="h-4 w-4 mr-2" />
              Bulk Actions
            </Button>
            <Button variant="outline" onClick={handleGenerateAttendanceReport}>
              <FileText className="h-4 w-4 mr-2" />
              Daily Report
            </Button>
            <Button variant="outline" onClick={handleExportMonthlyReport}>
              <Download className="h-4 w-4 mr-2" />
              Monthly Export
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Attendance</h1>
          <p className="text-gray-600 mt-1">Track student attendance and engagement</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="secondary" className="bg-blue-50 text-blue-700">
            Today: {attendanceRate.toFixed(1)}% Present
          </Badge>
          <Button onClick={() => setShowBulkMark(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Mark Attendance
          </Button>
          <Button onClick={() => setShowReportExporter(true)}>
            <FileText className="h-4 w-4 mr-2" />
            Generate Reports
          </Button>
        </div>

        <div className="flex items-center space-x-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Attendance Report</DialogTitle>
              </DialogHeader>
              <ReportExporter 
                data={todayAttendance} 
                title="Attendance Report" 
                type="attendance"
              />
            </DialogContent>
          </Dialog>
      </div>

      {/* Daily Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-blue-600">{totalStudents}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Present</p>
                <p className="text-2xl font-bold text-green-600">{presentCount}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Absent</p>
                <p className="text-2xl font-bold text-red-600">{absentCount}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Attendance Rate</p>
                <p className="text-2xl font-bold text-purple-600">{attendanceRate.toFixed(1)}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="daily">Daily Attendance</TabsTrigger>
          <TabsTrigger value="classes">By Class</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="space-y-4">
          <div className="flex items-center space-x-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="mt-1 block border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Today's Report
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <FileText className="h-4 w-4 mr-2" />
                  All Reports
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Attendance Reports</DialogTitle>
                </DialogHeader>
                <ReportExporter 
                  data={mockAttendance} 
                  title="Comprehensive Attendance Report" 
                  type="attendance"
                />
              </DialogContent>
            </Dialog>
          </div>

          {todayAttendance.length > 0 ? (
            <div className="space-y-4">
              {todayAttendance.map((record) => (
                <AttendanceCard key={record.id} record={record} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No attendance records</h3>
                <p className="text-gray-600 mb-4">
                  No attendance has been marked for {formatDate(selectedDate)}
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Mark Attendance
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="classes" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockClassrooms.map((classroom) => (
              <ClassAttendanceSummary key={classroom.id} classId={classroom.id} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Attendance Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { day: 'Monday', rate: 98 },
                    { day: 'Tuesday', rate: 96 },
                    { day: 'Wednesday', rate: 99 },
                    { day: 'Thursday', rate: 97 },
                    { day: 'Friday', rate: 94 }
                  ].map((day) => (
                    <div key={day.day} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{day.day}</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={day.rate} className="w-32" />
                        <span className="text-sm font-semibold text-gray-900 w-12">
                          {day.rate}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Attendance by Grade</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockClassrooms.map((classroom) => {
                    const students = mockLearners.filter(s => s.classroom_id === classroom.id);
                    const rate = Math.floor(Math.random() * 10) + 90; // Mock data
                    
                    return (
                      <div key={classroom.id} className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          Grade {classroom.grade}{classroom.stream}
                        </span>
                        <div className="flex items-center space-x-2">
                          <Progress 
                            value={rate} 
                            className={`w-32 ${
                              rate >= 95 ? '[&>div]:bg-green-500' : 
                              rate >= 90 ? '[&>div]:bg-yellow-500' : '[&>div]:bg-red-500'
                            }`} 
                          />
                          <span className="text-sm font-semibold text-gray-900 w-12">
                            {rate}%
                          </span>
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
              <CardTitle>At-Risk Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockLearners.slice(0, 3).map((student) => {
                  const classroom = getClassroom(student.classroom_id);
                  const absences = Math.floor(Math.random() * 5) + 3; // Mock data
                  
                  return (
                    <div key={student.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{student.name}</p>
                        <p className="text-sm text-gray-600">
                          Grade {classroom?.grade}{classroom?.stream} • {student.admission_no}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant="destructive">{absences} Absences</Badge>
                        <p className="text-xs text-red-600 mt-1">This month</p>
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
                <CardTitle>Standard Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: 'Daily Attendance Register', description: 'Today\'s attendance summary' },
                    { name: 'Weekly Attendance Report', description: 'Weekly trends and patterns' },
                    { name: 'Monthly Summary', description: 'Complete month overview' },
                    { name: 'Absenteeism Report', description: 'Students with high absences' }
                  ].map((report, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{report.name}</p>
                        <p className="text-sm text-gray-600">{report.description}</p>
                      </div>
                      <Button variant="outline" size="sm">
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
                <CardTitle>Custom Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Date Range</label>
                    <div className="flex space-x-2 mt-1">
                      <input
                        type="date"
                        className="flex-1 border border-gray-300 rounded-md px-3 py-2"
                      />
                      <input
                        type="date"
                        className="flex-1 border border-gray-300 rounded-md px-3 py-2"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">Classes</label>
                    <select className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2">
                      <option>All Classes</option>
                      {mockClassrooms.map((classroom) => (
                        <option key={classroom.id} value={classroom.id}>
                          Grade {classroom.grade}{classroom.stream}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">Format</label>
                    <select className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2">
                      <option>PDF</option>
                      <option>Excel</option>
                      <option>CSV</option>
                    </select>
                  </div>

                  <Button className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Generate Custom Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Bulk Mark Attendance Dialog */}
      <Dialog open={showBulkMark} onOpenChange={setShowBulkMark}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Mark Class Attendance</DialogTitle>
          </DialogHeader>
          <BulkAttendanceForm />
        </DialogContent>
      </Dialog>

      {/* Bulk Actions Dialog */}
      <Dialog open={showBulkActions} onOpenChange={setShowBulkActions}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Bulk Attendance Actions</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-3">Select students for bulk actions:</p>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {mockLearners.filter(s => s.status === 'active').map(student => (
                  <label key={student.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedStudents.includes(student.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedStudents(prev => [...prev, student.id]);
                        } else {
                          setSelectedStudents(prev => prev.filter(id => id !== student.id));
                        }
                      }}
                    />
                    <span className="text-sm">{student.name}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleBulkMarkPresent} disabled={selectedStudents.length === 0}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark Present ({selectedStudents.length})
              </Button>
              <Button variant="outline" onClick={() => setShowBulkActions(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
      {/* Edit Attendance Dialog */}
      <Dialog open={showEditAttendance} onOpenChange={setShowEditAttendance}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Attendance Record</DialogTitle>
          </DialogHeader>
          <AttendanceEditForm 
            record={selectedRecord}
            onSave={handleUpdateRecord}
            onCancel={() => setShowEditAttendance(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Report Exporter Dialog */}
      <Dialog open={showReportExporter} onOpenChange={setShowReportExporter}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Generate Attendance Reports</DialogTitle>
          </DialogHeader>
          <ReportExporter 
            data={mockAttendance} 
            title="Attendance Reports" 
            type="attendance"
            onClose={() => setShowReportExporter(false)}
          />
        </DialogContent>
      </Dialog>
  );
}

const AttendanceEditForm = ({ record, onSave, onCancel }: { record: any; onSave: (data: any) => void; onCancel: () => void }) => {
  const [formData, setFormData] = useState({
    status: record?.status || 'present',
    reason: record?.reason || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...record, ...formData });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Status</Label>
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
      
      <div>
        <Label>Reason (Optional)</Label>
        <Input
          value={formData.reason}
          onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
          placeholder="Enter reason for absence/lateness"
        />
      </div>

      <div className="flex space-x-2">
        <Button type="submit">
          <Save className="h-4 w-4 mr-2" />
          Update Record
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
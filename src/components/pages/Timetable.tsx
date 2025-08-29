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
import { mockClassrooms, mockSubjects, mockTeachers } from '@/data/mock-data';
import { ReportExporter } from '@/components/features/ReportExporter';
import { useTimetable } from '@/store';
import { 
  Calendar, 
  Clock, 
  Users, 
  BookOpen,
  Plus, 
  Eye, 
  Edit,
  Download,
  Search,
  Filter,
  Save,
  X,
  Trash2,
  FileText,
  AlertTriangle,
  CheckCircle,
  RefreshCw
} from 'lucide-react';

export function Timetable() {
  const [activeTab, setActiveTab] = useState('weekly');
  const [selectedWeek, setSelectedWeek] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('all');
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [lessonToDelete, setLessonToDelete] = useState<any>(null);
  const [showReportExporter, setShowReportExporter] = useState(false);
  const [showLessonDetails, setShowLessonDetails] = useState(false);

  const { lessons, addLesson, updateLesson, deleteLesson } = useTimetable();

  const mockLessons = [
    {
      id: 'lesson-1',
      classroom_id: 'class-1',
      subject_id: 'sub-1',
      teacher_id: 'teacher-1',
      day_of_week: 1, // Monday
      start_time: '08:00',
      end_time: '08:40',
      room: 'Room 3A',
      academic_year: '2024',
      term: 1
    },
    {
      id: 'lesson-2',
      classroom_id: 'class-1',
      subject_id: 'sub-3',
      teacher_id: 'teacher-1',
      day_of_week: 1,
      start_time: '08:40',
      end_time: '09:20',
      room: 'Room 3A',
      academic_year: '2024',
      term: 1
    },
    {
      id: 'lesson-3',
      classroom_id: 'class-1',
      subject_id: 'sub-2',
      teacher_id: 'teacher-1',
      day_of_week: 2, // Tuesday
      start_time: '08:00',
      end_time: '08:40',
      room: 'Room 3A',
      academic_year: '2024',
      term: 1
    }
  ];

  const allLessons = lessons.length > 0 ? lessons : mockLessons;

  const timeSlots = [
    '08:00-08:40', '08:40-09:20', '09:20-10:00', '10:00-10:40',
    '10:40-11:00', // Break
    '11:00-11:40', '11:40-12:20', '12:20-13:00',
    '13:00-14:00', // Lunch
    '14:00-14:40', '14:40-15:20', '15:20-16:00'
  ];

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const getSubject = (subjectId: string) => {
    return mockSubjects.find(s => s.id === subjectId);
  };

  const getTeacher = (teacherId: string) => {
    return mockTeachers.find(t => t.id === teacherId);
  };

  const getClassroom = (classroomId: string) => {
    return mockClassrooms.find(c => c.id === classroomId);
  };

  const handleAddLesson = () => {
    setSelectedLesson(null);
    setShowLessonForm(true);
  };

  const handleEditLesson = (lesson: any) => {
    setSelectedLesson(lesson);
    setShowLessonForm(true);
  };

  const handleSaveLesson = (lessonData: any) => {
    if (selectedLesson) {
      updateLesson(selectedLesson.id, lessonData);
    } else {
      addLesson(lessonData);
    }
    setShowLessonForm(false);
  };

  const handleDeleteLesson = (lesson: any) => {
    setLessonToDelete(lesson);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (lessonToDelete) {
      deleteLesson(lessonToDelete.id);
      setShowDeleteDialog(false);
      setLessonToDelete(null);
    }
  };

  const handleViewLesson = (lesson: any) => {
    setSelectedLesson(lesson);
    setShowLessonDetails(true);
  };

  const LessonForm = () => {
    const [formData, setFormData] = useState({
      classroom_id: selectedLesson?.classroom_id || '',
      subject_id: selectedLesson?.subject_id || '',
      teacher_id: selectedLesson?.teacher_id || '',
      day_of_week: selectedLesson?.day_of_week || 1,
      start_time: selectedLesson?.start_time || '08:00',
      end_time: selectedLesson?.end_time || '08:40',
      room: selectedLesson?.room || '',
      academic_year: selectedLesson?.academic_year || '2024',
      term: selectedLesson?.term || 1
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      handleSaveLesson(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Class *</Label>
            <Select value={formData.classroom_id} onValueChange={(value) => setFormData(prev => ({ ...prev, classroom_id: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent>
                {mockClassrooms.map((classroom) => (
                  <SelectItem key={classroom.id} value={classroom.id}>
                    Grade {classroom.grade}{classroom.stream}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Subject *</Label>
            <Select value={formData.subject_id} onValueChange={(value) => setFormData(prev => ({ ...prev, subject_id: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                {mockSubjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Teacher *</Label>
            <Select value={formData.teacher_id} onValueChange={(value) => setFormData(prev => ({ ...prev, teacher_id: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select teacher" />
              </SelectTrigger>
              <SelectContent>
                {mockTeachers.map((teacher) => (
                  <SelectItem key={teacher.id} value={teacher.id}>
                    {teacher.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Room</Label>
            <Input
              value={formData.room}
              onChange={(e) => setFormData(prev => ({ ...prev, room: e.target.value }))}
              placeholder="Room number or name"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label>Day *</Label>
            <Select value={formData.day_of_week.toString()} onValueChange={(value) => setFormData(prev => ({ ...prev, day_of_week: parseInt(value) }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Monday</SelectItem>
                <SelectItem value="2">Tuesday</SelectItem>
                <SelectItem value="3">Wednesday</SelectItem>
                <SelectItem value="4">Thursday</SelectItem>
                <SelectItem value="5">Friday</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Start Time *</Label>
            <Input
              type="time"
              value={formData.start_time}
              onChange={(e) => setFormData(prev => ({ ...prev, start_time: e.target.value }))}
              required
            />
          </div>
          <div>
            <Label>End Time *</Label>
            <Input
              type="time"
              value={formData.end_time}
              onChange={(e) => setFormData(prev => ({ ...prev, end_time: e.target.value }))}
              required
            />
          </div>
        </div>

        <div className="flex space-x-2">
          <Button type="submit">
            <Save className="h-4 w-4 mr-2" />
            {selectedLesson ? 'Update Lesson' : 'Add Lesson'}
          </Button>
          <Button type="button" variant="outline" onClick={() => setShowLessonForm(false)}>
            Cancel
          </Button>
        </div>
      </form>
    );
  };

  const TimetableGrid = () => {
    const filteredLessons = selectedClass === 'all' 
      ? allLessons 
      : allLessons.filter(l => l.classroom_id === selectedClass);

    return (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-24">Time</TableHead>
              {days.map((day) => (
                <TableHead key={day} className="text-center min-w-32">
                  {day}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {timeSlots.map((timeSlot, timeIndex) => {
              const isBreak = timeSlot === '10:40-11:00' || timeSlot === '13:00-14:00';
              
              return (
                <TableRow key={timeSlot}>
                  <TableCell className="font-medium text-sm">
                    {timeSlot}
                  </TableCell>
                  {days.map((day, dayIndex) => {
                    const dayNumber = dayIndex + 1;
                    const lesson = filteredLessons.find(l => 
                      l.day_of_week === dayNumber && 
                      l.start_time === timeSlot.split('-')[0]
                    );

                    if (isBreak) {
                      return (
                        <TableCell key={day} className="bg-gray-50 text-center text-sm text-gray-500">
                          {timeSlot === '10:40-11:00' ? 'Break' : 'Lunch'}
                        </TableCell>
                      );
                    }

                    return (
                      <TableCell key={day} className="p-1">
                        {lesson ? (
                          <div className="bg-blue-50 border border-blue-200 rounded p-2 text-xs hover:bg-blue-100 cursor-pointer"
                               onClick={() => handleViewLesson(lesson)}>
                            <div className="font-medium text-blue-900">
                              {getSubject(lesson.subject_id)?.code}
                            </div>
                            <div className="text-blue-700">
                              {getTeacher(lesson.teacher_id)?.name.split(' ')[0]}
                            </div>
                            {lesson.room && (
                              <div className="text-blue-600">{lesson.room}</div>
                            )}
                          </div>
                        ) : (
                          <div 
                            className="h-16 border-2 border-dashed border-gray-200 rounded flex items-center justify-center hover:border-blue-300 cursor-pointer"
                            onClick={handleAddLesson}
                          >
                            <Plus className="h-4 w-4 text-gray-400" />
                          </div>
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    );
  };

  const TimetableConflicts = () => {
    const conflicts = [
      {
        id: 'conflict-1',
        type: 'teacher_clash',
        description: 'John Mwangi scheduled for two classes at the same time',
        time: 'Monday 08:00-08:40',
        severity: 'high'
      },
      {
        id: 'conflict-2',
        type: 'room_clash',
        description: 'Room 3A double-booked',
        time: 'Tuesday 10:00-10:40',
        severity: 'medium'
      }
    ];

    return (
      <div className="space-y-4">
        {conflicts.length > 0 ? (
          conflicts.map((conflict) => (
            <Card key={conflict.id} className="border-orange-200">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    <div>
                      <p className="font-medium text-gray-900">{conflict.description}</p>
                      <p className="text-sm text-gray-600">{conflict.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={conflict.severity === 'high' ? 'destructive' : 'secondary'}>
                      {conflict.severity}
                    </Badge>
                    <Button variant="outline" size="sm">
                      Resolve
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Conflicts Found</h3>
              <p className="text-gray-600">Your timetable is optimized with no scheduling conflicts</p>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Timetable</h1>
          <p className="text-gray-600 mt-1">Manage class schedules and lesson planning</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="secondary" className="bg-blue-50 text-blue-700">
            {allLessons.length} Lessons Scheduled
          </Badge>
          <Button onClick={handleAddLesson}>
            <Plus className="h-4 w-4 mr-2" />
            Add Lesson
          </Button>
          <Button onClick={() => setShowReportExporter(true)} variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Timetable Reports
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Export Timetable
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Export Timetable</DialogTitle>
              </DialogHeader>
              <ReportExporter 
                data={allLessons} 
                title="School Timetable" 
                type="attendance"
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
                <p className="text-sm text-gray-600">Total Lessons</p>
                <p className="text-2xl font-bold text-blue-600">{allLessons.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Classes</p>
                <p className="text-2xl font-bold text-green-600">{mockClassrooms.length}</p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Subjects</p>
                <p className="text-2xl font-bold text-purple-600">{mockSubjects.length}</p>
              </div>
              <BookOpen className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Utilization</p>
                <p className="text-2xl font-bold text-orange-600">85%</p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="weekly">Weekly View</TabsTrigger>
          <TabsTrigger value="teacher">By Teacher</TabsTrigger>
          <TabsTrigger value="room">Room Utilization</TabsTrigger>
          <TabsTrigger value="conflicts">Conflicts</TabsTrigger>
        </TabsList>

        <TabsContent value="weekly" className="space-y-4">
          <div className="flex items-center space-x-4">
            <div>
              <Label>Class Filter</Label>
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
            <div>
              <Label>Week Starting</Label>
              <Input
                type="date"
                value={selectedWeek}
                onChange={(e) => setSelectedWeek(e.target.value)}
              />
            </div>
            <Button variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Auto-Generate
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>
                {selectedClass === 'all' ? 'Master Timetable' : `Grade ${getClassroom(selectedClass)?.grade}${getClassroom(selectedClass)?.stream} Timetable`}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TimetableGrid />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="teacher" className="space-y-4">
          {mockTeachers.map((teacher) => {
            const teacherLessons = allLessons.filter(l => l.teacher_id === teacher.id);
            const workload = teacherLessons.length;
            
            return (
              <Card key={teacher.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{teacher.name}</span>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{workload} lessons/week</Badge>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-1" />
                            Export Schedule
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Export {teacher.name}'s Schedule</DialogTitle>
                          </DialogHeader>
                          <ReportExporter 
                            data={teacherLessons} 
                            title={`${teacher.name} Teaching Schedule`} 
                            type="attendance"
                          />
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-5 gap-2">
                    {days.map((day, dayIndex) => {
                      const dayLessons = teacherLessons.filter(l => l.day_of_week === dayIndex + 1);
                      return (
                        <div key={day} className="space-y-2">
                          <h4 className="font-medium text-sm text-gray-700">{day}</h4>
                          {dayLessons.map((lesson) => {
                            const subject = getSubject(lesson.subject_id);
                            const classroom = getClassroom(lesson.classroom_id);
                            return (
                              <div key={lesson.id} className="p-2 bg-blue-50 rounded text-xs">
                                <div className="font-medium">{subject?.code}</div>
                                <div className="text-gray-600">Grade {classroom?.grade}{classroom?.stream}</div>
                                <div className="text-gray-500">{lesson.start_time}</div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="room" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Room Utilization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['Room 3A', 'Room 3B', 'Room 4A', 'Computer Lab', 'Science Lab', 'Library'].map((room) => {
                  const utilization = Math.floor(Math.random() * 40) + 60;
                  const roomLessons = allLessons.filter(l => l.room === room).length;
                  
                  return (
                    <div key={room} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{room}</p>
                        <p className="text-sm text-gray-600">{roomLessons} lessons/week</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="w-32">
                          <Progress 
                            value={utilization} 
                            className={utilization > 90 ? '[&>div]:bg-red-500' : utilization > 75 ? '[&>div]:bg-yellow-500' : '[&>div]:bg-green-500'}
                          />
                        </div>
                        <span className="text-sm font-semibold w-12">{utilization}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conflicts" className="space-y-4">
          <TimetableConflicts />
        </TabsContent>
      </Tabs>

      {/* Lesson Form Dialog */}
      <Dialog open={showLessonForm} onOpenChange={setShowLessonForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedLesson ? 'Edit Lesson' : 'Add New Lesson'}</DialogTitle>
          </DialogHeader>
          <LessonForm />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Lesson</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Are you sure you want to delete this lesson?</p>
            <p className="text-sm text-gray-600">This action cannot be undone.</p>
            <div className="flex space-x-2">
              <Button variant="destructive" onClick={confirmDelete}>
                Delete Lesson
              </Button>
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Lesson Details Dialog */}
      <Dialog open={showLessonDetails} onOpenChange={setShowLessonDetails}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Lesson Details</DialogTitle>
          </DialogHeader>
          <LessonDetailsView lesson={selectedLesson} />
        </DialogContent>
      </Dialog>

      {/* Report Exporter Dialog */}
      <Dialog open={showReportExporter} onOpenChange={setShowReportExporter}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Timetable Reports</DialogTitle>
          </DialogHeader>
          <ReportExporter 
            data={allLessons} 
            title="Timetable Reports" 
            type="attendance"
            onClose={() => setShowReportExporter(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

const LessonDetailsView = ({ lesson }: { lesson: any }) => {
  if (!lesson) return null;

  const subject = mockSubjects.find(s => s.id === lesson.subject_id);
  const teacher = mockTeachers.find(t => t.id === lesson.teacher_id);
  const classroom = mockClassrooms.find(c => c.id === lesson.classroom_id);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Subject</Label>
          <p className="font-medium">{subject?.name}</p>
        </div>
        <div>
          <Label>Teacher</Label>
          <p className="font-medium">{teacher?.name}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Class</Label>
          <p className="font-medium">Grade {classroom?.grade}{classroom?.stream}</p>
        </div>
        <div>
          <Label>Room</Label>
          <p className="font-medium">{lesson.room}</p>
        </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Time</Label>
          <p className="font-medium">{lesson.start_time} - {lesson.end_time}</p>
        </div>
        <div>
          <Label>Day</Label>
          <p className="font-medium">{['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'][lesson.day_of_week - 1]}</p>
        </div>
      </div>
      </div>
      <div className="flex space-x-2">
        <Button className="flex-1">
          <Edit className="h-4 w-4 mr-2" />
          Edit Lesson
        </Button>
        <Button variant="outline" className="flex-1">
          <Calendar className="h-4 w-4 mr-2" />
          View Schedule
        </Button>
      </div>
    </div>
  );
}
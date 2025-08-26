import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { mockSBATasks, mockAssessmentEvidence, mockOutcomeMaps, mockSubjects, mockClassrooms } from '@/data/mock-data';
import { formatDate } from '@/lib/utils';
import { 
  BookOpen, 
  Plus, 
  Eye, 
  Edit, 
  Target, 
  Calendar,
  FileText,
  Camera,
  Video,
  Mic,
  Image,
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  Users,
  Award
} from 'lucide-react';

export function Assessment() {
  const [activeTab, setActiveTab] = useState('tasks');

  const getSubject = (subjectId: string) => {
    return mockSubjects.find(s => s.id === subjectId);
  };

  const getClassroom = (classroomId: string) => {
    return mockClassrooms.find(c => c.id === classroomId);
  };

  const TaskCard = ({ task }: { task: any }) => {
    const subject = getSubject(task.subject_id);
    const classroom = getClassroom(task.classroom_id);
    const evidence = mockAssessmentEvidence.filter(e => e.task_id === task.id);
    const completionRate = (evidence.length / 40) * 100; // Assuming 40 students in class

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <Badge variant="outline">{subject?.code}</Badge>
                <Badge variant="secondary">Grade {classroom?.grade}{classroom?.stream}</Badge>
                <Badge variant="outline">Term {task.term}</Badge>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{task.title}</h3>
              <p className="text-sm text-gray-600 mb-3">{task.description}</p>
              
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Due: {formatDate(task.due_date)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Target className="h-4 w-4" />
                  <span>{task.weight}% weight</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>{evidence.length} submitted</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-end space-y-2">
              <div className="text-right">
                <div className="text-lg font-semibold text-blue-600">{completionRate.toFixed(0)}%</div>
                <div className="text-xs text-gray-500">Completion</div>
              </div>
              <div className="flex space-x-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <DialogHeader>
                      <DialogTitle>{task.title}</DialogTitle>
                    </DialogHeader>
                    <TaskDetails task={task} />
                  </DialogContent>
                </Dialog>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-1" />
                  Grade
                </Button>
              </div>
            </div>
          </div>

          {/* Evidence Types */}
          <div className="flex items-center space-x-2 mb-3">
            <span className="text-sm font-medium text-gray-600">Evidence Types:</span>
            {task.evidence_types.map((type: string) => {
              const icons = {
                photo: Image,
                video: Video,
                audio: Mic,
                document: FileText
              };
              const Icon = icons[type as keyof typeof icons];
              return (
                <div key={type} className="flex items-center space-x-1 bg-gray-100 px-2 py-1 rounded-full">
                  <Icon className="h-3 w-3 text-gray-600" />
                  <span className="text-xs text-gray-600 capitalize">{type}</span>
                </div>
              );
            })}
          </div>

          {/* Progress Bar */}
          <Progress value={completionRate} className="w-full" />
        </CardContent>
      </Card>
    );
  };

  const TaskDetails = ({ task }: { task: any }) => {
    const subject = getSubject(task.subject_id);
    const evidence = mockAssessmentEvidence.filter(e => e.task_id === task.id);

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Subject</label>
              <p className="text-gray-900">{subject?.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Due Date</label>
              <p className="text-gray-900">{formatDate(task.due_date)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Weight</label>
              <p className="text-gray-900">{task.weight}% of final grade</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Learning Outcomes</label>
              <p className="text-gray-900">{task.outcome_refs.length} SLOs mapped</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Submissions</label>
              <p className="text-gray-900">{evidence.length} students submitted</p>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Proficiency Rubric</h4>
          <div className="space-y-2">
            {task.rubric_levels.map((level: any, index: number) => (
              <div key={index} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant={level.level === 'exceeding' ? 'default' : 'secondary'}>
                    {level.level}
                  </Badge>
                  <span className="text-sm text-gray-600">
                    {level.score_range[0]}-{level.score_range[1]} points
                  </span>
                </div>
                <p className="text-sm text-gray-700">{level.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Recent Evidence</h4>
          <div className="space-y-3">
            {evidence.slice(0, 3).map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Grace Wanjiku</p>
                  <p className="text-sm text-gray-600">{item.comment}</p>
                </div>
                <div className="text-right">
                  <Badge variant={item.proficiency_level === 'exceeding' ? 'default' : 'secondary'}>
                    {item.proficiency_level}
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">Score: {item.score}/8</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">CBC Assessment</h1>
          <p className="text-gray-600 mt-1">Competency-based continuous assessment and grading</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="secondary" className="bg-green-50 text-green-700">
            CBC Aligned
          </Badge>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create SBA Task
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Tasks</p>
                <p className="text-2xl font-bold text-blue-600">{mockSBATasks.length}</p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Evidence Items</p>
                <p className="text-2xl font-bold text-green-600">{mockAssessmentEvidence.length}</p>
              </div>
              <Camera className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Completion</p>
                <p className="text-2xl font-bold text-orange-600">89%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Proficient+</p>
                <p className="text-2xl font-bold text-purple-600">76%</p>
              </div>
              <Award className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="tasks">SBA Tasks ({mockSBATasks.length})</TabsTrigger>
          <TabsTrigger value="evidence">Evidence ({mockAssessmentEvidence.length})</TabsTrigger>
          <TabsTrigger value="outcomes">Learning Outcomes</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="space-y-4">
          {mockSBATasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
          
          <Card className="border-dashed">
            <CardContent className="text-center py-12">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Create Your Next SBA Task</h3>
              <p className="text-gray-600 mb-4">
                Design competency-based assessments aligned to CBC learning outcomes
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create SBA Task
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="evidence" className="space-y-4">
          {mockAssessmentEvidence.map((evidence) => (
            <Card key={evidence.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="secondary">Grace Wanjiku</Badge>
                      <Badge variant="outline">
                        {mockSBATasks.find(t => t.id === evidence.task_id)?.title}
                      </Badge>
                    </div>
                    <p className="text-gray-700 mb-3">{evidence.comment}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Captured: {formatDate(evidence.captured_at)}</span>
                      <span>{evidence.files.length} files</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <Badge variant={evidence.proficiency_level === 'exceeding' ? 'default' : 'secondary'}>
                        {evidence.proficiency_level}
                      </Badge>
                      <p className="text-sm text-gray-600 mt-1">Score: {evidence.score}/8</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="outcomes" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockOutcomeMaps.map((outcome) => (
              <Card key={outcome.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{outcome.learning_area}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <Badge variant="outline" className="mb-2">{outcome.slo_code}</Badge>
                      <p className="font-medium text-gray-900">{outcome.strand} → {outcome.sub_strand}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Success Criteria:</label>
                      <ul className="mt-1 space-y-1">
                        {outcome.descriptors.map((desc, index) => (
                          <li key={index} className="text-sm text-gray-700 flex items-start">
                            <CheckCircle className="h-3 w-3 text-green-500 mt-1 mr-2 flex-shrink-0" />
                            {desc}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Proficiency Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { level: 'Exceeding', percentage: 24, color: 'bg-green-500' },
                    { level: 'Proficient', percentage: 52, color: 'bg-blue-500' },
                    { level: 'Approaching', percentage: 19, color: 'bg-yellow-500' },
                    { level: 'Emerging', percentage: 5, color: 'bg-red-500' }
                  ].map((item) => (
                    <div key={item.level} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.level}</span>
                      <div className="flex items-center space-x-2">
                        <Progress 
                          value={item.percentage} 
                          className={`w-20 ${
                            item.level === 'Exceeding' ? '[&>div]:bg-green-500' :
                            item.level === 'Proficient' ? '[&>div]:bg-blue-500' :
                            item.level === 'Approaching' ? '[&>div]:bg-yellow-500' : '[&>div]:bg-red-500'
                          }`}
                        />
                        <span className="text-sm text-gray-600">{item.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Subject Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockSubjects.slice(0, 5).map((subject) => (
                    <div key={subject.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{subject.name}</p>
                        <p className="text-sm text-gray-600">{subject.code}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">89%</p>
                        <p className="text-xs text-gray-500">Avg. Proficiency</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>KNEC Readiness Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="font-semibold text-green-800">SBA Complete</p>
                  <p className="text-sm text-green-600">Ready for submission</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <FileText className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="font-semibold text-blue-800">Evidence Quality</p>
                  <p className="text-sm text-blue-600">High standards met</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Award className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <p className="font-semibold text-purple-800">Moderation</p>
                  <p className="text-sm text-purple-600">Internal review complete</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
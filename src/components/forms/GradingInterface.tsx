import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { mockLearners, mockAssessmentEvidence } from '@/data/mock-data';
import { useAssessment } from '@/store';
import { Save, X, Award, Users, CheckCircle } from 'lucide-react';

interface GradingInterfaceProps {
  task: any;
  onClose: () => void;
}

export function GradingInterface({ task, onClose }: GradingInterfaceProps) {
  const [grades, setGrades] = useState<Record<string, any>>({});
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  
  const { updateEvidence } = useAssessment();
  
  const students = mockLearners.filter(s => s.status === 'active');
  const evidence = mockAssessmentEvidence.filter(e => e.task_id === task?.id);

  const handleGradeStudent = (studentId: string, level: string, score: number, comment: string) => {
    setGrades(prev => ({
      ...prev,
      [studentId]: { level, score, comment }
    }));
  };

  const handleSaveGrades = () => {
    Object.entries(grades).forEach(([studentId, grade]) => {
      const existingEvidence = evidence.find(e => e.learner_id === studentId);
      if (existingEvidence) {
        updateEvidence(existingEvidence.id, grade);
      }
    });
    onClose();
  };

  const proficiencyLevels = [
    { value: 'emerging', label: 'Emerging', range: '1-2', color: 'bg-red-500' },
    { value: 'approaching', label: 'Approaching', range: '3-4', color: 'bg-yellow-500' },
    { value: 'proficient', label: 'Proficient', range: '5-6', color: 'bg-blue-500' },
    { value: 'exceeding', label: 'Exceeding', range: '7-8', color: 'bg-green-500' }
  ];

  const getGradedCount = () => {
    return Object.keys(grades).length + evidence.length;
  };

  const getCompletionRate = () => {
    return (getGradedCount() / students.length) * 100;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Grade Assessment Task</h2>
          <p className="text-gray-600">{task?.title}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Grading Progress</span>
            <Badge variant="secondary">
              {getGradedCount()}/{students.length} Students
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Progress value={getCompletionRate()} className="w-full" />
            <div className="flex justify-between text-sm text-gray-600">
              <span>Completion: {getCompletionRate().toFixed(0)}%</span>
              <span>{students.length - getGradedCount()} remaining</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Proficiency Rubric */}
      <Card>
        <CardHeader>
          <CardTitle>Proficiency Levels</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-3">
            {proficiencyLevels.map((level) => (
              <div key={level.value} className="text-center p-3 border rounded-lg">
                <div className={`w-4 h-4 ${level.color} rounded-full mx-auto mb-2`}></div>
                <p className="font-medium text-sm">{level.label}</p>
                <p className="text-xs text-gray-500">Score {level.range}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Student Grading List */}
      <Card>
        <CardHeader>
          <CardTitle>Student Assessment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {students.map((student) => {
              const existingEvidence = evidence.find(e => e.learner_id === student.id);
              const currentGrade = grades[student.id] || existingEvidence;
              const isGraded = currentGrade || existingEvidence;

              return (
                <div key={student.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">{student.name}</h4>
                      <p className="text-sm text-gray-600">{student.admission_no}</p>
                    </div>
                    {isGraded && (
                      <Badge variant={currentGrade?.proficiency_level === 'exceeding' || currentGrade?.level === 'exceeding' ? 'default' : 'secondary'}>
                        {currentGrade?.proficiency_level || currentGrade?.level}
                      </Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-4 gap-2 mb-3">
                    {proficiencyLevels.map((level) => (
                      <button
                        key={level.value}
                        type="button"
                        onClick={() => {
                          const score = level.value === 'emerging' ? 2 : 
                                       level.value === 'approaching' ? 4 :
                                       level.value === 'proficient' ? 6 : 8;
                          handleGradeStudent(student.id, level.value, score, '');
                        }}
                        className={`p-2 border rounded text-xs transition-colors ${
                          (currentGrade?.proficiency_level || currentGrade?.level) === level.value 
                            ? 'border-blue-500 bg-blue-50 text-blue-700' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {level.label}
                      </button>
                    ))}
                  </div>

                  {(currentGrade?.proficiency_level || currentGrade?.level) && (
                    <Textarea
                      placeholder="Add comment about student's performance..."
                      value={grades[student.id]?.comment || currentGrade?.comment || ''}
                      onChange={(e) => handleGradeStudent(
                        student.id, 
                        currentGrade?.proficiency_level || currentGrade?.level, 
                        currentGrade?.score || 4, 
                        e.target.value
                      )}
                      className="text-sm"
                      rows={2}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="flex space-x-2">
        <Button onClick={handleSaveGrades} disabled={Object.keys(grades).length === 0}>
          <Save className="h-4 w-4 mr-2" />
          Save Grades ({Object.keys(grades).length})
        </Button>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { useReports } from '@/store';
import { 
  Award, 
  TrendingUp, 
  Users, 
  BookOpen,
  Target,
  Calendar,
  Download,
  Save
} from 'lucide-react';

interface PerformanceReviewProps {
  teacher: any;
}

export function PerformanceReview({ teacher }: PerformanceReviewProps) {
  const [reviewData, setReviewData] = useState({
    teaching_effectiveness: 85,
    student_engagement: 78,
    curriculum_delivery: 92,
    professional_development: 88,
    collaboration: 90,
    comments: '',
    goals: '',
    recommendations: ''
  });

  const { generateReport } = useReports();

  const performanceAreas = [
    { key: 'teaching_effectiveness', label: 'Teaching Effectiveness', icon: BookOpen },
    { key: 'student_engagement', label: 'Student Engagement', icon: Users },
    { key: 'curriculum_delivery', label: 'Curriculum Delivery', icon: Target },
    { key: 'professional_development', label: 'Professional Development', icon: Award },
    { key: 'collaboration', label: 'Collaboration', icon: TrendingUp }
  ];

  const handleExportReview = () => {
    generateReport({
      type: 'performance_review',
      title: `${teacher.name} - Performance Review`,
      data: { teacher, review: reviewData },
      format: 'pdf'
    });
  };

  const getOverallScore = () => {
    const scores = performanceAreas.map(area => reviewData[area.key as keyof typeof reviewData] as number);
    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  };

  return (
    <div className="space-y-6">
      {/* Overall Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Overall Performance Score</span>
            <Badge variant="default" className="text-lg px-3 py-1">
              {getOverallScore()}%
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={getOverallScore()} className="w-full h-3" />
          <div className="flex justify-between text-sm text-gray-600 mt-2">
            <span>Needs Improvement</span>
            <span>Meets Expectations</span>
            <span>Exceeds Expectations</span>
          </div>
        </CardContent>
      </Card>

      {/* Performance Areas */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Areas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {performanceAreas.map((area) => {
              const Icon = area.icon;
              const score = reviewData[area.key as keyof typeof reviewData] as number;
              
              return (
                <div key={area.key} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Icon className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">{area.label}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Progress value={score} className="w-32" />
                    <span className="font-semibold w-12">{score}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Comments and Goals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Supervisor Comments</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={reviewData.comments}
              onChange={(e) => setReviewData(prev => ({ ...prev, comments: e.target.value }))}
              placeholder="Add performance comments..."
              rows={4}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Development Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={reviewData.goals}
              onChange={(e) => setReviewData(prev => ({ ...prev, goals: e.target.value }))}
              placeholder="Set development goals..."
              rows={4}
            />
          </CardContent>
        </Card>
      </div>

      {/* Action Items */}
      <Card>
        <CardHeader>
          <CardTitle>Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={reviewData.recommendations}
            onChange={(e) => setReviewData(prev => ({ ...prev, recommendations: e.target.value }))}
            placeholder="Add recommendations for improvement..."
            rows={3}
          />
        </CardContent>
      </Card>

      <div className="flex space-x-2">
        <Button onClick={handleExportReview}>
          <Download className="h-4 w-4 mr-2" />
          Export Review
        </Button>
        <Button variant="outline">
          <Save className="h-4 w-4 mr-2" />
          Save Draft
        </Button>
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
}
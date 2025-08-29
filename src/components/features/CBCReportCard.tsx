import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { formatDate } from '@/lib/utils';
import { UniversalReportGenerator } from './UniversalReportGenerator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  GraduationCap, 
  Award, 
  TrendingUp, 
  Calendar,
  User,
  School,
  Download,
  FileText,
  Share,
  Print
} from 'lucide-react';

interface CBCReportCardProps {
  student: any;
  term: number;
  academicYear: string;
  assessments: any[];
  school: any;
}

export function CBCReportCard({ student, term, academicYear, assessments, school }: CBCReportCardProps) {
  const proficiencyColors = {
    'exceeding': 'bg-green-500',
    'proficient': 'bg-blue-500',
    'approaching': 'bg-yellow-500',
    'emerging': 'bg-red-500'
  };

  const proficiencyLabels = {
    'exceeding': 'Exceeding Expectations',
    'proficient': 'Meeting Expectations',
    'approaching': 'Approaching Expectations',
    'emerging': 'Below Expectations'
  };

  const getOverallProficiency = () => {
    if (!assessments.length) return 'emerging';
    
    const levels = assessments.map(a => a.proficiency_level);
    const counts = {
      exceeding: levels.filter(l => l === 'exceeding').length,
      proficient: levels.filter(l => l === 'proficient').length,
      approaching: levels.filter(l => l === 'approaching').length,
      emerging: levels.filter(l => l === 'emerging').length
    };

    // Return the most frequent level
    return Object.entries(counts).reduce((a, b) => counts[a[0] as keyof typeof counts] > counts[b[0] as keyof typeof counts] ? a : b)[0];
  };

  const overallProficiency = getOverallProficiency();

  return (
    <div className="space-y-6">
      {/* Report Actions */}
      <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
        <div>
          <h2 className="text-lg font-semibold text-blue-900">CBC Report Card</h2>
          <p className="text-sm text-blue-700">{student.name} • Term {term}, {academicYear}</p>
        </div>
        <div className="flex space-x-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Export Report Card</DialogTitle>
              </DialogHeader>
              <UniversalReportGenerator 
                reportType="cbc_report_card"
                data={{ student, assessments, term, academicYear }} 
                title={`${student.name} Report Card`} 
              />
            </DialogContent>
          </Dialog>
          <Button size="sm">
            <Share className="h-4 w-4 mr-2" />
            Send to Parent
          </Button>
          <Button size="sm">
            <Print className="h-4 w-4 mr-2" />
            Print
          </Button>
        </div>
      </div>

      {/* Report Card Content */}
      <div className="max-w-4xl mx-auto bg-white">
      {/* Header */}
      <div className="border-b-2 border-blue-600 pb-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <School className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{school?.name || 'School Name'}</h1>
              <p className="text-gray-600">{school?.motto || 'Excellence Through Education'}</p>
              <p className="text-sm text-gray-500">{school?.address || 'P.O. Box 12345, Nairobi'}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-600">CBC</div>
            <div className="text-sm text-gray-600">COMPETENCY-BASED</div>
            <div className="text-sm text-gray-600">CURRICULUM</div>
          </div>
        </div>
      </div>

      {/* Student Information */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <User className="h-5 w-5 mr-2 text-blue-600" />
            Student Information
          </h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Name:</span>
              <span className="font-medium">{student.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Admission No:</span>
              <span className="font-medium font-mono">{student.admission_no}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">UPI:</span>
              <span className="font-medium font-mono">{student.upi}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Class:</span>
              <span className="font-medium">Grade 3A</span>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-blue-600" />
            Academic Period
          </h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Academic Year:</span>
              <span className="font-medium">{academicYear}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Term:</span>
              <span className="font-medium">Term {term}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Report Date:</span>
              <span className="font-medium">{formatDate(new Date().toISOString())}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Overall Performance:</span>
              <Badge 
                variant={overallProficiency === 'exceeding' || overallProficiency === 'proficient' ? 'default' : 'secondary'}
                className="capitalize"
              >
                {proficiencyLabels[overallProficiency as keyof typeof proficiencyLabels]}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Learning Areas Assessment */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <GraduationCap className="h-5 w-5 mr-2 text-blue-600" />
          Learning Areas Assessment
        </h2>
        
        <div className="space-y-4">
          {assessments.map((assessment, index) => (
            <Card key={index} className="border-l-4 border-l-blue-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{assessment.subject}</h3>
                    <p className="text-sm text-gray-600">{assessment.task_title}</p>
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant={assessment.proficiency_level === 'exceeding' || assessment.proficiency_level === 'proficient' ? 'default' : 'secondary'}
                      className="capitalize mb-1"
                    >
                      {assessment.proficiency_level}
                    </Badge>
                    <div className="text-sm text-gray-600">Score: {assessment.score}/8</div>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>Proficiency Level</span>
                    <span className="capitalize">{assessment.proficiency_level}</span>
                  </div>
                  <Progress 
                    value={(assessment.score / 8) * 100} 
                    className={`h-2 ${
                      assessment.proficiency_level === 'exceeding' ? '[&>div]:bg-green-500' :
                      assessment.proficiency_level === 'proficient' ? '[&>div]:bg-blue-500' :
                      assessment.proficiency_level === 'approaching' ? '[&>div]:bg-yellow-500' : '[&>div]:bg-red-500'
                    }`}
                  />
                </div>

                <div className="text-sm">
                  <p className="text-gray-700 mb-2">
                    <strong>Teacher Comment:</strong> {assessment.comment}
                  </p>
                  <p className="text-gray-600">
                    <strong>Evidence Captured:</strong> {formatDate(assessment.captured_at)}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Key Competencies Summary */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Award className="h-5 w-5 mr-2 text-blue-600" />
          Key Competencies Development
        </h2>
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Core Competencies</h3>
            <div className="space-y-2">
              {[
                { name: 'Communication & Collaboration', level: 'proficient' },
                { name: 'Critical Thinking', level: 'approaching' },
                { name: 'Creativity & Imagination', level: 'proficient' },
                { name: 'Citizenship', level: 'exceeding' }
              ].map((competency, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{competency.name}</span>
                  <Badge 
                    variant={competency.level === 'exceeding' || competency.level === 'proficient' ? 'default' : 'secondary'}
                    className="text-xs capitalize"
                  >
                    {competency.level}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-3">Values</h3>
            <div className="space-y-2">
              {[
                { name: 'Respect', level: 'exceeding' },
                { name: 'Responsibility', level: 'proficient' },
                { name: 'Unity', level: 'proficient' },
                { name: 'Peace', level: 'approaching' }
              ].map((value, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{value.name}</span>
                  <Badge 
                    variant={value.level === 'exceeding' || value.level === 'proficient' ? 'default' : 'secondary'}
                    className="text-xs capitalize"
                  >
                    {value.level}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Teacher's Remarks */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Class Teacher's Remarks</h2>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-gray-700 leading-relaxed">
            {student.name} has shown consistent progress in most learning areas this term. 
            Their participation in class discussions demonstrates good communication skills and critical thinking. 
            Areas for improvement include mathematical problem-solving strategies and creative writing. 
            I recommend continued practice in these areas and encourage {student.name} to maintain their 
            positive attitude towards learning.
          </p>
        </div>
      </div>

      {/* Next Steps */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
          Next Steps & Recommendations
        </h2>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Strengths to Build On</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Excellent verbal communication skills</li>
              <li>• Strong collaborative abilities</li>
              <li>• Good citizenship values demonstration</li>
              <li>• Consistent attendance and punctuality</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Areas for Development</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Mathematical reasoning and problem-solving</li>
              <li>• Creative writing and expression</li>
              <li>• Independent learning strategies</li>
              <li>• Time management during assessments</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Signatures */}
      <div className="border-t pt-6">
        <div className="grid grid-cols-3 gap-8">
          <div className="text-center">
            <div className="border-b border-gray-300 mb-2 h-12"></div>
            <p className="text-sm text-gray-600">Class Teacher</p>
            <p className="text-xs text-gray-500">John Mwangi Kariuki</p>
          </div>
          <div className="text-center">
            <div className="border-b border-gray-300 mb-2 h-12"></div>
            <p className="text-sm text-gray-600">Head Teacher</p>
            <p className="text-xs text-gray-500">Jane Wanjiku Mwangi</p>
          </div>
          <div className="text-center">
            <div className="border-b border-gray-300 mb-2 h-12"></div>
            <p className="text-sm text-gray-600">Parent/Guardian</p>
            <p className="text-xs text-gray-500">Signature & Date</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-4 border-t text-center text-xs text-gray-500">
        <p>This report is generated by the CBC School Management System</p>
        <p>© 2024 {school?.name || 'School Name'} - All Rights Reserved</p>
      </div>
    </div>
      </div>
  );
}
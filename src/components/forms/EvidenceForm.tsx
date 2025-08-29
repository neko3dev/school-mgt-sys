import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockLearners } from '@/data/mock-data';
import { useAssessment } from '@/store';
import { Save, X, Upload, Camera, Mic, FileText } from 'lucide-react';

interface EvidenceFormProps {
  task: any;
  onClose: () => void;
}

export function EvidenceForm({ task, onClose }: EvidenceFormProps) {
  const [formData, setFormData] = useState({
    learner_id: '',
    proficiency_level: 'approaching',
    score: 4,
    comment: '',
    evidence_type: 'photo',
    files: []
  });

  const { addEvidence } = useAssessment();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const evidence = {
      id: Date.now().toString(),
      task_id: task.id,
      teacher_id: 'current-user',
      captured_at: new Date().toISOString(),
      ...formData
    };

    addEvidence(evidence);
    onClose();
  };

  const proficiencyLevels = [
    { value: 'emerging', label: 'Emerging (1-2)', color: 'bg-red-100 text-red-800' },
    { value: 'approaching', label: 'Approaching (3-4)', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'proficient', label: 'Proficient (5-6)', color: 'bg-blue-100 text-blue-800' },
    { value: 'exceeding', label: 'Exceeding (7-8)', color: 'bg-green-100 text-green-800' }
  ];

  const evidenceIcons = {
    photo: Camera,
    video: Camera,
    audio: Mic,
    document: FileText
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Add Assessment Evidence</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Task: {task?.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">{task?.description}</p>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label>Student *</Label>
          <Select value={formData.learner_id} onValueChange={(value) => setFormData(prev => ({ ...prev, learner_id: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select student" />
            </SelectTrigger>
            <SelectContent>
              {mockLearners.filter(s => s.status === 'active').map((student) => (
                <SelectItem key={student.id} value={student.id}>
                  {student.name} ({student.admission_no})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Proficiency Level *</Label>
            <Select value={formData.proficiency_level} onValueChange={(value) => setFormData(prev => ({ ...prev, proficiency_level: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {proficiencyLevels.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="score">Score (1-8)</Label>
            <Input
              id="score"
              type="number"
              min="1"
              max="8"
              value={formData.score}
              onChange={(e) => setFormData(prev => ({ ...prev, score: parseInt(e.target.value) }))}
            />
          </div>
        </div>

        <div>
          <Label>Evidence Type</Label>
          <div className="grid grid-cols-4 gap-2 mt-2">
            {Object.entries(evidenceIcons).map(([type, Icon]) => (
              <button
                key={type}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, evidence_type: type }))}
                className={`p-3 border rounded-lg flex flex-col items-center space-y-2 transition-colors ${
                  formData.evidence_type === type ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Icon className={`h-5 w-5 ${formData.evidence_type === type ? 'text-blue-600' : 'text-gray-400'}`} />
                <span className="text-xs capitalize">{type}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="comment">Teacher Comment *</Label>
          <Textarea
            id="comment"
            value={formData.comment}
            onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
            placeholder="Describe the student's performance and evidence..."
            required
          />
        </div>

        <div>
          <Label>Upload Evidence Files</Label>
          <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
            <p className="text-xs text-gray-500">Photos, videos, documents up to 10MB each</p>
            <input type="file" multiple className="hidden" />
          </div>
        </div>

        <div className="flex space-x-2">
          <Button type="submit">
            <Save className="h-4 w-4 mr-2" />
            Save Evidence
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
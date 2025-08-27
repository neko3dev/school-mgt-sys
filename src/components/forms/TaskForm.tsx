import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAssessment } from '@/store';
import { X, Save, Plus } from 'lucide-react';

interface TaskFormProps {
  task?: any;
  onClose: () => void;
  onSave: (task: any) => void;
}

export function TaskForm({ task, onClose, onSave }: TaskFormProps) {
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    subject_id: task?.subject_id || '',
    classroom_id: task?.classroom_id || '',
    term: task?.term || 1,
    academic_year: task?.academic_year || '2024',
    weight: task?.weight || 25,
    due_date: task?.due_date || '',
    evidence_types: task?.evidence_types || [],
    outcome_refs: task?.outcome_refs || [],
    rubric_levels: task?.rubric_levels || [
      {
        level: 'emerging',
        description: 'Understands basic concepts with support',
        score_range: [1, 2]
      },
      {
        level: 'approaching',
        description: 'Demonstrates developing understanding',
        score_range: [3, 4]
      },
      {
        level: 'proficient',
        description: 'Shows clear understanding of concepts',
        score_range: [5, 6]
      },
      {
        level: 'exceeding',
        description: 'Demonstrates exceptional understanding',
        score_range: [7, 8]
      }
    ]
  });

  const evidenceTypeOptions = [
    { value: 'photo', label: 'Photo' },
    { value: 'video', label: 'Video' },
    { value: 'audio', label: 'Audio' },
    { value: 'document', label: 'Document' },
    { value: 'presentation', label: 'Presentation' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const toggleEvidenceType = (type: string) => {
    setFormData(prev => ({
      ...prev,
      evidence_types: prev.evidence_types.includes(type)
        ? prev.evidence_types.filter((t: string) => t !== type)
        : [...prev.evidence_types, type]
    }));
  };

  const updateRubricLevel = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      rubric_levels: prev.rubric_levels.map((level: any, i: number) =>
        i === index ? { ...level, [field]: value } : level
      )
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          {task ? 'Edit SBA Task' : 'Create New SBA Task'}
        </h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Task Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Task Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Subject *</Label>
                <Select value={formData.subject_id} onValueChange={(value) => setFormData(prev => ({ ...prev, subject_id: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sub-1">English</SelectItem>
                    <SelectItem value="sub-2">Kiswahili</SelectItem>
                    <SelectItem value="sub-3">Mathematics</SelectItem>
                    <SelectItem value="sub-4">Environmental Activities</SelectItem>
                    <SelectItem value="sub-5">CRE</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Class *</Label>
                <Select value={formData.classroom_id} onValueChange={(value) => setFormData(prev => ({ ...prev, classroom_id: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="class-1">Grade 3A</SelectItem>
                    <SelectItem value="class-2">Grade 3B</SelectItem>
                    <SelectItem value="class-3">Grade 4A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="term">Term *</Label>
                <Select value={formData.term.toString()} onValueChange={(value) => setFormData(prev => ({ ...prev, term: parseInt(value) }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Term 1</SelectItem>
                    <SelectItem value="2">Term 2</SelectItem>
                    <SelectItem value="3">Term 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="weight">Weight (%)</Label>
                <Input
                  id="weight"
                  type="number"
                  min="1"
                  max="100"
                  value={formData.weight}
                  onChange={(e) => setFormData(prev => ({ ...prev, weight: parseInt(e.target.value) }))}
                />
              </div>
              <div>
                <Label htmlFor="due_date">Due Date *</Label>
                <Input
                  id="due_date"
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, due_date: e.target.value }))}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Evidence Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-gray-600">Select the types of evidence students can submit:</p>
              <div className="flex flex-wrap gap-2">
                {evidenceTypeOptions.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={option.value}
                      checked={formData.evidence_types.includes(option.value)}
                      onChange={() => toggleEvidenceType(option.value)}
                    />
                    <Label htmlFor={option.value}>{option.label}</Label>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {formData.evidence_types.map((type: string) => (
                  <Badge key={type} variant="secondary">
                    {evidenceTypeOptions.find(opt => opt.value === type)?.label}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Proficiency Rubric</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.rubric_levels.map((level: any, index: number) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant={level.level === 'exceeding' ? 'default' : 'secondary'} className="capitalize">
                    {level.level}
                  </Badge>
                  <div className="text-sm text-gray-600">
                    Score: {level.score_range[0]}-{level.score_range[1]}
                  </div>
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={level.description}
                    onChange={(e) => updateRubricLevel(index, 'description', e.target.value)}
                    placeholder="Describe what this proficiency level looks like..."
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex space-x-2">
          <Button type="submit">
            <Save className="h-4 w-4 mr-2" />
            {task ? 'Update Task' : 'Create Task'}
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
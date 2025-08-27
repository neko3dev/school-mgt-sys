import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useStudents } from '@/store';
import { X, Save, Plus } from 'lucide-react';

interface StudentFormProps {
  student?: any;
  onClose: () => void;
  onSave: (student: any) => void;
}

export function StudentForm({ student, onClose, onSave }: StudentFormProps) {
  const [formData, setFormData] = useState({
    name: student?.name || '',
    admission_no: student?.admission_no || '',
    upi: student?.upi || '',
    dob: student?.dob || '',
    sex: student?.sex || '',
    classroom_id: student?.classroom_id || '',
    status: student?.status || 'active',
    special_needs: student?.special_needs || false,
    guardians: student?.guardians || []
  });

  const [guardianForm, setGuardianForm] = useState({
    name: '',
    relation: '',
    phone: '',
    email: '',
    national_id: ''
  });

  const [showGuardianForm, setShowGuardianForm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const addGuardian = () => {
    if (guardianForm.name && guardianForm.phone) {
      setFormData(prev => ({
        ...prev,
        guardians: [...prev.guardians, { ...guardianForm, id: Date.now().toString() }]
      }));
      setGuardianForm({
        name: '',
        relation: '',
        phone: '',
        email: '',
        national_id: ''
      });
      setShowGuardianForm(false);
    }
  };

  const removeGuardian = (index: number) => {
    setFormData(prev => ({
      ...prev,
      guardians: prev.guardians.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          {student ? 'Edit Student' : 'Add New Student'}
        </h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Student Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="admission_no">Admission Number *</Label>
                <Input
                  id="admission_no"
                  value={formData.admission_no}
                  onChange={(e) => setFormData(prev => ({ ...prev, admission_no: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="upi">UPI Number *</Label>
                <Input
                  id="upi"
                  value={formData.upi}
                  onChange={(e) => setFormData(prev => ({ ...prev, upi: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="dob">Date of Birth *</Label>
                <Input
                  id="dob"
                  type="date"
                  value={formData.dob}
                  onChange={(e) => setFormData(prev => ({ ...prev, dob: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Gender *</Label>
                <Select value={formData.sex} onValueChange={(value) => setFormData(prev => ({ ...prev, sex: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M">Male</SelectItem>
                    <SelectItem value="F">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Class</Label>
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
              <div>
                <Label>Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="transferred">Transferred</SelectItem>
                    <SelectItem value="graduated">Graduated</SelectItem>
                    <SelectItem value="dropped">Dropped</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="special_needs"
                checked={formData.special_needs}
                onChange={(e) => setFormData(prev => ({ ...prev, special_needs: e.target.checked }))}
              />
              <Label htmlFor="special_needs">Student has special needs</Label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Guardians</span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowGuardianForm(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Guardian
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.guardians.map((guardian: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{guardian.name}</p>
                  <p className="text-sm text-gray-600">{guardian.relation} • {guardian.phone}</p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeGuardian(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}

            {showGuardianForm && (
              <div className="p-4 border rounded-lg space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Name *</Label>
                    <Input
                      value={guardianForm.name}
                      onChange={(e) => setGuardianForm(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Relation *</Label>
                    <Select value={guardianForm.relation} onValueChange={(value) => setGuardianForm(prev => ({ ...prev, relation: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select relation" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="father">Father</SelectItem>
                        <SelectItem value="mother">Mother</SelectItem>
                        <SelectItem value="guardian">Guardian</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Phone *</Label>
                    <Input
                      value={guardianForm.phone}
                      onChange={(e) => setGuardianForm(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={guardianForm.email}
                      onChange={(e) => setGuardianForm(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                </div>
                <div>
                  <Label>National ID</Label>
                  <Input
                    value={guardianForm.national_id}
                    onChange={(e) => setGuardianForm(prev => ({ ...prev, national_id: e.target.value }))}
                  />
                </div>
                <div className="flex space-x-2">
                  <Button type="button" onClick={addGuardian}>Add Guardian</Button>
                  <Button type="button" variant="outline" onClick={() => setShowGuardianForm(false)}>Cancel</Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex space-x-2">
          <Button type="submit">
            <Save className="h-4 w-4 mr-2" />
            {student ? 'Update Student' : 'Add Student'}
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
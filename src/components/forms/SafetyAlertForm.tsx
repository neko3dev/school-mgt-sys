import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Save, X, AlertTriangle, Phone, Mail } from 'lucide-react';

interface SafetyAlertFormProps {
  alertData: any;
  onClose: () => void;
}

export function SafetyAlertForm({ alertData, onClose }: SafetyAlertFormProps) {
  const [formData, setFormData] = useState({
    type: 'emergency',
    priority: 'high',
    message: '',
    recipients: ['parents', 'admin'],
    location: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate sending alert
    console.log('Safety alert sent:', formData);
    alert('Safety alert sent to all recipients');
    onClose();
  };

  const alertTypes = [
    { value: 'emergency', label: 'Emergency', color: 'bg-red-500' },
    { value: 'breakdown', label: 'Vehicle Breakdown', color: 'bg-orange-500' },
    { value: 'delay', label: 'Route Delay', color: 'bg-yellow-500' },
    { value: 'incident', label: 'Safety Incident', color: 'bg-purple-500' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <h2 className="text-xl font-semibold text-red-800">Safety Alert</h2>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <span className="text-sm text-red-800">
              This will immediately notify parents, school admin, and emergency contacts
            </span>
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Alert Type *</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {alertTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Priority *</Label>
            <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="location">Current Location</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            placeholder="Enter current location or coordinates"
          />
        </div>

        <div>
          <Label htmlFor="description">Alert Description *</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Describe the situation requiring immediate attention..."
            required
            rows={4}
          />
        </div>

        <div>
          <Label>Notification Recipients</Label>
          <div className="mt-2 space-y-2">
            {[
              { id: 'parents', label: 'All Parents on Route', icon: Phone },
              { id: 'admin', label: 'School Administration', icon: Mail },
              { id: 'emergency', label: 'Emergency Contacts', icon: AlertTriangle },
              { id: 'authorities', label: 'Local Authorities', icon: Shield }
            ].map((recipient) => {
              const Icon = recipient.icon;
              return (
                <label key={recipient.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.recipients.includes(recipient.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData(prev => ({ ...prev, recipients: [...prev.recipients, recipient.id] }));
                      } else {
                        setFormData(prev => ({ ...prev, recipients: prev.recipients.filter(r => r !== recipient.id) }));
                      }
                    }}
                  />
                  <Icon className="h-4 w-4 text-gray-600" />
                  <span className="text-sm">{recipient.label}</span>
                </label>
              );
            })}
          </div>
        </div>

        <div className="flex space-x-2">
          <Button type="submit" variant="destructive">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Send Alert Now
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
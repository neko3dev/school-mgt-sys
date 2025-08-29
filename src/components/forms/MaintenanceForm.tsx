import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { useInventory } from '@/store';
import { Save, X, Wrench, Calendar, DollarSign } from 'lucide-react';

interface MaintenanceFormProps {
  asset: any;
  onClose: () => void;
}

export function MaintenanceForm({ asset, onClose }: MaintenanceFormProps) {
  const [formData, setFormData] = useState({
    type: 'preventive',
    description: '',
    scheduled_date: new Date().toISOString().split('T')[0],
    estimated_cost: 0,
    technician: '',
    priority: 'medium'
  });

  const { addMaintenance } = useInventory();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const maintenance = {
      id: Date.now().toString(),
      asset_id: asset.id,
      status: 'scheduled',
      created_at: new Date().toISOString(),
      ...formData
    };

    addMaintenance(maintenance);
    onClose();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <Wrench className="h-5 w-5 text-blue-600" />
            <div>
              <p className="font-medium text-gray-900">{asset?.name}</p>
              <p className="text-sm text-gray-600">{asset?.location}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Maintenance Type *</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="preventive">Preventive</SelectItem>
                <SelectItem value="corrective">Corrective</SelectItem>
                <SelectItem value="emergency">Emergency</SelectItem>
                <SelectItem value="upgrade">Upgrade</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Priority</Label>
            <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Describe the maintenance work required..."
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="scheduled_date">Scheduled Date *</Label>
            <Input
              id="scheduled_date"
              type="date"
              value={formData.scheduled_date}
              onChange={(e) => setFormData(prev => ({ ...prev, scheduled_date: e.target.value }))}
              required
            />
          </div>
          <div>
            <Label htmlFor="estimated_cost">Estimated Cost (KES)</Label>
            <Input
              id="estimated_cost"
              type="number"
              value={formData.estimated_cost}
              onChange={(e) => setFormData(prev => ({ ...prev, estimated_cost: parseInt(e.target.value) }))}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="technician">Assigned Technician</Label>
          <Input
            id="technician"
            value={formData.technician}
            onChange={(e) => setFormData(prev => ({ ...prev, technician: e.target.value }))}
            placeholder="Enter technician name"
          />
        </div>

        <div className="flex space-x-2">
          <Button type="submit">
            <Save className="h-4 w-4 mr-2" />
            Schedule Maintenance
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
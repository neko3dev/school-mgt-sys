import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useFinance } from '@/store';
import { X, Save, Plus, Trash2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface InvoiceFormProps {
  invoice?: any;
  onClose: () => void;
  onSave: (invoice: any) => void;
}

export function InvoiceForm({ invoice, onClose, onSave }: InvoiceFormProps) {
  const [formData, setFormData] = useState({
    learner_id: invoice?.learner_id || '',
    academic_year: invoice?.academic_year || '2024',
    term: invoice?.term || 1,
    due_date: invoice?.due_date || '',
    status: invoice?.status || 'draft',
    items: invoice?.items || [
      { fee_item_id: 'fee-1', name: 'Tuition Fee', amount: 15000 }
    ]
  });

  const feeItemOptions = [
    { id: 'fee-1', name: 'Tuition Fee', amount: 15000, category: 'tuition' },
    { id: 'fee-2', name: 'Activity Fee', amount: 2000, category: 'activities' },
    { id: 'fee-3', name: 'Lunch Program', amount: 6000, category: 'meals' },
    { id: 'fee-4', name: 'Transport Fee', amount: 3000, category: 'transport' },
    { id: 'fee-5', name: 'Uniform Fee', amount: 2500, category: 'other' },
    { id: 'fee-6', name: 'Books & Stationery', amount: 1500, category: 'other' }
  ];

  const students = [
    { id: 'learner-1', name: 'Grace Wanjiku Kamau', admission_no: 'KP/2022/001' },
    { id: 'learner-2', name: 'Brian Kiprotich Kones', admission_no: 'KP/2022/002' },
    { id: 'learner-3', name: 'Amina Hassan Ali', admission_no: 'KP/2022/003' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const total = formData.items.reduce((sum, item) => sum + item.amount, 0);
    const invoiceData = {
      ...formData,
      total,
      balance: total,
      created_at: new Date().toISOString()
    };
    onSave(invoiceData);
    onClose();
  };

  const addFeeItem = (feeItem: any) => {
    const exists = formData.items.find(item => item.fee_item_id === feeItem.id);
    if (!exists) {
      setFormData(prev => ({
        ...prev,
        items: [...prev.items, {
          fee_item_id: feeItem.id,
          name: feeItem.name,
          amount: feeItem.amount
        }]
      }));
    }
  };

  const removeFeeItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const updateItemAmount = (index: number, amount: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, amount } : item
      )
    }));
  };

  const total = formData.items.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          {invoice ? 'Edit Invoice' : 'Create New Invoice'}
        </h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Invoice Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Student *</Label>
              <Select value={formData.learner_id} onValueChange={(value) => setFormData(prev => ({ ...prev, learner_id: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select student" />
                </SelectTrigger>
                <SelectContent>
                  {students.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.name} ({student.admission_no})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Academic Year</Label>
                <Select value={formData.academic_year} onValueChange={(value) => setFormData(prev => ({ ...prev, academic_year: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Term</Label>
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

            <div>
              <Label>Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Fee Items</span>
              <div className="text-lg font-semibold text-blue-600">
                Total: {formatCurrency(total)}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {formData.items.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <Badge variant="outline" className="text-xs">
                      {feeItemOptions.find(opt => opt.id === item.fee_item_id)?.category || 'other'}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      value={item.amount}
                      onChange={(e) => updateItemAmount(index, parseInt(e.target.value) || 0)}
                      className="w-24"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFeeItem(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <p className="text-sm text-gray-600 mb-3">Add fee items:</p>
              <div className="grid grid-cols-2 gap-2">
                {feeItemOptions.map((feeItem) => (
                  <Button
                    key={feeItem.id}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addFeeItem(feeItem)}
                    disabled={formData.items.some(item => item.fee_item_id === feeItem.id)}
                    className="justify-start"
                  >
                    <Plus className="h-3 w-3 mr-2" />
                    {feeItem.name} ({formatCurrency(feeItem.amount)})
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex space-x-2">
          <Button type="submit">
            <Save className="h-4 w-4 mr-2" />
            {invoice ? 'Update Invoice' : 'Create Invoice'}
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
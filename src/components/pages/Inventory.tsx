import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { ReportExporter } from '@/components/features/ReportExporter';
import { formatDate, formatCurrency, generateId } from '@/lib/utils';
import { useInventory } from '@/store';
import { 
  Package, 
  Search, 
  Plus, 
  Eye, 
  Edit,
  Download,
  Filter,
  AlertTriangle,
  CheckCircle,
  Clock,
  Wrench,
  FileText,
  Save,
  X,
  Trash2,
  QrCode,
  TrendingDown,
  TrendingUp
} from 'lucide-react';

export function Inventory() {
  const [activeTab, setActiveTab] = useState('assets');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAssetForm, setShowAssetForm] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [showMaintenanceForm, setShowMaintenanceForm] = useState(false);
  const [showReportExporter, setShowReportExporter] = useState(false);

  const { assets, maintenance, addAsset, updateAsset, deleteAsset, addMaintenance } = useInventory();

  const mockAssets = [
    {
      id: generateId(),
      name: 'Interactive Whiteboard',
      category: 'technology',
      location: 'Grade 3A Classroom',
      serial_number: 'IWB-001-2024',
      purchase_date: '2024-01-15',
      purchase_cost: 85000,
      condition: 'excellent',
      warranty_expiry: '2027-01-15',
      status: 'active',
      last_maintenance: '2024-02-15'
    },
    {
      id: generateId(),
      name: 'Science Lab Equipment Set',
      category: 'laboratory',
      location: 'Science Laboratory',
      serial_number: 'SCI-LAB-001',
      purchase_date: '2023-08-20',
      purchase_cost: 125000,
      condition: 'good',
      warranty_expiry: '2025-08-20',
      status: 'active',
      last_maintenance: '2024-01-10'
    },
    {
      id: generateId(),
      name: 'Student Desks (Set of 40)',
      category: 'furniture',
      location: 'Grade 4A Classroom',
      serial_number: 'DESK-4A-001',
      purchase_date: '2022-12-01',
      purchase_cost: 60000,
      condition: 'fair',
      status: 'active',
      last_maintenance: '2023-12-01'
    }
  ];

  const mockMaintenanceRecords = [
    {
      id: generateId(),
      asset_id: mockAssets[0].id,
      type: 'preventive',
      description: 'Monthly calibration and cleaning',
      scheduled_date: new Date().toISOString(),
      completed_date: new Date().toISOString(),
      cost: 2500,
      technician: 'John Mwangi',
      status: 'completed'
    },
    {
      id: generateId(),
      asset_id: mockAssets[1].id,
      type: 'corrective',
      description: 'Replace broken microscope lens',
      scheduled_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      cost: 8500,
      technician: 'Mary Njeri',
      status: 'scheduled'
    }
  ];

  const allAssets = assets.length > 0 ? assets : mockAssets;
  const allMaintenance = maintenance.length > 0 ? maintenance : mockMaintenanceRecords;

  const filteredAssets = allAssets.filter(asset =>
    asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.serial_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddAsset = () => {
    setSelectedAsset(null);
    setShowAssetForm(true);
  };

  const handleEditAsset = (asset: any) => {
    setSelectedAsset(asset);
    setShowAssetForm(true);
  };

  const handleSaveAsset = (assetData: any) => {
    if (selectedAsset) {
      updateAsset(selectedAsset.id, assetData);
    } else {
      addAsset(assetData);
    }
    setShowAssetForm(false);
  };

  const handleDeleteAsset = (asset: any) => {
    if (confirm(`Delete "${asset.name}"?`)) {
      deleteAsset(asset.id);
    }
  };

  const AssetCard = ({ asset }: { asset: any }) => {
    const conditionConfig = {
      excellent: { color: 'text-green-600', bg: 'bg-green-50' },
      good: { color: 'text-blue-600', bg: 'bg-blue-50' },
      fair: { color: 'text-yellow-600', bg: 'bg-yellow-50' },
      poor: { color: 'text-red-600', bg: 'bg-red-50' }
    };

    const condition = conditionConfig[asset.condition as keyof typeof conditionConfig];

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="font-semibold text-gray-900">{asset.name}</h3>
                <Badge variant="outline" className="capitalize">{asset.category}</Badge>
                <Badge variant={asset.condition === 'excellent' || asset.condition === 'good' ? 'default' : 'secondary'}>
                  {asset.condition}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                <div>
                  <p className="text-gray-500">Serial Number</p>
                  <p className="font-mono">{asset.serial_number}</p>
                </div>
                <div>
                  <p className="text-gray-500">Location</p>
                  <p>{asset.location}</p>
                </div>
                <div>
                  <p className="text-gray-500">Purchase Date</p>
                  <p>{formatDate(asset.purchase_date)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Value</p>
                  <p className="font-semibold">{formatCurrency(asset.purchase_cost)}</p>
                </div>
              </div>

              {asset.warranty_expiry && (
                <div className="text-xs text-gray-500">
                  Warranty expires: {formatDate(asset.warranty_expiry)}
                </div>
              )}
            </div>

            <div className="flex flex-col space-y-2">
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-1" />
                View
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleEditAsset(asset)}>
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowMaintenanceForm(true)}>
                <Wrench className="h-4 w-4 mr-1" />
                Maintain
              </Button>
              <Button variant="outline" size="sm">
                <QrCode className="h-4 w-4 mr-1" />
                QR Code
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleDeleteAsset(asset)}>
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const AssetForm = () => {
    const [formData, setFormData] = useState({
      name: selectedAsset?.name || '',
      category: selectedAsset?.category || 'technology',
      location: selectedAsset?.location || '',
      serial_number: selectedAsset?.serial_number || '',
      purchase_date: selectedAsset?.purchase_date || '',
      purchase_cost: selectedAsset?.purchase_cost || 0,
      condition: selectedAsset?.condition || 'excellent',
      warranty_expiry: selectedAsset?.warranty_expiry || '',
      status: selectedAsset?.status || 'active'
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      handleSaveAsset(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Asset Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>
          <div>
            <Label>Category</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="furniture">Furniture</SelectItem>
                <SelectItem value="laboratory">Laboratory</SelectItem>
                <SelectItem value="sports">Sports Equipment</SelectItem>
                <SelectItem value="transport">Transport</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="serial_number">Serial Number</Label>
            <Input
              id="serial_number"
              value={formData.serial_number}
              onChange={(e) => setFormData(prev => ({ ...prev, serial_number: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="purchase_date">Purchase Date</Label>
            <Input
              id="purchase_date"
              type="date"
              value={formData.purchase_date}
              onChange={(e) => setFormData(prev => ({ ...prev, purchase_date: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="purchase_cost">Purchase Cost (KES)</Label>
            <Input
              id="purchase_cost"
              type="number"
              value={formData.purchase_cost}
              onChange={(e) => setFormData(prev => ({ ...prev, purchase_cost: parseInt(e.target.value) }))}
            />
          </div>
          <div>
            <Label>Condition</Label>
            <Select value={formData.condition} onValueChange={(value) => setFormData(prev => ({ ...prev, condition: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="excellent">Excellent</SelectItem>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="fair">Fair</SelectItem>
                <SelectItem value="poor">Poor</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="warranty_expiry">Warranty Expiry (Optional)</Label>
          <Input
            id="warranty_expiry"
            type="date"
            value={formData.warranty_expiry}
            onChange={(e) => setFormData(prev => ({ ...prev, warranty_expiry: e.target.value }))}
          />
        </div>

        <div className="flex space-x-2">
          <Button type="submit">
            <Save className="h-4 w-4 mr-2" />
            {selectedAsset ? 'Update Asset' : 'Add Asset'}
          </Button>
          <Button type="button" variant="outline" onClick={() => setShowAssetForm(false)}>
            Cancel
          </Button>
        </div>
      </form>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600 mt-1">Track school assets, equipment, and maintenance</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="secondary" className="bg-blue-50 text-blue-700">
            {allAssets.length} Assets
          </Badge>
          <Button onClick={handleAddAsset}>
            <Plus className="h-4 w-4 mr-2" />
            Add Asset
          </Button>
          <Button onClick={() => setShowReportExporter(true)} variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Inventory Reports
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Assets</p>
                <p className="text-2xl font-bold text-blue-600">{allAssets.length}</p>
              </div>
              <Package className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(allAssets.reduce((sum, asset) => sum + asset.purchase_cost, 0))}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Maintenance Due</p>
                <p className="text-2xl font-bold text-orange-600">{allMaintenance.filter(m => m.status === 'scheduled').length}</p>
              </div>
              <Wrench className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Excellent Condition</p>
                <p className="text-2xl font-bold text-purple-600">{allAssets.filter(a => a.condition === 'excellent').length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="assets">Assets ({allAssets.length})</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance ({allMaintenance.length})</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="assets" className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search assets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline">
              <QrCode className="h-4 w-4 mr-2" />
              Generate QR Codes
            </Button>
          </div>

          {filteredAssets.map((asset) => (
            <AssetCard key={asset.id} asset={asset} />
          ))}
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Maintenance Schedule</h3>
            <Button onClick={() => setShowMaintenanceForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Schedule Maintenance
            </Button>
          </div>

          {allMaintenance.map((record) => {
            const asset = allAssets.find(a => a.id === record.asset_id);
            return (
              <Card key={record.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{asset?.name}</h3>
                        <Badge variant="outline" className="capitalize">{record.type}</Badge>
                        <Badge variant={record.status === 'completed' ? 'default' : 'secondary'}>
                          {record.status}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{record.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Scheduled Date</p>
                          <p>{formatDate(record.scheduled_date)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Technician</p>
                          <p>{record.technician}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Estimated Cost</p>
                          <p className="font-semibold">{formatCurrency(record.cost)}</p>
                        </div>
                        {record.completed_date && (
                          <div>
                            <p className="text-gray-500">Completed</p>
                            <p>{formatDate(record.completed_date)}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      {record.status !== 'completed' && (
                        <Button size="sm">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Complete
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Asset Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: 'Asset Register', description: 'Complete inventory listing' },
                    { name: 'Depreciation Schedule', description: 'Asset value over time' },
                    { name: 'Maintenance Log', description: 'All maintenance activities' },
                    { name: 'Warranty Tracking', description: 'Warranty expiry alerts' },
                    { name: 'Asset Utilization', description: 'Usage and efficiency metrics' }
                  ].map((report, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{report.name}</p>
                        <p className="text-sm text-gray-600">{report.description}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Generate
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Asset Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { category: 'Technology', count: 15, value: 450000 },
                    { category: 'Furniture', count: 120, value: 280000 },
                    { category: 'Laboratory', count: 8, value: 320000 },
                    { category: 'Sports', count: 25, value: 85000 },
                    { category: 'Transport', count: 3, value: 1200000 }
                  ].map((item) => (
                    <div key={item.category} className="flex items-center justify-between">
                      <div>
                        <span className="font-medium text-gray-900">{item.category}</span>
                        <p className="text-sm text-gray-600">{item.count} items</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatCurrency(item.value)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Asset Form Dialog */}
      <Dialog open={showAssetForm} onOpenChange={setShowAssetForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedAsset ? 'Edit Asset' : 'Add New Asset'}</DialogTitle>
          </DialogHeader>
          <AssetForm />
        </DialogContent>
      </Dialog>

      {/* Report Exporter Dialog */}
      <Dialog open={showReportExporter} onOpenChange={setShowReportExporter}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Inventory Reports</DialogTitle>
          </DialogHeader>
          <ReportExporter 
            data={allAssets} 
            title="Inventory Reports" 
            type="privacy"
            onClose={() => setShowReportExporter(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
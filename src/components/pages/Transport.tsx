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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { mockLearners, mockTransportRoutes } from '@/data/mock-data';
import { formatDate, generateId } from '@/lib/utils';
import { useTransport, useReports } from '@/store';
import { 
  Bus, 
  MapPin, 
  Clock, 
  Users,
  Plus, 
  Eye, 
  Edit,
  Download,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle,
  Navigation,
  Phone,
  Save,
  X,
  Trash2,
  FileText,
  Shield,
  Bell
} from 'lucide-react';

export function Transport() {
  const [activeTab, setActiveTab] = useState('routes');
  const [searchTerm, setSearchTerm] = useState('');
  const [showRouteForm, setShowRouteForm] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<any>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [routeToDelete, setRouteToDelete] = useState<any>(null);
  const [showLiveTracking, setShowLiveTracking] = useState(false);
  const [routeForTracking, setRouteForTracking] = useState<any>(null);
  const [showSafetyAlert, setShowSafetyAlert] = useState(false);
  const [showReportExporter, setShowReportExporter] = useState(false);

  const { routes, addRoute, updateRoute, deleteRoute, addEvent } = useTransport();
  const { generateReport } = useReports();

  const allRoutes = routes.length > 0 ? routes : mockTransportRoutes;

  const filteredRoutes = allRoutes.filter(route =>
    route.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddRoute = () => {
    setSelectedRoute(null);
    setShowRouteForm(true);
  };

  const handleEditRoute = (route: any) => {
    setSelectedRoute(route);
    setShowRouteForm(true);
  };

  const handleSaveRoute = (routeData: any) => {
    if (selectedRoute) {
      updateRoute(selectedRoute.id, routeData);
    } else {
      addRoute(routeData);
    }
    setShowRouteForm(false);
  };

  const handleDeleteRoute = (route: any) => {
    setRouteToDelete(route);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (routeToDelete) {
      deleteRoute(routeToDelete.id);
      setShowDeleteDialog(false);
      setRouteToDelete(null);
    }
  };

  const handleLiveTracking = (route: any) => {
    setRouteForTracking(route);
    setShowLiveTracking(true);
  };

  const handleSafetyAlert = () => {
    setShowSafetyAlert(true);
  };

  const handleExportRoute = (route: any) => {
    generateReport({
      type: 'route_manifest',
      title: `${route.name} - Route Manifest`,
      data: route,
      format: 'pdf'
    });
  };

  const handleGenerateTransportReport = () => {
    generateReport({
      type: 'transport_summary',
      title: 'Transport Summary Report',
      data: allRoutes,
      format: 'xlsx'
    });
  };

  const RouteCard = ({ route }: { route: any }) => {
    const studentsOnRoute = mockLearners.filter(s => s.status === 'active').slice(0, 15);

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="font-semibold text-gray-900">{route.name}</h3>
                <Badge variant={route.active ? 'default' : 'secondary'}>
                  {route.active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                <div>
                  <p className="text-gray-500">Vehicle</p>
                  <p>{route.vehicle_id}</p>
                </div>
                <div>
                  <p className="text-gray-500">Driver</p>
                  <p>{route.driver_id}</p>
                </div>
                <div>
                  <p className="text-gray-500">Stops</p>
                  <p>{route.stops?.length || 0} stops</p>
                </div>
                <div>
                  <p className="text-gray-500">Students</p>
                  <p>{studentsOnRoute.length} students</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <Button variant="outline" size="sm" onClick={() => handleLiveTracking(route)}>
                <Navigation className="h-4 w-4 mr-1" />
                Track
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleEditRoute(route)}>
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleExportRoute(route)}>
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleDeleteRoute(route)}>
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const RouteForm = () => {
    const [formData, setFormData] = useState({
      name: selectedRoute?.name || '',
      vehicle_id: selectedRoute?.vehicle_id || '',
      driver_id: selectedRoute?.driver_id || '',
      matron_id: selectedRoute?.matron_id || '',
      active: selectedRoute?.active ?? true,
      stops: selectedRoute?.stops || []
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      handleSaveRoute(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Route Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>
          <div>
            <Label htmlFor="vehicle_id">Vehicle *</Label>
            <Input
              id="vehicle_id"
              value={formData.vehicle_id}
              onChange={(e) => setFormData(prev => ({ ...prev, vehicle_id: e.target.value }))}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="driver_id">Driver *</Label>
            <Input
              id="driver_id"
              value={formData.driver_id}
              onChange={(e) => setFormData(prev => ({ ...prev, driver_id: e.target.value }))}
              required
            />
          </div>
          <div>
            <Label htmlFor="matron_id">Matron</Label>
            <Input
              id="matron_id"
              value={formData.matron_id}
              onChange={(e) => setFormData(prev => ({ ...prev, matron_id: e.target.value }))}
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="active"
            checked={formData.active}
            onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
          />
          <Label htmlFor="active">Route is active</Label>
        </div>

        <div className="flex space-x-2">
          <Button type="submit">
            <Save className="h-4 w-4 mr-2" />
            {selectedRoute ? 'Update Route' : 'Create Route'}
          </Button>
          <Button type="button" variant="outline" onClick={() => setShowRouteForm(false)}>
            Cancel
          </Button>
        </div>
      </form>
    );
  };

  const LiveTrackingInterface = ({ route }: { route: any }) => {
    const [vehicleStatus, setVehicleStatus] = useState({
      location: 'Karagita Shopping Center',
      speed: 35,
      studentsOnBoard: 12,
      nextStop: 'Karagita Primary School',
      eta: '7 minutes',
      status: 'on_route'
    });

    return (
      <div className="space-y-6">
        <div className="text-center">
          <Navigation className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Live Tracking - {route.name}</h3>
          <p className="text-gray-600">Real-time vehicle monitoring and student safety</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <MapPin className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <p className="font-semibold text-blue-800">Current Location</p>
            <p className="text-sm text-blue-600">{vehicleStatus.location}</p>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <Clock className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <p className="font-semibold text-green-800">ETA Next Stop</p>
            <p className="text-sm text-green-600">{vehicleStatus.eta}</p>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <Users className="h-6 w-6 text-purple-600 mx-auto mb-2" />
            <p className="font-semibold text-purple-800">Students On Board</p>
            <p className="text-sm text-purple-600">{vehicleStatus.studentsOnBoard}</p>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <Navigation className="h-6 w-6 text-orange-600 mx-auto mb-2" />
            <p className="font-semibold text-orange-800">Speed</p>
            <p className="text-sm text-orange-600">{vehicleStatus.speed} km/h</p>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button variant="destructive" onClick={handleSafetyAlert}>
            <AlertTriangle className="h-4 w-4 mr-2" />
            Emergency Alert
          </Button>
          <Button variant="outline">
            <Phone className="h-4 w-4 mr-2" />
            Contact Driver
          </Button>
        </div>
      </div>
    );
  };

  const SafetyAlertForm = () => {
    const [alertData, setAlertData] = useState({
      type: 'emergency',
      message: '',
      location: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      alert('Safety alert sent to all stakeholders');
      setShowSafetyAlert(false);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Alert Type</Label>
          <Select value={alertData.type} onValueChange={(value) => setAlertData(prev => ({ ...prev, type: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="emergency">Emergency</SelectItem>
              <SelectItem value="breakdown">Vehicle Breakdown</SelectItem>
              <SelectItem value="delay">Route Delay</SelectItem>
              <SelectItem value="incident">Safety Incident</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="message">Alert Message *</Label>
          <Textarea
            id="message"
            value={alertData.message}
            onChange={(e) => setAlertData(prev => ({ ...prev, message: e.target.value }))}
            placeholder="Describe the situation..."
            required
          />
        </div>

        <div>
          <Label htmlFor="location">Current Location</Label>
          <Input
            id="location"
            value={alertData.location}
            onChange={(e) => setAlertData(prev => ({ ...prev, location: e.target.value }))}
            placeholder="Enter current location"
          />
        </div>

        <div className="flex space-x-2">
          <Button type="submit" variant="destructive">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Send Alert
          </Button>
          <Button type="button" variant="outline" onClick={() => setShowSafetyAlert(false)}>
            Cancel
          </Button>
        </div>
      </form>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transport Management</h1>
          <p className="text-gray-600 mt-1">Manage school transport routes and student safety</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="secondary" className="bg-blue-50 text-blue-700">
            {allRoutes.length} Active Routes
          </Badge>
          <Button onClick={handleAddRoute}>
            <Plus className="h-4 w-4 mr-2" />
            Add Route
          </Button>
          <Button variant="outline" onClick={handleGenerateTransportReport}>
            <FileText className="h-4 w-4 mr-2" />
            Transport Report
          </Button>
          <Button onClick={() => setShowReportExporter(true)} variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            All Reports
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Routes</p>
                <p className="text-2xl font-bold text-blue-600">{allRoutes.filter(r => r.active).length}</p>
              </div>
              <Bus className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Students Using Transport</p>
                <p className="text-2xl font-bold text-green-600">156</p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Safety Score</p>
                <p className="text-2xl font-bold text-purple-600">98%</p>
              </div>
              <Shield className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">On-Time Performance</p>
                <p className="text-2xl font-bold text-orange-600">94%</p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="routes">Routes ({allRoutes.length})</TabsTrigger>
          <TabsTrigger value="tracking">Live Tracking</TabsTrigger>
          <TabsTrigger value="safety">Safety</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="routes" className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search routes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>

          {filteredRoutes.map((route) => (
            <RouteCard key={route.id} route={route} />
          ))}
        </TabsContent>

        <TabsContent value="tracking" className="space-y-4">
          {routeForTracking ? (
            <LiveTrackingInterface route={routeForTracking} />
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Navigation className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Route to Track</h3>
                <p className="text-gray-600 mb-4">Choose a route from the routes tab to view live tracking</p>
                <Button onClick={() => setActiveTab('routes')}>
                  View Routes
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="safety" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-red-600" />
                <span>Safety Management</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="font-semibold text-green-800">Safety Protocols</p>
                  <p className="text-sm text-green-600">All drivers trained</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Bell className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="font-semibold text-blue-800">Alert System</p>
                  <p className="text-sm text-blue-600">Real-time notifications</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Navigation className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <p className="font-semibold text-purple-800">GPS Tracking</p>
                  <p className="text-sm text-purple-600">All vehicles monitored</p>
                </div>
              </div>

              <div className="mt-6">
                <Button onClick={handleSafetyAlert} variant="destructive">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Send Safety Alert
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Transport Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: 'Route Manifests', description: 'Student transport assignments', action: () => generateReport({ type: 'route_manifests', title: 'Route Manifests', data: allRoutes, format: 'pdf' }) },
                    { name: 'Safety Reports', description: 'Transport safety incidents', action: () => generateReport({ type: 'safety_reports', title: 'Safety Reports', data: allRoutes, format: 'pdf' }) },
                    { name: 'Event Logs', description: 'Boarding and alighting records', action: () => generateReport({ type: 'transport_events', title: 'Transport Event Logs', data: allRoutes, format: 'csv' }) },
                    { name: 'Driver Reports', description: 'Driver performance and logs', action: () => generateReport({ type: 'driver_reports', title: 'Driver Reports', data: allRoutes, format: 'pdf' }) },
                    { name: 'Vehicle Maintenance', description: 'Maintenance schedules and costs', action: () => generateReport({ type: 'vehicle_maintenance', title: 'Vehicle Maintenance', data: allRoutes, format: 'xlsx' }) }
                  ].map((report, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{report.name}</p>
                        <p className="text-sm text-gray-600">{report.description}</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={report.action}>
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
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button className="w-full" onClick={() => generateReport({ type: 'transport_summary', title: 'Transport Summary', data: allRoutes, format: 'pdf' })}>
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Transport Summary
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => generateReport({ type: 'student_transport_list', title: 'Student Transport List', data: mockLearners, format: 'xlsx' })}>
                    <Users className="h-4 w-4 mr-2" />
                    Export Student Lists
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => setShowReportExporter(true)}>
                    <Download className="h-4 w-4 mr-2" />
                    Advanced Export
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Route Form Dialog */}
      <Dialog open={showRouteForm} onOpenChange={setShowRouteForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedRoute ? 'Edit Route' : 'Add New Route'}</DialogTitle>
          </DialogHeader>
          <RouteForm />
        </DialogContent>
      </Dialog>

      {/* Live Tracking Dialog */}
      <Dialog open={showLiveTracking} onOpenChange={setShowLiveTracking}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Live Vehicle Tracking</DialogTitle>
          </DialogHeader>
          {routeForTracking && <LiveTrackingInterface route={routeForTracking} />}
        </DialogContent>
      </Dialog>

      {/* Safety Alert Dialog */}
      <Dialog open={showSafetyAlert} onOpenChange={setShowSafetyAlert}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Safety Alert</DialogTitle>
          </DialogHeader>
          <SafetyAlertForm />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Route</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Are you sure you want to delete <strong>{routeToDelete?.name}</strong>?</p>
            <p className="text-sm text-gray-600">This action cannot be undone.</p>
            <div className="flex space-x-2">
              <Button variant="destructive" onClick={confirmDelete}>
                Delete Route
              </Button>
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Report Exporter Dialog */}
      <Dialog open={showReportExporter} onOpenChange={setShowReportExporter}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Transport Reports</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <p>Advanced report exporter would be displayed here</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
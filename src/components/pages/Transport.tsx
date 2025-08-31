import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockTransportRoutes, mockLearners } from '@/data/mock-data';
import { useTransport } from '@/store';
import { formatDate } from '@/lib/utils';
import { ReportExporter } from '@/components/features/ReportExporter';
import { 
  Bus, 
  MapPin, 
  Users, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  Navigation,
  Plus,
  Eye,
  Route,
  Smartphone,
  QrCode,
  Edit,
  Trash2,
  Save,
  X,
  Download,
  FileText
} from 'lucide-react';

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
      <Card>
        <CardHeader>
          <CardTitle>Vehicle Status - {route.name}</CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
    </div>
  );
};

const SafetyAlertForm = ({ alertData, onClose }: { alertData: any; onClose: () => void }) => {
  const [formData, setFormData] = useState({
    type: 'emergency',
    priority: 'high',
    message: '',
    location: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Safety alert sent to all recipients');
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="description">Alert Description *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Describe the emergency situation..."
          required
        />
      </div>
      <div className="flex space-x-2">
        <Button type="submit" variant="destructive">
          <AlertTriangle className="h-4 w-4 mr-2" />
          Send Alert
        </Button>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export function Transport() {
  const [activeTab, setActiveTab] = useState('routes');
  const [showRouteForm, setShowRouteForm] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<any>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [routeToDelete, setRouteToDelete] = useState<any>(null);
  const [showReportExporter, setShowReportExporter] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [showLiveTracking, setShowLiveTracking] = useState(false);
  const [showSafetyAlert, setShowSafetyAlert] = useState(false);
  const [alertData, setAlertData] = useState<any>(null);
  
  const { routes, addRoute, updateRoute, deleteRoute } = useTransport();
  const { generateReport } = useReports();
  
  // Use mock data initially, but allow for real CRUD operations
  const allRoutes = routes.length > 0 ? routes : mockTransportRoutes;

  const totalRoutes = allRoutes.length;
  const activeRoutes = allRoutes.filter(r => r.active).length;
  const totalStops = allRoutes.reduce((sum, route) => sum + route.stops.length, 0);
  const studentsOnTransport = Math.floor(mockLearners.length * 0.65); // 65% use transport

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

  const handleAddEvent = () => {
    setSelectedEvent(null);
    setShowEventForm(true);
  };

  const handleEditEvent = (event: any) => {
    setSelectedEvent(event);
    setShowEventForm(true);
  };

  const handleSaveEvent = (eventData: any) => {
    // Implementation for saving transport events
  };

  const handleTrackRoute = (route: any) => {
    setSelectedRoute(route);
    setShowLiveTracking(true);
  };

  const handleCreateSafetyAlert = (route: any) => {
    setAlertData({ route, type: 'emergency', message: '' });
    setShowSafetyAlert(true);
  };

  const handleExportRouteData = (route: any) => {
    generateReport({
      type: 'transport_route_manifest',
      title: `${route.name} - Route Manifest`,
      data: route,
      format: 'pdf'
    });
  };

  const handleGenerateTransportReport = () => {
    generateReport({
      type: 'transport_safety_report',
      title: 'Transport Safety Report',
      data: allRoutes,
      format: 'xlsx'
    });
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

    const addStop = () => {
      const newStop = {
        id: Date.now().toString(),
        route_id: selectedRoute?.id || '',
        order: formData.stops.length + 1,
        name: '',
        pickup_time: '07:00',
        dropoff_time: '15:30'
      };
      setFormData(prev => ({ ...prev, stops: [...prev.stops, newStop] }));
    };

    const removeStop = (index: number) => {
      setFormData(prev => ({
        ...prev,
        stops: prev.stops.filter((_: any, i: number) => i !== index)
      }));
    };

    const updateStop = (index: number, field: string, value: any) => {
      setFormData(prev => ({
        ...prev,
        stops: prev.stops.map((stop: any, i: number) =>
          i === index ? { ...stop, [field]: value } : stop
        )
      }));
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
            <Select value={formData.vehicle_id} onValueChange={(value) => setFormData(prev => ({ ...prev, vehicle_id: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select vehicle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vehicle-1">KCA 123X</SelectItem>
                <SelectItem value="vehicle-2">KCB 456Y</SelectItem>
                <SelectItem value="vehicle-3">KCC 789Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="driver_id">Driver *</Label>
            <Select value={formData.driver_id} onValueChange={(value) => setFormData(prev => ({ ...prev, driver_id: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select driver" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="driver-1">John Maina</SelectItem>
                <SelectItem value="driver-2">Peter Kiprotich</SelectItem>
                <SelectItem value="driver-3">Mary Wanjiku</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="matron_id">Matron (Optional)</Label>
            <Select value={formData.matron_id} onValueChange={(value) => setFormData(prev => ({ ...prev, matron_id: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select matron" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="matron-1">Sarah Njeri</SelectItem>
                <SelectItem value="matron-2">Grace Wanjiku</SelectItem>
              </SelectContent>
            </Select>
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

        <div>
          <div className="flex items-center justify-between mb-4">
            <Label>Route Stops</Label>
            <Button type="button" onClick={addStop} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Stop
            </Button>
          </div>
          
          <div className="space-y-4">
            {formData.stops.map((stop: any, index: number) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Stop {index + 1}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeStop(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label>Stop Name</Label>
                    <Input
                      value={stop.name}
                      onChange={(e) => updateStop(index, 'name', e.target.value)}
                      placeholder="Stop name"
                    />
                  </div>
                  <div>
                    <Label>Pickup Time</Label>
                    <Input
                      type="time"
                      value={stop.pickup_time}
                      onChange={(e) => updateStop(index, 'pickup_time', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Dropoff Time</Label>
                    <Input
                      type="time"
                      value={stop.dropoff_time}
                      onChange={(e) => updateStop(index, 'dropoff_time', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
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
  const RouteCard = ({ route }: { route: any }) => {
    const studentsCount = Math.floor(Math.random() * 30) + 15; // Mock student count
    const onTimePercentage = Math.floor(Math.random() * 10) + 90; // Mock on-time performance

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <Bus className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">{route.name}</h3>
                <Badge variant={route.active ? "default" : "secondary"}>
                  {route.active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Students</p>
                  <p className="font-semibold text-gray-900">{studentsCount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Stops</p>
                  <p className="font-semibold text-gray-900">{route.stops.length}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">On-Time Rate</p>
                  <p className="font-semibold text-green-600">{onTimePercentage}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Driver</p>
                  <p className="font-semibold text-gray-900">John Maina</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm text-gray-600">Stops:</div>
                {route.stops.slice(0, 2).map((stop: any) => (
                  <div key={stop.id} className="flex items-center space-x-2 text-sm">
                    <MapPin className="h-3 w-3 text-gray-400" />
                    <span>{stop.name}</span>
                    <span className="text-gray-500">({stop.pickup_time})</span>
                  </div>
                ))}
                {route.stops.length > 2 && (
                  <div className="text-sm text-gray-500">+{route.stops.length - 2} more stops</div>
                )}
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-1" />
                View Route
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleTrackRoute(route)}>
                <Navigation className="h-4 w-4 mr-1" />
                Track Live
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleEditRoute(route)}>
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleDeleteRoute(route)}>
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleExportRouteData(route)}>
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleCreateSafetyAlert(route)}>
                <AlertTriangle className="h-4 w-4 mr-1" />
                Alert
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>Vehicle: {route.vehicle_id}</span>
              {route.matron_id && <span>• Matron: Mary Njeri</span>}
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-green-600">Active</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const TransportEvent = ({ event }: { event: any }) => {
    const student = mockLearners.find(s => s.id === event.learner_id);
    const eventConfig = {
      board: { color: 'text-green-600', bg: 'bg-green-50', text: 'Boarded' },
      alight: { color: 'text-blue-600', bg: 'bg-blue-50', text: 'Alighted' }
    };
    
    const config = eventConfig[event.type as keyof typeof eventConfig];

    return (
      <div className="flex items-center justify-between p-3 border rounded-lg">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-full ${config.bg}`}>
            <Bus className={`h-4 w-4 ${config.color}`} />
          </div>
          <div>
            <p className="font-medium text-gray-900">{student?.name}</p>
            <p className="text-sm text-gray-600">
              {config.text} at Karagita Shopping Center
            </p>
          </div>
        </div>
        <div className="text-right">
          <Badge variant="outline" className="mb-1">{event.method.toUpperCase()}</Badge>
          <p className="text-xs text-gray-500">{new Date(event.recorded_at).toLocaleTimeString()}</p>
        </div>
      </div>
    );
  };

  // Mock transport events
  const mockEvents = [
    {
      id: 'event-1',
      learner_id: 'learner-1',
      route_id: 'route-1',
      stop_id: 'stop-1',
      type: 'board',
      method: 'qr',
      recorded_at: new Date().toISOString()
    },
    {
      id: 'event-2',
      learner_id: 'learner-2',
      route_id: 'route-1',
      stop_id: 'stop-2',
      type: 'board',
      method: 'nfc',
      recorded_at: new Date().toISOString()
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transport</h1>
          <p className="text-gray-600 mt-1">Manage school transport routes and student safety</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="secondary" className="bg-blue-50 text-blue-700">
            {studentsOnTransport} Students on Transport
          </Badge>
          <Button onClick={handleAddRoute}>
            <Plus className="h-4 w-4 mr-2" />
            Add Route
          </Button>
          <Button variant="outline" onClick={handleGenerateTransportReport}>
            <FileText className="h-4 w-4 mr-2" />
            Safety Report
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Transport Reports
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Transport Reports</DialogTitle>
              </DialogHeader>
              <ReportExporter 
                data={allRoutes} 
                title="Transport Reports" 
                type="transport"
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Transport Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Routes</p>
                <p className="text-2xl font-bold text-blue-600">{totalRoutes}</p>
              </div>
              <Route className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Routes</p>
                <p className="text-2xl font-bold text-green-600">{activeRoutes}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Stops</p>
                <p className="text-2xl font-bold text-orange-600">{totalStops}</p>
              </div>
              <MapPin className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Students</p>
                <p className="text-2xl font-bold text-purple-600">{studentsOnTransport}</p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="routes">Routes ({totalRoutes})</TabsTrigger>
          <TabsTrigger value="tracking">Live Tracking</TabsTrigger>
          <TabsTrigger value="events">Transport Events</TabsTrigger>
          <TabsTrigger value="safety">Safety & Alerts</TabsTrigger>

          <div className="flex space-x-2 ml-auto">
            <Button onClick={() => setShowReportExporter(true)} variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              All Reports
            </Button>
          </div>
        </TabsList>

        <TabsContent value="routes" className="space-y-4">
          {allRoutes.map((route) => (
            <RouteCard key={route.id} route={route} />
          ))}
          
          <Card className="border-dashed">
            <CardContent className="text-center py-12">
              <Bus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Add New Transport Route</h3>
              <p className="text-gray-600 mb-4">
                Create optimized routes with stops and schedules
              </p>
              <Button onClick={handleAddRoute}>
                <Plus className="h-4 w-4 mr-2" />
                Create Route
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tracking" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Navigation className="h-5 w-5 text-blue-600" />
                    <span>Live Route Map</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <MapPin className="h-12 w-12 mx-auto mb-4" />
                      <p>Interactive map would be displayed here</p>
                      <p className="text-sm">Showing real-time vehicle locations</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Active Vehicles</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {['KCA 123X', 'KCB 456Y', 'KCC 789Z'].map((vehicle, index) => (
                      <div key={vehicle} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{vehicle}</p>
                          <p className="text-sm text-gray-600">Route {index + 1}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-sm text-green-600">Online</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Route Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockTransportRoutes.map((route) => {
                      const status = Math.random() > 0.3 ? 'on-time' : 'delayed';
                      return (
                        <div key={route.id} className="flex items-center justify-between">
                          <span className="text-sm font-medium">{route.name}</span>
                          <Badge variant={status === 'on-time' ? 'default' : 'destructive'}>
                            {status === 'on-time' ? 'On Time' : '5 min late'}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Recent Transport Events</h3>
            <div className="flex items-center space-x-2">
              <Badge variant="outline">Today: 245 Events</Badge>
              <Button variant="outline" size="sm">
                <QrCode className="h-4 w-4 mr-2" />
                QR Scanner
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Boarding Events</CardTitle>
              </CardHeader>
              <div className="flex space-x-2 mb-4">
                <Button onClick={handleAddEvent} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Log Event
                </Button>
              </div>
              <CardContent>
                <div className="space-y-3">
                  {mockEvents.filter(e => e.type === 'board').map((event) => (
                    <TransportEvent key={event.id} event={event} />
                  ))}
                </div>
              </CardContent>
              <div className="p-4 border-t">
                <Button variant="outline" className="w-full">
                  <Eye className="h-4 w-4 mr-2" />
                  View All Events
                </Button>
              </div>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Event Methods</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <QrCode className="h-5 w-5 text-blue-600" />
                      <span>QR Code Scan</span>
                    </div>
                    <Badge variant="default">65%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Smartphone className="h-5 w-5 text-green-600" />
                      <span>NFC Tap</span>
                    </div>
                    <Badge variant="secondary">25%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="h-5 w-5 text-gray-600" />
                      <span>Manual Entry</span>
                    </div>
                    <Badge variant="secondary">10%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="safety" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  <span>Safety Alerts</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-orange-50 border-l-4 border-l-orange-500 rounded">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-orange-800">Student Not on Expected Bus</p>
                        <p className="text-sm text-orange-600">Grace Wanjiku - Route 1</p>
                      </div>
                      <Badge variant="destructive">High</Badge>
                    </div>
                  </div>

                  <div className="p-3 bg-yellow-50 border-l-4 border-l-yellow-500 rounded">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-yellow-800">Route Running Late</p>
                        <p className="text-sm text-yellow-600">Town Route - 10 minutes behind</p>
                      </div>
                      <Badge variant="secondary">Medium</Badge>
                    </div>
                  </div>

                  <div className="p-3 bg-red-50 border-l-4 border-l-red-500 rounded">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-red-800">Student Still on Bus</p>
                        <p className="text-sm text-red-600">Brian Kiprotich - After school hours</p>
                      </div>
                      <Badge variant="destructive">Critical</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Parent Notifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-green-800">Auto-Notifications Enabled</span>
                    </div>
                    <div className="space-y-2 text-sm text-green-700">
                      <p>✓ Student boards bus</p>
                      <p>✓ Student arrives at school</p>
                      <p>✓ Student boards bus for home</p>
                      <p>✓ Student arrives home safely</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Recent Notifications</h4>
                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="text-gray-600">08:15 -</span>
                        <span className="font-medium"> Grace boarded Route 1</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-600">08:30 -</span>
                        <span className="font-medium"> Brian arrived at school</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-600">15:45 -</span>
                        <span className="font-medium"> Amina boarded Route 2</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Emergency Protocols</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                  <p className="font-semibold text-red-800">Emergency Alert</p>
                  <p className="text-sm text-red-600">Instant parent & authority notification</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Navigation className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="font-semibold text-blue-800">GPS Tracking</p>
                  <p className="text-sm text-blue-600">Real-time location monitoring</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="font-semibold text-green-800">Driver Verification</p>
                  <p className="text-sm text-green-600">Authenticated driver check-in</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Route Form Dialog */}
      <Dialog open={showRouteForm} onOpenChange={setShowRouteForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedRoute ? 'Edit Route' : 'Create New Route'}</DialogTitle>
          </DialogHeader>
          <RouteForm />
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

      {/* Event Form Dialog */}
      <Dialog open={showEventForm} onOpenChange={setShowEventForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedEvent ? 'Edit Event' : 'Log Transport Event'}</DialogTitle>
          </DialogHeader>
          <TransportEventForm 
            event={selectedEvent}
            onSave={handleSaveEvent}
            onCancel={() => setShowEventForm(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Report Exporter Dialog */}
      <Dialog open={showReportExporter} onOpenChange={setShowReportExporter}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Transport Reports</DialogTitle>
          </DialogHeader>
          <ReportExporter 
            data={allRoutes} 
            title="Transport Reports" 
            type="transport"
            onClose={() => setShowReportExporter(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Live Tracking Dialog */}
      <Dialog open={showLiveTracking} onOpenChange={setShowLiveTracking}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Live Route Tracking - {selectedRoute?.name}</DialogTitle>
          </DialogHeader>
          {selectedRoute && <LiveTrackingInterface route={selectedRoute} />}
        </DialogContent>
      </Dialog>

      {/* Safety Alert Dialog */}
      <Dialog open={showSafetyAlert} onOpenChange={setShowSafetyAlert}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Safety Alert</DialogTitle>
          </DialogHeader>
          {alertData && <SafetyAlertForm alertData={alertData} onClose={() => setShowSafetyAlert(false)} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}

const TransportEventForm = ({ event, onSave, onCancel }: { event: any; onSave: (data: any) => void; onCancel: () => void }) => {
  const [formData, setFormData] = useState({
    learner_id: event?.learner_id || '',
    route_id: event?.route_id || '',
    stop_id: event?.stop_id || '',
    type: event?.type || 'board',
    method: event?.method || 'manual'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Event Type</Label>
          <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="board">Board Bus</SelectItem>
              <SelectItem value="alight">Alight Bus</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Method</Label>
          <Select value={formData.method} onValueChange={(value) => setFormData(prev => ({ ...prev, method: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="qr">QR Code</SelectItem>
              <SelectItem value="nfc">NFC Tap</SelectItem>
              <SelectItem value="manual">Manual Entry</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex space-x-2">
        <Button type="submit">
          <Save className="h-4 w-4 mr-2" />
          Log Event
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockTransportRoutes, mockLearners } from '@/data/mock-data';
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
  QrCode
} from 'lucide-react';

export function Transport() {
  const [activeTab, setActiveTab] = useState('routes');

  const totalRoutes = mockTransportRoutes.length;
  const activeRoutes = mockTransportRoutes.filter(r => r.active).length;
  const totalStops = mockTransportRoutes.reduce((sum, route) => sum + route.stops.length, 0);
  const studentsOnTransport = Math.floor(mockLearners.length * 0.65); // 65% use transport

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
              <Button variant="outline" size="sm">
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
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Route
          </Button>
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
        </TabsList>

        <TabsContent value="routes" className="space-y-4">
          {mockTransportRoutes.map((route) => (
            <RouteCard key={route.id} route={route} />
          ))}
          
          <Card className="border-dashed">
            <CardContent className="text-center py-12">
              <Bus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Add New Transport Route</h3>
              <p className="text-gray-600 mb-4">
                Create optimized routes with stops and schedules
              </p>
              <Button>
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
              <CardContent>
                <div className="space-y-3">
                  {mockEvents.filter(e => e.type === 'board').map((event) => (
                    <TransportEvent key={event.id} event={event} />
                  ))}
                </div>
              </CardContent>
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
    </div>
  );
}
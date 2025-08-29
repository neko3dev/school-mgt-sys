import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockLearners } from '@/data/mock-data';
import { 
  Navigation, 
  MapPin, 
  Clock, 
  Users, 
  AlertTriangle,
  CheckCircle,
  Smartphone,
  RefreshCw
} from 'lucide-react';

interface LiveTrackingInterfaceProps {
  route: any;
}

export function LiveTrackingInterface({ route }: LiveTrackingInterfaceProps) {
  const [vehicleStatus, setVehicleStatus] = useState({
    location: 'Karagita Shopping Center',
    speed: 35,
    studentsOnBoard: 12,
    nextStop: 'Karagita Primary School',
    eta: '7 minutes',
    status: 'on_route'
  });

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setVehicleStatus(prev => ({
        ...prev,
        speed: Math.floor(Math.random() * 20) + 25,
        eta: `${Math.floor(Math.random() * 10) + 5} minutes`
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const studentsOnRoute = mockLearners.slice(0, vehicleStatus.studentsOnBoard);

  return (
    <div className="space-y-6">
      {/* Vehicle Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <Navigation className="h-5 w-5 text-blue-600" />
              <span>Vehicle Status</span>
            </span>
            <div className="flex items-center space-x-2">
              <Badge variant="default" className="bg-green-500">
                {vehicleStatus.status.replace('_', ' ').toUpperCase()}
              </Badge>
              <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </CardTitle>
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

      {/* Route Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Route Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {route?.stops?.map((stop: any, index: number) => {
              const isCompleted = index < 1;
              const isCurrent = index === 1;
              
              return (
                <div key={stop.id} className="flex items-center space-x-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isCompleted ? 'bg-green-500' : isCurrent ? 'bg-blue-500' : 'bg-gray-300'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="h-4 w-4 text-white" />
                    ) : (
                      <span className="text-white text-sm">{index + 1}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{stop.name}</p>
                    <p className="text-sm text-gray-600">
                      {isCurrent ? 'Next Stop' : isCompleted ? 'Completed' : 'Upcoming'} • {stop.pickup_time}
                    </p>
                  </div>
                  {isCurrent && (
                    <Badge variant="default">Current</Badge>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Students on Board */}
      <Card>
        <CardHeader>
          <CardTitle>Students on Board</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {studentsOnRoute.map((student) => (
              <div key={student.id} className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <div>
                  <p className="font-medium text-green-800">{student.name}</p>
                  <p className="text-xs text-green-600">{student.admission_no}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Emergency Actions */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-800">Emergency Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="destructive" className="w-full">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Emergency Alert
            </Button>
            <Button variant="outline" className="w-full">
              <Smartphone className="h-4 w-4 mr-2" />
              Contact Driver
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
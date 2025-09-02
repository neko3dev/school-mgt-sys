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
import { formatDate, formatCurrency, generateId } from '@/lib/utils';
import { useEvents, useReports } from '@/store';
import { 
  CalendarDays, 
  Clock, 
  MapPin, 
  Users,
  Plus, 
  Eye, 
  Edit,
  Download,
  Search,
  Filter,
  Save,
  X,
  Trash2,
  FileText,
  Bell,
  Calendar,
  Star,
  Award,
  Music,
  Trophy,
  Palette,
  DollarSign
} from 'lucide-react';

export function Events() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [searchTerm, setSearchTerm] = useState('');
  const [showEventForm, setShowEventForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<any>(null);
  const [showEventDetails, setShowEventDetails] = useState(false);

  const { events, addEvent, updateEvent, deleteEvent } = useEvents();
  const { generateReport } = useReports();

  const mockEvents = [
    {
      id: generateId(),
      title: 'Science Fair 2024',
      description: 'Annual science exhibition showcasing student projects',
      type: 'academic',
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      start_time: '09:00',
      end_time: '15:00',
      location: 'School Hall',
      organizer: 'Science Department',
      participants: ['Grade 4', 'Grade 5', 'Grade 6'],
      status: 'planned',
      budget: 25000,
      attendees_expected: 200,
      created_by: 'admin-1',
      created_at: new Date().toISOString()
    },
    {
      id: generateId(),
      title: 'Parent-Teacher Conference',
      description: 'Term 1 progress discussion with parents',
      type: 'meeting',
      date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      start_time: '14:00',
      end_time: '17:00',
      location: 'Various Classrooms',
      organizer: 'Academic Office',
      participants: ['All Parents', 'All Teachers'],
      status: 'confirmed',
      attendees_expected: 180,
      created_by: 'admin-1',
      created_at: new Date().toISOString()
    },
    {
      id: generateId(),
      title: 'Sports Day',
      description: 'Inter-house sports competition',
      type: 'sports',
      date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
      start_time: '08:00',
      end_time: '16:00',
      location: 'School Field',
      organizer: 'Sports Department',
      participants: ['All Students'],
      status: 'planned',
      budget: 15000,
      attendees_expected: 300,
      created_by: 'admin-1',
      created_at: new Date().toISOString()
    }
  ];

  const allEvents = events.length > 0 ? events : mockEvents;

  const filteredEvents = allEvents.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const upcomingEvents = filteredEvents.filter(e => new Date(e.date) > new Date());
  const pastEvents = filteredEvents.filter(e => new Date(e.date) <= new Date());

  const handleAddEvent = () => {
    setSelectedEvent(null);
    setShowEventForm(true);
  };

  const handleEditEvent = (event: any) => {
    setSelectedEvent(event);
    setShowEventForm(true);
  };

  const handleSaveEvent = (eventData: any) => {
    if (selectedEvent) {
      updateEvent(selectedEvent.id, eventData);
    } else {
      addEvent(eventData);
    }
    setShowEventForm(false);
  };

  const handleDeleteEvent = (event: any) => {
    setEventToDelete(event);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (eventToDelete) {
      deleteEvent(eventToDelete.id);
      setShowDeleteDialog(false);
      setEventToDelete(null);
    }
  };

  const handleViewEvent = (event: any) => {
    setSelectedEvent(event);
    setShowEventDetails(true);
  };

  const handleExportEvent = (event: any) => {
    generateReport({
      type: 'event_details',
      title: `${event.title} - Event Details`,
      data: event,
      format: 'pdf'
    });
  };

  const handleGenerateEventsCalendar = () => {
    generateReport({
      type: 'events_calendar',
      title: 'School Events Calendar',
      data: allEvents,
      format: 'pdf'
    });
  };

  const EventCard = ({ event }: { event: any }) => {
    const eventTypeConfig = {
      academic: { color: 'text-blue-600', bg: 'bg-blue-50', icon: Award },
      sports: { color: 'text-green-600', bg: 'bg-green-50', icon: Trophy },
      cultural: { color: 'text-purple-600', bg: 'bg-purple-50', icon: Palette },
      meeting: { color: 'text-orange-600', bg: 'bg-orange-50', icon: Users },
      social: { color: 'text-pink-600', bg: 'bg-pink-50', icon: Music }
    };

    const config = eventTypeConfig[event.type as keyof typeof eventTypeConfig] || eventTypeConfig.academic;
    const Icon = config.icon;

    return (
      <Card className="hover:shadow-md transition-all duration-200 dark-transition">
        <CardContent className="p-4 lg:p-6">
          <div className="flex flex-col lg:flex-row items-start justify-between space-y-4 lg:space-y-0">
            <div className="flex-1 w-full lg:w-auto">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <div className={`p-1 rounded-full ${config.bg} dark:bg-opacity-20`}>
                  <Icon className={`h-4 w-4 ${config.color}`} />
                </div>
                <h3 className="font-semibold text-foreground">{event.title}</h3>
                <Badge variant="outline" className="capitalize">{event.type}</Badge>
                <Badge variant={event.status === 'confirmed' ? 'default' : 'secondary'}>
                  {event.status}
                </Badge>
              </div>
              
              <p className="text-sm text-muted-foreground mb-3">{event.description}</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 lg:gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{formatDate(event.date)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{event.start_time} - {event.end_time}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{event.attendees_expected} expected</span>
                </div>
              </div>
            </div>

            <div className="flex flex-row lg:flex-col gap-2 w-full lg:w-auto">
              <Button variant="outline" size="sm" onClick={() => handleViewEvent(event)} className="flex-1 lg:flex-none">
                <Eye className="h-4 w-4 mr-1" />
                <span className="lg:hidden">View</span>
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleEditEvent(event)} className="flex-1 lg:flex-none">
                <Edit className="h-4 w-4 mr-1" />
                <span className="lg:hidden">Edit</span>
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleExportEvent(event)} className="flex-1 lg:flex-none">
                <Download className="h-4 w-4 mr-1" />
                <span className="lg:hidden">Export</span>
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleDeleteEvent(event)} className="flex-1 lg:flex-none">
                <Trash2 className="h-4 w-4 mr-1" />
                <span className="lg:hidden">Delete</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const EventForm = () => {
    const [formData, setFormData] = useState({
      title: selectedEvent?.title || '',
      description: selectedEvent?.description || '',
      type: selectedEvent?.type || 'academic',
      date: selectedEvent?.date?.split('T')[0] || '',
      start_time: selectedEvent?.start_time || '09:00',
      end_time: selectedEvent?.end_time || '15:00',
      location: selectedEvent?.location || '',
      organizer: selectedEvent?.organizer || '',
      budget: selectedEvent?.budget || 0,
      attendees_expected: selectedEvent?.attendees_expected || 0,
      status: selectedEvent?.status || 'planned'
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      handleSaveEvent(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="title">Event Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>
          <div>
            <Label>Event Type *</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="academic">Academic</SelectItem>
                <SelectItem value="sports">Sports</SelectItem>
                <SelectItem value="cultural">Cultural</SelectItem>
                <SelectItem value="meeting">Meeting</SelectItem>
                <SelectItem value="social">Social</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Event description..."
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="date">Date *</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              required
            />
          </div>
          <div>
            <Label htmlFor="start_time">Start Time *</Label>
            <Input
              id="start_time"
              type="time"
              value={formData.start_time}
              onChange={(e) => setFormData(prev => ({ ...prev, start_time: e.target.value }))}
              required
            />
          </div>
          <div>
            <Label htmlFor="end_time">End Time *</Label>
            <Input
              id="end_time"
              type="time"
              value={formData.end_time}
              onChange={(e) => setFormData(prev => ({ ...prev, end_time: e.target.value }))}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              required
            />
          </div>
          <div>
            <Label htmlFor="organizer">Organizer</Label>
            <Input
              id="organizer"
              value={formData.organizer}
              onChange={(e) => setFormData(prev => ({ ...prev, organizer: e.target.value }))}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="budget">Budget (KES)</Label>
            <Input
              id="budget"
              type="number"
              value={formData.budget}
              onChange={(e) => setFormData(prev => ({ ...prev, budget: parseInt(e.target.value) || 0 }))}
            />
          </div>
          <div>
            <Label htmlFor="attendees_expected">Expected Attendees</Label>
            <Input
              id="attendees_expected"
              type="number"
              value={formData.attendees_expected}
              onChange={(e) => setFormData(prev => ({ ...prev, attendees_expected: parseInt(e.target.value) || 0 }))}
            />
          </div>
          <div>
            <Label>Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="planned">Planned</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Button type="submit" className="flex-1">
            <Save className="h-4 w-4 mr-2" />
            {selectedEvent ? 'Update Event' : 'Create Event'}
          </Button>
          <Button type="button" variant="outline" onClick={() => setShowEventForm(false)} className="flex-1 sm:flex-none">
            Cancel
          </Button>
        </div>
      </form>
    );
  };

  const EventDetailsView = ({ event }: { event: any }) => {
    if (!event) return null;

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label>Event Title</Label>
              <p className="font-medium">{event.title}</p>
            </div>
            <div>
              <Label>Type</Label>
              <Badge variant="outline" className="capitalize">{event.type}</Badge>
            </div>
            <div>
              <Label>Date & Time</Label>
              <p className="font-medium">{formatDate(event.date)} • {event.start_time} - {event.end_time}</p>
            </div>
            <div>
              <Label>Location</Label>
              <p className="font-medium">{event.location}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <Label>Organizer</Label>
              <p className="font-medium">{event.organizer}</p>
            </div>
            <div>
              <Label>Status</Label>
              <Badge variant={event.status === 'confirmed' ? 'default' : 'secondary'}>
                {event.status}
              </Badge>
            </div>
            <div>
              <Label>Expected Attendees</Label>
              <p className="font-medium">{event.attendees_expected}</p>
            </div>
            <div>
              <Label>Budget</Label>
              <p className="font-medium">{formatCurrency(event.budget || 0)}</p>
            </div>
          </div>
        </div>

        <div>
          <Label>Description</Label>
          <p className="text-muted-foreground">{event.description}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Button className="flex-1" onClick={() => handleEditEvent(event)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Event
          </Button>
          <Button variant="outline" className="flex-1" onClick={() => handleExportEvent(event)}>
            <Download className="h-4 w-4 mr-2" />
            Export Details
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Events Management</h1>
          <p className="text-muted-foreground mt-1">Organize and manage school events and activities</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="secondary" className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
            {upcomingEvents.length} Upcoming
          </Badge>
          <Button onClick={handleAddEvent}>
            <Plus className="h-4 w-4 mr-2" />
            Add Event
          </Button>
          <Button variant="outline" onClick={handleGenerateEventsCalendar}>
            <FileText className="h-4 w-4 mr-2" />
            Calendar
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="dark-transition">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Upcoming Events</p>
                <p className="text-2xl font-bold text-blue-600">{upcomingEvents.length}</p>
              </div>
              <CalendarDays className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="dark-transition">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold text-green-600">
                  {allEvents.filter(e => new Date(e.date).getMonth() === new Date().getMonth()).length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="dark-transition">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Budget</p>
                <p className="text-2xl font-bold text-purple-600">
                  {formatCurrency(allEvents.reduce((sum, e) => sum + (e.budget || 0), 0))}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="dark-transition">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Expected Attendees</p>
                <p className="text-2xl font-bold text-orange-600">
                  {allEvents.reduce((sum, e) => sum + (e.attendees_expected || 0), 0)}
                </p>
              </div>
              <Users className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upcoming">Upcoming ({upcomingEvents.length})</TabsTrigger>
          <TabsTrigger value="past">Past Events ({pastEvents.length})</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search events..."
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

          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {pastEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </TabsContent>

        <TabsContent value="calendar" className="space-y-6">
          <Card className="dark-transition">
            <CardHeader>
              <CardTitle>Events Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted rounded-lg h-96 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <CalendarDays className="h-12 w-12 mx-auto mb-4" />
                  <p>Interactive calendar would be displayed here</p>
                  <p className="text-sm">Showing all school events and activities</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Event Form Dialog */}
      <Dialog open={showEventForm} onOpenChange={setShowEventForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedEvent ? 'Edit Event' : 'Create New Event'}</DialogTitle>
          </DialogHeader>
          <EventForm />
        </DialogContent>
      </Dialog>

      {/* Event Details Dialog */}
      <Dialog open={showEventDetails} onOpenChange={setShowEventDetails}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Event Details</DialogTitle>
          </DialogHeader>
          <EventDetailsView event={selectedEvent} />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Event</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Are you sure you want to delete <strong>{eventToDelete?.title}</strong>?</p>
            <p className="text-sm text-muted-foreground">This action cannot be undone.</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button variant="destructive" onClick={confirmDelete} className="flex-1">
                Delete Event
              </Button>
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
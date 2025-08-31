import React from 'react';
import { useAuth, useUI } from '@/store';
import { cn } from '@/lib/utils';
import {
  Home,
  Users,
  BookOpen,
  CreditCard,
  Calendar,
  Bus,
  FileText,
  Shield,
  Settings,
  ChevronLeft,
  GraduationCap,
  Clock,
  Heart,
  MessageSquare,
  BarChart3,
  BookOpen as LibraryIcon,
  Package,
  CalendarDays,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const { user, tenant } = useAuth();
  const { sidebarCollapsed, toggleSidebar } = useUI();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: Home, badge: null },
    { id: 'students', label: 'Students', icon: Users, badge: '245' },
    { id: 'assessment', label: 'CBC Assessment', icon: BookOpen, badge: '12' },
    { id: 'finance', label: 'Finance', icon: CreditCard, badge: 'KES 2.4M' },
    { id: 'attendance', label: 'Attendance', icon: Calendar, badge: '98.5%' },
    { id: 'transport', label: 'Transport', icon: Bus, badge: '4 Routes' },
    { id: 'timetable', label: 'Timetable', icon: Clock, badge: '125 Lessons' },
    { id: 'staff', label: 'Staff & TPAD', icon: GraduationCap, badge: '25' },
    { id: 'welfare', label: 'Welfare & SNE', icon: Heart, badge: '2' },
    { id: 'communications', label: 'Communications', icon: MessageSquare, badge: '156' },
    { id: 'events', label: 'Events', icon: CalendarDays, badge: '8' },
    { id: 'reports', label: 'Reports', icon: FileText, badge: null },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, badge: null },
    { id: 'library', label: 'Library', icon: LibraryIcon, badge: '245' },
    { id: 'inventory', label: 'Inventory', icon: Package, badge: '89' },
    { id: 'privacy', label: 'DPO Console', icon: Shield, badge: '3' },
    { id: 'settings', label: 'Settings', icon: Settings, badge: null },
  ];

  const roleVisibleItems = menuItems.filter(item => {
    if (user?.role === 'parent') {
      return ['overview', 'students', 'finance', 'attendance', 'transport', 'events', 'reports'].includes(item.id);
    }
    if (user?.role === 'teacher' || user?.role === 'class_teacher') {
      return !['finance', 'privacy', 'settings', 'staff'].includes(item.id);
    }
    return true; // Admin sees everything
  });

  const handleNavigate = (page: string) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="bg-white shadow-md"
        >
          {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed left-0 top-0 h-full bg-white border-r border-gray-200 transition-all duration-300 z-50",
        "lg:z-30", // Lower z-index on desktop
        // Desktop behavior
        "hidden lg:block",
        sidebarCollapsed ? "lg:w-16" : "lg:w-64",
        // Mobile behavior
        mobileMenuOpen ? "block w-64" : "hidden lg:block"
      )}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {!sidebarCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-600 rounded-lg">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg font-semibold text-gray-900 truncate">CBC Manager</h1>
                <p className="text-xs text-gray-500 truncate">{tenant?.name || 'School'}</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="text-gray-500 hover:text-gray-900 hidden lg:flex"
          >
            <ChevronLeft className={cn("h-4 w-4 transition-transform", sidebarCollapsed && "rotate-180")} />
          </Button>
        </div>

        <nav className="p-2 lg:p-4 space-y-1 lg:space-y-2 overflow-y-auto h-[calc(100vh-200px)]">
          {roleVisibleItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={cn(
                  "w-full flex items-center space-x-3 px-2 lg:px-3 py-2 lg:py-2 rounded-lg text-left transition-colors",
                  "text-sm lg:text-base",
                  isActive
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <Icon className="h-4 w-4 lg:h-5 lg:w-5 flex-shrink-0" />
                {(!sidebarCollapsed || mobileMenuOpen) && (
                  <>
                    <span className="flex-1 font-medium truncate">{item.label}</span>
                    {item.badge && (
                      <Badge variant={isActive ? "default" : "secondary"} className="text-xs flex-shrink-0">
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </nav>

        {(!sidebarCollapsed || mobileMenuOpen) && (
          <div className="absolute bottom-4 left-2 lg:left-4 right-2 lg:right-4">
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-3 lg:p-4 rounded-lg">
              <div className="flex items-center space-x-2 lg:space-x-3">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-semibold text-xs lg:text-sm">
                    {user?.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs lg:text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                  <p className="text-xs text-gray-500 capitalize truncate">{user?.role.replace('_', ' ')}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
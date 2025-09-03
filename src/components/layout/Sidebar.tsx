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
  const { sidebarCollapsed, toggleSidebar, theme } = useUI();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  // Listen for navigation events from search
  React.useEffect(() => {
    const handleNavigate = (event: any) => {
      onNavigate(event.detail);
      setMobileMenuOpen(false);
    };

    window.addEventListener('navigate', handleNavigate);
    return () => window.removeEventListener('navigate', handleNavigate);
  }, [onNavigate]);

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
    { id: 'library', label: 'Library', icon: LibraryIcon, badge: '245' },
    { id: 'inventory', label: 'Inventory', icon: Package, badge: '89' },
    { id: 'reports', label: 'Reports', icon: FileText, badge: null },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, badge: null },
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
          className="bg-background shadow-md border-border"
        >
          {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed left-0 top-0 h-full bg-background border-r border-border transition-all duration-300 z-50 dark-transition flex flex-col",
        "lg:z-30",
        // Desktop behavior
        "hidden lg:flex",
        sidebarCollapsed ? "lg:w-16" : "lg:w-64",
        // Mobile behavior
        mobileMenuOpen ? "flex w-64 shadow-xl" : "hidden lg:flex"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
          {(!sidebarCollapsed || mobileMenuOpen) && (
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-primary rounded-lg">
                <GraduationCap className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg font-semibold text-foreground truncate">CBC Manager</h1>
                <p className="text-xs text-muted-foreground truncate max-w-32 lg:max-w-none">
                  {tenant?.name || 'School Name'}
                </p>
              </div>
            </div>
          )}
          {sidebarCollapsed && !mobileMenuOpen && (
            <div className="p-2 bg-primary rounded-lg mx-auto">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="text-muted-foreground hover:text-foreground hidden lg:flex"
          >
            <ChevronLeft className={cn("h-4 w-4 transition-transform", sidebarCollapsed && "rotate-180")} />
          </Button>
        </div>

        {/* Navigation - Scrollable */}
        <nav className="flex-1 p-2 lg:p-4 space-y-1 lg:space-y-2 overflow-y-auto scrollbar-hide">
          {roleVisibleItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={cn(
                  "w-full flex items-center space-x-3 px-2 lg:px-3 py-2 lg:py-3 rounded-lg text-left transition-all duration-200 dark-transition",
                  "text-sm lg:text-base",
                  "hover:scale-[1.02] active:scale-[0.98]",
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/20 shadow-sm"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Icon className="h-4 w-4 lg:h-5 lg:w-5 flex-shrink-0" />
                {(!sidebarCollapsed || mobileMenuOpen) && (
                  <>
                    <span className="flex-1 font-medium truncate">{item.label}</span>
                    {item.badge && (
                      <Badge 
                        variant={isActive ? "default" : "secondary"} 
                        className="text-xs flex-shrink-0 ml-auto"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Profile - Fixed at bottom */}
        {(!sidebarCollapsed || mobileMenuOpen) && (
          <div className="p-2 lg:p-4 border-t border-border flex-shrink-0">
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-3 lg:p-4 rounded-lg border border-border">
              <div className="flex items-center space-x-2 lg:space-x-3">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-primary-foreground font-semibold text-xs lg:text-sm">
                    {user?.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs lg:text-sm font-medium text-foreground truncate">{user?.name}</p>
                  <p className="text-xs text-muted-foreground capitalize truncate">{user?.role.replace('_', ' ')}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
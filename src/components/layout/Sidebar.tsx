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
  GraduationCap
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

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: Home, badge: null },
    { id: 'students', label: 'Students', icon: Users, badge: '245' },
    { id: 'assessment', label: 'CBC Assessment', icon: BookOpen, badge: '12' },
    { id: 'finance', label: 'Finance', icon: CreditCard, badge: 'KES 2.4M' },
    { id: 'attendance', label: 'Attendance', icon: Calendar, badge: '98.5%' },
    { id: 'transport', label: 'Transport', icon: Bus, badge: '4 Routes' },
    { id: 'reports', label: 'Reports', icon: FileText, badge: null },
    { id: 'privacy', label: 'DPO Console', icon: Shield, badge: '3' },
    { id: 'settings', label: 'Settings', icon: Settings, badge: null },
  ];

  const roleVisibleItems = menuItems.filter(item => {
    if (user?.role === 'parent') {
      return ['overview', 'students', 'finance', 'attendance', 'transport', 'reports'].includes(item.id);
    }
    if (user?.role === 'teacher' || user?.role === 'class_teacher') {
      return !['finance', 'privacy', 'settings'].includes(item.id);
    }
    return true; // Admin sees everything
  });

  return (
    <div className={cn(
      "fixed left-0 top-0 h-full bg-white border-r border-gray-200 transition-all duration-300 z-30",
      sidebarCollapsed ? "w-16" : "w-64"
    )}>
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!sidebarCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-600 rounded-lg">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">CBC Manager</h1>
              <p className="text-xs text-gray-500">{tenant?.name || 'School'}</p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="text-gray-500 hover:text-gray-900"
        >
          <ChevronLeft className={cn("h-4 w-4 transition-transform", sidebarCollapsed && "rotate-180")} />
        </Button>
      </div>

      <nav className="p-4 space-y-2">
        {roleVisibleItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                "w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors",
                isActive
                  ? "bg-blue-50 text-blue-700 border-blue-200"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!sidebarCollapsed && (
                <>
                  <span className="flex-1 font-medium">{item.label}</span>
                  {item.badge && (
                    <Badge variant={isActive ? "default" : "secondary"} className="text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}
            </button>
          );
        })}
      </nav>

      {!sidebarCollapsed && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {user?.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role.replace('_', ' ')}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
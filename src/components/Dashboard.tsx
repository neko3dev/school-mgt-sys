import React, { useState } from 'react';
import { Sidebar } from './layout/Sidebar';
import { Header } from './layout/Header';
import { Overview } from './pages/Overview';
import { Students } from './pages/Students';
import { Assessment } from './pages/Assessment';
import { Finance } from './pages/Finance';
import { Attendance } from './pages/Attendance';
import { Transport } from './pages/Transport';
import { Reports } from './pages/Reports';
import { Privacy } from './pages/Privacy';
import { Settings } from './pages/Settings';
import { Staff } from './pages/Staff';
import { Timetable } from './pages/Timetable';
import { Welfare } from './pages/Welfare';
import { Communications } from './pages/Communications';
import { Analytics } from './pages/Analytics';
import { Library } from './pages/Library';
import { Inventory } from './pages/Inventory';
import { Events } from './pages/Events';
import { useUI } from '@/store';
import { cn } from '@/lib/utils';

const pages = {
  overview: Overview,
  students: Students,
  assessment: Assessment,
  finance: Finance,
  attendance: Attendance,
  transport: Transport,
  timetable: Timetable,
  welfare: Welfare,
  communications: Communications,
  events: Events,
  reports: Reports,
  privacy: Privacy,
  settings: Settings,
  staff: Staff,
  analytics: Analytics,
  library: Library,
  inventory: Inventory,
};

export function Dashboard() {
  const [currentPage, setCurrentPage] = useState('overview');
  const { sidebarCollapsed } = useUI();
  
  const CurrentPageComponent = pages[currentPage as keyof typeof pages];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      <div className={cn(
        "flex-1 flex flex-col transition-all duration-300",
        "lg:ml-0", // Reset margin on mobile
        sidebarCollapsed ? "lg:ml-16" : "lg:ml-64"
      )}>
        <Header />
        <main className="flex-1 overflow-auto p-3 lg:p-6">
          <CurrentPageComponent />
        </main>
      </div>
    </div>
  );
}
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
import { useUI } from '@/store';

const pages = {
  overview: Overview,
  students: Students,
  assessment: Assessment,
  finance: Finance,
  attendance: Attendance,
  transport: Transport,
  reports: Reports,
  privacy: Privacy,
  settings: Settings,
};

export function Dashboard() {
  const [currentPage, setCurrentPage] = useState('overview');
  const { sidebarCollapsed } = useUI();
  
  const CurrentPageComponent = pages[currentPage as keyof typeof pages];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        <Header />
        <main className="flex-1 overflow-auto p-6">
          <CurrentPageComponent />
        </main>
      </div>
    </div>
  );
}
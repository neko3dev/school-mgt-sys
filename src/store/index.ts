import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, Tenant } from '@/types'

interface AuthState {
  user: User | null
  tenant: Tenant | null
  isAuthenticated: boolean
  login: (user: User, tenant?: Tenant) => void
  logout: () => void
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      tenant: null,
      isAuthenticated: false,
      login: (user, tenant) => set({ user, tenant, isAuthenticated: true }),
      logout: () => set({ user: null, tenant: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
    }
  )
)

interface UIState {
  sidebarCollapsed: boolean
  theme: 'light' | 'dark'
  toggleSidebar: () => void
  setTheme: (theme: 'light' | 'dark') => void
}

export const useUI = create<UIState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      theme: 'light',
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'ui-storage',
    }
  )
)

// Student Management Store
interface StudentState {
  students: any[]
  selectedStudent: any | null
  isLoading: boolean
  error: string | null
  addStudent: (student: any) => void
  updateStudent: (id: string, updates: any) => void
  deleteStudent: (id: string) => void
  setSelectedStudent: (student: any) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useStudents = create<StudentState>((set, get) => ({
  students: [],
  selectedStudent: null,
  isLoading: false,
  error: null,
  addStudent: (student) => set((state) => ({ 
    students: [...state.students, { ...student, id: Date.now().toString() }] 
  })),
  updateStudent: (id, updates) => set((state) => ({
    students: state.students.map(s => s.id === id ? { ...s, ...updates } : s)
  })),
  deleteStudent: (id) => set((state) => ({
    students: state.students.filter(s => s.id !== id)
  })),
  setSelectedStudent: (student) => set({ selectedStudent: student }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}))

// Assessment Store
interface AssessmentState {
  tasks: any[]
  evidence: any[]
  selectedTask: any | null
  isLoading: boolean
  error: string | null
  addTask: (task: any) => void
  updateTask: (id: string, updates: any) => void
  deleteTask: (id: string) => void
  addEvidence: (evidence: any) => void
  updateEvidence: (id: string, updates: any) => void
  setSelectedTask: (task: any) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useAssessment = create<AssessmentState>((set) => ({
  tasks: [],
  evidence: [],
  selectedTask: null,
  isLoading: false,
  error: null,
  addTask: (task) => set((state) => ({ 
    tasks: [...state.tasks, { ...task, id: Date.now().toString() }] 
  })),
  updateTask: (id, updates) => set((state) => ({
    tasks: state.tasks.map(t => t.id === id ? { ...t, ...updates } : t)
  })),
  deleteTask: (id) => set((state) => ({
    tasks: state.tasks.filter(t => t.id !== id)
  })),
  addEvidence: (evidence) => set((state) => ({ 
    evidence: [...state.evidence, { ...evidence, id: Date.now().toString() }] 
  })),
  updateEvidence: (id, updates) => set((state) => ({
    evidence: state.evidence.map(e => e.id === id ? { ...e, ...updates } : e)
  })),
  setSelectedTask: (task) => set({ selectedTask: task }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}))

// Finance Store
interface FinanceState {
  invoices: any[]
  payments: any[]
  selectedInvoice: any | null
  isLoading: boolean
  error: string | null
  addInvoice: (invoice: any) => void
  updateInvoice: (id: string, updates: any) => void
  deleteInvoice: (id: string) => void
  addPayment: (payment: any) => void
  setSelectedInvoice: (invoice: any) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useFinance = create<FinanceState>((set) => ({
  invoices: [],
  payments: [],
  selectedInvoice: null,
  isLoading: false,
  error: null,
  addInvoice: (invoice) => set((state) => ({ 
    invoices: [...state.invoices, { ...invoice, id: Date.now().toString() }] 
  })),
  updateInvoice: (id, updates) => set((state) => ({
    invoices: state.invoices.map(i => i.id === id ? { ...i, ...updates } : i)
  })),
  deleteInvoice: (id) => set((state) => ({
    invoices: state.invoices.filter(i => i.id !== id)
  })),
  addPayment: (payment) => set((state) => ({ 
    payments: [...state.payments, { ...payment, id: Date.now().toString() }] 
  })),
  setSelectedInvoice: (invoice) => set({ selectedInvoice: invoice }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}))

// Attendance Store
interface AttendanceState {
  attendance: any[]
  selectedRecord: any | null
  isLoading: boolean
  error: string | null
  addAttendanceRecord: (record: any) => void
  updateAttendanceRecord: (id: string, updates: any) => void
  deleteAttendanceRecord: (id: string) => void
  setSelectedRecord: (record: any) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useAttendance = create<AttendanceState>((set) => ({
  attendance: [],
  selectedRecord: null,
  isLoading: false,
  error: null,
  addAttendanceRecord: (record) => set((state) => ({ 
    attendance: [...state.attendance, { ...record, id: Date.now().toString() }] 
  })),
  updateAttendanceRecord: (id, updates) => set((state) => ({
    attendance: state.attendance.map(r => r.id === id ? { ...r, ...updates } : r)
  })),
  deleteAttendanceRecord: (id) => set((state) => ({
    attendance: state.attendance.filter(r => r.id !== id)
  })),
  setSelectedRecord: (record) => set({ selectedRecord: record }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}))

// Transport Store
interface TransportState {
  routes: any[]
  events: any[]
  vehicles: any[]
  selectedRoute: any | null
  isLoading: boolean
  error: string | null
  addRoute: (route: any) => void
  updateRoute: (id: string, updates: any) => void
  deleteRoute: (id: string) => void
  addEvent: (event: any) => void
  addVehicle: (vehicle: any) => void
  setSelectedRoute: (route: any) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useTransport = create<TransportState>((set) => ({
  routes: [],
  events: [],
  vehicles: [],
  selectedRoute: null,
  isLoading: false,
  error: null,
  addRoute: (route) => set((state) => ({ 
    routes: [...state.routes, { ...route, id: Date.now().toString() }] 
  })),
  updateRoute: (id, updates) => set((state) => ({
    routes: state.routes.map(r => r.id === id ? { ...r, ...updates } : r)
  })),
  deleteRoute: (id) => set((state) => ({
    routes: state.routes.filter(r => r.id !== id)
  })),
  addEvent: (event) => set((state) => ({ 
    events: [...state.events, { ...event, id: Date.now().toString() }] 
  })),
  addVehicle: (vehicle) => set((state) => ({ 
    vehicles: [...state.vehicles, { ...vehicle, id: Date.now().toString() }] 
  })),
  setSelectedRoute: (route) => set({ selectedRoute: route }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}))

// Reports Store
interface ReportsState {
  reports: any[]
  templates: any[]
  exportQueue: any[]
  selectedReport: any | null
  isLoading: boolean
  error: string | null
  generateReport: (config: any) => void
  saveTemplate: (template: any) => void
  deleteTemplate: (id: string) => void
  addToExportQueue: (item: any) => void
  updateExportStatus: (id: string, status: string) => void
  setSelectedReport: (report: any) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useReports = create<ReportsState>((set) => ({
  reports: [],
  templates: [],
  exportQueue: [],
  selectedReport: null,
  isLoading: false,
  error: null,
  generateReport: (config) => {
    const report = {
      id: Date.now().toString(),
      ...config,
      status: 'generating',
      created_at: new Date().toISOString()
    };
    set((state) => ({ 
      reports: [...state.reports, report],
      exportQueue: [...state.exportQueue, report]
    }));
    
    // Simulate report generation
    setTimeout(() => {
      set((state) => ({
        exportQueue: state.exportQueue.map(item => 
          item.id === report.id ? { ...item, status: 'completed', file_url: `/reports/${report.id}.${config.format}` } : item
        )
      }));
    }, 3000);
  },
  saveTemplate: (template) => set((state) => ({ 
    templates: [...state.templates, { ...template, id: Date.now().toString() }] 
  })),
  deleteTemplate: (id) => set((state) => ({
    templates: state.templates.filter(t => t.id !== id)
  })),
  addToExportQueue: (item) => set((state) => ({ 
    exportQueue: [...state.exportQueue, { ...item, id: Date.now().toString() }] 
  })),
  updateExportStatus: (id, status) => set((state) => ({
    exportQueue: state.exportQueue.map(item => 
      item.id === id ? { ...item, status } : item
    )
  })),
  setSelectedReport: (report) => set({ selectedReport: report }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}))
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
        reports: state.reports.map(r => 
          r.id === report.id ? { ...r, status: 'completed', file_url: `/reports/${report.id}.${config.format}` } : r
        ),
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

// Staff Store
interface StaffState {
  staff: any[]
  selectedStaff: any | null
  isLoading: boolean
  error: string | null
  addStaff: (staff: any) => void
  updateStaff: (id: string, updates: any) => void
  deleteStaff: (id: string) => void
  setSelectedStaff: (staff: any) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useStaff = create<StaffState>((set) => ({
  staff: [],
  selectedStaff: null,
  isLoading: false,
  error: null,
  addStaff: (staff) => set((state) => ({ 
    staff: [...state.staff, { ...staff, id: Date.now().toString() }] 
  })),
  updateStaff: (id, updates) => set((state) => ({
    staff: state.staff.map(s => s.id === id ? { ...s, ...updates } : s)
  })),
  deleteStaff: (id) => set((state) => ({
    staff: state.staff.filter(s => s.id !== id)
  })),
  setSelectedStaff: (staff) => set({ selectedStaff: staff }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}))

// Timetable Store
interface TimetableState {
  lessons: any[]
  selectedLesson: any | null
  isLoading: boolean
  error: string | null
  addLesson: (lesson: any) => void
  updateLesson: (id: string, updates: any) => void
  deleteLesson: (id: string) => void
  setSelectedLesson: (lesson: any) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useTimetable = create<TimetableState>((set) => ({
  lessons: [],
  selectedLesson: null,
  isLoading: false,
  error: null,
  addLesson: (lesson) => set((state) => ({ 
    lessons: [...state.lessons, { ...lesson, id: Date.now().toString() }] 
  })),
  updateLesson: (id, updates) => set((state) => ({
    lessons: state.lessons.map(l => l.id === id ? { ...l, ...updates } : l)
  })),
  deleteLesson: (id) => set((state) => ({
    lessons: state.lessons.filter(l => l.id !== id)
  })),
  setSelectedLesson: (lesson) => set({ selectedLesson: lesson }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}))

// Welfare Store
interface WelfareState {
  cases: any[]
  snePlans: any[]
  selectedCase: any | null
  selectedSNEPlan: any | null
  isLoading: boolean
  error: string | null
  addCase: (welfareCase: any) => void
  updateCase: (id: string, updates: any) => void
  deleteCase: (id: string) => void
  addSNEPlan: (plan: any) => void
  updateSNEPlan: (id: string, updates: any) => void
  deleteSNEPlan: (id: string) => void
  setSelectedCase: (welfareCase: any) => void
  setSelectedSNEPlan: (plan: any) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useWelfare = create<WelfareState>((set) => ({
  cases: [],
  snePlans: [],
  selectedCase: null,
  selectedSNEPlan: null,
  isLoading: false,
  error: null,
  addCase: (welfareCase) => set((state) => ({ 
    cases: [...state.cases, { ...welfareCase, id: Date.now().toString() }] 
  })),
  updateCase: (id, updates) => set((state) => ({
    cases: state.cases.map(c => c.id === id ? { ...c, ...updates } : c)
  })),
  deleteCase: (id) => set((state) => ({
    cases: state.cases.filter(c => c.id !== id)
  })),
  addSNEPlan: (plan) => set((state) => ({ 
    snePlans: [...state.snePlans, { ...plan, id: Date.now().toString() }] 
  })),
  updateSNEPlan: (id, updates) => set((state) => ({
    snePlans: state.snePlans.map(p => p.id === id ? { ...p, ...updates } : p)
  })),
  deleteSNEPlan: (id) => set((state) => ({
    snePlans: state.snePlans.filter(p => p.id !== id)
  })),
  setSelectedCase: (welfareCase) => set({ selectedCase: welfareCase }),
  setSelectedSNEPlan: (plan) => set({ selectedSNEPlan: plan }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}))

// Communications Store
interface CommunicationsState {
  messages: any[]
  templates: any[]
  selectedMessage: any | null
  selectedTemplate: any | null
  isLoading: boolean
  error: string | null
  addMessage: (message: any) => void
  updateMessage: (id: string, updates: any) => void
  deleteMessage: (id: string) => void
  addTemplate: (template: any) => void
  updateTemplate: (id: string, updates: any) => void
  deleteTemplate: (id: string) => void
  setSelectedMessage: (message: any) => void
  setSelectedTemplate: (template: any) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useCommunications = create<CommunicationsState>((set) => ({
  messages: [],
  templates: [],
  selectedMessage: null,
  selectedTemplate: null,
  isLoading: false,
  error: null,
  addMessage: (message) => set((state) => ({ 
    messages: [...state.messages, { ...message, id: Date.now().toString() }] 
  })),
  updateMessage: (id, updates) => set((state) => ({
    messages: state.messages.map(m => m.id === id ? { ...m, ...updates } : m)
  })),
  deleteMessage: (id) => set((state) => ({
    messages: state.messages.filter(m => m.id !== id)
  })),
  addTemplate: (template) => set((state) => ({ 
    templates: [...state.templates, { ...template, id: Date.now().toString() }] 
  })),
  updateTemplate: (id, updates) => set((state) => ({
    templates: state.templates.map(t => t.id === id ? { ...t, ...updates } : t)
  })),
  deleteTemplate: (id) => set((state) => ({
    templates: state.templates.filter(t => t.id !== id)
  })),
  setSelectedMessage: (message) => set({ selectedMessage: message }),
  setSelectedTemplate: (template) => set({ selectedTemplate: template }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}))

// Library Store
interface LibraryState {
  books: any[]
  issues: any[]
  selectedBook: any | null
  isLoading: boolean
  error: string | null
  addBook: (book: any) => void
  updateBook: (id: string, updates: any) => void
  deleteBook: (id: string) => void
  issueBook: (issueData: any) => void
  returnBook: (issueId: string) => void
  setSelectedBook: (book: any) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useLibrary = create<LibraryState>((set) => ({
  books: [],
  issues: [],
  selectedBook: null,
  isLoading: false,
  error: null,
  addBook: (book) => set((state) => ({ 
    books: [...state.books, { ...book, id: Date.now().toString() }] 
  })),
  updateBook: (id, updates) => set((state) => ({
    books: state.books.map(b => b.id === id ? { ...b, ...updates } : b)
  })),
  deleteBook: (id) => set((state) => ({
    books: state.books.filter(b => b.id !== id)
  })),
  issueBook: (issueData) => set((state) => ({ 
    issues: [...state.issues, { 
      ...issueData, 
      id: Date.now().toString(),
      issued_date: new Date().toISOString(),
      status: 'issued',
      issued_by: 'current-user'
    }] 
  })),
  returnBook: (issueId) => set((state) => ({
    issues: state.issues.map(i => 
      i.id === issueId ? { ...i, status: 'returned', returned_date: new Date().toISOString() } : i
    )
  })),
  setSelectedBook: (book) => set({ selectedBook: book }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}))

// Inventory Store
interface InventoryState {
  assets: any[]
  maintenance: any[]
  selectedAsset: any | null
  isLoading: boolean
  error: string | null
  addAsset: (asset: any) => void
  updateAsset: (id: string, updates: any) => void
  deleteAsset: (id: string) => void
  addMaintenance: (maintenance: any) => void
  updateMaintenance: (id: string, updates: any) => void
  setSelectedAsset: (asset: any) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useInventory = create<InventoryState>((set) => ({
  assets: [],
  maintenance: [],
  selectedAsset: null,
  isLoading: false,
  error: null,
  addAsset: (asset) => set((state) => ({ 
    assets: [...state.assets, { ...asset, id: Date.now().toString() }] 
  })),
  updateAsset: (id, updates) => set((state) => ({
    assets: state.assets.map(a => a.id === id ? { ...a, ...updates } : a)
  })),
  deleteAsset: (id) => set((state) => ({
    assets: state.assets.filter(a => a.id !== id)
  })),
  addMaintenance: (maintenance) => set((state) => ({ 
    maintenance: [...state.maintenance, { ...maintenance, id: Date.now().toString() }] 
  })),
  updateMaintenance: (id, updates) => set((state) => ({
    maintenance: state.maintenance.map(m => m.id === id ? { ...m, ...updates } : m)
  })),
  setSelectedAsset: (asset) => set({ selectedAsset: asset }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}))
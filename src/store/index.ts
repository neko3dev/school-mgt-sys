import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, Tenant } from '@/types'
import { generateRealisticData } from '@/data/realistic-data'

// Initialize realistic data
const realisticData = generateRealisticData()

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

// Student Management Store with realistic data
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
  initializeData: () => void
}

export const useStudents = create<StudentState>((set, get) => ({
  students: [],
  selectedStudent: null,
  isLoading: false,
  error: null,
  addStudent: (student) => {
    const newStudent = { 
      ...student, 
      id: `learner-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    set((state) => ({ 
      students: [...state.students, newStudent] 
    }))
    
    // Update related data
    const { updateRelatedData } = get()
    updateRelatedData('student_added', newStudent)
  },
  updateStudent: (id, updates) => {
    const updatedStudent = { ...updates, updated_at: new Date().toISOString() }
    set((state) => ({
      students: state.students.map(s => s.id === id ? { ...s, ...updatedStudent } : s)
    }))
    
    // Update related data
    const { updateRelatedData } = get()
    updateRelatedData('student_updated', { id, updates: updatedStudent })
  },
  deleteStudent: (id) => {
    set((state) => ({
      students: state.students.filter(s => s.id !== id)
    }))
    
    // Update related data
    const { updateRelatedData } = get()
    updateRelatedData('student_deleted', { id })
  },
  setSelectedStudent: (student) => set({ selectedStudent: student }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  initializeData: () => set({ students: realisticData.learners }),
  updateRelatedData: (action: string, data: any) => {
    // Update attendance when student is deleted
    if (action === 'student_deleted') {
      useAttendance.getState().deleteStudentAttendance(data.id)
    }
    // Update invoices when student is deleted
    if (action === 'student_deleted') {
      useFinance.getState().deleteStudentInvoices(data.id)
    }
  }
}))

// Assessment Store with realistic data
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
  deleteEvidence: (id: string) => void
  setSelectedTask: (task: any) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  initializeData: () => void
}

export const useAssessment = create<AssessmentState>((set, get) => ({
  tasks: [],
  evidence: [],
  selectedTask: null,
  isLoading: false,
  error: null,
  addTask: (task) => {
    const newTask = { 
      ...task, 
      id: `task-${Date.now()}`,
      created_at: new Date().toISOString()
    }
    set((state) => ({ 
      tasks: [...state.tasks, newTask] 
    }))
  },
  updateTask: (id, updates) => set((state) => ({
    tasks: state.tasks.map(t => t.id === id ? { ...t, ...updates } : t)
  })),
  deleteTask: (id) => {
    set((state) => ({
      tasks: state.tasks.filter(t => t.id !== id),
      evidence: state.evidence.filter(e => e.task_id !== id)
    }))
  },
  addEvidence: (evidence) => {
    const newEvidence = { 
      ...evidence, 
      id: `evidence-${Date.now()}`,
      captured_at: new Date().toISOString()
    }
    set((state) => ({ 
      evidence: [...state.evidence, newEvidence] 
    }))
  },
  updateEvidence: (id, updates) => set((state) => ({
    evidence: state.evidence.map(e => e.id === id ? { ...e, ...updates } : e)
  })),
  deleteEvidence: (id) => set((state) => ({
    evidence: state.evidence.filter(e => e.id !== id)
  })),
  setSelectedTask: (task) => set({ selectedTask: task }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  initializeData: () => set({ 
    tasks: realisticData.tasks,
    evidence: realisticData.evidence
  })
}))

// Finance Store with realistic data and inter-module relationships
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
  deleteStudentInvoices: (studentId: string) => void
  setSelectedInvoice: (invoice: any) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  initializeData: () => void
}

export const useFinance = create<FinanceState>((set, get) => ({
  invoices: [],
  payments: [],
  selectedInvoice: null,
  isLoading: false,
  error: null,
  addInvoice: (invoice) => {
    const newInvoice = { 
      ...invoice, 
      id: `invoice-${Date.now()}`,
      created_at: new Date().toISOString()
    }
    set((state) => ({ 
      invoices: [...state.invoices, newInvoice] 
    }))
  },
  updateInvoice: (id, updates) => set((state) => ({
    invoices: state.invoices.map(i => i.id === id ? { ...i, ...updates } : i)
  })),
  deleteInvoice: (id) => set((state) => ({
    invoices: state.invoices.filter(i => i.id !== id)
  })),
  addPayment: (payment) => {
    const newPayment = { 
      ...payment, 
      id: `payment-${Date.now()}`,
      received_at: new Date().toISOString()
    }
    set((state) => ({ 
      payments: [...state.payments, newPayment] 
    }))
    
    // Update invoice balance
    const invoice = get().invoices.find(i => i.id === payment.invoice_id)
    if (invoice) {
      const newBalance = Math.max(0, invoice.balance - payment.amount)
      get().updateInvoice(payment.invoice_id, { 
        balance: newBalance,
        status: newBalance === 0 ? 'paid' : 'sent'
      })
    }
  },
  deleteStudentInvoices: (studentId) => set((state) => ({
    invoices: state.invoices.filter(i => i.learner_id !== studentId)
  })),
  setSelectedInvoice: (invoice) => set({ selectedInvoice: invoice }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  initializeData: () => set({ invoices: realisticData.invoices })
}))

// Attendance Store with realistic data and relationships
interface AttendanceState {
  attendance: any[]
  selectedRecord: any | null
  isLoading: boolean
  error: string | null
  addAttendanceRecord: (record: any) => void
  updateAttendanceRecord: (id: string, updates: any) => void
  deleteAttendanceRecord: (id: string) => void
  deleteStudentAttendance: (studentId: string) => void
  setSelectedRecord: (record: any) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  initializeData: () => void
}

export const useAttendance = create<AttendanceState>((set, get) => ({
  attendance: [],
  selectedRecord: null,
  isLoading: false,
  error: null,
  addAttendanceRecord: (record) => {
    const newRecord = { 
      ...record, 
      id: `att-${Date.now()}`,
      recorded_at: new Date().toISOString()
    }
    set((state) => ({ 
      attendance: [...state.attendance, newRecord] 
    }))
    
    // Send notification to parent if absent
    if (record.status === 'absent') {
      const students = useStudents.getState().students
      const student = students.find(s => s.id === record.learner_id)
      if (student && student.guardians?.length > 0) {
        useCommunications.getState().addMessage({
          type: 'sms',
          recipients: student.guardians.map((g: any) => ({
            id: `rec-${Date.now()}`,
            type: 'guardian',
            contact: g.phone,
            status: 'pending'
          })),
          content: `Your child ${student.name} was absent from school today. Please contact the school if this was unplanned.`,
          status: 'draft',
          created_by: 'system'
        })
      }
    }
  },
  updateAttendanceRecord: (id, updates) => set((state) => ({
    attendance: state.attendance.map(r => r.id === id ? { ...r, ...updates } : r)
  })),
  deleteAttendanceRecord: (id) => set((state) => ({
    attendance: state.attendance.filter(r => r.id !== id)
  })),
  deleteStudentAttendance: (studentId) => set((state) => ({
    attendance: state.attendance.filter(r => r.learner_id !== studentId)
  })),
  setSelectedRecord: (record) => set({ selectedRecord: record }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  initializeData: () => set({ attendance: realisticData.attendance })
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
  initializeData: () => void
}

export const useTransport = create<TransportState>((set) => ({
  routes: [],
  events: [],
  vehicles: [],
  selectedRoute: null,
  isLoading: false,
  error: null,
  addRoute: (route) => {
    const newRoute = { 
      ...route, 
      id: `route-${Date.now()}`,
      created_at: new Date().toISOString()
    }
    set((state) => ({ 
      routes: [...state.routes, newRoute] 
    }))
  },
  updateRoute: (id, updates) => set((state) => ({
    routes: state.routes.map(r => r.id === id ? { ...r, ...updates } : r)
  })),
  deleteRoute: (id) => set((state) => ({
    routes: state.routes.filter(r => r.id !== id)
  })),
  addEvent: (event) => {
    const newEvent = { 
      ...event, 
      id: `transport-event-${Date.now()}`,
      recorded_at: new Date().toISOString()
    }
    set((state) => ({ 
      events: [...state.events, newEvent] 
    }))
  },
  addVehicle: (vehicle) => {
    const newVehicle = { 
      ...vehicle, 
      id: `vehicle-${Date.now()}`
    }
    set((state) => ({ 
      vehicles: [...state.vehicles, newVehicle] 
    }))
  },
  setSelectedRoute: (route) => set({ selectedRoute: route }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  initializeData: () => set({ routes: realisticData.routes })
}))

// Reports Store with actual file generation
export interface ReportsState {
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
  downloadReport: (report: any) => void
}

export const useReports = create<ReportsState>((set, get) => ({
  reports: [],
  templates: [],
  exportQueue: [],
  selectedReport: null,
  isLoading: false,
  error: null,
  generateReport: (config) => {
    const report = {
      id: `report-${Date.now()}`,
      ...config,
      status: 'generating',
      created_at: new Date().toISOString(),
      progress: 0
    };
    
    set((state) => ({ 
      reports: [...state.reports, report],
      exportQueue: [...state.exportQueue, report]
    }));
    
    // Simulate realistic report generation with progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20 + 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        const completedReport = {
          ...report,
          status: 'completed',
          progress: 100,
          file_url: `/reports/${report.id}.${config.format}`,
          file_size: Math.floor(Math.random() * 5000) + 1000,
          hash: `sha256:${Math.random().toString(36).substr(2, 16)}`
        };
        
        set((state) => ({
          reports: state.reports.map(r => 
            r.id === report.id ? completedReport : r
          ),
          exportQueue: state.exportQueue.map(item => 
            item.id === report.id ? completedReport : item
          )
        }));
        
        // Auto-download the report
        get().downloadReport(completedReport);
      } else {
        set((state) => ({
          reports: state.reports.map(r => 
            r.id === report.id ? { ...r, progress } : r
          ),
          exportQueue: state.exportQueue.map(item => 
            item.id === report.id ? { ...item, progress } : item
          )
        }));
      }
    }, 500);
  },
  downloadReport: (report) => {
    // Generate actual file content based on format and data
    const { generateFileContent } = get();
    const content = generateFileContent(report);
    
    // Create and download file
    const blob = new Blob([content.data], { type: content.mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.title.toLowerCase().replace(/\s+/g, '-')}.${report.format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },
  generateFileContent: (report) => {
    const { students } = useStudents.getState();
    const { tasks, evidence } = useAssessment.getState();
    const { invoices } = useFinance.getState();
    const { attendance } = useAttendance.getState();
    
    let data = '';
    let mimeType = '';
    
    switch (report.format) {
      case 'pdf':
        data = generatePDFContent(report, { students, tasks, evidence, invoices, attendance });
        mimeType = 'application/pdf';
        break;
      case 'xlsx':
        data = generateExcelContent(report, { students, tasks, evidence, invoices, attendance });
        mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        break;
      case 'csv':
        data = generateCSVContent(report, { students, tasks, evidence, invoices, attendance });
        mimeType = 'text/csv';
        break;
      case 'json':
        data = generateJSONContent(report, { students, tasks, evidence, invoices, attendance });
        mimeType = 'application/json';
        break;
      default:
        data = JSON.stringify(report.data, null, 2);
        mimeType = 'text/plain';
    }
    
    return { data, mimeType };
  },
  saveTemplate: (template) => {
    const newTemplate = { 
      ...template, 
      id: `template-${Date.now()}`,
      created_at: new Date().toISOString()
    }
    set((state) => ({ 
      templates: [...state.templates, newTemplate] 
    }))
  },
  deleteTemplate: (id) => set((state) => ({
    templates: state.templates.filter(t => t.id !== id)
  })),
  addToExportQueue: (item) => {
    const newItem = { 
      ...item, 
      id: `export-${Date.now()}`,
      created_at: new Date().toISOString()
    }
    set((state) => ({ 
      exportQueue: [...state.exportQueue, newItem] 
    }))
  },
  updateExportStatus: (id, status) => set((state) => ({
    exportQueue: state.exportQueue.map(item => 
      item.id === id ? { ...item, status } : item
    )
  })),
  setSelectedReport: (report) => set({ selectedReport: report }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}))

// Helper functions for file generation
const generatePDFContent = (report: any, data: any) => {
  return `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj

4 0 obj
<<
/Length 500
>>
stream
BT
/F1 16 Tf
72 720 Td
(${report.title}) Tj
0 -30 Td
/F1 12 Tf
(Generated: ${new Date().toLocaleString()}) Tj
0 -20 Td
(School: Karagita Primary School) Tj
0 -20 Td
(Academic Year: 2024 - Term 1) Tj
0 -30 Td
(Students: ${data.students?.length || 0}) Tj
0 -20 Td
(Tasks: ${data.tasks?.length || 0}) Tj
0 -20 Td
(Attendance Records: ${data.attendance?.length || 0}) Tj
0 -20 Td
(Invoices: ${data.invoices?.length || 0}) Tj
ET
endstream
endobj

xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000074 00000 n 
0000000120 00000 n 
0000000179 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
700
%%EOF`;
};

const generateExcelContent = (report: any, data: any) => {
  let content = `Report Title\t${report.title}\n`;
  content += `Generated\t${new Date().toLocaleString()}\n`;
  content += `School\tKaragita Primary School\n\n`;
  
  if (data.students?.length > 0) {
    content += `Students\n`;
    content += `Name\tAdmission No\tUPI\tClass\tStatus\n`;
    data.students.forEach((student: any) => {
      content += `${student.name}\t${student.admission_no}\t${student.upi}\t${student.classroom_id}\t${student.status}\n`;
    });
    content += `\n`;
  }
  
  if (data.attendance?.length > 0) {
    content += `Attendance Records\n`;
    content += `Date\tStudent\tStatus\tReason\n`;
    data.attendance.forEach((record: any) => {
      const student = data.students?.find((s: any) => s.id === record.learner_id);
      content += `${record.date}\t${student?.name || 'Unknown'}\t${record.status}\t${record.reason || ''}\n`;
    });
  }
  
  return content;
};

const generateCSVContent = (report: any, data: any) => {
  let content = `"Report","${report.title}"\n`;
  content += `"Generated","${new Date().toISOString()}"\n`;
  content += `"School","Karagita Primary School"\n\n`;
  
  if (data.students?.length > 0) {
    content += `"Name","Admission No","UPI","Class","Status"\n`;
    data.students.forEach((student: any) => {
      content += `"${student.name}","${student.admission_no}","${student.upi}","${student.classroom_id}","${student.status}"\n`;
    });
  }
  
  return content;
};

const generateJSONContent = (report: any, data: any) => {
  return JSON.stringify({
    report: {
      title: report.title,
      generated: new Date().toISOString(),
      school: 'Karagita Primary School',
      academic_year: '2024',
      term: 1
    },
    data: data,
    summary: {
      students: data.students?.length || 0,
      tasks: data.tasks?.length || 0,
      attendance_records: data.attendance?.length || 0,
      invoices: data.invoices?.length || 0
    }
  }, null, 2);
};

// Events Store
interface EventsState {
  events: any[]
  selectedEvent: any | null
  isLoading: boolean
  error: string | null
  addEvent: (event: any) => void
  updateEvent: (id: string, updates: any) => void
  deleteEvent: (id: string) => void
  setSelectedEvent: (event: any) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  initializeData: () => void
}

export const useEvents = create<EventsState>((set) => ({
  events: [],
  selectedEvent: null,
  isLoading: false,
  error: null,
  addEvent: (event) => {
    const newEvent = { 
      ...event, 
      id: `event-${Date.now()}`,
      created_at: new Date().toISOString()
    }
    set((state) => ({ 
      events: [...state.events, newEvent] 
    }))
  },
  updateEvent: (id, updates) => set((state) => ({
    events: state.events.map(e => e.id === id ? { ...e, ...updates } : e)
  })),
  deleteEvent: (id) => set((state) => ({
    events: state.events.filter(e => e.id !== id)
  })),
  setSelectedEvent: (event) => set({ selectedEvent: event }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  initializeData: () => set({ events: realisticData.events })
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
  initializeData: () => void
}

export const useStaff = create<StaffState>((set) => ({
  staff: [],
  selectedStaff: null,
  isLoading: false,
  error: null,
  addStaff: (staff) => {
    const newStaff = { 
      ...staff, 
      id: `staff-${Date.now()}`,
      created_at: new Date().toISOString()
    }
    set((state) => ({ 
      staff: [...state.staff, newStaff] 
    }))
  },
  updateStaff: (id, updates) => set((state) => ({
    staff: state.staff.map(s => s.id === id ? { ...s, ...updates } : s)
  })),
  deleteStaff: (id) => set((state) => ({
    staff: state.staff.filter(s => s.id !== id)
  })),
  setSelectedStaff: (staff) => set({ selectedStaff: staff }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  initializeData: () => set({ staff: realisticData.teachers })
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
  initializeData: () => void
}

export const useWelfare = create<WelfareState>((set) => ({
  cases: [],
  snePlans: [],
  selectedCase: null,
  selectedSNEPlan: null,
  isLoading: false,
  error: null,
  addCase: (welfareCase) => {
    const newCase = { 
      ...welfareCase, 
      id: `case-${Date.now()}`,
      opened_at: new Date().toISOString()
    }
    set((state) => ({ 
      cases: [...state.cases, newCase] 
    }))
  },
  updateCase: (id, updates) => set((state) => ({
    cases: state.cases.map(c => c.id === id ? { ...c, ...updates } : c)
  })),
  deleteCase: (id) => set((state) => ({
    cases: state.cases.filter(c => c.id !== id)
  })),
  addSNEPlan: (plan) => {
    const newPlan = { 
      ...plan, 
      id: `sne-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    set((state) => ({ 
      snePlans: [...state.snePlans, newPlan] 
    }))
  },
  updateSNEPlan: (id, updates) => set((state) => ({
    snePlans: state.snePlans.map(p => p.id === id ? { ...p, ...updates, updated_at: new Date().toISOString() } : p)
  })),
  deleteSNEPlan: (id) => set((state) => ({
    snePlans: state.snePlans.filter(p => p.id !== id)
  })),
  setSelectedCase: (welfareCase) => set({ selectedCase: welfareCase }),
  setSelectedSNEPlan: (plan) => set({ selectedSNEPlan: plan }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  initializeData: () => set({ 
    cases: realisticData.welfareCases,
    snePlans: realisticData.snePlans
  })
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
  initializeData: () => void
}

export const useCommunications = create<CommunicationsState>((set) => ({
  messages: [],
  templates: [],
  selectedMessage: null,
  selectedTemplate: null,
  isLoading: false,
  error: null,
  addMessage: (message) => {
    const newMessage = { 
      ...message, 
      id: `msg-${Date.now()}`,
      created_at: new Date().toISOString()
    }
    set((state) => ({ 
      messages: [...state.messages, newMessage] 
    }))
  },
  updateMessage: (id, updates) => set((state) => ({
    messages: state.messages.map(m => m.id === id ? { ...m, ...updates } : m)
  })),
  deleteMessage: (id) => set((state) => ({
    messages: state.messages.filter(m => m.id !== id)
  })),
  addTemplate: (template) => {
    const newTemplate = { 
      ...template, 
      id: `template-${Date.now()}`,
      created_at: new Date().toISOString()
    }
    set((state) => ({ 
      templates: [...state.templates, newTemplate] 
    }))
  },
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
  initializeData: () => set({ messages: realisticData.messages })
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
  initializeData: () => void
}

export const useLibrary = create<LibraryState>((set, get) => ({
  books: [],
  issues: [],
  selectedBook: null,
  isLoading: false,
  error: null,
  addBook: (book) => {
    const newBook = { 
      ...book, 
      id: `book-${Date.now()}`,
      created_at: new Date().toISOString()
    }
    set((state) => ({ 
      books: [...state.books, newBook] 
    }))
  },
  updateBook: (id, updates) => set((state) => ({
    books: state.books.map(b => b.id === id ? { ...b, ...updates } : b)
  })),
  deleteBook: (id) => set((state) => ({
    books: state.books.filter(b => b.id !== id),
    issues: state.issues.filter(i => i.book_id !== id)
  })),
  issueBook: (issueData) => {
    const newIssue = { 
      ...issueData, 
      id: `issue-${Date.now()}`,
      issued_date: new Date().toISOString(),
      status: 'issued',
      issued_by: 'current-user'
    }
    set((state) => ({ 
      issues: [...state.issues, newIssue] 
    }))
    
    // Update book availability
    const book = get().books.find(b => b.id === issueData.book_id)
    if (book) {
      get().updateBook(issueData.book_id, { 
        copies_available: book.copies_available - 1 
      })
    }
  },
  returnBook: (issueId) => {
    const issue = get().issues.find(i => i.id === issueId)
    if (issue) {
      set((state) => ({
        issues: state.issues.map(i => 
          i.id === issueId ? { ...i, status: 'returned', returned_date: new Date().toISOString() } : i
        )
      }))
      
      // Update book availability
      const book = get().books.find(b => b.id === issue.book_id)
      if (book) {
        get().updateBook(issue.book_id, { 
          copies_available: book.copies_available + 1 
        })
      }
    }
  },
  setSelectedBook: (book) => set({ selectedBook: book }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  initializeData: () => set({ books: realisticData.books })
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
  initializeData: () => void
}

export const useInventory = create<InventoryState>((set) => ({
  assets: [],
  maintenance: [],
  selectedAsset: null,
  isLoading: false,
  error: null,
  addAsset: (asset) => {
    const newAsset = { 
      ...asset, 
      id: `asset-${Date.now()}`,
      created_at: new Date().toISOString()
    }
    set((state) => ({ 
      assets: [...state.assets, newAsset] 
    }))
  },
  updateAsset: (id, updates) => set((state) => ({
    assets: state.assets.map(a => a.id === id ? { ...a, ...updates } : a)
  })),
  deleteAsset: (id) => set((state) => ({
    assets: state.assets.filter(a => a.id !== id),
    maintenance: state.maintenance.filter(m => m.asset_id !== id)
  })),
  addMaintenance: (maintenance) => {
    const newMaintenance = { 
      ...maintenance, 
      id: `maintenance-${Date.now()}`,
      created_at: new Date().toISOString()
    }
    set((state) => ({ 
      maintenance: [...state.maintenance, newMaintenance] 
    }))
  },
  updateMaintenance: (id, updates) => set((state) => ({
    maintenance: state.maintenance.map(m => m.id === id ? { ...m, ...updates } : m)
  })),
  setSelectedAsset: (asset) => set({ selectedAsset: asset }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  initializeData: () => set({ assets: realisticData.assets })
}))

// Settings Store
interface SettingsState {
  schoolSettings: any
  systemSettings: any
  userSettings: any
  updateSchoolSettings: (settings: any) => void
  updateSystemSettings: (settings: any) => void
  updateUserSettings: (settings: any) => void
}

export const useSettings = create<SettingsState>((set) => ({
  schoolSettings: {
    name: 'Karagita Primary School',
    code: '01-01-001-001',
    county: 'Nairobi',
    subcounty: 'Dagoretti North',
    motto: 'Excellence Through Education',
    academic_year: '2024',
    current_term: 1,
    timezone: 'Africa/Nairobi',
    language: 'en'
  },
  systemSettings: {
    theme: 'light',
    notifications: true,
    backup_frequency: 'daily',
    session_timeout: 30,
    password_policy: {
      min_length: 8,
      require_uppercase: true,
      require_lowercase: true,
      require_numbers: true,
      require_special: false
    }
  },
  userSettings: {
    dashboard_layout: 'default',
    notification_preferences: {
      email: true,
      sms: true,
      push: false
    }
  },
  updateSchoolSettings: (settings) => set((state) => ({
    schoolSettings: { ...state.schoolSettings, ...settings }
  })),
  updateSystemSettings: (settings) => set((state) => ({
    systemSettings: { ...state.systemSettings, ...settings }
  })),
  updateUserSettings: (settings) => set((state) => ({
    userSettings: { ...state.userSettings, ...settings }
  })),
}))

// Search Store with enhanced functionality
interface SearchState {
  searchTerm: string
  searchResults: any[]
  isSearching: boolean
  searchHistory: string[]
  setSearchTerm: (term: string) => void
  setSearchResults: (results: any[]) => void
  setIsSearching: (searching: boolean) => void
  addToHistory: (term: string) => void
  clearHistory: () => void
  performGlobalSearch: (term: string) => Promise<any[]>
}

export const useSearch = create<SearchState>((set, get) => ({
  searchTerm: '',
  searchResults: [],
  isSearching: false,
  searchHistory: [],
  setSearchTerm: (term) => set({ searchTerm: term }),
  setSearchResults: (results) => set({ searchResults: results }),
  setIsSearching: (searching) => set({ isSearching: searching }),
  addToHistory: (term) => {
    if (term.trim() && !get().searchHistory.includes(term)) {
      set((state) => ({
        searchHistory: [term, ...state.searchHistory.slice(0, 9)]
      }));
    }
  },
  clearHistory: () => set({ searchHistory: [] }),
  performGlobalSearch: async (term: string) => {
    const results: any[] = [];
    const searchLower = term.toLowerCase();

    // Search students
    const { students } = useStudents.getState();
    students.forEach(student => {
      if (
        student.name.toLowerCase().includes(searchLower) ||
        student.admission_no.toLowerCase().includes(searchLower) ||
        student.upi.toLowerCase().includes(searchLower)
      ) {
        results.push({
          type: 'student',
          id: student.id,
          title: student.name,
          subtitle: `${student.admission_no} • UPI: ${student.upi}`,
          icon: 'Users',
          module: 'students',
          data: student
        });
      }
    });

    // Search staff
    const { staff } = useStaff.getState();
    staff.forEach(teacher => {
      if (
        teacher.name.toLowerCase().includes(searchLower) ||
        teacher.tsc_no.toLowerCase().includes(searchLower) ||
        teacher.email.toLowerCase().includes(searchLower)
      ) {
        results.push({
          type: 'staff',
          id: teacher.id,
          title: teacher.name,
          subtitle: `TSC: ${teacher.tsc_no} • ${teacher.email}`,
          icon: 'GraduationCap',
          module: 'staff',
          data: teacher
        });
      }
    });

    // Search invoices
    const { invoices } = useFinance.getState();
    invoices.forEach(invoice => {
      const student = students.find(s => s.id === invoice.learner_id);
      if (
        student?.name.toLowerCase().includes(searchLower) ||
        invoice.id.toLowerCase().includes(searchLower)
      ) {
        results.push({
          type: 'invoice',
          id: invoice.id,
          title: `Invoice - ${student?.name}`,
          subtitle: `Term ${invoice.term} ${invoice.academic_year} • Balance: KES ${invoice.balance.toLocaleString()}`,
          icon: 'CreditCard',
          module: 'finance',
          data: invoice
        });
      }
    });

    // Search tasks
    const { tasks } = useAssessment.getState();
    tasks.forEach(task => {
      if (task.title.toLowerCase().includes(searchLower)) {
        results.push({
          type: 'task',
          id: task.id,
          title: task.title,
          subtitle: `${task.subject_id} • Due: ${new Date(task.due_date).toLocaleDateString()}`,
          icon: 'BookOpen',
          module: 'assessment',
          data: task
        });
      }
    });

    return results.slice(0, 10);
  }
}))

// Initialize all stores with realistic data
export const initializeAllStores = () => {
  useStudents.getState().initializeData()
  useAssessment.getState().initializeData()
  useFinance.getState().initializeData()
  useAttendance.getState().initializeData()
  useTransport.getState().initializeData()
  useEvents.getState().initializeData()
  useStaff.getState().initializeData()
  useWelfare.getState().initializeData()
  useCommunications.getState().initializeData()
  useLibrary.getState().initializeData()
  useInventory.getState().initializeData()
}
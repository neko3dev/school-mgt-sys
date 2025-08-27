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
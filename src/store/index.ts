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
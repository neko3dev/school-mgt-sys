import { useState, useEffect } from 'react'
import { DatabaseService } from '@/lib/supabase'
import { useAuth } from './useAuth'

export function useDatabase() {
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user, tenant } = useAuth()

  useEffect(() => {
    if (user && tenant) {
      checkConnection()
    }
  }, [user, tenant])

  const checkConnection = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Test connection by trying to fetch students
      await DatabaseService.getStudents()
      setIsConnected(true)
    } catch (err: any) {
      setIsConnected(false)
      setError('Database connection failed. Using offline mode.')
      console.warn('Database not connected, using mock data:', err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isConnected,
    isLoading,
    error,
    checkConnection
  }
}

// Enhanced hooks for each data type with real database integration
export function useStudentsData() {
  const [students, setStudents] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { isConnected } = useDatabase()

  const fetchStudents = async () => {
    if (!isConnected) return
    
    try {
      setLoading(true)
      const data = await DatabaseService.getStudents()
      setStudents(data)
    } catch (err: any) {
      setError('Failed to fetch students')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const createStudent = async (studentData: any) => {
    if (!isConnected) return null
    
    try {
      const newStudent = await DatabaseService.createStudent(studentData)
      setStudents(prev => [...prev, newStudent])
      
      // Log the action
      await DatabaseService.logAction('CREATE', 'student', newStudent.id, null, newStudent)
      
      return newStudent
    } catch (err: any) {
      setError('Failed to create student')
      throw err
    }
  }

  const updateStudent = async (id: string, updates: any) => {
    if (!isConnected) return null
    
    try {
      const oldStudent = students.find(s => s.id === id)
      const updatedStudent = await DatabaseService.updateStudent(id, updates)
      setStudents(prev => prev.map(s => s.id === id ? updatedStudent : s))
      
      // Log the action
      await DatabaseService.logAction('UPDATE', 'student', id, oldStudent, updatedStudent)
      
      return updatedStudent
    } catch (err: any) {
      setError('Failed to update student')
      throw err
    }
  }

  const deleteStudent = async (id: string) => {
    if (!isConnected) return
    
    try {
      const oldStudent = students.find(s => s.id === id)
      await DatabaseService.deleteStudent(id)
      setStudents(prev => prev.filter(s => s.id !== id))
      
      // Log the action
      await DatabaseService.logAction('DELETE', 'student', id, oldStudent, null)
    } catch (err: any) {
      setError('Failed to delete student')
      throw err
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [isConnected])

  return {
    students,
    loading,
    error,
    createStudent,
    updateStudent,
    deleteStudent,
    refetch: fetchStudents
  }
}

export function useStaffData() {
  const [staff, setStaff] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { isConnected } = useDatabase()

  const fetchStaff = async () => {
    if (!isConnected) return
    
    try {
      setLoading(true)
      const data = await DatabaseService.getStaff()
      setStaff(data)
    } catch (err: any) {
      setError('Failed to fetch staff')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const createStaff = async (staffData: any) => {
    if (!isConnected) return null
    
    try {
      const newStaff = await DatabaseService.createStaff(staffData)
      setStaff(prev => [...prev, newStaff])
      return newStaff
    } catch (err: any) {
      setError('Failed to create staff member')
      throw err
    }
  }

  useEffect(() => {
    fetchStaff()
  }, [isConnected])

  return {
    staff,
    loading,
    error,
    createStaff,
    refetch: fetchStaff
  }
}
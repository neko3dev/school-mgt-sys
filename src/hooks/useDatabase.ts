import { useState, useEffect } from 'react'
import { DatabaseService } from '@/lib/supabase'

export function useDatabase() {
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    checkConnection()
  }, [])

  const checkConnection = async () => {
    try {
      setIsLoading(true)
      // Test connection by trying to fetch a simple query
      await DatabaseService.getStudents()
      setIsConnected(true)
      setError(null)
    } catch (err) {
      setIsConnected(false)
      setError('Database connection failed. Using offline mode.')
      console.warn('Database not connected, using mock data')
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

// Hook for students data
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
    } catch (err) {
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
      return newStudent
    } catch (err) {
      setError('Failed to create student')
      throw err
    }
  }

  const updateStudent = async (id: string, updates: any) => {
    if (!isConnected) return null
    
    try {
      const updatedStudent = await DatabaseService.updateStudent(id, updates)
      setStudents(prev => prev.map(s => s.id === id ? updatedStudent : s))
      return updatedStudent
    } catch (err) {
      setError('Failed to update student')
      throw err
    }
  }

  const deleteStudent = async (id: string) => {
    if (!isConnected) return
    
    try {
      await DatabaseService.deleteStudent(id)
      setStudents(prev => prev.filter(s => s.id !== id))
    } catch (err) {
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
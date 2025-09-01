import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database service functions
export class DatabaseService {
  // Students
  static async getStudents() {
    const { data, error } = await supabase
      .from('students')
      .select('*, guardians(*), classroom:classrooms(*)')
      .eq('status', 'active')
    
    if (error) throw error
    return data
  }

  static async createStudent(student: any) {
    const { data, error } = await supabase
      .from('students')
      .insert(student)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async updateStudent(id: string, updates: any) {
    const { data, error } = await supabase
      .from('students')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async deleteStudent(id: string) {
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }

  // Assessment Tasks
  static async getTasks() {
    const { data, error } = await supabase
      .from('sba_tasks')
      .select('*, subject:subjects(*), classroom:classrooms(*)')
    
    if (error) throw error
    return data
  }

  static async createTask(task: any) {
    const { data, error } = await supabase
      .from('sba_tasks')
      .insert(task)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async updateTask(id: string, updates: any) {
    const { data, error } = await supabase
      .from('sba_tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async deleteTask(id: string) {
    const { error } = await supabase
      .from('sba_tasks')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }

  // Finance
  static async getInvoices() {
    const { data, error } = await supabase
      .from('fee_invoices')
      .select('*, student:students(*)')
    
    if (error) throw error
    return data
  }

  static async createInvoice(invoice: any) {
    const { data, error } = await supabase
      .from('fee_invoices')
      .insert(invoice)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Attendance
  static async getAttendance(date?: string) {
    let query = supabase
      .from('attendance_records')
      .select('*, student:students(*)')
    
    if (date) {
      query = query.eq('date', date)
    }
    
    const { data, error } = await query
    if (error) throw error
    return data
  }

  static async markAttendance(record: any) {
    const { data, error } = await supabase
      .from('attendance_records')
      .upsert(record)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Transport
  static async getRoutes() {
    const { data, error } = await supabase
      .from('transport_routes')
      .select('*, stops:transport_stops(*)')
    
    if (error) throw error
    return data
  }

  static async createRoute(route: any) {
    const { data, error } = await supabase
      .from('transport_routes')
      .insert(route)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Staff
  static async getStaff() {
    const { data, error } = await supabase
      .from('teachers')
      .select('*')
    
    if (error) throw error
    return data
  }

  static async createStaff(staff: any) {
    const { data, error } = await supabase
      .from('teachers')
      .insert(staff)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Events
  static async getEvents() {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true })
    
    if (error) throw error
    return data
  }

  static async createEvent(event: any) {
    const { data, error } = await supabase
      .from('events')
      .insert(event)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Reports
  static async logExport(exportData: any) {
    const { data, error } = await supabase
      .from('export_logs')
      .insert(exportData)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Enhanced Database service with multi-tenant support
export class DatabaseService {
  private static async getCurrentTenantId(): Promise<string | null> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data } = await supabase
      .from('tenant_users')
      .select('tenant_id')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .maybeSingle()

    return data?.tenant_id || null
  }

  // Students
  static async getStudents() {
    const tenantId = await this.getCurrentTenantId()
    if (!tenantId) throw new Error('No tenant access')

    const { data, error } = await supabase
      .from('students')
      .select(`
        *,
        guardians(*),
        classroom:classrooms(*)
      `)
      .eq('tenant_id', tenantId)
      .eq('status', 'active')
      .order('name')
    
    if (error) throw error
    return data
  }

  static async createStudent(student: any) {
    const tenantId = await this.getCurrentTenantId()
    if (!tenantId) throw new Error('No tenant access')

    const { data, error } = await supabase
      .from('students')
      .insert({ ...student, tenant_id: tenantId })
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

  // Staff
  static async getStaff() {
    const tenantId = await this.getCurrentTenantId()
    if (!tenantId) throw new Error('No tenant access')

    const { data, error } = await supabase
      .from('staff')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('name')
    
    if (error) throw error
    return data
  }

  static async createStaff(staff: any) {
    const tenantId = await this.getCurrentTenantId()
    if (!tenantId) throw new Error('No tenant access')

    const { data, error } = await supabase
      .from('staff')
      .insert({ ...staff, tenant_id: tenantId })
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Assessment Tasks
  static async getTasks() {
    const tenantId = await this.getCurrentTenantId()
    if (!tenantId) throw new Error('No tenant access')

    const { data, error } = await supabase
      .from('sba_tasks')
      .select(`
        *,
        subject:subjects(*),
        classroom:classrooms(*),
        teacher:staff(*)
      `)
      .eq('tenant_id', tenantId)
      .order('due_date')
    
    if (error) throw error
    return data
  }

  static async createTask(task: any) {
    const tenantId = await this.getCurrentTenantId()
    if (!tenantId) throw new Error('No tenant access')

    const { data, error } = await supabase
      .from('sba_tasks')
      .insert({ ...task, tenant_id: tenantId })
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Finance
  static async getInvoices() {
    const tenantId = await this.getCurrentTenantId()
    if (!tenantId) throw new Error('No tenant access')

    const { data, error } = await supabase
      .from('fee_invoices')
      .select(`
        *,
        student:students(*),
        payments(*)
      `)
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }

  static async createInvoice(invoice: any) {
    const tenantId = await this.getCurrentTenantId()
    if (!tenantId) throw new Error('No tenant access')

    // Generate invoice number
    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`

    const { data, error } = await supabase
      .from('fee_invoices')
      .insert({ 
        ...invoice, 
        tenant_id: tenantId,
        invoice_number: invoiceNumber
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async recordPayment(payment: any) {
    const tenantId = await this.getCurrentTenantId()
    if (!tenantId) throw new Error('No tenant access')

    const { data, error } = await supabase
      .from('payments')
      .insert({ ...payment, tenant_id: tenantId })
      .select()
      .single()
    
    if (error) throw error

    // Update invoice paid amount
    const { error: updateError } = await supabase.rpc('update_invoice_balance', {
      invoice_id: payment.invoice_id,
      payment_amount: payment.amount
    })

    if (updateError) throw updateError
    return data
  }

  // Attendance
  static async getAttendance(date?: string) {
    const tenantId = await this.getCurrentTenantId()
    if (!tenantId) throw new Error('No tenant access')

    let query = supabase
      .from('attendance_records')
      .select(`
        *,
        student:students(*)
      `)
      .eq('tenant_id', tenantId)
    
    if (date) {
      query = query.eq('date', date)
    }
    
    const { data, error } = await query.order('date', { ascending: false })
    if (error) throw error
    return data
  }

  static async markAttendance(record: any) {
    const tenantId = await this.getCurrentTenantId()
    if (!tenantId) throw new Error('No tenant access')

    const { data, error } = await supabase
      .from('attendance_records')
      .upsert({ 
        ...record, 
        tenant_id: tenantId,
        recorded_at: new Date().toISOString()
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Events
  static async getEvents() {
    const tenantId = await this.getCurrentTenantId()
    if (!tenantId) throw new Error('No tenant access')

    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('start_date', { ascending: true })
    
    if (error) throw error
    return data
  }

  static async createEvent(event: any) {
    const tenantId = await this.getCurrentTenantId()
    if (!tenantId) throw new Error('No tenant access')

    const { data, error } = await supabase
      .from('events')
      .insert({ ...event, tenant_id: tenantId })
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Library
  static async getBooks() {
    const tenantId = await this.getCurrentTenantId()
    if (!tenantId) throw new Error('No tenant access')

    const { data, error } = await supabase
      .from('library_books')
      .select(`
        *,
        subject:subjects(*),
        issues:book_issues(*)
      `)
      .eq('tenant_id', tenantId)
      .order('title')
    
    if (error) throw error
    return data
  }

  static async issueBook(issue: any) {
    const tenantId = await this.getCurrentTenantId()
    if (!tenantId) throw new Error('No tenant access')

    const { data, error } = await supabase
      .from('book_issues')
      .insert({ ...issue, tenant_id: tenantId })
      .select()
      .single()
    
    if (error) throw error

    // Update book availability
    await supabase.rpc('update_book_availability', {
      book_id: issue.book_id,
      change: -1
    })

    return data
  }

  // Welfare
  static async getWelfareCases() {
    const tenantId = await this.getCurrentTenantId()
    if (!tenantId) throw new Error('No tenant access')

    const { data, error } = await supabase
      .from('welfare_cases')
      .select(`
        *,
        student:students(*),
        assigned_staff:staff(*)
      `)
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }

  // Assets
  static async getAssets() {
    const tenantId = await this.getCurrentTenantId()
    if (!tenantId) throw new Error('No tenant access')

    const { data, error } = await supabase
      .from('assets')
      .select(`
        *,
        maintenance:maintenance_records(*)
      `)
      .eq('tenant_id', tenantId)
      .order('name')
    
    if (error) throw error
    return data
  }

  // Communications
  static async getMessages() {
    const tenantId = await this.getCurrentTenantId()
    if (!tenantId) throw new Error('No tenant access')

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }

  static async sendMessage(message: any) {
    const tenantId = await this.getCurrentTenantId()
    if (!tenantId) throw new Error('No tenant access')

    const { data, error } = await supabase
      .from('messages')
      .insert({ ...message, tenant_id: tenantId })
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Transport Routes
  static async getTransportRoutes() {
    const tenantId = await this.getCurrentTenantId()
    if (!tenantId) throw new Error('No tenant access')

    const { data, error } = await supabase
      .from('transport_routes')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('name')

    if (error) throw error
    return data
  }

  static async createTransportRoute(route: any) {
    const tenantId = await this.getCurrentTenantId()
    if (!tenantId) throw new Error('No tenant access')

    const { data, error } = await supabase
      .from('transport_routes')
      .insert({ ...route, tenant_id: tenantId })
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Classrooms
  static async getClassrooms() {
    const tenantId = await this.getCurrentTenantId()
    if (!tenantId) throw new Error('No tenant access')

    const { data, error } = await supabase
      .from('classrooms')
      .select(`
        *,
        teacher:staff(*)
      `)
      .eq('tenant_id', tenantId)
      .order('grade', { ascending: true })

    if (error) throw error
    return data
  }

  // Subjects
  static async getSubjects() {
    const tenantId = await this.getCurrentTenantId()
    if (!tenantId) throw new Error('No tenant access')

    const { data, error } = await supabase
      .from('subjects')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('name')

    if (error) throw error
    return data
  }

  // Guardians
  static async getGuardians(studentId?: string) {
    const tenantId = await this.getCurrentTenantId()
    if (!tenantId) throw new Error('No tenant access')

    let query = supabase
      .from('guardians')
      .select(`
        *,
        student:students(*)
      `)
      .eq('tenant_id', tenantId)

    if (studentId) {
      query = query.eq('student_id', studentId)
    }

    const { data, error } = await query
    if (error) throw error
    return data
  }

  // Audit logging
  static async logAction(action: string, entityType: string, entityId: string, oldValues?: any, newValues?: any) {
    const tenantId = await this.getCurrentTenantId()
    if (!tenantId) return

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase
      .from('audit_logs')
      .insert({
        tenant_id: tenantId,
        user_id: user.id,
        action,
        entity_type: entityType,
        entity_id: entityId,
        old_values: oldValues,
        new_values: newValues
      })
  }

  // Tenant management
  static async createTenant(tenantData: any) {
    const { data, error } = await supabase
      .from('tenants')
      .insert(tenantData)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async getTenantByCode(code: string) {
    const { data, error } = await supabase
      .from('tenants')
      .select('*')
      .eq('code', code)
      .single()
    
    if (error) throw error
    return data
  }

  // Subscription management
  static async getSubscription(tenantId: string) {
    const { data, error } = await supabase
      .from('tenant_subscriptions')
      .select(`
        *,
        plan:subscription_plans(*)
      `)
      .eq('tenant_id', tenantId)
      .single()
    
    if (error) throw error
    return data
  }

  static async updateSubscription(tenantId: string, updates: any) {
    const { data, error } = await supabase
      .from('tenant_subscriptions')
      .update(updates)
      .eq('tenant_id', tenantId)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}

// Real-time subscriptions
export const subscribeToChanges = (table: string, callback: (payload: any) => void) => {
  return supabase
    .channel(`${table}_changes`)
    .on('postgres_changes', 
      { event: '*', schema: 'public', table }, 
      callback
    )
    .subscribe()
}

// File upload service
export class FileService {
  static async uploadFile(file: File, bucket: string, path: string) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file)
    
    if (error) throw error
    return data
  }

  static async getFileUrl(bucket: string, path: string) {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path)
    
    return data.publicUrl
  }

  static async deleteFile(bucket: string, path: string) {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path])
    
    if (error) throw error
  }
}

// Authentication helpers
export class AuthService {
  static async signUp(email: string, password: string, userData: any) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })
    
    if (error) throw error
    return data
  }

  static async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) throw error
    return data
  }

  static async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  static async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  }

  static async updateProfile(updates: any) {
    const { data, error } = await supabase.auth.updateUser({
      data: updates
    })
    
    if (error) throw error
    return data
  }
}

// Subscription and billing
export class SubscriptionService {
  static async createCheckoutSession(priceId: string, tenantId: string) {
    const { data, error } = await supabase.functions.invoke('create-checkout-session', {
      body: { priceId, tenantId }
    })
    
    if (error) throw error
    return data
  }

  static async createPortalSession(customerId: string) {
    const { data, error } = await supabase.functions.invoke('create-portal-session', {
      body: { customerId }
    })
    
    if (error) throw error
    return data
  }

  static async cancelSubscription(subscriptionId: string) {
    const { data, error } = await supabase.functions.invoke('cancel-subscription', {
      body: { subscriptionId }
    })
    
    if (error) throw error
    return data
  }
}
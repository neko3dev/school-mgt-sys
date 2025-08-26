// Core system types for the Kenyan CBC School Management System

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  tenantId: string
  avatar?: string
}

export type UserRole = 
  | 'admin' 
  | 'bursar' 
  | 'teacher' 
  | 'class_teacher' 
  | 'hod' 
  | 'welfare_officer' 
  | 'dpo' 
  | 'parent' 
  | 'student' 
  | 'auditor' 
  | 'driver' 
  | 'matron'

export interface Tenant {
  id: string
  name: string
  code: string
  county: string
  subcounty: string
  settings: TenantSettings
}

export interface TenantSettings {
  academic_year: string
  current_term: number
  school_logo?: string
  school_motto?: string
  brand_colors: string[]
  timezone: string
  language: string
}

export interface Learner {
  id: string
  upi: string // NEMIS UPI
  kemis_id?: string // Future KEMIS/Maisha Namba
  admission_no: string
  name: string
  dob: string
  sex: 'M' | 'F'
  special_needs?: boolean
  status: 'active' | 'transferred' | 'graduated' | 'dropped'
  classroom_id: string
  guardians: Guardian[]
  created_at: string
  updated_at: string
}

export interface Guardian {
  id: string
  name: string
  relation: 'father' | 'mother' | 'guardian' | 'other'
  phone: string
  email?: string
  national_id: string
  consent_flags: ConsentRecord[]
  preferred_channel: 'sms' | 'email' | 'whatsapp'
}

export interface ConsentRecord {
  id: string
  data_use: string
  lawful_basis: string
  granted_at: string
  expires_at?: string
  notes?: string
}

export interface Classroom {
  id: string
  academic_year: string
  grade: number // 1-9 for CBC
  stream: string // A, B, C, etc.
  capacity: number
  teacher_id?: string // Class teacher
  subjects: ClassroomSubject[]
}

export interface ClassroomSubject {
  id: string
  subject_id: string
  teacher_id: string
  periods_per_week: number
}

export interface Subject {
  id: string
  code: string
  name: string
  grade_band: 'lower_primary' | 'upper_primary' | 'junior_secondary'
  learning_area: string
}

// CBC Curriculum Structure
export interface OutcomeMap {
  id: string
  version: string
  learning_area: string
  strand: string
  sub_strand: string
  slo_code: string // Specific Learning Outcome code
  descriptors: string[]
  grade_level: number
}

export interface SBATask {
  id: string
  title: string
  description: string
  subject_id: string
  classroom_id: string
  term: number
  academic_year: string
  outcome_refs: string[] // References to OutcomeMap IDs
  rubric_levels: RubricLevel[]
  weight: number // Percentage weight in final grade
  due_date: string
  evidence_types: EvidenceType[]
  created_by: string
  created_at: string
}

export interface RubricLevel {
  level: ProficiencyLevel
  description: string
  score_range: [number, number]
}

export type ProficiencyLevel = 'emerging' | 'approaching' | 'proficient' | 'exceeding'

export type EvidenceType = 'photo' | 'video' | 'audio' | 'document' | 'presentation'

export interface AssessmentEvidence {
  id: string
  task_id: string
  learner_id: string
  teacher_id: string
  proficiency_level: ProficiencyLevel
  score?: number
  comment: string
  files: EvidenceFile[]
  captured_at: string
  moderated_by?: string
  moderated_at?: string
}

export interface EvidenceFile {
  id: string
  filename: string
  type: EvidenceType
  url: string
  size: number
  uploaded_at: string
}

// Attendance System
export interface AttendanceRecord {
  id: string
  date: string
  type: 'homeroom' | 'lesson' | 'activity'
  learner_id: string
  lesson_id?: string
  status: 'present' | 'absent' | 'late' | 'excused'
  reason?: string
  recorded_by: string
  recorded_at: string
}

// Transport System
export interface TransportRoute {
  id: string
  name: string
  vehicle_id: string
  driver_id: string
  matron_id?: string
  stops: TransportStop[]
  active: boolean
}

export interface TransportStop {
  id: string
  route_id: string
  order: number
  name: string
  pickup_time: string
  dropoff_time: string
  coordinates?: [number, number]
}

export interface TransportEvent {
  id: string
  learner_id: string
  route_id: string
  stop_id: string
  type: 'board' | 'alight'
  method: 'qr' | 'nfc' | 'manual'
  recorded_at: string
  recorded_by: string
}

// Finance System
export interface FeeStructure {
  id: string
  academic_year: string
  grade: number
  items: FeeItem[]
}

export interface FeeItem {
  id: string
  name: string
  amount: number
  term?: number // null for yearly fees
  category: 'tuition' | 'meals' | 'transport' | 'activities' | 'other'
  mandatory: boolean
}

export interface FeeInvoice {
  id: string
  learner_id: string
  academic_year: string
  term: number
  items: InvoiceItem[]
  total: number
  balance: number
  due_date: string
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  created_at: string
}

export interface InvoiceItem {
  fee_item_id: string
  name: string
  amount: number
  waiver_amount?: number
}

export interface FeePayment {
  id: string
  invoice_id: string
  channel: 'mpesa' | 'bank' | 'cash'
  mpesa_ref?: string
  amount: number
  allocations: PaymentAllocation[]
  received_at: string
  reconciled_at?: string
  reconciled_by?: string
}

export interface PaymentAllocation {
  fee_item_id: string
  amount: number
}

// Staff Management
export interface Teacher {
  id: string
  tsc_no: string
  name: string
  email: string
  phone: string
  subjects: string[] // Subject IDs
  qualifications: Qualification[]
  employment_date: string
  status: 'active' | 'leave' | 'terminated'
}

export interface Qualification {
  id: string
  title: string
  institution: string
  year: number
  certificate_url?: string
}

// Welfare & SNE
export interface WelfareCase {
  id: string
  learner_id: string
  category: 'discipline' | 'counseling' | 'health' | 'family' | 'academic'
  priority: 'low' | 'medium' | 'high' | 'critical'
  restricted_roles: UserRole[] // Who can access full details
  summary: string // Visible to class teachers
  notes_encrypted: string // Full details, encrypted
  status: 'open' | 'in_progress' | 'resolved' | 'escalated'
  assigned_to?: string
  opened_by: string
  opened_at: string
  closed_at?: string
}

export interface SNEPlan {
  id: string
  learner_id: string
  stage: 'identification' | 'assessment' | 'planning' | 'implementation' | 'review'
  accommodations: Accommodation[]
  review_date: string
  created_by: string
  created_at: string
  updated_at: string
}

export interface Accommodation {
  id: string
  type: 'extra_time' | 'assistive_tech' | 'modified_tasks' | 'alternative_assessment' | 'other'
  description: string
  subjects?: string[] // Apply to specific subjects or all
}

// Reporting & Export System
export interface Report {
  id: string
  name: string
  description: string
  type: 'report_card' | 'attendance' | 'finance' | 'compliance' | 'analytics'
  template_id: string
  filters: ReportFilters
  format: 'pdf' | 'xlsx' | 'csv' | 'json'
  status: 'pending' | 'generating' | 'completed' | 'failed'
  file_url?: string
  file_hash?: string
  created_by: string
  created_at: string
  completed_at?: string
}

export interface ReportFilters {
  academic_year?: string
  term?: number
  grade?: number
  classroom_id?: string
  learner_ids?: string[]
  date_range?: [string, string]
  subjects?: string[]
  [key: string]: any
}

export interface ExportLog {
  id: string
  actor_id: string
  scope: string
  filters_json: string
  format: 'pdf' | 'xlsx' | 'csv' | 'json'
  file_hash: string
  file_size: number
  created_at: string
}

// System Audit
export interface AuditEvent {
  id: string
  actor_id: string
  action: string
  entity_type: string
  entity_id: string
  changes?: Record<string, any>
  metadata?: Record<string, any>
  timestamp: string
  ip_address?: string
  user_agent?: string
}

// M-PESA Integration
export interface MPESATransaction {
  id: string
  transaction_id: string
  amount: number
  phone_number: string
  reference: string
  description: string
  status: 'pending' | 'success' | 'failed' | 'cancelled'
  callback_data?: any
  created_at: string
  completed_at?: string
}

// Communication System
export interface Message {
  id: string
  type: 'sms' | 'email' | 'push' | 'whatsapp'
  recipients: MessageRecipient[]
  template_id?: string
  subject?: string
  content: string
  status: 'draft' | 'sending' | 'sent' | 'failed'
  scheduled_at?: string
  sent_at?: string
  created_by: string
}

export interface MessageRecipient {
  id: string
  type: 'learner' | 'guardian' | 'teacher'
  contact: string // phone/email
  status: 'pending' | 'delivered' | 'failed'
  delivered_at?: string
}

export interface MessageTemplate {
  id: string
  name: string
  type: 'sms' | 'email' | 'push' | 'whatsapp'
  subject?: string
  content: string
  variables: string[] // {{learner_name}}, {{amount}}, etc.
  category: string
}

// DPO & Compliance
export interface ProcessingRecord {
  id: string
  data_category: string
  processing_purpose: string
  lawful_basis: string
  data_subjects: string[]
  retention_period: string
  security_measures: string[]
  third_parties?: string[]
  created_at: string
  updated_at: string
}

export interface DataSubjectRequest {
  id: string
  type: 'access' | 'rectification' | 'erasure' | 'portability' | 'restriction'
  requester_name: string
  requester_email: string
  subject_id: string // Learner/Guardian ID
  description: string
  status: 'submitted' | 'processing' | 'completed' | 'rejected'
  response?: string
  files?: string[]
  submitted_at: string
  completed_at?: string
}

// Analytics & KPIs
export interface KPIMetric {
  id: string
  name: string
  value: number
  unit: string
  period: 'daily' | 'weekly' | 'monthly' | 'termly' | 'yearly'
  date: string
  metadata?: Record<string, any>
}

export interface Dashboard {
  id: string
  name: string
  role: UserRole
  widgets: DashboardWidget[]
  layout: any // Grid layout configuration
}

export interface DashboardWidget {
  id: string
  type: 'metric' | 'chart' | 'table' | 'calendar' | 'alert'
  title: string
  config: any
  position: { x: number; y: number; w: number; h: number }
}
/*
  # Multi-tenant School Management System Schema

  1. New Tables
    - `tenants` - School organizations
    - `tenant_subscriptions` - Subscription management
    - `tenant_users` - User-tenant relationships
    - `audit_logs` - System audit trail
    - `system_settings` - Global configuration

  2. Security
    - Enable RLS on all tables
    - Tenant isolation policies
    - Role-based access control
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Tenants table (Schools)
CREATE TABLE IF NOT EXISTS tenants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text UNIQUE NOT NULL,
  county text NOT NULL,
  subcounty text NOT NULL,
  email text NOT NULL,
  phone text,
  address text,
  logo_url text,
  motto text,
  website text,
  status text DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'trial', 'cancelled')),
  trial_ends_at timestamptz,
  settings jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Subscription plans
CREATE TABLE IF NOT EXISTS subscription_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price_monthly numeric(10,2) NOT NULL,
  price_yearly numeric(10,2),
  max_students integer,
  max_staff integer,
  features jsonb DEFAULT '[]',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Tenant subscriptions
CREATE TABLE IF NOT EXISTS tenant_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE,
  plan_id uuid REFERENCES subscription_plans(id),
  status text DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'past_due', 'trialing')),
  current_period_start timestamptz NOT NULL,
  current_period_end timestamptz NOT NULL,
  stripe_subscription_id text,
  stripe_customer_id text,
  trial_end timestamptz,
  cancel_at_period_end boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enhanced user profiles with tenant relationships
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text NOT NULL,
  avatar_url text,
  phone text,
  role text DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin', 'teacher', 'bursar', 'parent', 'student')),
  is_active boolean DEFAULT true,
  last_sign_in_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User-tenant relationships (multi-tenant support)
CREATE TABLE IF NOT EXISTS tenant_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE,
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('owner', 'admin', 'teacher', 'bursar', 'parent', 'student')),
  permissions jsonb DEFAULT '[]',
  is_active boolean DEFAULT true,
  invited_at timestamptz DEFAULT now(),
  joined_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(tenant_id, user_id)
);

-- Students table with proper relationships
CREATE TABLE IF NOT EXISTS students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE,
  upi text NOT NULL,
  admission_no text NOT NULL,
  name text NOT NULL,
  date_of_birth date NOT NULL,
  gender text CHECK (gender IN ('M', 'F')),
  special_needs boolean DEFAULT false,
  status text DEFAULT 'active' CHECK (status IN ('active', 'transferred', 'graduated', 'dropped')),
  classroom_id uuid,
  medical_info jsonb DEFAULT '{}',
  emergency_contacts jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(tenant_id, upi),
  UNIQUE(tenant_id, admission_no)
);

-- Guardians table
CREATE TABLE IF NOT EXISTS guardians (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE,
  student_id uuid REFERENCES students(id) ON DELETE CASCADE,
  name text NOT NULL,
  relationship text NOT NULL CHECK (relationship IN ('father', 'mother', 'guardian', 'other')),
  phone text NOT NULL,
  email text,
  national_id text,
  occupation text,
  workplace text,
  is_primary boolean DEFAULT false,
  consent_records jsonb DEFAULT '[]',
  preferred_communication text DEFAULT 'sms' CHECK (preferred_communication IN ('sms', 'email', 'whatsapp')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Classrooms
CREATE TABLE IF NOT EXISTS classrooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE,
  name text NOT NULL,
  grade integer NOT NULL CHECK (grade BETWEEN 1 AND 12),
  stream text NOT NULL,
  capacity integer DEFAULT 40,
  class_teacher_id uuid,
  academic_year text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  UNIQUE(tenant_id, grade, stream, academic_year)
);

-- Staff/Teachers
CREATE TABLE IF NOT EXISTS staff (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE,
  user_id uuid REFERENCES user_profiles(id),
  tsc_number text UNIQUE,
  employee_number text,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  role text DEFAULT 'teacher' CHECK (role IN ('head_teacher', 'deputy_head', 'teacher', 'bursar', 'secretary', 'support_staff')),
  subjects jsonb DEFAULT '[]',
  qualifications jsonb DEFAULT '[]',
  employment_date date,
  contract_type text DEFAULT 'permanent' CHECK (contract_type IN ('permanent', 'contract', 'volunteer')),
  salary numeric(10,2),
  status text DEFAULT 'active' CHECK (status IN ('active', 'on_leave', 'terminated')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Subjects
CREATE TABLE IF NOT EXISTS subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE,
  code text NOT NULL,
  name text NOT NULL,
  grade_band text CHECK (grade_band IN ('lower_primary', 'upper_primary', 'junior_secondary')),
  learning_area text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  UNIQUE(tenant_id, code)
);

-- SBA Tasks (CBC Assessments)
CREATE TABLE IF NOT EXISTS sba_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  subject_id uuid REFERENCES subjects(id),
  classroom_id uuid REFERENCES classrooms(id),
  teacher_id uuid REFERENCES staff(id),
  term integer CHECK (term BETWEEN 1 AND 3),
  academic_year text NOT NULL,
  weight numeric(5,2) DEFAULT 25.00,
  due_date timestamptz,
  rubric_levels jsonb DEFAULT '[]',
  evidence_types jsonb DEFAULT '[]',
  outcome_refs jsonb DEFAULT '[]',
  status text DEFAULT 'active' CHECK (status IN ('draft', 'active', 'completed', 'archived')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Assessment Evidence
CREATE TABLE IF NOT EXISTS assessment_evidence (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE,
  task_id uuid REFERENCES sba_tasks(id) ON DELETE CASCADE,
  student_id uuid REFERENCES students(id) ON DELETE CASCADE,
  teacher_id uuid REFERENCES staff(id),
  proficiency_level text CHECK (proficiency_level IN ('emerging', 'approaching', 'proficient', 'exceeding')),
  score numeric(4,2),
  comment text,
  evidence_files jsonb DEFAULT '[]',
  is_moderated boolean DEFAULT false,
  moderated_by uuid REFERENCES staff(id),
  moderated_at timestamptz,
  captured_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Fee Structures
CREATE TABLE IF NOT EXISTS fee_structures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE,
  academic_year text NOT NULL,
  grade integer NOT NULL,
  items jsonb NOT NULL DEFAULT '[]',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  UNIQUE(tenant_id, academic_year, grade)
);

-- Fee Invoices
CREATE TABLE IF NOT EXISTS fee_invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE,
  student_id uuid REFERENCES students(id) ON DELETE CASCADE,
  invoice_number text NOT NULL,
  academic_year text NOT NULL,
  term integer CHECK (term BETWEEN 1 AND 3),
  items jsonb NOT NULL DEFAULT '[]',
  total_amount numeric(10,2) NOT NULL,
  paid_amount numeric(10,2) DEFAULT 0,
  balance numeric(10,2) GENERATED ALWAYS AS (total_amount - paid_amount) STORED,
  due_date date,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(tenant_id, invoice_number)
);

-- Payments
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE,
  invoice_id uuid REFERENCES fee_invoices(id) ON DELETE CASCADE,
  amount numeric(10,2) NOT NULL,
  payment_method text CHECK (payment_method IN ('mpesa', 'bank', 'cash', 'cheque')),
  reference_number text,
  mpesa_receipt_number text,
  transaction_date timestamptz DEFAULT now(),
  status text DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  notes text,
  recorded_by uuid REFERENCES user_profiles(id),
  created_at timestamptz DEFAULT now()
);

-- Attendance Records
CREATE TABLE IF NOT EXISTS attendance_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE,
  student_id uuid REFERENCES students(id) ON DELETE CASCADE,
  date date NOT NULL,
  session_type text DEFAULT 'morning' CHECK (session_type IN ('morning', 'afternoon', 'lesson')),
  status text NOT NULL CHECK (status IN ('present', 'absent', 'late', 'excused')),
  reason text,
  recorded_by uuid REFERENCES staff(id),
  recorded_at timestamptz DEFAULT now(),
  UNIQUE(tenant_id, student_id, date, session_type)
);

-- Transport Routes
CREATE TABLE IF NOT EXISTS transport_routes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE,
  name text NOT NULL,
  vehicle_registration text,
  driver_name text,
  driver_phone text,
  matron_name text,
  matron_phone text,
  stops jsonb DEFAULT '[]',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Transport Events (Boarding/Alighting)
CREATE TABLE IF NOT EXISTS transport_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE,
  student_id uuid REFERENCES students(id) ON DELETE CASCADE,
  route_id uuid REFERENCES transport_routes(id) ON DELETE CASCADE,
  event_type text CHECK (event_type IN ('board', 'alight')),
  stop_name text,
  event_time timestamptz DEFAULT now(),
  recorded_by text,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Communications
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE,
  type text CHECK (type IN ('sms', 'email', 'push', 'whatsapp')),
  subject text,
  content text NOT NULL,
  recipients jsonb NOT NULL DEFAULT '[]',
  template_id uuid,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'sending', 'sent', 'failed')),
  scheduled_at timestamptz,
  sent_at timestamptz,
  delivery_stats jsonb DEFAULT '{}',
  created_by uuid REFERENCES user_profiles(id),
  created_at timestamptz DEFAULT now()
);

-- Message Templates
CREATE TABLE IF NOT EXISTS message_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE,
  name text NOT NULL,
  type text CHECK (type IN ('sms', 'email', 'push', 'whatsapp')),
  subject text,
  content text NOT NULL,
  variables jsonb DEFAULT '[]',
  category text DEFAULT 'general',
  is_active boolean DEFAULT true,
  created_by uuid REFERENCES user_profiles(id),
  created_at timestamptz DEFAULT now()
);

-- Library Books
CREATE TABLE IF NOT EXISTS library_books (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE,
  title text NOT NULL,
  author text,
  isbn text,
  category text DEFAULT 'textbook',
  subject_id uuid REFERENCES subjects(id),
  grade_level integer,
  copies_total integer DEFAULT 1,
  copies_available integer DEFAULT 1,
  location text,
  status text DEFAULT 'active' CHECK (status IN ('active', 'damaged', 'lost', 'retired')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Book Issues
CREATE TABLE IF NOT EXISTS book_issues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE,
  book_id uuid REFERENCES library_books(id) ON DELETE CASCADE,
  student_id uuid REFERENCES students(id) ON DELETE CASCADE,
  issued_date date DEFAULT CURRENT_DATE,
  due_date date NOT NULL,
  returned_date date,
  status text DEFAULT 'issued' CHECK (status IN ('issued', 'returned', 'overdue', 'lost')),
  issued_by uuid REFERENCES staff(id),
  returned_to uuid REFERENCES staff(id),
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Events
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  event_type text DEFAULT 'academic' CHECK (event_type IN ('academic', 'sports', 'cultural', 'meeting', 'social')),
  start_date timestamptz NOT NULL,
  end_date timestamptz,
  location text,
  organizer text,
  budget numeric(10,2) DEFAULT 0,
  attendees_expected integer DEFAULT 0,
  status text DEFAULT 'planned' CHECK (status IN ('planned', 'confirmed', 'cancelled', 'completed')),
  created_by uuid REFERENCES user_profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Welfare Cases
CREATE TABLE IF NOT EXISTS welfare_cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE,
  student_id uuid REFERENCES students(id) ON DELETE CASCADE,
  case_type text CHECK (case_type IN ('discipline', 'counseling', 'health', 'family', 'academic')),
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  title text NOT NULL,
  description text,
  status text DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'escalated')),
  assigned_to uuid REFERENCES staff(id),
  opened_by uuid REFERENCES staff(id),
  opened_at timestamptz DEFAULT now(),
  closed_at timestamptz,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- SNE Plans
CREATE TABLE IF NOT EXISTS sne_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE,
  student_id uuid REFERENCES students(id) ON DELETE CASCADE,
  stage text DEFAULT 'identification' CHECK (stage IN ('identification', 'assessment', 'planning', 'implementation', 'review')),
  accommodations jsonb DEFAULT '[]',
  goals jsonb DEFAULT '[]',
  review_date date,
  created_by uuid REFERENCES staff(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Assets/Inventory
CREATE TABLE IF NOT EXISTS assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE,
  name text NOT NULL,
  category text DEFAULT 'equipment',
  serial_number text,
  location text,
  purchase_date date,
  purchase_cost numeric(10,2),
  current_value numeric(10,2),
  condition text DEFAULT 'good' CHECK (condition IN ('excellent', 'good', 'fair', 'poor')),
  warranty_expiry date,
  status text DEFAULT 'active' CHECK (status IN ('active', 'maintenance', 'retired', 'disposed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Maintenance Records
CREATE TABLE IF NOT EXISTS maintenance_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE,
  asset_id uuid REFERENCES assets(id) ON DELETE CASCADE,
  maintenance_type text CHECK (maintenance_type IN ('preventive', 'corrective', 'emergency')),
  description text NOT NULL,
  scheduled_date date,
  completed_date date,
  cost numeric(10,2) DEFAULT 0,
  technician text,
  status text DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE,
  user_id uuid REFERENCES user_profiles(id),
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid,
  old_values jsonb,
  new_values jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- System Settings
CREATE TABLE IF NOT EXISTS system_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE,
  category text NOT NULL,
  settings jsonb NOT NULL DEFAULT '{}',
  updated_by uuid REFERENCES user_profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(tenant_id, category)
);

-- Enable Row Level Security
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE guardians ENABLE ROW LEVEL SECURITY;
ALTER TABLE classrooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE sba_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_structures ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE transport_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE transport_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE library_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE welfare_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE sne_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Tenant Isolation

-- Tenants: Users can only see their own tenant
CREATE POLICY "Users can view own tenant" ON tenants
  FOR SELECT USING (
    id IN (
      SELECT tenant_id FROM tenant_users 
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

-- User Profiles: Users can view their own profile
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (id = auth.uid());

-- Tenant Users: Users can view relationships for their tenants
CREATE POLICY "Users can view tenant relationships" ON tenant_users
  FOR SELECT USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_users 
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

-- Generic tenant isolation policy for all tenant-scoped tables
DO $$
DECLARE
  table_name text;
  tables text[] := ARRAY[
    'students', 'guardians', 'classrooms', 'staff', 'subjects', 
    'sba_tasks', 'assessment_evidence', 'fee_structures', 'fee_invoices', 
    'payments', 'attendance_records', 'transport_routes', 'transport_events',
    'messages', 'message_templates', 'library_books', 'book_issues', 
    'events', 'welfare_cases', 'sne_plans', 'assets', 'maintenance_records',
    'audit_logs', 'system_settings'
  ];
BEGIN
  FOREACH table_name IN ARRAY tables
  LOOP
    -- SELECT policy
    EXECUTE format('
      CREATE POLICY "Tenant isolation for %I" ON %I
        FOR SELECT USING (
          tenant_id IN (
            SELECT tenant_id FROM tenant_users 
            WHERE user_id = auth.uid() AND is_active = true
          )
        )
    ', table_name, table_name);
    
    -- INSERT policy
    EXECUTE format('
      CREATE POLICY "Tenant isolation insert for %I" ON %I
        FOR INSERT WITH CHECK (
          tenant_id IN (
            SELECT tenant_id FROM tenant_users 
            WHERE user_id = auth.uid() AND is_active = true
          )
        )
    ', table_name, table_name);
    
    -- UPDATE policy
    EXECUTE format('
      CREATE POLICY "Tenant isolation update for %I" ON %I
        FOR UPDATE USING (
          tenant_id IN (
            SELECT tenant_id FROM tenant_users 
            WHERE user_id = auth.uid() AND is_active = true
          )
        )
    ', table_name, table_name);
    
    -- DELETE policy
    EXECUTE format('
      CREATE POLICY "Tenant isolation delete for %I" ON %I
        FOR DELETE USING (
          tenant_id IN (
            SELECT tenant_id FROM tenant_users 
            WHERE user_id = auth.uid() AND is_active = true
          )
        )
    ', table_name, table_name);
  END LOOP;
END $$;

-- Functions for common operations

-- Function to get user's current tenant
CREATE OR REPLACE FUNCTION get_user_tenant_id()
RETURNS uuid
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT tenant_id FROM tenant_users 
  WHERE user_id = auth.uid() AND is_active = true 
  LIMIT 1;
$$;

-- Function to check if user has permission
CREATE OR REPLACE FUNCTION user_has_permission(permission_name text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM tenant_users tu
    WHERE tu.user_id = auth.uid() 
    AND tu.is_active = true
    AND (
      tu.role = 'owner' 
      OR tu.role = 'admin'
      OR tu.permissions ? permission_name
    )
  );
$$;

-- Triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers to relevant tables
DO $$
DECLARE
  table_name text;
  tables text[] := ARRAY[
    'tenants', 'tenant_subscriptions', 'user_profiles', 'students', 
    'guardians', 'classrooms', 'staff', 'sba_tasks', 'fee_invoices',
    'transport_routes', 'events', 'welfare_cases', 'sne_plans', 
    'assets', 'system_settings'
  ];
BEGIN
  FOREACH table_name IN ARRAY tables
  LOOP
    EXECUTE format('
      CREATE TRIGGER update_%I_updated_at 
      BEFORE UPDATE ON %I 
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
    ', table_name, table_name);
  END LOOP;
END $$;
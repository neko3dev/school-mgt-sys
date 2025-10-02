/*
  # Seed Initial Data for Multi-tenant System

  1. Subscription Plans
  2. Demo Tenant (Karagita Primary School)
  3. Demo Users and Relationships
  4. Sample Academic Data
*/

-- Insert subscription plans
INSERT INTO subscription_plans (id, name, description, price_monthly, price_yearly, max_students, max_staff, features) VALUES
(
  gen_random_uuid(),
  'Starter',
  'Perfect for small primary schools',
  15000.00,
  150000.00,
  200,
  20,
  '["basic_cbc_assessment", "mpesa_integration", "standard_reports", "email_support"]'
),
(
  gen_random_uuid(),
  'Professional',
  'Ideal for medium-sized schools',
  35000.00,
  350000.00,
  800,
  80,
  '["advanced_cbc_tools", "full_mpesa_integration", "all_reports", "transport_management", "priority_support", "analytics"]'
),
(
  gen_random_uuid(),
  'Enterprise',
  'For large schools and institutions',
  75000.00,
  750000.00,
  NULL,
  NULL,
  '["unlimited_students", "multi_campus", "custom_integrations", "dedicated_support", "training", "sla_guarantee"]'
);

-- Create demo tenant (Karagita Primary School)
INSERT INTO tenants (id, name, code, county, subcounty, email, phone, address, motto, status, trial_ends_at) VALUES
(
  'karagita-primary-demo',
  'Karagita Primary School',
  '01-01-001-001',
  'Nairobi',
  'Dagoretti North',
  'admin@karagita-primary.ac.ke',
  '+254722123456',
  'P.O. Box 12345, Nairobi',
  'Excellence Through Education',
  'trial',
  now() + interval '30 days'
);

-- Create demo subscription
INSERT INTO tenant_subscriptions (tenant_id, plan_id, status, current_period_start, current_period_end, trial_end) VALUES
(
  'karagita-primary-demo',
  (SELECT id FROM subscription_plans WHERE name = 'Professional' LIMIT 1),
  'trialing',
  now(),
  now() + interval '1 month',
  now() + interval '30 days'
);

-- Insert subjects for CBC curriculum
INSERT INTO subjects (tenant_id, code, name, grade_band, learning_area) VALUES
('karagita-primary-demo', 'ENG', 'English', 'lower_primary', 'Languages'),
('karagita-primary-demo', 'KIS', 'Kiswahili', 'lower_primary', 'Languages'),
('karagita-primary-demo', 'MAT', 'Mathematics', 'lower_primary', 'Mathematical Activities'),
('karagita-primary-demo', 'ENV', 'Environmental Activities', 'lower_primary', 'Environmental Activities'),
('karagita-primary-demo', 'CRE', 'Christian Religious Education', 'lower_primary', 'Religious Education'),
('karagita-primary-demo', 'IRE', 'Islamic Religious Education', 'lower_primary', 'Religious Education'),
('karagita-primary-demo', 'CA', 'Creative Arts', 'lower_primary', 'Creative Arts'),
('karagita-primary-demo', 'PE', 'Physical Education', 'lower_primary', 'Physical and Health Education');

-- Insert classrooms
INSERT INTO classrooms (tenant_id, name, grade, stream, academic_year, class_teacher_id) VALUES
('karagita-primary-demo', 'Grade 1A', 1, 'A', '2024', NULL),
('karagita-primary-demo', 'Grade 1B', 1, 'B', '2024', NULL),
('karagita-primary-demo', 'Grade 2A', 2, 'A', '2024', NULL),
('karagita-primary-demo', 'Grade 3A', 3, 'A', '2024', NULL),
('karagita-primary-demo', 'Grade 3B', 3, 'B', '2024', NULL);

-- Insert fee structure for Grade 1
INSERT INTO fee_structures (tenant_id, academic_year, grade, items) VALUES
('karagita-primary-demo', '2024', 1, '[
  {"name": "Tuition Fee", "amount": 12000, "term": null, "category": "tuition", "mandatory": true},
  {"name": "Activity Fee", "amount": 1500, "term": 1, "category": "activities", "mandatory": true},
  {"name": "Lunch Program", "amount": 4500, "term": 1, "category": "meals", "mandatory": false},
  {"name": "Transport Fee", "amount": 2500, "term": 1, "category": "transport", "mandatory": false}
]');

-- Insert sample library books
INSERT INTO library_books (tenant_id, title, author, isbn, category, grade_level, copies_total, copies_available, location) VALUES
('karagita-primary-demo', 'Grade 1 English Activity Book', 'KICD', '978-9966-25-001-1', 'textbook', 1, 40, 35, 'Section A, Shelf 1'),
('karagita-primary-demo', 'Mathematics Activity Book Grade 1', 'KICD', '978-9966-25-002-8', 'workbook', 1, 45, 40, 'Section B, Shelf 1'),
('karagita-primary-demo', 'The Hare and the Tortoise', 'Aesop', '978-0-123-45001-1', 'storybook', 1, 20, 18, 'Section C, Shelf 1');

-- Insert sample transport route
INSERT INTO transport_routes (tenant_id, name, vehicle_registration, driver_name, driver_phone, stops) VALUES
('karagita-primary-demo', 'Karagita - Kawangware Route', 'KBZ 123A', 'Peter Mwangi', '+254722987654', '[
  {"name": "Kawangware Market", "pickup_time": "06:30", "dropoff_time": "16:30", "order": 1},
  {"name": "Karagita Shopping Center", "pickup_time": "06:45", "dropoff_time": "16:15", "order": 2},
  {"name": "Karagita Primary School", "pickup_time": "07:00", "dropoff_time": "16:00", "order": 3}
]');

-- Insert sample message templates
INSERT INTO message_templates (tenant_id, name, type, content, variables, category) VALUES
('karagita-primary-demo', 'Fee Payment Reminder', 'sms', 'Dear {{guardian_name}}, Term {{term}} fees for {{student_name}} are due on {{due_date}}. Amount: KES {{amount}}. Pay via M-PESA Paybill 123456.', '["guardian_name", "student_name", "term", "due_date", "amount"]', 'finance'),
('karagita-primary-demo', 'Absence Notification', 'sms', 'Your child {{student_name}} was absent from school today. Please contact the school if this was unplanned.', '["student_name"]', 'attendance'),
('karagita-primary-demo', 'Report Card Ready', 'email', 'Dear {{guardian_name}}, {{student_name}}''s Term {{term}} report card is now available for download from the parent portal.', '["guardian_name", "student_name", "term"]', 'academic');

-- Insert sample assets
INSERT INTO assets (tenant_id, name, category, serial_number, location, purchase_date, purchase_cost, condition) VALUES
('karagita-primary-demo', 'Interactive Whiteboard - Grade 1A', 'technology', 'IWB-2024-001', 'Grade 1A Classroom', '2024-01-15', 95000, 'excellent'),
('karagita-primary-demo', 'Student Desks (Set of 35)', 'furniture', 'DESK-1A-2024', 'Grade 1A Classroom', '2023-12-01', 52500, 'good'),
('karagita-primary-demo', 'Science Lab Equipment Set', 'laboratory', 'SCI-LAB-001', 'Science Laboratory', '2023-08-20', 125000, 'good');
// Realistic data for a Kenyan primary school
import type { 
  Learner, 
  Guardian, 
  Classroom, 
  Subject, 
  SBATask, 
  Teacher, 
  FeeInvoice, 
  AttendanceRecord,
  OutcomeMap,
  AssessmentEvidence,
  TransportRoute,
  User,
  Tenant
} from '@/types'

export const realisticTenant: Tenant = {
  id: 'karagita-primary',
  name: 'Karagita Primary School',
  code: '01-01-001-001',
  county: 'Nairobi',
  subcounty: 'Dagoretti North',
  settings: {
    academic_year: '2024',
    current_term: 1,
    school_motto: 'Excellence Through Education',
    brand_colors: ['#1e40af', '#059669', '#dc2626'],
    timezone: 'Africa/Nairobi',
    language: 'en'
  }
}

export const realisticUsers: User[] = [
  {
    id: 'admin-1',
    email: 'admin@karagita-primary.ac.ke',
    name: 'Jane Wanjiku Mwangi',
    role: 'admin',
    tenantId: 'karagita-primary',
    avatar: 'https://images.pexels.com/photos/3586966/pexels-photo-3586966.jpeg?auto=compress&cs=tinysrgb&w=100'
  },
  {
    id: 'teacher-1',
    email: 'john.mwangi@karagita-primary.ac.ke',
    name: 'John Mwangi Kariuki',
    role: 'class_teacher',
    tenantId: 'karagita-primary',
    avatar: 'https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&w=100'
  },
  {
    id: 'teacher-2',
    email: 'mary.njeri@karagita-primary.ac.ke',
    name: 'Mary Njeri Kamau',
    role: 'teacher',
    tenantId: 'karagita-primary',
    avatar: 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=100'
  },
  {
    id: 'parent-1',
    email: 'mary.kamau@gmail.com',
    name: 'Mary Wanjiku Kamau',
    role: 'parent',
    tenantId: 'karagita-primary'
  },
  {
    id: 'parent-2',
    email: 'peter.mwangi@gmail.com',
    name: 'Peter Mwangi Kinyua',
    role: 'parent',
    tenantId: 'karagita-primary'
  }
]

export const realisticGuardians: Guardian[] = [
  {
    id: 'guardian-1',
    name: 'Mary Wanjiku Kamau',
    relation: 'mother',
    phone: '+254722123456',
    email: 'mary.kamau@gmail.com',
    national_id: '28765432',
    consent_flags: [
      {
        id: 'consent-1',
        data_use: 'Academic Progress Communication',
        lawful_basis: 'Legitimate Interest',
        granted_at: '2024-01-15T10:00:00Z'
      }
    ],
    preferred_channel: 'sms'
  },
  {
    id: 'guardian-2',
    name: 'Peter Mwangi Kinyua',
    relation: 'father',
    phone: '+254733987654',
    email: 'peter.mwangi@gmail.com',
    national_id: '28765433',
    consent_flags: [
      {
        id: 'consent-2',
        data_use: 'Financial Communication',
        lawful_basis: 'Contract',
        granted_at: '2024-01-15T10:00:00Z'
      }
    ],
    preferred_channel: 'email'
  },
  {
    id: 'guardian-3',
    name: 'Sarah Wanjiru Ndung\'u',
    relation: 'mother',
    phone: '+254711456789',
    email: 'sarah.wanjiru@yahoo.com',
    national_id: '29876543',
    consent_flags: [
      {
        id: 'consent-3',
        data_use: 'Emergency Contact',
        lawful_basis: 'Vital Interests',
        granted_at: '2024-01-10T09:00:00Z'
      }
    ],
    preferred_channel: 'sms'
  },
  {
    id: 'guardian-4',
    name: 'James Kiprotich Kones',
    relation: 'father',
    phone: '+254720654321',
    email: 'james.kones@gmail.com',
    national_id: '27654321',
    consent_flags: [
      {
        id: 'consent-4',
        data_use: 'Transport Communication',
        lawful_basis: 'Contract',
        granted_at: '2024-01-12T11:00:00Z'
      }
    ],
    preferred_channel: 'sms'
  }
]

export const realisticSubjects: Subject[] = [
  {
    id: 'sub-1',
    code: 'ENG',
    name: 'English',
    grade_band: 'lower_primary',
    learning_area: 'Languages'
  },
  {
    id: 'sub-2',
    code: 'KIS',
    name: 'Kiswahili',
    grade_band: 'lower_primary',
    learning_area: 'Languages'
  },
  {
    id: 'sub-3',
    code: 'MAT',
    name: 'Mathematics',
    grade_band: 'lower_primary',
    learning_area: 'Mathematical Activities'
  },
  {
    id: 'sub-4',
    code: 'ENV',
    name: 'Environmental Activities',
    grade_band: 'lower_primary',
    learning_area: 'Environmental Activities'
  },
  {
    id: 'sub-5',
    code: 'CRE',
    name: 'Christian Religious Education',
    grade_band: 'lower_primary',
    learning_area: 'Religious Education'
  },
  {
    id: 'sub-6',
    code: 'IRE',
    name: 'Islamic Religious Education',
    grade_band: 'lower_primary',
    learning_area: 'Religious Education'
  },
  {
    id: 'sub-7',
    code: 'HRE',
    name: 'Hindu Religious Education',
    grade_band: 'lower_primary',
    learning_area: 'Religious Education'
  },
  {
    id: 'sub-8',
    code: 'CA',
    name: 'Creative Arts',
    grade_band: 'lower_primary',
    learning_area: 'Creative Arts'
  },
  {
    id: 'sub-9',
    code: 'PE',
    name: 'Physical Education',
    grade_band: 'lower_primary',
    learning_area: 'Physical and Health Education'
  }
]

export const realisticClassrooms: Classroom[] = [
  {
    id: 'class-1',
    academic_year: '2024',
    grade: 1,
    stream: 'A',
    capacity: 35,
    teacher_id: 'teacher-1',
    subjects: [
      { id: 'cs-1', subject_id: 'sub-1', teacher_id: 'teacher-1', periods_per_week: 6 },
      { id: 'cs-2', subject_id: 'sub-2', teacher_id: 'teacher-1', periods_per_week: 5 },
      { id: 'cs-3', subject_id: 'sub-3', teacher_id: 'teacher-1', periods_per_week: 7 },
      { id: 'cs-4', subject_id: 'sub-4', teacher_id: 'teacher-1', periods_per_week: 5 },
      { id: 'cs-5', subject_id: 'sub-5', teacher_id: 'teacher-1', periods_per_week: 3 }
    ]
  },
  {
    id: 'class-2',
    academic_year: '2024',
    grade: 1,
    stream: 'B',
    capacity: 33,
    teacher_id: 'teacher-2',
    subjects: [
      { id: 'cs-6', subject_id: 'sub-1', teacher_id: 'teacher-2', periods_per_week: 6 },
      { id: 'cs-7', subject_id: 'sub-2', teacher_id: 'teacher-2', periods_per_week: 5 },
      { id: 'cs-8', subject_id: 'sub-3', teacher_id: 'teacher-2', periods_per_week: 7 },
      { id: 'cs-9', subject_id: 'sub-4', teacher_id: 'teacher-2', periods_per_week: 5 },
      { id: 'cs-10', subject_id: 'sub-5', teacher_id: 'teacher-2', periods_per_week: 3 }
    ]
  },
  {
    id: 'class-3',
    academic_year: '2024',
    grade: 2,
    stream: 'A',
    capacity: 38,
    teacher_id: 'teacher-3',
    subjects: []
  },
  {
    id: 'class-4',
    academic_year: '2024',
    grade: 3,
    stream: 'A',
    capacity: 40,
    teacher_id: 'teacher-4',
    subjects: []
  }
]

export const realisticLearners: Learner[] = [
  {
    id: 'learner-1',
    upi: 'UPI202401001',
    admission_no: 'KP/2024/001',
    name: 'Grace Wanjiku Kamau',
    dob: '2017-03-15',
    sex: 'F',
    status: 'active',
    classroom_id: 'class-1',
    guardians: [realisticGuardians[0], realisticGuardians[1]],
    created_at: '2024-01-10T10:00:00Z',
    updated_at: '2024-01-15T14:30:00Z'
  },
  {
    id: 'learner-2',
    upi: 'UPI202401002',
    admission_no: 'KP/2024/002',
    name: 'Brian Kiprotich Kones',
    dob: '2017-07-22',
    sex: 'M',
    special_needs: true,
    status: 'active',
    classroom_id: 'class-1',
    guardians: [realisticGuardians[3]],
    created_at: '2024-01-10T10:00:00Z',
    updated_at: '2024-01-15T14:30:00Z'
  },
  {
    id: 'learner-3',
    upi: 'UPI202401003',
    admission_no: 'KP/2024/003',
    name: 'Amina Hassan Ali',
    dob: '2017-11-08',
    sex: 'F',
    status: 'active',
    classroom_id: 'class-1',
    guardians: [realisticGuardians[2]],
    created_at: '2024-01-10T10:00:00Z',
    updated_at: '2024-01-15T14:30:00Z'
  },
  {
    id: 'learner-4',
    upi: 'UPI202401004',
    admission_no: 'KP/2024/004',
    name: 'David Mwangi Njoroge',
    dob: '2017-05-12',
    sex: 'M',
    status: 'active',
    classroom_id: 'class-2',
    guardians: [],
    created_at: '2024-01-11T10:00:00Z',
    updated_at: '2024-01-16T14:30:00Z'
  },
  {
    id: 'learner-5',
    upi: 'UPI202401005',
    admission_no: 'KP/2024/005',
    name: 'Faith Akinyi Ochieng',
    dob: '2017-09-03',
    sex: 'F',
    status: 'active',
    classroom_id: 'class-2',
    guardians: [],
    created_at: '2024-01-11T10:00:00Z',
    updated_at: '2024-01-16T14:30:00Z'
  }
]

export const realisticTeachers: Teacher[] = [
  {
    id: 'teacher-1',
    tsc_no: 'TSC/2019/001234',
    name: 'John Mwangi Kariuki',
    email: 'john.mwangi@karagita-primary.ac.ke',
    phone: '+254722987654',
    subjects: ['sub-1', 'sub-2', 'sub-3'],
    qualifications: [
      {
        id: 'qual-1',
        title: 'Bachelor of Education (Primary)',
        institution: 'Kenyatta University',
        year: 2018
      },
      {
        id: 'qual-2',
        title: 'Diploma in Early Childhood Development',
        institution: 'Kenya Institute of Special Education',
        year: 2016
      }
    ],
    employment_date: '2019-01-15',
    status: 'active'
  },
  {
    id: 'teacher-2',
    tsc_no: 'TSC/2020/005678',
    name: 'Mary Njeri Kamau',
    email: 'mary.njeri@karagita-primary.ac.ke',
    phone: '+254733456789',
    subjects: ['sub-1', 'sub-4', 'sub-8'],
    qualifications: [
      {
        id: 'qual-3',
        title: 'Bachelor of Education (Arts)',
        institution: 'University of Nairobi',
        year: 2019
      }
    ],
    employment_date: '2020-02-01',
    status: 'active'
  },
  {
    id: 'teacher-3',
    tsc_no: 'TSC/2018/009876',
    name: 'Samuel Kipchoge Ruto',
    email: 'samuel.ruto@karagita-primary.ac.ke',
    phone: '+254711234567',
    subjects: ['sub-3', 'sub-9'],
    qualifications: [
      {
        id: 'qual-4',
        title: 'Bachelor of Education (Science)',
        institution: 'Moi University',
        year: 2017
      }
    ],
    employment_date: '2018-09-01',
    status: 'active'
  }
]

export const realisticAttendance: AttendanceRecord[] = [
  // Today's attendance
  {
    id: 'att-1',
    date: new Date().toISOString().split('T')[0],
    type: 'homeroom',
    learner_id: 'learner-1',
    status: 'present',
    recorded_by: 'teacher-1',
    recorded_at: new Date().toISOString()
  },
  {
    id: 'att-2',
    date: new Date().toISOString().split('T')[0],
    type: 'homeroom',
    learner_id: 'learner-2',
    status: 'late',
    reason: 'Transport delay',
    recorded_by: 'teacher-1',
    recorded_at: new Date().toISOString()
  },
  {
    id: 'att-3',
    date: new Date().toISOString().split('T')[0],
    type: 'homeroom',
    learner_id: 'learner-3',
    status: 'absent',
    reason: 'Sick',
    recorded_by: 'teacher-1',
    recorded_at: new Date().toISOString()
  },
  {
    id: 'att-4',
    date: new Date().toISOString().split('T')[0],
    type: 'homeroom',
    learner_id: 'learner-4',
    status: 'present',
    recorded_by: 'teacher-2',
    recorded_at: new Date().toISOString()
  },
  {
    id: 'att-5',
    date: new Date().toISOString().split('T')[0],
    type: 'homeroom',
    learner_id: 'learner-5',
    status: 'present',
    recorded_by: 'teacher-2',
    recorded_at: new Date().toISOString()
  }
]

export const realisticFeeInvoices: FeeInvoice[] = [
  {
    id: 'invoice-1',
    learner_id: 'learner-1',
    academic_year: '2024',
    term: 1,
    items: [
      { fee_item_id: 'fee-1', name: 'Tuition Fee', amount: 12000 },
      { fee_item_id: 'fee-2', name: 'Activity Fee', amount: 1500 },
      { fee_item_id: 'fee-3', name: 'Lunch Program', amount: 4500 },
      { fee_item_id: 'fee-4', name: 'Transport Fee', amount: 2500 }
    ],
    total: 20500,
    balance: 5500,
    due_date: '2024-02-15T23:59:59Z',
    status: 'sent',
    created_at: '2024-01-20T10:00:00Z'
  },
  {
    id: 'invoice-2',
    learner_id: 'learner-2',
    academic_year: '2024',
    term: 1,
    items: [
      { fee_item_id: 'fee-1', name: 'Tuition Fee', amount: 12000 },
      { fee_item_id: 'fee-2', name: 'Activity Fee', amount: 1500 },
      { fee_item_id: 'fee-3', name: 'Lunch Program', amount: 4500 }
    ],
    total: 18000,
    balance: 0,
    due_date: '2024-02-15T23:59:59Z',
    status: 'paid',
    created_at: '2024-01-20T10:00:00Z'
  },
  {
    id: 'invoice-3',
    learner_id: 'learner-3',
    academic_year: '2024',
    term: 1,
    items: [
      { fee_item_id: 'fee-1', name: 'Tuition Fee', amount: 12000 },
      { fee_item_id: 'fee-2', name: 'Activity Fee', amount: 1500 },
      { fee_item_id: 'fee-3', name: 'Lunch Program', amount: 4500 },
      { fee_item_id: 'fee-4', name: 'Transport Fee', amount: 2500 }
    ],
    total: 20500,
    balance: 12000,
    due_date: '2024-02-15T23:59:59Z',
    status: 'overdue',
    created_at: '2024-01-20T10:00:00Z'
  }
]

export const realisticSBATasks: SBATask[] = [
  {
    id: 'task-1',
    title: 'Reading Comprehension - "Our School Environment"',
    description: 'Students will read a passage about school environment and answer questions to demonstrate understanding of main ideas and details.',
    subject_id: 'sub-1',
    classroom_id: 'class-1',
    term: 1,
    academic_year: '2024',
    outcome_refs: ['outcome-1'],
    rubric_levels: [
      {
        level: 'emerging',
        description: 'Identifies basic information with significant support',
        score_range: [1, 2]
      },
      {
        level: 'approaching',
        description: 'Identifies main ideas with some support',
        score_range: [3, 4]
      },
      {
        level: 'proficient',
        description: 'Independently identifies main ideas and some details',
        score_range: [5, 6]
      },
      {
        level: 'exceeding',
        description: 'Identifies main ideas, details, and makes connections',
        score_range: [7, 8]
      }
    ],
    weight: 30,
    due_date: '2024-03-15T23:59:59Z',
    evidence_types: ['document', 'photo'],
    created_by: 'teacher-1',
    created_at: '2024-02-01T10:00:00Z'
  },
  {
    id: 'task-2',
    title: 'Number Recognition and Counting 1-20',
    description: 'Students will demonstrate ability to recognize, count, and order numbers from 1 to 20 using concrete materials.',
    subject_id: 'sub-3',
    classroom_id: 'class-1',
    term: 1,
    academic_year: '2024',
    outcome_refs: ['outcome-2'],
    rubric_levels: [
      {
        level: 'emerging',
        description: 'Recognizes numbers 1-10 with support',
        score_range: [1, 2]
      },
      {
        level: 'approaching',
        description: 'Recognizes and counts numbers 1-15',
        score_range: [3, 4]
      },
      {
        level: 'proficient',
        description: 'Recognizes, counts, and orders numbers 1-20',
        score_range: [5, 6]
      },
      {
        level: 'exceeding',
        description: 'Works confidently with numbers beyond 20',
        score_range: [7, 8]
      }
    ],
    weight: 35,
    due_date: '2024-03-20T23:59:59Z',
    evidence_types: ['photo', 'video'],
    created_by: 'teacher-1',
    created_at: '2024-02-05T10:00:00Z'
  }
]

export const realisticAssessmentEvidence: AssessmentEvidence[] = [
  {
    id: 'evidence-1',
    task_id: 'task-1',
    learner_id: 'learner-1',
    teacher_id: 'teacher-1',
    proficiency_level: 'proficient',
    score: 6,
    comment: 'Grace demonstrates excellent reading comprehension. She identified the main ideas correctly and provided thoughtful answers to most questions.',
    files: [
      {
        id: 'file-1',
        filename: 'grace_reading_assessment.pdf',
        type: 'document',
        url: '/evidence/grace_reading_assessment.pdf',
        size: 245760,
        uploaded_at: '2024-03-10T14:30:00Z'
      }
    ],
    captured_at: '2024-03-10T14:30:00Z'
  },
  {
    id: 'evidence-2',
    task_id: 'task-2',
    learner_id: 'learner-1',
    teacher_id: 'teacher-1',
    proficiency_level: 'exceeding',
    score: 8,
    comment: 'Outstanding work with numbers. Grace not only counted to 20 but also demonstrated understanding of number patterns and relationships.',
    files: [
      {
        id: 'file-2',
        filename: 'grace_counting.jpg',
        type: 'photo',
        url: 'https://images.pexels.com/photos/8613080/pexels-photo-8613080.jpeg?auto=compress&cs=tinysrgb&w=400',
        size: 156780,
        uploaded_at: '2024-03-18T11:15:00Z'
      }
    ],
    captured_at: '2024-03-18T11:15:00Z'
  },
  {
    id: 'evidence-3',
    task_id: 'task-1',
    learner_id: 'learner-2',
    teacher_id: 'teacher-1',
    proficiency_level: 'approaching',
    score: 4,
    comment: 'Brian is making good progress. He identified some main ideas but needed support with details. Continue encouraging his efforts.',
    files: [],
    captured_at: '2024-03-12T10:15:00Z'
  }
]

export const realisticTransportRoutes: TransportRoute[] = [
  {
    id: 'route-1',
    name: 'Karagita - Kawangware Route',
    vehicle_id: 'KBZ 123A',
    driver_id: 'driver-1',
    matron_id: 'matron-1',
    stops: [
      {
        id: 'stop-1',
        route_id: 'route-1',
        order: 1,
        name: 'Kawangware Market',
        pickup_time: '06:30:00',
        dropoff_time: '16:30:00'
      },
      {
        id: 'stop-2',
        route_id: 'route-1',
        order: 2,
        name: 'Karagita Shopping Center',
        pickup_time: '06:45:00',
        dropoff_time: '16:15:00'
      },
      {
        id: 'stop-3',
        route_id: 'route-1',
        order: 3,
        name: 'Karagita Primary School',
        pickup_time: '07:00:00',
        dropoff_time: '16:00:00'
      }
    ],
    active: true
  },
  {
    id: 'route-2',
    name: 'Dagoretti - Uthiru Route',
    vehicle_id: 'KCA 456B',
    driver_id: 'driver-2',
    matron_id: 'matron-2',
    stops: [
      {
        id: 'stop-4',
        route_id: 'route-2',
        order: 1,
        name: 'Uthiru Shopping Center',
        pickup_time: '06:40:00',
        dropoff_time: '16:20:00'
      },
      {
        id: 'stop-5',
        route_id: 'route-2',
        order: 2,
        name: 'Dagoretti Corner',
        pickup_time: '06:55:00',
        dropoff_time: '16:05:00'
      },
      {
        id: 'stop-6',
        route_id: 'route-2',
        order: 3,
        name: 'Karagita Primary School',
        pickup_time: '07:10:00',
        dropoff_time: '15:50:00'
      }
    ],
    active: true
  }
]

// Events data
export const realisticEvents = [
  {
    id: 'event-1',
    title: 'Science Fair 2024',
    description: 'Annual science exhibition showcasing student projects and innovations',
    type: 'academic',
    date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    start_time: '09:00',
    end_time: '15:00',
    location: 'School Hall',
    organizer: 'Science Department',
    participants: ['Grade 1', 'Grade 2', 'Grade 3'],
    status: 'confirmed',
    budget: 35000,
    attendees_expected: 180,
    created_by: 'admin-1',
    created_at: new Date().toISOString()
  },
  {
    id: 'event-2',
    title: 'Parent-Teacher Conference',
    description: 'Term 1 academic progress discussion with parents and guardians',
    type: 'meeting',
    date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    start_time: '14:00',
    end_time: '17:00',
    location: 'Various Classrooms',
    organizer: 'Academic Office',
    participants: ['All Parents', 'All Teachers'],
    status: 'planned',
    attendees_expected: 200,
    created_by: 'admin-1',
    created_at: new Date().toISOString()
  },
  {
    id: 'event-3',
    title: 'Inter-House Sports Day',
    description: 'Annual sports competition between school houses',
    type: 'sports',
    date: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(),
    start_time: '08:00',
    end_time: '16:00',
    location: 'School Field',
    organizer: 'Sports Department',
    participants: ['All Students'],
    status: 'planned',
    budget: 25000,
    attendees_expected: 300,
    created_by: 'admin-1',
    created_at: new Date().toISOString()
  }
]

// Library data
export const realisticBooks = [
  {
    id: 'book-1',
    title: 'Grade 1 English Activity Book',
    author: 'Kenya Institute of Curriculum Development',
    isbn: '978-9966-25-001-1',
    category: 'textbook',
    subject_id: 'sub-1',
    grade_level: 1,
    copies_total: 40,
    copies_available: 32,
    location: 'Section A, Shelf 1',
    status: 'active'
  },
  {
    id: 'book-2',
    title: 'Mathematics Activity Book Grade 1',
    author: 'KICD',
    isbn: '978-9966-25-002-8',
    category: 'workbook',
    subject_id: 'sub-3',
    grade_level: 1,
    copies_total: 45,
    copies_available: 38,
    location: 'Section B, Shelf 1',
    status: 'active'
  },
  {
    id: 'book-3',
    title: 'Hare and Tortoise',
    author: 'Aesop',
    isbn: '978-0-123-45001-1',
    category: 'storybook',
    grade_level: 1,
    copies_total: 20,
    copies_available: 15,
    location: 'Section C, Shelf 1',
    status: 'active'
  }
]

// Welfare cases
export const realisticWelfareCases = [
  {
    id: 'case-1',
    learner_id: 'learner-2',
    category: 'counseling',
    priority: 'medium',
    restricted_roles: ['admin', 'welfare_officer'],
    summary: 'Student showing signs of anxiety during group activities',
    notes_encrypted: 'Brian appears withdrawn during group work. Recommend individual assessment and possible peer support program.',
    status: 'in_progress',
    assigned_to: 'welfare-officer-1',
    opened_by: 'teacher-1',
    opened_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  }
]

// SNE Plans
export const realisticSNEPlans = [
  {
    id: 'sne-1',
    learner_id: 'learner-2',
    stage: 'implementation',
    accommodations: [
      {
        id: 'acc-1',
        type: 'extra_time',
        description: 'Additional 50% time for all assessments',
        subjects: ['sub-1', 'sub-3']
      },
      {
        id: 'acc-2',
        type: 'assistive_tech',
        description: 'Use of calculator for number work',
        subjects: ['sub-3']
      }
    ],
    review_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    created_by: 'welfare-officer-1',
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  }
]

// Communication messages
export const realisticMessages = [
  {
    id: 'msg-1',
    type: 'sms',
    recipients: [
      { id: 'rec-1', type: 'guardian', contact: '+254722123456', status: 'delivered', delivered_at: new Date().toISOString() }
    ],
    subject: 'Fee Payment Reminder',
    content: 'Dear Mary, Term 1 fees for Grace are due on 15th Feb. Balance: KES 5,500. Pay via M-PESA Paybill 123456.',
    status: 'sent',
    sent_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    created_by: 'admin-1'
  },
  {
    id: 'msg-2',
    type: 'email',
    recipients: [
      { id: 'rec-2', type: 'guardian', contact: 'mary.kamau@gmail.com', status: 'delivered', delivered_at: new Date().toISOString() }
    ],
    subject: 'Grade 1A Report Cards Available',
    content: 'Dear parent, your child\'s Term 1 CBC report card is now available for download from the parent portal.',
    status: 'sent',
    sent_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    created_by: 'teacher-1'
  }
]

// Assets/Inventory
export const realisticAssets = [
  {
    id: 'asset-1',
    name: 'Interactive Whiteboard - Grade 1A',
    category: 'technology',
    location: 'Grade 1A Classroom',
    serial_number: 'IWB-2024-001',
    purchase_date: '2024-01-15',
    purchase_cost: 95000,
    condition: 'excellent',
    warranty_expiry: '2027-01-15',
    status: 'active',
    last_maintenance: '2024-02-15'
  },
  {
    id: 'asset-2',
    name: 'Student Desks (Set of 35)',
    category: 'furniture',
    location: 'Grade 1A Classroom',
    serial_number: 'DESK-1A-2024',
    purchase_date: '2023-12-01',
    purchase_cost: 52500,
    condition: 'good',
    status: 'active',
    last_maintenance: '2024-01-15'
  }
]

// Generate realistic data relationships
export const generateRealisticData = () => {
  return {
    tenant: realisticTenant,
    users: realisticUsers,
    guardians: realisticGuardians,
    subjects: realisticSubjects,
    classrooms: realisticClassrooms,
    learners: realisticLearners,
    teachers: realisticTeachers,
    attendance: realisticAttendance,
    invoices: realisticFeeInvoices,
    tasks: realisticSBATasks,
    evidence: realisticAssessmentEvidence,
    routes: realisticTransportRoutes,
    events: realisticEvents,
    books: realisticBooks,
    welfareCases: realisticWelfareCases,
    snePlans: realisticSNEPlans,
    messages: realisticMessages,
    assets: realisticAssets
  }
}
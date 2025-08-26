// Mock data for demonstration purposes
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

export const mockTenant: Tenant = {
  id: 'karagita-primary',
  name: 'Karagita Primary School',
  code: '01-01-001-001',
  county: 'Nairobi',
  subcounty: 'Dagoretti North',
  settings: {
    academic_year: '2024',
    current_term: 1,
    school_motto: 'Excellence Through Education',
    brand_colors: ['#3B82F6', '#10B981', '#F59E0B'],
    timezone: 'Africa/Nairobi',
    language: 'en'
  }
}

export const mockUsers: User[] = [
  {
    id: 'admin-1',
    email: 'admin@karagita-primary.ac.ke',
    name: 'Jane Wanjiku',
    role: 'admin',
    tenantId: 'karagita-primary',
    avatar: 'https://images.pexels.com/photos/3586966/pexels-photo-3586966.jpeg?auto=compress&cs=tinysrgb&w=100'
  },
  {
    id: 'teacher-1',
    email: 'mwangi@karagita-primary.ac.ke',
    name: 'John Mwangi',
    role: 'class_teacher',
    tenantId: 'karagita-primary',
    avatar: 'https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&w=100'
  },
  {
    id: 'parent-1',
    email: 'mary.kamau@email.com',
    name: 'Mary Kamau',
    role: 'parent',
    tenantId: 'karagita-primary'
  }
]

export const mockGuardians: Guardian[] = [
  {
    id: 'guardian-1',
    name: 'Mary Kamau',
    relation: 'mother',
    phone: '+254700123456',
    email: 'mary.kamau@email.com',
    national_id: '12345678',
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
    name: 'Peter Kamau',
    relation: 'father',
    phone: '+254700123457',
    email: 'peter.kamau@email.com',
    national_id: '12345679',
    consent_flags: [
      {
        id: 'consent-2',
        data_use: 'Financial Communication',
        lawful_basis: 'Contract',
        granted_at: '2024-01-15T10:00:00Z'
      }
    ],
    preferred_channel: 'email'
  }
]

export const mockSubjects: Subject[] = [
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
  }
]

export const mockClassrooms: Classroom[] = [
  {
    id: 'class-1',
    academic_year: '2024',
    grade: 3,
    stream: 'A',
    capacity: 40,
    teacher_id: 'teacher-1',
    subjects: [
      { id: 'cs-1', subject_id: 'sub-1', teacher_id: 'teacher-1', periods_per_week: 5 },
      { id: 'cs-2', subject_id: 'sub-2', teacher_id: 'teacher-1', periods_per_week: 4 },
      { id: 'cs-3', subject_id: 'sub-3', teacher_id: 'teacher-1', periods_per_week: 6 },
      { id: 'cs-4', subject_id: 'sub-4', teacher_id: 'teacher-1', periods_per_week: 4 },
      { id: 'cs-5', subject_id: 'sub-5', teacher_id: 'teacher-1', periods_per_week: 3 }
    ]
  },
  {
    id: 'class-2',
    academic_year: '2024',
    grade: 3,
    stream: 'B',
    capacity: 38,
    subjects: []
  }
]

export const mockLearners: Learner[] = [
  {
    id: 'learner-1',
    upi: 'UPI123456789',
    admission_no: 'KP/2022/001',
    name: 'Grace Wanjiku Kamau',
    dob: '2015-03-15',
    sex: 'F',
    status: 'active',
    classroom_id: 'class-1',
    guardians: [mockGuardians[0], mockGuardians[1]],
    created_at: '2022-01-10T10:00:00Z',
    updated_at: '2024-01-15T14:30:00Z'
  },
  {
    id: 'learner-2',
    upi: 'UPI123456790',
    admission_no: 'KP/2022/002',
    name: 'Brian Kiprotich Kones',
    dob: '2015-07-22',
    sex: 'M',
    special_needs: true,
    status: 'active',
    classroom_id: 'class-1',
    guardians: [],
    created_at: '2022-01-10T10:00:00Z',
    updated_at: '2024-01-15T14:30:00Z'
  },
  {
    id: 'learner-3',
    upi: 'UPI123456791',
    admission_no: 'KP/2022/003',
    name: 'Amina Hassan Ali',
    dob: '2015-11-08',
    sex: 'F',
    status: 'active',
    classroom_id: 'class-1',
    guardians: [],
    created_at: '2022-01-10T10:00:00Z',
    updated_at: '2024-01-15T14:30:00Z'
  }
]

export const mockTeachers: Teacher[] = [
  {
    id: 'teacher-1',
    tsc_no: 'TSC123456',
    name: 'John Mwangi Kariuki',
    email: 'mwangi@karagita-primary.ac.ke',
    phone: '+254700987654',
    subjects: ['sub-1', 'sub-2', 'sub-3'],
    qualifications: [
      {
        id: 'qual-1',
        title: 'Bachelor of Education (Primary)',
        institution: 'Kenyatta University',
        year: 2018
      }
    ],
    employment_date: '2019-01-15',
    status: 'active'
  }
]

export const mockOutcomeMaps: OutcomeMap[] = [
  {
    id: 'outcome-1',
    version: '2024.1',
    learning_area: 'Languages',
    strand: 'Listening and Speaking',
    sub_strand: 'Pronunciation',
    slo_code: 'ENG.3.1.1',
    descriptors: [
      'Pronounce words correctly',
      'Use appropriate intonation',
      'Speak clearly and audibly'
    ],
    grade_level: 3
  },
  {
    id: 'outcome-2',
    version: '2024.1',
    learning_area: 'Mathematical Activities',
    strand: 'Numbers',
    sub_strand: 'Counting',
    slo_code: 'MAT.3.1.1',
    descriptors: [
      'Count objects up to 1000',
      'Identify number patterns',
      'Compare quantities'
    ],
    grade_level: 3
  }
]

export const mockSBATasks: SBATask[] = [
  {
    id: 'task-1',
    title: 'Reading Comprehension - "Our Environment"',
    description: 'Students will read a passage about environmental conservation and answer questions to demonstrate understanding.',
    subject_id: 'sub-1',
    classroom_id: 'class-1',
    term: 1,
    academic_year: '2024',
    outcome_refs: ['outcome-1'],
    rubric_levels: [
      {
        level: 'emerging',
        description: 'Understands basic concepts with support',
        score_range: [1, 2]
      },
      {
        level: 'approaching',
        description: 'Demonstrates developing understanding',
        score_range: [3, 4]
      },
      {
        level: 'proficient',
        description: 'Shows clear understanding of concepts',
        score_range: [5, 6]
      },
      {
        level: 'exceeding',
        description: 'Demonstrates exceptional understanding',
        score_range: [7, 8]
      }
    ],
    weight: 25,
    due_date: '2024-03-15T23:59:59Z',
    evidence_types: ['document', 'photo'],
    created_by: 'teacher-1',
    created_at: '2024-02-01T10:00:00Z'
  },
  {
    id: 'task-2',
    title: 'Number Patterns Investigation',
    description: 'Students will identify and extend number patterns using concrete materials and drawings.',
    subject_id: 'sub-3',
    classroom_id: 'class-1',
    term: 1,
    academic_year: '2024',
    outcome_refs: ['outcome-2'],
    rubric_levels: [
      {
        level: 'emerging',
        description: 'Identifies simple patterns with guidance',
        score_range: [1, 2]
      },
      {
        level: 'approaching',
        description: 'Identifies most patterns independently',
        score_range: [3, 4]
      },
      {
        level: 'proficient',
        description: 'Identifies and extends patterns correctly',
        score_range: [5, 6]
      },
      {
        level: 'exceeding',
        description: 'Creates own patterns and explains rules',
        score_range: [7, 8]
      }
    ],
    weight: 30,
    due_date: '2024-03-20T23:59:59Z',
    evidence_types: ['photo', 'video'],
    created_by: 'teacher-1',
    created_at: '2024-02-05T10:00:00Z'
  }
]

export const mockAssessmentEvidence: AssessmentEvidence[] = [
  {
    id: 'evidence-1',
    task_id: 'task-1',
    learner_id: 'learner-1',
    teacher_id: 'teacher-1',
    proficiency_level: 'proficient',
    score: 6,
    comment: 'Grace demonstrates good reading comprehension skills. She answered most questions correctly and showed understanding of the main concepts.',
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
    comment: 'Excellent work on number patterns. Grace not only identified all patterns but also created her own and explained the rules clearly.',
    files: [
      {
        id: 'file-2',
        filename: 'grace_patterns.jpg',
        type: 'photo',
        url: 'https://images.pexels.com/photos/8613080/pexels-photo-8613080.jpeg?auto=compress&cs=tinysrgb&w=400',
        size: 156780,
        uploaded_at: '2024-03-18T11:15:00Z'
      }
    ],
    captured_at: '2024-03-18T11:15:00Z'
  }
]

export const mockAttendance: AttendanceRecord[] = [
  {
    id: 'att-1',
    date: '2024-01-15',
    type: 'homeroom',
    learner_id: 'learner-1',
    status: 'present',
    recorded_by: 'teacher-1',
    recorded_at: '2024-01-15T08:00:00Z'
  },
  {
    id: 'att-2',
    date: '2024-01-15',
    type: 'homeroom',
    learner_id: 'learner-2',
    status: 'late',
    reason: 'Transport delay',
    recorded_by: 'teacher-1',
    recorded_at: '2024-01-15T08:15:00Z'
  },
  {
    id: 'att-3',
    date: '2024-01-15',
    type: 'homeroom',
    learner_id: 'learner-3',
    status: 'absent',
    reason: 'Sick',
    recorded_by: 'teacher-1',
    recorded_at: '2024-01-15T08:00:00Z'
  }
]

export const mockFeeInvoices: FeeInvoice[] = [
  {
    id: 'invoice-1',
    learner_id: 'learner-1',
    academic_year: '2024',
    term: 1,
    items: [
      { fee_item_id: 'fee-1', name: 'Tuition Fee', amount: 15000 },
      { fee_item_id: 'fee-2', name: 'Activity Fee', amount: 2000 },
      { fee_item_id: 'fee-3', name: 'Lunch Program', amount: 6000 }
    ],
    total: 23000,
    balance: 8000,
    due_date: '2024-02-15T23:59:59Z',
    status: 'sent',
    created_at: '2024-01-20T10:00:00Z'
  }
]

export const mockTransportRoutes: TransportRoute[] = [
  {
    id: 'route-1',
    name: 'Karagita - Town Route',
    vehicle_id: 'vehicle-1',
    driver_id: 'driver-1',
    matron_id: 'matron-1',
    stops: [
      {
        id: 'stop-1',
        route_id: 'route-1',
        order: 1,
        name: 'Karagita Shopping Center',
        pickup_time: '06:30:00',
        dropoff_time: '16:00:00'
      },
      {
        id: 'stop-2',
        route_id: 'route-1',
        order: 2,
        name: 'Karagita Primary School',
        pickup_time: '07:00:00',
        dropoff_time: '15:30:00'
      }
    ],
    active: true
  }
]
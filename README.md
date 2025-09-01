# Kenyan CBC School Management System

A comprehensive, production-ready school management platform designed specifically for Kenyan schools operating under the Competency-Based Curriculum (CBC).

## 🇰🇪 Kenya-Specific Features

- **CBC Aligned**: Full competency-based curriculum support with SBA tasks and proficiency levels
- **NEMIS/KEMIS Ready**: Student data management with UPI tracking and export capabilities
- **M-PESA Integration**: Complete mobile payment system with STK Push and reconciliation
- **ODPC Compliant**: Data Protection Officer console with privacy controls
- **KNEC Ready**: Assessment data export in required formats
- **TPAD Support**: Teacher performance documentation and evidence bundles

## 🚀 Core Features

### Student Management
- Complete student profiles with UPI and admission number tracking
- Guardian management with contact preferences and consent records
- CBC report card generation with competency tracking
- Bulk operations and advanced search capabilities

### Assessment System
- SBA task creation with learning outcome mapping
- Evidence capture (photo, video, audio, documents)
- Proficiency-based grading with rubrics
- Class mastery heatmaps and analytics

### Financial Management
- Fee structure management and invoice generation
- M-PESA payment processing with real-time status
- Payment reconciliation and audit trails
- Financial reporting and analytics

### Attendance Tracking
- Daily and lesson-based attendance marking
- Bulk attendance operations
- Attendance analytics and trend analysis
- Automated parent notifications

### Transport Management
- Route and stop management
- Live vehicle tracking simulation
- Student boarding/alighting records
- Safety alert system

### Staff Management
- Teacher profiles with TSC numbers and qualifications
- TPAD evidence bundle generation
- Performance review system
- Workload analysis and reporting

### Welfare & SNE
- Student welfare case management
- Special Needs Education (SNE) planning
- Accommodation tracking and review cycles
- Safeguarding protocols

### Communications
- Multi-channel messaging (SMS, Email, Push)
- Message templates with personalization
- Delivery tracking and analytics
- Parent engagement metrics

### Library Management
- Book inventory and cataloging
- Issue and return tracking
- Reading analytics and reports
- Overdue book management

### Inventory Management
- Asset tracking and management
- Maintenance scheduling
- Depreciation tracking
- Utilization reports

### Event Management
- School event planning and management
- Budget tracking and attendee management
- Event calendar and reporting
- Automated notifications

### Analytics & Reporting
- Executive dashboards with KPIs
- Academic performance analytics
- Financial insights and forecasting
- Operational efficiency metrics

## 📊 Universal Report Generation

### Report Types (50+ Available)
- **Academic**: CBC report cards, mastery heatmaps, KNEC exports
- **Administrative**: Student directories, class lists, NEMIS exports
- **Financial**: Fee statements, collection summaries, M-PESA logs
- **Attendance**: Daily registers, monthly summaries, absenteeism reports
- **Transport**: Route manifests, safety reports, event logs
- **Staff**: Directories, TPAD bundles, performance reviews
- **Welfare**: Case summaries, SNE plans, safeguarding reports
- **Communications**: Message analytics, delivery reports
- **Library**: Inventory catalogs, circulation reports
- **Inventory**: Asset registers, maintenance schedules
- **Events**: Event calendars, budget summaries
- **Analytics**: Executive dashboards, performance insights

### Export Formats
- **PDF**: Professional reports with school branding
- **Excel**: Structured data with charts and formatting
- **CSV**: Raw data for external analysis
- **JSON**: API-ready structured data

### Advanced Features
- Template-based report generation
- Scheduled automated reports
- Email distribution after generation
- Progress tracking with real-time updates
- Audit logging with file integrity hashes

## 🛡️ Privacy & Compliance

### ODPC Compliance
- Data Protection Officer (DPO) console
- Records of Processing (RoP) management
- Data Subject Access Request (SAR) handling
- Consent management and tracking
- Retention policy enforcement
- Breach incident management

### Security Features
- Role-based access control (RBAC)
- Attribute-based access control (ABAC)
- Field-level encryption for sensitive data
- Audit trails for all operations
- Session management and timeout controls
- Two-factor authentication support

## 🔧 Technical Architecture

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** with custom design system
- **Zustand** for state management
- **React Query** for server state
- **PWA capabilities** with offline support

### Backend Ready
- **Supabase integration** prepared
- **Real-time subscriptions** for live updates
- **File storage** with signed URLs
- **Row Level Security** (RLS) policies
- **Database migrations** and seeding

### Development
- **Vite** for fast development
- **TypeScript** for type safety
- **ESLint** and **Prettier** for code quality
- **Component-driven development**

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account (optional for database)

### Installation

1. **Clone and install dependencies**:
```bash
git clone <repository-url>
cd cbc-school-management
npm install
```

2. **Environment setup**:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Start development server**:
```bash
npm run dev
```

4. **Access the application**:
Open [http://localhost:5173](http://localhost:5173)

### Demo Accounts
- **Admin**: admin@karagita-primary.ac.ke
- **Teacher**: mwangi@karagita-primary.ac.ke  
- **Parent**: mary.kamau@email.com

## 📱 Mobile Support

The system is fully responsive and works seamlessly across:
- **Desktop**: Full feature access with optimized layouts
- **Tablet**: Touch-friendly interface with adaptive navigation
- **Mobile**: Mobile-first design with collapsible sidebar and touch controls

## 🔌 Integration Ready

### External Systems
- **NEMIS/KEMIS**: Student data synchronization
- **KNEC**: Assessment data export
- **M-PESA**: Payment processing
- **SMS Gateways**: Parent communications
- **Email Services**: Automated notifications

### API Capabilities
- RESTful API design
- Webhook support for real-time integrations
- Bulk data import/export
- Third-party authentication

## 📈 Scalability

### Performance
- Optimized database queries
- Efficient state management
- Lazy loading and code splitting
- Image optimization and caching

### Deployment
- Docker containerization ready
- Cloud deployment compatible
- Horizontal scaling support
- Database replication ready

## 🎯 Production Readiness

### Quality Assurance
- Comprehensive error handling
- Input validation and sanitization
- Cross-browser compatibility
- Accessibility compliance (WCAG 2.1)

### Monitoring
- Application performance monitoring
- Error tracking and reporting
- User analytics and insights
- System health monitoring

## 📚 Documentation

### User Guides
- Administrator handbook
- Teacher user guide
- Parent portal guide
- Student handbook

### Technical Documentation
- API documentation
- Database schema
- Deployment guide
- Security protocols

## 🤝 Support

### Training Materials
- Video tutorials for each module
- Best practices documentation
- Troubleshooting guides
- FAQ and common issues

### Implementation Support
- System setup assistance
- Data migration support
- User training programs
- Ongoing technical support

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Kenya Institute of Curriculum Development (KICD)
- Teachers Service Commission (TSC)
- Kenya National Examinations Council (KNEC)
- Office of the Data Protection Commissioner (ODPC)
- Ministry of Education, Kenya

---

**Built with ❤️ for Kenyan Schools**

*Empowering education through technology while maintaining the highest standards of data protection and curriculum compliance.*
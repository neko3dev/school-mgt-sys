import { DatabaseService } from './supabase'
import {
  useStudents,
  useAssessment,
  useFinance,
  useAttendance,
  useEvents,
  useStaff,
  useLibrary,
  useInventory,
  useWelfare,
  useCommunications,
  useTransport
} from '@/store'

export class DataService {
  static async loadAllData() {
    try {
      const [
        students,
        staff,
        tasks,
        invoices,
        attendance,
        events,
        books,
        assets,
        welfareCases,
        messages,
        routes
      ] = await Promise.all([
        DatabaseService.getStudents().catch(() => []),
        DatabaseService.getStaff().catch(() => []),
        DatabaseService.getTasks().catch(() => []),
        DatabaseService.getInvoices().catch(() => []),
        DatabaseService.getAttendance().catch(() => []),
        DatabaseService.getEvents().catch(() => []),
        DatabaseService.getBooks().catch(() => []),
        DatabaseService.getAssets().catch(() => []),
        DatabaseService.getWelfareCases().catch(() => []),
        DatabaseService.getMessages().catch(() => []),
        DatabaseService.getTransportRoutes().catch(() => [])
      ])

      useStudents.setState({ students, isLoading: false })
      useStaff.setState({ staff, isLoading: false })
      useAssessment.setState({ tasks, isLoading: false })
      useFinance.setState({ invoices, isLoading: false })
      useAttendance.setState({ attendance, isLoading: false })
      useEvents.setState({ events, isLoading: false })
      useLibrary.setState({ books, isLoading: false })
      useInventory.setState({ assets, isLoading: false })
      useWelfare.setState({ cases: welfareCases, isLoading: false })
      useCommunications.setState({ messages, isLoading: false })
      useTransport.setState({ routes, isLoading: false })

      return true
    } catch (error) {
      console.error('Failed to load data:', error)
      return false
    }
  }

  static async createStudent(data: any) {
    try {
      const student = await DatabaseService.createStudent(data)
      useStudents.getState().addStudent(student)

      await DatabaseService.logAction('CREATE', 'student', student.id, null, student)

      return student
    } catch (error) {
      console.error('Failed to create student:', error)
      throw error
    }
  }

  static async updateStudent(id: string, updates: any) {
    try {
      const oldStudent = useStudents.getState().students.find(s => s.id === id)
      const student = await DatabaseService.updateStudent(id, updates)
      useStudents.getState().updateStudent(id, student)

      await DatabaseService.logAction('UPDATE', 'student', id, oldStudent, student)

      return student
    } catch (error) {
      console.error('Failed to update student:', error)
      throw error
    }
  }

  static async deleteStudent(id: string) {
    try {
      const oldStudent = useStudents.getState().students.find(s => s.id === id)
      await DatabaseService.deleteStudent(id)
      useStudents.getState().deleteStudent(id)

      await DatabaseService.logAction('DELETE', 'student', id, oldStudent, null)

      useAttendance.getState().deleteStudentAttendance(id)
      useFinance.getState().deleteStudentInvoices(id)
    } catch (error) {
      console.error('Failed to delete student:', error)
      throw error
    }
  }

  static async markAttendance(data: any) {
    try {
      const record = await DatabaseService.markAttendance(data)
      useAttendance.getState().addAttendanceRecord(record)

      if (data.status === 'absent') {
        const student = useStudents.getState().students.find(s => s.id === data.student_id)
        if (student) {
          await this.sendAbsenceNotification(student, data.date)
        }
      }

      return record
    } catch (error) {
      console.error('Failed to mark attendance:', error)
      throw error
    }
  }

  static async sendAbsenceNotification(student: any, date: string) {
    try {
      const message = {
        type: 'sms',
        subject: 'Absence Notification',
        content: `Your child ${student.name} was absent from school on ${date}. Please contact the school if this was unplanned.`,
        recipients: student.guardians?.map((g: any) => ({
          type: 'guardian',
          contact: g.phone,
          status: 'pending'
        })) || [],
        status: 'pending'
      }

      await DatabaseService.sendMessage(message)
      useCommunications.getState().addMessage(message)
    } catch (error) {
      console.error('Failed to send absence notification:', error)
    }
  }

  static async createInvoice(data: any) {
    try {
      const invoice = await DatabaseService.createInvoice(data)
      useFinance.getState().addInvoice(invoice)

      const student = useStudents.getState().students.find(s => s.id === data.student_id)
      if (student) {
        await this.sendInvoiceNotification(student, invoice)
      }

      return invoice
    } catch (error) {
      console.error('Failed to create invoice:', error)
      throw error
    }
  }

  static async sendInvoiceNotification(student: any, invoice: any) {
    try {
      const message = {
        type: 'sms',
        subject: 'Fee Invoice',
        content: `Term ${invoice.term} fees for ${student.name}: KES ${invoice.total_amount.toLocaleString()}. Due: ${new Date(invoice.due_date).toLocaleDateString()}`,
        recipients: student.guardians?.map((g: any) => ({
          type: 'guardian',
          contact: g.phone,
          status: 'pending'
        })) || [],
        status: 'pending'
      }

      await DatabaseService.sendMessage(message)
      useCommunications.getState().addMessage(message)
    } catch (error) {
      console.error('Failed to send invoice notification:', error)
    }
  }

  static async recordPayment(data: any) {
    try {
      const payment = await DatabaseService.recordPayment(data)
      useFinance.getState().addPayment(payment)

      await this.loadAllData()

      return payment
    } catch (error) {
      console.error('Failed to record payment:', error)
      throw error
    }
  }

  static async createTask(data: any) {
    try {
      const task = await DatabaseService.createTask(data)
      useAssessment.getState().addTask(task)
      return task
    } catch (error) {
      console.error('Failed to create task:', error)
      throw error
    }
  }

  static async createEvent(data: any) {
    try {
      const event = await DatabaseService.createEvent(data)
      useEvents.getState().addEvent(event)
      return event
    } catch (error) {
      console.error('Failed to create event:', error)
      throw error
    }
  }

  static async issueBook(data: any) {
    try {
      const issue = await DatabaseService.issueBook(data)
      useLibrary.getState().issueBook(data)
      return issue
    } catch (error) {
      console.error('Failed to issue book:', error)
      throw error
    }
  }

  static getTransportRoutes() {
    return DatabaseService.getTransportRoutes()
  }
}

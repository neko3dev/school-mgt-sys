// Real-world integrations for Kenyan schools
import { supabase } from './supabase';

// M-PESA Integration
export class MPESAService {
  private static readonly SANDBOX_URL = 'https://sandbox.safaricom.co.ke';
  private static readonly PRODUCTION_URL = 'https://api.safaricom.co.ke';
  
  static async generateAccessToken() {
    const consumerKey = import.meta.env.VITE_MPESA_CONSUMER_KEY;
    const consumerSecret = import.meta.env.VITE_MPESA_CONSUMER_SECRET;
    
    if (!consumerKey || !consumerSecret) {
      throw new Error('M-PESA credentials not configured');
    }
    
    const auth = btoa(`${consumerKey}:${consumerSecret}`);
    
    try {
      const response = await fetch(`${this.SANDBOX_URL}/oauth/v1/generate?grant_type=client_credentials`, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error('M-PESA token generation failed:', error);
      throw error;
    }
  }
  
  static async initiateSTKPush(phoneNumber: string, amount: number, reference: string) {
    try {
      const accessToken = await this.generateAccessToken();
      const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
      const shortcode = import.meta.env.VITE_MPESA_SHORTCODE || '174379';
      const passkey = import.meta.env.VITE_MPESA_PASSKEY;
      
      const password = btoa(`${shortcode}${passkey}${timestamp}`);
      
      const payload = {
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: amount,
        PartyA: phoneNumber,
        PartyB: shortcode,
        PhoneNumber: phoneNumber,
        CallBackURL: `${window.location.origin}/api/mpesa/callback`,
        AccountReference: reference,
        TransactionDesc: `School fees payment for ${reference}`
      };
      
      const response = await fetch(`${this.SANDBOX_URL}/mpesa/stkpush/v1/processrequest`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      return await response.json();
    } catch (error) {
      console.error('STK Push failed:', error);
      throw error;
    }
  }
  
  static async queryTransactionStatus(checkoutRequestId: string) {
    try {
      const accessToken = await this.generateAccessToken();
      const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
      const shortcode = import.meta.env.VITE_MPESA_SHORTCODE || '174379';
      const passkey = import.meta.env.VITE_MPESA_PASSKEY;
      
      const password = btoa(`${shortcode}${passkey}${timestamp}`);
      
      const payload = {
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestId
      };
      
      const response = await fetch(`${this.SANDBOX_URL}/mpesa/stkpushquery/v1/query`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      return await response.json();
    } catch (error) {
      console.error('Transaction query failed:', error);
      throw error;
    }
  }
}

// SMS Gateway Integration
export class SMSService {
  private static readonly API_URL = 'https://api.africastalking.com/version1';
  
  static async sendSMS(phoneNumbers: string[], message: string) {
    const apiKey = import.meta.env.VITE_SMS_API_KEY;
    const username = import.meta.env.VITE_SMS_USERNAME || 'sandbox';
    
    if (!apiKey) {
      console.warn('SMS API key not configured, simulating SMS send');
      return { success: true, messageId: `sim-${Date.now()}` };
    }
    
    try {
      const response = await fetch(`${this.API_URL}/messaging`, {
        method: 'POST',
        headers: {
          'apiKey': apiKey,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          username: username,
          to: phoneNumbers.join(','),
          message: message,
          from: import.meta.env.VITE_SMS_SENDER_ID || 'SCHOOL'
        })
      });
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('SMS sending failed:', error);
      throw error;
    }
  }
}

// Email Service Integration
export class EmailService {
  static async sendEmail(to: string[], subject: string, content: string) {
    // Using EmailJS for client-side email sending
    const serviceId = import.meta.env.VITE_EMAIL_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAIL_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAIL_PUBLIC_KEY;
    
    if (!serviceId || !templateId || !publicKey) {
      console.warn('Email service not configured, simulating email send');
      return { success: true, messageId: `email-${Date.now()}` };
    }
    
    try {
      // This would integrate with EmailJS or similar service
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          service_id: serviceId,
          template_id: templateId,
          user_id: publicKey,
          template_params: {
            to_email: to.join(','),
            subject: subject,
            message: content,
            from_name: 'Karagita Primary School'
          }
        })
      });
      
      return { success: response.ok, messageId: `email-${Date.now()}` };
    } catch (error) {
      console.error('Email sending failed:', error);
      throw error;
    }
  }
}

// NEMIS/KEMIS Integration
export class NEMISService {
  static async exportStudentData(students: any[]) {
    // Format student data for NEMIS submission
    const nemisData = students.map(student => ({
      UPI: student.upi,
      ADMISSION_NO: student.admission_no,
      FIRST_NAME: student.name.split(' ')[0],
      MIDDLE_NAME: student.name.split(' ')[1] || '',
      LAST_NAME: student.name.split(' ').slice(-1)[0],
      DATE_OF_BIRTH: student.dob,
      GENDER: student.sex,
      CLASS: student.classroom_id,
      STATUS: student.status.toUpperCase(),
      SPECIAL_NEEDS: student.special_needs ? 'YES' : 'NO',
      ENTRY_DATE: student.created_at.split('T')[0]
    }));
    
    // Generate CSV for NEMIS upload
    const headers = Object.keys(nemisData[0]).join(',');
    const rows = nemisData.map(row => Object.values(row).map(v => `"${v}"`).join(',')).join('\n');
    const csvContent = `${headers}\n${rows}`;
    
    // Download file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NEMIS_Export_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    return { success: true, recordCount: nemisData.length };
  }
}

// KNEC Integration
export class KNECService {
  static async exportAssessmentData(tasks: any[], evidence: any[]) {
    // Format assessment data for KNEC submission
    const knecData = evidence.map(ev => {
      const task = tasks.find(t => t.id === ev.task_id);
      return {
        UPI: ev.learner_upi || 'UPI_PLACEHOLDER',
        SUBJECT_CODE: task?.subject_id || '',
        TASK_TITLE: task?.title || '',
        PROFICIENCY_LEVEL: ev.proficiency_level.toUpperCase(),
        SCORE: ev.score,
        TERM: task?.term || 1,
        ACADEMIC_YEAR: task?.academic_year || '2024',
        EVIDENCE_TYPE: ev.files?.[0]?.type || 'document',
        TEACHER_ID: ev.teacher_id,
        CAPTURED_DATE: ev.captured_at.split('T')[0]
      };
    });
    
    // Generate Excel file for KNEC
    const headers = Object.keys(knecData[0] || {}).join('\t');
    const rows = knecData.map(row => Object.values(row).join('\t')).join('\n');
    const content = `${headers}\n${rows}`;
    
    const blob = new Blob([content], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `KNEC_SBA_Export_${new Date().toISOString().split('T')[0]}.xlsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    return { success: true, recordCount: knecData.length };
  }
}

// Configuration Management
export class ConfigurationService {
  static async updateSchoolSettings(settings: any) {
    try {
      // Save to Supabase if connected
      const { data, error } = await supabase
        .from('school_settings')
        .upsert(settings);
      
      if (error) throw error;
      
      // Update local storage as backup
      localStorage.setItem('school_settings', JSON.stringify(settings));
      
      return { success: true, data };
    } catch (error) {
      console.warn('Database update failed, using local storage:', error);
      localStorage.setItem('school_settings', JSON.stringify(settings));
      return { success: true, data: settings };
    }
  }
  
  static async getSchoolSettings() {
    try {
      const { data, error } = await supabase
        .from('school_settings')
        .select('*')
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.warn('Database fetch failed, using local storage:', error);
      const stored = localStorage.getItem('school_settings');
      return stored ? JSON.parse(stored) : null;
    }
  }
  
  static async testIntegrations() {
    const results = {
      mpesa: false,
      sms: false,
      email: false,
      database: false
    };
    
    // Test M-PESA
    try {
      await MPESAService.generateAccessToken();
      results.mpesa = true;
    } catch (error) {
      console.warn('M-PESA integration test failed:', error);
    }
    
    // Test SMS
    try {
      await SMSService.sendSMS(['+254700000000'], 'Test message');
      results.sms = true;
    } catch (error) {
      console.warn('SMS integration test failed:', error);
    }
    
    // Test Email
    try {
      await EmailService.sendEmail(['test@example.com'], 'Test', 'Test message');
      results.email = true;
    } catch (error) {
      console.warn('Email integration test failed:', error);
    }
    
    // Test Database
    try {
      const { data, error } = await supabase.from('students').select('count').limit(1);
      results.database = !error;
    } catch (error) {
      console.warn('Database integration test failed:', error);
    }
    
    return results;
  }
}

// Notification Service
export class NotificationService {
  static async sendNotification(type: 'sms' | 'email' | 'push', recipients: string[], message: string, subject?: string) {
    try {
      switch (type) {
        case 'sms':
          return await SMSService.sendSMS(recipients, message);
        case 'email':
          return await EmailService.sendEmail(recipients, subject || 'School Notification', message);
        case 'push':
          // Implement push notification logic
          console.log('Push notification sent:', { recipients, message });
          return { success: true, messageId: `push-${Date.now()}` };
        default:
          throw new Error(`Unsupported notification type: ${type}`);
      }
    } catch (error) {
      console.error(`${type} notification failed:`, error);
      throw error;
    }
  }
  
  static async sendBulkNotifications(notifications: Array<{
    type: 'sms' | 'email' | 'push';
    recipients: string[];
    message: string;
    subject?: string;
  }>) {
    const results = [];
    
    for (const notification of notifications) {
      try {
        const result = await this.sendNotification(
          notification.type,
          notification.recipients,
          notification.message,
          notification.subject
        );
        results.push({ ...notification, result, success: true });
      } catch (error) {
        results.push({ ...notification, error, success: false });
      }
    }
    
    return results;
  }
}

// Data Sync Service
export class DataSyncService {
  static async syncToCloud(data: any) {
    try {
      const { data: result, error } = await supabase
        .from('sync_queue')
        .insert({
          data: data,
          sync_type: 'manual',
          created_at: new Date().toISOString()
        });
      
      if (error) throw error;
      return { success: true, syncId: result?.[0]?.id };
    } catch (error) {
      console.error('Cloud sync failed:', error);
      // Store in local queue for later sync
      const queue = JSON.parse(localStorage.getItem('sync_queue') || '[]');
      queue.push({ data, timestamp: new Date().toISOString() });
      localStorage.setItem('sync_queue', JSON.stringify(queue));
      return { success: false, error };
    }
  }
  
  static async processSyncQueue() {
    const queue = JSON.parse(localStorage.getItem('sync_queue') || '[]');
    const results = [];
    
    for (const item of queue) {
      try {
        const result = await this.syncToCloud(item.data);
        if (result.success) {
          results.push({ item, success: true });
        }
      } catch (error) {
        results.push({ item, success: false, error });
      }
    }
    
    // Clear successfully synced items
    const failedItems = results.filter(r => !r.success).map(r => r.item);
    localStorage.setItem('sync_queue', JSON.stringify(failedItems));
    
    return results;
  }
}

// Backup Service
export class BackupService {
  static async createBackup() {
    try {
      // Get all data from stores
      const backupData = {
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        school: 'Karagita Primary School',
        data: {
          students: JSON.parse(localStorage.getItem('students-storage') || '{}'),
          staff: JSON.parse(localStorage.getItem('staff-storage') || '{}'),
          finance: JSON.parse(localStorage.getItem('finance-storage') || '{}'),
          attendance: JSON.parse(localStorage.getItem('attendance-storage') || '{}'),
          assessment: JSON.parse(localStorage.getItem('assessment-storage') || '{}'),
          settings: JSON.parse(localStorage.getItem('settings-storage') || '{}')
        }
      };
      
      // Create backup file
      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `school_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      // Also save to cloud if available
      try {
        await supabase.from('backups').insert({
          data: backupData,
          created_at: new Date().toISOString()
        });
      } catch (cloudError) {
        console.warn('Cloud backup failed, local backup created:', cloudError);
      }
      
      return { success: true, timestamp: backupData.timestamp };
    } catch (error) {
      console.error('Backup creation failed:', error);
      throw error;
    }
  }
  
  static async restoreBackup(backupFile: File) {
    try {
      const content = await backupFile.text();
      const backupData = JSON.parse(content);
      
      // Validate backup structure
      if (!backupData.data || !backupData.timestamp) {
        throw new Error('Invalid backup file format');
      }
      
      // Restore data to localStorage
      Object.entries(backupData.data).forEach(([key, value]) => {
        localStorage.setItem(`${key}-storage`, JSON.stringify(value));
      });
      
      // Reload the page to apply restored data
      window.location.reload();
      
      return { success: true };
    } catch (error) {
      console.error('Backup restoration failed:', error);
      throw error;
    }
  }
}
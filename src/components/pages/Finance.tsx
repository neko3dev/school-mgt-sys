import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { mockFeeInvoices, mockLearners } from '@/data/mock-data';
import { formatCurrency, formatDate } from '@/lib/utils';
import { 
  CreditCard, 
  Plus, 
  Eye, 
  Download, 
  Send,
  Smartphone,
  Receipt,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Users,
  Calendar
} from 'lucide-react';

export function Finance() {
  const [activeTab, setActiveTab] = useState('overview');
  const [mpesaPhone, setMpesaPhone] = useState('');

  const totalFees = mockFeeInvoices.reduce((sum, invoice) => sum + invoice.total, 0);
  const totalPaid = mockFeeInvoices.reduce((sum, invoice) => sum + (invoice.total - invoice.balance), 0);
  const totalBalance = mockFeeInvoices.reduce((sum, invoice) => sum + invoice.balance, 0);

  const InvoiceCard = ({ invoice }: { invoice: any }) => {
    const student = mockLearners.find(s => s.id === invoice.learner_id);
    const paymentStatus = invoice.status;
    const isPaid = invoice.balance === 0;
    
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="font-semibold text-gray-900">{student?.name}</h3>
                <Badge variant="outline">{student?.admission_no}</Badge>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="font-semibold">{formatCurrency(invoice.total)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Balance:</span>
                  <span className={`font-semibold ${isPaid ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(invoice.balance)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Due Date:</span>
                  <span>{formatDate(invoice.due_date)}</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-end space-y-2">
              <Badge variant={
                isPaid ? "default" : 
                paymentStatus === 'overdue' ? "destructive" : "secondary"
              }>
                {isPaid ? 'Paid' : paymentStatus}
              </Badge>
              
              <div className="flex space-x-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Fee Invoice - {student?.name}</DialogTitle>
                    </DialogHeader>
                    <InvoiceDetails invoice={invoice} student={student} />
                  </DialogContent>
                </Dialog>
                
                {!isPaid && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Smartphone className="h-4 w-4 mr-1" />
                        M-PESA
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>M-PESA Payment</DialogTitle>
                      </DialogHeader>
                      <MPESAPayment invoice={invoice} student={student} />
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const InvoiceDetails = ({ invoice, student }: { invoice: any; student: any }) => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Student</label>
              <p className="text-gray-900">{student?.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Admission No.</label>
              <p className="text-gray-900 font-mono">{student?.admission_no}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Academic Year</label>
              <p className="text-gray-900">{invoice.academic_year} - Term {invoice.term}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Total Amount</label>
              <p className="text-gray-900 text-lg font-semibold">{formatCurrency(invoice.total)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Outstanding Balance</label>
              <p className={`text-lg font-semibold ${
                invoice.balance === 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatCurrency(invoice.balance)}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Status</label>
              <Badge variant={invoice.balance === 0 ? "default" : "destructive"}>
                {invoice.balance === 0 ? 'Paid' : invoice.status}
              </Badge>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Fee Breakdown</h4>
          <div className="space-y-2">
            {invoice.items.map((item: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-900">{item.name}</span>
                <span className="font-semibold">{formatCurrency(item.amount)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex space-x-2">
          <Button className="flex-1">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
          <Button variant="outline" className="flex-1">
            <Send className="h-4 w-4 mr-2" />
            Send to Parent
          </Button>
        </div>
      </div>
    );
  };

  const MPESAPayment = ({ invoice, student }: { invoice: any; student: any }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');

    const handleMPESAPayment = async () => {
      setIsProcessing(true);
      setPaymentStatus('processing');
      
      // Simulate M-PESA STK Push
      setTimeout(() => {
        const success = Math.random() > 0.2; // 80% success rate
        setPaymentStatus(success ? 'success' : 'failed');
        setIsProcessing(false);
      }, 3000);
    };

    return (
      <div className="space-y-6">
        {paymentStatus === 'idle' && (
          <>
            <div className="text-center">
              <Smartphone className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">M-PESA Payment</h3>
              <p className="text-gray-600">Send payment request to parent's phone</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Amount to Pay</label>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(invoice.balance)}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Phone Number</label>
                <Input
                  placeholder="254700123456"
                  value={mpesaPhone}
                  onChange={(e) => setMpesaPhone(e.target.value)}
                />
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Payment Details</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Student:</span>
                    <span>{student?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Term:</span>
                    <span>Term {invoice.term}, {invoice.academic_year}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Amount:</span>
                    <span className="font-semibold">{formatCurrency(invoice.balance)}</span>
                  </div>
                </div>
              </div>
            </div>

            <Button 
              className="w-full" 
              onClick={handleMPESAPayment}
              disabled={!mpesaPhone}
            >
              <Smartphone className="h-4 w-4 mr-2" />
              Send M-PESA Request
            </Button>
          </>
        )}

        {paymentStatus === 'processing' && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Processing Payment</h3>
            <p className="text-gray-600">Please wait for M-PESA confirmation...</p>
          </div>
        )}

        {paymentStatus === 'success' && (
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-green-800 mb-2">Payment Successful!</h3>
            <p className="text-gray-600 mb-4">Transaction completed successfully</p>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>Transaction ID:</strong> MPESA123ABC456
              </p>
              <p className="text-sm text-green-800">
                <strong>Amount:</strong> {formatCurrency(invoice.balance)}
              </p>
            </div>
          </div>
        )}

        {paymentStatus === 'failed' && (
          <div className="text-center py-8">
            <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-800 mb-2">Payment Failed</h3>
            <p className="text-gray-600 mb-4">Please try again or contact support</p>
            <Button variant="outline" onClick={() => setPaymentStatus('idle')}>
              Try Again
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Finance</h1>
          <p className="text-gray-600 mt-1">Fee management and M-PESA integration</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="secondary" className="bg-green-50 text-green-700">
            M-PESA Integrated
          </Badge>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Invoice
          </Button>
        </div>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Fees</p>
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalFees)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Collected</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(totalPaid)}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Outstanding</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(totalBalance)}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Collection Rate</p>
                <p className="text-2xl font-bold text-purple-600">
                  {((totalPaid / totalFees) * 100).toFixed(0)}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="invoices">Invoices ({mockFeeInvoices.length})</TabsTrigger>
          <TabsTrigger value="payments">M-PESA Payments</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Smartphone className="h-6 w-6 text-green-600" />
                      <div>
                        <p className="font-semibold text-green-800">M-PESA</p>
                        <p className="text-sm text-green-600">Mobile payments</p>
                      </div>
                    </div>
                    <Badge variant="default">85%</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CreditCard className="h-6 w-6 text-blue-600" />
                      <div>
                        <p className="font-semibold text-blue-800">Bank Transfer</p>
                        <p className="text-sm text-blue-600">Direct deposits</p>
                      </div>
                    </div>
                    <Badge variant="secondary">12%</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Receipt className="h-6 w-6 text-gray-600" />
                      <div>
                        <p className="font-semibold text-gray-800">Cash</p>
                        <p className="text-sm text-gray-600">Physical payments</p>
                      </div>
                    </div>
                    <Badge variant="secondary">3%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { student: 'Grace Wanjiku', amount: 15000, time: '2 hours ago', method: 'M-PESA' },
                    { student: 'Brian Kiprotich', amount: 8000, time: '4 hours ago', method: 'Bank' },
                    { student: 'Amina Hassan', amount: 12000, time: '1 day ago', method: 'M-PESA' },
                  ].map((transaction, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{transaction.student}</p>
                        <p className="text-sm text-gray-600">{transaction.time}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">{formatCurrency(transaction.amount)}</p>
                        <Badge variant="outline" className="text-xs">{transaction.method}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="invoices" className="space-y-4">
          {mockFeeInvoices.map((invoice) => (
            <InvoiceCard key={invoice.id} invoice={invoice} />
          ))}
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Smartphone className="h-5 w-5 text-green-600" />
                <span>M-PESA Integration Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="font-semibold text-green-800">Connected</p>
                  <p className="text-sm text-green-600">API Active</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="font-semibold text-blue-800">Auto-Reconciliation</p>
                  <p className="text-sm text-blue-600">Enabled</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <p className="font-semibold text-purple-800">Success Rate</p>
                  <p className="text-sm text-purple-600">98.5%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Payment Timing</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">On Time</span>
                        <div className="flex items-center space-x-2">
                          <Progress value={80} className="w-20 [&>div]:bg-green-500" />
                          <span className="text-sm">80%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Late</span>
                        <div className="flex items-center space-x-2">
                          <Progress value={20} className="w-20 [&>div]:bg-yellow-500" />
                          <span className="text-sm">20%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Collection by Grade</h4>
                    <div className="space-y-2">
                      {[
                        { grade: 'Grade 1', rate: 95 },
                        { grade: 'Grade 2', rate: 88 },
                        { grade: 'Grade 3', rate: 92 },
                        { grade: 'Grade 4', rate: 85 }
                      ].map((item) => (
                        <div key={item.grade} className="flex items-center justify-between">
                          <span className="text-sm">{item.grade}</span>
                          <div className="flex items-center space-x-2">
                            <Progress value={item.rate} className="w-20" />
                            <span className="text-sm">{item.rate}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Financial Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: 'Fee Collection Summary', description: 'Monthly collection report' },
                    { name: 'Outstanding Balances', description: 'Arrears aging report' },
                    { name: 'Payment Method Analysis', description: 'Channel performance' },
                    { name: 'Student Account Statements', description: 'Individual payment history' }
                  ].map((report, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{report.name}</p>
                        <p className="text-sm text-gray-600">{report.description}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Export
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Compliance Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: 'Audit Trail', description: 'All financial transactions' },
                    { name: 'Reconciliation Report', description: 'M-PESA vs school records' },
                    { name: 'Bursary Fund Report', description: 'Government funding usage' },
                    { name: 'Tax Returns Data', description: 'Withholding tax summary' }
                  ].map((report, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{report.name}</p>
                        <p className="text-sm text-gray-600">{report.description}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Generate
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
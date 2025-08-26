import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { formatCurrency } from '@/lib/utils';
import { 
  Smartphone, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  RefreshCw,
  Shield,
  Zap
} from 'lucide-react';

interface MPESAIntegrationProps {
  invoice: any;
  onPaymentComplete: (payment: any) => void;
}

export function MPESAIntegration({ invoice, onPaymentComplete }: MPESAIntegrationProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'initiating' | 'pending' | 'success' | 'failed' | 'timeout'>('idle');
  const [transactionId, setTransactionId] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            setPaymentStatus('timeout');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [countdown]);

  const formatPhoneNumber = (phone: string) => {
    // Remove any non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    
    // Handle different formats
    if (cleaned.startsWith('0')) {
      return '254' + cleaned.substring(1);
    } else if (cleaned.startsWith('254')) {
      return cleaned;
    } else if (cleaned.length === 9) {
      return '254' + cleaned;
    }
    return cleaned;
  };

  const initiateSTKPush = async () => {
    setError('');
    setPaymentStatus('initiating');
    
    const formattedPhone = formatPhoneNumber(phoneNumber);
    
    // Validate phone number
    if (!formattedPhone.match(/^254[17]\d{8}$/)) {
      setError('Please enter a valid Safaricom number (07XX XXX XXX or 01XX XXX XXX)');
      setPaymentStatus('idle');
      return;
    }

    try {
      // Simulate API call to M-PESA
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate mock transaction ID
      const mockTransactionId = 'MPESA' + Math.random().toString(36).substr(2, 9).toUpperCase();
      setTransactionId(mockTransactionId);
      setPaymentStatus('pending');
      setCountdown(120); // 2 minutes timeout
      
      // Simulate payment completion (80% success rate)
      setTimeout(() => {
        if (Math.random() > 0.2) {
          setPaymentStatus('success');
          onPaymentComplete({
            id: mockTransactionId,
            amount: invoice.balance,
            phone: formattedPhone,
            reference: invoice.id,
            status: 'success',
            timestamp: new Date().toISOString()
          });
        } else {
          setPaymentStatus('failed');
          setError('Payment was cancelled or failed. Please try again.');
        }
      }, Math.random() * 30000 + 10000); // Random delay between 10-40 seconds
      
    } catch (err) {
      setError('Failed to initiate payment. Please check your connection and try again.');
      setPaymentStatus('failed');
    }
  };

  const resetPayment = () => {
    setPaymentStatus('idle');
    setTransactionId('');
    setCountdown(0);
    setError('');
  };

  const getStatusIcon = () => {
    switch (paymentStatus) {
      case 'initiating':
        return <RefreshCw className="h-8 w-8 text-blue-600 animate-spin" />;
      case 'pending':
        return <Clock className="h-8 w-8 text-yellow-600 animate-pulse" />;
      case 'success':
        return <CheckCircle className="h-8 w-8 text-green-600" />;
      case 'failed':
      case 'timeout':
        return <AlertTriangle className="h-8 w-8 text-red-600" />;
      default:
        return <Smartphone className="h-8 w-8 text-blue-600" />;
    }
  };

  const getStatusMessage = () => {
    switch (paymentStatus) {
      case 'initiating':
        return 'Initiating M-PESA payment...';
      case 'pending':
        return `Check your phone for M-PESA prompt (${Math.floor(countdown / 60)}:${(countdown % 60).toString().padStart(2, '0')})`;
      case 'success':
        return 'Payment completed successfully!';
      case 'failed':
        return 'Payment failed. Please try again.';
      case 'timeout':
        return 'Payment timed out. Please try again.';
      default:
        return 'Enter your M-PESA number to pay';
    }
  };

  return (
    <div className="space-y-6">
      {/* M-PESA Branding */}
      <div className="text-center">
        <div className="inline-flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-full mb-4">
          <Smartphone className="h-5 w-5 text-green-600" />
          <span className="font-semibold text-green-800">M-PESA</span>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Secure
          </Badge>
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Mobile Money Payment</h3>
        <p className="text-gray-600">Pay securely using your Safaricom M-PESA account</p>
      </div>

      {/* Payment Amount */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-6 text-center">
          <div className="text-3xl font-bold text-green-700 mb-2">
            {formatCurrency(invoice.balance)}
          </div>
          <div className="text-sm text-green-600">
            Payment for {invoice.student_name} - Term {invoice.term} Fees
          </div>
        </CardContent>
      </Card>

      {/* Status Display */}
      <Card>
        <CardContent className="p-6 text-center">
          <div className="mb-4">
            {getStatusIcon()}
          </div>
          <p className="text-lg font-medium text-gray-900 mb-2">
            {getStatusMessage()}
          </p>
          
          {paymentStatus === 'pending' && (
            <div className="space-y-3">
              <Progress value={((120 - countdown) / 120) * 100} className="w-full" />
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Shield className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">Secure Transaction</span>
                </div>
                <p className="text-xs text-blue-700">
                  Transaction ID: <span className="font-mono">{transactionId}</span>
                </p>
              </div>
            </div>
          )}

          {paymentStatus === 'success' && (
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">Payment Confirmed</span>
              </div>
              <p className="text-xs text-green-700">
                M-PESA Ref: <span className="font-mono">{transactionId}</span>
              </p>
              <p className="text-xs text-green-700 mt-1">
                You will receive an SMS confirmation shortly
              </p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <span className="text-sm font-medium text-red-800">Error</span>
              </div>
              <p className="text-xs text-red-700">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Phone Number Input */}
      {paymentStatus === 'idle' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Enter M-PESA Number</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="phone">Safaricom Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="0700 123 456"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="text-center text-lg"
              />
              <p className="text-xs text-gray-500 mt-1 text-center">
                Enter your Safaricom number (07XX or 01XX)
              </p>
            </div>

            <Button 
              onClick={initiateSTKPush}
              disabled={!phoneNumber || phoneNumber.length < 10}
              className="w-full bg-green-600 hover:bg-green-700"
              size="lg"
            >
              <Smartphone className="h-4 w-4 mr-2" />
              Pay {formatCurrency(invoice.balance)}
            </Button>

            <div className="text-center">
              <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <Shield className="h-3 w-3" />
                  <span>Secure</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Zap className="h-3 w-3" />
                  <span>Instant</span>
                </div>
                <div className="flex items-center space-x-1">
                  <CheckCircle className="h-3 w-3" />
                  <span>Verified</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Retry Button */}
      {(paymentStatus === 'failed' || paymentStatus === 'timeout') && (
        <Button 
          onClick={resetPayment}
          variant="outline"
          className="w-full"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      )}

      {/* Help Text */}
      <div className="text-center text-xs text-gray-500 space-y-1">
        <p>• You will receive an M-PESA prompt on your phone</p>
        <p>• Enter your M-PESA PIN to complete the payment</p>
        <p>• Payment confirmation will be sent via SMS</p>
        <p>• For help, contact the school bursar</p>
      </div>
    </div>
  );
}
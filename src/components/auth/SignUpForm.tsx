import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/useAuth'
import { GraduationCap, School, Mail, Phone, MapPin, User, Lock, CheckCircle } from 'lucide-react'

interface SignUpFormProps {
  onSuccess: () => void
  onBackToLogin: () => void
}

export function SignUpForm({ onSuccess, onBackToLogin }: SignUpFormProps) {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    // School Information
    schoolName: '',
    schoolCode: '',
    county: '',
    subcounty: '',
    schoolEmail: '',
    schoolPhone: '',
    schoolAddress: '',
    motto: '',
    
    // Owner Information
    ownerName: '',
    ownerEmail: '',
    ownerPhone: '',
    password: '',
    confirmPassword: '',
    
    // Additional
    studentCount: '',
    currentSystem: ''
  })

  const { signUp } = useAuth()

  const kenyanCounties = [
    'Nairobi', 'Mombasa', 'Kwale', 'Kilifi', 'Tana River', 'Lamu', 'Taita Taveta',
    'Garissa', 'Wajir', 'Mandera', 'Marsabit', 'Isiolo', 'Meru', 'Tharaka Nithi',
    'Embu', 'Kitui', 'Machakos', 'Makueni', 'Nyandarua', 'Nyeri', 'Kirinyaga',
    'Murang\'a', 'Kiambu', 'Turkana', 'West Pokot', 'Samburu', 'Trans Nzoia',
    'Uasin Gishu', 'Elgeyo Marakwet', 'Nandi', 'Baringo', 'Laikipia', 'Nakuru',
    'Narok', 'Kajiado', 'Kericho', 'Bomet', 'Kakamega', 'Vihiga', 'Bungoma',
    'Busia', 'Siaya', 'Kisumu', 'Homa Bay', 'Migori', 'Kisii', 'Nyamira'
  ]

  const handleNext = () => {
    if (step === 1) {
      // Validate school information
      if (!formData.schoolName || !formData.schoolCode || !formData.county || !formData.schoolEmail) {
        alert('Please fill in all required school information')
        return
      }
    }
    setStep(step + 1)
  }

  const handleBack = () => {
    setStep(step - 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match')
      return
    }

    if (formData.password.length < 8) {
      alert('Password must be at least 8 characters long')
      return
    }

    setLoading(true)
    
    try {
      await signUp(formData.ownerEmail, formData.password, {
        name: formData.schoolName,
        code: formData.schoolCode,
        county: formData.county,
        subcounty: formData.subcounty,
        email: formData.schoolEmail,
        phone: formData.schoolPhone,
        address: formData.schoolAddress,
        motto: formData.motto,
        ownerName: formData.ownerName
      })
      
      onSuccess()
    } catch (error: any) {
      alert(error.message || 'Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-background to-green-50 dark:from-gray-900 dark:via-background dark:to-gray-800 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-600 rounded-full">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-center">
            <h2 className="text-2xl font-bold">Start Your Free Trial</h2>
            <p className="text-gray-600 mt-2">Set up your school in minutes</p>
          </CardTitle>
          
          {/* Progress Indicator */}
          <div className="flex items-center justify-center space-x-4 mt-6">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= stepNumber ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {step > stepNumber ? <CheckCircle className="h-4 w-4" /> : stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div className={`w-12 h-1 ${step > stepNumber ? 'bg-blue-600' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
          
          <div className="text-center mt-2">
            <Badge variant="secondary">
              Step {step} of 3: {
                step === 1 ? 'School Information' :
                step === 2 ? 'Administrator Account' :
                'Confirmation'
              }
            </Badge>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <School className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="text-lg font-semibold">School Information</h3>
                  <p className="text-gray-600">Tell us about your school</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="schoolName">School Name *</Label>
                    <Input
                      id="schoolName"
                      value={formData.schoolName}
                      onChange={(e) => setFormData(prev => ({ ...prev, schoolName: e.target.value }))}
                      placeholder="e.g., Karagita Primary School"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="schoolCode">School Code *</Label>
                    <Input
                      id="schoolCode"
                      value={formData.schoolCode}
                      onChange={(e) => setFormData(prev => ({ ...prev, schoolCode: e.target.value }))}
                      placeholder="e.g., 01-01-001-001"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>County *</Label>
                    <Select value={formData.county} onValueChange={(value) => setFormData(prev => ({ ...prev, county: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select county" />
                      </SelectTrigger>
                      <SelectContent>
                        {kenyanCounties.map((county) => (
                          <SelectItem key={county} value={county}>{county}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="subcounty">Sub-County *</Label>
                    <Input
                      id="subcounty"
                      value={formData.subcounty}
                      onChange={(e) => setFormData(prev => ({ ...prev, subcounty: e.target.value }))}
                      placeholder="e.g., Dagoretti North"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="schoolEmail">School Email *</Label>
                    <Input
                      id="schoolEmail"
                      type="email"
                      value={formData.schoolEmail}
                      onChange={(e) => setFormData(prev => ({ ...prev, schoolEmail: e.target.value }))}
                      placeholder="admin@yourschool.ac.ke"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="schoolPhone">School Phone</Label>
                    <Input
                      id="schoolPhone"
                      value={formData.schoolPhone}
                      onChange={(e) => setFormData(prev => ({ ...prev, schoolPhone: e.target.value }))}
                      placeholder="+254 700 123 456"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="schoolAddress">School Address</Label>
                  <Input
                    id="schoolAddress"
                    value={formData.schoolAddress}
                    onChange={(e) => setFormData(prev => ({ ...prev, schoolAddress: e.target.value }))}
                    placeholder="P.O. Box 12345, Nairobi"
                  />
                </div>

                <div>
                  <Label htmlFor="motto">School Motto</Label>
                  <Input
                    id="motto"
                    value={formData.motto}
                    onChange={(e) => setFormData(prev => ({ ...prev, motto: e.target.value }))}
                    placeholder="e.g., Excellence Through Education"
                  />
                </div>

                <Button type="button" onClick={handleNext} className="w-full">
                  Continue to Administrator Setup
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <User className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="text-lg font-semibold">Administrator Account</h3>
                  <p className="text-gray-600">Create your admin account</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="ownerName">Full Name *</Label>
                    <Input
                      id="ownerName"
                      value={formData.ownerName}
                      onChange={(e) => setFormData(prev => ({ ...prev, ownerName: e.target.value }))}
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="ownerPhone">Phone Number</Label>
                    <Input
                      id="ownerPhone"
                      value={formData.ownerPhone}
                      onChange={(e) => setFormData(prev => ({ ...prev, ownerPhone: e.target.value }))}
                      placeholder="+254 700 123 456"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="ownerEmail">Email Address *</Label>
                  <Input
                    id="ownerEmail"
                    type="email"
                    value={formData.ownerEmail}
                    onChange={(e) => setFormData(prev => ({ ...prev, ownerEmail: e.target.value }))}
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="Minimum 8 characters"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      placeholder="Confirm your password"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Number of Students</Label>
                    <Select value={formData.studentCount} onValueChange={(value) => setFormData(prev => ({ ...prev, studentCount: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-100">1-100 students</SelectItem>
                        <SelectItem value="101-300">101-300 students</SelectItem>
                        <SelectItem value="301-600">301-600 students</SelectItem>
                        <SelectItem value="600+">600+ students</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Current System</Label>
                    <Select value={formData.currentSystem} onValueChange={(value) => setFormData(prev => ({ ...prev, currentSystem: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="What do you use now?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manual">Manual/Paper records</SelectItem>
                        <SelectItem value="excel">Excel spreadsheets</SelectItem>
                        <SelectItem value="other_software">Other software</SelectItem>
                        <SelectItem value="none">No system currently</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button type="button" variant="outline" onClick={handleBack} className="flex-1">
                    Back
                  </Button>
                  <Button type="button" onClick={handleNext} className="flex-1">
                    Review & Create Account
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <h3 className="text-lg font-semibold">Review Your Information</h3>
                  <p className="text-gray-600">Confirm your details and start your free trial</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">School Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div><strong>Name:</strong> {formData.schoolName}</div>
                      <div><strong>Code:</strong> {formData.schoolCode}</div>
                      <div><strong>Location:</strong> {formData.county}, {formData.subcounty}</div>
                      <div><strong>Email:</strong> {formData.schoolEmail}</div>
                      {formData.motto && <div><strong>Motto:</strong> {formData.motto}</div>}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Administrator</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div><strong>Name:</strong> {formData.ownerName}</div>
                      <div><strong>Email:</strong> {formData.ownerEmail}</div>
                      {formData.ownerPhone && <div><strong>Phone:</strong> {formData.ownerPhone}</div>}
                      {formData.studentCount && <div><strong>Students:</strong> {formData.studentCount}</div>}
                    </CardContent>
                  </Card>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-800">30-Day Free Trial Included</span>
                  </div>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Full access to all features</li>
                    <li>• No credit card required</li>
                    <li>• Cancel anytime during trial</li>
                    <li>• Free setup and onboarding support</li>
                  </ul>
                </div>

                <div className="flex space-x-2">
                  <Button type="button" variant="outline" onClick={handleBack} className="flex-1">
                    Back
                  </Button>
                  <Button type="submit" disabled={loading} className="flex-1">
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <School className="h-4 w-4 mr-2" />
                        Create School Account
                      </>
                    )}
                  </Button>
                </div>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={onBackToLogin}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Already have an account? Sign in
                  </button>
                </div>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
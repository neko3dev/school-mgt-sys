import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth, useUI } from '@/store';
import { 
  Settings as SettingsIcon,
  School,
  Users,
  Database,
  Shield,
  Bell,
  Palette,
  Globe,
  HardDrive,
  CheckCircle,
  AlertTriangle,
  Monitor,
  Smartphone,
  Mail,
  MessageSquare,
  Key,
  Clock,
  Download,
  Upload
} from 'lucide-react';

export function Settings() {
  const { user, tenant } = useAuth();
  const { theme, setTheme } = useUI();
  const [activeTab, setActiveTab] = useState('school');

  const systemHealth = {
    database: { status: 'healthy', uptime: '99.9%', lastBackup: '2 hours ago' },
    storage: { status: 'healthy', usage: '68%', available: '2.4TB' },
    api: { status: 'healthy', responseTime: '45ms', requests: '1.2K/hour' },
    notifications: { status: 'healthy', delivered: '98.5%', queue: '0' }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">System configuration and administration</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="secondary" className="bg-green-50 text-green-700">
            System Healthy
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="school">School</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        <TabsContent value="school" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <School className="h-5 w-5 text-blue-600" />
                <span>School Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="schoolName">School Name</Label>
                    <Input id="schoolName" defaultValue={tenant?.name || "School Name"} />
                  </div>
                  <div>
                    <Label htmlFor="schoolCode">School Code</Label>
                    <Input id="schoolCode" defaultValue={tenant?.code || "01-01-001-001"} />
                  </div>
                  <div>
                    <Label htmlFor="county">County</Label>
                    <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                      <option selected={tenant?.county === 'Nairobi'}>Nairobi</option>
                      <option>Kiambu</option>
                      <option>Machakos</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="subcounty">Sub-County</Label>
                    <Input id="subcounty" defaultValue={tenant?.subcounty || "Sub-County"} />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="headteacher">Head Teacher</Label>
                    <Input id="headteacher" defaultValue="Jane Wanjiku Mwangi" />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" defaultValue="+254 700 123 456" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" defaultValue="admin@karagita-primary.ac.ke" />
                  </div>
                  <div>
                    <Label htmlFor="address">Physical Address</Label>
                    <Input id="address" defaultValue="P.O. Box 12345, Nairobi" />
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Academic Year Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Current Academic Year</Label>
                  <select className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2">
                    <option selected={tenant?.settings.academic_year === '2024'}>2024</option>
                    <option>2023</option>
                  </select>
                </div>
                <div>
                  <Label>Current Term</Label>
                  <select className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2">
                    <option selected={tenant?.settings.current_term === 1}>Term 1</option>
                    <option>Term 2</option>
                    <option>Term 3</option>
                  </select>
                </div>
                <div>
                  <Label>Term End Date</Label>
                  <Input type="date" defaultValue="2024-04-05" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>School Branding</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>School Logo</Label>
                  <div className="mt-2 flex items-center space-x-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                      <School className="h-8 w-8 text-blue-600" />
                    </div>
                    <div>
                      <Button variant="outline" size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Logo
                      </Button>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 2MB</p>
                    </div>
                  </div>
                </div>
                <div>
                  <Label htmlFor="motto">School Motto</Label>
                  <Input id="motto" defaultValue={tenant?.settings.school_motto || "School Motto"} />
                </div>
                <div>
                  <Label htmlFor="colors">Brand Colors</Label>
                  <div className="mt-2 flex space-x-2">
                    <input type="color" defaultValue={tenant?.settings.brand_colors?.[0] || "#3B82F6"} className="w-12 h-8 rounded border" />
                    <input type="color" defaultValue={tenant?.settings.brand_colors?.[1] || "#10B981"} className="w-12 h-8 rounded border" />
                    <input type="color" defaultValue={tenant?.settings.brand_colors?.[2] || "#F59E0B"} className="w-12 h-8 rounded border" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-green-600" />
                <span>User Management</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">45</p>
                    <p className="text-sm text-blue-600">Total Users</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">38</p>
                    <p className="text-sm text-green-600">Active Users</p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <p className="text-2xl font-bold text-orange-600">7</p>
                    <p className="text-sm text-orange-600">Pending Invites</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    { role: 'Admin', count: 3, permissions: 'Full system access' },
                    { role: 'Teacher', count: 25, permissions: 'Classroom and assessment management' },
                    { role: 'Bursar', count: 2, permissions: 'Financial management' },
                    { role: 'Parent', count: 180, permissions: 'View student progress and fees' }
                  ].map((roleInfo, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{roleInfo.role}</p>
                        <p className="text-sm text-gray-600">{roleInfo.permissions}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary">{roleInfo.count} users</Badge>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex space-x-2">
                  <Button>Add New User</Button>
                  <Button variant="outline">Bulk Import</Button>
                  <Button variant="outline">Export User List</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Access Control</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Default Password Policy</Label>
                  <div className="mt-2 space-y-2">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked />
                      <span className="text-sm">Minimum 8 characters</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked />
                      <span className="text-sm">Require uppercase and lowercase letters</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked />
                      <span className="text-sm">Require at least one number</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" />
                      <span className="text-sm">Require special characters</span>
                    </label>
                  </div>
                </div>

                <div>
                  <Label>Session Timeout</Label>
                  <select className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2">
                    <option>30 minutes</option>
                    <option>1 hour</option>
                    <option>4 hours</option>
                    <option>8 hours</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Monitor className="h-5 w-5 text-purple-600" />
                <span>System Health</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium text-green-800">Database</p>
                      <p className="text-sm text-green-600">Uptime: {systemHealth.database.uptime}</p>
                    </div>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium text-green-800">Storage</p>
                      <p className="text-sm text-green-600">Usage: {systemHealth.storage.usage}</p>
                    </div>
                    <HardDrive className="h-5 w-5 text-green-600" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium text-green-800">API Performance</p>
                      <p className="text-sm text-green-600">Response: {systemHealth.api.responseTime}</p>
                    </div>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium text-green-800">Notifications</p>
                      <p className="text-sm text-green-600">Delivery: {systemHealth.notifications.delivered}</p>
                    </div>
                    <Bell className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Backup & Maintenance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Automatic Backups</Label>
                  <div className="mt-2 space-y-2">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked />
                      <span className="text-sm">Daily database backups</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked />
                      <span className="text-sm">Weekly full system backups</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" />
                      <span className="text-sm">Monthly off-site backups</span>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Last Database Backup</Label>
                    <p className="text-sm text-gray-600 mt-1">{systemHealth.database.lastBackup}</p>
                  </div>
                  <div>
                    <Label>Available Storage</Label>
                    <p className="text-sm text-gray-600 mt-1">{systemHealth.storage.available}</p>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Run Backup Now
                  </Button>
                  <Button variant="outline">
                    <Database className="h-4 w-4 mr-2" />
                    System Diagnostics
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Application Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Theme</Label>
                  <div className="mt-2 flex space-x-4">
                    <label className="flex items-center space-x-2">
                      <input 
                        type="radio" 
                        name="theme" 
                        value="light"
                        checked={theme === 'light'}
                        onChange={() => setTheme('light')}
                      />
                      <span className="text-sm">Light</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input 
                        type="radio" 
                        name="theme" 
                        value="dark"
                        checked={theme === 'dark'}
                        onChange={() => setTheme('dark')}
                      />
                      <span className="text-sm">Dark</span>
                    </label>
                  </div>
                </div>

                <div>
                  <Label>Language</Label>
                  <select className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2">
                    <option>English</option>
                    <option>Kiswahili</option>
                  </select>
                </div>

                <div>
                  <Label>Time Zone</Label>
                  <select className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2">
                    <option>Africa/Nairobi (EAT)</option>
                    <option>UTC</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-red-600" />
                <span>Security Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Label>Two-Factor Authentication</Label>
                    <div className="mt-2">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked />
                        <span className="text-sm">Require 2FA for admin users</span>
                      </label>
                      <label className="flex items-center space-x-2 mt-2">
                        <input type="checkbox" />
                        <span className="text-sm">Require 2FA for all users</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <Label>Login Restrictions</Label>
                    <div className="mt-2 space-y-2">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked />
                        <span className="text-sm">Lock account after 5 failed attempts</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" />
                        <span className="text-sm">Restrict login by IP address</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Data Encryption</Label>
                  <div className="mt-2 grid grid-cols-3 gap-4 text-center">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
                      <p className="text-sm font-medium text-green-800">Data at Rest</p>
                      <p className="text-xs text-green-600">AES-256 Encrypted</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
                      <p className="text-sm font-medium text-green-800">Data in Transit</p>
                      <p className="text-xs text-green-600">TLS 1.3</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
                      <p className="text-sm font-medium text-green-800">API Access</p>
                      <p className="text-xs text-green-600">JWT Tokens</p>
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Audit Logging</Label>
                  <div className="mt-2 space-y-2">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked />
                      <span className="text-sm">Log all user actions</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked />
                      <span className="text-sm">Log system changes</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked />
                      <span className="text-sm">Log data exports</span>
                    </label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>API Security</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>API Rate Limiting</Label>
                  <div className="mt-2 grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-600">Requests per minute</label>
                      <Input type="number" defaultValue="100" />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Burst limit</label>
                      <Input type="number" defaultValue="200" />
                    </div>
                  </div>
                </div>

                <div>
                  <Label>API Keys</Label>
                  <div className="mt-2 space-y-3">
                    {[
                      { name: 'M-PESA Integration', scope: 'payments:read,payments:write', lastUsed: '2 hours ago' },
                      { name: 'Parent Mobile App', scope: 'students:read,attendance:read', lastUsed: '1 hour ago' }
                    ].map((key, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{key.name}</p>
                          <p className="text-sm text-gray-600">Scope: {key.scope}</p>
                          <p className="text-xs text-gray-500">Last used: {key.lastUsed}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Key className="h-4 w-4 mr-1" />
                            Rotate
                          </Button>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-orange-600" />
                <span>Notification Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Notification Channels</h4>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-2">
                          <MessageSquare className="h-5 w-5 text-green-600" />
                          <div>
                            <p className="font-medium text-gray-900">SMS</p>
                            <p className="text-sm text-gray-600">Via SMS gateway</p>
                          </div>
                        </div>
                        <Badge variant="default">Active</Badge>
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Mail className="h-5 w-5 text-blue-600" />
                          <div>
                            <p className="font-medium text-gray-900">Email</p>
                            <p className="text-sm text-gray-600">SMTP server</p>
                          </div>
                        </div>
                        <Badge variant="default">Active</Badge>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Smartphone className="h-5 w-5 text-purple-600" />
                          <div>
                            <p className="font-medium text-gray-900">Push Notifications</p>
                            <p className="text-sm text-gray-600">Mobile app</p>
                          </div>
                        </div>
                        <Badge variant="secondary">Inactive</Badge>
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-2">
                          <MessageSquare className="h-5 w-5 text-green-600" />
                          <div>
                            <p className="font-medium text-gray-900">WhatsApp</p>
                            <p className="text-sm text-gray-600">Business API</p>
                          </div>
                        </div>
                        <Badge variant="secondary">Inactive</Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Notification Templates</h4>
                  <div className="space-y-3">
                    {[
                      { name: 'Student Absent', channel: 'SMS', status: 'Active' },
                      { name: 'Fee Payment Received', channel: 'SMS + Email', status: 'Active' },
                      { name: 'Report Card Ready', channel: 'Email', status: 'Active' },
                      { name: 'Transport Alert', channel: 'SMS', status: 'Active' },
                    ].map((template, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{template.name}</p>
                          <p className="text-sm text-gray-600">{template.channel}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={template.status === 'Active' ? 'default' : 'secondary'}>
                            {template.status}
                          </Badge>
                          <Button variant="outline" size="sm">Edit</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Delivery Settings</h4>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <Label>Quiet Hours</Label>
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        <Input type="time" defaultValue="22:00" />
                        <Input type="time" defaultValue="06:00" />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">No notifications sent during these hours</p>
                    </div>
                    <div>
                      <Label>Retry Policy</Label>
                      <select className="mt-2 w-full border border-gray-300 rounded-md px-3 py-2">
                        <option>3 retries with backoff</option>
                        <option>5 retries with backoff</option>
                        <option>No retries</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="h-5 w-5 text-blue-600" />
                <span>External Integrations</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'M-PESA API', description: 'Mobile payment processing', status: 'Connected', icon: Smartphone },
                  { name: 'NEMIS/KEMIS', description: 'Student data synchronization', status: 'Connected', icon: Database },
                  { name: 'KNEC Portal', description: 'Assessment data export', status: 'Connected', icon: CheckCircle },
                  { name: 'SMS Gateway', description: 'Text message delivery', status: 'Connected', icon: MessageSquare },
                  { name: 'Email Service', description: 'Email notifications', status: 'Connected', icon: Mail },
                  { name: 'Kenya Education Cloud', description: 'Learning resources', status: 'Not Connected', icon: Globe }
                ].map((integration, index) => {
                  const Icon = integration.icon;
                  return (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${integration.status === 'Connected' ? 'bg-green-50' : 'bg-gray-50'}`}>
                          <Icon className={`h-5 w-5 ${integration.status === 'Connected' ? 'text-green-600' : 'text-gray-600'}`} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{integration.name}</p>
                          <p className="text-sm text-gray-600">{integration.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant={integration.status === 'Connected' ? 'default' : 'secondary'}>
                          {integration.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          {integration.status === 'Connected' ? 'Configure' : 'Connect'}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Webhook Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Webhook Endpoints</Label>
                  <div className="mt-2 space-y-3">
                    {[
                      { url: 'https://api.school.ac.ke/webhooks/mpesa', events: ['payment.completed', 'payment.failed'] },
                      { url: 'https://api.school.ac.ke/webhooks/attendance', events: ['attendance.marked'] }
                    ].map((webhook, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium text-gray-900 font-mono text-sm">{webhook.url}</p>
                          <div className="flex space-x-2">
                            <Badge variant="outline">Active</Badge>
                            <Button variant="outline" size="sm">Test</Button>
                          </div>
                        </div>
                        <div className="flex space-x-1">
                          {webhook.events.map((event) => (
                            <Badge key={event} variant="secondary" className="text-xs">
                              {event}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Webhook
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
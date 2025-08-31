import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth, useUI, useSettings } from '@/store';
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
  Upload,
  Save
} from 'lucide-react';

export function Settings() {
  const { user, tenant } = useAuth();
  const { theme, setTheme } = useUI();
  const { schoolSettings, systemSettings, updateSchoolSettings, updateSystemSettings } = useSettings();
  const [activeTab, setActiveTab] = useState('school');
  const [hasChanges, setHasChanges] = useState(false);

  const [schoolForm, setSchoolForm] = useState(schoolSettings);
  const [systemForm, setSystemForm] = useState(systemSettings);

  const systemHealth = {
    database: { status: 'healthy', uptime: '99.9%', lastBackup: '2 hours ago' },
    storage: { status: 'healthy', usage: '68%', available: '2.4TB' },
    api: { status: 'healthy', responseTime: '45ms', requests: '1.2K/hour' },
    notifications: { status: 'healthy', delivered: '98.5%', queue: '0' }
  };

  const handleSaveSchoolSettings = () => {
    updateSchoolSettings(schoolForm);
    setHasChanges(false);
    alert('School settings saved successfully!');
  };

  const handleSaveSystemSettings = () => {
    updateSystemSettings(systemForm);
    setHasChanges(false);
    alert('System settings saved successfully!');
  };

  const handleSchoolFormChange = (field: string, value: any) => {
    setSchoolForm(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSystemFormChange = (field: string, value: any) => {
    setSystemForm(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handlePasswordPolicyChange = (field: string, value: any) => {
    setSystemForm(prev => ({
      ...prev,
      password_policy: { ...prev.password_policy, [field]: value }
    }));
    setHasChanges(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">System configuration and administration</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="secondary" className="bg-green-50 text-green-700">
            System Healthy
          </Badge>
          {hasChanges && (
            <Badge variant="destructive">
              Unsaved Changes
            </Badge>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 lg:grid-cols-6 w-full">
          <TabsTrigger value="school" className="text-xs lg:text-sm">School</TabsTrigger>
          <TabsTrigger value="users" className="text-xs lg:text-sm">Users</TabsTrigger>
          <TabsTrigger value="system" className="text-xs lg:text-sm">System</TabsTrigger>
          <TabsTrigger value="security" className="text-xs lg:text-sm">Security</TabsTrigger>
          <TabsTrigger value="notifications" className="text-xs lg:text-sm">Notifications</TabsTrigger>
          <TabsTrigger value="integrations" className="text-xs lg:text-sm">Integrations</TabsTrigger>
        </TabsList>

        <TabsContent value="school" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <School className="h-5 w-5 text-blue-600" />
                  <span>School Information</span>
                </span>
                {hasChanges && (
                  <Button onClick={handleSaveSchoolSettings}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="schoolName">School Name</Label>
                    <Input 
                      id="schoolName" 
                      value={schoolForm.name}
                      onChange={(e) => handleSchoolFormChange('name', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="schoolCode">School Code</Label>
                    <Input 
                      id="schoolCode" 
                      value={schoolForm.code}
                      onChange={(e) => handleSchoolFormChange('code', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="county">County</Label>
                    <select 
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      value={schoolForm.county}
                      onChange={(e) => handleSchoolFormChange('county', e.target.value)}
                    >
                      <option value="Nairobi">Nairobi</option>
                      <option value="Kiambu">Kiambu</option>
                      <option value="Machakos">Machakos</option>
                      <option value="Kajiado">Kajiado</option>
                      <option value="Murang'a">Murang'a</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="subcounty">Sub-County</Label>
                    <Input 
                      id="subcounty" 
                      value={schoolForm.subcounty}
                      onChange={(e) => handleSchoolFormChange('subcounty', e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="motto">School Motto</Label>
                    <Input 
                      id="motto" 
                      value={schoolForm.motto}
                      onChange={(e) => handleSchoolFormChange('motto', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="academic_year">Academic Year</Label>
                    <select 
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      value={schoolForm.academic_year}
                      onChange={(e) => handleSchoolFormChange('academic_year', e.target.value)}
                    >
                      <option value="2024">2024</option>
                      <option value="2023">2023</option>
                      <option value="2025">2025</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="current_term">Current Term</Label>
                    <select 
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      value={schoolForm.current_term}
                      onChange={(e) => handleSchoolFormChange('current_term', parseInt(e.target.value))}
                    >
                      <option value="1">Term 1</option>
                      <option value="2">Term 2</option>
                      <option value="3">Term 3</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="timezone">Timezone</Label>
                    <select 
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      value={schoolForm.timezone}
                      onChange={(e) => handleSchoolFormChange('timezone', e.target.value)}
                    >
                      <option value="Africa/Nairobi">Africa/Nairobi (EAT)</option>
                      <option value="UTC">UTC</option>
                    </select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <Monitor className="h-5 w-5 text-purple-600" />
                  <span>System Settings</span>
                </span>
                {hasChanges && (
                  <Button onClick={handleSaveSystemSettings}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <Label>Application Theme</Label>
                  <div className="mt-2 flex space-x-4">
                    <label className="flex items-center space-x-2">
                      <input 
                        type="radio" 
                        name="theme" 
                        value="light"
                        checked={theme === 'light'}
                        onChange={() => {
                          setTheme('light');
                          handleSystemFormChange('theme', 'light');
                        }}
                      />
                      <span className="text-sm">Light</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input 
                        type="radio" 
                        name="theme" 
                        value="dark"
                        checked={theme === 'dark'}
                        onChange={() => {
                          setTheme('dark');
                          handleSystemFormChange('theme', 'dark');
                        }}
                      />
                      <span className="text-sm">Dark</span>
                    </label>
                  </div>
                </div>

                <div>
                  <Label>Session Timeout (minutes)</Label>
                  <select 
                    className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"
                    value={systemForm.session_timeout}
                    onChange={(e) => handleSystemFormChange('session_timeout', parseInt(e.target.value))}
                  >
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="240">4 hours</option>
                    <option value="480">8 hours</option>
                  </select>
                </div>

                <div>
                  <Label>Backup Frequency</Label>
                  <select 
                    className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"
                    value={systemForm.backup_frequency}
                    onChange={(e) => handleSystemFormChange('backup_frequency', e.target.value)}
                  >
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>

                <div>
                  <Label>Password Policy</Label>
                  <div className="mt-2 space-y-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Minimum Length</Label>
                        <Input
                          type="number"
                          min="6"
                          max="20"
                          value={systemForm.password_policy.min_length}
                          onChange={(e) => handlePasswordPolicyChange('min_length', parseInt(e.target.value))}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          checked={systemForm.password_policy.require_uppercase}
                          onChange={(e) => handlePasswordPolicyChange('require_uppercase', e.target.checked)}
                        />
                        <span className="text-sm">Require uppercase letters</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          checked={systemForm.password_policy.require_lowercase}
                          onChange={(e) => handlePasswordPolicyChange('require_lowercase', e.target.checked)}
                        />
                        <span className="text-sm">Require lowercase letters</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          checked={systemForm.password_policy.require_numbers}
                          onChange={(e) => handlePasswordPolicyChange('require_numbers', e.target.checked)}
                        />
                        <span className="text-sm">Require numbers</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          checked={systemForm.password_policy.require_special}
                          onChange={(e) => handlePasswordPolicyChange('require_special', e.target.checked)}
                        />
                        <span className="text-sm">Require special characters</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

              <div className="mt-6 flex flex-wrap gap-2">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Run Backup Now
                </Button>
                <Button variant="outline">
                  <Database className="h-4 w-4 mr-2" />
                  System Diagnostics
                </Button>
                <Button variant="outline">
                  <Monitor className="h-4 w-4 mr-2" />
                  Performance Report
                </Button>
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
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <Label>Two-Factor Authentication</Label>
                    <div className="mt-2 space-y-2">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked />
                        <span className="text-sm">Require 2FA for admin users</span>
                      </label>
                      <label className="flex items-center space-x-2">
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
                  <Label>Data Encryption Status</Label>
                  <div className="mt-2 grid grid-cols-1 lg:grid-cols-3 gap-4 text-center">
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
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                  <h4 className="font-semibold text-gray-900 mb-3">Delivery Settings</h4>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
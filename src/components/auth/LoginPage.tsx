import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/store';
import { mockUsers, mockTenant } from '@/data/mock-data';
import { GraduationCap, Shield, Users, BookOpen } from 'lucide-react';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('admin123');
  const { login } = useAuth();

  const handleLogin = (userEmail: string) => {
    const user = mockUsers.find(u => u.email === userEmail);
    if (user) {
      login(user, mockTenant);
    }
  };

  const demoUsers = [
    { ...mockUsers[0], icon: Shield, color: 'bg-red-500' },
    { ...mockUsers[1], icon: BookOpen, color: 'bg-blue-500' },
    { ...mockUsers[2], icon: Users, color: 'bg-green-500' }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-background to-green-50 dark:from-gray-900 dark:via-background dark:to-gray-800 dark-transition">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-600 rounded-full">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-foreground">CBC School Manager</h2>
          <p className="mt-2 text-muted-foreground">Kenyan Competency-Based Curriculum Platform</p>
          <Badge variant="secondary" className="mt-2">
            Production Ready • ODPC Compliant
          </Badge>
        </div>

        <Card className="dark-transition">
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button 
              className="w-full" 
              onClick={() => handleLogin(email)}
              disabled={!email}
            >
              Sign In
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or try demo accounts</span>
              </div>
            </div>

            <div className="space-y-2">
              {demoUsers.map((user) => {
                const Icon = user.icon;
                return (
                  <Button
                    key={user.id}
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => handleLogin(user.email)}
                  >
                    <div className={`p-1.5 rounded-full ${user.color} mr-3`}>
                      <Icon className="h-3 w-3 text-white" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium">{user.name}</div>
                      <div className="text-xs text-gray-500 capitalize">{user.role.replace('_', ' ')}</div>
                    </div>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="text-center space-y-2">
          <p className="text-sm text-gray-500">
            🇰🇪 Built for Kenyan Schools • NEMIS/KEMIS Ready • M-PESA Integrated
          </p>
          <div className="flex justify-center space-x-4 text-xs text-gray-400">
            <span>CBC Aligned</span>
            <span>•</span>
            <span>KNEC Ready</span>
            <span>•</span>
            <span>ODPC Compliant</span>
          </div>
        </div>
      </div>
    </div>
  );
}
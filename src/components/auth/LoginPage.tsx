import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { SignUpForm } from './SignUpForm';
import { GraduationCap, Shield, Users, BookOpen, Mail, Lock, Eye, EyeOff } from 'lucide-react';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn, error } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await signIn(email, password);
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const demoUsers = [
    {
      email: 'admin@karagita-primary.ac.ke',
      name: 'Jane Wanjiku (Admin)',
      role: 'School Administrator',
      icon: Shield,
      color: 'bg-red-500'
    },
    {
      email: 'john.mwangi@karagita-primary.ac.ke',
      name: 'John Mwangi (Teacher)',
      role: 'Class Teacher',
      icon: BookOpen,
      color: 'bg-blue-500'
    },
    {
      email: 'mary.kamau@gmail.com',
      name: 'Mary Kamau (Parent)',
      role: 'Parent/Guardian',
      icon: Users,
      color: 'bg-green-500'
    }
  ];

  if (showSignUp) {
    return (
      <SignUpForm
        onSuccess={() => setShowSignUp(false)}
        onBackToLogin={() => setShowSignUp(false)}
      />
    );
  }

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
          <p className="mt-2 text-muted-foreground">Kenyan Education Platform</p>
          <div className="flex justify-center space-x-2 mt-2">
            <Badge variant="secondary">Production Ready</Badge>
            <Badge variant="secondary">ODPC Compliant</Badge>
          </div>
        </div>

        <Card className="dark-transition">
          <CardHeader>
            <CardTitle>Sign In to Your School</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <Button 
                type="submit"
                className="w-full" 
                disabled={!email || !password || loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-background text-muted-foreground">Or try demo accounts</span>
                </div>
              </div>

              <div className="space-y-2">
                {demoUsers.map((user) => {
                  const Icon = user.icon;
                  return (
                    <Button
                      key={user.email}
                      type="button"
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => {
                        setEmail(user.email);
                        setPassword('demo123');
                      }}
                    >
                      <div className={`p-1.5 rounded-full ${user.color} mr-3`}>
                        <Icon className="h-3 w-3 text-white" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium">{user.name}</div>
                        <div className="text-xs text-muted-foreground">{user.role}</div>
                      </div>
                    </Button>
                  );
                })}
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setShowSignUp(true)}
                  className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Don't have an account? Start free trial
                </button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            🇰🇪 Built for Kenyan Schools • NEMIS/KEMIS Ready • M-PESA Integrated
          </p>
          <div className="flex justify-center space-x-4 text-xs text-muted-foreground">
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
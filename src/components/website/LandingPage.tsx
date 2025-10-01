import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  GraduationCap, 
  Shield, 
  Smartphone, 
  Users, 
  BookOpen, 
  BarChart3,
  CheckCircle,
  Star,
  ArrowRight,
  Play,
  Download,
  Globe,
  Award,
  Target,
  Zap,
  Heart,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  TrendingUp,
  FileText,
  Database,
  Lock,
  Wifi,
  ChevronDown,
  Menu,
  X,
  ExternalLink
} from 'lucide-react';

interface LandingPageProps {
  onEnterDemo: () => void;
}

export function LandingPage({ onEnterDemo }: LandingPageProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);
  const [showDemoRequest, setShowDemoRequest] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: GraduationCap,
      title: 'CBC Aligned Assessment',
      description: 'Complete competency-based curriculum support with SBA tasks, evidence capture, and proficiency tracking.',
      color: 'text-blue-600',
      bg: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      icon: Smartphone,
      title: 'M-PESA Integration',
      description: 'Seamless mobile payment processing with STK Push, real-time reconciliation, and automated notifications.',
      color: 'text-green-600',
      bg: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      icon: Shield,
      title: 'ODPC Compliant',
      description: 'Full data protection compliance with DPO console, consent management, and privacy controls.',
      color: 'text-purple-600',
      bg: 'bg-purple-50 dark:bg-purple-900/20'
    },
    {
      icon: Users,
      title: 'Student Management',
      description: 'Complete learner profiles with UPI tracking, guardian management, and CBC report generation.',
      color: 'text-orange-600',
      bg: 'bg-orange-50 dark:bg-orange-900/20'
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Data-driven insights with executive dashboards, performance tracking, and predictive analytics.',
      color: 'text-indigo-600',
      bg: 'bg-indigo-50 dark:bg-indigo-900/20'
    },
    {
      icon: FileText,
      title: 'Universal Reports',
      description: '50+ report types with PDF, Excel, CSV exports. NEMIS/KNEC ready formats included.',
      color: 'text-red-600',
      bg: 'bg-red-50 dark:bg-red-900/20'
    }
  ];

  const testimonials = [
    {
      name: 'Jane Wanjiku Mwangi',
      role: 'Head Teacher, Karagita Primary School',
      content: 'This system has transformed how we manage our school. The CBC alignment is perfect, and parents love the M-PESA integration for fee payments.',
      rating: 5,
      school: 'Nairobi County'
    },
    {
      name: 'John Mwangi Kariuki',
      role: 'Class Teacher, Dagoretti Primary',
      content: 'The assessment tools make CBC implementation so much easier. Evidence capture and proficiency tracking save me hours every week.',
      rating: 5,
      school: 'Kiambu County'
    },
    {
      name: 'Mary Njeri Kamau',
      role: 'School Bursar, Uthiru Academy',
      content: 'Fee collection has improved by 40% since implementing this system. The automated M-PESA reconciliation is a game-changer.',
      rating: 5,
      school: 'Nairobi County'
    }
  ];

  const stats = [
    { number: '500+', label: 'Schools Using System', icon: GraduationCap },
    { number: '50,000+', label: 'Students Managed', icon: Users },
    { number: '99.9%', label: 'System Uptime', icon: TrendingUp },
    { number: '24/7', label: 'Support Available', icon: Heart }
  ];

  const pricingPlans = [
    {
      name: 'Starter',
      price: 'KES 15,000',
      period: '/month',
      description: 'Perfect for small primary schools',
      features: [
        'Up to 200 students',
        'Basic CBC assessment',
        'M-PESA integration',
        'Standard reports',
        'Email support'
      ],
      popular: false
    },
    {
      name: 'Professional',
      price: 'KES 35,000',
      period: '/month',
      description: 'Ideal for medium-sized schools',
      features: [
        'Up to 800 students',
        'Advanced CBC tools',
        'Full M-PESA integration',
        'All report types',
        'Transport management',
        'Priority support'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'pricing',
      description: 'For large schools and institutions',
      features: [
        'Unlimited students',
        'Multi-campus support',
        'Custom integrations',
        'Dedicated support',
        'Training included',
        'SLA guarantee'
      ],
      popular: false
    }
  ];

  const ContactForm = () => {
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      school: '',
      phone: '',
      message: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      // Simulate form submission
      alert('Thank you for your interest! We will contact you within 24 hours.');
      setShowContactForm(false);
      setFormData({ name: '', email: '', school: '', phone: '', message: '' });
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>
          <div>
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="school">School Name *</Label>
            <Input
              id="school"
              value={formData.school}
              onChange={(e) => setFormData(prev => ({ ...prev, school: e.target.value }))}
              required
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="+254 700 123 456"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            value={formData.message}
            onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
            placeholder="Tell us about your school's needs..."
            rows={4}
          />
        </div>
        <Button type="submit" className="w-full">
          Send Message
        </Button>
      </form>
    );
  };

  const DemoRequestForm = () => {
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      school: '',
      role: '',
      students: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      // Simulate demo request
      alert('Demo access granted! Redirecting to the system...');
      setShowDemoRequest(false);
      setTimeout(() => onEnterDemo(), 1000);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="demo-name">Full Name *</Label>
            <Input
              id="demo-name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>
          <div>
            <Label htmlFor="demo-email">Email Address *</Label>
            <Input
              id="demo-email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="demo-school">School Name *</Label>
            <Input
              id="demo-school"
              value={formData.school}
              onChange={(e) => setFormData(prev => ({ ...prev, school: e.target.value }))}
              required
            />
          </div>
          <div>
            <Label htmlFor="demo-role">Your Role *</Label>
            <select 
              id="demo-role"
              className="w-full border border-input rounded-md px-3 py-2 bg-background text-foreground"
              value={formData.role}
              onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
              required
            >
              <option value="">Select your role</option>
              <option value="head_teacher">Head Teacher</option>
              <option value="deputy_head">Deputy Head Teacher</option>
              <option value="teacher">Teacher</option>
              <option value="bursar">School Bursar</option>
              <option value="admin">Administrator</option>
              <option value="board_member">Board Member</option>
            </select>
          </div>
        </div>
        <div>
          <Label htmlFor="demo-students">Number of Students</Label>
          <select 
            id="demo-students"
            className="w-full border border-input rounded-md px-3 py-2 bg-background text-foreground"
            value={formData.students}
            onChange={(e) => setFormData(prev => ({ ...prev, students: e.target.value }))}
          >
            <option value="">Select range</option>
            <option value="1-100">1-100 students</option>
            <option value="101-300">101-300 students</option>
            <option value="301-600">301-600 students</option>
            <option value="600+">600+ students</option>
          </select>
        </div>
        <Button type="submit" className="w-full">
          Access Demo System
        </Button>
      </form>
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrollY > 50 ? 'bg-background/95 backdrop-blur-md border-b border-border shadow-sm' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-primary rounded-lg">
                <GraduationCap className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">CBC School Manager</h1>
                <p className="text-xs text-muted-foreground">Kenyan Education Platform</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
              <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
              <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">Reviews</a>
              <a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</a>
              <Button variant="outline" onClick={() => setShowDemoRequest(true)}>
                Request Demo
              </Button>
              <Button onClick={onEnterDemo}>
                Try Demo
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden bg-background border-t border-border">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <a href="#features" className="block px-3 py-2 text-muted-foreground hover:text-foreground">Features</a>
                <a href="#pricing" className="block px-3 py-2 text-muted-foreground hover:text-foreground">Pricing</a>
                <a href="#testimonials" className="block px-3 py-2 text-muted-foreground hover:text-foreground">Reviews</a>
                <a href="#contact" className="block px-3 py-2 text-muted-foreground hover:text-foreground">Contact</a>
                <div className="pt-2 space-y-2">
                  <Button variant="outline" className="w-full" onClick={() => setShowDemoRequest(true)}>
                    Request Demo
                  </Button>
                  <Button className="w-full" onClick={onEnterDemo}>
                    Try Demo
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                🇰🇪 Built for Kenyan Schools • CBC Compliant • NEMIS Ready
              </Badge>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              The Complete
              <span className="text-primary block">School Management</span>
              Platform for Kenya
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Streamline your school operations with our comprehensive CBC-aligned platform. 
              From student management to M-PESA payments, we've got everything covered.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" onClick={onEnterDemo} className="text-lg px-8 py-4">
                <Play className="h-5 w-5 mr-2" />
                Try Live Demo
              </Button>
              <Button size="lg" variant="outline" onClick={() => setShowDemoRequest(true)} className="text-lg px-8 py-4">
                Request Demo
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              No credit card required • Full access • Setup in minutes
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-2">{stat.number}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Everything Your School Needs
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Comprehensive tools designed specifically for Kenyan schools operating under the CBC curriculum
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:scale-105 border-border/50">
                  <CardContent className="p-6">
                    <div className={`p-3 ${feature.bg} rounded-lg w-fit mb-4`}>
                      <Icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CBC Compliance Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="secondary" className="bg-primary/10 text-primary mb-4">
                🇰🇪 Kenya-Specific Features
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
                Built for the Kenyan Education System
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground">CBC Curriculum Alignment</h4>
                    <p className="text-muted-foreground">Complete competency-based assessment with SBA tasks and evidence capture</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground">NEMIS/KEMIS Integration</h4>
                    <p className="text-muted-foreground">Student data management with UPI tracking and government export formats</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground">M-PESA Payment Integration</h4>
                    <p className="text-muted-foreground">Complete mobile payment system with STK Push and reconciliation</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground">ODPC Compliance</h4>
                    <p className="text-muted-foreground">Data Protection Officer console with privacy controls and audit trails</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-background rounded-2xl shadow-2xl p-8 border border-border">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-foreground">CBC Assessment Dashboard</h3>
                    <Badge variant="default">Live Demo</Badge>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Mathematics - Grade 3A</span>
                      <Badge variant="secondary">89% Proficient</Badge>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '89%' }}></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">English - Grade 3A</span>
                      <Badge variant="secondary">92% Proficient</Badge>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '92%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Trusted by Schools Across Kenya
            </h2>
            <p className="text-xl text-muted-foreground">
              See what educators are saying about our platform
            </p>
          </div>

          <div className="relative">
            <Card className="max-w-4xl mx-auto">
              <CardContent className="p-8">
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                    ))}
                  </div>
                  <blockquote className="text-xl text-foreground mb-6 leading-relaxed">
                    "{testimonials[activeTestimonial].content}"
                  </blockquote>
                  <div>
                    <div className="font-semibold text-foreground">{testimonials[activeTestimonial].name}</div>
                    <div className="text-muted-foreground">{testimonials[activeTestimonial].role}</div>
                    <div className="text-sm text-muted-foreground">{testimonials[activeTestimonial].school}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === activeTestimonial ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-muted/30 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-muted-foreground">
              Choose the plan that fits your school's needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`relative hover:shadow-lg transition-all duration-300 ${
                plan.popular ? 'border-primary shadow-lg scale-105' : 'border-border'
              }`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge variant="default" className="bg-primary text-primary-foreground">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
                    <div className="text-3xl font-bold text-primary mb-1">
                      {plan.price}
                      <span className="text-lg text-muted-foreground">{plan.period}</span>
                    </div>
                    <p className="text-muted-foreground">{plan.description}</p>
                  </div>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full" variant={plan.popular ? 'default' : 'outline'}>
                    {plan.name === 'Enterprise' ? 'Contact Sales' : 'Start Free Trial'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Seamless Integrations
            </h2>
            <p className="text-xl text-muted-foreground">
              Connect with the tools and services you already use
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {[
              { name: 'M-PESA', logo: Smartphone, status: 'Integrated' },
              { name: 'NEMIS', logo: Database, status: 'Ready' },
              { name: 'KNEC', logo: Award, status: 'Ready' },
              { name: 'ODPC', logo: Shield, status: 'Compliant' },
              { name: 'SMS Gateway', logo: Phone, status: 'Active' },
              { name: 'Email Service', logo: Mail, status: 'Active' }
            ].map((integration, index) => {
              const Logo = integration.logo;
              return (
                <div key={index} className="text-center group">
                  <div className="p-4 bg-background rounded-lg border border-border group-hover:shadow-md transition-all duration-300">
                    <Logo className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors mx-auto mb-2" />
                    <div className="font-medium text-foreground text-sm">{integration.name}</div>
                    <Badge variant="secondary" className="text-xs mt-1">{integration.status}</Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Transform Your School?
          </h2>
          <p className="text-xl opacity-90 mb-8">
            Join hundreds of Kenyan schools already using our platform to improve education outcomes
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" variant="secondary" onClick={onEnterDemo} className="text-lg px-8 py-4">
              <Play className="h-5 w-5 mr-2" />
              Try Demo Now
            </Button>
            <Button size="lg" variant="outline" onClick={() => setShowContactForm(true)} className="text-lg px-8 py-4 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              <Phone className="h-5 w-5 mr-2" />
              Schedule Call
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-border py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="p-2 bg-primary rounded-lg">
                  <GraduationCap className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">CBC School Manager</h3>
                  <p className="text-sm text-muted-foreground">Kenyan Education Platform</p>
                </div>
              </div>
              <p className="text-muted-foreground mb-4 max-w-md">
                Empowering Kenyan schools with comprehensive CBC-aligned management tools. 
                Built by educators, for educators.
              </p>
              <div className="flex space-x-4">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download Brochure
                </Button>
                <Button variant="outline" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  Case Studies
                </Button>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Product</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Integrations</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Support</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Training</a></li>
                <li><a href="#contact" className="hover:text-foreground transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Status Page</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between">
            <p className="text-muted-foreground text-sm">
              © 2024 CBC School Manager. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 mt-4 sm:mt-0">
              <span className="text-sm text-muted-foreground">🇰🇪 Proudly Kenyan</span>
              <Badge variant="secondary">ODPC Compliant</Badge>
            </div>
          </div>
        </div>
      </footer>

      {/* Contact Form Dialog */}
      <Dialog open={showContactForm} onOpenChange={setShowContactForm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Contact Our Team</DialogTitle>
          </DialogHeader>
          <ContactForm />
        </DialogContent>
      </Dialog>

      {/* Demo Request Dialog */}
      <Dialog open={showDemoRequest} onOpenChange={setShowDemoRequest}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Request Demo Access</DialogTitle>
          </DialogHeader>
          <DemoRequestForm />
        </DialogContent>
      </Dialog>
    </div>
  );
}
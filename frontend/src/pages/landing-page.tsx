import { Shield, Lock, Key, FileCheck, KeyRound, UserCheck, Moon, Sun } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/theme-context';

const securityFeatures = [
  {
    icon: UserCheck,
    title: 'NIST-compliant Authentication',
    description: 'Multi-factor authentication following NIST SP 800-63B guidelines for secure identity verification.',
  },
  {
    icon: Shield,
    title: 'Role-Based Access Control',
    description: 'Granular permissions for Students, Faculty, and Administrators with principle of least privilege.',
  },
  {
    icon: Lock,
    title: 'Encrypted Data Storage',
    description: 'All sensitive data encrypted at rest using AES-256 encryption with secure key management.',
  },
  {
    icon: FileCheck,
    title: 'Digital Signatures for Integrity',
    description: 'Cryptographic signatures ensure exam results cannot be tampered with after creation.',
  },
  {
    icon: KeyRound,
    title: 'Secure Key Exchange',
    description: 'RSA-based key exchange protocol ensures secure communication between all parties.',
  },
  {
    icon: Key,
    title: 'Secure Session Management',
    description: 'Time-limited sessions with secure token rotation and automatic expiration.',
  },
];

const LandingPage = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-xl font-semibold text-foreground">SecureExamVault</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md hover:bg-accent transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5 text-muted-foreground" />
              ) : (
                <Sun className="h-5 w-5 text-muted-foreground" />
              )}
            </button>
            <Link to="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link to="/register">
              <Button variant="security">Register</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <Lock className="h-4 w-4" />
            <span className="text-sm font-medium">Enterprise-Grade Security</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 max-w-4xl mx-auto leading-tight">
            SecureExamVault
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-4 max-w-2xl mx-auto">
            End-to-End Secure Online Examination System
          </p>
          <p className="text-base text-muted-foreground mb-10 max-w-xl mx-auto">
            Designed with industry-grade authentication, encryption, and access control for academic institutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login">
              <Button variant="security" size="xl">
                <Lock className="h-5 w-5" />
                Login to Portal
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="security-outline" size="xl">
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Security Features */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Security Architecture</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Built with comprehensive security controls to protect examination integrity and student data.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {securityFeatures.map((feature, index) => (
              <div key={index} className="security-card">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-card border rounded-xl p-8 md:p-12">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-primary mb-2">AES-256</div>
                <p className="text-muted-foreground">Data Encryption</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">RBAC</div>
                <p className="text-muted-foreground">Access Control</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">MFA</div>
                <p className="text-muted-foreground">Multi-Factor Auth</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2026 SecureExamVault. Built for academic institutions with security-first principles.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

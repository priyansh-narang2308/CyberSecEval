
import { Link } from 'react-router-dom';
import {
  Shield,
  Moon,
  Sun,
  ArrowLeft,
  Lock,
  Key,
  Hash,
  FileCheck,
  Code,
  AlertTriangle,
  Grid3X3,
  RefreshCw
} from 'lucide-react';
import { useTheme } from '../../contexts/theme-context';


const SecurityInfoPage = () => {
  const { theme, toggleTheme } = useTheme();

  const securityTopics = [
    {
      title: 'Access Control Matrix',
      description: 'View role-based permissions for all system resources.',
      icon: Grid3X3,
      href: '/dashboard/admin/access-matrix',
    },
    {
      title: 'Key Exchange Protocol',
      description: 'Learn how secure key exchange works in the system.',
      icon: RefreshCw,
      href: '/security/keys',
    },
    {
      title: 'Password Hashing',
      description: 'Understand how passwords are securely stored.',
      icon: Hash,
      href: '/security/hashing',
    },
    {
      title: 'Digital Signatures',
      description: 'See how exam results are signed for integrity.',
      icon: FileCheck,
      href: '/security/signatures',
    },
    {
      title: 'Encoding vs Encryption',
      description: 'Learn the difference with interactive examples.',
      icon: Code,
      href: '/security/encoding',
    },
    {
      title: 'Security Risks & Attacks',
      description: 'Common threats and how we mitigate them.',
      icon: AlertTriangle,
      href: '/security/risks',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-primary" />
              <span className="text-xl font-semibold text-foreground">SecureExamVault</span>
            </Link>
          </div>
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
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <div className="mb-10">
            <h1 className="text-3xl font-bold text-foreground mb-4">Security Information</h1>
            <p className="text-muted-foreground">
              Comprehensive documentation of all security features implemented in SecureExamVault.
            </p>
          </div>

          {/* Security Overview */}
          <div className="grid md:grid-cols-3 gap-4 mb-10">
            <div className="bg-card border rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Lock className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">AES-256</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                All sensitive data encrypted with Advanced Encryption Standard.
              </p>
            </div>
            <div className="bg-card border rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-success/10">
                  <Key className="h-5 w-5 text-success" />
                </div>
                <h3 className="font-semibold text-foreground">RSA-2048</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Asymmetric encryption for secure key exchange.
              </p>
            </div>
            <div className="bg-card border rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">NIST Compliant</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Following SP 800-63B authentication guidelines.
              </p>
            </div>
          </div>

          {/* Topic Cards */}
          <h2 className="text-xl font-semibold text-foreground mb-4">Security Documentation</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {securityTopics.map((topic, index) => (
              <Link
                key={index}
                to={topic.href}
                className="bg-card border rounded-xl p-5 hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-muted">
                    <topic.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{topic.title}</h3>
                    <p className="text-sm text-muted-foreground">{topic.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SecurityInfoPage;


import { Link } from 'react-router-dom';
import { Shield, Lock, AlertTriangle, Key, Eye, RefreshCw, Moon, Sun, ArrowLeft } from 'lucide-react';
import { useTheme } from '../../contexts/theme-context';


const SecurityRisksPage = () => {
  const { theme, toggleTheme } = useTheme();

  const attacks = [
    {
      title: 'Brute Force Attack',
      description: 'An attacker systematically tries all possible password combinations until the correct one is found.',
      mitigation: [
        'Account lockout after 5 failed attempts',
        'Strong password requirements (min 12 characters)',
        'Multi-factor authentication required',
        'Rate limiting on login attempts',
      ],
      icon: Lock,
      severity: 'high',
    },
    {
      title: 'SQL Injection',
      description: 'Malicious SQL code is inserted into input fields to manipulate database queries.',
      mitigation: [
        'Parameterized queries for all database operations',
        'Input validation and sanitization',
        'Principle of least privilege for database accounts',
        'Web Application Firewall (WAF) monitoring',
      ],
      icon: AlertTriangle,
      severity: 'critical',
    },
    {
      title: 'Man-in-the-Middle (MITM)',
      description: 'An attacker intercepts communication between two parties to eavesdrop or modify data.',
      mitigation: [
        'TLS 1.3 encryption for all communications',
        'Certificate pinning for mobile apps',
        'HSTS (HTTP Strict Transport Security)',
        'Encrypted key exchange using RSA',
      ],
      icon: Eye,
      severity: 'high',
    },
    {
      title: 'Replay Attack',
      description: 'An attacker captures valid authentication tokens and reuses them to gain unauthorized access.',
      mitigation: [
        'Time-limited session tokens (15 min expiry)',
        'Nonce values in authentication requests',
        'Token rotation after each use',
        'Challenge-response authentication',
      ],
      icon: RefreshCw,
      severity: 'medium',
    },
    {
      title: 'Session Hijacking',
      description: 'An attacker steals or predicts session IDs to impersonate legitimate users.',
      mitigation: [
        'Secure, HttpOnly cookies',
        'Session binding to IP address',
        'Random, unpredictable session IDs',
        'Automatic session timeout',
      ],
      icon: Key,
      severity: 'high',
    },
    {
      title: 'Cross-Site Scripting (XSS)',
      description: 'Malicious scripts are injected into web pages viewed by other users.',
      mitigation: [
        'Content Security Policy (CSP) headers',
        'Input sanitization and output encoding',
        'React\'s built-in XSS protection',
        'Regular security audits',
      ],
      icon: AlertTriangle,
      severity: 'high',
    },
  ];

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <span className="px-2 py-0.5 rounded text-xs bg-destructive/10 text-destructive">Critical</span>;
      case 'high':
        return <span className="px-2 py-0.5 rounded text-xs bg-warning/10 text-warning">High</span>;
      case 'medium':
        return <span className="px-2 py-0.5 rounded text-xs bg-primary/10 text-primary">Medium</span>;
      default:
        return null;
    }
  };

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
            <h1 className="text-3xl font-bold text-foreground mb-4">Security Risks & Mitigations</h1>
            <p className="text-muted-foreground">
              Understanding common security threats and how SecureExamVault protects against them.
            </p>
          </div>

          {/* Attack Cards */}
          <div className="space-y-6">
            {attacks.map((attack, index) => (
              <div key={index} className="bg-card border rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-muted flex-shrink-0">
                    <attack.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-lg font-semibold text-foreground">{attack.title}</h2>
                      {getSeverityBadge(attack.severity)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{attack.description}</p>
                    <div>
                      <h3 className="text-sm font-medium text-foreground mb-2">Mitigations in SecureExamVault:</h3>
                      <ul className="space-y-1">
                        {attack.mitigation.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <Shield className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="mt-10 p-6 rounded-xl bg-primary/5 border border-primary/20">
            <div className="flex items-start gap-4">
              <Shield className="h-8 w-8 text-primary flex-shrink-0" />
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-2">Defense in Depth</h2>
                <p className="text-sm text-muted-foreground">
                  SecureExamVault employs a defense-in-depth strategy with multiple layers of security controls.
                  No single security measure is relied upon; instead, overlapping defenses ensure that even if
                  one layer is compromised, others remain to protect the system. This approach includes
                  authentication, authorization, encryption, monitoring, and incident response capabilities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SecurityRisksPage;

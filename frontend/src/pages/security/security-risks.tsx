import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, Lock, AlertTriangle, Key, Eye, RefreshCw, Moon, Sun, ArrowLeft } from 'lucide-react';
import { useTheme } from '../../contexts/theme-context';

const SecurityRisksPage = () => {
  const { theme, toggleTheme } = useTheme();

  const attacks = [
    {
      title: 'Brute Force Attack',
      description: 'Systematic attempts to guess password combinations.',
      mitigation: [
        'Account lockout (5 attempts)',
        'Min 12 characters',
        'MFA Required',
        'Rate limiting',
      ],
      icon: Lock,
      severity: 'high',
    },
    {
      title: 'SQL Injection',
      description: 'Malicious code inserted into database queries.',
      mitigation: [
        'Parameterized queries',
        'Input sanitization',
        'Least privilege access',
        'WAF monitoring',
      ],
      icon: AlertTriangle,
      severity: 'critical',
    },
    {
      title: 'MITM Attack',
      description: 'Intercepting communication to eavesdrop or modify data.',
      mitigation: [
        'TLS 1.3 Encryption',
        'Certificate pinning',
        'HSTS Security',
        'RSA Key exchange',
      ],
      icon: Eye,
      severity: 'high',
    },
    {
      title: 'Replay Attack',
      description: 'Capturing and reusing valid authentication tokens.',
      mitigation: [
        '15-min token expiry',
        'Nonce values',
        'Token rotation',
        'Challenge-response',
      ],
      icon: RefreshCw,
      severity: 'medium',
    },
    {
      title: 'Session Hijacking',
      description: 'Stealing session IDs to impersonate users.',
      mitigation: [
        'HttpOnly cookies',
        'IP address binding',
        'Unpredictable IDs',
        'Auto timeout',
      ],
      icon: Key,
      severity: 'high',
    },
    {
      title: 'Cross-Site Scripting',
      description: 'Injecting malicious scripts into web pages.',
      mitigation: [
        'CSP headers',
        'Output encoding',
        'React built-in protection',
        'Security audits',
      ],
      icon: AlertTriangle,
      severity: 'high',
    },
  ];

  const getSeverityBadge = (severity: string) => {
    const styles = {
      critical: "bg-red-500/10 text-red-500 border-red-500/20",
      high: "bg-orange-500/10 text-orange-500 border-orange-500/20",
      medium: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    }[severity] || "";
    return <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${styles}`}>{severity}</span>;
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <Shield className="h-6 w-6 text-primary group-hover:rotate-12 transition-transform" />
            <span className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              SecureExamVault
            </span>
          </Link>
          <button onClick={toggleTheme} className="p-2.5 rounded-xl bg-muted hover:bg-accent transition-all">
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline mb-4">
              <ArrowLeft className="h-4 w-4" /> Back to Home
            </Link>
            <h1 className="text-4xl font-extrabold tracking-tight">Security Infrastructure</h1>
            <p className="text-muted-foreground mt-2 text-lg">Proactive threat mitigation and defense protocols.</p>
          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {attacks.map((attack, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              key={index}
              className="group bg-card border hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 rounded-2xl p-6 flex flex-col"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <attack.icon className="h-6 w-6" />
                </div>
                {getSeverityBadge(attack.severity)}
              </div>

              <h2 className="text-xl font-bold mb-2">{attack.title}</h2>
              <p className="text-sm text-muted-foreground mb-6 line-clamp-2">{attack.description}</p>

              <div className="mt-auto space-y-3">
                <div className="h-px bg-border w-full" />
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Active Mitigations</h3>
                <ul className="grid grid-cols-1 gap-2">
                  {attack.mitigation.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs font-medium text-foreground/80">
                      <Shield className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-12 p-8 rounded-3xl bg-gradient-to-br from-primary/10 via-transparent to-blue-500/10 border border-primary/20 relative overflow-hidden"
        >
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
            <div className="p-4 rounded-2xl bg-background shadow-xl border border-primary/20">
              <Shield className="h-12 w-12 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Defense-in-Depth Architecture</h2>
              <p className="text-muted-foreground leading-relaxed max-w-3xl">
                Our ecosystem doesn't rely on a single firewall. We've engineered overlapping security layers including
                Identity Management, End-to-End Encryption, and Continuous AI Monitoring to ensure that if one
                control point is targeted, your academic data remains mathematically unreachable.
              </p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default SecurityRisksPage;
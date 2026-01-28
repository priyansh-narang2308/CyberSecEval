import { Shield, Lock, Key, FileCheck, KeyRound, UserCheck, ArrowRight, Sun, Moon, Menu } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/theme-context';
import { useAuth } from '../contexts/auth-context';
import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "../components/ui/sheet";

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
  const { user, logout } = useAuth();
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 relative overflow-hidden">

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      <header className="relative border-b bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-5 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 group cursor-pointer"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-xl blur-md group-hover:blur-lg transition-all duration-300" />
              <Shield className="h-9 w-9 text-primary relative z-10 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              SecureExamVault
            </span>
          </motion.div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="relative p-2.5 rounded-xl bg-gradient-to-br from-card to-card/50 hover:from-accent hover:to-accent/50 transition-all duration-300 group border border-border/50 shadow-sm overflow-hidden"
              aria-label="Toggle theme"
            >

              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative z-10 flex items-center justify-center">
                {theme === 'dark' ? (
                  <Moon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-all duration-300 rotate-0 scale-100" />
                ) : (
                  <Sun className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-all duration-300 rotate-0 scale-100" />
                )}
              </div>
            </button>

            {user ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="hidden md:flex items-center gap-4"
              >
                <div className="flex items-center gap-3 mr-2">
                  <div className="hidden sm:flex flex-col items-end">
                    <span className="text-sm font-medium text-foreground">{user.name}</span>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">{user.role}</span>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <span className="text-lg font-bold text-primary">{user.name.charAt(0).toUpperCase()}</span>
                  </div>
                </div>

                <Link to={`/dashboard/${user.role}`}>
                  <Button variant="security" className="relative overflow-hidden group">
                    <span className="relative z-10">Dashboard</span>
                    <ArrowRight className="ml-2 h-4 w-4 relative z-10 transition-transform group-hover:translate-x-1" />
                    <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-primary translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  </Button>
                </Link>

                <Button
                  variant="ghost"
                  onClick={logout}
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                >
                  <span className="sr-only">Logout</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></svg>
                </Button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="hidden md:flex items-center gap-3"
              >
                <Link to="/login">
                  <Button variant="ghost" className="relative overflow-hidden group">
                    <span className="relative z-10">Login</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="security" className="relative overflow-hidden group">
                    <span className="relative z-10">Get Started</span>
                    <ArrowRight className="ml-2 h-4 w-4 relative z-10 transition-transform group-hover:translate-x-1" />
                    <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-primary translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  </Button>
                </Link>
              </motion.div>
            )}

            {/* Mobile Navigation (Hamburger) */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <div className="flex flex-col gap-6 mt-8">
                  {user ? (
                    <>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-12 w-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                          <span className="text-xl font-bold text-primary">{user.name.charAt(0).toUpperCase()}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-lg font-semibold text-foreground">{user.name}</span>
                          <span className="text-sm text-muted-foreground uppercase tracking-wider">{user.role}</span>
                        </div>
                      </div>

                      <Link to={`/dashboard/${user.role}`} className="w-full">
                        <Button variant="security" className="w-full justify-start h-12">
                          <div className="h-6 w-6 rounded-full bg-background/20 flex items-center justify-center mr-3">
                            <UserCheck className="h-4 w-4" />
                          </div>
                          Dashboard
                        </Button>
                      </Link>

                      <Button
                        variant="outline"
                        onClick={logout}
                        className="w-full justify-start h-12 text-destructive border-destructive/20 hover:bg-destructive/5"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></svg>
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="flex flex-col gap-2 mb-4">
                        <h3 className="text-lg font-semibold">Welcome</h3>
                        <p className="text-sm text-muted-foreground">Log in to access your secure exam capabilities.</p>
                      </div>
                      <Link to="/login" className="w-full">
                        <Button variant="outline" className="w-full justify-start h-12">
                          Login
                        </Button>
                      </Link>
                      <Link to="/register" className="w-full">
                        <Button variant="security" className="w-full justify-start h-12">
                          Get Started
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <section className="relative py-24 lg:py-32">
        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border border-primary/20 mb-8 backdrop-blur-sm"
          >
            <Lock className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Enterprise-Grade Security
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight"
          >
            <span className="bg-gradient-to-b from-foreground via-foreground to-foreground/90 bg-clip-text text-transparent">
              SecureExam {" "}
            </span>
            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Vault
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl md:text-3xl text-muted-foreground mb-6 max-w-3xl mx-auto leading-relaxed font-light"
          >
            End-to-End Secure Online Examination System
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-muted-foreground mb-12 max-w-xl mx-auto leading-relaxed"
          >
            Designed with military-grade authentication, encryption, and access control for academic institutions worldwide.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-5 justify-center items-center"
          >
            {user ? (
              <Link to={`/dashboard/${user.role}`} className="group">
                <Button size="xl" className="relative overflow-hidden px-8 h-14 text-lg group">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-blue-600" />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center mr-3 relative z-10">
                    <UserCheck className="h-4 w-4 text-white" />
                  </div>
                  <span className="relative z-10 font-semibold">Go to Dashboard</span>
                  <ArrowRight className="ml-2 h-5 w-5 relative z-10 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            ) : (
              <Link to="/login" className="group">
                <Button size="xl" className="relative overflow-hidden px-8 h-14 text-lg group">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-blue-600" />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <Lock className="h-5 w-5 mr-3 relative z-10" />
                  <span className="relative z-10 font-semibold">Access Portal</span>
                  <ArrowRight className="ml-2 h-5 w-5 relative z-10 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            )}
          </motion.div>
        </div>
      </section>

      <section className="relative py-24">
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-foreground via-foreground to-foreground/80 bg-clip-text text-transparent">
                Security
              </span>
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                Architecture
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Comprehensive security controls protecting examination integrity and sensitive student data
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {securityFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
                className="group relative"
              >
                <div className="relative p-8 rounded-2xl bg-gradient-to-br from-card/80 to-card/40 border border-border/50 shadow-xl backdrop-blur-sm transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] hover:border-primary/30 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent transition-all duration-500 ${hoveredFeature === index ? 'opacity-100' : 'opacity-0'}`} />

                  <div className="relative z-10">
                    <div className="flex items-start gap-6">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-xl blur-md group-hover:blur-lg transition-all duration-500" />
                        <div className="relative p-4 rounded-xl bg-gradient-to-br from-card to-card/50 border border-border/50 group-hover:border-primary/30 transition-all duration-500">
                          <feature.icon className="h-7 w-7 text-primary group-hover:scale-110 transition-transform duration-500" />
                        </div>
                      </div>

                      <div className="flex-1 pt-2">
                        <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                          {feature.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-24">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5" />
            <div className="relative bg-gradient-to-br from-card/90 to-card/50 border border-border/50 backdrop-blur-xl p-12 md:p-16 rounded-3xl shadow-2xl">
              <div className="grid md:grid-cols-3 gap-12 text-center">
                {[
                  { value: 'AES-256', label: 'Military-Grade Encryption', desc: 'Data at rest & in transit' },
                  { value: 'RBAC', label: 'Granular Access Control', desc: 'Role-based permissions' },
                  { value: 'Zero Trust', label: 'Security Model', desc: 'Always verify, never trust' }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 }}
                    className="group"
                  >
                    <div className="text-6xl font-bold mb-4">
                      <span className="bg-gradient-to-r from-primary via-blue-500 to-blue-600 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300 inline-block">
                        {item.value}
                      </span>
                    </div>
                    <h4 className="text-xl font-semibold text-foreground mb-2">{item.label}</h4>
                    <p className="text-muted-foreground">{item.desc}</p>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-16 pt-12 border-t border-border/50 text-center"
              >
                <p className="text-2xl md:text-3xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light">
                  "Trusted by leading academic institutions worldwide for secure, reliable examination management"
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative py-24">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-blue-500/20" />
            <div className="relative bg-gradient-to-br from-card/90 to-card/50 border border-border/50 backdrop-blur-xl p-12 md:p-16 rounded-3xl text-center shadow-2xl">
              <Shield className="h-20 w-20 text-primary mx-auto mb-8" />
              <h3 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                  Ready to Secure Your {" "} {" "}
                </span>
                <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  Examinations?
                </span>
              </h3>
              <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
                Join thousands of institutions protecting their academic integrity with our platform
              </p>
              <div className="flex flex-col sm:flex-row gap-5 justify-center">
                <Link to="/register">
                  <Button size="xl" className="px-12 h-16 text-lg relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-blue-600" />
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <span className="relative z-10 font-bold text-lg">Start Free Trial</span>
                    <ArrowRight className="ml-3 h-5 w-5 relative z-10 transition-transform group-hover:translate-x-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="relative border-t border-border/50 py-12 backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                SecureExamVault
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
              <Link to="/security" className="hover:text-foreground transition-colors">Security</Link>
              <Link to="/compliance" className="hover:text-foreground transition-colors">Compliance</Link>
              <Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 SecureExamVault. Built for academic institutions with security-first principles.
            All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
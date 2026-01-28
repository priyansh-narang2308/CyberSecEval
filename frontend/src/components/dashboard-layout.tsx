import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Shield,
  Moon,
  Sun,
  LogOut,
  Home,
  User,
  Key,
  Lock,
  FileCheck,
  Grid3X3
} from 'lucide-react';
import { useAuth, type UserRole } from '../contexts/auth-context';
import { useTheme } from '../contexts/theme-context';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog";


interface DashboardLayoutProps {
  children: React.ReactNode;
  role: UserRole;
  userName?: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, role, userName = 'User' }) => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const studentLinks = [
    { icon: Home, label: 'Dashboard', href: '/dashboard/student' },
  ];

  const facultyLinks = [
    { icon: Home, label: 'Dashboard', href: '/dashboard/faculty' },
    { icon: FileCheck, label: 'Sign Results', href: '/dashboard/faculty/sign-results' },
  ];

  const adminLinks = [
    { icon: Home, label: 'Dashboard', href: '/dashboard/admin' },
    { icon: Grid3X3, label: 'Access Control Matrix', href: '/dashboard/admin/access-matrix' },
    { icon: Key, label: 'Key Management', href: '/dashboard/admin/keys' },
  ];

  const securityLinks = [
    { icon: Lock, label: 'Encryption Details', href: '/security/encryption' },
    { icon: Key, label: 'Key Exchange Info', href: '/security/keys' },
    { icon: Shield, label: 'Hashing & Signatures', href: '/security/hashing' },
    { icon: Grid3X3, label: 'Encoding Techniques', href: '/security/encoding' },
    { icon: FileCheck, label: 'Risk Analysis', href: '/security/risks' },
  ];

  const roleLinks = role === 'student' ? studentLinks : role === 'faculty' ? facultyLinks : adminLinks;


  const roleLabel = role.charAt(0).toUpperCase() + role.slice(1);

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
        <div className="p-6 border-b border-sidebar-border">
          <Link to="/" className="flex items-center gap-2">
            <Shield className="h-7 w-7 text-sidebar-primary" />
            <span className="font-semibold text-sidebar-foreground">SecureExamVault</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <div className="mb-4 space-y-1">
            {roleLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                    }`}
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="pt-4 mt-4 border-t border-sidebar-border">
            <h3 className="px-3 text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider mb-2">
              Security Concepts
            </h3>
            <div className="space-y-1">
              {securityLinks.map((link) => {
                const isActive = location.pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${isActive
                      ? 'bg-sidebar-accent/50 text-sidebar-accent-foreground font-medium'
                      : 'text-sidebar-foreground/60 hover:bg-sidebar-accent/30 hover:text-sidebar-foreground'
                      }`}
                  >
                    <link.icon className="h-3.5 w-3.5" />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center">
              <User className="h-4 w-4 text-sidebar-accent-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">{userName}</p>
              <p className="text-xs text-sidebar-foreground/60">{roleLabel}</p>
            </div>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button
                className="w-full flex items-center gap-3 px-3 py-2 mt-2 rounded-lg text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors text-left"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Sign out of your account?</AlertDialogTitle>
                <AlertDialogDescription>
                  You will be redirected to the home page. You'll need to sign in again to access the dashboard.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleLogout} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Sign Out
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-card border-b flex items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <span className="security-badge">
              <Lock className="h-3 w-3" />
              {roleLabel} Access
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="encrypted-badge">
              <Lock className="h-3 w-3" />
              Session Encrypted
            </span>
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

        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

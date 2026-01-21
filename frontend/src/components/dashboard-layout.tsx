import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Shield,
  Moon,
  Sun,
  LogOut,
  Home,
  FileText,
  ClipboardList,
  BarChart3,
  User,
  Settings,
  Users,
  Key,
  Lock,
  FileCheck,
  Grid3X3
} from 'lucide-react';
import type { UserRole } from '../contexts/auth-context';
import { useTheme } from '../contexts/theme-context';


interface DashboardLayoutProps {
  children: React.ReactNode;
  role: UserRole;
  userName?: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, role, userName = 'User' }) => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const studentLinks = [
    { icon: Home, label: 'Dashboard', href: '/dashboard/student' },
    { icon: FileText, label: 'View Exams', href: '/dashboard/student/exams' },
    { icon: ClipboardList, label: 'Take Exam', href: '/dashboard/student/take-exam' },
    { icon: BarChart3, label: 'View Results', href: '/dashboard/student/results' },
    { icon: User, label: 'Profile & Security', href: '/dashboard/student/profile' },
  ];

  const facultyLinks = [
    { icon: Home, label: 'Dashboard', href: '/dashboard/faculty' },
    { icon: FileText, label: 'Create Exam', href: '/dashboard/faculty/create-exam' },
    { icon: ClipboardList, label: 'Evaluate Submissions', href: '/dashboard/faculty/evaluate' },
    { icon: FileCheck, label: 'Sign Results', href: '/dashboard/faculty/sign-results' },
    { icon: Lock, label: 'Encrypted Submissions', href: '/dashboard/faculty/encrypted' },
    { icon: User, label: 'Profile', href: '/dashboard/faculty/profile' },
  ];

  const adminLinks = [
    { icon: Home, label: 'Dashboard', href: '/dashboard/admin' },
    { icon: Users, label: 'User Management', href: '/dashboard/admin/users' },
    { icon: Grid3X3, label: 'Access Control Matrix', href: '/dashboard/admin/access-matrix' },
    { icon: Key, label: 'Key Management', href: '/dashboard/admin/keys' },
    { icon: FileText, label: 'System Logs', href: '/dashboard/admin/logs' },
    { icon: Settings, label: 'Settings', href: '/dashboard/admin/settings' },
  ];

  const links = role === 'student' ? studentLinks : role === 'faculty' ? facultyLinks : adminLinks;

  const roleLabel = role.charAt(0).toUpperCase() + role.slice(1);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
        <div className="p-6 border-b border-sidebar-border">
          <Link to="/" className="flex items-center gap-2">
            <Shield className="h-7 w-7 text-sidebar-primary" />
            <span className="font-semibold text-sidebar-foreground">SecureExamVault</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {links.map((link) => {
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
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2 mt-2 rounded-lg text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
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

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

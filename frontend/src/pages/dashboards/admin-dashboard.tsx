/* eslint-disable @typescript-eslint/no-explicit-any */

import DashboardLayout from '../../components/dashboard-layout'
import { Users, Key, FileText, Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/auth-context';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const { user, apiCall } = useAuth();
  const [accessStatus, setAccessStatus] = useState<{
    canManageUsers: boolean;
    canWriteExams: boolean;
  }>({ canManageUsers: false, canWriteExams: false });

  const [stats, setStats] = useState<any[]>([]);
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);

  const fetchDashboardData = async () => {
    // 1. Fetch Stats
    const statsRes = await apiCall('/admin/stats');
    if (statsRes.ok) {
      setStats(statsRes.data.stats);
      setTotalUsers(statsRes.data.totalUsers);
    }

    // 2. Fetch Logs
    const logsRes = await apiCall('/admin/logs');
    if (logsRes.ok) {
      setRecentLogs(logsRes.data);
    }
  };

  useEffect(() => {
    const checkAccess = async () => {
      // 1. Check User Management Access (Should allow)
      const usersRes = await apiCall('/admin/users');

      // 2. Check Exam Write Access (Should allow)
      const examsRes = await apiCall('/exams', { method: 'POST' });

      setAccessStatus({
        canManageUsers: usersRes.ok,
        canWriteExams: examsRes.ok
      });

      if (!usersRes.ok || !examsRes.ok) {
        toast.error('Access Denied: Insufficient permissions');
      } else {
        fetchDashboardData();
        toast.success('Access Verified: Admin privileges active');
      }
    };

    if (user) {
      checkAccess();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const statCards = [
    { icon: Users, label: 'Total Users', value: totalUsers, color: 'text-primary' },
    { icon: Key, label: 'Active Sessions', value: '1', color: 'text-success' },
    { icon: FileText, label: 'Security Logs', value: recentLogs.length, color: 'text-primary' },
    { icon: AlertTriangle, label: 'Security Alerts', value: recentLogs.filter(l => l.status === 'alert').length, color: 'text-destructive' },
  ];

  return (
    <DashboardLayout role="admin" userName={user?.name || 'Admin'}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">Administrator Dashboard</h1>
              <p className="text-muted-foreground">System overview, user management, and security monitoring.</p>
            </div>

            {/* ACM Verification Badge */}
            <div className={`px-4 py-2 rounded-lg border text-sm font-medium ${accessStatus.canManageUsers ? 'bg-success/10 border-success/20 text-success' : 'bg-destructive/10 border-destructive/20 text-destructive'}`}>
              <div className="flex items-center gap-2">
                {accessStatus.canManageUsers ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                <span>Management Access: {accessStatus.canManageUsers ? 'GRANTED' : 'DENIED'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-muted">
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* User Distribution */}
          <div className="bg-card border rounded-xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">User Distribution</h2>
            <div className="space-y-4">
              {stats.map((item, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-muted-foreground">{item.role}</span>
                    <span className="text-sm font-medium text-foreground">{item.count}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color}`}
                      style={{ width: `${totalUsers > 0 ? (item.count / totalUsers) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <Link
              to="/dashboard/admin/users"
              className="block mt-6 text-sm text-primary hover:underline text-center"
            >
              Manage Users →
            </Link>
          </div>

          {/* Recent Activity Logs */}
          <div className="lg:col-span-2 bg-card border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Recent Activity (Live)</h2>
              <Link to="/dashboard/admin/logs" className="text-sm text-primary hover:underline">
                View all logs
              </Link>
            </div>
            <div className="space-y-3">
              {recentLogs.length === 0 ? (
                <p className="text-sm text-muted-foreground italic text-center py-8">No security logs recorded yet.</p>
              ) : (
                recentLogs.map((log) => (
                  <div key={log._id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border">
                    <div className="flex items-center gap-3">
                      {log.status === 'success' ? (
                        <CheckCircle className="h-4 w-4 text-success" />
                      ) : log.status === 'alert' ? (
                        <AlertTriangle className="h-4 w-4 text-warning" />
                      ) : (
                        <XCircle className="h-4 w-4 text-destructive" />
                      )}
                      <div>
                        <p className="text-sm font-medium text-foreground">{log.action}</p>
                        <p className="text-xs text-muted-foreground">{log.user}</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-muted-foreground italic">
                      {new Date(log.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/dashboard/admin/access-matrix"
            className="p-4 rounded-lg bg-card border hover:bg-accent transition-colors"
          >
            <Shield className="h-6 w-6 text-primary mb-2" />
            <h3 className="font-medium text-foreground">Access Control Matrix</h3>
            <p className="text-xs text-muted-foreground mt-1">View and modify permissions</p>
          </Link>
          <Link
            to="/dashboard/admin/keys"
            className="p-4 rounded-lg bg-card border hover:bg-accent transition-colors"
          >
            <Key className="h-6 w-6 text-primary mb-2" />
            <h3 className="font-medium text-foreground">Key Management</h3>
            <p className="text-xs text-muted-foreground mt-1">Manage encryption keys</p>
          </Link>
          <Link
            to="/dashboard/admin/users"
            className="p-4 rounded-lg bg-card border hover:bg-accent transition-colors"
          >
            <Users className="h-6 w-6 text-primary mb-2" />
            <h3 className="font-medium text-foreground">User Management</h3>
            <p className="text-xs text-muted-foreground mt-1">Add, edit, remove users</p>
          </Link>
          <Link
            to="/security/info"
            className="p-4 rounded-lg bg-card border hover:bg-accent transition-colors"
          >
            <FileText className="h-6 w-6 text-primary mb-2" />
            <h3 className="font-medium text-foreground">Security Documentation</h3>
            <p className="text-xs text-muted-foreground mt-1">View security protocols</p>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;

/* eslint-disable @typescript-eslint/no-explicit-any */
import DashboardLayout from '../../components/dashboard-layout';
import {
  Users,
  Key,
  FileText,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Activity,
  Terminal,
  Cpu,
  RefreshCw,
  Zap,
  Lock,
  Search
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/auth-context';
import { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const { user, apiCall } = useAuth();
  const [accessStatus, setAccessStatus] = useState({
    canManageUsers: false,
    canWriteExams: false
  });

  const [stats, setStats] = useState<any[]>([]);
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isRotating, setIsRotating] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const statsRes = await apiCall('/admin/stats');
      const logsRes = await apiCall('/admin/logs');

      if (statsRes.ok) {
        setStats(statsRes.data.stats);
        setTotalUsers(statsRes.data.totalUsers);
      }
      if (logsRes.ok) {
        setRecentLogs(logsRes.data);
      }
    } catch (err) {
      toast.error('Failed to sync command center data');
    } finally {
      setIsLoading(false);
    }
  }, [apiCall]);

  useEffect(() => {
    const checkAccess = async () => {
      const usersRes = await apiCall('/admin/users');
      const examsRes = await apiCall('/exams', { method: 'POST' });

      setAccessStatus({
        canManageUsers: usersRes.ok,
        canWriteExams: examsRes.ok
      });

      if (usersRes.ok) fetchData();
    };

    if (user) checkAccess();
  }, [user, apiCall, fetchData]);

  const handleRotateKeys = async () => {
    setIsRotating(true);
    try {
      const res = await apiCall('/admin/rotate-keys', { method: 'POST' });
      if (res.ok) {
        toast.success('RSA-2048 Key Pair Force-Rotated');
        fetchData();
      }
    } catch (err) {
      toast.error('Emergency key rotation failed');
    } finally {
      setIsRotating(false);
    }
  };

  const statCards = [
    { icon: Users, label: 'Governed Identities', value: totalUsers, color: 'text-primary' },
    { icon: Key, label: 'RSA Key Status', value: 'ACTIVE', color: 'text-success' },
    { icon: Activity, label: 'System Uptime', value: '99.9%', color: 'text-primary' },
    { icon: AlertTriangle, label: 'Security Threats', value: recentLogs.filter(l => l.status === 'alert').length, color: 'text-destructive' },
  ];

  return (
    <DashboardLayout role="admin" userName={user?.name || 'Admin'}>
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-10">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
            <div className="space-y-2">
              <h1 className="text-4xl font-black tracking-tighter text-foreground uppercase flex items-center gap-4">
                <Terminal className="h-10 w-10 text-primary" />
                Command Center
              </h1>
              <div className="flex items-center gap-3 text-muted-foreground font-mono text-xs">
                <span className="flex items-center gap-1.5 bg-muted px-2 py-0.5 rounded border border-primary/20">
                  <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                  SYSTEM STATUS: OPERATIONAL
                </span>
                <span className="uppercase tracking-widest opacity-60">NIST SP 800-63-2 COMPLIANT HUB</span>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleRotateKeys}
                disabled={isRotating}
                className="flex items-center gap-3 bg-destructive/10 text-destructive border border-destructive/20 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-destructive hover:text-white transition-all active:scale-95 disabled:grayscale"
              >
                {isRotating ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
                Emergency Key Rotation
              </button>
              <div className="bg-card border-2 border-primary/10 rounded-3xl p-4 shadow-xl flex items-center gap-6">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Management</p>
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${accessStatus.canManageUsers ? 'bg-success' : 'bg-destructive'}`} />
                    <span className="text-xs font-black uppercase">{accessStatus.canManageUsers ? 'Privileged' : 'Restricted'}</span>
                  </div>
                </div>
                <div className="h-8 w-px bg-muted" />
                <div className="p-2 bg-primary/10 rounded-xl">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statCards.map((stat, index) => (
            <div key={index} className="group bg-card border rounded-3xl p-6 hover:border-primary/40 transition-all hover:shadow-xl hover:shadow-primary/5">
              <div className="flex flex-col gap-4">
                <div className="p-3 rounded-2xl bg-muted w-fit group-hover:bg-primary/10 transition-colors">
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-3xl font-black text-foreground tabular-nums tracking-tighter">{stat.value}</p>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest opacity-60">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Identity Distribution & ACL Explorer */}
          <div className="space-y-6">
            <h2 className="text-lg font-black text-foreground flex items-center gap-3 uppercase">
              <div className="h-6 w-1 bg-primary rounded-full" />
              Identity Analytics
            </h2>
            <div className="bg-card border rounded-[40px] p-8 shadow-sm">
              <div className="space-y-6">
                {stats.map((item, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">{item.role}</span>
                      <span className="text-xs font-black text-foreground">{item.count}</span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden p-0.5">
                      <div
                        className={`h-full rounded-full ${item.color} shadow-lg shadow-current/20`}
                        style={{ width: `${totalUsers > 0 ? (item.count / totalUsers) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 pt-8 border-t space-y-4">
                <Link
                  to="/dashboard/admin/users"
                  className="flex items-center justify-between p-4 rounded-2xl bg-primary/5 border border-primary/10 hover:bg-primary/10 transition-all text-sm font-black uppercase tracking-widest"
                >
                  <span className="flex items-center gap-3">
                    <Users className="h-5 w-5" /> Manage Subjects
                  </span>
                  <Search className="h-4 w-4" />
                </Link>
                <Link
                  to="/dashboard/admin/access-matrix"
                  className="flex items-center justify-between p-4 rounded-2xl bg-success/5 border border-success/10 hover:bg-success/10 transition-all text-sm font-black uppercase tracking-widest"
                >
                  <span className="flex items-center gap-3">
                    <Shield className="h-5 w-5" /> Policy Engine
                  </span>
                  <Activity className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Global Security Audit Explorer */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-foreground flex items-center gap-3 uppercase">
                <div className="h-6 w-1 bg-warning rounded-full" />
                Global Security Audit
              </h2>
              <button onClick={fetchData} className="p-2 hover:bg-muted rounded-xl transition-colors">
                <Cpu className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            <div className="bg-card border rounded-[40px] p-8 min-h-[500px] shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Lock className="h-48 w-48" />
              </div>

              <div className="space-y-4 relative z-10">
                {recentLogs.length > 0 ? recentLogs.map((log) => (
                  <div key={log._id} className="group p-5 rounded-3xl bg-muted/30 border border-transparent hover:border-primary/20 hover:bg-card transition-all flex items-center justify-between">
                    <div className="flex items-center gap-5">
                      <div className={`h-12 w-12 rounded-2xl flex items-center justify-center border-2 ${log.status === 'success' ? 'bg-success/10 border-success/20 text-success' :
                          log.status === 'alert' ? 'bg-warning/10 border-warning/20 text-warning' :
                            'bg-destructive/10 border-destructive/20 text-destructive'
                        }`}>
                        {log.status === 'success' ? <CheckCircle className="h-5 w-5" /> :
                          log.status === 'alert' ? <AlertTriangle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                      </div>
                      <div>
                        <p className="text-sm font-black text-foreground tracking-tight uppercase flex items-center gap-2">
                          {log.action}
                          {log.details.includes('RSA') && <span className="bg-primary/20 text-primary px-1.5 py-0.5 rounded text-[8px]">CRYPTO</span>}
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[10px] font-bold text-muted-foreground opacity-60 font-mono">{log.user}</span>
                          <div className="h-1 w-1 rounded-full bg-muted" />
                          <span className="text-[10px] font-bold text-muted-foreground opacity-60 uppercase">{new Date(log.createdAt).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-40 group-hover:opacity-100 transition-opacity">
                        IP: 127.0.0.1
                      </p>
                    </div>
                  </div>
                )) : (
                  <div className="flex flex-col items-center justify-center h-96 text-center space-y-4 opacity-20">
                    <Activity className="h-16 w-16" />
                    <p className="text-xs font-black uppercase tracking-[0.3em]">No security packets captured.</p>
                  </div>
                )}
              </div>

              <Link
                to="/dashboard/admin/logs"
                className="block mt-8 w-full py-4 bg-muted/50 text-center rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-muted transition-all border border-dashed text-muted-foreground"
              >
                View Full System Log History
              </Link>
            </div>
          </div>
        </div>

        {/* NIST System Specs */}
        <div className="mt-12 p-8 rounded-[40px] bg-primary/5 border-2 border-primary/10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-primary/10 rounded-3xl">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-black text-foreground uppercase tracking-tight">System Compliance Engine</h3>
              <p className="text-sm font-medium text-muted-foreground">The Secure Exam Vault enforces NIST SP 800-63-2 standards for E-Authentication and session privacy.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
            <div className="bg-card px-6 py-4 rounded-2xl border text-center">
              <p className="text-[10px] font-black text-muted-foreground uppercase mb-1">Ciphers</p>
              <p className="text-xs font-black text-primary font-mono">AES-256 + RSA-2048</p>
            </div>
            <div className="bg-card px-6 py-4 rounded-2xl border text-center">
              <p className="text-[10px] font-black text-muted-foreground uppercase mb-1">MFA Factor</p>
              <p className="text-xs font-black text-success font-mono">OTP/SHA-256</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;

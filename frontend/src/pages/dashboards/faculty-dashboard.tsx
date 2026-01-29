/* eslint-disable @typescript-eslint/no-explicit-any */
import DashboardLayout from '../../components/dashboard-layout';
import {
  FileText,
  ClipboardList,
  FileCheck,
  Lock,
  Users,
  AlertTriangle,
  CheckCircle,
  Fingerprint,
  RefreshCw,
  Shield,
  Terminal,
  Unlock,
  Cpu,
  History as HistoryIcon
} from 'lucide-react';
import { useAuth } from '../../contexts/auth-context';
import { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';

interface Submission {
  _id: string;
  examId: string;
  student: {
    _id: string;
    name: string;
    universityId: string;
    email: string;
  };
  createdAt: string;
  encryptedData: string;
  iv: string;
  encryptedSessionKey: string;
}

const FacultyDashboard = () => {
  const { user, apiCall } = useAuth();

  const [accessStatus, setAccessStatus] = useState({
    canEvaluate: false,
    canSign: false
  });

  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Decryption State
  const [isDecryptModalOpen, setIsDecryptModalOpen] = useState(false);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [activeSubmission, setActiveSubmission] = useState<Submission | null>(null);
  const [decryptedData, setDecryptedData] = useState<any>(null);

  // Signing State
  const [isSignModalOpen, setIsSignModalOpen] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const [scoreInput, setScoreInput] = useState('');

  const probePermissions = useCallback(async () => {
    const res1 = await apiCall('/submissions/evaluate', { method: 'POST' });
    const res2 = await apiCall('/results/sign', { method: 'POST' });
    setAccessStatus({ canEvaluate: res1.ok, canSign: res2.ok });
  }, [apiCall]);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    const subRes = await apiCall('/hybrid');
    const logRes = await apiCall('/admin/my-logs');

    if (subRes.ok) setSubmissions(subRes.data);
    if (logRes.ok) setLogs(logRes.data);
    setIsLoading(false);
  }, [apiCall]);

  useEffect(() => {
    if (user) {
      probePermissions();
      fetchData();
    }
  }, [user, probePermissions, fetchData]);

  const handleDecrypt = async (submission: Submission) => {
    setActiveSubmission(submission);
    setIsDecrypting(true);

    try {
      // Real backend decryption call
      // The backend uses its Private Key to unwrap and decrypt
      const res = await apiCall(`/hybrid/decrypt/${submission._id}`);

      if (res.ok) {
        setDecryptedData(res.data);
        setIsDecryptModalOpen(true);
        toast.success('Zero-Knowledge Decryption Success');
      } else {
        toast.error('Decryption failed: Key mismatch');
      }
    } catch (err) {
      toast.error('Security protocol failure');
    } finally {
      setIsDecrypting(false);
    }
  };

  const initiateGrading = () => {
    setIsDecryptModalOpen(false);
    setIsSignModalOpen(true);
  };

  const handleSignGrade = async () => {
    if (!scoreInput || isNaN(Number(scoreInput))) {
      toast.error('Valid score required');
      return;
    }

    setIsSigning(true);
    try {
      const res = await apiCall('/signature/sign-result', {
        method: 'POST',
        body: JSON.stringify({
          studentName: activeSubmission?.student.name,
          examTitle: activeSubmission?.examId || 'Cryptography Midterm', // Fallback for demo
          score: Number(scoreInput)
        })
      });

      if (res.ok) {
        toast.success('Grade Hash Signed & Released');
        setIsSignModalOpen(false);
        fetchData(); // Refresh logs and list
      }
    } catch (err) {
      toast.error('Cryptographic signing failed');
    } finally {
      setIsSigning(false);
    }
  };

  const stats = [
    { icon: FileText, label: 'Active Exams', value: '3', color: 'text-primary' },
    { icon: ClipboardList, label: 'Submissions', value: submissions.length.toString(), color: 'text-warning' },
    { icon: FileCheck, label: 'Signed Grades', value: logs.filter(l => l.action === 'Digital Signature').length.toString(), color: 'text-success' },
    { icon: Users, label: 'Students', value: '42', color: 'text-primary' },
  ];

  return (
    <DashboardLayout role="faculty" userName={user?.name || 'Faculty'}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
            <div className="space-y-2">
              <h1 className="text-4xl font-black tracking-tighter text-foreground uppercase">Faculty Terminal</h1>
              <div className="flex items-center gap-3 text-muted-foreground font-mono text-sm">
                <span className="flex items-center gap-1.5 bg-muted px-2 py-0.5 rounded border">
                  <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                  AUTHENTICATED AS: <span className="text-foreground font-bold">{user?.name?.toUpperCase()}</span>
                </span>
                <span className="flex items-center gap-1.5 bg-muted px-2 py-0.5 rounded border">
                  ROLE: <span className="text-primary font-bold">FACULTY</span>
                </span>
              </div>
            </div>

            <div className="bg-card border-2 border-primary/10 rounded-3xl p-6 shadow-2xl shadow-primary/5 min-w-[360px]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-xl">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-foreground">ACM MATRIX</h3>
                </div>
                <div className="px-2 py-1 bg-success/10 text-success text-[10px] font-black rounded border border-success/20">CLEARANCE: L2</div>
              </div>

              <div className="space-y-3">
                {[
                  { label: 'SUBMISSIONS:READ', granted: accessStatus.canEvaluate },
                  { label: 'RESULTS:SIGN', granted: accessStatus.canSign },
                  { label: 'SYSTEM:DECRYPT', granted: true },
                ].map((p, i) => (
                  <div key={i} className="flex items-center justify-between text-[11px] font-bold">
                    <span className="text-muted-foreground font-mono opacity-80">{p.label}</span>
                    <span className={`px-3 py-1 rounded-full ${p.granted ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'} flex items-center gap-1.5`}>
                      {p.granted ? <CheckCircle className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
                      {p.granted ? 'GRANTED' : 'DENIED'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
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
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-6">
              <h2 className="text-xl font-black text-foreground flex items-center gap-3 uppercase">
                <div className="h-8 w-1 bg-primary rounded-full" />
                Encrypted Submissions
              </h2>
              <div className="grid sm:grid-cols-1 gap-4">
                {submissions.length > 0 ? submissions.map((sub) => (
                  <div key={sub._id} className="p-6 rounded-3xl bg-card border hover:border-primary/30 transition-all group overflow-hidden relative">
                    <div className="flex items-center justify-between relative z-10">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-bold text-foreground underline decoration-primary/20 underline-offset-4">{sub.student.name}</h3>
                          <span className="text-[10px] font-black bg-muted px-2 py-0.5 rounded border opacity-60 uppercase">{sub.student.universityId}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-4">
                          <span className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest bg-muted/50 px-3 py-1.5 rounded-xl">
                            <Lock className="h-3.5 w-3.5 text-primary" /> AES-256 ENCRYPTED
                          </span>
                          <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-40">Submitted: {new Date(sub.createdAt).toLocaleString()}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDecrypt(sub)}
                        disabled={isDecrypting}
                        className="bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest px-6 py-4 rounded-2xl hover:shadow-lg hover:shadow-primary/25 transition-all active:scale-95 flex items-center gap-2"
                      >
                        {isDecrypting && activeSubmission?._id === sub._id ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Unlock className="h-4 w-4" />}
                        Secure Decrypt
                      </button>
                    </div>
                  </div>
                )) : (
                  <div className="h-48 rounded-[32px] border-2 border-dashed flex flex-col items-center justify-center text-muted-foreground space-y-2 bg-muted/5">
                    <HistoryIcon className="h-10 w-10 opacity-10" />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">No submissions discovered in the vault.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-foreground flex items-center gap-3 uppercase">
                <div className="h-8 w-1 bg-warning rounded-full" />
                Security Logs
              </h2>
              <button
                onClick={fetchData}
                className="p-2 hover:bg-muted rounded-xl transition-colors"
                disabled={isLoading}
              >
                <Cpu className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
            <div className="bg-card border rounded-[40px] p-8 min-h-[500px] shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Terminal className="h-32 w-32" />
              </div>

              <div className="space-y-8 relative z-10">
                {logs.length > 0 ? logs.map((log) => (
                  <div key={log._id} className="relative pl-8 border-l-2 border-muted last:border-l-0 pb-2">
                    <div className={`absolute left-[-9px] top-0 h-4 w-4 rounded-full border-4 border-card ${log.status === 'alert' ? 'bg-destructive' : log.status === 'success' ? 'bg-success' : 'bg-primary'}`} />
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                        {new Date(log.createdAt).toLocaleTimeString()}
                      </p>
                      <p className="text-xs font-bold text-foreground uppercase tracking-tight">
                        {log.action}
                      </p>
                      <p className="text-[10px] font-medium text-muted-foreground leading-relaxed">
                        {log.details}
                      </p>
                    </div>
                  </div>
                )) : (
                  <div className="flex flex-col items-center justify-center h-80 text-center space-y-4 opacity-30">
                    <HistoryIcon className="h-12 w-12" />
                    <p className="text-[10px] font-black uppercase tracking-widest">Digital Audit Trail Empty.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DECRYPTION DIALOG */}
      <Dialog open={isDecryptModalOpen} onOpenChange={setIsDecryptModalOpen}>
        <DialogContent className="max-w-3xl p-10 rounded-[40px] text-foreground">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-3xl font-black flex items-center gap-4 tracking-tighter uppercase">
              <div className="p-3 bg-primary/10 rounded-2xl">
                <Unlock className="h-8 w-8 text-primary" />
              </div>
              Submission Decrypted
            </DialogTitle>
            <DialogDescription className="text-base font-medium">
              Data successfully recovered from source <span className="font-black text-foreground">AES-256 Ciphertext</span> using Server RSA-Private Key.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 rounded-3xl bg-muted/30 border space-y-1">
                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Student Subject</p>
                <p className="text-lg font-black">{activeSubmission?.student.name}</p>
              </div>
              <div className="p-5 rounded-3xl bg-muted/30 border space-y-1">
                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">RSA Status</p>
                <p className="text-lg font-black text-success">SESSION KEY RECOVERED</p>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.3em] px-2">Plaintext Content</p>
              <div className="h-64 p-8 rounded-[32px] border-2 bg-muted/10 font-medium leading-relaxed overflow-y-auto whitespace-pre-wrap">
                {decryptedData?.decryptedAnswers?.answers || JSON.stringify(decryptedData?.decryptedAnswers, null, 2)}
              </div>
            </div>

            <div className="pt-6 border-t flex items-center justify-between">
              <div className="flex items-center gap-3 text-success font-black text-[10px] uppercase tracking-widest">
                <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                NIST 800-63-2 COMPLIANT
              </div>
              <button
                onClick={initiateGrading}
                className="px-10 py-4 bg-foreground text-background rounded-2xl font-black uppercase tracking-widest hover:opacity-90 transition-all active:scale-95"
              >
                Grade & Sign Result
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* SIGNING DIALOG */}
      <Dialog open={isSignModalOpen} onOpenChange={setIsSignModalOpen}>
        <DialogContent className="max-w-2xl p-10 rounded-[40px] text-foreground">
          <DialogHeader className="mb-8">
            <DialogTitle className="text-3xl font-black flex items-center gap-4 tracking-tighter uppercase">
              <div className="p-3 bg-warning/10 rounded-2xl">
                <Fingerprint className="h-8 w-8 text-warning" />
              </div>
              Sign Digital Result
            </DialogTitle>
            <DialogDescription className="text-base font-medium">
              Creating an immutable <span className="font-black text-foreground">RSA-Signature</span> for {activeSubmission?.student.name}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-8">
            <div className="space-y-4">
              <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.3em] px-2">Evaluation Score (Max 100)</Label>
              <Input
                type="number"
                placeholder="0-100"
                value={scoreInput}
                onChange={(e) => setScoreInput(e.target.value)}
                className="h-16 text-2xl font-black rounded-2xl border-2 focus:border-warning/50 px-6"
              />
            </div>

            <div className="p-6 rounded-[32px] bg-warning/5 border border-warning/20 space-y-3">
              <div className="flex items-center gap-2 text-[10px] font-black text-warning uppercase tracking-widest">
                <Shield className="h-4 w-4" /> INTEGRITY PROTOCOL
              </div>
              <p className="text-xs font-medium leading-relaxed opacity-70">
                Proceeding will calculate a SHA-256 hash of the score and student identity, then sign it with the faculty private key. This ensures the grade cannot be modified without detection.
              </p>
            </div>

            <div className="pt-6 border-t flex gap-4">
              <button
                onClick={() => setIsSignModalOpen(false)}
                className="flex-1 py-4 border-2 rounded-2xl font-black uppercase tracking-widest hover:bg-muted transition-all"
              >
                Abort
              </button>
              <button
                onClick={handleSignGrade}
                disabled={isSigning || !scoreInput}
                className="flex-3 px-12 py-4 bg-warning text-warning-foreground rounded-2xl font-black uppercase tracking-widest hover:shadow-xl hover:shadow-warning/20 transition-all active:scale-95 disabled:grayscale flex items-center justify-center gap-3"
              >
                {isSigning ? <RefreshCw className="h-5 w-5 animate-spin" /> : <Fingerprint className="h-5 w-5" />}
                {isSigning ? 'Signing...' : 'Seal & Release'}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default FacultyDashboard;

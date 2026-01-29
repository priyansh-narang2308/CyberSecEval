/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import DashboardLayout from '../../components/dashboard-layout';
import { FileText, ClipboardList, FileCheck, Lock, Users, PenTool, AlertTriangle, CheckCircle, Fingerprint, RefreshCw, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/auth-context';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';

const FacultyDashboard = () => {
  const { user, apiCall } = useAuth();
  const [accessStatus, setAccessStatus] = useState<{
    canEvaluate: boolean;
    canSign: boolean;
  }>({ canEvaluate: false, canSign: false });

  // Signing Modal State
  const [isSignModalOpen, setIsSignModalOpen] = useState(false);
  const [selectedResult, setSelectedResult] = useState<any>(null);
  const [scoreInput, setScoreInput] = useState('');
  const [isSigning, setIsSigning] = useState(false);

  // Decryption Mock State
  const [isDecryptModalOpen, setIsDecryptModalOpen] = useState(false);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [decryptedViewData, setDecryptedViewData] = useState<any>(null);

  useEffect(() => {
    const checkAccess = async () => {
      // 1. Check Evaluate Access (Should allow)
      const evalRes = await apiCall('/submissions/evaluate', { method: 'POST' });
      console.log('Evaluate check status:', evalRes.status, evalRes.data);

      // 2. Check Sign Access (Should allow)
      const signRes = await apiCall('/results/sign', { method: 'POST' });
      console.log('Sign check status:', signRes.status, signRes.data);

      setAccessStatus({
        canEvaluate: evalRes.ok,
        canSign: signRes.ok
      });

      if (!evalRes.ok || !signRes.ok) {
        toast.error('Access Denied: Insufficient permissions');
      } else {
        toast.success('Access Verified: Faculty permissions active');
      }
    };

    if (user) {
      checkAccess();
    }
  }, [user]);

  const stats = [
    { icon: FileText, label: 'Active Exams', value: '4', color: 'text-primary' },
    { icon: ClipboardList, label: 'Pending Reviews', value: '12', color: 'text-warning' },
    { icon: FileCheck, label: 'Signed Results', value: '28', color: 'text-success' },
    { icon: Users, label: 'Students', value: '156', color: 'text-primary' },
  ];

  const handleDecryptSubmission = async (submission: any) => {
    setIsDecrypting(true);

    // Simulate real RSA + AES computation delay
    setTimeout(() => {
      setDecryptedViewData({
        student: submission.student,
        exam: submission.exam,
        time: submission.submittedAt,
        answers: {
          q1: "RSA provides non-repudiation while AES focuses on high-speed encryption...",
          q2: "The hybrid approach uses RSA to protect the AES session key during transit.",
          q3: "Digital signatures use a private key to sign a hash of the original data."
        }
      });
      setIsDecrypting(false);
      setIsDecryptModalOpen(true);
      toast.success('RSA Decryption Success: Plaintext Restored');
    }, 1500);
  };

  const openSignModal = (result: any) => {
    setSelectedResult(result);
    setScoreInput('');
    setIsSignModalOpen(true);
  };

  const handleSignResult = async () => {
    if (!scoreInput || isNaN(parseInt(scoreInput))) {
      toast.error('Please enter a valid numeric score');
      return;
    }

    setIsSigning(true);
    try {
      const payload = {
        studentName: 'Priyansh Narang', // Simulated student selection
        examTitle: selectedResult.exam,
        score: parseInt(scoreInput)
      };

      const res = await apiCall('/signature/sign-result', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        toast.success(`Result signed securely for ${payload.studentName}!`);
        console.log('Signature Proof (RSA SIGNATURE):', res.data.integrityProof.signature);
        setIsSignModalOpen(false);
      } else {
        toast.error('Signing Failed');
      }
    } catch (error) {
      toast.error('System error during signing');
    } finally {
      setIsSigning(false);
    }
  };

  const pendingSubmissions = [
    { id: '1', exam: 'Cryptography Midterm', student: 'Alice Johnson', submittedAt: '2 hours ago', encrypted: true },
    { id: '2', exam: 'Network Security Quiz', student: 'Bob Smith', submittedAt: '4 hours ago', encrypted: true },
    { id: '3', exam: 'Cryptography Midterm', student: 'Carol White', submittedAt: '5 hours ago', encrypted: true },
  ];

  const unsignedResults = [
    { id: 1, exam: 'Information Security Basics', count: 15, deadline: 'Mar 20, 2024' },
    { id: 2, exam: 'Access Control Systems', count: 8, deadline: 'Mar 22, 2024' },
  ];

  return (
    <DashboardLayout role="faculty" userName={user?.name || 'Faculty'}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">Faculty Dashboard</h1>
              <p className="text-muted-foreground">Manage examinations, evaluate submissions, and sign results securely.</p>
            </div>

            {/* ACM Verification Badge */}
            <div className={`px-4 py-2 rounded-lg border text-sm font-medium ${accessStatus.canEvaluate ? 'bg-success/10 border-success/20 text-success' : 'bg-destructive/10 border-destructive/20 text-destructive'}`}>
              <div className="flex items-center gap-2">
                {accessStatus.canEvaluate ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                <span>Evaluation Access: {accessStatus.canEvaluate ? 'GRANTED' : 'DENIED'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
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

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Pending Submissions */}
          <div className="bg-card border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Pending Submissions</h2>
              <Link to="/dashboard/faculty/evaluate" className="text-sm text-primary hover:underline">
                View all
              </Link>
            </div>
            <div className="space-y-3">
              {pendingSubmissions.map((submission) => (
                <div key={submission.id} className="p-4 rounded-lg bg-muted/50 border">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-foreground">{submission.exam}</h3>
                      <p className="text-sm text-muted-foreground">{submission.student}</p>
                      <p className="text-xs text-muted-foreground mt-1">{submission.submittedAt}</p>
                    </div>
                    <div>
                      {submission.encrypted && (
                        <div className="flex flex-col items-end gap-2">
                          <span className="encrypted-badge text-xs">
                            <Lock className="h-3 w-3" />
                            Encrypted
                          </span>
                          <button
                            onClick={() => handleDecryptSubmission(submission)}
                            disabled={isDecrypting}
                            className="text-xs px-2 py-1 rounded bg-primary/10 text-primary hover:bg-primary/20 transition-colors flex items-center gap-1"
                          >
                            {isDecrypting ? (
                              <RefreshCw className="h-3 w-3 animate-spin" />
                            ) : (
                              <Lock className="h-3 w-3" />
                            )}
                            Decrypt & View
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Unsigned Results */}
          <div className="bg-card border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Unsigned Results</h2>
              <Link to="/dashboard/faculty/sign-results" className="text-sm text-primary hover:underline">
                Sign all
              </Link>
            </div>
            <div className="space-y-3">
              {unsignedResults.map((result) => (
                <div key={result.id} className="p-4 rounded-lg bg-muted/50 border">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-foreground">{result.exam}</h3>
                      <p className="text-sm text-muted-foreground">
                        {result.count} results pending signature
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">Deadline: {result.deadline}</p>
                    </div>
                    <Link
                      to="#"
                      onClick={(e) => {
                        e.preventDefault();
                        openSignModal(result);
                      }}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm hover:bg-primary/90"
                    >
                      <PenTool className="h-4 w-4" />
                      Sign
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-8 p-4 rounded-lg bg-primary/5 border border-primary/20">
          <div className="flex items-start gap-3">
            <Lock className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-foreground">Digital Signature Required</h3>
              <p className="text-sm text-muted-foreground mt-1">
                All exam results must be digitally signed before release to students. Digital signatures ensure
                authenticity and integrity of grades. Submissions are encrypted and decrypted only during evaluation.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* DECRYPTION DIALOG */}
      <Dialog open={isDecryptModalOpen} onOpenChange={setIsDecryptModalOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-primary">
              <Shield className="h-5 w-5" />
              RSA-2048 Decryption Success
            </DialogTitle>
            <DialogDescription>
              Authorization verified. Showing original submission for <strong>{decryptedViewData?.student}</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between p-3 bg-muted border rounded-lg overflow-hidden relative">
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase text-muted-foreground">Encryption Standard</p>
                <p className="text-xs font-mono">AES-256-CBC + RSA-2048</p>
              </div>
              <div className="space-y-1 text-right">
                <p className="text-[10px] font-bold uppercase text-muted-foreground">Session Key Status</p>
                <p className="text-xs text-success font-bold">RECOVERED</p>
              </div>
              <div className="absolute top-0 right-0 p-1 opacity-5">
                <Lock className="h-12 w-12" />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Decrypted Exam Content</Label>
              <div className="p-4 bg-background border rounded-lg font-mono text-sm space-y-3">
                {decryptedViewData && Object.entries(decryptedViewData.answers).map(([key, value]: [string, any]) => (
                  <div key={key} className="space-y-1 border-b pb-2 last:border-0 last:pb-0">
                    <span className="text-[10px] font-bold text-primary uppercase">{key}</span>
                    <p className="text-xs leading-relaxed">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 bg-blue-500/5 border border-blue-500/10 rounded-lg flex items-start gap-3">
              <AlertTriangle className="h-4 w-4 text-blue-500 mt-1" />
              <div>
                <p className="text-[10px] font-bold uppercase text-blue-700">Audit Notification</p>
                <p className="text-[11px] text-blue-800/80">
                  This decryption event has been logged to the security vault. User: <strong>{user?.name}</strong>.
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="security" onClick={() => setIsDecryptModalOpen(false)} className="w-full">
              Close Secure Browser
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* SIGNING DIALOG */}
      <Dialog open={isSignModalOpen} onOpenChange={setIsSignModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Fingerprint className="h-5 w-5 text-primary" />
              Sign Exam Result
            </DialogTitle>
            <DialogDescription>
              Enter the student's score for <strong>{selectedResult?.exam}</strong>.
              The system will hash this score and sign it with your private key.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="score" className="text-right">
                Score
              </Label>
              <Input
                id="score"
                type="number"
                placeholder="0-100"
                value={scoreInput}
                onChange={(e) => setScoreInput(e.target.value)}
                className="col-span-3"
              />
            </div>

            <div className="p-3 rounded-lg bg-muted border space-y-2">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-muted-foreground">
                <Fingerprint className="h-3 w-3" />
                Security Protocol
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                RSA-2048 signing will be applied. This creates a non-repudiable proof of authenticity for this grade.
              </p>
            </div>
          </div>

          <DialogFooter className="sm:justify-between items-center">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsSignModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="security"
              onClick={handleSignResult}
              disabled={isSigning || !scoreInput}
            >
              {isSigning ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Fingerprint className="h-4 w-4 mr-2" />
                  Hash & Sign
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default FacultyDashboard;

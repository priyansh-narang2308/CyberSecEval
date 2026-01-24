import DashboardLayout from '../../components/dashboard-layout';
import { FileText, ClipboardList, FileCheck, Lock, Users, PenTool, AlertTriangle, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/auth-context';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const FacultyDashboard = () => {
  const { user, apiCall } = useAuth();
  const [accessStatus, setAccessStatus] = useState<{
    canEvaluate: boolean;
    canSign: boolean;
  }>({ canEvaluate: false, canSign: false });

  useEffect(() => {
    const checkAccess = async () => {
      // 1. Check Evaluate Access (Should allow)
      const evalRes = await apiCall('/submissions/evaluate', { method: 'POST' });

      // 2. Check Sign Access (Should allow)
      const signRes = await apiCall('/results/sign', { method: 'POST' });

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

  const handleDecryptSubmission = async (submissionId: string) => {
    // In a real app, this ID would come from the database.
    // Here we are simulating the decryption flow.
    // To make this work with the backend demo, we'd need a real submission ID from a previous CREATE call.
    // For the UI demo, we will check if the user HAS permission to decrypt (which they do).

    // We'll try to decrypt a "demo" ID just to trigger the API and show the flow works
    // The backend will return 404/500 if the ID isn't real, but the Access Check happens first.
    const res = await apiCall(`/hybrid/decrypt/${submissionId}`);

    if (res.ok) {
      toast.success('Submission Decrypted Successfully! (See console/network)');
      console.log('Decrypted Data:', res.data);
    } else if (res.status === 403) {
      toast.error('Decryption Failed: Access Denied');
    } else {
      // Since we are clicking dummy items, a 404/500 is expected, but verifies the route is hit.
      toast.info('Decryption Request Sent (Mock ID used)');
    }
  };

  const handleSignResult = async (resultId: number) => {
    // Simulate signing a specific result
    // In a real app we would pick the student/exam from the ID.
    const dummyResult = {
      studentName: 'Student #' + resultId,
      examTitle: 'Final Exam',
      score: Math.floor(Math.random() * 20) + 80 // Random score 80-100
    };

    const res = await apiCall('/signature/sign-result', {
      method: 'POST',
      body: JSON.stringify(dummyResult)
    });

    if (res.ok) {
      toast.success(`Result #${resultId} signed securely! Hash generated.`);
      console.log('Signature Proof:', res.data);
    } else {
      toast.error('Signing Failed');
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
                            onClick={() => handleDecryptSubmission(submission.id)}
                            className="text-xs px-2 py-1 rounded bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                          >
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
                        handleSignResult(result.id);
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
    </DashboardLayout>
  );
};

export default FacultyDashboard;

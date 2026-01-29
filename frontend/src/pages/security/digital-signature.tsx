/* eslint-disable @typescript-eslint/no-explicit-any */

import { PenTool, Shield, Check, FileCheck, Hash, AlertTriangle, RefreshCw, Zap, CheckCircle, Fingerprint } from 'lucide-react';
import DashboardLayout from '../../components/dashboard-layout';
import { Button } from '../../components/ui/button';
import { useAuth } from '../../contexts/auth-context';
import { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';

const DigitalSignaturePage = () => {
  const { user, apiCall } = useAuth();
  const [signedResults, setSignedResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSignedResults = useCallback(async () => {
    setIsLoading(true);
    const res = await apiCall('/signature/results');
    if (res.ok) {
      setSignedResults(res.data);
    }
    setIsLoading(false);
  }, [apiCall]);

  useEffect(() => {
    fetchSignedResults();
  }, [fetchSignedResults]);

  const handleVerify = async (id: string) => {
    const res = await apiCall(`/signature/verify/${id}`, { method: 'POST' });
    if (res.ok) {
      toast.success(res.data.message, {
        description: `Verified by: ${res.data.details.signedBy} | Integrity: ${res.data.details.status}`,
        duration: 5000
      });
    } else {
      toast.error(res.data.message, {
        description: res.data.details?.alert,
        duration: 5000
      });
    }
  };

  const handleTamper = async (id: string) => {
    const res = await apiCall(`/signature/tamper/${id}`, { method: 'POST' });
    if (res.ok) {
      toast.warning(res.data.message);
      fetchSignedResults();
    }
  };

  return (
    <DashboardLayout role="faculty" userName={user?.name || 'Faculty'}>
      <div className="max-w-4xl mx-auto pb-20">
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2 tracking-tight">Digital Signatures</h1>
            <p className="text-muted-foreground">
              Proof of Integrity and Authenticity for Academic Records.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={fetchSignedResults} disabled={isLoading}>
            {isLoading ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
            Refresh Vault
          </Button>
        </div>

        {/* What is Digital Signing? */}
        <div className="bg-card border-2 border-primary/10 rounded-2xl p-6 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <PenTool className="h-24 w-24" />
          </div>
          <div className="flex items-start gap-4 relative z-10">
            <div className="p-3 rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground mb-2">Non-Repudiation Protocol</h2>
              <p className="text-sm text-muted-foreground mb-4 max-w-2xl leading-relaxed">
                Using RSA-2048, we generate a cryptographic binding between the Faculty's ID and the student's score.
                Any modification to the score post-signing will instantly invalidate the signature during the verification phase.
              </p>
              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2 font-medium text-success">
                  <CheckCircle className="h-4 w-4" />
                  <span>Integrity Guaranteed</span>
                </div>
                <div className="flex items-center gap-2 font-medium text-primary">
                  <Fingerprint className="h-4 w-4" />
                  <span>Faculty Authenticity</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Real Signed Results from DB */}
        <div className="bg-card border rounded-xl p-6 mb-8 border-success/20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-success" />
              Live Signed Records (Blockchain Style)
            </h2>
            <span className="text-[10px] bg-success/10 text-success px-2 py-0.5 rounded-full font-bold border border-success/20">PROTECTED BY RSA-2048</span>
          </div>

          <div className="space-y-4">
            {signedResults.length === 0 ? (
              <div className="text-center py-12 border border-dashed rounded-xl">
                <p className="text-muted-foreground text-sm italic">No signed results found in database.</p>
                <p className="text-xs text-muted-foreground mt-2">Sign a result from the Faculty Dashboard to see it here.</p>
              </div>
            ) : (
              signedResults.map((result) => (
                <div key={result._id} className="p-5 rounded-xl bg-muted/30 border-2 border-transparent hover:border-success/10 transition-all group">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-foreground text-lg">{result.examTitle}</h3>
                        <span className="text-xs px-2 py-0.5 bg-success text-success-foreground rounded-md font-bold">SIGNED</span>
                      </div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Student: <span className="text-foreground">{result.studentName}</span> | Score: <span className="text-primary font-bold text-lg">{result.score}</span>
                      </p>
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold uppercase text-muted-foreground">Signed By</p>
                          <p className="text-xs font-medium">{result.signedBy?.name}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold uppercase text-muted-foreground">Signature Timestamp</p>
                          <p className="text-xs font-medium">{new Date(result.createdAt).toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-4 p-2 bg-background rounded-lg border border-success/20 w-fit">
                        <Hash className="h-3 w-3 text-success" />
                        <code className="text-[10px] text-muted-foreground font-mono truncate max-w-[250px]">
                          {result.signature}
                        </code>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleVerify(result._id)}
                        className="border-success/50 text-success hover:bg-success hover:text-white"
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Verify Integrity
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleTamper(result._id)}
                        className="text-destructive hover:bg-destructive/10 text-[10px]"
                      >
                        <Zap className="h-3 w-3 mr-1" />
                        Simulate Attack (Tamper)
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Educational Notice */}
        <div className="p-5 rounded-2xl bg-warning/5 border border-warning/20">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-foreground">Viva Demonstration Note</h3>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                Click <strong>"Simulate Attack"</strong> to manually modify the score in the database.
                After tampering, click <strong>"Verify Integrity"</strong> to show how the RSA signature
                detects the change. This proves Component #4: Data Integrity and Authenticity.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DigitalSignaturePage;

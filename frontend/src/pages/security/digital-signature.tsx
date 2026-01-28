
import { PenTool, Shield, Check, X, FileCheck, Hash } from 'lucide-react';
import DashboardLayout from '../../components/dashboard-layout';
import { Button } from '../../components/ui/button';


const DigitalSignaturePage = () => {
  const pendingResults = [
    { id: 1, exam: 'Cryptography Midterm', students: 45, submitted: '2024-03-10', signed: false },
    { id: 2, exam: 'Network Security Quiz', students: 38, submitted: '2024-03-12', signed: false },
  ];

  const signedResults = [
    { 
      id: 3, 
      exam: 'Information Security Basics', 
      students: 52, 
      signedAt: '2024-03-08', 
      signed: true,
      hashPreview: 'sha256:a7f3b2c1d9e8...'
    },
    { 
      id: 4, 
      exam: 'Access Control Systems', 
      students: 41, 
      signedAt: '2024-03-05', 
      signed: true,
      hashPreview: 'sha256:e4d5c6b7a8f9...'
    },
  ];

  return (
    <DashboardLayout role="faculty" userName="Dr. Sarah Chen">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">Digital Signature</h1>
          <p className="text-muted-foreground">
            Sign exam results to ensure integrity and authenticity.
          </p>
        </div>


        <div className="bg-card border rounded-xl p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <PenTool className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-2">What is Digital Signing?</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Digital signatures use cryptographic algorithms to verify the authenticity and integrity of exam results. 
                When you sign results, a unique hash is generated from the data and encrypted with your private key.
              </p>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Shield className="h-4 w-4 text-success" />
                  <span>Ensures data hasn't been tampered</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <FileCheck className="h-4 w-4 text-primary" />
                  <span>Verifies faculty authorization</span>
                </div>
              </div>
            </div>
          </div>
        </div>


        <div className="bg-card border rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Pending Signatures</h2>
          {pendingResults.length > 0 ? (
            <div className="space-y-4">
              {pendingResults.map((result) => (
                <div key={result.id} className="p-4 rounded-lg bg-muted/50 border">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-foreground">{result.exam}</h3>
                      <p className="text-sm text-muted-foreground">
                        {result.students} students • Submitted: {result.submitted}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-warning/10 text-warning">
                        <X className="h-3 w-3" />
                        Not Signed
                      </span>
                      <Button variant="security" size="sm">
                        <PenTool className="h-4 w-4" />
                        Sign Results
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No pending signatures.</p>
          )}
        </div>

        <div className="bg-card border rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">Signed Results</h2>
          <div className="space-y-4">
            {signedResults.map((result) => (
              <div key={result.id} className="p-4 rounded-lg bg-muted/50 border">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-foreground">{result.exam}</h3>
                    <p className="text-sm text-muted-foreground">
                      {result.students} students • Signed: {result.signedAt}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Hash className="h-3 w-3 text-muted-foreground" />
                      <code className="text-xs text-muted-foreground font-mono">
                        {result.hashPreview}
                      </code>
                    </div>
                  </div>
                  <span className="encrypted-badge">
                    <Check className="h-3 w-3" />
                    Signed
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>


        <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-foreground">Digital Signature Guarantee</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Digital signatures ensure that exam results cannot be modified after signing. Any alteration 
                to the data would invalidate the signature. Students can verify that their results are authentic 
                and have not been tampered with.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DigitalSignaturePage;

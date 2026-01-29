import { useState } from 'react';
import DashboardLayout from '../../components/dashboard-layout';
import {
    ShieldCheck,
    Lock,
    Zap,
    AlertTriangle,
    Fingerprint,
    Trash2,
    RefreshCw,
    Search,

} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { useAuth } from '../../contexts/auth-context';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface EncryptionResult {
    submissionId: string;
    encryptionDetails: {
        algorithm: string;
        iv: string;
        note: string;
    };
}

interface DecryptedData {
    decryptedAnswers: {
        content: string;
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    submissionInfo: any;
}

interface SignedResult {
    resultId: string;
    integrityProof: {
        signature: string;
        hash: string;
    };
}

interface VerificationResult {
    status: 'VALID' | 'INVALID';
    message: string;
    details: {
        score: number;
        signedBy: string;
    };
}

const SecurityLab = () => {
    const { apiCall, user } = useAuth();
    const [loading, setLoading] = useState(false);

    // Hybrid Encryption State
    const [submissionText, setSubmissionText] = useState('');
    const [submissionResult, setSubmissionResult] = useState<EncryptionResult | null>(null);
    const [decryptedResult, setDecryptedResult] = useState<DecryptedData | null>(null);

    // Signature State
    const [signatureTarget, setSignatureTarget] = useState({ name: 'Candidate A', score: 85, title: 'Final Exam' });
    const [signedResult, setSignedResult] = useState<SignedResult | null>(null);
    const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);

    const handleSecureSubmit = async () => {
        setLoading(true);
        try {
            const { ok, data } = await apiCall('/hybrid/submit', {
                method: 'POST',
                body: JSON.stringify({
                    examId: 'LAB-SESSION-001',
                    answers: { content: submissionText }
                })
            });
            if (ok) {
                setSubmissionResult(data as EncryptionResult);
                setDecryptedResult(null);
                toast.success('Stored securely in Database!');
            }
        } catch (error) {
            toast.error('Submission failed');
        } finally {
            setLoading(false);
        }
    };

    const handleDecrypt = async (id: string) => {
        setLoading(true);
        try {
            const { ok, data } = await apiCall(`/hybrid/decrypt/${id}`);
            if (ok) {
                setDecryptedResult(data as DecryptedData);
                toast.success('Authentication success: Data restored');
            }
        } catch (error) {
            toast.error('Access Denied');
        } finally {
            setLoading(false);
        }
    };

    const handleSign = async () => {
        setLoading(true);
        try {
            const { ok, data } = await apiCall('/signature/sign-result', {
                method: 'POST',
                body: JSON.stringify({
                    studentName: signatureTarget.name,
                    examTitle: signatureTarget.title,
                    score: signatureTarget.score
                })
            });
            if (ok) {
                setSignedResult(data as SignedResult);
                setVerificationResult(null);
                toast.success('Digitally signed by Faculty key');
            }
        } catch (error) {
            toast.error('Signing failed');
        } finally {
            setLoading(false);
        }
    };

    const handleTamper = async (id: string) => {
        setLoading(true);
        try {
            const { ok } = await apiCall(`/signature/tamper/${id}`, { method: 'POST' });
            if (ok) {
                toast.warning('Database Tampered: Score changed to 100 without key permission');
                setVerificationResult(null);
            }
        } catch (error) {
            toast.error('Tamper failed');
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (id: string) => {
        setLoading(true);
        try {
            const { data } = await apiCall(`/signature/verify/${id}`, { method: 'POST' });
            setVerificationResult(data as VerificationResult);
            if (data.status === 'VALID') {
                toast.success('Integrity Verified: Untampered');
            } else {
                toast.error('ALERT: Signature Mismatch Detected!');
            }
        } catch (error) {
            toast.error('Verification error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout role={user?.role || 'student'} userName={user?.name}>
            <div className="max-w-6xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Live Security Lab</h1>
                    <p className="text-muted-foreground mt-2">Interact with real backend cryptographic operations in real-time.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* SECTION 1: HYBRID ENCRYPTION */}
                    <div className="space-y-6">
                        <div className="p-6 bg-card border rounded-2xl shadow-sm space-y-6">
                            <div className="flex items-center gap-3 text-primary mb-4">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <Lock className="h-5 w-5" />
                                </div>
                                <h2 className="text-xl font-bold text-foreground">Hybrid Encryption Lab</h2>
                            </div>

                            <div className="space-y-4">
                                <label className="text-sm font-medium text-foreground">Step 1: Write Secret Answer</label>
                                <Input
                                    placeholder="Type your secret answer here..."
                                    value={submissionText}
                                    onChange={(e) => setSubmissionText(e.target.value)}
                                    className="bg-muted/50"
                                />
                                <Button
                                    onClick={handleSecureSubmit}
                                    className="w-full bg-primary hover:bg-primary/90 text-white"
                                    disabled={loading || !submissionText}
                                >
                                    <Zap className="h-4 w-4 mr-2" />
                                    Secure Submit (Hybrid RSA+AES)
                                </Button>
                            </div>

                            <AnimatePresence>
                                {submissionResult && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-6 p-4 bg-muted/30 border rounded-xl space-y-3"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Database State (Encrypted)</span>
                                            <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 text-[10px] font-bold border border-blue-500/20">AES-256-CBC</span>
                                        </div>
                                        <div className="font-mono text-[10px] break-all p-3 bg-background rounded-lg border text-muted-foreground whitespace-pre-wrap">
                                            {JSON.stringify(submissionResult.encryptionDetails, null, 2)}
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="w-full text-xs"
                                            onClick={() => handleDecrypt(submissionResult.submissionId)}
                                        >
                                            <Search className="h-3 w-3 mr-2" />
                                            Attempt Decryption
                                        </Button>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {decryptedResult && (
                                <motion.div
                                    initial={{ scale: 0.95, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="p-4 bg-green-500/5 border border-green-500/20 rounded-xl"
                                >
                                    <div className="flex items-center gap-2 text-green-600 mb-2">
                                        <ShieldCheck className="h-4 w-4" />
                                        <span className="text-xs font-bold uppercase tracking-wider">Restored Data</span>
                                    </div>
                                    <p className="text-sm font-medium text-foreground">
                                        {JSON.stringify(decryptedResult.decryptedAnswers.content)}
                                    </p>
                                </motion.div>
                            )}
                        </div>
                    </div>

                    {/* SECTION 2: DIGITAL SIGNATURE LAB */}
                    <div className="space-y-6">
                        <div className="p-6 bg-card border rounded-2xl shadow-sm space-y-6">
                            <div className="flex items-center gap-3 text-orange-500 mb-4">
                                <div className="p-2 bg-orange-500/10 rounded-lg">
                                    <Fingerprint className="h-5 w-5" />
                                </div>
                                <h2 className="text-xl font-bold text-foreground">Digital Signature Lab</h2>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold uppercase text-muted-foreground">Student Name</label>
                                        <Input
                                            value={signatureTarget.name}
                                            onChange={e => setSignatureTarget({ ...signatureTarget, name: e.target.value })}
                                            className="bg-muted/30 h-8 text-sm"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold uppercase text-muted-foreground">Original Score</label>
                                        <Input
                                            type="number"
                                            value={signatureTarget.score}
                                            onChange={e => setSignatureTarget({ ...signatureTarget, score: parseInt(e.target.value) })}
                                            className="bg-muted/30 h-8 text-sm"
                                        />
                                    </div>
                                </div>
                                <Button
                                    onClick={handleSign}
                                    className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                                    disabled={loading}
                                >
                                    <Fingerprint className="h-4 w-4 mr-2" />
                                    Generate Faculty Signature
                                </Button>
                            </div>

                            <AnimatePresence>
                                {signedResult && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="space-y-4"
                                    >
                                        <div className="p-3 bg-muted/30 border rounded-lg">
                                            <span className="text-[10px] font-bold uppercase text-muted-foreground block mb-2">RSA Signature (Proof of Authenticity)</span>
                                            <code className="text-[9px] break-all text-orange-500 block leading-tight">
                                                {signedResult.integrityProof.signature}
                                            </code>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                className="text-xs h-9"
                                                onClick={() => handleTamper(signedResult.resultId)}
                                            >
                                                <Trash2 className="h-3 w-3 mr-2" />
                                                Malicious Tamper
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="text-xs h-9 border-green-500/50 text-green-600 hover:bg-green-50"
                                                onClick={() => handleVerify(signedResult.resultId)}
                                            >
                                                <RefreshCw className={`h-3 w-3 mr-2 ${loading ? 'animate-spin' : ''}`} />
                                                Verify Integrity
                                            </Button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {verificationResult && (
                                <motion.div
                                    initial={{ y: 10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    className={`p-4 border rounded-xl flex items-start gap-3 ${verificationResult.status === 'VALID'
                                        ? 'bg-green-500/5 border-green-500/20 text-green-700'
                                        : 'bg-red-500/5 border-red-500/20 text-red-700'
                                        }`}
                                >
                                    {verificationResult.status === 'VALID' ? (
                                        <ShieldCheck className="h-5 w-5 flex-shrink-0" />
                                    ) : (
                                        <AlertTriangle className="h-5 w-5 flex-shrink-0 animate-pulse" />
                                    )}
                                    <div>
                                        <h3 className="text-sm font-bold uppercase tracking-wider">{verificationResult.status}</h3>
                                        <p className="text-xs mt-1">{verificationResult.message}</p>
                                        {verificationResult.status === 'VALID' && (
                                            <p className="text-[10px] mt-2 font-mono bg-white/50 p-1 px-2 rounded">
                                                Certified Score: {verificationResult.details.score}
                                            </p>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>


            </div>
        </DashboardLayout>
    );
};

export default SecurityLab;

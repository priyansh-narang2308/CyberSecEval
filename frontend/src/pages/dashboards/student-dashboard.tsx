/* eslint-disable @typescript-eslint/no-explicit-any */
import DashboardLayout from '../../components/dashboard-layout';
import { FileText, ClipboardList, BarChart3, Lock, Shield, Clock, AlertTriangle, CheckCircle, Terminal, FileCheck, Cpu, History as HistoryIcon } from 'lucide-react';
import { useAuth } from '../../contexts/auth-context';
import { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../components/ui/dialog";

interface Exam {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: string;
}

interface SignedResult {
  _id: string;
  examTitle: string;
  score: number;
  date: string;
  hash: string;
  signature: string;
  resultData: any;
  signedBy: { name: string };
  createdAt: string;
}

const StudentDashboard = () => {
  const { user, apiCall } = useAuth();

  const [permissions, setPermissions] = useState({
    readExams: false,
    evaluateSubmissions: false,
    manageUsers: false
  });

  const [handshake, setHandshake] = useState<{
    isOpen: boolean;
    step: 'idle' | 'fetching_rsa' | 'generating_aes' | 'wrapping' | 'complete';
    rsaPublicKey: string;
    aesKey: string;
    wrappedKey: string;
    currentExam: string;
    aesKeyObj: CryptoKey | null;
  }>({
    isOpen: false,
    step: 'idle',
    rsaPublicKey: '',
    aesKey: '',
    wrappedKey: '',
    currentExam: '',
    aesKeyObj: null
  });

  const [examTerminal, setExamTerminal] = useState({
    isOpen: false,
    content: '',
    encryptedData: '',
    iv: '',
    isSubmitting: false
  });

  const [results, setResults] = useState<SignedResult[]>([]);
  const [verification, setVerification] = useState({
    isOpen: false,
    isValid: false,
    hash: '',
    signature: '',
    result: null as SignedResult | null
  });

  const probePermissions = useCallback(async () => {
    const res1 = await apiCall('/exams');
    const res2 = await apiCall('/submissions/evaluate', { method: 'POST' });
    const res3 = await apiCall('/admin/users');

    setPermissions({
      readExams: res1.ok,
      evaluateSubmissions: res2.ok,
      manageUsers: res3.ok
    });
  }, [apiCall]);

  const fetchResults = useCallback(async () => {
    const res = await apiCall('/signature/my-results');
    if (res.ok) setResults(res.data);
  }, [apiCall]);

  useEffect(() => {
    if (user) {
      probePermissions();
      fetchResults();
    }
  }, [user, probePermissions, fetchResults]);

  const handleSecureSubmit = async (examId: string) => {
    setHandshake(prev => ({ ...prev, isOpen: true, step: 'fetching_rsa', currentExam: examId }));

    try {
      const pkRes = await apiCall('/crypto/public-key');
      if (!pkRes.ok) throw new Error('Failed to fetch RSA key');
      const rsaPem = pkRes.data.publicKey;

      setHandshake(prev => ({ ...prev, step: 'generating_aes', rsaPublicKey: rsaPem }));
      await new Promise(r => setTimeout(r, 600));

      const aesKeyObj = await window.crypto.subtle.generateKey(
        { name: 'AES-CBC', length: 256 },
        true,
        ['encrypt', 'decrypt']
      );

      const exportedAesRaw = await window.crypto.subtle.exportKey('raw', aesKeyObj);
      const aesHex = Array.from(new Uint8Array(exportedAesRaw)).map(b => b.toString(16).padStart(2, '0')).join('');

      setHandshake(prev => ({ ...prev, step: 'wrapping', aesKey: aesHex }));
      await new Promise(r => setTimeout(r, 600));

      const pemContents = rsaPem.replace("-----BEGIN PUBLIC KEY-----", "").replace("-----END PUBLIC KEY-----", "").replace(/\s/g, "");
      const binaryDerString = window.atob(pemContents);
      const binaryDer = new Uint8Array(binaryDerString.length);
      for (let i = 0; i < binaryDerString.length; i++) binaryDer[i] = binaryDerString.charCodeAt(i);

      const rsaKeyImported = await window.crypto.subtle.importKey(
        "spki",
        binaryDer.buffer,
        { name: "RSA-OAEP", hash: "SHA-256" },
        true,
        ["encrypt"]
      );

      const wrappedKeyBuffer = await window.crypto.subtle.encrypt(
        { name: "RSA-OAEP" },
        rsaKeyImported,
        exportedAesRaw
      );

      const wrappedKeyBase64 = window.btoa(String.fromCharCode(...new Uint8Array(wrappedKeyBuffer)));
      setHandshake(prev => ({ ...prev, step: 'complete', wrappedKey: wrappedKeyBase64, aesKeyObj }));
      toast.success('Secure Handshake Established');

    } catch (err) {
      toast.error('Cryptographic handshake failed');
      setHandshake(prev => ({ ...prev, isOpen: false, step: 'idle' }));
    }
  };

  const encryptSubmission = async () => {
    if (!handshake.aesKeyObj || !examTerminal.content) return;
    try {
      const iv = window.crypto.getRandomValues(new Uint8Array(16));
      const encoder = new TextEncoder();
      const data = encoder.encode(JSON.stringify({ answers: examTerminal.content }));

      const encryptedBuffer = await window.crypto.subtle.encrypt(
        { name: 'AES-CBC', iv },
        handshake.aesKeyObj,
        data
      );

      setExamTerminal(prev => ({
        ...prev,
        encryptedData: window.btoa(String.fromCharCode(...new Uint8Array(encryptedBuffer))),
        iv: window.btoa(String.fromCharCode(...iv))
      }));
      toast.success('Encryption Complete');
    } catch (err) {
      toast.error('Local encryption failed');
    }
  };

  const submitFinalPacket = async () => {
    setExamTerminal(prev => ({ ...prev, isSubmitting: true }));
    try {
      const res = await apiCall('/hybrid/submit', {
        method: 'POST',
        body: JSON.stringify({
          examId: handshake.currentExam,
          encryptedData: examTerminal.encryptedData,
          iv: examTerminal.iv,
          encryptedSessionKey: handshake.wrappedKey
        })
      });

      if (res.ok) {
        toast.success('Handshake completed and packet submitted');
        setExamTerminal({ isOpen: false, content: '', encryptedData: '', iv: '', isSubmitting: false });
        setHandshake(prev => ({ ...prev, step: 'idle', aesKeyObj: null }));
      }
    } catch (err) {
      toast.error('Submission failed');
    } finally {
      setExamTerminal(prev => ({ ...prev, isSubmitting: false }));
    }
  };

  const canonicalStringify = (obj: any): string => {
    const allKeys = Object.keys(obj).sort();
    return JSON.stringify(obj, allKeys);
  };

  const verifyResult = async (result: SignedResult) => {
    try {
      const pkRes = await apiCall('/crypto/public-key');
      if (!pkRes.ok) throw new Error('Key fetch failed');
      const rsaPem = pkRes.data.publicKey;

      const pemContents = rsaPem.replace("-----BEGIN PUBLIC KEY-----", "").replace("-----END PUBLIC KEY-----", "").replace(/\s/g, "");
      const binaryDerString = window.atob(pemContents);
      const binaryDer = new Uint8Array(binaryDerString.length);
      for (let i = 0; i < binaryDerString.length; i++) binaryDer[i] = binaryDerString.charCodeAt(i);

      const publicKey = await window.crypto.subtle.importKey(
        "spki",
        binaryDer.buffer,
        { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
        true,
        ["verify"]
      );

      const signatureBuffer = new Uint8Array(result.signature.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
      const encoder = new TextEncoder();
      const data = encoder.encode(canonicalStringify(result.resultData));

      const isValid = await window.crypto.subtle.verify("RSASSA-PKCS1-v1_5", publicKey, signatureBuffer, data);
      setVerification({ isOpen: true, isValid, hash: result.hash, signature: result.signature, result });

      if (isValid) toast.success('Integrity Confirmed');
      else toast.error('INTEGRITY ALERT: Tampering Detected');
    } catch (err) {
      toast.error('Verification failed');
      console.error(err);
    }
  };

  const [logs, setLogs] = useState<any[]>([]);
  const [isSyncingLogs, setIsSyncingLogs] = useState(false);

  const fetchLogs = useCallback(async () => {
    setIsSyncingLogs(true);
    const res = await apiCall('/admin/my-logs');
    if (res.ok) setLogs(res.data);
    setIsSyncingLogs(false);
  }, [apiCall]);

  useEffect(() => {
    if (user) {
      probePermissions();
      fetchResults();
      fetchLogs();
    }
  }, [user, probePermissions, fetchResults, fetchLogs]);

  const stats = [
    { icon: FileText, label: 'Available Exams', value: '3', color: 'text-primary' },
    { icon: ClipboardList, label: 'Completed Exams', value: results.length.toString(), color: 'text-success' },
    { icon: BarChart3, label: 'Average Score', value: results.length > 0 ? `${Math.round(results.reduce((acc, r) => acc + r.score, 0) / results.length)}%` : '0%', color: 'text-primary' },
    { icon: Clock, label: 'Upcoming', value: '2', color: 'text-warning' },
  ];

  const upcomingExams: Exam[] = [
    { id: '1', title: 'Cryptography Midterm', date: 'Mar 15, 2024', time: '10:00 AM', duration: '2 hours' },
    { id: '2', title: 'Network Security Quiz', date: 'Mar 18, 2024', time: '2:00 PM', duration: '1 hour' },
  ];

  return (
    <DashboardLayout role="student" userName={user?.name || 'Student'}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
            <div className="space-y-2">
              <h1 className="text-4xl font-black tracking-tighter text-foreground">STUDENT TERMINAL</h1>
              <div className="flex items-center gap-3 text-muted-foreground font-mono text-sm">
                <span className="flex items-center gap-1.5 bg-muted px-2 py-0.5 rounded border">
                  <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                  ID: {user?.universityId || '000000'}
                </span>
                <span>AUTHENTICATED AS: <span className="text-foreground font-bold">{user?.name?.toUpperCase()}</span></span>
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
                <div className="px-2 py-1 bg-success/10 text-success text-[10px] font-black rounded border border-success/20">CLEARANCE: L1</div>
              </div>

              <div className="space-y-3">
                {[
                  { label: 'EXAMS:READ', granted: permissions.readExams },
                  { label: 'EXAMS:WRITE', granted: permissions.evaluateSubmissions },
                  { label: 'ADMIN:MANAGE', granted: permissions.manageUsers },
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

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-6">
              <h2 className="text-xl font-black text-foreground flex items-center gap-3">
                <div className="h-8 w-1 bg-primary rounded-full" />
                ACTIVE EXAMINATIONS
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {upcomingExams.map((exam) => (
                  <div key={exam.id} className="p-6 rounded-3xl bg-card border hover:border-primary/30 transition-all group relative overflow-hidden">
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">{exam.title}</h3>
                      <div className="flex flex-col gap-2">
                        <span className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] bg-muted/50 px-3 py-1.5 rounded-xl w-fit">
                          <Clock className="h-3 w-3" /> {exam.date}
                        </span>
                        <span className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest">
                          <Lock className="h-3 w-3" /> CRYPTO-ACTIVE
                        </span>
                      </div>
                      <button
                        onClick={() => handleSecureSubmit(exam.id)}
                        className="w-full bg-primary text-primary-foreground text-xs font-black uppercase tracking-widest px-6 py-4 rounded-2xl hover:shadow-lg hover:shadow-primary/25 transition-all active:scale-95 mt-2"
                      >
                        Start Secure Session
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-xl font-black text-foreground flex items-center gap-3">
                <div className="h-8 w-1 bg-success rounded-full" />
                SECURE GRADEBOOK
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {results.length > 0 ? results.map((result) => (
                  <div key={result._id} className="p-6 rounded-3xl bg-card border hover:border-success/30 transition-all group">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-bold text-foreground">{result.examTitle}</h3>
                        <p className="text-3xl font-black text-foreground tabular-nums tracking-tighter">
                          {result.score}<span className="text-xs text-muted-foreground font-normal tracking-normal opacity-50">/100</span>
                        </p>
                      </div>
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60 flex items-center gap-1.5">
                        <FileCheck className="h-3.5 w-3.5" />
                        AUDIT ID: {result._id.substring(0, 8)}
                      </p>
                      <button
                        onClick={() => verifyResult(result)}
                        className="w-full flex items-center justify-center gap-2 text-[10px] font-black bg-success/10 text-success hover:bg-success hover:text-success-foreground px-4 py-3 rounded-2xl border border-success/20 uppercase tracking-widest transition-all"
                      >
                        Verify Integrity
                        <CheckCircle className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                )) : (
                  <div className="col-span-full h-48 rounded-[32px] border-2 border-dashed flex flex-col items-center justify-center text-muted-foreground space-y-2 bg-muted/5">
                    <ClipboardList className="h-10 w-10 opacity-10" />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 text-center px-10">No signed results synchronized yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-foreground flex items-center gap-3">
                <div className="h-8 w-1 bg-warning rounded-full" />
                AUDIT LOGS
              </h2>
              <button
                onClick={fetchLogs}
                disabled={isSyncingLogs}
                className="p-2 hover:bg-muted rounded-xl transition-colors disabled:opacity-50"
              >
                <Cpu className={`h-5 w-5 ${isSyncingLogs ? 'animate-spin' : ''}`} />
              </button>
            </div>
            <div className="bg-card border rounded-[40px] p-8 min-h-[600px] shadow-sm relative overflow-hidden">
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
                  <div className="flex flex-col items-center justify-center h-96 text-center space-y-4 opacity-30">
                    <HistoryIcon className="h-12 w-12" />
                    <p className="text-[10px] font-black uppercase tracking-widest">No activity logged.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={handshake.isOpen} onOpenChange={(open) => setHandshake(prev => ({ ...prev, isOpen: open }))}>
        <DialogContent className="max-w-3xl p-10 rounded-[40px]">
          <DialogHeader className="mb-8">
            <DialogTitle className="text-3xl font-black flex items-center gap-4 tracking-tighter">
              <div className="p-3 bg-primary/10 rounded-2xl">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              SECURE SESSION NEGOTIATION
            </DialogTitle>
            <DialogDescription className="text-base font-medium">
              Establishing an end-to-end encrypted tunnel for <span className="text-foreground font-black underline decoration-primary/30 underline-offset-4 tracking-tight">{handshake.currentExam}</span>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {[
              {
                step: 1,
                title: 'Retrieval of Server RSA Public Key',
                data: handshake.rsaPublicKey,
                status: handshake.step !== 'idle',
                type: 'mono-small'
              },
              {
                step: 2,
                title: 'Generation of Local AES-256 Session Key',
                data: handshake.aesKey,
                status: ['generating_aes', 'wrapping', 'complete'].includes(handshake.step),
                type: 'mono-large'
              },
              {
                step: 3,
                title: 'Cryptographic Key Wrapping (Hybrid Handshake)',
                data: handshake.wrappedKey,
                status: handshake.step === 'complete',
                type: 'mono-small'
              }
            ].map((s, idx) => (
              <div key={idx} className={`flex items-start gap-6 p-6 rounded-[32px] border transition-all ${s.status ? 'bg-card border-primary/20 shadow-lg' : 'opacity-40 grayscale bg-muted/20'}`}>
                <div className={`h-10 w-10 rounded-2xl flex items-center justify-center font-black text-lg flex-shrink-0 ${s.status ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                  {s.step}
                </div>
                <div className="space-y-3 w-full">
                  <p className="font-bold text-foreground flex items-center justify-between">
                    {s.title}
                    {s.status && <CheckCircle className="h-4 w-4 text-success animate-in fade-in zoom-in" />}
                  </p>
                  {s.data && (
                    <div className={`p-4 bg-muted rounded-2xl font-mono break-all border-l-4 border-primary/40 ${s.type === 'mono-small' ? 'text-[9px] opacity-70 line-clamp-2' : 'text-sm font-black text-primary tracking-wider'}`}>
                      {s.data}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {handshake.step === 'complete' && (
              <div className="pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-success font-black text-xs uppercase tracking-[0.2em]">
                  <div className="flex -space-x-1">
                    {[1, 2, 3].map(i => <div key={i} className="h-2 w-2 rounded-full bg-success animate-pulse" />)}
                  </div>
                  Handshake Verified
                </div>
                <button
                  onClick={() => {
                    setHandshake(prev => ({ ...prev, isOpen: false }));
                    setExamTerminal(prev => ({ ...prev, isOpen: true }));
                  }}
                  className="w-full sm:w-auto px-10 py-4 bg-primary text-primary-foreground rounded-2xl font-black uppercase tracking-widest hover:shadow-2xl hover:shadow-primary/30 transition-all hover:-translate-y-1 active:scale-95"
                >
                  Enter Exam Terminal
                </button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={examTerminal.isOpen} onOpenChange={(open) => setExamTerminal(prev => ({ ...prev, isOpen: open }))}>
        <DialogContent className="max-w-5xl p-10 rounded-[40px]">
          <DialogHeader className="mb-8">
            <DialogTitle className="text-3xl font-black flex items-center gap-4 tracking-tighter text-foreground">
              <div className="p-3 bg-primary/10 rounded-2xl">
                <Terminal className="h-8 w-8 text-primary" />
              </div>
              SECURE EXAM TERMINAL: {handshake.currentExam}
            </DialogTitle>
            <DialogDescription className="text-base font-medium">
              Enterprise-grade encryption active. Plaintext answers stay in this browser. Only the <span className="font-black text-foreground">Ciphertext Payload</span> is transmitted.
            </DialogDescription>
          </DialogHeader>

          <div className="grid lg:grid-cols-5 gap-10">
            <div className="lg:col-span-3 space-y-6 text-foreground">
              <div className="flex items-center justify-between px-2">
                <label className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground">Student Workspace</label>
                <div className="flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-tighter opacity-50">Local Key Active</span>
                </div>
              </div>
              <textarea
                value={examTerminal.content}
                onChange={(e) => setExamTerminal(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Type your exam responses here. Confidentiality is guaranteed."
                className="w-full h-80 p-8 rounded-[32px] border-2 bg-muted/10 focus:bg-background focus:border-primary/50 outline-none transition-all resize-none font-medium leading-relaxed"
              />
              <button
                onClick={encryptSubmission}
                disabled={!examTerminal.content}
                className="w-full py-5 bg-foreground text-background rounded-2xl font-black uppercase tracking-[0.2em] hover:opacity-90 transition-all active:scale-95 disabled:grayscale"
              >
                Seal & Encrypt
              </button>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <label className="text-xs font-black uppercase tracking-[0.3em] px-2 text-muted-foreground">Packet Preview</label>
              <div className="h-[430px] p-6 rounded-[32px] border-2 bg-muted/20 font-mono text-[10px] break-all overflow-y-auto relative border-dashed">
                {examTerminal.encryptedData ? (
                  <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                    <div>
                      <p className="text-primary font-black mb-2 uppercase tracking-widest text-[9px] flex items-center gap-2">
                        <Lock className="h-3 w-3" /> AES_CIPHERTEXT
                      </p>
                      <div className="bg-background/80 p-3 rounded-xl border opacity-80">{examTerminal.encryptedData}</div>
                    </div>
                    <div>
                      <p className="text-warning font-black mb-2 uppercase tracking-widest text-[9px] flex items-center gap-2">
                        <BarChart3 className="h-3 w-3" /> IV_SEED
                      </p>
                      <div className="bg-background/80 p-3 rounded-xl border opacity-80">{examTerminal.iv}</div>
                    </div>
                    <div className="pt-4 border-t-2 border-dashed">
                      <p className="text-success font-black mb-2 uppercase tracking-widest text-[9px] flex items-center gap-2">
                        HYBRID_HANDSHAKE_KEY
                      </p>
                      <div className="bg-background/70 p-3 rounded-xl border opacity-50 text-[8px]">{handshake.wrappedKey}</div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center space-y-4 px-6">
                    <div className="p-4 bg-background rounded-full border shadow-sm opacity-20">
                      <Shield className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Encryption Engine Idle. Awaiting Plaintext sealing.</p>
                  </div>
                )}
              </div>
              <button
                onClick={submitFinalPacket}
                disabled={!examTerminal.encryptedData || examTerminal.isSubmitting}
                className="w-full py-5 bg-primary text-primary-foreground rounded-2xl font-black uppercase tracking-[0.2em] hover:shadow-2xl hover:shadow-primary/30 transition-all active:scale-95 disabled:grayscale flex items-center justify-center gap-3"
              >
                {examTerminal.isSubmitting ? 'BROADCASTING...' : 'Transmit Packet'}
                {!examTerminal.isSubmitting && <CheckCircle className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={verification.isOpen} onOpenChange={(open) => setVerification(prev => ({ ...prev, isOpen: open }))}>
        <DialogContent className="max-w-2xl p-10 rounded-[40px] text-foreground">
          <DialogHeader className="mb-8">
            <DialogTitle className="text-3xl font-black flex items-center gap-4 tracking-tighter">
              <div className="p-3 bg-success/10 rounded-2xl">
                <FileCheck className="h-8 w-8 text-success" />
              </div>
              VERIFICATION CERTIFICATE
            </DialogTitle>
            <DialogDescription className="text-base font-medium">
              Validating result authenticity via <span className="font-black">RSA-Digital Signature Protocol</span>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className={`p-8 rounded-[32px] border-2 transition-all ${verification.isValid ? 'bg-success/5 border-success/30' : 'bg-destructive/5 border-destructive/30'}`}>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-1">Status</h4>
                  <p className={`text-xl font-black uppercase tracking-tight ${verification.isValid ? 'text-success' : 'text-destructive'}`}>
                    {verification.isValid ? 'INTEGRITY CONFIRMED' : 'TAMPER ALERT DETECTED'}
                  </p>
                </div>
                <div className={`h-16 w-16 rounded-2xl flex items-center justify-center border-2 ${verification.isValid ? 'border-success/40 bg-success/10' : 'border-destructive/40 bg-destructive/10'}`}>
                  {verification.isValid ? <CheckCircle className="h-8 w-8 text-success" /> : <AlertTriangle className="h-8 w-8 text-destructive animate-bounce" />}
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">SHA-256 HASH (COMPUTED DATA)</h4>
                  <div className="bg-background/80 p-4 rounded-xl border font-mono text-[9px] break-all opacity-80 leading-relaxed uppercase">
                    {verification.hash}
                  </div>
                </div>
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">RSA-RSA-SIGNATURE (FACULTY PROOF)</h4>
                  <div className="bg-background/80 p-4 rounded-xl border font-mono text-[9px] break-all opacity-40 leading-relaxed uppercase line-clamp-3">
                    {verification.signature}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-muted/30 p-6 rounded-3xl border space-y-2">
              <p className="text-[11px] font-bold text-muted-foreground flex items-center justify-between">
                <span>ISSUED BY: <span className="text-foreground">{verification.result?.signedBy?.name?.toUpperCase() || 'N/A'}</span></span>
                <span>TIME: {verification.result?.createdAt ? new Date(verification.result.createdAt).toLocaleString() : 'N/A'}</span>
              </p>
              <p className="text-[9px] font-medium leading-relaxed opacity-50">This certificate provides cryptographic proof that the data has not been modified since the faculty signature was applied. Any mismatch in the verification process indicates unauthorized database level manipulation.</p>
            </div>

            <button
              onClick={() => setVerification(prev => ({ ...prev, isOpen: false }))}
              className="w-full py-5 bg-foreground text-background rounded-2xl font-black uppercase tracking-[0.2em] hover:opacity-90 transition-all active:scale-95"
            >
              Close Certificate
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default StudentDashboard;

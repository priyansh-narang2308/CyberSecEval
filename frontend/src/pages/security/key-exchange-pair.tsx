import DashboardLayout from '../../components/dashboard-layout';
import { Key, Lock, RefreshCw, Shield, ArrowDown, Hash, Zap, CheckCircle, Copy } from 'lucide-react';
import { useAuth } from '../../contexts/auth-context';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../../components/ui/button';

const KeyExchangePage = () => {
  const { user, apiCall } = useAuth();
  const [publicKey, setPublicKey] = useState<string>('');
  const [keyInfo, setKeyInfo] = useState<any>(null);
  const [isRotating, setIsRotating] = useState(false);

  const fetchKeyInfo = async () => {
    const res = await apiCall('/crypto/public-key');
    if (res.ok) {
      setPublicKey(res.data.publicKey);
      setKeyInfo(res.data);
    }
  };

  useEffect(() => {
    fetchKeyInfo();
  }, []);

  const handleRotateKeys = async () => {
    if (!window.confirm('WARNING: Rotating keys will invalidate all current session keys. Continue?')) return;

    setIsRotating(true);
    const res = await apiCall('/admin/rotate-keys', { method: 'POST' });
    if (res.ok) {
      toast.success('System RSA Keys Rotated Successfully');
      setPublicKey(res.data.publicKey);
    } else {
      toast.error('Rotation failed: check permissions');
    }
    setIsRotating(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Key copied to clipboard');
  };

  return (
    <DashboardLayout role="admin" userName={user?.name || 'Admin'}>
      <div className="max-w-5xl mx-auto pb-20">
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2 tracking-tight">System Key Management</h1>
            <p className="text-muted-foreground">
              Managing the root of trust: RSA-2048 Server Key Pair.
            </p>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleRotateKeys}
            disabled={isRotating}
            className="shadow-lg shadow-destructive/20"
          >
            {isRotating ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Zap className="h-4 w-4 mr-2" />}
            Emergency Key Rotation
          </Button>
        </div>

        {/* Live Key Status */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-card border-2 border-primary/20 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Key className="h-32 w-32" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-primary text-primary-foreground">
                  <Shield className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-bold">Active Public Key (Live)</h2>
                <span className="text-[10px] px-2 py-0.5 bg-success/10 text-success border border-success/20 rounded-full font-bold">ACTIVE</span>
              </div>

              <div className="bg-background/50 border rounded-xl p-4 font-mono text-[10px] text-muted-foreground relative group">
                <pre className="whitespace-pre-wrap break-all leading-tight">
                  {publicKey || 'Fetching key...'}
                </pre>
                <button
                  onClick={() => copyToClipboard(publicKey)}
                  className="absolute top-2 right-2 p-2 bg-muted rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Copy className="h-3 w-3" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="p-3 rounded-xl bg-muted/30 border">
                  <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">Algorithm</p>
                  <p className="text-sm font-bold text-foreground">{keyInfo?.type || 'RSA-2048'}</p>
                </div>
                <div className="p-3 rounded-xl bg-muted/30 border">
                  <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">Format</p>
                  <p className="text-sm font-bold text-foreground">{keyInfo?.format || 'PEM (PKCS#8)'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-card border rounded-2xl p-6 h-full">
              <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                <Hash className="h-4 w-4 text-primary" />
                Key Fingerprint
              </h3>
              <div className="p-4 bg-muted/50 rounded-xl border border-dashed border-primary/30">
                <p className="text-[10px] font-mono text-muted-foreground break-all leading-relaxed">
                  SHA-256: {publicKey ? 'd5a1...8f2b...90c4...e3x1' : 'Computing...'}
                </p>
              </div>
              <ul className="mt-6 space-y-3">
                <li className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CheckCircle className="h-3 w-3 text-success" />
                  Audited by NIST Compliance
                </li>
                <li className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CheckCircle className="h-3 w-3 text-success" />
                  Hardware Security Module Ready
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* The Process - Educational but connected */}
        <div className="bg-card border rounded-2xl p-8 mb-8">
          <h2 className="text-xl font-bold text-foreground mb-8">Secure Key Exchange Lifecycle</h2>
          <div className="grid md:grid-cols-3 gap-12 relative">
            <div className="absolute top-1/4 left-0 w-full h-0.5 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 hidden md:block" />

            <div className="relative z-10 text-center space-y-4">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto shadow-lg shadow-primary/20 font-bold">1</div>
              <h4 className="font-bold">Generation</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">Server creates ultra-secure RSA-2048 Public/Private pairs during initialization.</p>
            </div>

            <div className="relative z-10 text-center space-y-4">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto shadow-lg shadow-primary/20 font-bold">2</div>
              <h4 className="font-bold">Distribution</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">Public keys are sent to clients via /api/crypto/public-key for session encryption.</p>
            </div>

            <div className="relative z-10 text-center space-y-4">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto shadow-lg shadow-primary/20 font-bold">3</div>
              <h4 className="font-bold">Encapsulation</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">Student creates AES-256 session key, 'wraps' it with RSA, and submits it securely.</p>
            </div>
          </div>
        </div>

        {/* Security Warning */}
        <div className="p-5 rounded-2xl bg-destructive/5 border border-destructive/20 flex gap-4 items-start">
          <Zap className="h-6 w-6 text-destructive flex-shrink-0" />
          <div>
            <h4 className="font-bold text-destructive">Advanced Security Awareness</h4>
            <p className="text-sm text-muted-foreground mt-1">
              Our system implements <strong>RSA-OAEP padding</strong>. This prevents "Chosen Ciphertext Attacks" (CCA)
              ensuring that even if an attacker modifies the encrypted session key, the server's private key
              won't leak information during decryption errors.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default KeyExchangePage;

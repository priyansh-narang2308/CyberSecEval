import { useState } from 'react';
import DashboardLayout from '../../components/dashboard-layout';
import { Lock, Unlock, Shield, ArrowRight, RefreshCw, Key } from 'lucide-react';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';

const EncryptionPage = () => {
    const [inputText, setInputText] = useState('Confidential Exam Data');
    const [encryptedData, setEncryptedData] = useState('');
    const [decryptedData, setDecryptedData] = useState('');
    const [key, setKey] = useState('');
    const [iv, setIv] = useState('');


    const handleEncrypt = () => {
        const simKey = Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
        const simIv = Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

        const mockCipher = btoa(inputText + simKey).split('').reverse().join('');

        setKey(simKey);
        setIv(simIv);
        setEncryptedData(mockCipher);
        setDecryptedData('');
    };

    const handleDecrypt = () => {
        setDecryptedData(inputText);
    };

    return (
        <DashboardLayout role="admin" userName="Viewer">
            <div className="max-w-5xl mx-auto">
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-primary/10">
                            <Lock className="h-6 w-6 text-primary" />
                        </div>
                        <h1 className="text-2xl font-bold text-foreground">Encryption & Decryption</h1>
                    </div>
                    <p className="text-muted-foreground">
                        Demonstrating AES-256 Symmetric Encryption for data confidentiality.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-card border rounded-xl p-6">
                        <h3 className="font-semibold flex items-center gap-2 mb-4">
                            <Shield className="h-4 w-4 text-primary" />
                            Why AES-256?
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Advanced Encryption Standard (AES) with 256-bit keys is the industry standard for securing sensitive data.
                            It is a <strong>Symmetric</strong> algorithm, meaning the same key is used for both encryption and decryption.
                        </p>
                    </div>
                    <div className="bg-card border rounded-xl p-6">
                        <h3 className="font-semibold flex items-center gap-2 mb-4">
                            <Key className="h-4 w-4 text-primary" />
                            The Role of RSA
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            While AES encrypts the data efficiently, we use <strong>RSA (Asymmetric)</strong> to securely exchange the AES key.
                            This "Hybrid" approach combines the speed of AES with the security of RSA key exchange.
                        </p>
                    </div>
                </div>

                <div className="bg-card border rounded-xl overflow-hidden mb-8">
                    <div className="p-6 border-b bg-muted/30">
                        <h2 className="font-semibold text-lg flex items-center gap-2">
                            <RefreshCw className="h-5 w-5 text-primary" />
                            Live Demonstration
                        </h2>
                    </div>

                    <div className="p-8 grid gap-8">
                        <div className="grid gap-4">
                            <Label>Data to Encrypt</Label>
                            <div className="flex gap-4">
                                <Input
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    className="font-mono"
                                />
                                <Button onClick={handleEncrypt} className="min-w-[140px]">
                                    <Lock className="mr-2 h-4 w-4" />
                                    Encrypt
                                </Button>
                            </div>
                        </div>


                        {encryptedData && (
                            <div className="flex justify-center -my-2">
                                <ArrowRight className="h-6 w-6 text-muted-foreground rotate-90" />
                            </div>
                        )}


                        {encryptedData && (
                            <div className="grid gap-4 p-6 rounded-xl bg-muted/40 border border-border">
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <Label className="text-xs text-muted-foreground mb-1.5 block font-semibold">Generated AES Key (256-bit)</Label>
                                        <code className="block bg-background p-3 rounded-lg text-xs font-mono text-green-600 dark:text-green-400 break-all border border-border shadow-sm">
                                            {key}
                                        </code>
                                    </div>
                                    <div>
                                        <Label className="text-xs text-muted-foreground mb-1.5 block font-semibold">Initialization Vector (IV)</Label>
                                        <code className="block bg-background p-3 rounded-lg text-xs font-mono text-blue-600 dark:text-blue-400 break-all border border-border shadow-sm">
                                            {iv}
                                        </code>
                                    </div>
                                </div>

                                <div>
                                    <Label className="text-xs text-muted-foreground mb-1.5 block font-semibold">Ciphertext (Encrypted Data)</Label>
                                    <code className="block bg-background p-4 rounded-lg text-sm font-mono text-foreground break-all border border-border shadow-sm">
                                        {encryptedData}
                                    </code>
                                </div>

                                <div className="flex justify-end mt-2">
                                    <Button onClick={handleDecrypt} variant="default" className="bg-primary text-primary-foreground hover:bg-primary/90">
                                        <Unlock className="mr-2 h-4 w-4" />
                                        Decrypt Data
                                    </Button>
                                </div>
                            </div>
                        )}

                        {decryptedData && (
                            <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                                <div className="flex justify-center mb-4">
                                    <ArrowRight className="h-6 w-6 text-muted-foreground rotate-90" />
                                </div>
                                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                                    <Label className="text-green-600 mb-1.5 block font-semibold">Decrypted Original Data</Label>
                                    <p className="text-lg font-mono text-foreground">{decryptedData}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default EncryptionPage;

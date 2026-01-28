
import DashboardLayout from '../../components/dashboard-layout';

import { Key, Lock, RefreshCw, Shield, ArrowRight, ArrowDown } from 'lucide-react';

const KeyExchangePage = () => {
  const steps = [
    {
      title: 'Key Generation',
      description: 'Each party generates their own RSA key pair consisting of a public key and a private key. The private key is kept secret.',
      icon: Key,
    },
    {
      title: 'Public Key Exchange',
      description: 'Public keys are exchanged over the network. Even if intercepted, the public key alone cannot decrypt messages.',
      icon: RefreshCw,
    },
    {
      title: 'Session Key Creation',
      description: 'A symmetric session key (AES-256) is generated and encrypted with the recipient\'s public key before transmission.',
      icon: Lock,
    },
  ];

  return (
    <DashboardLayout role="admin" userName="Admin">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">Key Exchange Protocol</h1>
          <p className="text-muted-foreground">
            Understanding how secure key exchange works in SecureExamVault.
          </p>
        </div>


        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <div className="bg-card border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-success/10">
                <Lock className="h-5 w-5 text-success" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Data Encryption</h3>
                <p className="text-sm text-muted-foreground">AES-256</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              All exam data is encrypted using AES-256, a symmetric encryption algorithm approved by NIST.
            </p>
          </div>
          <div className="bg-card border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Key className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Key Exchange</h3>
                <p className="text-sm text-muted-foreground">RSA-2048</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Keys are exchanged securely using RSA asymmetric encryption with 2048-bit keys.
            </p>
          </div>
        </div>


        <div className="bg-card border rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-6">Key Exchange Process</h2>
          <div className="space-y-6">
            {steps.map((step, index) => (
              <div key={index}>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">{index + 1}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <step.icon className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold text-foreground">{step.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className="flex justify-start ml-5 my-4">
                    <ArrowDown className="h-5 w-5 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>


        <div className="bg-card border rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-6">Secure Communication Flow</h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <div className="text-center p-4 rounded-lg bg-muted">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <p className="font-medium text-foreground">Client</p>
              <p className="text-xs text-muted-foreground mt-1">Generates Key Pair</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="text-xs">Public Key</span>
                <ArrowRight className="h-4 w-4" />
              </div>
              <div className="w-24 h-px bg-border" />
              <div className="flex items-center gap-2 text-muted-foreground rotate-180 md:rotate-0">
                <span className="text-xs rotate-180 md:rotate-0">Encrypted Data</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted">
              <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-3">
                <Lock className="h-8 w-8 text-success" />
              </div>
              <p className="font-medium text-foreground">Server</p>
              <p className="text-xs text-muted-foreground mt-1">Encrypts with Public Key</p>
            </div>
          </div>
        </div>


        <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-foreground">Why This Matters</h3>
              <p className="text-sm text-muted-foreground mt-1">
                The combination of RSA for key exchange and AES for data encryption provides perfect forward secrecy. 
                Even if long-term keys are compromised in the future, past session data remains secure because each 
                session uses unique symmetric keys.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default KeyExchangePage;

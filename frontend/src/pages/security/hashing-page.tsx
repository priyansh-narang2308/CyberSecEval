import  { useState } from 'react';
import DashboardLayout from '../../components/dashboard-layout';

import { Hash, Lock, Shield, ArrowDown, Eye, EyeOff } from 'lucide-react';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';

const HashingPage = () => {
  const [password, setPassword] = useState('');
  const [showDemo, setShowDemo] = useState(false);

  // Simulated hash output (for demonstration only)
  const simulatedSalt = 'a7f3b2c1d9e8f0a1';
  const simulatedHash = password 
    ? `sha256$${simulatedSalt}$${btoa(password + simulatedSalt).slice(0, 44)}...`
    : '';

  const steps = [
    {
      number: 1,
      title: 'Password Input',
      description: 'User enters their password during registration or login.',
      visual: password || 'MySecureP@ss123',
    },
    {
      number: 2,
      title: 'Salt Generation',
      description: 'A random salt is generated for each password. Salts prevent rainbow table attacks.',
      visual: simulatedSalt,
    },
    {
      number: 3,
      title: 'Hash Computation',
      description: 'Password and salt are combined and passed through a cryptographic hash function.',
      visual: 'SHA-256(password + salt)',
    },
    {
      number: 4,
      title: 'Secure Storage',
      description: 'Only the hash and salt are stored. The original password is never saved.',
      visual: simulatedHash || 'sha256$a7f3b2c1d9e8f0a1$TXlTZWN1cmVQQHNzMTIz...',
    },
  ];

  return (
    <DashboardLayout role="admin" userName="Admin">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">Password Hashing & Storage</h1>
          <p className="text-muted-foreground">
            How SecureExamVault securely stores user credentials.
          </p>
        </div>

        {/* Security Summary */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-card border rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <Hash className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">Hashed</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Passwords are hashed using SHA-256, a one-way cryptographic function.
            </p>
          </div>
          <div className="bg-card border rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <Lock className="h-5 w-5 text-success" />
              <h3 className="font-semibold text-foreground">Salted</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Unique random salt applied to each password before hashing.
            </p>
          </div>
          <div className="bg-card border rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">Secure</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Original passwords are never stored and cannot be recovered.
            </p>
          </div>
        </div>

        {/* Interactive Demo */}
        <div className="bg-card border rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Hashing Demonstration</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDemo(!showDemo)}
            >
              {showDemo ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
              {showDemo ? 'Hide' : 'Show'} Demo
            </Button>
          </div>
          
          {showDemo && (
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Enter a test password:</label>
                <Input
                  type="text"
                  placeholder="Enter any password to see the hash"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="max-w-md"
                />
              </div>
              {password && (
                <div className="p-4 rounded-lg bg-muted/50 border">
                  <p className="text-xs text-muted-foreground mb-1">Simulated Hash Output:</p>
                  <code className="text-sm text-foreground font-mono break-all">{simulatedHash}</code>
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Note: This is a simplified demonstration. In production, bcrypt or Argon2 would be used.
              </p>
            </div>
          )}
        </div>

        {/* Step by Step Process */}
        <div className="bg-card border rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-6">Hashing Process</h2>
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div key={step.number}>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">{step.number}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">{step.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{step.description}</p>
                    <div className="p-3 rounded-lg bg-muted/50 border">
                      <code className="text-xs text-foreground font-mono">{step.visual}</code>
                    </div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className="flex justify-start ml-5 my-3">
                    <ArrowDown className="h-4 w-4 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Important Notice */}
        <div className="p-4 rounded-lg bg-destructive/5 border border-destructive/20">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-foreground">No Raw Passwords Stored</h3>
              <p className="text-sm text-muted-foreground mt-1">
                The system never stores or logs plain-text passwords. Even database administrators cannot 
                see or recover user passwords. Password verification works by hashing the input and comparing 
                it with the stored hash.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default HashingPage;

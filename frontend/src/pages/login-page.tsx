import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Lock, ArrowRight, Eye, EyeOff, Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/theme-context';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';


import { useAuth } from '../contexts/auth-context';
import { toast } from 'sonner';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await login(email, password);
    setIsLoading(false);

    if (result.success && result.requiresMfa) {
      navigate('/mfa-verify', { state: { identifier: email } });
      toast.success("MFA Verification Required")
    } else if (!result.success) {
      toast.error(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary p-12 flex-col justify-between">
        <div className="flex items-center gap-2">
          <Shield className="h-8 w-8 text-primary-foreground" />
          <span className="text-xl font-semibold text-primary-foreground">SecureExamVault</span>
        </div>
        <div className="text-primary-foreground">
          <h1 className="text-4xl font-bold mb-4">Secure Authentication Portal</h1>
          <p className="text-primary-foreground/80 text-lg">
            Access your examination dashboard with enterprise-grade security and multi-factor authentication.
          </p>
        </div>
        <div className="flex items-center gap-4 text-primary-foreground/70 text-sm">
          <Lock className="h-4 w-4" />
          <span>256-bit SSL Encrypted Connection</span>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col">
        <div className="flex justify-between items-center p-6">
          <Link to="/" className="flex items-center gap-2 lg:hidden">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-semibold text-foreground">SecureExamVault</span>
          </Link>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md hover:bg-accent transition-colors ml-auto"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <Moon className="h-5 w-5 text-muted-foreground" />
            ) : (
              <Sun className="h-5 w-5 text-muted-foreground" />
            )}
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">Sign in to your account</h2>
              <p className="text-muted-foreground">Primary Authentication</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Username or Email</Label>
                <Input
                  id="email"
                  type="text"
                  placeholder="Enter your username or email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" variant="security" className="w-full" disabled={isLoading}>
                {isLoading ? 'Authenticating...' : 'Continue'}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>

            <div className="mt-6 p-4 rounded-lg bg-muted border">
              <p className="text-xs text-muted-foreground text-center">
                <Lock className="h-3 w-3 inline mr-1" />
                Single-factor authentication using username and password.
              </p>
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link to="/register" className="text-primary font-medium hover:underline">
                  Register here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

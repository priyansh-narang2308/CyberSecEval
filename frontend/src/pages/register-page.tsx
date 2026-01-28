import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Lock, Mail, IdCard, Check, Moon, Sun, ArrowRight, ArrowLeft } from 'lucide-react';
import { useTheme } from '../contexts/theme-context';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import type { UserRole } from '../contexts/auth-context';
import { useAuth } from '../contexts/auth-context';
import { toast } from 'sonner';

type Step = 1 | 2 | 3;

const RegisterPage = () => {
    const [step, setStep] = useState<Step>(1);
    const [isLoading, setIsLoading] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const { register } = useAuth();

    // Step 1: Identity
    const [fullName, setFullName] = useState('');
    const [universityId, setUniversityId] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState<UserRole>('student');

    // Step 2: Credentials
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Step 3: MFA
    const [mfaMethod, setMfaMethod] = useState<'email' | 'authenticator'>('email');

    const getPasswordStrength = (pass: string): { level: number; label: string } => {
        let score = 0;
        if (pass.length >= 8) score++;
        if (pass.length >= 12) score++;
        if (/[A-Z]/.test(pass)) score++;
        if (/[0-9]/.test(pass)) score++;
        if (/[^A-Za-z0-9]/.test(pass)) score++;

        if (score <= 2) return { level: 1, label: 'Weak' };
        if (score <= 3) return { level: 2, label: 'Fair' };
        if (score <= 4) return { level: 3, label: 'Good' };
        return { level: 4, label: 'Strong' };
    };

    const strength = getPasswordStrength(password);

    const handleComplete = async () => {
        setIsLoading(true);
        const result = await register({
            username,
            name: fullName,
            email,
            universityId,
            role,
            password
        });
        setIsLoading(false);

        if (result.success) {
            toast.success(result.message);
            navigate('/login');
        } else {
            toast.error(result.message);
        }
    };

    const renderStep1 = () => (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                    id="fullName"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="universityId">University ID</Label>
                <Input
                    id="universityId"
                    placeholder="e.g., CB.SC.U4CSE23***"
                    value={universityId}
                    onChange={(e) => setUniversityId(e.target.value)}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="your.email@university.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>

            <div className="space-y-2">
                <Label>Role</Label>
                <div className="grid grid-cols-3 gap-3">
                    {(['student', 'faculty', 'admin'] as UserRole[]).map((r) => (
                        <button
                            key={r}
                            type="button"
                            onClick={() => setRole(r)}
                            className={`p-3 rounded-lg border text-sm font-medium capitalize transition-colors ${role === r
                                ? 'bg-primary text-primary-foreground border-primary'
                                : 'bg-card text-foreground border-border hover:bg-accent'
                                }`}
                        >
                            {r}
                        </button>
                    ))}
                </div>
            </div>

            <Button
                variant="security"
                className="w-full"
                onClick={() => setStep(2)}
                disabled={!fullName || !universityId || !email}
            >
                Continue
                <ArrowRight className="h-4 w-4" />
            </Button>
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                    id="username"
                    placeholder="Choose a username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                    id="password"
                    type="password"
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {password && (
                    <div className="mt-2">
                        <div className="flex gap-1 mb-1">
                            {[1, 2, 3, 4].map((level) => (
                                <div
                                    key={level}
                                    className={`h-1.5 flex-1 rounded-full ${level <= strength.level
                                        ? strength.level <= 2
                                            ? 'bg-destructive'
                                            : strength.level === 3
                                                ? 'bg-warning'
                                                : 'bg-success'
                                        : 'bg-muted'
                                        }`}
                                />
                            ))}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Password strength: <span className="font-medium">{strength.label}</span>
                        </p>
                    </div>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {confirmPassword && password !== confirmPassword && (
                    <p className="text-xs text-destructive">Passwords do not match</p>
                )}
            </div>

            <div className="p-3 rounded-lg bg-muted border">
                <p className="text-xs text-muted-foreground">
                    <Lock className="h-3 w-3 inline mr-1" />
                    Passwords are hashed with salt before storage.
                </p>
            </div>

            <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(1)}>
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </Button>
                <Button
                    variant="security"
                    className="flex-1"
                    onClick={() => setStep(3)}
                    disabled={!username || !password || password !== confirmPassword}
                >
                    Continue
                    <ArrowRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 mb-4">
                    <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">Multi-Factor Authentication Setup</h3>
                <p className="text-sm text-muted-foreground">
                    This system uses Multi-Factor Authentication for enhanced security.
                </p>
            </div>

            <div className="space-y-3">
                <Label>Choose MFA Method</Label>
                <button
                    type="button"
                    onClick={() => setMfaMethod('email')}
                    className={`w-full p-4 rounded-lg border text-left transition-colors ${mfaMethod === 'email'
                        ? 'bg-primary/5 border-primary'
                        : 'bg-card border-border hover:bg-accent'
                        }`}
                >
                    <div className="flex items-start gap-3">
                        <Mail className={`h-5 w-5 mt-0.5 ${mfaMethod === 'email' ? 'text-primary' : 'text-muted-foreground'}`} />
                        <div>
                            <p className="font-medium text-foreground">Email OTP</p>
                            <p className="text-sm text-muted-foreground">Receive verification codes via email</p>
                        </div>
                    </div>
                </button>
                <button
                    type="button"
                    onClick={() => setMfaMethod('authenticator')}
                    className={`w-full p-4 rounded-lg border text-left transition-colors ${mfaMethod === 'authenticator'
                        ? 'bg-primary/5 border-primary'
                        : 'bg-card border-border hover:bg-accent'
                        }`}
                >
                    <div className="flex items-start gap-3">
                        <IdCard className={`h-5 w-5 mt-0.5 ${mfaMethod === 'authenticator' ? 'text-primary' : 'text-muted-foreground'}`} />
                        <div>
                            <p className="font-medium text-foreground">Authenticator App</p>
                            <p className="text-sm text-muted-foreground">Use Google Authenticator or similar apps</p>
                        </div>
                    </div>
                </button>
            </div>

            <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(2)}>
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </Button>
                <Button variant="security" className="flex-1" onClick={handleComplete} disabled={isLoading}>
                    {isLoading ? 'Registering...' : 'Complete Registration'}
                    <Check className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-background flex">
            {/* Left Panel */}
            <div className="hidden lg:flex lg:w-1/2 bg-primary p-12 flex-col justify-between">
                <div className="flex items-center gap-2">
                    <Shield className="h-8 w-8 text-primary-foreground" />
                    <span className="text-xl font-semibold text-primary-foreground">SecureExamVault</span>
                </div>
                <div className="text-primary-foreground">
                    <h1 className="text-4xl font-bold mb-4">Secure Registration</h1>
                    <p className="text-primary-foreground/80 text-lg">
                        Create your account with NIST-compliant security standards and multi-factor authentication.
                    </p>
                </div>
                <div className="flex items-center gap-4 text-primary-foreground/70 text-sm">
                    <Lock className="h-4 w-4" />
                    <span>Your data is protected with end-to-end encryption</span>
                </div>
            </div>

            {/* Right Panel */}
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
                            <h2 className="text-2xl font-bold text-foreground mb-2">Create your account</h2>
                            <p className="text-muted-foreground">
                                Step {step} of 3:{' '}
                                {step === 1 ? 'Identity Information' : step === 2 ? 'Credential Setup' : 'MFA Setup'}
                            </p>
                        </div>

                        {/* Progress Indicator */}
                        <div className="flex gap-2 mb-8">
                            {[1, 2, 3].map((s) => (
                                <div
                                    key={s}
                                    className={`h-1.5 flex-1 rounded-full transition-colors ${s <= step ? 'bg-primary' : 'bg-muted'
                                        }`}
                                />
                            ))}
                        </div>

                        {step === 1 && renderStep1()}
                        {step === 2 && renderStep2()}
                        {step === 3 && renderStep3()}

                        <div className="mt-8 text-center">
                            <p className="text-sm text-muted-foreground">
                                Already have an account?{' '}
                                <Link to="/login" className="text-primary font-medium hover:underline">
                                    Sign in here
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;

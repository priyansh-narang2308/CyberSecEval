import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, KeyRound, Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/theme-context';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../components/ui/input-otp';
import { Button } from '../components/ui/button';
import { useAuth } from '../contexts/auth-context';
import { useToast } from '../components/ui/use-toast';

const MFAVerifyPage = () => {
    const [otp, setOtp] = useState('');
    const [timeLeft, setTimeLeft] = useState(300);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { theme, toggleTheme } = useTheme();
    const { verifyMfa } = useAuth();
    const { toast } = useToast();

    const identifier = location.state?.identifier;

    useEffect(() => {
        if (!identifier) {
            navigate('/login');
        }
    }, [identifier, navigate]);

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [timeLeft]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleVerify = async () => {
        if (otp.length !== 6) return;
        setIsLoading(true);

        const result = await verifyMfa(identifier, otp);
        setIsLoading(false);

        if (result.success) {
            toast({
                title: 'Verification Successful',
                description: 'Welcome to SecureExamVault',
            });

            const role = result.user?.role || 'student';
            navigate(`/dashboard/${role}`);
        } else {
            toast({
                title: 'Verification Failed',
                description: result.message,
                variant: 'destructive',
            });
        }
    };

    const handleResend = () => {
        setTimeLeft(120);
        setOtp('');
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
            <div className="absolute top-6 right-6">
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-md hover:bg-accent transition-colors"
                    aria-label="Toggle theme"
                >
                    {theme === 'light' ? (
                        <Moon className="h-5 w-5 text-muted-foreground" />
                    ) : (
                        <Sun className="h-5 w-5 text-muted-foreground" />
                    )}
                </button>
            </div>

            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center p-4 rounded-full bg-primary/10 mb-6">
                        <KeyRound className="h-8 w-8 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold text-foreground mb-2">Multi-Factor Authentication</h1>
                    <p className="text-muted-foreground">Second authentication factor required</p>
                </div>

                <div className="bg-card border rounded-xl p-8">
                    <div className="text-center mb-6">
                        <p className="text-sm text-muted-foreground mb-4">
                            Enter the 6-digit verification code sent to your registered email or authenticator app.
                        </p>
                        <div className="flex justify-center mb-6">
                            <InputOTP
                                value={otp}
                                onChange={setOtp}
                                maxLength={6}
                            >
                                <InputOTPGroup>
                                    <InputOTPSlot index={0} />
                                    <InputOTPSlot index={1} />
                                    <InputOTPSlot index={2} />
                                    <InputOTPSlot index={3} />
                                    <InputOTPSlot index={4} />
                                    <InputOTPSlot index={5} />
                                </InputOTPGroup>
                            </InputOTP>
                        </div>

                        {/* Timer */}
                        <div className="flex items-center justify-center gap-2 mb-6">
                            <div className="text-sm text-muted-foreground">
                                Code expires in:{' '}
                                <span className={`font-mono font-medium ${timeLeft < 30 ? 'text-destructive' : 'text-foreground'}`}>
                                    {formatTime(timeLeft)}
                                </span>
                            </div>
                        </div>

                        <Button
                            variant="security"
                            className="w-full mb-4"
                            onClick={handleVerify}
                            disabled={otp.length !== 6 || isLoading}
                        >
                            {isLoading ? 'Verifying...' : 'Verify Code'}
                        </Button>

                        <button
                            onClick={handleResend}
                            disabled={timeLeft > 0}
                            className="text-sm text-primary hover:underline disabled:text-muted-foreground disabled:no-underline"
                        >
                            Resend OTP
                        </button>
                    </div>

                    <div className="pt-6 border-t">
                        <div className="flex items-start gap-3 text-xs text-muted-foreground">
                            <Lock className="h-4 w-4 flex-shrink-0 mt-0.5" />
                            <p>
                                This system uses Multi-Factor Authentication to provide an additional layer of security beyond your password.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => navigate('/login')}
                        className="text-sm text-muted-foreground hover:text-foreground"
                    >
                        ← Back to login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MFAVerifyPage;

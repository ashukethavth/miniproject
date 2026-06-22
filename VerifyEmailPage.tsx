import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  EnvelopeOpenIcon, 
  ArrowPathIcon, 
  ChevronLeftIcon,
  ExclamationCircleIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';
import { sendEmailVerification } from 'firebase/auth';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { Container } from '@/src/components/ui/Container';
import { Badge } from '@/src/components/ui/Badge';
import { cn } from '@/src/utils/cn';

export const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const { firebaseUser } = useAuth();
  const [status, setStatus] = useState<'pending' | 'success' | 'expired'>('pending');
  const [cooldown, setCooldown] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (firebaseUser?.emailVerified) {
      setStatus('success');
    }
  }, [firebaseUser]);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleResend = async () => {
    if (!firebaseUser) return;
    setIsLoading(true);
    setError(null);
    try {
      await sendEmailVerification(firebaseUser);
      setCooldown(60);
    } catch (err: any) {
      setError(err.message || 'Failed to resend verification email.');
    } finally {
      setIsLoading(false);
    }
  };

  const checkVerification = async () => {
    if (!firebaseUser) return;
    setIsLoading(true);
    try {
      await firebaseUser.reload();
      if (firebaseUser.emailVerified) {
        setStatus('success');
      } else {
        setError('Email not yet verified. Please check your inbox.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to check verification status.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 bg-slate-50 relative overflow-hidden">
      <Container className="max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-10 rounded-[2.5rem] shadow-xl border-slate-200/60 bg-white/80 backdrop-blur-xl text-center">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-medium"
                >
                  {error}
                </motion.div>
              )}

              {status === 'pending' && (
                <motion.div key="pending">
                  <div className="w-20 h-20 bg-primary-100 rounded-3xl flex items-center justify-center mx-auto mb-8 relative">
                    <EnvelopeOpenIcon className="h-10 w-10 text-primary-600" />
                    <div className="absolute -top-2 -right-2">
                      <Badge variant="primary" className="animate-pulse">Pending</Badge>
                    </div>
                  </div>
                  <h1 className="text-3xl font-bold text-slate-900 mb-4">Verify Your Email</h1>
                  <p className="text-slate-600 mb-8 leading-relaxed">
                    We've sent a secure link to <span className="font-bold text-slate-900">{firebaseUser?.email}</span>. 
                    Click the link to verify your identity and activate your account.
                  </p>

                  <div className="space-y-4">
                    <Button 
                      onClick={checkVerification}
                      className="w-full py-4 rounded-xl font-bold shadow-lg shadow-primary-500/20"
                      isLoading={isLoading}
                    >
                      I've Verified My Email
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={handleResend} 
                      disabled={cooldown > 0 || isLoading}
                      className="w-full py-4 rounded-xl font-bold"
                    >
                      {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend Verification Email'}
                      <ArrowPathIcon className={cn('ml-2 h-5 w-5', cooldown > 0 && 'animate-spin')} />
                    </Button>
                  </div>
                </motion.div>
              )}

              {status === 'success' && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="w-20 h-20 bg-emerald-100 rounded-3xl flex items-center justify-center mx-auto mb-8">
                    <CheckBadgeIcon className="h-12 w-12 text-emerald-600" />
                  </div>
                  <h1 className="text-3xl font-bold text-slate-900 mb-4">Email Verified!</h1>
                  <p className="text-slate-600 mb-8 leading-relaxed">
                    Your identity has been successfully verified. You can now proceed to set up your security preferences.
                  </p>
                  <Button onClick={() => navigate('/setup-mfa')} className="w-full py-4 rounded-xl font-bold shadow-lg shadow-primary-500/20">
                    Setup Multi-Factor Auth
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-10 pt-8 border-t border-slate-100">
              <p className="text-sm text-slate-500">
                Need help? <Link to="/support" className="text-primary-600 font-bold">Contact Security Team</Link>
              </p>
            </div>
          </Card>

          <Link to="/login" className="flex items-center justify-center gap-2 mt-8 text-slate-500 hover:text-slate-900 transition-colors font-bold">
            <ChevronLeftIcon className="h-5 w-5" />
            Back to Login
          </Link>
        </motion.div>
      </Container>
    </div>
  );
};

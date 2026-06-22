import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ShieldCheckIcon, 
  BellIcon, 
  KeyIcon, 
  UserGroupIcon,
  GlobeAltIcon,
  EyeIcon,
  EyeSlashIcon,
  DevicePhoneMobileIcon,
  FingerPrintIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { Container } from '@/src/components/ui/Container';
import { Badge } from '@/src/components/ui/Badge';
import { cn } from '@/src/utils/cn';

export const SettingsPage = () => {
  const navigate = useNavigate();
  const { firebaseUser, user } = useAuth();
  const [activeTab, setActiveTab] = useState('security');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const tabs = [
    { id: 'security', label: 'Security', icon: ShieldCheckIcon },
    { id: 'notifications', label: 'Notifications', icon: BellIcon },
    { id: 'access', label: 'Access Control', icon: UserGroupIcon },
    { id: 'privacy', label: 'Privacy', icon: EyeIcon },
  ];

  const handlePasswordReset = async () => {
    if (!firebaseUser?.email) return;
    setIsLoading(true);
    setMessage(null);
    try {
      await sendPasswordResetEmail(auth, firebaseUser.email);
      setMessage({ type: 'success', text: 'Password reset email sent! Please check your inbox.' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to send reset email.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 bg-slate-50">
      <Container>
        {message && (
          <div className={cn(
            "mb-6 p-4 rounded-2xl text-sm font-medium border",
            message.type === 'success' ? "bg-emerald-50 border-emerald-100 text-emerald-600" : "bg-red-50 border-red-100 text-red-600"
          )}>
            {message.text}
          </div>
        )}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Settings Navigation */}
          <div className="w-full md:w-72 space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all duration-300',
                  activeTab === tab.id 
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20' 
                    : 'text-slate-500 hover:bg-white hover:text-slate-900'
                )}
              >
                <tab.icon className="h-5 w-5" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Settings Content */}
          <div className="flex-1">
            {activeTab === 'security' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                <Card className="p-8 rounded-[2.5rem] shadow-xl border-slate-200/60 bg-white">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Multi-Factor Authentication</h2>
                      <p className="text-slate-500 text-sm mt-1">Manage your secondary authentication methods</p>
                    </div>
                    <Badge 
                      variant={user?.mfaEnabled ? 'primary' : 'outline'} 
                      className={cn(user?.mfaEnabled ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "text-slate-400")}
                    >
                      {user?.mfaEnabled ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-6 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                          <DevicePhoneMobileIcon className={cn("h-6 w-6", user?.mfaType === 'sms' ? "text-primary-600" : "text-slate-400")} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">SMS Authentication</p>
                          <p className="text-xs text-slate-500">
                            {user?.mfaType === 'sms' ? `Linked to ${user.phoneNumber}` : 'Not configured'}
                          </p>
                        </div>
                      </div>
                      <Button 
                        variant={user?.mfaType === 'sms' ? 'outline' : 'primary'} 
                        size="sm" 
                        className="rounded-lg font-bold"
                        onClick={() => navigate('/setup-mfa')}
                      >
                        {user?.mfaType === 'sms' ? 'Configure' : 'Enable'}
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-6 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                          <FingerPrintIcon className="h-6 w-6 text-slate-400" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">Authenticator App</p>
                          <p className="text-xs text-slate-500">TOTP not configured</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="rounded-lg font-bold" disabled>Coming Soon</Button>
                    </div>
                  </div>
                </Card>

                <Card className="p-8 rounded-[2.5rem] shadow-xl border-slate-200/60 bg-white">
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-8">Password Management</h2>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between py-4 border-b border-slate-50 last:border-0">
                      <div>
                        <p className="font-bold text-slate-900">Change Password</p>
                        <p className="text-xs text-slate-500">Send a secure link to reset your password</p>
                      </div>
                      <Button 
                        variant="outline" 
                        className="rounded-xl font-bold"
                        onClick={handlePasswordReset}
                        isLoading={isLoading}
                      >
                        Send Reset Email
                      </Button>
                    </div>
                    <div className="flex items-center justify-between py-4 border-b border-slate-50 last:border-0">
                      <div>
                        <p className="font-bold text-slate-900">Session Management</p>
                        <p className="text-xs text-slate-500">Manage active sessions across devices</p>
                      </div>
                      <Button variant="outline" className="rounded-xl font-bold" onClick={() => navigate('/security')}>Manage Sessions</Button>
                    </div>
                  </div>
                </Card>

                <Card className="p-8 rounded-[2.5rem] bg-rose-50 border-rose-100">
                  <h3 className="text-lg font-bold text-rose-900 mb-2">Danger Zone</h3>
                  <p className="text-sm text-rose-700 mb-6">Once you delete your account, there is no going back. Please be certain.</p>
                  <Button className="bg-rose-600 hover:bg-rose-700 text-white border-none rounded-xl font-bold">Delete Account</Button>
                </Card>
              </motion.div>
            )}

            {activeTab === 'notifications' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card className="p-8 rounded-[2.5rem] shadow-xl border-slate-200/60 bg-white">
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-8">Notification Preferences</h2>
                  <div className="space-y-6">
                    {[
                      { title: 'Security Alerts', desc: 'Get notified about new logins and security changes', default: true },
                      { title: 'System Updates', desc: 'Maintenance and feature updates', default: true },
                      { title: 'Marketing', desc: 'News and promotional offers', default: false },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between py-4 border-b border-slate-50 last:border-0">
                        <div>
                          <p className="font-bold text-slate-900">{item.title}</p>
                          <p className="text-xs text-slate-500">{item.desc}</p>
                        </div>
                        <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-200 cursor-pointer">
                          <span className={cn(
                            "inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out",
                            item.default ? "translate-x-6 bg-primary-600" : "translate-x-1"
                          )} />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

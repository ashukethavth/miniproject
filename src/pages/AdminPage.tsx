import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  UsersIcon, 
  Cog6ToothIcon, 
  ShieldCheckIcon, 
  ChartBarIcon,
  ServerIcon,
  KeyIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EllipsisHorizontalIcon,
  UserPlusIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  CloudArrowUpIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { Container } from '@/src/components/ui/Container';
import { Badge } from '@/src/components/ui/Badge';
import { UserAccount, SystemStats } from '@/src/types/admin';
import { cn } from '@/src/utils/cn';

const mockUsers: UserAccount[] = [
  { id: '1', uid: '1', displayName: 'Ashwitha Kethavath', name: 'Ashwitha Kethavath', email: 'ashwitha@cloudlock.com', role: 'admin', status: 'active', storageUsed: 1024 * 1024 * 1500, storageLimit: 1024 * 1024 * 2000, lastLogin: '2 hours ago', mfaEnabled: true, mfaType: 'sms', createdAt: new Date().toISOString() },
  { id: '2', uid: '2', displayName: 'John Doe', name: 'John Doe', email: 'john.doe@company.com', role: 'editor', status: 'active', storageUsed: 1024 * 1024 * 450, storageLimit: 1024 * 1024 * 1000, lastLogin: '5 hours ago', mfaEnabled: true, mfaType: 'sms', createdAt: new Date().toISOString() },
  { id: '3', uid: '3', displayName: 'Sarah Miller', name: 'Sarah Miller', email: 'sarah.m@company.com', role: 'viewer', status: 'suspended', storageUsed: 1024 * 1024 * 120, storageLimit: 1024 * 1024 * 1000, lastLogin: '3 days ago', mfaEnabled: false, mfaType: 'none', createdAt: new Date().toISOString() },
  { id: '4', uid: '4', displayName: 'Michael Chen', name: 'Michael Chen', email: 'm.chen@company.com', role: 'editor', status: 'pending', storageUsed: 0, storageLimit: 1024 * 1024 * 1000, lastLogin: 'Never', mfaEnabled: false, mfaType: 'none', createdAt: new Date().toISOString() },
];

const systemStats: SystemStats = {
  totalUsers: 128,
  activeUsers: 94,
  totalStorage: 1024 * 1024 * 1024 * 500, // 500 GB
  usedStorage: 1024 * 1024 * 1024 * 320, // 320 GB
  totalFiles: 12450,
  securityIncidents: 0,
};

export const AdminPage = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'system' | 'security'>('users');

  const formatSize = (bytes: number) => {
    const gb = bytes / (1024 * 1024 * 1024);
    if (gb >= 1) return gb.toFixed(1) + ' GB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="min-h-screen pt-24 pb-20 bg-slate-50">
      <Container>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Admin Control Panel</h1>
            <p className="text-slate-500 mt-1">Global system configuration and user management.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="rounded-xl font-bold">
              <ServerIcon className="h-5 w-5 mr-2" />
              System Status
            </Button>
            <Button className="rounded-xl font-bold shadow-lg shadow-primary-500/20">
              <UserPlusIcon className="h-5 w-5 mr-2" />
              Add New User
            </Button>
          </div>
        </div>

        {/* System Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { label: 'Total Users', value: systemStats.totalUsers, icon: UsersIcon, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Storage Usage', value: '64%', icon: CloudArrowUpIcon, color: 'text-indigo-600', bg: 'bg-indigo-50' },
            { label: 'Total Files', value: '12.4k', icon: ChartBarIcon, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'System Health', value: 'Optimal', icon: ShieldCheckIcon, color: 'text-primary-600', bg: 'bg-primary-50' },
          ].map((stat) => (
            <Card key={stat.label} className="p-6 rounded-2xl border-slate-200/60 bg-white">
              <div className="flex items-center gap-4">
                <div className={cn('p-3 rounded-xl', stat.bg, stat.color)}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                  <p className="text-xl font-black text-slate-900">{stat.value}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-8 border-b border-slate-200 mb-8">
          {[
            { id: 'users', label: 'User Management', icon: UsersIcon },
            { id: 'system', label: 'System Settings', icon: Cog6ToothIcon },
            { id: 'security', label: 'Security Policy', icon: ShieldCheckIcon },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                'pb-4 text-sm font-bold uppercase tracking-widest transition-all relative flex items-center gap-2',
                activeTab === tab.id ? 'text-primary-600' : 'text-slate-400 hover:text-slate-600'
              )}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
              {activeTab === tab.id && (
                <motion.div layoutId="adminTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600" />
              )}
            </button>
          ))}
        </div>

        {activeTab === 'users' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search users by name or email..." 
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500/20"
                />
              </div>
              <Button variant="outline" className="rounded-xl font-bold">
                <FunnelIcon className="h-5 w-5 mr-2" />
                Filter
              </Button>
            </div>

            <Card className="rounded-2xl border-slate-200/60 bg-white overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">User</th>
                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Role</th>
                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Storage</th>
                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Last Login</th>
                    <th className="p-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {mockUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900">{user.name}</p>
                            <p className="text-[10px] text-slate-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant="outline" className="text-[10px] uppercase tracking-widest font-bold">
                          {user.role}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge 
                          variant={user.status === 'active' ? 'success' : user.status === 'suspended' ? 'danger' : 'warning'}
                          className="text-[10px] capitalize"
                        >
                          {user.status}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="w-24 space-y-1">
                          <div className="flex justify-between text-[9px] font-bold text-slate-400">
                            <span>{formatSize(user.storageUsed)}</span>
                            <span>{Math.round((user.storageUsed / user.storageLimit) * 100)}%</span>
                          </div>
                          <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className={cn('h-full', (user.storageUsed / user.storageLimit) > 0.8 ? 'bg-rose-500' : 'bg-primary-500')} 
                              style={{ width: `${(user.storageUsed / user.storageLimit) * 100}%` }} 
                            />
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-xs font-medium text-slate-600">{user.lastLogin}</td>
                      <td className="p-4 text-right">
                        <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                          <EllipsisHorizontalIcon className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </motion.div>
        )}

        {activeTab === 'system' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid md:grid-cols-2 gap-8">
            <Card className="p-8 rounded-[2.5rem] border-slate-200/60 bg-white">
              <h3 className="text-xl font-bold text-slate-900 mb-6">General Settings</h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Platform Name</label>
                  <input type="text" defaultValue="CloudLock Enterprise" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-primary-500/20" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Default User Storage (GB)</label>
                  <input type="number" defaultValue="2" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-primary-500/20" />
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div>
                    <p className="text-sm font-bold text-slate-900">Maintenance Mode</p>
                    <p className="text-[10px] text-slate-500">Disable all user access for system updates</p>
                  </div>
                  <div className="w-12 h-6 bg-slate-200 rounded-full relative cursor-pointer">
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-8 rounded-[2.5rem] border-slate-200/60 bg-white">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Backup & Recovery</h3>
              <div className="space-y-6">
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex gap-4">
                  <div className="p-2 bg-white rounded-lg">
                    <ShieldCheckIcon className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-emerald-900">Automated Backups Active</p>
                    <p className="text-xs text-emerald-700">Last backup: 4 hours ago (Success)</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <Button variant="outline" className="w-full rounded-xl font-bold">
                    <ArrowPathIcon className="h-5 w-5 mr-2" />
                    Run Manual Backup
                  </Button>
                  <Button variant="outline" className="w-full rounded-xl font-bold text-rose-600 border-rose-100 hover:bg-rose-50">
                    <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
                    System Restore
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {activeTab === 'security' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <Card className="p-8 rounded-[2.5rem] border-slate-200/60 bg-white">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Global Security Policy</h3>
              <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-slate-900">Enforce MFA</p>
                      <p className="text-xs text-slate-500">Require MFA for all administrative accounts</p>
                    </div>
                    <div className="w-12 h-6 bg-primary-600 rounded-full relative cursor-pointer">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-slate-900">Session Timeout</p>
                      <p className="text-xs text-slate-500">Auto-logout after period of inactivity</p>
                    </div>
                    <select className="bg-slate-50 border border-slate-200 rounded-lg p-1 text-xs font-bold">
                      <option>1 Hour</option>
                      <option>4 Hours</option>
                      <option>24 Hours</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-slate-900">IP Whitelisting</p>
                      <p className="text-xs text-slate-500">Restrict admin access to specific IP ranges</p>
                    </div>
                    <Badge variant="outline">Disabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-slate-900">Password Complexity</p>
                      <p className="text-xs text-slate-500">Require special chars and min length</p>
                    </div>
                    <Badge variant="success">Active</Badge>
                  </div>
                </div>
              </div>
            </Card>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6 rounded-2xl bg-slate-900 text-white">
                <KeyIcon className="h-8 w-8 text-primary-400 mb-4" />
                <h4 className="font-bold mb-2">Encryption Keys</h4>
                <p className="text-xs text-slate-400 mb-4">Manage global master keys and rotation policies.</p>
                <Button variant="outline" size="sm" className="w-full text-white border-white/20 hover:bg-white/10">Manage Keys</Button>
              </Card>
              <Card className="p-6 rounded-2xl bg-slate-900 text-white">
                <ShieldCheckIcon className="h-8 w-8 text-emerald-400 mb-4" />
                <h4 className="font-bold mb-2">Compliance Audit</h4>
                <p className="text-xs text-slate-400 mb-4">Run automated compliance checks for HIPAA/GDPR.</p>
                <Button variant="outline" size="sm" className="w-full text-white border-white/20 hover:bg-white/10">Run Audit</Button>
              </Card>
              <Card className="p-6 rounded-2xl bg-slate-900 text-white">
                <ArrowTrendingUpIcon className="h-8 w-8 text-blue-400 mb-4" />
                <h4 className="font-bold mb-2">Threat Intel</h4>
                <p className="text-xs text-slate-400 mb-4">Real-time monitoring of global security threats.</p>
                <Button variant="outline" size="sm" className="w-full text-white border-white/20 hover:bg-white/10">View Intel</Button>
              </Card>
            </div>
          </motion.div>
        )}
      </Container>
    </div>
  );
};

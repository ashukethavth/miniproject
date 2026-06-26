import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  UserGroupIcon, 
  LinkIcon, 
  ClockIcon, 
  EllipsisVerticalIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowTopRightOnSquareIcon,
  XMarkIcon,
  CheckCircleIcon,
  CalendarIcon,
  ShieldCheckIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { Container } from '@/src/components/ui/Container';
import { Badge } from '@/src/components/ui/Badge';
import { Share } from '@/src/types/admin';
import { cn } from '@/src/utils/cn';

const mockShares: Share[] = [
  { id: '1', fileName: 'Q1_Financial_Report.pdf', fileId: 'f1', type: 'user', status: 'active', permissions: ['view', 'download'], expiresAt: '2024-04-12', accessCount: 12, lastAccessed: '2 hours ago', sharedWith: 'john.doe@company.com', createdAt: '2024-03-12' },
  { id: '2', fileName: 'Marketing_Assets', fileId: 'f2', type: 'group', status: 'active', permissions: ['view', 'edit'], expiresAt: null, accessCount: 45, lastAccessed: '1 hour ago', sharedWith: 'Marketing Team', createdAt: '2024-03-10' },
  { id: '3', fileName: 'Product_Specs.docx', fileId: 'f3', type: 'link', status: 'expired', permissions: ['view'], expiresAt: '2024-03-11', accessCount: 8, lastAccessed: '1 day ago', sharedWith: 'Anyone with link', createdAt: '2024-03-05' },
];

export const SharingPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <div className="min-h-screen pt-24 pb-20 bg-slate-50">
      <Container>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Sharing Management</h1>
            <p className="text-slate-500 mt-1">Manage external access and shared resources securely.</p>
          </div>
          <Button 
            onClick={() => setShowCreateModal(true)}
            className="rounded-xl font-bold shadow-lg shadow-primary-500/20"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Create New Share
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          {[
            { label: 'Active Shares', value: '24', icon: UserGroupIcon, color: 'text-primary-600' },
            { label: 'Total Accesses', value: '1.2k', icon: ChartBarIcon, color: 'text-emerald-600' },
            { label: 'Expiring Soon', value: '5', icon: ClockIcon, color: 'text-amber-600' },
          ].map((stat) => (
            <Card key={stat.label} className="p-6 rounded-2xl border-slate-200/60 bg-white">
              <div className="flex items-center gap-4">
                <div className={cn('p-3 rounded-xl bg-slate-50', stat.color)}>
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

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search shares by file or recipient..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="rounded-xl font-bold">
              <FunnelIcon className="h-5 w-5 mr-2" />
              Filter
            </Button>
            <Button variant="outline" className="rounded-xl font-bold">
              <CalendarIcon className="h-5 w-5 mr-2" />
              Date Range
            </Button>
          </div>
        </div>

        {/* Shares List */}
        <div className="space-y-4">
          {mockShares.map((share) => (
            <Card key={share.id} className="p-6 rounded-2xl border-slate-200/60 bg-white hover:shadow-md transition-shadow group">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className={cn(
                    'w-12 h-12 rounded-xl flex items-center justify-center shrink-0',
                    share.type === 'link' ? 'bg-blue-50 text-blue-600' : 'bg-indigo-50 text-indigo-600'
                  )}>
                    {share.type === 'link' ? <LinkIcon className="h-6 w-6" /> : <UserGroupIcon className="h-6 w-6" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-slate-900 truncate">{share.fileName}</h3>
                      <Badge variant={share.status === 'active' ? 'success' : 'outline'} className="text-[10px]">
                        {share.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500 flex items-center gap-2">
                      Shared with <span className="font-bold text-slate-700">{share.sharedWith}</span>
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 lg:gap-12">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Permissions</p>
                    <div className="flex gap-1">
                      {share.permissions.map(p => (
                        <Badge key={p} variant="outline" className="text-[9px] px-1.5">{p}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Access</p>
                    <p className="text-sm font-bold text-slate-900">{share.accessCount} views</p>
                    <p className="text-[10px] text-slate-400">Last: {share.lastAccessed}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Expires</p>
                    <p className="text-sm font-bold text-slate-900">{share.expiresAt || 'Never'}</p>
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="outline" size="sm" className="rounded-lg font-bold">Manage</Button>
                    <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                      <EllipsisVerticalIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Container>

      {/* Create Share Modal Placeholder */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCreateModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Create Secure Share</h2>
                <button onClick={() => setShowCreateModal(false)} className="p-2 text-slate-400 hover:text-slate-600">
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              <div className="p-8 space-y-8">
                <div className="space-y-4">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Select Resource</label>
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-slate-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg border border-slate-200">
                        <PlusIcon className="h-5 w-5 text-primary-600" />
                      </div>
                      <span className="text-sm font-bold text-slate-700">Choose file or folder...</span>
                    </div>
                    <ArrowTopRightOnSquareIcon className="h-5 w-5 text-slate-400" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Share Type</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button className="p-3 rounded-xl border-2 border-primary-600 bg-primary-50 text-primary-700 font-bold text-xs">Secure Link</button>
                      <button className="p-3 rounded-xl border-2 border-slate-100 bg-slate-50 text-slate-600 font-bold text-xs">Direct Invite</button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Expiration</label>
                    <select className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-medium outline-none">
                      <option>7 Days</option>
                      <option>30 Days</option>
                      <option>Never</option>
                      <option>Custom Date...</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Permissions Matrix</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {['View', 'Download', 'Edit', 'Comment'].map(perm => (
                      <label key={perm} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:bg-white transition-all group">
                        <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
                        <span className="text-xs font-bold text-slate-600 group-hover:text-slate-900">{perm}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="bg-primary-50 p-4 rounded-2xl border border-primary-100 flex gap-3">
                  <ShieldCheckIcon className="h-5 w-5 text-primary-600 shrink-0" />
                  <p className="text-xs text-primary-800 leading-relaxed">
                    Secure links are protected with zero-knowledge encryption. Recipients will need to verify their identity before accessing.
                  </p>
                </div>
              </div>
              <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end gap-4">
                <Button variant="ghost" onClick={() => setShowCreateModal(false)} className="font-bold">Cancel</Button>
                <Button className="rounded-xl font-bold px-8 shadow-lg shadow-primary-500/20">Generate Share Link</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

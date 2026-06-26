import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ClockIcon, 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  ArrowDownTrayIcon,
  DocumentTextIcon,
  UserIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { Container } from '@/src/components/ui/Container';
import { Badge } from '@/src/components/ui/Badge';
import { AuditLog } from '@/src/types/admin';
import { cn } from '@/src/utils/cn';

const mockLogs: AuditLog[] = [
  { id: '1', userId: 'u1', userName: 'Ashwitha Kethavath', userEmail: 'ashwitha@cloudlock.com', action: 'File Uploaded', resourceType: 'file', resourceId: 'f1', resourceName: 'Q1_Financial_Report.pdf', severity: 'low', timestamp: '2024-03-12 14:30:45', ipAddress: '192.168.1.1', location: 'San Francisco, US', details: 'Uploaded to Root/Finance' },
  { id: '2', userId: 'u2', userName: 'John Doe', userEmail: 'john.doe@company.com', action: 'File Downloaded', resourceType: 'file', resourceId: 'f1', resourceName: 'Q1_Financial_Report.pdf', severity: 'low', timestamp: '2024-03-12 16:00:12', ipAddress: '172.16.0.45', location: 'New York, US', details: 'Downloaded decrypted version' },
  { id: '3', userId: 'system', userName: 'System', userEmail: 'security@cloudlock.com', action: 'Blocked Login', resourceType: 'user', resourceId: 'u1', resourceName: 'Ashwitha Kethavath', severity: 'high', timestamp: '2024-03-12 10:15:33', ipAddress: '95.161.224.1', location: 'Moscow, RU', details: 'Multiple failed attempts detected' },
  { id: '4', userId: 'u1', userName: 'Ashwitha Kethavath', userEmail: 'ashwitha@cloudlock.com', action: 'Permission Changed', resourceType: 'share', resourceId: 's1', resourceName: 'Marketing Folder', severity: 'medium', timestamp: '2024-03-11 18:45:00', ipAddress: '192.168.1.1', location: 'San Francisco, US', details: 'Added John Doe as Editor' },
  { id: '5', userId: 'u3', userName: 'Sarah Miller', userEmail: 'sarah.m@company.com', action: 'Account Suspended', resourceType: 'user', resourceId: 'u3', resourceName: 'Sarah Miller', severity: 'critical', timestamp: '2024-03-11 09:20:15', ipAddress: '10.0.0.12', location: 'London, UK', details: 'Suspended by Admin for policy violation' },
];

export const AuditLogsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string | null>(null);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-100';
      case 'medium': return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-100';
      case 'critical': return 'text-rose-600 bg-rose-50 border-rose-100';
      default: return 'text-slate-600 bg-slate-50 border-slate-100';
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 bg-slate-50">
      <Container>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Audit Logs</h1>
            <p className="text-slate-500 mt-1">Complete immutable record of all system activities and security events.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="rounded-xl font-bold">
              <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
              Export Logs
            </Button>
            <Button className="rounded-xl font-bold shadow-lg shadow-primary-500/20">
              <DocumentTextIcon className="h-5 w-5 mr-2" />
              Compliance Report
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="p-6 rounded-[2rem] border-slate-200/60 bg-white shadow-sm mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search by user, action, or resource..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="relative">
                <select 
                  className="appearance-none pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 outline-none focus:ring-2 focus:ring-primary-500/20"
                  onChange={(e) => setSelectedSeverity(e.target.value || null)}
                >
                  <option value="">All Severities</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
                <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>
              <Button variant="outline" className="rounded-xl font-bold">
                <FunnelIcon className="h-5 w-5 mr-2" />
                More Filters
              </Button>
              <Button variant="ghost" className="text-slate-400 font-bold text-sm">Clear</Button>
            </div>
          </div>
        </Card>

        {/* Logs Timeline */}
        <div className="space-y-4">
          {mockLogs.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="p-0 rounded-2xl border-slate-200/60 bg-white overflow-hidden hover:shadow-md transition-shadow group">
                <div className="flex flex-col md:flex-row">
                  <div className={cn('w-2 md:w-3 flex-shrink-0', 
                    log.severity === 'low' ? 'bg-blue-500' : 
                    log.severity === 'medium' ? 'bg-amber-500' : 
                    log.severity === 'high' ? 'bg-orange-500' : 'bg-rose-500'
                  )} />
                  <div className="flex-1 p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center flex-shrink-0">
                          <UserIcon className="h-5 w-5 text-slate-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-bold text-slate-900">{log.action}</h3>
                            <Badge className={cn('text-[9px] px-1.5 uppercase tracking-widest border', getSeverityColor(log.severity))}>
                              {log.severity}
                            </Badge>
                          </div>
                          <p className="text-xs text-slate-500">
                            By <span className="font-bold text-slate-700">{log.userName}</span> 
                            {' • '} 
                            Target: <span className="font-bold text-slate-700">{log.resourceName}</span>
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 lg:gap-12">
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Timestamp</p>
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                            <ClockIcon className="h-3.5 w-3.5 text-slate-400" />
                            {log.timestamp}
                          </div>
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Origin</p>
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                            <GlobeAltIcon className="h-3.5 w-3.5 text-slate-400" />
                            {log.location}
                          </div>
                          <p className="text-[10px] text-slate-400 mt-0.5">{log.ipAddress}</p>
                        </div>
                        <div className="flex items-center justify-end">
                          <Button variant="outline" size="sm" className="rounded-lg font-bold group-hover:bg-primary-50 group-hover:text-primary-600 group-hover:border-primary-100 transition-all">
                            <InformationCircleIcon className="h-4 w-4 mr-2" />
                            Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Load More */}
        <div className="mt-12 text-center">
          <Button variant="ghost" className="text-slate-400 font-bold hover:text-primary-600">
            Load older activities
            <ChevronDownIcon className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </Container>
    </div>
  );
};

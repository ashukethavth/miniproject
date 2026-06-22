import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ShieldCheckIcon, 
  ArrowDownTrayIcon, 
  ShareIcon, 
  TrashIcon,
  PencilIcon,
  ClockIcon,
  UserGroupIcon,
  ChevronLeftIcon,
  EllipsisHorizontalIcon,
  LockClosedIcon,
  EyeIcon,
  DocumentDuplicateIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { Container } from '@/src/components/ui/Container';
import { Badge } from '@/src/components/ui/Badge';
import { FileIcon } from '@/src/components/files/FileIcon';
import { FileMetadata, FileActivity, FileVersion } from '@/src/types/files';
import { cn } from '@/src/utils/cn';

// Mock Data for a single file
const mockFile: FileMetadata = {
  id: '1',
  name: 'Q1_Financial_Report.pdf',
  type: 'pdf',
  size: 1024 * 1024 * 2.4,
  createdAt: '2024-03-12 14:30',
  updatedAt: '2024-03-12 16:45',
  owner: 'Ashwitha Kethavath',
  encryptionStatus: 'encrypted',
  encryptionLevel: 'AES-256',
  mimeType: 'application/pdf',
  hash: 'sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
  tags: ['finance', 'q1', 'board-meeting'],
  isFavorite: true,
  parentId: 'f1'
};

const mockActivity: FileActivity[] = [
  { id: 'a1', fileId: '1', userId: 'u1', userName: 'Ashwitha Kethavath', action: 'upload', timestamp: '2024-03-12 14:30', details: 'Initial upload' },
  { id: 'a2', fileId: '1', userId: 'u1', userName: 'Ashwitha Kethavath', action: 'view', timestamp: '2024-03-12 15:00' },
  { id: 'a3', fileId: '1', userId: 'u2', userName: 'John Doe', action: 'download', timestamp: '2024-03-12 16:00', details: 'Downloaded decrypted version' },
  { id: 'a4', fileId: '1', userId: 'u1', userName: 'Ashwitha Kethavath', action: 'share', timestamp: '2024-03-12 16:45', details: 'Shared with Finance Team' },
];

const mockVersions: FileVersion[] = [
  { id: 'v2', fileId: '1', version: 2, size: 1024 * 1024 * 2.4, createdAt: '2024-03-12 16:45', hash: 'sha256:7f83...', createdBy: 'Ashwitha Kethavath' },
  { id: 'v1', fileId: '1', version: 1, size: 1024 * 1024 * 2.1, createdAt: '2024-03-12 14:30', hash: 'sha256:9a2c...', createdBy: 'Ashwitha Kethavath' },
];

export const FileDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'access'>('overview');

  const formatSize = (bytes: number) => {
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen pt-24 pb-20 bg-slate-50">
      <Container>
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-primary-600 transition-colors"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            <div>
              <div className="flex items-center gap-2 text-sm font-bold text-slate-400 mb-1">
                <Link to="/files" className="hover:text-primary-600">My Files</Link>
                <span>/</span>
                <span>Project Alpha</span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                {mockFile.name}
                {mockFile.isFavorite && <Badge variant="primary">Favorite</Badge>}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="rounded-xl font-bold">
              <PencilIcon className="h-4 w-4 mr-2" />
              Rename
            </Button>
            <Button className="rounded-xl font-bold shadow-lg shadow-primary-500/20">
              <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button variant="ghost" className="p-2 rounded-xl text-slate-400 hover:text-slate-600">
              <EllipsisHorizontalIcon className="h-6 w-6" />
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Preview Section */}
            <Card className="p-0 rounded-[2.5rem] shadow-xl border-slate-200/60 bg-slate-900 overflow-hidden aspect-video flex items-center justify-center relative group">
              <div className="text-center space-y-4">
                <FileIcon type={mockFile.type} className="w-24 h-24 mx-auto opacity-50" />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Preview not available for encrypted files</p>
                <Button variant="outline" className="text-white border-white/20 hover:bg-white/10 rounded-xl font-bold">
                  <EyeIcon className="h-5 w-5 mr-2" />
                  Request Decrypted Preview
                </Button>
              </div>
              <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center">
                <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                  <LockClosedIcon className="h-4 w-4 text-primary-400" />
                  <span className="text-[10px] font-bold text-white uppercase tracking-widest">End-to-End Encrypted</span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 bg-black/40 backdrop-blur-md rounded-lg text-white hover:bg-white/10 transition-colors"><DocumentDuplicateIcon className="h-5 w-5" /></button>
                </div>
              </div>
            </Card>

            {/* Tabs */}
            <div className="flex gap-8 border-b border-slate-200">
              {['Overview', 'History', 'Access'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab.toLowerCase() as any)}
                  className={cn(
                    'pb-4 text-sm font-bold uppercase tracking-widest transition-all relative',
                    activeTab === tab.toLowerCase() ? 'text-primary-600' : 'text-slate-400 hover:text-slate-600'
                  )}
                >
                  {tab}
                  {activeTab === tab.toLowerCase() && (
                    <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600" />
                  )}
                </button>
              ))}
            </div>

            <div className="min-h-[400px]">
              {activeTab === 'overview' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <h3 className="text-lg font-bold text-slate-900">File Metadata</h3>
                      <div className="space-y-4">
                        {[
                          { label: 'File Size', value: formatSize(mockFile.size) },
                          { label: 'MIME Type', value: mockFile.mimeType },
                          { label: 'Owner', value: mockFile.owner },
                          { label: 'Created At', value: mockFile.createdAt },
                          { label: 'Last Modified', value: mockFile.updatedAt },
                        ].map((item) => (
                          <div key={item.label} className="flex justify-between items-center py-2 border-b border-slate-100">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{item.label}</span>
                            <span className="text-sm font-bold text-slate-900">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-6">
                      <h3 className="text-lg font-bold text-slate-900">Security Details</h3>
                      <div className="space-y-4">
                        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                          <div className="flex items-center gap-2 mb-2">
                            <ShieldCheckIcon className="h-5 w-5 text-emerald-600" />
                            <span className="text-sm font-bold text-emerald-900">Encryption Active</span>
                          </div>
                          <p className="text-xs text-emerald-700 leading-relaxed">
                            This file is protected with {mockFile.encryptionLevel} encryption. The key is stored in your secure vault.
                          </p>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">SHA-256 Hash</label>
                          <div className="bg-slate-100 p-3 rounded-xl font-mono text-[10px] text-slate-600 break-all border border-slate-200">
                            {mockFile.hash}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-slate-900">Recent Activity</h3>
                    <div className="space-y-4">
                      {mockActivity.map((activity) => (
                        <div key={activity.id} className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-slate-100">
                          <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center flex-shrink-0">
                            <ClockIcon className="h-4 w-4 text-slate-400" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-slate-900">
                              <span className="font-bold">{activity.userName}</span>
                              {' '}{activity.action}d the file
                            </p>
                            {activity.details && <p className="text-xs text-slate-500 mt-1">{activity.details}</p>}
                            <p className="text-[10px] text-slate-400 font-bold mt-1">{activity.timestamp}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'history' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-slate-900">Version History</h3>
                    <Button variant="outline" size="sm" className="rounded-xl font-bold">Create New Version</Button>
                  </div>
                  <div className="space-y-4">
                    {mockVersions.map((v) => (
                      <Card key={v.id} className="p-6 rounded-2xl border-slate-200/60 bg-white hover:border-primary-200 transition-colors group">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center">
                              <span className="text-lg font-black text-primary-600">v{v.version}</span>
                            </div>
                            <div>
                              <p className="font-bold text-slate-900">Version {v.version}</p>
                              <p className="text-xs text-slate-500">{v.createdAt} • {v.createdBy}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="sm" className="font-bold text-primary-600">Restore</Button>
                            <Button variant="outline" size="sm" className="font-bold">Download</Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'access' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-slate-900">Who has access</h3>
                    <Button className="rounded-xl font-bold">Invite People</Button>
                  </div>
                  <div className="space-y-4">
                    {[
                      { name: 'Ashwitha Kethavath', email: 'ashwitha@cloudlock.com', role: 'Owner', avatar: 'AK' },
                      { name: 'Finance Team', email: 'finance@cloudlock.com', role: 'Editor', avatar: 'FT' },
                      { name: 'Board Members', email: 'board@cloudlock.com', role: 'Viewer', avatar: 'BM' },
                    ].map((user) => (
                      <div key={user.email} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                            {user.avatar}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{user.name}</p>
                            <p className="text-xs text-slate-500">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <select className="bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs font-bold outline-none">
                            <option>{user.role}</option>
                            <option>Viewer</option>
                            <option>Editor</option>
                            <option>Remove</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Sidebar Actions */}
          <div className="space-y-8">
            <Card className="p-8 rounded-[2.5rem] shadow-xl border-slate-200/60 bg-white">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-4">
                <button className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-primary-50 hover:border-primary-200 transition-all group">
                  <ShareIcon className="h-6 w-6 text-slate-400 group-hover:text-primary-600 mb-2" />
                  <span className="text-[10px] font-bold text-slate-500 group-hover:text-primary-900 uppercase tracking-widest">Share</span>
                </button>
                <button className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-primary-50 hover:border-primary-200 transition-all group">
                  <ArrowDownTrayIcon className="h-6 w-6 text-slate-400 group-hover:text-primary-600 mb-2" />
                  <span className="text-[10px] font-bold text-slate-500 group-hover:text-primary-900 uppercase tracking-widest">Download</span>
                </button>
                <button className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-primary-50 hover:border-primary-200 transition-all group">
                  <DocumentDuplicateIcon className="h-6 w-6 text-slate-400 group-hover:text-primary-600 mb-2" />
                  <span className="text-[10px] font-bold text-slate-500 group-hover:text-primary-900 uppercase tracking-widest">Copy</span>
                </button>
                <button className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-rose-50 hover:border-rose-200 transition-all group">
                  <TrashIcon className="h-6 w-6 text-slate-400 group-hover:text-rose-600 mb-2" />
                  <span className="text-[10px] font-bold text-slate-500 group-hover:text-rose-900 uppercase tracking-widest">Delete</span>
                </button>
              </div>
            </Card>

            <Card className="p-8 rounded-[2.5rem] bg-slate-900 text-white">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary-500/20 rounded-lg">
                  <UserGroupIcon className="h-6 w-6 text-primary-400" />
                </div>
                <h3 className="text-lg font-bold">Sharing Policy</h3>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">
                This file is shared with the Finance Team. Any changes will be visible to all members with editor access.
              </p>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Public Link</span>
                  <Badge variant="outline" className="text-rose-400 border-rose-400/20">Disabled</Badge>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Inherited Perms</span>
                  <Badge variant="outline" className="text-emerald-400 border-emerald-400/20">Active</Badge>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
};

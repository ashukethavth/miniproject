
import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CloudArrowUpIcon, 
  DocumentIcon, 
  XMarkIcon, 
  CheckCircleIcon,
  ShieldCheckIcon,
  Cog6ToothIcon,
  FolderIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { Container } from '@/src/components/ui/Container';
import { Badge } from '@/src/components/ui/Badge';
import { cn } from '@/src/utils/cn';

interface UploadingFile {
  id: string;
  file: File;
  progress: number;
  encryptionProgress: number;
  status: 'pending' | 'uploading' | 'encrypting' | 'completed' | 'error';
}

export const UploadPage = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<UploadingFile[]>([]);
  const [showSettings, setShowSettings] = useState(false);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFiles = (incomingFiles: FileList | null) => {
    if (!incomingFiles) return;
    
    const newFiles: UploadingFile[] = Array.from(incomingFiles).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      progress: 0,
      encryptionProgress: 0,
      status: 'pending'
    }));

    setFiles(prev => [...newFiles, ...prev]);

    // Simulate upload process for each file
    newFiles.forEach(fileObj => {
      simulateUpload(fileObj.id);
    });
  };

  const simulateUpload = (id: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setFiles(prev => prev.map(f => f.id === id ? { ...f, progress: 100, status: 'encrypting' } : f));
        simulateEncryption(id);
      } else {
        setFiles(prev => prev.map(f => f.id === id ? { ...f, progress, status: 'uploading' } : f));
      }
    }, 500);
  };

  const simulateEncryption = (id: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setFiles(prev => prev.map(f => f.id === id ? { ...f, encryptionProgress: 100, status: 'completed' } : f));
      } else {
        setFiles(prev => prev.map(f => f.id === id ? { ...f, encryptionProgress: progress } : f));
      }
    }, 300);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }, []);

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen pt-32 pb-20 bg-slate-50">
      <Container>
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Secure Upload</h1>
            <p className="text-slate-500 mt-2">All files are encrypted client-side before being stored.</p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => setShowSettings(!showSettings)}
            className={cn('rounded-xl font-bold', showSettings && 'bg-slate-100')}
          >
            <Cog6ToothIcon className="h-5 w-5 mr-2" />
            Upload Settings
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Dropzone */}
            <div
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              className={cn(
                'relative h-80 rounded-[2.5rem] border-4 border-dashed transition-all duration-500 flex flex-col items-center justify-center p-12 text-center group overflow-hidden',
                isDragging 
                  ? 'border-primary-500 bg-primary-50/50 scale-[0.99]' 
                  : 'border-slate-200 bg-white hover:border-primary-300 hover:bg-slate-50/50'
              )}
            >
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className={cn(
                  'absolute top-0 left-0 w-full h-full bg-linear-to-b from-primary-500/5 to-transparent transition-opacity duration-500',
                  isDragging ? 'opacity-100' : 'opacity-0'
                )} />
              </div>

              <div className={cn(
                'w-20 h-20 rounded-3xl flex items-center justify-center mb-6 transition-all duration-500',
                isDragging ? 'bg-primary-600 text-white scale-110 rotate-12' : 'bg-primary-100 text-primary-600'
              )}>
                <CloudArrowUpIcon className="h-10 w-10" />
              </div>
              
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Drag & Drop Files</h3>
              <p className="text-slate-500 mb-8 max-w-xs">
                Supports any file type up to 2GB. Your data is encrypted locally.
              </p>

              <div className="flex gap-4">
                <input
                  type="file"
                  id="file-upload"
                  multiple
                  className="hidden"
                  onChange={(e) => handleFiles(e.target.files)}
                />
                <label htmlFor="file-upload">
                  <span className="inline-flex items-center justify-center px-4 py-2 bg-primary-600 text-white hover:bg-primary-700 shadow-sm rounded-xl font-bold cursor-pointer">
                    Browse Files
                  </span>
                </label>
                <Button variant="outline" className="rounded-xl font-bold px-8">
                  <FolderIcon className="h-5 w-5 mr-2" />
                  Select Folder
                </Button>
              </div>
            </div>

            {/* Upload Queue */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                Upload Queue
                {files.length > 0 && <Badge variant="primary">{files.length}</Badge>}
              </h2>
              
              <AnimatePresence initial={false}>
                {files.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-12 text-center border-2 border-dashed border-slate-200 rounded-4xl bg-white/50"
                  >
                    <p className="text-slate-400 font-medium italic">No files in queue</p>
                  </motion.div>
                ) : (
                  files.map((file) => (
                    <motion.div
                      key={file.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                    >
                      <Card className="p-5 rounded-2xl border-slate-200/60 bg-white shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center shrink-0">
                            <DocumentIcon className="h-6 w-6 text-slate-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-1">
                              <h4 className="font-bold text-slate-900 truncate">{file.file.name}</h4>
                              <button 
                                onClick={() => removeFile(file.id)}
                                className="text-slate-400 hover:text-rose-500 transition-colors"
                              >
                                <XMarkIcon className="h-5 w-5" />
                              </button>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-slate-500">
                              <span>{formatSize(file.file.size)}</span>
                              <span>•</span>
                              <span className={cn(
                                'font-bold uppercase tracking-wider',
                                file.status === 'completed' ? 'text-emerald-600' : 'text-primary-600'
                              )}>
                                {file.status}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 space-y-3">
                          {/* Upload Progress */}
                          <div className="space-y-1">
                            <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                              <span>Upload Progress</span>
                              <span>{Math.round(file.progress)}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                              <motion.div 
                                className="h-full bg-primary-500"
                                initial={{ width: 0 }}
                                animate={{ width: `${file.progress}%` }}
                              />
                            </div>
                          </div>

                          {/* Encryption Progress */}
                          {file.status !== 'pending' && file.status !== 'uploading' && (
                            <div className="space-y-1">
                              <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                <span className="flex items-center gap-1">
                                  <ShieldCheckIcon className="h-3 w-3 text-emerald-500" />
                                  Encryption (AES-256)
                                </span>
                                <span>{Math.round(file.encryptionProgress)}%</span>
                              </div>
                              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                <motion.div 
                                  className="h-full bg-emerald-500"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${file.encryptionProgress}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </Card>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="space-y-8">
            <Card className="p-8 rounded-[2.5rem] shadow-xl border-slate-200/60 bg-white">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Upload Settings</h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Encryption Level</label>
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-medium outline-none focus:ring-2 focus:ring-primary-500/20">
                    <option>AES-256 (Military Grade)</option>
                    <option>ChaCha20 (High Performance)</option>
                    <option>RSA-4096 (Asymmetric)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Destination Folder</label>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between cursor-pointer hover:bg-slate-100 transition-colors">
                    <div className="flex items-center gap-2">
                      <FolderIcon className="h-5 w-5 text-primary-600" />
                      <span className="text-sm font-medium text-slate-700">Root Directory</span>
                    </div>
                    <Badge variant="outline" className="text-[10px]">Change</Badge>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-4">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
                    <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">Auto-encrypt all files</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
                    <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">Preserve folder structure</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
                    <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">Notify team on completion</span>
                  </label>
                </div>
              </div>
            </Card>

            <Card className="p-8 rounded-[2.5rem] bg-slate-900 text-white">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary-500/20 rounded-lg">
                  <ShieldCheckIcon className="h-6 w-6 text-primary-400" />
                </div>
                <h3 className="text-lg font-bold">Security Info</h3>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">
                Your files are encrypted using your unique master key. Not even CloudLock administrators can access your data.
              </p>
              <Button variant="ghost" className="w-full text-primary-400 hover:bg-white/5 font-bold">
                Learn about our encryption
              </Button>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
};

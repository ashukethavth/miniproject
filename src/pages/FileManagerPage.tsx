import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FolderIcon, 
  DocumentIcon, 
  EllipsisVerticalIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  Squares2X2Icon,
  ListBulletIcon,
  ChevronRightIcon,
  StarIcon,
  ShareIcon,
  ArrowDownTrayIcon,
  TrashIcon,
  PencilIcon,
  FolderPlusIcon,
  ArrowUpTrayIcon,
  InformationCircleIcon,
  ShieldCheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { Container } from '@/src/components/ui/Container';
import { Badge } from '@/src/components/ui/Badge';
import { FileIcon } from '@/src/components/files/FileIcon';
import { FileMetadata, FolderMetadata } from '@/src/types/files';
import { cn } from '@/src/utils/cn';

// Mock Data
const mockFolders: FolderMetadata[] = [
  { id: 'f1', name: 'Project Alpha', parentId: null, createdAt: '2024-03-01', updatedAt: '2024-03-10', owner: 'Me', fileCount: 12, totalSize: 1024 * 1024 * 45, isFavorite: true },
  { id: 'f2', name: 'Marketing Assets', parentId: null, createdAt: '2024-02-15', updatedAt: '2024-03-12', owner: 'Me', fileCount: 45, totalSize: 1024 * 1024 * 120, isFavorite: false },
  { id: 'f3', name: 'Legal Documents', parentId: null, createdAt: '2024-01-20', updatedAt: '2024-03-05', owner: 'Me', fileCount: 8, totalSize: 1024 * 1024 * 12, isFavorite: false },
];

const mockFiles: FileMetadata[] = [
  { id: '1', name: 'Q1_Financial_Report.pdf', type: 'pdf', size: 1024 * 1024 * 2.4, createdAt: '2024-03-12', updatedAt: '2024-03-12', owner: 'Me', encryptionStatus: 'encrypted', encryptionLevel: 'AES-256', mimeType: 'application/pdf', hash: 'sha256:abc...', tags: ['finance', 'q1'], isFavorite: true, parentId: null },
  { id: '2', name: 'Product_Launch_Video.mp4', type: 'video', size: 1024 * 1024 * 85, createdAt: '2024-03-11', updatedAt: '2024-03-11', owner: 'Me', encryptionStatus: 'encrypted', encryptionLevel: 'AES-256', mimeType: 'video/mp4', hash: 'sha256:def...', tags: ['marketing'], isFavorite: false, parentId: null },
  { id: '3', name: 'Hero_Banner_v2.png', type: 'image', size: 1024 * 1024 * 4.2, createdAt: '2024-03-10', updatedAt: '2024-03-10', owner: 'Me', encryptionStatus: 'encrypted', encryptionLevel: 'AES-256', mimeType: 'image/png', hash: 'sha256:ghi...', tags: ['design'], isFavorite: false, parentId: null },
  { id: '4', name: 'Main_Styles.css', type: 'code', size: 1024 * 12, createdAt: '2024-03-09', updatedAt: '2024-03-09', owner: 'Me', encryptionStatus: 'decrypted', encryptionLevel: 'AES-256', mimeType: 'text/css', hash: 'sha256:jkl...', tags: ['dev'], isFavorite: true, parentId: null },
];

export const FileManagerPage = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showDetails, setShowDetails] = useState<string | null>(null);

  const toggleSelection = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const formatSize = (bytes: number) => {
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const selectedFile = mockFiles.find(f => f.id === showDetails);

  return (
    <div className="min-h-screen pt-24 bg-slate-50 flex">
      {/* Sidebar Tree */}
      <aside className="w-64 border-r border-slate-200 bg-white hidden lg:flex flex-col">
        <div className="p-6">
          <Link to="/upload">
            <Button className="w-full rounded-xl font-bold py-3 shadow-lg shadow-primary-500/20">
              <ArrowUpTrayIcon className="h-5 w-5 mr-2" />
              Upload New
            </Button>
          </Link>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          <button className="w-full flex items-center gap-3 px-4 py-2 text-sm font-bold text-primary-600 bg-primary-50 rounded-lg">
            <FolderIcon className="h-5 w-5" />
            All Files
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-50 rounded-lg transition-colors">
            <StarIcon className="h-5 w-5" />
            Favorites
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-50 rounded-lg transition-colors">
            <ShareIcon className="h-5 w-5" />
            Shared with me
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-50 rounded-lg transition-colors">
            <TrashIcon className="h-5 w-5" />
            Trash
          </button>
          
          <div className="pt-6 pb-2">
            <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">My Folders</p>
          </div>
          {mockFolders.map(folder => (
            <button key={folder.id} className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg transition-colors truncate">
              <FolderIcon className="h-4 w-4 text-slate-400" />
              {folder.name}
            </button>
          ))}
        </nav>
        <div className="p-6 border-t border-slate-100">
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <span>Storage</span>
              <span>75%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-primary-500 w-[75%]" />
            </div>
            <p className="text-[10px] text-slate-500">1.5 GB of 2 GB used</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Toolbar */}
        <div className="bg-white border-b border-slate-200 p-4 sticky top-16 z-20">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
              <Link to="/files" className="hover:text-primary-600">My Files</Link>
              <ChevronRightIcon className="h-4 w-4" />
              <span className="text-slate-900">Root</span>
            </div>

            {/* Search & Actions */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search files..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500/20"
                />
              </div>
              <Button variant="outline" size="sm" className="rounded-xl font-bold hidden sm:flex">
                <FolderPlusIcon className="h-4 w-4 mr-2" />
                New Folder
              </Button>
              <Link to="/upload">
                <Button size="sm" className="rounded-xl font-bold shadow-lg shadow-primary-500/20">
                  <ArrowUpTrayIcon className="h-4 w-4 mr-2" />
                  Upload
                </Button>
              </Link>
              <div className="flex items-center bg-slate-100 p-1 rounded-xl">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={cn('p-1.5 rounded-lg transition-all', viewMode === 'grid' ? 'bg-white shadow-sm text-primary-600' : 'text-slate-500')}
                >
                  <Squares2X2Icon className="h-5 w-5" />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={cn('p-1.5 rounded-lg transition-all', viewMode === 'list' ? 'bg-white shadow-sm text-primary-600' : 'text-slate-500')}
                >
                  <ListBulletIcon className="h-5 w-5" />
                </button>
              </div>
              <Button variant="outline" size="sm" className="rounded-xl font-bold">
                <FunnelIcon className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </div>

        {/* File Grid/List */}
        <div className="flex-1 p-6 overflow-auto">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-6">
              {/* Folders */}
              {mockFolders.map(folder => (
                <Card 
                  key={folder.id} 
                  className={cn(
                    'p-4 rounded-2xl border-slate-200/60 bg-white hover:shadow-lg transition-all cursor-pointer group relative',
                    selectedItems.includes(folder.id) && 'ring-2 ring-primary-500 bg-primary-50/30'
                  )}
                  onClick={() => toggleSelection(folder.id)}
                >
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1 text-slate-400 hover:text-slate-600"><EllipsisVerticalIcon className="h-5 w-5" /></button>
                  </div>
                  <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-4">
                    <FolderIcon className="h-8 w-8 text-primary-600" />
                  </div>
                  <h4 className="font-bold text-slate-900 truncate text-sm">{folder.name}</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{folder.fileCount} items</p>
                </Card>
              ))}

              {/* Files */}
              {mockFiles.map(file => (
                <Card 
                  key={file.id} 
                  className={cn(
                    'p-4 rounded-2xl border-slate-200/60 bg-white hover:shadow-lg transition-all cursor-pointer group relative',
                    selectedItems.includes(file.id) && 'ring-2 ring-primary-500 bg-primary-50/30'
                  )}
                  onClick={() => toggleSelection(file.id)}
                  onDoubleClick={() => setShowDetails(file.id)}
                >
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <button className="p-1 text-slate-400 hover:text-primary-600"><StarIcon className="h-4 w-4" /></button>
                    <button className="p-1 text-slate-400 hover:text-slate-600"><EllipsisVerticalIcon className="h-5 w-5" /></button>
                  </div>
                  <div className="mb-4">
                    <FileIcon type={file.type} className="w-12 h-12" />
                  </div>
                  <h4 className="font-bold text-slate-900 truncate text-sm">{file.name}</h4>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{formatSize(file.size)}</p>
                    {file.encryptionStatus === 'encrypted' && (
                      <ShieldCheckIcon className="h-3 w-3 text-emerald-500" />
                    )}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="rounded-2xl border-slate-200/60 bg-white overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="p-4 w-10"><input type="checkbox" className="rounded border-slate-300" /></th>
                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Name</th>
                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Size</th>
                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Modified</th>
                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Security</th>
                    <th className="p-4 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {mockFiles.map(file => (
                    <tr key={file.id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer" onClick={() => setShowDetails(file.id)}>
                      <td className="p-4"><input type="checkbox" className="rounded border-slate-300" checked={selectedItems.includes(file.id)} onChange={() => toggleSelection(file.id)} /></td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <FileIcon type={file.type} className="w-8 h-8" />
                          <span className="text-sm font-bold text-slate-900">{file.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-slate-500">{formatSize(file.size)}</td>
                      <td className="p-4 text-sm text-slate-500">{file.updatedAt}</td>
                      <td className="p-4">
                        <Badge variant={file.encryptionStatus === 'encrypted' ? 'primary' : 'outline'} className="text-[10px]">
                          {file.encryptionLevel}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <button className="p-1 text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                          <EllipsisVerticalIcon className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          )}
        </div>
      </main>

      {/* Details Panel */}
      <AnimatePresence>
        {showDetails && (
          <motion.aside
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            className="w-80 border-l border-slate-200 bg-white flex flex-col z-30 fixed right-0 top-0 h-full shadow-2xl lg:relative lg:shadow-none"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-900">File Details</h3>
              <button onClick={() => setShowDetails(null)} className="p-1 text-slate-400 hover:text-slate-600"><XMarkIcon className="h-5 w-5" /></button>
            </div>
            
            {selectedFile && (
              <div className="flex-1 overflow-auto p-6 space-y-8">
                <div className="text-center">
                  <div className="w-24 h-24 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-inner">
                    <FileIcon type={selectedFile.type} className="w-12 h-12" />
                  </div>
                  <h4 className="font-bold text-slate-900 break-all">{selectedFile.name}</h4>
                  <div className="flex justify-center gap-2 mt-4">
                    <button className="p-2 bg-slate-100 rounded-xl text-slate-600 hover:bg-primary-50 hover:text-primary-600 transition-all"><StarIcon className="h-5 w-5" /></button>
                    <button className="p-2 bg-slate-100 rounded-xl text-slate-600 hover:bg-primary-50 hover:text-primary-600 transition-all"><ShareIcon className="h-5 w-5" /></button>
                    <button className="p-2 bg-slate-100 rounded-xl text-slate-600 hover:bg-primary-50 hover:text-primary-600 transition-all"><ArrowDownTrayIcon className="h-5 w-5" /></button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-bold uppercase tracking-widest">Type</span>
                    <span className="text-slate-900 font-bold">{selectedFile.mimeType}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-bold uppercase tracking-widest">Size</span>
                    <span className="text-slate-900 font-bold">{formatSize(selectedFile.size)}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-bold uppercase tracking-widest">Created</span>
                    <span className="text-slate-900 font-bold">{selectedFile.createdAt}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-bold uppercase tracking-widest">Owner</span>
                    <span className="text-slate-900 font-bold">{selectedFile.owner}</span>
                  </div>
                </div>

                <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldCheckIcon className="h-4 w-4 text-emerald-600" />
                    <span className="text-xs font-bold text-emerald-900">Security Verified</span>
                  </div>
                  <p className="text-[10px] text-emerald-700 leading-relaxed">
                    This file is encrypted with {selectedFile.encryptionLevel}. Integrity hash: <code className="bg-white/50 px-1 rounded">sha256:abc...</code>
                  </p>
                </div>

                <div className="space-y-3">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedFile.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="bg-slate-50">#{tag}</Badge>
                    ))}
                    <button className="text-xs text-primary-600 font-bold">+ Add Tag</button>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100">
                  <Link to={`/files/${selectedFile.id}`}>
                    <Button variant="outline" className="w-full rounded-xl font-bold">
                      <InformationCircleIcon className="h-5 w-5 mr-2" />
                      View Full Details
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Floating Action Menu for Selected Items */}
      <AnimatePresence>
        {selectedItems.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40"
          >
            <div className="bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-6 border border-white/10 backdrop-blur-xl">
              <span className="text-sm font-bold border-r border-white/20 pr-6">{selectedItems.length} items selected</span>
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 text-sm font-bold hover:text-primary-400 transition-colors">
                  <ArrowDownTrayIcon className="h-5 w-5" />
                  Download
                </button>
                <button className="flex items-center gap-2 text-sm font-bold hover:text-primary-400 transition-colors">
                  <ShareIcon className="h-5 w-5" />
                  Share
                </button>
                <button className="flex items-center gap-2 text-sm font-bold hover:text-primary-400 transition-colors">
                  <FolderPlusIcon className="h-5 w-5" />
                  Move
                </button>
                <button className="flex items-center gap-2 text-sm font-bold hover:text-rose-400 transition-colors">
                  <TrashIcon className="h-5 w-5" />
                  Delete
                </button>
              </div>
              <button 
                onClick={() => setSelectedItems([])}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

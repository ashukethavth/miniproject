import React from 'react';
import { 
  ShieldCheckIcon, 
  Squares2X2Icon, 
  LockClosedIcon, 
  UsersIcon, 
  Cog6ToothIcon, 
  DocumentTextIcon, 
  ChevronRightIcon,
  FolderIcon,
  ArrowUpTrayIcon,
  ShareIcon,
  LifebuoyIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';
import { NavLink } from 'react-router-dom';
import { cn } from '@/src/utils/cn';

const navItems = [
  { icon: Squares2X2Icon, label: 'Dashboard', path: '/dashboard' },
  { icon: FolderIcon, label: 'My Files', path: '/files' },
  { icon: ArrowUpTrayIcon, label: 'Upload', path: '/upload' },
  { icon: ShareIcon, label: 'Sharing', path: '/share' },
  { icon: LockClosedIcon, label: 'Security', path: '/security' },
  { icon: ClipboardDocumentListIcon, label: 'Audit Logs', path: '/audit' },
  { icon: UsersIcon, label: 'Admin', path: '/admin' },
  { icon: LifebuoyIcon, label: 'Support', path: '/support' },
  { icon: Cog6ToothIcon, label: 'Settings', path: '/settings' },
];

export const Sidebar = () => {
  return (
    <aside className="w-64 border-r border-slate-200 bg-white h-screen sticky top-0 flex flex-col">
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <ShieldCheckIcon className="h-6 w-6 text-primary-600" />
          <span className="font-bold text-lg">CloudLock</span>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              'flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all group',
              isActive 
                ? 'bg-primary-50 text-primary-700' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            )}
          >
            <div className="flex items-center gap-3">
              <item.icon className={cn('h-4 w-4', 'group-hover:scale-110 transition-transform')} />
              {item.label}
            </div>
            <ChevronRightIcon className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <div className="bg-slate-50 rounded-xl p-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Pro Plan</p>
          <div className="w-full bg-slate-200 rounded-full h-1.5 mb-2">
            <div className="bg-primary-600 h-1.5 rounded-full w-3/4"></div>
          </div>
          <p className="text-[10px] text-slate-500">75% of storage used</p>
        </div>
      </div>
    </aside>
  );
};

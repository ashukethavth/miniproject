import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/20/solid';
import { cn } from '@/src/utils/cn';

interface BreadcrumbProps {
  className?: string;
}

export const Breadcrumb = ({ className }: BreadcrumbProps) => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  if (pathnames.length === 0) return null;

  return (
    <nav className={cn('flex', className)} aria-label="Breadcrumb">
      <ol role="list" className="flex items-center space-x-2">
        <li>
          <div>
            <Link to="/" className="text-slate-400 hover:text-slate-500 transition-colors">
              <HomeIcon className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
              <span className="sr-only">Home</span>
            </Link>
          </div>
        </li>
        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          const displayName = name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, ' ');

          return (
            <li key={name}>
              <div className="flex items-center">
                <ChevronRightIcon className="h-4 w-4 flex-shrink-0 text-slate-300" aria-hidden="true" />
                <Link
                  to={routeTo}
                  className={cn(
                    'ml-2 text-sm font-medium transition-colors',
                    isLast
                      ? 'text-slate-900 pointer-events-none'
                      : 'text-slate-500 hover:text-slate-700'
                  )}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {displayName}
                </Link>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

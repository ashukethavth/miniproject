import React from 'react';
import { ShieldCheckIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { cn } from '@/src/utils/cn';

interface SecurityNoticeProps {
  className?: string;
  message?: string;
}

export const SecurityNotice = ({ 
  className, 
  message = "Your security is our priority. We use industry-standard encryption to protect your data." 
}: SecurityNoticeProps) => {
  return (
    <div className={cn('bg-primary-50 border border-primary-100 rounded-2xl p-4 flex gap-3', className)}>
      <ShieldCheckIcon className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
      <div className="text-sm text-primary-900 leading-relaxed">
        <span className="font-bold block mb-1">Security Notice</span>
        {message}
      </div>
    </div>
  );
};

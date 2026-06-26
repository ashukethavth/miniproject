import React from 'react';
import { cn } from '@/src/utils/cn';

interface PasswordStrengthProps {
  password?: string;
  className?: string;
}

export const PasswordStrength = ({ password = '', className }: PasswordStrengthProps) => {
  const getStrength = (pass: string) => {
    let strength = 0;
    if (pass.length >= 8) strength += 1;
    if (/[A-Z]/.test(pass)) strength += 1;
    if (/[0-9]/.test(pass)) strength += 1;
    if (/[^A-Za-z0-9]/.test(pass)) strength += 1;
    return strength;
  };

  const strength = getStrength(password);
  const labels = ['Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['bg-rose-500', 'bg-amber-500', 'bg-blue-500', 'bg-emerald-500'];

  if (!password) return null;

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider">
        <span className="text-slate-500">Password Strength</span>
        <span className={cn('font-black', strength > 0 ? colors[strength - 1].replace('bg-', 'text-') : 'text-slate-400')}>
          {strength > 0 ? labels[strength - 1] : 'Too Short'}
        </span>
      </div>
      <div className="flex gap-1 h-1.5">
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={cn(
              'flex-1 rounded-full transition-all duration-500',
              strength >= level ? colors[strength - 1] : 'bg-slate-200'
            )}
          />
        ))}
      </div>
      <ul className="text-[10px] text-slate-500 grid grid-cols-2 gap-x-4 gap-y-1 mt-2">
        <li className={cn('flex items-center gap-1', password.length >= 8 ? 'text-emerald-600' : '')}>
          {password.length >= 8 ? '✓' : '○'} Min 8 characters
        </li>
        <li className={cn('flex items-center gap-1', /[A-Z]/.test(password) ? 'text-emerald-600' : '')}>
          {/[A-Z]/.test(password) ? '✓' : '○'} Uppercase letter
        </li>
        <li className={cn('flex items-center gap-1', /[0-9]/.test(password) ? 'text-emerald-600' : '')}>
          {/[0-9]/.test(password) ? '✓' : '○'} One number
        </li>
        <li className={cn('flex items-center gap-1', /[^A-Za-z0-9]/.test(password) ? 'text-emerald-600' : '')}>
          {/[^A-Za-z0-9]/.test(password) ? '✓' : '○'} Special character
        </li>
      </ul>
    </div>
  );
};

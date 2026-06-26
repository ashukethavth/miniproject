import React from 'react';
import { cn } from '@/src/utils/cn';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  fluid?: boolean;
}

export const Container = ({ children, className, fluid = false }: ContainerProps) => {
  return (
    <div
      className={cn(
        'mx-auto px-4 sm:px-6 lg:px-8',
        !fluid && 'max-w-7xl',
        className
      )}
    >
      {children}
    </div>
  );
};

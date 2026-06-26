import React from 'react';
import { cn } from '@/src/utils/cn';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  py?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

export const Section = ({ children, className, id, py = 'md' }: SectionProps) => {
  const paddingY = {
    none: 'py-0',
    sm: 'py-8 md:py-12',
    md: 'py-16 md:py-24',
    lg: 'py-24 md:py-32',
    xl: 'py-32 md:py-48',
  };

  return (
    <section id={id} className={cn(paddingY[py], className)}>
      {children}
    </section>
  );
};

import { cn } from '@/src/utils/cn';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  fullPage?: boolean;
}

export const Loading = ({ size = 'md', className, fullPage }: LoadingProps) => {
  const sizes = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
  };

  const spinner = (
    <div
      className={cn(
        'animate-spin rounded-full border-primary-600 border-t-transparent',
        sizes[size],
        className
      )}
    />
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/50 backdrop-blur-sm">
        {spinner}
      </div>
    );
  }

  return spinner;
};

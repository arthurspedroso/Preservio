import { LoaderCircle } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

export function Spinner({ className, label }: { className?: string; label?: string }) {
  return (
    <span role={label ? 'status' : undefined} className="inline-flex items-center gap-2">
      <LoaderCircle className={cn('size-4 animate-spin', className)} aria-hidden />
      {label && <span className="sr-only">{label}</span>}
    </span>
  );
}

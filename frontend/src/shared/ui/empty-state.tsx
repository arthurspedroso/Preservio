import { type ReactNode } from 'react';
import { type LucideIcon } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center rounded-xl border border-dashed bg-card px-6 py-12 text-center',
        className,
      )}
    >
      <span className="mb-4 grid size-12 place-items-center rounded-full bg-secondary text-primary">
        <Icon className="size-6" aria-hidden />
      </span>
      <p className="font-display text-base font-semibold text-brand">{title}</p>
      {description && (
        <div className="mt-1.5 max-w-md text-sm text-muted-foreground">{description}</div>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

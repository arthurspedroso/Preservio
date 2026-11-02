import Link from 'next/link';
import { Leaf } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface LogoProps {
  href?: string;
  tone?: 'light' | 'dark';
  className?: string;
}

export function Logo({ href = '/', tone = 'light', className }: LogoProps) {
  return (
    <Link href={href} className={cn('inline-flex items-center gap-2.5 rounded-lg', className)}>
      <span
        className={cn(
          'grid size-9 place-items-center rounded-xl',
          tone === 'light'
            ? 'bg-brand text-brand-foreground'
            : 'bg-sidebar-primary text-sidebar-primary-foreground',
        )}
      >
        <Leaf className="size-5" aria-hidden />
      </span>
      <span
        className={cn(
          'font-display text-xl font-semibold tracking-tight',
          tone === 'light' ? 'text-brand' : 'text-sidebar-accent-foreground',
        )}
      >
        Preservio
      </span>
    </Link>
  );
}

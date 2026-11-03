import { type ReactNode } from 'react';
import { cn } from '@/shared/lib/utils';

type NavTone = 'light' | 'dark';

const stateClassName = (active: boolean, tone: NavTone) => {
  if (tone === 'dark') {
    return active
      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
      : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground';
  }
  return active
    ? 'bg-secondary text-secondary-foreground'
    : 'text-muted-foreground hover:bg-muted hover:text-foreground';
};

// Mesmo estado ativo em todos os menus: fundo + peso, nunca só a cor do texto
export const barLinkClassName = (active: boolean) =>
  cn(
    'inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-medium transition-colors',
    stateClassName(active, 'light'),
  );

export const listLinkClassName = (active: boolean, tone: NavTone = 'light') =>
  cn(
    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors [&_svg]:size-4 [&_svg]:shrink-0',
    stateClassName(active, tone),
  );

interface NavGroupProps {
  label: string;
  tone?: NavTone;
  children: ReactNode;
}

// Seção rotulada de um menu lateral
export function NavGroup({ label, tone = 'light', children }: NavGroupProps) {
  return (
    <div>
      <p
        className={cn(
          'mb-1.5 px-3 text-xs font-semibold',
          tone === 'dark' ? 'text-sidebar-foreground/60' : 'text-muted-foreground',
        )}
      >
        {label}
      </p>
      <ul className="space-y-0.5">{children}</ul>
    </div>
  );
}

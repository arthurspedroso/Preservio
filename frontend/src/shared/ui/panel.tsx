import { type ReactNode } from 'react';
import { type LucideIcon } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface PanelProps {
  title: string;
  icon?: LucideIcon;
  description?: ReactNode;
  // Ação à direita do título, como "Editar"
  actions?: ReactNode;
  headingLevel?: 'h2' | 'h3';
  className?: string;
  children: ReactNode;
}

// Bloco de conteúdo com título: padrão único para detalhes, formulários laterais e perfil
export function Panel({
  title,
  icon: Icon,
  description,
  actions,
  headingLevel: Heading = 'h2',
  className,
  children,
}: PanelProps) {
  return (
    <section className={cn('rounded-xl border bg-card p-5 shadow-soft sm:p-6', className)}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Heading className="flex items-center gap-2 text-base font-semibold">
            {Icon && <Icon className="size-4 shrink-0 text-primary" aria-hidden />}
            {title}
          </Heading>
          {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
        </div>
        {actions}
      </div>
      {children}
    </section>
  );
}

// Par rótulo/valor de uma lista de dados (<dl>)
export function DataItem({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="min-w-0 space-y-0.5">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="break-words text-sm">{children}</dd>
    </div>
  );
}

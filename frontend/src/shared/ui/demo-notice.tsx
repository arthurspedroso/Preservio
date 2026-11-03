import { FlaskConical } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/shared/lib/utils';

// Regra de negócio 11: dados de demonstração precisam ser identificados como simulados
export function DemoNotice({
  className,
  tone = 'light',
}: {
  className?: string;
  tone?: 'light' | 'dark';
}) {
  const t = useTranslations('ui.demoNotice');

  return (
    <span
      title={t('description')}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium',
        tone === 'light'
          ? 'border-warning/50 bg-warning/15 text-warning-foreground'
          : 'border-sidebar-primary/40 bg-sidebar-primary/10 text-sidebar-primary',
        className,
      )}
    >
      <FlaskConical className="size-3.5" aria-hidden />
      {t('label')}
      <span className="sr-only">: {t('description')}</span>
    </span>
  );
}

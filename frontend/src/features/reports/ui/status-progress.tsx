import { useTranslations } from 'next-intl';
import { cn } from '@/shared/lib/utils';
import { STATUS_FLOW, type ReportStatus } from '../domain/types';

// Versão compacta do StatusStepper para listas: 4 segmentos + texto da etapa atual
export function StatusProgress({ status }: { status: ReportStatus }) {
  const t = useTranslations('reports');
  const steps: ReportStatus[] = [
    ...STATUS_FLOW,
    status === 'not_upheld' ? 'not_upheld' : 'resolved',
  ];
  const current = steps.indexOf(status);

  return (
    <div
      role="img"
      aria-label={t('progress.label', {
        step: current + 1,
        total: steps.length,
        name: t(`status.${status}.label`),
      })}
      className="flex gap-1.5"
    >
      {steps.map((step, index) => (
        <span
          key={step}
          className={cn(
            'h-1.5 flex-1 rounded-full',
            index <= current
              ? status === 'not_upheld'
                ? 'bg-destructive'
                : 'bg-primary'
              : 'bg-muted',
          )}
        />
      ))}
    </div>
  );
}

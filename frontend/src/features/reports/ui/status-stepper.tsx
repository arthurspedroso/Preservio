import { useTranslations } from 'next-intl';
import { cn } from '@/shared/lib/utils';
import { FINAL_STATUSES, STATUS_FLOW, type ReportStatus } from '../domain/types';
import { statusIcons } from './status-badge';

type StepState = 'done' | 'current' | 'pending';

export function StatusStepper({ status }: { status: ReportStatus }) {
  const t = useTranslations('reports');
  const finalStep = status === 'not_upheld' ? 'not_upheld' : 'resolved';
  const steps: ReportStatus[] = [...STATUS_FLOW, finalStep];
  const currentIndex = steps.indexOf(status);
  const isFinished = (FINAL_STATUSES as readonly ReportStatus[]).includes(status);

  const stateOf = (index: number): StepState => {
    if (index < currentIndex || (index === currentIndex && isFinished)) return 'done';
    if (index === currentIndex) return 'current';
    return 'pending';
  };

  return (
    <ol aria-label={t('stepper.label')} className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {steps.map((step, index) => {
        const state = stateOf(index);
        const Icon = statusIcons[step];
        const isCurrent = index === currentIndex;

        return (
          <li
            key={step}
            aria-current={isCurrent ? 'step' : undefined}
            className={cn(
              'rounded-xl border p-3 text-sm transition-colors',
              state === 'pending' && 'border-dashed bg-muted/50 text-muted-foreground',
              state !== 'pending' && 'border-primary/30 bg-secondary text-secondary-foreground',
              isCurrent && 'ring-2 ring-primary ring-offset-2 ring-offset-background',
              isCurrent &&
                step === 'not_upheld' &&
                'border-destructive/30 bg-destructive/5 ring-destructive',
            )}
          >
            <div className="flex items-center gap-2 font-medium">
              <Icon className="size-4 shrink-0" aria-hidden />
              {t(`status.${step}.label`)}
            </div>
            <p className="mt-1 text-xs">
              {state === 'done' && isCurrent ? t('stepper.finished') : t(`stepper.${state}`)}
            </p>
          </li>
        );
      })}
    </ol>
  );
}

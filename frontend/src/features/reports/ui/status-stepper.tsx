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
    <ol
      aria-label={t('stepper.label')}
      className="grid gap-4 rounded-xl border bg-card p-4 shadow-soft sm:grid-cols-4 sm:gap-2 sm:p-5"
    >
      {steps.map((step, index) => {
        const state = stateOf(index);
        const Icon = statusIcons[step];
        const isCurrent = index === currentIndex;
        const rejected = isCurrent && step === 'not_upheld';

        return (
          <li
            key={step}
            aria-current={isCurrent ? 'step' : undefined}
            className="flex items-center gap-3 sm:flex-col sm:items-stretch sm:gap-2.5"
          >
            <div className="flex items-center">
              <span
                className={cn(
                  'grid size-8 shrink-0 place-items-center rounded-full',
                  state === 'pending' && 'bg-muted text-muted-foreground',
                  state === 'current' && 'bg-secondary text-primary ring-2 ring-primary',
                  state === 'done' && 'bg-primary text-primary-foreground',
                  rejected && 'bg-destructive text-destructive-foreground',
                )}
              >
                <Icon className="size-4" aria-hidden />
              </span>
              {index < steps.length - 1 && (
                <span
                  className={cn(
                    'ml-2 hidden h-0.5 flex-1 rounded-full sm:block',
                    index < currentIndex ? 'bg-primary' : 'bg-border',
                  )}
                  aria-hidden
                />
              )}
            </div>
            <div className="min-w-0">
              <p
                className={cn(
                  'text-sm font-medium',
                  state === 'pending' && 'text-muted-foreground',
                )}
              >
                {t(`status.${step}.label`)}
              </p>
              <p className="text-xs text-muted-foreground">
                {state === 'done' && isCurrent ? t('stepper.finished') : t(`stepper.${state}`)}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

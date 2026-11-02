import { Check } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/shared/lib/utils';
import { STEPS } from './schema';

interface WizardProgressProps {
  current: number;
  // Maior etapa já alcançada: permite voltar a ela pelo indicador
  reached: number;
  onSelect: (index: number) => void;
}

export function WizardProgress({ current, reached, onSelect }: WizardProgressProps) {
  const t = useTranslations('reports.new');

  return (
    <nav aria-label={t('progress.label')}>
      {/* Celular: texto + barra, para não espremer 4 rótulos */}
      <div className="sm:hidden">
        <p className="text-sm font-medium">
          {t('progress.stepOf', { current: current + 1, total: STEPS.length })}
          <span className="text-muted-foreground"> · {t(`steps.${STEPS[current]}.short`)}</span>
        </p>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted" aria-hidden>
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-300"
            style={{ width: `${((current + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      <ol className="hidden grid-cols-4 gap-2 sm:grid">
        {STEPS.map((step, index) => {
          const done = index < current;
          const active = index === current;
          const canVisit = index <= reached && !active;

          return (
            <li key={step} className="min-w-0">
              <button
                type="button"
                onClick={() => onSelect(index)}
                disabled={!canVisit}
                aria-current={active ? 'step' : undefined}
                className={cn(
                  'group flex w-full flex-col gap-2 rounded-lg pb-1 text-left disabled:cursor-default',
                  canVisit && 'cursor-pointer',
                )}
              >
                <span
                  className={cn(
                    'h-1.5 w-full rounded-full transition-colors duration-300',
                    done || active ? 'bg-primary' : 'bg-muted',
                  )}
                  aria-hidden
                />
                <span className="flex items-center gap-2">
                  <span
                    className={cn(
                      'grid size-6 shrink-0 place-items-center rounded-full border text-xs font-semibold transition-colors',
                      done && 'border-primary bg-primary text-primary-foreground',
                      active && 'border-primary bg-secondary text-secondary-foreground',
                      !done && !active && 'border-input text-muted-foreground',
                    )}
                    aria-hidden
                  >
                    {done ? <Check className="size-3.5" /> : index + 1}
                  </span>
                  <span
                    className={cn(
                      'truncate text-sm',
                      active ? 'font-semibold text-foreground' : 'text-muted-foreground',
                      canVisit && 'group-hover:text-foreground group-hover:underline',
                    )}
                  >
                    {t(`steps.${step}.short`)}
                  </span>
                  <span className="sr-only">
                    {done
                      ? t('progress.done')
                      : active
                        ? t('progress.current')
                        : t('progress.todo')}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

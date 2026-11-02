import { Lightbulb, Phone } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { StepKey } from './schema';

const TIP_COUNT = 3;

// Ajuda contextual ao lado do formulário: muda junto com a etapa
export function StepTips({ step }: { step: StepKey }) {
  const t = useTranslations('reports.new.tips');

  return (
    <aside aria-labelledby="tips-title" className="space-y-4">
      <div className="rounded-xl border bg-secondary/50 p-5">
        <h2
          id="tips-title"
          className="flex items-center gap-2 font-sans text-sm font-semibold tracking-normal text-secondary-foreground"
        >
          <Lightbulb className="size-4" aria-hidden />
          {t('title')}
        </h2>
        <ul className="mt-3 space-y-3 text-sm leading-relaxed text-secondary-foreground/90">
          {Array.from({ length: TIP_COUNT }, (_, i) => (
            <li key={`${step}-${i}`} className="flex gap-2">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
              {t(`${step}.${i}`)}
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl border border-destructive/25 bg-destructive/5 p-4 text-sm">
        <p className="flex items-center gap-2 font-semibold text-destructive">
          <Phone className="size-4" aria-hidden />
          {t('emergencyTitle')}
        </p>
        <p className="mt-1 leading-relaxed text-muted-foreground">{t('emergencyText')}</p>
      </div>
    </aside>
  );
}

import { FlaskConical } from 'lucide-react';
import { useTranslations } from 'next-intl';

// Faixa fina no topo das áreas logadas: dados simulados sempre identificados (regra de negócio 11)
export function DemoBanner() {
  const t = useTranslations('ui.demoBanner');

  return (
    <div className="flex items-center justify-center gap-2 bg-warning/15 px-4 py-1.5 text-center text-xs font-medium text-warning-foreground">
      <FlaskConical className="size-3.5 shrink-0" aria-hidden />
      {t('text')}
    </div>
  );
}

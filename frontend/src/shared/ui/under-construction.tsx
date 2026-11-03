import { Construction } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { EmptyState } from './empty-state';

// Ocupa as rotas das próximas fases para a navegação não ter links quebrados
export function UnderConstruction({ description }: { description?: string }) {
  const t = useTranslations('ui.underConstruction');

  return (
    <EmptyState
      icon={Construction}
      title={t('title')}
      description={description ?? t('description')}
    />
  );
}

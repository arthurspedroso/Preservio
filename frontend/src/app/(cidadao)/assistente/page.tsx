import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { AssistantChat } from '@/features/assistant/ui/assistant-chat';
import { PageHeader } from '@/shared/ui/page-header';

export const metadata: Metadata = { title: 'Assistente ambiental' };

// RF08 e RF09 (Could have) — demonstração simulada por regras, sem IA
export default function AssistantPage() {
  const t = useTranslations('assistant');

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title={t('title')} description={t('description')} />
      <AssistantChat />
    </div>
  );
}

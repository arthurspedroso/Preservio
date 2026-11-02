import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Camera,
  CalendarDays,
  ExternalLink,
  FileText,
  MapPin,
  MessagesSquare,
  Siren,
  type LucideIcon,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { SOURCES } from '@/features/assistant/domain/knowledge';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { PageHeader } from '@/shared/ui/page-header';
import { Panel } from '@/shared/ui/panel';

export const metadata: Metadata = { title: 'Orientações ambientais' };

const tips: { key: string; icon: LucideIcon }[] = [
  { key: 'place', icon: MapPin },
  { key: 'date', icon: CalendarDays },
  { key: 'describe', icon: FileText },
  { key: 'evidence', icon: Camera },
  { key: 'emergency', icon: Siren },
];

// RF17 — conteúdo informativo geral, com referências oficiais
export default function GuidancePage() {
  const t = useTranslations('guidance');

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <PageHeader title={t('title')} description={t('description')} />

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tips.map(({ key, icon: Icon }) => (
          <li
            key={key}
            className={cn(
              'flex gap-4 rounded-xl border bg-card p-5 shadow-soft',
              // Cinco dicas: a última ocupa o resto da linha para a grade fechar alinhada
              key === 'emergency' && 'sm:col-span-2 lg:col-span-2',
            )}
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-secondary text-primary">
              <Icon className="size-5" aria-hidden />
            </span>
            <div>
              <h2 className="text-base font-semibold">{t(`tips.${key}.title`)}</h2>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {t(`tips.${key}.text`)}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Panel title={t('officialTitle')}>
          <ul className="space-y-2">
            {Object.values(SOURCES).map((source) => (
              <li key={source.url}>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                >
                  {source.label}
                  <ExternalLink className="size-4 shrink-0" aria-hidden />
                  <span className="sr-only">{t('opensInNewTab')}</span>
                </a>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title={t('assistantTitle')}>
          <p className="text-sm leading-relaxed text-muted-foreground">{t('assistantText')}</p>
          <Button asChild variant="outline" className="mt-4">
            <Link href="/assistente">
              <MessagesSquare aria-hidden />
              {t('assistantCta')}
            </Link>
          </Button>
        </Panel>
      </div>
    </div>
  );
}

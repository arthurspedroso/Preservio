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
import { Alert } from '@/shared/ui/alert';
import { Button } from '@/shared/ui/button';
import { PageHeader } from '@/shared/ui/page-header';

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
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <PageHeader title={t('title')} description={t('description')} />

      <ul className="grid gap-4 sm:grid-cols-2">
        {tips.map(({ key, icon: Icon }) => (
          <li key={key} className="flex gap-4 rounded-xl border bg-card p-5 shadow-soft">
            <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-secondary text-primary">
              <Icon className="size-5" aria-hidden />
            </span>
            <div>
              <h2 className="font-sans text-base font-semibold tracking-normal text-foreground">
                {t(`tips.${key}.title`)}
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {t(`tips.${key}.text`)}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <section aria-labelledby="official-title" className="mt-12">
        <h2 id="official-title" className="text-2xl font-semibold">
          {t('officialTitle')}
        </h2>
        <ul className="mt-4 space-y-2">
          {Object.values(SOURCES).map((source) => (
            <li key={source.url}>
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline"
              >
                {source.label}
                <ExternalLink className="size-4" aria-hidden />
                <span className="sr-only">{t('opensInNewTab')}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <Alert variant="info" title={t('assistantTitle')} className="mt-10">
        <p>{t('assistantText')}</p>
        <Button asChild variant="outline" size="sm" className="mt-3">
          <Link href="/assistente">
            <MessagesSquare aria-hidden />
            {t('assistantCta')}
          </Link>
        </Button>
      </Alert>
    </div>
  );
}

import Link from 'next/link';
import { ArrowRight, MessageSquareText } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { formatDate, formatRelative } from '@/shared/lib/format';
import { Button } from '@/shared/ui/button';
import { hasOrgResponse, type Report } from '../domain/types';
import { categoryIcons } from './category-icons';
import { StatusBadge } from './status-badge';
import { StatusProgress } from './status-progress';

export function ReportCard({ report }: { report: Report }) {
  const t = useTranslations('reports');
  const Icon = categoryIcons[report.category];
  const href = `/denuncias/${report.protocol}`;

  return (
    <article className="rounded-xl border bg-card p-5 shadow-soft transition-colors hover:border-primary/40">
      <div className="flex items-start justify-between gap-3">
        <p className="font-mono text-xs text-muted-foreground">{report.protocol}</p>
        <StatusBadge status={report.status} />
      </div>

      <h3 className="mt-2 text-lg font-semibold leading-snug">
        <Link href={href} className="rounded hover:underline">
          {report.title}
        </Link>
      </h3>
      <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm text-muted-foreground">
        <Icon className="size-3.5 shrink-0 text-primary" aria-hidden />
        <span>{t(`categories.${report.category}.label`)}</span>
        <span aria-hidden>·</span>
        <span>
          {report.location.city}/{report.location.state}
        </span>
        <span aria-hidden>·</span>
        <span>{t('card.registered', { date: formatDate(report.createdAt) })}</span>
      </p>

      <div className="mt-4">
        <StatusProgress status={report.status} />
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span>{t('card.updated', { when: formatRelative(report.updatedAt) })}</span>
          {hasOrgResponse(report) && (
            <span className="inline-flex items-center gap-1 font-medium text-primary">
              <MessageSquareText className="size-3.5" aria-hidden />
              {t('card.answered')}
            </span>
          )}
        </p>
        <Button asChild variant="outline" size="sm">
          <Link href={href}>
            {t('card.details')}
            <ArrowRight aria-hidden />
          </Link>
        </Button>
      </div>
    </article>
  );
}

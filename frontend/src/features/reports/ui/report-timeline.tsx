import { FilePlus2, MessageSquareText, RefreshCw, type LucideIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { formatDateTime } from '@/shared/lib/format';
import { cn } from '@/shared/lib/utils';
import type { Report, ReportHistoryEntry } from '../domain/types';
import { StatusBadge } from './status-badge';

const icons: Record<ReportHistoryEntry['kind'], LucideIcon> = {
  created: FilePlus2,
  status: RefreshCw,
  response: MessageSquareText,
};

// Histórico de movimentações e respostas, da mais recente para a mais antiga (RF14, RF15, RF16)
export function ReportTimeline({ report }: { report: Report }) {
  const t = useTranslations('reports');
  const entries = [...report.history].reverse();
  const onlyCreated = report.history.length === 1;

  return (
    <section className="rounded-xl border bg-card p-5 shadow-soft">
      <h2 className="font-sans text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        {t('detail.timeline')}
      </h2>

      <ol className="mt-5">
        {entries.map((entry, index) => {
          const Icon = icons[entry.kind];
          const isLast = index === entries.length - 1;
          const author =
            entry.authorRole === 'citizen'
              ? t('timeline.citizenAuthor')
              : (entry.authorName ?? t('timeline.orgAuthor'));

          return (
            <li key={entry.id} className="relative flex gap-4 pb-6 last:pb-0">
              {!isLast && (
                <span
                  className="absolute left-4 top-9 -ml-px h-[calc(100%-2rem)] w-px bg-border"
                  aria-hidden
                />
              )}
              <span
                className={cn(
                  'relative grid size-8 shrink-0 place-items-center rounded-full',
                  entry.kind === 'response'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-primary',
                )}
              >
                <Icon className="size-4" aria-hidden />
              </span>
              <div className="min-w-0 flex-1 pt-0.5">
                <p className="flex flex-wrap items-center gap-2 text-sm font-medium">
                  {entry.kind === 'status' && entry.status ? (
                    <>
                      {t('timeline.statusChanged')}
                      <StatusBadge status={entry.status} />
                    </>
                  ) : (
                    t(`timeline.${entry.kind}`)
                  )}
                </p>
                <p className="text-xs text-muted-foreground">
                  {author} · {formatDateTime(entry.createdAt)}
                </p>
                {entry.message && (
                  <p className="mt-2 whitespace-pre-line rounded-lg bg-muted/60 p-3 text-sm leading-relaxed">
                    {entry.message}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      {onlyCreated && (
        <p className="mt-4 rounded-lg bg-muted/60 p-3 text-sm text-muted-foreground">
          {t('detail.timelineEmpty')}
        </p>
      )}
    </section>
  );
}

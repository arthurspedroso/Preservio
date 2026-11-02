'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Inbox, SearchX } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { formatDate } from '@/shared/lib/format';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { EmptyState } from '@/shared/ui/empty-state';
import { ErrorState } from '@/shared/ui/error-state';
import { PageHeader } from '@/shared/ui/page-header';
import { Skeleton } from '@/shared/ui/skeleton';
import { useReportsQuery } from '../../application/use-reports';
import { applyFilters, countByStatus, DEFAULT_FILTERS } from '../../domain/filter-reports';
import { REPORT_STATUSES, type Report } from '../../domain/types';
import { categoryIcons } from '../category-icons';
import { ReportFilters } from '../report-filters';
import { StatusBadge, statusIcons } from '../status-badge';

function ReportsTable({ reports }: { reports: Report[] }) {
  const t = useTranslations('reports.admin');
  const tr = useTranslations('reports');

  return (
    <div className="hidden overflow-hidden rounded-xl border bg-card shadow-soft md:block">
      <table className="w-full text-sm">
        <caption className="sr-only">{t('tableCaption')}</caption>
        <thead className="bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            <th scope="col" className="px-4 py-3 font-medium">
              {t('protocol')}
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              {t('titleColumn')}
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              {t('location')}
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              {t('receivedAt')}
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              {t('status')}
            </th>
            <th scope="col" className="px-4 py-3 text-right font-medium">
              {t('actions')}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {reports.map((report) => {
            const Icon = categoryIcons[report.category];
            return (
              <tr key={report.id} className="transition-colors hover:bg-muted/40">
                <td className="whitespace-nowrap px-4 py-3 font-mono text-xs">{report.protocol}</td>
                <td className="max-w-[18rem] px-4 py-3">
                  <p className="truncate font-medium" title={report.title}>
                    {report.title}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Icon className="size-3.5 text-primary" aria-hidden />
                    {tr(`categories.${report.category}.label`)}
                  </p>
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  {report.location.city}/{report.location.state}
                </td>
                <td className="whitespace-nowrap px-4 py-3">{formatDate(report.createdAt)}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={report.status} />
                </td>
                <td className="px-4 py-3 text-right">
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/admin/denuncias/${report.protocol}`}>
                      {t('view')}
                      <span className="sr-only"> {report.protocol}</span>
                    </Link>
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// No celular a tabela vira lista de cartões (sem rolagem horizontal)
function ReportsCards({ reports }: { reports: Report[] }) {
  const t = useTranslations('reports.admin');

  return (
    <ul className="space-y-3 md:hidden">
      {reports.map((report) => (
        <li key={report.id} className="rounded-xl border bg-card p-4 shadow-soft">
          <div className="flex items-start justify-between gap-2">
            <p className="font-mono text-xs text-muted-foreground">{report.protocol}</p>
            <StatusBadge status={report.status} />
          </div>
          <p className="mt-2 font-medium leading-snug">{report.title}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {report.location.city}/{report.location.state} · {formatDate(report.createdAt)}
          </p>
          <Button asChild size="sm" variant="outline" className="mt-3 w-full">
            <Link href={`/admin/denuncias/${report.protocol}`}>
              {t('view')}
              <span className="sr-only"> {report.protocol}</span>
            </Link>
          </Button>
        </li>
      ))}
    </ul>
  );
}

export function AdminDashboard() {
  const t = useTranslations('reports.admin');
  const tr = useTranslations('reports');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const { data, isPending, isError, refetch } = useReportsQuery();
  const visible = useMemo(() => (data ? applyFilters(data, filters) : []), [data, filters]);
  const counts = useMemo(() => (data ? countByStatus(data) : null), [data]);

  return (
    <>
      <PageHeader title={t('title')} description={t('description')} />

      <div className="space-y-6">
        {/* Os números vêm dos registros; clicar em um filtra a lista por aquele status */}
        <section aria-label={t('summary')}>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            <li>
              <button
                type="button"
                onClick={() => setFilters({ ...filters, status: 'all' })}
                aria-pressed={filters.status === 'all'}
                className={cn(
                  'flex h-full w-full flex-col rounded-xl border bg-card p-4 text-left shadow-soft transition-colors hover:border-primary/40',
                  filters.status === 'all' && 'border-primary ring-1 ring-primary',
                )}
              >
                <Inbox className="size-4 text-primary" aria-hidden />
                <span className="mt-2 text-3xl font-semibold tabular-nums">
                  {counts ? data?.length : <Skeleton className="h-9 w-10" />}
                </span>
                <span className="text-xs text-muted-foreground">{t('total')}</span>
              </button>
            </li>
            {REPORT_STATUSES.map((status) => {
              const Icon = statusIcons[status];
              const active = filters.status === status;
              return (
                <li key={status}>
                  <button
                    type="button"
                    onClick={() => setFilters({ ...filters, status: active ? 'all' : status })}
                    aria-pressed={active}
                    aria-label={t('filterByCard', { status: tr(`status.${status}.label`) })}
                    className={cn(
                      'flex h-full w-full flex-col rounded-xl border bg-card p-4 text-left shadow-soft transition-colors hover:border-primary/40',
                      active && 'border-primary ring-1 ring-primary',
                    )}
                  >
                    <Icon className="size-4 text-primary" aria-hidden />
                    <span className="mt-2 text-3xl font-semibold tabular-nums">
                      {counts ? counts[status] : <Skeleton className="h-9 w-10" />}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {tr(`status.${status}.label`)}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        <h2 className="text-2xl font-semibold">{t('listTitle')}</h2>

        {isPending && (
          <div className="space-y-3" aria-busy="true">
            <Skeleton className="h-28 w-full rounded-xl" />
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
        )}
        {isError && <ErrorState onRetry={() => refetch()} />}
        {data?.length === 0 && (
          <EmptyState icon={Inbox} title={t('emptyTitle')} description={t('emptyText')} />
        )}

        {data && data.length > 0 && (
          <>
            <ReportFilters
              idPrefix="admin"
              filters={filters}
              onChange={setFilters}
              showPeriod
              shown={visible.length}
              total={data.length}
            />
            {visible.length === 0 ? (
              <EmptyState
                icon={SearchX}
                title={t('noResultsTitle')}
                description={t('noResultsText')}
                action={
                  <Button variant="outline" onClick={() => setFilters(DEFAULT_FILTERS)}>
                    {tr('filters.clear')}
                  </Button>
                }
              />
            ) : (
              <>
                <ReportsTable reports={visible} />
                <ReportsCards reports={visible} />
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}

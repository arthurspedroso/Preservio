'use client';

import { useMemo, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { ArrowRight, Inbox, SearchX, type LucideIcon } from 'lucide-react';
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

interface SummaryCardProps {
  icon: LucideIcon;
  label: string;
  value: ReactNode;
  active: boolean;
  ariaLabel?: string;
  onClick: () => void;
}

function SummaryCard({ icon: Icon, label, value, active, ariaLabel, onClick }: SummaryCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={ariaLabel}
      className={cn(
        'flex h-full w-full flex-col rounded-xl border bg-card p-4 text-left shadow-soft transition-colors hover:border-primary/40',
        active && 'border-primary bg-secondary/50',
      )}
    >
      <span className="flex items-center justify-between gap-2">
        <span className="font-display text-2xl font-bold tabular-nums text-brand">{value}</span>
        <Icon className="size-4 shrink-0 text-primary" aria-hidden />
      </span>
      <span className="mt-1 text-xs text-muted-foreground">{label}</span>
    </button>
  );
}

// Em telas médias a coluna "Local" vai para baixo do título, para a tabela caber sem estourar
function ReportsTable({ reports }: { reports: Report[] }) {
  const t = useTranslations('reports.admin');
  const tr = useTranslations('reports');

  return (
    <div className="hidden overflow-x-auto rounded-xl border bg-card shadow-soft lg:block">
      <table className="w-full text-sm">
        <caption className="sr-only">{t('tableCaption')}</caption>
        <thead className="border-b bg-muted/50 text-left text-xs text-muted-foreground">
          <tr>
            <th scope="col" className="px-4 py-3 font-medium">
              {t('protocol')}
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              {t('titleColumn')}
            </th>
            <th scope="col" className="hidden px-4 py-3 font-medium xl:table-cell">
              {t('location')}
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              {t('receivedAt')}
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              {t('status')}
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              <span className="sr-only">{t('actions')}</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {reports.map((report) => {
            const Icon = categoryIcons[report.category];
            return (
              <tr key={report.id} className="transition-colors hover:bg-muted/40">
                <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-muted-foreground">
                  {report.protocol}
                </td>
                {/* w-full + max-w-0: a coluna ocupa a sobra e o título trunca em vez de empurrar */}
                <td className="w-full max-w-0 px-4 py-3">
                  <p className="truncate font-medium" title={report.title}>
                    {report.title}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-muted-foreground">
                    <Icon className="size-3.5 shrink-0 text-primary" aria-hidden />
                    {tr(`categories.${report.category}.label`)}
                    <span className="xl:hidden">
                      · {report.location.city}/{report.location.state}
                    </span>
                  </p>
                </td>
                <td className="hidden whitespace-nowrap px-4 py-3 xl:table-cell">
                  {report.location.city}/{report.location.state}
                </td>
                <td className="whitespace-nowrap px-4 py-3">{formatDate(report.createdAt)}</td>
                <td className="whitespace-nowrap px-4 py-3">
                  <StatusBadge status={report.status} />
                </td>
                <td className="px-3 py-2 text-right">
                  <Button asChild size="icon-sm" variant="ghost" title={t('view')}>
                    <Link href={`/admin/denuncias/${report.protocol}`}>
                      <ArrowRight aria-hidden />
                      <span className="sr-only">
                        {t('view')} {report.protocol}
                      </span>
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

// Abaixo de lg a tabela vira lista de cartões (sem rolagem horizontal)
function ReportsCards({ reports }: { reports: Report[] }) {
  const t = useTranslations('reports.admin');

  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:hidden">
      {reports.map((report) => (
        <li
          key={report.id}
          className="flex flex-col rounded-xl border bg-card p-4 shadow-soft transition-colors hover:border-primary/40"
        >
          <div className="flex items-start justify-between gap-2">
            <p className="font-mono text-xs text-muted-foreground">{report.protocol}</p>
            <StatusBadge status={report.status} />
          </div>
          <p className="mt-2 font-medium leading-snug">{report.title}</p>
          <p className="mb-3 mt-1 text-xs text-muted-foreground">
            {report.location.city}/{report.location.state} · {formatDate(report.createdAt)}
          </p>
          <Button asChild size="sm" variant="outline" className="mt-auto w-full">
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
              <SummaryCard
                icon={Inbox}
                label={t('total')}
                value={counts ? data?.length : <Skeleton className="h-8 w-10" />}
                active={filters.status === 'all'}
                onClick={() => setFilters({ ...filters, status: 'all' })}
              />
            </li>
            {REPORT_STATUSES.map((status) => {
              const active = filters.status === status;
              return (
                <li key={status}>
                  <SummaryCard
                    icon={statusIcons[status]}
                    label={tr(`status.${status}.label`)}
                    value={counts ? counts[status] : <Skeleton className="h-8 w-10" />}
                    active={active}
                    ariaLabel={t('filterByCard', { status: tr(`status.${status}.label`) })}
                    onClick={() => setFilters({ ...filters, status: active ? 'all' : status })}
                  />
                </li>
              );
            })}
          </ul>
        </section>

        <h2 className="text-xl font-semibold">{t('listTitle')}</h2>

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

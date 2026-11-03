'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { FilePlus2, Files, SearchX } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/shared/ui/button';
import { EmptyState } from '@/shared/ui/empty-state';
import { ErrorState } from '@/shared/ui/error-state';
import { PageHeader } from '@/shared/ui/page-header';
import { Skeleton } from '@/shared/ui/skeleton';
import { useReportsQuery } from '../../application/use-reports';
import { applyFilters, DEFAULT_FILTERS } from '../../domain/filter-reports';
import { ReportCard } from '../report-card';
import { ReportFilters } from '../report-filters';

export function MyReports() {
  const t = useTranslations('reports.list');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const { data, isPending, isError, refetch } = useReportsQuery();
  const visible = useMemo(() => (data ? applyFilters(data, filters) : []), [data, filters]);

  return (
    <>
      <PageHeader
        title={t('title')}
        description={t('description')}
        actions={
          <Button asChild>
            <Link href="/denuncias/nova">
              <FilePlus2 aria-hidden />
              {t('new')}
            </Link>
          </Button>
        }
      />

      <div className="space-y-5">
        {isPending && (
          <div className="space-y-4" aria-busy="true">
            <Skeleton className="h-36 w-full rounded-xl" />
            <Skeleton className="h-40 w-full rounded-xl" />
            <Skeleton className="h-40 w-full rounded-xl" />
          </div>
        )}
        {isError && <ErrorState onRetry={() => refetch()} />}

        {data?.length === 0 && (
          <EmptyState
            icon={Files}
            title={t('emptyTitle')}
            description={t('emptyText')}
            action={
              <Button asChild size="lg">
                <Link href="/denuncias/nova">{t('emptyAction')}</Link>
              </Button>
            }
          />
        )}

        {data && data.length > 0 && (
          <>
            <ReportFilters
              idPrefix="mine"
              filters={filters}
              onChange={setFilters}
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
                    {t('clear')}
                  </Button>
                }
              />
            ) : (
              <ul className="space-y-4">
                {visible.map((report) => (
                  <li key={report.id}>
                    <ReportCard report={report} />
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </>
  );
}

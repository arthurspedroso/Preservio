'use client';

import Link from 'next/link';
import { ArrowLeft, FileX2, Info } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ApiError } from '@/shared/infrastructure/http-client';
import { Button } from '@/shared/ui/button';
import { EmptyState } from '@/shared/ui/empty-state';
import { ErrorState } from '@/shared/ui/error-state';
import { Skeleton } from '@/shared/ui/skeleton';
import { useReportQuery } from '../../application/use-reports';
import { ReportDetails } from '../report-details';
import { ReportTimeline } from '../report-timeline';
import { StatusBadge } from '../status-badge';
import { StatusStepper } from '../status-stepper';

export function CitizenReportDetail({ protocol }: { protocol: string }) {
  const t = useTranslations('reports.detail');
  const { data: report, isPending, error, refetch } = useReportQuery(protocol);

  if (error instanceof ApiError && error.status === 404) {
    return (
      <EmptyState
        icon={FileX2}
        title={t('notFoundTitle')}
        description={t('notFoundText')}
        action={
          <Button asChild variant="outline">
            <Link href="/denuncias">{t('backToList')}</Link>
          </Button>
        }
      />
    );
  }
  if (error) return <ErrorState onRetry={() => refetch()} />;

  return (
    <>
      <Link
        href="/denuncias"
        className="mb-5 inline-flex items-center gap-1.5 rounded text-sm font-medium text-primary hover:underline"
      >
        <ArrowLeft className="size-4" aria-hidden />
        {t('back')}
      </Link>

      {isPending || !report ? (
        <div className="space-y-4" aria-busy="true">
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-20 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      ) : (
        <div className="space-y-6">
          <header className="space-y-3">
            <p className="font-mono text-sm text-muted-foreground">{report.protocol}</p>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h1 className="max-w-3xl text-3xl font-semibold sm:text-4xl">{report.title}</h1>
              <StatusBadge status={report.status} className="mt-1.5 px-3 py-1 text-sm" />
            </div>
          </header>

          <StatusStepper status={report.status} />

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
            <ReportDetails report={report} />
            <div className="space-y-4">
              <ReportTimeline report={report} />
              <p className="flex gap-2.5 rounded-xl bg-muted/60 p-4 text-xs leading-relaxed text-muted-foreground">
                <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
                {t('readOnly')}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

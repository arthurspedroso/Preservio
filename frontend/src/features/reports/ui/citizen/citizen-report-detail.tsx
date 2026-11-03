'use client';

import Link from 'next/link';
import { FileX2, Info } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ApiError } from '@/shared/infrastructure/http-client';
import { Button } from '@/shared/ui/button';
import { EmptyState } from '@/shared/ui/empty-state';
import { ErrorState } from '@/shared/ui/error-state';
import { Skeleton } from '@/shared/ui/skeleton';
import { useReportQuery } from '../../application/use-reports';
import { ReportDetails } from '../report-details';
import { ReportBackLink, ReportHeader } from '../report-header';
import { ReportTimeline } from '../report-timeline';
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
      <ReportBackLink href="/denuncias" label={t('back')} />

      {isPending || !report ? (
        <div className="space-y-4" aria-busy="true">
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-20 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      ) : (
        <div className="space-y-6">
          <ReportHeader report={report} />

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

'use client';

import Link from 'next/link';
import { ArrowLeft, FileX2, ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ApiError } from '@/shared/infrastructure/http-client';
import { formatDateTime } from '@/shared/lib/format';
import { Button } from '@/shared/ui/button';
import { EmptyState } from '@/shared/ui/empty-state';
import { ErrorState } from '@/shared/ui/error-state';
import { Skeleton } from '@/shared/ui/skeleton';
import { useReportQuery } from '../../application/use-reports';
import { ReportDetails } from '../report-details';
import { ReportTimeline } from '../report-timeline';
import { StatusBadge } from '../status-badge';
import { StatusStepper } from '../status-stepper';
import { IdentityCard } from './identity-card';
import { StatusActions } from './status-actions';

export function AdminReportDetail({ protocol }: { protocol: string }) {
  const t = useTranslations('reports.adminDetail');
  const { data: report, isPending, error, refetch } = useReportQuery(protocol);

  if (error instanceof ApiError && error.status === 404) {
    return (
      <EmptyState
        icon={FileX2}
        title={t('notFoundTitle')}
        description={t('notFoundText')}
        action={
          <Button asChild variant="outline">
            <Link href="/admin">{t('back')}</Link>
          </Button>
        }
      />
    );
  }
  if (error) return <ErrorState onRetry={() => refetch()} />;

  return (
    <>
      <Link
        href="/admin"
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

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_23rem] lg:items-start">
            <div className="space-y-5">
              <ReportDetails report={report} />
              <ReportTimeline report={report} />
            </div>

            <div className="space-y-5">
              <IdentityCard report={report} />
              <StatusActions report={report} />
              <section className="rounded-xl border bg-card p-5 shadow-soft">
                <h2 className="flex items-center gap-2 font-sans text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  <ShieldCheck className="size-4" aria-hidden />
                  {t('accessLog')}
                </h2>
                {report.accessLog?.length ? (
                  <ul className="mt-3 space-y-2 text-sm">
                    {report.accessLog.map((entry) => (
                      <li key={entry.id}>
                        {t('accessLogEntry', { name: entry.adminName })}
                        <span className="block text-xs text-muted-foreground">
                          {formatDateTime(entry.at)}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 text-sm text-muted-foreground">{t('accessLogEmpty')}</p>
                )}
              </section>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

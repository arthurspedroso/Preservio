'use client';

import Link from 'next/link';
import { FileX2, ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ApiError } from '@/shared/infrastructure/http-client';
import { formatDateTime } from '@/shared/lib/format';
import { Button } from '@/shared/ui/button';
import { EmptyState } from '@/shared/ui/empty-state';
import { ErrorState } from '@/shared/ui/error-state';
import { Panel } from '@/shared/ui/panel';
import { Skeleton } from '@/shared/ui/skeleton';
import { useReportQuery } from '../../application/use-reports';
import { ReportDetails } from '../report-details';
import { ReportBackLink, ReportHeader } from '../report-header';
import { ReportTimeline } from '../report-timeline';
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
      <ReportBackLink href="/admin" label={t('back')} />

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

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_21rem] lg:items-start">
            <div className="space-y-5">
              <ReportDetails report={report} />
              <ReportTimeline report={report} />
            </div>

            <div className="space-y-5">
              <IdentityCard report={report} />
              <StatusActions report={report} />
              <Panel title={t('accessLog')} icon={ShieldCheck}>
                {report.accessLog?.length ? (
                  <ul className="space-y-2 text-sm">
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
                  <p className="text-sm text-muted-foreground">{t('accessLogEmpty')}</p>
                )}
              </Panel>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

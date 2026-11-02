'use client';

import Link from 'next/link';
import { ArrowRight, BookOpen, FilePlus2, Files, MessagesSquare } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useSessionStore } from '@/features/auth/application/session-store';
import { Alert } from '@/shared/ui/alert';
import { Button } from '@/shared/ui/button';
import { EmptyState } from '@/shared/ui/empty-state';
import { ErrorState } from '@/shared/ui/error-state';
import { PageHeader } from '@/shared/ui/page-header';
import { Skeleton } from '@/shared/ui/skeleton';
import { useReportsQuery } from '../../application/use-reports';
import { hasOrgResponse, isFinalStatus } from '../../domain/types';
import { ReportCard } from '../report-card';

const helpCards = [
  { key: 'assistant', href: '/assistente', icon: MessagesSquare },
  { key: 'guidance', href: '/orientacoes', icon: BookOpen },
] as const;

export function CitizenDashboard() {
  const t = useTranslations('reports.dashboard');
  const name = useSessionStore((s) => s.user?.name ?? '');
  const { data, isPending, isError, refetch } = useReportsQuery();

  const inProgress = data?.filter((r) => !isFinalStatus(r.status)) ?? [];
  const answered = data?.filter(hasOrgResponse).length ?? 0;
  const isEmpty = data?.length === 0;

  return (
    <>
      <PageHeader
        title={t('greeting', { name: name.split(' ')[0] })}
        description={
          data && data.length > 0
            ? t('summary', { total: data.length, answered })
            : t('description')
        }
      />

      <div className="space-y-10">
        {!isEmpty && (
          <section
            aria-labelledby="cta-title"
            className="flex flex-col gap-5 rounded-2xl bg-brand p-6 text-brand-foreground sm:flex-row sm:items-center sm:justify-between sm:p-8"
          >
            <div className="max-w-xl">
              <h2 id="cta-title" className="text-2xl font-semibold !text-brand-foreground">
                {t('ctaTitle')}
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-brand-foreground/85">
                {t('ctaText')}
              </p>
            </div>
            <Button asChild variant="inverse" size="lg" className="shrink-0">
              <Link href="/denuncias/nova">
                <FilePlus2 aria-hidden />
                {t('ctaButton')}
              </Link>
            </Button>
          </section>
        )}

        <section aria-labelledby="in-progress-title">
          <div className="mb-4 flex items-end justify-between gap-3">
            <h2 id="in-progress-title" className="text-2xl font-semibold">
              {t('inProgress')}
            </h2>
            {!isEmpty && (
              <Link href="/denuncias" className="text-sm font-medium text-primary hover:underline">
                {t('viewAll')}
              </Link>
            )}
          </div>

          {isPending && (
            <div className="space-y-4" aria-busy="true">
              <Skeleton className="h-40 w-full rounded-xl" />
              <Skeleton className="h-40 w-full rounded-xl" />
            </div>
          )}
          {isError && <ErrorState onRetry={() => refetch()} />}
          {isEmpty && (
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
          {data && data.length > 0 && inProgress.length === 0 && (
            <Alert variant="success">{t('allDone')}</Alert>
          )}
          {inProgress.length > 0 && (
            <ul className="space-y-4">
              {inProgress.slice(0, 3).map((report) => (
                <li key={report.id}>
                  <ReportCard report={report} />
                </li>
              ))}
            </ul>
          )}
        </section>

        <section aria-labelledby="help-title">
          <h2 id="help-title" className="mb-4 text-2xl font-semibold">
            {t('helpTitle')}
          </h2>
          <ul className="grid gap-4 sm:grid-cols-2">
            {helpCards.map(({ key, href, icon: Icon }) => (
              <li key={key}>
                <Link
                  href={href}
                  className="group flex h-full items-start gap-4 rounded-xl border bg-card p-5 shadow-soft transition-colors hover:border-primary/40"
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-secondary text-primary">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold">{t(`${key}Title`)}</span>
                    <span className="mt-0.5 block text-sm text-muted-foreground">
                      {t(`${key}Text`)}
                    </span>
                  </span>
                  <ArrowRight
                    className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}

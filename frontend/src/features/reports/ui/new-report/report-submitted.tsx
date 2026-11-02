'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, Copy } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { formatDateTime } from '@/shared/lib/format';
import { Button } from '@/shared/ui/button';
import { toast } from '@/shared/ui/toaster';
import type { Report } from '../../domain/types';
import { categoryIcons } from '../category-icons';
import { StatusBadge } from '../status-badge';

const NEXT_STEPS = 3;

export function ReportSubmitted({ report }: { report: Report }) {
  const t = useTranslations('reports.new.submitted');
  const tc = useTranslations('reports.categories');
  const headingRef = useRef<HTMLHeadingElement>(null);
  const CategoryIcon = categoryIcons[report.category];

  // Leva o foco (e o leitor de tela) direto para a confirmação
  useEffect(() => headingRef.current?.focus(), []);

  const copyProtocol = async () => {
    try {
      await navigator.clipboard.writeText(report.protocol);
      toast.success(t('copied'));
    } catch {
      toast.error(t('copyFailed'));
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-xl border bg-card p-6 text-center shadow-soft sm:p-10">
        <span className="mx-auto grid size-16 animate-pop-in place-items-center rounded-full bg-primary text-primary-foreground">
          <Check className="size-8" strokeWidth={2.5} aria-hidden />
        </span>
        <h1
          ref={headingRef}
          tabIndex={-1}
          className="mt-6 text-2xl font-bold focus:outline-none sm:text-3xl"
        >
          {t('title')}
        </h1>
        <p className="mt-2 text-muted-foreground">{t('description')}</p>

        <div className="mt-8 rounded-xl border border-dashed border-primary/40 bg-secondary/40 p-5">
          <p className="text-xs font-medium text-muted-foreground">{t('protocolLabel')}</p>
          <div className="mt-1 flex items-center justify-center gap-2">
            <p className="font-mono text-2xl font-semibold tracking-wider text-brand sm:text-3xl">
              {report.protocol}
            </p>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={copyProtocol}
              aria-label={t('copy')}
            >
              <Copy aria-hidden />
            </Button>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{t('protocolHint')}</p>
        </div>

        <dl className="mt-6 grid gap-4 text-left sm:grid-cols-2">
          <div className="sm:col-span-2">
            <dt className="text-xs text-muted-foreground">{t('summary')}</dt>
            <dd className="mt-0.5 flex items-center gap-2 font-medium">
              <CategoryIcon className="size-4 shrink-0 text-primary" aria-hidden />
              {report.title}
            </dd>
            <dd className="text-sm text-muted-foreground">{tc(`${report.category}.label`)}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">{t('registeredAt')}</dt>
            <dd className="mt-0.5 text-sm">{formatDateTime(report.createdAt)}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">{t('status')}</dt>
            <dd className="mt-1">
              <StatusBadge status={report.status} />
            </dd>
          </div>
        </dl>

        <div className="mt-8 text-left">
          <h2 className="text-sm font-semibold text-foreground">{t('nextTitle')}</h2>
          <ol className="mt-3 space-y-3">
            {Array.from({ length: NEXT_STEPS }, (_, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground">
                  {i + 1}
                </span>
                <span className="leading-relaxed text-muted-foreground">{t(`next.${i}`)}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-10 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
          <Button asChild variant="outline" size="lg">
            <Link href="/painel">{t('backToDashboard')}</Link>
          </Button>
          <Button asChild size="lg">
            <Link href={`/denuncias/${report.protocol}`}>
              {t('follow')}
              <ArrowRight aria-hidden />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

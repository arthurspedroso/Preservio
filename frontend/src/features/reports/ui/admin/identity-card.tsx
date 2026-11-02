'use client';

import { useState } from 'react';
import { Eye, EyeOff, LockKeyhole } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ApiError } from '@/shared/infrastructure/http-client';
import { Button } from '@/shared/ui/button';
import { ConfirmDialog } from '@/shared/ui/confirm-dialog';
import { Skeleton } from '@/shared/ui/skeleton';
import { toast } from '@/shared/ui/toaster';
import { useIdentityQuery, useRevealCpf } from '../../application/use-reports';
import type { Report } from '../../domain/types';

// Minimização de dados (RNF02): CPF mascarado; ver o completo exige confirmar e fica registrado
export function IdentityCard({ report }: { report: Report }) {
  const t = useTranslations('reports.adminDetail');
  const { data: identity, isPending } = useIdentityQuery(report.id);
  const reveal = useRevealCpf(report.id);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [cpf, setCpf] = useState<string | null>(null);

  const confirm = () =>
    reveal.mutate(undefined, {
      onSuccess: ({ cpf: full }) => {
        setCpf(full);
        setConfirmOpen(false);
        toast.success(t('revealed'));
      },
      onError: (error) => {
        setConfirmOpen(false);
        toast.error(error instanceof ApiError ? error.message : t('errorTitle'));
      },
    });

  return (
    <section className="rounded-xl border bg-card p-5 shadow-soft">
      <h2 className="flex items-center gap-2 font-sans text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        <LockKeyhole className="size-4" aria-hidden />
        {t('reporter')}
      </h2>
      <p className="mt-1 text-xs text-muted-foreground">{t('reporterNote')}</p>

      {isPending || !identity ? (
        <div className="mt-4 space-y-3" aria-busy="true">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ) : (
        <dl className="mt-4 space-y-3 text-sm">
          <div>
            <dt className="text-xs text-muted-foreground">{t('name')}</dt>
            <dd className="font-medium">{identity.name}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">{t('email')}</dt>
            <dd className="break-all">{identity.email}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">{t('phone')}</dt>
            <dd>
              {identity.phone ?? <span className="text-muted-foreground">{t('noPhone')}</span>}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">{t('cpf')}</dt>
            <dd className="flex flex-wrap items-center gap-2">
              <span className="font-mono">{cpf ?? identity.cpfMasked}</span>
              {cpf ? (
                <Button variant="ghost" size="sm" onClick={() => setCpf(null)}>
                  <EyeOff aria-hidden />
                  {t('hideCpf')}
                </Button>
              ) : (
                <Button variant="outline" size="sm" onClick={() => setConfirmOpen(true)}>
                  <Eye aria-hidden />
                  {t('revealCpf')}
                </Button>
              )}
            </dd>
          </div>
        </dl>
      )}

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={t('revealTitle')}
        description={t('revealText')}
        confirmLabel={t('revealConfirm')}
        loading={reveal.isPending}
        onConfirm={confirm}
      />
    </section>
  );
}

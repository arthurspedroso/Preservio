'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ApiError } from '@/shared/infrastructure/http-client';
import { Alert } from '@/shared/ui/alert';
import { Button } from '@/shared/ui/button';
import { ConfirmDialog } from '@/shared/ui/confirm-dialog';
import { FormField } from '@/shared/ui/form-field';
import { Select } from '@/shared/ui/select';
import { Spinner } from '@/shared/ui/spinner';
import { Textarea } from '@/shared/ui/textarea';
import { toast } from '@/shared/ui/toaster';
import { useRespond, useUpdateStatus } from '../../application/use-reports';
import {
  ALLOWED_TRANSITIONS,
  isFinalStatus,
  type Report,
  type ReportStatus,
} from '../../domain/types';
import { StatusBadge } from '../status-badge';

const MIN_NOTE = 10;

function ChangeStatus({ report }: { report: Report }) {
  const t = useTranslations('reports.adminDetail');
  const ts = useTranslations('reports.status');
  const update = useUpdateStatus(report.id);
  const [next, setNext] = useState<ReportStatus | ''>('');
  const [note, setNote] = useState('');
  const [noteError, setNoteError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (isFinalStatus(report.status)) {
    return <Alert variant="info">{t('finished')}</Alert>;
  }

  const open = () => {
    if (next === 'not_upheld' && note.trim().length < MIN_NOTE) {
      setNoteError(t('noteRequired'));
      return;
    }
    setNoteError(null);
    setConfirmOpen(true);
  };

  const confirm = () =>
    update.mutate(
      { status: next as ReportStatus, message: note },
      {
        onSuccess: () => {
          toast.success(t('statusUpdated', { status: ts(`${next}.label`) }));
          setConfirmOpen(false);
          setNext('');
          setNote('');
        },
        onError: () => setConfirmOpen(false),
      },
    );

  const error =
    update.error instanceof ApiError ? update.error.message : update.error ? t('errorTitle') : null;

  return (
    <div className="space-y-4">
      <FormField id="new-status" label={t('newStatus')}>
        {(field) => (
          <Select
            {...field}
            value={next}
            onChange={(e) => {
              setNext(e.target.value as ReportStatus | '');
              setNoteError(null);
              update.reset();
            }}
          >
            <option value="">{t('selectStatus')}</option>
            {ALLOWED_TRANSITIONS[report.status].map((status) => (
              <option key={status} value={status}>
                {ts(`${status}.label`)}
              </option>
            ))}
          </Select>
        )}
      </FormField>

      <FormField
        id="status-note"
        label={t('note')}
        optional={next !== 'not_upheld'}
        required={next === 'not_upheld'}
        hint={t('noteHint')}
        error={noteError ?? undefined}
      >
        {(field) => (
          <Textarea
            {...field}
            rows={3}
            value={note}
            maxLength={1000}
            onChange={(e) => {
              setNote(e.target.value);
              setNoteError(null);
            }}
          />
        )}
      </FormField>

      {error && (
        <Alert variant="destructive" title={t('errorTitle')}>
          {error}
        </Alert>
      )}

      <Button className="w-full" disabled={!next} onClick={open}>
        {t('applyStatus')}
      </Button>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={t('confirmTitle')}
        description={t('confirmText')}
        confirmLabel={t('confirmAction')}
        loading={update.isPending}
        onConfirm={confirm}
      >
        {next && (
          <div className="flex items-center gap-2 text-sm">
            <StatusBadge status={report.status} />
            <span aria-hidden>→</span>
            <StatusBadge status={next} />
          </div>
        )}
      </ConfirmDialog>
    </div>
  );
}

function RespondForm({ report }: { report: Report }) {
  const t = useTranslations('reports.adminDetail');
  const respond = useRespond(report.id);
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    if (message.trim().length < MIN_NOTE) {
      setError(t('respondMin'));
      return;
    }
    setError(null);
    respond.mutate(message, {
      onSuccess: () => {
        toast.success(t('responseSent'));
        setMessage('');
      },
    });
  };

  const submitError =
    respond.error instanceof ApiError
      ? respond.error.message
      : respond.error
        ? t('errorTitle')
        : null;

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className="space-y-4"
    >
      <FormField
        id="response-message"
        label={t('respondLabel')}
        hint={t('respondHint')}
        error={error ?? undefined}
      >
        {(field) => (
          <Textarea
            {...field}
            rows={4}
            value={message}
            maxLength={1000}
            placeholder={t('respondPlaceholder')}
            onChange={(e) => {
              setMessage(e.target.value);
              setError(null);
            }}
          />
        )}
      </FormField>
      {submitError && (
        <Alert variant="destructive" title={t('errorTitle')}>
          {submitError}
        </Alert>
      )}
      <Button type="submit" variant="brand" className="w-full" disabled={respond.isPending}>
        {respond.isPending && <Spinner />}
        {respond.isPending ? t('sending') : t('respondSend')}
      </Button>
    </form>
  );
}

export function StatusActions({ report }: { report: Report }) {
  const t = useTranslations('reports.adminDetail');

  return (
    <div className="space-y-5">
      <section className="rounded-xl border bg-card p-5 shadow-soft">
        <h2 className="mb-4 font-sans text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          {t('changeStatus')}
        </h2>
        <ChangeStatus report={report} />
      </section>
      <section className="rounded-xl border bg-card p-5 shadow-soft">
        <h2 className="mb-4 font-sans text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          {t('respond')}
        </h2>
        <RespondForm report={report} />
      </section>
    </div>
  );
}

'use client';

import { type ReactNode } from 'react';
import { Pencil, Play, ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useFormContext, useWatch } from 'react-hook-form';
import { stateName } from '@/shared/lib/brazil-states';
import { formatDate } from '@/shared/lib/format';
import { Button } from '@/shared/ui/button';
import type { ReportCategory } from '../../domain/types';
import { categoryIcons } from '../category-icons';
import type { ReportFormValues } from './schema';
import type { SelectedFile } from './use-evidence-files';

function ReviewSection({
  title,
  onEdit,
  editLabel,
  children,
}: {
  title: string;
  onEdit: () => void;
  editLabel: string;
  children: ReactNode;
}) {
  const t = useTranslations('reports.new.review');

  return (
    <section className="rounded-xl border bg-card p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="font-sans text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          {title}
        </h3>
        <Button type="button" variant="ghost" size="sm" onClick={onEdit} aria-label={editLabel}>
          <Pencil aria-hidden />
          <span aria-hidden>{t('editShort')}</span>
        </Button>
      </div>
      {children}
    </section>
  );
}

function Item({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-0.5">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-sm">{children}</dd>
    </div>
  );
}

export function StepReview({
  files,
  onEdit,
}: {
  files: SelectedFile[];
  onEdit: (step: number) => void;
}) {
  const t = useTranslations('reports.new.review');
  const tc = useTranslations('reports.categories');
  const { control } = useFormContext<ReportFormValues>();
  const v = useWatch({ control });
  const category = v.category as ReportCategory;
  const CategoryIcon = categoryIcons[category] ?? categoryIcons.other;

  return (
    <div className="space-y-4">
      <ReviewSection
        title={t('occurrence')}
        onEdit={() => onEdit(0)}
        editLabel={t('edit', { section: t('occurrence') })}
      >
        <dl className="space-y-4">
          <Item label={t('category')}>
            <span className="inline-flex items-center gap-2 font-medium">
              <CategoryIcon className="size-4 text-primary" aria-hidden />
              {tc(`${category}.label`)}
            </span>
          </Item>
          <Item label={t('title')}>
            <span className="font-medium">{v.title}</span>
          </Item>
          <Item label={t('description')}>
            <p className="whitespace-pre-line leading-relaxed text-muted-foreground">
              {v.description}
            </p>
          </Item>
        </dl>
      </ReviewSection>

      <ReviewSection
        title={t('location')}
        onEdit={() => onEdit(1)}
        editLabel={t('edit', { section: t('location') })}
      >
        <dl className="grid gap-4 sm:grid-cols-2">
          <Item label={t('date')}>{v.occurredOn ? formatDate(v.occurredOn) : '—'}</Item>
          <Item label={t('city')}>
            {v.city} — {stateName(v.state ?? '')}
          </Item>
          <Item label={t('address')}>{v.address}</Item>
          <Item label={t('reference')}>
            {v.reference?.trim() ? (
              v.reference
            ) : (
              <span className="text-muted-foreground">{t('none')}</span>
            )}
          </Item>
        </dl>
      </ReviewSection>

      <ReviewSection
        title={t('evidence')}
        onEdit={() => onEdit(2)}
        editLabel={t('edit', { section: t('evidence') })}
      >
        {files.length ? (
          <ul className="flex flex-wrap gap-2">
            {files.map(({ id, kind, url, file }) => (
              <li key={id} className="relative size-20 overflow-hidden rounded-lg border bg-muted">
                {kind === 'photo' ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={url} alt={file.name} className="size-full object-cover" />
                ) : (
                  <span
                    className="grid size-full place-items-center text-muted-foreground"
                    title={file.name}
                  >
                    <Play className="size-5" aria-hidden />
                    <span className="sr-only">{file.name}</span>
                  </span>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">{t('noEvidence')}</p>
        )}
      </ReviewSection>

      <p className="flex gap-2.5 rounded-xl bg-secondary/60 p-4 text-sm text-secondary-foreground">
        <ShieldCheck className="mt-0.5 size-4 shrink-0" aria-hidden />
        {t('privacy')}
      </p>
    </div>
  );
}

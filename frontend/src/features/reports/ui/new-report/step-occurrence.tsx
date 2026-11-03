'use client';

import { useTranslations } from 'next-intl';
import { useFormContext, useWatch } from 'react-hook-form';
import { cn } from '@/shared/lib/utils';
import { FormField } from '@/shared/ui/form-field';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';
import { REPORT_CATEGORIES, type ReportCategory } from '../../domain/types';
import { categoryIcons } from '../category-icons';
import { CharCount } from './char-count';
import { LIMITS, type ReportFormValues } from './schema';

export function StepOccurrence() {
  const t = useTranslations('reports.new.occurrence');
  const tc = useTranslations('reports.categories');
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<ReportFormValues>();
  const [category, title, description] = useWatch({
    control,
    name: ['category', 'title', 'description'],
  });

  return (
    <div className="space-y-8">
      {/* Categoria primeiro: decisão simples que dá contexto para o resto do relato */}
      <fieldset aria-describedby={errors.category ? 'category-error' : 'category-hint'}>
        <legend id="category-legend" className="text-sm font-medium">
          {t('categoryLabel')}
          <span className="ml-0.5 text-destructive" aria-hidden>
            *
          </span>
        </legend>
        <p id="category-hint" className="mt-1 text-xs text-muted-foreground">
          {t('categoryHint')}
        </p>
        <div
          role="radiogroup"
          aria-labelledby="category-legend"
          aria-required
          aria-invalid={Boolean(errors.category)}
          className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
        >
          {REPORT_CATEGORIES.map((value) => {
            const Icon = categoryIcons[value];
            const selected = category === value;
            return (
              <label key={value} className="relative block cursor-pointer">
                <input
                  type="radio"
                  value={value}
                  {...register('category')}
                  className="peer sr-only"
                />
                <span
                  className={cn(
                    'flex h-full gap-3 rounded-xl border bg-card p-4 transition-all',
                    'hover:border-primary/40 hover:bg-secondary/40',
                    'peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2',
                    selected && 'border-primary bg-secondary/60 shadow-soft ring-1 ring-primary',
                    errors.category && !selected && 'border-destructive/50',
                  )}
                >
                  <span
                    className={cn(
                      'grid size-10 shrink-0 place-items-center rounded-lg transition-colors',
                      selected ? 'bg-primary text-primary-foreground' : 'bg-secondary text-primary',
                    )}
                  >
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold leading-snug">
                      {tc(`${value}.label`)}
                    </span>
                    <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
                      {tc(`${value}.description`)}
                    </span>
                  </span>
                </span>
              </label>
            );
          })}
        </div>
        {errors.category && (
          <p id="category-error" className="mt-2 text-xs font-medium text-destructive">
            {errors.category.message}
          </p>
        )}
      </fieldset>

      <FormField
        id="report-title"
        label={t('titleLabel')}
        required
        hint={t('titleHint')}
        error={errors.title?.message}
        labelAction={<CharCount value={title} max={LIMITS.title} />}
      >
        {(field) => (
          <Input
            {...field}
            {...register('title')}
            maxLength={LIMITS.title + 20}
            placeholder={t(`titlePlaceholder.${(category as ReportCategory) || 'other'}`)}
          />
        )}
      </FormField>

      <FormField
        id="report-description"
        label={t('descriptionLabel')}
        required
        hint={
          <ul className="list-inside list-disc space-y-0.5">
            <li>{t('descriptionPrompt1')}</li>
            <li>{t('descriptionPrompt2')}</li>
            <li>{t('descriptionPrompt3')}</li>
          </ul>
        }
        error={errors.description?.message}
        labelAction={<CharCount value={description} max={LIMITS.description} />}
      >
        {(field) => (
          <Textarea
            {...field}
            {...register('description')}
            rows={6}
            placeholder={t('descriptionPlaceholder')}
          />
        )}
      </FormField>
    </div>
  );
}

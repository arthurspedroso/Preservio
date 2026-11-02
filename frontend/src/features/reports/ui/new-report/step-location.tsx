'use client';

import { MapPin } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useFormContext, useWatch } from 'react-hook-form';
import { BRAZIL_STATES } from '@/shared/lib/brazil-states';
import { daysAgoLocal, todayLocal } from '@/shared/lib/format';
import { cn } from '@/shared/lib/utils';
import { Alert } from '@/shared/ui/alert';
import { FormField } from '@/shared/ui/form-field';
import { Input } from '@/shared/ui/input';
import { Select } from '@/shared/ui/select';
import { Textarea } from '@/shared/ui/textarea';
import { CharCount } from './char-count';
import { LIMITS, type ReportFormValues } from './schema';

export function StepLocation() {
  const t = useTranslations('reports.new.location');
  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = useFormContext<ReportFormValues>();
  const [occurredOn, reference] = useWatch({ control, name: ['occurredOn', 'reference'] });

  const today = todayLocal();
  const quickDates = [
    { key: 'today', value: today },
    { key: 'yesterday', value: daysAgoLocal(1) },
  ] as const;

  return (
    <div className="space-y-8">
      <section aria-labelledby="when-title" className="space-y-4">
        <h3
          id="when-title"
          className="font-sans text-base font-semibold tracking-normal text-foreground"
        >
          {t('whenTitle')}
        </h3>
        <FormField
          id="report-date"
          label={t('dateLabel')}
          required
          hint={t('dateHint')}
          error={errors.occurredOn?.message}
        >
          {(field) => (
            <div className="flex flex-wrap items-center gap-2">
              <Input
                {...field}
                {...register('occurredOn')}
                type="date"
                max={today}
                min="2000-01-01"
                className="w-auto min-w-44"
              />
              {quickDates.map(({ key, value }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() =>
                    setValue('occurredOn', value, { shouldValidate: true, shouldDirty: true })
                  }
                  aria-pressed={occurredOn === value}
                  className={cn(
                    'h-10 rounded-full border px-4 text-sm transition-colors hover:bg-secondary',
                    occurredOn === value &&
                      'border-primary bg-secondary font-medium text-secondary-foreground',
                  )}
                >
                  {t(`quick.${key}`)}
                </button>
              ))}
            </div>
          )}
        </FormField>
      </section>

      <section aria-labelledby="where-title" className="space-y-5">
        <h3
          id="where-title"
          className="font-sans text-base font-semibold tracking-normal text-foreground"
        >
          {t('whereTitle')}
        </h3>

        <Alert variant="info" title={t('precisionTitle')}>
          {t('precisionText')}
        </Alert>

        <div className="grid gap-5 sm:grid-cols-[minmax(0,14rem)_1fr]">
          <FormField
            id="report-state"
            label={t('stateLabel')}
            required
            error={errors.state?.message}
          >
            {(field) => (
              <Select {...field} {...register('state')}>
                <option value="">{t('statePlaceholder')}</option>
                {BRAZIL_STATES.map(({ uf, name }) => (
                  <option key={uf} value={uf}>
                    {name}
                  </option>
                ))}
              </Select>
            )}
          </FormField>

          <FormField id="report-city" label={t('cityLabel')} required error={errors.city?.message}>
            {(field) => (
              <Input
                {...field}
                {...register('city')}
                autoComplete="address-level2"
                placeholder={t('cityPlaceholder')}
              />
            )}
          </FormField>
        </div>

        <FormField
          id="report-address"
          label={t('addressLabel')}
          required
          hint={t('addressHint')}
          error={errors.address?.message}
        >
          {(field) => (
            <div className="relative">
              <MapPin
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <Input
                {...field}
                {...register('address')}
                className="pl-9"
                autoComplete="street-address"
                placeholder={t('addressPlaceholder')}
              />
            </div>
          )}
        </FormField>

        <FormField
          id="report-reference"
          label={t('referenceLabel')}
          optional
          hint={t('referenceHint')}
          error={errors.reference?.message}
          labelAction={<CharCount value={reference} max={LIMITS.reference} />}
        >
          {(field) => (
            <Textarea
              {...field}
              {...register('reference')}
              rows={3}
              placeholder={t('referencePlaceholder')}
            />
          )}
        </FormField>
      </section>
    </div>
  );
}

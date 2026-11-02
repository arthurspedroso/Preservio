'use client';

import { Search, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { FormField } from '@/shared/ui/form-field';
import { Input } from '@/shared/ui/input';
import { Select } from '@/shared/ui/select';
import {
  DEFAULT_FILTERS,
  hasActiveFilters,
  type Period,
  type ReportFilters as Filters,
  type SortOrder,
} from '../domain/filter-reports';
import { REPORT_STATUSES, type ReportStatus } from '../domain/types';

interface ReportFiltersProps {
  idPrefix: string;
  filters: Filters;
  onChange: (filters: Filters) => void;
  showPeriod?: boolean;
  shown: number;
  total: number;
}

export function ReportFilters({
  idPrefix,
  filters,
  onChange,
  showPeriod,
  shown,
  total,
}: ReportFiltersProps) {
  const t = useTranslations('reports');
  const set = (patch: Partial<Filters>) => onChange({ ...filters, ...patch });

  return (
    <section aria-label={t('filters.label')} className="rounded-xl border bg-card p-4 shadow-soft">
      {/* As colunas seguem a quantidade de campos: nada fica sozinho na linha nem sobra buraco */}
      <div
        className={cn(
          'grid gap-4',
          showPeriod
            ? 'sm:grid-cols-3 xl:grid-cols-[minmax(0,1.6fr)_repeat(3,minmax(0,1fr))]'
            : 'sm:grid-cols-2 lg:grid-cols-[minmax(0,1.6fr)_repeat(2,minmax(0,1fr))]',
        )}
      >
        <FormField
          id={`${idPrefix}-search`}
          label={t('filters.search')}
          className={cn('col-span-full', showPeriod ? 'xl:col-span-1' : 'lg:col-span-1')}
        >
          {(field) => (
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <Input
                {...field}
                type="search"
                value={filters.query}
                onChange={(e) => set({ query: e.target.value })}
                placeholder={t('filters.searchPlaceholder')}
                className="pl-9"
              />
            </div>
          )}
        </FormField>

        <FormField id={`${idPrefix}-status`} label={t('filters.status')}>
          {(field) => (
            <Select
              {...field}
              value={filters.status}
              onChange={(e) => set({ status: e.target.value as ReportStatus | 'all' })}
            >
              <option value="all">{t('filters.allStatuses')}</option>
              {REPORT_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {t(`status.${status}.label`)}
                </option>
              ))}
            </Select>
          )}
        </FormField>

        {showPeriod && (
          <FormField id={`${idPrefix}-period`} label={t('filters.period')}>
            {(field) => (
              <Select
                {...field}
                value={filters.period}
                onChange={(e) => set({ period: e.target.value as Period })}
              >
                <option value="all">{t('filters.periodAll')}</option>
                <option value="7d">{t('filters.period7d')}</option>
                <option value="30d">{t('filters.period30d')}</option>
              </Select>
            )}
          </FormField>
        )}

        <FormField id={`${idPrefix}-sort`} label={t('filters.sort')}>
          {(field) => (
            <Select
              {...field}
              value={filters.sort}
              onChange={(e) => set({ sort: e.target.value as SortOrder })}
            >
              <option value="newest">{t('filters.newest')}</option>
              <option value="oldest">{t('filters.oldest')}</option>
            </Select>
          )}
        </FormField>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {t('filters.results', { shown, total })}
        </p>
        {hasActiveFilters(filters) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onChange({ ...DEFAULT_FILTERS, sort: filters.sort })}
          >
            <X aria-hidden />
            {t('filters.clear')}
          </Button>
        )}
      </div>
    </section>
  );
}

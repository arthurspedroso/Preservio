import type { Report, ReportStatus } from './types';

export type SortOrder = 'newest' | 'oldest';
export type Period = 'all' | '7d' | '30d';

export interface ReportFilters {
  query: string;
  status: ReportStatus | 'all';
  sort: SortOrder;
  period: Period;
}

export const DEFAULT_FILTERS: ReportFilters = {
  query: '',
  status: 'all',
  sort: 'newest',
  period: 'all',
};

export const hasActiveFilters = (f: ReportFilters) =>
  f.query.trim() !== '' || f.status !== 'all' || f.period !== 'all';

// Ignora acentos e maiúsculas: "agua" encontra "Água"
const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim();

const PERIOD_DAYS = { '7d': 7, '30d': 30 } as const;

export function applyFilters(reports: Report[], filters: ReportFilters): Report[] {
  const query = normalize(filters.query);
  const cutoff =
    filters.period === 'all' ? 0 : Date.now() - PERIOD_DAYS[filters.period] * 24 * 60 * 60 * 1000;

  return reports
    .filter((r) => filters.status === 'all' || r.status === filters.status)
    .filter(
      (r) => !query || normalize(r.title).includes(query) || normalize(r.protocol).includes(query),
    )
    .filter((r) => new Date(r.createdAt).getTime() >= cutoff)
    .sort((a, b) => {
      const diff = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return filters.sort === 'newest' ? diff : -diff;
    });
}

export function countByStatus(reports: Report[]): Record<ReportStatus, number> {
  const counts: Record<ReportStatus, number> = {
    received: 0,
    in_review: 0,
    in_progress: 0,
    resolved: 0,
    not_upheld: 0,
  };
  for (const report of reports) counts[report.status]++;
  return counts;
}

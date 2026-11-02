import { CircleCheck, CircleX, FileSearch, Hourglass, Inbox, type LucideIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Badge, type BadgeProps } from '@/shared/ui/badge';
import type { ReportStatus } from '../domain/types';

export const statusIcons: Record<ReportStatus, LucideIcon> = {
  received: Inbox,
  in_review: FileSearch,
  in_progress: Hourglass,
  resolved: CircleCheck,
  not_upheld: CircleX,
};

const statusVariants: Record<ReportStatus, BadgeProps['variant']> = {
  received: 'secondary',
  in_review: 'warning',
  in_progress: 'info',
  resolved: 'success',
  not_upheld: 'destructive',
};

// Cor + ícone + texto: o status nunca é comunicado só pela cor
export function StatusBadge({ status, className }: { status: ReportStatus; className?: string }) {
  const t = useTranslations('reports.status');
  const Icon = statusIcons[status];

  return (
    <Badge variant={statusVariants[status]} className={className}>
      <Icon aria-hidden />
      {t(`${status}.label`)}
    </Badge>
  );
}

import { type ReactNode } from 'react';
import { TriangleAlert } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from './button';

interface ErrorStateProps {
  title?: string;
  description?: ReactNode;
  onRetry?: () => void;
}

export function ErrorState({ title, description, onRetry }: ErrorStateProps) {
  const t = useTranslations('ui.errorState');

  return (
    <div
      role="alert"
      className="flex flex-col items-center rounded-xl border border-destructive/30 bg-destructive/5 px-6 py-10 text-center"
    >
      <span className="mb-3 grid size-11 place-items-center rounded-full bg-destructive/10 text-destructive">
        <TriangleAlert className="size-5" aria-hidden />
      </span>
      <p className="font-display text-lg font-semibold text-brand">{title ?? t('title')}</p>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">
        {description ?? t('description')}
      </p>
      {onRetry && (
        <Button variant="outline" className="mt-5" onClick={onRetry}>
          {t('retry')}
        </Button>
      )}
    </div>
  );
}

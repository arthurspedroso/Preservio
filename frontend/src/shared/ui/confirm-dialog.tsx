'use client';

import { type ReactNode } from 'react';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { useTranslations } from 'next-intl';
import { cn } from '@/shared/lib/utils';
import { Button } from './button';
import { Spinner } from './spinner';

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: ReactNode;
  // Conteúdo extra, como um resumo do que vai mudar
  children?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  loading?: boolean;
  onConfirm: () => void;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  confirmLabel,
  cancelLabel,
  destructive,
  loading,
  onConfirm,
}: ConfirmDialogProps) {
  const t = useTranslations('ui.confirmDialog');

  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 z-50 bg-brand/40 backdrop-blur-[2px]" />
        <AlertDialog.Content
          className={cn(
            'fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2',
            'rounded-xl border bg-card p-6 shadow-soft focus:outline-none',
          )}
        >
          <AlertDialog.Title className="font-display text-xl font-semibold text-brand">
            {title}
          </AlertDialog.Title>
          {description && (
            <AlertDialog.Description className="mt-2 text-sm text-muted-foreground">
              {description}
            </AlertDialog.Description>
          )}
          {children && <div className="mt-4">{children}</div>}
          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <AlertDialog.Cancel asChild>
              <Button variant="outline" disabled={loading}>
                {cancelLabel ?? t('cancel')}
              </Button>
            </AlertDialog.Cancel>
            <Button
              variant={destructive ? 'destructive' : 'default'}
              disabled={loading}
              onClick={onConfirm}
            >
              {loading && <Spinner />}
              {confirmLabel ?? t('confirm')}
            </Button>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}

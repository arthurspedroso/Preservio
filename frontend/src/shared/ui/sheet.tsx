'use client';

import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/shared/lib/utils';

// Painel lateral usado como menu em telas pequenas
const Sheet = Dialog.Root;
const SheetTrigger = Dialog.Trigger;
const SheetClose = Dialog.Close;

interface SheetContentProps extends ComponentPropsWithoutRef<typeof Dialog.Content> {
  side?: 'left' | 'right';
  tone?: 'light' | 'dark';
}

const SheetContent = forwardRef<ElementRef<typeof Dialog.Content>, SheetContentProps>(
  ({ className, children, side = 'left', tone = 'light', ...props }, ref) => {
    const t = useTranslations('ui.sheet');

    return (
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 animate-fade-in bg-foreground/40" />
        <Dialog.Content
          ref={ref}
          className={cn(
            'fixed inset-y-0 z-50 flex w-[min(20rem,85vw)] flex-col shadow-overlay focus:outline-none',
            side === 'left' ? 'left-0 border-r' : 'right-0 border-l',
            tone === 'dark'
              ? 'border-sidebar-border bg-sidebar text-sidebar-foreground'
              : 'bg-background',
            className,
          )}
          {...props}
        >
          {children}
          <Dialog.Close
            className={cn(
              'absolute right-3 top-3 grid size-9 place-items-center rounded-md transition-colors',
              tone === 'dark' ? 'hover:bg-sidebar-accent' : 'hover:bg-muted',
            )}
            aria-label={t('close')}
          >
            <X className="size-5" aria-hidden />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    );
  },
);
SheetContent.displayName = 'SheetContent';

const SheetTitle = Dialog.Title;

export { Sheet, SheetTrigger, SheetClose, SheetContent, SheetTitle };

'use client';

import { forwardRef, useState, type InputHTMLAttributes } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/shared/lib/utils';
import { Input } from './input';

const PasswordInput = forwardRef<
  HTMLInputElement,
  Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>
>(({ className, ...props }, ref) => {
  const t = useTranslations('ui.passwordInput');
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <Input
        ref={ref}
        type={visible ? 'text' : 'password'}
        className={cn('pr-11', className)}
        {...props}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? t('hide') : t('show')}
        aria-pressed={visible}
        className="absolute right-1 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        {visible ? (
          <EyeOff className="size-4" aria-hidden />
        ) : (
          <Eye className="size-4" aria-hidden />
        )}
      </button>
    </div>
  );
});
PasswordInput.displayName = 'PasswordInput';

export { PasswordInput };

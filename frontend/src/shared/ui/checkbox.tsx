import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/shared/lib/utils';

const Checkbox = forwardRef<HTMLInputElement, Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      type="checkbox"
      className={cn(
        'mt-0.5 size-4 shrink-0 cursor-pointer rounded border-input accent-primary disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  ),
);
Checkbox.displayName = 'Checkbox';

export { Checkbox };

import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/shared/lib/utils';

// Compartilhado com Textarea e Select para manter os controles visualmente idênticos
export const controlClassName =
  'w-full rounded-lg border border-input bg-card px-3 text-base transition-colors placeholder:text-muted-foreground hover:border-muted-foreground/50 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-destructive aria-[invalid=true]:focus-visible:ring-destructive/25 sm:text-sm';

const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type = 'text', ...props }, ref) => (
    <input ref={ref} type={type} className={cn(controlClassName, 'h-10', className)} {...props} />
  ),
);
Input.displayName = 'Input';

export { Input };

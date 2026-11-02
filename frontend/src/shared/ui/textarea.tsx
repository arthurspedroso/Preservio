import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/shared/lib/utils';
import { controlClassName } from './input';

const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, rows = 5, ...props }, ref) => (
    <textarea
      ref={ref}
      rows={rows}
      className={cn(controlClassName, 'min-h-24 resize-y py-2.5 leading-relaxed', className)}
      {...props}
    />
  ),
);
Textarea.displayName = 'Textarea';

export { Textarea };

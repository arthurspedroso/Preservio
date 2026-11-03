import { forwardRef, type SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { controlClassName } from './input';

// Select nativo: melhor acessibilidade e o seletor do próprio sistema no celular
const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
    <div className="relative">
      <select
        ref={ref}
        className={cn(controlClassName, 'h-10 cursor-pointer appearance-none pr-9', className)}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
    </div>
  ),
);
Select.displayName = 'Select';

export { Select };

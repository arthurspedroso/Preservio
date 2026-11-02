import { cn } from '@/shared/lib/utils';

// Contador discreto que fica âmbar perto do limite
export function CharCount({ value, max }: { value: string; max: number }) {
  const length = value.length;
  return (
    <span
      className={cn(
        'text-xs tabular-nums text-muted-foreground',
        length > max * 0.9 && 'font-medium text-warning-foreground',
        length > max && 'text-destructive',
      )}
      aria-hidden
    >
      {length}/{max}
    </span>
  );
}

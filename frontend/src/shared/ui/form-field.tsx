import { type ReactNode } from 'react';
import { CircleAlert } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/shared/lib/utils';
import { Label } from './label';

export interface FieldControlProps {
  id: string;
  'aria-invalid': boolean;
  'aria-describedby'?: string;
  'aria-required'?: boolean;
}

interface FormFieldProps {
  id: string;
  label: string;
  hint?: ReactNode;
  error?: string;
  required?: boolean;
  optional?: boolean;
  // Ação ao lado do rótulo, como "Esqueci minha senha"
  labelAction?: ReactNode;
  className?: string;
  children: (control: FieldControlProps) => ReactNode;
}

// Liga rótulo, dica e erro ao controle via aria-*, para leitores de tela anunciarem tudo junto
export function FormField({
  id,
  label,
  hint,
  error,
  required,
  optional,
  labelAction,
  className,
  children,
}: FormFieldProps) {
  const t = useTranslations('ui.formField');
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between gap-2">
        <Label htmlFor={id}>
          {label}
          {required && (
            <span className="ml-0.5 text-destructive" aria-hidden>
              *
            </span>
          )}
          {optional && (
            <span className="ml-1.5 text-xs font-normal text-muted-foreground">
              ({t('optional')})
            </span>
          )}
        </Label>
        {labelAction}
      </div>
      {children({
        id,
        'aria-invalid': Boolean(error),
        'aria-describedby': describedBy,
        'aria-required': required || undefined,
      })}
      {hint && (
        <div id={hintId} className="text-xs text-muted-foreground">
          {hint}
        </div>
      )}
      {error && (
        <p id={errorId} className="flex items-start gap-1.5 text-xs font-medium text-destructive">
          <CircleAlert className="mt-px size-3.5 shrink-0" aria-hidden />
          {error}
        </p>
      )}
    </div>
  );
}

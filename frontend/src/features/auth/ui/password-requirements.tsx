import { Check, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/shared/lib/utils';

export const PASSWORD_RULES = [
  { key: 'length', test: (v: string) => v.length >= 8 },
  { key: 'letter', test: (v: string) => /[A-Za-zÀ-ÿ]/.test(v) },
  { key: 'number', test: (v: string) => /\d/.test(v) },
] as const;

// Checklist ao vivo: o usuário vê o que falta antes de enviar (feedback imediato)
export function PasswordRequirements({ value }: { value: string }) {
  const t = useTranslations('auth.register.passwordRules');

  return (
    <ul className="mt-1 space-y-1" aria-live="polite">
      {PASSWORD_RULES.map(({ key, test }) => {
        const ok = test(value);
        return (
          <li
            key={key}
            className={cn(
              'flex items-center gap-1.5',
              ok ? 'text-primary' : 'text-muted-foreground',
            )}
          >
            {ok ? (
              <Check className="size-3.5" aria-hidden />
            ) : (
              <X className="size-3.5" aria-hidden />
            )}
            {t(key)}
            <span className="sr-only">— {ok ? t('met') : t('unmet')}</span>
          </li>
        );
      })}
    </ul>
  );
}

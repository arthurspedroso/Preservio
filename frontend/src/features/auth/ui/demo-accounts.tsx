'use client';

import { Building2, FlaskConical, UserRound } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { DEMO_ACCOUNTS } from '../infrastructure/auth.service';

const accounts = [
  { key: 'citizen', icon: UserRound },
  { key: 'admin', icon: Building2 },
] as const;

// Atalho para a banca testar os dois perfis. Identificado como simulação (regra de negócio 11).
export function DemoAccounts({
  onSelect,
}: {
  onSelect: (key: keyof typeof DEMO_ACCOUNTS) => void;
}) {
  const t = useTranslations('auth.demo');

  return (
    <section
      aria-labelledby="demo-accounts-title"
      className="rounded-xl border border-dashed border-warning/60 bg-warning/5 p-4"
    >
      <h2
        id="demo-accounts-title"
        className="flex items-center gap-2 font-sans text-sm font-semibold tracking-normal text-warning-foreground"
      >
        <FlaskConical className="size-4" aria-hidden />
        {t('title')}
      </h2>
      <p className="mt-1 text-xs text-muted-foreground">{t('description')}</p>
      <ul className="mt-3 grid gap-2">
        {accounts.map(({ key, icon: Icon }) => (
          <li key={key} className="min-w-0">
            <button
              type="button"
              onClick={() => onSelect(key)}
              className="flex w-full items-center gap-3 rounded-lg border bg-card p-3 text-left text-sm transition-colors hover:border-primary/40 hover:bg-secondary/50"
            >
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-secondary text-primary">
                <Icon className="size-4" aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-medium">{t(`${key}.label`)}</span>
                <span className="block truncate font-mono text-xs text-muted-foreground">
                  {DEMO_ACCOUNTS[key].email} · {DEMO_ACCOUNTS[key].password}
                </span>
              </span>
              <span className="text-xs font-medium text-primary">{t('fill')}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

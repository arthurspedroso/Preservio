'use client';

import { useState } from 'react';
import { LogOut, RotateCcw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { resetDemoData } from '@/shared/infrastructure/mock-db';
import { Alert } from '@/shared/ui/alert';
import { Button } from '@/shared/ui/button';
import { ConfirmDialog } from '@/shared/ui/confirm-dialog';
import { PageHeader } from '@/shared/ui/page-header';
import { useSessionStore } from '../application/session-store';
import { useLogout } from '../application/use-logout';

// Só dados realmente necessários: nome, e-mail e perfil (CPF e telefone não aparecem aqui)
export function ProfileView() {
  const t = useTranslations('profile');
  const user = useSessionStore((s) => s.user);
  const logout = useLogout();
  const [resetOpen, setResetOpen] = useState(false);

  if (!user) return null;
  const isAdmin = user.role === 'admin';

  const rows = [
    [t('name'), user.name],
    [t('email'), user.email],
    [t('role'), isAdmin ? t('adminRole') : t('citizenRole')],
    ...(isAdmin && user.agency ? [[t('agency'), user.agency]] : []),
    ...(isAdmin && user.registrationNumber ? [[t('registration'), user.registrationNumber]] : []),
  ];

  const restore = () => {
    resetDemoData();
    // Recarga completa: zera o estado em memória (sessão, cache) junto com o localStorage
    window.location.assign(window.location.origin);
  };

  return (
    <>
      <PageHeader
        title={t('title')}
        description={isAdmin ? t('adminDescription') : t('description')}
      />

      <div className="max-w-2xl space-y-6">
        <section className="rounded-xl border bg-card p-6 shadow-soft">
          <h2 className="font-sans text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            {t('account')}
          </h2>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2">
            {rows.map(([label, value]) => (
              <div key={label} className="space-y-0.5">
                <dt className="text-xs text-muted-foreground">{label}</dt>
                <dd className="text-sm font-medium">{value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 rounded-lg bg-muted/60 p-3 text-xs leading-relaxed text-muted-foreground">
            {isAdmin ? t('adminPrivacy') : t('privacy')}
          </p>
          <Button variant="outline" className="mt-6" onClick={logout}>
            <LogOut aria-hidden />
            {t('logout')}
          </Button>
        </section>

        <Alert variant="warning" title={t('demoTitle')}>
          <p>{t('demoText')}</p>
          <Button variant="outline" size="sm" className="mt-3" onClick={() => setResetOpen(true)}>
            <RotateCcw aria-hidden />
            {t('demoButton')}
          </Button>
        </Alert>
      </div>

      <ConfirmDialog
        open={resetOpen}
        onOpenChange={setResetOpen}
        title={t('demoConfirmTitle')}
        description={t('demoConfirmText')}
        confirmLabel={t('demoConfirm')}
        destructive
        onConfirm={restore}
      />
    </>
  );
}

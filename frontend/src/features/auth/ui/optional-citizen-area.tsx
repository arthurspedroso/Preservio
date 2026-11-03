'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { PublicLayout } from '@/shared/layouts';
import { Spinner } from '@/shared/ui/spinner';
import { useSessionStore } from '../application/session-store';
import { homeFor } from '../domain/routes';
import { AccountActions } from './account-actions';
import { ProtectedArea } from './protected-area';

// Páginas abertas a visitantes (ex.: denúncia anônima). Com login de cidadão, usa a área logada;
// sem login, o layout público. Administradores não registram denúncias e voltam ao painel deles.
export function OptionalCitizenArea({ children }: { children: ReactNode }) {
  const t = useTranslations('auth.guard');
  const router = useRouter();
  const { hydrated, user } = useSessionStore();
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    if (hydrated && user && isAdmin) router.replace(homeFor(user.role));
  }, [hydrated, user, isAdmin, router]);

  if (!hydrated || isAdmin) {
    return (
      <div className="grid min-h-screen place-items-center text-sm text-muted-foreground">
        <span className="flex items-center gap-2">
          <Spinner className="text-primary" />
          {t('checking')}
        </span>
      </div>
    );
  }

  if (user) return <ProtectedArea area="citizen">{children}</ProtectedArea>;

  return (
    <PublicLayout
      accountActions={{ desktop: <AccountActions />, mobile: <AccountActions mobile /> }}
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:py-10">{children}</div>
    </PublicLayout>
  );
}

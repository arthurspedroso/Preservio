'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Spinner } from '@/shared/ui/spinner';
import { useSessionStore } from '../application/session-store';
import { homeFor } from '../domain/routes';
import type { UserRole } from '../domain/types';

// Controle de acesso por perfil (RF03, RF18). No protótipo a checagem roda no cliente;
// os serviços simulados também validam o token, como faria o backend.
export function RequireRole({ role, children }: { role: UserRole; children: ReactNode }) {
  const t = useTranslations('auth.guard');
  const router = useRouter();
  const { hydrated, user, signedOut } = useSessionStore();
  const allowed = hydrated && user?.role === role;

  useEffect(() => {
    if (!hydrated) return;
    if (!user && signedOut) {
      router.replace('/');
    } else if (!user) {
      const current = window.location.pathname + window.location.search;
      router.replace(`/entrar?redirect=${encodeURIComponent(current)}`);
    } else if (user.role !== role) {
      router.replace(homeFor(user.role));
    }
  }, [hydrated, user, signedOut, role, router]);

  if (!allowed) {
    return (
      <div className="grid min-h-screen place-items-center text-sm text-muted-foreground">
        <span className="flex items-center gap-2">
          <Spinner className="text-primary" />
          {t('checking')}
        </span>
      </div>
    );
  }

  return children;
}

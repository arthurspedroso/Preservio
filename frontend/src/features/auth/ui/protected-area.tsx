'use client';

import { type ReactNode } from 'react';
import { AppShell, type AppArea } from '@/shared/layouts/app-shell';
import { useSessionStore } from '../application/session-store';
import { useLogout } from '../application/use-logout';
import { RequireRole } from './require-role';

function AreaShell({ area, children }: { area: AppArea; children: ReactNode }) {
  const user = useSessionStore((s) => s.user);
  const logout = useLogout();

  return (
    <AppShell
      area={area}
      user={{ name: user?.name ?? '', email: user?.email ?? '' }}
      onLogout={logout}
    >
      {children}
    </AppShell>
  );
}

export function ProtectedArea({ area, children }: { area: AppArea; children: ReactNode }) {
  return (
    <RequireRole role={area}>
      <AreaShell area={area}>{children}</AreaShell>
    </RequireRole>
  );
}

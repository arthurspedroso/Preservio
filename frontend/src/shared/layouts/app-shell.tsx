'use client';

import { type ReactNode } from 'react';
import { AdminShell } from './admin-shell';
import { CitizenShell } from './citizen-shell';

export type AppArea = 'citizen' | 'admin';

interface AppShellProps {
  area: AppArea;
  user: { name: string; email: string; agency?: string };
  onLogout: () => void;
  children: ReactNode;
}

// Os dois perfis têm estruturas diferentes de propósito: o cidadão usa o sistema de vez em quando
// (navegação no topo); o administrador trabalha nele (sidebar) e vê o selo de "ambiente de gestão".
export function AppShell({ area, user, onLogout, children }: AppShellProps) {
  return area === 'admin' ? (
    <AdminShell user={user} onLogout={onLogout}>
      {children}
    </AdminShell>
  ) : (
    <CitizenShell user={user} onLogout={onLogout}>
      {children}
    </CitizenShell>
  );
}

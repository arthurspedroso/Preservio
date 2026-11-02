'use client';

import { SessionHydrator } from '@/features/auth/ui/session-hydrator';
import { QueryProvider } from '@/shared/infrastructure/query-provider';
import { Toaster } from '@/shared/ui/toaster';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <SessionHydrator />
      {children}
      <Toaster />
    </QueryProvider>
  );
}

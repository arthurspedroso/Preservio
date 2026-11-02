'use client';

import { QueryProvider } from '@/shared/infrastructure/query-provider';
import { Toaster } from '@/shared/ui/toaster';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      {children}
      <Toaster />
    </QueryProvider>
  );
}

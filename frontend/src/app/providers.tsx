'use client';

import { QueryProvider } from '@/shared/infrastructure/query-provider';

export function Providers({ children }: { children: React.ReactNode }) {
  return <QueryProvider>{children}</QueryProvider>;
}

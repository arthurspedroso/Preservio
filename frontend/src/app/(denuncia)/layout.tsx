import { type ReactNode } from 'react';
import { OptionalCitizenArea } from '@/features/auth';

// Rotas que funcionam com ou sem login (denúncia anônima)
export default function OptionalAuthLayout({ children }: { children: ReactNode }) {
  return <OptionalCitizenArea>{children}</OptionalCitizenArea>;
}

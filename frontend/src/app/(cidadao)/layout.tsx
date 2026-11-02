import { type ReactNode } from 'react';
import { ProtectedArea } from '@/features/auth';

export default function CitizenLayout({ children }: { children: ReactNode }) {
  return <ProtectedArea area="citizen">{children}</ProtectedArea>;
}

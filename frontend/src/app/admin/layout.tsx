import { type ReactNode } from 'react';
import { ProtectedArea } from '@/features/auth';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <ProtectedArea area="admin">{children}</ProtectedArea>;
}

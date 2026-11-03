import { type ReactNode } from 'react';
import { AccountActions } from '@/features/auth';
import { PublicLayout } from '@/shared/layouts';

export default function PublicGroupLayout({ children }: { children: ReactNode }) {
  return (
    <PublicLayout
      accountActions={{ desktop: <AccountActions />, mobile: <AccountActions mobile /> }}
    >
      {children}
    </PublicLayout>
  );
}

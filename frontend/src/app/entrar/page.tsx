import { Suspense } from 'react';
import type { Metadata } from 'next';
import { LoginForm } from '@/features/auth';
import { AuthLayout } from '@/shared/layouts';

export const metadata: Metadata = { title: 'Entrar' };

export default function LoginPage() {
  return (
    <AuthLayout
      title="Entrar"
      description="Acesse sua conta para registrar e acompanhar denúncias."
    >
      <Suspense>
        <LoginForm />
      </Suspense>
    </AuthLayout>
  );
}

import { Suspense } from 'react';
import type { Metadata } from 'next';
import { RegisterForm } from '@/features/auth';
import { AuthLayout } from '@/shared/layouts';

export const metadata: Metadata = { title: 'Criar conta' };

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Criar conta"
      description="Cadastre-se como cidadão para registrar e acompanhar denúncias ambientais."
    >
      <Suspense>
        <RegisterForm />
      </Suspense>
    </AuthLayout>
  );
}

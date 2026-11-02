import type { Metadata } from 'next';
import { AuthLayout } from '@/shared/layouts';
import { Button, FormField, Input, PasswordInput } from '@/shared/ui';

export const metadata: Metadata = { title: 'Layout de autenticação' };

// Prévia do AuthLayout; o formulário real de login entra na Fase 1
export default function AuthLayoutPreview() {
  return (
    <AuthLayout
      title="Entrar"
      description="Acesse sua conta para registrar e acompanhar denúncias."
    >
      <div className="space-y-5">
        <FormField id="preview-email" label="E-mail">
          {(field) => <Input {...field} type="email" autoComplete="email" />}
        </FormField>
        <FormField id="preview-password" label="Senha">
          {(field) => <PasswordInput {...field} autoComplete="current-password" />}
        </FormField>
        <Button className="w-full">Entrar</Button>
      </div>
    </AuthLayout>
  );
}

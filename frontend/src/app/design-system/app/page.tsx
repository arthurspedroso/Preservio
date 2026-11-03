'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { StatusBadge } from '@/features/reports';
import { AppShell, type AppArea } from '@/shared/layouts';
import { Card, CardContent, CardHeader, CardTitle, PageHeader, toast } from '@/shared/ui';

// Prévia do AppShell com usuário fictício; sessão real entra na Fase 1
function Preview() {
  const area: AppArea = useSearchParams().get('area') === 'admin' ? 'admin' : 'citizen';
  const user =
    area === 'admin'
      ? { name: 'Carlos Menezes', email: 'carlos.menezes@orgao.gov.br' }
      : { name: 'Maria Souza', email: 'maria@exemplo.com' };

  return (
    <AppShell area={area} user={user} onLogout={() => toast.info('Logout simulado.')}>
      <PageHeader
        title={area === 'admin' ? 'Painel administrativo' : `Olá, ${user.name.split(' ')[0]}`}
        description={
          area === 'admin'
            ? 'Denúncias recebidas — os números refletem os registros existentes.'
            : 'Acompanhe suas denúncias e registre novas ocorrências.'
        }
      />
      <Card>
        <CardHeader>
          <CardTitle>Prévia do layout</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          Conteúdo da página entra aqui. <StatusBadge status="in_progress" />
        </CardContent>
      </Card>
    </AppShell>
  );
}

export default function AppShellPreview() {
  return (
    <Suspense>
      <Preview />
    </Suspense>
  );
}

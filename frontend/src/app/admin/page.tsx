import type { Metadata } from 'next';
import { PageHeader } from '@/shared/ui/page-header';
import { UnderConstruction } from '@/shared/ui/under-construction';

export const metadata: Metadata = { title: 'Painel administrativo' };

// Conteúdo completo na Fase 4 (RF10, RF11)
export default function AdminDashboardPage() {
  return (
    <>
      <PageHeader
        title="Painel administrativo"
        description="Denúncias recebidas — os números refletem os registros existentes."
      />
      <UnderConstruction />
    </>
  );
}

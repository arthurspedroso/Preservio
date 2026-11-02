import type { Metadata } from 'next';
import { PageHeader } from '@/shared/ui/page-header';
import { UnderConstruction } from '@/shared/ui/under-construction';

export const metadata: Metadata = { title: 'Painel' };

// Conteúdo completo na Fase 3 (RF15, RF16)
export default function CitizenDashboardPage() {
  return (
    <>
      <PageHeader
        title="Painel"
        description="Acompanhe suas denúncias e registre novas ocorrências."
      />
      <UnderConstruction />
    </>
  );
}

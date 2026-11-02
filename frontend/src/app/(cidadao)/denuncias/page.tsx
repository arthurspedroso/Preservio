import type { Metadata } from 'next';
import { PageHeader } from '@/shared/ui/page-header';
import { UnderConstruction } from '@/shared/ui/under-construction';

export const metadata: Metadata = { title: 'Minhas denúncias' };

// Conteúdo completo na Fase 3 (RF16, RF18)
export default function MyReportsPage() {
  return (
    <>
      <PageHeader
        title="Minhas denúncias"
        description="Somente as denúncias registradas pela sua conta."
      />
      <UnderConstruction />
    </>
  );
}

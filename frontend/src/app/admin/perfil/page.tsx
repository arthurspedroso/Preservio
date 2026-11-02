import type { Metadata } from 'next';
import { PageHeader } from '@/shared/ui/page-header';
import { UnderConstruction } from '@/shared/ui/under-construction';

export const metadata: Metadata = { title: 'Perfil' };

// Conteúdo completo na Fase 6
export default function AdminProfilePage() {
  return (
    <>
      <PageHeader title="Perfil" description="Dados básicos da sua conta institucional." />
      <UnderConstruction />
    </>
  );
}

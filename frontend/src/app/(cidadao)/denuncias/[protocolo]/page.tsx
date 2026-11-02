import type { Metadata } from 'next';
import { PageHeader } from '@/shared/ui/page-header';
import { UnderConstruction } from '@/shared/ui/under-construction';

export const metadata: Metadata = { title: 'Detalhes da denúncia' };

// Conteúdo completo na Fase 3 (RF12, RF15)
export default async function ReportDetailPage({
  params,
}: {
  params: Promise<{ protocolo: string }>;
}) {
  const { protocolo } = await params;

  return (
    <>
      <PageHeader
        eyebrow={decodeURIComponent(protocolo)}
        title="Detalhes da denúncia"
        description="Acompanhe o andamento e as respostas do órgão responsável."
      />
      <UnderConstruction />
    </>
  );
}

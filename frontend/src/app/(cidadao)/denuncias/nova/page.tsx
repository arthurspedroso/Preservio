import type { Metadata } from 'next';
import { PageHeader } from '@/shared/ui/page-header';
import { UnderConstruction } from '@/shared/ui/under-construction';

export const metadata: Metadata = { title: 'Nova denúncia' };

// Formulário completo na Fase 2 (RF04 a RF07)
export default function NewReportPage() {
  return (
    <>
      <PageHeader
        title="Nova denúncia"
        description="Informe o que aconteceu, quando e onde. Quanto mais detalhes, mais fácil será a análise."
      />
      <UnderConstruction />
    </>
  );
}

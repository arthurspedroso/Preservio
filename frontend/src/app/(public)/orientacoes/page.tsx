import type { Metadata } from 'next';
import { PageHeader } from '@/shared/ui/page-header';
import { UnderConstruction } from '@/shared/ui/under-construction';

export const metadata: Metadata = { title: 'Orientações ambientais' };

// Conteúdo completo na Fase 5 (RF17)
export default function GuidancePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <PageHeader
        title="Orientações ambientais"
        description="Recomendações gerais para registrar uma denúncia útil. Este conteúdo é informativo e não substitui órgãos ambientais ou profissionais especializados."
      />
      <UnderConstruction />
    </div>
  );
}

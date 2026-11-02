import type { Metadata } from 'next';
import { PageHeader } from '@/shared/ui/page-header';
import { UnderConstruction } from '@/shared/ui/under-construction';

export const metadata: Metadata = { title: 'Assistente ambiental' };

// Chatbot simulado na Fase 5 (RF08, RF09)
export default function AssistantPage() {
  return (
    <>
      <PageHeader
        title="Assistente ambiental"
        description="Tire dúvidas gerais sobre questões ambientais e sobre como registrar uma denúncia."
      />
      <UnderConstruction />
    </>
  );
}

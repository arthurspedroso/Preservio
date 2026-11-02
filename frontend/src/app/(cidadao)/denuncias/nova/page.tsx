import type { Metadata } from 'next';
import { NewReportWizard } from '@/features/reports';

export const metadata: Metadata = { title: 'Nova denúncia' };

// RF04, RF05, RF06 e RF07 — fluxo do diagrama de sequência "Registrar Denúncia"
export default function NewReportPage() {
  return <NewReportWizard />;
}

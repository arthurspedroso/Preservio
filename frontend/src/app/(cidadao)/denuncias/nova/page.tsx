import type { Metadata } from 'next';
import { NewReportWizard, REPORT_CATEGORIES, type ReportCategory } from '@/features/reports';

export const metadata: Metadata = { title: 'Nova denúncia' };

// RF04, RF05, RF06 e RF07 — fluxo do diagrama de sequência "Registrar Denúncia".
// ?categoria=... pré-seleciona o tipo (usado pelo assistente ambiental).
export default async function NewReportPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>;
}) {
  const { categoria } = await searchParams;
  const initialCategory = (REPORT_CATEGORIES as readonly string[]).includes(categoria ?? '')
    ? (categoria as ReportCategory)
    : undefined;

  return <NewReportWizard initialCategory={initialCategory} />;
}

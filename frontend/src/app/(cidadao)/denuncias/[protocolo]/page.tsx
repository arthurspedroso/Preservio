import type { Metadata } from 'next';
import { CitizenReportDetail } from '@/features/reports';

export const metadata: Metadata = { title: 'Detalhes da denúncia' };

export default async function ReportDetailPage({
  params,
}: {
  params: Promise<{ protocolo: string }>;
}) {
  const { protocolo } = await params;
  return <CitizenReportDetail protocol={decodeURIComponent(protocolo)} />;
}

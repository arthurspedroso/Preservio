import type { Metadata } from 'next';
import { AdminReportDetail } from '@/features/reports';

export const metadata: Metadata = { title: 'Denúncia — gestão' };

export default async function AdminReportDetailPage({
  params,
}: {
  params: Promise<{ protocolo: string }>;
}) {
  const { protocolo } = await params;
  return <AdminReportDetail protocol={decodeURIComponent(protocolo)} />;
}

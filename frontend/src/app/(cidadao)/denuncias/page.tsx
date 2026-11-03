import type { Metadata } from 'next';
import { MyReports } from '@/features/reports';

export const metadata: Metadata = { title: 'Minhas denúncias' };

export default function MyReportsPage() {
  return <MyReports />;
}

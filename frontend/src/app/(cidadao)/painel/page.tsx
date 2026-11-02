import type { Metadata } from 'next';
import { CitizenDashboard } from '@/features/reports';

export const metadata: Metadata = { title: 'Painel' };

export default function CitizenDashboardPage() {
  return <CitizenDashboard />;
}

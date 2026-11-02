import type { Metadata } from 'next';
import { AdminDashboard } from '@/features/reports';

export const metadata: Metadata = { title: 'Painel administrativo' };

export default function AdminDashboardPage() {
  return <AdminDashboard />;
}

import type { Metadata } from 'next';
import { ProfileView } from '@/features/auth';

export const metadata: Metadata = { title: 'Perfil' };

export default function AdminProfilePage() {
  return <ProfileView />;
}

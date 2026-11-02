import type { Metadata } from 'next';
import { PublicLayout } from '@/shared/layouts';
import { DesignSystemShowcase } from './showcase';

export const metadata: Metadata = { title: 'Design system' };

export default function DesignSystemPage() {
  return (
    <PublicLayout>
      <DesignSystemShowcase />
    </PublicLayout>
  );
}

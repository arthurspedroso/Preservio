import { getTranslations } from 'next-intl/server';
import { SystemStatusCard } from '@/features/system-status';

export default async function Home() {
  const t = await getTranslations('home');

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-6">
      <h1 className="text-4xl font-bold">{t('title')}</h1>
      <SystemStatusCard />
    </main>
  );
}

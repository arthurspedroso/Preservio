'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { toast } from '@/shared/ui/toaster';
import { useSessionStore } from './session-store';

export function useLogout() {
  const t = useTranslations('auth');
  const router = useRouter();
  const clearSession = useSessionStore((s) => s.clearSession);

  return useCallback(() => {
    clearSession();
    router.replace('/');
    toast.success(t('loggedOut'));
  }, [router, clearSession, t]);
}

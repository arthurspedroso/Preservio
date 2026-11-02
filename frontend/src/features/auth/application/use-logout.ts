'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from '@/shared/ui/toaster';
import { useSessionStore } from './session-store';

export function useLogout() {
  const t = useTranslations('auth');
  const router = useRouter();
  const clearSession = useSessionStore((s) => s.clearSession);
  const queryClient = useQueryClient();

  return useCallback(() => {
    clearSession();
    // Descarta o cache: o próximo usuário não pode ver dados do anterior
    queryClient.clear();
    router.replace('/');
    toast.success(t('loggedOut'));
  }, [router, clearSession, queryClient, t]);
}

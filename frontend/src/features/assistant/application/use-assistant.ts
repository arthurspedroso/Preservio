'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSessionStore } from '@/features/auth/application/session-store';
import { ApiError } from '@/shared/infrastructure/http-client';
import { assistantService, type ChatEntry } from '../infrastructure/assistant.service';

export function useAssistant() {
  const token = useSessionStore((s) => s.token);
  const userId = useSessionStore((s) => s.user?.id);
  const queryClient = useQueryClient();
  const key = ['assistant', userId];
  const requireToken = () => {
    if (!token) throw new ApiError('Sessão expirada. Entre novamente.', 401);
    return token;
  };

  const history = useQuery({
    queryKey: key,
    queryFn: () => assistantService.history(requireToken()),
    enabled: Boolean(token),
    staleTime: 0,
  });

  const ask = useMutation({
    mutationFn: (question: string) => assistantService.ask(requireToken(), question),
    onSuccess: (entry) =>
      queryClient.setQueryData<ChatEntry[]>(key, (current) => [...(current ?? []), entry]),
  });

  const clear = useMutation({
    mutationFn: () => assistantService.clear(requireToken()),
    onSuccess: () => queryClient.setQueryData<ChatEntry[]>(key, []),
  });

  return { history, ask, clear };
}

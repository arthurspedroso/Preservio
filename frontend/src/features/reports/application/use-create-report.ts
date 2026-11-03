'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSessionStore } from '@/features/auth/application/session-store';
import type { CreateReportInput } from '../domain/types';
import { reportsService } from '../infrastructure/reports.service';

export function useCreateReport() {
  const token = useSessionStore((s) => s.token);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateReportInput) => {
      // Sem sessão a denúncia é registrada de forma anônima
      return reportsService.create(token, input);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['reports'] }),
  });
}

'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSessionStore } from '@/features/auth/application/session-store';
import { ApiError } from '@/shared/infrastructure/http-client';
import type { CreateReportInput } from '../domain/types';
import { reportsService } from '../infrastructure/reports.service';

export function useCreateReport() {
  const token = useSessionStore((s) => s.token);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateReportInput) => {
      if (!token) throw new ApiError('Sessão expirada. Entre novamente.', 401);
      return reportsService.create(token, input);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['reports'] }),
  });
}

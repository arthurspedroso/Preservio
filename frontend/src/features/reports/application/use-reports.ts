'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSessionStore } from '@/features/auth/application/session-store';
import { ApiError } from '@/shared/infrastructure/http-client';
import type { ReportStatus } from '../domain/types';
import { reportsService } from '../infrastructure/reports.service';

// As chaves incluem o usuário e o staleTime é 0: depois que o admin age, o cidadão sempre vê o dado novo
function useAuth() {
  const token = useSessionStore((s) => s.token);
  const userId = useSessionStore((s) => s.user?.id);
  const requireToken = () => {
    if (!token) throw new ApiError('Sessão expirada. Entre novamente.', 401);
    return token;
  };
  return { token, userId, requireToken };
}

export function useReportsQuery() {
  const { token, userId, requireToken } = useAuth();
  return useQuery({
    queryKey: ['reports', userId, 'list'],
    queryFn: () => reportsService.list(requireToken()),
    enabled: Boolean(token),
    staleTime: 0,
  });
}

export function useReportQuery(protocol: string) {
  const { token, userId, requireToken } = useAuth();
  return useQuery({
    queryKey: ['reports', userId, 'detail', protocol],
    queryFn: () => reportsService.get(requireToken(), protocol),
    enabled: Boolean(token),
    staleTime: 0,
    retry: false,
  });
}

export function useIdentityQuery(reportId: string) {
  const { token, userId, requireToken } = useAuth();
  return useQuery({
    queryKey: ['reports', userId, 'identity', reportId],
    queryFn: () => reportsService.getIdentity(requireToken(), reportId),
    enabled: Boolean(token),
    staleTime: 0,
  });
}

export function useUpdateStatus(reportId: string) {
  const { requireToken } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { status: ReportStatus; message?: string }) =>
      reportsService.updateStatus(requireToken(), reportId, input.status, input.message),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['reports'] }),
  });
}

export function useRespond(reportId: string) {
  const { requireToken } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (message: string) => reportsService.respond(requireToken(), reportId, message),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['reports'] }),
  });
}

export function useRevealCpf(reportId: string) {
  const { requireToken } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => reportsService.revealCpf(requireToken(), reportId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['reports'] }),
  });
}

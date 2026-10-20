import { api } from '@/shared/infrastructure/http-client';
import type { SystemStatus } from '../domain/types';

export const systemStatusService = {
  get: () => api.get<SystemStatus>('/health'),
};

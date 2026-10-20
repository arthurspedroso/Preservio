import { useQuery } from '@tanstack/react-query';
import { systemStatusService } from '../infrastructure/system-status.service';

export function useSystemStatusQuery() {
  return useQuery({ queryKey: ['system-status'], queryFn: systemStatusService.get });
}

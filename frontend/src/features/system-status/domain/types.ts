export interface SystemStatus {
  status: 'ok' | 'degraded';
  components: Record<string, 'up' | 'down'>;
  timestamp: string;
}

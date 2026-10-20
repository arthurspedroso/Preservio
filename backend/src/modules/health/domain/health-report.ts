export type ComponentStatus = 'up' | 'down';

export class HealthReport {
  constructor(
    public readonly components: Record<string, ComponentStatus>,
    public readonly checkedAt: Date = new Date(),
  ) {}

  get isHealthy(): boolean {
    return Object.values(this.components).every((status) => status === 'up');
  }
}

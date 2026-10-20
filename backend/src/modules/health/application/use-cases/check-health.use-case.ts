import { Inject, Injectable } from '@nestjs/common';
import { HealthReport } from '../../domain/health-report';
import { DATABASE_HEALTH_PORT, type DatabaseHealthPort } from '../ports/database-health.port';

@Injectable()
export class CheckHealthUseCase {
  constructor(
    @Inject(DATABASE_HEALTH_PORT)
    private readonly databaseHealth: DatabaseHealthPort,
  ) {}

  async execute(): Promise<HealthReport> {
    const databaseUp = await this.databaseHealth.isHealthy();
    return new HealthReport({ api: 'up', database: databaseUp ? 'up' : 'down' });
  }
}

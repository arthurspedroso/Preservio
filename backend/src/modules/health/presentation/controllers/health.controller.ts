import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CheckHealthUseCase } from '../../application/use-cases/check-health.use-case';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly checkHealth: CheckHealthUseCase) {}

  @Get()
  async check() {
    const report = await this.checkHealth.execute();
    return {
      status: report.isHealthy ? 'ok' : 'degraded',
      components: report.components,
      timestamp: report.checkedAt.toISOString(),
    };
  }
}

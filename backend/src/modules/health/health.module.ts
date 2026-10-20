import { Module } from '@nestjs/common';
import { DATABASE_HEALTH_PORT } from './application/ports/database-health.port';
import { CheckHealthUseCase } from './application/use-cases/check-health.use-case';
import { TypeOrmDatabaseHealthAdapter } from './infrastructure/adapters/typeorm-database-health.adapter';
import { HealthController } from './presentation/controllers/health.controller';

@Module({
  controllers: [HealthController],
  providers: [
    CheckHealthUseCase,
    { provide: DATABASE_HEALTH_PORT, useClass: TypeOrmDatabaseHealthAdapter },
  ],
})
export class HealthModule {}

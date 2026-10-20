import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import type { DatabaseHealthPort } from '../../application/ports/database-health.port';

@Injectable()
export class TypeOrmDatabaseHealthAdapter implements DatabaseHealthPort {
  constructor(private readonly dataSource: DataSource) {}

  async isHealthy(): Promise<boolean> {
    try {
      await this.dataSource.query('SELECT 1');
      return true;
    } catch {
      return false;
    }
  }
}

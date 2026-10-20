import { join } from 'node:path';
import type { DataSourceOptions } from 'typeorm';

export const typeOrmOptions = (): DataSourceOptions => ({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [join(__dirname, '..', '..', 'modules', '**', '*.orm-entity{.ts,.js}')],
  migrations: [join(__dirname, '..', '..', '**', 'migrations', '*{.ts,.js}')],
  migrationsTableName: 'typeorm_migrations',
  synchronize: false,
});

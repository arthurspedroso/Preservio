import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { DATABASE_HEALTH_PORT } from '@modules/health/application/ports/database-health.port';
import { HealthModule } from '@modules/health/health.module';
import request from 'supertest';

describe('Health (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [HealthModule] })
      .overrideProvider(DATABASE_HEALTH_PORT)
      .useValue({ isHealthy: async () => true })
      .compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/health', async () => {
    const res = await request(app.getHttpServer()).get('/api/health').expect(200);
    expect(res.body).toMatchObject({ status: 'ok', components: { api: 'up', database: 'up' } });
  });
});

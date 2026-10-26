import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { HealthController } from '@modules/core/presentation/controllers/health.controller';
import request from 'supertest';
import { DataSource } from 'typeorm';

describe('Health (e2e)', () => {
  let app: INestApplication;
  const dataSource = { query: jest.fn() };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [{ provide: DataSource, useValue: dataSource }],
    }).compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/health -> 200 quando o banco responde', async () => {
    dataSource.query.mockResolvedValueOnce([]);

    const res = await request(app.getHttpServer()).get('/api/health').expect(200);
    expect(res.body).toMatchObject({ status: 'ok', components: { database: 'up' } });
  });

  it('GET /api/health -> 503 quando o banco não responde', async () => {
    dataSource.query.mockRejectedValueOnce(new Error('ECONNREFUSED'));

    const res = await request(app.getHttpServer()).get('/api/health').expect(503);
    expect(res.body).toMatchObject({ status: 'degraded', components: { database: 'down' } });
  });
});

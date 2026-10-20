import type { DatabaseHealthPort } from '../ports/database-health.port';
import { CheckHealthUseCase } from './check-health.use-case';

describe('CheckHealthUseCase', () => {
  function makeSut(databaseUp: boolean) {
    const databaseHealth: DatabaseHealthPort = {
      isHealthy: jest.fn().mockResolvedValue(databaseUp),
    };
    return new CheckHealthUseCase(databaseHealth);
  }

  it('reporta saudável quando o banco responde', async () => {
    const report = await makeSut(true).execute();

    expect(report.isHealthy).toBe(true);
    expect(report.components).toEqual({ api: 'up', database: 'up' });
  });

  it('reporta degradado quando o banco não responde', async () => {
    const report = await makeSut(false).execute();

    expect(report.isHealthy).toBe(false);
    expect(report.components.database).toBe('down');
  });
});

import { type ArgumentsHost, BadRequestException as NestBadRequest, Logger } from '@nestjs/common';
import {
  ConflictException,
  NotFoundException,
} from '@modules/core/application/exceptions/application.exceptions';
import { GlobalExceptionFilter } from './global-exception.filter';

function createHost() {
  const json = jest.fn();
  const status = jest.fn().mockReturnValue({ json });
  const host = {
    switchToHttp: () => ({
      getResponse: () => ({ status }),
      getRequest: () => ({ method: 'GET', url: '/api/users/1' }),
    }),
  } as unknown as ArgumentsHost;
  return { host, status, json };
}

describe('GlobalExceptionFilter', () => {
  const filter = new GlobalExceptionFilter();

  beforeAll(() => {
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);
  });

  it('usa o httpStatus das exceções de aplicação', () => {
    const { host, status, json } = createHost();

    filter.catch(new NotFoundException('Usuário não encontrado'), host);

    expect(status).toHaveBeenCalledWith(404);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 404, message: 'Usuário não encontrado' }),
    );
  });

  it('mantém o nome da classe na exceção', () => {
    expect(new ConflictException('x').name).toBe('ConflictException');
  });

  it('repassa as exceções do próprio Nest (ex.: ValidationPipe)', () => {
    const { host, status, json } = createHost();

    filter.catch(new NestBadRequest(['email must be an email']), host);

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({ message: ['email must be an email'] }),
    );
  });

  it('esconde a mensagem de erros inesperados', () => {
    const { host, status, json } = createHost();

    filter.catch(new Error('connect ECONNREFUSED 10.0.0.5:5432'), host);

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Internal server error' }),
    );
  });
});

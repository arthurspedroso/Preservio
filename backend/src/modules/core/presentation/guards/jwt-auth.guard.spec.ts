import type { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UnauthorizedException } from '../../application/exceptions/application.exceptions';
import type { TokenService } from '../../application/ports/token-service.port';
import { JwtAuthGuard } from './jwt-auth.guard';

function createContext(authorization?: string) {
  const request: { headers: Record<string, string | undefined>; user?: unknown } = {
    headers: { authorization },
  };
  const context = {
    getHandler: () => function handler() {},
    getClass: () => class Controller {},
    switchToHttp: () => ({ getRequest: () => request }),
  } as unknown as ExecutionContext;
  return { context, request };
}

describe('JwtAuthGuard', () => {
  const tokens: TokenService = {
    sign: jest.fn(),
    verify: jest.fn(async (token: string) => (token === 'valido' ? { sub: 'user-1' } : null)),
  };
  const reflector = new Reflector();
  const guard = new JwtAuthGuard(reflector, tokens);

  afterEach(() => jest.restoreAllMocks());

  it('libera rotas marcadas com @Public sem token', async () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(true);

    await expect(guard.canActivate(createContext().context)).resolves.toBe(true);
  });

  it('recusa quando não vem token', async () => {
    await expect(guard.canActivate(createContext().context)).rejects.toThrow(UnauthorizedException);
  });

  it('recusa token inválido ou expirado', async () => {
    await expect(guard.canActivate(createContext('Bearer invalido').context)).rejects.toThrow(
      'Token inválido ou expirado',
    );
  });

  it('aceita token válido e coloca o usuário na requisição', async () => {
    const { context, request } = createContext('Bearer valido');

    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(request.user).toEqual({ userId: 'user-1' });
  });
});

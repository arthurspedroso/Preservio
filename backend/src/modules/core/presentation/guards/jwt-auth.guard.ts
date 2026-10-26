import { type CanActivate, type ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { AuthenticatedRequest } from '@shared/decorators/current-user.decorator';
import { IS_PUBLIC_KEY } from '@shared/decorators/public.decorator';
import { UnauthorizedException } from '../../application/exceptions/application.exceptions';
import { TokenService } from '../../application/ports/token-service.port';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(TokenService) private readonly tokens: TokenService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const [type, token] = (request.headers.authorization ?? '').split(' ');
    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Token não informado');
    }

    const payload = await this.tokens.verify(token);
    if (!payload) {
      throw new UnauthorizedException('Token inválido ou expirado');
    }

    request.user = { userId: payload.sub };
    return true;
  }
}

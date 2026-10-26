import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { TokenPayload, TokenService } from '../../application/ports/token-service.port';

@Injectable()
export class JwtTokenService implements TokenService {
  constructor(private readonly jwt: JwtService) {}

  sign(payload: TokenPayload): Promise<string> {
    return this.jwt.signAsync({ sub: payload.sub });
  }

  async verify(token: string): Promise<TokenPayload | null> {
    try {
      const { sub } = await this.jwt.verifyAsync<TokenPayload>(token);
      return { sub };
    } catch {
      return null;
    }
  }
}

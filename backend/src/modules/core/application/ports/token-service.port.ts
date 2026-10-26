import type { UserRole } from '../../domain/enums/user-role.enum';

export interface TokenPayload {
  sub: string;
  role: UserRole;
}

export interface TokenService {
  sign(payload: TokenPayload): Promise<string>;
  verify(token: string): Promise<TokenPayload | null>;
}

export const TokenService = Symbol('TokenService');

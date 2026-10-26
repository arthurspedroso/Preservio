export interface TokenPayload {
  sub: string;
}

export interface TokenService {
  sign(payload: TokenPayload): Promise<string>;
  verify(token: string): Promise<TokenPayload | null>;
}

export const TokenService = Symbol('TokenService');

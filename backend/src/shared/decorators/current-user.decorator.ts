import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import type { UserRole } from '@modules/core/domain/enums/user-role.enum';
import type { Request } from 'express';

export interface AuthenticatedUser {
  userId: string;
  role: UserRole;
}

export type AuthenticatedRequest = Request & { user?: AuthenticatedUser };

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AuthenticatedUser | undefined =>
    context.switchToHttp().getRequest<AuthenticatedRequest>().user,
);

import { HttpStatus } from '@nestjs/common';

export abstract class ApplicationException extends Error {
  abstract readonly httpStatus: HttpStatus;

  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

export class BadRequestException extends ApplicationException {
  readonly httpStatus = HttpStatus.BAD_REQUEST;
}

export class UnauthorizedException extends ApplicationException {
  readonly httpStatus = HttpStatus.UNAUTHORIZED;
}

export class NotFoundException extends ApplicationException {
  readonly httpStatus = HttpStatus.NOT_FOUND;
}

export class ConflictException extends ApplicationException {
  readonly httpStatus = HttpStatus.CONFLICT;
}

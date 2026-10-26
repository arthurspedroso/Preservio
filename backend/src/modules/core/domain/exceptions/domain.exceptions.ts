export abstract class DomainException extends Error {
  readonly httpStatus: number = 422;

  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

export class InvalidCitizenException extends DomainException {}

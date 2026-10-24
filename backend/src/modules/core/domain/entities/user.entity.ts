import { AggregateRoot } from '@shared/domain/aggregate-root';

export class User extends AggregateRoot {
  constructor(
    protected readonly _id: string,
    private _name: string,
    private _email: string,
    private _passwordHash: string,
  ) {
    super();
  }

  get name(): string {
    return this._name;
  }

  get email(): string {
    return this._email;
  }

  get passwordHash(): string {
    return this._passwordHash;
  }
}

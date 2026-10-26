import { randomUUID } from 'node:crypto';
import { AggregateRoot } from '@shared/domain/aggregate-root';

export interface UserProps {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
}

export type CreateUserProps = Omit<UserProps, 'id'>;

export class User extends AggregateRoot {
  private constructor(
    protected readonly _id: string,
    private _name: string,
    private _email: string,
    private _passwordHash: string,
  ) {
    super();
  }

  static create(props: CreateUserProps): User {
    return new User(randomUUID(), props.name, props.email, props.passwordHash);
  }

  static reconstitute(props: UserProps): User {
    return new User(props.id, props.name, props.email, props.passwordHash);
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

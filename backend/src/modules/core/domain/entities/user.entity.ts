import { randomUUID } from 'node:crypto';
import { AggregateRoot } from '@shared/domain/aggregate-root';
import { UserRole } from '../enums/user-role.enum';

export interface UserProps {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
}

export type CreateUserProps = Omit<UserProps, 'id'>;

export class User extends AggregateRoot {
  private constructor(
    protected readonly _id: string,
    private _name: string,
    private _email: string,
    private _passwordHash: string,
    private readonly _role: UserRole,
  ) {
    super();
  }

  static create(props: CreateUserProps): User {
    return new User(randomUUID(), props.name, props.email, props.passwordHash, props.role);
  }

  static reconstitute(props: UserProps): User {
    return new User(props.id, props.name, props.email, props.passwordHash, props.role);
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

  get role(): UserRole {
    return this._role;
  }
}

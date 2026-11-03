import { randomUUID } from 'node:crypto';
import { AggregateRoot } from '@shared/domain/aggregate-root';
import { isValidCpf, onlyDigits } from '@shared/validators/cpf';
import { InvalidCitizenException } from '../exceptions/domain.exceptions';

export interface CitizenProps {
  id: string;
  userId: string;
  cpf: string;
  phone: string | null;
}

export type CreateCitizenProps = Omit<CitizenProps, 'id'>;

export class Citizen extends AggregateRoot {
  private constructor(
    protected readonly _id: string,
    private readonly _userId: string,
    private readonly _cpf: string,
    private _phone: string | null,
  ) {
    super();
  }

  static create(props: CreateCitizenProps): Citizen {
    const cpf = onlyDigits(props.cpf);
    if (!isValidCpf(cpf)) {
      throw new InvalidCitizenException('CPF inválido');
    }
    const phone = props.phone ? onlyDigits(props.phone) : null;
    return new Citizen(randomUUID(), props.userId, cpf, phone || null);
  }

  static reconstitute(props: CitizenProps): Citizen {
    return new Citizen(props.id, props.userId, props.cpf, props.phone);
  }

  get userId(): string {
    return this._userId;
  }

  get cpf(): string {
    return this._cpf;
  }

  get phone(): string | null {
    return this._phone;
  }
}

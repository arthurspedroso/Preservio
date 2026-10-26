import { Citizen } from '../entities/citizen.entity';
import { User } from '../entities/user.entity';

export interface CitizenRepository {
  createWithUser(user: User, citizen: Citizen): Promise<void>;
  findByUserId(userId: string): Promise<Citizen | null>;
  findByCpf(cpf: string): Promise<Citizen | null>;
}

export const CitizenRepository = Symbol('CitizenRepository');

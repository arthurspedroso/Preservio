import { Inject, Injectable } from '@nestjs/common';
import { CitizenRepository } from '../../domain/repositories/citizen.repository';
import { UserRepository } from '../../domain/repositories/user.repository';
import { NotFoundException } from '../exceptions/application.exceptions';
import type { CitizenProfile } from './register-citizen.use-case';

@Injectable()
export class GetCitizenProfileUseCase {
  constructor(
    @Inject(UserRepository) private readonly users: UserRepository,
    @Inject(CitizenRepository) private readonly citizens: CitizenRepository,
  ) {}

  async execute(userId: string): Promise<CitizenProfile> {
    const [user, citizen] = await Promise.all([
      this.users.findById(userId),
      this.citizens.findByUserId(userId),
    ]);

    if (!user || !citizen) {
      throw new NotFoundException('Cidadão não encontrado');
    }

    return { user, citizen };
  }
}

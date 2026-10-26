import { Inject, Injectable } from '@nestjs/common';
import { onlyDigits } from '@shared/validators/cpf';
import { Citizen } from '../../domain/entities/citizen.entity';
import { User } from '../../domain/entities/user.entity';
import { UserRole } from '../../domain/enums/user-role.enum';
import { CitizenRepository } from '../../domain/repositories/citizen.repository';
import { UserRepository } from '../../domain/repositories/user.repository';
import { ConflictException } from '../exceptions/application.exceptions';
import { PasswordHasher } from '../ports/password-hasher.port';

export interface RegisterCitizenCommand {
  name: string;
  email: string;
  password: string;
  cpf: string;
  phone?: string | null;
}

export interface CitizenProfile {
  user: User;
  citizen: Citizen;
}

@Injectable()
export class RegisterCitizenUseCase {
  constructor(
    @Inject(UserRepository) private readonly users: UserRepository,
    @Inject(CitizenRepository) private readonly citizens: CitizenRepository,
    @Inject(PasswordHasher) private readonly passwordHasher: PasswordHasher,
  ) {}

  async execute(command: RegisterCitizenCommand): Promise<CitizenProfile> {
    const cpf = onlyDigits(command.cpf);
    const [emailInUse, cpfInUse] = await Promise.all([
      this.users.findByEmail(command.email),
      this.citizens.findByCpf(cpf),
    ]);

    if (emailInUse) {
      throw new ConflictException('Email já cadastrado');
    }
    if (cpfInUse) {
      throw new ConflictException('CPF já cadastrado');
    }

    const passwordHash = await this.passwordHasher.hash(command.password);
    const user = User.create({
      name: command.name,
      email: command.email,
      passwordHash,
      role: UserRole.Citizen,
    });
    const citizen = Citizen.create({ userId: user.id, cpf, phone: command.phone ?? null });

    await this.citizens.createWithUser(user, citizen);
    return { user, citizen };
  }
}

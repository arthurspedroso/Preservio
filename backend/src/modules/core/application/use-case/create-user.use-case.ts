import { UserRepository } from '@modules/core/domain/repositories/user.repository';
import { PasswordHasher } from '../ports/password-hasher.port';
import { ConflictException } from '../exceptions/application.exceptions';
import { User } from '@modules/core/domain/entities/user.entity';
import { Inject, Injectable } from '@nestjs/common';

interface CreateUserCommand {
  name: string;
  email: string;
  password: string;
}

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(UserRepository)
    private readonly userRepository: UserRepository,
    @Inject(PasswordHasher)
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async execute(command: CreateUserCommand): Promise<User> {
    const exists = await this.userRepository.findByEmail(command.email);
    if (exists) {
      throw new ConflictException('Email ja tem usuario vinculado');
    }

    const passwordHash = await this.passwordHasher.hash(command.password);
    const user = User.create({ name: command.name, email: command.email, passwordHash });
    return this.userRepository.create(user);
  }
}

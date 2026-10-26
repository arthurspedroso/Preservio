import { UserRole } from '@modules/core/domain/enums/user-role.enum';
import { UserRepository } from '@modules/core/domain/repositories/user.repository';
import { Inject, Injectable } from '@nestjs/common';
import { PasswordHasher } from '../ports/password-hasher.port';
import { TokenService } from '../ports/token-service.port';
import { UnauthorizedException } from '../exceptions/application.exceptions';

interface LoginCommand {
  email: string;
  password: string;
}

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(UserRepository)
    private readonly userRepository: UserRepository,
    @Inject(PasswordHasher) private readonly passwordHasher: PasswordHasher,
    @Inject(TokenService) private readonly tokenService: TokenService,
  ) {}

  async execute(command: LoginCommand): Promise<{ accessToken: string; role: UserRole }> {
    const user = await this.userRepository.findByEmail(command.email);
    if (!user) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    const isValidLogin = await this.passwordHasher.compare(command.password, user.passwordHash);
    if (!isValidLogin) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    const accessToken = await this.tokenService.sign({ sub: user.id, role: user.role });
    return { accessToken, role: user.role };
  }
}

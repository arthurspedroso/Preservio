import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasswordHasher } from './application/ports/password-hasher.port';
import { TokenService } from './application/ports/token-service.port';
import { CreateUserUseCase } from './application/use-case/create-user.use-case';
import { UserRepository } from './domain/repositories/user.repository';
import { JwtTokenService } from './infrastructure/auth/jwt-token.service';
import { BcryptPasswordHasher } from './infrastructure/crypto/bcrypt-password-hasher';
import { UserOrmEntity } from './infrastructure/database/orm-entities/user.orm-entity';
import { TypeOrmUserRepository } from './infrastructure/repositories/typeorm-user.repository';
import { AuthController } from './presentation/controllers/auth.controller';
import { HealthController } from './presentation/controllers/health.controller';
import { JwtAuthGuard } from './presentation/guards/jwt-auth.guard';
import { LoginUseCase } from './application/use-case/login.use-case';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserOrmEntity]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_SECRET'),
        signOptions: { expiresIn: config.get<string>('JWT_EXPIRES_IN', '1d') },
      }),
    }),
  ],
  controllers: [HealthController, AuthController],
  providers: [
    { provide: UserRepository, useClass: TypeOrmUserRepository },
    { provide: PasswordHasher, useClass: BcryptPasswordHasher },
    { provide: TokenService, useClass: JwtTokenService },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    CreateUserUseCase,
    LoginUseCase,
  ],
  exports: [UserRepository, PasswordHasher, TokenService],
})
export class CoreModule {}

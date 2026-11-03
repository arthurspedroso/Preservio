import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasswordHasher } from './application/ports/password-hasher.port';
import { TokenService } from './application/ports/token-service.port';
import { GetCitizenProfileUseCase } from './application/use-case/get-citizen-profile.use-case';
import { LoginUseCase } from './application/use-case/login.use-case';
import { RegisterCitizenUseCase } from './application/use-case/register-citizen.use-case';
import { CitizenRepository } from './domain/repositories/citizen.repository';
import { UserRepository } from './domain/repositories/user.repository';
import { JwtTokenService } from './infrastructure/auth/jwt-token.service';
import { BcryptPasswordHasher } from './infrastructure/crypto/bcrypt-password-hasher';
import { CitizenOrmEntity } from './infrastructure/database/orm-entities/citizen.orm-entity';
import { UserOrmEntity } from './infrastructure/database/orm-entities/user.orm-entity';
import { TypeOrmCitizenRepository } from './infrastructure/repositories/typeorm-citizen.repository';
import { TypeOrmUserRepository } from './infrastructure/repositories/typeorm-user.repository';
import { AuthController } from './presentation/controllers/auth.controller';
import { CitizenController } from './presentation/controllers/citizen.controller';
import { HealthController } from './presentation/controllers/health.controller';
import { JwtAuthGuard } from './presentation/guards/jwt-auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserOrmEntity, CitizenOrmEntity]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_SECRET'),
        signOptions: { expiresIn: config.get<string>('JWT_EXPIRES_IN', '1d') },
      }),
    }),
  ],
  controllers: [HealthController, AuthController, CitizenController],
  providers: [
    { provide: UserRepository, useClass: TypeOrmUserRepository },
    { provide: CitizenRepository, useClass: TypeOrmCitizenRepository },
    { provide: PasswordHasher, useClass: BcryptPasswordHasher },
    { provide: TokenService, useClass: JwtTokenService },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    LoginUseCase,
    RegisterCitizenUseCase,
    GetCitizenProfileUseCase,
  ],
  exports: [UserRepository, CitizenRepository, PasswordHasher, TokenService],
})
export class CoreModule {}

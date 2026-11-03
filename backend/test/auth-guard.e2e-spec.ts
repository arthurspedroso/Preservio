import { Controller, Get, type INestApplication } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { TokenService } from '@modules/core/application/ports/token-service.port';
import { UserRole } from '@modules/core/domain/enums/user-role.enum';
import { JwtTokenService } from '@modules/core/infrastructure/auth/jwt-token.service';
import { JwtAuthGuard } from '@modules/core/presentation/guards/jwt-auth.guard';
import { type AuthenticatedUser, CurrentUser } from '@shared/decorators/current-user.decorator';
import { Public } from '@shared/decorators/public.decorator';
import { GlobalExceptionFilter } from '@shared/filters/global-exception.filter';
import request from 'supertest';

@Controller('test')
class TestController {
  @Public()
  @Get('public')
  open() {
    return { ok: true };
  }

  @Get('private')
  closed(@CurrentUser() user: AuthenticatedUser) {
    return user;
  }
}

describe('JwtAuthGuard (e2e)', () => {
  let app: INestApplication;
  let tokens: TokenService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [JwtModule.register({ secret: 'test-secret', signOptions: { expiresIn: '1h' } })],
      controllers: [TestController],
      providers: [
        { provide: TokenService, useClass: JwtTokenService },
        { provide: APP_GUARD, useClass: JwtAuthGuard },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalFilters(new GlobalExceptionFilter());
    await app.init();
    tokens = moduleRef.get(TokenService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('rota @Public responde sem token', async () => {
    await request(app.getHttpServer()).get('/api/test/public').expect(200);
  });

  it('rota protegida sem token -> 401', async () => {
    const res = await request(app.getHttpServer()).get('/api/test/private').expect(401);
    expect(res.body.message).toBe('Token não informado');
  });

  it('rota protegida com token adulterado -> 401', async () => {
    const token = await tokens.sign({ sub: 'user-1', role: UserRole.Citizen });
    const tampered = `${token.slice(0, -2)}xx`;

    await request(app.getHttpServer())
      .get('/api/test/private')
      .set('Authorization', `Bearer ${tampered}`)
      .expect(401);
  });

  it('rota protegida com token válido -> 200 e usuário injetado', async () => {
    const token = await tokens.sign({ sub: 'user-1', role: UserRole.Citizen });

    const res = await request(app.getHttpServer())
      .get('/api/test/private')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(res.body).toEqual({ userId: 'user-1', role: UserRole.Citizen });
  });
});

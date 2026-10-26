import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { type AuthenticatedUser, CurrentUser } from '@shared/decorators/current-user.decorator';
import { Public } from '@shared/decorators/public.decorator';
import { LoginDto, LoginResponseDto } from '../../application/dtos/login.dto';
import { LoginUseCase } from '../../application/use-case/login.use-case';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly loginUser: LoginUseCase) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: LoginResponseDto })
  @ApiUnauthorizedResponse({ description: 'Email ou senha inválidos' })
  login(@Body() dto: LoginDto): Promise<LoginResponseDto> {
    return this.loginUser.execute(dto);
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Usuário autenticado pelo token' })
  @ApiUnauthorizedResponse({ description: 'Token ausente, inválido ou expirado' })
  me(@CurrentUser() user: AuthenticatedUser): AuthenticatedUser {
    return user;
  }
}

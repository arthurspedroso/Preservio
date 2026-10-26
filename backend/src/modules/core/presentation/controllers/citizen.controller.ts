import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { type AuthenticatedUser, CurrentUser } from '@shared/decorators/current-user.decorator';
import { Public } from '@shared/decorators/public.decorator';
import { CitizenResponseDto, RegisterCitizenDto } from '../../application/dtos/citizen.dto';
import { GetCitizenProfileUseCase } from '../../application/use-case/get-citizen-profile.use-case';
import { RegisterCitizenUseCase } from '../../application/use-case/register-citizen.use-case';

@ApiTags('Citizens')
@Controller('citizens')
export class CitizenController {
  constructor(
    private readonly registerCitizen: RegisterCitizenUseCase,
    private readonly getCitizenProfile: GetCitizenProfileUseCase,
  ) {}

  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: CitizenResponseDto })
  @ApiConflictResponse({ description: 'Email ou CPF já cadastrado' })
  @ApiUnprocessableEntityResponse({ description: 'CPF inválido' })
  async register(@Body() dto: RegisterCitizenDto): Promise<CitizenResponseDto> {
    return CitizenResponseDto.fromDomain(await this.registerCitizen.execute(dto));
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOkResponse({ type: CitizenResponseDto })
  @ApiNotFoundResponse({ description: 'O usuário logado não é um cidadão' })
  async me(@CurrentUser() user: AuthenticatedUser): Promise<CitizenResponseDto> {
    return CitizenResponseDto.fromDomain(await this.getCitizenProfile.execute(user.userId));
  }
}

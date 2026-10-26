import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import type { CitizenProfile } from '../use-case/register-citizen.use-case';

export class RegisterCitizenDto {
  @ApiProperty({ example: 'Maria Souza' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;

  @ApiProperty({ example: 'maria@preservio.dev' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
  @IsEmail()
  @MaxLength(255)
  email!: string;

  @ApiProperty({ example: 'senhaForte123', minLength: 8, maxLength: 72 })
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  password!: string;

  @ApiProperty({ example: '529.982.247-25', description: 'Com ou sem pontuação' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(14)
  cpf!: string;

  @ApiPropertyOptional({ example: '(11) 98765-4321' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;
}

export class CitizenResponseDto {
  @ApiProperty({ example: 'b3f1c2d4-...' })
  id!: string;

  @ApiProperty({ example: 'Maria Souza' })
  name!: string;

  @ApiProperty({ example: 'maria@preservio.dev' })
  email!: string;

  @ApiProperty({ example: '52998224725' })
  cpf!: string;

  @ApiProperty({ example: '11987654321', nullable: true, type: String })
  phone!: string | null;

  static fromDomain({ user, citizen }: CitizenProfile): CitizenResponseDto {
    return {
      id: citizen.id,
      name: user.name,
      email: user.email,
      cpf: citizen.cpf,
      phone: citizen.phone,
    };
  }
}

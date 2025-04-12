import { IsString, IsOptional, IsEmail, MinLength, MaxLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'João da Silva',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Nome deve ser uma string' })
  @MinLength(3, { message: 'Nome deve ter no mínimo 3 caracteres' })
  @MaxLength(100, { message: 'Nome deve ter no máximo 100 caracteres' })
  name?: string;

  @ApiProperty({
    description: 'Email do usuário',
    example: 'usuario@exemplo.com',
    required: false,
  })
  @IsOptional()
  @IsEmail({}, { message: 'Email inválido' })
  email?: string;

  @ApiProperty({
    description: 'Senha atual do usuário',
    example: 'Senha@123',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Senha atual deve ser uma string' })
  @MinLength(8, { message: 'Senha atual deve ter no mínimo 8 caracteres' })
  currentPassword?: string;

  @ApiProperty({
    description: 'Nova senha do usuário',
    example: 'NovaSenha@123',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Nova senha deve ser uma string' })
  @MinLength(8, { message: 'Nova senha deve ter no mínimo 8 caracteres' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Nova senha deve conter letras maiúsculas, minúsculas, números e caracteres especiais',
  })
  newPassword?: string;

  @ApiProperty({
    description: 'Telefone do usuário',
    example: '+5511999999999',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Telefone deve ser uma string' })
  @Matches(/^\+[1-9]\d{1,14}$/, {
    message: 'Telefone deve estar no formato internacional (E.164)',
  })
  phone?: string;
} 
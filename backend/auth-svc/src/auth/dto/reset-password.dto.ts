import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({
    description: 'Token de recuperação de senha',
    example: 'abc123def456',
  })
  @IsString({ message: 'Token deve ser uma string' })
  @IsNotEmpty({ message: 'Token é obrigatório' })
  token: string;

  @ApiProperty({
    description: 'Nova senha do usuário',
    example: 'NovaSenha@123',
    minLength: 8,
  })
  @IsString({ message: 'Nova senha deve ser uma string' })
  @MinLength(8, { message: 'Nova senha deve ter no mínimo 8 caracteres' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Nova senha deve conter letras maiúsculas, minúsculas, números e caracteres especiais',
  })
  @IsNotEmpty({ message: 'Nova senha é obrigatória' })
  newPassword: string;

  @ApiProperty({
    description: 'Confirmação da nova senha',
    example: 'NovaSenha@123',
  })
  @IsString({ message: 'Confirmação da nova senha deve ser uma string' })
  @IsNotEmpty({ message: 'Confirmação da nova senha é obrigatória' })
  newPasswordConfirmation: string;
} 
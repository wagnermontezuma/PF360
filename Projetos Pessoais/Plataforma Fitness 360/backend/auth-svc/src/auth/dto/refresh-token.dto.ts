import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Token de atualização (refresh token)'
  })
  @IsNotEmpty({ message: 'Refresh token é obrigatório' })
  @IsString()
  refresh_token: string;
} 
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min, Max } from 'class-validator';

export class MuteNotificationsDto {
  @ApiProperty({
    description: 'Duração do silenciamento em minutos',
    minimum: 1,
    maximum: 1440, // 24 horas
  })
  @IsInt()
  @Min(1)
  @Max(1440)
  duration: number;
} 
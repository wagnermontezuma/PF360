import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional, IsString, Matches, IsArray } from 'class-validator';
import { NotificationChannel } from '../enums/notification.enum';

export class UpdatePreferencesDto {
  @ApiProperty({ description: 'Habilitar notificações por email' })
  @IsOptional()
  @IsBoolean()
  email?: boolean;

  @ApiProperty({ description: 'Habilitar notificações push' })
  @IsOptional()
  @IsBoolean()
  push?: boolean;

  @ApiProperty({ description: 'Habilitar notificações por WhatsApp' })
  @IsOptional()
  @IsBoolean()
  whatsapp?: boolean;

  @ApiProperty({ description: 'Horário inicial permitido (HH:mm)' })
  @IsOptional()
  @IsString()
  @Matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Horário deve estar no formato HH:mm',
  })
  allowedStartTime?: string;

  @ApiProperty({ description: 'Horário final permitido (HH:mm)' })
  @IsOptional()
  @IsString()
  @Matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Horário deve estar no formato HH:mm',
  })
  allowedEndTime?: string;

  @ApiProperty({ description: 'Canais de notificação habilitados' })
  @IsOptional()
  @IsArray()
  @IsEnum(NotificationChannel, { each: true })
  channels?: NotificationChannel[];
} 
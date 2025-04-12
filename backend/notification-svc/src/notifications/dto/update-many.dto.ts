import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsBoolean, ValidateNested, ArrayNotEmpty } from 'class-validator';
import { NotificationType, NotificationChannel } from '../enums/notification.enum';

export class NotificationPreferenceDto {
  @ApiProperty({
    enum: NotificationType,
    description: 'Tipo de notificação',
    example: NotificationType.WORKOUT_REMINDER
  })
  @IsEnum(NotificationType, {})
  type: NotificationType;

  @ApiProperty({
    enum: NotificationChannel,
    isArray: true,
    description: 'Lista de canais habilitados',
    example: [NotificationChannel.PUSH, NotificationChannel.EMAIL]
  })
  @IsArray()
  @IsEnum(NotificationChannel, { each: true })
  channels: NotificationChannel[];

  @ApiProperty({
    description: 'Se o tipo de notificação está habilitado',
    example: true
  })
  @IsBoolean({})
  enabled: boolean;
}

export class UpdateManyDto {
  @ApiProperty({
    type: [NotificationPreferenceDto],
    description: 'Lista de preferências a serem atualizadas'
  })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => NotificationPreferenceDto)
  preferences: NotificationPreferenceDto[];
} 
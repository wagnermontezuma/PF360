import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsBoolean } from 'class-validator';
import { NotificationType, NotificationChannel } from '../enums/notification.enum';

export class UpdateChannelsDto {
  @ApiProperty({
    enum: NotificationType,
    description: 'Tipo de notificação a ser configurada',
    example: NotificationType.WORKOUT_REMINDER
  })
  @IsEnum(NotificationType)
  type: NotificationType;

  @ApiProperty({
    enum: NotificationChannel,
    description: 'Canal de notificação a ser configurado',
    example: NotificationChannel.PUSH
  })
  @IsEnum(NotificationChannel)
  channel: NotificationChannel;

  @ApiProperty({
    description: 'Se o canal deve ser habilitado ou desabilitado',
    example: true
  })
  @IsBoolean()
  enabled: boolean;
} 
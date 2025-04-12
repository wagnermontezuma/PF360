import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsBoolean } from 'class-validator';
import { NotificationType } from '../enums/notification.enum';

export class ToggleTypeDto {
  @ApiProperty({
    enum: NotificationType,
    description: 'Tipo de notificação a ser alternado',
    example: NotificationType.WORKOUT_REMINDER
  })
  @IsEnum(NotificationType, {})
  type: NotificationType;

  @ApiProperty({
    description: 'Se o tipo de notificação deve ser habilitado ou desabilitado',
    example: true
  })
  @IsBoolean({})
  enabled: boolean;
} 
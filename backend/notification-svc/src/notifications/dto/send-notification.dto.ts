import { IsString, IsUUID, IsEnum, IsOptional, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { NotificationType, NotificationPriority } from '../enums/notification.enum';

export class SendNotificationDto {
  @ApiProperty({
    description: 'ID do usuário que receberá a notificação',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  userId: string;

  @ApiProperty({
    description: 'Título da notificação',
    example: 'Treino Agendado',
    minLength: 3,
    maxLength: 100,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  title: string;

  @ApiProperty({
    description: 'Conteúdo da notificação',
    example: 'Seu treino está marcado para amanhã às 10h',
    minLength: 10,
    maxLength: 500,
  })
  @IsString()
  @MinLength(10)
  @MaxLength(500)
  content: string;

  @ApiProperty({
    description: 'Tipo da notificação',
    enum: NotificationType,
    example: NotificationType.TRAINING_REMINDER,
  })
  @IsEnum(NotificationType)
  type: NotificationType;

  @ApiProperty({
    description: 'Prioridade da notificação',
    enum: NotificationPriority,
    example: NotificationPriority.HIGH,
    required: false,
  })
  @IsEnum(NotificationPriority)
  @IsOptional()
  priority?: NotificationPriority = NotificationPriority.MEDIUM;

  @ApiProperty({
    description: 'Dados adicionais específicos do tipo de notificação',
    required: false,
    type: 'object',
  })
  @IsOptional()
  metadata?: Record<string, any>;
} 
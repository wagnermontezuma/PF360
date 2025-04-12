import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, IsEnum, IsOptional, IsBoolean, IsObject } from 'class-validator';

export enum NotificationType {
  SYSTEM = 'system',
  WORKOUT = 'workout',
  ASSESSMENT = 'assessment',
  PAYMENT = 'payment',
  MAINTENANCE = 'maintenance',
  ANNOUNCEMENT = 'announcement'
}

export enum NotificationPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export enum NotificationChannel {
  APP = 'app',
  EMAIL = 'email',
  SMS = 'sms',
  WHATSAPP = 'whatsapp',
  PUSH = 'push'
}

export class CreateNotificationDto {
  @ApiProperty({ description: 'ID do usuário destinatário' })
  @IsUUID('4', {})
  userId: string;

  @ApiProperty({ description: 'Tipo da notificação', enum: NotificationType })
  @IsEnum(NotificationType, {})
  type: NotificationType;

  @ApiProperty({ description: 'Título da notificação' })
  @IsString({})
  title: string;

  @ApiProperty({ description: 'Conteúdo da notificação' })
  @IsString({})
  content: string;

  @ApiProperty({ description: 'Prioridade da notificação', enum: NotificationPriority })
  @IsEnum(NotificationPriority, {})
  priority: NotificationPriority;

  @ApiProperty({ description: 'Canal de envio', enum: NotificationChannel })
  @IsEnum(NotificationChannel, {})
  channel: NotificationChannel;

  @ApiProperty({ description: 'Link de ação', required: false })
  @IsOptional()
  @IsString({})
  actionUrl?: string;

  @ApiProperty({ description: 'Dados adicionais em formato JSON', required: false })
  @IsOptional()
  @IsObject({})
  metadata?: Record<string, any>;

  @ApiProperty({ description: 'Requer confirmação de leitura' })
  @IsBoolean({})
  requiresConfirmation: boolean;

  @ApiProperty({ description: 'Notificação programada', required: false })
  @IsOptional()
  @IsString({})
  scheduledFor?: string;

  @ApiProperty({ description: 'Expirar após (em horas)', required: false })
  @IsOptional()
  @IsString({})
  expiresIn?: string;
} 
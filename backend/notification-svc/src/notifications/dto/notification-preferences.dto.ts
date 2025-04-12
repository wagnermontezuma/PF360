import { IsString, IsNotEmpty, IsEnum, IsBoolean, ValidateNested, IsArray, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

enum NotificationType {
  TREINO = 'treino',
  AVALIACAO = 'avaliacao',
  PAGAMENTO = 'pagamento',
  MANUTENCAO = 'manutencao',
  EVENTO = 'evento',
  PROMOCAO = 'promocao'
}

enum NotificationChannel {
  APP = 'app',
  EMAIL = 'email',
  SMS = 'sms',
  WHATSAPP = 'whatsapp',
  PUSH = 'push'
}

class ChannelPreferencesDto {
  @ApiProperty({
    description: 'Canal de notificação',
    enum: NotificationChannel,
    example: NotificationChannel.APP
  })
  @IsEnum(NotificationChannel, { message: 'Canal inválido' })
  channel: NotificationChannel;

  @ApiProperty({
    description: 'Canal ativo',
    example: true
  })
  @IsBoolean({ message: 'Status deve ser um booleano' })
  enabled: boolean;

  @ApiProperty({
    description: 'Silenciar notificações',
    example: false
  })
  @IsBoolean({ message: 'Silenciar deve ser um booleano' })
  muted: boolean;

  @ApiProperty({
    description: 'Horário inicial para notificações (HH:mm)',
    example: '08:00',
    required: false
  })
  @IsString({ message: 'Horário inicial deve ser uma string' })
  @IsOptional()
  quietHoursStart?: string;

  @ApiProperty({
    description: 'Horário final para notificações (HH:mm)',
    example: '22:00',
    required: false
  })
  @IsString({ message: 'Horário final deve ser uma string' })
  @IsOptional()
  quietHoursEnd?: string;
}

class TypePreferencesDto {
  @ApiProperty({
    description: 'Tipo de notificação',
    enum: NotificationType,
    example: NotificationType.TREINO
  })
  @IsEnum(NotificationType, { message: 'Tipo inválido' })
  type: NotificationType;

  @ApiProperty({
    description: 'Tipo ativo',
    example: true
  })
  @IsBoolean({ message: 'Status deve ser um booleano' })
  enabled: boolean;

  @ApiProperty({
    description: 'Canais permitidos para este tipo',
    type: [String],
    enum: NotificationChannel,
    example: [NotificationChannel.APP, NotificationChannel.PUSH]
  })
  @IsArray({ message: 'Canais deve ser um array' })
  @IsEnum(NotificationChannel, { each: true, message: 'Canal inválido' })
  allowedChannels: NotificationChannel[];
}

export class NotificationPreferencesDto {
  @ApiProperty({
    description: 'ID do aluno',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsString({ message: 'ID do aluno deve ser uma string' })
  @IsNotEmpty({ message: 'ID do aluno é obrigatório' })
  studentId: string;

  @ApiProperty({
    description: 'Notificações globalmente ativas',
    example: true
  })
  @IsBoolean({ message: 'Status global deve ser um booleano' })
  globalEnabled: boolean;

  @ApiProperty({
    description: 'Preferências por canal',
    type: [ChannelPreferencesDto]
  })
  @ValidateNested({ each: true })
  @Type(() => ChannelPreferencesDto)
  channelPreferences: ChannelPreferencesDto[];

  @ApiProperty({
    description: 'Preferências por tipo',
    type: [TypePreferencesDto]
  })
  @ValidateNested({ each: true })
  @Type(() => TypePreferencesDto)
  typePreferences: TypePreferencesDto[];

  @ApiProperty({
    description: 'Token para notificações push',
    example: 'fcm-token-123',
    required: false
  })
  @IsString({ message: 'Token deve ser uma string' })
  @IsOptional()
  pushToken?: string;

  @ApiProperty({
    description: 'Número do WhatsApp',
    example: '+5511999999999',
    required: false
  })
  @IsString({ message: 'Número deve ser uma string' })
  @IsOptional()
  whatsappNumber?: string;
} 
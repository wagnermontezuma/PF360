import { IsString, IsNotEmpty, IsEnum, IsDate, IsOptional, IsBoolean, ValidateNested, IsArray, ArrayMinSize, IsUrl } from 'class-validator';
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

enum NotificationPriority {
  BAIXA = 'baixa',
  MEDIA = 'media',
  ALTA = 'alta',
  URGENTE = 'urgente'
}

enum NotificationChannel {
  APP = 'app',
  EMAIL = 'email',
  SMS = 'sms',
  WHATSAPP = 'whatsapp',
  PUSH = 'push'
}

class NotificationContentDto {
  @ApiProperty({
    description: 'Título da notificação',
    example: 'Lembrete de Treino'
  })
  @IsString({ message: 'Título deve ser uma string' })
  @IsNotEmpty({ message: 'Título é obrigatório' })
  title: string;

  @ApiProperty({
    description: 'Corpo da mensagem',
    example: 'Seu treino de hoje está agendado para às 15h'
  })
  @IsString({ message: 'Mensagem deve ser uma string' })
  @IsNotEmpty({ message: 'Mensagem é obrigatória' })
  message: string;

  @ApiProperty({
    description: 'URL da imagem (opcional)',
    example: 'https://exemplo.com/imagem.jpg',
    required: false
  })
  @IsUrl({}, { message: 'URL da imagem inválida' })
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({
    description: 'URL de redirecionamento (opcional)',
    example: 'https://app.exemplo.com/treinos/123',
    required: false
  })
  @IsUrl({}, { message: 'URL de redirecionamento inválida' })
  @IsOptional()
  actionUrl?: string;
}

class NotificationScheduleDto {
  @ApiProperty({
    description: 'Data/hora de envio',
    example: '2024-03-15T15:00:00Z'
  })
  @Type(() => Date)
  @IsDate({ message: 'Data de envio inválida' })
  @IsNotEmpty({ message: 'Data de envio é obrigatória' })
  sendAt: Date;

  @ApiProperty({
    description: 'Expirar após (em horas)',
    example: 24,
    required: false
  })
  @IsOptional()
  expireAfterHours?: number;

  @ApiProperty({
    description: 'Tentar reenviar se falhar',
    example: true,
    required: false
  })
  @IsBoolean({ message: 'Reenvio deve ser um booleano' })
  @IsOptional()
  retryOnFailure?: boolean;
}

export class CreateStudentNotificationDto {
  @ApiProperty({
    description: 'ID do aluno',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsString({ message: 'ID do aluno deve ser uma string' })
  @IsNotEmpty({ message: 'ID do aluno é obrigatório' })
  studentId: string;

  @ApiProperty({
    description: 'Tipo da notificação',
    enum: NotificationType,
    example: NotificationType.TREINO
  })
  @IsEnum(NotificationType, { message: 'Tipo de notificação inválido' })
  type: NotificationType;

  @ApiProperty({
    description: 'Prioridade da notificação',
    enum: NotificationPriority,
    example: NotificationPriority.MEDIA
  })
  @IsEnum(NotificationPriority, { message: 'Prioridade inválida' })
  priority: NotificationPriority;

  @ApiProperty({
    description: 'Canais de envio',
    type: [String],
    enum: NotificationChannel,
    example: [NotificationChannel.APP, NotificationChannel.PUSH]
  })
  @IsArray({ message: 'Canais deve ser um array' })
  @ArrayMinSize(1, { message: 'Selecione pelo menos um canal' })
  @IsEnum(NotificationChannel, { each: true, message: 'Canal inválido' })
  channels: NotificationChannel[];

  @ApiProperty({
    description: 'Conteúdo da notificação',
    type: NotificationContentDto
  })
  @ValidateNested()
  @Type(() => NotificationContentDto)
  content: NotificationContentDto;

  @ApiProperty({
    description: 'Agendamento da notificação',
    type: NotificationScheduleDto
  })
  @ValidateNested()
  @Type(() => NotificationScheduleDto)
  schedule: NotificationScheduleDto;

  @ApiProperty({
    description: 'Dados adicionais em formato JSON',
    example: { workoutId: '123', instructorName: 'João' },
    required: false
  })
  @IsOptional()
  metadata?: Record<string, any>;
} 
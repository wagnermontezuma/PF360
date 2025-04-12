import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, IsEnum, IsDateString, IsOptional, IsNumber, Min, IsArray } from 'class-validator';

export enum AppointmentType {
  PERSONAL_TRAINING = 'personal_training',
  GROUP_CLASS = 'group_class',
  ASSESSMENT = 'assessment',
  PHYSIOTHERAPY = 'physiotherapy',
  NUTRITION = 'nutrition'
}

export enum AppointmentStatus {
  SCHEDULED = 'scheduled',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
  NO_SHOW = 'no_show'
}

export class CreateAppointmentDto {
  @ApiProperty({ description: 'ID do aluno' })
  @IsUUID('4', {})
  studentId: string;

  @ApiProperty({ description: 'ID do profissional' })
  @IsUUID('4', {})
  professionalId: string;

  @ApiProperty({ description: 'Tipo do agendamento', enum: AppointmentType })
  @IsEnum(AppointmentType, {})
  type: AppointmentType;

  @ApiProperty({ description: 'Status do agendamento', enum: AppointmentStatus })
  @IsEnum(AppointmentStatus, {})
  status: AppointmentStatus;

  @ApiProperty({ description: 'Data e hora de início' })
  @IsDateString({})
  startTime: string;

  @ApiProperty({ description: 'Data e hora de término' })
  @IsDateString({})
  endTime: string;

  @ApiProperty({ description: 'ID da sala/espaço', required: false })
  @IsOptional()
  @IsUUID('4', {})
  roomId?: string;

  @ApiProperty({ description: 'IDs dos equipamentos necessários', required: false })
  @IsOptional()
  @IsArray({})
  @IsUUID('4', { each: true })
  equipmentIds?: string[];

  @ApiProperty({ description: 'Número máximo de participantes (aulas em grupo)', required: false })
  @IsOptional()
  @IsNumber({})
  @Min(1)
  maxParticipants?: number;

  @ApiProperty({ description: 'Observações', required: false })
  @IsOptional()
  @IsString({})
  notes?: string;

  @ApiProperty({ description: 'Requer confirmação prévia' })
  @IsOptional()
  @IsNumber({})
  @Min(0)
  requireConfirmationHours?: number;

  @ApiProperty({ description: 'Lembrete (horas antes)', required: false })
  @IsOptional()
  @IsNumber({})
  @Min(0)
  reminderHours?: number;
} 
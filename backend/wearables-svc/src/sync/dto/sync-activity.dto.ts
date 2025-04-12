import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, IsEnum, IsDateString, IsOptional, IsObject } from 'class-validator';
import { ActivityData } from '../../common/interfaces/activity-data.interface';

export enum SyncProvider {
  GARMIN = 'garmin',
  HEALTHKIT = 'healthkit',
  POLAR = 'polar'
}

export enum SyncStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

export class SyncActivityDto {
  @ApiProperty({ description: 'ID do usuário' })
  @IsUUID('4', {})
  userId: string;

  @ApiProperty({ description: 'Provedor dos dados', enum: SyncProvider })
  @IsEnum(SyncProvider, {})
  provider: SyncProvider;

  @ApiProperty({ description: 'Data de início do período' })
  @IsDateString({})
  startDate: string;

  @ApiProperty({ description: 'Data de fim do período' })
  @IsDateString({})
  endDate: string;

  @ApiProperty({ description: 'Token de acesso do provedor', required: false })
  @IsOptional()
  @IsString({})
  accessToken?: string;

  @ApiProperty({ description: 'Token de atualização do provedor', required: false })
  @IsOptional()
  @IsString({})
  refreshToken?: string;

  @ApiProperty({ description: 'Dados da atividade', required: false })
  @IsOptional()
  @IsObject({})
  activityData?: ActivityData;
} 
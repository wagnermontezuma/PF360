import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, IsEnum, IsOptional, IsObject } from 'class-validator';
import { SyncProvider } from '../../sync/dto/sync-activity.dto';

export class LinkDeviceDto {
  @ApiProperty({ description: 'ID do usuário' })
  @IsUUID('4', {})
  userId: string;

  @ApiProperty({ description: 'Provedor do dispositivo', enum: SyncProvider })
  @IsEnum(SyncProvider, {})
  provider: SyncProvider;

  @ApiProperty({ description: 'ID do dispositivo no provedor' })
  @IsString({})
  deviceId: string;

  @ApiProperty({ description: 'Nome/modelo do dispositivo' })
  @IsString({})
  deviceModel: string;

  @ApiProperty({ description: 'Token de acesso do provedor', required: false })
  @IsOptional()
  @IsString({})
  accessToken?: string;

  @ApiProperty({ description: 'Token de atualização do provedor', required: false })
  @IsOptional()
  @IsString({})
  refreshToken?: string;

  @ApiProperty({ description: 'Configurações específicas do dispositivo', required: false })
  @IsOptional()
  @IsObject({})
  settings?: Record<string, any>;
} 
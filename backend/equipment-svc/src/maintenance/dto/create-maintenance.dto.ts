import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, IsEnum, IsNumber, IsOptional, IsDateString, Min, Max, IsArray } from 'class-validator';

export enum MaintenanceType {
  PREVENTIVE = 'preventive',
  CORRECTIVE = 'corrective',
  CALIBRATION = 'calibration'
}

export enum MaintenanceStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export class CreateMaintenanceDto {
  @ApiProperty({ description: 'ID do equipamento' })
  @IsUUID()
  equipmentId: string;

  @ApiProperty({ description: 'Tipo de manutenção', enum: MaintenanceType })
  @IsEnum(MaintenanceType)
  type: MaintenanceType;

  @ApiProperty({ description: 'Status da manutenção', enum: MaintenanceStatus })
  @IsEnum(MaintenanceStatus)
  status: MaintenanceStatus;

  @ApiProperty({ description: 'Data agendada para manutenção' })
  @IsDateString()
  scheduledDate: string;

  @ApiProperty({ description: 'Descrição do problema ou serviço' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Prioridade (1-5)', minimum: 1, maximum: 5 })
  @IsNumber()
  @Min(1)
  @Max(5)
  priority: number;

  @ApiProperty({ description: 'Custo estimado em reais', minimum: 0 })
  @IsNumber()
  @Min(0)
  estimatedCost: number;

  @ApiProperty({ description: 'ID do técnico responsável' })
  @IsUUID()
  technicianId: string;

  @ApiProperty({ description: 'Lista de peças necessárias', required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  parts?: string[];

  @ApiProperty({ description: 'Observações adicionais', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
} 
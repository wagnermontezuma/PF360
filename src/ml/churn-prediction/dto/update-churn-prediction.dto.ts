import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsDateString, IsOptional } from 'class-validator';

export class UpdateChurnPredictionContactDto {
  @ApiProperty({ description: 'Data do contato com o aluno' })
  @IsDateString()
  contactDate: string;

  @ApiProperty({ description: 'Tipo de contato realizado (email, telefone, pessoal)' })
  @IsString()
  contactType: string;

  @ApiProperty({ description: 'Resultado do contato' })
  @IsString()
  contactOutcome: string;

  @ApiProperty({ description: 'Observações do contato', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateChurnPredictionRetentionDto {
  @ApiProperty({ description: 'Se o aluno foi retido com sucesso' })
  @IsBoolean()
  retained: boolean;

  @ApiProperty({ description: 'Data da confirmação da retenção/cancelamento' })
  @IsDateString()
  retentionDate: string;

  @ApiProperty({ description: 'Ações tomadas para retenção' })
  @IsString({ each: true })
  retentionActions: string[];

  @ApiProperty({ description: 'Motivo do cancelamento caso não retido', required: false })
  @IsOptional()
  @IsString()
  cancellationReason?: string;
} 
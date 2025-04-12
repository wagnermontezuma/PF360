import { IsUUID, IsNumber, IsObject, IsBoolean, IsOptional, IsDateString, IsString, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateChurnPredictionDto {
  @ApiProperty({ description: 'ID do aluno' })
  @IsUUID()
  studentId: string;

  @ApiProperty({ description: 'Probabilidade de cancelamento (0-1)', minimum: 0, maximum: 1 })
  @IsNumber()
  @Min(0)
  @Max(1)
  probability: number;

  @ApiProperty({ description: 'Principais fatores que contribuem para o risco' })
  @IsString({ each: true })
  riskFactors: string[];

  @ApiProperty({ description: 'Ações recomendadas para retenção' })
  @IsString({ each: true })
  recommendedActions: string[];

  @ApiProperty({ description: 'Observações adicionais', required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ description: 'Features usadas no modelo' })
  @IsObject()
  features: Record<string, any>;

  @ApiProperty({ description: 'Indica se o aluno é de alto risco', required: false })
  @IsBoolean()
  @IsOptional()
  isHighRisk?: boolean;

  @ApiProperty({ description: 'Indica se o aluno foi contatado', required: false })
  @IsBoolean()
  @IsOptional()
  wasContacted?: boolean;

  @ApiProperty({ description: 'Data do contato', required: false })
  @IsDateString()
  @IsOptional()
  contactDate?: Date;

  @ApiProperty({ description: 'Notas do contato', required: false })
  @IsString()
  @IsOptional()
  contactNotes?: string;

  @ApiProperty({ description: 'Resultado da retenção', required: false })
  @IsBoolean()
  @IsOptional()
  retentionOutcome?: boolean;
} 
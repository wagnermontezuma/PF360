import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, IsNumber, IsOptional, IsDateString, Min, IsArray, ValidateNested, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export enum AssessmentType {
  INITIAL = 'initial',
  PERIODIC = 'periodic',
  REEVALUATION = 'reevaluation'
}

export class MeasurementDto {
  @ApiProperty({ description: 'Local da medida (ex: braço, perna)' })
  @IsString({})
  location: string;

  @ApiProperty({ description: 'Valor da medida em centímetros' })
  @IsNumber({})
  @Min(0)
  value: number;
}

export class BodyCompositionDto {
  @ApiProperty({ description: 'Percentual de gordura corporal' })
  @IsNumber({})
  @Min(0)
  bodyFatPercentage: number;

  @ApiProperty({ description: 'Massa muscular em kg' })
  @IsNumber({})
  @Min(0)
  muscleMass: number;

  @ApiProperty({ description: 'Densidade óssea' })
  @IsNumber({})
  @Min(0)
  boneDensity: number;

  @ApiProperty({ description: 'Percentual de água corporal' })
  @IsNumber({})
  @Min(0)
  waterPercentage: number;
}

export class CreatePhysicalAssessmentDto {
  @ApiProperty({ description: 'ID do aluno' })
  @IsUUID('4', {})
  studentId: string;

  @ApiProperty({ description: 'ID do profissional' })
  @IsUUID('4', {})
  professionalId: string;

  @ApiProperty({ description: 'Tipo de avaliação', enum: AssessmentType })
  @IsEnum(AssessmentType, {})
  type: AssessmentType;

  @ApiProperty({ description: 'Data da avaliação' })
  @IsDateString({})
  assessmentDate: string;

  @ApiProperty({ description: 'Peso em kg' })
  @IsNumber({})
  @Min(0)
  weight: number;

  @ApiProperty({ description: 'Altura em cm' })
  @IsNumber({})
  @Min(0)
  height: number;

  @ApiProperty({ description: 'Medidas corporais' })
  @IsArray({})
  @ValidateNested({ each: true })
  @Type(() => MeasurementDto)
  measurements: MeasurementDto[];

  @ApiProperty({ description: 'Composição corporal' })
  @ValidateNested({})
  @Type(() => BodyCompositionDto)
  bodyComposition: BodyCompositionDto;

  @ApiProperty({ description: 'Pressão arterial (ex: 120/80)' })
  @IsString({})
  bloodPressure: string;

  @ApiProperty({ description: 'Frequência cardíaca em repouso' })
  @IsNumber({})
  @Min(0)
  restingHeartRate: number;

  @ApiProperty({ description: 'Observações', required: false })
  @IsOptional()
  @IsString({})
  notes?: string;
} 
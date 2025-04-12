import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsBoolean, IsOptional, Min, IsArray, IsEnum } from 'class-validator';

export enum PlanType {
  BASIC = 'basic',
  STANDARD = 'standard',
  PREMIUM = 'premium'
}

export enum BillingCycle {
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  SEMIANNUAL = 'semiannual',
  ANNUAL = 'annual'
}

export class CreatePlanDto {
  @ApiProperty({ description: 'Nome do plano' })
  @IsString({})
  name: string;

  @ApiProperty({ description: 'Descrição do plano' })
  @IsString({})
  description: string;

  @ApiProperty({ description: 'Tipo do plano', enum: PlanType })
  @IsEnum(PlanType, {})
  type: PlanType;

  @ApiProperty({ description: 'Preço em reais' })
  @IsNumber({})
  @Min(0)
  price: number;

  @ApiProperty({ description: 'Ciclo de cobrança', enum: BillingCycle })
  @IsEnum(BillingCycle, {})
  billingCycle: BillingCycle;

  @ApiProperty({ description: 'Número máximo de acessos por semana' })
  @IsNumber({})
  @Min(0)
  maxWeeklyAccesses: number;

  @ApiProperty({ description: 'Inclui aulas em grupo' })
  @IsBoolean({})
  includesGroupClasses: boolean;

  @ApiProperty({ description: 'Inclui personal trainer' })
  @IsBoolean({})
  includesPersonalTrainer: boolean;

  @ApiProperty({ description: 'Inclui avaliação física' })
  @IsBoolean({})
  includesPhysicalAssessment: boolean;

  @ApiProperty({ description: 'Lista de benefícios adicionais', required: false })
  @IsOptional()
  @IsArray({})
  @IsString({ each: true })
  additionalBenefits?: string[];

  @ApiProperty({ description: 'Período de fidelidade em meses', required: false })
  @IsOptional()
  @IsNumber({})
  @Min(0)
  loyaltyPeriod?: number;

  @ApiProperty({ description: 'Taxa de matrícula', required: false })
  @IsOptional()
  @IsNumber({})
  @Min(0)
  enrollmentFee?: number;
} 
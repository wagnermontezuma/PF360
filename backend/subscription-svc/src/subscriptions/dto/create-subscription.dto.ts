import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, IsNumber, IsDateString, IsEnum, IsOptional, Min } from 'class-validator';

export enum SubscriptionStatus {
  ACTIVE = 'active',
  PENDING = 'pending',
  CANCELLED = 'cancelled',
  SUSPENDED = 'suspended'
}

export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  BANK_SLIP = 'bank_slip',
  PIX = 'pix'
}

export class CreateSubscriptionDto {
  @ApiProperty({ description: 'ID do aluno' })
  @IsUUID('4', {})
  studentId: string;

  @ApiProperty({ description: 'ID do plano' })
  @IsUUID('4', {})
  planId: string;

  @ApiProperty({ description: 'Data de início' })
  @IsDateString({})
  startDate: string;

  @ApiProperty({ description: 'Status da assinatura', enum: SubscriptionStatus })
  @IsEnum(SubscriptionStatus, {})
  status: SubscriptionStatus;

  @ApiProperty({ description: 'Método de pagamento', enum: PaymentMethod })
  @IsEnum(PaymentMethod, {})
  paymentMethod: PaymentMethod;

  @ApiProperty({ description: 'Dia do vencimento (1-31)' })
  @IsNumber({})
  @Min(1)
  dueDay: number;

  @ApiProperty({ description: 'Desconto aplicado em reais', required: false })
  @IsOptional()
  @IsNumber({})
  @Min(0)
  discount?: number;

  @ApiProperty({ description: 'ID do vendedor', required: false })
  @IsOptional()
  @IsUUID('4', {})
  salesPersonId?: string;

  @ApiProperty({ description: 'Código do cupom utilizado', required: false })
  @IsOptional()
  @IsString({})
  couponCode?: string;

  @ApiProperty({ description: 'Observações', required: false })
  @IsOptional()
  @IsString({})
  notes?: string;
} 
import { Field, InputType, ID, Float } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID, IsNumber, IsString, IsDateString, Min } from 'class-validator';
import { Transform } from 'class-transformer';

@InputType()
export class CreateInvoiceInput {
  @Field(() => ID)
  @IsUUID()
  @IsNotEmpty({ message: 'ID do membro é obrigatório' })
  memberId: string;

  @Field(() => ID)
  @IsUUID()
  @IsNotEmpty({ message: 'ID do contrato é obrigatório' })
  contractId: string;

  @Field(() => Float)
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Valor deve ter no máximo 2 casas decimais' })
  @Min(0.01, { message: 'Valor deve ser maior que zero' })
  amount: number;

  @Field()
  @IsString()
  @IsNotEmpty({ message: 'Descrição é obrigatória' })
  description: string;

  @Field()
  @IsDateString()
  @IsNotEmpty({ message: 'Data de vencimento é obrigatória' })
  dueDate: string;
}

@InputType()
export class ProcessPaymentInput {
  @Field(() => ID)
  @IsUUID()
  @IsNotEmpty({ message: 'ID da fatura é obrigatório' })
  invoiceId: string;

  @Field(() => ID)
  @IsUUID()
  @IsNotEmpty({ message: 'ID do método de pagamento é obrigatório' })
  paymentMethodId: string;
} 
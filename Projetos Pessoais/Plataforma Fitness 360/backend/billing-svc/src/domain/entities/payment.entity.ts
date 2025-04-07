import { Entity, Column } from 'typeorm';
import { ObjectType, Field, Float, registerEnumType } from '@nestjs/graphql';
import { BaseEntity } from './base.entity';

export enum PaymentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}

export enum PaymentMethod {
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  PIX = 'PIX',
  BOLETO = 'BOLETO'
}

registerEnumType(PaymentStatus, {
  name: 'PaymentStatus',
});

registerEnumType(PaymentMethod, {
  name: 'PaymentMethod',
});

@Entity('payments')
@ObjectType()
export class Payment extends BaseEntity {
  @Field()
  @Column()
  invoiceId: string;

  @Field()
  @Column()
  memberId: string;

  @Field(() => Float)
  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Field()
  @Column()
  currency: string;

  @Field(() => PaymentStatus)
  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING
  })
  status: PaymentStatus;

  @Field(() => PaymentMethod)
  @Column({
    type: 'enum',
    enum: PaymentMethod
  })
  paymentMethod: PaymentMethod;

  @Field({ nullable: true })
  @Column({ nullable: true })
  transactionId?: string;

  @Field()
  @Column()
  tenantId: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  errorMessage?: string;
} 
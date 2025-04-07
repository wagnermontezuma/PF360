import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ObjectType, Field, Float } from '@nestjs/graphql';
import { BaseEntity } from './base.entity';
import { Invoice } from './invoice.entity';
import { PaymentStatus, PaymentMethod } from './payment.entity';

@Entity('payment_attempts')
@ObjectType()
export class PaymentAttempt extends BaseEntity {
  @Field()
  @Column()
  invoiceId: string;

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
  @Column({ name: 'stripe_payment_intent_id', nullable: true })
  stripePaymentIntentId?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  transactionId?: string;

  @Field({ nullable: true })
  @Column({ type: 'jsonb', nullable: true })
  errorDetails?: {
    code: string;
    message: string;
    declinedCode?: string;
  };

  @Field()
  @Column({ name: 'tenant_id' })
  tenantId: string;

  @Field()
  @Column({ name: 'idempotency_key', unique: true })
  idempotencyKey: string;

  @ManyToOne(() => Invoice, invoice => invoice.paymentAttempts)
  @JoinColumn({ name: 'invoice_id' })
  invoice: Invoice;
} 
import { Entity, Column, OneToMany } from 'typeorm';
import { ObjectType, Field, Float, registerEnumType } from '@nestjs/graphql';
import { BaseEntity } from './base.entity';
import { PaymentAttempt } from './payment-attempt.entity';

export enum InvoiceStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED'
}

registerEnumType(InvoiceStatus, {
  name: 'InvoiceStatus',
});

@Entity('invoices')
@ObjectType()
export class Invoice extends BaseEntity {
  @Field()
  @Column({ name: 'member_id' })
  memberId: string;

  @Field()
  @Column({ name: 'contract_id' })
  contractId: string;

  @Field(() => Float)
  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Field()
  @Column()
  description: string;

  @Field(() => InvoiceStatus)
  @Column({ type: 'enum', enum: InvoiceStatus, default: InvoiceStatus.PENDING })
  status: InvoiceStatus;

  @Field()
  @Column({ name: 'due_date' })
  dueDate: Date;

  @Field({ nullable: true })
  @Column({ name: 'stripe_invoice_id', nullable: true })
  stripeInvoiceId?: string;

  @Field(() => [PaymentAttempt], { nullable: true })
  @OneToMany(() => PaymentAttempt, attempt => attempt.invoice)
  paymentAttempts?: PaymentAttempt[];

  @Field()
  @Column({ name: 'tenant_id' })
  tenantId: string;
} 
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { Payment } from './payment.entity';

export enum InvoiceStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

@Entity()
@ObjectType()
export class Invoice {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field()
  memberId: string;

  @Column()
  @Field()
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  @Field(() => Float)
  amount: number;

  @Column()
  @Field()
  dueDate: Date;

  @Column({
    type: 'enum',
    enum: InvoiceStatus,
    default: InvoiceStatus.PENDING,
  })
  @Field()
  status: InvoiceStatus;

  @OneToMany(() => Payment, payment => payment.invoice)
  @Field(() => [Payment])
  payments: Payment[];

  @Column()
  @Field()
  tenantId: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @Field()
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  @Field()
  updatedAt: Date;
} 
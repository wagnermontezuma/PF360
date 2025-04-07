import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ObjectType, Field, Float } from '@nestjs/graphql';
import { BaseEntity } from './base.entity';
import { Member } from './member.entity';

export enum ContractStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED'
}

@Entity('contracts')
@ObjectType()
export class Contract extends BaseEntity {
  @Field()
  @Column()
  planType: string;

  @Field(() => Float)
  @Column('decimal', { precision: 10, scale: 2 })
  value: number;

  @Field()
  @Column()
  startDate: Date;

  @Field()
  @Column()
  endDate: Date;

  @Field()
  @Column()
  tenantId: string;

  @Field(() => ContractStatus)
  @Column({ type: 'enum', enum: ContractStatus, default: ContractStatus.PENDING })
  status: ContractStatus;

  @Field(() => Member)
  @ManyToOne(() => Member, member => member.contracts)
  @JoinColumn({ name: 'member_id' })
  member: Member;
} 
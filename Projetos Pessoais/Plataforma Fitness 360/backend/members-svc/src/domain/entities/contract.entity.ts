import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Member } from './member.entity';

@Entity()
@ObjectType()
export class Contract {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field()
  planType: string;

  @Column()
  @Field()
  startDate: Date;

  @Column()
  @Field()
  endDate: Date;

  @Column()
  @Field()
  value: number;

  @Column()
  @Field()
  status: string;

  @ManyToOne(() => Member, member => member.contracts)
  @Field(() => Member)
  member: Member;

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
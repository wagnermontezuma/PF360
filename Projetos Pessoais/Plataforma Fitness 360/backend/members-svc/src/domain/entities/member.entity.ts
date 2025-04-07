import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { BaseEntity } from './base.entity';
import { Contract } from './contract.entity';

@Entity('members')
@ObjectType()
export class Member extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column({ unique: true })
  email: string;

  @Field()
  @Column({ unique: true })
  cpf: string;

  @Field()
  @Column()
  phone: string;

  @Field(() => Address)
  @Column('jsonb')
  address: Address;

  @Field()
  @Column()
  tenantId: string;

  @Field(() => [Contract])
  @OneToMany(() => Contract, contract => contract.member)
  contracts: Contract[];

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}

@ObjectType()
export class Address {
  @Field()
  street: string;

  @Field()
  number: string;

  @Field({ nullable: true })
  complement?: string;

  @Field()
  city: string;

  @Field()
  state: string;

  @Field()
  zipCode: string;
} 
import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, Length, IsDate, IsNumber } from 'class-validator';

@InputType()
export class AddressInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  street: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  number: string;

  @Field({ nullable: true })
  @IsString()
  complement?: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  city: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  state: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  zipCode: string;
}

@InputType()
export class CreateMemberInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  cpf: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  phone: string;

  @Field(() => AddressInput)
  address: AddressInput;

  @Field()
  @IsString()
  @IsNotEmpty()
  tenantId: string;
}

@InputType()
export class UpdateMemberInput {
  @Field({ nullable: true })
  @IsString()
  name?: string;

  @Field({ nullable: true })
  @IsEmail()
  email?: string;

  @Field({ nullable: true })
  @IsString()
  phone?: string;

  @Field(() => AddressInput, { nullable: true })
  address?: AddressInput;
}

@InputType()
export class CreateContractInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  memberId: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  planType: string;

  @Field()
  @IsNumber()
  @IsNotEmpty()
  value: number;

  @Field()
  @IsDate()
  @IsNotEmpty()
  startDate: Date;

  @Field()
  @IsDate()
  @IsNotEmpty()
  endDate: Date;
} 
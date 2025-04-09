import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateMemberInput {
  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  cpf: string;

  @Field()
  phone: string;

  @Field()
  address: string;

  @Field()
  tenantId: string;
}

@InputType()
export class UpdateMemberInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  address?: string;
} 
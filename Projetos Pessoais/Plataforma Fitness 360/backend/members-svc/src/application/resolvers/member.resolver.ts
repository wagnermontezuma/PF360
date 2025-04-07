import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Member } from '../../domain/entities/member.entity';
import { Contract } from '../../domain/entities/contract.entity';
import { MemberService } from '../services/member.service';
import { CreateMemberInput, UpdateMemberInput, CreateContractInput } from '../dto/member.input';
import { CurrentTenant } from '../../infrastructure/decorators/current-tenant.decorator';

@Resolver(() => Member)
export class MemberResolver {
  constructor(private readonly memberService: MemberService) {}

  @Query(() => [Member])
  async members(@CurrentTenant() tenantId: string): Promise<Member[]> {
    return this.memberService.findAll(tenantId);
  }

  @Query(() => Member)
  async member(
    @Args('id') id: string,
    @CurrentTenant() tenantId: string
  ): Promise<Member> {
    return this.memberService.findOne(id, tenantId);
  }

  @Mutation(() => Member)
  async createMember(
    @Args('input') input: CreateMemberInput,
    @CurrentTenant() tenantId: string
  ): Promise<Member> {
    return this.memberService.createMember(input, tenantId);
  }

  @Mutation(() => Contract)
  async createContract(
    @Args('input') input: CreateContractInput,
    @CurrentTenant() tenantId: string
  ): Promise<Contract> {
    return this.memberService.createContract(input, tenantId);
  }

  @Mutation(() => Member)
  async updateMember(
    @Args('id') id: string,
    @Args('input') input: UpdateMemberInput
  ): Promise<Member> {
    return this.memberService.updateMember(id, input);
  }

  @Mutation(() => Boolean)
  async deleteMember(@Args('id') id: string): Promise<boolean> {
    return this.memberService.deleteMember(id);
  }

  @Query(() => [Contract])
  async memberContracts(@Args('memberId') memberId: string): Promise<Contract[]> {
    return this.memberService.getMemberContracts(memberId);
  }
} 
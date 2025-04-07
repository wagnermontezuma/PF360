import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { BeltService } from './belt.service';
import { AuthGuard } from '../../infrastructure/guards/auth.guard';
import { RolesGuard } from '../../infrastructure/guards/roles.guard';
import { Roles } from '../../infrastructure/decorators/roles.decorator';
import { UpdateBeltInput } from './dto/update-belt.input';
import { Belt } from './entities/belt.entity';

@Resolver()
export class BeltResolver {
  constructor(private readonly beltService: BeltService) {}

  @Mutation(() => Belt)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN', 'INSTRUCTOR')
  async updateBelt(
    @Args('input') input: UpdateBeltInput,
  ): Promise<Belt> {
    return this.beltService.updateMemberBelt(input);
  }

  @Query(() => [Belt])
  @UseGuards(AuthGuard)
  async memberBeltTimeline(
    @Args('memberId', { type: () => ID }) memberId: string,
  ): Promise<Belt[]> {
    return this.beltService.getMemberBeltTimeline(memberId);
  }
} 
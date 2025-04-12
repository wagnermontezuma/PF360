import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { EquipmentService } from './equipment.service';
import { CreateEquipmentInput } from './dto/create-equipment.input';
import { UpdateEquipmentInput } from './dto/update-equipment.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Resolver('Equipment')
@UseGuards(JwtAuthGuard)
export class EquipmentResolver {
  constructor(private readonly equipmentService: EquipmentService) {}

  @Mutation('createEquipment')
  create(
    @Args('createEquipmentInput') createEquipmentInput: CreateEquipmentInput,
  ) {
    return this.equipmentService.create(createEquipmentInput);
  }

  @Query('equipments')
  findAll() {
    return this.equipmentService.findAll();
  }

  @Query('equipment')
  findOne(@Args('id') id: string) {
    return this.equipmentService.findOne(id);
  }

  @Mutation('updateEquipment')
  update(
    @Args('updateEquipmentInput') updateEquipmentInput: UpdateEquipmentInput,
  ) {
    return this.equipmentService.update(
      updateEquipmentInput.id,
      updateEquipmentInput,
    );
  }

  @Mutation('removeEquipment')
  remove(@Args('id') id: string) {
    return this.equipmentService.remove(id);
  }
}

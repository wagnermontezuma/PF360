import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MuscleGroupsService } from './muscle-groups.service';
import { CreateMuscleGroupDto } from './dto/create-muscle-group.dto';
import { UpdateMuscleGroupDto } from './dto/update-muscle-group.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('muscle-groups')
@UseGuards(JwtAuthGuard)
export class MuscleGroupsController {
  constructor(private readonly muscleGroupsService: MuscleGroupsService) {}

  @MessagePattern('createMuscleGroup')
  create(@Payload() createMuscleGroupDto: CreateMuscleGroupDto) {
    return this.muscleGroupsService.create(createMuscleGroupDto);
  }

  @MessagePattern('findAllMuscleGroups')
  findAll() {
    return this.muscleGroupsService.findAll();
  }

  @MessagePattern('findOneMuscleGroup')
  findOne(@Payload() id: string) {
    return this.muscleGroupsService.findOne(id);
  }

  @MessagePattern('updateMuscleGroup')
  update(@Payload() updateMuscleGroupDto: UpdateMuscleGroupDto) {
    return this.muscleGroupsService.update(
      updateMuscleGroupDto.id,
      updateMuscleGroupDto,
    );
  }

  @MessagePattern('removeMuscleGroup')
  remove(@Payload() id: string) {
    return this.muscleGroupsService.remove(id);
  }
}

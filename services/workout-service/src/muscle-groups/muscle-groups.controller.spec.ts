import { Test, TestingModule } from '@nestjs/testing';
import { MuscleGroupsController } from './muscle-groups.controller';
import { MuscleGroupsService } from './muscle-groups.service';

describe('MuscleGroupsController', () => {
  let controller: MuscleGroupsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MuscleGroupsController],
      providers: [MuscleGroupsService],
    }).compile();

    controller = module.get<MuscleGroupsController>(MuscleGroupsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

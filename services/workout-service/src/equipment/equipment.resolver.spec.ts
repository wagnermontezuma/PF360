import { Test, TestingModule } from '@nestjs/testing';
import { EquipmentResolver } from './equipment.resolver';
import { EquipmentService } from './equipment.service';

describe('EquipmentResolver', () => {
  let resolver: EquipmentResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EquipmentResolver, EquipmentService],
    }).compile();

    resolver = module.get<EquipmentResolver>(EquipmentResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});

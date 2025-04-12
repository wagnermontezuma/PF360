import { Test, TestingModule } from '@nestjs/testing';
import { MetricsService } from './metrics.service';
import { Counter, Histogram } from 'prom-client';

describe('MetricsService', () => {
  let service: MetricsService;
  let mockCounter: jest.Mocked<Counter<string>>;
  let mockHistogram: jest.Mocked<Histogram<string>>;

  beforeEach(async () => {
    mockCounter = {
      inc: jest.fn(),
    } as any;

    mockHistogram = {
      observe: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MetricsService,
        {
          provide: 'resource_operations_total',
          useValue: mockCounter,
        },
        {
          provide: 'resource_operation_duration_seconds',
          useValue: mockHistogram,
        },
      ],
    }).compile();

    service = module.get<MetricsService>(MetricsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('resource operations', () => {
    it('should increment resource operation counter', () => {
      service.incrementResourceOperation('muscle_group', 'create', 'success');
      
      expect(mockCounter.inc).toHaveBeenCalledWith({
        resource_type: 'muscle_group',
        operation: 'create',
        status: 'success',
      });
    });

    it('should track resource operation duration', () => {
      jest.spyOn(Date, 'now')
        .mockReturnValueOnce(1000)
        .mockReturnValueOnce(2000);

      const startTime = service.startResourceOperation('muscle_group', 'create');
      service.endResourceOperation('muscle_group', 'create', startTime);

      expect(mockHistogram.observe).toHaveBeenCalledWith(
        { resource_type: 'muscle_group', operation: 'create' },
        1 // duration in seconds
      );
    });
  });

  describe('legacy equipment operations', () => {
    it('should use resource operations for equipment counter', () => {
      service.incrementEquipmentOperation('create', 'success');
      
      expect(mockCounter.inc).toHaveBeenCalledWith({
        resource_type: 'equipment',
        operation: 'create',
        status: 'success',
      });
    });

    it('should use resource operations for equipment duration', () => {
      jest.spyOn(Date, 'now')
        .mockReturnValueOnce(1000)
        .mockReturnValueOnce(2000);

      const startTime = service.startEquipmentOperation('create');
      service.endEquipmentOperation('create', startTime);

      expect(mockHistogram.observe).toHaveBeenCalledWith(
        { resource_type: 'equipment', operation: 'create' },
        1 // duration in seconds
      );
    });
  });
}); 
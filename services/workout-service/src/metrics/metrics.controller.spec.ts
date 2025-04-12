import { Test, TestingModule } from '@nestjs/testing';
import { MetricsController } from './metrics.controller';
import { MetricsService } from './metrics.service';
import { register, Registry, RegistryContentType } from 'prom-client';

describe('MetricsController', () => {
  let controller: MetricsController;
  let metricsService: MetricsService;

  const mockMetrics = `
# HELP resource_operations_total Total number of resource operations
# TYPE resource_operations_total counter
resource_operations_total{resource_type="muscle_group",operation="create",status="success"} 1
resource_operations_total{resource_type="muscle_group",operation="read",status="success"} 5

# HELP resource_operation_duration_seconds Duration of resource operations in seconds
# TYPE resource_operation_duration_seconds histogram
resource_operation_duration_seconds_bucket{resource_type="muscle_group",operation="create",le="0.1"} 1
resource_operation_duration_seconds_sum{resource_type="muscle_group",operation="create"} 0.05
resource_operation_duration_seconds_count{resource_type="muscle_group",operation="create"} 1
`;

  const mockContentType: RegistryContentType = 'text/plain; version=0.0.4; charset=utf-8';

  beforeEach(async () => {
    // Mock do registro do Prometheus
    jest.spyOn(register, 'metrics').mockResolvedValue(mockMetrics);
    jest.spyOn(register as Registry<RegistryContentType>, 'contentType').mockReturnValue(mockContentType);

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MetricsController],
      providers: [
        {
          provide: MetricsService,
          useValue: {
            // Métodos do serviço que podem ser necessários
          },
        },
      ],
    }).compile();

    controller = module.get<MetricsController>(MetricsController);
    metricsService = module.get<MetricsService>(MetricsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getMetrics', () => {
    it('should return prometheus metrics in the correct format', async () => {
      const result = await controller.getMetrics();
      
      expect(result).toBe(mockMetrics);
    });

    it('should handle errors when collecting metrics', async () => {
      const error = new Error('Failed to collect metrics');
      jest.spyOn(register, 'metrics').mockRejectedValue(error);

      await expect(controller.getMetrics()).rejects.toThrow('Failed to collect metrics');
    });
  });

  describe('getMetricsContentType', () => {
    it('should return the correct content type header', () => {
      const contentType = controller.getMetricsContentType();
      
      expect(contentType).toBe(mockContentType);
    });
  });
}); 
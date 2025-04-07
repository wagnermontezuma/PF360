import { Controller, Get, Query, UseInterceptors, CacheInterceptor } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { SearchClassesDto } from './dto/search-classes.dto';
import { PublicClass } from './interfaces/public-class.interface';
import { PrometheusService } from '../../infrastructure/metrics/prometheus.service';

@Controller('public/classes')
@UseInterceptors(CacheInterceptor)
export class ClassesController {
  constructor(
    private readonly classesService: ClassesService,
    private readonly metricsService: PrometheusService,
  ) {}

  @Get()
  async searchClasses(@Query() query: SearchClassesDto): Promise<PublicClass[]> {
    const startTime = Date.now();
    try {
      const classes = await this.classesService.searchPublicClasses(query);
      this.metricsService.recordMarketplaceLatency('search', Date.now() - startTime);
      return classes;
    } catch (error) {
      this.metricsService.incrementMarketplaceErrors('search');
      throw error;
    }
  }
} 
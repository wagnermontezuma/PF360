import { Module } from '@nestjs/common';
import { PrometheusModule, makeCounterProvider, makeHistogramProvider } from '@willsoto/nestjs-prometheus';
import { MetricsService } from './metrics.service';
import { MetricsController } from './metrics.controller';
import { EquipmentOperationsCounter, EquipmentOperationDuration } from './metrics.decorators';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    PrometheusModule.register({
      defaultMetrics: {
        enabled: true,
      },
      path: '/metrics',
    }),
    TerminusModule,
    HttpModule,
  ],
  providers: [
    MetricsService,
    EquipmentOperationsCounter,
    EquipmentOperationDuration,
    makeCounterProvider({
      name: 'resource_operations_total',
      help: 'Total number of resource operations',
      labelNames: ['resource_type', 'operation', 'status'],
    }),
    makeHistogramProvider({
      name: 'resource_operation_duration_seconds',
      help: 'Duration of resource operations in seconds',
      labelNames: ['resource_type', 'operation'],
      buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10],
    }),
  ],
  controllers: [MetricsController],
  exports: [MetricsService],
})
export class MetricsModule {} 
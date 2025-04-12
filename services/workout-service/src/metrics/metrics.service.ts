import { Injectable } from '@nestjs/common';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter, Histogram } from 'prom-client';

export type ResourceOperation = 'create' | 'read' | 'update' | 'delete';
export type OperationStatus = 'success' | 'error';
export type ResourceType = 'equipment' | 'muscle_group' | 'exercise' | 'workout';

@Injectable()
export class MetricsService {
  constructor(
    @InjectMetric('resource_operations_total')
    private resourceOperationsCounter: Counter<string>,
    @InjectMetric('resource_operation_duration_seconds')
    private resourceOperationDuration: Histogram<string>,
  ) {}

  incrementResourceOperation(
    resourceType: ResourceType,
    operation: ResourceOperation,
    status: OperationStatus,
  ): void {
    this.resourceOperationsCounter.inc({ resource_type: resourceType, operation, status });
  }

  startResourceOperation(resourceType: ResourceType, operation: ResourceOperation): number {
    return Date.now();
  }

  endResourceOperation(
    resourceType: ResourceType,
    operation: ResourceOperation,
    startTime: number,
  ): void {
    const duration = (Date.now() - startTime) / 1000;
    this.resourceOperationDuration.observe({ resource_type: resourceType, operation }, duration);
  }

  // Métodos legados para compatibilidade
  incrementEquipmentOperation(operation: ResourceOperation, status: OperationStatus): void {
    this.incrementResourceOperation('equipment', operation, status);
  }

  startEquipmentOperation(operation: ResourceOperation): number {
    return this.startResourceOperation('equipment', operation);
  }

  endEquipmentOperation(operation: ResourceOperation, startTime: number): void {
    this.endResourceOperation('equipment', operation, startTime);
  }
} 
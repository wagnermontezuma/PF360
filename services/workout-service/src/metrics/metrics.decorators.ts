import { makeCounterProvider, makeHistogramProvider } from '@willsoto/nestjs-prometheus';
import { DEFAULT_DURATION_BUCKETS } from '../utils/metrics.utils';

// Contador de operações
export const EquipmentOperationsCounter = makeCounterProvider({
  name: 'equipment_operations_total',
  help: 'Total number of equipment operations',
  labelNames: ['operation', 'status'],
});

// Histograma de duração das operações
export const EquipmentOperationDuration = makeHistogramProvider({
  name: 'equipment_operation_duration_seconds',
  help: 'Duration of equipment operations in seconds',
  labelNames: ['operation'],
  buckets: DEFAULT_DURATION_BUCKETS,
}); 
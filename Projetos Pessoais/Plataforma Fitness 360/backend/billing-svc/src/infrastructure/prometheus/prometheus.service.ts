import { Injectable } from '@nestjs/common';
import { Counter, Registry } from 'prom-client';

@Injectable()
export class PrometheusService {
  private readonly registry: Registry;
  private readonly invoiceCounter: Counter;
  private readonly paymentCounter: Counter;

  constructor() {
    this.registry = new Registry();

    this.invoiceCounter = new Counter({
      name: 'billing_invoices_total',
      help: 'Total number of invoices by status',
      labelNames: ['status'],
    });

    this.paymentCounter = new Counter({
      name: 'billing_payments_total',
      help: 'Total number of payments by status',
      labelNames: ['status'],
    });

    this.registry.registerMetric(this.invoiceCounter);
    this.registry.registerMetric(this.paymentCounter);
  }

  recordMetric(metricName: string, labels: Record<string, string> = {}): void {
    switch (metricName) {
      case 'invoice':
        this.invoiceCounter.inc(labels);
        break;
      case 'payment':
        this.paymentCounter.inc(labels);
        break;
      default:
        console.warn(`Metric ${metricName} not found`);
    }
  }

  getMetrics(): Promise<string> {
    return this.registry.metrics();
  }
} 
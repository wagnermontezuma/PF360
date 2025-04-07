import { Injectable } from '@nestjs/common';
import { Counter, Histogram } from 'prom-client';

@Injectable()
export class PrometheusService {
  private readonly stripeLatencyHistogram: Histogram;
  private readonly stripeErrorsCounter: Counter;
  private readonly invoicesCreatedCounter: Counter;
  private readonly paymentsProcessedCounter: Counter;
  private readonly paymentErrorsCounter: Counter;

  constructor() {
    this.stripeLatencyHistogram = new Histogram({
      name: 'stripe_request_latency',
      help: 'Latência das requisições ao Stripe em segundos',
      labelNames: ['operation'],
      buckets: [0.1, 0.5, 1, 2, 5],
    });

    this.stripeErrorsCounter = new Counter({
      name: 'stripe_errors_total',
      help: 'Total de erros nas requisições ao Stripe',
      labelNames: ['operation'],
    });

    this.invoicesCreatedCounter = new Counter({
      name: 'invoices_created_total',
      help: 'Total de faturas criadas',
    });

    this.paymentsProcessedCounter = new Counter({
      name: 'payments_processed_total',
      help: 'Total de pagamentos processados',
    });

    this.paymentErrorsCounter = new Counter({
      name: 'payment_errors_total',
      help: 'Total de erros no processamento de pagamentos',
    });
  }

  recordStripeLatency(operation: string, latencyMs: number): void {
    this.stripeLatencyHistogram.labels(operation).observe(latencyMs / 1000);
  }

  incrementStripeErrors(operation: string): void {
    this.stripeErrorsCounter.labels(operation).inc();
  }

  incrementInvoicesCreated(): void {
    this.invoicesCreatedCounter.inc();
  }

  incrementPaymentsProcessed(): void {
    this.paymentsProcessedCounter.inc();
  }

  incrementPaymentErrors(): void {
    this.paymentErrorsCounter.inc();
  }
} 
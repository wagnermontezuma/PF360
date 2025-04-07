import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillingService } from './billing.service';
import { BillingResolver } from './billing.resolver';
import { Invoice } from './entities/invoice.entity';
import { PaymentAttempt } from './entities/payment-attempt.entity';
import { PrometheusModule } from '../../infrastructure/metrics/prometheus.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Invoice, PaymentAttempt]),
    PrometheusModule,
  ],
  providers: [BillingService, BillingResolver],
  exports: [BillingService],
})
export class BillingModule {} 
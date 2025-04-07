import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from '../../domain/entities/payment.entity';
import { PaymentAttempt } from '../../domain/entities/payment-attempt.entity';
import { Invoice } from '../../domain/entities/invoice.entity';
import { StripeService } from './stripe.service';
import { PaymentsService } from './payments.service';
import { PaymentsResolver } from './payments.resolver';
import { PrometheusModule } from '../../infrastructure/metrics/prometheus.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment, PaymentAttempt, Invoice]),
    PrometheusModule,
  ],
  providers: [StripeService, PaymentsService, PaymentsResolver],
  exports: [PaymentsService],
})
export class PaymentsModule {} 
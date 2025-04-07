import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentStatus, PaymentMethod } from '../../domain/entities/payment.entity';
import { PaymentAttempt } from '../../domain/entities/payment-attempt.entity';
import { Invoice } from '../../domain/entities/invoice.entity';
import { StripeService } from './stripe.service';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(PaymentAttempt)
    private paymentAttemptRepository: Repository<PaymentAttempt>,
    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,
    private stripeService: StripeService,
  ) {}

  async createPayment(data: {
    invoiceId: string;
    memberId: string;
    amount: number;
    currency: string;
    paymentMethod: PaymentMethod;
    tenantId: string;
  }): Promise<Payment> {
    const payment = this.paymentRepository.create({
      ...data,
      status: PaymentStatus.PENDING,
    });

    try {
      const stripePayment = await this.stripeService.processPayment({
        amount: data.amount,
        currency: data.currency,
        paymentMethod: data.paymentMethod,
      });

      payment.transactionId = stripePayment.id;
      payment.status = this.mapStripeStatus(stripePayment.status);

      return this.paymentRepository.save(payment);
    } catch (error) {
      this.logger.error(`Erro ao processar pagamento: ${error.message}`, error.stack);
      payment.status = PaymentStatus.FAILED;
      payment.errorMessage = error.message;
      return this.paymentRepository.save(payment);
    }
  }

  async getPaymentById(id: string): Promise<Payment> {
    return this.paymentRepository.findOne({ where: { id } });
  }

  async getPaymentsByMemberId(memberId: string): Promise<Payment[]> {
    return this.paymentRepository.find({ where: { memberId } });
  }

  async getPaymentsByInvoiceId(invoiceId: string): Promise<Payment[]> {
    return this.paymentRepository.find({ where: { invoiceId } });
  }

  private mapStripeStatus(stripeStatus: string): PaymentStatus {
    const statusMap = {
      'succeeded': PaymentStatus.COMPLETED,
      'processing': PaymentStatus.PROCESSING,
      'requires_payment_method': PaymentStatus.PENDING,
      'requires_confirmation': PaymentStatus.PENDING,
      'requires_action': PaymentStatus.PENDING,
      'canceled': PaymentStatus.FAILED,
    };

    return statusMap[stripeStatus] || PaymentStatus.PENDING;
  }
} 
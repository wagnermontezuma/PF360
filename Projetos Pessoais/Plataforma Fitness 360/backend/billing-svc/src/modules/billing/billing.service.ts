import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice, InvoiceStatus } from '../../domain/entities/invoice.entity';
import { PaymentAttempt } from '../../domain/entities/payment-attempt.entity';
import { Payment, PaymentMethod, PaymentStatus } from '../../domain/entities/payment.entity';
import { PaymentsService } from '../payments/payments.service';
import { KafkaService } from '../../infrastructure/messaging/kafka.service';
import { PrometheusService } from '../../infrastructure/metrics/prometheus.service';

@Injectable()
export class BillingService {
  private readonly logger = new Logger(BillingService.name);

  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
    @InjectRepository(PaymentAttempt)
    private readonly paymentAttemptRepository: Repository<PaymentAttempt>,
    private readonly paymentsService: PaymentsService,
    private readonly kafkaService: KafkaService,
    private readonly metricsService: PrometheusService,
  ) {}

  async createInvoice(data: {
    memberId: string;
    contractId: string;
    amount: number;
    description: string;
    dueDate: Date;
    tenantId: string;
  }): Promise<Invoice> {
    const invoice = this.invoiceRepository.create({
      ...data,
      status: InvoiceStatus.PENDING,
    });

    try {
      const savedInvoice = await this.invoiceRepository.save(invoice);
      await this.kafkaService.emit('invoice.created', savedInvoice);
      return savedInvoice;
    } catch (error) {
      this.logger.error(`Erro ao criar fatura: ${error.message}`, error.stack);
      throw error;
    }
  }

  async processPayment(invoiceId: string, paymentMethodId: string): Promise<PaymentAttempt> {
    const invoice = await this.getInvoiceById(invoiceId);

    if (invoice.status === InvoiceStatus.PAID) {
      throw new Error('Fatura já está paga');
    }

    if (invoice.status === InvoiceStatus.CANCELLED) {
      throw new Error('Fatura está cancelada');
    }

    const paymentAttempt = this.paymentAttemptRepository.create({
      invoice,
      paymentMethod: PaymentMethod.CREDIT_CARD, // TODO: Mapear método de pagamento
      amount: invoice.amount,
      status: PaymentStatus.PENDING,
      tenantId: invoice.tenantId,
    });

    try {
      const savedAttempt = await this.paymentAttemptRepository.save(paymentAttempt);

      const payment = await this.paymentsService.createPayment({
        invoiceId,
        memberId: invoice.memberId,
        amount: invoice.amount,
        currency: 'BRL',
        paymentMethod: PaymentMethod.CREDIT_CARD, // TODO: Mapear método de pagamento
        tenantId: invoice.tenantId,
      });

      if (payment.status === PaymentStatus.COMPLETED) {
        invoice.status = InvoiceStatus.PAID;
        await this.invoiceRepository.save(invoice);
        await this.kafkaService.emit('payment.succeeded', { invoiceId, payment });
      }

      return savedAttempt;
    } catch (error) {
      this.logger.error(`Erro ao processar pagamento: ${error.message}`, error.stack);
      throw error;
    }
  }

  async handlePaymentSuccess(paymentId: string): Promise<void> {
    const payment = await this.paymentsService.getPaymentById(paymentId);
    if (!payment) {
      throw new Error('Pagamento não encontrado');
    }

    const invoice = await this.getInvoiceById(payment.invoiceId);
    invoice.status = InvoiceStatus.PAID;
    await this.invoiceRepository.save(invoice);
    await this.kafkaService.emit('payment.succeeded', { invoiceId: invoice.id, payment });
  }

  async handlePaymentFailure(paymentId: string, error: any): Promise<void> {
    const payment = await this.paymentsService.getPaymentById(paymentId);
    if (!payment) {
      throw new Error('Pagamento não encontrado');
    }

    const invoice = await this.getInvoiceById(payment.invoiceId);
    await this.kafkaService.emit('payment.failed', {
      invoiceId: invoice.id,
      payment,
      error,
    });
  }

  async cancelInvoice(id: string): Promise<Invoice> {
    const invoice = await this.getInvoiceById(id);

    if (invoice.status === InvoiceStatus.PAID) {
      throw new Error('Não é possível cancelar uma fatura paga');
    }

    invoice.status = InvoiceStatus.CANCELLED;
    const savedInvoice = await this.invoiceRepository.save(invoice);
    await this.kafkaService.emit('invoice.cancelled', savedInvoice);
    return savedInvoice;
  }

  async getInvoicesByMember(memberId: string): Promise<Invoice[]> {
    return this.invoiceRepository.find({
      where: { memberId },
      relations: ['paymentAttempts'],
    });
  }

  async getInvoiceById(id: string): Promise<Invoice> {
    const invoice = await this.invoiceRepository.findOne({
      where: { id },
      relations: ['paymentAttempts'],
    });

    if (!invoice) {
      throw new Error('Fatura não encontrada');
    }

    return invoice;
  }

  async getMemberPaymentHistory(memberId: string): Promise<Payment[]> {
    return this.paymentsService.getPaymentsByMemberId(memberId);
  }
} 